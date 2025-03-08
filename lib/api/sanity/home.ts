import { cache } from 'react';
import { sanityFetch } from '@/lib/sanity.config';
import { homePageQuery } from './queries/home';
import { HomePageContent } from '@/lib/types/sanity/home';
import { getCacheDuration } from '@/config/cache.config';

export const getHomePageContent = cache(async (): Promise<HomePageContent> => {
  try {
    const data = await sanityFetch<HomePageContent>({
      query: homePageQuery,
      tags: ['home', 'hero', 'categories']
    });
    return data;
  } catch (error) {
    console.error('[Sanity] Error fetching home page content:', error);
    throw error;
  }
}); 