"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductEditor } from '@/hooks/useProductEditor';
import { useToast } from '@/hooks/use-toast';
import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, Controller, useFieldArray, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Plus, Trash, Upload, X } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as z from 'zod';

// Define a new schema for product editing
const EditProductSchema = z.object({
  headline: z.string().min(1, 'Headline is required').max(100, 'Headline must be 100 characters or less'),
  images: z.array(z.object({
    file: z.instanceof(File).optional(),
    preview: z.string().url(),
  })).min(1, 'At least one image is required').max(5, 'Maximum 5 images allowed'),
  pricing: z.array(z.object({
    minOrder: z.coerce.number().min(1, "Minimum order must be at least 1"),
    maxOrder: z.coerce.number().optional(),
    price: z.coerce.number().min(0.01, "Price must be greater than 0")
  })).min(1, "At least one pricing tier is required"),
  specifications: z.array(z.object({
    name: z.string().min(1, "Specification name is required"),
    value: z.string().min(1, "Specification value is required")
  })),
  variations: z.array(z.object({
    name: z.string().min(1, "Variation name is required"),
    options: z.union([
      z.string().min(1, "At least one option is required"),
      z.array(z.string()).min(1, "At least one option is required")
    ]).transform(val => Array.isArray(val) ? val : val.split(',').map(v => v.trim()).filter(Boolean))
  })).optional(),
  packaging: z.object({
    unit: z.string().min(1, "Packaging unit is required"),
    size: z.object({
      length: z.coerce.number().min(0, "Length must be a non-negative number"),
      width: z.coerce.number().min(0, "Width must be a non-negative number"),
      height: z.coerce.number().min(0, "Height must be a non-negative number"),
      unit: z.string().min(1, "Unit is required")
    }),
    weight: z.object({
      value: z.coerce.number().min(0, "Weight must be a non-negative number"),
      unit: z.string().min(1, "Unit is required")
    })
  }),
  shipping_info: z.object({
    leadTime: z.string().min(1, "Lead time is required"),
    shippingMethods: z.array(z.string()).min(1, "At least one shipping method is required")
  }),
});

type EditProductFormData = z.infer<typeof EditProductSchema>;

const ProductEditPage = () => {
  const { productId } = useParams();
  const router = useRouter();
  const { product, isLoading, updateProduct, handleImageUpdate } = useProductEditor(productId as string);
  const { toast } = useToast();

  const { control, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<EditProductFormData>({
    resolver: zodResolver(EditProductSchema),
    defaultValues: {
      headline: '',
      images: [] as { preview: string; file?: File }[],
      pricing: [{ minOrder: 1, price: 0 }],
      packaging: { size: { length: 0, width: 0, height: 0, unit: 'cm' }, weight: { value: 0, unit: 'kg' } },
      shipping_info: {
        leadTime: '',
        shippingMethods: []
      },
      specifications: [],
      variations: []
    }
  });

  const images = watch('images');

  useEffect(() => {
    if (product) {
      reset({
        headline: product.headline || '',
        images: product.image_urls?.map(url => ({ preview: url })) || [],
        pricing: product.pricing || [{ minOrder: 1, price: 0 }],
        packaging: product.packaging || { size: { length: 0, width: 0, height: 0, unit: 'cm' }, weight: { value: 0, unit: 'kg' } },
        shipping_info: product.shipping_info || {
          leadTime: '',
          shippingMethods: []
        },
        specifications: product.specifications || [],
        variations: product.variations?.map(v => ({
          name: v.name,
          options: Array.isArray(v.options) ? v.options : [v.options]
        })) || []
      });
    }
  }, [product, reset]);

  const { fields: pricingFields, append: appendPricing, remove: removePricing } = useFieldArray({
    control,
    name: "pricing",
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control,
    name: "specifications",
  });

  const { fields: variationFields, append: appendVariation, remove: removeVariation } = useFieldArray({
    control,
    name: "variations",
  });

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    const updatedImages = [...images, ...newImages].slice(0, 5);
    
    if (updatedImages.length > 5) {
      toast({
        title: 'Maximum 5 images allowed',
        variant: 'destructive',
      });
    }
    
    setValue('images', updatedImages, { shouldValidate: true });
  }, [images, setValue, toast]);

  const removeImage = useCallback((index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setValue('images', updatedImages, { shouldValidate: true });
  }, [images, setValue]);

  if (isLoading) {
    return <Loading />;
  }

  if (!product) {
    return <div className="text-center text-2xl mt-8 text-brand-300">Product not found</div>;
  }

  const onSubmit = async (data: EditProductFormData) => {
    try {
      await updateProduct('headline', data.headline);
      await updateProduct('pricing', data.pricing);
      await updateProduct('specifications', data.specifications);
      await updateProduct('variations', data.variations?.map(v => ({
        ...v,
        options: Array.isArray(v.options) ? v.options : (v.options as string).split(',').map(o => o.trim()).filter(Boolean)
      })));
      await updateProduct('shipping_info', data.shipping_info);
      await updateProduct('packaging', data.packaging);

      // Handle image updates
      const newImages = data.images.filter(img => img.file).map(img => img.file as File);
      const oldImageUrls = data.images.filter(img => !img.file).map(img => img.preview);

      await handleImageUpdate(newImages, oldImageUrls);

      toast({
        title: 'Product updated successfully',
        variant: 'default',
      });
      router.push(`/product/${productId}`);
    } catch (error) {
      toast({
        title: 'Failed to update product',
        variant: 'destructive',
      });
      console.error('Error updating product:', error);
    }
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-background-light">
      <h1 className="text-2xl font-bold mb-6 text-brand-400">{product.headline}</h1>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 bg-brand-200 text-text-dark">
            <TabsTrigger value="basic" className="data-[state=active]:bg-brand-300 data-[state=active]:text-white">Basic Info</TabsTrigger>
            <TabsTrigger value="images" className="data-[state=active]:bg-brand-300 data-[state=active]:text-white">Images</TabsTrigger>
            <TabsTrigger value="pricing" className="data-[state=active]:bg-brand-300 data-[state=active]:text-white">Pricing</TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-brand-300 data-[state=active]:text-white">Product Details</TabsTrigger>
            <TabsTrigger value="shipping" className="data-[state=active]:bg-brand-300 data-[state=active]:text-white">Shipping & Packaging</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="headline">Headline</Label>
                  <Controller
                    name="headline"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                  {errors.headline && <p className="text-red-500">{errors.headline.message}</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Add up to 5 images for your product. At least one image is required.</CardDescription>
              </CardHeader>
              <CardContent>
                <Controller
                  name="images"
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {field.value.map((image, index) => (
                          <div key={index} className="relative">
                            <img src={image.preview} alt={`Product ${index + 1}`} className="w-full h-full object-cover rounded" />
                            <Button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      {field.value.length < 5 && (
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="mt-4"
                        />
                      )}
                    </>
                  )}
                />
                {errors.images && <p className="text-red-500 mt-2">{errors.images.message}</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                {pricingFields.map((field, index) => (
                  <div key={field.id} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
                    <Controller
                      name={`pricing.${index}.minOrder`}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} type="number" placeholder="Min Order" className="w-full sm:w-auto" />
                      )}
                    />
                    <Controller
                      name={`pricing.${index}.maxOrder`}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} type="number" placeholder="Max Order (optional)" className="w-full sm:w-auto" />
                      )}
                    />
                    <Controller
                      name={`pricing.${index}.price`}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} type="number" step="0.01" placeholder="Price" className="w-full sm:w-auto" />
                      )}
                    />
                    <Button type="button" variant="destructive" onClick={() => removePricing(index)} className="w-full sm:w-auto">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => appendPricing({ minOrder: 1, maxOrder: undefined, price: 0 })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Pricing Tier
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="specifications">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="specifications" className="data-[state=active]:bg-brand-300 data-[state=active]:text-white">Specifications</TabsTrigger>
                    <TabsTrigger value="variations" className="data-[state=active]:bg-brand-300 data-[state=active]:text-white">Variations</TabsTrigger>
                  </TabsList>
                  <TabsContent value="specifications">
                    {specFields.map((field, index) => (
                      <div key={field.id} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
                        <Controller
                          name={`specifications.${index}.name`}
                          control={control}
                          render={({ field }) => (
                            <Input {...field} placeholder="Specification name" className="w-full sm:w-auto" />
                          )}
                        />
                        <Controller
                          name={`specifications.${index}.value`}
                          control={control}
                          render={({ field }) => (
                            <Input {...field} placeholder="Specification value" className="w-full sm:w-auto" />
                          )}
                        />
                        <Button type="button" variant="destructive" onClick={() => removeSpec(index)} className="w-full sm:w-auto">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" onClick={() => appendSpec({ name: '', value: '' })}>
                      <Plus className="h-4 w-4 mr-2" /> Add Specification
                    </Button>
                  </TabsContent>
                  <TabsContent value="variations">
                    {variationFields.map((field, index) => (
                      <div key={field.id} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
                        <Controller
                          name={`variations.${index}.name`}
                          control={control}
                          render={({ field }) => (
                            <>
                              <Input {...field} placeholder="Variation Name" className="mb-2 w-full" />
                              {errors?.variations?.[index]?.name && (
                                <p className="text-red-500 mt-1">{errors.variations?.[index]?.name?.message}</p>
                              )}
                            </>
                          )}
                        />
                        <Controller
                          name={`variations.${index}.options`}
                          control={control}
                          render={({ field }) => (
                            <>
                              <Input 
                                {...field} 
                                placeholder="Options (comma-separated)" 
                                className="mb-2 w-full"
                                value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                              {errors.variations?.[index]?.options && (
                                <p className="text-red-500 mt-1">{errors.variations?.[index]?.options?.message}</p>
                              )}
                            </>
                          )}
                        />
                        <Button type="button" variant="destructive" onClick={() => removeVariation(index)} className="w-full sm:w-auto">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" onClick={() => appendVariation({ name: '', options: [] })}>
                      <Plus className="h-4 w-4 mr-2" /> Add Variation
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle>Shipping & Packaging</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="leadTime">Lead Time</Label>
                    <Controller
                      name="shipping_info.leadTime"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="e.g., 3-5 days" />}
                    />
                  </div>
                  <div>
                    <Label>Shipping Methods</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {['Sea Freight', 'Air Freight', 'Express Delivery', 'Land Transportation'].map((method) => (
                        <div key={method} className="flex items-center space-x-2">
                          <Controller
                            name="shipping_info.shippingMethods"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                checked={field.value?.includes(method)}
                                className="bg-white text-text-light"
                                onCheckedChange={(checked) => {
                                  const updatedMethods = checked
                                    ? [...field.value, method]
                                    : field.value.filter((value) => value !== method);
                                  field.onChange(updatedMethods);
                                }}
                              />
                            )}
                          />
                          <Label htmlFor={`shippingMethod-${method}`}>{method}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="packagingUnit">Packaging Unit</Label>
                    <Controller
                      name="packaging.unit"
                      control={control}
                      render={({ field }) => <Input {...field} placeholder="e.g., Box, Carton" />}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="packagingLength">Length</Label>
                      <Controller
                        name="packaging.size.length"
                        control={control}
                        render={({ field }) => <Input {...field} type="number" min="0" step="0.01" />}
                      />
                    </div>
                    <div>
                      <Label htmlFor="packagingWidth">Width</Label>
                      <Controller
                        name="packaging.size.width"
                        control={control}
                        render={({ field }) => <Input {...field} type="number" min="0" step="0.01" />}
                      />
                    </div>
                    <div>
                      <Label htmlFor="packagingHeight">Height</Label>
                      <Controller
                        name="packaging.size.height"
                        control={control}
                        render={({ field }) => <Input {...field} type="number" min="0" step="0.01" />}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="packagingSizeUnit">Size Unit</Label>
                    <Controller
                      name="packaging.size.unit"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="bg-white text-text-light">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent className="bg-white text-text-light">
                            <SelectItem value="cm">cm</SelectItem>
                            <SelectItem value="inch">inch</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="packagingWeight">Weight</Label>
                      <Controller
                        name="packaging.weight.value"
                        control={control}
                        render={({ field }) => <Input {...field} type="number" min="0" step="0.01" />}
                      />
                    </div>
                    <div>
                      <Label htmlFor="packagingWeightUnit">Weight Unit</Label>
                      <Controller
                        name="packaging.weight.unit"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="bg-white text-text-light">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-text-light">
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="lb">lb</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="mt-8 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
          <Button variant="outline" onClick={() => router.push(`/product/${productId}`)} className="border-brand-200 text-brand-300 hover:bg-brand-100 w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Product
          </Button>
          <Button type="submit" className="bg-brand-300 hover:bg-brand-400 text-white w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditPage;