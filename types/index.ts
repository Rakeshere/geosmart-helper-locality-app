// ============================================================
// GeoSmart Helper Locality App — Type Definitions
// ============================================================

export interface LatLng {
  lat: number;
  lng: number;
}

// ── Locality ────────────────────────────────────────────────

export interface Locality {
  id: string;
  name: string;
  pincode: string;
  lat: number;
  lng: number;
  apartment_count: number;
  zone?: string; // e.g. "South", "North", "East", "West"
}

export interface LocalityWithDistance extends Locality {
  distance_km: number;
}

// ── Apartment ───────────────────────────────────────────────

export interface Apartment {
  id: string;
  name: string;
  locality_id: string;
  locality_name: string;
  lat: number;
  lng: number;
  address: string;
  total_units: number;
  pincode: string;
}

// ── Transit ─────────────────────────────────────────────────

export type TransitType = 'metro' | 'bus' | 'railway' | 'auto';

export interface TransitStop {
  id: string;
  name: string;
  type: TransitType;
  lat: number;
  lng: number;
}

export interface TransitCache {
  id: string;
  type: TransitType;
  lat: number;
  lng: number;
  name: string;
  cached_at: string;
}

// ── Search ──────────────────────────────────────────────────

export type SearchResultType = 'locality' | 'apartment';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  label: string;
  sublabel?: string;
  lat: number;
  lng: number;
  locality_id?: string;
}

export interface RecentSearch {
  id: string;
  label: string;
  type: SearchResultType;
  timestamp: number;
}

// ── Toast ───────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// ── Transit Layer State ──────────────────────────────────────

export interface TransitLayerState {
  metro: boolean;
  bus: boolean;
  railway: boolean;
  auto: boolean;
}

// ── Map State ───────────────────────────────────────────────

export interface MapState {
  zoom: number;
  center: LatLng;
  selectedLocalityId: string | null;
  nearbyLocalityIds: string[];
  selectedApartmentId: string | null;
}

// ── Sidebar State ────────────────────────────────────────────

export interface SidebarState {
  isOpen: boolean;
  selectedLocality: Locality | null;
  nearbyLocalities: LocalityWithDistance[];
  apartments: Apartment[];
}

// ── Stats ────────────────────────────────────────────────────

export interface AppStats {
  localityCount: number;
  apartmentCount: number;
  transitCount: number;
}

// ── API Response types ───────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface TransitApiResponse {
  stops: TransitStop[];
  cached: boolean;
  cached_at?: string;
}

// ── Supabase row types ───────────────────────────────────────

export interface LocalityRow {
  id: string;
  name: string;
  pincode: string;
  lat: number;
  lng: number;
  apartment_count: number;
  zone: string | null;
  created_at: string;
}

export interface ApartmentRow {
  id: string;
  name: string;
  locality_id: string;
  lat: number;
  lng: number;
  address: string;
  total_units: number;
  pincode: string;
  created_at: string;
}

// ── Overpass ────────────────────────────────────────────────

export interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export interface OverpassResponse {
  elements: OverpassElement[];
}

// ── Theme ────────────────────────────────────────────────────

export type Theme = 'light' | 'dark';

// ── Map zoom thresholds ──────────────────────────────────────
export const ZOOM_LOCALITY_ONLY = 13;
export const ZOOM_WITH_PINCODES = 15;
export const ZOOM_WITH_APARTMENTS = 16;

// ── Proximity radius ─────────────────────────────────────────
export const NEARBY_RADIUS_KM = 3.5;
