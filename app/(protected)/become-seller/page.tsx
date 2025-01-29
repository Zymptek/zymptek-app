"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Store, Upload, CheckCircle2 } from "lucide-react";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/shared/FileUpload";
import { TagInput } from "@/components/shared/TagInput";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CustomDatePicker } from "@/components/shared/DatePicker";

const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  business_category: z.string().min(1, "Please select a business category"),
  date_established: z.date({
    required_error: "Please select a date",
    invalid_type_error: "That's not a valid date",
  }),
  employee_count: z.number().min(1, "Must have at least 1 employee"),
  main_products: z.array(z.string()).min(1, "Add at least one main product"),
  logo_url: z.string().optional(),
  social_media: z.object({
    linkedin: z.string().url("Must be a valid LinkedIn URL").optional().or(z.literal("")),
    facebook: z.string().url("Must be a valid Facebook URL").optional().or(z.literal("")),
    twitter: z.string().url("Must be a valid Twitter URL").optional().or(z.literal("")),
    instagram: z.string().url("Must be a valid Instagram URL").optional().or(z.literal(""))
  }),
  documents: z.array(z.object({
    type: z.string(),
    url: z.string(),
    required: z.boolean().optional()
  })).optional()
});

type CompanyFormData = z.infer<typeof companySchema>;

const steps = [
  {
    id: "company",
    name: "Company Information",
    description: "Basic company details",
    icon: Building2
  },
  {
    id: "documents",
    name: "Documents",
    description: "Upload required documents",
    icon: Upload
  },
  {
    id: "review",
    name: "Review",
    description: "Review your information",
    icon: CheckCircle2
  }
];

const FORM_STORAGE_KEY = "seller_form_data";
const STEP_STORAGE_KEY = "seller_form_step";

export default function BecomeSellerPage() {
  const { profile, user } = useAuth();
  const [currentStep, setCurrentStep] = useState("company");
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<Array<{ type: string; url: string; required?: boolean }>>([]);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();

  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [logoUrl, setLogoUrl] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const [tempDocuments, setTempDocuments] = useState<Array<{
    type: string;
    file: File;
    previewUrl: string;
    name: string;
    required?: boolean;
  }>>([]);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      website: "",
      business_category: "",
      date_established: undefined,
      employee_count: 0,
      main_products: [],
      logo_url: "",
      social_media: {
        linkedin: "",
        facebook: "",
        twitter: "",
        instagram: ""
      },
      documents: []
    }
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  // Load saved form data and step on mount
  useEffect(() => {
    const savedStep = localStorage.getItem(STEP_STORAGE_KEY);
    const savedData = localStorage.getItem(FORM_STORAGE_KEY);
    const savedDocuments = localStorage.getItem('seller_form_documents');
    const savedLogo = localStorage.getItem('seller_form_logo');

    if (savedStep) {
      setCurrentStep(savedStep);
    }

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Convert the date string back to Date object
        if (parsedData.date_established) {
          parsedData.date_established = new Date(parsedData.date_established);
        }
        form.reset(parsedData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }

    if (savedDocuments) {
      try {
        const parsedDocs = JSON.parse(savedDocuments);
        setTempDocuments(parsedDocs);
      } catch (error) {
        console.error('Error parsing saved documents:', error);
      }
    }

    if (savedLogo) {
      setLogoUrl(savedLogo);
      form.setValue('logo_url', savedLogo);
    }
  }, []);

  // Save form data when it changes
  useEffect(() => {
    const subscription = form.watch((data) => {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Save current step when it changes
  useEffect(() => {
    localStorage.setItem(STEP_STORAGE_KEY, currentStep);
  }, [currentStep]);

  // Save documents when they change
  useEffect(() => {
    localStorage.setItem('seller_form_documents', JSON.stringify(tempDocuments));
  }, [tempDocuments]);

  // Save logo when it changes
  useEffect(() => {
    if (logoUrl) {
      localStorage.setItem('seller_form_logo', logoUrl);
    }
  }, [logoUrl]);

  const generateRandomLogo = () => {
    const companyName = form.getValues("name");
    const styles = [
      'adventurer', // Business-like characters
      'bottts',     // Robot/tech style
      'identicon',  // Abstract geometric patterns
      'shapes',     // Modern shapes
      'micah'       // Modern illustrations
    ];
    
    const style = styles[Math.floor(Math.random() * styles.length)];
    const seed = companyName || Math.random().toString(36).substring(7);
    const backgroundColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    
    const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${backgroundColor}`;
    setLogoUrl(url);
    form.setValue('logo_url', url);
  };

  const requiredDocuments = [
    { 
      type: 'gst_certificate',
      name: 'GST Registration Certificate',
      required: true
    },
    { 
      type: 'iec_code', 
      name: 'Import Export Code (IEC)',
      required: true
    },
    { 
      type: 'quality_certification',
      name: 'Quality Inspection Certificate',
      required: false
    }
  ];

  const onSubmit = async (data: CompanyFormData) => {
    if (!user || !profile) return;
    
    try {
      setLoading(true);

      // Validate required documents
      const requiredTypes = requiredDocuments
        .filter(doc => doc.required)
        .map(doc => doc.type);
      
      const hasAllRequiredDocs = requiredTypes.every(
        type => tempDocuments.some(doc => doc.type === type)
      );

      if (!hasAllRequiredDocs) {
        toast({
          title: "Missing Documents",
          description: "Please upload all required documents before proceeding.",
          variant: "destructive"
        });
        return;
      }

      // Convert to seller using the new function
      const { data: companyId, error: conversionError } = await supabase
        .rpc('convert_to_seller', {
          profile_id: profile.id,
          company_data: {
            name: data.name,
            description: data.description,
            address: data.address,
            website: data.website || null,
            business_category: data.business_category,
            date_established: data.date_established.toISOString(),
            employee_count: data.employee_count,
            main_products: data.main_products,
            logo_url: data.logo_url,
            social_media: data.social_media
          }
        });

      if (conversionError) throw conversionError;

      // Upload documents to Supabase
      if (tempDocuments.length > 0) {
        const uploadPromises = tempDocuments.map(async doc => {
          const fileExt = doc.file.name.split('.').pop();
          const filePath = `${user.id}/company/details/${doc.type}-${Math.random()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('company-images')
            .upload(filePath, doc.file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('company-images')
            .getPublicUrl(filePath);

          return supabase
            .from('company_documents')
            .insert({
              company_id: companyId,
              document_type: doc.type,
              document_url: publicUrl,
              document_name: doc.name,
              is_verified: false
            });
        });

        await Promise.all(uploadPromises);
      }

      // Clean up temporary document URLs
      tempDocuments.forEach(doc => {
        if (doc.previewUrl) {
          URL.revokeObjectURL(doc.previewUrl);
        }
      });

      // Clear all stored form data after successful submission
      localStorage.removeItem(FORM_STORAGE_KEY);
      localStorage.removeItem(STEP_STORAGE_KEY);
      localStorage.removeItem('seller_form_documents');
      localStorage.removeItem('seller_form_logo');

      toast({
        title: "Success!",
        description: "Your seller account is pending verification. We'll notify you once it's approved.",
      });

      router.push('/profile?tab=company');
    } catch (error) {
      console.error('Error converting to seller:', error);
      toast({
        title: "Error",
        description: "Failed to convert to seller account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (file: File, type: string, required: boolean = false) => {
    if (!user) return;

    try {
      // Create temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      
      // Add to temporary documents
      setTempDocuments(prev => [...prev.filter(doc => doc.type !== type), {
        type,
        file,
        previewUrl,
        name: file.name,
        required
      }]);

      toast({
        title: "Document Added",
        description: "Document has been added for review. You can view it below.",
      });
    } catch (error) {
      console.error('Error handling document:', error);
      toast({
        title: "Error",
        description: "Failed to process document. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Function to remove temporary document
  const removeTempDocument = (type: string) => {
    setTempDocuments(prev => {
      const filtered = prev.filter(doc => doc.type !== type);
      const removedDoc = prev.find(doc => doc.type === type);
      if (removedDoc?.previewUrl) {
        URL.revokeObjectURL(removedDoc.previewUrl);
      }
      return filtered;
    });
  };

  const handleLogoUpload = async (file: File) => {
    if (!user) return;

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/company/details/logo-${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('company-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('company-images')
        .getPublicUrl(filePath);

      setLogoUrl(publicUrl);
      form.setValue('logo_url', publicUrl);
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === "company") {
      const isValid = await form.trigger();
      if (!isValid) {
        setShowErrors(true);
        return;
      }
      setShowErrors(false);
      setCurrentStep("documents");
    } else if (currentStep === "documents") {
      setCurrentStep("review");
    }
  };

  const prevStep = () => {
    setShowErrors(false);
    if (currentStep === "documents") {
      setCurrentStep("company");
    } else if (currentStep === "review") {
      setCurrentStep("documents");
    }
  };

  const getEmployeeRangeText = (count: number) => {
    switch (count) {
      case 1: return "1-10 employees";
      case 11: return "11-50 employees";
      case 51: return "51-200 employees";
      case 201: return "201-500 employees";
      case 501: return "501-1000 employees";
      case 1001: return "1000+ employees";
      default: return `${count} employees`;
    }
  };

  // Add a cleanup function to the form
  const clearFormData = () => {
    localStorage.removeItem(FORM_STORAGE_KEY);
    localStorage.removeItem(STEP_STORAGE_KEY);
    localStorage.removeItem('seller_form_documents');
    localStorage.removeItem('seller_form_logo');
    form.reset();
    setTempDocuments([]);
    setLogoUrl("");
    setCurrentStep("company");
  };

  // Add this to handle component unmount
  useEffect(() => {
    return () => {
      // Only clear if the form was successfully submitted
      if (form.formState.isSubmitSuccessful) {
        clearFormData();
      }
    };
  }, [form.formState.isSubmitSuccessful]);

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
        <CardHeader className="text-center border-b border-brand-100/20 pb-8">
          <Store className="w-12 h-12 mx-auto text-brand-200 mb-4" />
          <CardTitle className="text-2xl text-brand-200">Become a Seller</CardTitle>
          <CardDescription>Convert your account to start selling products</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep === step.id 
                      ? "bg-brand-200 text-white"
                      : "bg-brand-100/10 text-brand-200"
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium mt-2">{step.name}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Steps */}
          <div className="space-y-8">
            {currentStep === "company" && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="flex items-start gap-6 p-6 bg-brand-50/50 rounded-lg">
                    {logoUrl ? (
                      <div className="relative group">
                        <img 
                          src={logoUrl} 
                          alt="Company Logo" 
                          className="w-24 h-24 rounded-lg shadow-md transition-transform transform group-hover:scale-105 object-cover border-2 border-brand-100" 
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm"
                          onClick={() => setLogoUrl("")}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </Button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => document.getElementById('logoInput')?.click()}
                        className="w-24 h-24 rounded-lg bg-white border-2 border-dashed border-brand-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-brand-50 transition-colors"
                      >
                        <Upload className="w-6 h-6 text-brand-200" />
                        <span className="text-xs text-brand-200 font-medium">Upload Logo</span>
                        <input
                          id="logoInput"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleLogoUpload(file);
                          }}
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-base font-medium text-brand-200 mb-1">Company Logo</h3>
                      <p className="text-sm text-brand-200/70 mb-3">Upload your company logo or generate one</p>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={generateRandomLogo}
                        className="h-8 text-xs"
                      >
                        Generate Random Logo
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-8 max-w-4xl mx-auto">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field, fieldState: { error, invalid, isDirty } }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Company Name *" className="h-11 w-full text-base" {...field} />
                          </FormControl>
                          {showErrors && error && (
                            <p className="text-xs text-red-500 mt-1.5">
                              {error.message}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field, fieldState: { error, invalid, isDirty } }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Company Description *" 
                              className="resize-none min-h-[120px] w-full text-base" 
                              {...field} 
                            />
                          </FormControl>
                          {showErrors && error && (
                            <p className="text-xs text-red-500 mt-1.5">
                              {error.message}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="business_category"
                        render={({ field, fieldState: { error, invalid, isDirty } }) => (
                          <FormItem className="w-full">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 w-full text-base">
                                  <SelectValue placeholder="Business Category *" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id} className="text-base">
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {showErrors && error && (
                              <p className="text-xs text-red-500 mt-1.5">
                                {error.message}
                              </p>
                            )}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="date_established"
                        render={({ field, fieldState: { error, invalid, isDirty } }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <CustomDatePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Date Established *"
                                className="w-full text-base"
                                minDate={new Date(1900, 0, 1)}
                                maxDate={new Date()}
                              />
                            </FormControl>
                            {showErrors && error && (
                              <p className="text-xs text-red-500 mt-1.5">
                                {error.message}
                              </p>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field, fieldState: { error, invalid, isDirty } }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Business Address *" 
                              className="resize-none min-h-[80px] w-full text-base" 
                              {...field} 
                            />
                          </FormControl>
                          {showErrors && error && (
                            <p className="text-xs text-red-500 mt-1.5">
                              {error.message}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-8">
                      <FormField
                        control={form.control}
                        name="employee_count"
                        render={({ field, fieldState: { error, invalid, isDirty } }) => (
                          <FormItem className="w-full">
                            <Select
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              defaultValue={field.value?.toString()}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 w-full text-base">
                                  <SelectValue placeholder="Number of Employees *" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1" className="text-base">1-10 employees</SelectItem>
                                <SelectItem value="11" className="text-base">11-50 employees</SelectItem>
                                <SelectItem value="51" className="text-base">51-200 employees</SelectItem>
                                <SelectItem value="201" className="text-base">201-500 employees</SelectItem>
                                <SelectItem value="501" className="text-base">501-1000 employees</SelectItem>
                                <SelectItem value="1001" className="text-base">1000+ employees</SelectItem>
                              </SelectContent>
                            </Select>
                            {showErrors && error && (
                              <p className="text-xs text-red-500 mt-1.5">
                                {error.message}
                              </p>
                            )}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field, fieldState: { error, invalid, isDirty } }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input 
                                type="url" 
                                placeholder="Company Website (Optional)" 
                                className="h-11 w-full text-base"
                                {...field} 
                              />
                            </FormControl>
                            {showErrors && error && (
                              <p className="text-xs text-red-500 mt-1.5">
                                {error.message}
                              </p>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="main_products"
                      render={({ field, fieldState: { error, invalid, isDirty } }) => (
                        <FormItem>
                          <FormControl>
                            <TagInput
                              placeholder="Type product name and press enter to add *"
                              tags={field.value}
                              onTagsChange={(tags: string[]) => field.onChange(tags)}
                            />
                          </FormControl>
                          <p className="text-xs text-brand-200/70 mt-1">
                            Add your main product categories or product lines
                          </p>
                          {showErrors && error && (
                            <p className="text-xs text-red-500 mt-1.5">
                              {error.message}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <h3 className="text-base font-medium text-brand-200">Social Media Profiles</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="social_media.linkedin"
                          render={({ field, fieldState: { error, invalid, isDirty } }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  placeholder="LinkedIn Profile URL" 
                                  className="h-11"
                                  {...field} 
                                />
                              </FormControl>
                              {showErrors && error && (
                                <p className="text-xs text-red-500 mt-1.5">
                                  {error.message}
                                </p>
                              )}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="social_media.facebook"
                          render={({ field, fieldState: { error, invalid, isDirty } }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  placeholder="Facebook Page URL" 
                                  className="h-11"
                                  {...field} 
                                />
                              </FormControl>
                              {showErrors && error && (
                                <p className="text-xs text-red-500 mt-1.5">
                                  {error.message}
                                </p>
                              )}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="social_media.twitter"
                          render={({ field, fieldState: { error, invalid, isDirty } }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  placeholder="Twitter Profile URL" 
                                  className="h-11"
                                  {...field} 
                                />
                              </FormControl>
                              {showErrors && error && (
                                <p className="text-xs text-red-500 mt-1.5">
                                  {error.message}
                                </p>
                              )}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="social_media.instagram"
                          render={({ field, fieldState: { error, invalid, isDirty } }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  placeholder="Instagram Profile URL" 
                                  className="h-11"
                                  {...field} 
                                />
                              </FormControl>
                              {showErrors && error && (
                                <p className="text-xs text-red-500 mt-1.5">
                                  {error.message}
                                </p>
                              )}
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            )}

            {currentStep === "documents" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {requiredDocuments.map((doc) => (
                    <Card key={doc.type} className="p-6 border-brand-100/20">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-base">{doc.name}</h3>
                            {doc.required && (
                              <span className="text-xs text-red-500">*Required</span>
                            )}
                          </div>
                          <p className="text-sm text-brand-200/70 mt-1">
                            Upload in PDF format (max 5MB)
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          {tempDocuments.find(d => d.type === doc.type) ? (
                            <div className="flex items-center gap-2">
                              <a 
                                href={tempDocuments.find(d => d.type === doc.type)?.previewUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-brand-200 hover:text-brand-200/80 transition-colors"
                              >
                                {tempDocuments.find(d => d.type === doc.type)?.name}
                              </a>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTempDocument(doc.type)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                              </Button>
                            </div>
                          ) : (
                            <FileUpload
                              onUpload={(file) => handleDocumentUpload(file, doc.type, doc.required)}
                              maxSizeMB={5}
                              acceptedFileTypes={['.pdf']}
                            />
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {currentStep === "review" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Review Information</h3>
                  <div className="grid gap-4">
                    <Card className="border border-brand-100/20">
                      <CardContent className="p-6">
                        <dl className="space-y-4">
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Company Name</dt>
                            <dd className="text-sm font-medium">{form.getValues("name")}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Business Category</dt>
                            <dd className="text-sm font-medium">
                              {categories.find(cat => cat.id === form.getValues("business_category"))?.name || form.getValues("business_category")}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Date Established</dt>
                            <dd className="text-sm font-medium">
                              {form.getValues("date_established") ? format(new Date(form.getValues("date_established")), 'MMMM d, yyyy') : ''}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Number of Employees</dt>
                            <dd className="text-sm font-medium">{getEmployeeRangeText(form.getValues("employee_count"))}</dd>
                          </div>
                          <div className="pt-4 border-t border-brand-100/20">
                            <dt className="text-sm text-muted-foreground mb-2">Description</dt>
                            <dd className="text-sm">{form.getValues("description")}</dd>
                          </div>
                          <div className="pt-4 border-t border-brand-100/20">
                            <dt className="text-sm text-muted-foreground mb-2">Business Address</dt>
                            <dd className="text-sm">{form.getValues("address")}</dd>
                          </div>
                          {form.getValues("website") && (
                            <div className="pt-4 border-t border-brand-100/20">
                              <dt className="text-sm text-muted-foreground mb-2">Company Website</dt>
                              <dd className="text-sm">
                                <a 
                                  href={form.getValues("website")} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-brand-200 hover:text-brand-200/80 transition-colors"
                                >
                                  {form.getValues("website")}
                                </a>
                              </dd>
                            </div>
                          )}
                          <div className="pt-4 border-t border-brand-100/20">
                            <dt className="text-sm text-muted-foreground mb-2">Main Products</dt>
                            <dd className="flex flex-wrap gap-2 mt-2">
                              {form.getValues("main_products").map((product, index) => (
                                <span 
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100/10 text-brand-200"
                                >
                                  {product}
                                </span>
                              ))}
                            </dd>
                          </div>
                          {Object.entries(form.getValues("social_media")).some(([_, value]) => value) && (
                            <div className="pt-4 border-t border-brand-100/20">
                              <dt className="text-sm text-muted-foreground mb-2">Social Media Profiles</dt>
                              <dd className="space-y-2">
                                {Object.entries(form.getValues("social_media")).map(([platform, url]) => 
                                  url ? (
                                    <div key={platform} className="flex items-center gap-2">
                                      <span className="text-sm capitalize">{platform}:</span>
                                      <a 
                                        href={url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm text-brand-200 hover:text-brand-200/80 transition-colors"
                                      >
                                        {url}
                                      </a>
                                    </div>
                                  ) : null
                                )}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </CardContent>
                    </Card>

                    <Card className="border border-brand-100/20">
                      <CardContent className="p-6">
                        <h4 className="font-medium mb-4">Uploaded Documents</h4>
                        <div className="space-y-2">
                          {tempDocuments.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center text-sm">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                                <span className="font-medium">
                                  {requiredDocuments.find(rd => rd.type === doc.type)?.name || doc.type}
                                </span>
                              </div>
                              <a 
                                href={doc.previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-brand-200 hover:text-brand-200/80 transition-colors"
                              >
                                View Document
                              </a>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t border-brand-100/20">
              {currentStep !== "company" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="w-[120px]"
                >
                  Back
                </Button>
              )}
              {currentStep === "company" && (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto w-[120px]"
                  disabled={loading}
                >
                  Next
                </Button>
              )}
              {currentStep === "documents" && (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto w-[120px]"
                  disabled={loading || (requiredDocuments.filter(d => d.required).length > 0 && tempDocuments.length === 0)}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Review"
                  )}
                </Button>
              )}
              {currentStep === "review" && (
                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                  className="ml-auto w-[120px]"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 