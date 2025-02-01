export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          product_name: string
          quantity: number
          unit: string
          agreed_price: number
          currency: string
          incoterm: string
          delivery_date: string
          payment_method: string
          status: string
          buyer_id: string
          seller_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_name: string
          quantity: number
          unit: string
          agreed_price: number
          currency: string
          incoterm: string
          delivery_date: string
          payment_method: string
          status?: string
          buyer_id: string
          seller_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_name?: string
          quantity?: number
          unit?: string
          agreed_price?: number
          currency?: string
          incoterm?: string
          delivery_date?: string
          payment_method?: string
          status?: string
          buyer_id?: string
          seller_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_documents: {
        Row: {
          id: string
          order_id: string
          type: string
          filename: string
          url: string
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          type: string
          filename: string
          url: string
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          type?: string
          filename?: string
          url?: string
          uploaded_by?: string
          created_at?: string
        }
      }
      order_updates: {
        Row: {
          id: string
          order_id: string
          description: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          description: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          description?: string
          user_id?: string
          created_at?: string
        }
      }
      order_messages: {
        Row: {
          id: string
          order_id: string
          content: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          content: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          content?: string
          user_id?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 