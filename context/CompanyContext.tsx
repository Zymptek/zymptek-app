"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

type Company = Database['public']['Tables']['companies']['Row'];
type VerificationStatus = Database['public']['Enums']['verification_status_enum'];

interface CompanyContextType {
  company: Company | null;
  setCompany: (company: Company | null) => void;
  companyId: string | null;
  verificationStatus: VerificationStatus;
  isLoading: boolean;
  refetchCompany: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('not_applied');
  const [isLoading, setIsLoading] = useState(true);
  const { user, profile } = useAuth();
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();

  const fetchCompanyData = async () => {
    if (!user?.id || !profile || profile.user_type !== 'SELLER') {
      setCompany(null);
      setCompanyId(null);
      setVerificationStatus('not_applied');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Only try to fetch if we have a company_id
      if (profile.company_id) {
        // First try to find existing company by checking the profile's company_id
        const { data: existingCompany, error: fetchError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profile.company_id)
          .single();

        if (!fetchError && existingCompany) {
          setCompany(existingCompany);
          setCompanyId(existingCompany.id);
          setVerificationStatus(existingCompany.verification_status || 'not_applied');
          setIsLoading(false);
          return;
        }
      }

      // If we don't have a company_id or couldn't find the company, create a new one
      const { data: newCompany, error: createError } = await supabase
        .from('companies')
        .insert({
          name: profile.first_name + "'s Company",
          description: '',
          verification_status: 'not_applied',
          verification_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          production_capacity: {
            factorySize: null,
            annualOutput: null,
            productionLines: null,
            qualityControlStaff: null
          },
          social_media: {
            linkedin: '',
            twitter: '',
            facebook: ''
          },
          business_category: profile.business_category || null,
          employee_count: null,
          main_products: [],
          address: null,
          website: null,
          year_established: null,
          is_active: true
        } as Database['public']['Tables']['companies']['Insert'])
        .select('*')
        .single();

      if (createError) {
        console.error('Error creating company:', createError);
        throw createError;
      }
      
      if (newCompany) {
        // Update the profile with the new company_id
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ company_id: newCompany.id })
          .eq('id', profile.id);

        if (profileUpdateError) {
          console.error('Error updating profile with company_id:', profileUpdateError);
          throw profileUpdateError;
        }

        setCompany(newCompany);
        setCompanyId(newCompany.id);
        setVerificationStatus(newCompany.verification_status || 'not_applied');
      }
    } catch (error) {
      console.error('Error fetching/creating company data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load company information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [user?.id, profile]);

  const value = {
    company,
    setCompany,
    companyId,
    verificationStatus,
    isLoading,
    refetchCompany: fetchCompanyData
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
} 

