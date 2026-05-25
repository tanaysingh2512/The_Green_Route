import { MaterialIcon } from './MaterialIcon';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from './ui/hover-card';

export function DataSourceInfo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button className="flex items-center gap-1 text-xs text-[#5f6368] hover:text-[#202124] transition-colors">
          <MaterialIcon icon="info" size={14} />
          <span>Data Sources</span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" side="top">
        <div className="space-y-2">
          <h4 className="text-sm text-[#202124]" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}>Environmental Data Sources</h4>
          <div className="space-y-2 text-xs text-[#5f6368]">
            <div>
              <div className="text-[#188038]" style={{ fontWeight: 500 }}>WWF GLOBIL</div>
              <p>Deforestation front data tracking forest loss since 2000</p>
            </div>
            <div>
              <div className="text-[#1a73e8]" style={{ fontWeight: 500 }}>Biodiversity Risk Layers</div>
              <p>Species habitat data and conservation priority zones</p>
            </div>
            <div>
              <div className="text-[#7b1fa2]" style={{ fontWeight: 500 }}>Wildlife Corridors</div>
              <p>Migration routes and critical habitat connections</p>
            </div>
          </div>
          <p className="text-xs text-[#9aa0a6] italic pt-2 border-t border-[#e8eaed]">
            Demo uses mock data. Production would integrate real-time environmental datasets.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
