import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/database.types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // First try to get featured products
    let { data: trendingProducts } = await supabase
      .from('products')
      .select(`
        product_id,
        headline,
        categories(name)
      `)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(5);

    // If no featured products, get most recent products
    if (!trendingProducts || trendingProducts.length === 0) {
      const { data: recentProducts } = await supabase
        .from('products')
        .select(`
          product_id,
          headline,
          categories(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      trendingProducts = recentProducts;
    }

    // Transform the data into search suggestions
    const suggestions = trendingProducts?.map(product => ({
      text: product.headline,
      type: 'trending' as const,
      category: product.categories?.name
    })) || [];

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Trending search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 