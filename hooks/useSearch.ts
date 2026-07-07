'use client';

// ============================================================
// useSearch — Autocomplete Search with Debounce
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { STORAGE_KEYS, MAX_RECENT_SEARCHES, SEARCH_DEBOUNCE_MS } from '@/utils/constants';
import type { Locality, Apartment, SearchResult, RecentSearch } from '@/types';

interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  recentSearches: RecentSearch[];
  addRecentSearch: (result: SearchResult) => void;
  clearRecentSearches: () => void;
  clearQuery: () => void;
}

export function useSearch(
  localities: Locality[],
  apartments: Apartment[]
): UseSearchReturn {
  const [query, setQueryRaw] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.recentSearches);
      if (stored) {
        setRecentSearches(JSON.parse(stored) as RecentSearch[]);
      }
    } catch {
      // localStorage unavailable — ignore
    }
  }, []);

  // Debounced search
  const setQuery = useCallback((q: string) => {
    setQueryRaw(q);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!q.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(() => {
      const lower = q.toLowerCase();

      const localityResults: SearchResult[] = localities
        .filter(
          (l) =>
            l.name.toLowerCase().includes(lower) ||
            l.pincode.includes(lower)
        )
        .slice(0, 5)
        .map((l) => ({
          id: l.id,
          type: 'locality' as const,
          label: l.name,
          sublabel: `${l.pincode} · ${l.apartment_count} apartments`,
          lat: l.lat,
          lng: l.lng,
        }));

      const apartmentResults: SearchResult[] = apartments
        .filter(
          (a) =>
            a.name.toLowerCase().includes(lower) ||
            a.locality_name.toLowerCase().includes(lower) ||
            a.address.toLowerCase().includes(lower) ||
            a.pincode.includes(lower)
        )
        .slice(0, 5)
        .map((a) => ({
          id: a.id,
          type: 'apartment' as const,
          label: a.name,
          sublabel: a.locality_name,
          lat: a.lat,
          lng: a.lng,
          locality_id: a.locality_id,
        }));

      setResults([...localityResults, ...apartmentResults]);
      setIsSearching(false);
    }, SEARCH_DEBOUNCE_MS);
  }, [localities, apartments]);

  const addRecentSearch = useCallback((result: SearchResult) => {
    setRecentSearches((prev) => {
      const existing = prev.filter((r) => r.id !== result.id);
      const updated: RecentSearch[] = [
        {
          id: result.id,
          label: result.label,
          type: result.type,
          timestamp: Date.now(),
        },
        ...existing,
      ].slice(0, MAX_RECENT_SEARCHES);

      try {
        localStorage.setItem(
          STORAGE_KEYS.recentSearches,
          JSON.stringify(updated)
        );
      } catch {
        // Ignore
      }

      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.recentSearches);
    } catch {}
  }, []);

  const clearQuery = useCallback(() => {
    setQueryRaw('');
    setResults([]);
    setIsSearching(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    clearQuery,
  };
}
