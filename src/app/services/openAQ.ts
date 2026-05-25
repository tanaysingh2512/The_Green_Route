/**
 * OpenAQ v3 API client
 * Docs: https://docs.openaq.org/reference/
 * Free API key: https://explore.openaq.org/register
 *
 * Endpoints used:
 *   GET /v3/locations  — find nearest monitoring stations
 *   GET /v3/locations/{id}/latest — get most recent measurements
 *
 * WHO 2021 Air Quality Guidelines:
 *   NO₂  annual mean: 10 µg/m³
 *   PM2.5 annual mean: 5 µg/m³  (24 h: 15 µg/m³)
 */

import { getApiKey } from './apiKeys';

const BASE_URL = 'https://api.openaq.org/v3';

// OpenAQ v3 parameter IDs (confirmed from /v3/parameters)
const PARAM_PM25 = 2;
const PARAM_NO2  = 7;

export interface AirQualityStation {
  id: number;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  pm25Ugm3:  number | null;  // µg/m³ — latest measurement
  no2Ugm3:   number | null;
  pm25Timestamp: string | null;
  no2Timestamp:  string | null;
}

export interface AirQualityResult {
  stations: AirQualityStation[];
  routeSamplePoints: number;    // how many route points were queried
  isRealData: true;
}

// ── Internal API helpers ──────────────────────────────────────────────────────

function headers(): HeadersInit {
  return { 'X-API-Key': getApiKey('openaq'), Accept: 'application/json' };
}

interface OAQLocation {
  id: number;
  name: string;
  locality: string | null;
  country: { code: string; name: string } | null;
  coordinates: { latitude: number; longitude: number };
  sensors: Array<{ id: number; parameter: { id: number; name: string } }>;
}

interface OAQLatestResponse {
  results: Array<{
    sensors: Array<{
      parameter: { id: number; name: string };
      summary: { min: number; max: number; avg: number };
      datetime: { utc: string; local: string };
      value: number;
    }>;
  }>;
}

async function fetchNearbyLocations(
  lat: number,
  lng: number,
  radiusM = 50_000
): Promise<OAQLocation[]> {
  const url =
    `${BASE_URL}/locations` +
    `?coordinates=${lat},${lng}` +
    `&radius=${radiusM}` +
    `&parameters_id=${PARAM_PM25},${PARAM_NO2}` +
    `&limit=3` +
    `&order_by=distance`;

  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`OpenAQ locations ${res.status}: ${res.statusText}`);
  const json = await res.json();
  return (json.results ?? []) as OAQLocation[];
}

async function fetchLatest(locationId: number): Promise<{
  pm25: { value: number; datetime: string } | null;
  no2:  { value: number; datetime: string } | null;
}> {
  const url = `${BASE_URL}/locations/${locationId}/latest`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) return { pm25: null, no2: null };
  const json: OAQLatestResponse = await res.json();

  let pm25: { value: number; datetime: string } | null = null;
  let no2:  { value: number; datetime: string } | null = null;

  for (const result of json.results ?? []) {
    for (const sensor of result.sensors ?? []) {
      if (sensor.parameter.id === PARAM_PM25 && pm25 === null) {
        pm25 = { value: sensor.value, datetime: sensor.datetime?.utc ?? '' };
      }
      if (sensor.parameter.id === PARAM_NO2 && no2 === null) {
        no2 = { value: sensor.value, datetime: sensor.datetime?.utc ?? '' };
      }
    }
  }

  return { pm25, no2 };
}

/**
 * Sample up to 3 evenly-spaced points along the route and query OpenAQ for
 * the nearest monitoring station at each point.
 * Returns at most 5 unique stations (deduped by id).
 */
export async function fetchAirQualityAlongRoute(
  routePoints: Array<{ lat: number; lng: number }>
): Promise<AirQualityResult> {
  const key = getApiKey('openaq');
  if (!key) throw new Error('NO_API_KEY');

  // Sample 3 points: start, middle, end
  const sampleIndices = [
    0,
    Math.floor(routePoints.length / 2),
    routePoints.length - 1,
  ].filter((i, pos, arr) => arr.indexOf(i) === pos); // dedup

  const seenIds = new Set<number>();
  const stations: AirQualityStation[] = [];

  for (const idx of sampleIndices) {
    const { lat, lng } = routePoints[idx];

    let locations: OAQLocation[] = [];
    try {
      locations = await fetchNearbyLocations(lat, lng);
    } catch {
      continue; // skip point on error
    }

    for (const loc of locations) {
      if (seenIds.has(loc.id)) continue;
      seenIds.add(loc.id);

      const latest = await fetchLatest(loc.id).catch(() => ({ pm25: null, no2: null }));

      stations.push({
        id:              loc.id,
        name:            loc.name ?? `Station ${loc.id}`,
        city:            loc.locality ?? '',
        country:         loc.country?.code ?? '',
        lat:             loc.coordinates.latitude,
        lng:             loc.coordinates.longitude,
        pm25Ugm3:        latest.pm25?.value ?? null,
        no2Ugm3:         latest.no2?.value  ?? null,
        pm25Timestamp:   latest.pm25?.datetime ?? null,
        no2Timestamp:    latest.no2?.datetime  ?? null,
      });

      if (stations.length >= 5) break;
    }

    if (stations.length >= 5) break;
  }

  return {
    stations,
    routeSamplePoints: sampleIndices.length,
    isRealData: true,
  };
}
