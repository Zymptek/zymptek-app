"use client"

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import SellerCard from '@/components/home/SellerCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Tables } from '@/lib/database.types';
import { Loading } from '@/components/Loading';
import { useInView } from 'react-intersection-observer';
import { SellerData } from './types';
import { useSearchParams } from 'next/navigation';
import { Seller } from './types';
import { Package } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const supabase = createClientComponentClient<Database>();
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const fetchSellers = useCallback(async () => {
    if (!hasMore) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_sellers', {
        p_page: page,
        p_items_per_page: ITEMS_PER_PAGE,
        p_search_term: searchQuery || undefined,
      });

      if (error) throw error;

      setSellers(prev => [...prev, ...(data as unknown as Seller[])]);
      setHasMore(data.length === ITEMS_PER_PAGE);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      setError('Failed to load sellers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [supabase, page, hasMore, searchQuery]);

  useEffect(() => {
    setSellers([]);
    setPage(0);
    setHasMore(true);
  }, [searchQuery]);

  useEffect(() => {
    if (inView) {
      fetchSellers();
    }
  }, [inView, fetchSellers]);

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
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Package className="w-10 h-10 text-brand-100 mr-3" />
            <h1 className="text-3xl font-semibold text-brand-200">Manufacturers</h1>
          </div>
        </div>
        <p className="mt-4 text-gray-600">
          Connect with verified manufacturers and streamline your supply chain.
        </p>
      </div>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <AnimatePresence>
          {sellers.map((seller) => (
            <motion.div
              key={seller.user_id}
              variants={itemVariants}
              exit={{ opacity: 0, y: 20 }}
            >
              <SellerCard seller={seller} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {sellers.length === 0 && !loading && (
        <p className="text-center text-gray-600 mt-8">No sellers found.</p>
      )}

      {hasMore && (
        <div ref={ref} className="mt-8 text-center">
          <Loading />
        </div>
      )}
    </div>
  );
}
