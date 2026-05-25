import { motion } from 'motion/react';
import { MaterialIcon } from './MaterialIcon';

interface PostTripSummaryProps {
  treesPlanted: number;
  forestRestored: number;
  carbonOffset: number;
  wildlifeProtected: number;
  actionsCompleted: number;
  recipientName?: string;
  onClose: () => void;
}

export function PostTripSummary({
  treesPlanted,
  forestRestored,
  carbonOffset,
  wildlifeProtected,
  actionsCompleted,
  recipientName = 'Explorer',
  onClose,
}: PostTripSummaryProps) {
  const stats = [
    { icon: 'park', label: 'Trees planted', value: treesPlanted, unit: '', color: '#188038', bg: '#e6f4ea' },
    { icon: 'forest', label: 'Forest protected', value: forestRestored, unit: ' m²', color: '#137333', bg: '#e6f4ea' },
    { icon: 'co2', label: 'Carbon offset', value: carbonOffset, unit: ' kg', color: '#1A73E8', bg: '#e8f0fe' },
    { icon: 'pets', label: 'Wildlife shielded', value: wildlifeProtected, unit: ' species', color: '#e37400', bg: '#fef7e0' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(32,33,36,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden"
        style={{ boxShadow: '0 24px 48px rgba(60,64,67,0.30)' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-[#188038] to-[#137333] px-6 pt-8 pb-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <MaterialIcon icon="close" size={20} className="text-white" />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <MaterialIcon icon="emoji_nature" size={36} className="text-white" />
          </div>
          <h2
            className="text-xl text-white mb-1"
            style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 600 }}
          >
            Trip Complete!
          </h2>
          <p className="text-sm text-white/80">
            Great work, {recipientName} — here's your environmental impact this trip.
          </p>
          {actionsCompleted > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
              <MaterialIcon icon="task_alt" size={14} className="text-white" />
              <span className="text-xs text-white" style={{ fontWeight: 500 }}>
                {actionsCompleted} eco action{actionsCompleted !== 1 ? 's' : ''} completed
              </span>
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="p-5 grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl p-3 text-center"
              style={{ backgroundColor: s.bg }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2"
                style={{ backgroundColor: s.color + '22' }}
              >
                <MaterialIcon icon={s.icon} size={20} style={{ color: s.color }} />
              </div>
              <div
                className="text-lg"
                style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 700, color: s.color }}
              >
                {s.value > 0 ? `${s.value}${s.unit}` : '—'}
              </div>
              <div className="text-xs text-[#5f6368] mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          {carbonOffset === 0 && treesPlanted === 0 ? (
            <p className="text-xs text-[#5f6368] text-center mb-4">
              Choose an eco route on your next trip to start earning impact credits!
            </p>
          ) : (
            <p className="text-xs text-[#5f6368] text-center mb-4">
              Every eco choice counts. Keep it up on your next journey! 🌍
            </p>
          )}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full text-sm text-white transition-opacity hover:opacity-90"
            style={{
              backgroundColor: '#188038',
              fontFamily: "'Google Sans', sans-serif",
              fontWeight: 500,
            }}
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
