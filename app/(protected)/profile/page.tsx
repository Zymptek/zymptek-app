"use client";

import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard,
  Package, 
  Store, 
  MapPin, 
  Mail, 
  Phone, 
  Briefcase,
  Building2,
  Globe,
  Twitter,
  Linkedin,
  Facebook,
  Edit,
  Calendar,
  Clock,
  ShoppingCart,
  TrendingUp,
  Users,
  Star,
  Plus,
  Eye,
  User
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EditDialog } from "@/components/shared/EditDialog";
import { ProfileSchema, CompanySchema, profileFormFields, companyFormFields } from "@/lib/schema/profileSchema";
import { recordActivity } from "@/lib/schema/activitySchema";
import { ImageEditDialog } from "@/components/shared/ImageEditDialog";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1 }
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

type ProductAnalytics = {
  total_views: number;
  unique_viewers: number;
  conversion_rate: number;
  last_viewed: string;
};

type SellerAnalytics = {
  total_products: number;
  total_views: number;
  total_orders: number;
  overall_conversion_rate: number;
};

type TopProduct = {
  product_id: string;
  headline: string;
  views_count: number;
  orders_count: number;
  conversion_rate: number;
  last_viewed_at: string;
};

interface CompanyProfile {
  company_name?: string;
  company_address?: string;
  company_description?: string;
  website?: string;
  production_capacity?: string;
  certifications?: string;
  main_markets?: string;
  year_established?: string;
  number_of_employees?: string;
  business_type?: string;
  social_media?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  logo_url?: string;
  overview?: {
    mainProducts?: string;
    totalEmployees?: string;
    yearsExporting?: string;
    yearEstablished?: string;
  };
  productionCapacity?: {
    factorySize?: string;
    annualOutput?: string;
    productionLines?: string;
    qualityControlStaff?: string;
  };
  company_logo_url?: string;
  company_poster_url?: string;
}

export default function ProfilePage() {
  const { profile, user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sellerAnalytics, setSellerAnalytics] = useState<SellerAnalytics | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [subcategories, setSubcategories] = useState<Array<{ id: string; name: string; category_id: string | null }>>([]);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const { toast } = useToast();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editCompanyOpen, setEditCompanyOpen] = useState(false);
  const [editAvatarOpen, setEditAvatarOpen] = useState(false);
  const [editLogoOpen, setEditLogoOpen] = useState(false);
  
  // Get active tab from URL on client side
  const [activeTab, setActiveTab] = useState('dashboard');
  
  useEffect(() => {
    // Update active tab from URL on mount
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newUrl = `${window.location.pathname}?tab=${value}`;
    window.history.pushState({}, '', newUrl);
  };

  // Transform categories and subcategories into grouped options format
  const categoryOptions = categories.map(cat => ({
    label: cat.name,
    value: cat.name.toLowerCase(),
    options: subcategories
      .filter(sub => sub.category_id === cat.id)
      .map(sub => ({
        label: sub.name,
        value: sub.name.toLowerCase()
      }))
  })).filter(cat => cat.options.length > 0); // Only include categories that have subcategories

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

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', user.id);
        
        if (productsError) throw productsError;
        setProducts(productsData || []);

        // Fetch seller analytics
        const { data: analyticsData, error: analyticsError } = await supabase
          .rpc('get_seller_product_analytics', { _seller_id: user.id });
        
        if (analyticsError) throw analyticsError;
        setSellerAnalytics(analyticsData?.[0] || null);

        // Fetch top performing products
        const { data: topProductsData, error: topProductsError } = await supabase
          .rpc('get_top_performing_products', { 
            _seller_id: user.id,
            _limit: 3
          });
        
        if (topProductsError) throw topProductsError;
        setTopProducts(topProductsData || []);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, supabase]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [categoriesResponse, subcategoriesResponse] = await Promise.all([
          supabase.from('categories').select('id, name'),
          supabase.from('subcategories').select('id, name, category_id')
        ]);
        
        if (categoriesResponse.error) throw categoriesResponse.error;
        if (subcategoriesResponse.error) throw subcategoriesResponse.error;
        
        setCategories(categoriesResponse.data || []);
        setSubcategories(subcategoriesResponse.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [supabase]);

  if (!profile || !user) {
    return null;
  }

  const companyProfile = profile.company_profile as CompanyProfile | null;

  // Transform company profile data to match form fields
  const transformedCompanyData = {
    company_profile: {
      company_name: companyProfile?.company_name || "",
      company_address: companyProfile?.company_address || "",
      company_description: companyProfile?.company_description || "",
      overview: {
        mainProducts: companyProfile?.overview?.mainProducts || "",
        totalEmployees: companyProfile?.overview?.totalEmployees?.toString() || "",
        yearsExporting: companyProfile?.overview?.yearsExporting?.toString() || "",
        yearEstablished: companyProfile?.overview?.yearEstablished || ""
      },
      productionCapacity: {
        factorySize: companyProfile?.productionCapacity?.factorySize?.toString() || "",
        annualOutput: companyProfile?.productionCapacity?.annualOutput?.toString() || "",
        productionLines: companyProfile?.productionCapacity?.productionLines?.toString() || "",
        qualityControlStaff: companyProfile?.productionCapacity?.qualityControlStaff?.toString() || ""
      },
      social_media: {
        linkedin: companyProfile?.social_media?.linkedin || "",
        twitter: companyProfile?.social_media?.twitter || "",
        facebook: companyProfile?.social_media?.facebook || ""
      }
    }
  };

  const calculateConversionRate = (analytics: SellerAnalytics | null) => {
    if (!analytics?.total_views || !analytics?.total_orders) return "0%";
    return `${((analytics.total_orders / analytics.total_views) * 100).toFixed(1)}%`;
  };

  const stats = [
    { 
      label: "Total Products", 
      value: sellerAnalytics?.total_products?.toString() || "0", 
      icon: Store,
      tooltip: "Products in your catalog",
      change: null
    },
    { 
      label: "Total Views", 
      value: sellerAnalytics?.total_views?.toString() || "0", 
      icon: Eye,
      tooltip: "Product page views",
      change: null
    },
    { 
      label: "Total Orders", 
      value: sellerAnalytics?.total_orders?.toString() || "0", 
      icon: ShoppingCart,
      tooltip: "Successful orders",
      change: null
    },
    { 
      label: "Conversion Rate", 
      value: calculateConversionRate(sellerAnalytics), 
      icon: TrendingUp,
      tooltip: "Views to orders ratio",
      change: null
    }
  ];

  const handleProfileUpdate = async (data: any) => {
    try {
      // Check if any field has actually changed
      const hasChanges = Object.keys(data).some(key => 
        data[key] !== profile[key as keyof typeof profile]
      );

      if (!hasChanges) {
        setEditProfileOpen(false);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone_number,
          business_category: data.business_category,
          designation: data.designation
        })
        .eq('id', profile.id);

      if (error) throw error;

      // Record activity only if changes were made
      await recordActivity({
        user_id: user.id,
        activity_type: 'PROFILE_UPDATE',
        entity_type: 'PROFILE',
        entity_id: profile.id,
        description: 'Updated profile information',
        metadata: {
          updated_fields: Object.keys(data).filter(key => 
            data[key] !== profile[key as keyof typeof profile]
          )
        }
      });

      setEditProfileOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCompanyUpdate = async (data: any) => {
    try {
      setLoading(true);
      
      // Extract company_profile data and merge with existing profile
      const updatedProfile = {
        company_name: data.company_profile.company_name,
        company_address: data.company_profile.company_address,
        company_description: data.company_profile.company_description,
        company_logo_url: companyProfile?.company_logo_url,
        company_poster_url: companyProfile?.company_poster_url,
        overview: {
          mainProducts: data.company_profile.overview?.mainProducts,
          totalEmployees: Number(data.company_profile.overview?.totalEmployees),
          yearsExporting: Number(data.company_profile.overview?.yearsExporting),
          yearEstablished: data.company_profile.overview?.yearEstablished
        },
        productionCapacity: {
          factorySize: Number(data.company_profile.productionCapacity?.factorySize),
          annualOutput: Number(data.company_profile.productionCapacity?.annualOutput),
          productionLines: Number(data.company_profile.productionCapacity?.productionLines),
          qualityControlStaff: Number(data.company_profile.productionCapacity?.qualityControlStaff)
        },
        social_media: {
          linkedin: data.company_profile.social_media?.linkedin || '',
          twitter: data.company_profile.social_media?.twitter || '',
          facebook: data.company_profile.social_media?.facebook || ''
        }
      };

      const { error } = await supabase
        .from('profiles')
        .update({
          company_profile: updatedProfile
        })
        .eq('id', profile.id);

      if (error) throw error;

      // Record activity
      await recordActivity({
        user_id: user.id,
        activity_type: 'COMPANY_UPDATE',
        entity_type: 'COMPANY',
        entity_id: profile.id,
        description: 'Updated company information',
        metadata: {
          updated_fields: Object.keys(data.company_profile)
        }
      });

      // Close dialog and refresh page with company tab active
      setEditCompanyOpen(false);
      window.location.href = window.location.pathname + '?tab=company';
    } catch (error) {
      console.error('Error updating company profile:', error);
      // Re-throw error to be handled by the form
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = async (imageUrl: string | null) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Update profile avatar
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: imageUrl })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Record activity
      await recordActivity({
        user_id: user.id,
        activity_type: 'AVATAR_UPDATE',
        entity_type: 'PROFILE',
        entity_id: user.id,
        description: imageUrl ? 'Updated profile picture' : 'Removed profile picture',
      });

    } catch (error) {
      console.error('Error updating avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpdate = async (imageUrl: string | null) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const updatedCompanyProfile = {
        ...companyProfile,
        logo_url: imageUrl
      };
      
      // Update company logo
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          company_profile: updatedCompanyProfile
        })
        .eq('user_id', user.id);
      
      if (profileError) throw profileError;

      // Record activity
      await recordActivity({
        user_id: user.id,
        activity_type: 'COMPANY_LOGO_UPDATE',
        entity_type: 'COMPANY',
        entity_id: user.id,
        description: imageUrl ? 'Updated company logo' : 'Removed company logo',
      });

    } catch (error) {
      console.error('Error updating company logo:', error);
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container max-w-7xl mx-auto py-10 px-4">
        <div className="flex gap-8">
          {/* Fixed Profile Section - Left Side */}
                <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-1/4 shrink-0 space-y-6"
          >
            <div className="sticky top-10">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    {/* Avatar Section */}
                    <div className="relative">
                      <Avatar 
                        className="h-32 w-32 mx-auto ring-4 ring-brand-200/20 shadow-xl cursor-pointer group"
                        onClick={() => setEditAvatarOpen(true)}
                      >
                        <AvatarImage 
                          src={profile.avatar_url || ""} 
                          alt={`${profile.first_name} ${profile.last_name}`}
                          className="object-cover group-hover:opacity-75 transition-opacity"
                        />
                        <AvatarFallback className="text-3xl bg-brand-200 text-white">
                          {profile.first_name?.[0]?.toUpperCase()}
                          {profile.last_name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                          <Edit className="h-6 w-6" />
                        </div>
                      </Avatar>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-brand-200 text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                        {profile.user_type}
                      </div>
                    </div>

                    {/* Profile Info Section */}
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-200 to-brand-300 bg-clip-text text-transparent">
                        {profile.first_name} {profile.last_name}
                      </h1>
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile.designation || "No designation set"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="secondary" className="w-full py-1.5 bg-brand-100/10">
                        <MapPin className="w-4 w-4 mr-2 text-brand-200" />
                        {profile.country}
                      </Badge>
                      {profile.business_category && (
                        <Badge variant="secondary" className="w-full py-1.5 bg-brand-100/10">
                          <Briefcase className="w-4 w-4 mr-2 text-brand-200" />
                          {profile.business_category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
                        </Badge>
                      )}
                    </div>

                    <div className="pt-4 space-y-3 border-t border-brand-100/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-sm">
                          <Mail className="h-4 w-4 text-brand-200" />
                          <span className="text-muted-foreground">{profile.email}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-brand-200 hover:text-brand-300 hover:bg-transparent p-0"
                          onClick={() => setEditProfileOpen(true)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <Phone className="h-4 w-4 text-brand-200" />
                        <span className="text-muted-foreground">{profile.phone_number}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <Calendar className="h-4 w-4 text-brand-200" />
                        <span className="text-muted-foreground">Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <Clock className="h-4 w-4 text-brand-200" />
                        <span className="text-muted-foreground">Last active {new Date(profile.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {profile.user_type === "SELLER" && (
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10 mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-brand-200">Seller Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Response Rate</span>
                        <span className="font-medium">95%</span>
                      </div>
                      <Progress value={95} className="bg-brand-100/10 h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Order Completion</span>
                        <span className="font-medium">88%</span>
                      </div>
                      <Progress value={88} className="bg-brand-100/10 h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Customer Satisfaction</span>
                        <span className="font-medium">4.8/5</span>
                      </div>
                      <Progress value={96} className="bg-brand-100/10 h-2" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>

          {/* Main Content - Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="space-y-8">
              <TabsList className="inline-flex h-14 items-center justify-start rounded-xl bg-brand-100/10 p-1 text-muted-foreground w-full">
                <TabsTrigger 
                  value="dashboard"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-5 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-brand-200 data-[state=active]:shadow-sm h-11"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="orders"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-5 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-brand-200 data-[state=active]:shadow-sm h-11"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </TabsTrigger>
                {profile.user_type === "SELLER" && (
                  <>
                    <TabsTrigger 
                      value="products"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-5 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-brand-200 data-[state=active]:shadow-sm h-11"
                    >
                      <Store className="h-4 w-4 mr-2" />
                      Products
                    </TabsTrigger>
                    <TabsTrigger 
                      value="company"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-5 py-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-brand-200 data-[state=active]:shadow-sm h-11"
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Company
                    </TabsTrigger>
                  </>
                )}
              </TabsList>

              <TabsContent value="dashboard">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-6"
                >
                  {profile.user_type === "SELLER" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {stats.map((stat, index) => (
                        <TooltipProvider key={stat.label} delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div variants={item}>
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
                                  <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                      <stat.icon className="h-8 w-8 text-brand-200" />
                                      <Badge variant="secondary" className="bg-brand-100/10">
                                        {stat.change}
                                      </Badge>
                                    </div>
                                    <div className="mt-4">
                                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent 
                              side="top" 
                              align="center"
                              className="bg-white/95 backdrop-blur-sm border border-brand-100/20 text-brand-800 text-xs"
                            >
                              {stat.tooltip}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Buyer Dashboard */}
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
                        <CardHeader className="border-b border-brand-100/20 pb-4">
                          <CardTitle className="text-xl text-brand-200">Account Overview</CardTitle>
                          <CardDescription>Your buyer account status and activity</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="border border-brand-100/20">
                              <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                  <div className="p-3 rounded-full bg-brand-100/10">
                                    <Package className="h-6 w-6 text-brand-200" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Total Orders</p>
                                    <h3 className="text-2xl font-bold">0</h3>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border border-brand-100/20">
                              <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                  <div className="p-3 rounded-full bg-brand-100/10">
                                    <Clock className="h-6 w-6 text-brand-200" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Active Orders</p>
                                    <h3 className="text-2xl font-bold">0</h3>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border border-brand-100/20">
                              <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                  <div className="p-3 rounded-full bg-brand-100/10">
                                    <Star className="h-6 w-6 text-brand-200" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Reviews Given</p>
                                    <h3 className="text-2xl font-bold">0</h3>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Become a Seller Card */}
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-2">
                              <h3 className="text-xl font-semibold text-brand-200">Become a Seller</h3>
                              <p className="text-muted-foreground">Start selling your products and reach customers worldwide</p>
                            </div>
                            <Button 
                              className="bg-brand-200 hover:bg-brand-300 text-white"
                              onClick={() => router.push('/become-seller')}
                            >
                              <Store className="h-4 w-4 mr-2" />
                              Convert to Seller Account
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Recent Activity */}
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
                        <CardHeader className="border-b border-brand-100/20 pb-4">
                          <CardTitle className="text-xl text-brand-200">Recent Activity</CardTitle>
                          <CardDescription>Your latest interactions and updates</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-6">
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-full bg-brand-100/10">
                                <User className="h-4 w-4 text-brand-200" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Account Created</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(profile.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="orders">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
                  <CardHeader className="border-b border-brand-100/20 pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl text-brand-200">Orders</CardTitle>
                        <CardDescription>Track and manage your orders</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-brand-200 border-brand-200">
                          <Clock className="h-4 w-4 mr-2" />
                          Active
                        </Button>
                        <Button variant="outline" size="sm" className="text-muted-foreground">
                          <Package className="h-4 w-4 mr-2" />
                          Completed
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {profile.user_type === "BUYER" ? (
                      <div className="space-y-6">
                        {/* Order Tracking Section */}
                        <div className="rounded-lg border border-brand-100/20 overflow-hidden">
                          <div className="p-4 bg-brand-100/5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">No active orders</p>
                                <p className="text-xs text-muted-foreground">Start shopping to see your orders here</p>
                              </div>
                              <Button 
                                className="bg-brand-200 hover:bg-brand-300 text-white"
                                onClick={() => router.push('/products')}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Browse Products
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Order History */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-brand-200">Order History</h3>
                          <div className="text-center py-8">
                            <Package className="h-12 w-12 mx-auto text-brand-200 mb-4" />
                            <p className="text-muted-foreground">You haven't placed any orders yet</p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Your order history will appear here once you start making purchases
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                      >
                        <Package className="h-12 w-12 mx-auto text-brand-200 mb-4" />
                        <p className="text-muted-foreground">Your orders will appear here.</p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {profile.user_type === "SELLER" && (
                <TabsContent value="products">
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                  >
                    {/* Product Analytics Section */}
                      <motion.div
                      variants={stagger}
                      className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                      <motion.div variants={slideUp}>
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Total Products</p>
                                <p className="text-2xl font-bold">{sellerAnalytics?.total_products || 0}</p>
                              </div>
                              <Store className="h-8 w-8 text-brand-200" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div variants={slideUp}>
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Total Views</p>
                                <p className="text-2xl font-bold">{sellerAnalytics?.total_views || 0}</p>
                              </div>
                              <div className="bg-brand-100/10 p-2 rounded-full">
                                <Eye className="h-8 w-8 text-brand-200" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div variants={slideUp}>
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                                <p className="text-2xl font-bold">{sellerAnalytics?.overall_conversion_rate.toFixed(1) || 0}%</p>
                              </div>
                              <div className="bg-brand-100/10 p-2 rounded-full">
                                <TrendingUp className="h-8 w-8 text-brand-200" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>

                    {/* Products List Section */}
                    <motion.div variants={fadeIn}>
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
                        <CardHeader className="border-b border-brand-100/20 pb-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-xl text-brand-200">Your Products</CardTitle>
                              <CardDescription>Manage and monitor your product listings</CardDescription>
                            </div>
                            <Button 
                              className="bg-brand-200 hover:bg-brand-300 text-white"
                              onClick={() => router.push(`/create-product/${user.id}`)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Product
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          {loading ? (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex justify-center items-center py-12"
                            >
                              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-200"></div>
                            </motion.div>
                          ) : products.length > 0 ? (
                            <motion.div 
                              variants={stagger}
                              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                              {products.map((product) => (
                                <motion.div 
                                  key={product.product_id}
                                  variants={slideUp}
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  <Card className="overflow-hidden border border-brand-100/20 hover:border-brand-200/30 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/products/${product.product_id}`)}
                                  >
                                    <div className="aspect-square relative bg-gradient-to-br from-brand-100/20 to-brand-200/10">
                                      {product.image_urls?.[0] ? (
                                        <img 
                                          src={product.image_urls[0]} 
                                          alt={product.headline} 
                                          className="absolute inset-0 w-full h-full object-cover"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.parentElement?.querySelector('.fallback')?.classList.remove('hidden');
                                          }}
                                        />
                                      ) : null}
                                      <div className={`fallback absolute inset-0 flex flex-col items-center justify-center text-brand-200 bg-gradient-to-br from-brand-100/20 to-brand-200/10 ${product.image_urls?.[0] ? 'hidden' : ''}`}>
                                        <Package className="h-12 w-12 mb-2" />
                                        <span className="text-sm text-brand-200/70">No image available</span>
                                      </div>
                                    </div>
                                    <CardContent className="p-4">
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <h3 className="font-medium truncate">{product.headline}</h3>
                                          <Badge variant="secondary" className="bg-brand-100/10">
                                            {product.status || 'Active'}
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">
                                          {product.description}
                                        </p>
                                        <div className="flex items-center justify-between pt-2">
                                          <p className="font-medium text-brand-200">
                                            ${product.pricing?.[0]?.price || '-'}
                                          </p>
                                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Eye className="h-4 w-4" />
                                            <span>{product.views_count || 0}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ))}
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-center py-12"
                            >
                              <Package className="h-12 w-12 mx-auto text-brand-200 mb-4" />
                              <p className="text-muted-foreground">You haven't added any products yet.</p>
                              <Button
                                className="mt-4 bg-brand-200 hover:bg-brand-300 text-white"
                                onClick={() => router.push('/create-product')}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Your First Product
                              </Button>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>
              )}

              {profile.user_type === "SELLER" && (
                <TabsContent value="company">
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                  >
                    {/* Company Identity Section */}
                    <motion.div variants={slideUp}>
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
                        <CardHeader className="border-b border-brand-100/20 pb-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-xl text-brand-200">Company Identity</CardTitle>
                              <CardDescription>Your company's brand and visual identity</CardDescription>
                            </div>
                            <Button
                              variant="outline" 
                              className="text-brand-200 border-brand-200 hover:bg-brand-100/10"
                              onClick={() => setEditCompanyOpen(true)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Details
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Logo and Media */}
                            <div>
                              <div 
                                className="aspect-video relative rounded-lg bg-gradient-to-br from-brand-100/20 to-brand-200/10 cursor-pointer group overflow-hidden"
                                onClick={() => setEditLogoOpen(true)}
                              >
                                {companyProfile?.company_logo_url ? (
                                  <div className="relative w-full h-full">
                                    <img 
                                      src={companyProfile.company_logo_url} 
                                      alt="Company logo"
                                      className="w-full h-full object-contain p-4 group-hover:opacity-75 transition-opacity"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Edit className="h-6 w-6" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center h-full text-brand-200 group-hover:text-brand-300 transition-colors">
                                    <Building2 className="h-12 w-12 mb-2" />
                                    <p className="text-sm">Click to add company logo</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Basic Info */}
                            <div className="space-y-4">
                              <div className="p-4 rounded-lg bg-brand-100/5 border border-brand-100/20">
                                <h3 className="text-sm font-semibold text-brand-200 mb-4">Basic Information</h3>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Company Name</span>
                                    <span className="text-sm font-medium">{companyProfile?.company_name || "Not Set"}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Business Category</span>
                                    <span className="text-sm font-medium">
                                      {profile.business_category ? 
                                        profile.business_category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') 
                                        : "Not Set"}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Year Established</span>
                                    <span className="text-sm font-medium">
                                      {companyProfile?.overview?.yearEstablished ? 
                                        new Date(companyProfile.overview.yearEstablished).getFullYear() : 
                                        "Not Set"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="p-4 rounded-lg bg-brand-100/5 border border-brand-100/20">
                                <h3 className="text-sm font-semibold text-brand-200 mb-4">Contact Information</h3>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Address</span>
                                    <span className="text-sm font-medium">{companyProfile?.company_address || "Not Set"}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Website</span>
                                    {companyProfile?.website ? (
                                      <a 
                                        href={companyProfile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-brand-200 hover:text-brand-300 transition-colors"
                                      >
                                        {companyProfile.website}
                                      </a>
                                    ) : (
                                      <span className="text-sm font-medium">Not Set</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Company Overview Section */}
                    <motion.div variants={slideUp}>
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
                        <CardHeader className="border-b border-brand-100/20 pb-4">
                          <CardTitle className="text-xl text-brand-200">Company Overview</CardTitle>
                          <CardDescription>Key information about your business</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-4 rounded-lg bg-brand-100/5 border border-brand-100/20">
                              <div className="flex items-center gap-3 mb-4">
                                <Building2 className="h-5 w-5 text-brand-200" />
                                <h3 className="text-sm font-semibold text-brand-200">Business Profile</h3>
                              </div>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Main Products</span>
                                  <span className="text-sm font-medium">{companyProfile?.overview?.mainProducts || "Not Set"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Total Employees</span>
                                  <span className="text-sm font-medium">{companyProfile?.overview?.totalEmployees || "Not Set"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Years Exporting</span>
                                  <span className="text-sm font-medium">{companyProfile?.overview?.yearsExporting || "Not Set"}</span>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 rounded-lg bg-brand-100/5 border border-brand-100/20">
                              <div className="flex items-center gap-3 mb-4">
                                <Globe className="h-5 w-5 text-brand-200" />
                                <h3 className="text-sm font-semibold text-brand-200">Company Description</h3>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {companyProfile?.company_description || "Not Set"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Production Capabilities Section */}
                    <motion.div variants={slideUp}>
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
                        <CardHeader className="border-b border-brand-100/20 pb-4">
                          <CardTitle className="text-xl text-brand-200">Production Capabilities</CardTitle>
                          <CardDescription>Manufacturing facilities and capacity details</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-4 rounded-lg bg-brand-100/5 border border-brand-100/20">
                              <div className="flex items-center gap-3 mb-4">
                                <Package className="h-5 w-5 text-brand-200" />
                                <h3 className="text-sm font-semibold text-brand-200">Production Capacity</h3>
                              </div>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Factory Size</span>
                                  <span className="text-sm font-medium">{companyProfile?.productionCapacity?.factorySize ? `${companyProfile.productionCapacity.factorySize} sqm` : "Not Set"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Annual Output</span>
                                  <span className="text-sm font-medium">{companyProfile?.productionCapacity?.annualOutput ? `${companyProfile.productionCapacity.annualOutput} units` : "Not Set"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Production Lines</span>
                                  <span className="text-sm font-medium">{companyProfile?.productionCapacity?.productionLines || "Not Set"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">QC Staff</span>
                                  <span className="text-sm font-medium">{companyProfile?.productionCapacity?.qualityControlStaff || "Not Set"}</span>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 rounded-lg bg-brand-100/5 border border-brand-100/20">
                              <div className="flex items-center gap-3 mb-4">
                                <Star className="h-5 w-5 text-brand-200" />
                                <h3 className="text-sm font-semibold text-brand-200">Quality Control</h3>
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="bg-brand-100/10">ISO 9001</Badge>
                                  <Badge variant="secondary" className="bg-brand-100/10">Quality Inspection</Badge>
                                  <Badge variant="secondary" className="bg-brand-100/10">In-house Testing</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Our quality control process ensures consistent product quality through rigorous testing and inspection procedures.
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Verification Status */}
                    <motion.div variants={slideUp}>
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-brand-100/10">
                        <CardHeader className="border-b border-brand-100/20 pb-4">
                          <CardTitle className="text-xl text-brand-200">Verification Status</CardTitle>
                          <CardDescription>Company verification and documentation status</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-4 rounded-lg bg-brand-100/5 border border-brand-100/20">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <h3 className="font-medium">Company Verification</h3>
                                  <p className="text-sm text-muted-foreground">Your company is verified and active</p>
                                </div>
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Verified
                                </Badge>
                              </div>
                            </div>
                            <div className="p-4 rounded-lg bg-brand-100/5 border border-brand-100/20">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <h3 className="font-medium">Documentation</h3>
                                  <p className="text-sm text-muted-foreground">All required documents are up to date</p>
                                </div>
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Complete
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>
              )}
            </Tabs>
          </motion.div>
          </div>
      </div>
      <EditDialog
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        title="Edit Profile"
        description="Update your personal information"
        fields={updatedProfileFields}
        schema={ProfileSchema}
        onSubmit={handleProfileUpdate}
        initialData={{
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone_number: profile.phone_number,
          business_category: profile.business_category,
          designation: profile.designation
        }}
      />

      <EditDialog
        open={editCompanyOpen}
        onOpenChange={setEditCompanyOpen}
        title="Edit Company Details"
        description="Update your company information"
        fields={companyFormFields}
        schema={CompanySchema}
        onSubmit={handleCompanyUpdate}
        initialData={transformedCompanyData}
        loading={loading}
      />

      <ImageEditDialog
        open={editAvatarOpen}
        onOpenChange={setEditAvatarOpen}
        title="Edit Profile Picture"
        description="Upload a new profile picture"
        currentImage={profile.avatar_url}
        onSave={handleAvatarUpdate}
      />

      <ImageEditDialog
        open={editLogoOpen}
        onOpenChange={setEditLogoOpen}
        title="Edit Company Logo"
        description="Upload a new company logo"
        currentImage={companyProfile?.logo_url || null}
        onSave={handleLogoUpdate}
        aspectRatio="wide"
      />
    </div>
  );
}
