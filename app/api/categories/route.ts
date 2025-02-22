import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const [categoriesResponse, subcategoriesResponse] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('subcategories').select('*').order('name')
    ]);

    if (categoriesResponse.error) {
      throw new Error(categoriesResponse.error.message);
    }

    if (subcategoriesResponse.error) {
      throw new Error(subcategoriesResponse.error.message);
    }

    return NextResponse.json({
      categories: categoriesResponse.data,
      subcategories: subcategoriesResponse.data
    });
  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 