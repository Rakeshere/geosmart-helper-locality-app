'use client';

// ============================================================
// Floating Map Legend — matches exact spec colors
// ============================================================

import { motion } from 'framer-motion';
import { cn } from '@/utils/mapHelpers';

// Exact colors from the assignment spec
const LEGEND_ITEMS = [
  { color: '#2563EB', label: 'Selected Locality',  category: 'locality' },
  { color: '#F97316', label: 'Nearby Locality',    category: 'locality' },
  { color: '#6366F1', label: 'Other Locality',     category: 'locality' },
  { color: '#8B5CF6', label: 'Metro Station',      category: 'transit' },
  { color: '#10B981', label: 'Bus Stop',           category: 'transit' },
  { color: '#EF4444', label: 'Railway Station',    category: 'transit' },
  { color: '#F59E0B', label: 'Auto Stand',         category: 'transit' },
  { color: '#06B6D4', label: 'Apartment',          category: 'apartment' },
] as const;

interface LegendProps {
  className?: string;
}

export function Legend({ className }: LegendProps) {
  const locality  = LEGEND_ITEMS.filter((i) => i.category === 'locality');
  const transit   = LEGEND_ITEMS.filter((i) => i.category === 'transit');
  const apartment = LEGEND_ITEMS.filter((i) => i.category === 'apartment');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'bg-white/95 dark:bg-surface-dark-secondary/95 backdrop-blur-md',
        'border border-surface-border dark:border-surface-dark-border',
        'rounded-xl shadow-card-md',
        'p-3 min-w-[148px]',
        className
      )}
      role="complementary"
      aria-label="Map color legend"
    >
      <p className="section-label mb-2">Legend</p>

      {/* Localities */}
      <div className="flex flex-col gap-1 mb-2">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-300 dark:text-gray-600 mb-0.5">
          Localities
        </p>
        {locality.map(({ color, label }) => (
          <LegendRow key={label} color={color} label={label} />
        ))}
      </div>

      {/* Transit */}
      <div className="flex flex-col gap-1 mb-2">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-300 dark:text-gray-600 mb-0.5">
          Transit
        </p>
        {transit.map(({ color, label }) => (
          <LegendRow key={label} color={color} label={label} shape="square" />
        ))}
      </div>

      {/* Apartment */}
      {apartment.map(({ color, label }) => (
        <LegendRow key={label} color={color} label={label} shape="pin" />
      ))}
    </motion.div>
  );
}

function LegendRow({
  color,
  label,
  shape = 'circle',
}: {
  color: string;
  label: string;
  shape?: 'circle' | 'square' | 'pin';
}) {
  return (
    <div className="flex items-center gap-2">
      {shape === 'circle' && (
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      )}
      {shape === 'square' && (
        <div
          className="w-2.5 h-2.5 rounded-[3px] shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      )}
      {shape === 'pin' && (
        <div
          className="w-2 h-3 rounded-t-full rounded-b-[1px] shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      )}
      <span className="text-[11px] text-gray-600 dark:text-gray-400 font-medium leading-none">
        {label}
      </span>
    </div>
  );
}
