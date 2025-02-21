export const CACHE_CONFIG = {
  // Cache durations in seconds
  TRENDING_PRODUCTS: 300, // 5 minutes
  ALL_PRODUCTS: 900, // 15 minutes
  SEARCH_RESULTS: 60, // 1 minute
  CATEGORIES: 3600, // 1 hour

  // Sanity content cache durations
  SANITY_HERO: 3600, // 1 hour (static content, can be cached longer)
  SANITY_ABOUT: 3600, // 1 hour
  SANITY_TERMS: 7200, // 2 hours (rarely changes)
  SANITY_DEFAULT: 3600, // 1 hour default for other Sanity content
} as const;

// Simple helper to get cache duration
export function getCacheDuration(key: keyof typeof CACHE_CONFIG): number {
  return CACHE_CONFIG[key];
} 