"use client";

import { useEffect, useRef, useState } from 'react';
import useActiveSection from '@/hooks/useActiveSection';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StickSubNav = () => {
  const sectionIds = ['overview', 'production', 'products', 'reviews'];
  const activeSection = useActiveSection(sectionIds);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const checkForArrows = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    checkForArrows();
    window.addEventListener('resize', checkForArrows);
    return () => window.removeEventListener('resize', checkForArrows);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (sectionIds.includes(hash)) {
      handleScrollToSection(hash);
    }
  }, [window.location.hash]);

  return (
      <div className="bg-background-light">
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
        )}
        <div
          ref={containerRef}
          className="overflow-x-auto scrollbar-hide"
          onScroll={checkForArrows}
        >
          <ul className="flex whitespace-nowrap py-0 px-6">
            {sectionIds.map((sectionId) => (
              <li key={sectionId} className="inline-block mr-4 last:mr-0">
                <Link href={`#${sectionId}`} scroll={false} passHref>
                  <Button
                    onClick={() => handleScrollToSection(sectionId)}
                    className={`text-gray-600 hover:text-brand-300 transition-colors px-4 py-2 ${
                      activeSection === sectionId
                        ? 'font-bold text-brand-300'
                        : ''
                    }`}
                  >
                    {sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace('-', ' ')}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        )}
      </div>
  );
};

export default StickSubNav;
