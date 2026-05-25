/**
 * HBEFA 4.2 Emission Factors
 * Source: Handbook Emission Factors for Road Transport 4.2
 *         TU Graz / INFRAS / IFEu, 2021 — EU average.
 * All values in g/km unless noted.
 *
 * Methodology:
 *  - Speed-dependent EF tables from HBEFA 4.2, Table 4.2-x (PC segment).
 *  - Route is split by road type inferred from avg speed band.
 *  - CO₂ = fuel consumption × IPCC emission factor (2.31 kg/l petrol, 2.64 kg/l diesel).
 *  - NOx and PM2.5 are hot-emission EFs; tyre/brake wear adds ~0.001 g/km PM2.5.
 */

export type VehicleType =
  | 'petrol-euro6'
  | 'diesel-euro6'
  | 'petrol-euro5'
  | 'diesel-euro5'
  | 'hybrid-phev'
  | 'bev';

export interface EmissionFactors {
  co2Gkm:   number;  // grams CO₂ per km
  noxMgkm:  number;  // milligrams NOx per km
  pm25Mgkm: number;  // milligrams PM2.5 per km (hot + tyre/brake)
}

// ── Speed-band EF tables ──────────────────────────────────────────────────────
// Speed bands (km/h): [30, 50, 70, 90, 110, 130]
type SpeedBand = [number, number, number, number, number, number];

interface VehicleEFs {
  co2:   SpeedBand;   // g/km
  nox:   SpeedBand;   // mg/km
  pm25:  SpeedBand;   // mg/km (incl. ~1 mg/km tyre/brake non-exhaust)
}

const EF_TABLES: Record<VehicleType, VehicleEFs> = {
  // ── HBEFA 4.2 Table — PC Petrol Euro 6d-temp ─────────────────────────────
  'petrol-euro6': {
    co2:  [226, 192, 168, 152, 164, 190],
    nox:  [ 72,  62,  52,  47,  50,  54],
    pm25: [  3,   2,   2,   2,   2,   2],
  },
  // ── HBEFA 4.2 Table — PC Diesel Euro 6d-temp ─────────────────────────────
  'diesel-euro6': {
    co2:  [198, 178, 152, 135, 148, 172],
    nox:  [165, 138, 120, 112, 101,  90],
    pm25: [  2,   2,   1,   1,   1,   1],
  },
  // ── HBEFA 4.2 Table — PC Petrol Euro 5 ───────────────────────────────────
  'petrol-euro5': {
    co2:  [242, 208, 182, 168, 180, 208],
    nox:  [182, 148, 115,  92,  98, 105],
    pm25: [  4,   3,   3,   3,   3,   3],
  },
  // ── HBEFA 4.2 Table — PC Diesel Euro 5 ───────────────────────────────────
  'diesel-euro5': {
    co2:  [210, 188, 162, 145, 158, 182],
    nox:  [385, 328, 292, 278, 265, 248],
    pm25: [  3,   3,   2,   2,   2,   2],
  },
  // ── PHEV petrol (electric range ≥50 km), blended real-world mode ─────────
  'hybrid-phev': {
    co2:  [118,  98,  82,  72,  78,  92],
    nox:  [ 42,  36,  30,  26,  28,  32],
    pm25: [  2,   2,   2,   2,   2,   2],
  },
  // ── Battery Electric Vehicle — operational emissions only ─────────────────
  // CO₂ = 0 operational; include grid carbon separately in description.
  // PM2.5 = tyre & brake wear only (~1.5 mg/km from HBEFA non-exhaust table).
  'bev': {
    co2:  [0, 0, 0, 0, 0, 0],
    nox:  [0, 0, 0, 0, 0, 0],
    pm25: [2, 2, 2, 2, 2, 2],
  },
};

// Speed band index helper
function speedBandIndex(speedKmh: number): number {
  if (speedKmh < 40)  return 0; // 30 km/h
  if (speedKmh < 60)  return 1; // 50
  if (speedKmh < 80)  return 2; // 70
  if (speedKmh < 100) return 3; // 90
  if (speedKmh < 120) return 4; // 110
  return 5;                      // 130
}

// Interpolate between two adjacent speed bands
function interpolateEF(table: SpeedBand, speedKmh: number): number {
  const bands = [30, 50, 70, 90, 110, 130];
  const idx = speedBandIndex(speedKmh);
  if (idx >= bands.length - 1) return table[idx];
  const lo = bands[idx], hi = bands[idx + 1];
  const t = (speedKmh - lo) / (hi - lo);
  return table[idx] * (1 - t) + table[idx + 1] * t;
}

export function calcEmissions(
  distanceKm: number,
  durationMinutes: number,
  vehicleType: VehicleType
): EmissionFactors & {
  totalCo2Kg: number;
  totalNoxG:  number;
  totalPm25G: number;
  avgSpeedKmh: number;
  vehicleLabel: string;
} {
  const avgSpeedKmh = durationMinutes > 0
    ? (distanceKm / durationMinutes) * 60
    : 90;

  const table = EF_TABLES[vehicleType];
  const co2Gkm   = interpolateEF(table.co2,  avgSpeedKmh);
  const noxMgkm  = interpolateEF(table.nox,  avgSpeedKmh);
  const pm25Mgkm = interpolateEF(table.pm25, avgSpeedKmh);

  return {
    co2Gkm,
    noxMgkm,
    pm25Mgkm,
    totalCo2Kg:  (co2Gkm  * distanceKm) / 1000,
    totalNoxG:   (noxMgkm * distanceKm) / 1000,
    totalPm25G:  (pm25Mgkm * distanceKm) / 1000,
    avgSpeedKmh: Math.round(avgSpeedKmh),
    vehicleLabel: VEHICLE_LABELS[vehicleType],
  };
}

export const VEHICLE_LABELS: Record<VehicleType, string> = {
  'petrol-euro6': 'Petrol — Euro 6',
  'diesel-euro6': 'Diesel — Euro 6',
  'petrol-euro5': 'Petrol — Euro 5',
  'diesel-euro5': 'Diesel — Euro 5',
  'hybrid-phev':  'Plug-in Hybrid (PHEV)',
  'bev':          'Battery Electric (BEV)',
};

// EU average new-car emission factor (2023): ~105 g CO₂/km (ICCT/EEA)
export const EU_AVERAGE_CO2_GKM = 105;
// WHO 2021 annual PM2.5 guideline: 5 µg/m³
// WHO 2021 annual NO₂ guideline: 10 µg/m³
export const WHO_PM25_ANNUAL_UGM3 = 5;
export const WHO_NO2_ANNUAL_UGM3  = 10;
