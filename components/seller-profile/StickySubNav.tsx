"use client";

import { useEffect, useRef } from 'react';
import useActiveSection from '@/hooks/useActiveSection'; // Adjust the import path as needed
import Link from 'next/link';
import { Button } from '../ui/button';

const StickSubNav = () => {
  const sectionIds = ['overview', 'production', 'trade', 'products', 'reviews'];
  const activeSection = useActiveSection(sectionIds);

  // Ref for the container to ensure proper scrolling
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the section
  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, []);

  const scrollContainerStyle = {
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    msOverflowStyle: 'none' as 'none',  // IE and Edge
    scrollbarWidth: 'none' as 'none',    // Firefox
  } as React.CSSProperties;

  const hideScrollbarStyle = {
    scrollbarWidth: 'none' as 'none',     // Firefox
  } as React.CSSProperties;

  // Smooth scroll when URL hash changes
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (sectionIds.includes(hash)) {
      handleScrollToSection(hash);
    }
  }, [window.location.hash]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10 rounded-b-lg border-b border-gray-200">
      <div ref={containerRef}  className="container mx-auto px-4 py-2 overflow-x-auto">
      <div style={scrollContainerStyle}>
        <ul className="flex space-x-4" style={hideScrollbarStyle}>
          {sectionIds.map((sectionId) => (
            <li key={sectionId} className="flex-shrink-0">
              <Link href={`#${sectionId}`} scroll={false} passHref>
                <Button
                  onClick={() => handleScrollToSection(sectionId)}
                  className={`relative text-brand-200 hover:text-brand-300 rounded-none transition-colors ${
                    activeSection === sectionId ? 'font-bold border-b-4 border-brand-300' : ''
                  }`}
                >
                  {sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace('-', ' ')}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </nav>
  );
};

export default StickSubNav;
