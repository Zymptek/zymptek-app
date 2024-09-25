"use client"

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Edit, Plus, Minus } from 'lucide-react';
import { Category, Attribute, CategoryWithAttributes } from './types';
import * as API from '@/app/(admin)/attributes/action';
import Select from 'react-select';

type OptionType = {
  value: string;
  label: string;
};

const attributeSchema = z.object({
  attribute_name: z.string().min(1, { message: "Attribute name is required" }),
  field_type: z
    .object({
      value: z.string().min(1, { message: "Field type is required" }),
      label: z.string(), // Optionally, you can also validate the label if needed
    })
    .refine((data) => data.value !== '', {
      message: "Field type is required",
    }),
});

const categorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});

const fieldTypes: OptionType[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'select', label: 'Select' },
];

const AttributesCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithAttributes[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);

  const attributeForm = useForm({
    resolver: zodResolver(attributeSchema),
    defaultValues: { attribute_name: '', field_type: 'text' },
  });

  const categoryForm = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedCategories, fetchedAttributes] = await Promise.all([
        API.fetchCategoriesWithAttributes(),
        API.fetchAttributes(),
      ]);
      setCategories(fetchedCategories);
      setAttributes(fetchedAttributes);
    } catch (err) {
      console.log(err)
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onAttributeSubmit = async (data: any) => {
    try {
      const newAttribute = await API.createAttribute(data.attribute_name, data.field_type.value);
      setAttributes([...attributes, newAttribute]);
      attributeForm.reset();
    } catch (err) {
      setError('Failed to create attribute. Please try again.');
    }
  };

  const onCategorySubmit = async (data: z.infer<typeof categorySchema>) => {
    try {
      const newCategory = await API.createCategory(data.name);
      setCategories([...categories, { ...newCategory, attributes: [] }]);
      categoryForm.reset();
    } catch (err) {
      setError('Failed to create category. Please try again.');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    categoryForm.setValue('name', category.name);
  };

  const handleUpdateCategory = async (data: z.infer<typeof categorySchema>) => {
    if (!editingCategory) return;
    try {
      const updatedCategory = await API.updateCategory(editingCategory.id, data.name);
      setCategories(categories.map(c => c.id === updatedCategory.id ? { ...c, ...updatedCategory } : c));
      setEditingCategory(null);
      categoryForm.reset();
    } catch (err) {
      setError('Failed to update category. Please try again.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await API.deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      setError('Failed to delete category. Please try again.');
    }
  };

  const handleEditAttribute = (attribute: Attribute) => {
    setEditingAttribute(attribute);
    attributeForm.setValue('attribute_name', attribute.attribute_name);
    attributeForm.setValue('field_type', attribute.field_type);
  };

  const handleUpdateAttribute = async (data: any) => {
    if (!editingAttribute) return;
    try {
      const updatedAttribute = await API.updateAttribute(editingAttribute.id, data.attribute_name, data.field_type.value);
      setAttributes(attributes.map(a => a.id === updatedAttribute.id ? updatedAttribute : a));
      setEditingAttribute(null);
      attributeForm.reset();
    } catch (err) {
      setError('Failed to update attribute. Please try again.');
    }
  };

  const handleDeleteAttribute = async (id: string) => {
    try {
      await API.deleteAttribute(id);
      setAttributes(attributes.filter(a => a.id !== id));
    } catch (err) {
      setError('Failed to delete attribute. Please try again.');
    }
  };

  const handleAddAttributesToCategory = async (categoryId: string, selectedAttributes: Attribute[]) => {
    try {
      await Promise.all(selectedAttributes.map(attr => 
        API.addAttributeToCategory(categoryId, attr.id)
      ));
      setCategories(categories.map(c => 
        c.id === categoryId 
          ? { ...c, attributes: [...c.attributes, ...selectedAttributes] } 
          : c
      ));
    } catch (err) {
      setError('Failed to add attributes to category. Please try again.');
    }
  };

  const handleRemoveAttributeFromCategory = async (categoryId: string, attributeId: string) => {
    try {
      await API.removeAttributeFromCategory(categoryId, attributeId);
      setCategories(categories.map(c => 
        c.id === categoryId 
          ? { ...c, attributes: c.attributes.filter(a => a.id !== attributeId) } 
          : c
      ));
    } catch (err) {
      setError('Failed to remove attribute from category. Please try again.');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

  return (
    <div className="container mx-auto p-4 text-text-light">
      <h1 className="text-3xl font-bold mb-6 text-brand-100">Manage Attributes and Categories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-lg rounded-lg">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-brand-300">
              {editingAttribute ? 'Edit Attribute' : 'Create Attribute'}
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={attributeForm.handleSubmit(editingAttribute ? handleUpdateAttribute : onAttributeSubmit)} className="space-y-4">
              <div>
                <label htmlFor="attributeName" className="block text-sm font-medium">Attribute Name</label>
                <Input
                  id="attributeName"
                  {...attributeForm.register('attribute_name')}
                  className="mt-1 w-full"
                />
                {attributeForm.formState.errors.attribute_name && (
                  <p className="text-red-500 text-xs mt-1">{attributeForm.formState.errors.attribute_name.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="fieldType" className="block text-sm font-medium text-gray-700">Field Type</label>
                <Controller
                  name="field_type"
                  control={attributeForm.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={fieldTypes as any}
                      className="mt-1"
                    />
                  )}
                />
                {attributeForm.formState.errors.field_type && (
                  <p className="text-red-500 text-xs mt-1">{attributeForm.formState.errors.field_type.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full btn-primary">
                {editingAttribute ? 'Update Attribute' : 'Create Attribute'}
              </Button>
              {editingAttribute && (
                <Button type="button" className="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800" onClick={() => {
                  setEditingAttribute(null);
                  attributeForm.reset();
                }}>
                  Cancel
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg rounded-lg">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-brand-300">
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={categoryForm.handleSubmit(editingCategory ? handleUpdateCategory : onCategorySubmit)} className="space-y-4">
              <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name</label>
                <Input
                  id="categoryName"
                  {...categoryForm.register('name')}
                  className="mt-1 w-full"
                />
                {categoryForm.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{categoryForm.formState.errors.name.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full btn-primary">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
              {editingCategory && (
                <Button type="button" className="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800" onClick={() => {
                    setEditingCategory(null);
                    categoryForm.reset();
                  }}>
                    Cancel
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
  
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg rounded-lg">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-brand-300">Existing Attributes</h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {attributes.map(attribute => (
                  <li key={attribute.id} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-md">
                    <div>
                      <span className="font-medium">{attribute.attribute_name}</span>
                      <span className="ml-2 text-sm text-gray-500">({attribute.field_type})</span>
                    </div>
                    <div>
                      <Button onClick={() => handleEditAttribute(attribute)} className="mr-2 bg-blue-500 hover:bg-blue-600 text-white">
                        <Edit size={16} />
                      </Button>
                      <Button onClick={() => handleDeleteAttribute(attribute.id)} className="bg-red-500 hover:bg-red-600 text-white">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
  
          <Card className="bg-white shadow-lg rounded-lg">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-brand-300">Categories and Their Attributes</h2>
            </CardHeader>
            <CardContent>
              {categories.map(category => (
                <div key={category.id} className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-brand-300">{category.name}</h3>
                    <div>
                      <Button onClick={() => handleEditCategory(category)} className="mr-2 bg-blue-500 hover:bg-blue-600 text-white">
                        <Edit size={16} />
                      </Button>
                      <Button onClick={() => handleDeleteCategory(category.id)} className="bg-red-500 hover:bg-red-600 text-white">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-medium mb-2 text-gray-700">Attributes:</h4>
                    <ul className="space-y-2">
                      {category.attributes.map(attr => (
                        <li key={attr.id} className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded-md">
                          <span>{attr.attribute_name} ({attr.field_type})</span>
                          <Button 
                            onClick={() => handleRemoveAttributeFromCategory(category.id, attr.id)} 
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            <Minus size={16} />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-md font-medium mb-2 text-gray-700">Add Attributes:</h4>
                    <Select
                      isMulti
                      options={attributes
                        .filter(attr => !category.attributes.some(catAttr => catAttr.id === attr.id))
                        .map(attr => ({ value: attr.id, label: `${attr.attribute_name} (${attr.field_type})` }))}
                      onChange={(selectedOptions) => {
                        const selectedAttributes = selectedOptions.map(option => 
                          attributes.find(attr => attr.id === option.value)!
                        );
                        handleAddAttributesToCategory(category.id, selectedAttributes);
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  export default AttributesCategories;