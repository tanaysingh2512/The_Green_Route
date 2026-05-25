import { motion, AnimatePresence } from 'motion/react';
import { MaterialIcon } from './MaterialIcon';
import { UserImpact } from '../data/environmentalData';

interface ImpactFloatingBtnProps {
  impact: UserImpact;
  isOpen: boolean;
  onToggle: () => void;
  onWeeklyReport: () => void;
}

export function ImpactFloatingBtn({ impact, isOpen, onToggle, onWeeklyReport }: ImpactFloatingBtnProps) {
  return (
    <div className="absolute bottom-5 right-4 z-20 flex flex-col items-end gap-2">
      {/* Compact panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="bg-white rounded-2xl overflow-hidden w-60"
            style={{ boxShadow: '0 2px 10px rgba(60,64,67,0.18), 0 1px 3px rgba(60,64,67,0.12)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f3f4]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#e6f4ea] rounded-full flex items-center justify-center">
                  <MaterialIcon icon="forest" size={13} className="text-[#188038]" filled />
                </div>
                <span
                  className="text-sm text-[#202124]"
                  style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}
                >
                  My Impact
                </span>
              </div>
              <button
                onClick={onToggle}
                className="w-6 h-6 flex items-center justify-center text-[#5f6368] hover:bg-[#f1f3f4] rounded-full transition-colors"
              >
                <MaterialIcon icon="close" size={16} />
              </button>
            </div>

            {/* Stats — 2 key numbers only */}
            <div className="px-4 py-3 grid grid-cols-2 gap-2">
              <div className="bg-[#e6f4ea] rounded-xl p-2.5 text-center">
                <div
                  className="text-xl text-[#188038]"
                  style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 700 }}
                >
                  {impact.treesPlanted}
                </div>
                <div className="text-xs text-[#5f6368] mt-0.5">Trees planted</div>
              </div>
              <div className="bg-[#e8f0fe] rounded-xl p-2.5 text-center">
                <div
                  className="text-xl text-[#1a73e8]"
                  style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 700 }}
                >
                  {impact.carbonOffset}<span className="text-xs" style={{ fontWeight: 400 }}>kg</span>
                </div>
                <div className="text-xs text-[#5f6368] mt-0.5">CO₂ saved</div>
              </div>
            </div>

            {/* Eco route contributions */}
            {(impact.forestRestored > 0 || impact.wildlifeProtected > 0) && (
              <div className="px-4 pb-3 space-y-1.5">
                {impact.forestRestored > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#5f6368]">
                      <span className="w-2 h-2 rounded-full bg-[#188038]" />
                      Forest protected
                    </div>
                    <span className="text-[#188038]" style={{ fontWeight: 600 }}>
                      +{impact.forestRestored} m²
                    </span>
                  </div>
                )}
                {impact.wildlifeProtected > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#5f6368]">
                      <span className="w-2 h-2 rounded-full bg-[#1a73e8]" />
                      Species shielded
                    </div>
                    <span className="text-[#1a73e8]" style={{ fontWeight: 600 }}>
                      +{impact.wildlifeProtected}
                    </span>
                  </div>
                )}
                <div className="text-xs text-[#9aa0a6] pt-0.5">From your eco route choices</div>
              </div>
            )}

            {/* Weekly report link */}
            <div className="px-4 pb-3">
              <button
                onClick={() => { onToggle(); onWeeklyReport(); }}
                className="w-full flex items-center justify-between text-xs text-[#1a73e8] hover:bg-[#f8f9fa] px-3 py-2 rounded-lg transition-colors border border-[#e8eaed]"
                style={{ fontWeight: 500 }}
              >
                <span>View weekly report</span>
                <MaterialIcon icon="arrow_forward" size={14} className="text-[#1a73e8]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onToggle}
        className="bg-white rounded-full flex items-center gap-2 px-3.5 py-2.5 border border-[#dadce0] relative"
        style={{ boxShadow: '0 1px 4px rgba(60,64,67,0.25)' }}
      >
        <div className="w-6 h-6 bg-[#188038] rounded-full flex items-center justify-center">
          <MaterialIcon icon="forest" size={14} className="text-white" filled />
        </div>
        <span
          className="text-sm text-[#202124]"
          style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}
        >
          {impact.totalTrips > 0 ? `${impact.treesPlanted} trees` : 'My Impact'}
        </span>
        {impact.achievements.length > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#1a73e8] rounded-full flex items-center justify-center">
            <span className="text-white" style={{ fontSize: '9px', fontWeight: 700 }}>
              {impact.achievements.length}
            </span>
          </div>
        )}
      </motion.button>
    </div>
  );
}