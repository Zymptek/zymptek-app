import HomeClient from '@/components/home/home-client';
import { Tables } from '@/lib/database.types';
import { getHomePageContent } from '@/lib/api/sanity/home';
import { getCacheDuration } from '@/config/cache.config';
import { HomePageContent } from '@/lib/types/sanity/home';

export const revalidate = getCacheDuration('SANITY_HOME');

export const metadata = {
  title: 'Home Page | Zymptek',
  description: 'Welcome to our B2B marketplace. Explore our latest products and categories.',
  keywords: ['B2B', 'marketplace', 'products', 'shopping', 'online store'],
};

export default async function Home() {
  const content: HomePageContent = await getHomePageContent();


  return (
    <main>
      <HomeClient {...content} />
    </main>
  );
}
