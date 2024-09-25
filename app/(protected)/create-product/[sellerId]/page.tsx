'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Tables } from '@/lib/database.types';
import { Loading } from '@/components/Loading';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const MAX_FILE_SIZE = 300 * 1024; // 300KB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGES = 3;

type Category = Tables<'categories'>;

const resizeImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 500;
        canvas.height = 500;
        ctx?.drawImage(img, 0, 0, 500, 500);
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          }
        }, file.type);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

const validateAndResizeImages = async (fileList: FileList): Promise<{ valid: File[], errors: string[] }> => {
  const valid: File[] = [];
  const errors: string[] = [];

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      errors.push(`${file.name} is not a supported image type.`);
    } else if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name} exceeds the maximum file size of 5MB.`);
    } else if (valid.length < MAX_IMAGES) {
      const resizedFile = await resizeImage(file);
      valid.push(resizedFile);
    } else {
      errors.push(`Maximum of ${MAX_IMAGES} images allowed.`);
      break;
    }
  }

  return { valid, errors };
};


const productSchema = z.object({
  headline: z.string().min(1, 'Headline is required').max(100, 'Headline must be 100 characters or less'),
  category: z.string().min(1, 'Category is required'),
  
  images: z.instanceof(FileList).refine((files) => files.length > 0, 'At least one image is required')
  .refine((files) => files.length > 0, 'At least one image is required')
  .refine((files) => files.length <= MAX_IMAGES, `Maximum of ${MAX_IMAGES} images allowed`)
    .refine(
      (files) => Array.from(files).every((file) => ALLOWED_FILE_TYPES.includes(file.type)),
      'Only JPG, PNG, and WebP images are allowed'
    )
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `Each image must be 250KB or less`
    ),
})

type ProductFormData = z.infer<typeof productSchema>


const CreateProductPage = ({ params }: { params: { sellerId: string } }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[] | null>([]);
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const {

    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema)
  });

  const watchImages = watch('images');

  useEffect(() => {
    if (watchImages && watchImages.length > 0) {
      const fileUrls = Array.from(watchImages).map((file) => URL.createObjectURL(file));
      setPreviewImages(fileUrls);

      return () => fileUrls.forEach(URL.revokeObjectURL);
    }
  }, [watchImages]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data);
    
    }

    fetchCategories();
  }, [supabase]);

  const onSubmit = useCallback(async (data: ProductFormData) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to create a product.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { valid: validImages, errors: imageErrors } = await validateAndResizeImages(data.images);

      if (imageErrors.length > 0) {
        imageErrors.forEach((error) => {
          toast({
            variant: "destructive",
            title: "Image Error",
            description: error,
          });
        });
        return;
      }

      const imageUrls = await Promise.all(
        validImages.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/product-images/${uuidv4()}.${fileExt}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('company-images')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('company-images')
            .getPublicUrl(fileName);

          return publicUrl;
        })
      );

      console.log(data, imageUrls)

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        seller_id: user.id,
        headline: data.headline,
        category_id: data.category,
        image_urls: imageUrls
      })
      .select()
      .single();

    if (error) throw error;

      toast({
        title: "Product Created",
        description: "Your product has been successfully created.",
      });

      router.push(`/product/${product.id}`);
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create product. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase, router, toast]);

  if (!user || user.id !== params.sellerId) {
    return <div>Unauthorized</div>;
  }

  if (!categories) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-2xl mx-auto bg-background-light border-2 border-brand-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-brand-200 to-brand-300 text-text-dark">
            <CardTitle className="text-3xl font-bold">Create New Product</CardTitle>
            <CardDescription className="text-accent-100">Fill in the details of your new product</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <label htmlFor="headline" className="block text-sm font-medium text-brand-200 mb-1">Product Headline</label>
                <Input
                  id="headline"
                  placeholder="Enter Headline for your product"
                  className="w-full border-brand-300 focus:ring-brand-200 focus:border-brand-200"
                  {...register('headline', { required: 'Product name is required' })}
                />
                {errors.headline && (
                    <p className="text-brand-200 text-sm mt-1">{errors.headline.message}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <label htmlFor="category" className="block text-sm font-medium text-brand-200 mb-1">Category</label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full border-brand-300 focus:ring-brand-200 focus:border-brand-200 justify-between"
        >
          {value
            ? categories.find((category) => category.id === value)?.name
            : "Select category..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-background-light">
                    <Command className="w-full border-brand-300 focus:ring-brand-200 focus:border-brand-200">
                      <CommandInput placeholder="Search categories..." />
                      <CommandList className="max-h-[100px] overflow-y-auto w-full">
                        <CommandEmpty>No categories found.</CommandEmpty>
                        <CommandGroup>
                          {categories?.map((category) => (
                            <CommandItem
                              key={category.id}
                              onSelect={() => {
                                setValue(category.id);
                                field.onChange(category.id);
                                setOpen(false);
                              }}
                              className='w-full cursor-pointer'
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  value === category.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {category.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                    </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.category && (
                  <p className="text-brand-200 text-sm mt-1">{errors.category.message}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <label htmlFor="images" className="block text-sm font-medium text-brand-200 mb-1">Product Images</label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full border-brand-300 focus:ring-brand-200 focus:border-brand-200"
                  {...register('images', {
                    required: 'At least one image is required',
                  })}
                />
                {errors.images && (
                  <p className="text-brand-200 text-sm mt-1">{errors.images.message}</p>
                )}
                {previewImages.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {previewImages.map((preview, index) => (

                      <div key={index} className="relative">
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-24 h-24 object-cover rounded-md" />
                        <button
                          type="button"
                          onClick={() => {
                            const newPreviewImages = [...previewImages];
                            newPreviewImages.splice(index, 1);
                            setPreviewImages(newPreviewImages);
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          aria-label="Remove image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Product'}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateProductPage;