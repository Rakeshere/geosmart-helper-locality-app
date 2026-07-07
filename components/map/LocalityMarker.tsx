'use client';

// ============================================================
// Locality Marker — circle marker with hover effects
// ============================================================

import { useRef } from 'react';
import { CircleMarker, Tooltip } from 'react-leaflet';
import type { CircleMarker as LeafletCircleMarker } from 'leaflet';
import { MARKER_COLORS, ZOOM_WITH_PINCODES } from '@/utils/constants';
import type { Locality } from '@/types';

type MarkerState = 'default' | 'selected' | 'nearby';

interface LocalityMarkerProps {
  locality: Locality;
  state: MarkerState;
  zoom: number;
  onClick: (locality: Locality) => void;
}

const MARKER_STYLE: Record<
  MarkerState,
  { color: string; fillColor: string; radius: number; weight: number; fillOpacity: number }
> = {
  default: {
    color: '#A5B4FC',
    fillColor: MARKER_COLORS.default,
    radius: 14,
    weight: 2,
    fillOpacity: 0.9,
  },
  selected: {
    color: '#93C5FD',
    fillColor: MARKER_COLORS.selected,
    radius: 18,
    weight: 3,
    fillOpacity: 1,
  },
  nearby: {
    color: '#FED7AA',
    fillColor: MARKER_COLORS.nearby,
    radius: 15,
    weight: 2,
    fillOpacity: 0.9,
  },
};

export function LocalityMarker({ locality, state, zoom, onClick }: LocalityMarkerProps) {
  const markerRef = useRef<LeafletCircleMarker | null>(null);
  const style = MARKER_STYLE[state];
  const showPincode = zoom >= ZOOM_WITH_PINCODES;

  return (
    <CircleMarker
      ref={markerRef}
      center={[locality.lat, locality.lng]}
      radius={style.radius}
      pathOptions={{
        color: style.color,
        fillColor: style.fillColor,
        fillOpacity: style.fillOpacity,
        weight: style.weight,
      }}
      eventHandlers={{
        click: () => onClick(locality),
        mouseover: () => {
          markerRef.current?.setStyle({ weight: 3, fillOpacity: 1 });
        },
        mouseout: () => {
          markerRef.current?.setStyle({
            weight: style.weight,
            fillOpacity: style.fillOpacity,
          });
        },
      }}
      aria-label={`Locality: ${locality.name}`}
    >
      <Tooltip
        permanent={state === 'selected'}
        direction="top"
        offset={[0, -style.radius - 4]}
        className="gs-tooltip"
        aria-label={`${locality.name} tooltip`}
      >
        <div style={{ fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: '#111827', whiteSpace: 'nowrap' }}>
            {locality.name}
          </div>
          {showPincode && (
            <div style={{ fontSize: 10, color: '#6B7280', marginTop: 1 }}>
              {locality.pincode}
            </div>
          )}
          {locality.apartment_count > 0 && (
            <div
              style={{
                fontSize: 10,
                color: '#4F46E5',
                fontWeight: 600,
                marginTop: 1,
              }}
            >
              {locality.apartment_count} apt{locality.apartment_count !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </Tooltip>
    </CircleMarker>
  );
}
