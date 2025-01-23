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

const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  business_category: z.string().min(1, "Please select a business category"),
  year_established: z.string().regex(/^\d{4}$/, "Must be a valid year"),
  employee_count: z.number().min(1, "Must have at least 1 employee"),
  main_products: z.array(z.string()).min(1, "Add at least one main product"),
  logo_url: z.string().optional(),
  social_media: z.object({
    linkedin: z.string().url("Must be a valid LinkedIn URL").optional().or(z.literal("")),
    facebook: z.string().url("Must be a valid Facebook URL").optional().or(z.literal("")),
    twitter: z.string().url("Must be a valid Twitter URL").optional().or(z.literal("")),
    instagram: z.string().url("Must be a valid Instagram URL").optional().or(z.literal(""))
  })
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

export default function BecomeSellerPage() {
  const { profile, user } = useAuth();
  const [currentStep, setCurrentStep] = useState("company");
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<{ type: string; url: string }[]>([]);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();

  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [logoUrl, setLogoUrl] = useState("");

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      website: "",
      business_category: "",
      year_established: "",
      employee_count: 0,
      main_products: [],
      logo_url: "",
      social_media: {
        linkedin: "",
        facebook: "",
        twitter: "",
        instagram: ""
      }
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
            year_established: data.year_established,
            employee_count: data.employee_count,
            main_products: data.main_products,
            logo_url: data.logo_url,
            social_media: data.social_media
          }
        });

      if (conversionError) throw conversionError;

      // Upload documents if any
      if (documents.length > 0) {
        for (const doc of documents) {
          const { error: docError } = await supabase
            .from('company_documents')
            .insert({
              company_id: companyId,
              document_type: doc.type,
              document_url: doc.url
            });

          if (docError) throw docError;
        }
      }

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

  const handleDocumentUpload = async (file: File, type: string) => {
    if (!user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      setDocuments(prev => [...prev, { type, url: publicUrl }]);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!user) return;

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/company-logos/${Math.random()}.${fileExt}`;

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

  const nextStep = () => {
    if (currentStep === "company") {
      const isValid = form.trigger();
      if (!isValid) return;
      setCurrentStep("documents");
    } else if (currentStep === "documents") {
      setCurrentStep("review");
    }
  };

  const prevStep = () => {
    if (currentStep === "documents") {
      setCurrentStep("company");
    } else if (currentStep === "review") {
      setCurrentStep("documents");
    }
  };

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

                  <div className="grid gap-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Company Name" className="h-11" {...field} />
                          </FormControl>
                          {fieldState.error && (
                            <FormMessage className="text-xs text-gray-900">
                              {fieldState.error.message}
                            </FormMessage>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Company Description" 
                              className="resize-none min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          {fieldState.error && (
                            <FormMessage className="text-xs text-gray-900">
                              {fieldState.error.message}
                            </FormMessage>
                          )}
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="business_category"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Business Category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {fieldState.error && (
                              <FormMessage className="text-xs text-gray-900">
                                {fieldState.error.message}
                              </FormMessage>
                            )}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="year_established"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1900" 
                                max={new Date().getFullYear()} 
                                placeholder="Year Established" 
                                className="h-11"
                                {...field} 
                              />
                            </FormControl>
                            {fieldState.error && (
                              <FormMessage className="text-xs text-gray-900">
                                {fieldState.error.message}
                              </FormMessage>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Business Address" 
                              className="resize-none min-h-[80px]" 
                              {...field} 
                            />
                          </FormControl>
                          {fieldState.error && (
                            <FormMessage className="text-xs text-gray-900">
                              {fieldState.error.message}
                            </FormMessage>
                          )}
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="employee_count"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                placeholder="Number of Employees" 
                                className="h-11"
                                {...field} 
                              />
                            </FormControl>
                            {fieldState.error && (
                              <FormMessage className="text-xs text-gray-900">
                                {fieldState.error.message}
                              </FormMessage>
                            )}
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                type="url" 
                                placeholder="Company Website" 
                                className="h-11"
                                {...field} 
                              />
                            </FormControl>
                            {fieldState.error && (
                              <FormMessage className="text-xs text-gray-900">
                                {fieldState.error.message}
                              </FormMessage>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="main_products"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <TagInput
                              placeholder="Type product name and press enter to add"
                              tags={field.value}
                              onTagsChange={(tags: string[]) => field.onChange(tags)}
                            />
                          </FormControl>
                          <p className="text-xs text-brand-200/70 mt-1">
                            Add your main product categories or product lines
                          </p>
                          {fieldState.error && (
                            <FormMessage className="text-xs text-gray-900">
                              {fieldState.error.message}
                            </FormMessage>
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
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  placeholder="LinkedIn Profile URL" 
                                  className="h-11"
                                  {...field} 
                                />
                              </FormControl>
                              {fieldState.error && (
                                <FormMessage className="text-xs text-gray-900">
                                  {fieldState.error.message}
                                </FormMessage>
                              )}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="social_media.facebook"
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  placeholder="Facebook Page URL" 
                                  className="h-11"
                                  {...field} 
                                />
                              </FormControl>
                              {fieldState.error && (
                                <FormMessage className="text-xs text-gray-900">
                                  {fieldState.error.message}
                                </FormMessage>
                              )}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="social_media.twitter"
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  placeholder="Twitter Profile URL" 
                                  className="h-11"
                                  {...field} 
                                />
                              </FormControl>
                              {fieldState.error && (
                                <FormMessage className="text-xs text-gray-900">
                                  {fieldState.error.message}
                                </FormMessage>
                              )}
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="social_media.instagram"
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  placeholder="Instagram Profile URL" 
                                  className="h-11"
                                  {...field} 
                                />
                              </FormControl>
                              {fieldState.error && (
                                <FormMessage className="text-xs text-gray-900">
                                  {fieldState.error.message}
                                </FormMessage>
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
                            Upload in PDF, JPG, or PNG format (max 5MB)
                          </p>
                        </div>
                        <FileUpload
                          onUpload={(file) => handleDocumentUpload(file, doc.type)}
                          uploaded={documents.some(d => d.type === doc.type)}
                        />
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
                            <dd className="text-sm font-medium">{form.getValues("business_category")}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Year Established</dt>
                            <dd className="text-sm font-medium">{form.getValues("year_established")}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm text-muted-foreground">Employees</dt>
                            <dd className="text-sm font-medium">{form.getValues("employee_count")}</dd>
                          </div>
                          <div className="pt-4 border-t border-brand-100/20">
                            <dt className="text-sm text-muted-foreground mb-2">Description</dt>
                            <dd className="text-sm">{form.getValues("description")}</dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>

                    <Card className="border border-brand-100/20">
                      <CardContent className="p-6">
                        <h4 className="font-medium mb-4">Uploaded Documents</h4>
                        <div className="space-y-2">
                          {documents.map((doc, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                              <span>{doc.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              {currentStep !== "company" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={loading}
                >
                  Previous
                </Button>
              )}
              {currentStep !== "review" ? (
                <Button
                  type="button"
                  className="bg-brand-200 hover:bg-brand-300 text-white ml-auto"
                  onClick={nextStep}
                  disabled={loading}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  className="bg-brand-200 hover:bg-brand-300 text-white ml-auto"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={loading}
                >
                  {loading ? "Converting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 