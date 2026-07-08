# API Documentation GeoSmart Helper Locality App

## Overview

Two internal API routes, both served by Next.js App Router:

| Route | Method | Description |
|-------|--------|-------------|
| `/api/localities` | GET | Returns all localities and apartments |
| `/api/transit` | GET | Proxy to Overpass API with Supabase caching |

---

## GET /api/localities

Returns all 15 localities and 20 apartments from static seed data.

### Request
```
GET /api/localities
```

### Response `200 OK`
```json
{
  "localities": [
    {
      "id": "loc-01",
      "name": "Koramangala",
      "pincode": "560034",
      "lat": 12.9352,
      "lng": 77.6245,
      "apartment_count": 4,
      "zone": "South"
    }
    // ... 14 more
  ],
  "apartments": [
    {
      "id": "apt-01",
      "name": "Prestige Lakeside Habitat",
      "locality_id": "loc-01",
      "locality_name": "Koramangala",
      "lat": 12.9386,
      "lng": 77.6312,
      "address": "5th Block, Koramangala, Bangalore 560034",
      "total_units": 1610,
      "pincode": "560034"
    }
    // ... 19 more
  ]
}
```

### Cache Headers
```
Cache-Control: public, max-age=300, stale-while-revalidate=600
```

---

## GET /api/transit

Fetches transit stops for a given type. Cache-first: checks Supabase, falls back to Overpass API.

### Request
```
GET /api/transit?type=metro
```

**Query Params**:

| Param | Type | Required | Values |
|-------|------|----------|--------|
| `type` | string | ✅ | `metro` \| `bus` \| `railway` \| `auto` |

### Response `200 OK`
```json
{
  "stops": [
    {
      "id": "metro-1234567",
      "name": "Majestic Metro Station",
      "type": "metro",
      "lat": 12.9767,
      "lng": 77.5713
    }
    // ... more stops
  ],
  "cached": false
}
```

### Response `400 Bad Request`
```json
{
  "error": "Invalid transit type. Valid: metro, bus, railway, auto"
}
```

### Response `503 Service Unavailable`
```json
{
  "error": "Transit data unavailable",
  "stops": []
}
```

### Cache Strategy

```
Request → Check Supabase cache (WHERE type = $type AND cached_at >= NOW() - 24h)
  ↓ Cache HIT  → Return cached stops (fast, ~10ms)
  ↓ Cache MISS → Fetch from Overpass API (~2-5 seconds)
                 → Upsert to Supabase (background, non-blocking)
                 → Return fresh stops
```

### Cache Headers
```
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
```

---

## Overpass API Queries

The Overpass API is the query engine for OpenStreetMap data.

### Metro Stations
```
[out:json][timeout:25];
node["railway"="station"]["network"="Namma Metro"](12.73,77.39,13.14,77.78);
out body;
```

### Bus Stops
```
[out:json][timeout:25];
node["highway"="bus_stop"](12.73,77.39,13.14,77.78);
out body;
```

### Railway Stations
```
[out:json][timeout:25];
node["railway"="station"]["network"!="Namma Metro"](12.73,77.39,13.14,77.78);
out body;
```

### Auto Stands
```
[out:json][timeout:25];
node["amenity"="taxi"](12.73,77.39,13.14,77.78);
out body;
```

**Bounding Box**: `12.73,77.39,13.14,77.78` = South Bangalore to North Bangalore

### Overpass Response Shape
```json
{
  "elements": [
    {
      "type": "node",
      "id": 1234567,
      "lat": 12.9767,
      "lon": 77.5713,
      "tags": {
        "name": "Majestic",
        "name:en": "Majestic Metro",
        "railway": "station",
        "network": "Namma Metro"
      }
    }
  ]
}
```

---

## Error Handling

| Scenario | Behaviour |
|----------|-----------|
| Overpass timeout (>20s) | `AbortSignal.timeout(20_000)` throws; 503 returned |
| Overpass rate limit | 503 returned; UI shows toast |
| Supabase down | Skipped; falls through to Overpass |
| Invalid transit type | 400 returned |
| Unknown locality ID in search | Silently skipped |
