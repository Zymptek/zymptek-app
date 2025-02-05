"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import { useAuth } from './AuthContext';
import type { CompanyWithMetadata } from '@/lib/types/company';
import { useToast } from '@/hooks/use-toast';

interface CompanyContextType {
  company: CompanyWithMetadata | null;
  companyId: string | null;
  verificationStatus: Database['public']['Enums']['verification_status_enum'];
  isLoading: boolean;
  refetchCompany: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

const transformCompanyData = (data: Database['public']['Tables']['companies']['Row']): CompanyWithMetadata => {
  return {
    ...data,
    documents: [], // You can fetch these separately if needed
    stats: {
      total_products: 0,
      total_orders: 0,
      response_rate: 0,
      avg_response_time: 0
    }
  };
};

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient<Database>();
  const { user } = useAuth();
  const [company, setCompany] = useState<CompanyWithMetadata | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<Database['public']['Enums']['verification_status_enum']>('not_applied');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCompany = async () => {
    if (!user) {
      setCompany(null);
      setCompanyId(null);
      setVerificationStatus('not_applied');
      setIsLoading(false);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      if (profile?.company_id) {
        const { data: companyData } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profile.company_id)
          .single();

        if (companyData) {
          const transformedCompany = transformCompanyData(companyData);
          setCompany(transformedCompany);
          setCompanyId(profile.company_id);
          setVerificationStatus(transformedCompany.verification_status || 'not_applied');
        }
      }
    } catch (error) {
      console.error('Error fetching company:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch company data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [user]);

  return (
    <CompanyContext.Provider value={{ company, companyId, verificationStatus, isLoading, refetchCompany: fetchCompany }}>
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

