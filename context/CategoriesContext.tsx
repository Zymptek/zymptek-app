'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CategoriesService, Category, Subcategory } from '@/lib/services/categories.service';

interface CategoriesContextType {
  categories: Category[];
  subcategories: Subcategory[];
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;
  isLoading: boolean;
  error: string | null;
  getSubcategoriesForCategory: (categoryId: string) => Subcategory[];
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await CategoriesService.getAllCategories();
        setCategories(data.categories);
        setSubcategories(data.subcategories);
        if (data.categories.length > 0 && !selectedCategory) {
          setSelectedCategory(data.categories[0].id);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch categories');
        console.error('Categories Context Error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const getSubcategoriesForCategory = (categoryId: string) => {
    return CategoriesService.getSubcategoriesForCategory(subcategories, categoryId);
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        subcategories,
        selectedCategory,
        setSelectedCategory,
        isLoading,
        error,
        getSubcategoriesForCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
} 