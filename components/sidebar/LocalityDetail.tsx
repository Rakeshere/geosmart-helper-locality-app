'use client';

// ============================================================
// Locality Detail Panel
// ============================================================

import { motion } from 'framer-motion';
import { Building2, MapPin, Hash, Home } from 'lucide-react';
import { NearbyList } from '@/components/sidebar/NearbyList';
import type { Locality, Apartment, LocalityWithDistance } from '@/types';
import { cn } from '@/utils/mapHelpers';

interface LocalityDetailProps {
  locality: Locality;
  apartments: Apartment[];
  nearby: LocalityWithDistance[];
  onNearbySelect: (locality: Locality) => void;
}

function ApartmentItem({ apt }: { apt: Apartment }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-1 p-3 rounded-xl bg-surface-secondary dark:bg-surface-dark-tertiary
        border border-surface-border dark:border-surface-dark-border"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
          {apt.name}
        </p>
        <span className="text-xs font-medium px-1.5 py-0.5 rounded-md shrink-0
          bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-900">
          {apt.total_units.toLocaleString()} units
        </span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
        {apt.address}
      </p>
    </motion.div>
  );
}

export function LocalityDetail({
  locality,
  apartments,
  nearby,
  onNearbySelect,
}: LocalityDetailProps) {
  const localityApartments = apartments.filter(
    (a) => a.locality_id === locality.id
  );

  return (
    <div className="flex flex-col gap-5 p-5 overflow-y-auto">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
            {locality.name}
          </h2>
          {locality.zone && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0 mt-1
              bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300
              border border-indigo-100 dark:border-indigo-900">
              {locality.zone}
            </span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Hash className="w-3.5 h-3.5" aria-hidden="true" />
            {locality.pincode}
          </span>
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
            {locality.apartment_count}{' '}
            {locality.apartment_count === 1 ? 'apartment' : 'apartments'}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
            {locality.lat.toFixed(4)}, {locality.lng.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-surface-border dark:bg-surface-dark-border" aria-hidden="true" />

      {/* Apartments */}
      <section aria-labelledby="apartments-heading">
        <div className="flex items-center justify-between mb-3">
          <h3
            id="apartments-heading"
            className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Apartments
          </h3>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {localityApartments.length} listed
          </span>
        </div>

        {localityApartments.length === 0 ? (
          <div
            className={cn(
              'flex flex-col items-center justify-center py-8 rounded-xl text-center',
              'bg-surface-secondary dark:bg-surface-dark-tertiary',
              'border border-dashed border-surface-border dark:border-surface-dark-border'
            )}
          >
            <Home className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" aria-hidden="true" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No apartments listed
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Data will appear when added
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {localityApartments.map((apt) => (
              <ApartmentItem key={apt.id} apt={apt} />
            ))}
          </div>
        )}
      </section>

      {/* Nearby Localities */}
      <section aria-labelledby="nearby-heading">
        <div className="flex items-center justify-between mb-3">
          <h3
            id="nearby-heading"
            className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Nearby Localities
          </h3>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            within 3.5 km · {nearby.length} found
          </span>
        </div>
        <NearbyList nearby={nearby} onSelect={onNearbySelect} />
      </section>
    </div>
  );
}
