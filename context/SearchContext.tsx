'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { searchService, SearchResult, SearchSuggestion, SearchFilters } from '@/lib/services/search.service';

interface SearchContextType {
  query: string;
  results: SearchResult[];
  suggestions: SearchSuggestion[];
  isLoading: boolean;
  filters: SearchFilters;
  recentSearches: string[];
  error: string | null;
  setQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  clearSearch: () => void;
  performSearch: (query: string) => Promise<void>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load trending searches
        const trendingSearches = await searchService.getTrendingSearches();
        setSuggestions(trendingSearches);

        // Load recent searches from localStorage
        if (typeof window !== 'undefined') {
          const savedSearches = localStorage.getItem('recentSearches');
          if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches));
          }
        }
      } catch (err) {
        console.error('Error loading initial search data:', err);
      }
    };

    loadInitialData();
  }, []);

  // Perform search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchResults = await searchService.instantSearch(searchQuery, filters);
      // Ensure searchResults is never undefined
      setResults(searchResults || []);

      // Update recent searches
      setRecentSearches(prev => {
        const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5);
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('recentSearches', JSON.stringify(updated));
        }
        return updated;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during search');
      console.error('Search error:', err);
      setResults([]); // Clear results on error
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    // Re-run search with new filters if there's an active query
    if (query) {
      performSearch(query);
    }
  }, [query, performSearch]);

  return (
    <SearchContext.Provider
      value={{
        query,
        results,
        suggestions,
        isLoading,
        filters,
        recentSearches,
        error,
        setQuery: (newQuery: string) => {
          setQuery(newQuery);
          performSearch(newQuery);
        },
        setFilters: updateFilters,
        clearSearch,
        performSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 