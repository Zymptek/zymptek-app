"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Tables } from '@/lib/database.types';
import { HeroContent } from '@/lib/types/sanity/hero';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useProductsContext } from '@/context/ProductsContext';
import { useSearch } from '@/context/SearchContext';
import SearchBox from '@/components/shared/SearchBox';

type Category = Tables<'categories'>;
type Product = Tables<'products'>;

interface HeroProps {
  categories: Category[];
  heroContent: HeroContent;
}

// Update the searchDropdownStyles constant
const searchDropdownStyles = {
  base: `
    bg-white/95 backdrop-blur-sm shadow-lg rounded-lg border border-gray-200
    divide-y divide-gray-100
    z-50 overflow-hidden
  `,
  mobile: `
    fixed left-4 right-4 top-[72px]
    max-h-[60vh] overflow-y-auto
  `,
  desktop: `
    absolute top-full left-0 right-0 mt-2
    w-full max-h-[400px] overflow-y-auto
  `
};

export default function Hero({ categories, heroContent }: HeroProps) {
  const {
    query,
    results,
    suggestions,
    isLoading,
    error,
    setQuery,
    clearSearch,
    performSearch,
    recentSearches
  } = useSearch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { trendingProducts } = useProductsContext();
  const supabase = createClientComponentClient();
  const searchRef = useRef<HTMLDivElement>(null);

  // Scroll progress for navbar visibility
  const { scrollY } = useScroll();
  const navbarOpacity = useTransform(scrollY, [0, 200], [0, 1]);
  const navbarTranslateY = useTransform(scrollY, [0, 200], [-100, 0]);

  useEffect(() => {
    // Update navbar visibility in layout
    const updateNavbar = () => {
      const navbar = document.querySelector('.navbar-container') as HTMLElement;
      if (navbar) {
        navbar.style.opacity = String(navbarOpacity.get());
        navbar.style.transform = `translateY(${navbarTranslateY.get()}%)`;
      }
    };

    const unsubscribeY = scrollY.on('change', updateNavbar);
    return () => {
      unsubscribeY();
    };
  }, [scrollY, navbarOpacity, navbarTranslateY]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions visibility when query changes
  useEffect(() => {
    if (isSearchFocused) {
      setShowSuggestions(true);
    }
  }, [query, isSearchFocused]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const searchContainerVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const borderVariants = {
    initial: {
      background: "linear-gradient(90deg, var(--brand-100), var(--brand-200), var(--brand-300))",
      backgroundSize: "200% 100%",
    },
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 3,
        ease: "linear",
        repeat: Infinity
      }
    }
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    if (query.trim()) {
      performSearch(query);
      setShowSuggestions(true);
    }
  };

  // Handle key press for search
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Main Content */}
      <div className="relative">
        <div className="container mx-auto">
          <div className="relative px-4 sm:px-6 lg:px-8 pt-4">
            {/* Mobile-first Content */}
            <div className="flex flex-col gap-4 lg:hidden">
              <h1 className="text-2xl font-bold text-brand-200">
                {heroContent.title.gradient}<br />
                {heroContent.title.main}
              </h1>
              <p className="text-sm text-gray-600">
                {heroContent.description}
              </p>

              {/* Search Bar */}
              <SearchBox 
                variant="hero" 
                placeholder={heroContent.searchPlaceholder}
                className="w-full"
              />

              {/* Stats Grid - Mobile */}
              <div className="flex items-center justify-between py-3 px-2 bg-brand-100/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs text-brand-200 font-medium">Trusted Platform</span>
                </div>
                <div className="flex items-center divide-x divide-brand-200/10">
                  <div className="px-3 text-center">
                    <span className="block text-base font-bold text-brand-200">{heroContent.stats.products.number}</span>
                    <span className="block text-[10px] uppercase tracking-wider text-gray-600 font-medium">{heroContent.stats.products.label}</span>
                  </div>
                  <div className="px-3 text-center">
                    <span className="block text-base font-bold text-brand-200">{heroContent.stats.suppliers.number}</span>
                    <span className="block text-[10px] uppercase tracking-wider text-gray-600 font-medium">{heroContent.stats.suppliers.label}</span>
                  </div>
                  <div className="px-3 text-center">
                    <span className="block text-base font-bold text-brand-200">{heroContent.stats.countries.number}</span>
                    <span className="block text-[10px] uppercase tracking-wider text-gray-600 font-medium">{heroContent.stats.countries.label}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Content */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-left space-y-4 md:space-y-6"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.2]"
                >
                  <span className="bg-gradient-to-r from-brand-200 to-brand-300 bg-clip-text text-transparent">
                    {heroContent.title.gradient}
                  </span>{' '}
                  <span className="relative inline-block">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="absolute left-0 bottom-2 h-3 bg-brand-200/20 -z-10"
                    />
                    <span className="text-brand-200">{heroContent.title.main}</span>
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-xl text-gray-600 max-w-xl"
                >
                  {heroContent.description}
                </motion.p>

                {/* Desktop Search */}
                <motion.div
                  variants={searchContainerVariants}
                  className="relative w-full max-w-2xl"
                >
                  <SearchBox 
                    variant="hero" 
                    placeholder={heroContent.searchPlaceholder}
                    className="w-full"
                  />
                </motion.div>

                {/* Desktop Stats */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between py-4 px-6 bg-gradient-to-r from-brand-100/5 via-brand-100/10 to-brand-100/5 rounded-xl"
                >
                  <motion.div 
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-100/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-brand-200">Trusted Platform</span>
                      <span className="text-xs text-gray-600">Verified by Industry Leaders</span>
                    </div>
                  </motion.div>

                  <div className="flex items-center divide-x divide-brand-200/10">
                    <motion.div 
                      className="px-8 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="block text-2xl font-bold text-brand-200 mb-0.5">{heroContent.stats.products.number}</span>
                      <span className="block text-xs uppercase tracking-wider text-gray-600 font-medium">{heroContent.stats.products.label}</span>
                    </motion.div>
                    <motion.div 
                      className="px-8 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <span className="block text-2xl font-bold text-brand-200 mb-0.5">{heroContent.stats.suppliers.number}</span>
                      <span className="block text-xs uppercase tracking-wider text-gray-600 font-medium">{heroContent.stats.suppliers.label}</span>
                    </motion.div>
                    <motion.div 
                      className="px-8 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="block text-2xl font-bold text-brand-200 mb-0.5">{heroContent.stats.countries.number}</span>
                      <span className="block text-xs uppercase tracking-wider text-gray-600 font-medium">{heroContent.stats.countries.label}</span>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Content - Animation */}
              <motion.div
                variants={itemVariants}
                className="relative"
              >
                <div className="relative w-full aspect-square">
                  <DotLottieReact
                    src={heroContent.animation.url}
                    loop
                    autoplay
                    className="w-full h-full"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
