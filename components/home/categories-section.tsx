'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useCategories } from '@/context/CategoriesContext';
import { useState, useMemo, useRef, useEffect } from 'react';
import React from 'react';
import { CategorySectionContent } from '@/lib/types/sanity/categories';

// Screen breakpoints
const SCREEN_SIZES = {
  sm: 640,  // phones
  md: 768,  // tablets
  lg: 1024, // laptops
  xl: 1280, // desktop
};

// Items per page for different screen sizes
const ITEMS_PER_SCREEN = {
  sm: 6,    // 6 items for phones
  md: 9,    // 9 items for tablets
  lg: 12,   // 12 items for laptops/desktops
};

// Custom hook for responsive pagination
function useResponsivePagination() {
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_SCREEN.lg);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < SCREEN_SIZES.sm) {
        setItemsPerPage(ITEMS_PER_SCREEN.sm);
      } else if (width < SCREEN_SIZES.md) {
        setItemsPerPage(ITEMS_PER_SCREEN.sm);
      } else if (width < SCREEN_SIZES.lg) {
        setItemsPerPage(ITEMS_PER_SCREEN.md);
      } else {
        setItemsPerPage(ITEMS_PER_SCREEN.lg);
      }
    }

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return itemsPerPage;
}

const categoryColors = [
  { gradient: 'from-brand-100 via-brand-200 to-brand-300', text: 'text-brand-200', shadow: 'shadow-brand-200/20' },
  { gradient: 'from-brand-200 via-brand-300 to-brand-400', text: 'text-brand-300', shadow: 'shadow-brand-300/20' },
  { gradient: 'from-brand-300 via-brand-400 to-brand-500', text: 'text-brand-400', shadow: 'shadow-brand-400/20' },
];

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  })
};

const paginationVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  dot: {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  },
  line: {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  }
};

export default function CategoriesSection({ content }: { content: CategorySectionContent }) {
  const { categories, isLoading, error } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = useResponsivePagination();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return searchQuery
      ? categories.filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : categories;
  }, [categories, searchQuery]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  
  // Reset to first page if total pages changes
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(0);
    }
  }, [totalPages, currentPage]);

  const currentCategories = filteredCategories.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  if (isLoading || error) {
    return (
      <section className="relative bg-gray-50/50 py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--brand-200-rgb),0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(var(--brand-300-rgb),0.05),transparent_70%)]" />
        
        <div className="relative container mx-auto px-4">
          {/* Header Skeleton */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="text-center mb-10">
              <div className="h-12 w-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg mx-auto mb-4 animate-pulse" />
              <div className="h-4 w-96 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded mx-auto animate-pulse" />
            </div>

            {/* Search Bar Skeleton */}
            <div className="relative max-w-2xl mx-auto">
              <div className="w-full h-16 bg-white rounded-2xl shadow-md shadow-gray-200/50 border border-gray-100 animate-pulse" />
            </div>
          </div>

          {/* Categories Grid Skeleton */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
              {[...Array(itemsPerPage)].map((_, index) => (
                <div
                  key={index}
                  className="relative p-3 bg-white rounded-2xl animate-pulse shadow-md border border-gray-100"
                >
                  {/* Gradient Border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 opacity-50" />
                  
                  {/* Content */}
                  <div className="relative flex flex-col items-center">
                    {/* Icon Container */}
                    <div className="w-14 h-14 mb-3 rounded-xl bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200" />
                    
                    {/* Category Name */}
                    <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      ref={sectionRef}
      style={{ opacity }}
      className="relative bg-gray-50/50 py-20 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--brand-200-rgb),0.05),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(var(--brand-300-rgb),0.05),transparent_70%)]" />
      <motion.div 
        className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"
        animate={{
          x: [-20, 20, -20],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className="absolute -bottom-20 -left-20 w-[40rem] h-[40rem] bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"
        animate={{
          x: [20, -20, 20],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <div className="relative container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {content.title.start}{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-brand-200 to-brand-300 bg-clip-text text-transparent">
                  {content.title.highlight}
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-brand-200/30 to-brand-300/30 -skew-x-6" />
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {content.description}
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            className="relative max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <input
                type="text"
                placeholder={content.search.placeholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl shadow-md border border-gray-100 focus:ring-2 focus:ring-brand-200 focus:border-transparent outline-none text-lg"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <svg className="w-6 h-6 text-brand-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
            {currentCategories.map((category, index) => {
              const colorScheme = categoryColors[index % categoryColors.length];
              return (
                <motion.div
                  key={category.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={`/products?category=${category.id}`}
                    className="group block h-full"
                  >
                    <div className="relative p-3 bg-white rounded-2xl transition-all duration-300 shadow-md border border-gray-100 hover:shadow-lg hover:border-brand-100">
                      {/* Gradient Border */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                        style={{ 
                          background: `linear-gradient(var(--brand-100), var(--brand-300))`,
                          padding: '1px'
                        }}
                      >
                        <div className="absolute inset-[1px] bg-white rounded-2xl" />
                      </div>

                      {/* Content */}
                      <div className="relative flex flex-col items-center">
                        {/* Icon Container */}
                        <div className={`w-14 h-14 mb-3 rounded-xl bg-gradient-to-br ${colorScheme.gradient} p-[1px] group-hover:scale-110 transition-transform duration-300`}>
                          <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                            <span className={`text-xl ${colorScheme.text}`}>{category.icon}</span>
                          </div>
                        </div>

                        {/* Category Name */}
                        <h3 className="text-sm font-medium text-gray-800 text-center group-hover:text-brand-200 transition-colors duration-300">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Improved Pagination */}
          {totalPages > 1 && (
            <motion.div 
              className="mt-12 flex flex-col items-center gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Progress Bar */}
              <div className="w-full max-w-md h-1 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-200 to-brand-300"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: `${((currentPage + 1) / totalPages) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-6">
                <motion.button
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    currentPage === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-brand-200 hover:bg-brand-50 hover:text-brand-300 shadow-sm hover:shadow-md border border-gray-100'
                  }`}
                  whileHover={currentPage !== 0 ? { scale: 1.02 } : {}}
                  whileTap={currentPage !== 0 ? { scale: 0.98 } : {}}
                >
                  {content.navigation.previous}
                </motion.button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        currentPage === i
                          ? 'bg-gradient-to-r from-brand-200 to-brand-300 scale-125'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Go to page ${i + 1}`}
                    />
                  ))}
                </div>

                <motion.button
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    currentPage === totalPages - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-brand-200 hover:bg-brand-50 hover:text-brand-300 shadow-sm hover:shadow-md border border-gray-100'
                  }`}
                  whileHover={currentPage !== totalPages - 1 ? { scale: 1.02 } : {}}
                  whileTap={currentPage !== totalPages - 1 ? { scale: 0.98 } : {}}
                >
                  {content.navigation.next}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {filteredCategories.length === 0 && (
            <motion.div 
              className="text-center py-12 bg-white/80 backdrop-blur rounded-3xl shadow-lg max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-600">{content.search.noResults}</p>
              <motion.button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-brand-200 font-medium hover:text-brand-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {content.search.clearButton}
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
} 