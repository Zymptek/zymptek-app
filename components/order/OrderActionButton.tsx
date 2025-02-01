'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { OrderForm } from '@/components/order/OrderForm'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import type { Database } from '@/types/supabase'

interface OrderActionButtonProps {
  sellerId: string
  productId: string
  conversationId: string
}

export function OrderActionButton({ 
  sellerId, 
  productId, 
  conversationId 
}: OrderActionButtonProps) {
  const [existingOrder, setExistingOrder] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const checkExistingOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id')
          .eq('linked_chat_id', conversationId)
          .single()

        if (!error && data) {
          setExistingOrder(data)
        }
      } catch (error) {
        console.error('Error checking order:', error)
      } finally {
        setLoading(false)
      }
    }

    checkExistingOrder()
  }, [conversationId, supabase])

  const handleViewOrder = () => {
    if (existingOrder) {
      try {
        // Encode the order ID
        const encodedId = Buffer.from(existingOrder.id).toString('base64')
        router.push(`/orders/${encodedId}`)
      } catch (error) {
        console.error('Error encoding order ID:', error)
      }
    }
  }

  if (loading) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-brand-200 opacity-50"
        disabled
      >
        <ShoppingBag className="w-4 h-4 animate-pulse" />
        <span className="font-medium">Loading...</span>
      </Button>
    )
  }

  if (existingOrder) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-brand-200 hover:text-brand-300 hover:bg-brand-100/10 transition-all duration-200"
        onClick={handleViewOrder}
      >
        <Eye className="w-4 h-4" />
        <span className="font-medium">View Order</span>
      </Button>
    )
  }

  // Only show create order button for buyers
  const isBuyer = user?.id !== sellerId

  if (!isBuyer) {
    return null
  }

  const createOrderTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 text-brand-200 hover:text-brand-300 hover:bg-brand-100/10 transition-all duration-200"
    >
      <ShoppingBag className="w-4 h-4" />
      <span className="font-medium">Create Order</span>
    </Button>
  )

  return (
    <OrderForm
      sellerId={sellerId}
      productId={productId}
      conversationId={conversationId}
      trigger={createOrderTrigger}
    />
  )
} 
