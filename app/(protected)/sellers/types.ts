export type Seller = {
  user_id: string;
  first_name: string;
  last_name: string;
  user_type: string;
  company_profile: SellerData;
}
export type SellerData = {
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