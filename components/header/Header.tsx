'use client';

// ============================================================
// Sticky Header — GeoSmart Helper Locality App
// ============================================================

import Image from 'next/image';
import { RotateCcw } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SearchBar } from '@/components/header/SearchBar';
import { TransitToggles } from '@/components/header/TransitToggles';
import type {
  TransitType,
  TransitLayerState,
  SearchResult,
  RecentSearch,
} from '@/types';

interface HeaderProps {
  // Search
  query: string;
  onQueryChange: (q: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  recentSearches: RecentSearch[];
  onSearchSelect: (result: SearchResult) => void;
  onClearRecentSearches: () => void;
  onClearSearch: () => void;
  // Transit
  transitLayers: TransitLayerState;
  loadingLayers: Partial<Record<TransitType, boolean>>;
  onTransitToggle: (type: TransitType) => void;
  // Reset
  onReset: () => void;
}

export function Header({
  query,
  onQueryChange,
  searchResults,
  isSearching,
  recentSearches,
  onSearchSelect,
  onClearRecentSearches,
  onClearSearch,
  transitLayers,
  loadingLayers,
  onTransitToggle,
  onReset,
}: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-[1000] bg-white dark:bg-surface-dark
        border-b border-surface-border dark:border-surface-dark-border
        shadow-xs"
      role="banner"
    >
      {/* Main header row */}
      <div className="flex items-center gap-3 h-[60px] px-4">

        {/* ── EzyHelpers Logo ───────────────────────────────── */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/ezyhelpers-logo.png"
            alt="EzyHelpers Logo"
            width={36}
            height={36}
            className="rounded-lg object-contain"
            priority
          />
          <div className="hidden sm:block leading-none">
            <p className="text-[13px] font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              GeoSmart
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-wide mt-0.5">
              EzyHelpers · Helper Locality
            </p>
          </div>
        </div>

        {/* Separator */}
        <div
          className="h-5 w-px bg-surface-border dark:bg-surface-dark-border hidden sm:block shrink-0"
          aria-hidden="true"
        />

        {/* ── Search Bar ───────────────────────────────────── */}
        <SearchBar
          query={query}
          onQueryChange={onQueryChange}
          results={searchResults}
          isSearching={isSearching}
          recentSearches={recentSearches}
          onSelect={onSearchSelect}
          onClearRecent={onClearRecentSearches}
          onClear={onClearSearch}
        />

        {/* ── Transit Toggles (desktop) ────────────────────── */}
        <div className="hidden lg:flex items-center gap-1.5 shrink-0">
          <TransitToggles
            layers={transitLayers}
            loadingLayers={loadingLayers}
            onToggle={onTransitToggle}
          />
        </div>

        {/* Spacer */}
        <div className="flex-1 min-w-0" />

        {/* ── Actions ─────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="reset-button"
            onClick={onReset}
            className="btn-secondary h-8 px-3 text-xs gap-1.5"
            aria-label="Reset map view, selections and search"
            title="Reset all"
          >
            <RotateCcw className="w-3 h-3" aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* ── Transit Toggles row (tablet / mobile) ─────────── */}
      <div
        className="lg:hidden flex items-center gap-1.5 px-4 pb-3 overflow-x-auto
          scrollbar-none border-t border-surface-border/50 dark:border-surface-dark-border/50 pt-2"
      >
        <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider shrink-0 mr-1">
          Transit
        </span>
        <TransitToggles
          layers={transitLayers}
          loadingLayers={loadingLayers}
          onToggle={onTransitToggle}
        />
      </div>
    </header>
  );
}
