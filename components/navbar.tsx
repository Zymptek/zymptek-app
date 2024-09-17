"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageCircle, User, ChevronDown, Menu, LogOutIcon, LogOut, MessageSquareText } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const Navbar = () => {

  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchType, setSearchType] = useState('products');

  const mainCategories = ['Electronics', 'Office Supplies', 'Furniture', 'Industrial', 'Safety'];
  const allCategories = {
    'Electronics': ['Computers', 'Phones', 'Accessories'],
    'Office Supplies': ['Paper', 'Pens', 'Organizers'],
    'Furniture': ['Desks', 'Chairs', 'Storage'],
    'Industrial': ['Tools', 'Machinery', 'Raw Materials'],
    'Safety': ['PPE', 'First Aid', 'Fire Safety'],
    'Automotive': ['Parts', 'Accessories', 'Fluids'],
    'Cleaning': ['Janitorial', 'Chemicals', 'Equipment'],
    'Packaging': ['Boxes', 'Tape', 'Bubble Wrap'],
    'Hospitality': ['Linens', 'Amenities', 'Food Service'],
    'Medical': ['Supplies', 'Equipment', 'Pharmaceuticals'],
  };

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
            <motion.div
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
    />
  </div>
  <Search className="absolute right-3 top-2.5 text-brand-300" />
</motion.div>



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
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full hover:bg-hover-bg-light"
                  >
                    <User />
                  </motion.button>
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
              <div className="flex mb-4">
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
                />
              </div>

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
          <Popover>
            <PopoverTrigger asChild>
              <motion.button
                className="flex items-center space-x-1 px-3 py-1 rounded-md text-white "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Categories</span>
                <ChevronDown size={16} />
              </motion.button>
            </PopoverTrigger>
            <PopoverContent className="w-[90vw] max-w-[600px] p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 bg-white rounded-md shadow-lg"
              >
                {Object.entries(allCategories).map(([category, subcategories]) => (
                  <div key={category} className="p-3 hover:bg-gray-100 rounded-md">
                    <h3 className="font-semibold text-brand-300">{category}</h3>
                    <ul className="mt-1 space-y-1">
                      {subcategories.map((sub) => (
                        <li key={sub} className="text-sm text-gray-600 hover:text-brand-300 cursor-pointer">
                          {sub}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            </PopoverContent>
          </Popover>

          {/* Main Categories */}
          {mainCategories.map((category) => (
            <motion.button
              key={category}
              className="px-3 py-1 rounded-md text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;