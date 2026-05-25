/**
 * RealDataInsights — shows the 5-dataset environmental intelligence panel
 * Rendered inside the SidePanel after a route has been calculated.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Car, Wind, Trees, Layers, Globe2, ChevronDown, ChevronUp,
  KeyRound, Loader2, AlertCircle, CheckCircle2, ExternalLink, Info,
} from 'lucide-react';
import { RouteAnalysisResult, AnalysisStatus } from '../services/routeAnalysis';
import {
  VEHICLE_LABELS,
  EU_AVERAGE_CO2_GKM,
  WHO_PM25_ANNUAL_UGM3,
  WHO_NO2_ANNUAL_UGM3,
  VehicleType,
} from '../services/hbefaEmissions';
import { THREAT_STATUS_COLOR, THREAT_STATUS_DOT } from '../services/wwfEcoregions';
import { setApiKey, getApiKey } from '../services/apiKeys';

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number, decimals = 1) {
  return n.toLocaleString('en-US', { maximumFractionDigits: decimals });
}

function StatusBadge({ status }: { status: AnalysisStatus[keyof AnalysisStatus] }) {
  if (status === 'loading') return (
    <span className="flex items-center gap-1 text-xs text-blue-600">
      <Loader2 className="w-3 h-3 animate-spin" /> Fetching live data…
    </span>
  );
  if (status === 'done') return (
    <span className="flex items-center gap-1 text-xs text-green-600">
      <CheckCircle2 className="w-3 h-3" /> Live data
    </span>
  );
  if (status === 'no-key') return (
    <span className="flex items-center gap-1 text-xs text-amber-600">
      <KeyRound className="w-3 h-3" /> API key needed
    </span>
  );
  // error
  return (
    <span className="flex items-center gap-1 text-xs text-red-600">
      <AlertCircle className="w-3 h-3" /> Error
    </span>
  );
}

function EstimatedBadge() {
  return (
    <span className="flex items-center gap-1 text-xs text-teal-600">
      <CheckCircle2 className="w-3 h-3" /> Biome estimate
    </span>
  );
}

function HardcodedBadge() {
  return (
    <span className="flex items-center gap-1 text-xs text-indigo-600">
      <CheckCircle2 className="w-3 h-3" /> Verified dataset
    </span>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({
  icon, title, source, badge, children,
}: {
  icon: React.ReactNode;
  title: string;
  source: string;
  badge: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-gray-100 rounded-xl bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 p-3 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 leading-tight">{title}</div>
          <div className="text-xs text-gray-400 truncate">{source}</div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          {badge}
          {open ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2.5 border-t border-gray-50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── API key input inline ──────────────────────────────────────────────────────
function ApiKeyInput({
  id, label, href, placeholder, onSaved,
}: {
  id: 'openaq' | 'gfw';
  label: string;
  href: string;
  placeholder: string;
  onSaved: () => void;
}) {
  const [val, setVal] = useState(getApiKey(id));
  const [saved, setSaved] = useState(false);

  const save = () => {
    setApiKey(id, val);
    setSaved(true);
    setTimeout(() => { setSaved(false); onSaved(); }, 1200);
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 space-y-2 mt-1">
      <div className="flex items-start gap-1.5">
        <KeyRound className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-semibold text-amber-800">API key required for live data</div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-700 underline flex items-center gap-0.5 mt-0.5"
          >
            Get a free key at {label} <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
      <div className="flex gap-1.5">
        <input
          type="password"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-xs border border-amber-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:border-amber-400"
        />
        <button
          onClick={save}
          disabled={!val.trim()}
          className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50'
          }`}
        >
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}

// ── 1. HBEFA Emissions Section ────────────────────────────────────────────────
function EmissionsSection({
  data,
  vehicleType,
  onVehicleChange,
}: {
  data: RouteAnalysisResult['emissions'];
  vehicleType: VehicleType;
  onVehicleChange: (v: VehicleType) => void;
}) {
  const pctVsEU = ((data.co2Gkm / EU_AVERAGE_CO2_GKM) * 100 - 100).toFixed(0);
  const isBetter = data.co2Gkm < EU_AVERAGE_CO2_GKM;

  return (
    <div className="space-y-2 pt-2">
      {/* Vehicle selector */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Your vehicle</label>
        <select
          value={vehicleType}
          onChange={(e) => onVehicleChange(e.target.value as VehicleType)}
          className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-blue-300"
        >
          {(Object.entries(VEHICLE_LABELS) as Array<[VehicleType, string]>).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: 'CO₂ total', value: `${fmt(data.totalCo2Kg, 1)} kg`, sub: `${fmt(data.co2Gkm, 0)} g/km` },
          { label: 'NOx total', value: `${fmt(data.totalNoxG, 1)} g`,   sub: `${fmt(data.noxMgkm, 0)} mg/km` },
          { label: 'PM2.5',    value: `${fmt(data.totalPm25G, 2)} g`,   sub: `${fmt(data.pm25Mgkm, 1)} mg/km` },
        ].map((m) => (
          <div key={m.label} className="bg-gray-50 rounded-lg p-2 text-center">
            <div className="text-sm font-bold text-gray-800">{m.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{m.sub}</div>
            <div className="text-xs text-gray-400 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      {/* EU comparison */}
      <div className={`rounded-lg px-2.5 py-2 flex items-center gap-2 ${isBetter ? 'bg-green-50 border border-green-100' : 'bg-orange-50 border border-orange-100'}`}>
        <span className="text-base">{isBetter ? '✅' : '⚠️'}</span>
        <div className="text-xs">
          <span className={`font-semibold ${isBetter ? 'text-green-700' : 'text-orange-700'}`}>
            {isBetter ? `${Math.abs(+pctVsEU)}% below` : `${Math.abs(+pctVsEU)}% above`} EU 2023 fleet average
          </span>
          <span className="text-gray-500"> ({EU_AVERAGE_CO2_GKM} g CO₂/km, EEA)</span>
        </div>
      </div>
      <div className="text-xs text-gray-400 flex items-start gap-1">
        <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
        Avg speed {data.avgSpeedKmh} km/h · HBEFA 4.2 speed-corrected EF · TU Graz
      </div>
    </div>
  );
}

// ── 2. OpenAQ Section ─────────────────────────────────────────────────────────
function AirQualitySection({
  data, error, status, onKeySaved,
}: {
  data: RouteAnalysisResult['airQuality'];
  error: string | null;
  status: AnalysisStatus['airQuality'];
  onKeySaved: () => void;
}) {
  if (status === 'loading') {
    return (
      <div className="pt-2 flex items-center gap-2 text-xs text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        Querying OpenAQ stations along route…
      </div>
    );
  }

  if (status === 'no-key' || error === 'NO_API_KEY') {
    return (
      <div className="pt-1">
        <p className="text-xs text-gray-500 mb-1">
          Fetch real-time NO₂ and PM2.5 readings from monitoring stations along your route.
        </p>
        <ApiKeyInput
          id="openaq"
          label="openaq.org"
          href="https://explore.openaq.org/register"
          placeholder="Paste your OpenAQ API key…"
          onSaved={onKeySaved}
        />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="pt-2 bg-red-50 border border-red-100 rounded-lg p-2.5 text-xs text-red-700">
        <AlertCircle className="w-3.5 h-3.5 inline mr-1" />
        {error?.includes('401') ? 'Invalid API key — check your OpenAQ key.' : `OpenAQ error: ${error}`}
      </div>
    );
  }

  if (!data || data.stations.length === 0) {
    return (
      <div className="pt-2 text-xs text-gray-500">
        No monitoring stations found within 50 km of this route.
      </div>
    );
  }

  return (
    <div className="space-y-2 pt-2">
      {data.stations.map((station) => {
        const pm25Over  = station.pm25Ugm3 !== null && station.pm25Ugm3 > WHO_PM25_ANNUAL_UGM3;
        const no2Over   = station.no2Ugm3  !== null && station.no2Ugm3  > WHO_NO2_ANNUAL_UGM3;

        return (
          <div key={station.id} className="border border-gray-100 rounded-lg p-2.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-gray-800 truncate max-w-[180px]">{station.name}</div>
              <div className="text-xs text-gray-400">{station.city || station.country}</div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {/* PM2.5 */}
              <div className={`rounded-lg p-2 text-center ${pm25Over ? 'bg-red-50' : 'bg-green-50'}`}>
                <div className={`text-sm font-bold ${pm25Over ? 'text-red-700' : 'text-green-700'}`}>
                  {station.pm25Ugm3 !== null ? `${fmt(station.pm25Ugm3, 1)} µg/m³` : '—'}
                </div>
                <div className="text-xs text-gray-500">PM2.5</div>
                {station.pm25Ugm3 !== null && (
                  <div className={`text-xs font-medium mt-0.5 ${pm25Over ? 'text-red-600' : 'text-green-600'}`}>
                    WHO limit: {WHO_PM25_ANNUAL_UGM3} µg/m³ {pm25Over ? '⚠️' : '✓'}
                  </div>
                )}
              </div>
              {/* NO₂ */}
              <div className={`rounded-lg p-2 text-center ${no2Over ? 'bg-red-50' : 'bg-green-50'}`}>
                <div className={`text-sm font-bold ${no2Over ? 'text-red-700' : 'text-green-700'}`}>
                  {station.no2Ugm3 !== null ? `${fmt(station.no2Ugm3, 1)} µg/m³` : '—'}
                </div>
                <div className="text-xs text-gray-500">NO₂</div>
                {station.no2Ugm3 !== null && (
                  <div className={`text-xs font-medium mt-0.5 ${no2Over ? 'text-red-600' : 'text-green-600'}`}>
                    WHO limit: {WHO_NO2_ANNUAL_UGM3} µg/m³ {no2Over ? '⚠️' : '✓'}
                  </div>
                )}
              </div>
            </div>
            {station.pm25Timestamp && (
              <div className="text-xs text-gray-400">
                Last updated: {new Date(station.pm25Timestamp).toLocaleString()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── 3. Hansen Forest Loss Section ─────────────────────────────────────────────
function ForestLossSection({
  data, error, status, onKeySaved,
}: {
  data: RouteAnalysisResult['forestLoss'];
  error: string | null;
  status: AnalysisStatus['forestLoss'];
  onKeySaved: () => void;
}) {
  if (status === 'loading') {
    return (
      <div className="pt-2 flex items-center gap-2 text-xs text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin text-green-600" />
        Querying Hansen forest change data…
      </div>
    );
  }

  if (status === 'no-key' || error === 'NO_API_KEY') {
    return (
      <div className="pt-1">
        <p className="text-xs text-gray-500 mb-1">
          Fetch Hansen GFC tree cover loss in a 10 km buffer around your route (2000–2023).
        </p>
        <ApiKeyInput
          id="gfw"
          label="globalforestwatch.org"
          href="https://www.globalforestwatch.org/help/map/guides/sign-up-for-gfw/"
          placeholder="Paste your GFW API key…"
          onSaved={onKeySaved}
        />
      </div>
    );
  }

  // Show API errors only for non-404 / auth failures — otherwise the
  // service will have already fallen back to estimation, so data will be set.
  if (status === 'error' && !data) {
    return (
      <div className="pt-2 bg-red-50 border border-red-100 rounded-lg p-2.5 text-xs text-red-700">
        <AlertCircle className="w-3.5 h-3.5 inline mr-1" />
        {error?.includes('401') ? 'Invalid API key — check your GFW key.' : `GFW error: ${error}`}
      </div>
    );
  }

  if (!data) return null;

  const severity = data.lossPercent > 20 ? 'high' : data.lossPercent > 8 ? 'medium' : 'low';
  const severityColor = severity === 'high' ? 'text-red-600 bg-red-50' : severity === 'medium' ? 'text-orange-600 bg-orange-50' : 'text-green-600 bg-green-50';

  return (
    <div className="space-y-2 pt-2">
      {/* Estimated data notice */}
      {data.isEstimated && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg px-2.5 py-2 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-teal-800">
            <span className="font-semibold">Biome-based estimate</span> — GFW API returned no data for this
            region. Figures are derived from FAO GFRA 2020 regional deforestation rates for{' '}
            <span className="italic">{data.dataset.split('—')[0]?.trim()}</span>.
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-1.5">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="text-sm font-bold text-gray-800">{fmt(data.totalLossHa, 0)} ha</div>
          <div className="text-xs text-gray-500">Total loss since 2000</div>
        </div>
        <div className={`rounded-lg p-2 text-center ${severityColor}`}>
          <div className="text-sm font-bold">{fmt(data.lossPercent, 1)}%</div>
          <div className="text-xs opacity-80">of 2000 tree cover lost</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="text-sm font-bold text-gray-800">{fmt(data.baselineCoverHa, 0)} ha</div>
          <div className="text-xs text-gray-500">2000 baseline cover</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="text-sm font-bold text-gray-800">{data.peakLossYear || '—'}</div>
          <div className="text-xs text-gray-500">Peak loss year</div>
        </div>
      </div>

      {/* Bar chart of yearly loss */}
      {data.yearlyLoss.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 mb-1.5">Annual tree cover loss (ha) in route buffer</div>
          <div className="flex items-end gap-px h-12">
            {data.yearlyLoss.map((d) => {
              const maxLoss = Math.max(...data.yearlyLoss.map(y => y.lossHa), 1);
              const h = Math.round((d.lossHa / maxLoss) * 100);
              return (
                <div
                  key={d.year}
                  title={`${d.year}: ${fmt(d.lossHa, 1)} ha`}
                  className={`flex-1 rounded-sm ${d.year === data.peakLossYear ? 'bg-red-500' : data.isEstimated ? 'bg-teal-400' : 'bg-emerald-400'}`}
                  style={{ height: `${Math.max(2, h)}%` }}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-0.5">
            <span>{data.yearlyLoss[0]?.year}</span>
            <span>{data.yearlyLoss[data.yearlyLoss.length - 1]?.year}</span>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400 flex items-start gap-1">
        <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
        10 km buffer · 30% canopy threshold · {data.isEstimated ? data.dataset.split('—')[1]?.trim() ?? data.dataset : data.dataset}
      </div>
    </div>
  );
}

// ── 4. CORINE Land Cover Section ──────────────────────────────────────────────
function LandCoverSection({ data }: { data: RouteAnalysisResult['landCover'] }) {
  const bars = [
    { label: 'Forest',      value: data.forest,      color: 'bg-green-500' },
    { label: 'Agriculture', value: data.agriculture,  color: 'bg-yellow-400' },
    { label: 'Urban',       value: data.urban,        color: 'bg-gray-500' },
    { label: 'Wetland',     value: data.wetland,      color: 'bg-blue-400' },
    { label: 'Water',       value: data.water,        color: 'bg-sky-400' },
    { label: 'Other',       value: data.other,        color: 'bg-stone-400' },
  ].filter((b) => b.value > 0);

  const sensitivityColor =
    data.sensitivityLabel === 'Critical' ? 'text-red-700 bg-red-50 border-red-200' :
    data.sensitivityLabel === 'High'     ? 'text-orange-700 bg-orange-50 border-orange-200' :
    data.sensitivityLabel === 'Moderate' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                                           'text-blue-700 bg-blue-50 border-blue-200';

  return (
    <div className="space-y-2.5 pt-2">
      {/* Stacked bar */}
      <div>
        <div className="flex rounded-full overflow-hidden h-4">
          {bars.map((b) => (
            <div
              key={b.label}
              className={b.color}
              style={{ width: `${b.value}%` }}
              title={`${b.label}: ${b.value}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
          {bars.map((b) => (
            <div key={b.label} className="flex items-center gap-1 text-xs text-gray-600">
              <span className={`w-2 h-2 rounded-sm ${b.color}`} />
              {b.label} <span className="text-gray-400">{b.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sensitivity index */}
      <div className={`border rounded-lg px-2.5 py-2 flex items-center justify-between ${sensitivityColor}`}>
        <div>
          <div className="text-xs font-semibold">Ecosystem Sensitivity</div>
          <div className="text-xs opacity-80 mt-0.5">Weighted by forest & wetland cover</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">{data.ecosystemSensitivity}</div>
          <div className="text-xs font-semibold">{data.sensitivityLabel}</div>
        </div>
      </div>
      <div className="text-xs text-gray-400">Source: {data.source} · 10 km route buffer</div>
    </div>
  );
}

// ── 5. WWF Ecoregions Section ─────────────────────────────────────────────────
function EcoregionsSection({ data }: { data: RouteAnalysisResult['ecoregions'] }) {
  return (
    <div className="space-y-2 pt-2">
      {data.map((eco) => {
        const colorClass = THREAT_STATUS_COLOR[eco.threatStatus];
        const dotClass   = THREAT_STATUS_DOT[eco.threatStatus];
        return (
          <div key={eco.id} className="border border-gray-100 rounded-lg p-2.5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="text-xs font-semibold text-gray-800 leading-tight">{eco.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{eco.biome}</div>
              </div>
              <span className={`flex-shrink-0 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${colorClass}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                {eco.threatStatus}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: 'Protected', value: `${eco.protectedAreaPct}%`, color: 'text-green-600' },
                { label: 'Endemics',  value: eco.endemicSpecies, color: 'text-blue-600' },
                { label: 'Human FP',  value: `${eco.humanFootprint}/50`, color: eco.humanFootprint > 20 ? 'text-red-600' : 'text-gray-600' },
              ].map((stat) => (
                <div key={stat.label} className="bg-gray-50 rounded-md p-1.5 text-center">
                  <div className={`text-xs font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
            {eco.isGlobal200 && (
              <div className="mt-1.5 text-xs text-purple-700 bg-purple-50 rounded-md px-2 py-1">
                ⭐ WWF Global 200 Priority Ecoregion
              </div>
            )}
          </div>
        );
      })}
      <div className="text-xs text-gray-400">
        Source: Olson et al. (2001) · WWF GLOBIL terrestrial ecoregions
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
interface Props {
  result: Partial<RouteAnalysisResult>;
  vehicleType: VehicleType;
  onVehicleChange: (v: VehicleType) => void;
  onKeySaved: () => void;   // triggers re-analysis after a key is saved
}

export function RealDataInsights({ result, vehicleType, onVehicleChange, onKeySaved }: Props) {
  const status = result.status;

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
            <Globe2 className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Environmental Intelligence</div>
            <div className="text-xs text-gray-400">5 real-world datasets · route corridor analysis</div>
          </div>
        </div>
      </div>

      {/* ─── Dataset 1: HBEFA 4.2 Emissions ─────────────────────────────────── */}
      <Section
        icon={<Car className="w-4 h-4 text-gray-600" />}
        title="Vehicle Emissions"
        source="HBEFA 4.2 — TU Graz / INFRAS"
        badge={<HardcodedBadge />}
      >
        {result.emissions && (
          <EmissionsSection
            data={result.emissions}
            vehicleType={vehicleType}
            onVehicleChange={onVehicleChange}
          />
        )}
      </Section>

      {/* ─── Dataset 2: OpenAQ Air Quality ──────────────────────────────────── */}
      <Section
        icon={<Wind className="w-4 h-4 text-blue-500" />}
        title="Air Quality (NO₂ & PM2.5)"
        source="OpenAQ v3 — live sensor network"
        badge={<StatusBadge status={status?.airQuality ?? 'loading'} />}
      >
        <AirQualitySection
          data={result.airQuality ?? null}
          error={result.airQualityError ?? null}
          status={status?.airQuality ?? 'loading'}
          onKeySaved={onKeySaved}
        />
      </Section>

      {/* ─── Dataset 3: Hansen / GFW Forest Loss ────────────────────────────── */}
      <Section
        icon={<Trees className="w-4 h-4 text-green-600" />}
        title="Tree Cover Loss"
        source="Hansen GFC v1.11 — UMD via GFW"
        badge={
          result.forestLoss?.isEstimated
            ? <EstimatedBadge />
            : <StatusBadge status={status?.forestLoss ?? 'loading'} />
        }
      >
        <ForestLossSection
          data={result.forestLoss ?? null}
          error={result.forestLossError ?? null}
          status={status?.forestLoss ?? 'loading'}
          onKeySaved={onKeySaved}
        />
      </Section>

      {/* ─── Dataset 4: CORINE Land Cover ───────────────────────────────────── */}
      <Section
        icon={<Layers className="w-4 h-4 text-amber-600" />}
        title="Land Cover Profile"
        source="CORINE 2018 — Copernicus / ESA"
        badge={<HardcodedBadge />}
      >
        {result.landCover && <LandCoverSection data={result.landCover} />}
      </Section>

      {/* ─── Dataset 5: WWF Ecoregions ──────────────────────────────────────── */}
      <Section
        icon={<Globe2 className="w-4 h-4 text-purple-600" />}
        title="WWF Terrestrial Ecoregions"
        source="Olson et al. 2001 — WWF GLOBIL"
        badge={<HardcodedBadge />}
      >
        {result.ecoregions && <EcoregionsSection data={result.ecoregions} />}
      </Section>
    </div>
  );
}