import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GeoSmart Helper Locality App | EzyHelpers',
  description:
    'Internal operations dashboard for EzyHelpers sourcing agents to visualize Bangalore localities, apartment complexes, and transit options for helper sourcing and commute planning.',
  keywords: [
    'EzyHelpers',
    'Bangalore localities',
    'helper sourcing',
    'apartment map',
    'transit planning',
    'GeoSmart',
  ],
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
  robots: 'noindex, nofollow', // Internal tool
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff', // Always light chrome
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon — EzyHelpers logo */}
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />

        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />

        {/*
          Anti-FOUC: runs before first paint.
          DEFAULT = LIGHT. Only switch to dark if user explicitly saved 'dark'.
          System/OS preference is intentionally ignored.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('geosmart_theme');
                if (t === 'dark') {
                  document.documentElement.classList.add('dark');
                }
                // else: stay light (no class = light mode in Tailwind)
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
