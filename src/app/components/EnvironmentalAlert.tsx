import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertTriangle, TreePine, Leaf, Footprints } from 'lucide-react';
import { EnvironmentalZone, MicroAction } from '../data/environmentalData';

interface EnvironmentalAlertProps {
  zone: EnvironmentalZone;
  onActionTaken: (action: MicroAction) => void;
  index: number;
}

export function EnvironmentalAlert({ zone, onActionTaken, index }: EnvironmentalAlertProps) {
  const getIcon = () => {
    switch (zone.type) {
      case 'deforestation':
        return <TreePine className="w-5 h-5" />;
      case 'biodiversity':
        return <Leaf className="w-5 h-5" />;
      case 'wildlife-corridor':
        return <Footprints className="w-5 h-5" />;
    }
  };

  const getSeverityColor = () => {
    switch (zone.severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`p-4 border-l-4 ${getSeverityColor()}`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${getSeverityColor()}`}>
            {getIcon()}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{zone.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {zone.severity} impact
                </Badge>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{zone.story}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 bg-white/50 p-2 rounded">
              <div>
                <div className="font-semibold text-red-600">{zone.impact.treeLoss}%</div>
                <div>Trees lost</div>
              </div>
              <div>
                <div className="font-semibold text-blue-600">{zone.impact.affectedSpecies.length}</div>
                <div>Species at risk</div>
              </div>
              <div>
                <div className="font-semibold text-green-600">
                  {(zone.impact.habitatLoss / 1000).toFixed(0)}k m²
                </div>
                <div>Habitat loss</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <AlertTriangle className="w-4 h-4" />
                <span>You can help right now:</span>
              </div>
              <div className="space-y-2">
                {zone.microActions.map((action) => (
                  <motion.div
                    key={action.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 hover:bg-green-50 hover:border-green-300"
                      onClick={() => onActionTaken(action)}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{action.title}</div>
                        <div className="text-xs text-gray-600">{action.description}</div>
                        <div className="text-xs text-green-700 font-medium mt-1">
                          ✓ {action.impact}
                        </div>
                      </div>
                      {action.cost && (
                        <div className="ml-2 text-sm font-semibold text-green-600">
                          ${action.cost}
                        </div>
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
