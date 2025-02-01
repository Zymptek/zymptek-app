'use client'

import { ShoppingBag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { OrderForm } from '@/components/order/OrderForm'

interface CreateOrderButtonProps {
  sellerId: string
  productId: string
  conversationId: string
}

export const CreateOrderButton = ({ 
  sellerId, 
  productId, 
  conversationId 
}: CreateOrderButtonProps) => {
  const orderTrigger = (
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
      trigger={orderTrigger}
    />
  )
}
