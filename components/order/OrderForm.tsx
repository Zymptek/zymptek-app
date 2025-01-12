'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface OrderFormProps {
  sellerId: string
  productId: string
  conversationId: string
  onSuccess: () => void
}

export const OrderForm = ({ sellerId, productId, conversationId, onSuccess }: OrderFormProps) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate order creation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Order Created",
        description: "Your order has been created successfully.",
      })
      
      onSuccess()
      // Navigate to the new order page
      router.push(`/orders/${Date.now()}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Quantity</label>
        <Input type="number" min="1" required />
      </div>
      
      <div>
        <label className="text-sm font-medium">Shipping Address</label>
        <Textarea required />
      </div>

      <div>
        <label className="text-sm font-medium">Additional Notes</label>
        <Textarea />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-brand-300 hover:bg-brand-400"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Order"}
      </Button>
    </form>
  )
} 