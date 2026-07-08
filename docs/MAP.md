# Map Documentation

## Overview

GeoSmart uses **Leaflet** with **OpenStreetMap** to provide an interactive map of Bangalore for locality exploration and helper sourcing.

The map supports:

- Locality markers
- Apartment markers
- Nearby locality detection
- Transit layers
- Smart search
- Smooth map navigation

---

# Map Features

### Localities

- Displays all Bangalore localities
- Shows apartment count
- Highlights selected locality
- Highlights nearby localities within **3.5 km**

---

### Apartments

Apartment markers appear when zooming into the map.

Each marker displays:

- Apartment name
- Address
- Total units
- Pincode

---

### Transit Layers

Users can enable or disable:

- 🚇 Metro
- 🚌 Bus Stops
- 🚆 Railway Stations
- 🚕 Auto/Cab Stands

Transit data is retrieved from **OpenStreetMap (Overpass API)** and cached using **Supabase**.

---

# Map Flow

```
Open Application
        │
        ▼
Load Bangalore Map
        │
        ▼
Display Localities
        │
        ▼
Select Locality
        │
        ▼
Highlight Nearby Areas
        │
        ▼
Show Apartments & Details
```

---

# Search Flow

```
Search
    │
    ▼
Find Locality / Apartment
    │
    ▼
Move Map
    │
    ▼
Open Details
```

---

# Zoom Levels

| Zoom | Display |
|------|----------|
| < 13 | Localities |
| 13–15 | Localities + Pincode |
| ≥ 16 | Apartments |

This keeps the map clean and avoids unnecessary clutter.

---

# Nearby Locality Detection

The application calculates the distance between localities using the **Haversine formula**.

- Radius: **3.5 km**
- Runs on the client
- Optimized using memoization

---

# Transit Data

```
User enables Transit
        │
        ▼
Check Cache
        │
   Cache Available?
   ┌──────┴──────┐
   │             │
  Yes           No
   │             │
   ▼             ▼
Show Data   Fetch Overpass API
                 │
                 ▼
            Cache Result
```

This approach minimizes API requests and improves performance.

---

# Performance Optimizations

- Lazy-loaded Leaflet map
- Client-side caching
- Supabase transit cache
- Smooth fly-to navigation
- Memoized distance calculations
- Dynamic marker rendering

---

# Technologies

| Feature | Technology |
|----------|------------|
| Maps | Leaflet |
| Map Data | OpenStreetMap |
| Transit Data | Overpass API |
| Cache | Supabase |
| Framework | Next.js |
| Language | TypeScript |

---

# Design Decisions

- Leaflet provides lightweight interactive maps.
- OpenStreetMap offers free and reliable map tiles.
- Transit data is cached to reduce external API calls.
- Apartment markers are shown only at higher zoom levels to keep the interface clean.
- Nearby locality detection helps sourcing teams identify alternative helper locations quickly.

---

# Summary

The mapping system is designed to be **fast, responsive, and scalable**. It combines interactive maps, intelligent search, nearby locality detection, and transit information to help sourcing teams make location-based decisions efficiently.
