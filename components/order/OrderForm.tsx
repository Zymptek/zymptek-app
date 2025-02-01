'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { DynamicForm, FormField } from '@/components/shared/DynamicForm'
import { orderFormConfig } from '@/lib/config/order-form'
import { generateOrderSchema, OrderFormData } from '@/lib/schema/orderSchema'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/database.types'
import { ShoppingCart } from 'lucide-react'

interface OrderFormProps {
  sellerId: string
  productId: string
  conversationId: string
  onSuccess?: () => void
  trigger?: React.ReactNode // Optional custom trigger
  className?: string // Optional className for the container
}

export const OrderForm = ({ 
  sellerId, 
  productId, 
  conversationId, 
  onSuccess,
  trigger,
  className = ''
}: OrderFormProps) => {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient<Database>()

  // Process form fields with actual values
  const processedFields: FormField[] = orderFormConfig.fields.map(field => {
    const baseField: FormField = {
      name: field.id,
      label: field.label,
      type: field.type,
      required: field.required || false,
    }

    if ('readOnly' in field) baseField.readOnly = field.readOnly
    if ('min' in field) baseField.min = field.min
    if ('placeholder' in field) baseField.placeholder = field.placeholder
    if ('options' in field && field.options) {
      baseField.options = field.options.map(opt => ({
        value: opt.value,
        label: opt.label
      }))
    }

    // Handle default values
    if ('defaultValue' in field) {
      if (field.defaultValue === '{{today}}') {
        baseField.defaultValue = new Date().toISOString().split('T')[0]
      } else {
        baseField.defaultValue = field.defaultValue
      }
    }

    return baseField
  })

  const handleSubmit = async (data: OrderFormData) => {
    setLoading(true)

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('User not authenticated')

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          seller_id: sellerId,
          product_id: productId,
          quantity: data.quantity,
          unit: data.unit,
          agreed_price: data.agreed_price,
          incoterm: data.incoterm,
          delivery_date: data.delivery_date,
          payment_method: data.payment_method,
          special_instructions: data.special_instructions || null,
          linked_chat_id: conversationId,
          currency: 'USD', // Default currency
          status: 'created'
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order update log
      await supabase
        .from('order_updates')
        .insert({
          order_id: order.id,
          type: 'created',
          description: 'Order created',
          updated_by: user.id
        })

      toast({
        title: "Order Created",
        description: "Your order has been created successfully.",
      })
      
      setIsOpen(false)
      onSuccess?.()
      router.push(`/orders/${order.id}`)
    } catch (error) {
      console.error('Error creating order:', error)
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = (
    <Button 
      className="w-full bg-brand-300 hover:bg-brand-400 text-white flex items-center gap-2"
      onClick={() => setIsOpen(true)}
    >
      <ShoppingCart className="w-4 h-4" />
      Create Order
    </Button>
  )

  return (
    <div className={className}>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>
          {trigger}
        </div>
      ) : defaultTrigger}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>
              Please fill in the order details below. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <DynamicForm
              fields={processedFields}
              onSubmit={handleSubmit}
              schema={generateOrderSchema(orderFormConfig.fields)}
              submitText="Create Order"
              loading={loading}
              className="mt-4"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 