"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { OrderHeader } from '@/components/order/OrderHeader'
import { OrderOverview } from '@/components/order/OrderOverview'
import { OrderDocuments } from '@/components/order/OrderDocuments'
import { OrderTimeline } from '@/components/order/OrderTimeline'
import { OrderEscrow } from '@/components/order/OrderEscrow'
import { OrderActions } from '@/components/order/OrderActions'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function OrderPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState({
    id: params.orderId,
    title: "Cotton Textiles",
    number: "IND-USA-2023-001",
    status: "In Transit",
    progress: 60,
    buyer: { name: "USA Imports Inc.", email: "buyer@example.com" },
    seller: { name: "India Exports Ltd.", email: "seller@example.com" },
    value: 50000,
    quantity: 10000,
    description: "High-quality cotton textiles",
    shipping: {
      method: "Sea freight",
      estimatedDelivery: "2023-06-15"
    },
    escrow: {
      totalAmount: 50000,
      inEscrow: 50000,
      released: 0,
      paymentLink: ""
    },
    created_at: new Date().toISOString()
  })

  const [activeView, setActiveView] = useState('buyer')
  const { toast } = useToast()

  const handleOrderUpdate = async (updates: Partial<typeof order>) => {
    try {
      setOrder(prev => ({ ...prev, ...updates }))
      toast({
        title: "Order Updated",
        description: "Changes have been saved successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order details.",
        variant: "destructive"
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4 space-y-8"
    >
      <OrderHeader 
        order={order}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5 bg-brand-200">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-brand-300 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="documents"
              className="data-[state=active]:bg-brand-300 data-[state=active]:text-white"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger 
              value="timeline"
              className="data-[state=active]:bg-brand-300 data-[state=active]:text-white"
            >
              Timeline
            </TabsTrigger>
            <TabsTrigger 
              value="escrow"
              className="data-[state=active]:bg-brand-300 data-[state=active]:text-white"
            >
              Escrow
            </TabsTrigger>
            <TabsTrigger 
              value="actions"
              className="data-[state=active]:bg-brand-300 data-[state=active]:text-white"
            >
              Actions
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview">
              <OrderOverview 
                order={order} 
              />
            </TabsContent>

            <TabsContent value="documents">
              <OrderDocuments 
                orderId={order.id} 
              />
            </TabsContent>

            <TabsContent value="timeline">
              <OrderTimeline order={order} />
            </TabsContent>

            <TabsContent value="escrow">
              <OrderEscrow 
                order={order}
                userRole={activeView}
                onUpdate={handleOrderUpdate}
              />
            </TabsContent>

            <TabsContent value="actions">
              <OrderActions 
                order={order}
                userRole={activeView}
                onUpdate={handleOrderUpdate}
              />
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
