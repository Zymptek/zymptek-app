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
  const [validImageUrl, setValidImageUrl] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  // Default product image if no image is available or loading fails
  const defaultProductImage = 'https://via.placeholder.com/400x300?text=Product+Image';

  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryName) {
        setCategory({ id: product.category_id, name: categoryName, icon: '' } as Category);
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

  useEffect(() => {
    const checkImageUrl = async (url: string) => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
      } catch (error) {
        return false;
      }
    };

    const findValidImage = async () => {
      if (!product.image_urls || product.image_urls.length === 0) {
        setValidImageUrl(defaultProductImage);
        return;
      }

      for (const url of product.image_urls) {
        if (url && url.startsWith('http')) {
          const isValid = await checkImageUrl(url);
          if (isValid) {
            setValidImageUrl(url);
            return;
          }
        }
      }

      setValidImageUrl(defaultProductImage);
    };

    findValidImage();
  }, [product.image_urls]);

  const handleImageError = () => {
    setImageError(true);
    setValidImageUrl(defaultProductImage);
  };

  const truncateDescription = (description: string | null, maxLength: number) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength).trim() + '...';
  };

  // Extract pricing from the Json type
  const getPricing = (pricing: Json[] | null) => {
    if (!pricing || pricing.length === 0) return null;
    const firstPrice = pricing[0] as { price?: number };
    return firstPrice?.price;
  };

  // Extract shipping info from the Json type
  const getShippingInfo = (info: Json | null) => {
    if (!info) return null;
    const shippingInfo = info as { leadTime?: string };
    return shippingInfo?.leadTime;
  };

  const price = getPricing(product.pricing);
  const leadTime = getShippingInfo(product.shipping_info);

  // Show loading state while checking image
  if (!validImageUrl) {
    return <div className="animate-pulse bg-gray-200 rounded-xl h-full min-h-[300px]" />;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 h-full flex flex-col"
    >
      <Link href={`/products/${product.product_id}`} className="flex flex-col h-full">
        <div className="relative h-48 sm:h-56 md:h-64 lg:h-48 xl:h-56 w-full flex-shrink-0">
          <Image
            src={imageError ? defaultProductImage : validImageUrl}
            alt={product.headline || 'Product Image'}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            onError={handleImageError}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          {product.sample_available && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-green-500 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full">
              Sample Available
            </span>
          )}
          {product.is_featured && (
            <div className="absolute top-2 right-2 bg-brand-200 text-white px-2 py-1 rounded-full text-xs">
              Featured
            </div>
          )}
        </div>
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2 truncate">{product.headline}</h3>
          <div className="relative mb-2 sm:mb-3">
            <p className="text-xs sm:text-sm text-gray-600 h-8 sm:h-12 overflow-hidden">
              {truncateDescription(product.description, 70)}
            </p>
          </div>
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            {price && (
              <p className="text-lg sm:text-xl font-bold text-brand-300">
                ${price.toFixed(2)}
                {product.pricing && product.pricing.length > 1 && <span className="text-xs sm:text-sm ml-1">+</span>}
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
          {leadTime && (
            <div className="mt-2 text-sm text-brand-300">
              Lead Time: {leadTime}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
