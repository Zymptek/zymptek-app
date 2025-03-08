import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type Database } from '@/lib/database.types';

export const dynamic = 'force-dynamic';

interface ProductQueryParams {
  page: string;
  limit: string;
  category_id: string | null;
  subcategory_id: string | null;
  min_price: string | null;
  max_price: string | null;
  sort: 'price_asc' | 'price_desc' | 'created_at' | 'views';
  search: string | null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Define default values and handle undefined cases
    const params: ProductQueryParams = {
      page: searchParams.get('page') ?? '1',
      limit: searchParams.get('limit') ?? '10',
      category_id: searchParams.get('category_id'),
      subcategory_id: searchParams.get('subcategory_id'),
      min_price: searchParams.get('min_price'),
      max_price: searchParams.get('max_price'),
      sort: (searchParams.get('sort') as ProductQueryParams['sort']) ?? 'created_at',
      search: searchParams.get('search'),
    };

    const page = parseInt(params.page);
    const limit = parseInt(params.limit);
    const offset = (page - 1) * limit;

    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    let query = supabase
      .from('products')
      .select(`
        *,
        categories!inner(name),
        subcategories!inner(name)
      `, { count: 'exact' });

    // Apply filters only if they exist
    if (params.category_id) {
      query = query.eq('category_id', params.category_id);
    }

    if (params.subcategory_id) {
      query = query.eq('subcategory_id', params.subcategory_id);
    }

    if (params.min_price) {
      query = query.gte('pricing->>price', params.min_price);
    }

    if (params.max_price) {
      query = query.lte('pricing->>price', params.max_price);
    }

    if (params.search) {
      query = query.ilike('headline', `%${params.search}%`);
    }

    // Apply sorting
    switch (params.sort) {
      case 'price_asc':
        query = query.order('pricing->>price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('pricing->>price', { ascending: false });
        break;
      case 'views':
        query = query.order('views_count', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: products, error, count } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Return just the products array instead of the full response object
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=59',
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error in products route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 