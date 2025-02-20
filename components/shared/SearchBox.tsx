import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '@/context/SearchContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface SearchBoxProps {
  variant?: 'default' | 'hero';
  placeholder?: string;
  className?: string;
}

export default function SearchBox({ 
  variant = 'default', 
  placeholder = 'Search products, categories...',
  className = ''
}: SearchBoxProps) {
  const {
    query,
    results,
    suggestions,
    isLoading,
    error,
    recentSearches,
    setQuery,
    clearSearch,
    performSearch
  } = useSearch();

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  // Get top 4 items to show as badges
  const getTopBadges = () => {
    if (query) {
      // If there's a query, show top results
      return results.slice(0, 4).map(result => ({
        text: result.name,
        type: result.type,
        id: result.id,
        icon: 'icon' in result ? result.icon : null
      }));
    } else {
      // If no query, show suggestions only
      return suggestions.slice(0, 4).map(s => ({
        text: s.text,
        type: 'suggestion' as const
      }));
    }
  };

  // Handle badge click
  const handleBadgeClick = (badge: ReturnType<typeof getTopBadges>[number]) => {
    if ('id' in badge) {
      router.push(`/${badge.type}s/${badge.id}`);
    } else {
      setQuery(badge.text);
      performSearch(badge.text);
    }
  };

  // Group results by type
  const categories = results.filter(r => r.type === 'category');
  const products = results.filter(r => r.type === 'product');

  return (
    <div className={`w-full ${className}`}>
      {/* Search Input */}
      <div className="relative group">
        {/* Gradient border effect */}
        <motion.div
          className="absolute -inset-[2px] rounded-xl opacity-75 blur-[1px] group-hover:blur-[2px] transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          style={{
            background: "linear-gradient(90deg, var(--brand-200), var(--brand-300), var(--brand-400), var(--brand-300), var(--brand-200))",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
          }}
        />
        
        {/* Inner shadow effect */}
        <div className="absolute inset-[1px] rounded-[10px] bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-sm" />
        
        {/* Main input container */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden flex items-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
          <motion.div 
            className="pl-4 text-brand-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.div>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            className="w-full pl-3 pr-16 py-3.5 text-base bg-transparent focus:outline-none 
              text-gray-800 placeholder-gray-400 transition-all duration-200"
          />
          
          {/* Clear button */}
          <AnimatePresence mode="wait">
            {query ? (
              <div className="absolute right-0 top-0 bottom-0 flex">
                <motion.button 
                  key="clear"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="h-full w-12 flex items-center justify-center
                    hover:bg-brand-100/10 transition-all duration-200"
                  onClick={() => {
                    clearSearch();
                    inputRef.current?.focus();
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5 text-brand-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.div>
                </motion.button>
              </div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Top Badges */}
      <AnimatePresence mode="wait">
        {!isLoading && !error && (
          <motion.div 
            className="flex flex-wrap gap-2 mt-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {getTopBadges().map((badge, index) => (
              <motion.button
                key={badge.text}
                onClick={() => handleBadgeClick(badge)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-200 ${
                  badge.type === 'category' ? 
                    'bg-gradient-to-r from-brand-100/20 to-brand-200/10 text-brand-200 hover:from-brand-100/30 hover:to-brand-200/20 border border-brand-200/20 shadow-sm' :
                  badge.type === 'product' ?
                    'bg-gradient-to-r from-brand-200/10 via-brand-300/15 to-brand-400/10 text-brand-200 hover:from-brand-200/20 hover:via-brand-300/25 hover:to-brand-400/20 border border-brand-300/20 shadow-sm' :
                  'bg-gradient-to-r from-brand-100/10 to-brand-500/20 text-brand-200 hover:from-brand-100/20 hover:to-brand-500/30 border border-brand-500/20'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{ 
                  scale: badge.type === 'product' ? 1.08 : 1.05,
                  y: badge.type === 'product' ? -2 : 0,
                  filter: 'brightness(1.1)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                {badge.type === 'category' && badge.icon ? (
                  <span className="text-lg">{badge.icon}</span>
                ) : badge.type === 'product' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )}
                <span>{badge.text}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center mt-3">
          <div className="w-6 h-6 border-2 border-brand-200 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-3 text-center text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
} 