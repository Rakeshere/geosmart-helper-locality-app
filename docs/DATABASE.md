# Database Documentation — GeoSmart Helper Locality App

## Overview

The app uses **Supabase** (PostgreSQL) for:
1. Persistent locality and apartment data
2. **Transit data caching** (24-hour TTL) from Overpass API
3. Future: user sessions, audit logs

> **Graceful Degradation**: Without Supabase credentials, the app falls back to static seed data in `data/localities.ts`. All features work — only transit caching is disabled.

---

## Entity-Relationship Diagram

```
┌─────────────────┐         ┌──────────────────────┐
│    localities   │         │      apartments       │
├─────────────────┤         ├──────────────────────┤
│ id (PK)  TEXT   │◄────┐   │ id (PK)       TEXT   │
│ name     TEXT   │     │   │ name          TEXT   │
│ pincode  TEXT   │     └───│ locality_id   TEXT   │ ← FK
│ lat      FLOAT8 │         │ lat           FLOAT8 │
│ lng      FLOAT8 │         │ lng           FLOAT8 │
│ apt_count INT   │         │ address       TEXT   │
│ zone     TEXT   │         │ total_units   INT    │
│ created_at TSTZ │         │ pincode       TEXT   │
└─────────────────┘         │ created_at    TSTZ   │
                            └──────────────────────┘

┌──────────────────────────┐
│       transit_cache      │
├──────────────────────────┤
│ id        TEXT (PK)      │  ← Format: "{type}-{osm_id}"
│ type      TEXT           │  ← metro | bus | railway | auto
│ lat       FLOAT8         │
│ lng       FLOAT8         │
│ name      TEXT           │
│ cached_at TIMESTAMPTZ    │  ← Used for TTL (24h)
└──────────────────────────┘
```

---

## Full Schema (SQL)

```sql
-- ── Extension ────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Table: localities ────────────────────────────────────────────
CREATE TABLE localities (
  id              TEXT PRIMARY KEY,         -- e.g. "loc-01"
  name            TEXT NOT NULL,            -- "Koramangala"
  pincode         TEXT NOT NULL,            -- "560034"
  lat             DOUBLE PRECISION NOT NULL, -- 12.9352
  lng             DOUBLE PRECISION NOT NULL, -- 77.6245
  apartment_count INTEGER NOT NULL DEFAULT 0,
  zone            TEXT,                     -- "South", "North", etc.
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Table: apartments ────────────────────────────────────────────
CREATE TABLE apartments (
  id           TEXT PRIMARY KEY,         -- "apt-01"
  name         TEXT NOT NULL,            -- "Prestige Lakeside Habitat"
  locality_id  TEXT NOT NULL REFERENCES localities(id) ON DELETE CASCADE,
  lat          DOUBLE PRECISION NOT NULL,
  lng          DOUBLE PRECISION NOT NULL,
  address      TEXT NOT NULL,
  total_units  INTEGER NOT NULL DEFAULT 0,
  pincode      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast locality → apartment lookups
CREATE INDEX idx_apartments_locality_id ON apartments(locality_id);

-- ── Table: transit_cache ─────────────────────────────────────────
CREATE TABLE transit_cache (
  id         TEXT PRIMARY KEY,    -- "{type}-{osm_node_id}"
  type       TEXT NOT NULL CHECK (type IN ('metro', 'bus', 'railway', 'auto')),
  lat        DOUBLE PRECISION NOT NULL,
  lng        DOUBLE PRECISION NOT NULL,
  name       TEXT NOT NULL,
  cached_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for cache queries
CREATE INDEX idx_transit_type      ON transit_cache(type);
CREATE INDEX idx_transit_cached_at ON transit_cache(cached_at);
```

---

## Indexes & Performance

| Table | Index | Purpose |
|-------|-------|---------|
| `apartments` | `locality_id` | Fast join when fetching apartments for a locality |
| `transit_cache` | `type` | Filter by transit type efficiently |
| `transit_cache` | `cached_at` | TTL checks (WHERE cached_at >= cutoff) |

**Query Complexity**:
- Locality lookup: O(1) by PK
- Apartments by locality: O(k) where k = apartments in that locality (indexed)
- Transit cache check: O(n/4) with type index — typically 50–200 rows per type

---

## Key Queries

### 1. Fetch fresh transit cache (within 24 hours)
```sql
SELECT *
FROM transit_cache
WHERE type = 'metro'
  AND cached_at >= NOW() - INTERVAL '24 hours'
LIMIT 500;
```

### 2. Upsert transit stops (cache write)
```sql
INSERT INTO transit_cache (id, type, lat, lng, name, cached_at)
VALUES ($1, $2, $3, $4, $5, NOW())
ON CONFLICT (id) DO UPDATE SET
  name      = EXCLUDED.name,
  cached_at = EXCLUDED.cached_at;
```

### 3. Apartments near a locality (raw SQL alternative to app-side Haversine)
```sql
-- Using PostgreSQL earth_distance extension (optional)
SELECT a.*,
  earth_distance(
    ll_to_earth(a.lat, a.lng),
    ll_to_earth($1, $2)       -- locality lat, lng
  ) / 1000.0 AS distance_km
FROM apartments a
WHERE earth_distance(
  ll_to_earth(a.lat, a.lng),
  ll_to_earth($1, $2)
) / 1000.0 <= 3.5
ORDER BY distance_km;
```
> Note: We use **client-side Haversine** for proximity — avoids a server round-trip since data is small (~20 apartments).

### 4. Purge stale transit cache (maintenance)
```sql
DELETE FROM transit_cache
WHERE cached_at < NOW() - INTERVAL '48 hours';
```

---

## Row Level Security (RLS)

For an internal tool, RLS is optional but recommended:

```sql
-- Enable RLS
ALTER TABLE localities     ENABLE ROW LEVEL SECURITY;
ALTER TABLE apartments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE transit_cache  ENABLE ROW LEVEL SECURITY;

-- Allow all reads with anon key (internal dashboard — everyone can read)
CREATE POLICY "allow_read_localities"
  ON localities FOR SELECT USING (true);

CREATE POLICY "allow_read_apartments"
  ON apartments FOR SELECT USING (true);

CREATE POLICY "allow_all_transit_cache"
  ON transit_cache FOR ALL USING (true);

-- Restrict writes to authenticated users only
CREATE POLICY "allow_auth_write_localities"
  ON localities FOR INSERT TO authenticated USING (true);
```

---

## Data Volume Estimates

| Table | Current | Projected (2yr) | Storage |
|-------|---------|-----------------|---------|
| `localities` | 15 rows | 128 rows | < 50 KB |
| `apartments` | 20 rows | 2,500 rows | < 1 MB |
| `transit_cache` | ~500 rows | ~2,000 rows | < 500 KB |

**Total**: well under Supabase free tier (500 MB).

---

## Supabase Setup Steps

1. **Create project** → [supabase.com](https://supabase.com) → New Project
2. **Run migration** → SQL Editor → paste `supabase/migrations/001_initial_schema.sql`
3. **Get keys** → Settings → API
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Set env** → `.env.local`
5. Restart dev server

---

## Supabase Client (services/supabase.ts)

```typescript
import { createClient } from '@supabase/supabase-js';

export const isSupabaseConfigured =
  supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 20;

// If unconfigured → placeholder client → all queries throw
// The app catches these errors and falls back to static data
export const supabase = createClient(url, key);
```

**Graceful Degradation Flow**:
```
User opens app
    ↓
useLocalities() fetches /api/localities
    ↓ (try)
API route returns static seed data (no DB needed)
    ↓
Transit toggle clicked → /api/transit?type=metro
    ↓ (try Supabase cache)
isSupabaseConfigured = false → skip cache
    ↓ (try Overpass API)
Fetch from overpass-api.de
    ↓ (success)
Return stops to UI
    ↓ (failure)
Return 503 → UI shows toast "Transit data unavailable"
```
