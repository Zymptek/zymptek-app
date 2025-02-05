import { Database } from "@/lib/database.types";
import type { Json } from "@/lib/database.types";

// Company types from database schema
export type Company = Database['public']['Tables']['companies']['Row'];
export type CompanyInsert = Database['public']['Tables']['companies']['Insert'];
export type CompanyUpdate = Database['public']['Tables']['companies']['Update'];

// Helper types for JSON fields
export interface ProductionCapacity {
  factorySize?: number | null;
  annualOutput?: number | null;
  productionLines?: number | null;
  qualityControlStaff?: number | null;
}

export interface SocialMedia {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}

export interface QualityControl {
  staff_count?: number;
  processes?: string[];
  certificates?: string[];
}

export interface CompanyProfile {
  industry?: string;
  certifications?: string[];
  markets?: string[];
  languages?: string[];
  business_type?: string;
  registered_capital?: string;
  factory_location?: string;
  quality_control?: QualityControl;
}

// Extended company type with metadata
export interface CompanyWithMetadata extends Omit<Database['public']['Tables']['companies']['Row'], 'company_profile'> {
  documents?: Array<{
    document_type: string;
    document_url: string;
    verified: boolean;
  }>;
  stats?: {
    total_products: number;
    total_orders: number;
    response_rate: number;
    avg_response_time: number;
  };
}

// Helper function to safely parse JSON fields
export const parseJsonField = <T,>(field: any | null | undefined, defaultValue: T): T => {
  if (!field) return defaultValue;
  try {
    return (typeof field === 'string' ? JSON.parse(field) : field) as T;
  } catch {
    return defaultValue;
  }
}; 