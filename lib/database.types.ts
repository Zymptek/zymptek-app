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
      companies: {
        Row: {
          address: string | null
          business_category: string | null
          certifications: string[] | null
          created_at: string | null
          description: string | null
          employee_count: number | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          main_products: string[] | null
          name: string
          poster_url: string | null
          production_capacity: Json | null
          social_media: Json | null
          updated_at: string | null
          verification_date: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status_enum"]
            | null
          website: string | null
          year_established: string | null
        }
        Insert: {
          address?: string | null
          business_category?: string | null
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          employee_count?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          main_products?: string[] | null
          name: string
          poster_url?: string | null
          production_capacity?: Json | null
          social_media?: Json | null
          updated_at?: string | null
          verification_date?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status_enum"]
            | null
          website?: string | null
          year_established?: string | null
        }
        Update: {
          address?: string | null
          business_category?: string | null
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          employee_count?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          main_products?: string[] | null
          name?: string
          poster_url?: string | null
          production_capacity?: Json | null
          social_media?: Json | null
          updated_at?: string | null
          verification_date?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status_enum"]
            | null
          website?: string | null
          year_established?: string | null
        }
        Relationships: []
      }
      company_documents: {
        Row: {
          company_id: string | null
          document_type: string
          document_url: string
          id: string
          uploaded_at: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status_enum"]
            | null
          verified_at: string | null
        }
        Insert: {
          company_id?: string | null
          document_type: string
          document_url: string
          id?: string
          uploaded_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status_enum"]
            | null
          verified_at?: string | null
        }
        Update: {
          company_id?: string | null
          document_type?: string
          document_url?: string
          id?: string
          uploaded_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status_enum"]
            | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
          file_url: string | null
          id: string
          is_encrypted: boolean | null
          is_read: boolean | null
          sender_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          encrypted_key?: string | null
          file_path?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_read?: boolean | null
          sender_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          encrypted_key?: string | null
          file_path?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_encrypted?: boolean | null
          is_read?: boolean | null
          sender_id?: string
          status?: string
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
      order_documents: {
        Row: {
          document_url: string
          id: string
          order_id: string
          type: string
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          document_url: string
          id?: string
          order_id: string
          type: string
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          document_url?: string
          id?: string
          order_id?: string
          type?: string
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_documents_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      order_updates: {
        Row: {
          description: string | null
          id: string
          order_id: string
          type: string
          updated_at: string | null
          updated_by: string
        }
        Insert: {
          description?: string | null
          id?: string
          order_id: string
          type: string
          updated_at?: string | null
          updated_by: string
        }
        Update: {
          description?: string | null
          id?: string
          order_id?: string
          type?: string
          updated_at?: string | null
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_updates_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_updates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      orders: {
        Row: {
          agreed_price: number
          buyer_id: string
          created_at: string | null
          currency: string
          delivery_date: string
          id: string
          incoterm: Database["public"]["Enums"]["incoterm_type"]
          linked_chat_id: string
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          product_id: string
          quantity: number
          seller_id: string
          status: Database["public"]["Enums"]["order_status_type"]
          updated_at: string | null
        }
        Insert: {
          agreed_price: number
          buyer_id: string
          created_at?: string | null
          currency?: string
          delivery_date: string
          id?: string
          incoterm: Database["public"]["Enums"]["incoterm_type"]
          linked_chat_id: string
          payment_method: Database["public"]["Enums"]["payment_method_type"]
          product_id: string
          quantity: number
          seller_id: string
          status?: Database["public"]["Enums"]["order_status_type"]
          updated_at?: string | null
        }
        Update: {
          agreed_price?: number
          buyer_id?: string
          created_at?: string | null
          currency?: string
          delivery_date?: string
          id?: string
          incoterm?: Database["public"]["Enums"]["incoterm_type"]
          linked_chat_id?: string
          payment_method?: Database["public"]["Enums"]["payment_method_type"]
          product_id?: string
          quantity?: number
          seller_id?: string
          status?: Database["public"]["Enums"]["order_status_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_linked_chat_id_fkey"
            columns: ["linked_chat_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      product_views: {
        Row: {
          id: string
          ip_address: string | null
          product_id: string | null
          user_agent: string | null
          viewed_at: string | null
          viewer_id: string | null
        }
        Insert: {
          id?: string
          ip_address?: string | null
          product_id?: string | null
          user_agent?: string | null
          viewed_at?: string | null
          viewer_id?: string | null
        }
        Update: {
          id?: string
          ip_address?: string | null
          product_id?: string | null
          user_agent?: string | null
          viewed_at?: string | null
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_views_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
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
          last_viewed_at: string | null
          moq: number | null
          orders_count: number | null
          packaging: Json | null
          payment_terms: string | null
          pricing: Json[] | null
          product_id: string
          sample_available: boolean | null
          seller_id: string
          shipping_info: Json | null
          shipping_terms: string | null
          specifications: Json | null
          status: string
          subcategory_id: string | null
          updated_at: string | null
          variations: Json | null
          views_count: number | null
          is_featured: boolean
        }
        Insert: {
          category_id: string
          created_at?: string | null
          customization?: Json | null
          description?: string | null
          headline: string
          image_urls?: string[]
          last_viewed_at?: string | null
          moq?: number | null
          orders_count?: number | null
          packaging?: Json | null
          payment_terms?: string | null
          pricing?: Json[] | null
          product_id?: string
          sample_available?: boolean | null
          seller_id: string
          shipping_info?: Json | null
          shipping_terms?: string | null
          specifications?: Json | null
          status?: string
          subcategory_id?: string | null
          updated_at?: string | null
          variations?: Json | null
          views_count?: number | null
          is_featured?: boolean
        }
        Update: {
          category_id?: string
          created_at?: string | null
          customization?: Json | null
          description?: string | null
          headline?: string
          image_urls?: string[]
          last_viewed_at?: string | null
          moq?: number | null
          orders_count?: number | null
          packaging?: Json | null
          payment_terms?: string | null
          pricing?: Json[] | null
          product_id?: string
          sample_available?: boolean | null
          seller_id?: string
          shipping_info?: Json | null
          shipping_terms?: string | null
          specifications?: Json | null
          status?: string
          subcategory_id?: string | null
          updated_at?: string | null
          variations?: Json | null
          views_count?: number | null
          is_featured?: boolean
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
          company_id: string | null
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
          company_id?: string | null
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
          company_id?: string | null
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
      saved_products: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "saved_products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_verification_records: {
        Row: {
          company_id: string | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["verification_status_enum"] | null
          submitted_at: string | null
          verification_type: string
          verified_at: string | null
          verifier_id: string | null
        }
        Insert: {
          company_id?: string | null
          id?: string
          notes?: string | null
          status?:
            | Database["public"]["Enums"]["verification_status_enum"]
            | null
          submitted_at?: string | null
          verification_type: string
          verified_at?: string | null
          verifier_id?: string | null
        }
        Update: {
          company_id?: string | null
          id?: string
          notes?: string | null
          status?:
            | Database["public"]["Enums"]["verification_status_enum"]
            | null
          submitted_at?: string | null
          verification_type?: string
          verified_at?: string | null
          verifier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_verification_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_verifications: {
        Row: {
          company_address: string
          company_description: string
          company_name: string
          created_at: string
          id: string
          notes: string | null
          phone_number: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          company_address: string
          company_description: string
          company_name: string
          created_at?: string
          id?: string
          notes?: string | null
          phone_number: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_address?: string
          company_description?: string
          company_name?: string
          created_at?: string
          id?: string
          notes?: string | null
          phone_number?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_verifications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seller_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      user_activities: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at: string
          description: string
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["entity_type"] | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at?: string
          description: string
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"] | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          created_at?: string
          description?: string
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"] | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      company_migration_status: {
        Row: {
          migrated_companies: number | null
          total_sellers: number | null
          unmigrated_sellers: number | null
          verification_records: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      convert_to_seller: {
        Args: {
          profile_id: string
          company_data: Json
        }
        Returns: string
      }
      fix_unmigrated_sellers: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_product_analytics: {
        Args: {
          _product_id: string
        }
        Returns: {
          total_views: number
          unique_viewers: number
          conversion_rate: number
          last_viewed: string
        }[]
      }
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
      get_seller_product_analytics: {
        Args: {
          _seller_id: string
        }
        Returns: {
          total_products: number
          total_views: number
          total_orders: number
          overall_conversion_rate: number
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
      get_top_performing_products: {
        Args: {
          _seller_id: string
          _limit?: number
        }
        Returns: {
          product_id: string
          headline: string
          views_count: number
          orders_count: number
          conversion_rate: number
          last_viewed_at: string
        }[]
      }
      handle_document_submission: {
        Args: {
          p_company_id: string
          p_document_types: string[]
        }
        Returns: undefined
      }
      handle_seller_verification: {
        Args: {
          p_company_id: string
          p_verifier_id: string
          p_status: Database["public"]["Enums"]["verification_status_enum"]
          p_notes?: string
        }
        Returns: undefined
      }
      migrate_company_profiles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      record_product_view: {
        Args: {
          _product_id: string
          _viewer_id?: string
          _ip_address?: string
          _user_agent?: string
        }
        Returns: undefined
      }
      record_user_activity: {
        Args: {
          _user_id: string
          _activity_type: Database["public"]["Enums"]["activity_type"]
          _description: string
          _entity_id?: string
          _entity_type?: Database["public"]["Enums"]["entity_type"]
          _metadata?: Json
        }
        Returns: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at: string
          description: string
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["entity_type"] | null
          id: string
          metadata: Json | null
          user_id: string
        }
      }
      update_updated_at_coloumn: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      verify_company_migration: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_sellers: number
          migrated_companies: number
          unmigrated_sellers: number
          verification_records: number
        }[]
      }
    }
    Enums: {
      activity_type:
        | "PROFILE_UPDATE"
        | "PRODUCT_CREATE"
        | "PRODUCT_UPDATE"
        | "COMPANY_UPDATE"
        | "AVATAR_UPDATE"
        | "COMPANY_LOGO_UPDATE"
      entity_type: "PROFILE" | "PRODUCT" | "COMPANY"
      incoterm_type: "FOB" | "CIF" | "EXW" | "DDP"
      order_status_type:
        | "created"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "completed"
        | "cancelled"
      payment_method_type: "bank_transfer" | "letter_of_credit" | "escrow"
      verification_status_enum:
        | "not_applied"
        | "applied"
        | "pending"
        | "approved"
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
