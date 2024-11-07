"use client"

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const buyerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phoneNumber: z.string().min(10, 'Must be a valid phone number'),
  businessCategory: z.string().min(2, "Business category is required"),
});

type BuyerSchema = z.infer<typeof buyerSchema>;

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: { message?: string };
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          className={cn(
            "border-b-2 border-gray-300 bg-transparent px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-300 focus:outline-none",
            error && "border-red-500",
            className
          )}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500 flex items-center">
            <AlertCircle size={12} className="mr-1" />
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

const ProfileCompletionPage: React.FC = () => {
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
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

  const buyerForm = useForm<BuyerSchema>({
    resolver: zodResolver(buyerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      businessCategory: '',
    },
  });

  const handleSubmit = async (data: BuyerSchema) => {
    try {
      setIsLoading(true);

      if (!user) throw new Error('No user found');

      const profileData = {
        id: user.id,
        user_id: user.id,
        user_type: 'BUYER',
        first_name: data.firstName,
        last_name: data.lastName,
        email: user.email,
        phone_number: data.phoneNumber,
        business_category: data.businessCategory
      };

      const { error: profileError } = await supabase.from('profiles').upsert(profileData);
      if (profileError) throw profileError;

      toast({
        variant: "success",
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
    } finally {
      setIsLoading(false);
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
            <form onSubmit={buyerForm.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatedInput
                  placeholder="First Name"
                  {...buyerForm.register('firstName')}
                  error={buyerForm.formState.errors.firstName}
                />
                <AnimatedInput
                  placeholder="Last Name"
                  {...buyerForm.register('lastName')}
                  error={buyerForm.formState.errors.lastName}
                />
              </div>
              <div className="space-y-2 mt-6">
                <Controller
                  name="phoneNumber"
                  control={buyerForm.control}
                  render={({ field }) => (
                    <PhoneInput
                      value={field.value}
                      onChange={field.onChange}
                      defaultCountry="US"
                      className="border-b-2 border-gray-300 bg-transparent px-3 py-2 text-gray-900 focus:border-brand-300 focus:outline-none"
                    />
                  )}
                />
                {buyerForm.formState.errors.phoneNumber && (
                  <p className="mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {buyerForm.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 mt-6">
                <Controller
                  name="businessCategory"
                  control={buyerForm.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Business Category" />
                      </SelectTrigger>
                      <SelectContent className='bg-accent-100'>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id} className='hover:bg-brand-300'>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {buyerForm.formState.errors.businessCategory && (
                  <p className="mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {buyerForm.formState.errors.businessCategory.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full btn-primary text-white mt-6" disabled={isLoading}>
                Complete Profile
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center bg-opacity-20 p-4">
            <p className="text-sm text-text-light">Need help? <Button variant="link" className="text-brand-300 hover:text-brand-200 p-0">Contact our support team</Button></p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfileCompletionPage;