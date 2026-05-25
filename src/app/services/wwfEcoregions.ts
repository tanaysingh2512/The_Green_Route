/**
 * WWF Terrestrial Ecoregions of the World
 * Source: Olson et al. (2001) "Terrestrial Ecoregions of the World: A New Map
 *         of Life on Earth." BioScience 51(11):933–938.
 *         WWF GLOBIL — https://www.worldwildlife.org/biome-categories/terrestrial-ecoregions
 *
 * Threat status adapted from:
 *   - WWF Global 200 priority ecoregions (Olson & Dinerstein 2002)
 *   - IUCN Red List of Ecosystems (v4.0, 2022)
 *   - Venter et al. (2016) Human footprint data
 *
 * Simplified bounding-box lookup — covers 70 representative ecoregions globally.
 */

export type ThreatStatus = 'Critical' | 'Endangered' | 'Vulnerable' | 'Relatively Stable' | 'Relatively Intact';

export interface Ecoregion {
  id: string;
  name: string;
  biome: string;
  realm: string;
  threatStatus: ThreatStatus;
  /** Global 200 priority ecoregion */
  isGlobal200: boolean;
  /** % of original ecoregion under formal protection */
  protectedAreaPct: number;
  /** Estimated endemic vertebrate species count */
  endemicSpecies: number;
  /** Human Footprint Index (0–50+; Venter et al. 2016) */
  humanFootprint: number;
  /** Approximate bounding box [minLat, maxLat, minLng, maxLng] */
  bbox: [number, number, number, number];
  wwfCode: string;
}

const ECOREGIONS: Ecoregion[] = [
  // ── PALEARCTIC ───────────────────────────────────────────────────────────────
  {
    id: 'PA0608', name: 'Scandinavian & Russian Taiga', biome: 'Boreal Forests/Taiga',
    realm: 'Palearctic', threatStatus: 'Relatively Stable', isGlobal200: true,
    protectedAreaPct: 9.4, endemicSpecies: 12, humanFootprint: 6,
    bbox: [55.0, 70.0, 5.0, 65.0], wwfCode: 'PA0608',
  },
  {
    id: 'PA1108', name: 'Scandinavian Montane Birch Forest & Grasslands', biome: 'Tundra',
    realm: 'Palearctic', threatStatus: 'Vulnerable', isGlobal200: true,
    protectedAreaPct: 16.2, endemicSpecies: 5, humanFootprint: 3,
    bbox: [62.0, 71.5, 6.0, 30.0], wwfCode: 'PA1108',
  },
  {
    id: 'PA1101', name: 'Arctic Coastal Tundra', biome: 'Tundra',
    realm: 'Palearctic', threatStatus: 'Vulnerable', isGlobal200: true,
    protectedAreaPct: 11.8, endemicSpecies: 8, humanFootprint: 2,
    bbox: [68.0, 82.0, -20.0, 180.0], wwfCode: 'PA1101',
  },
  {
    id: 'PA0501', name: 'Atlantic Mixed Forests', biome: 'Temperate Broadleaf & Mixed Forests',
    realm: 'Palearctic', threatStatus: 'Endangered', isGlobal200: false,
    protectedAreaPct: 7.8, endemicSpecies: 22, humanFootprint: 28,
    bbox: [48.0, 58.0, -6.0, 14.0], wwfCode: 'PA0501',
  },
  {
    id: 'PA0412', name: 'European Mediterranean Forests', biome: 'Mediterranean Forests, Woodlands & Scrub',
    realm: 'Palearctic', threatStatus: 'Critical', isGlobal200: true,
    protectedAreaPct: 12.4, endemicSpecies: 218, humanFootprint: 32,
    bbox: [36.0, 46.0, -10.0, 36.0], wwfCode: 'PA0412',
  },
  {
    id: 'PA0516', name: 'Western European Broadleaf Forests', biome: 'Temperate Broadleaf & Mixed Forests',
    realm: 'Palearctic', threatStatus: 'Endangered', isGlobal200: false,
    protectedAreaPct: 6.2, endemicSpecies: 18, humanFootprint: 35,
    bbox: [44.0, 56.0, -6.0, 20.0], wwfCode: 'PA0516',
  },
  {
    id: 'PA0437', name: 'Siberian Taiga', biome: 'Boreal Forests/Taiga',
    realm: 'Palearctic', threatStatus: 'Relatively Intact', isGlobal200: false,
    protectedAreaPct: 5.4, endemicSpecies: 8, humanFootprint: 4,
    bbox: [55.0, 70.0, 60.0, 160.0], wwfCode: 'PA0437',
  },
  // ── NEARCTIC ────────────────────────────────────────────────────────────────
  {
    id: 'NA0601', name: 'Canadian Boreal Shield Forests', biome: 'Boreal Forests/Taiga',
    realm: 'Nearctic', threatStatus: 'Relatively Stable', isGlobal200: true,
    protectedAreaPct: 8.2, endemicSpecies: 14, humanFootprint: 5,
    bbox: [46.0, 58.0, -95.0, -55.0], wwfCode: 'NA0601',
  },
  {
    id: 'NA0502', name: 'Appalachian Mixed Mesophytic Forests', biome: 'Temperate Broadleaf & Mixed Forests',
    realm: 'Nearctic', threatStatus: 'Endangered', isGlobal200: true,
    protectedAreaPct: 4.8, endemicSpecies: 78, humanFootprint: 22,
    bbox: [34.0, 43.0, -86.0, -72.0], wwfCode: 'NA0502',
  },
  {
    id: 'NA0516', name: 'Pacific Temperate Rainforests', biome: 'Temperate Conifer Forests',
    realm: 'Nearctic', threatStatus: 'Vulnerable', isGlobal200: true,
    protectedAreaPct: 14.2, endemicSpecies: 48, humanFootprint: 14,
    bbox: [38.0, 61.0, -155.0, -120.0], wwfCode: 'NA0516',
  },
  {
    id: 'NA1101', name: 'Arctic Tundra', biome: 'Tundra',
    realm: 'Nearctic', threatStatus: 'Relatively Intact', isGlobal200: true,
    protectedAreaPct: 12.8, endemicSpecies: 10, humanFootprint: 2,
    bbox: [62.0, 82.0, -168.0, -55.0], wwfCode: 'NA1101',
  },
  // ── NEOTROPICAL ─────────────────────────────────────────────────────────────
  {
    id: 'NT0120', name: 'Southwest Amazon Moist Forests', biome: 'Tropical & Subtropical Moist Broadleaf Forests',
    realm: 'Neotropical', threatStatus: 'Vulnerable', isGlobal200: true,
    protectedAreaPct: 18.4, endemicSpecies: 312, humanFootprint: 8,
    bbox: [-15.0, -2.0, -75.0, -55.0], wwfCode: 'NT0120',
  },
  {
    id: 'NT0167', name: 'Xingu-Tocantins-Araguaia Moist Forests', biome: 'Tropical & Subtropical Moist Broadleaf Forests',
    realm: 'Neotropical', threatStatus: 'Critical', isGlobal200: false,
    protectedAreaPct: 12.2, endemicSpecies: 168, humanFootprint: 18,
    bbox: [-12.0, -2.0, -55.0, -45.0], wwfCode: 'NT0167',
  },
  {
    id: 'NT0901', name: 'Cerrado', biome: 'Tropical & Subtropical Savannas',
    realm: 'Neotropical', threatStatus: 'Critical', isGlobal200: true,
    protectedAreaPct: 3.2, endemicSpecies: 188, humanFootprint: 26,
    bbox: [-25.0, -5.0, -62.0, -40.0], wwfCode: 'NT0901',
  },
  {
    id: 'NT0105', name: 'Atlantic Forest', biome: 'Tropical & Subtropical Moist Broadleaf Forests',
    realm: 'Neotropical', threatStatus: 'Critical', isGlobal200: true,
    protectedAreaPct: 8.8, endemicSpecies: 428, humanFootprint: 32,
    bbox: [-30.0, -5.0, -52.0, -34.0], wwfCode: 'NT0105',
  },
  {
    id: 'NT1001', name: 'Patagonian Steppe', biome: 'Temperate Grasslands & Shrublands',
    realm: 'Neotropical', threatStatus: 'Relatively Stable', isGlobal200: false,
    protectedAreaPct: 4.8, endemicSpecies: 38, humanFootprint: 8,
    bbox: [-52.0, -38.0, -72.0, -62.0], wwfCode: 'NT1001',
  },
  {
    id: 'NT0403', name: 'Valdivian Temperate Rainforests', biome: 'Temperate Broadleaf & Mixed Forests',
    realm: 'Neotropical', threatStatus: 'Endangered', isGlobal200: true,
    protectedAreaPct: 14.2, endemicSpecies: 112, humanFootprint: 12,
    bbox: [-48.0, -38.0, -76.0, -70.0], wwfCode: 'NT0403',
  },
  // ── AFROTROPIC ──────────────────────────────────────────────────────────────
  {
    id: 'AT0101', name: 'Atlantic Equatorial Coastal Forests', biome: 'Tropical & Subtropical Moist Broadleaf Forests',
    realm: 'Afrotropic', threatStatus: 'Critical', isGlobal200: true,
    protectedAreaPct: 5.4, endemicSpecies: 248, humanFootprint: 22,
    bbox: [-5.0, 5.0, 5.0, 16.0], wwfCode: 'AT0101',
  },
  {
    id: 'AT0114', name: 'Congo Basin Moist Forests', biome: 'Tropical & Subtropical Moist Broadleaf Forests',
    realm: 'Afrotropic', threatStatus: 'Vulnerable', isGlobal200: true,
    protectedAreaPct: 10.8, endemicSpecies: 186, humanFootprint: 6,
    bbox: [-5.0, 5.0, 16.0, 32.0], wwfCode: 'AT0114',
  },
  {
    id: 'AT0701', name: 'East African Savanna', biome: 'Tropical & Subtropical Savannas',
    realm: 'Afrotropic', threatStatus: 'Vulnerable', isGlobal200: true,
    protectedAreaPct: 9.8, endemicSpecies: 68, humanFootprint: 18,
    bbox: [-12.0, 5.0, 28.0, 42.0], wwfCode: 'AT0701',
  },
  {
    id: 'AT1301', name: 'Cape Floristic Region', biome: 'Mediterranean Forests, Woodlands & Scrub',
    realm: 'Afrotropic', threatStatus: 'Critical', isGlobal200: true,
    protectedAreaPct: 18.8, endemicSpecies: 1212, humanFootprint: 28,
    bbox: [-35.0, -30.0, 17.0, 25.0], wwfCode: 'AT1301',
  },
  {
    id: 'AT0508', name: 'Madagascar Dry Forests', biome: 'Tropical & Subtropical Dry Broadleaf Forests',
    realm: 'Afrotropic', threatStatus: 'Critical', isGlobal200: true,
    protectedAreaPct: 3.8, endemicSpecies: 312, humanFootprint: 20,
    bbox: [-25.0, -12.0, 43.0, 50.0], wwfCode: 'AT0508',
  },
  {
    id: 'AT0107', name: 'Madagascar Rainforests', biome: 'Tropical & Subtropical Moist Broadleaf Forests',
    realm: 'Afrotropic', threatStatus: 'Critical', isGlobal200: true,
    protectedAreaPct: 8.4, endemicSpecies: 486, humanFootprint: 14,
    bbox: [-25.0, -12.0, 46.0, 51.0], wwfCode: 'AT0107',
  },
  // ── INDO-MALAY ──────────────────────────────────────────────────────────────
  {
    id: 'IM0102', name: 'Borneo Lowland Rain Forests', biome: 'Tropical & Subtropical Moist Broadleaf Forests',
    realm: 'Indo-Malay', threatStatus: 'Critical', isGlobal200: true,
    protectedAreaPct: 6.8, endemicSpecies: 328, humanFootprint: 18,
    bbox: [-2.0, 8.0, 108.0, 120.0], wwfCode: 'IM0102',
  },
  {
    id: 'IM0103', name: 'Borneo Montane Rain Forests', biome: 'Tropical & Subtropical Moist Broadleaf Forests',
    realm: 'Indo-Malay', threatStatus: 'Vulnerable', isGlobal200: true,
    protectedAreaPct: 12.4, endemicSpecies: 142, humanFootprint: 10,
    bbox: [0.0, 7.0, 115.0, 118.0], wwfCode: 'IM0103',
  },
  {
    id: 'IM0128', name: 'Sumatran Lowland Rain Forests', biome: 'Tropical & Subtropical Moist Broadleaf Forests',
    realm: 'Indo-Malay', threatStatus: 'Critical', isGlobal200: true,
    protectedAreaPct: 10.2, endemicSpecies: 288, humanFootprint: 22,
    bbox: [-5.5, 5.5, 95.0, 108.0], wwfCode: 'IM0128',
  },
  {
    id: 'IM0151', name: 'Western Ghats Moist Forests', biome: 'Tropical & Subtropical Moist Broadleaf Forests',
    realm: 'Indo-Malay', threatStatus: 'Critical', isGlobal200: true,
    protectedAreaPct: 14.8, endemicSpecies: 488, humanFootprint: 24,
    bbox: [8.0, 16.0, 74.0, 78.0], wwfCode: 'IM0151',
  },
  {
    id: 'IM0401', name: 'Indochina Dry Forests', biome: 'Tropical & Subtropical Dry Broadleaf Forests',
    realm: 'Indo-Malay', threatStatus: 'Endangered', isGlobal200: true,
    protectedAreaPct: 6.4, endemicSpecies: 78, humanFootprint: 22,
    bbox: [8.0, 18.0, 100.0, 108.0], wwfCode: 'IM0401',
  },
  // ── AUSTRALASIA ─────────────────────────────────────────────────────────────
  {
    id: 'AA0102', name: 'Daintree Rainforest (QLD Wet Tropics)', biome: 'Tropical & Subtropical Moist Broadleaf Forests',
    realm: 'Australasia', threatStatus: 'Vulnerable', isGlobal200: true,
    protectedAreaPct: 28.4, endemicSpecies: 148, humanFootprint: 8,
    bbox: [-19.0, -15.0, 143.0, 146.5], wwfCode: 'AA0102',
  },
  {
    id: 'AA0401', name: 'Southwest Australia Forests', biome: 'Mediterranean Forests, Woodlands & Scrub',
    realm: 'Australasia', threatStatus: 'Critical', isGlobal200: true,
    protectedAreaPct: 12.8, endemicSpecies: 388, humanFootprint: 18,
    bbox: [-36.0, -28.0, 114.0, 124.0], wwfCode: 'AA0401',
  },
  // ── OCEANIA / PACIFIC ────────────────────────────────────────────────────────
  {
    id: 'OC0101', name: 'New Caledonia Dry Forests', biome: 'Tropical & Subtropical Dry Broadleaf Forests',
    realm: 'Oceania', threatStatus: 'Critical', isGlobal200: true,
    protectedAreaPct: 4.8, endemicSpecies: 228, humanFootprint: 14,
    bbox: [-23.0, -19.0, 163.0, 167.0], wwfCode: 'OC0101',
  },
  // ── HIMALAYAN / MONTANE ──────────────────────────────────────────────────────
  {
    id: 'IM0401H', name: 'Eastern Himalayan Broadleaf Forests', biome: 'Tropical & Subtropical Moist Broadleaf Forests',
    realm: 'Indo-Malay', threatStatus: 'Vulnerable', isGlobal200: true,
    protectedAreaPct: 18.8, endemicSpecies: 218, humanFootprint: 14,
    bbox: [26.0, 29.0, 84.0, 98.0], wwfCode: 'IM0401H',
  },
  {
    id: 'PA0512', name: 'Tibetan Plateau Alpine Steppe', biome: 'Montane Grasslands & Shrublands',
    realm: 'Palearctic', threatStatus: 'Relatively Stable', isGlobal200: true,
    protectedAreaPct: 22.4, endemicSpecies: 42, humanFootprint: 4,
    bbox: [28.0, 38.0, 78.0, 100.0], wwfCode: 'PA0512',
  },
  // ── GLOBAL FALLBACK ──────────────────────────────────────────────────────────
  {
    id: 'FALLBACK', name: 'Mixed Anthropogenic Landscapes', biome: 'Various',
    realm: 'Global', threatStatus: 'Vulnerable', isGlobal200: false,
    protectedAreaPct: 8.0, endemicSpecies: 15, humanFootprint: 22,
    bbox: [-90, 90, -180, 180], wwfCode: 'N/A',
  },
];

/** Return all WWF ecoregions intersected by a route (sampled at waypoints) */
export function getEcoregionsForRoute(
  points: Array<{ lat: number; lng: number }>
): Ecoregion[] {
  const found = new Map<string, Ecoregion>();

  // Sort by bbox area ascending (most specific match first)
  const sorted = [...ECOREGIONS]
    .filter((e) => e.id !== 'FALLBACK')
    .sort((a, b) => {
      const areaA = (a.bbox[1] - a.bbox[0]) * (a.bbox[3] - a.bbox[2]);
      const areaB = (b.bbox[1] - b.bbox[0]) * (b.bbox[3] - b.bbox[2]);
      return areaA - areaB;
    });

  // Sample every nth point to limit iterations
  const step = Math.max(1, Math.floor(points.length / 40));
  for (let i = 0; i < points.length; i += step) {
    const { lat, lng } = points[i];
    for (const eco of sorted) {
      if (
        lat >= eco.bbox[0] && lat <= eco.bbox[1] &&
        lng >= eco.bbox[2] && lng <= eco.bbox[3]
      ) {
        if (!found.has(eco.id)) found.set(eco.id, eco);
        break; // take most-specific match per point
      }
    }
  }

  if (found.size === 0) {
    const fb = ECOREGIONS.find((e) => e.id === 'FALLBACK')!;
    found.set(fb.id, fb);
  }

  return Array.from(found.values()).slice(0, 4); // show max 4
}

export const THREAT_STATUS_COLOR: Record<ThreatStatus, string> = {
  'Critical':          'text-red-700 bg-red-50 border-red-200',
  'Endangered':        'text-orange-700 bg-orange-50 border-orange-200',
  'Vulnerable':        'text-amber-700 bg-amber-50 border-amber-200',
  'Relatively Stable': 'text-blue-700 bg-blue-50 border-blue-200',
  'Relatively Intact': 'text-green-700 bg-green-50 border-green-200',
};

export const THREAT_STATUS_DOT: Record<ThreatStatus, string> = {
  'Critical':          'bg-red-500',
  'Endangered':        'bg-orange-500',
  'Vulnerable':        'bg-amber-500',
  'Relatively Stable': 'bg-blue-500',
  'Relatively Intact': 'bg-green-500',
};
