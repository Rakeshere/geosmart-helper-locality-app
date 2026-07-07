'use client';

// ============================================================
// useLocalities — Localities & Apartments Data
// ============================================================

import { useState, useEffect } from 'react';
import { LOCALITIES, APARTMENTS } from '@/data/localities';
import type { Locality, Apartment } from '@/types';

interface UseLocalitiesReturn {
  localities: Locality[];
  apartments: Apartment[];
  isLoading: boolean;
  error: string | null;
}

export function useLocalities(): UseLocalitiesReturn {
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try fetching from API; fall back to static seed data
    const load = async () => {
      try {
        const res = await fetch('/api/localities');
        if (!res.ok) throw new Error('API unavailable');
        const data = await res.json();
        setLocalities(data.localities);
        setApartments(data.apartments);
      } catch {
        // Fallback: use static seed data directly
        setLocalities(LOCALITIES);
        setApartments(APARTMENTS);
        setError(null); // Not a user-visible error since data loaded
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return { localities, apartments, isLoading, error };
}
