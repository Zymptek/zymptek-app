"use client";

import { EditDialog } from "@/components/shared/EditDialog";
import { CompanySchema, CompanyFormValues } from "@/lib/schema/profile/profile-form-schema";
import { companyFormFields } from "@/lib/schema/profile/form-fields";
import type { Database } from "@/lib/database.types";
import { 
  CompanyWithMetadata, 
  ProductionCapacity, 
  SocialMedia, 
  parseJsonField 
} from "@/lib/types/company";
import { useCompany } from "@/context/CompanyContext";

interface CompanyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CompanyFormValues) => Promise<void>;
  loading?: boolean;
}

export function CompanyForm({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}: CompanyFormProps) {
  const { company } = useCompany();

  // Transform company data to match form fields
  const transformedData = {
    company_profile: {
      company_name: company?.name || "",
      company_address: company?.address || "",
      company_description: company?.description || "",
      overview: {
        mainProducts: company?.main_products?.join(', ') || "",
        totalEmployees: company?.employee_count?.toString() || "",
        dateEstablished: company?.year_established || "",
        industry: company?.business_category || "",
      },
      productionCapacity: parseJsonField<ProductionCapacity>(company?.production_capacity, {
        factorySize: null,
        annualOutput: null,
        productionLines: null,
        qualityControlStaff: null
      }),
      social_media: parseJsonField<SocialMedia>(company?.social_media, {
        linkedin: "",
        twitter: "",
        facebook: ""
      })
    }
  };

  return (
    <EditDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Company Details"
      description="Update your company information"
      fields={companyFormFields}
      schema={CompanySchema}
      onSubmit={onSubmit}
      initialData={transformedData}
      loading={loading}
    />
  );
} 