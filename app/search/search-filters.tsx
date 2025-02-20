'use client';

import { useState } from 'react';
import { Tables } from '@/lib/database.types';
import { useSearch } from '@/context/SearchContext';

interface SearchFiltersProps {
  categories: Tables<'categories'>[];
}

export default function SearchFilters({ categories }: SearchFiltersProps) {
  const { filters, setFilters } = useSearch();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category.id} className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-brand-200 rounded border-gray-300"
                checked={filters.categories?.includes(category.id)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...(filters.categories || []), category.id]
                    : (filters.categories || []).filter(id => id !== category.id);
                  setFilters({ ...filters, categories: newCategories });
                }}
              />
              <span className="ml-2 text-sm text-gray-600">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-24 px-2 py-1 text-sm border rounded"
              placeholder="Min"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              min="0"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-24 px-2 py-1 text-sm border rounded"
              placeholder="Max"
            />
          </div>
          <button
            onClick={() => setFilters({ 
              ...filters, 
              minPrice: priceRange[0], 
              maxPrice: priceRange[1] 
            })}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-brand-200 
              rounded-lg hover:bg-brand-300 transition-colors"
          >
            Apply Price Range
          </button>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
        <select
          value={filters.sortBy || 'relevance'}
          onChange={(e) => setFilters({ 
            ...filters, 
            sortBy: e.target.value as 'relevance' | 'newest' | 'popular' 
          })}
          className="w-full px-3 py-2 text-sm border rounded-lg"
        >
          <option value="relevance">Most Relevant</option>
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </div>
  );
} 