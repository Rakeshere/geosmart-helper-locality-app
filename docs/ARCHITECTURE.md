# Architecture Documentation — GeoSmart Helper Locality App

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   React Application                       │   │
│  │                                                           │   │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐  │   │
│  │  │ Header  │  │  Sidebar │  │   Map    │  │  Toast  │  │   │
│  │  │ Search  │  │ BottomSh │  │ Markers  │  │ Stats   │  │   │
│  │  │ Transit │  │ Locality │  │ Transit  │  │ Legend  │  │   │
│  │  └────┬────┘  └────┬─────┘  └────┬─────┘  └─────────┘  │   │
│  │       │             │             │                        │   │
│  │  ┌────▼─────────────▼─────────────▼──────────────────┐   │   │
│  │  │              Custom Hooks Layer                     │   │   │
│  │  │  useMap · useLocalities · useTransit · useSearch   │   │   │
│  │  │  useNearby (Haversine) · useToast                  │   │   │
│  │  └──────────────────────┬──────────────────────────────┘   │   │
│  └─────────────────────────┼──────────────────────────────────┘   │
│                             │                                    │
│                             │ fetch()                            │
└─────────────────────────────┼────────────────────────────────────┘
                              │
┌─────────────────────────────┼────────────────────────────────────┐
│              Next.js Server (API Routes)                          │
│                             │                                    │
│  ┌──────────────────────────▼──────────────────────────────┐    │
│  │           /api/localities         /api/transit           │    │
│  │          Returns seed data       Cache-first proxy       │    │
│  └────────────┬──────────────────────────┬──────────────────┘    │
└───────────────┼──────────────────────────┼───────────────────────┘
                │                          │
                ▼                          ▼
         ┌────────────┐            ┌──────────────────┐
         │  Static    │            │   Supabase DB     │
         │  Seed Data │            │   (PostgreSQL)    │
         │  (TS file) │            │   transit_cache   │
         └────────────┘            └────────┬─────────┘
                                            │ cache miss
                                            ▼
                                   ┌──────────────────┐
                                   │  Overpass API    │
                                   │  (OpenStreetMap) │
                                   └──────────────────┘
```

---

## Folder Structure

```
geosmart-app/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (SEO, fonts, anti-FOUC)
│   ├── page.tsx                  # Dashboard — main orchestration page
│   ├── globals.css               # Design system + Leaflet overrides
│   └── api/
│       ├── localities/route.ts   # GET /api/localities
│       └── transit/route.ts      # GET /api/transit?type=metro|bus|railway|auto
│
├── components/                   # React components
│   ├── header/
│   │   ├── Header.tsx            # Sticky app header
│   │   ├── SearchBar.tsx         # Debounced autocomplete
│   │   └── TransitToggles.tsx    # 4 transit layer toggle buttons
│   │
│   ├── map/
│   │   ├── MapContainer.tsx      # Leaflet map root (SSR-disabled)
│   │   ├── LocalityMarker.tsx    # Circle markers with 3 visual states
│   │   ├── ApartmentMarker.tsx   # Pin markers (zoom ≥ 16 only)
│   │   └── TransitLayer.tsx      # Imperative transit layer groups
│   │
│   ├── sidebar/
│   │   ├── Sidebar.tsx           # Desktop slide-in panel (340px)
│   │   ├── BottomSheet.tsx       # Mobile bottom sheet (80vh max)
│   │   ├── LocalityDetail.tsx    # Selected locality content
│   │   └── NearbyList.tsx        # Haversine distance list
│   │
│   ├── ui/
│   │   ├── Toast.tsx             # Notification system
│   │   ├── Skeleton.tsx          # Loading placeholder animations
│   │   ├── ErrorBoundary.tsx     # React error boundary
│   │   ├── StatsCard.tsx         # Floating statistics panel
│   │   └── Legend.tsx            # Floating color legend
│   │
│   └── ThemeToggle.tsx           # Dark/light mode switch
│
├── hooks/                        # Custom React hooks
│   ├── useMap.ts                 # Map ref, flyTo, zoom, selection state
│   ├── useLocalities.ts          # Data loading with fallback
│   ├── useTransit.ts             # Layer state, fetch, in-memory cache
│   ├── useSearch.ts              # Debounce, results, recent searches
│   ├── useNearby.ts              # Haversine proximity computation
│   └── useToast.ts               # Toast queue management
│
├── services/                     # External service integrations
│   ├── supabase.ts               # Supabase client + config check
│   ├── overpass.ts               # Overpass API fetcher
│   └── transit.ts                # Cache-first transit orchestrator
│
├── types/index.ts                # All TypeScript interfaces (strict)
│
├── utils/
│   ├── constants.ts              # Colors, zoom levels, Overpass queries
│   ├── haversine.ts              # Great-circle distance formula
│   └── mapHelpers.ts             # SVG builders, cn(), truncate()
│
├── data/
│   └── localities.ts             # Static seed: 15 localities, 20 apartments
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # Full schema + seed SQL
│
└── docs/                         # This documentation folder
```

---

## Component Tree

```
DashboardPage (page.tsx)
│
├── Header
│   ├── [Logo]
│   ├── SearchBar
│   │   └── [Dropdown: SearchSkeleton | Recent | Results | NoResults]
│   ├── TransitToggles (×4)
│   ├── [Reset Button]
│   └── ThemeToggle
│
├── Sidebar (desktop, md+)
│   └── LocalityDetail
│       ├── [Meta: name, pincode, zone, coordinates]
│       ├── [ApartmentItem ×n]
│       └── NearbyList
│           └── [NearbyRow with distance badge ×n]
│
├── [Map Area div]
│   ├── MapContainer (dynamic, ssr=false)
│   │   ├── TileLayer (Carto Light | Dark)
│   │   ├── MapEvents (zoom, ready callbacks)
│   │   ├── ZoomControl
│   │   ├── LocalityMarker ×15 (default | selected | nearby)
│   │   ├── ApartmentMarker ×20 (only at zoom ≥ 16)
│   │   └── TransitLayer ×4 (metro | bus | railway | auto)
│   │
│   ├── StatsCard (floating, top-right)
│   ├── Legend (floating, bottom-left)
│   └── [Zoom hint chip] (only zoom < 13)
│
├── BottomSheet (mobile, md-)
│   └── LocalityDetail (same as Sidebar)
│
└── ToastContainer
    └── [ToastItem ×n]
```

---

## Data Flow

### 1. Page Load
```
DashboardPage mounts
  → useLocalities() → GET /api/localities → returns { localities, apartments }
  → useState initializes: isSidebarOpen=false, isDark=false
  → MapContainer loads lazily (dynamic import, ssr=false)
  → Leaflet attaches to DOM, MapEvents fires onMapReady → setMapRef()
  → Default viewport: Bangalore [12.9716, 77.5946] zoom 12
```

### 2. Locality Click
```
User clicks locality marker
  → LocalityMarker onClick → handleLocalityClick(locality)
  → selectLocality(locality) → mapState.selectedLocalityId = "loc-01"
  → mapRef.current.flyTo([lat, lng], 14, { animate: true, duration: 1.2 })
  → setIsSidebarOpen(true)
  → useMemo: selectedLocality = localities.find(id === "loc-01")
  → useNearby(selectedLocality, allLocalities) → Haversine → sorted array
  → nearbyIds → enrichedMapState.nearbyLocalityIds = ["loc-02", "loc-09", ...]
  → LocalityMarker re-renders: nearby ones get orange color
  → Sidebar slides in (Framer Motion spring)
  → LocalityDetail renders with locality + apartments + nearby list
```

### 3. Transit Toggle
```
User clicks "Metro" toggle
  → useTransit.toggleLayer("metro")
  → layers.metro was false → fetch path
  → cache.current["metro"] is empty → API call
  → setLoadingLayers({ metro: true })
  → GET /api/transit?type=metro
  → Server: checks Supabase cache (if configured)
  →   Cache hit: return rows as TransitStop[]
  →   Cache miss: fetch Overpass API → upsert to Supabase → return stops
  → Client: setStops({ metro: stops }) → setLayers({ metro: true })
  → TransitLayer renders → creates Leaflet layer group with 50-100 markers
  → totalTransitCount updates → StatsCard re-renders
```

### 4. Search Select (Apartment)
```
User types "Prestige"
  → useSearch debounce 300ms → filter apartments → results=[apt-01, apt-10, ...]
  → Dropdown shows results
  → User clicks "Prestige Lakeside Habitat"
  → handleSearchSelect(result)
  → addRecentSearch(result) → localStorage update
  → clearQuery()
  → result.type === "apartment" → find apt, find locality
  → selectApartment(apt, loc) → mapState.selectedApartmentId = "apt-01"
  → mapRef.flyTo([apt.lat, apt.lng], 16, ...)
  → setIsSidebarOpen(true)
  → Sidebar shows Koramangala with Prestige Lakeside Habitat highlighted
  → At zoom 16, ApartmentMarker becomes visible with popup
```

---

## State Management

No external state library (Redux/Zustand) — React hooks are sufficient:

| State | Hook | Scope |
|-------|------|-------|
| Map ref + selection | `useMap` | Singleton per page |
| Localities data | `useLocalities` | Loaded once, cached in state |
| Transit layers + stops | `useTransit` | Toggle-driven, in-memory cache |
| Search query + results | `useSearch` | Debounced, localStorage for recents |
| Nearby localities | `useNearby` | Derived (memoized), no state |
| Toast queue | `useToast` | Auto-dismiss timer per toast |
| Sidebar open | `useState` | Simple boolean |
| Dark mode | DOM class + localStorage | Detected by ThemeToggle |

---

## Performance Decisions

| Decision | Rationale |
|----------|-----------|
| `dynamic(ssr: false)` for MapContainer | Leaflet requires browser globals (`window`, `document`) — breaks SSR |
| Imperative `L.layerGroup()` for transit | Adding 200+ React components causes reconciliation overhead; imperative is O(1) per add |
| `useMemo` for nearby calc | Haversine runs O(n) on every render — memoize on `[selectedLocality, allLocalities]` |
| In-memory transit cache (ref) | Avoids re-fetching Overpass when user toggles off then on |
| Static seed data fallback | App works without network for locality/apartment data (critical for demos) |
| 300ms debounce on search | Prevents API hammering; typing "Koramangala" fires only once |
| `AbortSignal.timeout(20_000)` | Prevents Overpass API hangs from blocking the UI |

---

## Zoom Level Logic

```
Zoom < 13    → Only locality circle markers visible
              (no labels — too cluttered at city view)

Zoom 13–15   → Markers + Tooltip with name + pincode
              (neighbourhood-level view)

Zoom ≥ 16    → All above + apartment pin markers appear
              (street-level — individual building resolution)
```

Implementation in `MapContainer.tsx`:
```tsx
const showApartments = zoom >= ZOOM_WITH_APARTMENTS; // 16

{showApartments && apartments.map(apt => <ApartmentMarker ... />)}
```

---

## Animation Architecture (Framer Motion)

| Component | Animation | Duration |
|-----------|-----------|----------|
| Sidebar | `x: -340 → 0` (spring) | ~250ms |
| BottomSheet | `y: "100%" → 0` (spring) | ~250ms |
| Backdrop | `opacity: 0 → 1` | 200ms |
| Toast | `x: 64 → 0, scale: 0.9 → 1` | 200ms |
| Search dropdown | `opacity + scaleY` | 150ms |
| StatsCard | `y: -10, scale: 0.95 → normal` | 250ms |
| Legend | `y: 10, scale: 0.95 → normal` | 250ms |
| Nearby rows | `x: -8 → 0` staggered | 40ms per item |

All animations respect `prefers-reduced-motion` via CSS:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
  }
}
```
