// ============================================================
// Map Helper Utilities
// ============================================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MARKER_COLORS } from '@/utils/constants';
import type { TransitType } from '@/types';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Create a custom SVG circle marker for localities.
 * Returns an object compatible with Leaflet DivIcon.
 */
export function createLocalityMarkerSvg(
  state: 'default' | 'selected' | 'nearby',
  apartmentCount: number
): string {
  const colors = {
    default: { fill: MARKER_COLORS.default, ring: '#A5B4FC', text: '#fff' },
    selected: { fill: MARKER_COLORS.selected, ring: '#93C5FD', text: '#fff' },
    nearby: { fill: MARKER_COLORS.nearby, ring: '#FED7AA', text: '#fff' },
  };

  const { fill, ring } = colors[state];
  const size = state === 'selected' ? 42 : 34;
  const radius = size / 2;
  const hasApts = apartmentCount > 0;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${radius}" cy="${radius}" r="${radius - 2}" fill="${ring}" opacity="0.4"/>
      <circle cx="${radius}" cy="${radius}" r="${radius - 5}" fill="${fill}"/>
      ${hasApts ? `<text x="${radius}" y="${radius + 1}" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="${state === 'selected' ? 12 : 10}" font-family="Inter, sans-serif" font-weight="600">${apartmentCount}</text>` : ''}
    </svg>
  `.trim();
}

/**
 * Get transit marker color by type.
 */
export function getTransitColor(type: TransitType): string {
  return MARKER_COLORS[type];
}

/**
 * Get transit icon character by type.
 */
export function getTransitIcon(type: TransitType): string {
  const icons: Record<TransitType, string> = {
    metro: 'M',
    bus: 'B',
    railway: 'R',
    auto: 'A',
  };
  return icons[type];
}

/**
 * Create an SVG icon for transit stops.
 */
export function createTransitMarkerSvg(type: TransitType): string {
  const color = getTransitColor(type);
  const icon = getTransitIcon(type);
  return `
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="22" height="22" rx="6" fill="${color}" opacity="0.9"/>
      <text x="12" y="13" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="10" font-family="Inter, sans-serif" font-weight="700">${icon}</text>
    </svg>
  `.trim();
}

/**
 * Create an apartment marker SVG.
 */
export function createApartmentMarkerSvg(): string {
  return `
    <svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 5.25 2.857 9.83 7.09 12.29L14 36l6.91-9.71C25.143 23.83 28 19.25 28 14 28 6.268 21.732 0 14 0z" fill="#06B6D4"/>
      <circle cx="14" cy="14" r="7" fill="white"/>
      <text x="14" y="15" text-anchor="middle" dominant-baseline="middle" fill="#06B6D4" font-size="9" font-family="Inter, sans-serif" font-weight="700">APT</text>
    </svg>
  `.trim();
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Truncate a string to a max length */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + '…';
}
