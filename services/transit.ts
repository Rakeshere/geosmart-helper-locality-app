// ============================================================
// Transit Service — Supabase Cache + Overpass API
// ============================================================

import { supabase, TABLES, isSupabaseConfigured } from '@/services/supabase';
import { fetchTransitFromOverpass } from '@/services/overpass';
import { TRANSIT_CACHE_TTL_HOURS } from '@/utils/constants';
import type { TransitType, TransitStop, TransitCache } from '@/types';

/**
 * Get transit stops for a given type.
 * Strategy:
 *  1. Check Supabase cache (if configured) — return if fresh (<24h)
 *  2. Fetch from Overpass API
 *  3. Save to Supabase cache
 *  4. Return stops (or throw so caller can show toast)
 */
export async function getTransitStops(type: TransitType): Promise<TransitStop[]> {
  // ── Try Supabase cache first ─────────────────────────────
  if (isSupabaseConfigured) {
    try {
      const cutoff = new Date(
        Date.now() - TRANSIT_CACHE_TTL_HOURS * 60 * 60 * 1000
      ).toISOString();

      const { data, error } = await supabase
        .from(TABLES.transitCache)
        .select('*')
        .eq('type', type)
        .gte('cached_at', cutoff)
        .limit(500);

      if (!error && data && data.length > 0) {
        // Cache hit — map rows to TransitStop
        return (data as TransitCache[]).map((row) => ({
          id: row.id,
          name: row.name,
          type: row.type,
          lat: row.lat,
          lng: row.lng,
        }));
      }
    } catch {
      // Supabase unavailable — continue to Overpass
    }
  }

  // ── Fetch from Overpass API ──────────────────────────────
  const stops = await fetchTransitFromOverpass(type);

  // ── Save to Supabase cache (fire-and-forget) ─────────────
  if (isSupabaseConfigured && stops.length > 0) {
    const rows = stops.map((s) => ({
      id: s.id,
      type: s.type,
      lat: s.lat,
      lng: s.lng,
      name: s.name,
      cached_at: new Date().toISOString(),
    }));

    // Upsert in batches of 100 to avoid request size limits
    for (let i = 0; i < rows.length; i += 100) {
      supabase
        .from(TABLES.transitCache)
        .upsert(rows.slice(i, i + 100), { onConflict: 'id' })
        .then(() => {});
    }
  }

  return stops;
}
