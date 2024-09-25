export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attributes: {
        Row: {
          attribute_name: string
          field_type: string
          id: string
        }
        Insert: {
          attribute_name: string
          field_type?: string
          id?: string
        }
        Update: {
          attribute_name?: string
          field_type?: string
          id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      categoryattributes: {
        Row: {
          attribute_id: string
          category_id: string
          id: string
        }
        Insert: {
          attribute_id: string
          category_id: string
          id?: string
        }
        Update: {
          attribute_id?: string
          category_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categoryattributes_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "attributes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categoryattributes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string
          created_at: string | null
          dimensions: string | null
          headline: string
          id: number
          image_urls: string[]
          industry_specific_attributes: Json | null
          lead_time: Json | null
          moq: number | null
          other_attributes: Json | null
          packaging_and_delivery: Json | null
          payment_terms: string | null
          place_of_origin: string | null
          price: Json | null
          sample_available: boolean | null
          seller_id: string
          shipping_terms: string | null
          updated_at: string | null
          variations: Json | null
          weight: number | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          dimensions?: string | null
          headline: string
          id?: number
          image_urls?: string[]
          industry_specific_attributes?: Json | null
          lead_time?: Json | null
          moq?: number | null
          other_attributes?: Json | null
          packaging_and_delivery?: Json | null
          payment_terms?: string | null
          place_of_origin?: string | null
          price?: Json | null
          sample_available?: boolean | null
          seller_id: string
          shipping_terms?: string | null
          updated_at?: string | null
          variations?: Json | null
          weight?: number | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          dimensions?: string | null
          headline?: string
          id?: number
          image_urls?: string[]
          industry_specific_attributes?: Json | null
          lead_time?: Json | null
          moq?: number | null
          other_attributes?: Json | null
          packaging_and_delivery?: Json | null
          payment_terms?: string | null
          place_of_origin?: string | null
          price?: Json | null
          sample_available?: boolean | null
          seller_id?: string
          shipping_terms?: string | null
          updated_at?: string | null
          variations?: Json | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          business_category: string | null
          company_profile: Json | null
          country: string
          created_at: string
          designation: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone_number: string
          updated_at: string
          user_id: string
          user_type: string
        }
        Insert: {
          business_category?: string | null
          company_profile?: Json | null
          country: string
          created_at?: string
          designation?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone_number: string
          updated_at?: string
          user_id?: string
          user_type: string
        }
        Update: {
          business_category?: string | null
          company_profile?: Json | null
          country?: string
          created_at?: string
          designation?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone_number?: string
          updated_at?: string
          user_id?: string
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_updated_at_coloumn: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
