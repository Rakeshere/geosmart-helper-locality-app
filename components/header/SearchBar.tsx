'use client';

// ============================================================
// Search Bar with Autocomplete
// ============================================================

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Building2, Clock, Trash2 } from 'lucide-react';
import { cn } from '@/utils/mapHelpers';
import { SearchSkeleton } from '@/components/ui/Skeleton';
import type { SearchResult, RecentSearch } from '@/types';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  recentSearches: RecentSearch[];
  onSelect: (result: SearchResult) => void;
  onClearRecent: () => void;
  onClear: () => void;
}

export function SearchBar({
  query,
  onQueryChange,
  results,
  isSearching,
  recentSearches,
  onSelect,
  onClearRecent,
  onClear,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const showDropdown =
    isFocused && (query.length > 0 || recentSearches.length > 0);
  const showRecent = query.length === 0 && recentSearches.length > 0;
  const showResults = query.length > 0;
  const noResults = showResults && !isSearching && results.length === 0;

  const handleSelect = (result: SearchResult) => {
    onSelect(result);
    inputRef.current?.blur();
    setIsFocused(false);
  };

  return (
    <div className="relative flex-1 max-w-md" role="search">
      {/* Input */}
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl border bg-white dark:bg-surface-dark-secondary',
          'transition-all duration-150',
          isFocused
            ? 'border-brand-400 ring-2 ring-brand-100 dark:ring-brand-900 shadow-card-md'
            : 'border-surface-border dark:border-surface-dark-border'
        )}
      >
        <Search className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
        <input
          ref={inputRef}
          id="geosmart-search"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Search localities or apartments…"
          className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none"
          autoComplete="off"
          aria-label="Search localities and apartments"
          aria-autocomplete="list"
          aria-controls="search-results"
        />
        {query && (
          <button
            onClick={onClear}
            className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            id="search-results"
            initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{ transformOrigin: 'top' }}
            className={cn(
              'absolute top-full left-0 right-0 mt-1 z-50',
              'bg-white dark:bg-surface-dark-secondary',
              'border border-surface-border dark:border-surface-dark-border',
              'rounded-xl shadow-float overflow-hidden'
            )}
            role="listbox"
          >
            {isSearching && <SearchSkeleton />}

            {/* Recent Searches */}
            {!isSearching && showRecent && (
              <div>
                <div className="flex items-center justify-between px-3 pt-3 pb-1">
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Recent
                  </span>
                  <button
                    onClick={onClearRecent}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
                    aria-label="Clear recent searches"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear
                  </button>
                </div>
                {recentSearches.slice(0, 5).map((recent) => (
                  <button
                    key={recent.id}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-surface-secondary dark:hover:bg-surface-dark-tertiary transition-colors text-left"
                    onClick={() =>
                      onQueryChange(recent.label)
                    }
                    role="option"
                    aria-selected={false}
                  >
                    <div className="w-7 h-7 rounded-lg bg-surface-tertiary dark:bg-surface-dark-tertiary flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                        {recent.label}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {recent.type}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Search Results */}
            {!isSearching && showResults && results.length > 0 && (
              <div className="py-1">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-surface-secondary dark:hover:bg-surface-dark-tertiary transition-colors text-left"
                    onClick={() => handleSelect(result)}
                    role="option"
                    aria-selected={false}
                    aria-label={`${result.label} - ${result.type}`}
                  >
                    <div
                      className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                        result.type === 'locality'
                          ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                          : 'bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400'
                      )}
                    >
                      {result.type === 'locality' ? (
                        <MapPin className="w-3.5 h-3.5" />
                      ) : (
                        <Building2 className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {result.label}
                      </p>
                      {result.sublabel && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {result.sublabel}
                        </p>
                      )}
                    </div>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-surface-tertiary dark:bg-surface-dark-tertiary text-gray-500 dark:text-gray-400 capitalize shrink-0">
                      {result.type}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {noResults && (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <Search className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  No results for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Try searching by locality name, apartment, or pincode
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
