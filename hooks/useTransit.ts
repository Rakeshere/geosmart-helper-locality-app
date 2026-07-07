'use client';

// ============================================================
// useTransit — Transit Layer State & Data Fetching
// ============================================================

import { useState, useCallback, useRef } from 'react';
import type { TransitType, TransitStop, TransitLayerState } from '@/types';

interface UseTransitReturn {
  layers: TransitLayerState;
  stops: Partial<Record<TransitType, TransitStop[]>>;
  loadingLayers: Partial<Record<TransitType, boolean>>;
  toggleLayer: (type: TransitType) => Promise<void>;
  totalTransitCount: number;
  resetTransit: () => void;
}

export function useTransit(
  onError: (msg: string) => void
): UseTransitReturn {
  const [layers, setLayers] = useState<TransitLayerState>({
    metro: false,
    bus: false,
    railway: false,
    auto: false,
  });

  const [stops, setStops] = useState<Partial<Record<TransitType, TransitStop[]>>>({});
  const [loadingLayers, setLoadingLayers] = useState<
    Partial<Record<TransitType, boolean>>
  >({});

  // Cache fetched data in a ref so we don't re-fetch when toggling off and on
  const cache = useRef<Partial<Record<TransitType, TransitStop[]>>>({});

  const toggleLayer = useCallback(
    async (type: TransitType) => {
      const isCurrentlyOn = layers[type];

      // If toggling OFF, just hide — don't re-fetch
      if (isCurrentlyOn) {
        setLayers((prev) => ({ ...prev, [type]: false }));
        return;
      }

      // If we already have cached data, just show it
      if (cache.current[type]) {
        setStops((prev) => ({ ...prev, [type]: cache.current[type] }));
        setLayers((prev) => ({ ...prev, [type]: true }));
        return;
      }

      // Fetch from API
      setLoadingLayers((prev) => ({ ...prev, [type]: true }));

      try {
        const res = await fetch(`/api/transit?type=${type}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        cache.current[type] = data.stops as TransitStop[];
        setStops((prev) => ({ ...prev, [type]: data.stops }));
        setLayers((prev) => ({ ...prev, [type]: true }));
      } catch (err) {
        console.error(`[transit] Failed to load ${type}:`, err);
        onError('Transit data unavailable. Please try again later.');
      } finally {
        setLoadingLayers((prev) => ({ ...prev, [type]: false }));
      }
    },
    [layers, onError]
  );

  const resetTransit = useCallback(() => {
    setLayers({ metro: false, bus: false, railway: false, auto: false });
    // Keep cache — don't clear stops so re-enabling is instant
  }, []);

  const totalTransitCount = Object.entries(layers)
    .filter(([, on]) => on)
    .reduce((sum, [type]) => {
      return sum + (stops[type as TransitType]?.length ?? 0);
    }, 0);

  return {
    layers,
    stops,
    loadingLayers,
    toggleLayer,
    totalTransitCount,
    resetTransit,
  };
}
