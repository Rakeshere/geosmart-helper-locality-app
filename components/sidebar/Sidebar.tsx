'use client';

// ============================================================
// Desktop Sidebar
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { LocalityDetail } from '@/components/sidebar/LocalityDetail';
import { SidebarSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils/mapHelpers';
import type { Locality, Apartment, LocalityWithDistance } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  isLoading: boolean;
  selectedLocality: Locality | null;
  apartments: Apartment[];
  nearby: LocalityWithDistance[];
  onClose: () => void;
  onNearbySelect: (locality: Locality) => void;
}

export function Sidebar({
  isOpen,
  isLoading,
  selectedLocality,
  apartments,
  nearby,
  onClose,
  onNearbySelect,
}: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key="sidebar"
          initial={{ x: -340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -340, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={cn(
            'absolute left-0 top-0 bottom-0 z-[500]',
            'w-[340px] flex flex-col',
            'bg-white dark:bg-surface-dark-secondary',
            'border-r border-surface-border dark:border-surface-dark-border',
            'shadow-card-lg',
            // Hidden on mobile (uses BottomSheet instead)
            'hidden md:flex'
          )}
          role="complementary"
          aria-label="Locality details panel"
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border dark:border-surface-dark-border shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Locality Details
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center
                text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
                hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary
                transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <SidebarSkeleton />
            ) : selectedLocality ? (
              <LocalityDetail
                locality={selectedLocality}
                apartments={apartments}
                nearby={nearby}
                onNearbySelect={onNearbySelect}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 px-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-surface-secondary dark:bg-surface-dark-tertiary flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-gray-300 dark:text-gray-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select a locality
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
                    Click any marker on the map to view details, apartments, and nearby localities.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
