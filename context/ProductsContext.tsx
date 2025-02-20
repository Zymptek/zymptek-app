'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTrendingProducts, TrendingProduct } from '@/lib/services/products.service';

interface ProductsContextType {
  trendingProducts: TrendingProduct[] | null;
  isLoadingTrending: boolean;
  error: string | null;
  refreshTrendingProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function useProductsContext() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }
  return context;
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[] | null>(null);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshTrendingProducts = async () => {
    setIsLoadingTrending(true);
    setError(null);
    try {
      const products = await getTrendingProducts();
      setTrendingProducts(products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trending products');
    } finally {
      setIsLoadingTrending(false);
    }
  };

  useEffect(() => {
    refreshTrendingProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        trendingProducts,
        isLoadingTrending,
        error,
        refreshTrendingProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
} 