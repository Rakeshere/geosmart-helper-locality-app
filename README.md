# GeoSmart Helper Locality Dashboard

A production-ready geospatial dashboard built for **EzyHelpers** to help sourcing teams quickly identify Bangalore localities, apartment complexes, and nearby public transport for efficient helper sourcing and commute planning.

Built with **Next.js 14, TypeScript, Tailwind CSS, Leaflet, OpenStreetMap, Supabase, and Overpass API**.

---

## Overview

GeoSmart allows sourcing agents to:

- Visualize Bangalore localities on an interactive map
- Explore apartment complexes inside each locality
- Find nearby localities within a 3.5 km radius
- Search apartments, localities, pincodes, and addresses
- Display Metro, Bus, Railway and Auto/Cab transit layers
- Plan helper sourcing with better geographic visibility

The application is fully responsive and works on desktop, tablet, and mobile devices.

---

## Key Features

### Interactive Map

- Bangalore-focused map using OpenStreetMap
- Locality markers with apartment counts
- Nearby locality highlighting (3.5 km radius)
- Automatic map navigation
- Zoom-based layer rendering
- Apartment markers at higher zoom levels

### Smart Search

Search by:

- Locality
- Apartment name
- Pincode
- Address

Includes:

- Autocomplete
- Debounced search
- Recent searches
- Empty state handling

### Locality Details

Selecting a locality displays:

- Apartment list
- Apartment addresses
- Unit counts
- Pincode
- Nearby localities
- Distance between localities

### Transit Layers

Toggle live transit data for:

- Metro Stations
- Bus Stops
- Railway Stations
- Auto/Cab Stands

Transit data is fetched from OpenStreetMap using the Overpass API and cached for better performance.

### Dashboard

Live statistics including:

- Total Localities
- Total Apartments
- Visible Transit Points

### Responsive Design

- Desktop sidebar
- Mobile bottom sheet
- Dark mode
- Keyboard accessibility
- Smooth animations

---

## Tech Stack

| Category | Technology |
|-----------|------------|
| Framework | Next.js 14 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Maps | Leaflet + React Leaflet |
| Map Tiles | OpenStreetMap |
| Database | Supabase |
| Transit Data | Overpass API |
| Animations | Framer Motion |
| Deployment | Vercel |

---

## Project Structure

```
geosmart-app
│
├── app
├── components
├── hooks
├── services
├── data
├── utils
├── types
├── supabase
└── docs
```

---

## Getting Started

### Install

```bash
npm install
```

### Configure Environment

```bash
cp .env.local.example .env.local
```

Add your Supabase credentials.

### Run

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

### Production Build

```bash
npm run build
```

---

## Sample Dataset

### Localities

- Koramangala
- HSR Layout
- Whitefield
- Indiranagar
- Electronic City
- Bellandur
- Marathahalli
- JP Nagar
- Jayanagar
- Rajajinagar
- Hebbal
- Yelahanka
- Sarjapur Road
- Bannerghatta Road
- BTM Layout

### Apartments

20 real apartment complexes including:

- Prestige Lakeside Habitat
- Sobha Dream Acres
- Brigade Cosmopolis
- Prestige Shantiniketan
- Brigade Metropolis
- Adarsh Palm Retreat
- Prestige Ferns Residency
- Godrej Woodsman Estate

---

## Architecture Highlights

- Modular component architecture
- Type-safe TypeScript implementation
- Memoized proximity calculations
- Client-side caching
- Supabase-backed transit cache
- SSR-safe Leaflet integration
- Error boundaries
- Responsive UI components

---

## Assignment Requirements Covered

- Next.js App Router
- TypeScript
- Tailwind CSS
- Leaflet Maps
- OpenStreetMap
- Supabase
- Overpass API
- Responsive UI
- Search & Autocomplete
- Transit Layers
- Nearby Locality Detection
- Statistics Dashboard
- Accessibility
- Dark Mode
- Vercel Deployment Ready

---

## Documentation

Additional documentation is available inside the `/docs` folder:

- Architecture
- Database
- API
- Deployment
---

## License

Internal assignment for **EzyHelpers**.
