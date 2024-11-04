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
      categories: {
        Row: {
          icon: string
          id: string
          name: string
        }
        Insert: {
          icon: string
          id?: string
          name: string
        }
        Update: {
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      chat_audit_logs: {
        Row: {
          created_at: string | null
          event_details: Json
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_details: Json
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_details?: Json
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      conversation_user_status: {
        Row: {
          conversation_id: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_user_status_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_user_status_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          buyer_id: string
          created_at: string | null
          id: string
          last_message_at: string | null
          product_id: string
          seller_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          product_id: string
          seller_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          product_id?: string
          seller_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_buyer_id_fkey1"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "conversations_seller_id_fkey1"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          encrypted_key: string | null
          file_path: string | null
          file_type: string | null
          id: string
          is_encrypted: boolean | null
          is_read: boolean | null
          sender_id: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          encrypted_key?: string | null
          file_path?: string | null
          file_type?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_read?: boolean | null
          sender_id: string
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          encrypted_key?: string | null
          file_path?: string | null
          file_type?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_read?: boolean | null
          sender_id?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey1"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string
          created_at: string | null
          customization: Json | null
          description: string | null
          headline: string
          image_urls: string[]
          moq: number | null
          packaging: Json | null
          payment_terms: string | null
          pricing: Json[] | null
          product_id: string
          sample_available: boolean | null
          seller_id: string
          shipping_info: Json | null
          shipping_terms: string | null
          specifications: Json | null
          subcategory_id: string | null
          updated_at: string | null
          variations: Json | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          customization?: Json | null
          description?: string | null
          headline: string
          image_urls?: string[]
          moq?: number | null
          packaging?: Json | null
          payment_terms?: string | null
          pricing?: Json[] | null
          product_id?: string
          sample_available?: boolean | null
          seller_id: string
          shipping_info?: Json | null
          shipping_terms?: string | null
          specifications?: Json | null
          subcategory_id?: string | null
          updated_at?: string | null
          variations?: Json | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          customization?: Json | null
          description?: string | null
          headline?: string
          image_urls?: string[]
          moq?: number | null
          packaging?: Json | null
          payment_terms?: string | null
          pricing?: Json[] | null
          product_id?: string
          sample_available?: boolean | null
          seller_id?: string
          shipping_info?: Json | null
          shipping_terms?: string | null
          specifications?: Json | null
          subcategory_id?: string | null
          updated_at?: string | null
          variations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_subcategory"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
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
          avatar_url?: string | null
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
          avatar_url?: string | null
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
        Relationships: []
      }
      subcategories: {
        Row: {
          category_id: string | null
          icon: string
          id: string
          name: string
        }
        Insert: {
          category_id?: string | null
          icon: string
          id?: string
          name: string
        }
        Update: {
          category_id?: string | null
          icon?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_products: {
        Args: {
          p_page: number
          p_items_per_page: number
          p_sort_by: string
          p_category_id?: string
          p_subcategory_id?: string
          p_search_term?: string
          p_min_price?: number
          p_max_price?: number
        }
        Returns: {
          product_id: string
          category_id: string
          subcategory_id: string
          seller_id: string
          headline: string
          description: string
          created_at: string
          updated_at: string
          image_urls: string[]
          pricing: Json[]
          specifications: Json
          customization: Json
          packaging: Json
          shipping_info: Json
          variations: Json
          moq: number
          sample_available: boolean
          payment_terms: string
          shipping_terms: string
          category_name: string
          subcategory_name: string
        }[]
      }
      get_sellers: {
        Args: {
          p_page: number
          p_items_per_page: number
          p_search_term?: string
        }
        Returns: {
          user_id: string
          first_name: string
          last_name: string
          user_type: string
          company_profile: Json
        }[]
      }
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
