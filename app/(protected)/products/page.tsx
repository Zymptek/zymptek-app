"use client"

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ProductCard from '@/components/home/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Tables } from '@/lib/database.types';
import { Filter } from 'lucide-react';
import { Loading } from '@/components/Loading';
import { useInView } from 'react-intersection-observer';
import { useRouter, useSearchParams } from 'next/navigation';

type SortOption = 'price_asc' | 'price_desc';

const ITEMS_PER_PAGE = 12;

type Product = Database['public']['Functions']['get_products']['Returns'][number];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>(() => (searchParams.get('sort') as SortOption) || 'price_asc');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(() => searchParams.get('category'));
  const [subcategoryFilter, setSubcategoryFilter] = useState<string | null>(() => searchParams.get('subcategory'));
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState<Tables<'categories'>[]>([]);
  const [subcategories, setSubcategories] = useState<Tables<'subcategories'>[]>([]);
  const supabase = createClientComponentClient<Database>();
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data);
      }
    };

    const fetchSubcategories = async () => {
      const { data, error } = await supabase.from('subcategories').select('*');
      if (error) {
        console.error('Error fetching subcategories:', error);
      } else {
        setSubcategories(data);
      }
    };

    fetchCategories();
    fetchSubcategories();
  }, [supabase]);

  const fetchProducts = useCallback(async () => {
    if (!hasMore) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_products', {
        p_page: page,
        p_items_per_page: ITEMS_PER_PAGE,
        p_sort_by: sortBy,
        p_category_id: categoryFilter || undefined,
        p_subcategory_id: subcategoryFilter || undefined,
        p_search_term: searchTerm,
      });

      if (error) throw error;

      setProducts(prev => [...prev, ...data]);
      setHasMore(data.length === ITEMS_PER_PAGE);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [supabase, page, sortBy, categoryFilter, subcategoryFilter, searchTerm, hasMore]);

  useEffect(() => {
    if (inView) {
      fetchProducts();
    }
  }, [inView, fetchProducts]);

  useEffect(() => {
    // This effect will run when the component mounts or when the URL changes
    const search = searchParams.get('search');
    if (search) {
      setSearchTerm(search);
      resetProducts();
    }
  }, [searchParams]);

  const resetProducts = useCallback(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
  }, []);

  const updateURL = useCallback((params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value);
      }
    });
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleSortChange = useCallback((newSortBy: SortOption) => {
    setSortBy(newSortBy);
    updateURL({ sort: newSortBy });
    resetProducts();
  }, [resetProducts, updateURL]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setCategoryFilter(categoryId);
    setSubcategoryFilter(null);
    updateURL({ category: categoryId, subcategory: null });
    resetProducts();
  }, [resetProducts, updateURL]);

  const handleSubcategoryChange = useCallback((subcategoryId: string) => {
    setSubcategoryFilter(subcategoryId);
    updateURL({ subcategory: subcategoryId });
    resetProducts();
  }, [resetProducts, updateURL]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Products</h1>
      
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-300"
          onChange={(e) => handleSortChange(e.target.value as SortOption)}
          value={sortBy}
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <select
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-300"
          onChange={(e) => handleCategoryChange(e.target.value)}
          value={categoryFilter || ''}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        {categoryFilter && (
          <select
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-300"
            onChange={(e) => handleSubcategoryChange(e.target.value)}
            value={subcategoryFilter || ''}
          >
            <option value="">All Subcategories</option>
            {subcategories
              .filter((subcategory) => subcategory.category_id === categoryFilter)
              .map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
              ))}
          </select>
        )}
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {products.map((product) => (
            <motion.div
              key={product.product_id}
              variants={itemVariants}
              exit={{ opacity: 0, y: 20 }}
            >
              <ProductCard 
                product={product} 
                categoryName={product.category_name}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {products.length === 0 && !loading && (
        <p className="text-center text-gray-600 mt-8">No products found.</p>
      )}

      {hasMore && (
        <div ref={ref} className="mt-8 text-center">
          <Loading />
        </div>
      )}
    </div>
  );
}