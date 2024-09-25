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

type User = Tables<'profiles'>

type SellerData = {
  overview?: {
    yearEstablished?: Date;
    totalEmployees?: number;
    mainProducts?: string;
    categories?: string[];
    yearsExporting?: number;
  };
  productionCapacity?: {
    factorySize?: number;
    productionLines?: number;
    annualOutput?: number;
    qualityControlStaff?: number;
  };
  company_name: string;
  company_address: string;
  company_logo_url: string;
  company_poster_url: string;
  company_start_date: string; // Format: YYYY-MM-DD
  company_description: string;
};

export type FieldType = 'text' | 'number' | 'textarea' | 'date' | 'select' | 'multiselect';

export type FieldProps = {
  type: FieldType;
  name: string;
  options?: { label: string; value: string }[]; 
};

// Field configurations
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

// Schemas
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

const SellerProfilePage =  ({ params }: { params: { sellerId: string } }) => {
  const { sellerId } = params;
  const supabase = createClientComponentClient()
  const { toast } = useToast();
  const [seller, setSeller] = useState<User | null>(null);
  const [sellerCompanyProfile, setSellerCompanyProfile] = useState<SellerData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()


  const { user } = useAuth();

  // Fetch the full profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sellerId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }

      if (data) {
        // Assuming the company profile structure is similar to SellerData
        setSellerCompanyProfile(data.company_profile);
        setSeller(data);
      }
      setLoading(false);

    };

    fetchProfile();
  }, [sellerId]);

  const handleSubmit = (section: string) => async (newData: any) => {
    if (!sellerCompanyProfile) return;

    try {
      // Merge the new data under the appropriate section

      const updatedProfile = {
        ...sellerCompanyProfile,
        [section]: {
          ...newData,
        },
      };

      // Update the profile in Supabase
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
      };

      window.location.href=`/seller/${sellerId}` // Update the state with the new profile
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
  }

  if (!sellerCompanyProfile || !seller) {
    notFound()
  }

  return (
    <div className="bg-background-light min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className='sticky top-0 z-10 shadow-l'>
          <header className="bg-gradient-brand text-white p-4 rounded-t-lg">
            <div className="container mx-auto flex items-center flex-wrap">
              <Image src={sellerCompanyProfile.company_logo_url} alt={sellerCompanyProfile.company_name} width={100} height={100} className="mr-4" />
              <div>
                <h1 className="text-2xl font-bold">{sellerCompanyProfile.company_name}</h1>

                <p>{sellerCompanyProfile.company_address}</p>
              </div>
            </div>
          </header>

          <StickySubNav />
        </div>

        <main className="container mx-auto py-8 px-5 flex flex-col md:flex-row">
          <div className="flex-grow md:w-4/5 md:pr-4">
              <SellerProfileCards
                isAuthUser={sellerId === user!.id}
                title="Overview"
                id="overview"
                sellerId={sellerId}
                data={sellerCompanyProfile.overview}
                fieldConfig={overviewFieldConfig!}
                schema={overviewSchema}
                onSubmit={handleSubmit('overview')}

              />

              <SellerProfileCards
                isAuthUser={sellerId === user!.id}
                title="Production"
                id="production"
                sellerId={sellerId}
                data={sellerCompanyProfile.productionCapacity!}
                fieldConfig={productionCapacityFieldConfig}
                schema={productionCapacitySchema}

                onSubmit={handleSubmit('productionCapacity')}
              />

            <ProductCard user={seller as User} />

            {/* Add more sections here as needed */}

          </div>


          <div className="w-full md:w-1/4 mt-6 md:mt-0">
            <StickyContactCard supplierInfo={{isAuthUser: sellerId === user!.id, sellerId ,companyName: sellerCompanyProfile.company_name, location: sellerCompanyProfile.company_address, description: sellerCompanyProfile.company_description}} />
          </div>
        </main>
      </div>

    </div>
  );
};

export default SellerProfilePage;