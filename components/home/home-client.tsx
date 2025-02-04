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
    { image: '/banner2.png', title: 'Exclusive B2B Deals', description: 'Save up to 40% on bulk orders' },
    { image: '/banner3.png', title: 'Expand Your Global Reach', description: 'Tap into the potential of Indian markets' },
  ];

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
              <Image src={banner.image} alt={banner.title} layout="fill" objectFit="cover" />
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

      <motion.section className="mb-8 md:mb-16 mx-4 md:mx-10 px-4 py-8 md:py-12" variants={staggerChildren} initial="initial" animate="animate">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-brand-200">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {initialProducts.map((product) => (
            <motion.div 
              key={product.product_id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Hot Deals Section */}
      <motion.section className="mb-8 md:mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
      </motion.section>

      {/* Why Choose Zymptek Section */}
      <motion.section className="mb-8 md:mb-16 mx-4 md:mx-10 px-4 py-8 md:py-12" variants={staggerChildren} initial="initial" animate="animate">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-brand-200">Why Choose Zymptek?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <motion.div className="bg-white p-5 md:p-6 rounded-lg shadow-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.05 }}>
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-brand-200">Verified Suppliers</h3>
            <p className="mb-3 md:mb-4 text-brand-300">All our suppliers undergo a rigorous verification process to ensure quality and reliability.</p>
            <Link href="/our-process" className="text-brand-200 hover:underline">Learn about our verification process</Link>
          </motion.div>
          <motion.div className="bg-white p-5 md:p-6 rounded-lg shadow-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.05 }}>
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-brand-200">Secure Transactions</h3>
            <p className="mb-3 md:mb-4 text-brand-300">Our platform ensures safe and secure transactions for all your B2B needs.</p>
            <Link href="/security" className="text-brand-200 hover:underline">View our security measures</Link>
          </motion.div>
          <motion.div className="bg-white p-5 md:p-6 rounded-lg shadow-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.05 }}>
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-brand-200">24/7 Support</h3>
            <p className="mb-3 md:mb-4 text-brand-300">Our dedicated support team is always ready to assist you with any queries or issues.</p>
            <Link href="/contact" className="text-brand-200 hover:underline">Contact our support team</Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Blog Section */}
      <motion.section className="mb-8 md:mb-16 mx-4 md:mx-10 px-4 py-8 md:py-12" variants={staggerChildren} initial="initial" animate="animate">
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
      </motion.section>

      {/* Testimonials Section */}
      <motion.section className="mb-8 md:mb-16 mx-4 md:mx-10 px-4 py-8 md:py-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-brand-200">What Our Clients Say</h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <motion.div className="bg-white p-5 md:p-6 rounded-lg shadow-md flex flex-col items-center text-center" whileHover={{ scale: 1.05 }}>
                <Image src={testimonial.avatar} alt={testimonial.name} width={60} height={60} className="rounded-full mb-3 md:mb-4" />
                <p className="mb-3 md:mb-4 italic text-brand-300 text-sm md:text-base">"{testimonial.text}"</p>
                <p className="font-semibold text-brand-200">{testimonial.name}</p>
                <p className="text-xs md:text-sm text-brand-300">{testimonial.company}</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.section>

      {/* Newsletter Section */}
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
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-brand-200">Stay Informed</h2>
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-brand-200">Subscribe to Our Newsletter</h3>
            <p className="mb-4 md:mb-6 text-brand-300">Stay updated with the latest trends, deals, and insights in the B2B world.</p>
            <form className="flex flex-col md:flex-row">
              <input type="email" placeholder="Enter your email" className="flex-grow px-4 py-2 mb-4 md:mb-0 md:mr-4 rounded-lg border text-brand-300 border-brand-200 bg-white" />
              <button className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </motion.section>
      </section>
    </div>
  );
} 