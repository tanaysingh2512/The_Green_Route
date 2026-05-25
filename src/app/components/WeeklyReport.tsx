import { motion } from 'motion/react';
import { X, TreePine, Leaf, TrendingUp, Heart, Award, Calendar } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { UserImpact } from '../data/environmentalData';
import { Button } from './ui/button';

interface WeeklyReportProps {
  impact: UserImpact;
  onClose: () => void;
}

const weeklyData = [
  { day: 'Mon', actions: 2, trees: 1, co2: 35 },
  { day: 'Tue', actions: 0, trees: 0, co2: 0 },
  { day: 'Wed', actions: 3, trees: 1, co2: 50 },
  { day: 'Thu', actions: 1, trees: 1, co2: 20 },
  { day: 'Fri', actions: 4, trees: 2, co2: 80 },
  { day: 'Sat', actions: 2, trees: 1, co2: 35 },
  { day: 'Sun', actions: 3, trees: 1, co2: 45 },
];

const totalWeekActions = weeklyData.reduce((s, d) => s + d.actions, 0);
const totalWeekTrees = weeklyData.reduce((s, d) => s + d.trees, 0);
const totalWeekCo2 = weeklyData.reduce((s, d) => s + d.co2, 0);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-2.5 text-xs">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-green-600">🌱 {payload[0]?.value} action{payload[0]?.value !== 1 ? 's' : ''}</p>
        <p className="text-emerald-600">🌲 {payload[1]?.value} tree{payload[1]?.value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
};

export function WeeklyReport({ impact, onClose }: WeeklyReportProps) {
  const avgActionsPerDay = (totalWeekActions / 7).toFixed(1);
  const betterThanAvg = 68; // mock: 68% of users

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
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.22)' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Weekly Nature Report</h2>
              <p className="text-sm opacity-80">March 8 – 14, 2026</p>
            </div>
          </div>
          {/* Headline stat */}
          <div className="bg-white/15 rounded-xl p-3">
            <p className="text-sm opacity-90">
              🎉 You were <span className="font-bold text-yellow-300">{betterThanAvg}% more eco-conscious</span> than the average driver this week!
            </p>
          </div>
        </div>

        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {/* Weekly totals */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: <TreePine className="w-3.5 h-3.5 text-green-600" />, label: 'Trees', value: totalWeekTrees, unit: '', bg: 'bg-green-50' },
              { icon: <Leaf className="w-3.5 h-3.5 text-emerald-600" />, label: 'Actions', value: totalWeekActions, unit: '', bg: 'bg-emerald-50' },
              { icon: <TrendingUp className="w-3.5 h-3.5 text-blue-600" />, label: 'CO₂ saved', value: totalWeekCo2, unit: 'kg', bg: 'bg-blue-50' },
              { icon: <Award className="w-3.5 h-3.5 text-amber-600" />, label: 'Streak', value: impact.streak, unit: 'd', bg: 'bg-amber-50' },
            ].map((stat) => (
              <div key={stat.label} className={`${stat.bg} rounded-xl p-2.5 text-center`}>
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <div className="text-lg font-bold text-gray-800">{stat.value}<span className="text-xs font-normal text-gray-500">{stat.unit}</span></div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Daily activity this week</div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={weeklyData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                <Bar name="eco-actions" dataKey="actions" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar name="trees-planted" dataKey="trees" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-1 justify-center">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                Eco-actions
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-300" />
                Trees planted
              </div>
            </div>
          </div>

          {/* Savings summary */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 rounded-xl p-3 space-y-2">
            <div className="text-sm font-semibold text-green-800">This week you saved:</div>
            {[
              { emoji: '🌳', text: `${totalWeekTrees} trees planted in Swedish forests` },
              { emoji: '💨', text: `${totalWeekCo2} kg of CO₂ kept out of the atmosphere` },
              { emoji: '🐺', text: 'Helped protect 3 wolf migration crossings' },
              { emoji: '🦊', text: 'Contributed to Arctic fox habitat restoration' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-2 text-xs text-gray-700">
                <span className="flex-shrink-0">{item.emoji}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Avg per day */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
            <span className="text-gray-600">Avg. eco-actions per day</span>
            <span className="font-bold text-emerald-700">{avgActionsPerDay}</span>
          </div>

          {/* Legacy */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-3 flex items-start gap-2">
            <Heart className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700 leading-relaxed">
              Every choice you made this week helps keep Sweden's forests alive for <span className="font-semibold">Noah's</span> future. Keep going! 🌲
            </p>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
          >
            Continue protecting the planet
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}