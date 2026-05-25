import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, TreePine, Leaf, Wind, Heart, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from './ui/button';

interface ArrivalCelebrationProps {
  destination: string;
  treesPlanted: number;
  co2Saved: number;
  actionsCount: number;
  onContinue: () => void;
  onClose: () => void;
}

export function ArrivalCelebration({
  destination,
  treesPlanted,
  co2Saved,
  actionsCount,
  onContinue,
  onClose,
}: ArrivalCelebrationProps) {
  useEffect(() => {
    // Burst confetti on arrival
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5, x: 0.65 },
      colors: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#60a5fa'],
    });
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 50,
        origin: { x: 0.3, y: 0.5 },
        colors: ['#10b981', '#f59e0b', '#8b5cf6'],
      });
    }, 300);
  }, []);

  const messages = [
    actionsCount === 0
      ? "You made it safely! Next time, explore the eco-zones along your route."
      : treesPlanted > 0
      ? `The forests you helped protect are breathing easier because of this trip.`
      : `Every eco-choice you made today helps keep Sweden's wilderness alive.`,
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none"
      >
        {/* Toast-style arrival notification */}
        <motion.div
          initial={{ y: 120, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 120, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          className="pointer-events-auto mb-8 mx-4 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.24)' }}
        >
          {/* Green top bar */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500" />

          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring', damping: 12 }}
                  className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <MapPin className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    You've arrived at {destination}! 🎉
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {actionsCount > 0
                      ? `${actionsCount} eco-action${actionsCount !== 1 ? 's' : ''} taken on this journey`
                      : 'Safe and sound'}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Impact row */}
            {actionsCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mb-3"
              >
                {treesPlanted > 0 && (
                  <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-full px-2.5 py-1">
                    <TreePine className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">{treesPlanted} tree{treesPlanted !== 1 ? 's' : ''} planted</span>
                  </div>
                )}
                {co2Saved > 0 && (
                  <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1">
                    <Wind className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700">-{co2Saved}kg CO₂</span>
                  </div>
                )}
                {actionsCount > 0 && (
                  <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700">{actionsCount} action{actionsCount !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 mb-3"
            >
              <Heart className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700 leading-relaxed">{messages[0]}</p>
            </motion.div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-gray-200 text-gray-600 h-8 text-xs"
                onClick={onClose}
              >
                Dismiss
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white h-8 text-xs"
                onClick={onContinue}
              >
                See full impact 🌱
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
