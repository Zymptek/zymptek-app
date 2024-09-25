"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductEditor } from '@/hooks/useProductEditor';
import { useToast } from '@/hooks/use-toast';
import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Trash2, ArrowLeft, Save, Edit3 } from 'lucide-react';

// Zod schema definitions
const pricingSchema = z.object({
  pricing: z.array(z.object({
    range: z.string().min(1, "Range is required"),
    price: z.number().min(0, "Price must be a positive number")
  }))
});

const variationSchema = z.object({
  variations: z.array(z.object({
    name: z.string().min(1, "Variation name is required"),
    values: z.string().min(1, "At least one value is required")
  }))
});

const attributeSchema = z.object({
  attributes: z.array(z.object({
    key: z.string().min(1, "Attribute name is required"),
    value: z.string().min(1, "Attribute value is required")
  }))
});

type PricingFormValues = z.infer<typeof pricingSchema>;
type VariationFormValues = z.infer<typeof variationSchema>;
type AttributeFormValues = z.infer<typeof attributeSchema>;

const ProductEditPage = () => {
  const { productId } = useParams();
  const router = useRouter();
  const { product, categoryAttributes, isLoading, updateProduct } = useProductEditor(productId as string);
  const { toast } = useToast();

  if (isLoading) {
    return <Loading />;
  }

  if (!product) {
    return <div className="text-center text-2xl mt-8 text-brand-300">Product not found</div>;
  }

  const handleUpdate = async (field: keyof typeof product, newData: any) => {
    try {
      await updateProduct(field, newData);
      toast({
        title: 'Product updated successfully',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Failed to update product',
        variant: 'destructive',
      });
      console.error('Error updating product:', error);
    }
  };

  // Pricing Section
  const PricingEditForm = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<PricingFormValues>({
      resolver: zodResolver(pricingSchema),
      defaultValues: {
        pricing: Object.entries(product.price || {}).map(([range, price]) => ({ range, price: Number(price) }))
      }
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "pricing"
    });

    const onSubmit = (data: PricingFormValues) => {
      const newPricing = data.pricing.reduce((acc, { range, price }) => {
        acc[range] = price;
        return acc;
      }, {} as Record<string, number>);
      handleUpdate('price', newPricing);
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <Controller
              name={`pricing.${index}.range`}
              control={control}
              render={({ field }) => (
                <div className="flex-1">
                  <Label htmlFor={`pricing.${index}.range`} className="text-brand-300">Range</Label>
                  <Input id={`pricing.${index}.range`} {...field} placeholder="e.g. 1-100" className="border-brand-200 focus:ring-brand-300" />
                </div>
              )}
            />
            <Controller
              name={`pricing.${index}.price`}
              control={control}
              render={({ field }) => (
                <div className="flex-1">
                  <Label htmlFor={`pricing.${index}.price`} className="text-brand-300">Price</Label>
                  <Input id={`pricing.${index}.price`} {...field} type="number" placeholder="0.00" className="border-brand-200 focus:ring-brand-300" />
                </div>
              )}
            />
            <Button type="button" variant="destructive" onClick={() => remove(index)} className="bg-red-500 hover:bg-red-600 mt-5">
              <Trash2 className="w-4 h-4 te" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => append({ range: '', price: 0 })} className="border-brand-200 text-brand-300 hover:bg-brand-100 mr-2">
          <PlusCircle className="w-4 h-4 mr-2" /> Add Price Range
        </Button>
        <Button type="submit" className="bg-brand-300 hover:bg-brand-400 text-white mr-2">
          <Save className="w-4 h-4 mr-2" /> Save Pricing
        </Button>
      </form>
    );
  };

  // Variations Section
  const VariationsEditForm = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<VariationFormValues>({
      resolver: zodResolver(variationSchema),
      defaultValues: {
        variations: Object.entries(product.variations || {}).map(([name, values]) => ({
          name,
          values: Array.isArray(values) ? values.join(', ') : values
        }))
      }
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "variations"
    });

    const onSubmit = (data: VariationFormValues) => {
      const newVariations = data.variations.reduce((acc, { name, values }) => {
        acc[name] = values.split(',').map(v => v.trim());
        return acc;
      }, {} as Record<string, string[]>);
      handleUpdate('variations', newVariations);
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="border-brand-200 mt-5">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Controller
                  name={`variations.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Label htmlFor={`variations.${index}.name`} className="text-brand-300">Variation Name</Label>
                      <Input id={`variations.${index}.name`} {...field} placeholder="e.g. Color, Size" className="border-brand-200 focus:ring-brand-300" />
                    </div>
                  )}
                />
                <Controller
                  name={`variations.${index}.values`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Label htmlFor={`variations.${index}.values`} className="text-brand-300">Values (comma-separated)</Label>
                      <Input id={`variations.${index}.values`} {...field} placeholder="e.g. Red, Blue, Green" className="border-brand-200 focus:ring-brand-300" />
                    </div>
                  )}
                />
                <Button type="button" variant="destructive" onClick={() => remove(index)} className="bg-red-500 hover:bg-red-600 text-white">
                  <Trash2 className="w-4 h-4 mr-2" /> Remove Variation
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button type="button" variant="outline" onClick={() => append({ name: '', values: '' })} className="border-brand-200 text-brand-300 hover:bg-brand-100 mr-2">
          <PlusCircle className="w-4 h-4 mr-2" /> Add Variation
        </Button>
        <Button type="submit" className="bg-brand-300 hover:bg-brand-400 text-white">
          <Save className="w-4 h-4 mr-2" /> Save Variations
        </Button>
      </form>
    );
  };

  // Attributes Section
  const AttributesEditForm = ({ attributeType, initialData }: { attributeType: string, initialData: Record<string, string | string[]> }) => {
    const { control, handleSubmit, formState: { errors } } = useForm<AttributeFormValues>({
      resolver: zodResolver(attributeSchema),
      defaultValues: {
        attributes: Object.entries(initialData).map(([key, value]) => ({
          key,
          value: Array.isArray(value) ? value.join(', ') : value
        }))
      }
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: "attributes"
    });

    const onSubmit = (data: AttributeFormValues) => {
      const newAttributes = data.attributes.reduce((acc, { key, value }) => {
        acc[key] = value.includes(',') ? value.split(',').map(v => v.trim()) : value;
        return acc;
      }, {} as Record<string, string | string[]>);
      handleUpdate(attributeType as keyof typeof product, newAttributes);
    };

    const isIndustrySpecific = attributeType === 'industry_specific_attributes';
    const isLeadTime = attributeType === 'lead_time';

    const getAttributeLabel = () => {
      switch (attributeType) {
        case 'lead_time': return 'Lead Time';
        case 'industry_specific_attributes': return 'Industry Attribute';
        case 'other_attributes': return 'Other Attribute';
        case 'packaging_and_delivery': return 'Packaging & Delivery';
        default: return 'Attribute';
      }
    };

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="border-brand-200 mt-5">
            <CardContent className="pt-6">
              <div className="space-y-2">
                {isIndustrySpecific ? (
                  <Controller
                    name={`attributes.${index}.key`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label htmlFor={`attributes.${index}.key`} className="text-brand-300">{getAttributeLabel()}</Label>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger 
                            id={`attributes.${index}.key`} 
                            className="border-brand-200 focus:ring-brand-300 hover:bg-brand-50 transition-colors duration-200"
                          >
                            <SelectValue placeholder={`Select ${getAttributeLabel()}`} />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-brand-200 rounded-md shadow-lg">
                            {categoryAttributes.map((attr) => (
                              <SelectItem 
                                key={attr.id} 
                                value={attr.attribute_name}
                                className="hover:bg-brand-100 transition-colors duration-200 cursor-pointer"
                              >
                                {attr.attribute_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                ) : isLeadTime ? (
                  <Controller
                    name={`attributes.${index}.key`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label htmlFor={`attributes.${index}.key`} className="text-brand-300">Quantity</Label>
                        <Input id={`attributes.${index}.key`} {...field} placeholder="Enter quantity" className="border-brand-200 focus:ring-brand-300" />
                      </div>
                    )}
                  />
                ) : (
                  <Controller
                    name={`attributes.${index}.key`}
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label htmlFor={`attributes.${index}.key`} className="text-brand-300">{getAttributeLabel()}</Label>
                        <Input id={`attributes.${index}.key`} {...field} placeholder={`Enter ${getAttributeLabel()}`} className="border-brand-200 focus:ring-brand-300" />
                      </div>
                    )}
                  />
                )}
                <Controller
                  name={`attributes.${index}.value`}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Label htmlFor={`attributes.${index}.value`} className="text-brand-300">{isLeadTime ? 'Delivery Time' : 'Value'}</Label>
                      <Input id={`attributes.${index}.value`} {...field} placeholder={isLeadTime ? "Enter delivery time" : "Enter value"} className="border-brand-200 focus:ring-brand-300" />
                    </div>
                  )}
                />
                <Button type="button" variant="destructive" onClick={() => remove(index)} className="bg-red-500 hover:bg-red-600 text-white">
                  <Trash2 className="w-4 h-4 mr-2" /> Remove {isLeadTime ? 'Lead Time' : 'Attribute'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button type="button" variant="outline" onClick={() => append({ key: '', value: '' })} className="border-brand-200 text-brand-300 hover:bg-brand-100 hover:text-white mr-2">
          <PlusCircle className="w-4 h-4 mr-2" /> Add {isLeadTime ? 'Lead Time' : 'Attribute'}
        </Button>
        <Button type="submit" className="bg-brand-300 hover:bg-brand-400 text-white">
          <Save className="w-4 h-4 mr-2" /> Save {getAttributeLabel()}
        </Button>
      </form>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-brand-400">{product.headline}</h1>
      <Separator className="my-6 bg-brand-200" />
      
      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-brand-200 text-text-dark">
          <TabsTrigger value="pricing" className="data-[state=active]:bg-brand-300 data-[state=active]:text-white">Pricing</TabsTrigger>
          <TabsTrigger value="variations" className="data-[state=active]:bg-brand-300 data-[state=active]:text-white">Variations</TabsTrigger>
          <TabsTrigger value="attributes" className="data-[state=active]:bg-brand-300 data-[state=active]:text-white">Attributes</TabsTrigger>
          <TabsTrigger value="packaging" className="data-[state=active]:bg-brand-300 data-[state=active]:text-white">Packaging</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing">
          <Card className="border-brand-300">
            <CardHeader className="bg-brand-300">
              <CardTitle className="text-text-dark">Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <PricingEditForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variations">
          <Card className="border-brand-300">
            <CardHeader className="bg-brand-300">
              <CardTitle className="text-text-dark">Variations</CardTitle>
            </CardHeader>
            <CardContent>
              <VariationsEditForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attributes">
          <Card className="border-brand-300">
            <CardHeader className="bg-brand-300">
              <CardTitle className="text-text-dark">Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="lead_time">
                <TabsList className="bg-brand-50">
                  <TabsTrigger value="lead_time" className="data-[state=active]:bg-brand-200 data-[state=active]:text-white">Lead Time</TabsTrigger>
                  <TabsTrigger value="industry_specific" className="data-[state=active]:bg-brand-200 data-[state=active]:text-white">Industry Specific</TabsTrigger>
                  <TabsTrigger value="other" className="data-[state=active]:bg-brand-200 data-[state=active]:text-white">Other</TabsTrigger>
                </TabsList>
                <TabsContent value="lead_time">
                  <AttributesEditForm attributeType="lead_time" initialData={product.lead_time || {}} />
                </TabsContent>
                <TabsContent value="industry_specific">
                  <AttributesEditForm attributeType="industry_specific_attributes" initialData={product.industry_specific_attributes || {}} />
                </TabsContent>
                <TabsContent value="other">
                  <AttributesEditForm attributeType="other_attributes" initialData={product.other_attributes || {}} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packaging">
          <Card className="border-brand-200">
            <CardHeader className="bg-brand-100">
              <CardTitle className="text-brand-400">Packaging and Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <AttributesEditForm attributeType="packaging_and_delivery" initialData={product.packaging_and_delivery || {}} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={() => router.push(`/product/${productId}`)} className="border-brand-200 text-brand-300 hover:bg-brand-100">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Product
        </Button>
        <Button onClick={() => router.push(`/product/${productId}`)} className="bg-brand-300 hover:bg-brand-400 text-white">
          <Edit3 className="w-4 h-4 mr-2" /> Finish Editing
        </Button>
      </div>
    </div>
  );
};

export default ProductEditPage;
