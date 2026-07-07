'use client';

// ============================================================
// Transit Toggle Buttons
// ============================================================

import { motion } from 'framer-motion';
import { Train, Bus, TrainFront, Car } from 'lucide-react';
import { cn } from '@/utils/mapHelpers';
import { MARKER_COLORS, TRANSIT_LABELS } from '@/utils/constants';
import type { TransitType, TransitLayerState } from '@/types';

interface TransitToggleConfig {
  type: TransitType;
  icon: React.ReactNode;
  color: string;
}

const TRANSIT_TOGGLES: TransitToggleConfig[] = [
  {
    type: 'metro',
    icon: <Train className="w-3.5 h-3.5" />,
    color: MARKER_COLORS.metro,
  },
  {
    type: 'bus',
    icon: <Bus className="w-3.5 h-3.5" />,
    color: MARKER_COLORS.bus,
  },
  {
    type: 'railway',
    icon: <TrainFront className="w-3.5 h-3.5" />,
    color: MARKER_COLORS.railway,
  },
  {
    type: 'auto',
    icon: <Car className="w-3.5 h-3.5" />,
    color: MARKER_COLORS.auto,
  },
];

interface TransitTogglesProps {
  layers: TransitLayerState;
  loadingLayers: Partial<Record<TransitType, boolean>>;
  onToggle: (type: TransitType) => void;
}

export function TransitToggles({
  layers,
  loadingLayers,
  onToggle,
}: TransitTogglesProps) {
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Transit layer toggles">
      {TRANSIT_TOGGLES.map(({ type, icon, color }) => {
        const isOn = layers[type];
        const isLoading = loadingLayers[type];

        return (
          <motion.button
            key={type}
            whileTap={{ scale: 0.93 }}
            onClick={() => onToggle(type)}
            disabled={isLoading}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
              'border transition-all duration-150 select-none',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              isOn
                ? 'text-white border-transparent shadow-sm'
                : 'bg-white dark:bg-surface-dark-secondary border-surface-border dark:border-surface-dark-border',
              'hover:shadow-card',
              isLoading && 'opacity-60 cursor-wait'
            )}
            style={
              isOn
                ? { backgroundColor: color, borderColor: color, '--tw-ring-color': color } as React.CSSProperties
                : { color: color }
            }
            aria-pressed={isOn}
            aria-label={`Toggle ${TRANSIT_LABELS[type]} layer`}
          >
            {isLoading ? (
              <svg
                className="w-3.5 h-3.5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              icon
            )}
            <span className="hidden sm:inline">{TRANSIT_LABELS[type]}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
