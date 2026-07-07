-- ============================================================
-- GeoSmart Helper Locality App — Supabase SQL Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ── Enable UUID extension ─────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── localities ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS localities (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  pincode     TEXT NOT NULL,
  lat         DOUBLE PRECISION NOT NULL,
  lng         DOUBLE PRECISION NOT NULL,
  apartment_count INTEGER NOT NULL DEFAULT 0,
  zone        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── apartments ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS apartments (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  locality_id   TEXT NOT NULL REFERENCES localities(id) ON DELETE CASCADE,
  lat           DOUBLE PRECISION NOT NULL,
  lng           DOUBLE PRECISION NOT NULL,
  address       TEXT NOT NULL,
  total_units   INTEGER NOT NULL DEFAULT 0,
  pincode       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_apartments_locality_id ON apartments(locality_id);

-- ── transit_cache ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transit_cache (
  id          TEXT PRIMARY KEY,
  type        TEXT NOT NULL CHECK (type IN ('metro', 'bus', 'railway', 'auto')),
  lat         DOUBLE PRECISION NOT NULL,
  lng         DOUBLE PRECISION NOT NULL,
  name        TEXT NOT NULL,
  cached_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transit_cache_type ON transit_cache(type);
CREATE INDEX IF NOT EXISTS idx_transit_cache_cached_at ON transit_cache(cached_at);

-- ── Row Level Security (optional — internal tool) ─────────────
-- ALTER TABLE localities ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transit_cache ENABLE ROW LEVEL SECURITY;

-- ── Seed localities ───────────────────────────────────────────
INSERT INTO localities (id, name, pincode, lat, lng, apartment_count, zone) VALUES
  ('loc-01', 'Koramangala',      '560034', 12.9352, 77.6245, 4, 'South'),
  ('loc-02', 'Indiranagar',      '560038', 12.9784, 77.6408, 2, 'East'),
  ('loc-03', 'HSR Layout',       '560102', 12.9116, 77.6389, 3, 'South'),
  ('loc-04', 'Whitefield',       '560066', 12.9698, 77.7499, 1, 'East'),
  ('loc-05', 'Electronic City',  '560100', 12.8399, 77.6770, 1, 'South'),
  ('loc-06', 'Marathahalli',     '560037', 12.9591, 77.6972, 2, 'East'),
  ('loc-07', 'Jayanagar',        '560041', 12.9308, 77.5839, 1, 'South'),
  ('loc-08', 'JP Nagar',         '560078', 12.9077, 77.5857, 1, 'South'),
  ('loc-09', 'BTM Layout',       '560076', 12.9166, 77.6101, 2, 'South'),
  ('loc-10', 'Bellandur',        '560103', 12.9257, 77.6699, 1, 'South East'),
  ('loc-11', 'Sarjapur Road',    '560035', 12.9012, 77.6822, 0, 'South East'),
  ('loc-12', 'Bannerghatta Road','560083', 12.8870, 77.5973, 0, 'South'),
  ('loc-13', 'Hebbal',           '560024', 13.0358, 77.5970, 1, 'North'),
  ('loc-14', 'Yelahanka',        '560064', 13.1004, 77.5963, 1, 'North'),
  ('loc-15', 'Rajajinagar',      '560010', 12.9857, 77.5530, 0, 'West')
ON CONFLICT (id) DO NOTHING;

-- ── Seed apartments ───────────────────────────────────────────
INSERT INTO apartments (id, name, locality_id, lat, lng, address, total_units, pincode) VALUES
  ('apt-01', 'Prestige Lakeside Habitat', 'loc-01', 12.9386, 77.6312, '5th Block, Koramangala, Bangalore 560034', 1610, '560034'),
  ('apt-02', 'Sobha Dream Acres',         'loc-01', 12.9312, 77.6198, '4th Block, Koramangala, Bangalore 560034', 2800, '560034'),
  ('apt-03', 'Embassy Residency',         'loc-01', 12.9421, 77.6287, '6th Block, Koramangala, Bangalore 560034', 340, '560034'),
  ('apt-04', 'Mantri Splendor',           'loc-01', 12.9278, 77.6215, '3rd Block, Koramangala, Bangalore 560034', 188, '560034'),
  ('apt-05', 'Brigade Cosmopolis',        'loc-02', 12.9801, 77.6453, '100 Feet Road, Indiranagar, Bangalore 560038', 1350, '560038'),
  ('apt-06', 'Godrej Woodsman Estate',    'loc-02', 12.9768, 77.6389, 'HAL 3rd Stage, Indiranagar, Bangalore 560038', 220, '560038'),
  ('apt-07', 'Adarsh Palm Retreat',       'loc-03', 12.9143, 77.6412, 'Sector 2, HSR Layout, Bangalore 560102', 900, '560102'),
  ('apt-08', 'Salarpuria Sattva Gold Summit','loc-03',12.9089,77.6367,'Sector 7, HSR Layout, Bangalore 560102', 375, '560102'),
  ('apt-09', 'Purva Sunflower',           'loc-03', 12.9122, 77.6403, 'Sector 4, HSR Layout, Bangalore 560102', 156, '560102'),
  ('apt-10', 'Prestige Shantiniketan',    'loc-04', 12.9712, 77.7523, 'ITPL Main Road, Whitefield, Bangalore 560066', 2500, '560066'),
  ('apt-11', 'Mantri Webcity',            'loc-05', 12.8421, 77.6742, 'Phase 1, Electronic City, Bangalore 560100', 1000, '560100'),
  ('apt-12', 'Purva East Face',           'loc-06', 12.9623, 77.6989, 'Marathahalli Bridge, Bangalore 560037', 300, '560037'),
  ('apt-13', 'Brigade Metropolis',        'loc-06', 12.9567, 77.6945, 'Garudacharpalya, Marathahalli, Bangalore 560037', 1500, '560037'),
  ('apt-14', 'Sobha Tulip',               'loc-07', 12.9329, 77.5867, '4th Block, Jayanagar, Bangalore 560041', 48, '560041'),
  ('apt-15', 'Prestige Ferns Residency',  'loc-08', 12.9088, 77.5879, 'Phase 2, JP Nagar, Bangalore 560078', 768, '560078'),
  ('apt-16', 'DSR Waterfront',            'loc-09', 12.9178, 77.6134, 'Stage 1, BTM Layout, Bangalore 560076', 240, '560076'),
  ('apt-17', 'Gopalan Grandeur',          'loc-09', 12.9154, 77.6089, 'Stage 2, BTM Layout, Bangalore 560076', 350, '560076'),
  ('apt-18', 'Brigade Lakefront',         'loc-10', 12.9278, 77.6721, 'Outer Ring Road, Bellandur, Bangalore 560103', 740, '560103'),
  ('apt-19', 'Prestige Misty Waters',     'loc-13', 13.0381, 77.5989, 'Hebbal Fly Over, Bangalore 560024', 480, '560024'),
  ('apt-20', 'Brigade Northridge',        'loc-14', 13.1023, 77.5978, 'Yelahanka New Town, Bangalore 560064', 200, '560064')
ON CONFLICT (id) DO NOTHING;
