// ============================================================
// Overpass API Service — Transit Data
// ============================================================

import {
  OVERPASS_API_URL,
  OVERPASS_QUERIES,
} from '@/utils/constants';
import type { TransitType, TransitStop, OverpassResponse } from '@/types';

/**
 * Fetch transit stops from the Overpass API for a given transit type.
 * Returns an empty array on failure (caller handles degradation).
 */
export async function fetchTransitFromOverpass(
  type: TransitType
): Promise<TransitStop[]> {
  const query = OVERPASS_QUERIES[type];

  // Use GET with encoded query param — more reliable than POST for Overpass
  const url = `${OVERPASS_API_URL}?data=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'GeoSmart-EzyHelpers/1.0 (internal dashboard)',
    },
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`Overpass API returned ${response.status}`);
  }

  const json: OverpassResponse = await response.json();

  const stops: TransitStop[] = json.elements
    .filter((el) => {
      // Nodes have lat/lon directly; ways/relations use center
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      return lat !== undefined && lon !== undefined;
    })
    .map((el) => ({
      id: `${type}-${el.id}`,
      name:
        el.tags?.name ??
        el.tags?.['name:en'] ??
        `${type.charAt(0).toUpperCase() + type.slice(1)} Stop`,
      type,
      lat: (el.lat ?? el.center!.lat)!,
      lng: (el.lon ?? el.center!.lon)!,
    }));

  return stops;
}
