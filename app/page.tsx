import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import HomeClient from '@/components/home/home-client';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    const [productsResponse, categoriesResponse, subcategoriesResponse] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8),
      supabase
        .from('categories')
        .select('*'),
      supabase
        .from('subcategories')
        .select('*')
    ]);

    // Handle any potential errors
    if (productsResponse.error) throw productsResponse.error;
    if (categoriesResponse.error) throw categoriesResponse.error;
    if (subcategoriesResponse.error) throw subcategoriesResponse.error;

    // Pass the data to the client component
    return (
      <HomeClient 
        initialProducts={productsResponse.data}
        initialCategories={categoriesResponse.data}
        initialSubcategories={subcategoriesResponse.data}
      />
    );
  } catch (error) {
    console.error('Error in Home:', error);
    throw error;
  }
}
