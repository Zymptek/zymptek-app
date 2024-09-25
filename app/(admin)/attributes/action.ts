import { Category, Attribute, CategoryWithAttributes } from './types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw error;
  return data;
};

export const fetchAttributes = async (): Promise<Attribute[]> => {
  const { data, error } = await supabase.from('attributes').select('*');
  if (error) throw error;
  return data;
};

export const fetchCategoriesWithAttributes = async (): Promise<CategoryWithAttributes[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      categoryattributes (
        id,
        attributes (*)
      )
    `);
  if (error) throw error;
  return data.map((category: any) => ({
    ...category,
    attributes: category.categoryattributes.map((ca: any) => ca.attributes)
  }));
};

export const createCategory = async (name: string): Promise<Category> => {
  const { data, error } = await supabase.from('categories').insert({ name }).select().single();
  if (error) throw error;
  return data;
};

export const createAttribute = async (attribute_name: string, field_type: string): Promise<Attribute> => {
  const { data, error } = await supabase.from('attributes').insert({ attribute_name, field_type }).select().single();
  if (error) throw error;
  return data;
};

export const addAttributeToCategory = async (category_id: string, attribute_id: string): Promise<void> => {
  const { error } = await supabase.from('categoryattributes').insert({ category_id, attribute_id });
  if (error) throw error;
};

export const removeAttributeFromCategory = async (category_id: string, attribute_id: string): Promise<void> => {
  const { error } = await supabase
    .from('categoryattributes')
    .delete()
    .match({ category_id, attribute_id });
  if (error) throw error;
};

export const updateCategory = async (id: string, name: string): Promise<Category> => {
  const { data, error } = await supabase.from('categories').update({ name }).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const updateAttribute = async (id: string, attribute_name: string, field_type: string): Promise<Attribute> => {
  const { data, error } = await supabase.from('attributes').update({ attribute_name, field_type }).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
};

export const deleteAttribute = async (id: string): Promise<void> => {
  const { error } = await supabase.from('attributes').delete().eq('id', id);
  if (error) throw error;
};