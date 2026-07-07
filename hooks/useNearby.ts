'use client';

// ============================================================
// useNearby — Haversine Proximity Calculation
// ============================================================

import { useMemo } from 'react';
import { haversineDistance } from '@/utils/haversine';
import { NEARBY_RADIUS_KM } from '@/utils/constants';
import type { Locality, LocalityWithDistance } from '@/types';

/**
 * Given a selected locality and all localities,
 * returns the list of nearby localities (within NEARBY_RADIUS_KM),
 * sorted by ascending distance, excluding the selected locality itself.
 */
export function useNearby(
  selectedLocality: Locality | null,
  allLocalities: Locality[]
): LocalityWithDistance[] {
  return useMemo(() => {
    if (!selectedLocality) return [];

    return allLocalities
      .filter((loc) => loc.id !== selectedLocality.id)
      .map((loc) => ({
        ...loc,
        distance_km: haversineDistance(
          selectedLocality.lat,
          selectedLocality.lng,
          loc.lat,
          loc.lng
        ),
      }))
      .filter((loc) => loc.distance_km <= NEARBY_RADIUS_KM)
      .sort((a, b) => a.distance_km - b.distance_km);
  }, [selectedLocality, allLocalities]);
}
