import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { TreePine, Award, TrendingUp, Heart } from 'lucide-react';
import { UserImpact, achievements } from '../data/environmentalData';

interface ImpactDashboardProps {
  impact: UserImpact;
  recipientName?: string;
}

export function ImpactDashboard({ impact, recipientName = 'Noah' }: ImpactDashboardProps) {
  const nextMilestone = Math.ceil(impact.treesPlanted / 10) * 10;
  const progressToNext = (impact.treesPlanted % 10) * 10;

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Your Planet Impact</h3>
          <Badge variant="outline" className="bg-white">
            <Award className="w-3 h-3 mr-1" />
            Day {impact.streak}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.div
            className="bg-white p-3 rounded-lg shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <TreePine className="w-4 h-4 text-green-600" />
              <span className="text-xs text-gray-600">Trees Planted</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{impact.treesPlanted}</div>
          </motion.div>

          <motion.div
            className="bg-white p-3 rounded-lg shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-600">Forest Restored</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{impact.forestRestored}m²</div>
          </motion.div>

          <motion.div
            className="bg-white p-3 rounded-lg shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-xs text-gray-600">Wildlife Protected</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{impact.wildlifeProtected}</div>
          </motion.div>

          <motion.div
            className="bg-white p-3 rounded-lg shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🌍</span>
              <span className="text-xs text-gray-600">Carbon Offset</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">{impact.carbonOffset}kg</div>
          </motion.div>
        </div>

        <div className="bg-white p-3 rounded-lg">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Next milestone</span>
            <span className="font-semibold text-green-700">
              {impact.treesPlanted}/{nextMilestone} trees
            </span>
          </div>
          <Progress value={progressToNext} className="h-2" />
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold">Your Legacy for {recipientName}</h3>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          Every eco-choice on your journeys helps keep these forests and animals alive for{' '}
          {recipientName}'s future. You've made <span className="font-bold text-green-700">{impact.totalTrips}</span>{' '}
          planet-positive trips so far.
        </p>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3">Achievements</h3>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map((achievement) => {
            const unlocked = impact.achievements.some((a) => a.id === achievement.id);
            return (
              <motion.div
                key={achievement.id}
                className={`p-3 rounded-lg text-center ${
                  unlocked ? 'bg-green-100 border-2 border-green-300' : 'bg-gray-100 opacity-50'
                }`}
                whileHover={unlocked ? { scale: 1.1 } : {}}
              >
                <div className="text-3xl mb-1">{achievement.icon}</div>
                <div className="text-xs font-medium">{achievement.title}</div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
