/**
 * Route Environmental Analysis — orchestrates all 5 data sources:
 *
 *  1. HBEFA 4.2        — vehicle emission calculation (always available)
 *  2. OpenAQ v3        — live air quality (requires API key)
 *  3. Hansen/GFW       — tree cover loss (requires API key)
 *  4. CORINE 2018      — land cover profile (always available)
 *  5. WWF Ecoregions   — ecoregion intersection (always available)
 */

import { calcEmissions, VehicleType }    from './hbefaEmissions';
import { getLandCoverForRoute }           from './corineData';
import { getEcoregionsForRoute }          from './wwfEcoregions';
import { fetchAirQualityAlongRoute }      from './openAQ';
import { fetchForestLossAlongRoute }      from './globalForestWatch';

export type { VehicleType };

export interface AnalysisStatus {
  emissions:  'done';
  landCover:  'done';
  ecoregions: 'done';
  airQuality: 'loading' | 'done' | 'no-key' | 'error';
  forestLoss: 'loading' | 'done' | 'no-key' | 'error';
}

export interface RouteAnalysisResult {
  emissions:  ReturnType<typeof calcEmissions>;
  landCover:  ReturnType<typeof getLandCoverForRoute>;
  ecoregions: ReturnType<typeof getEcoregionsForRoute>;
  airQuality: import('./openAQ').AirQualityResult | null;
  forestLoss: import('./globalForestWatch').ForestLossResult | null;
  airQualityError:  string | null;
  forestLossError:  string | null;
  status: AnalysisStatus;
}

export interface LatLng { lat: number; lng: number; }

function routeMidpoint(points: LatLng[]): LatLng {
  const mid = points[Math.floor(points.length / 2)];
  return mid ?? { lat: 0, lng: 0 };
}

function parseDistanceKm(text: string): number {
  // "1,421 km" → 1421, "456 m" → 0.456
  const clean = text.replace(/,/g, '').replace(/\s/g, '').toLowerCase();
  const num = parseFloat(clean);
  if (clean.endsWith('km')) return isNaN(num) ? 0 : num;
  if (clean.endsWith('m'))  return isNaN(num) ? 0 : num / 1000;
  return isNaN(num) ? 0 : num;
}

function parseDurationMin(text: string): number {
  // "14 hours 28 mins" or "14h 28min" or "3 hours" or "45 mins"
  let total = 0;
  const hourMatch = text.match(/(\d+)\s*h(?:our)?s?/i);
  const minMatch  = text.match(/(\d+)\s*m(?:in(?:ute)?s?)?/i);
  if (hourMatch) total += parseInt(hourMatch[1]) * 60;
  if (minMatch)  total += parseInt(minMatch[1]);
  return total || 60; // fallback 1 h
}

/**
 * Run the full analysis.
 * Sources 1, 4, 5 are synchronous and always succeed.
 * Sources 2, 3 are async and may fail if keys are absent.
 *
 * @param onUpdate  called after each async source resolves/rejects — lets UI
 *                  update incrementally without waiting for all sources.
 */
export async function analyzeRoute(
  routePoints: LatLng[],
  distanceText: string,
  durationText: string,
  vehicleType: VehicleType,
  onUpdate: (partial: Partial<RouteAnalysisResult>) => void
): Promise<void> {
  const distanceKm    = parseDistanceKm(distanceText);
  const durationMin   = parseDurationMin(durationText);
  const mid           = routeMidpoint(routePoints);

  // ── Sources 1, 4, 5 — synchronous, always available ──────────────────────
  const emissions  = calcEmissions(distanceKm, durationMin, vehicleType);
  const landCover  = getLandCoverForRoute(mid.lat, mid.lng);
  const ecoregions = getEcoregionsForRoute(routePoints);

  const initialStatus: AnalysisStatus = {
    emissions:  'done',
    landCover:  'done',
    ecoregions: 'done',
    airQuality: 'loading',
    forestLoss: 'loading',
  };

  onUpdate({
    emissions,
    landCover,
    ecoregions,
    airQuality:       null,
    forestLoss:       null,
    airQualityError:  null,
    forestLossError:  null,
    status:           initialStatus,
  });

  // ── Source 2 — OpenAQ v3 (async) ─────────────────────────────────────────
  const aqPromise = fetchAirQualityAlongRoute(routePoints)
    .then((aq) => {
      onUpdate({
        airQuality:      aq,
        airQualityError: null,
        status:          { ...initialStatus, airQuality: 'done', forestLoss: 'loading' },
      });
    })
    .catch((err: Error) => {
      const noKey = err.message === 'NO_API_KEY';
      onUpdate({
        airQuality:      null,
        airQualityError: noKey ? 'NO_API_KEY' : err.message,
        status:          { ...initialStatus, airQuality: noKey ? 'no-key' : 'error', forestLoss: 'loading' },
      });
    });

  // ── Source 3 — GFW Hansen (async) ────────────────────────────────────────
  const gfwPromise = fetchForestLossAlongRoute(routePoints)
    .then((fl) => {
      onUpdate({
        forestLoss:      fl,
        forestLossError: null,
        status:          { ...initialStatus, airQuality: 'done', forestLoss: 'done' },
      });
    })
    .catch((err: Error) => {
      const noKey = err.message === 'NO_API_KEY';
      onUpdate({
        forestLoss:      null,
        forestLossError: noKey ? 'NO_API_KEY' : err.message,
        status:          { ...initialStatus, airQuality: 'done', forestLoss: noKey ? 'no-key' : 'error' },
      });
    });

  await Promise.all([aqPromise, gfwPromise]);
}
