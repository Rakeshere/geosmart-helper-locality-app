# Architecture

## Overview

GeoSmart Helper is built using a simple, modular architecture that separates the UI, business logic, APIs, and external services.

```
Browser (React + Next.js)
        │
        ▼
 UI Components
(Header • Map • Sidebar • Search)
        │
        ▼
   Custom Hooks
(Map • Search • Transit)
        │
        ▼
    API Routes
(/api/localities, /api/transit)
        │
   ┌────┴────┐
   ▼         ▼
Static Data  Supabase Cache
              │
              ▼
         Overpass API
```

---

# Folder Structure

```
geosmart-app/
│
├── app/              # Next.js pages & API routes
├── components/       # UI components
├── hooks/            # Custom React hooks
├── services/         # Supabase & Overpass API
├── data/             # Locality & apartment data
├── utils/            # Helper functions
├── types/            # TypeScript interfaces
├── docs/             # Documentation
└── supabase/         # Database schema
```

---

# Application Flow

### 1. Load Application

```
User opens app
        │
        ▼
Load locality data
        │
        ▼
Render Bangalore map
        │
        ▼
Ready for interaction
```

---

### 2. Select Locality

```
Click locality
      │
      ▼
Highlight marker
      │
      ▼
Find nearby localities (3.5 km)
      │
      ▼
Open sidebar
```

---

### 3. Search

```
Search
    │
    ▼
Find locality/apartment
    │
    ▼
Move map
    │
    ▼
Open details
```

---

### 4. Transit Layer

```
Toggle Transit
      │
      ▼
Check Cache
      │
      ▼
Supabase
      │
      ▼
Overpass API (if needed)
      │
      ▼
Display markers
```

---

# Main Components

| Component | Responsibility |
|-----------|----------------|
| Header | Search, transit filters, reset |
| Map | Localities, apartments, transit layers |
| Sidebar | Selected locality details |
| Search | Autocomplete & recent searches |
| Transit Service | Fetch & cache transit data |
| Stats Card | Live statistics |
| Legend | Map color guide |

---

# State Management

The application uses **React Hooks** only.

- `useMap` → Map state
- `useSearch` → Search functionality
- `useTransit` → Transit layers
- `useNearby` → Distance calculation
- `useToast` → Notifications

No external state management library is required.

---

# Performance Optimizations

- Memoized distance calculations
- Debounced search (300 ms)
- Client-side caching
- Supabase transit cache
- Lazy-loaded Leaflet map
- Dynamic transit layers
- SSR-safe map rendering

---

# Technologies

| Layer | Technology |
|--------|------------|
| Frontend | Next.js 14 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Maps | Leaflet |
| Data | Supabase |
| Transit | Overpass API |
| Animation | Framer Motion |
| Deployment | Vercel |

---

# Design Decisions

- Modular component structure
- Type-safe architecture
- Responsive design
- Cache-first data fetching
- Separation of UI and business logic
- Easy to scale with additional localities and apartments

---

# Scalability

The architecture is designed to support:

- 100+ localities
- 2,500+ apartments
- Additional transit types
- Real database integration
- Future analytics and reporting features
