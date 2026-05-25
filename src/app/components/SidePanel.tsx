import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { MaterialIcon } from './MaterialIcon';
import { EnvironmentalZone, MicroAction, UserImpact } from '../data/environmentalData';
import { DataSourceInfo } from './DataSourceInfo';
import { RouteOptimizer } from './RouteOptimizer';
import { ZoneDetailModal } from './ZoneDetailModal';
import { RealDataInsights } from './RealDataInsights';
import { DataAccuracyPanel } from './DataAccuracyPanel';
import { RouteAnalysisResult, VehicleType } from '../services/routeAnalysis';

// ─── Search environmental hints ─────────────────────────────────────────────
interface EnvHint {
  headline: string;
  tip: string;
  severity: 'high' | 'medium' | 'low';
  emoji: string;
}

const LOCATION_HINTS: Record<string, EnvHint> = {
  kiruna: { headline: 'Active iron ore mining — 26% forest lost since 2000', tip: 'Plant a mountain birch to restore sub-Arctic habitat', severity: 'high', emoji: '⛏️' },
  lapland: { headline: 'UNESCO World Heritage — Arctic fox habitat at risk', tip: 'Support the Fjällräven Arctic fox reintroduction programme', severity: 'medium', emoji: '🦊' },
  jokkmokk: { headline: 'Laponian UNESCO zone — reindeer migration route', tip: 'Drive carefully — Sami herds cross roads here in spring', severity: 'medium', emoji: '🦌' },
  gällivare: { headline: 'Laponian zone — wolverine habitat shrinking', tip: 'Support Sami ancestral land protection', severity: 'medium', emoji: '🏔️' },
  'gallivare': { headline: 'Laponian zone — wolverine habitat shrinking', tip: 'Support Sami ancestral land protection', severity: 'medium', emoji: '🏔️' },
  umeå: { headline: 'Norrland boreal forest — active clear-cutting threat', tip: 'Plant a Norway spruce to restore old-growth forest', severity: 'high', emoji: '🌲' },
  umea: { headline: 'Norrland boreal forest — active clear-cutting threat', tip: 'Plant a Norway spruce to restore old-growth forest', severity: 'high', emoji: '🌲' },
  sundsvall: { headline: 'Norrland boreal — Siberian jay losing its home', tip: 'Support old-growth forest protection in Norrland', severity: 'high', emoji: '🐦' },
  östersund: { headline: 'Norrland boreal corridor — reindeer grazing land', tip: 'Choose eco-route via Route 90 to avoid logging roads', severity: 'medium', emoji: '🦌' },
  ostersund: { headline: 'Norrland boreal corridor — reindeer grazing land', tip: 'Choose eco-route via Route 90 to avoid logging roads', severity: 'medium', emoji: '🦌' },
  dalarna: { headline: 'Wolf & bear migration corridor — road risk high', tip: 'Slow down at dawn & dusk — wolves peak here', severity: 'high', emoji: '🐺' },
  falun: { headline: 'Wolf & bear corridor — recovering wolf packs nearby', tip: 'Speed reductions protect Scandinavia\'s 400 remaining wolves', severity: 'high', emoji: '🐺' },
  borlänge: { headline: 'Dalarna bear & wolf corridor — habitat fragmentation', tip: 'Support Swedish Wildlife Association wolf corridor project', severity: 'high', emoji: '🐻' },
  stockholm: { headline: 'Tyresta ancient forest nearby — 14% tree loss', tip: 'Plant a Scots pine in Tyresta\'s restoration zone', severity: 'medium', emoji: '🌳' },
  södertälje: { headline: 'Tyresta old-growth buffer zone at risk', tip: 'Support Tyresta National Park Foundation', severity: 'medium', emoji: '🌳' },
  sodertälje: { headline: 'Tyresta old-growth buffer zone at risk', tip: 'Support Tyresta National Park Foundation', severity: 'medium', emoji: '🌳' },
  luleå: { headline: 'Sub-Arctic boreal zone — near Kiruna mining impact', tip: 'Plant mountain birch to restore sub-Arctic habitat', severity: 'high', emoji: '🌱' },
  lulea: { headline: 'Sub-Arctic boreal zone — near Kiruna mining impact', tip: 'Plant mountain birch to restore sub-Arctic habitat', severity: 'high', emoji: '🌱' },
  abisko: { headline: 'Abisko National Park — climate-driven habitat shifts', tip: 'Choose the eco-route through the park for zero impact', severity: 'low', emoji: '🏔️' },
  norrland: { headline: 'Norrland boreal forest — largest clear-cut zone in EU', tip: 'Support Protect the Forest Sweden to save old-growth', severity: 'high', emoji: '🌲' },
  sweden: { headline: 'Sweden has lost 21% of old-growth boreal forest since 2000', tip: 'Every eco-route choice helps protect these irreplaceable forests', severity: 'medium', emoji: '🇸🇪' },
  sverige: { headline: 'Sverige har förlorat 21% av urskog sedan 2000', tip: 'Varje ekoval skyddar dessa ovärderliga skogar', severity: 'medium', emoji: '🌿' },
};

function getEnvHint(query: string): EnvHint | null {
  if (!query || query.trim().length < 3) return null;
  const lower = query.toLowerCase().trim();
  for (const [key, hint] of Object.entries(LOCATION_HINTS)) {
    if (lower.includes(key)) return hint;
  }
  return null;
}

const hintSeverityStyle = {
  high: { bg: 'bg-[#fce8e6]', border: 'border-[#f28b82]', text: 'text-[#c5221f]', tip: 'text-[#d93025]' },
  medium: { bg: 'bg-[#fef7e0]', border: 'border-[#fdd663]', text: 'text-[#e37400]', tip: 'text-[#b06000]' },
  low: { bg: 'bg-[#e6f4ea]', border: 'border-[#81c995]', text: 'text-[#137333]', tip: 'text-[#188038]' },
};

// ─── ZoneCard ───────────────────────────────────────────────────────────────
function ZoneCard({
  zone,
  onActionTaken,
  takenActions,
  onMoreInfo,
}: {
  zone: EnvironmentalZone;
  onActionTaken: (action: MicroAction) => void;
  takenActions: string[];
  onMoreInfo: (zone: EnvironmentalZone) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const getTypeIcon = () => {
    switch (zone.type) {
      case 'deforestation': return <MaterialIcon icon="forest" size={18} className="text-inherit" />;
      case 'biodiversity': return <MaterialIcon icon="eco" size={18} className="text-inherit" />;
      case 'wildlife-corridor': return <MaterialIcon icon="pets" size={18} className="text-inherit" />;
    }
  };

  const getSeverityStyles = () => {
    switch (zone.severity) {
      case 'high': return { dot: 'bg-[#d93025]', badge: 'bg-[#fce8e6] text-[#c5221f]', border: 'border-l-[#d93025]', iconBg: 'bg-[#fce8e6] text-[#c5221f]' };
      case 'medium': return { dot: 'bg-[#e37400]', badge: 'bg-[#fef7e0] text-[#e37400]', border: 'border-l-[#e37400]', iconBg: 'bg-[#fef7e0] text-[#e37400]' };
      case 'low': return { dot: 'bg-[#188038]', badge: 'bg-[#e6f4ea] text-[#137333]', border: 'border-l-[#188038]', iconBg: 'bg-[#e6f4ea] text-[#137333]' };
    }
  };

  const styles = getSeverityStyles();
  const anyActionTaken = zone.microActions.some((a) => takenActions.includes(a.id));

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      className={`border-l-4 ${styles.border} bg-white rounded-r-lg overflow-hidden`}
      style={{ boxShadow: '0 1px 3px rgba(60,64,67,0.12), 0 1px 2px rgba(60,64,67,0.08)' }}
    >
      <button
        className="w-full text-left p-3 hover:bg-[#f8f9fa] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${styles.iconBg}`}>
            {getTypeIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm text-[#202124] truncate" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}>{zone.name}</span>
              {anyActionTaken && (
                <span className="text-xs bg-[#e6f4ea] text-[#137333] px-1.5 py-0.5 rounded-full flex-shrink-0">
                  <MaterialIcon icon="check_circle" size={12} filled className="mr-0.5 align-middle" />
                  Done
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${styles.badge}`} style={{ fontWeight: 500 }}>
                <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                {zone.severity} risk
              </span>
              <span className="text-xs text-[#5f6368]">{zone.impact.treeLoss}% tree loss</span>
            </div>
          </div>
          <div className="flex-shrink-0 text-[#5f6368]">
            <MaterialIcon icon={expanded ? 'expand_less' : 'expand_more'} size={20} />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3">
              <p className="text-xs text-[#5f6368] leading-relaxed border-t border-[#e8eaed] pt-3">{zone.story}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#f8f9fa] p-2 rounded-lg text-center">
                  <div className="text-sm text-[#d93025]" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 700 }}>{zone.impact.treeLoss}%</div>
                  <div className="text-xs text-[#5f6368]">Trees lost</div>
                </div>
                <div className="bg-[#f8f9fa] p-2 rounded-lg text-center">
                  <div className="text-sm text-[#1a73e8]" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 700 }}>{zone.impact.affectedSpecies.length}</div>
                  <div className="text-xs text-[#5f6368]">Species</div>
                </div>
                <div className="bg-[#f8f9fa] p-2 rounded-lg text-center">
                  <div className="text-sm text-[#188038]" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 700 }}>{(zone.impact.habitatLoss / 1000).toFixed(0)}k</div>
                  <div className="text-xs text-[#5f6368]">m² lost</div>
                </div>
              </div>

              {/* Affected species */}
              <div>
                <div className="text-xs text-[#5f6368] mb-1.5" style={{ fontWeight: 500 }}>Species at risk</div>
                <div className="flex flex-wrap gap-1">
                  {zone.impact.affectedSpecies.map((s) => (
                    <span key={s} className="text-xs bg-[#e8f0fe] text-[#1967d2] px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#202124] mb-2" style={{ fontWeight: 500 }}>
                  <MaterialIcon icon="volunteer_activism" size={16} className="text-[#e37400]" />
                  You can help right now:
                </div>
                <div className="space-y-2">
                  {zone.microActions.slice(0, 2).map((action) => {
                    const taken = takenActions.includes(action.id);
                    return (
                      <motion.button
                        key={action.id}
                        whileHover={{ scale: taken ? 1 : 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={taken}
                        onClick={() => !taken && onActionTaken(action)}
                        className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                          taken
                            ? 'bg-[#e6f4ea] border-[#81c995] opacity-75'
                            : 'bg-white border-[#dadce0] hover:border-[#188038] hover:bg-[#e6f4ea] cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-[#202124]" style={{ fontWeight: 500 }}>
                              {taken && <MaterialIcon icon="check" size={14} className="text-[#188038] mr-1 align-middle" />}
                              {action.title}
                            </div>
                            <div className="text-xs text-[#5f6368] mt-0.5">{action.description}</div>
                            <div className="text-xs text-[#188038] mt-1" style={{ fontWeight: 500 }}>{action.impact}</div>
                          </div>
                          {action.cost && (
                            <span className="text-sm text-[#188038] flex-shrink-0" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 700 }}>${action.cost}</span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* More info button */}
              <button
                onClick={() => onMoreInfo(zone)}
                className="flex items-center gap-1.5 text-xs text-[#1a73e8] hover:text-[#1557b0] transition-colors pt-1"
                style={{ fontWeight: 500 }}
              >
                <MaterialIcon icon="info" size={16} />
                More information about this area
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── SidePanel ───────────────────────────────────────────────────────────────
interface SidePanelProps {
  affectedZones: EnvironmentalZone[];
  tripActions: MicroAction[];
  isLoading: boolean;
  startLabel: string;
  endLabel: string;
  routeDistance?: string;
  routeDuration?: string;
  vehicleType: VehicleType;
  analysisResult: Partial<RouteAnalysisResult>;
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  onVehicleChange: (v: VehicleType) => void;
  onApiKeySaved: () => void;
  onRouteSubmit: (start: string, destination: string) => void;
  onActionTaken: (action: MicroAction) => void;
  onCompleteTrip: () => void;
  onDemo: () => void;
  onClearRoute: () => void;
  userImpact: UserImpact;
}

export function SidePanel({
  affectedZones,
  tripActions,
  isLoading,
  startLabel,
  endLabel,
  routeDistance,
  routeDuration,
  vehicleType,
  analysisResult,
  selectedRouteId,
  onSelectRoute,
  onVehicleChange,
  onApiKeySaved,
  onRouteSubmit,
  onActionTaken,
  onCompleteTrip,
  onDemo,
  onClearRoute,
  userImpact,
}: SidePanelProps) {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [swapped, setSwapped] = useState(false);
  const [detailZone, setDetailZone] = useState<EnvironmentalZone | null>(null);
  const [mobileOpen, setMobileOpen] = useState(true);

  const hasRoute = affectedZones.length > 0 || startLabel;
  const takenActionIds = tripActions.map((a) => a.id);
  const destHint = getEnvHint(destination);
  const startHint = getEnvHint(start);

  const handleSwap = () => {
    const tmp = start;
    setStart(destination);
    setDestination(tmp);
    setSwapped(!swapped);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (start.trim() && destination.trim()) {
      onRouteSubmit(start.trim(), destination.trim());
    }
  };

  const handleDemo = () => {
    setStart('Stockholm');
    setDestination('Berlin');
    onDemo();
  };

  const handleClear = () => {
    setStart('');
    setDestination('');
    onClearRoute();
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-3 left-3 z-30 bg-white rounded-full w-10 h-10 flex items-center justify-center"
        style={{ boxShadow: '0 1px 4px rgba(60,64,67,0.3)' }}
      >
        <MaterialIcon icon={mobileOpen ? 'close' : 'menu'} size={22} className="text-[#5f6368]" />
      </button>

      {/* Panel container — responsive */}
      <div
        className={`
          fixed md:relative z-20
          inset-0 md:inset-auto
          w-full md:w-[408px]
          h-full
          flex flex-col bg-white
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{ boxShadow: '0 1px 4px rgba(60,64,67,0.3)' }}
      >
        {/* Brand Header — Google Maps style */}
        <div className="px-4 pt-4 pb-3 border-b border-[#e8eaed]">
          <div className="flex items-center gap-2 mb-3">
            {/* Google Maps logo: colorful pin + "Maps" wordmark */}
            <svg width="24" height="34" viewBox="0 0 24 34" fill="none" className="flex-shrink-0" aria-hidden="true">
              {/* Pin shadow */}
              <ellipse cx="12" cy="33" rx="4" ry="1.5" fill="rgba(0,0,0,0.12)"/>
              {/* Pin body — Google Maps blue */}
              <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 22 12 22S24 21 24 12C24 5.37 18.63 0 12 0z" fill="#1A73E8"/>
              {/* Lighter blue highlight top-left */}
              <path d="M12 0C5.37 0 0 5.37 0 12c0 2.5.75 4.83 2.05 6.77C4.6 8.1 9.8 2.1 16.5 0.7A11.96 11.96 0 0 0 12 0z" fill="#4285F4" opacity="0.5"/>
              {/* White inner circle */}
              <circle cx="12" cy="12" r="5.5" fill="white"/>
              {/* Blue dot center */}
              <circle cx="12" cy="12" r="2.5" fill="#1A73E8"/>
            </svg>
            <span className="text-[#202124]" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 400, fontSize: '20px', letterSpacing: '-0.2px' }}>Maps</span>
            {/* Eco intelligence badge */}
            <span className="flex items-center gap-0.5 text-xs bg-[#e6f4ea] text-[#137333] px-2 py-0.5 rounded-full flex-shrink-0 ml-0.5" style={{ fontWeight: 500 }}>
              <MaterialIcon icon="eco" size={12} className="text-[#188038]" />
              Eco Layer
            </span>
          </div>

          {/* Route Input — Google Maps Directions Card */}
          <form onSubmit={handleSubmit} className="relative">
            <div
              className="bg-white rounded-lg p-2.5"
              style={{ boxShadow: '0 1px 3px rgba(60,64,67,0.12), 0 1px 2px rgba(60,64,67,0.08)' }}
            >
              {/* Origin row */}
              <div className="flex items-center gap-2.5 px-1">
                <div className="flex-shrink-0 w-5 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full border-2 border-[#1a73e8] bg-white" />
                </div>
                <Input
                  type="text"
                  placeholder="Choose starting point"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="flex-1 border-0 bg-transparent p-1 h-8 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#9aa0a6] text-[#202124]"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                />
              </div>

              {/* Divider + swap */}
              <div className="flex items-center gap-2.5 px-1 py-0">
                <div className="flex-shrink-0 w-5 flex items-center justify-center">
                  <div className="w-px h-4 bg-[#dadce0] mx-auto" />
                </div>
                <div className="flex-1 border-t border-[#e8eaed]" />
                <button
                  type="button"
                  onClick={handleSwap}
                  className="flex-shrink-0 w-7 h-7 rounded-full bg-white border border-[#dadce0] flex items-center justify-center hover:bg-[#f8f9fa] transition-colors"
                  style={{ boxShadow: '0 1px 2px rgba(60,64,67,0.1)' }}
                  title="Swap origin and destination"
                >
                  <MaterialIcon icon="swap_vert" size={18} className="text-[#5f6368]" />
                </button>
              </div>

              {/* Destination row */}
              <div className="flex items-center gap-2.5 px-1">
                <div className="flex-shrink-0 w-5 flex items-center justify-center">
                  <MaterialIcon icon="location_on" size={18} className="text-[#ea4335]" filled />
                </div>
                <Input
                  type="text"
                  placeholder="Choose destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="flex-1 border-0 bg-transparent p-1 h-8 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#9aa0a6] text-[#202124]"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                />
              </div>
            </div>

            {/* Environmental hints for typed locations */}
            <AnimatePresence>
              {(destHint || startHint) && !hasRoute && (
                <motion.div
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -4, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="mt-2 overflow-hidden"
                >
                  {[destHint, startHint].filter(Boolean).slice(0, 1).map((hint, i) => {
                    const hs = hintSeverityStyle[hint!.severity];
                    return (
                      <div key={i} className={`${hs.bg} border ${hs.border} rounded-lg p-2.5`}>
                        <div className={`text-xs ${hs.text} flex items-center gap-1.5 mb-1`} style={{ fontWeight: 500 }}>
                          <span>{hint!.emoji}</span>
                          {hint!.headline}
                        </div>
                        <div className={`text-xs ${hs.tip} flex items-start gap-1`}>
                          <MaterialIcon icon="lightbulb" size={14} className="flex-shrink-0 mt-px" />
                          <span>{hint!.tip}</span>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-2 mt-2.5">
              <button
                type="submit"
                disabled={!start.trim() || !destination.trim() || isLoading}
                className="flex-1 bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-[#c6dafc] disabled:cursor-not-allowed text-white h-9 text-sm rounded-full flex items-center justify-center gap-1.5 transition-colors"
                style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <MaterialIcon icon="progress_activity" size={16} className="animate-spin" />
                    Analyzing…
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <MaterialIcon icon="directions" size={16} />
                    Get Directions
                  </span>
                )}
              </button>
              {hasRoute && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="h-9 w-9 flex-shrink-0 text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-full flex items-center justify-center transition-colors"
                >
                  <MaterialIcon icon="close" size={20} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Scrollable content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 space-y-3">
            {!hasRoute && !isLoading && (
              <>
                {/* Demo card — white bg, green accent */}
                <div
                  className="bg-white rounded-lg p-4 border border-[#e8eaed]"
                  style={{ boxShadow: '0 1px 3px rgba(60,64,67,0.12)' }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 bg-[#e6f4ea] rounded-full flex items-center justify-center flex-shrink-0">
                      <MaterialIcon icon="auto_awesome" size={20} className="text-[#188038]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-[#202124]" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}>New to Maps Eco Layer?</div>
                      <div className="text-xs text-[#5f6368] mt-0.5">See how every trip can protect forests and wildlife</div>
                    </div>
                  </div>
                  <button
                    onClick={handleDemo}
                    className="w-full bg-[#188038] hover:bg-[#137333] text-white h-9 text-sm rounded-full flex items-center justify-center gap-1.5 transition-colors"
                    style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}
                  >
                    <MaterialIcon icon="map" size={16} />
                    Try Stockholm → Berlin Demo
                  </button>
                </div>

                {/* How it works */}
                <div className="space-y-2">
                  <div className="text-xs text-[#5f6368] uppercase tracking-wider px-1" style={{ fontWeight: 500 }}>How it works</div>
                  {[
                    { icon: 'directions', color: 'text-[#1a73e8]', bg: 'bg-[#e8f0fe]', title: 'Plan your route', desc: 'Enter origin and destination like any maps app' },
                    { icon: 'forest', color: 'text-[#188038]', bg: 'bg-[#e6f4ea]', title: 'See hidden impact', desc: 'WWF deforestation & biodiversity zones along your route' },
                    { icon: 'eco', color: 'text-[#188038]', bg: 'bg-[#e6f4ea]', title: 'Take micro-actions', desc: 'Plant trees, choose eco-routes, or support conservation' },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#e8eaed]"
                      style={{ boxShadow: '0 1px 2px rgba(60,64,67,0.06)' }}
                    >
                      <div className={`w-8 h-8 ${item.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <MaterialIcon icon={item.icon} size={18} className={item.color} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-[#202124]" style={{ fontWeight: 500 }}>{item.title}</div>
                        <div className="text-xs text-[#5f6368] mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-12 h-12 bg-[#e6f4ea] rounded-full flex items-center justify-center">
                  <MaterialIcon icon="progress_activity" size={24} className="animate-spin text-[#188038]" />
                </div>
                <div className="text-sm text-[#202124]" style={{ fontWeight: 500 }}>Analyzing your route…</div>
                <div className="text-xs text-[#5f6368] text-center">Checking WWF deforestation zones and biodiversity hotspots</div>
              </div>
            )}

            {hasRoute && !isLoading && (
              <>
                {/* Route summary */}
                <div
                  className="bg-white rounded-lg p-3 border border-[#e8eaed]"
                  style={{ boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}
                >
                  <div className="flex items-center gap-2 text-xs text-[#5f6368] mb-2">
                    <MaterialIcon icon="directions_car" size={16} className="text-[#1a73e8]" />
                    <span className="truncate">{startLabel || 'Starting point'}</span>
                    <MaterialIcon icon="arrow_forward" size={14} className="text-[#dadce0] flex-shrink-0" />
                    <span className="truncate">{endLabel || 'Destination'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-[#202124]" style={{ fontWeight: 500 }}>
                      <span className="w-2 h-2 rounded-full bg-[#1a73e8]" />
                      {routeDuration || '—'}
                    </span>
                    <span className="text-[#dadce0]">·</span>
                    <span className="text-[#5f6368]">{routeDistance || '—'}</span>
                    <span className="text-[#dadce0]">·</span>
                    <span className="text-[#188038]" style={{ fontWeight: 500 }}>{affectedZones.length} eco-zones</span>
                  </div>
                </div>

                {/* Route Optimizer */}
                <RouteOptimizer
                  onSelectRoute={onSelectRoute}
                  selectedRouteId={selectedRouteId}
                  routeDistance={routeDistance}
                  routeDuration={routeDuration}
                  affectedZones={affectedZones}
                  analysisResult={analysisResult}
                />

                {/* Environmental zones header */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-[#202124]" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}>Environmental Zones Along Route</div>
                  <span className="text-xs text-[#9aa0a6]">{affectedZones.length} zones</span>
                </div>

                {/* Zone cards */}
                {affectedZones.map((zone) => (
                  <ZoneCard
                    key={zone.id}
                    zone={zone}
                    onActionTaken={onActionTaken}
                    takenActions={takenActionIds}
                    onMoreInfo={(z) => setDetailZone(z)}
                  />
                ))}

                {/* ── Real Data Insights (5 datasets) ── */}
                {analysisResult.emissions && (
                  <div className="pt-1">
                    <div className="border-t border-[#e8eaed] pt-3">
                      <RealDataInsights
                        result={analysisResult}
                        vehicleType={vehicleType}
                        onVehicleChange={onVehicleChange}
                        onKeySaved={onApiKeySaved}
                      />
                    </div>
                  </div>
                )}

                {/* Data accuracy panel */}
                <DataAccuracyPanel />

                {/* Impact so far */}
                {tripActions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-[#e8eaed] rounded-lg p-3"
                    style={{ boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}
                  >
                    <div className="flex items-center gap-1.5 text-sm text-[#188038] mb-2" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}>
                      <MaterialIcon icon="check_circle" size={16} filled />
                      {tripActions.length} action{tripActions.length !== 1 ? 's' : ''} taken this trip
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-[#e6f4ea] rounded-lg p-2 text-center">
                        <div className="text-base text-[#188038]" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 700 }}>{userImpact.treesPlanted}</div>
                        <div className="text-xs text-[#5f6368]">Trees</div>
                      </div>
                      <div className="bg-[#e8f0fe] rounded-lg p-2 text-center">
                        <div className="text-base text-[#1a73e8]" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 700 }}>{userImpact.forestRestored}m²</div>
                        <div className="text-xs text-[#5f6368]">Restored</div>
                      </div>
                      <div className="bg-[#f3e8fd] rounded-lg p-2 text-center">
                        <div className="text-base text-[#7b1fa2]" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 700 }}>{userImpact.carbonOffset}kg</div>
                        <div className="text-xs text-[#5f6368]">CO₂ offset</div>
                      </div>
                    </div>

                    <button
                      onClick={onCompleteTrip}
                      className="w-full bg-[#188038] hover:bg-[#137333] text-white h-9 text-sm rounded-full flex items-center justify-center gap-1.5 transition-colors"
                      style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}
                    >
                      <MaterialIcon icon="celebration" size={16} />
                      Arrive & Celebrate Impact
                    </button>
                  </motion.div>
                )}

                {/* Arrive button even with no actions */}
                {tripActions.length === 0 && (
                  <button
                    onClick={onCompleteTrip}
                    className="w-full h-9 text-sm border border-[#dadce0] text-[#5f6368] hover:bg-[#f1f3f4] rounded-full flex items-center justify-center gap-1.5 transition-colors"
                    style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}
                  >
                    <MaterialIcon icon="location_on" size={16} />
                    Arrive at destination
                  </button>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[#e8eaed] bg-[#f8f9fa] flex items-center justify-between">
          <DataSourceInfo />
          <div className="text-xs text-[#9aa0a6]">WWF · Global Forest Watch</div>
        </div>
      </div>

      {/* Zone Detail Modal */}
      <AnimatePresence>
        {detailZone && (
          <ZoneDetailModal
            zone={detailZone}
            takenActions={takenActionIds}
            onActionTaken={onActionTaken}
            onClose={() => setDetailZone(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}