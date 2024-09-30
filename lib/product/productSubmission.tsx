import { v4 as uuidv4 } from 'uuid';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ProductFormData } from '@/lib/schema/productSchema';
import { Tables } from '@/lib/database.types';

type Product = Tables<'products'>;

export const handleProductSubmit = async (
  data: ProductFormData,
  user: { id: string },
  toast: any
) => {
  const supabase = createClientComponentClient();

  try {
    const imageUrls = await uploadImages(data.images, user.id);

    const productData: Partial<Product> = {
      seller_id: user.id,
      headline: data.headline,
      category_id: data.category,
      pricing: data.pricing.map(({ minOrder, maxOrder, price }) => ({
        minOrder,
        maxOrder: maxOrder || null,
        price
      })),
      image_urls: imageUrls,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      variations: data.variations,
      specifications: data.specifications,
      packaging: data.packaging,
      shipping_info: data.shipping_info,
      customization: data.customization
    };

    const { error } = await supabase.from('products').insert(productData);

    if (error) throw error;

    toast({
      title: "Product Created",
      description: "Your product has been successfully created.",
      variant: "success",
    });

    return productData.product_id;
  } catch (error) {
    console.error('Error creating product:', error);
    toast({
      title: "Error",
      description: "Failed to create product. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

const uploadImages = async (images: ProductFormData['images'], userId: string): Promise<string[]> => {
  const supabase = createClientComponentClient();
  const uploadPromises = images.map(async (image) => {
    const fileExt = image.file.name.split('.').pop();
    const filePath = `${userId}/product-images/${uuidv4()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('company-images')
      .upload(filePath, image.file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('company-images')
      .getPublicUrl(filePath);

    return publicUrl;
  });

  return Promise.all(uploadPromises);
};