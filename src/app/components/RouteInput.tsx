import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MapPin, Navigation } from 'lucide-react';
import { Card } from './ui/card';

interface RouteInputProps {
  onRouteSubmit: (start: string, destination: string) => void;
  isLoading?: boolean;
}

export function RouteInput({ onRouteSubmit, isLoading }: RouteInputProps) {
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (start && destination) {
      onRouteSubmit(start, destination);
    }
  };

  return (
    <Card className="p-4 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
          <Input
            type="text"
            placeholder="Starting point (e.g., Seattle, WA)"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <Input
            type="text"
            placeholder="Destination (e.g., Portland, OR)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="flex-1"
          />
        </div>
        <Button
          type="submit"
          disabled={!start || !destination || isLoading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isLoading ? 'Analyzing route...' : 'Find Planet-Friendly Route'}
        </Button>
      </form>
    </Card>
  );
}
