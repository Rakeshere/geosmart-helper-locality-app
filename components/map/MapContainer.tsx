'use client';

// ============================================================
// MapContainer — Main Leaflet Map Wrapper
// ============================================================

import { useEffect } from 'react';
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LocalityMarker } from '@/components/map/LocalityMarker';
import { ApartmentMarker } from '@/components/map/ApartmentMarker';
import { TransitLayer } from '@/components/map/TransitLayer';
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  TILE_URL_LIGHT,
  TILE_URL_DARK,
  TILE_ATTRIBUTION,
  ZOOM_WITH_APARTMENTS,
} from '@/utils/constants';
import type {
  Locality,
  Apartment,
  MapState,
  TransitLayerState,
  TransitStop,
  TransitType,
} from '@/types';
import type { Map as LeafletMap } from 'leaflet';

// ── Internal component: listens to map events ─────────────────

interface MapEventsProps {
  onZoomChange: (zoom: number) => void;
  onMapReady: (map: LeafletMap) => void;
}

function MapEvents({ onZoomChange, onMapReady }: MapEventsProps) {
  const map = useMapEvents({
    zoomend: () => onZoomChange(map.getZoom()),
    load: () => onMapReady(map),
  });

  // Fire onMapReady once on mount
  useEffect(() => {
    onMapReady(map);
    onZoomChange(map.getZoom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

// ── Props ─────────────────────────────────────────────────────

interface MapContainerProps {
  localities: Locality[];
  apartments: Apartment[];
  mapState: MapState;
  transitLayers: TransitLayerState;
  transitStops: Partial<Record<TransitType, TransitStop[]>>;
  isDark: boolean;
  onLocalityClick: (locality: Locality) => void;
  onZoomChange: (zoom: number) => void;
  onMapReady: (map: LeafletMap) => void;
}

// ── Main Component ────────────────────────────────────────────

export function MapContainer({
  localities,
  apartments,
  mapState,
  transitLayers,
  transitStops,
  isDark,
  onLocalityClick,
  onZoomChange,
  onMapReady,
}: MapContainerProps) {
  const { zoom, selectedLocalityId } = mapState;
  const showApartments = zoom >= ZOOM_WITH_APARTMENTS;
  const tileUrl = isDark ? TILE_URL_DARK : TILE_URL_LIGHT;

  /**
   * Determine marker visual state:
   * - 'selected': the clicked locality
   * - 'nearby': within 3.5 km of selected (passed via mapState — computed in page)
   * - 'default': all others
   */
  const getLocalityState = (locality: Locality) => {
    if (locality.id === selectedLocalityId) return 'selected';
    if (mapState.nearbyLocalityIds.includes(locality.id)) return 'nearby';
    return 'default';
  };

  return (
    <LeafletMapContainer
      center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
      zoom={DEFAULT_ZOOM}
      zoomControl={false}
      className="w-full h-full"
      aria-label="Bangalore locality map"
      style={{ background: isDark ? '#1a1b1e' : '#f8f8f8' }}
    >
      {/* Map Events listener */}
      <MapEvents onZoomChange={onZoomChange} onMapReady={onMapReady} />

      {/* Base Tile Layer */}
      <TileLayer
        url={tileUrl}
        attribution={TILE_ATTRIBUTION}
        maxZoom={19}
      />

      {/* Zoom Controls (bottom-right) */}
      <ZoomControl position="bottomright" />

      {/* Locality Markers */}
      {localities.map((locality) => (
        <LocalityMarker
          key={locality.id}
          locality={locality}
          state={getLocalityState(locality)}
          zoom={zoom}
          onClick={onLocalityClick}
        />
      ))}

      {/* Apartment Markers — only at zoom ≥ 16 */}
      {showApartments &&
        apartments.map((apt) => (
          <ApartmentMarker
            key={apt.id}
            apartment={apt}
            isSelected={apt.id === mapState.selectedApartmentId}
          />
        ))}

      {/* Transit Layers */}
      {(Object.keys(transitLayers) as TransitType[]).map((type) => (
        <TransitLayer
          key={type}
          type={type}
          stops={transitStops[type] ?? []}
          visible={transitLayers[type]}
        />
      ))}
    </LeafletMapContainer>
  );
}
