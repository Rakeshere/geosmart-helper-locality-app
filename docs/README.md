# GeoSmart Helper Locality App — Complete Project Documentation

> **EzyHelpers Internal Operations Dashboard**  
> Built for sourcing agents to visualize Bangalore localities, apartment complexes, and transit options.

---

## 📋 Table of Contents

| Doc | Description |
|-----|-------------|
| [PROJECT.md](./PROJECT.md) | Full project overview, features, decisions |
| [DATABASE.md](./DATABASE.md) | Schema, ERD, queries, Supabase setup |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, component tree, data flow |
| [API.md](./API.md) | All API routes, request/response contracts |
| [MAP.md](./MAP.md) | Leaflet setup, markers, layers, zoom logic |
| [INTERVIEW.md](./INTERVIEW.md) | 50+ interview Q&A covering every part of this project |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Vercel, environment, CI/CD setup |

---

## Quick Start

```bash
git clone <repo>
cd geosmart-app
npm install
cp .env.local.example .env.local   # Fill in Supabase keys (optional)
npm run dev                         # → http://localhost:3000
```

---

## Tech Stack at a Glance

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 (App Router) | SSR, API routes, file-based routing |
| Language | TypeScript (strict) | Type safety, better DX |
| Styling | Tailwind CSS | Utility-first, fast iteration |
| Map | Leaflet + React-Leaflet | Most mature open-source map lib |
| Tiles | OpenStreetMap (Carto) | Free, no API key needed |
| Animation | Framer Motion | Production-grade React animations |
| Database | Supabase (PostgreSQL) | Open-source Firebase alternative |
| Transit API | Overpass API | Free OSM data query engine |
| Deployment | Vercel | Zero-config Next.js hosting |
