"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Database, Json, Tables } from '@/lib/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Tag, Truck, Pencil, MoreHorizontal } from 'lucide-react';

type Category = Tables<'categories'>;
type Product = Tables<'products'>;

interface ProductCardProps {
  product: Product;
  categoryName?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, categoryName }) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [imageError, setImageError] = useState(false);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryName) {
        setCategory({ id: product.category_id, name: categoryName } as Category);
        return;
      }

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
  }, [product.category_id, categoryName, supabase]);

  const handleImageError = () => {
    setImageError(true);
  };

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength).trim() + '...';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 h-full flex flex-col"
    >
      <Link href={`/products/${product.product_id}`} className="flex flex-col h-full">
        <div className="relative h-48 sm:h-56 md:h-64 lg:h-48 xl:h-56 w-full flex-shrink-0">
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
              <span className="text-gray-400 text-sm sm:text-base lg:text-lg">Image not available</span>
            </div>
          )}
          {product.sample_available && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-green-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full">
              Sample Available
            </span>
          )}
        </div>
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2 truncate">{product.headline}</h3>
          <div className="relative mb-2 sm:mb-3">
            <p className="text-xs sm:text-sm text-gray-600 h-8 sm:h-12 overflow-hidden">
              {truncateDescription(product.description!, 70)}
            </p>
          </div>
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            {product.pricing && product.pricing.length > 0 && (
              <p className="text-lg sm:text-xl font-bold text-brand-300">
                ${(product.pricing[0] as { price: number }).price.toFixed(2)}
                {product.pricing.length > 1 && <span className="text-xs sm:text-sm ml-1">+</span>}
              </p>
            )}
            {product.moq && (
              <p className="text-xs font-semibold text-gray-700">MOQ: {product.moq} units</p>
            )}
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2 text-xs text-gray-600 mt-auto">
            {category && (
              <span className="bg-gray-100 px-1 sm:px-2 py-1 rounded-full flex items-center whitespace-nowrap overflow-hidden text-ellipsis max-w-[calc(100%-8px)]">
                <Tag className="mr-1 w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="truncate">{category.name}</span>
              </span>
            )}
            {product.customization && (
              <span className="bg-gray-100 px-1 sm:px-2 py-1 rounded-full flex items-center whitespace-nowrap">
                <Pencil className="mr-1 w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" /> Customizable
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
