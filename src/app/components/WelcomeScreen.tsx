import { motion } from 'motion/react';
import { MaterialIcon } from './MaterialIcon';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WelcomeScreenProps {
  onDismiss: () => void;
}

export function WelcomeScreen({ onDismiss }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        className="max-w-2xl w-full"
      >
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 8px 32px rgba(60,64,67,0.22)' }}
        >
          {/* Hero Image */}
          <div className="relative h-56 overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1604241119889-ec30a89173a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBmb3Jlc3QlMjBncmVlbiUyMGxhbmRzY2FwZSUyMG5hdHVyZXxlbnwxfHx8fDE3NzM1MDgxMjB8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Aerial forest"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Close button */}
            <button
              onClick={onDismiss}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
            >
              <MaterialIcon icon="close" size={18} />
            </button>

            {/* Brand */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              {/* Google Maps pin logo — blue */}
              <svg width="18" height="26" viewBox="0 0 24 34" fill="none" aria-hidden="true">
                <ellipse cx="12" cy="33" rx="4" ry="1.5" fill="rgba(0,0,0,0.18)"/>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 22 12 22S24 21 24 12C24 5.37 18.63 0 12 0z" fill="#1A73E8"/>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 2.5.75 4.83 2.05 6.77C4.6 8.1 9.8 2.1 16.5 0.7A11.96 11.96 0 0 0 12 0z" fill="#4285F4" opacity="0.5"/>
                <circle cx="12" cy="12" r="5.5" fill="white"/>
                <circle cx="12" cy="12" r="2.5" fill="#1A73E8"/>
              </svg>
              <span className="text-white drop-shadow" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 400, fontSize: '18px' }}>Maps</span>
              <span className="text-xs bg-white/20 text-white/90 px-2 py-0.5 rounded-full backdrop-blur-sm" style={{ fontWeight: 500 }}>🌱 Eco Layer</span>
            </div>

            {/* Headline */}
            <div className="absolute bottom-4 left-5 right-5 text-white">
              <h2 className="text-2xl mb-1 drop-shadow-lg" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 700 }}>Turn Every Journey into Environmental Action</h2>
              <p className="text-sm opacity-90 drop-shadow" style={{ fontFamily: "'Roboto', sans-serif" }}>
                The route you choose today helps determine whether forests still stand here tomorrow.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: 'map',
                  color: 'text-[#1a73e8]',
                  bg: 'bg-[#e8f0fe] border-[#d2e3fc]',
                  title: 'Plan Your Route',
                  desc: 'Enter your destination just like any maps app',
                },
                {
                  icon: 'trending_up',
                  color: 'text-[#7b1fa2]',
                  bg: 'bg-[#f3e8fd] border-[#e8d0f9]',
                  title: 'See Hidden Impact',
                  desc: 'Discover forests at risk and biodiversity hotspots along the way',
                },
                {
                  icon: 'forest',
                  color: 'text-[#188038]',
                  bg: 'bg-[#e6f4ea] border-[#ceead6]',
                  title: 'Take Micro-Actions',
                  desc: 'Plant trees, choose eco-routes, or support restoration projects',
                },
                {
                  icon: 'favorite',
                  color: 'text-[#d93025]',
                  bg: 'bg-[#fce8e6] border-[#f5c6c0]',
                  title: 'Build Your Legacy',
                  desc: 'Track your impact and protect nature for your grandchildren',
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${item.bg}`}
                >
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0" style={{ boxShadow: '0 1px 2px rgba(60,64,67,0.1)' }}>
                    <MaterialIcon icon={item.icon} size={18} className={item.color} />
                  </div>
                  <div>
                    <div className="text-sm text-[#202124]" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}>{item.title}</div>
                    <div className="text-xs text-[#5f6368] mt-0.5">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quote card */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-[#188038] rounded-xl p-4 text-white"
            >
              <div className="flex items-start gap-3">
                <MaterialIcon icon="favorite" size={20} className="flex-shrink-0 mt-0.5 opacity-80" />
                <p className="text-sm leading-relaxed opacity-95" style={{ fontFamily: "'Roboto', sans-serif" }}>
                  We integrate environmental data into your everyday routes, making the planet-positive choice the easy choice.
                </p>
              </div>
            </motion.div>

            <button
              onClick={onDismiss}
              className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white h-11 rounded-full flex items-center justify-center transition-colors"
              style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}
            >
              Start Protecting Our Planet
            </button>

            <p className="text-xs text-center text-[#9aa0a6]" style={{ fontFamily: "'Roboto', sans-serif" }}>
              Using mock data based on WWF GLOBIL deforestation fronts and biodiversity risk layers
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}