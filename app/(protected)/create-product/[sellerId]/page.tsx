'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/hooks/use-toast';
import { Loading } from '@/components/Loading';
import { DynamicProductForm } from '@/components/create-product/DynamicProductForm';
import { handleProductSubmit } from '@/lib/product/productSubmission';
import { useRouter } from 'next/navigation';
import { Tables } from '@/lib/database.types';
type Category = Tables<'categories'>;
const CreateProductPage = ({ params }: { params: { sellerId: string } }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[] | null>(null);
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      if (data) {
        setCategories(data);
      } else {
        console.error('Unexpected data format for categories');
        setCategories(null);
      }
    };
    fetchCategories();
  }, [supabase]);

  const onSubmit = async (data: any) => {
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
      console.log(data);
      const productId = await handleProductSubmit(data, user, toast);
      router.push(`/product/${productId}`);
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsLoading(false);
    }
  };
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
        <Card className="w-full max-w-4xl mx-auto bg-background-light border-2 border-brand-300 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-brand-200 to-brand-300 text-text-dark">
            <CardTitle className="text-3xl font-bold">Create New Product</CardTitle>
            <CardDescription className="text-accent-100">Fill in the details of your new product</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <DynamicProductForm categories={categories} onSubmit={onSubmit} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
export default CreateProductPage;