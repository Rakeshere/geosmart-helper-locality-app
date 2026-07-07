# Map Documentation — GeoSmart Helper Locality App

## Leaflet Setup in Next.js

### The SSR Problem

Leaflet is a **browser-only library** — it references `window`, `document`, `navigator` on import. Next.js runs components on the server (Node.js) where these don't exist.

**Solution**: Dynamic import with `ssr: false`

```typescript
// page.tsx
const MapContainer = dynamic(
  () => import('@/components/map/MapContainer').then(m => m.MapContainer),
  {
    ssr: false,                    // Never render on server
    loading: () => <LoadingSpinner />  // Show while JS loads
  }
);
```

### Tile Configuration

```typescript
// Light mode (Carto Light)
const TILE_URL_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

// Dark mode (Carto Dark)
const TILE_URL_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

// Attribution (required by OSM license)
const TILE_ATTRIBUTION = '© OpenStreetMap contributors © CARTO';
```

Dark mode detection via `MutationObserver` watching `<html class="dark">` toggle.

---

## Marker System

### LocalityMarker — `CircleMarker`

```typescript
type MarkerState = 'default' | 'selected' | 'nearby';

const MARKER_STYLE = {
  default:  { color: '#A5B4FC', fillColor: '#6366F1', radius: 14, weight: 2 },
  selected: { color: '#93C5FD', fillColor: '#2563EB', radius: 18, weight: 3 },
  nearby:   { color: '#FED7AA', fillColor: '#F97316', radius: 15, weight: 2 },
};
```

**Why CircleMarker?**: Stays the same pixel size regardless of zoom — no cluttering at city view.

**Tooltip**: Permanent for selected locality, hover-only for others. Shows name, pincode (zoom ≥ 15), apt count.

### ApartmentMarker — `Marker` with DivIcon

Shows only at **zoom ≥ 16**:
```typescript
const showApartments = zoom >= ZOOM_WITH_APARTMENTS; // 16
{showApartments && apartments.map(apt => <ApartmentMarker key={apt.id} ... />)}
```

Pin-drop SVG icon with cyan colour (`#06B6D4`). Popup shows name, address, units, pincode.

### TransitLayer — Imperative `L.layerGroup()`

**Why imperative?** 200+ bus stops rendered as React components causes reconciliation overhead. Imperative is O(1) for the React tree:

```typescript
useEffect(() => {
  if (!visible || stops.length === 0) return;

  const layerGroup = L.layerGroup();
  stops.forEach(stop => {
    const icon = L.divIcon({ html: createTransitMarkerSvg(type), ... });
    const marker = L.marker([stop.lat, stop.lng], { icon });
    marker.bindPopup(`<strong>${stop.name}</strong>`);
    layerGroup.addLayer(marker);
  });
  layerGroup.addTo(map);

  return () => map.removeLayer(layerGroup); // Cleanup
}, [map, type, stops, visible]);
```

---

## Map Events

```typescript
function MapEvents({ onZoomChange, onMapReady }) {
  const map = useMapEvents({
    zoomend: () => onZoomChange(map.getZoom()),
  });

  useEffect(() => {
    onMapReady(map);           // Store ref
    onZoomChange(map.getZoom()); // Initial zoom
  }, []);

  return null; // Render-nothing component
}
```

---

## flyTo Animation

```typescript
// Smooth camera transition to selected locality
map.flyTo([locality.lat, locality.lng], 14, {
  animate: true,
  duration: 1.2   // seconds
});

// For apartments — zoom in more
map.flyTo([apt.lat, apt.lng], 16, {
  animate: true,
  duration: 1.2
});

// Reset
map.flyTo([12.9716, 77.5946], 12, {
  animate: true,
  duration: 1.0
});
```

---

## Zoom Level Thresholds

```typescript
export const ZOOM_LOCALITY_ONLY   = 13;   // Below: no labels
export const ZOOM_WITH_PINCODES   = 15;   // 13–15: show pincode in tooltip
export const ZOOM_WITH_APARTMENTS = 16;   // At/above: show apartment markers
```

Bangalore in context:
- Zoom 10: See entire Bangalore + surroundings
- Zoom 12: See major areas (default view)
- Zoom 14: See neighbourhood level
- Zoom 16: See individual streets + buildings
- Zoom 18: See individual houses

---

## Haversine Distance Formula

```typescript
export function haversineDistance(lat1, lng1, lat2, lng2): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
```

**Accuracy**: ±0.5% for distances up to 100 km (Haversine assumes a perfect sphere; Earth is slightly oblate). Sufficient for 3.5 km locality proximity.

**Performance**: O(n) for n localities. With 15 localities: 15 × 6 operations = 90 operations — negligible. Memoized with `useMemo`.

---

## Overpass API Integration

### Bounding Box (Bangalore)
```
SW corner: 12.73°N, 77.39°E
NE corner: 13.14°N, 77.78°E
Format: lat_min,lng_min,lat_max,lng_max
= "12.73,77.39,13.14,77.78"
```

### Query Execution Flow
```
1. POST https://overpass-api.de/api/interpreter
   Content-Type: application/x-www-form-urlencoded
   Body: data=<encoded Overpass QL query>

2. Timeout: AbortSignal.timeout(20_000)

3. Response: { elements: [{ id, lat, lon, tags: { name, ... } }] }

4. Map to TransitStop[]: { id: `${type}-${osm_id}`, name, type, lat, lng }
```

### Rate Limiting
- Overpass: ~1 query/second per IP
- Our cache (24h TTL) means max 4 queries per day per type per server IP
- Well within limits

---

## SVG Marker Generation

All markers are generated as SVG strings injected into `L.divIcon`:

```typescript
// Locality circle marker
export function createLocalityMarkerSvg(state, apartmentCount): string {
  const fill = state === 'selected' ? '#2563EB' : state === 'nearby' ? '#F97316' : '#6366F1';
  const size = state === 'selected' ? 42 : 34;
  return `<svg width="${size}" height="${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="${fill}"/>
    ${apartmentCount > 0 ? `<text ...>${apartmentCount}</text>` : ''}
  </svg>`;
}

// Transit square marker
export function createTransitMarkerSvg(type): string {
  const color = MARKER_COLORS[type]; // purple/green/red/yellow
  const icon = { metro: 'M', bus: 'B', railway: 'R', auto: 'A' }[type];
  return `<svg width="24" height="24">
    <rect rx="6" fill="${color}" opacity="0.9"/>
    <text>${icon}</text>
  </svg>`;
}
```
