"use client"

import React, { useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const COUNTRIES = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'IN', name: 'India' }
  ];
  
  const buyerSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    phoneNumber: z.string().min(10, 'Must be a valid phone number'),
    country: z.string().min(2, "Country is required"),
    businessCategory: z.string().min(2, "Business category is required"),
  });
  
  const sellerSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    company: z.string().min(2, "Company name is required"),
    phoneNumber: z.string().min(10, 'Must be a valid phone number'),
    country: z.string().min(2, "Country is required"),
    companyAddress: z.string().min(10, "Company address is required"),
    designation: z.string().min(2, "Designation is required").optional(),
    companyProfile: z.string().min(50, "Please provide a detailed company profile"),
    logo: z.any()
      .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file size is 5MB")
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), "Invalid file type"),
    poster: z.any()
      .refine((file) => !!file, "Company poster is required.")
      .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
  });

type BuyerSchema = z.infer<typeof buyerSchema>;
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

interface FileUploadFieldProps {
    name: string;
    placeholder: string;
    form: any;
    accept?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({ name, placeholder, form, accept = "image/*" }) => {
    const file = form.watch(name);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        form.setValue(name, selectedFile);
    };

    const removeFile = () => {
        form.setValue(name, null);
    };

    return (
        <div className="space-y-2 mt-6">
            {!file && (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-brand-300 transition-colors duration-300">
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor={name} className="relative cursor-pointer bg-white rounded-md font-medium text-brand-300 hover:text-brand-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-300">
                                <span>{placeholder}</span>
                                <input id={name} name={name} type="file" className="sr-only" accept={accept} onChange={handleFileChange} />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                </div>
            )}
            {file && (
                <div className="flex items-center space-x-2 bg-brand-100 bg-opacity-20 p-2 rounded">
                    <CheckCircle2 className="text-green-500" size={20} />
                    <span className="text-sm text-text-dark flex-grow truncate">{file.name}</span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-700"
                    >
                        <X size={20} />
                    </Button>
                </div>
            )}
            {form.formState.errors[name] && (
                <p className="mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {form.formState.errors[name].message}
                </p>
            )}
        </div>
    );
};

const ProfileCompletionPage: React.FC = () => {
  const [userType, setUserType] = useState('buyer');
  const supabase = createClientComponentClient();
  const [ isLoading, setIsLoading ] = useState(false);

  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const buyerForm = useForm<BuyerSchema>({
      resolver: zodResolver(buyerSchema),
      defaultValues: {
          firstName: '',
          lastName: '',
          country: '',
          phoneNumber: '',
          businessCategory: '',
      },
  });

  const sellerForm = useForm<SellerSchema>({
      resolver: zodResolver(sellerSchema),
      defaultValues: {
          firstName: '',
          lastName: '',
          country: '',
          phoneNumber: '',
          company: '',
          companyAddress: '',
          designation: '',
          logo: null,
          poster: null,
          companyProfile: ''
      },
  });

  const onBuyerSubmit = async (data: BuyerSchema) => {
      await handleSubmit(data, 'BUYER');
  };

  const onSellerSubmit = async (data: SellerSchema) => {
      await handleSubmit(data, 'SELLER');
  };

  const handleSubmit = async (data: BuyerSchema | SellerSchema, type: 'BUYER' | 'SELLER') => {
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

          if (type === 'BUYER') {
              profileData.business_category = (data as BuyerSchema).businessCategory;
          } else {
              const sellerData = data as SellerSchema;
              profileData.company_profile = {
                company_name: sellerData.company,
                company_address: sellerData.companyAddress,
                company_description: sellerData.companyProfile,
                company_logo_url: sellerData.logo ? await uploadFile(sellerData.logo, 'logos') : null,
                company_poster_url: sellerData.poster ? await uploadFile(sellerData.poster, 'posters') : null,
              };
              profileData.designation = sellerData.designation
          }

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
      } finally{
        setIsLoading(false)
      }
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user?.id}/${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
          .from('company-images')
          .upload(filePath, file);

      if (uploadError) {
          throw uploadError;
      }

      const { data } = supabase.storage
          .from('company-images')
          .getPublicUrl(filePath);

      return data.publicUrl;
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
              <Tabs value={userType} onValueChange={setUserType} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger
                    value="buyer"
                    className={`py-2 px-4 text-center cursor-pointer transition-colors duration-300 ${userType === 'buyer' ? 'bg-gradient-brand text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    Buyer
                  </TabsTrigger>
                  <TabsTrigger
                    value="seller"
                    className={`py-2 px-4 text-center cursor-pointer transition-colors duration-300 ${userType === 'seller' ? 'bg-gradient-brand text-white' : 'bg-gray-200 text-gray-800'}`}
                  >
                    Seller
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="buyer">
                  <form onSubmit={buyerForm.handleSubmit(onBuyerSubmit)} className="space-y-4">
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
                        name="country"
                        control={buyerForm.control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      {buyerForm.formState.errors.country && (
                        <p className="mt-1 text-xs text-red-500 flex items-center">
                          <AlertCircle size={12} className="mr-1" />
                          {buyerForm.formState.errors.country.message}
                        </p>
                      )}
                    </div>
                    <AnimatedInput
                      type="phone"
                      placeholder="Phone Number"
                      {...buyerForm.register('phoneNumber')}
                      error={buyerForm.formState.errors.phoneNumber}
                    />
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
                              <SelectItem value="electronics" className='hover:bg-brand-300'>Electronics</SelectItem>
                              <SelectItem value="clothing" className='hover:bg-brand-300'>Clothing</SelectItem>
                              <SelectItem value="furniture" className='hover:bg-brand-300'>Furniture</SelectItem>
                              <SelectItem value="other" className='hover:bg-brand-300'>Other</SelectItem>
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
                      Complete Buyer Profile
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="seller">
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <AnimatedInput
                      placeholder="Your Designation"
                      {...sellerForm.register('designation')}
                      error={sellerForm.formState.errors.designation}
                    />
                    <AnimatedTextarea
                      placeholder="Tell us about your company (min. 50 characters)"
                      {...sellerForm.register('companyProfile')}
                      error={sellerForm.formState.errors.companyProfile}
                    />
                    <FileUploadField
                      name="logo"
                      placeholder="Upload Company Logo"
                      form={sellerForm}
                    />
                    <FileUploadField
                      name="poster"
                      placeholder="Upload Company Poster"
                      form={sellerForm}
                    />
                    <Button type="submit" className="w-full bg-brand-300 hover:bg-brand-200 text-white mt-6" disabled={isLoading}>
                      Complete Seller Profile
                    </Button>
                  </form>
                  
                  </TabsContent>
                  <div className='flex justify-center bg-opacity-20'>
                      <p className="text-sm text-text-light">Need help? <Button variant="link" className="text-brand-300 hover:text-brand-200 p-0">Contact our support team</Button></p>
                  </div>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center bg-opacity-20 p-4">             
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  };
  
  export default ProfileCompletionPage;