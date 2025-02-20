import { Tables } from '@/lib/database.types';

export type TrendingProduct = {
  product_id: string;
  headline: string;
  description: string | null;
  image_urls: string[];
  category_id: string;
  views_count: number;
  unique_viewers: number;
  is_featured: boolean;
  created_at: string;
  last_viewed_at: string | null;
}

export async function getTrendingProducts(): Promise<TrendingProduct[]> {
  try {
    const response = await fetch('/api/products/trending', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch trending products');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return [];
  }
} 