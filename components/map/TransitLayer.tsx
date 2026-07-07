'use client';

// ============================================================
// Transit Marker Layer — renders all transit stops
// ============================================================

import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { createTransitMarkerSvg, getTransitColor } from '@/utils/mapHelpers';
import type { TransitStop, TransitType } from '@/types';

interface TransitLayerProps {
  type: TransitType;
  stops: TransitStop[];
  visible: boolean;
}

/**
 * Renders transit stop markers as a Leaflet layer group.
 * Uses useEffect to imperatively manage the layer group,
 * which is more performant for large datasets (200+ stops).
 */
export function TransitLayer({ type, stops, visible }: TransitLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!visible || stops.length === 0) return;

    const color = getTransitColor(type);
    const layerGroup = L.layerGroup();

    stops.forEach((stop) => {
      const icon = L.divIcon({
        html: createTransitMarkerSvg(type),
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -14],
      });

      const marker = L.marker([stop.lat, stop.lng], { icon });

      marker.bindPopup(
        `<div style="font-family: Inter, sans-serif; min-width: 140px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <div style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0;"></div>
            <strong style="font-size:13px;color:#111827;">${stop.name}</strong>
          </div>
          <p style="font-size:11px;color:#6B7280;text-transform:capitalize;margin:0;">${type} station</p>
        </div>`,
        { closeButton: false, maxWidth: 200 }
      );

      layerGroup.addLayer(marker);
    });

    layerGroup.addTo(map);

    // Cleanup on unmount or when visibility changes
    return () => {
      map.removeLayer(layerGroup);
    };
  }, [map, type, stops, visible]);

  return null;
}
