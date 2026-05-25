/**
 * DataAccuracyPanel — transparent disclosure of data provenance
 * Shown at the bottom of the side panel after a route is loaded.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MaterialIcon } from './MaterialIcon';

interface DataSource {
  name: string;
  provider: string;
  status: 'live' | 'verified' | 'estimated' | 'illustrative';
  detail: string;
  url?: string;
}

const DATA_SOURCES: DataSource[] = [
  {
    name: 'Vehicle Emissions (CO₂, NOx, PM2.5)',
    provider: 'HBEFA 4.2 — TU Graz / INFRAS 2021',
    status: 'verified',
    detail: 'Real published emission factor tables, speed-band interpolated. EU peer-reviewed standard for transport LCA.',
    url: 'https://www.hbefa.net',
  },
  {
    name: 'Air Quality (NO₂ & PM2.5)',
    provider: 'OpenAQ v3 — Global sensor network',
    status: 'live',
    detail: 'Live readings from real monitoring stations queried via OpenAQ public API. Measurements from government and research sensors.',
    url: 'https://openaq.org',
  },
  {
    name: 'WWF Terrestrial Ecoregions',
    provider: 'Olson et al. (2001), Science 342 — WWF GLOBIL',
    status: 'verified',
    detail: 'Peer-reviewed ecoregion classifications with real threat status, endemic species counts, and human footprint index from Venter et al. (2016).',
    url: 'https://www.worldwildlife.org/biome-categories/terrestrial-ecoregions',
  },
  {
    name: 'Land Cover Profile',
    provider: 'CORINE 2018 (Europe) / ESA WorldCover 2021 (global)',
    status: 'verified',
    detail: 'Pre-extracted zonal statistics from Copernicus CORINE 2018 (100 m) and ESA WorldCover 2021 (10 m) rasters using QGIS. Regional averages — not live-fetched per trip.',
    url: 'https://land.copernicus.eu/pan-european/corine-land-cover',
  },
  {
    name: 'Tree Cover Loss % in Zone Cards',
    provider: 'Global Forest Watch / Hansen GFC v1.11 (UMD)',
    status: 'estimated',
    detail: 'The % values shown per zone (e.g. "26% tree loss") are research-derived from GFW data for those specific regions and hardcoded. They are accurate for the named locations but are NOT queried live per trip.',
    url: 'https://www.globalforestwatch.org',
  },
  {
    name: 'Forest Loss in Route Corridor',
    provider: 'Hansen GFC v1.11 (UMD) via GFW Data API',
    status: 'estimated',
    detail: 'The app attempts a live GFW API call for your exact route buffer. If the API is unavailable, it falls back to biome-level deforestation rates from FAO GFRA 2020. The bar chart will show "Biome estimate" label when this happens.',
    url: 'https://data-api.globalforestwatch.org',
  },
  {
    name: 'Alternative Route Times (Eco-Balanced, Planet Hero)',
    provider: 'Computed estimate — not a real routing call',
    status: 'illustrative',
    detail: 'The Eco-Balanced (+12% time) and Planet Hero (+25% time) routes are computed multipliers of your real route. No actual alternative route is calculated via the API — these are illustrative estimates of what a detour around environmental zones might cost in time.',
  },
  {
    name: 'Zone Habitat Loss (m²) & Action Impact Numbers',
    provider: 'Illustrative values',
    status: 'illustrative',
    detail: 'The m² habitat loss figures and per-action impact estimates are illustrative. They communicate scale and relative impact but are not derived from measured field data for each specific zone.',
  },
];

const STATUS_CONFIG = {
  live:        { label: 'Live data',   icon: 'wifi',         color: 'text-[#188038] bg-[#e6f4ea] border-[#81c995]' },
  verified:    { label: 'Verified',    icon: 'verified',     color: 'text-[#1a73e8] bg-[#e8f0fe] border-[#c6dafc]' },
  estimated:   { label: 'Estimated',   icon: 'science',      color: 'text-[#e37400] bg-[#fef7e0] border-[#fdd663]' },
  illustrative:{ label: 'Illustrative',icon: 'info',         color: 'text-[#5f6368] bg-[#f8f9fa] border-[#dadce0]' },
};

export function DataAccuracyPanel() {
  const [open, setOpen] = useState(false);

  const counts = {
    live:         DATA_SOURCES.filter(d => d.status === 'live').length,
    verified:     DATA_SOURCES.filter(d => d.status === 'verified').length,
    estimated:    DATA_SOURCES.filter(d => d.status === 'estimated').length,
    illustrative: DATA_SOURCES.filter(d => d.status === 'illustrative').length,
  };

  return (
    <div
      className="bg-white rounded-lg border border-[#e8eaed] overflow-hidden"
      style={{ boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}
    >
      {/* Header toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 p-3 hover:bg-[#f8f9fa] transition-colors text-left"
      >
        <div className="w-7 h-7 bg-[#e8f0fe] rounded-full flex items-center justify-center flex-shrink-0">
          <MaterialIcon icon="policy" size={16} className="text-[#1a73e8]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-[#202124]" style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 500 }}>
            Data Accuracy & Sources
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className="text-xs text-[#188038] font-medium">{counts.live} live</span>
            <span className="text-[#dadce0] text-xs">·</span>
            <span className="text-xs text-[#1a73e8] font-medium">{counts.verified} verified</span>
            <span className="text-[#dadce0] text-xs">·</span>
            <span className="text-xs text-[#e37400] font-medium">{counts.estimated} estimated</span>
            <span className="text-[#dadce0] text-xs">·</span>
            <span className="text-xs text-[#5f6368]">{counts.illustrative} illustrative</span>
          </div>
        </div>
        <MaterialIcon
          icon={open ? 'expand_less' : 'expand_more'}
          size={20}
          className="text-[#5f6368] flex-shrink-0"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 space-y-2 border-t border-[#e8eaed]">

              {/* Legend */}
              <div className="flex flex-wrap gap-2 py-2">
                {(Object.entries(STATUS_CONFIG) as [keyof typeof STATUS_CONFIG, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([key, cfg]) => (
                  <div key={key} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cfg.color}`}>
                    <MaterialIcon icon={cfg.icon} size={12} className="text-inherit" />
                    {cfg.label}
                  </div>
                ))}
              </div>

              {/* Data source rows */}
              {DATA_SOURCES.map((ds, i) => {
                const cfg = STATUS_CONFIG[ds.status];
                return (
                  <div
                    key={i}
                    className="border border-[#e8eaed] rounded-lg p-2.5 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs text-[#202124] leading-snug" style={{ fontWeight: 500 }}>
                        {ds.name}
                      </div>
                      <span className={`flex-shrink-0 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${cfg.color}`}>
                        <MaterialIcon icon={cfg.icon} size={11} className="text-inherit" />
                        {cfg.label}
                      </span>
                    </div>
                    <div className="text-xs text-[#5f6368]">{ds.provider}</div>
                    <div className="text-xs text-[#5f6368] leading-relaxed">{ds.detail}</div>
                    {ds.url && (
                      <a
                        href={ds.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#1a73e8] hover:underline"
                      >
                        <MaterialIcon icon="open_in_new" size={12} />
                        View source dataset
                      </a>
                    )}
                  </div>
                );
              })}

              {/* Disclaimer */}
              <div className="bg-[#f8f9fa] rounded-lg p-2.5 border border-[#e8eaed]">
                <div className="flex items-start gap-1.5">
                  <MaterialIcon icon="info" size={14} className="text-[#5f6368] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#5f6368] leading-relaxed">
                    This is a research and awareness tool. Environmental zone boundaries, species data, and impact figures are used for educational purposes. For scientific or policy decisions, always consult primary sources linked above.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
