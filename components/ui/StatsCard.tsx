'use client';

// ============================================================
// Floating Stats Card — auto-updates with live data
// ============================================================

import { motion } from 'framer-motion';
import { MapPin, Building2, Train } from 'lucide-react';
import { cn } from '@/utils/mapHelpers';

interface StatsCardProps {
  localityCount: number;
  apartmentCount: number;
  transitCount: number;
  className?: string;
}

const STATS = [
  {
    key: 'localities',
    icon: MapPin,
    color: '#6366F1',
    bg: 'bg-indigo-50 dark:bg-indigo-950/60',
    text: 'text-indigo-700 dark:text-indigo-300',
    label: 'Localities',
  },
  {
    key: 'apartments',
    icon: Building2,
    color: '#06B6D4',
    bg: 'bg-cyan-50 dark:bg-cyan-950/60',
    text: 'text-cyan-700 dark:text-cyan-300',
    label: 'Apartments',
  },
  {
    key: 'transit',
    icon: Train,
    color: '#8B5CF6',
    bg: 'bg-violet-50 dark:bg-violet-950/60',
    text: 'text-violet-700 dark:text-violet-300',
    label: 'Transit Stops',
  },
] as const;

export function StatsCard({ localityCount, apartmentCount, transitCount, className }: StatsCardProps) {
  const values = {
    localities: localityCount,
    apartments: apartmentCount,
    transit: transitCount,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'bg-white/95 dark:bg-surface-dark-secondary/95 backdrop-blur-md',
        'border border-surface-border dark:border-surface-dark-border',
        'rounded-xl shadow-card-md',
        'p-3 min-w-[128px]',
        className
      )}
      role="region"
      aria-label="Map statistics"
    >
      {/* Header */}
      <p className="section-label mb-2.5">Live Stats</p>

      <div className="flex flex-col gap-2">
        {STATS.map(({ key, icon: Icon, bg, text, label }) => (
          <div key={key} className="flex items-center gap-2.5">
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shrink-0', bg)}>
              <Icon className={cn('w-3.5 h-3.5', text)} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums leading-none">
                {values[key as keyof typeof values].toLocaleString()}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-none mt-0.5 font-medium">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
