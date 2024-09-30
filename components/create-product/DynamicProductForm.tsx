import React, { useState } from 'react';
import { useForm, useFieldArray, Controller, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tables } from '@/lib/database.types';
import { ImageIcon, InfoIcon, DollarSignIcon, TrashIcon, PlusIcon, ListIcon, TagIcon, PackageIcon, TruckIcon, SettingsIcon, SendIcon } from 'lucide-react';
import { ProductSchema, type ProductFormData } from '@/lib/schema/productSchema';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

type Category = Tables<'categories'>;

export const DynamicProductForm = ({ categories, onSubmit }: { categories: Category[], onSubmit: (data: ProductFormData) => void }) => {
  const [uploadedImages, setUploadedImages] = useState<{ file: File, preview: string }[]>([]);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      pricing: [{ minOrder: 1, price: 0 }],
      images: [],
      variations: [],
      specifications: [],
      packaging: { size: { length: 0, width: 0, height: 0, unit: 'cm' }, weight: { value: 0, unit: 'kg' } },
      shipping_info: { leadTime: '', shippingMethods: [] },
      customization: { isAvailable: false }
    }
  });

  const { fields: pricingFields, append: appendPricing, remove: removePricing } = useFieldArray({
    control,
    name: "pricing"
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control,
    name: "specifications"
  });

  const { fields: variationFields, append: appendVariation, remove: removeVariation } = useFieldArray({
    control,
    name: "variations"
  });

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
    setValue('images', [...uploadedImages, ...newImages]);
  };

  const [customizationAvailable, setCustomizationAvailable] = useState(false);
  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <InfoIcon className="w-6 h-6 mr-2 text-brand-100" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="headline" className="block mb-2">Headline</Label>
            <Controller
              name="headline"
              control={control}
              defaultValue=""
              render={({ field }) => <Input {...field} id="headline" />}
            />
            {errors.headline && <p className="text-red-500 mt-1">{errors.headline.message}</p>}
          </div>
          <div>
            <Label htmlFor="category" className="block mb-2">Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='bg-white w-full'>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className='bg-white text-black cursor-pointer'>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="text-red-500 mt-1">{errors.category.message}</p>}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImageIcon className="w-6 h-6 mr-2 text-brand-100" />
            Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            id="images"
            type="file"
            multiple
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            onChange={handleImageUpload}
          />
          {uploadedImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img src={image.preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImages(prev => prev.filter((_, i) => i !== index));
                      setValue('images', uploadedImages.filter((_, i) => i !== index));
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.images && <p className="text-red-500 mt-1">{errors.images.message}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSignIcon className="w-6 h-6 mr-2 text-brand-100" />
            Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pricingFields.map((field, index) => (
            <div key={field.id} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
              <div className="w-full sm:w-1/3">
                <Controller
                  name={`pricing.${index}.minOrder`}
                  control={control}
                  render={({ field }) => <Input {...field} type="number" placeholder="Min Order" />}
                />
                {errors.pricing?.[index]?.minOrder && (
                  <p className="text-red-500 mt-1">{errors.pricing?.[index]?.minOrder?.message}</p>
                )}
              </div>
              <div className="w-full sm:w-1/3">
                <Controller
                  name={`pricing.${index}.maxOrder`}
                  control={control}
                  render={({ field }) => <Input {...field} type="number" placeholder="Max Order (optional)" />}
                />
                {errors.pricing?.[index]?.maxOrder && (
                  <p className="text-red-500 mt-1">{errors.pricing?.[index]?.maxOrder?.message}</p>
                )}
              </div>
              <div className="w-full sm:w-1/3">
                <Controller
                  name={`pricing.${index}.price`}
                  control={control}
                  render={({ field }) => <Input {...field} type="number" placeholder="Price" />}
                />
                {errors.pricing?.[index]?.price && (
                  <p className="text-red-500 mt-1">{errors.pricing?.[index]?.price?.message}</p>
                )}
              </div>
              <Button type="button" onClick={() => removePricing(index)} className="bg-red-500 hover:bg-red-600 w-full text-white sm:w-auto">
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => appendPricing({ minOrder: 1, price: 0 })} className="w-full sm:w-auto btn-outline">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Pricing Tier
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ListIcon className="w-6 h-6 mr-2 text-brand-100" />
            Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {specFields.map((field, index) => (
            <div key={field.id} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
              <div className="w-full sm:w-1/2">
                <Controller
                  name={`specifications.${index}.name`}
                  control={control}
                  render={({ field }) => <Input {...field} placeholder="Specification Name" />}
                />
                {errors.specifications?.[index]?.name && (
                  <p className="text-red-500 mt-1">{errors.specifications?.[index]?.name?.message}</p>
                )}
              </div>
              <div className="w-full sm:w-1/2">
                <Controller
                  name={`specifications.${index}.value`}
                  control={control}
                  render={({ field }) => <Input {...field} placeholder="Specification Value" />}
                />
                {errors.specifications?.[index]?.value && (
                  <p className="text-red-500 mt-1">{errors.specifications?.[index]?.value?.message}</p>
                )}
              </div>
              <Button type="button" onClick={() => removeSpec(index)} className="bg-red-500 hover:bg-red-600 w-full text-white sm:w-auto">
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => appendSpec({ name: '', value: '' })} className="w-full sm:w-auto btn-outline">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Specification
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TagIcon className="w-6 h-6 mr-2 text-brand-100" />
            Variations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {variationFields.map((field, index) => (
            <div key={field.id} className="mb-4">
              <Controller
                name={`variations.${index}.name`}
                control={control}
                render={({ field }) => (
                  <>
                    <Input {...field} placeholder="Variation Name" className="mb-2 w-full" />
                    {errors.variations?.[index]?.name && (
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
                    <Input {...field} placeholder="Options (comma-separated)" className="mb-2 w-full" />
                    {errors.variations?.[index]?.options && (
                      <p className="text-red-500 mt-1">{errors.variations?.[index]?.options?.message}</p>
                    )}
                  </>
                )}
              />
              <Button type="button" onClick={() => removeVariation(index)} className="bg-red-500 hover:bg-red-600 w-full text-white sm:w-auto">
                <TrashIcon className="w-4 h-4 mr-2" />
                Remove Variation
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => appendVariation({ name: '', options: [] })} className="w-full sm:w-auto btn-outline">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Variation
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PackageIcon className="w-6 h-6 mr-2 text-brand-100" />
            Packaging
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Controller
            name="packaging.unit"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor="packagingUnit" className="block mb-2">Packaging Unit</Label>
                <Input {...field} id="packagingUnit" placeholder="e.g., Box, Carton" />
                {errors.packaging?.unit && (
                  <p className="text-red-500 mt-1">{errors.packaging.unit.message}</p>
                )}
              </div>
            )}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="packaging.size.length"
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor="length" className="block mb-2">Length</Label>
                  <Input {...field} id="length" type="number" />
                  {errors.packaging?.size?.length && (
                    <p className="text-red-500 mt-1">{errors.packaging.size.length.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              name="packaging.size.width"
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor="width" className="block mb-2">Width</Label>
                  <Input {...field} id="width" type="number" />
                  {errors.packaging?.size?.width && (
                    <p className="text-red-500 mt-1">{errors.packaging.size.width.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              name="packaging.size.height"
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor="height" className="block mb-2">Height</Label>
                  <Input {...field} id="height" type="number" />
                  {errors.packaging?.size?.height && (
                    <p className="text-red-500 mt-1">{errors.packaging.size.height.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              name="packaging.size.unit"
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor="sizeUnit" className="block mb-2">Unit</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="sizeUnit" className='bg-white text-black w-full'>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className='bg-white text-black cursor-pointer'>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="inch">inch</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.packaging?.size?.unit && (
                    <p className="text-red-500 mt-1">{errors.packaging.size.unit.message}</p>
                  )}
                </div>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="packaging.weight.value"
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor="weight" className="block mb-2">Weight</Label>
                  <Input {...field} id="weight" type="number" />
                  {errors.packaging?.weight?.value && (
                    <p className="text-red-500 mt-1">{errors.packaging.weight.value.message}</p>
                  )}
                </div>
              )}
            />
            <Controller
              name="packaging.weight.unit"
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor="weightUnit" className="block mb-2">Unit</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="weightUnit" className='bg-white text-black w-full'>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className='bg-white text-black cursor-pointer'>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lb">lb</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.packaging?.weight?.unit && (
                    <p className="text-red-500 mt-1">{errors.packaging.weight.unit.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TruckIcon className="w-6 h-6 mr-2 text-brand-100" />
            Shipping Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Controller
            name="shipping_info.leadTime"
            control={control}
            render={({ field }) => (
              <div>
                <Label htmlFor="leadTime" className="block mb-2">Lead Time</Label>
                <Input {...field} id="leadTime" placeholder="e.g., 3-5 days" />
                {errors.shipping_info?.leadTime && (
                  <p className="text-red-500 mt-1">{errors.shipping_info.leadTime.message}</p>
                )}
              </div>
            )}
          />
          <div>
            <Label className="block mb-2">Shipping Methods</Label>
            {['Sea Freight', 'Air Freight', 'Express Delivery', 'Land Transportation'].map((method) => (
              <div key={method} className="flex items-center space-x-2 mb-2">
                <Controller
                  name="shipping_info.shippingMethods"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      className='cursor-pointer bg-white text-black'
                      id={`shippingMethod-${method}`}
                      checked={field.value?.includes(method)}
                      onCheckedChange={(checked) => {
                        const updatedMethods = checked
                          ? [...field.value, method]
                          : field.value.filter((value: string) => value !== method);
                        field.onChange(updatedMethods);
                      }}
                    />
                  )}
                />
                <Label htmlFor={`shippingMethod-${method}`}>{method}</Label>
              </div>
            ))}
            {errors.shipping_info?.shippingMethods && (
              <p className="text-red-500 mt-1">{errors.shipping_info.shippingMethods.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="w-6 h-6 mr-2 text-brand-100" />
            Customization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Controller
              name="customization.isAvailable"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="customizationAvailable"
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setCustomizationAvailable(checked as boolean);
                  }}
                />
              )}
            />
            <Label htmlFor="customizationAvailable">Customization Available</Label>
          </div>
          {customizationAvailable && (
            <Controller
              name="customization.options"
              control={control}
              render={({ field }) => (
                <div>
                  <Label htmlFor="customizationOptions" className="block mb-2">Customization Options (comma-separated)</Label>
                  <Input 
                    {...field} 
                    id="customizationOptions" 
                    placeholder="e.g., Logo printing, Custom packaging"
                    value={field.value ? field.value.join(', ') : ''}
                    onChange={(e) => {
                      const options = e.target.value.split(',').map(option => option.trim());
                      field.onChange(options);
                    }}
                  />
                  {errors.customization?.options && (
                    <p className="text-red-500 mt-1">{errors.customization.options.message}</p>
                  )}
                </div>
              )}
            />
          )}
        </CardContent>
      </Card>
      <Button type="submit" className="w-full btn-primary cursor-pointer">
        <SendIcon className="w-5 h-5 mr-2" />
        Submit Product
      </Button>
    </form>
  );
};
export default DynamicProductForm;