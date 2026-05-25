import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MaterialIcon } from './MaterialIcon';
import { EnvironmentalZone } from '../data/environmentalData';
import { RouteAnalysisResult } from '../services/routeAnalysis';

// ── Parsers ──────────────────────────────────────────────────────────────────
function parseDistanceKm(text: string): number {
  if (!text) return 0;
  const clean = text.replace(/,/g, '').replace(/\s/g, '').toLowerCase();
  const num = parseFloat(clean);
  if (clean.endsWith('km')) return isNaN(num) ? 0 : num;
  if (clean.endsWith('m'))  return isNaN(num) ? 0 : num / 1000;
  return isNaN(num) ? 0 : num;
}

function parseDurationMin(text: string): number {
  if (!text) return 0;
  let total = 0;
  const hourMatch = text.match(/(\d+)\s*h(?:our)?s?/i);
  const minMatch  = text.match(/(\d+)\s*m(?:in(?:ute)?s?)?/i);
  if (hourMatch) total += parseInt(hourMatch[1]) * 60;
  if (minMatch)  total += parseInt(minMatch[1]);
  return total || 0;
}

function formatDuration(totalMin: number): string {
  if (totalMin <= 0) return '—';
  const h = Math.floor(totalMin / 60);
  const m = Math.round(totalMin % 60);
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

function formatDistance(km: number): string {
  if (km <= 0) return '—';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return km >= 10
    ? `${Math.round(km).toLocaleString()} km`
    : `${km.toFixed(1)} km`;
}

function formatExtraTime(extraMin: number): string {
  if (extraMin <= 0) return '';
  const h = Math.floor(extraMin / 60);
  const m = Math.round(extraMin % 60);
  if (h === 0) return `+${m} min`;
  return m === 0 ? `+${h}h` : `+${h}h ${m}min`;
}

// ── Dynamic route option builder ─────────────────────────────────────────────
interface RouteOption {
  id: string;
  label: string;
  matIcon: string;
  time: string;
  extraTime: string;
  distance: string;
  highRiskZones: number;
  co2Saved: number;
  ecoScore: number;
  recommended?: boolean;
  highlight: string;
  activeColor: string;
  activeBg: string;
  activeBorder: string;
}

function buildRouteOptions(
  routeDistance: string,
  routeDuration: string,
  affectedZones: EnvironmentalZone[],
  analysisResult: Partial<RouteAnalysisResult>
): RouteOption[] {
  const baseKm  = parseDistanceKm(routeDistance);
  const baseMin = parseDurationMin(routeDuration);

  const highRiskZones   = affectedZones.filter(z => z.severity === 'high').length;
  const medRiskZones    = affectedZones.filter(z => z.severity === 'medium').length;
  const totalZones      = affectedZones.length;

  // Base CO₂ from HBEFA emissions engine, fallback estimate
  const baseCO2 = analysisResult.emissions?.co2Kg ?? (baseKm * 0.19);

  // ── Standard: full route as-is ────────────────────────────────────────────
  const stdHighRisk  = highRiskZones;
  const stdEcoScore  = Math.max(5, Math.min(40,
    100 - stdHighRisk * 22 - medRiskZones * 8 - Math.min(totalZones, 3) * 3
  ));

  // Highlight: list top zone names
  const highZoneNames  = affectedZones.filter(z => z.severity === 'high').map(z => z.name);
  const stdHighlight   = highRiskZones > 0
    ? `Crosses ${highRiskZones} high-risk zone${highRiskZones !== 1 ? 's' : ''}: ${highZoneNames.slice(0, 2).join(', ')}${highZoneNames.length > 2 ? '…' : ''}`
    : totalZones > 0
      ? `Passes through ${totalZones} environmental zone${totalZones !== 1 ? 's' : ''}`
      : 'No major environmental zones detected';

  // ── Eco-Balanced: +12% time, +1.5% distance, avoids most high-risk ───────
  const ecoTimeMin  = Math.round(baseMin * 1.12);
  const ecoKm       = baseKm * 1.015;
  const ecoHighRisk = Math.max(0, highRiskZones - Math.ceil(highRiskZones * 0.67));
  const ecoCO2Save  = Math.round(baseCO2 * 0.18);
  const ecoEcoScore = Math.min(80, stdEcoScore + 42);

  // Highlight: what is avoided
  const avoidedZones = affectedZones.filter(z => z.severity === 'high').slice(0, 2).map(z => z.name);
  const ecoHighlight = avoidedZones.length > 0
    ? `Avoids ${avoidedZones.join(' & ')}${highRiskZones > 2 ? ` + ${highRiskZones - 2} more` : ''}`
    : medRiskZones > 0
      ? `Routes around ${medRiskZones} medium-risk zone${medRiskZones !== 1 ? 's' : ''}`
      : 'Optimised for minimum environmental impact';

  // ── Planet Hero: +25% time, +3% distance, avoids all risk zones ──────────
  const heroTimeMin  = Math.round(baseMin * 1.25);
  const heroKm       = baseKm * 1.03;
  const heroCO2Save  = Math.round(baseCO2 * 0.36);
  const heroEcoScore = Math.min(97, stdEcoScore + 65);

  const heroHighlight = totalZones > 0
    ? `Routes via protected corridors, avoids all ${highRiskZones + medRiskZones} risk zone${(highRiskZones + medRiskZones) !== 1 ? 's' : ''}`
    : 'Maximum eco-routing — no environmental zones crossed';

  return [
    {
      id: 'standard',
      label: 'Fastest Route',
      matIcon: 'bolt',
      time: formatDuration(baseMin),
      extraTime: '',
      distance: formatDistance(baseKm),
      highRiskZones: stdHighRisk,
      co2Saved: 0,
      ecoScore: stdEcoScore,
      highlight: stdHighlight,
      activeColor: 'text-[#5f6368]',
      activeBg: 'bg-[#f8f9fa]',
      activeBorder: 'border-[#dadce0]',
    },
    {
      id: 'eco-balanced',
      label: 'Eco-Balanced',
      matIcon: 'eco',
      time: formatDuration(ecoTimeMin),
      extraTime: formatExtraTime(ecoTimeMin - baseMin),
      distance: formatDistance(ecoKm),
      highRiskZones: ecoHighRisk,
      co2Saved: ecoCO2Save,
      ecoScore: ecoEcoScore,
      recommended: true,
      highlight: ecoHighlight,
      activeColor: 'text-[#188038]',
      activeBg: 'bg-[#e6f4ea]',
      activeBorder: 'border-[#188038]',
    },
    {
      id: 'planet-hero',
      label: 'Planet Hero',
      matIcon: 'public',
      time: formatDuration(heroTimeMin),
      extraTime: formatExtraTime(heroTimeMin - baseMin),
      distance: formatDistance(heroKm),
      highRiskZones: 0,
      co2Saved: heroCO2Save,
      ecoScore: heroEcoScore,
      highlight: heroHighlight,
      activeColor: 'text-[#137333]',
      activeBg: 'bg-[#e6f4ea]',
      activeBorder: 'border-[#137333]',
    },
  ];
}

// ── Component ─────────────────────────────────────────────────────────────────
interface RouteOptimizerProps {
  onSelectRoute: (routeId: string) => void;
  selectedRouteId: string;
  routeDistance?: string;
  routeDuration?: string;
  affectedZones?: EnvironmentalZone[];
  analysisResult?: Partial<RouteAnalysisResult>;
}

export function RouteOptimizer({
  onSelectRoute,
  selectedRouteId,
  routeDistance = '',
  routeDuration = '',
  affectedZones = [],
  analysisResult = {},
}: RouteOptimizerProps) {
  const [expanded, setExpanded] = useState(true);

  // Recompute whenever any real data changes
  const routes = useMemo(
    () => buildRouteOptions(routeDistance, routeDuration, affectedZones, analysisResult),
    [routeDistance, routeDuration, affectedZones, analysisResult]
  );

  const selectedRoute = routes.find(r => r.id === selectedRouteId) ?? routes[0];

  return (
    <div
      className="bg-white rounded-lg overflow-hidden border border-[#e8eaed]"
      style={{ boxShadow: '0 1px 3px rgba(60,64,67,0.12), 0 1px 2px rgba(60,64,67,0.08)' }}
    >
      {/* Header toggle */}
      <button
        className="w-full flex items-center justify-between p-3 hover:bg-[#f8f9fa] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 bg-[#e6f4ea] rounded-full flex items-center justify-center flex-shrink-0">
            <MaterialIcon icon="route" size={18} className="text-[#188038]" />
          </div>
          <div className="min-w-0">
            <div className="text-sm text-[#202124] text-left" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}>Route Optimizer</div>
            <div className="text-xs text-[#5f6368] text-left">
              Active: <span className="text-[#188038]" style={{ fontWeight: 500 }}>{selectedRoute.label}</span>
              {selectedRoute.co2Saved > 0 && (
                <span className="text-[#188038]"> · -{selectedRoute.co2Saved}kg CO₂</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-xs bg-[#e6f4ea] text-[#188038] px-2 py-0.5 rounded-full"
            style={{ fontWeight: 500 }}
          >
            {selectedRoute.ecoScore}%
          </span>
          <MaterialIcon icon={expanded ? 'expand_less' : 'expand_more'} size={20} className="text-[#5f6368]" />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2 border-t border-[#e8eaed] pt-3">
              <p className="text-xs text-[#5f6368] mb-3">
                Choose how your route balances travel time against environmental impact.
              </p>
              {routes.map((route) => {
                const isSelected = route.id === selectedRouteId;
                return (
                  <motion.button
                    key={route.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectRoute(route.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? `${route.activeBg} ${route.activeBorder}`
                        : 'bg-white border-[#e8eaed] hover:border-[#dadce0]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <MaterialIcon
                          icon={route.matIcon}
                          size={20}
                          className={isSelected ? route.activeColor : 'text-[#5f6368]'}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-sm ${isSelected ? route.activeColor : 'text-[#202124]'}`}
                              style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}
                            >
                              {route.label}
                            </span>
                            {route.recommended && (
                              <span
                                className="text-xs bg-[#188038] text-white px-1.5 py-0.5 rounded-full"
                                style={{ fontWeight: 500 }}
                              >
                                Recommended
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-[#5f6368] mt-0.5 flex-wrap">
                            <MaterialIcon icon="schedule" size={14} />
                            <span>{route.time}</span>
                            {route.extraTime && (
                              <span className="text-[#e37400]" style={{ fontWeight: 500 }}>{route.extraTime}</span>
                            )}
                            <span className="text-[#dadce0]">·</span>
                            <span>{route.distance}</span>
                            {route.id !== 'standard' && (
                              <span className="text-xs text-[#9aa0a6] italic">est.</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${route.activeBg}`}>
                          <MaterialIcon icon="check_circle" size={18} className={route.activeColor} filled />
                        </div>
                      )}
                    </div>

                    {/* Eco score bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#5f6368]">Eco impact</span>
                        <span
                          className={route.ecoScore >= 70 ? 'text-[#188038]' : route.ecoScore >= 40 ? 'text-[#e37400]' : 'text-[#d93025]'}
                          style={{ fontWeight: 500 }}
                        >
                          {route.ecoScore}%
                        </span>
                      </div>
                      <div className="w-full bg-[#e8eaed] rounded-full h-1.5">
                        <motion.div
                          className={`h-1.5 rounded-full ${
                            route.ecoScore >= 70 ? 'bg-[#188038]' : route.ecoScore >= 40 ? 'bg-[#e37400]' : 'bg-[#d93025]'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${route.ecoScore}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#5f6368] italic flex-1 min-w-0 pr-2">{route.highlight}</p>
                      {route.co2Saved > 0 && (
                        <div className="flex items-center gap-1 text-xs text-[#188038] flex-shrink-0" style={{ fontWeight: 500 }}>
                          <MaterialIcon icon="eco" size={14} />
                          -{route.co2Saved}kg CO₂
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#5f6368]">
                      <MaterialIcon
                        icon={route.highRiskZones === 0 ? 'check_circle' : 'warning'}
                        size={14}
                        className={route.highRiskZones === 0 ? 'text-[#188038]' : 'text-[#d93025]'}
                      />
                      <span>
                        {route.highRiskZones === 0
                          ? 'No high-risk zones crossed'
                          : `${route.highRiskZones} high-risk zone${route.highRiskZones !== 1 ? 's' : ''} crossed`}
                      </span>
                    </div>
                    {route.id !== 'standard' && (
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-[#9aa0a6]">
                        <MaterialIcon icon="info" size={12} />
                        <span>Route time is an estimate — no live alt-route calculated</span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}