import { SupabaseClient } from '@supabase/supabase-js';

export const updateProductData = async (
  supabase: SupabaseClient,
  productId: string,
  updateData: Record<string, any>
) => {
  return await supabase
    .from('products')
    .update(updateData)
    .eq('product_id', productId);
};