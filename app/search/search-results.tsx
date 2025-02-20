'use client';

import { useEffect } from 'react';
import { useSearch } from '@/context/SearchContext';
import Link from 'next/link';
import Image from 'next/image';

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const { results, isLoading, error, performSearch } = useSearch();

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, performSearch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-brand-200 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <svg className="w-12 h-12 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Search Error</h3>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Enter a search term to find products and categories</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No results found</h3>
        <p className="text-gray-600 mt-2">Try different keywords or browse categories</p>
      </div>
    );
  }

  // Group results by type
  const categories = results.filter(r => r.type === 'category');
  const products = results.filter(r => r.type === 'product');

  return (
    <div className="space-y-8">
      {/* Categories Section */}
      {categories.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group block bg-white rounded-lg shadow-sm overflow-hidden 
                  hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    {category.icon && (
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {category.icon}
                      </span>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-brand-200 
                        transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600">Browse products</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products Section */}
      {products.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group block bg-white rounded-lg shadow-sm overflow-hidden 
                  hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="relative aspect-video bg-gray-100">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-brand-200 
                    transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  {product.metadata?.category && (
                    <p className="text-sm text-brand-200 mt-1">
                      {product.metadata.category.name}
                    </p>
                  )}
                  {product.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
} 