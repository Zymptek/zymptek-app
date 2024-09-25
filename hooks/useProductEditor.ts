import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Tables } from '@/lib/database.types';
import { updateProductData } from '@/lib/product/ProductEditor';

type Product = Tables<"products"> & {
  lead_time?: Record<string, string>;
  price?: Record<string, number>;
  industry_specific_attributes?: Record<string, string>;
  other_attributes?: Record<string, string | string[]>;
  packaging_and_delivery?: Record<string, string>;
  variations?: Record<string, string | string[]>;
};

export type CategoryAttribute = {
  id: number;
  attribute_name: string;
  field_type: string;
};

export const useProductEditor = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [categoryAttributes, setCategoryAttributes] = useState<CategoryAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchProductAndAttributes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (productError) throw productError;
        setProduct(productData as Product);

        // Fetch category-specific attributes
        const { data: attributesData, error: attributesError } = await supabase
          .from('categoryattributes')
          .select(`
            attributes (
              id,
              attribute_name,
              field_type
            )
          `)
          .eq('category_id', productData.category_id);

        if (attributesError) throw attributesError;
        // Flatten the result
        const flattenedAttributes = attributesData.map(item => item.attributes).flat();
        setCategoryAttributes(flattenedAttributes);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching product and attributes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProductAndAttributes();
    }
  }, [productId]);

  const updateProduct = async (field: keyof Product, newData: any) => {
    if (!product) return;
    setError(null);
    try {
      const { error } = await updateProductData(supabase, productId, { [field]: newData });
      if (error) throw error;
      setProduct(prevProduct => ({
        ...prevProduct!,
        [field]: newData,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating the product');
      console.error('Error updating product:', err);
      throw err;
    }
  };

  return { product, categoryAttributes, isLoading, error, updateProduct };
};