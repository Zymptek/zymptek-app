import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: trendingProducts, error } = await supabase
      .rpc('get_trending_products', { _limit: 9 });

    if (error) {
      console.error('Error fetching trending products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch trending products' },
        { status: 500 }
      );
    }

    return NextResponse.json(trendingProducts);
  } catch (error) {
    console.error('Error in trending products route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 