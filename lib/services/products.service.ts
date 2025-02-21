import { type Database } from '@/lib/database.types';
import { getCacheDuration } from '@/config/cache.config';

export type Product = Database['public']['Tables']['products']['Row'] & {
  categories: { name: string };
  subcategories: { name: string };
};

export type TrendingProduct = Product & {
  views_count: number;
  unique_viewers: number;
};

export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  category_id?: string;
  subcategory_id?: string;
  min_price?: number;
  max_price?: number;
  sort?: 'price_asc' | 'price_desc' | 'created_at' | 'views';
  search?: string;
}

export async function getTrendingProducts(): Promise<TrendingProduct[]> {
  const res = await fetch('/api/products/trending', {
    next: {
      revalidate: getCacheDuration('TRENDING_PRODUCTS')
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch trending products');
  }

  return res.json();
}

export async function getAllProducts(params: ProductsQueryParams = {}): Promise<Product[]> {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  const res = await fetch(`/api/products?${queryParams.toString()}`, {
    next: {
      revalidate: getCacheDuration('ALL_PRODUCTS')
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  const products: Product[] = await res.json();
  return products;
} 