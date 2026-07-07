// ============================================================
// GeoSmart Helper Locality App — Application Constants
// ============================================================

import { LatLng } from '@/types';

// ── Map defaults ─────────────────────────────────────────────

export const DEFAULT_CENTER: LatLng = {
  lat: 12.9716,
  lng: 77.5946,
};

export const DEFAULT_ZOOM = 12;
export const APARTMENT_ZOOM = 16;

// Bangalore bounding box (for clamping)
export const BANGALORE_BOUNDS = {
  north: 13.14,
  south: 12.73,
  east: 77.78,
  west: 77.39,
};

// ── Map tile URLs ────────────────────────────────────────────

export const TILE_URL_LIGHT =
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

export const TILE_URL_DARK =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

export const TILE_ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>';

// ── Zoom thresholds ──────────────────────────────────────────

export const ZOOM_LOCALITY_ONLY = 13;      // < 13: localities only
export const ZOOM_WITH_PINCODES = 15;      // 13–15: + pincode labels
export const ZOOM_WITH_APARTMENTS = 16;    // ≥ 16: + apartment markers

// ── Proximity ────────────────────────────────────────────────

export const NEARBY_RADIUS_KM = 3.5;

// ── Overpass API ─────────────────────────────────────────────

export const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

// Bangalore approximate bounding box for Overpass queries
export const BANGALORE_OVERPASS_BBOX = '12.73,77.39,13.14,77.78';

// ── Cache TTL ────────────────────────────────────────────────

export const TRANSIT_CACHE_TTL_HOURS = 24;

// ── Animation durations (ms) ─────────────────────────────────

export const ANIM_DURATION = 250;
export const TOAST_DURATION = 4000;
export const SEARCH_DEBOUNCE_MS = 300;

// ── Map marker colors ─────────────────────────────────────────

export const MARKER_COLORS = {
  default: '#6366F1',      // indigo — default locality
  selected: '#2563EB',     // blue — selected locality
  nearby: '#F97316',       // orange — nearby locality
  metro: '#8B5CF6',        // purple — metro
  bus: '#10B981',          // green — bus
  railway: '#EF4444',      // red — railway
  auto: '#F59E0B',         // yellow — auto stand
  apartment: '#06B6D4',    // cyan — apartment
} as const;

// ── Storage keys ─────────────────────────────────────────────

export const STORAGE_KEYS = {
  recentSearches: 'geosmart_recent_searches',
  theme: 'geosmart_theme',
} as const;

export const MAX_RECENT_SEARCHES = 8;

// ── Transit layer labels ─────────────────────────────────────

export const TRANSIT_LABELS = {
  metro: 'Metro',
  bus: 'Bus Stops',
  railway: 'Railway',
  auto: 'Auto Stand',
} as const;

// ── Overpass queries ──────────────────────────────────────────

export const OVERPASS_QUERIES = {
  metro: `[out:json][timeout:25];
node["railway"="station"]["network"="Namma Metro"](${BANGALORE_OVERPASS_BBOX});
out body;`,

  bus: `[out:json][timeout:25];
node["highway"="bus_stop"](${BANGALORE_OVERPASS_BBOX});
out body;`,

  railway: `[out:json][timeout:25];
node["railway"="station"]["network"!="Namma Metro"](${BANGALORE_OVERPASS_BBOX});
out body;`,

  auto: `[out:json][timeout:25];
node["amenity"="taxi"](${BANGALORE_OVERPASS_BBOX});
out body;`,
} as const;
