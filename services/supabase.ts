// ============================================================
// Supabase Client — GeoSmart Helper Locality App
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Returns true when Supabase credentials are configured.
 * The app gracefully degrades to static seed data when false.
 */
export const isSupabaseConfigured =
  supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 20;

/** Supabase client — may be a no-op client if credentials are absent */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

// ── Table names ──────────────────────────────────────────────
export const TABLES = {
  localities: 'localities',
  apartments: 'apartments',
  transitCache: 'transit_cache',
} as const;
