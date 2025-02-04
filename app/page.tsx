import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import HomeClient from '@/components/home/home-client';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    // Fetch all required data server-side
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
    console.error('Error loading home page data:', error);
    // You might want to add proper error handling UI here
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-200 mb-4">Something went wrong</h2>
          <p className="text-brand-300">We're having trouble loading the page. Please try again later.</p>
        </div>
      </div>
    );
  }
}
