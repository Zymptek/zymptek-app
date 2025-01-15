export interface Profile {
  id: string
  first_name: string
  last_name: string
  avatar_url?: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  image_url?: string
  seller_id: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  file_url?: string
  created_at: string
  status: 'sent' | 'delivered' | 'read'
}

export interface Conversation {
  id: string
  buyer_id: string
  seller_id: string
  product_id: string
  created_at: string
  updated_at: string
  buyer?: Profile
  seller?: Profile
  product?: Product
  last_message?: Message
  unread_count?: number
}

export interface ChatListItem extends Conversation {
  otherUser: Profile
  lastMessage?: Message
  unreadCount: number
}

export interface ChatMessage extends Message {
  sender: Profile
}

export type TypingUsers = Record<string, string[]>
