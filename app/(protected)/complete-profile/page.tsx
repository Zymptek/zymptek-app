"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DynamicForm } from '@/components/shared/DynamicForm';
import { ProfileSchema, profileFormFields } from '@/lib/schema/profileSchema';

const ProfileCompletionPage = () => {
  const supabase = createClientComponentClient();
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories(data || []);
    };

    fetchCategories();
  }, [supabase]);

  // Transform categories into options format
  const categoryOptions = categories.map(cat => ({
    label: cat.name,
    value: cat.name.toLowerCase()
  }));

  // Create a copy of profileFormFields with updated categories
  const updatedProfileFields = profileFormFields.map(field => {
    if (field.name === "business_category") {
      return {
        ...field,
        options: categoryOptions
      };
    }
    return field;
  });

  const handleSubmit = async (data: any) => {
    try {
      if (!user) throw new Error('No user found');

      const profileData = {
        id: user.id,
        user_id: user.id,
        user_type: 'BUYER',
        ...data
      };

      const { error: profileError } = await supabase.from('profiles').upsert(profileData);
      if (profileError) throw profileError;

      toast({
        title: "Profile Completed",
        description: "Your profile has been successfully updated.",
      });

      router.push('/');
    } catch (error) {
      console.error('Error submitting profile:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Failed to submit profile. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-background-light min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-2xl mx-auto shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-brand text-white">
            <CardTitle className="text-2xl sm:text-3xl font-bold">Complete Your Profile</CardTitle>
            <CardDescription className="text-accent-100">Please provide your details to get started</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <DynamicForm
              fields={updatedProfileFields}
              schema={ProfileSchema}
              onSubmit={handleSubmit}
              submitText="Complete Profile"
              className="space-y-4"
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfileCompletionPage;