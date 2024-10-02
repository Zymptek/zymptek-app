import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Tables } from '@/lib/database.types';
import { updateProductData } from '@/lib/product/ProductEditor';
import { v4 as uuidv4 } from 'uuid';

export type Product = Tables<"products"> & {
  pricing: { minOrder: number; maxOrder: number; price: number }[];
  variations: { name: string; options: string[] }[];
  specifications: { name: string; value: string }[];
  packaging: { unit: string; size: { height: number; width: number; length: number; unit: string }; weight: { value: number; unit: string } };
  shipping_info: { leadTime: string; shippingMethods: string[] };
  customization: { isAvailable: boolean; options?: string[] };
};

export type CategoryAttribute = {
  id: string;
  attribute_name: string;
  field_type: string;
};

export const useProductEditor = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [categoryAttributes, setCategoryAttributes] = useState<CategoryAttribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
          .eq('product_id', productId)
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

  const handleImageUpdate = async (newImages: File[], imagesToKeep: string[]) => {
    if (!product) return;
    setIsUploading(true);
    setError(null);
    try {
      if (newImages.length + imagesToKeep.length === 0) {
        throw new Error('At least one image is required');
      }

      if (newImages.length + imagesToKeep.length > 5) {
        throw new Error('Maximum 5 images allowed');
      }

      // Upload new images
      const uploadPromises = newImages.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${product.seller_id}/product-images/${uuidv4()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('company-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('company-images')
          .getPublicUrl(filePath);

        return publicUrl;
      });
      const newImageUrls = await Promise.all(uploadPromises);

      // Determine which images to remove
      const imagesToRemove = product.image_urls.filter(url => !imagesToKeep.includes(url));

      // Remove images that are no longer needed
      const removePromises = imagesToRemove.map(url => {
        const path = url.split('/').slice(-2).join('/');
        return supabase.storage.from('company-images').remove([path]);
      });
      await Promise.all(removePromises);

      // Update product with new image URLs
      const updatedImageUrls = [...imagesToKeep, ...newImageUrls];
      await updateProduct('image_urls', updatedImageUrls);

      // Update the local state
      setProduct(prevProduct => ({
        ...prevProduct!,
        image_urls: updatedImageUrls,
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating images');
      console.error('Error updating images:', err);
      throw err; // Rethrow the error so it can be caught in the component
    } finally {
      setIsUploading(false);
    }
  };

  return { product, categoryAttributes, isLoading, isUploading, error, updateProduct, handleImageUpdate };
};