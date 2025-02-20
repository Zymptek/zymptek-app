import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/lib/database.types';

export const dynamic = 'force-dynamic';

interface SearchResultBase {
  type: 'category' | 'product';
  id: string;
  name: string;
  matchScore: number;
}

interface CategoryResult extends SearchResultBase {
  type: 'category';
  icon?: string;
}

interface ProductResult extends SearchResultBase {
  type: 'product';
  description: string | null;
  created_at: string | null;
  metadata: {
    category?: {
      id: string;
      name: string;
    };
  };
}

type SearchResult = CategoryResult | ProductResult;

// Helper function to calculate match score
function calculateMatchScore(text: string, query: string): number {
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (normalizedText === normalizedQuery) return 1;
  if (normalizedText.startsWith(normalizedQuery)) return 0.8;
  if (normalizedText.includes(normalizedQuery)) return 0.6;
  return 0.4; // Partial match
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const categories = searchParams.getAll('category');
    const sortBy = searchParams.get('sortBy');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Build the base query for products
    let productsQuery = supabase
      .from('products')
      .select(`
        product_id,
        headline,
        description,
        category_id,
        created_at,
        categories(
          id,
          name
        )
      `)
      .or(`headline.ilike.%${query}%,description.ilike.%${query}%`);

    // Apply category filter
    if (categories.length > 0) {
      productsQuery = productsQuery.in('category_id', categories);
    }

    // Get categories that match the search query
    const categoriesQuery = supabase
      .from('categories')
      .select('id, name, icon')
      .ilike('name', `%${query}%`);

    // Execute queries in parallel
    const [productsResponse, categoriesResponse] = await Promise.all([
      productsQuery,
      categoriesQuery
    ]);

    const results: SearchResult[] = [];

    // Process categories
    if (categoriesResponse.data) {
      results.push(...categoriesResponse.data.map(category => ({
        type: 'category' as const,
        id: category.id,
        name: category.name,
        icon: category.icon,
        matchScore: calculateMatchScore(category.name, query)
      })));
    }

    // Process products
    if (productsResponse.data) {
      results.push(...productsResponse.data.map(product => ({
        type: 'product' as const,
        id: product.product_id,
        name: product.headline,
        description: product.description,
        created_at: product.created_at,
        metadata: {
          category: product.categories ? {
            id: product.category_id,
            name: product.categories.name,
          } : undefined,
        },
        matchScore: calculateMatchScore(product.headline, query)
      })));
    }

    // Sort results based on match score and optionally by other criteria
    results.sort((a, b) => {
      if (sortBy === 'newest' && a.type === 'product' && b.type === 'product') {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      }
      return b.matchScore - a.matchScore;
    });

    // Cache the results for 5 minutes (300 seconds)
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 