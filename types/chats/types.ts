import { Database } from '@/lib/database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row'] & {
  buyer?: Profile
  seller?: Profile
}
export type Message = Database['public']['Tables']['messages']['Row']

export interface ChatListItem extends Conversation {
  otherUser: Profile
  lastMessage?: Message
  unreadCount: number
}

export interface ChatMessage extends Message {
  sender: Profile
  status: 'sent' | 'delivered' | 'read'
}

export type TypingUsers = Record<string, string[]>
