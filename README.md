# GeoSmart Helper Locality App

**Internal Operations Dashboard — EzyHelpers**

> A production-grade geospatial dashboard for sourcing agents to visualize Bangalore localities, apartment complexes, and transit options for helper sourcing and commute planning.

---

## Live Preview

**Dev**: `http://localhost:3000` (after `npm run dev`)  
**Deploy**: Vercel-ready (see [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md))

---

## Feature Checklist (from Assignment)

### ✅ Tech Stack
- [x] **Next.js 14** — App Router, API routes, SSR-safe Leaflet
- [x] **TypeScript strict mode** — All interfaces typed, zero `any`
- [x] **Tailwind CSS** — Custom design tokens, dark mode, responsive
- [x] **Leaflet + React-Leaflet** — Map, markers, tooltips, popups, layers
- [x] **OpenStreetMap** — Carto Light tiles (light) + Carto Dark tiles (dark)
- [x] **Supabase** — PostgreSQL schema, transit cache, graceful degradation
- [x] **Overpass API** — Real transit data from OSM, 4 query types
- [x] **Vercel-ready** — Zero-config deployment, environment variables

### ✅ UI/UX
- [x] **Sticky Header** — Logo, search bar, transit toggles, reset button
- [x] **Rounded cards** — All panels and cards use rounded-xl/2xl
- [x] **Soft shadows** — `shadow-card`, `shadow-card-md`, `shadow-float`
- [x] **Minimal colors** — White/gray surfaces, indigo brand accent
- [x] **Excellent spacing** — 4/8/16/24px spacing rhythm
- [x] **Professional typography** — Inter font, size/weight hierarchy
- [x] **Smooth animations** — Framer Motion, all < 250ms
- [x] **Fully responsive** — Desktop: Sidebar+Map, Mobile: BottomSheet+Map

### ✅ Map Features
- [x] **Default Bangalore viewport** — Center: [12.9716, 77.5946], Zoom: 12
- [x] **Locality markers** — 15 markers with name, apartment count, pincode
- [x] **Click locality** — Highlight (blue), nearby (orange), flyTo animation, sidebar opens
- [x] **Haversine proximity** — 3.5 km radius, client-side, memoized
- [x] **Nearby markers highlighted** — Orange color, distance badges
- [x] **Zoom rules**:
  - `< 13` → Localities only
  - `13–15` → + Pincode labels
  - `≥ 16` → + Apartment pin markers
- [x] **Zoom hint chip** — Shown at zoom < 13

### ✅ Sidebar
- [x] **Locality Name** — Bold heading with zone badge
- [x] **Pincode** — Shown in meta row
- [x] **Apartment Count** — With unit counts
- [x] **Apartment List** — Each with address and total units
- [x] **Nearby Localities** — Sorted by distance, click to navigate
- [x] **Distance badges** — "2.1 km", "850 m" format
- [x] **Desktop**: 340px slide-in (Framer Motion spring)
- [x] **Mobile**: Bottom sheet (80vh, spring animation + backdrop)

### ✅ Search
- [x] **Autocomplete** — Debounced 300ms, localities + apartments
- [x] **Search by name** — "Koramangala", "Prestige Lakeside"
- [x] **Search by pincode** — "560034"
- [x] **Search by address** — Partial address match
- [x] **On select (apartment)** — flyTo zoom 16, open popup, highlight locality, open sidebar
- [x] **On select (locality)** — flyTo zoom 14, highlight, open sidebar
- [x] **Recent searches** — localStorage, max 8 items, clear button
- [x] **No results state** — Empty state with guidance text
- [x] **Loading skeleton** — Shown while debounce completes

### ✅ Transit Layers
- [x] **Metro** — Purple markers, Namma Metro stations
- [x] **Bus Stops** — Green markers, OSM highway=bus_stop
- [x] **Railway** — Red markers, non-metro railway stations
- [x] **Auto Stand** — Yellow markers, OSM amenity=taxi
- [x] **Cache in Supabase** — 24-hour TTL
- [x] **In-memory cache** — Re-toggle is instant (no re-fetch)
- [x] **Failure toast** — "Transit data unavailable. Please try again later."
- [x] **Loading state** — Spinner in toggle button during fetch
- [x] **Transit count** — Updates StatsCard live

### ✅ Reset Button
- [x] Always visible in header
- [x] Resets: viewport (flyTo Bangalore), selection, sidebar, search query, transit toggles

### ✅ Floating Stats Card (Right)
- [x] **15 Localities** — auto-updates from data
- [x] **20 Apartments** — auto-updates from data
- [x] **Transit Count** — sum of all visible transit stops
- [x] Updates automatically when layers are toggled

### ✅ Floating Legend (Left)
- [x] **Blue** — Selected locality (`#2563EB`)
- [x] **Orange** — Nearby locality (`#F97316`)
- [x] **Purple** — Metro (`#8B5CF6`)
- [x] **Green** — Bus (`#10B981`)
- [x] **Red** — Railway (`#EF4444`)
- [x] **Yellow** — Auto (`#F59E0B`)
- [x] **Indigo** — Default locality (`#6366F1`)
- [x] **Cyan** — Apartment (`#06B6D4`)

### ✅ Animations (Framer Motion)
- [x] **Marker hover** — `weight` + `fillOpacity` via Leaflet events
- [x] **Sidebar slide** — `x: -340 → 0`, spring physics
- [x] **Bottom sheet** — `y: 100% → 0`, spring physics
- [x] **Search dropdown** — `opacity + scaleY` from top
- [x] **Toast** — `x: 64 → 0, scale: 0.9 → 1`
- [x] **Stats/Legend entry** — `y + scale`
- [x] **Nearby rows** — Staggered `x: -8 → 0`
- [x] All transitions ≤ 250ms

### ✅ Empty States
- [x] **No apartments** — Icon + "No apartments listed" + "Data will appear when added"
- [x] **Transit unavailable** — Toast notification
- [x] **Search no result** — "No results for '…'" + search tips
- [x] **Loading skeletons** — Sidebar and search dropdown

### ✅ Accessibility
- [x] **Keyboard navigation** — All buttons/links focusable
- [x] **ARIA labels** — `aria-label`, `aria-pressed`, `aria-selected`, `aria-live`
- [x] **High contrast** — `@media (forced-colors: active)` CSS
- [x] **Responsive** — Mobile-first breakpoints
- [x] **Reduced motion** — `@media (prefers-reduced-motion: reduce)`
- [x] **Focus visible** — Custom outline style
- [x] **Roles** — `banner`, `main`, `complementary`, `dialog`, `listbox`, `option`

### ✅ Bonus Features
- [x] **Dark mode** — Class-based, OS detection, anti-FOUC, localStorage persist
- [x] **Recent searches** — localStorage, timestamps, clear button
- [x] **Distance chips** — "2.1 km" badges on nearby localities
- [x] **Statistics cards** — Floating live stats panel
- [x] **Professional loading states** — Spinners + skeletons
- [x] **Error boundaries** — MapContainer wrapped, reset button
- [x] **Toast notifications** — 4 types: success, error, warning, info
- [x] **Code comments** — Every file has section headers and inline docs
- [x] **README** — This file + 5 detailed docs in `/docs`
- [x] **Clean folder structure** — Modular: components/hooks/services/utils/types/data
- [x] **Scalable architecture** — Designed for 2,500+ apartments, 128+ localities

---

## Quick Start

```bash
# 1. Install
cd geosmart-app && npm install

# 2. (Optional) Configure Supabase
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Run
npm run dev         # → http://localhost:3000

# 4. Build check
npm run build       # TypeScript + production build
npm run type-check  # TypeScript only
```

---

## Color System

| Color | Hex | Usage |
|-------|-----|-------|
| Brand Indigo | `#6366F1` | Primary buttons, default locality markers, brand |
| Selected Blue | `#2563EB` | Selected locality marker |
| Nearby Orange | `#F97316` | Nearby locality markers |
| Metro Purple | `#8B5CF6` | Metro station markers |
| Bus Green | `#10B981` | Bus stop markers |
| Railway Red | `#EF4444` | Railway station markers |
| Auto Yellow | `#F59E0B` | Auto stand markers |
| Apartment Cyan | `#06B6D4` | Apartment pin markers |
| Surface White | `#FFFFFF` | Card backgrounds |
| Page Gray | `#F9FAFB` | Page background |
| Border | `#E5E7EB` | Card/input borders |

---

## Typography

- **Font**: Inter (Google Fonts, variable weight 300–800)
- **Headings**: `font-bold`, tight tracking
- **Body**: `font-normal` / `font-medium`
- **Labels**: `text-2xs`, `uppercase`, `tracking-widest`, `font-semibold`
- **Mono**: JetBrains Mono (for code/IDs)

---

## Project Structure

```
geosmart-app/
├── app/                     # Next.js App Router
├── components/              # React components
│   ├── header/              # Header, SearchBar, TransitToggles
│   ├── map/                 # MapContainer, LocalityMarker, ApartmentMarker, TransitLayer
│   ├── sidebar/             # Sidebar, BottomSheet, LocalityDetail, NearbyList
│   └── ui/                  # Toast, Skeleton, ErrorBoundary, StatsCard, Legend
├── hooks/                   # Custom React hooks
├── services/                # Supabase, Overpass, Transit service
├── types/                   # TypeScript interfaces
├── utils/                   # Haversine, mapHelpers, constants
├── data/                    # Static seed data
├── supabase/                # SQL migrations
└── docs/                    # Detailed documentation
    ├── DATABASE.md           # Schema, queries, Supabase setup
    ├── ARCHITECTURE.md       # System design, component tree, data flow
    ├── API.md                # API contracts, Overpass queries
    ├── INTERVIEW.md          # 35 interview Q&A
    └── DEPLOYMENT.md         # Vercel, Docker, CI/CD
```

---

## Data

**15 Localities** (Bangalore):
Koramangala · Indiranagar · HSR Layout · Whitefield · Electronic City · Marathahalli · Jayanagar · JP Nagar · BTM Layout · Bellandur · Sarjapur Road · Bannerghatta Road · Hebbal · Yelahanka · Rajajinagar

**20 Apartments** (real complexes):
Prestige Lakeside Habitat · Sobha Dream Acres · Embassy Residency · Mantri Splendor · Brigade Cosmopolis · Godrej Woodsman Estate · Adarsh Palm Retreat · Salarpuria Sattva Gold Summit · Purva Sunflower · Prestige Shantiniketan · Mantri Webcity · Purva East Face · Brigade Metropolis · Sobha Tulip · Prestige Ferns Residency · DSR Waterfront · Gopalan Grandeur · Brigade Lakefront · Prestige Misty Waters · Brigade Northridge

---

## License

Internal tool — EzyHelpers Confidential. Not for public distribution.
