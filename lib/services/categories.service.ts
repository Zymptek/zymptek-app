import { Tables } from '@/lib/database.types';

export type Category = Tables<'categories'>;
export type Subcategory = Tables<'subcategories'>;

export interface CategoriesResponse {
  categories: Category[];
  subcategories: Subcategory[];
}

export class CategoriesService {
  static async getAllCategories(): Promise<CategoriesResponse> {
    try {
      const response = await fetch('/api/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      return data as CategoriesResponse;
    } catch (error) {
      console.error('Categories Service Error:', error);
      throw error;
    }
  }

  static getSubcategoriesForCategory(subcategories: Subcategory[], categoryId: string): Subcategory[] {
    return subcategories.filter(subcat => subcat.category_id === categoryId);
  }
} 