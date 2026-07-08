# Database Documentation

## Overview

GeoSmart uses **Supabase (PostgreSQL)** to store application data and cache transit information.

The database is designed to be lightweight, scalable, and easy to maintain.

### Responsibilities

- Store locality information
- Store apartment information
- Cache transit data from Overpass API
- Support future authentication and analytics

> **Fallback Support:** If Supabase is not configured, the application automatically uses local seed data, ensuring all core features continue to work.

---

# Database Schema

```
Localities (1)
      │
      │
      ▼
Apartments (Many)

Transit Cache
```

### Tables

| Table | Purpose |
|--------|---------|
| **localities** | Stores Bangalore localities |
| **apartments** | Stores apartment details linked to a locality |
| **transit_cache** | Caches Metro, Bus, Railway and Auto data |

---

# Relationships

```
Locality
   │
   ├── Apartment
   ├── Apartment
   ├── Apartment
   └── Apartment
```

Each apartment belongs to a single locality.

---

# Database Flow

```
User opens app
        │
        ▼
Load Localities
        │
        ▼
Display Apartments
        │
        ▼
User enables Transit
        │
        ▼
Check Supabase Cache
        │
   Cache Found?
   ┌──────┴──────┐
   │             │
 Yes            No
   │             │
   ▼             ▼
Return Data   Fetch Overpass API
                   │
                   ▼
            Save to Cache
                   │
                   ▼
             Return Result
```

---

# Main Tables

### Localities

Stores:

- Name
- Pincode
- Coordinates
- Zone
- Apartment count

---

### Apartments

Stores:

- Apartment name
- Address
- Coordinates
- Total units
- Linked locality

---

### Transit Cache

Stores:

- Transit type
- Location
- Stop name
- Cache timestamp

Transit data is refreshed every **24 hours** to reduce unnecessary API requests.

---

# Performance Optimizations

- Indexed locality lookup
- Indexed transit cache
- Cache-first API strategy
- Client-side distance calculation
- Automatic fallback to local data

---

# Scalability

Current capacity

| Resource | Current | Designed For |
|----------|---------|--------------|
| Localities | 15 | 100+ |
| Apartments | 20 | 2,500+ |
| Transit Stops | ~500 | 5,000+ |

The database comfortably fits within the **Supabase Free Tier**.

---

# Why Supabase?

- PostgreSQL database
- Simple REST API
- Built-in authentication
- Easy deployment
- Real-time support
- Scalable architecture

---

# Setup

```bash
cp .env.local.example .env.local
```

Add:

```
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run the SQL migration and start the application.

```bash
npm install

npm run dev
```

---

# Design Decisions

- PostgreSQL for structured relational data
- One-to-many relationship between localities and apartments
- Transit data cached to improve performance
- Automatic fallback when database is unavailable
- Designed for future expansion with authentication and analytics

---

# Summary

The database architecture is intentionally simple and optimized for this dashboard.

It provides:

- Fast locality lookups
- Efficient apartment management
- Cached transit data
- Reliable fallback support
- Easy scalability for future growth
