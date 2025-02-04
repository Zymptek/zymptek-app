import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/database.types'

export async function getOrderById(orderId: string) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      buyer:users!buyer_id(*),
      seller:users!seller_id(*)
    `)
    .eq('id', orderId)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return null
  }

  return order
}

export async function getOrderDocuments(orderId: string) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: documents, error } = await supabase
    .from('order_documents')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching documents:', error)
    return []
  }

  return documents
}

export async function getOrderUpdates(orderId: string) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: updates, error } = await supabase
    .from('order_updates')
    .select(`
      *,
      user:users(*)
    `)
    .eq('order_id', orderId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching updates:', error)
    return []
  }

  return updates
}

export async function getOrderMessages(orderId: string) {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data: messages, error } = await supabase
    .from('order_messages')
    .select(`
      *,
      user:users(*)
    `)
    .eq('order_id', orderId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return messages
} 