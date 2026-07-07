import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Brand Palette (Indigo / Linear-inspired) ──────────
        brand: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        // ── Light Surface System ──────────────────────────────
        surface: {
          DEFAULT:          '#FFFFFF',
          secondary:        '#F9FAFB',   // very light gray — page bg
          tertiary:         '#F3F4F6',   // card hover, input bg
          border:           '#E5E7EB',   // standard border
          'border-strong':  '#D1D5DB',   // emphasized border
          muted:            '#9CA3AF',   // muted text
          // Dark mode equivalents
          dark:             '#0F172A',   // page bg dark
          'dark-secondary': '#1E293B',   // card bg dark
          'dark-tertiary':  '#334155',   // hover dark
          'dark-border':    '#334155',   // border dark
        },
        // ── Marker / Semantic Colors (matches spec exactly) ───
        marker: {
          selected:  '#2563EB',   // Blue    — selected locality
          nearby:    '#F97316',   // Orange  — nearby locality
          default:   '#6366F1',   // Indigo  — default locality
          metro:     '#8B5CF6',   // Purple  — metro
          bus:       '#10B981',   // Green   — bus
          railway:   '#EF4444',   // Red     — railway
          auto:      '#F59E0B',   // Yellow  — auto stand
          apartment: '#06B6D4',   // Cyan    — apartment
        },
        // ── Status Colors ─────────────────────────────────────
        success: '#10B981',
        warning: '#F59E0B',
        danger:  '#EF4444',
        info:    '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        // Soft, professional shadows (Stripe / Linear style)
        'xs':      '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'card':    '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-md': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'card-lg': '0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        'float':   '0 20px 25px -5px rgb(0 0 0 / 0.10), 0 8px 10px -6px rgb(0 0 0 / 0.06)',
        'inner-sm':'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
        // Colored glows for markers
        'blue-glow':   '0 0 0 4px rgb(37 99 235 / 0.15)',
        'orange-glow': '0 0 0 4px rgb(249 115 22 / 0.15)',
        'indigo-glow': '0 0 0 4px rgb(99 102 241 / 0.15)',
      },
      borderRadius: {
        'sm':  '6px',
        DEFAULT: '8px',
        'md':  '10px',
        'lg':  '12px',
        'xl':  '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
        'gradient-subtle': 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(6px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',   opacity: '1' },
        },
        'slide-in-left': {
          '0%':   { transform: 'translateX(-8px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        'scale-in': {
          '0%':   { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        'spin': {
          'to': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in':      'fade-in 0.2s ease-out',
        'slide-up':     'slide-up 0.2s ease-out',
        'slide-in':     'slide-in-left 0.2s ease-out',
        'scale-in':     'scale-in 0.15s ease-out',
        'pulse-soft':   'pulse-soft 2s ease-in-out infinite',
        'spin':         'spin 0.8s linear infinite',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
      },
      spacing: {
        '18': '4.5rem',
        '68': '17rem',
        '84': '21rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
};

export default config;
