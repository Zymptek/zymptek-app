"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import NewsletterForm from '@/components/home/newsletter-form';
import Hero from '@/components/home/hero';
import { HeroContent } from '@/lib/types/sanity/hero';
import CategoriesSection from '@/components/home/categories-section';
import { CategoriesProvider } from '@/context/CategoriesContext';
import { CategorySectionContent } from '@/lib/types/sanity/categories';

interface HomeClientProps {
  hero: HeroContent;
  categories: CategorySectionContent;
}

export default function HomeClient({ 
  hero,
  categories
}: HomeClientProps) {
  // Refs for scroll animations
  const whyChooseRef = useRef(null);
  const newsletterRef = useRef(null);

  // Check if sections are in view
  const isWhyChooseInView = useInView(whyChooseRef, { once: true, amount: 0.3 });
  const isNewsletterInView = useInView(newsletterRef, { once: true, amount: 0.3 });

  return (
    <div className="bg-background-light min-h-screen w-full">
      <Hero heroContent={hero} />
      
      <CategoriesProvider>
        <CategoriesSection content={categories}/>
      </CategoriesProvider>

      {/* Why Choose Zymptek Section */}
      <motion.section 
        ref={whyChooseRef}
        className="mb-6 md:mb-12 mx-4 md:mx-10 px-4 py-6 md:py-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: isWhyChooseInView ? 1 : 0,
          y: isWhyChooseInView ? 0 : 50
        }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <motion.h2 
            className="text-xl md:text-2xl font-bold mb-3 text-brand-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isWhyChooseInView ? 1 : 0,
              y: isWhyChooseInView ? 0 : 20
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Why Choose Zymptek?
          </motion.h2>
          <motion.p 
            className="text-brand-300 text-sm md:text-base max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isWhyChooseInView ? 1 : 0,
              y: isWhyChooseInView ? 0 : 20
            }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Experience the future of B2B trade with our comprehensive platform
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Verified Suppliers",
              description: "Our rigorous verification process ensures all suppliers meet international quality standards.",
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              delay: 0.4
            },
            {
              title: "Secure Transactions",
              description: "End-to-end encrypted platform with secure payment gateways and trade protection.",
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ),
              delay: 0.5
            },
            {
              title: "24/7 Support",
              description: "Dedicated multilingual support team available round-the-clock to assist you.",
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ),
              delay: 0.6
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: isWhyChooseInView ? 1 : 0,
                y: isWhyChooseInView ? 0 : 30
              }}
              transition={{ duration: 0.6, delay: item.delay }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative z-10 p-4 md:p-6 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm rounded-lg border border-brand-100/10 hover:border-brand-200/20 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-200 to-brand-300 text-white shadow-md group-hover:shadow-lg transition-all duration-300">
                    {item.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-base md:text-lg font-semibold mb-1 text-brand-200 group-hover:text-brand-300 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-brand-300/90 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
              {/* Decorative gradient blob */}
              <div className="absolute -inset-2 bg-gradient-to-r from-brand-100/20 via-brand-200/10 to-brand-300/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 -z-10" />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Newsletter Section - Modified for Production */}
      <motion.section 
        ref={newsletterRef}
        className="mx-4 md:mx-10 px-4 py-8 md:py-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: isNewsletterInView ? 1 : 0,
          y: isNewsletterInView ? 0 : 50
        }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: isNewsletterInView ? 1 : 0,
            scale: isNewsletterInView ? 1 : 0.95
          }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-brand-200">Stay Connected</h2>
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-brand-200">Join Our Business Network</h3>
            <p className="mb-4 md:mb-6 text-brand-300">Get updates on new suppliers, industry insights, and market opportunities.</p>
            <NewsletterForm />
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
} 