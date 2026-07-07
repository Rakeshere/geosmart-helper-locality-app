'use client';

// ============================================================
// Apartment Marker — shown at zoom ≥ 16
// ============================================================

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { createApartmentMarkerSvg } from '@/utils/mapHelpers';
import type { Apartment } from '@/types';

const APARTMENT_ICON = L.divIcon({
  html: createApartmentMarkerSvg(),
  className: '',
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -38],
});

interface ApartmentMarkerProps {
  apartment: Apartment;
  isSelected: boolean;
}

export function ApartmentMarker({ apartment, isSelected }: ApartmentMarkerProps) {
  return (
    <Marker
      position={[apartment.lat, apartment.lng]}
      icon={APARTMENT_ICON}
      zIndexOffset={isSelected ? 1000 : 0}
    >
      <Popup closeButton={false} maxWidth={240}>
        <div className="font-sans p-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#06B6D4',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 4,
            }}
          >
            Apartment Complex
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
            {apartment.name}
          </p>
          <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 6px', lineHeight: 1.4 }}>
            {apartment.address}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                background: '#ECFDF5',
                color: '#065F46',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              {apartment.total_units.toLocaleString()} units
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                background: '#EFF6FF',
                color: '#1E40AF',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              {apartment.pincode}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
