"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Database } from '@/lib/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Tag, Truck, Pencil } from 'lucide-react';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [imageError, setImageError] = useState(false);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchCategory = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', product.category_id)
        .single();

      if (error) {
        console.error('Error fetching category:', error);
      } else {
        setCategory(data);
      }
    };

    fetchCategory();
  }, [product.category_id, supabase]);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200"
    >
      <Link href={`/product/${product.product_id}`}>
        <div className="relative h-56 w-full">
          {!imageError ? (
            <Image
              src={product.image_urls[0]}
              alt={product.headline}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-105"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-lg">Image not available</span>
            </div>
          )}
          {product.sample_available && (
            <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Sample Available
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{product.headline}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center mb-3">
            {product.pricing && product.pricing.length > 0 && (
              <p className="text-2xl font-bold text-brand-300">
                ${(product.pricing[0] as { price: number }).price.toFixed(2)}
                {product.pricing.length > 1 && <span className="text-sm ml-1">+</span>}
              </p>
            )}
            {product.moq && (
              <p className="text-sm font-semibold text-gray-700">MOQ: {product.moq} units</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            {category && (
              <span className="bg-gray-100 px-2 py-1 rounded-full flex items-center">
                <Tag className="mr-1" /> {category.name}
              </span>
            )}
            {product.customization && (
              <span className="bg-gray-100 px-2 py-1 rounded-full flex items-center">
                <Pencil className="mr-1" /> Customizable
              </span>
            )}
            {product.shipping_terms && (
              <span className="bg-gray-100 px-2 py-1 rounded-full flex items-center">
                <Truck className="mr-1" /> {product.shipping_terms}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
