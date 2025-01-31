"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { SellerProfileCards } from '@/components/seller-profile/seller-profile-card/SellerProfileCard';
import StickySubNav from '@/components/seller-profile/StickySubNav';
import StickyContactCard from '@/components/seller-profile/StickyContactCard';
import { Loading } from '@/components/Loading';
import { z } from 'zod';
import { notFound, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import ProductCard from '@/components/seller-profile/product-card/ProductCard';
import { Tables } from '@/lib/database.types';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building, Package, Star, ChevronDown, Calendar, Users, Briefcase, Factory, Truck, Award, Shield, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SellerData } from '../types';

type User = Tables<'profiles'>

export type FieldType = 'text' | 'number' | 'textarea' | 'date' | 'select' | 'multiselect';

export type FieldProps = {
  type: FieldType;
  name: string;
  options?: { label: string; value: string }[]; 
};

const overviewFieldConfig: Record<string, FieldProps> = {
  yearEstablished: { type: 'date', name: 'Year Established' },
  totalEmployees: { type: 'number', name: 'Total Employees'},
  mainProducts: { type: 'textarea', name: 'Main Products' },
  categories: { type: 'multiselect', name: 'Categories', options: [
    { label: 'T Shirts', value: 't-shirts' },
    { label: 'Shoes', value: 'shoes' },
  ]},
  yearsExporting: { type: 'number', name: 'Years Exporting' },
};

const productionCapacityFieldConfig: Record<string, FieldProps> = {
  factorySize: { type: 'number', name: 'Factory Size' },
  productionLines: { type: 'number', name: 'Production Lines' },
  annualOutput: { type: 'number', name: 'Annual Output' },
  qualityControlStaff: { type: 'number', name: 'Quality Control Staff' },
};

const overviewSchema = z.object({
  yearEstablished: z.string()
  .refine(val => /^\d{4}-\d{2}-\d{2}$/.test(val), {
    message: 'Invalid date format'
  })
  .transform(val => new Date(val))
  .optional(),
  totalEmployees: z.string().transform(val => parseInt(val)).optional(),
  mainProducts: z.string().optional(),
  categories: z.array(z.string()).optional(),
  yearsExporting: z.string().transform(val => parseInt(val)).optional(),
});

const productionCapacitySchema = z.object({
  factorySize: z.string().transform(val => parseInt(val)).optional(),
  productionLines: z.string().transform(val => parseInt(val)).optional(),
  annualOutput: z.string().transform(val => parseInt(val)).optional(),
  qualityControlStaff: z.string().transform(val => parseInt(val)).optional(),
});

const SellerProfilePage = ({ params }: { params: { sellerId: string } }) => {
  const { sellerId } = params;
  const supabase = createClientComponentClient()
  const { toast } = useToast();
  const [seller, setSeller] = useState<User | null>(null);
  const [sellerCompanyProfile, setSellerCompanyProfile] = useState<SellerData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', sellerId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setSellerCompanyProfile(data.company_profile);
        setSeller(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [sellerId, supabase]);

  const handleSubmit = (section: string) => async (newData: any) => {
    if (!sellerCompanyProfile) return;

    try {
      const updatedProfile = {
        ...sellerCompanyProfile,
        [section]: {
          ...newData,
        },
      };

      const { error } = await supabase
        .from('profiles')
        .update({ company_profile: updatedProfile })
        .eq('id', sellerId);

      if (error) {
        toast({
          variant: "destructive",
          title: 'Error updating profile',
          description: error.message || `There was an issue updating the profile. Please try again.`
        });
      } else {
        window.location.href=`/sellers/${sellerId}`
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: 'Error updating profile',
        description: `There was an issue updating the profile. Please try again.`
      });
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if(!user && !loading){
    router.push("/sign-in")
    return null;
  }

  if (!sellerCompanyProfile || !seller) {
    notFound()
  }

  return (
    <div className="bg-background-light min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-white shadow-md">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto py-4 px-5 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
              className="relative border-2 border-brand-300 rounded-full"
            >
              <Image src={sellerCompanyProfile.company_logo_url} alt={sellerCompanyProfile.company_name} width={50} height={50} className="rounded-full" />
            </motion.div>
            <div>
                <h1 className="text-xl font-bold text-gray-800">{sellerCompanyProfile.company_name}</h1>
              <p className="text-sm text-gray-600 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {sellerCompanyProfile.company_address}
              </p>
            </div>
          </div>
        </motion.div>
        <StickySubNav />
      </header>

      <main className="flex-grow container mx-auto py-8 px-5 flex flex-col md:flex-row">
        <div className="flex-grow md:w-3/4 md:pr-8">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <SellerProfileCards
                isAuthUser={sellerId === user?.id}
                title="Overview"
                id="overview"
                sellerId={sellerId}
                data={sellerCompanyProfile.overview}
                fieldConfig={overviewFieldConfig}
                schema={overviewSchema}
                onSubmit={handleSubmit('overview')}
                icon={<User className="w-6 h-6 text-brand-300" />}
              />

              <SellerProfileCards
                isAuthUser={sellerId === user?.id}
                title="Production"
                id="production"
                sellerId={sellerId}
                data={sellerCompanyProfile.productionCapacity}
                fieldConfig={productionCapacityFieldConfig}
                schema={productionCapacitySchema}
                onSubmit={handleSubmit('productionCapacity')}
                icon={<Factory className="w-6 h-6 text-brand-300" />}
              />

              <ProductCard 
                isSeller={user?.id === sellerId} 
                user={seller}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full md:w-1/4 mt-6 md:mt-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StickyContactCard 
              supplierInfo={{
                isAuthUser: sellerId === user?.id, 
                sellerId,
                companyName: sellerCompanyProfile.company_name, 
                location: sellerCompanyProfile.company_address, 
                description: sellerCompanyProfile.company_description
              }} 
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SellerProfilePage;