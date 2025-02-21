'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTrendingProducts, getAllProducts, TrendingProduct, Product } from '@/lib/services/products.service';

interface ProductsContextType {
  trendingProducts: TrendingProduct[] | null;
  products: Product[] | null;
  isLoadingTrending: boolean;
  isLoadingProducts: boolean;
  error: string | null;
  refreshTrendingProducts: () => Promise<void>;
  refreshAllProducts: (page?: number) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[] | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshTrendingProducts = async () => {
    setIsLoadingTrending(true);
    setError(null);
    try {
      const data = await getTrendingProducts();
      setTrendingProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trending products');
    } finally {
      setIsLoadingTrending(false);
    }
  };

  const refreshAllProducts = async (page = 1) => {
    setIsLoadingProducts(true);
    setError(null);
    try {
      const data = await getAllProducts({ page, limit: 10 });
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    refreshTrendingProducts();
    refreshAllProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        trendingProducts,
        products,
        isLoadingTrending,
        isLoadingProducts,
        error,
        refreshTrendingProducts,
        refreshAllProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsContext() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }
  return context;
} 