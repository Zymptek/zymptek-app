import { Database } from "@/lib/database.types";

// Profile types from database schema
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Additional profile-related types
export interface ProfileWithMetadata extends Profile {
  full_name?: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  user_type: 'BUYER' | 'SELLER' | 'ADMIN';
  business_category: string | null;
  designation: string | null;
} 