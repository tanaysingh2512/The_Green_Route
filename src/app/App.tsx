import { useState, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { MapView } from './components/MapView';
import { SidePanel } from './components/SidePanel';
import { PostTripSummary } from './components/PostTripSummary';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ImpactFloatingBtn } from './components/ImpactFloatingBtn';
import { NearbyEnvironment } from './components/NearbyEnvironment';
import { WeeklyReport } from './components/WeeklyReport';
import { ArrivalCelebration } from './components/ArrivalCelebration';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import {
  getZonesForLocation,
  EnvironmentalZone,
  MicroAction,
  UserImpact,
  achievements,
} from './data/environmentalData';
import {
  analyzeRoute,
  RouteAnalysisResult,
  VehicleType,
} from './services/routeAnalysis';

interface LatLngLiteral { lat: number; lng: number; }

export type AllRoutes = Record<string, LatLngLiteral[]>;

const MAPS_API_KEY = 'AIzaSyBXpgwouwVPyjPPRnkuaJHybJH6fYDyaDM';
const ROUTES_URL   = 'https://routes.googleapis.com/directions/v2:computeRoutes';

// ── Decode Google encoded polyline ────────────────────────────────────────────
function decodePolyline(encoded: string): LatLngLiteral[] {
  const pts: LatLngLiteral[] = [];
  let i = 0, lat = 0, lng = 0;
  while (i < encoded.length) {
    let s = 0, r = 0, b: number;
    do { b = encoded.charCodeAt(i++) - 63; r |= (b & 0x1f) << s; s += 5; } while (b >= 0x20);
    lat += (r & 1) ? ~(r >> 1) : r >> 1;
    s = 0; r = 0;
    do { b = encoded.charCodeAt(i++) - 63; r |= (b & 0x1f) << s; s += 5; } while (b >= 0x20);
    lng += (r & 1) ? ~(r >> 1) : r >> 1;
    pts.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return pts;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h} h ${m} min` : `${m} min`;
}

function formatDistance(metres: number): string {
  return metres >= 1000 ? `${(metres / 1000).toFixed(1)} km` : `${metres} m`;
}

// ── Routes API helper ─────────────────────────────────────────────────────────
async function fetchRoute(body: object): Promise<LatLngLiteral[] | null> {
  try {
    const res = await fetch(ROUTES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': MAPS_API_KEY,
        'X-Goog-FieldMask': 'routes.polyline.encodedPolyline',
      },
      body: JSON.stringify({ ...body, travelMode: 'DRIVE', languageCode: 'en-US', units: 'METRIC' }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const encoded = data?.routes?.[0]?.polyline?.encodedPolyline;
    return encoded ? decodePolyline(encoded) : null;
  } catch {
    return null;
  }
}

export default function App() {
  // All three route paths keyed by route-id
  const [allRoutes, setAllRoutes] = useState<AllRoutes>({});
  // The currently-active path (for zone analysis)
  const [route, setRoute]              = useState<LatLngLiteral[]>([]);
  const [affectedZones, setAffectedZones] = useState<EnvironmentalZone[]>([]);
  const [isLoading, setIsLoading]      = useState(false);
  const [showTripSummary, setShowTripSummary] = useState(false);
  const [showWelcome, setShowWelcome]  = useState(true);
  const [showImpact, setShowImpact]    = useState(false);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);
  const [showArrival, setShowArrival]  = useState(false);
  const [tripActions, setTripActions]  = useState<MicroAction[]>([]);
  const [startPoint, setStartPoint]    = useState<LatLngLiteral | undefined>();
  const [endPoint, setEndPoint]        = useState<LatLngLiteral | undefined>();
  const [startLabel, setStartLabel]    = useState('');
  const [endLabel, setEndLabel]        = useState('');
  const [routeDistance, setRouteDistance] = useState('');
  const [routeDuration, setRouteDuration] = useState('');
  const [vehicleType, setVehicleType]  = useState<VehicleType>('petrol-euro6');
  const [analysisResult, setAnalysisResult] = useState<Partial<RouteAnalysisResult>>({});
  const [selectedRouteId, setSelectedRouteId] = useState('eco-balanced');

  // Track which eco routes have already been credited this session
  const creditedRoutesRef = useRef<Set<string>>(new Set());

  const [userImpact, setUserImpact] = useState<UserImpact>({
    treesPlanted: 0, forestRestored: 0, wildlifeProtected: 0,
    carbonOffset: 0, streak: 1, totalTrips: 0, achievements: [],
  });

  // ── Zone detection ────────────────────────────────────────────────────────────
  const analyzeRouteForZones = (pts: LatLngLiteral[]): EnvironmentalZone[] => {
    const found = new Map<string, EnvironmentalZone>();
    pts.forEach(p => getZonesForLocation(p.lat, p.lng).forEach(z => { if (!found.has(z.id)) found.set(z.id, z); }));
    return Array.from(found.values());
  };

  // ── Finish route: run zone + emissions analysis on a given path ───────────────
  const finishRoute = (
    pts: LatLngLiteral[],
    distance: string,
    duration: string,
    silent = false,
  ) => {
    const zones = analyzeRouteForZones(pts);
    setAffectedZones(zones);
    setRoute(pts);
    setAnalysisResult({});
    analyzeRoute(pts, distance, duration, vehicleType,
      partial => setAnalysisResult(prev => ({ ...prev, ...partial })));
    if (!silent) {
      toast.success(
        zones.length > 0
          ? `Route found! ${zones.length} environmental zone${zones.length !== 1 ? 's' : ''} detected.`
          : 'Route found! No known environmental hotspots along this route.',
        { description: zones.length > 0 ? 'Tap a zone below to see how you can help.' : 'Your journey looks clean — keep exploring!' }
      );
    }
  };

  // ── Main route fetch — 3 parallel calls for real alternative paths ─────────
  const handleRouteSubmit = async (start: string, destination: string) => {
    setIsLoading(true);
    setTripActions([]);
    setStartLabel(start);
    setEndLabel(destination);
    setRouteDistance('');
    setRouteDuration('');
    setAllRoutes({});

    const origin      = { address: start };
    const destination_ = { address: destination };

    try {
      // ── Primary call: fastest route + leg info for markers ──────────────────
      const primaryRes = await fetch(ROUTES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': MAPS_API_KEY,
          'X-Goog-FieldMask': [
            'routes.duration',
            'routes.distanceMeters',
            'routes.polyline.encodedPolyline',
            'routes.legs.startLocation',
            'routes.legs.endLocation',
          ].join(','),
        },
        body: JSON.stringify({
          origin,
          destination: destination_,
          travelMode: 'DRIVE',
          routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
          languageCode: 'en-US',
          units: 'METRIC',
        }),
      });

      if (!primaryRes.ok) {
        const errBody = await primaryRes.json().catch(() => ({}));
        throw new Error(errBody?.error?.message ?? `Routes API HTTP ${primaryRes.status}`);
      }

      const primaryData = await primaryRes.json();
      const r = primaryData?.routes?.[0];
      if (!r) throw new Error('No routes returned');

      const standardPts = decodePolyline(r.polyline.encodedPolyline);
      const leg         = r.legs?.[0];
      const startLoc    = leg?.startLocation?.latLng;
      const endLoc      = leg?.endLocation?.latLng;
      const dist        = formatDistance(r.distanceMeters ?? 0);
      const dur         = formatDuration(parseInt(r.duration ?? '0', 10));

      if (startLoc) setStartPoint({ lat: startLoc.latitude, lng: startLoc.longitude });
      if (endLoc)   setEndPoint({ lat: endLoc.latitude, lng: endLoc.longitude });
      setRouteDistance(dist);
      setRouteDuration(dur);

      // ── Parallel: eco-balanced (avoid tolls) + planet-hero (avoid highways) ─
      const [ecoPts, heroPts] = await Promise.all([
        fetchRoute({ origin, destination: destination_, routingPreference: 'TRAFFIC_AWARE', routeModifiers: { avoidTolls: true } }),
        fetchRoute({ origin, destination: destination_, routeModifiers: { avoidHighways: true } }),
      ]);

      // Build the full allRoutes map
      const map: AllRoutes = {
        'standard':     standardPts,
        'eco-balanced': ecoPts ?? standardPts,    // same path if toll-free unavailable
        'planet-hero':  heroPts ?? (ecoPts ?? standardPts), // same path if no highway-free route
      };
      setAllRoutes(map);

      // Run zone analysis on the currently-selected route
      const initialPath = map[selectedRouteId] ?? standardPts;
      finishRoute(initialPath, dist, dur);

    } catch (primaryErr: any) {
      // ── Fallback: legacy DirectionsService ─────────────────────────────────
      console.warn('Routes API failed, falling back:', primaryErr?.message);
      const g = (window as any).google as typeof google | undefined;
      if (!g?.maps) {
        toast.error('Map is still loading — please try again in a moment.');
        setIsLoading(false);
        return;
      }

      try {
        let svc: google.maps.DirectionsService;
        if (typeof g.maps.importLibrary === 'function') {
          const lib = await g.maps.importLibrary('routes') as google.maps.RoutesLibrary;
          svc = new lib.DirectionsService();
        } else {
          svc = new g.maps.DirectionsService();
        }

        // Request alternatives for eco/hero options
        const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) =>
          svc.route({
            origin: start, destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true,
          }, (res, status) => {
            if (status === 'OK' && res) resolve(res);
            else reject(new Error(status ?? 'UNKNOWN'));
          })
        );

        const buildPts = (r: google.maps.DirectionsRoute): LatLngLiteral[] =>
          r.overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }));

        const leg     = result.routes[0].legs[0];
        const pts0    = buildPts(result.routes[0]);
        const pts1    = result.routes[1] ? buildPts(result.routes[1]) : pts0;
        const pts2    = result.routes[2] ? buildPts(result.routes[2]) : pts1;

        setStartPoint({ lat: leg.start_location.lat(), lng: leg.start_location.lng() });
        setEndPoint({ lat: leg.end_location.lat(), lng: leg.end_location.lng() });
        const dist = leg.distance?.text ?? '';
        const dur  = leg.duration?.text ?? '';
        setRouteDistance(dist);
        setRouteDuration(dur);

        const map: AllRoutes = { 'standard': pts0, 'eco-balanced': pts1, 'planet-hero': pts2 };
        setAllRoutes(map);
        finishRoute(map[selectedRouteId] ?? pts0, dist, dur);

      } catch (fbErr: any) {
        const msg = (fbErr?.message ?? '').toUpperCase();
        toast.error(
          msg === 'NOT_FOUND'      ? 'Could not find one of the locations. Try a more specific address.' :
          msg === 'ZERO_RESULTS'   ? 'No driving route found between these two places.' :
          msg === 'REQUEST_DENIED' ? 'Directions API denied — check the API key is enabled.' :
          `Directions error: ${fbErr?.message ?? 'unknown'}`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Route selection: switch displayed path + re-run zone analysis ────────────
  const handleSelectRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
    const pts = allRoutes[routeId];
    if (pts && pts.length > 0) {
      finishRoute(pts, routeDistance, routeDuration, true /* silent */);
    }

    // Credit environmental impact once per route choice per session
    if (routeId !== 'standard' && !creditedRoutesRef.current.has(routeId)) {
      creditedRoutesRef.current.add(routeId);

      const baseKm  = parseFloat(routeDistance.replace(/[^0-9.]/g, '')) || 0;
      const baseCO2 = (analysisResult as any).emissions?.co2Kg ?? (baseKm * 0.19);

      // eco-balanced saves ~18%, planet-hero saves ~36%
      const co2Saved     = Math.round(baseCO2 * (routeId === 'planet-hero' ? 0.36 : 0.18));
      const forestSaved  = routeId === 'planet-hero' ? 30 : 15;
      const wildlifeSaved = routeId === 'planet-hero' ? 8 : 4;

      setUserImpact(prev => {
        const updated = {
          ...prev,
          carbonOffset:      prev.carbonOffset      + Math.max(co2Saved, 1),
          forestRestored:    prev.forestRestored     + forestSaved,
          wildlifeProtected: prev.wildlifeProtected  + wildlifeSaved,
        };
        checkAchievements(updated);
        return updated;
      });

      const label = routeId === 'eco-balanced' ? 'Eco-Balanced' : 'Planet Hero';
      toast.success(`${routeId === 'eco-balanced' ? '🌿' : '🌍'} ${label} route chosen`, {
        description: co2Saved > 0
          ? `+${co2Saved} kg CO₂ saved · +${forestSaved} m² forest protected`
          : `+${forestSaved} m² forest protected · +${wildlifeSaved} species shielded`,
        duration: 3500,
      });
    } else if (routeId === 'standard') {
      toast(`⚡ Fastest Route`, {
        description: 'Switched to fastest — choose Eco-Balanced or Planet Hero to earn impact credits.',
        duration: 2500,
      });
    }
  };

  // ── Actions ───────────────────────────────────────────────────────────────────
  const handleActionTaken = (action: MicroAction) => {
    setTripActions(prev => [...prev, action]);
    setUserImpact(prev => {
      const u = { ...prev };
      switch (action.type) {
        case 'plant-tree':       u.treesPlanted += 1; u.forestRestored += 12; u.carbonOffset += 20; break;
        case 'eco-route':        u.wildlifeProtected += 5; u.carbonOffset += 15; break;
        case 'slow-down':        u.wildlifeProtected += 3; break;
        case 'support-project':  u.forestRestored += 25; u.carbonOffset += 30; break;
      }
      checkAchievements(u);
      return u;
    });
    toast.success(`Action completed: ${action.title}`, { description: action.impact, icon: '🌱' });
  };

  const checkAchievements = (impact: UserImpact) => {
    const na = [...impact.achievements];
    if (impact.treesPlanted >= 1 && !na.some(a => a.id === 'first-tree')) {
      const a = achievements.find(a => a.id === 'first-tree')!;
      na.push({ ...a, unlockedAt: new Date() });
      toast.success(`🏆 Achievement: ${a.title}`, { description: a.description });
    }
    if (impact.treesPlanted >= 10 && !na.some(a => a.id === 'forest-guardian')) {
      const a = achievements.find(a => a.id === 'forest-guardian')!;
      na.push({ ...a, unlockedAt: new Date() });
      toast.success(`🏆 Achievement: ${a.title}`, { description: a.description });
    }
    if (impact.forestRestored >= 100 && !na.some(a => a.id === 'legacy-builder')) {
      const a = achievements.find(a => a.id === 'legacy-builder')!;
      na.push({ ...a, unlockedAt: new Date() });
      toast.success(`🏆 Achievement: ${a.title}`, { description: a.description });
    }
    setUserImpact(prev => ({ ...prev, achievements: na }));
  };

  const handleCompleteTrip = () => {
    setUserImpact(prev => ({ ...prev, totalTrips: prev.totalTrips + 1, streak: prev.streak + 1 }));
    setShowArrival(true);
  };

  const handleDemoRoute = () => handleRouteSubmit('Stockholm, Sweden', 'Berlin, Germany');

  const handleClearRoute = () => {
    setRoute([]);
    setAllRoutes({});
    setAffectedZones([]);
    setStartPoint(undefined);
    setEndPoint(undefined);
    setTripActions([]);
    setStartLabel('');
    setEndLabel('');
    setRouteDistance('');
    setRouteDuration('');
    setAnalysisResult({});
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden relative bg-gray-200">
      <Toaster position="top-right" />

      {/* Full-screen Map */}
      <div className="absolute inset-0">
        <MapView
          allRoutes={allRoutes}
          environmentalZones={affectedZones}
          start={startPoint}
          destination={endPoint}
          selectedRouteId={selectedRouteId}
          onSelectRoute={handleSelectRoute}
        />
      </div>

      {/* Left Side Panel */}
      <div className="relative z-10 flex h-full">
        <SidePanel
          affectedZones={affectedZones}
          tripActions={tripActions}
          isLoading={isLoading}
          startLabel={startLabel}
          endLabel={endLabel}
          routeDistance={routeDistance}
          routeDuration={routeDuration}
          vehicleType={vehicleType}
          analysisResult={analysisResult}
          selectedRouteId={selectedRouteId}
          onSelectRoute={handleSelectRoute}
          onVehicleChange={(v) => {
            setVehicleType(v);
            if (route.length > 0)
              analyzeRoute(route, routeDistance, routeDuration, v,
                partial => setAnalysisResult(prev => ({ ...prev, ...partial })));
          }}
          onApiKeySaved={() => {
            if (route.length > 0) {
              setAnalysisResult({});
              analyzeRoute(route, routeDistance, routeDuration, vehicleType,
                partial => setAnalysisResult(prev => ({ ...prev, ...partial })));
            }
          }}
          onRouteSubmit={handleRouteSubmit}
          onActionTaken={handleActionTaken}
          onCompleteTrip={handleCompleteTrip}
          onDemo={handleDemoRoute}
          onClearRoute={handleClearRoute}
          userImpact={userImpact}
        />
      </div>

      {/* Nearby Environment — bottom-left of map, contains eco zone legend */}
      <NearbyEnvironment onActionTaken={(title) => toast.success(`Quick action: ${title}`, { icon: '🌱' })} />

      {/* Floating Impact Button — bottom-right */}
      <ImpactFloatingBtn
        impact={userImpact}
        isOpen={showImpact}
        onToggle={() => setShowImpact(!showImpact)}
        onWeeklyReport={() => setShowWeeklyReport(true)}
      />

      {/* Arrival Celebration */}
      <AnimatePresence>
        {showArrival && (
          <ArrivalCelebration
            destination={endLabel || 'your destination'}
            treesPlanted={tripActions.filter(a => a.type === 'plant-tree').length}
            co2Saved={userImpact.carbonOffset}
            actionsCount={tripActions.length}
            onContinue={() => { setShowArrival(false); setShowTripSummary(true); }}
            onClose={() => setShowArrival(false)}
          />
        )}
      </AnimatePresence>

      {/* Weekly Report */}
      <AnimatePresence>
        {showWeeklyReport && <WeeklyReport impact={userImpact} onClose={() => setShowWeeklyReport(false)} />}
      </AnimatePresence>

      {/* Post-Trip Summary */}
      {showTripSummary && (
        <PostTripSummary
          treesPlanted={tripActions.filter(a => a.type === 'plant-tree').length}
          forestRestored={userImpact.forestRestored}
          carbonOffset={userImpact.carbonOffset}
          wildlifeProtected={userImpact.wildlifeProtected}
          actionsCompleted={tripActions.length}
          recipientName="Noah"
          onClose={() => { setShowTripSummary(false); setTripActions([]); }}
        />
      )}

      {showWelcome && <WelcomeScreen onDismiss={() => setShowWelcome(false)} />}
    </div>
  );
}