'use client';

// ============================================================
// Mobile Bottom Sheet
// ============================================================

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin } from 'lucide-react';
import { LocalityDetail } from '@/components/sidebar/LocalityDetail';
import { SidebarSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils/mapHelpers';
import type { Locality, Apartment, LocalityWithDistance } from '@/types';

interface BottomSheetProps {
  isOpen: boolean;
  isLoading: boolean;
  selectedLocality: Locality | null;
  apartments: Apartment[];
  nearby: LocalityWithDistance[];
  onClose: () => void;
  onNearbySelect: (locality: Locality) => void;
}

export function BottomSheet({
  isOpen,
  isLoading,
  selectedLocality,
  apartments,
  nearby,
  onClose,
  onNearbySelect,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[600] bg-black/20 dark:bg-black/40 md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-[700]',
              'max-h-[80vh] flex flex-col',
              'bg-white dark:bg-surface-dark-secondary',
              'rounded-t-3xl shadow-float',
              'md:hidden'
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Locality details"
          >
            {/* Handle */}
            <div className="flex flex-col items-center pt-3 pb-1 shrink-0">
              <div
                className="w-10 h-1 rounded-full bg-surface-border dark:bg-surface-dark-border"
                aria-hidden="true"
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-surface-border dark:border-surface-dark-border shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {selectedLocality?.name ?? 'Locality Details'}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center
                  text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
                  hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary
                  transition-colors"
                aria-label="Close bottom sheet"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {isLoading ? (
                <SidebarSkeleton />
              ) : selectedLocality ? (
                <LocalityDetail
                  locality={selectedLocality}
                  apartments={apartments}
                  nearby={nearby}
                  onNearbySelect={(loc) => {
                    onNearbySelect(loc);
                    onClose();
                  }}
                />
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
