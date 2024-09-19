"use client"

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { notFound, useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Tables } from '@/lib/database.types';
import Image from 'next/image';

type Seller = Tables<"profiles">

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'IN', name: 'India' }
  ];
  
  const sellerSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    company: z.string().min(2, "Company name is required"),
    phoneNumber: z.string().min(10, 'Must be a valid phone number'),
    country: z.string().min(2, "Country is required"),
    companyAddress: z.string().min(10, "Company address is required"),
    description: z.string().min(50, "Please provide a detailed company profile")
  });

type SellerSchema = z.infer<typeof sellerSchema>;

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

interface AnimatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: { message?: string };
}

const AnimatedTextarea = React.forwardRef<HTMLTextAreaElement, AnimatedTextareaProps>(
    ({ error, className, ...props }, ref) => {
        return (
            <div className="relative">
                <Textarea
                    {...props}
                    ref={ref}
                    className={cn(
                        "border-2 border-gray-300 rounded bg-transparent px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-brand-300 focus:outline-none",
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

AnimatedTextarea.displayName = "AnimatedTextarea";

const UpdateProfilePage = ({ params }: { params: { sellerId: string } }) => {
  const supabase = createClientComponentClient();
  const [ isLoading, setIsLoading ] = useState(false);
  const [seller, setSeller] = useState();
  const router = useRouter();
  const { toast } = useToast();
  const { sellerId } = params;
  const { user } = useAuth()

  useEffect(()=>{
    if(sellerId !== user!.id){
      toast({
        variant: "destructive",
        title: "Restricted Access",
        description: "You do not have the necessary permissions to access this resource."
      });
      
      router.push("/")
    }
  },[sellerId, user])

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select("*")
        .eq('id', sellerId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
        return;
      }

      if (data) {
        sellerForm.reset({
          firstName: data.first_name,
          lastName: data.last_name,
          country: data.country,
          phoneNumber: data.phone_number,
          company: data.company_profile.company_name,
          companyAddress: data.company_profile.company_address,
          description: data.company_profile.company_description
        })
        setSeller(data.company_profile)
      }
      setIsLoading(false);
    }

    fetchProfile();
  }, [sellerId]);

  const sellerForm = useForm<SellerSchema>({
      resolver: zodResolver(sellerSchema),
      defaultValues: {
          firstName: "",
          lastName: '',
          country: '',
          phoneNumber: '',
          company: '',
          companyAddress: '',
          description: ''
      },
  });

  if (!sellerId) {
    notFound();
  }

  const onSellerSubmit = async (data: SellerSchema) => {
      await handleSubmit(data, 'SELLER');
  };

  const handleSubmit = async (data:  SellerSchema, type: 'SELLER') => {
      try {
          setIsLoading(false)

          if (!user) throw new Error('No user found');

          let profileData: any = {
              id: user.id,
              user_id: user.id,
              user_type: type,
              first_name: data.firstName,
              last_name: data.lastName,
              email: user.email,
              country: data.country,
              phone_number: data.phoneNumber
          };
            const sellerData = data as SellerSchema;
              
            profileData.company_profile = {
                ...seller || {},
                company_name: sellerData.company,
                company_address: sellerData.companyAddress,
                company_description: sellerData.description
            };

          const { error: profileError } = await supabase.from('profiles').upsert(profileData);
          if (profileError) throw profileError;

          toast({
              variant: "success",
              title: "Profile Completed",
              description: "Your profile has been successfully updated.",
          });

          router.push(`/seller/${sellerId}`);
      } catch (error) {
          console.error('Error submitting profile:', error);
          toast({
              variant: "destructive",
              title: "Submission Failed",
              description: "Failed to submit profile. Please try again.",
          });
      } finally{
        setIsLoading(false)
      }
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    try {
        // Get file extension and create a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user?.id}/${folder}/${fileName}`;

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('company-images')
            .upload(filePath, file);

        // Handle any upload errors
        if (uploadError) {
            throw new Error(`File upload failed: ${uploadError.message}`);
        }

        // Get the public URL for the uploaded file
        const { data } = supabase.storage
            .from('company-images')
            .getPublicUrl(filePath);

        if (!data?.publicUrl) {
            throw new Error('Public URL not available for the uploaded file');
        }

        // Return the public URL of the file
        return data.publicUrl;
    } catch (error) {
        console.error('Error during file upload:', error);
        throw error;  // Rethrow to ensure the caller knows about the failure
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
              <CardTitle className="text-2xl sm:text-3xl font-bold">Update Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                  <form onSubmit={sellerForm.handleSubmit(onSellerSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <AnimatedInput
                        placeholder="First Name"
                        {...sellerForm.register('firstName')}
                        error={sellerForm.formState.errors.firstName}
                      />
                      <AnimatedInput
                        placeholder="Last Name"
                        {...sellerForm.register('lastName')}
                        error={sellerForm.formState.errors.lastName}
                      />
                    </div>
                    <div className="space-y-2 mt-6">
                      <Controller
                        name="country"
                        control={sellerForm.control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                              <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Country" />
                              </SelectTrigger>
                              <SelectContent className='bg-accent-100'>
                                  {COUNTRIES.map((country) => (
                                      <SelectItem key={country.code} value={country.code} className='hover:bg-brand-300'>
                                      {country.name}
                                  </SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                        )}
                      />
                      {sellerForm.formState.errors.country && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <AlertCircle size={12} className="mr-1" />
                          {sellerForm.formState.errors.country.message}
                        </p>
                      )}
                    </div>
                    <AnimatedInput
                      type="phone"
                      placeholder="Phone Number"
                      {...sellerForm.register('phoneNumber')}
                      error={sellerForm.formState.errors.phoneNumber}
                    />
                    <AnimatedInput
                      placeholder="Company Name"
                      {...sellerForm.register('company')}
                      error={sellerForm.formState.errors.company}
                    />
                    <AnimatedTextarea
                      placeholder="Company Address"
                      {...sellerForm.register('companyAddress')}
                      error={sellerForm.formState.errors.companyAddress}
                    />
                    <AnimatedTextarea
                      placeholder="Tell us about your company (min. 50 characters)"
                      {...sellerForm.register('description')}
                      error={sellerForm.formState.errors.description}
                    />
                    <Button type="submit" className="w-full bg-brand-300 hover:bg-brand-200 text-white mt-6" disabled={isLoading}>
                      Update Seller Profile
                    </Button>
                  </form>
                  
                  <div className='flex justify-center bg-opacity-20'>
                      <p className="text-sm text-text-light">Need help? <Button variant="link" className="text-brand-300 hover:text-brand-200 p-0">Contact our support team</Button></p>
                  </div>
            </CardContent>
            <CardFooter className="flex justify-center bg-opacity-20 p-4">             
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  };
  
  export default UpdateProfilePage;