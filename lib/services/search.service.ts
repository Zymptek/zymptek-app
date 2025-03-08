import { debounce } from 'lodash';

export type SearchResult = {
  type: 'category' | 'subcategory' | 'product';
  id: string;
  name: string;
  icon?: string;
  description?: string;
  image_url?: string;
  metadata?: {
    category?: {
      id: string;
      name: string;
    };
  };
};

export type SearchSuggestion = {
  text: string;
  type: 'trending';
  category?: string;
};

export type SearchFilters = {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'relevance' | 'newest' | 'popular';
};

class SearchService {
  // Instant search with debouncing
  public instantSearch = debounce(async (
    query: string,
    filters?: SearchFilters
  ): Promise<SearchResult[]> => {
    if (!query.trim()) return [];

    try {
      const queryParams = new URLSearchParams({ q: query });
      
      // Add filters to query params if they exist
      if (filters) {
        if (filters.categories?.length) {
          filters.categories.forEach(cat => queryParams.append('category', cat));
        }
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
        if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      }

      const response = await fetch(`/api/search?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Search request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }, 300);

  // Get trending searches
  public async getTrendingSearches(): Promise<SearchSuggestion[]> {
    try {
      const response = await fetch('/api/search/trending');
      if (!response.ok) {
        throw new Error('Failed to fetch trending searches');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching trending searches:', error);
      return [];
    }
  }
}

export const searchService = new SearchService(); 