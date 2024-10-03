"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, User, ChevronDown, Menu, LogOutIcon, LogOut, MessageSquareText } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Tables }  from '@/lib/database.types'

type Category = Tables<'categories'>;
type Subcategory = Tables<'subcategories'>;


const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchType, setSearchType] = useState('products');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      }
    };

    const fetchSubcategories = async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*');
      if (error) {
        console.error('Error fetching subcategories:', error);
      } else {
        setSubcategories(data);
      }
    };

    fetchCategories();
    fetchSubcategories();
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await fetch('/auth/signout', {
        method: 'POST',
      });

      window.location.href = '/sign-in';
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchType === 'products') {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
    // Add logic for manufacturer search if needed
  };

  const handleCategoryClick = (categoryId: string | null) => {
    if (categoryId) {
      window.location.href = `/products?category=${categoryId}`;
      router.refresh();
    }
  };

  const handleSubcategoryClick = (categoryId: string | null, subcategoryId: string | null) => {
    if (categoryId && subcategoryId) {
      window.location.href = `/products?category=${categoryId}&subcategory=${subcategoryId}`;
      router.refresh();
    }
  };

  return (
    <nav className="bg-accent-100 text-text-light">
      {/* Main Navbar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold font-heading text-brand-200 capitalize"
          >
            <Link href="/" passHref>
            ZYMPTEK
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-hover-bg-light"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu />
          </button>

          

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 flex-grow justify-end">
            {/* Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              className="flex-grow max-w-2xl mx-4 relative"
              animate={{ width: isSearchFocused ? '60%' : '50%' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex">
                <Select
                  value={searchType}
                  onValueChange={setSearchType}
                >
                  <SelectTrigger className="w-[140px] rounded-l-xl rounded-r-none bg-white border border-brand-300 text-text-light">
                    <SelectValue className="text-brand-300" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300">
                    <SelectItem value="products" className="text-brand-200">Products</SelectItem>
                    <SelectItem value="manufacturers" className="text-brand-200">Manufacturers</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="text"
                  placeholder={`Search ${searchType}...`}
                  className="flex-grow py-1 px-2 rounded-r-xl bg-white border border-brand-300 text-brand-300"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="absolute right-3 top-2.5 text-brand-300">
                <Search />
              </button>
            </motion.form>



            {/* Auth Buttons / User Menu */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full hover:bg-hover-bg-light"
                  >
                    <MessageSquareText />
                  </motion.button>
                  <Link href={`/profile`}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full hover:bg-hover-bg-light"
                  >
                    <User />
                  </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full hover:bg-hover-bg-light"
                    onClick={handleSignOut}
                  >
                    <LogOut />
                  </motion.button>
                </>
              ) : (
                <>
                <Link href="/sign-in" passHref>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl btn-primary text-white font-medium"
                  >
                    Sign In
                  </motion.button>
                  </Link>
                  <Link href="/sign-up" passHref>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-xl btn-outline font-medium"
                  >
                    Sign Up
                  </motion.button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4"
            >
              {/* Mobile Search Bar */}
              <form onSubmit={handleSearch} className="flex mb-4">
                <Select
                  value={searchType}
                  onValueChange={setSearchType}
                >
                  <SelectTrigger className="w-[140px] rounded-l-xl rounded-r-none bg-brand-500 border border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="manufacturers">Manufacturers</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="text"
                  placeholder={`Search ${searchType}...`}
                  className="flex-grow py-1 px-4 rounded-r-xl bg-brand-500 border border-gray-300 text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="ml-2 p-2 bg-brand-500 rounded-xl">
                  <Search />
                </button>
              </form>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-2">
                {isAuthenticated ? (
                  <>
                    <button className="p-2 rounded-md bg-hover-bg-light">
                      <MessageCircle className="inline-block mr-2" /> Messages
                    </button>
                    <button className="p-2 rounded-md bg-hover-bg-light">
                      <User className="inline-block mr-2" /> Profile
                    </button>
                  </>
                ) : (
                  <>
                  <Link href="/sign-in" passHref>
                    <button className="p-2 rounded-xl .btn-primary text-white font-medium">
                      Sign In
                    </button>
                    </Link>
                    <Link href="/sign-up" passHref>
                    <button className="p-2 rounded-xl .btn-outline font-medium">
                      Sign Up
                    </button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sub Navbar */}
      <div className="bg-gradient-brand text-white py-2 overflow-x-auto">
        <div className="container mx-auto px-4 flex items-center space-x-4">
          {/* Categories Dropdown */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <motion.button
                className="flex items-center space-x-1 px-3 py-1 rounded-md text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setIsPopoverOpen(true)}
                onMouseLeave={() => setIsPopoverOpen(false)}
              >
                <span>Categories</span>
                <ChevronDown size={16} />
              </motion.button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[90vw] max-w-[800px] p-0"
              onMouseEnter={() => setIsPopoverOpen(true)}
              onMouseLeave={() => setIsPopoverOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex bg-white shadow-lg"
              >
                <div className="w-1/3 border-r border-gray-200 p-1">
                  {categories.map((category) => (
                    <div 
                      key={category.id} 
                      className={`p-2 cursor-pointer rounded-xl ${selectedCategory === category.id ? 'bg-brand-300 text-white' : 'hover:bg-gray-100'}`}
                      onMouseEnter={() => setSelectedCategory(category.id)}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <h3 className="font-semibold">{category.name}</h3>
                    </div>
                  ))}
                </div>
                <div className="w-2/3 p-4">
                  <div className="grid grid-cols-3 gap-4">
                    {subcategories
                      .filter((sub) => sub.category_id === selectedCategory)
                      .map((sub) => (
                        <div 
                          key={sub.id} 
                          className="p-2 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSubcategoryClick(sub.category_id, sub.id)}
                        >
                          <div className="text-3xl mb-2">{sub.icon}</div>
                          <div className="text-sm font-medium text-gray-700">{sub.name}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            </PopoverContent>
          </Popover>

          {/* Main Categories */}
          {categories.slice(0, 5).map((category) => (
            <motion.button
              key={category.id}
              className="px-3 py-1 rounded-md text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;