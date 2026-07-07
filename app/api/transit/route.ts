// ============================================================
// API Route: /api/transit
// Proxy for Overpass API with Supabase caching
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getTransitStops } from '@/services/transit';
import type { TransitType } from '@/types';

const VALID_TYPES: TransitType[] = ['metro', 'bus', 'railway', 'auto'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as TransitType | null;

  if (!type || !VALID_TYPES.includes(type)) {
    return NextResponse.json(
      { error: 'Invalid transit type. Valid: metro, bus, railway, auto' },
      { status: 400 }
    );
  }

  try {
    const stops = await getTransitStops(type);
    return NextResponse.json(
      { stops, cached: false },
      {
        headers: {
          // Cache for 1 hour at CDN level
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error(`[transit] Failed to fetch ${type}:`, error);
    return NextResponse.json(
      { error: 'Transit data unavailable', stops: [] },
      { status: 503 }
    );
  }
}
