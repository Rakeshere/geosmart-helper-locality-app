# Interview Q&A — GeoSmart Helper Locality App

> Complete interview preparation covering: Database, System Design, Frontend, React, Maps, APIs, and TypeScript.

---

## 📌 SECTION 1 — Project Overview

**Q1. Explain this project in 2 minutes.**

> GeoSmart is an internal operations dashboard for EzyHelpers — a domestic helper sourcing company. Sourcing agents use it to see which Bangalore localities have helper demand, where apartments are located, and what public transit options are nearby — helping them plan helper commutes.
>
> It's built with **Next.js 14** (App Router), **TypeScript** (strict mode), **Tailwind CSS** for styling, **Leaflet** for the map, **Supabase** (PostgreSQL) for data persistence, and **Overpass API** to fetch real transit data from OpenStreetMap.
>
> Key features: locality markers with proximity detection using Haversine, transit layer toggles (Metro/Bus/Railway/Auto), autocomplete search, and full mobile responsiveness with a bottom sheet.

---

**Q2. What was the hardest technical challenge?**

> The hardest part was making Leaflet work correctly in a Next.js App Router environment. Leaflet requires browser globals (`window`, `document`, `L`) that don't exist during server-side rendering. I solved this with `next/dynamic` and `ssr: false` to dynamically import the entire map component only on the client.
>
> Additionally, managing the "nearby localities" derived state — keeping it in sync with the selected locality without unnecessary re-renders — required careful use of `useMemo` with stable dependency arrays.

---

**Q3. Why did you choose this stack?**

> - **Next.js 14**: Best-in-class DX for React with built-in API routes, avoiding a separate backend.
> - **Supabase**: PostgreSQL under the hood (I know SQL), real-time subscriptions available for future use, and the generous free tier suits an internal tool.
> - **Leaflet**: Most mature open-source map library with 0 API key requirements. Google Maps would cost money at scale.
> - **Overpass API**: Free access to OpenStreetMap data — 2.5M+ nodes of Bangalore transit data with no key needed.
> - **Framer Motion**: Declarative, production-grade animations that are easy to maintain.

---

## 📌 SECTION 2 — Database Questions

**Q4. Explain your database schema.**

> Three tables:
> 1. `localities` — master table of areas with `id`, `name`, `pincode`, `lat`, `lng`, `apartment_count`, `zone`
> 2. `apartments` — `locality_id` foreign key to localities, with address, unit count, coordinates
> 3. `transit_cache` — ephemeral cache for Overpass API results with `type` (metro/bus/railway/auto) and `cached_at` for 24h TTL
>
> The schema is denormalized slightly: `apartment_count` is stored on `localities` for fast marker rendering without a JOIN.

---

**Q5. What indexes did you create and why?**

```sql
CREATE INDEX idx_apartments_locality_id ON apartments(locality_id);
CREATE INDEX idx_transit_type           ON transit_cache(type);
CREATE INDEX idx_transit_cached_at      ON transit_cache(cached_at);
```

> - `locality_id` index: When a user selects a locality, we need all apartments for it — a sequential scan of 2,500 rows is O(n). With a B-tree index, it's O(log n).
> - `type` + `cached_at` composite-use: The transit cache query filters by both — `WHERE type = $1 AND cached_at >= $2`. Two separate indexes cover this because the query planner picks the more selective one (usually `cached_at`).

---

**Q6. What is the Haversine formula and why use it over PostGIS?**

> The Haversine formula calculates the **great-circle distance** (shortest path on a sphere) between two lat/lng points:
>
> ```
> a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlng/2)
> d = 2R × atan2(√a, √(1−a))
> ```
>
> I used **client-side Haversine** because:
> 1. The dataset is small (~15 localities) — O(15) per click is negligible
> 2. Avoids a server round-trip (reduces latency from ~200ms to ~0ms)
> 3. PostGIS requires the `earth_distance` extension and more complex setup
>
> At scale (128+ localities), I'd move to PostGIS with a spatial index for server-side proximity queries.

---

**Q7. How does the transit caching work?**

> **Cache-first strategy** with 24-hour TTL:
> 1. Check `transit_cache` WHERE `type = $type AND cached_at >= NOW() - 24h`
> 2. If rows exist → return them (fast path, ~10ms DB query)
> 3. If empty/stale → fetch from Overpass API (~2-5 seconds)
> 4. Upsert results to `transit_cache` (fire-and-forget, non-blocking)
> 5. Return fresh data to client
>
> Upsert uses `ON CONFLICT (id) DO UPDATE SET cached_at = NOW()` so re-fetched data refreshes the TTL.

---

**Q8. How would you scale the database to 2,500+ apartments?**

> 1. **Spatial index**: Add PostGIS `GEOGRAPHY(Point)` column and `GIST` index for server-side proximity queries
> 2. **Pagination**: `/api/apartments?locality_id=loc-01&page=1&limit=20`
> 3. **Read replicas**: Supabase supports read replicas — route read-heavy map queries there
> 4. **Materialized view**: Pre-compute locality + apartment count rather than COUNT(*) each time
> 5. **CDN cache**: Cache `/api/localities` at the edge (it rarely changes)

---

**Q9. What is Row Level Security (RLS) and did you implement it?**

> RLS is a PostgreSQL feature that enforces access policies **at the row level** in the database itself — bypassing it requires superuser access. Even if the application has a bug that exposes a raw query, RLS ensures unauthorized users can't read/write other rows.
>
> For this internal tool I defined the policies:
> ```sql
> CREATE POLICY "read_all" ON localities FOR SELECT USING (true);
> CREATE POLICY "auth_write" ON localities FOR INSERT TO authenticated USING (true);
> ```
> Anonymous users can read but only authenticated (logged-in) sourcing agents can write.

---

## 📌 SECTION 3 — System Design Questions

**Q10. Design the system for 10,000 concurrent users.**

> **Current**: Single Vercel serverless function handles Overpass proxy + Supabase read
>
> **At scale**:
> 1. **CDN layer**: Cache `/api/localities` at Vercel Edge Network (global, 99.9% cache hit)
> 2. **Supabase connection pooling**: Use PgBouncer (built into Supabase) — prevents connection exhaustion
> 3. **Transit cache**: Increase TTL to 6 hours or use Supabase Realtime to push invalidations
> 4. **Map tiles**: Carto tiles are served by their CDN — no scaling needed
> 5. **Rate limiting**: Add `@upstash/ratelimit` on `/api/transit` — max 5 req/min per IP
> 6. **Read replicas**: Supabase Pro plan provides read replicas — route analytics queries there

---

**Q11. Why use Next.js API routes instead of a separate Express server?**

> For an internal tool at this scale, Next.js API routes are **collocated, simpler, and deploy for free on Vercel** without a separate server to manage.
>
> Downsides vs Express: No WebSocket support in App Router, each route is stateless (serverless). If we needed WebSockets (e.g., live helper tracking), I'd add a separate Fastify/Express server.

---

**Q12. How do you prevent Overpass API abuse?**

> 1. **Server-side proxy**: The client never calls Overpass directly — `/api/transit` is the only entry point
> 2. **Supabase cache**: 24h TTL means Overpass is called at most once per type per day
> 3. **AbortSignal timeout**: `AbortSignal.timeout(20_000)` kills hanging requests
> 4. **Rate limiting**: Can add Upstash Redis rate limiting on the API route
> 5. **Graceful degradation**: On failure → 503 → toast "Transit data unavailable" (no retry storm)

---

**Q13. What happens when the app is offline?**

> - **Map tiles**: Cached by browser (Leaflet tiles are cached per browser session)
> - **Locality/apartment data**: Falls back to static `data/localities.ts` (no network needed)
> - **Transit data**: Shows empty layers with toast notification
> - **Search**: Works fully offline (searches local data)
> - **Sidebar/Nearby**: Works offline (Haversine is client-side)

---

## 📌 SECTION 4 — Frontend / React Questions

**Q14. Explain your custom hooks architecture.**

> I separated concerns into 6 hooks:
> - `useMap` — map ref + selection state + flyTo animations
> - `useLocalities` — async data loading with static fallback
> - `useTransit` — layer toggle state + fetch + in-memory cache
> - `useSearch` — debounced search + recent searches via localStorage
> - `useNearby` — pure derived computation (no fetch, just Haversine)
> - `useToast` — toast queue with auto-dismiss timers
>
> The page (`page.tsx`) composes all hooks and passes data down as props. This makes each hook independently testable with `renderHook()`.

---

**Q15. Why did you use `useMemo` for nearby calculation?**

> `useNearby` runs Haversine `O(n)` times per call. Without memoization, it would re-run on every state change (zoom, tooltip hover, etc.) — even when `selectedLocality` hasn't changed.
>
> ```typescript
> return useMemo(() => {
>   if (!selectedLocality) return [];
>   return allLocalities
>     .filter(loc => loc.id !== selectedLocality.id)
>     .map(loc => ({ ...loc, distance_km: haversineDistance(...) }))
>     .filter(loc => loc.distance_km <= 3.5)
>     .sort((a, b) => a.distance_km - b.distance_km);
> }, [selectedLocality, allLocalities]); // Only re-computes when these change
> ```

---

**Q16. What is the difference between `useRef` and `useState` for the map reference?**

> I use `useRef` for the Leaflet map instance because:
> - We **don't want React to re-render** when the map is ready — it would re-mount the map
> - `useRef` persists across renders without triggering them
> - The map is a **mutable external object** (Leaflet instance) — not React state
>
> `useState` would cause the entire component tree to re-render when the map mounts, causing a flicker.

---

**Q17. How does the debounced search work?**

> ```typescript
> const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
>
> const setQuery = useCallback((q: string) => {
>   setQueryRaw(q);
>   if (debounceRef.current) clearTimeout(debounceRef.current);
>   if (!q.trim()) { setResults([]); return; }
>
>   debounceRef.current = setTimeout(() => {
>     // Search logic runs 300ms after user stops typing
>     const results = [...filterLocalities(q), ...filterApartments(q)];
>     setResults(results);
>   }, 300);
> }, [localities, apartments]);
> ```
>
> Using `useRef` for the timeout (not `useState`) so clearing it doesn't cause re-renders.

---

**Q18. Why `dynamic(ssr: false)` for MapContainer?**

> Leaflet directly accesses `window.L`, `document.createElement()`, and `navigator` — none of which exist in Node.js (where Next.js SSR runs).
>
> `dynamic(() => import('./MapContainer'), { ssr: false })` tells Next.js:
> 1. Don't include this in the server bundle
> 2. Load it only in the browser after hydration
> 3. Show the `loading` fallback (spinner) during load
>
> Without this, the build throws `ReferenceError: window is not defined`.

---

**Q19. What is an Error Boundary and when is it triggered?**

> Error Boundaries are **class components** (the only use of class in this project) that catch JavaScript errors in their **child component tree** during render, lifecycle methods, and constructors.
>
> ```typescript
> class ErrorBoundary extends Component {
>   static getDerivedStateFromError(error) { return { hasError: true, error }; }
>   componentDidCatch(error, info) { console.error(error, info); }
>   render() { return this.state.hasError ? <Fallback /> : this.props.children; }
> }
> ```
>
> I wrap `MapContainer` in an ErrorBoundary — if Leaflet throws (e.g., GPS data error), the user sees a "Try again" button instead of a blank white screen.

---

**Q20. Explain Framer Motion's `AnimatePresence` and when you need it.**

> `AnimatePresence` enables **exit animations** for components that are being removed from the React tree. Without it, components disappear instantly.
>
> ```tsx
> <AnimatePresence>
>   {isOpen && (
>     <motion.div
>       initial={{ x: -340 }}     // Enter from left
>       animate={{ x: 0 }}        // Slide in
>       exit={{ x: -340 }}        // Slide out on unmount
>     />
>   )}
> </AnimatePresence>
> ```
>
> I use it for: Sidebar, BottomSheet, SearchDropdown, and Toast notifications.

---

## 📌 SECTION 5 — Map / Geospatial Questions

**Q21. What is the difference between Leaflet markers and CircleMarkers?**

> - `Marker`: Uses an icon (PNG or SVG `DivIcon`). Anchored to a lat/lng point. Used for apartments (pin-drop style).
> - `CircleMarker`: SVG circle drawn in screen pixels (not map units). Stays the same pixel size regardless of zoom. Used for localities — cleaner at all zoom levels.
>
> I chose `CircleMarker` for localities because they don't clutter as the user zooms out.

---

**Q22. Why use `L.layerGroup()` imperatively for transit instead of React components?**

> Transit layers can have **200+ markers** (bus stops fill the entire city). If each were a React component, React's reconciler would:
> 1. Diff all 200+ on every state change
> 2. Call `componentDidUpdate` on each marker
>
> With an imperative layer group:
> ```typescript
> const layerGroup = L.layerGroup();
> stops.forEach(stop => { /* create marker */ layerGroup.addLayer(marker); });
> layerGroup.addTo(map);
> return () => map.removeLayer(layerGroup); // cleanup
> ```
> All 200 markers are added in one synchronous loop. Cleanup is a single `removeLayer`. ~10x faster than React-managed components.

---

**Q23. Explain the flyTo animation mechanism.**

> Leaflet's built-in `map.flyTo(latlng, zoom, options)` uses a **smooth pan + zoom animation** inspired by [Zooming in on a point](https://www.win.tue.nl/~vanwijk/zoompan.pdf) (van Wijk & Nuij). It:
> 1. Zooms out slightly to show the context
> 2. Pans to the target
> 3. Zooms in to the target zoom level
>
> ```typescript
> mapRef.current.flyTo([locality.lat, locality.lng], 14, {
>   animate: true,
>   duration: 1.2  // seconds
> });
> ```
>
> Duration is intentionally 1.2s — long enough to feel smooth, short enough not to be frustrating.

---

**Q24. What is the Overpass API and how does it work?**

> The Overpass API is a **read-only query interface** for OpenStreetMap data. It uses a custom query language (Overpass QL):
>
> ```
> [out:json][timeout:25];
> node["railway"="station"]["network"="Namma Metro"](bbox);
> out body;
> ```
>
> - `[out:json]` — response format
> - `[timeout:25]` — server timeout in seconds
> - `node["key"="value"]` — filter OSM nodes by tag
> - `(bbox)` — geographic bounding box filter
> - `out body` — include all data
>
> Data comes from OSM community contributors and is updated continuously. No API key needed. Rate limit: 1 query/second per IP (our caching strategy respects this).

---

**Q25. How do you handle the Leaflet `window is not defined` error in Next.js?**

> Three approaches, I used #1:
>
> 1. **`dynamic(ssr: false)`** — Don't SSR the component at all (my approach)
> 2. **`typeof window !== 'undefined'`** guard — Conditional import in `useEffect`
> 3. **`'use client'` directive** — Marks as client component, but still fails SSR

---

## 📌 SECTION 6 — TypeScript Questions

**Q26. Why strict TypeScript mode and what does it enable?**

> `"strict": true` in tsconfig enables:
> - `strictNullChecks` — `null | undefined` must be handled explicitly
> - `noImplicitAny` — no `any` without explicit annotation
> - `strictFunctionTypes` — stricter function parameter checking
> - `strictPropertyInitialization` — class properties must be initialized
>
> In this project, it caught: forgetting to handle `null` map ref before `flyTo()`, not checking if `apartment.locality_id` finds a matching locality, and missing error cases in Supabase queries.

---

**Q27. Explain TypeScript discriminated unions used in this project.**

> `SearchResult` uses a discriminated union:
> ```typescript
> export type SearchResultType = 'locality' | 'apartment';
>
> export interface SearchResult {
>   id: string;
>   type: SearchResultType; // discriminant
>   label: string;
>   lat: number;
>   lng: number;
>   locality_id?: string; // only for apartments
> }
> ```
>
> When handling a result:
> ```typescript
> if (result.type === 'locality') {
>   // TypeScript knows: locality_id might be undefined here
> } else {
>   // result.type === 'apartment'
>   // locality_id is expected
> }
> ```

---

**Q28. What is the difference between `type` and `interface` in TypeScript?**

> | | `interface` | `type` |
> |--|-------------|--------|
> | Extends | `extends` keyword | `&` intersection |
> | Declaration merge | ✅ Yes | ❌ No |
> | Mapped types | ❌ No | ✅ Yes |
> | Primitives | ❌ No | ✅ Yes |
>
> I use `interface` for object shapes (components, API responses) and `type` for unions and utility types.

---

## 📌 SECTION 7 — CSS / Tailwind Questions

**Q29. How does the dark mode implementation work?**

> **Class-based dark mode** (not `prefers-color-scheme` media query):
>
> 1. `tailwind.config.ts`: `darkMode: 'class'` — dark mode activates when `<html class="dark">` is set
> 2. Anti-FOUC script in `layout.tsx` runs before paint:
>    ```javascript
>    const stored = localStorage.getItem('geosmart_theme');
>    if (stored === 'dark' || (!stored && prefersDark)) {
>      document.documentElement.classList.add('dark');
>    }
>    ```
> 3. `ThemeToggle` component toggles the class and saves to localStorage
> 4. All components use Tailwind `dark:` variants: `bg-white dark:bg-surface-dark-secondary`
> 5. Map tiles switch: light → Carto Light, dark → Carto Dark (observed via `MutationObserver` on `<html>`)

---

**Q30. What is `tailwind-merge` and why do you use it?**

> `tailwind-merge` solves Tailwind's class conflict problem:
>
> ```typescript
> // Without tw-merge: both bg-red-500 and bg-blue-500 applied — red wins (random)
> cn('bg-red-500', props.className) // props.className = 'bg-blue-500'
>
> // With tw-merge: last one wins correctly
> twMerge('bg-red-500', 'bg-blue-500') // → 'bg-blue-500'
> ```
>
> Used via the `cn()` utility:
> ```typescript
> export function cn(...inputs: ClassValue[]) {
>   return twMerge(clsx(inputs));
> }
> ```

---

## 📌 SECTION 8 — Performance & Optimization

**Q31. How did you optimize performance for the map?**

> 1. **Lazy load Leaflet** (`dynamic(ssr:false)`) — not in initial bundle
> 2. **Imperative transit layers** — `L.layerGroup()` vs 200 React components
> 3. **`useMemo` for Haversine** — only recomputes when locality changes
> 4. **In-memory transit cache** (`useRef`) — no re-fetch on re-toggle
> 5. **CircleMarker** for localities — SVG, no image assets to load
> 6. **Zoom gating** — apartments only render at zoom ≥ 16 (15 × fewer DOM nodes at city view)
> 7. **AbortSignal timeout** on Overpass — prevents UI hang from slow network

---

**Q32. What is the bundle size and how can it be reduced?**

> Current build output:
> ```
> Route /   57.9 kB (First Load JS: 145 kB)
> ```
>
> 145 kB includes Framer Motion, Leaflet, React-Leaflet. To reduce:
> 1. **Tree-shake Framer Motion**: Import only `motion.div` not entire package
> 2. **Leaflet**: Already lazy-loaded — not in initial bundle
> 3. **Code splitting**: Each sidebar/map component could be dynamically imported
> 4. **Lucide icons**: Import only used icons (already done)

---

## 📌 SECTION 9 — Deployment & DevOps

**Q33. How would you deploy this to production?**

```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Vercel
vercel --prod

# 3. Set environment variables in Vercel Dashboard
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# 4. Automatic deployments on every git push
# Preview deployments on every PR
```

> **Vercel specifics**: API routes become serverless functions. `/api/transit` has a 10-second timeout on Hobby plan (Overpass queries take 2-5s — fine). Pro plan: 60s timeout.

---

**Q34. What environment variables does this app need?**

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ⚠️ Optional | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⚠️ Optional | Supabase anon key |

> `NEXT_PUBLIC_` prefix makes them available in browser JavaScript. Without them, the app works with static data — transit caching is disabled.

---

## 📌 SECTION 10 — Future Enhancements

**Q35. What would you add next?**

> 1. **Helper profile matching** — Link helpers to their locality, show coverage on map
> 2. **Heatmap layer** — Helper density by locality using Leaflet.heat plugin
> 3. **Real-time updates** — Supabase Realtime to push new apartment additions live
> 4. **Route planning** — Show optimal transit path from apartment to helper's home
> 5. **Analytics dashboard** — Which localities have highest demand vs supply
> 6. **Polygon boundaries** — Draw actual locality boundaries using GeoJSON
> 7. **Offline PWA** — Service worker to cache tiles and data for field agents
> 8. **Role-based access** — Agents can add apartments; admins can edit localities

---

## Quick Reference Card

| Topic | Key Points |
|-------|-----------|
| Haversine | Earth radius 6371km, returns km, client-side, O(n) |
| Supabase | PostgreSQL, RLS, anon key for client, service key for server |
| Leaflet SSR | `dynamic(ssr:false)`, `useRef` for map instance |
| Transit cache | 24h TTL, `cached_at >= NOW() - INTERVAL '24h'` |
| Zoom levels | `<13` locality, `13-15` +pincode, `≥16` apartments |
| Dark mode | `class` strategy, anti-FOUC inline script, MutationObserver |
| Debounce | 300ms `setTimeout` + `clearTimeout` in `useCallback` |
| Error boundary | Class component, `getDerivedStateFromError`, reset button |
| AnimatePresence | Required for exit animations in Framer Motion |
| Overpass bbox | `12.73,77.39,13.14,77.78` = Bangalore bounds |
