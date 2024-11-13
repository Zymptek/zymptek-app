'use client'

import { useState } from 'react'
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

export const CreateOrderButton = ({ sellerId, productId, conversationId }: CreateOrderButtonProps) => {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <Button 
        onClick={() => setShowDialog(true)}
        className="btn-outline"
      >
        Create Order
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <OrderForm 
            sellerId={sellerId}
            productId={productId}
            conversationId={conversationId}
            onSuccess={() => setShowDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
