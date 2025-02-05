import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './database.types';

export const uploadObject = async (
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string | null; error: Error | null }> => {
  const supabase = createClientComponentClient<Database>();
  try {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Upload error:', error);
    return { url: null, error: error instanceof Error ? error : new Error('Upload failed') };
  }
};

export const deleteObject = async (url: string): Promise<boolean> => {
  const supabase = createClientComponentClient<Database>();
  try {
    // Extract path from public URL
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
    
    if (!pathMatch) {
      throw new Error('Invalid storage URL format');
    }

    const [, bucket, path] = pathMatch;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}; 