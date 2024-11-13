"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderOverview } from '@/components/order/OrderOverview'
import { OrderDocuments } from '@/components/order/OrderDocuments'
import { OrderPayment } from '@/components/order/OrderPayment'

export default function OrderPage({ params }: { params: { orderId: string } }) {
  // Mock order data
  const [order] = useState({
    id: params.orderId,
    status: 'pending',
    total_amount: 1000,
    created_at: new Date().toISOString(),
    buyer: { name: 'John Doe' },
    seller: { name: 'Jane Smith' },
    product: { name: 'Sample Product' }
  })

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        <p className="text-gray-500">Created on {new Date(order.created_at).toLocaleDateString()}</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-background">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OrderOverview order={order} />
        </TabsContent>

        <TabsContent value="documents">
          <OrderDocuments orderId={order.id} />
        </TabsContent>

        <TabsContent value="payment">
          <OrderPayment order={order} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
