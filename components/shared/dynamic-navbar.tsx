'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './navbar';

// Throttle function to limit scroll event handling
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export default function DynamicNavbar() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  // Handle initial mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScroll = useCallback(throttle(() => {
    const currentScrollY = window.scrollY;
    
    if (!isHomePage) {
      setShowNavbar(true);
      return;
    }

    // Show navbar after hero section (adjust 600 based on your hero height)
    if (currentScrollY > 600) {
      setShowNavbar(true);
    } else {
      setShowNavbar(false);
    }
  }, 100), [isHomePage]);

  useEffect(() => {
    if (!mounted) return;

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, mounted]);

  // Don't render anything until after hydration
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {(showNavbar || !isHomePage) && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 left-0 right-0 z-50 ${isHomePage ? 'bg-white shadow-md' : ''}`}
        >
          <Navbar />
        </motion.div>
      )}
    </AnimatePresence>
  );
} 