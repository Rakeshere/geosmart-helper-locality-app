'use client';

// ============================================================
// useMap — Central Map State & Interactions
// ============================================================

import { useState, useCallback, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import type { Locality, Apartment, MapState } from '@/types';
import { DEFAULT_CENTER, DEFAULT_ZOOM, APARTMENT_ZOOM } from '@/utils/constants';

interface UseMapReturn {
  mapRef: React.MutableRefObject<LeafletMap | null>;
  mapState: MapState;
  selectLocality: (locality: Locality) => void;
  selectApartment: (apartment: Apartment, locality: Locality) => void;
  resetMap: () => void;
  setZoom: (zoom: number) => void;
  setMapRef: (map: LeafletMap) => void;
}

export function useMap(): UseMapReturn {
  const mapRef = useRef<LeafletMap | null>(null);

  const [mapState, setMapState] = useState<MapState>({
    zoom: DEFAULT_ZOOM,
    center: DEFAULT_CENTER,
    selectedLocalityId: null,
    nearbyLocalityIds: [],
    selectedApartmentId: null,
  });

  const setMapRef = useCallback((map: LeafletMap) => {
    mapRef.current = map;
  }, []);

  const selectLocality = useCallback((locality: Locality) => {
    setMapState((prev) => ({
      ...prev,
      selectedLocalityId: locality.id,
      selectedApartmentId: null,
    }));

    // Smooth fly animation
    if (mapRef.current) {
      mapRef.current.flyTo([locality.lat, locality.lng], 14, {
        animate: true,
        duration: 1.2,
      });
    }
  }, []);

  const selectApartment = useCallback(
    (apartment: Apartment, locality: Locality) => {
      setMapState((prev) => ({
        ...prev,
        selectedLocalityId: locality.id,
        selectedApartmentId: apartment.id,
      }));

      if (mapRef.current) {
        mapRef.current.flyTo([apartment.lat, apartment.lng], APARTMENT_ZOOM, {
          animate: true,
          duration: 1.2,
        });
      }
    },
    []
  );

  const resetMap = useCallback(() => {
    setMapState({
      zoom: DEFAULT_ZOOM,
      center: DEFAULT_CENTER,
      selectedLocalityId: null,
      nearbyLocalityIds: [],
      selectedApartmentId: null,
    });

    if (mapRef.current) {
      mapRef.current.flyTo(
        [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
        DEFAULT_ZOOM,
        { animate: true, duration: 1.0 }
      );
    }
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setMapState((prev) => ({ ...prev, zoom }));
  }, []);

  return {
    mapRef,
    mapState,
    selectLocality,
    selectApartment,
    resetMap,
    setZoom,
    setMapRef,
  };
}
