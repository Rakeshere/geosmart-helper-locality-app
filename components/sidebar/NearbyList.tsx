'use client';

// ============================================================
// Nearby Localities List with Distance Badges
// ============================================================

import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { formatDistance } from '@/utils/haversine';
import { cn } from '@/utils/mapHelpers';
import { MARKER_COLORS } from '@/utils/constants';
import type { LocalityWithDistance, Locality } from '@/types';

interface NearbyListProps {
  nearby: LocalityWithDistance[];
  onSelect: (locality: Locality) => void;
}

export function NearbyList({ nearby, onSelect }: NearbyListProps) {
  if (nearby.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
        <MapPin className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No localities within 3.5 km
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5" role="list" aria-label="Nearby localities">
      {nearby.map((loc, index) => (
        <motion.button
          key={loc.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.04 }}
          onClick={() => onSelect(loc)}
          className={cn(
            'w-full flex items-center gap-3 p-3 rounded-xl text-left',
            'border border-transparent',
            'hover:bg-orange-50 dark:hover:bg-orange-950/30',
            'hover:border-orange-200 dark:hover:border-orange-800',
            'transition-all duration-150 group'
          )}
          role="listitem"
          aria-label={`${loc.name} — ${formatDistance(loc.distance_km)} away`}
        >
          {/* Color dot */}
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: MARKER_COLORS.nearby }}
            aria-hidden="true"
          />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {loc.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {loc.pincode}
              {loc.apartment_count > 0 && ` · ${loc.apartment_count} apts`}
            </p>
          </div>

          {/* Distance badge */}
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full shrink-0
              bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300"
          >
            {formatDistance(loc.distance_km)}
          </span>

          <ArrowRight
            className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-orange-400 transition-colors shrink-0"
            aria-hidden="true"
          />
        </motion.button>
      ))}
    </div>
  );
}
