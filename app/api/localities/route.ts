// ============================================================
// API Route: /api/localities
// Returns localities with their apartments
// ============================================================

import { NextResponse } from 'next/server';
import { LOCALITIES, APARTMENTS } from '@/data/localities';

export async function GET() {
  return NextResponse.json(
    {
      localities: LOCALITIES,
      apartments: APARTMENTS,
    },
    {
      headers: {
        // Cache for 5 minutes
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
      },
    }
  );
}
