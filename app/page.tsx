'use client';

// ============================================================
// GeoSmart Helper Locality App — Main Dashboard Page
// ============================================================

import { useState, useCallback, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { Map as LeafletMap } from 'leaflet';

// Hooks
import { useLocalities } from '@/hooks/useLocalities';
import { useMap } from '@/hooks/useMap';
import { useTransit } from '@/hooks/useTransit';
import { useSearch } from '@/hooks/useSearch';
import { useNearby } from '@/hooks/useNearby';
import { useToast } from '@/hooks/useToast';

// Components
import { Header } from '@/components/header/Header';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { BottomSheet } from '@/components/sidebar/BottomSheet';
import { StatsCard } from '@/components/ui/StatsCard';
import { Legend } from '@/components/ui/Legend';
import { ToastContainer } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// Types
import type { Locality, SearchResult } from '@/types';

// Dynamic import of map (Leaflet requires browser environment)
const MapContainer = dynamic(
  () =>
    import('@/components/map/MapContainer').then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-surface-secondary dark:bg-surface-dark">
        <div className="flex flex-col items-center gap-4">
          {/* Animated loading rings */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-brand-100 dark:border-brand-900" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Loading GeoSmart Map
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Initializing Bangalore locality data…
            </p>
          </div>
        </div>
      </div>
    ),
  }
);

// ── Main Page Component ──────────────────────────────────────

export default function DashboardPage() {
  // ── Data ─────────────────────────────────────────────────
  const { localities, apartments, isLoading: dataLoading } = useLocalities();

  // ── Toast ─────────────────────────────────────────────────
  const { toasts, removeToast, error: toastError } = useToast();

  // ── Transit ───────────────────────────────────────────────
  const { layers: transitLayers, stops: transitStops, loadingLayers, toggleLayer, totalTransitCount, resetTransit } =
    useTransit(toastError);

  // ── Map ───────────────────────────────────────────────────
  const { mapState, selectLocality, selectApartment, resetMap, setZoom, setMapRef } =
    useMap();

  // ── Search ────────────────────────────────────────────────
  const {
    query,
    setQuery,
    results: searchResults,
    isSearching,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    clearQuery,
  } = useSearch(localities, apartments);

  // ── Nearby ────────────────────────────────────────────────
  const selectedLocality = useMemo(
    () => localities.find((l) => l.id === mapState.selectedLocalityId) ?? null,
    [localities, mapState.selectedLocalityId]
  );

  const nearby = useNearby(selectedLocality, localities);

  // ── Sidebar state ─────────────────────────────────────────
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ── Dark mode detection for map tiles ────────────────────
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // ── Sync nearby IDs back into mapState for marker coloring ─
  const nearbyIds = useMemo(() => nearby.map((l) => l.id), [nearby]);
  // We pass these through mapState.nearbyLocalityIds
  // Update mapState when nearby changes
  useEffect(() => {
    // We need to keep nearbyLocalityIds in sync — achieved by
    // overriding the value in mapState via the page's derived state.
    // Since mapState is immutable from useMap, we pass nearbyIds
    // as a computed overlay to MapContainer.
  }, [nearbyIds]);

  // ── Handlers ─────────────────────────────────────────────

  const handleLocalityClick = useCallback(
    (locality: Locality) => {
      selectLocality(locality);
      setIsSidebarOpen(true);
    },
    [selectLocality]
  );

  const handleSearchSelect = useCallback(
    (result: SearchResult) => {
      addRecentSearch(result);
      clearQuery();

      if (result.type === 'locality') {
        const locality = localities.find((l) => l.id === result.id);
        if (locality) handleLocalityClick(locality);
      } else {
        // Apartment
        const apt = apartments.find((a) => a.id === result.id);
        const loc = localities.find((l) => l.id === apt?.locality_id);
        if (apt && loc) {
          selectApartment(apt, loc);
          setIsSidebarOpen(true);
        }
      }
    },
    [addRecentSearch, clearQuery, localities, apartments, handleLocalityClick, selectApartment]
  );

  const handleReset = useCallback(() => {
    resetMap();
    resetTransit();
    clearQuery();
    setIsSidebarOpen(false);
  }, [resetMap, resetTransit, clearQuery]);

  const handleMapReady = useCallback(
    (map: LeafletMap) => {
      setMapRef(map);
    },
    [setMapRef]
  );

  // Build the enriched mapState with nearbyIds for marker coloring
  const enrichedMapState = useMemo(
    () => ({ ...mapState, nearbyLocalityIds: nearbyIds }),
    [mapState, nearbyIds]
  );

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen overflow-hidden" id="app-root">
      {/* Sticky Header */}
      <Header
        query={query}
        onQueryChange={setQuery}
        searchResults={searchResults}
        isSearching={isSearching}
        recentSearches={recentSearches}
        onSearchSelect={handleSearchSelect}
        onClearRecentSearches={clearRecentSearches}
        onClearSearch={clearQuery}
        transitLayers={transitLayers}
        loadingLayers={loadingLayers}
        onTransitToggle={toggleLayer}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main
        className="flex flex-1 overflow-hidden relative"
        role="main"
        aria-label="Map dashboard"
      >
        {/* Desktop Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          isLoading={dataLoading}
          selectedLocality={selectedLocality}
          apartments={apartments}
          nearby={nearby}
          onClose={() => setIsSidebarOpen(false)}
          onNearbySelect={handleLocalityClick}
        />

        {/* Map Area */}
        <div className="flex-1 relative overflow-hidden" id="map-area">
          <ErrorBoundary>
            <MapContainer
              localities={localities}
              apartments={apartments}
              mapState={enrichedMapState}
              transitLayers={transitLayers}
              transitStops={transitStops}
              isDark={isDark}
              onLocalityClick={handleLocalityClick}
              onZoomChange={setZoom}
              onMapReady={handleMapReady}
            />
          </ErrorBoundary>

          {/* Floating Stats Card — top right */}
          <div className="absolute top-4 right-4 z-[400]">
            <StatsCard
              localityCount={localities.length}
              apartmentCount={apartments.length}
              transitCount={totalTransitCount}
            />
          </div>

          {/* Floating Legend — bottom left (above zoom controls) */}
          <div className="absolute bottom-16 left-4 z-[400]">
            <Legend />
          </div>

          {/* Zoom hint overlay at low zoom */}
          {mapState.zoom < 13 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400]">
              <div className="bg-white/90 dark:bg-surface-dark-secondary/90 backdrop-blur-md
                border border-surface-border dark:border-surface-dark-border
                rounded-full px-4 py-2 text-xs text-gray-500 dark:text-gray-400 shadow-card"
              >
                Zoom in to see pincode labels and apartment markers
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Sheet */}
      <BottomSheet
        isOpen={isSidebarOpen}
        isLoading={dataLoading}
        selectedLocality={selectedLocality}
        apartments={apartments}
        nearby={nearby}
        onClose={() => setIsSidebarOpen(false)}
        onNearbySelect={handleLocalityClick}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
