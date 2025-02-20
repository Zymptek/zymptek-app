import { Suspense } from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import SearchResults from './search-results';
import SearchFilters from './search-filters';
import { SearchProvider } from '@/context/SearchContext';

interface SearchPageProps {
  searchParams: { q?: string };
}

export const metadata = {
  title: 'Search Results | Zymptek',
  description: 'Search results for products, categories, and more.',
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Get initial data
  const query = searchParams.q || '';
  
  try {
    // Fetch categories for filters
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {query ? `Search results for "${query}"` : 'Search Products & Categories'}
            </h1>
            <p className="text-gray-600">
              Find the perfect products and suppliers for your business
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <SearchFilters categories={categories || []} />
            </div>

            {/* Results Content */}
            <div className="flex-grow">
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="w-8 h-8 border-3 border-brand-200 border-t-transparent rounded-full animate-spin" />
                </div>
              }>
                <SearchResults query={query} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error in search page:', error);
    throw error;
  }
} 