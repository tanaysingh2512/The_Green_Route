import { Button } from './ui/button';
import { Card } from './ui/card';
import { Map, Sparkles } from 'lucide-react';

interface QuickActionsProps {
  onDemo: () => void;
}

export function QuickActions({ onDemo }: QuickActionsProps) {
  return (
    <Card className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-900">New to Maps Eco Layer?</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onDemo}
          className="text-purple-700 border-purple-300 hover:bg-purple-100"
        >
          <Map className="w-4 h-4 mr-2" />
          Try Demo Route
        </Button>
      </div>
    </Card>
  );
}