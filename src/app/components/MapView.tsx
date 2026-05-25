import { useEffect, useRef, useState } from 'react';
import { EnvironmentalZone } from '../data/environmentalData';
import { AllRoutes } from '../App';
import { Loader2, AlertCircle } from 'lucide-react';

const API_KEY = 'AIzaSyBXpgwouwVPyjPPRnkuaJHybJH6fYDyaDM';
const MAP_ID  = 'DEMO_MAP_ID';

interface LatLngLiteral { lat: number; lng: number; }

interface MapViewProps {
  allRoutes?: AllRoutes;
  environmentalZones?: EnvironmentalZone[];
  start?: LatLngLiteral;
  destination?: LatLngLiteral;
  selectedRouteId?: string;
  onSelectRoute?: (routeId: string) => void;
}

// ── Route color config ────────────────────────────────────────────────────────
interface RouteCfg {
  color: string;
  weight: number;
  icon: string;
  label: string;
}

const ROUTE_CFG: Record<string, RouteCfg> = {
  'standard':     { color: '#D93025', weight: 7, icon: '⚡', label: 'Fastest'      },
  'eco-balanced': { color: '#1A73E8', weight: 7, icon: '🌿', label: 'Eco-Balanced' },
  'planet-hero':  { color: '#188038', weight: 7, icon: '🌍', label: 'Planet Hero'  },
};

const UNSELECTED_OPACITY = 0.35;
const UNSELECTED_WEIGHT  = 5;

// ── Script loader (singleton) ─────────────────────────────────────────────────
// Uses the callback= pattern required by loading=async so we're only notified
// once google.maps is FULLY initialised (onload fires too early with async mode).
const CALLBACK_NAME = '__googleMapsReady';
let scriptLoaded  = false;
let scriptLoading = false;
const scriptCbs: Array<(ok: boolean) => void> = [];

function loadMapsScript(cb: (ok: boolean) => void) {
  if (scriptLoaded && (window as any).google?.maps?.Map) { cb(true); return; }
  scriptCbs.push(cb);
  if (scriptLoading) return;
  scriptLoading = true;

  // Callback invoked by Maps API once fully ready
  (window as any)[CALLBACK_NAME] = () => {
    scriptLoaded  = true;
    scriptLoading = false;
    scriptCbs.forEach(c => c(true));
    scriptCbs.length = 0;
  };

  const s = document.createElement('script');
  // loading=async is the recommended modern pattern; libraries=marker loads AdvancedMarkerElement;
  // callback= is required when using loading=async so Maps calls us when truly ready.
  s.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&loading=async&libraries=marker&callback=${CALLBACK_NAME}`;
  // Do NOT set s.async/s.defer when using callback= with loading=async — the API manages its own async behaviour
  s.onerror = () => {
    scriptLoading = false;
    scriptCbs.forEach(c => c(false));
    scriptCbs.length = 0;
  };
  document.head.appendChild(s);
}

// ── Route-label overlay (pill chip) ──────────────────────────────────────────
function createRouteLabelOverlay(
  g: any,
  map: google.maps.Map,
  position: LatLngLiteral,
  cfg: RouteCfg,
  isSelected: boolean,
  onClick?: () => void,
): any {
  class RouteLabelOverlay extends g.maps.OverlayView {
    private el: HTMLDivElement | null = null;

    onAdd() {
      const div = document.createElement('div');
      div.style.cssText = `
        position: absolute;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        gap: 5px;
        background: white;
        border: 2px solid ${isSelected ? cfg.color : '#dadce0'};
        border-radius: 20px;
        padding: 5px 11px 5px 9px;
        font-family: 'Google Sans', Roboto, sans-serif;
        font-size: 13px;
        font-weight: ${isSelected ? '600' : '500'};
        color: ${isSelected ? cfg.color : '#5f6368'};
        white-space: nowrap;
        cursor: ${isSelected ? 'default' : 'pointer'};
        box-shadow: 0 2px 6px rgba(0,0,0,${isSelected ? '0.22' : '0.12'}), 0 1px 2px rgba(0,0,0,0.1);
        user-select: none;
        pointer-events: auto;
        z-index: ${isSelected ? 5 : 2};
      `;

      const iconSpan = document.createElement('span');
      iconSpan.style.cssText = 'font-size:14px;line-height:1;display:flex;align-items:center;';
      iconSpan.textContent = cfg.icon;

      const textSpan = document.createElement('span');
      textSpan.textContent = cfg.label;

      div.appendChild(iconSpan);
      div.appendChild(textSpan);

      if (!isSelected && onClick) {
        div.addEventListener('click', (e) => { e.stopPropagation(); onClick(); });
        div.addEventListener('mouseenter', () => {
          div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25),0 1px 4px rgba(0,0,0,0.15)';
          div.style.borderColor = cfg.color;
          div.style.color = cfg.color;
        });
        div.addEventListener('mouseleave', () => {
          div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12),0 1px 2px rgba(0,0,0,0.1)';
          div.style.borderColor = '#dadce0';
          div.style.color = '#5f6368';
        });
      }

      this.el = div;
      (this.getPanes() as any).floatPane.appendChild(div);
    }

    draw() {
      if (!this.el) return;
      const proj = this.getProjection();
      const pt = proj.fromLatLngToDivPixel(new g.maps.LatLng(position.lat, position.lng));
      if (!pt) return;
      this.el.style.left = `${pt.x}px`;
      this.el.style.top  = `${pt.y}px`;
    }

    onRemove() {
      this.el?.parentNode?.removeChild(this.el);
      this.el = null;
    }
  }

  const overlay = new RouteLabelOverlay();
  overlay.setMap(map);
  return overlay;
}

function pointAlongPath(path: LatLngLiteral[], frac: number): LatLngLiteral {
  if (path.length === 0) return { lat: 0, lng: 0 };
  if (path.length === 1) return path[0];
  const idx = Math.min(Math.floor(path.length * frac), path.length - 2);
  return path[idx];
}

// ── AdvancedMarker content elements ──────────────────────────────────────────
function makeStartMarkerElement(): HTMLDivElement {
  const div = document.createElement('div');
  div.style.cssText = `
    width: 18px; height: 18px;
    background: #1a73e8;
    border: 3px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.45);
  `;
  return div;
}

function makeDestMarkerElement(): HTMLDivElement {
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;align-items:center;justify-content:center;';
  div.innerHTML = `
    <svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 40 14 40C14 40 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#ea4335"/>
      <circle cx="14" cy="14" r="5.5" fill="white"/>
    </svg>
  `;
  return div;
}

// ── MapView ───────────────────────────────────────────────────────────────────
export function MapView({
  allRoutes = {},
  environmentalZones,
  start,
  destination,
  selectedRouteId = 'eco-balanced',
  onSelectRoute,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<google.maps.Map | null>(null);
  const circlesRef   = useRef<google.maps.Circle[]>([]);

  type RouteDrawing = { polylines: google.maps.Polyline[]; overlay: any };
  const drawingsRef = useRef<Record<string, RouteDrawing>>({});

  const startMkRef = useRef<any>(null);
  const destMkRef  = useRef<any>(null);

  const [isLoaded, setIsLoaded]   = useState(false);
  const [loadError, setLoadError] = useState(false);

  // ── Load Maps API ────────────────────────────────────────────────────────────
  useEffect(() => {
    if ((window as any).google?.maps?.Map) { setIsLoaded(true); return; }
    loadMapsScript(ok => {
      if (ok) setIsLoaded(true);
      else    setLoadError(true);
    });
  }, []);

  // ── Init map ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || !containerRef.current || mapRef.current) return;
    const g = (window as any).google;
    if (!g?.maps?.Map) return;
    try {
      mapRef.current = new g.maps.Map(containerRef.current, {
        center: { lat: 20, lng: 0 },
        zoom: 3,
        mapId: MAP_ID,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: 'greedy',
        clickableIcons: false,
      });
    } catch (e) {
      console.error('Map init error:', e);
      setLoadError(true);
    }
  }, [isLoaded]);

  // ── Environmental circles ────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;
    const g = (window as any).google;
    circlesRef.current.forEach(c => c.setMap(null));
    circlesRef.current = [];
    (environmentalZones ?? []).forEach(z => {
      const color = z.severity === 'high' ? '#d93025' : z.severity === 'medium' ? '#e37400' : '#188038';
      circlesRef.current.push(new g.maps.Circle({
        center: { lat: z.lat, lng: z.lng },
        radius: z.radius * 1000,
        map: mapRef.current,
        fillColor: color, fillOpacity: 0.09,
        strokeColor: color, strokeOpacity: 0.40, strokeWeight: 1.5,
      }));
    });
  }, [isLoaded, environmentalZones]);

  // ── Clear route drawings ─────────────────────────────────────────────────────
  function clearDrawings() {
    Object.values(drawingsRef.current).forEach(({ polylines, overlay }) => {
      polylines.forEach(p => p.setMap(null));
      try { overlay?.setMap(null); } catch {}
    });
    drawingsRef.current = {};
  }

  // ── Draw routes ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;
    const g = (window as any).google;
    clearDrawings();

    const routeIds = Object.keys(allRoutes);
    if (routeIds.length === 0) return;

    const drawOrder = [...routeIds].sort((a, b) =>
      a === selectedRouteId ? 1 : b === selectedRouteId ? -1 : 0
    );

    drawOrder.forEach(routeId => {
      const path = allRoutes[routeId];
      if (!path || path.length < 2) return;

      const cfg        = ROUTE_CFG[routeId] ?? ROUTE_CFG['standard'];
      const isSelected = routeId === selectedRouteId;
      const polylines: google.maps.Polyline[] = [];

      if (isSelected) {
        polylines.push(new g.maps.Polyline({
          path, map: mapRef.current,
          strokeColor: '#ffffff', strokeOpacity: 1.0,
          strokeWeight: cfg.weight + 6, zIndex: 3, clickable: false,
        }));
      }

      const line = new g.maps.Polyline({
        path, map: mapRef.current,
        strokeColor:   cfg.color,
        strokeOpacity: isSelected ? 1.0 : UNSELECTED_OPACITY,
        strokeWeight:  isSelected ? cfg.weight : UNSELECTED_WEIGHT,
        zIndex: isSelected ? 4 : 1,
        clickable: !isSelected,
      });
      polylines.push(line);

      if (!isSelected && onSelectRoute) {
        g.maps.event.addListener(line, 'click', () => onSelectRoute(routeId));
        g.maps.event.addListener(line, 'mouseover', () =>
          line.setOptions({ strokeOpacity: 0.7, strokeWeight: UNSELECTED_WEIGHT + 2 }));
        g.maps.event.addListener(line, 'mouseout', () =>
          line.setOptions({ strokeOpacity: UNSELECTED_OPACITY, strokeWeight: UNSELECTED_WEIGHT }));
      }

      const labelFrac = routeId === 'standard' ? 0.35 : routeId === 'eco-balanced' ? 0.50 : 0.65;
      const labelPos  = pointAlongPath(path, labelFrac);
      const overlay   = createRouteLabelOverlay(
        g, mapRef.current!, labelPos, cfg, isSelected,
        isSelected ? undefined : () => onSelectRoute?.(routeId),
      );

      drawingsRef.current[routeId] = { polylines, overlay };
    });

    const bounds = new g.maps.LatLngBounds();
    Object.values(allRoutes).forEach(pts => pts.forEach(p => bounds.extend(p)));
    mapRef.current.fitBounds(bounds, { left: 440, top: 60, right: 60, bottom: 60 });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, allRoutes, selectedRouteId]);

  // ── Markers — AdvancedMarkerElement ──────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;
    const g = (window as any).google;

    if (startMkRef.current) { startMkRef.current.map = null; startMkRef.current = null; }
    if (destMkRef.current)  { destMkRef.current.map  = null; destMkRef.current  = null; }

    const AME = g?.maps?.marker?.AdvancedMarkerElement;
    if (!AME) {
      console.warn('[MapView] AdvancedMarkerElement not available');
      return;
    }

    if (start) {
      startMkRef.current = new AME({
        position: start, map: mapRef.current,
        title: 'Start', content: makeStartMarkerElement(), zIndex: 20,
      });
    }
    if (destination) {
      destMkRef.current = new AME({
        position: destination, map: mapRef.current,
        title: 'Destination', content: makeDestMarkerElement(), zIndex: 20,
      });
    }
  }, [isLoaded, start, destination]);

  // ── Cleanup ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      circlesRef.current.forEach(c => c.setMap(null));
      clearDrawings();
      if (startMkRef.current) startMkRef.current.map = null;
      if (destMkRef.current)  destMkRef.current.map  = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Render states ─────────────────────────────────────────────────────────────
  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#e8f0e8]">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-sm font-medium text-gray-800">Failed to load Google Maps</p>
          <p className="text-xs text-gray-500">
            Check that the <strong>Maps JavaScript API</strong> is enabled for this key in Google Cloud Console.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#e8f0e8]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-green-600" />
          <p className="text-sm text-gray-600">Loading map…</p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full" />;
}
