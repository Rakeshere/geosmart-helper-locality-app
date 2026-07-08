'use client';

// ============================================================
// Theme Toggle — Dark / Light Mode
// ============================================================

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { STORAGE_KEYS } from '@/utils/constants';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Read persisted preference on mount — default is LIGHT
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.theme);
    // Only go dark if user explicitly chose dark. Default = light.
    const dark = stored === 'dark';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem(STORAGE_KEYS.theme, next ? 'dark' : 'light');
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center w-8 h-8 rounded-lg
        bg-surface-tertiary dark:bg-surface-dark-tertiary
        hover:bg-gray-200 dark:hover:bg-gray-700
        text-gray-600 dark:text-gray-300
        transition-colors duration-150"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
