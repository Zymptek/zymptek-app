"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductCard from '@/components/home/ProductCard';
import { Tables } from '@/lib/database.types';
import { blogPosts } from '@/lib/data/blog-posts';
import BlogCard from '@/components/blog/blog-card';
import NewsletterForm from '@/components/home/newsletter-form';

type Product = Tables<'products'> & {
  shipping_info: {
    leadTime: string;
  };
};
type Category = Tables<'categories'>;
type Subcategory = Tables<'subcategories'>;

interface HomeClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
  initialSubcategories: Subcategory[];
}

export default function HomeClient({ 
  initialProducts, 
  initialCategories, 
  initialSubcategories 
}: HomeClientProps) {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategories.length > 0 ? initialCategories[0].id : null
  );

  const banners = [
    { image: '/banner.png', title: 'Connect with Indian Exporters', description: 'Access a wide range of high-quality products' },
    { image: '/banner2.png', title: 'Premium B2B Platform', description: 'Connecting global buyers with verified Indian manufacturers' },
    { image: '/banner3.png', title: 'Expand Your Global Reach', description: 'Tap into the potential of Indian markets' },
  ];

  /* Temporarily Hidden Testimonials
  const testimonials = [
    { id: 1, name: 'John Doe', company: 'ABC Corp', text: 'Zymptek has revolutionized our sourcing process. The quality of products and reliability of suppliers is unmatched.', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Jane Smith', company: 'XYZ Industries', text: 'We\'ve seen a 30% increase in our profit margins since we started using Zymptek. Highly recommended!', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Robert Johnson', company: 'Global Traders', text: 'The platform\'s user-friendly interface and excellent customer support make international trade a breeze.', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, name: 'Emily Brown', company: 'Tech Innovators', text: 'Zymptek has opened up new markets for us. Their vast network of suppliers is impressive.', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: 5, name: 'Michael Lee', company: 'Green Solutions', text: 'The quality control measures Zymptek has in place give us peace of mind with every order.', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 6, name: 'Sarah Wilson', company: 'Fashion Forward', text: 'As a small business, Zymptek has been instrumental in our growth. Their competitive pricing and reliable delivery have been game-changers.', avatar: 'https://i.pravatar.cc/150?img=6' },
    { id: 7, name: 'David Martinez', company: 'Global Foods Co.', text: 'The diversity of products available on Zymptek is unparalleled. It\'s our go-to platform for all our import needs.', avatar: 'https://i.pravatar.cc/150?img=7' },
    { id: 8, name: 'Lisa Taylor', company: 'Eco Friendly Packaging', text: 'Zymptek\'s commitment to sustainability aligns perfectly with our company values. They\'ve helped us find eco-friendly suppliers easily.', avatar: 'https://i.pravatar.cc/150?img=8' },
  ];
  */

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="bg-background-light min-h-screen w-full">
      <section className="mb-8 md:mb-16 w-full">
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden shadow-xl">
          {banners.map((banner, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === currentBannerIndex ? 1 : 0,
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <Image 
                src={banner.image} 
                alt={banner.title} 
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center max-w-2xl px-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">{banner.title}</h2>
                  <p className="text-lg md:text-xl mb-4 md:mb-8">{banner.description}</p>
                  <Link href="/products">
                    <button className="bg-brand-200 text-white px-6 py-2 md:px-8 md:py-3 rounded-full text-base md:text-lg font-semibold hover:bg-brand-300 transition-colors">
                      Explore Now
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-center mt-2 md:mt-4">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full mx-1 ${index === currentBannerIndex ? 'bg-brand-200' : 'bg-gray-300'}`}
              onClick={() => setCurrentBannerIndex(index)}
            />
          ))}
        </div>
      </section>

      <section className="mb-8 md:mb-16 mx-4 md:mx-10 px-4 py-8 md:py-12 bg-gradient-to-r from-brand-100 to-brand-200 rounded-lg shadow-lg" id="categories">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-white">Explore Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
          {initialCategories.map((category) => (
            <button
              key={category.id}
              className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-lg transition-all ${
                selectedCategory === category.id ? 'bg-white text-brand-200' : 'bg-brand-300 text-white hover:bg-brand-400'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="text-2xl md:text-3xl mb-1 md:mb-2">{category.icon}</span>
              <span className="text-xs md:text-sm font-semibold text-center">{category.name}</span>
            </button>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-brand-200">
            {initialCategories.find(cat => cat.id === selectedCategory)?.name} Sub-categories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {initialSubcategories
              .filter(subcat => subcat.category_id === selectedCategory)
              .map((subCategory) => (
                <Link href={`/products?category=${selectedCategory}&subcategory=${subCategory.id}`} key={subCategory.id}>
                  <motion.div 
                    className="bg-gray-100 p-3 md:p-4 rounded-lg text-center cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-2xl md:text-3xl mb-1 md:mb-2 block">{subCategory.icon}</span>
                    <h4 className="text-xs md:text-sm font-semibold text-brand-200">{subCategory.name}</h4>
                  </motion.div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Hot Deals Section - Temporarily Removed */}
      {/* <motion.section className="mb-8 md:mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="bg-brand-500 p-6 md:p-8 shadow-md">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-brand-200">🔥 Hot Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-brand-200">Bulk Order Discounts</h3>
              <p className="mb-3 md:mb-4 text-brand-300">Save up to 40% on orders over $10,000. Limited time offer!</p>
              <Link href="/hot-deals" className="btn btn-primary inline-block">
                View Deals
              </Link>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-brand-200">New Supplier Special</h3>
              <p className="mb-3 md:mb-4 text-brand-300">Get a 10% discount on your first order from our new verified suppliers.</p>
              <Link href="/new-suppliers" className="btn btn-primary inline-block">
                Explore New Suppliers
              </Link>
            </div>
          </div>
        </div>
      </motion.section> */}

      {/* Why Choose Zymptek Section */}
      <motion.section className="mb-8 md:mb-16 mx-4 md:mx-10 px-4 py-8 md:py-12" variants={staggerChildren} initial="initial" animate="animate">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-brand-200">Why Choose Zymptek?</h2>
          <p className="text-brand-300 text-lg max-w-2xl mx-auto">Experience the future of B2B trade with our comprehensive platform</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <motion.div 
            className="bg-gradient-to-br from-white to-brand-50 p-8 rounded-2xl shadow-lg border border-brand-100/20" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
          >
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-16 h-16 bg-brand-100/10 rounded-2xl transform rotate-6"></div>
              <div className="relative z-10 flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-brand-200 to-brand-300 text-white shadow-lg">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4 text-brand-200">Verified Suppliers</h3>
            <p className="text-brand-300 leading-relaxed">Our rigorous verification process ensures all suppliers meet international quality standards, compliance requirements, and business reliability criteria.</p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-white to-brand-50 p-8 rounded-2xl shadow-lg border border-brand-100/20" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }} 
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
          >
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-16 h-16 bg-brand-100/10 rounded-2xl transform -rotate-6"></div>
              <div className="relative z-10 flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-brand-200 to-brand-300 text-white shadow-lg">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4 text-brand-200">Secure Transactions</h3>
            <p className="text-brand-300 leading-relaxed">End-to-end encrypted platform with secure payment gateways, escrow services, and comprehensive trade protection measures for safe B2B transactions.</p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-white to-brand-50 p-8 rounded-2xl shadow-lg border border-brand-100/20" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }} 
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
          >
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-16 h-16 bg-brand-100/10 rounded-2xl transform rotate-12"></div>
              <div className="relative z-10 flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-brand-200 to-brand-300 text-white shadow-lg">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4 text-brand-200">24/7 Support</h3>
            <p className="text-brand-300 leading-relaxed">Dedicated multilingual support team available round-the-clock to assist with sourcing, negotiations, and trade logistics across all time zones.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Blog Section - Temporarily Hidden */}
      {/* <motion.section className="mb-8 md:mb-16 mx-4 md:mx-10 px-4 py-8 md:py-12" variants={staggerChildren} initial="initial" animate="animate">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-brand-200">Why Choose Indian Products?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <motion.div className="bg-white rounded-lg shadow-md overflow-hidden h-[500px] flex flex-col" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.05 }}>
            <div className="relative h-48">
              <Image 
                src="https://images.unsplash.com/photo-1558346547-4439467bd1d5?w=800&auto=format&fit=crop&q=60" 
                alt="Indian Textile Quality" 
                fill
                className="object-cover" 
              />
            </div>
            <div className="p-5 md:p-6 flex flex-col flex-grow">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-brand-200 bg-brand-100 rounded-full">
                  Product Quality
                </span>
              </div>
              <h3 className="font-semibold text-lg md:text-xl mb-3 text-brand-200 line-clamp-2">Excellence in Indian Textiles: A Buyer's Guide</h3>
              <p className="text-brand-300 mb-4 flex-grow line-clamp-3">Discover why Indian textiles are preferred worldwide - from superior cotton quality to intricate craftsmanship and modern manufacturing standards.</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="text-sm text-brand-300">5 min read</span>
                <Link 
                  href="/blog/indian-textile-quality" 
                  className="text-brand-200 hover:text-brand-300 font-medium"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-lg shadow-md overflow-hidden h-[500px] flex flex-col" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.05 }}>
            <div className="relative h-48">
              <Image 
                src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=60" 
                alt="Product Innovation" 
                fill
                className="object-cover" 
              />
            </div>
            <div className="p-5 md:p-6 flex flex-col flex-grow">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-brand-200 bg-brand-100 rounded-full">
                  Innovation & Technology
                </span>
              </div>
              <h3 className="font-semibold text-lg md:text-xl mb-3 text-brand-200 line-clamp-2">Innovation in Indian Manufacturing</h3>
              <p className="text-brand-300 mb-4 flex-grow line-clamp-3">How Indian manufacturers are combining traditional expertise with cutting-edge technology to deliver superior products to global markets.</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="text-sm text-brand-300">4 min read</span>
                <Link 
                  href="/blog/indian-manufacturing-innovation" 
                  className="text-brand-200 hover:text-brand-300 font-medium"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-lg shadow-md overflow-hidden h-[500px] flex flex-col" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.05 }}>
            <div className="relative h-48">
              <Image 
                src="https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=800&auto=format&fit=crop&q=60" 
                alt="Cost Effectiveness" 
                fill
                className="object-cover" 
              />
            </div>
            <div className="p-5 md:p-6 flex flex-col flex-grow">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-brand-200 bg-brand-100 rounded-full">
                  Value Proposition
                </span>
              </div>
              <h3 className="font-semibold text-lg md:text-xl mb-3 text-brand-200 line-clamp-2">Cost-Quality Advantage of Indian Products</h3>
              <p className="text-brand-300 mb-4 flex-grow line-clamp-3">Analysis of how Indian products offer the perfect balance of quality and cost-effectiveness, making them ideal for global buyers.</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="text-sm text-brand-300">6 min read</span>
                <Link 
                  href="/blog/value-advantage" 
                  className="text-brand-200 hover:text-brand-300 font-medium"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section> */}

      {/* Testimonials Section - Temporarily Hidden */}
      {/* <motion.section 
        className="mb-8 md:mb-16 mx-4 md:mx-10 px-4 py-12 md:py-16" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-brand-200">What Our Clients Say</h2>
          <p className="text-brand-300 text-lg max-w-2xl mx-auto">
            Join thousands of satisfied businesses who trust Zymptek for their international trade needs
          </p>
        </div>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
          }}
          className="testimonials-swiper !pb-12"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <motion.div 
                className="bg-gradient-to-br from-white to-brand-50 p-6 md:p-8 rounded-2xl shadow-lg border border-brand-100/20 h-[360px] flex flex-col"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <div className="flex items-start">
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 w-16 h-16 bg-brand-100/10 rounded-full"></div>
                    <Image 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      width={56} 
                      height={56} 
                      className="rounded-full border-4 border-white shadow-md relative z-10" 
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <p className="font-bold text-brand-200">{testimonial.name}</p>
                    <p className="text-sm text-brand-300">{testimonial.company}</p>
                  </div>
                  <svg className="w-8 h-8 text-brand-200/20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <div className="mt-6 flex-grow">
                  <p className="text-brand-300 leading-relaxed line-clamp-6">"{testimonial.text}"</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-brand-100/20">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 bg-brand-100/10 px-3 py-1.5 rounded-full">
                    <svg 
                      className="w-4 h-4 text-brand-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-brand-200">Verified</span>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.section> */}

      {/* Newsletter Section - Modified for Production */}
      <section className="mx-4 md:mx-10 px-4 py-8 md:py-12">
        <motion.section
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
          }}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-brand-200">Stay Connected</h2>
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-brand-200">Join Our Business Network</h3>
            <p className="mb-4 md:mb-6 text-brand-300">Get updates on new suppliers, industry insights, and market opportunities.</p>
            <NewsletterForm />
          </div>
        </motion.section>
      </section>
    </div>
  );
} 