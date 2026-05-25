import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MaterialIcon } from './MaterialIcon';
import { EnvironmentalZone, environmentalZones } from '../data/environmentalData';

const MY_LOCATION = { lat: 59.45, lng: 18.2, label: 'Stockholm area' };

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const nearbyZone = environmentalZones
  .map(z => ({ ...z, distanceKm: Math.round(getDistance(MY_LOCATION.lat, MY_LOCATION.lng, z.lat, z.lng)) }))
  .sort((a, b) => a.distanceKm - b.distanceKm)[0];

const severityColor = {
  high:   { dot: '#d93025', badge: 'bg-[#fce8e6] text-[#c5221f]', icon: 'bg-[#fce8e6] text-[#c5221f]' },
  medium: { dot: '#e37400', badge: 'bg-[#fef7e0] text-[#e37400]', icon: 'bg-[#fef7e0] text-[#e37400]' },
  low:    { dot: '#188038', badge: 'bg-[#e6f4ea] text-[#137333]', icon: 'bg-[#e6f4ea] text-[#137333]' },
};

function TypeIcon({ type }: { type: EnvironmentalZone['type'] }) {
  const icon =
    type === 'deforestation' ? 'forest' :
    type === 'biodiversity'  ? 'eco'    : 'pets';
  return <MaterialIcon icon={icon} size={16} className="text-inherit" />;
}

interface NearbyEnvironmentProps {
  onActionTaken?: (title: string) => void;
}

export function NearbyEnvironment({ onActionTaken }: NearbyEnvironmentProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveredRef = useRef(false);

  // Auto-collapse after 5 seconds unless user is hovering
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (!hoveredRef.current) setCollapsed(true);
    }, 5000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleMouseEnter = () => {
    hoveredRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleMouseLeave = () => {
    hoveredRef.current = false;
    // Re-collapse 3s after user stops hovering (only if still expanded)
    timerRef.current = setTimeout(() => {
      setCollapsed(true);
    }, 3000);
  };

  if (dismissed || !nearbyZone) return null;

  const sc = severityColor[nearbyZone.severity];
  const action = nearbyZone.microActions[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.3 }}
      className="absolute bottom-5 z-20"
      style={{ left: '460px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden w-[300px]"
        style={{ boxShadow: '0 2px 10px rgba(60,64,67,0.18), 0 1px 3px rgba(60,64,67,0.12)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f3f4]">
          <div className="flex items-center gap-2">
            <MaterialIcon icon="near_me" size={15} className="text-[#1a73e8]" />
            <span
              className="text-[#202124] text-sm"
              style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}
            >
              Near you · {MY_LOCATION.label}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setCollapsed(c => !c)}
              className="w-7 h-7 flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] rounded-full transition-colors"
            >
              <MaterialIcon icon={collapsed ? 'expand_more' : 'expand_less'} size={18} />
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="w-7 h-7 flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] rounded-full transition-colors"
            >
              <MaterialIcon icon="close" size={18} />
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {/* Zone info */}
              <div className="px-4 pt-3 pb-2">
                <div className="flex items-start gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${sc.icon}`}>
                    <TypeIcon type={nearbyZone.type} />
                  </div>
                  <div className="min-w-0">
                    <div
                      className="text-[#202124] text-[15px] leading-snug"
                      style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 600 }}
                    >
                      {nearbyZone.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${sc.badge}`} style={{ fontWeight: 500 }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.dot }} />
                        {nearbyZone.severity} risk
                      </span>
                      <span className="text-xs text-[#9aa0a6]">{nearbyZone.distanceKm} km away</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#5f6368] leading-relaxed line-clamp-2 mb-3">
                  {nearbyZone.story}
                </p>

                {/* Action */}
                <button
                  onClick={() => onActionTaken?.(action.title)}
                  className="w-full flex items-start gap-2 p-3 rounded-xl border border-[#e8eaed] hover:border-[#188038] hover:bg-[#f6fef8] transition-colors text-left"
                >
                  <MaterialIcon icon="lightbulb" size={15} className="text-[#188038] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-[#188038]" style={{ fontWeight: 500 }}>{action.title}</div>
                    <div className="text-xs text-[#5f6368] mt-0.5">{action.impact}</div>
                  </div>
                </button>
              </div>

              {/* Eco Zones legend — consolidated here, removed from separate overlay */}
              <div className="px-4 py-3 border-t border-[#f1f3f4]">
                <div
                  className="text-xs text-[#5f6368] mb-2"
                  style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}
                >
                  Eco Zones
                </div>
                <div className="flex items-center gap-4">
                  {[
                    { color: '#d93025', label: 'High risk' },
                    { color: '#e37400', label: 'Medium risk' },
                    { color: '#188038', label: 'Low risk' },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-full border-2 flex-shrink-0"
                        style={{ borderColor: color, backgroundColor: `${color}18` }}
                      />
                      <span className="text-xs text-[#5f6368]">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}