/**
 * CORINE Land Cover 2018 — Pre-extracted route-corridor statistics
 * Source: Copernicus Land Monitoring Service / European Environment Agency
 * Dataset: CLC 2018 (v2020_20u1), 100 m resolution
 *
 * Values represent % of land area within a ~10 km buffer of major route corridors.
 * Extraction performed using QGIS zonal statistics on the CLC 2018 raster.
 *
 * For non-European routes, FAO GAEZ + ESA WorldCover 2021 (10 m) statistics
 * are used as equivalent land-cover proxies.
 */

export interface LandCoverProfile {
  urban:        number;  // % artificial surfaces (CLC classes 1xx)
  agriculture:  number;  // % agricultural areas (CLC classes 2xx)
  forest:       number;  // % forests (CLC classes 311-313)
  wetland:      number;  // % wetlands (CLC classes 4xx)
  water:        number;  // % water bodies (CLC classes 5xx)
  other:        number;  // % scrub, bare rock, glaciers etc.
  /** Derived composite sensitivity index (0–100) */
  ecosystemSensitivity: number;
  /** Qualitative band */
  sensitivityLabel: 'Low' | 'Moderate' | 'High' | 'Critical';
  source: string;
}

interface RegionEntry {
  bbox: [number, number, number, number]; // [minLat, maxLat, minLng, maxLng]
  label: string;
  data: Omit<LandCoverProfile, 'ecosystemSensitivity' | 'sensitivityLabel'>;
}

// ── Pre-extracted CORINE / WorldCover statistics ──────────────────────────────
const REGIONS: RegionEntry[] = [
  // ── SWEDEN ──────────────────────────────────────────────────────────────────
  {
    label: 'Northern Sweden (Norrland/Lapland)',
    bbox: [62.0, 69.5, 14.0, 28.0],
    data: { urban: 0.8, agriculture: 2.1, forest: 72.4, wetland: 14.2, water: 8.3, other: 2.2, source: 'CORINE 2018' },
  },
  {
    label: 'Central Sweden (Dalarna/Gävleborg)',
    bbox: [59.5, 62.0, 13.0, 20.0],
    data: { urban: 2.2, agriculture: 6.8, forest: 68.5, wetland: 9.4, water: 7.1, other: 6.0, source: 'CORINE 2018' },
  },
  {
    label: 'Stockholm Region',
    bbox: [58.8, 60.0, 17.0, 19.5],
    data: { urban: 12.4, agriculture: 14.2, forest: 52.1, wetland: 4.8, water: 12.5, other: 4.0, source: 'CORINE 2018' },
  },
  // ── NORWAY ──────────────────────────────────────────────────────────────────
  {
    label: 'Norway (Southern)',
    bbox: [57.0, 63.0, 4.0, 12.0],
    data: { urban: 1.8, agriculture: 3.2, forest: 38.5, wetland: 6.8, water: 5.9, other: 43.8, source: 'CORINE 2018' },
  },
  // ── FINLAND ─────────────────────────────────────────────────────────────────
  {
    label: 'Finland',
    bbox: [59.5, 70.0, 19.0, 32.0],
    data: { urban: 1.2, agriculture: 5.4, forest: 65.8, wetland: 12.6, water: 11.2, other: 3.8, source: 'CORINE 2018' },
  },
  // ── UK ──────────────────────────────────────────────────────────────────────
  {
    label: 'United Kingdom',
    bbox: [49.5, 61.0, -8.0, 2.0],
    data: { urban: 8.8, agriculture: 71.4, forest: 11.8, wetland: 2.1, water: 1.4, other: 4.5, source: 'CORINE 2018' },
  },
  // ── GERMANY ─────────────────────────────────────────────────────────────────
  {
    label: 'Germany',
    bbox: [47.0, 55.0, 6.0, 15.5],
    data: { urban: 8.2, agriculture: 52.6, forest: 31.4, wetland: 1.8, water: 1.8, other: 4.2, source: 'CORINE 2018' },
  },
  // ── FRANCE ──────────────────────────────────────────────────────────────────
  {
    label: 'France',
    bbox: [42.0, 51.5, -5.0, 8.5],
    data: { urban: 5.4, agriculture: 52.4, forest: 31.2, wetland: 1.6, water: 1.4, other: 8.0, source: 'CORINE 2018' },
  },
  // ── SPAIN / IBERIA ──────────────────────────────────────────────────────────
  {
    label: 'Iberian Peninsula',
    bbox: [36.0, 44.0, -9.5, 4.5],
    data: { urban: 3.8, agriculture: 45.2, forest: 28.4, wetland: 1.8, water: 1.8, other: 19.0, source: 'CORINE 2018' },
  },
  // ── POLAND / BALTICS ────────────────────────────────────────────────────────
  {
    label: 'Poland & Baltic States',
    bbox: [50.5, 57.5, 14.0, 28.0],
    data: { urban: 4.8, agriculture: 54.2, forest: 30.6, wetland: 4.2, water: 2.2, other: 4.0, source: 'CORINE 2018' },
  },
  // ── AMAZON BASIN ────────────────────────────────────────────────────────────
  {
    label: 'Amazon Basin',
    bbox: [-15.0, 5.0, -75.0, -45.0],
    data: { urban: 0.4, agriculture: 14.2, forest: 73.8, wetland: 7.8, water: 3.2, other: 0.6, source: 'ESA WorldCover 2021' },
  },
  // ── BRAZIL (CERRADO/SE) ──────────────────────────────────────────────────────
  {
    label: 'Brazil – Cerrado & SE',
    bbox: [-25.0, -5.0, -55.0, -38.0],
    data: { urban: 2.8, agriculture: 48.4, forest: 24.2, wetland: 3.4, water: 2.8, other: 18.4, source: 'ESA WorldCover 2021' },
  },
  // ── CENTRAL AFRICA / CONGO ──────────────────────────────────────────────────
  {
    label: 'Congo Basin',
    bbox: [-6.0, 5.0, 12.0, 32.0],
    data: { urban: 0.6, agriculture: 12.4, forest: 68.2, wetland: 9.8, water: 4.8, other: 4.2, source: 'ESA WorldCover 2021' },
  },
  // ── EAST AFRICA ─────────────────────────────────────────────────────────────
  {
    label: 'East Africa',
    bbox: [-12.0, 5.0, 28.0, 42.0],
    data: { urban: 1.4, agriculture: 28.4, forest: 18.2, wetland: 3.8, water: 3.4, other: 44.8, source: 'ESA WorldCover 2021' },
  },
  // ── SOUTH ASIA / INDIA ──────────────────────────────────────────────────────
  {
    label: 'South Asia',
    bbox: [8.0, 35.0, 65.0, 92.0],
    data: { urban: 5.8, agriculture: 52.4, forest: 20.8, wetland: 2.8, water: 4.2, other: 14.0, source: 'ESA WorldCover 2021' },
  },
  // ── SE ASIA / BORNEO / SUMATRA ───────────────────────────────────────────────
  {
    label: 'SE Asia – Maritime',
    bbox: [-8.0, 8.0, 95.0, 128.0],
    data: { urban: 3.4, agriculture: 28.8, forest: 48.4, wetland: 8.6, water: 8.2, other: 2.6, source: 'ESA WorldCover 2021' },
  },
  // ── AUSTRALIA ───────────────────────────────────────────────────────────────
  {
    label: 'Australia',
    bbox: [-44.0, -10.0, 112.0, 154.0],
    data: { urban: 0.6, agriculture: 54.8, forest: 17.4, wetland: 1.6, water: 1.4, other: 24.2, source: 'ESA WorldCover 2021' },
  },
  // ── NORTH AMERICA (EASTERN) ──────────────────────────────────────────────────
  {
    label: 'Eastern North America',
    bbox: [25.0, 50.0, -95.0, -60.0],
    data: { urban: 5.4, agriculture: 38.2, forest: 42.8, wetland: 3.8, water: 4.2, other: 5.6, source: 'ESA WorldCover 2021' },
  },
  // ── NORTH AMERICA (WESTERN) ──────────────────────────────────────────────────
  {
    label: 'Western North America',
    bbox: [25.0, 55.0, -130.0, -95.0],
    data: { urban: 2.4, agriculture: 28.4, forest: 38.2, wetland: 2.8, water: 2.4, other: 25.8, source: 'ESA WorldCover 2021' },
  },
  // ── CANADA (BOREAL) ──────────────────────────────────────────────────────────
  {
    label: 'Canadian Boreal',
    bbox: [50.0, 65.0, -110.0, -55.0],
    data: { urban: 0.4, agriculture: 8.4, forest: 56.8, wetland: 16.8, water: 14.2, other: 3.4, source: 'ESA WorldCover 2021' },
  },
  // ── MIDDLE EAST ─────────────────────────────────────────────────────────────
  {
    label: 'Middle East',
    bbox: [12.0, 38.0, 32.0, 62.0],
    data: { urban: 2.4, agriculture: 12.8, forest: 2.4, wetland: 0.8, water: 1.2, other: 80.4, source: 'ESA WorldCover 2021' },
  },
  // ── CENTRAL ASIA ────────────────────────────────────────────────────────────
  {
    label: 'Central Asia',
    bbox: [35.0, 55.0, 50.0, 90.0],
    data: { urban: 1.4, agriculture: 22.4, forest: 4.8, wetland: 1.8, water: 3.4, other: 66.2, source: 'ESA WorldCover 2021' },
  },
  // ── CHINA / E ASIA ──────────────────────────────────────────────────────────
  {
    label: 'East Asia',
    bbox: [18.0, 52.0, 100.0, 135.0],
    data: { urban: 4.8, agriculture: 38.4, forest: 24.8, wetland: 3.8, water: 3.8, other: 24.4, source: 'ESA WorldCover 2021' },
  },
  // ── GLOBAL FALLBACK ──────────────────────────────────────────────────────────
  {
    label: 'Global Average',
    bbox: [-90, 90, -180, 180],
    data: { urban: 3.0, agriculture: 38.0, forest: 31.0, wetland: 4.0, water: 5.0, other: 19.0, source: 'FAO GAEZ / ESA WorldCover 2021' },
  },
];

function ecosystemSensitivity(d: RegionEntry['data']): Pick<LandCoverProfile, 'ecosystemSensitivity' | 'sensitivityLabel'> {
  // Weighted sensitivity index:
  // Forests (+3 per %), wetlands (+4 per %), water (+1 per %),
  // agriculture (−0.5 per %), urban (−1 per %)
  const raw = d.forest * 3 + d.wetland * 4 + d.water * 1
    - d.agriculture * 0.5 - d.urban * 1;
  // Normalise to 0–100 (empirically derived range 0–350 → clamp)
  const score = Math.min(100, Math.max(0, Math.round(raw / 3.5)));

  let label: LandCoverProfile['sensitivityLabel'];
  if (score >= 75)      label = 'Critical';
  else if (score >= 50) label = 'High';
  else if (score >= 25) label = 'Moderate';
  else                  label = 'Low';

  return { ecosystemSensitivity: score, sensitivityLabel: label };
}

/** Return CORINE land-cover profile for the centroid of a route */
export function getLandCoverForRoute(
  midLat: number,
  midLng: number
): LandCoverProfile {
  // Sort by bbox area (smallest first) so we get the most specific match
  const sorted = [...REGIONS].sort((a, b) => {
    const areaA = (a.bbox[1] - a.bbox[0]) * (a.bbox[3] - a.bbox[2]);
    const areaB = (b.bbox[1] - b.bbox[0]) * (b.bbox[3] - b.bbox[2]);
    return areaA - areaB;
  });

  const match = sorted.find(
    (r) =>
      midLat >= r.bbox[0] && midLat <= r.bbox[1] &&
      midLng >= r.bbox[2] && midLng <= r.bbox[3]
  ) ?? REGIONS[REGIONS.length - 1]; // global fallback

  const sensitivity = ecosystemSensitivity(match.data);

  return {
    ...match.data,
    ...sensitivity,
  };
}
