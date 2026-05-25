import { motion } from 'motion/react';
import { X, TreePine, Leaf, Footprints, ExternalLink, AlertTriangle } from 'lucide-react';
import { EnvironmentalZone, MicroAction } from '../data/environmentalData';
import { Button } from './ui/button';

interface ZoneDetailModalProps {
  zone: EnvironmentalZone;
  takenActions: string[];
  onActionTaken: (action: MicroAction) => void;
  onClose: () => void;
}

const severityStyles = {
  high: { bar: 'bg-red-500', badge: 'bg-red-100 text-red-700', bg: 'from-red-50 to-orange-50', border: 'border-red-200' },
  medium: { bar: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700', bg: 'from-orange-50 to-amber-50', border: 'border-orange-200' },
  low: { bar: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700', bg: 'from-yellow-50 to-lime-50', border: 'border-yellow-200' },
};

const typeLabel: Record<EnvironmentalZone['type'], string> = {
  deforestation: 'Deforestation Risk',
  biodiversity: 'Biodiversity Hotspot',
  'wildlife-corridor': 'Wildlife Corridor',
};

function TypeIcon({ type, className }: { type: EnvironmentalZone['type']; className?: string }) {
  if (type === 'deforestation') return <TreePine className={className} />;
  if (type === 'biodiversity') return <Leaf className={className} />;
  return <Footprints className={className} />;
}

// Extra context data per zone
const extraContext: Record<string, { dataSource: string; formed: string; area: string; orgLink: string; orgName: string; funFact: string }> = {
  'zone-se-1': {
    dataSource: 'Swedish Environmental Protection Agency (Naturvårdsverket)',
    formed: 'Protected since 1993 — but buffer zones remain unprotected',
    area: '4,970 hectares of ancient boreal forest',
    orgLink: 'https://www.tyresta.se',
    orgName: 'Tyresta National Park Foundation',
    funFact: 'Some of the Scots pines in Tyresta are over 400 years old — older than Sweden as a nation.',
  },
  'zone-se-2': {
    dataSource: 'Scandinavian Wolf Research Project (SKANDULV)',
    formed: 'Wolves reintroduced 1983 after near-extinction',
    area: 'Primary territory spans 15,000 km²',
    orgLink: 'https://www.naturskyddsforeningen.se',
    orgName: 'Swedish Society for Nature Conservation',
    funFact: 'A wolf pack\'s territory in Dalarna can cover 1,000 km² — larger than the city of London.',
  },
  'zone-se-3': {
    dataSource: 'WWF Global Forest Watch 2024',
    formed: 'Threats escalated since 1990s pulp industry expansion',
    area: '~800,000 km² of boreal forest in northern Sweden',
    orgLink: 'https://skyddaskogen.se',
    orgName: 'Protect the Forest Sweden',
    funFact: 'Sweden\'s boreal forests store as much carbon as 2 full years of Sweden\'s total CO₂ emissions.',
  },
  'zone-se-4': {
    dataSource: 'UNESCO World Heritage Committee 1996',
    formed: 'Designated UNESCO World Heritage Site in 1996',
    area: '9,400 km² of wilderness including 4 national parks',
    orgLink: 'https://www.fjallraven.com/fjallraven-foundation',
    orgName: 'Fjällräven Foundation',
    funFact: 'The Laponian Area is one of the largest intact wilderness areas in Europe, still managed by the Sami people.',
  },
  'zone-se-5': {
    dataSource: 'LKAB Kiruna Mine & Swedish Geological Survey',
    formed: 'Mining began 1898; displacement accelerated 2004–present',
    area: '83 km² of sub-Arctic forest directly impacted',
    orgLink: 'https://www.sametinget.se',
    orgName: 'The Sami Parliament of Sweden',
    funFact: 'The entire city of Kiruna (population 18,000) is being physically relocated 3 km east due to underground mining subsidence.',
  },
};

export function ZoneDetailModal({ zone, takenActions, onActionTaken, onClose }: ZoneDetailModalProps) {
  const styles = severityStyles[zone.severity];
  const ctx = extraContext[zone.id];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}
      >
        {/* Severity bar */}
        <div className={`h-1.5 ${styles.bar}`} />

        {/* Header */}
        <div className={`bg-gradient-to-br ${styles.bg} border-b ${styles.border} p-4`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${styles.badge} flex items-center justify-center flex-shrink-0`}>
                <TypeIcon type={zone.type} className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">{zone.name}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles.badge}`}>
                    {zone.severity.charAt(0).toUpperCase() + zone.severity.slice(1)} Risk
                  </span>
                  <span className="text-xs text-gray-500">{typeLabel[zone.type]}</span>
                  <span className="text-xs text-gray-400">{zone.lat.toFixed(2)}°N, {zone.lng.toFixed(2)}°E</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/60 hover:bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 max-h-[72vh] overflow-y-auto">
          {/* Story */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">The situation</div>
            <p className="text-sm text-gray-700 leading-relaxed">{zone.story}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-red-50 p-2.5 rounded-xl text-center">
              <div className="text-xl font-bold text-red-600">{zone.impact.treeLoss}%</div>
              <div className="text-xs text-gray-500">Tree loss since 2000</div>
            </div>
            <div className="bg-blue-50 p-2.5 rounded-xl text-center">
              <div className="text-xl font-bold text-blue-600">{zone.impact.affectedSpecies.length}</div>
              <div className="text-xs text-gray-500">Species at risk</div>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-xl text-center">
              <div className="text-xl font-bold text-amber-600">{(zone.impact.habitatLoss / 1000).toFixed(0)}k</div>
              <div className="text-xs text-gray-500">m² habitat lost</div>
            </div>
          </div>

          {/* Species */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Species at risk</div>
            <div className="flex flex-wrap gap-1.5">
              {zone.impact.affectedSpecies.map((s) => (
                <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">{s}</span>
              ))}
            </div>
          </div>

          {/* Extra context */}
          {ctx && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Key facts</div>
              {[
                { label: 'Area covered', value: ctx.area },
                { label: 'Status', value: ctx.formed },
                { label: 'Data source', value: ctx.dataSource },
              ].map((item) => (
                <div key={item.label} className="flex gap-2 text-xs">
                  <span className="text-gray-400 flex-shrink-0 w-20">{item.label}</span>
                  <span className="text-gray-700">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Fun fact */}
          {ctx && (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">💡</span>
                <p className="text-xs text-gray-700 leading-relaxed italic">{ctx.funFact}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Take action
            </div>
            <div className="space-y-2">
              {zone.microActions.map((action) => {
                const taken = takenActions.includes(action.id);
                return (
                  <motion.button
                    key={action.id}
                    whileHover={{ scale: taken ? 1 : 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={taken}
                    onClick={() => !taken && onActionTaken(action)}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                      taken
                        ? 'bg-green-50 border-green-200 opacity-75'
                        : 'bg-white border-gray-100 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {taken ? '✓ ' : ''}{action.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{action.description}</div>
                        <div className="text-xs text-green-600 font-medium mt-1">{action.impact}</div>
                      </div>
                      {action.cost && (
                        <div className="text-center flex-shrink-0">
                          <div className="text-base font-bold text-green-600">${action.cost}</div>
                          <div className="text-xs text-gray-400">donate</div>
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* External link */}
          {ctx && (
            <a
              href={ctx.orgLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-colors group"
            >
              <div>
                <div className="text-xs font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">{ctx.orgName}</div>
                <div className="text-xs text-gray-400">Learn more & donate</div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
