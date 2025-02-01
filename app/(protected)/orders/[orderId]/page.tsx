"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { OrderDocuments } from '@/components/order/OrderDocuments'
import { OrderActions } from '@/components/order/OrderActions'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Container } from '@/components/ui/container'
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, PackageIcon, TruckIcon, DollarSignIcon, BoxIcon, BuildingIcon, TagIcon, InfoIcon, FileIcon, CheckCircleIcon, Settings2Icon, CheckCircle2Icon, CircleDotIcon, CircleIcon, ClockIcon, ShieldCheckIcon, ThumbsUpIcon, CheckSquare2Icon, AlertTriangleIcon, MessageSquareIcon, HelpCircleIcon, ArrowRightIcon, MoreVerticalIcon, ActivityIcon, CheckIcon } from 'lucide-react'
import type { Database } from '@/lib/database.types'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Json = Database['public']['Tables']['products']['Row']['customization']

interface OrderPageProps {
  params: {
    orderId: string
  }
}

type DatabaseOrder = Database['public']['Tables']['orders']['Row']
type BaseProfile = Database['public']['Tables']['profiles']['Row']

interface Profile extends BaseProfile {
  company?: Company;
}

interface Product {
  product_id: string;
  headline: string;
  description: string | null;
  category_id: string;
  image_urls: string[];
  customization: Json | null;
  views_count: number | null;
  orders_count: number | null;
  moq: number | null;
  created_at: string | null;
  updated_at: string | null;
  last_viewed_at: string | null;
  status: string;
  seller_id: string;
  packaging: Json | null;
  payment_terms: string | null;
  pricing: Json[] | null;
  sample_available: boolean | null;
  shipping_info: Json | null;
  shipping_terms: string | null;
  specifications: Json | null;
  subcategory_id: string | null;
  variations: Json | null;
}

interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  business_category: string | null;
  description: string | null;
  address: string | null;
  website: string | null;
  certifications: string[] | null;
  main_products: string[] | null;
}

interface OrderWithRelations extends DatabaseOrder {
  buyer: Profile;
  seller: Profile;
  product: Product;
}

interface EnhancedOrder extends OrderWithRelations {
  displayNumber: string;
  displayUnit: string;
}

const formatName = (profile: Profile) => {
  return `${profile.first_name} ${profile.last_name}`
}

const enhanceOrder = (order: OrderWithRelations): EnhancedOrder => {
  return {
    ...order,
    displayNumber: `ORD-${order.id.slice(0, 8)}`,
    displayUnit: 'units'
  }
}

export default function OrderPage({ params }: OrderPageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [decodedOrderId, setDecodedOrderId] = useState<string | null>(null)
  const [order, setOrder] = useState<EnhancedOrder | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!params.orderId) return

      try {
        // Decode the order ID from base64
        let decoded: string;
        try {
          decoded = Buffer.from(params.orderId, 'base64').toString()
          console.log('Decoded order ID:', decoded)
        } catch (decodeError) {
          console.error('Failed to decode order ID:', decodeError)
          setError('Invalid order ID format')
          setLoading(false)
          return
        }
        
        setDecodedOrderId(decoded)

        // Fetch order details with product and company information
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select(`
            id,
            buyer_id,
            seller_id,
            status,
            agreed_price,
            quantity,
            incoterm,
            delivery_date,
            created_at,
            updated_at,
            currency,
            linked_chat_id,
            payment_method,
            product_id,
            buyer:profiles!orders_buyer_id_fkey(
              id, user_id, first_name, last_name, email,
              phone_number, country, user_type, avatar_url,
              business_category, company_id, company_profile,
              designation, created_at, updated_at
            ),
            seller:profiles!orders_seller_id_fkey(
              id, user_id, first_name, last_name, email,
              phone_number, country, user_type, avatar_url,
              business_category, company_id, company_profile,
              designation, created_at, updated_at
            ),
            product:products!orders_product_id_fkey(
              product_id,
              headline,
              description,
              category_id,
              image_urls,
              customization,
              views_count,
              orders_count,
              moq,
              created_at,
              updated_at,
              last_viewed_at,
              status,
              seller_id,
              packaging,
              payment_terms,
              pricing,
              sample_available,
              shipping_info,
              shipping_terms,
              specifications,
              subcategory_id,
              variations
            )
          `)
          .eq('id', decoded)
          .single()

        console.log('Order query result:', { 
          data: orderData, 
          error: orderError,
          decodedId: decoded,
          user: user?.id
        })

        if (orderError) {
          console.error('Order fetch error:', {
            error: orderError,
            code: orderError.code,
            details: orderError.details,
            hint: orderError.hint,
            message: orderError.message
          })
          setError(`Failed to fetch order details: ${orderError.message}`)
          setLoading(false)
          return
        }

        if (!orderData) {
          console.error('No order data found')
          setError('Order not found')
          setLoading(false)
          return
        }

        // After getting the order data, fetch the seller's company
        let sellerCompany = null
        if (orderData.seller?.company_id) {
          const { data: companyData } = await supabase
            .from('companies')
            .select(`
              id,
              name,
              logo_url,
              business_category,
              description,
              address,
              website,
              certifications,
              main_products
            `)
            .eq('id', orderData.seller.company_id)
            .single()
          
          sellerCompany = companyData
        }

        // Ensure buyer and seller are properly formatted
        const formattedOrder = {
          ...orderData,
          buyer: Array.isArray(orderData.buyer) ? orderData.buyer[0] : orderData.buyer,
          seller: {
            ...(Array.isArray(orderData.seller) ? orderData.seller[0] : orderData.seller),
            company: sellerCompany
          },
          product: Array.isArray(orderData.product) ? orderData.product[0] : orderData.product
        }

        console.log('Formatted order:', formattedOrder)

        // Type assertion after validation
        const validatedOrder = formattedOrder as unknown as OrderWithRelations
        if (!validatedOrder.product?.product_id) {
          console.error('Invalid order data structure:', formattedOrder)
          setError('Invalid order data structure')
          setLoading(false)
          return
        }

        // Check if user has access (buyer, seller, or admin)
        const isAdmin = user?.user_metadata?.isAdmin
        const isBuyer = validatedOrder.buyer_id === user?.id
        const isSeller = validatedOrder.seller_id === user?.id

        if (!isAdmin && !isBuyer && !isSeller) {
          console.error('User not authorized:', { 
            userId: user?.id, 
            buyerId: validatedOrder.buyer_id, 
            sellerId: validatedOrder.seller_id 
          })
          setError('You do not have permission to view this order')
          setLoading(false)
          return
        }

        // Transform the order data
        const enhancedOrder = enhanceOrder(validatedOrder)
        setOrder(enhancedOrder)
        setLoading(false)
      } catch (error) {
        console.error('Error in fetchOrder:', error)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.orderId, router, supabase, user])

  useEffect(() => {
    // Only redirect after a short delay to prevent immediate redirects
    if (error) {
      const timer = setTimeout(() => {
        if (error.includes('not authorized') || error.includes('permission')) {
          router.push('/403')
        } else if (error.includes('not found')) {
          router.push('/404')
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [error, router])

  const { toast } = useToast()

  const handleOrderUpdate = async (updates: Partial<DatabaseOrder>) => {
    if (!decodedOrderId) return

    try {
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', decodedOrderId)

      if (error) throw error

      setOrder(prev => prev ? { ...prev, ...updates } : null)
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  }

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-brand-200">Loading order details...</p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-red-500">{error}</p>
        </div>
      </Container>
    )
  }

  if (!order) {
    return null
  }

  const userRole = order.buyer_id === user?.id ? 'buyer' : 'seller'

  return (
    <Container>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto py-8 px-4 space-y-8"
      >
        {/* Modern Order Header */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-1 bg-brand-300 rounded-full animate-pulse" />
                <h1 className="text-4xl font-bold text-brand-200">
                  Order #{order.displayNumber}
                </h1>
              </div>
              <p className="text-muted-foreground pl-3">
                Created on {new Date(order.created_at!).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-brand-100/10 rounded-lg">
                <CalendarIcon className="w-4 h-4 text-brand-300" />
                <span className="text-brand-200">
                  Delivery by {new Date(order.delivery_date).toLocaleDateString()}
                </span>
              </div>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-lg py-2 px-6 border-2 uppercase",
                  {
                    "border-green-500 bg-green-500/10 text-green-700": order.status === "completed",
                    "border-red-500 bg-red-500/10 text-red-700": order.status === "cancelled",
                    "border-yellow-500 bg-yellow-500/10 text-yellow-700": order.status === "created" || order.status === "confirmed",
                    "border-blue-500 bg-blue-500/10 text-blue-700": order.status === "shipped" || order.status === "delivered"
                  },
                  "transition-all duration-300 hover:scale-105"
                )}
              >
                {order.status}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-brand-100/5 border-brand-100/20 hover:border-brand-300/30 transition-all duration-300">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-brand-300/10 rounded-lg">
                  <DollarSignIcon className="w-5 h-5 text-brand-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-semibold text-brand-200">
                    ${order.agreed_price} {order.currency}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-brand-100/5 border-brand-100/20 hover:border-brand-300/30 transition-all duration-300">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-brand-300/10 rounded-lg">
                  <PackageIcon className="w-5 h-5 text-brand-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="text-lg font-semibold text-brand-200">
                    {order.quantity} {order.displayUnit}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-brand-100/5 border-brand-100/20 hover:border-brand-300/30 transition-all duration-300">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-brand-300/10 rounded-lg">
                  <TruckIcon className="w-5 h-5 text-brand-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Shipping Terms</p>
                  <p className="text-lg font-semibold text-brand-200">{order.incoterm}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-brand-100/5 border-brand-100/20 hover:border-brand-300/30 transition-all duration-300">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-brand-300/10 rounded-lg">
                  <BuildingIcon className="w-5 h-5 text-brand-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="text-lg font-semibold text-brand-200">
                    {order.payment_method.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Progress Tracker */}
          <motion.div variants={itemVariants}>
            <Card className="border-brand-100/20 hover:border-brand-300/30 transition-all duration-300">
              <CardHeader className="border-b border-brand-100/20 bg-brand-100/5">
                <CardTitle className="text-2xl text-brand-200 flex items-center gap-2">
                  <ClockIcon className="w-6 h-6 text-brand-300" />
                  Order Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative flex justify-between">
                  {/* Progress Line */}
                  <div className="absolute top-5 left-0 w-full h-1 bg-brand-100/20" />
                  <div 
                    className="absolute top-5 left-0 h-1 bg-brand-300 transition-all duration-500"
                    style={{
                      width: (() => {
                        switch(order.status) {
                          case 'created': return '20%'
                          case 'confirmed': return '40%'
                          case 'shipped': return '60%'
                          case 'delivered': return '80%'
                          case 'completed': return '100%'
                          case 'cancelled': return '0%'
                          default: return '0%'
                        }
                      })()
                    }}
                  />
                  
                  {/* Status Steps */}
                  {[
                    { status: 'created', label: 'Created', icon: CircleDotIcon },
                    { status: 'confirmed', label: 'Confirmed', icon: ThumbsUpIcon },
                    { status: 'shipped', label: 'Shipped', icon: TruckIcon },
                    { status: 'delivered', label: 'Delivered', icon: PackageIcon },
                    { status: 'completed', label: 'Completed', icon: CheckCircle2Icon }
                  ].map((step, index) => {
                    const isActive = ['created', 'confirmed', 'shipped', 'delivered', 'completed']
                      .indexOf(order.status) >= ['created', 'confirmed', 'shipped', 'delivered', 'completed']
                      .indexOf(step.status)
                    const isCurrent = order.status === step.status
                    
                    return (
                      <div key={step.status} className="relative z-10 flex flex-col items-center gap-2">
                        <div 
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                            isActive ? "bg-brand-300 text-white" : "bg-brand-100/20 text-muted-foreground",
                            isCurrent && "ring-4 ring-brand-300/20"
                          )}
                        >
                          <step.icon className="w-5 h-5" />
                        </div>
                        <span className={cn(
                          "text-sm font-medium whitespace-nowrap",
                          isActive ? "text-brand-200" : "text-muted-foreground"
                        )}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
                
                {order.status === 'cancelled' && (
                  <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <ShieldCheckIcon className="w-5 h-5" />
                      <p className="font-medium">This order has been cancelled</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Reorganize the main content grid */}
        <div className="grid grid-cols-1 gap-8">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Product and Documents */}
            <div className="lg:col-span-2 space-y-8">
              {/* Product Information */}
              <motion.div variants={itemVariants}>
                <Card className="border-brand-100/20 hover:border-brand-300/30 transition-all duration-300 overflow-hidden">
                  <CardHeader className="border-b border-brand-100/20 bg-brand-100/5">
                    <CardTitle className="text-2xl text-brand-200 flex items-center gap-2">
                      <BoxIcon className="w-6 h-6 text-brand-300" />
                      Product Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex gap-6">
                      {order.product.image_urls && order.product.image_urls[0] && (
                        <div className="relative w-40 h-40 rounded-xl overflow-hidden shadow-lg">
                          <Image
                            src={order.product.image_urls[0]}
                            alt={order.product.headline}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-2xl font-semibold text-brand-200 mb-2">
                            {order.product.headline}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {order.product.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {order.product.moq && (
                            <Badge variant="outline" className="bg-brand-100/10 px-3 py-1 text-sm">
                              <TagIcon className="w-4 h-4 mr-1" />
                              MOQ: {order.product.moq}
                            </Badge>
                          )}
                          <Badge variant="outline" className="bg-brand-100/10 px-3 py-1 text-sm">
                            <BoxIcon className="w-4 h-4 mr-1" />
                            Category: {order.product.category_id}
                          </Badge>
                          {order.product.sample_available && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/30 px-3 py-1 text-sm">
                              Sample Available
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Documents Section */}
              <motion.div variants={itemVariants}>
                <Card className="border-brand-100/20 hover:border-brand-300/30 transition-all duration-300">
                  <CardHeader className="border-b border-brand-100/20 bg-brand-100/5">
                    <CardTitle className="text-2xl text-brand-200 flex items-center gap-2">
                      <FileIcon className="w-6 h-6 text-brand-300" />
                      Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <OrderDocuments orderId={order.id} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Activity Log Section */}
              <motion.div variants={itemVariants}>
                <Card className="border-brand-100/20 hover:border-brand-300/30 transition-all duration-300">
                  <CardHeader className="border-b border-brand-100/20 bg-brand-100/5">
                    <CardTitle className="text-2xl text-brand-200 flex items-center gap-2">
                      <ActivityIcon className="w-6 h-6 text-brand-300" />
                      Activity Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Example activities - replace with actual data */}
                      <div className="relative pl-8 pb-6 border-l-2 border-brand-100/20 last:pb-0">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500/10 border-2 border-green-500">
                          <CheckIcon className="w-2 h-2 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-brand-200">Order Status Updated</p>
                            <time className="text-xs text-muted-foreground">2 hours ago</time>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Status changed from <span className="text-brand-200 font-medium">Created</span> to{" "}
                            <span className="text-brand-200 font-medium">Confirmed</span>
                          </p>
                        </div>
                      </div>

                      <div className="relative pl-8 pb-6 border-l-2 border-brand-100/20 last:pb-0">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500/10 border-2 border-blue-500">
                          <FileIcon className="w-2 h-2 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-brand-200">Document Added</p>
                            <time className="text-xs text-muted-foreground">5 hours ago</time>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            New document <span className="text-brand-200 font-medium">Purchase Agreement</span> was uploaded
                          </p>
                        </div>
                      </div>

                      <div className="relative pl-8 pb-6 border-l-2 border-brand-100/20 last:pb-0">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-300/10 border-2 border-brand-300">
                          <CircleDotIcon className="w-2 h-2 text-brand-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-brand-200">Order Created</p>
                            <time className="text-xs text-muted-foreground">1 day ago</time>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Order #{order.displayNumber} was created successfully
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Company Details */}
            <div className="lg:col-span-1">
              <motion.div variants={itemVariants}>
                <Card className="border-brand-100/20 hover:border-brand-300/30 transition-all duration-300">
                  <CardHeader className="border-b border-brand-100/20 bg-brand-100/5">
                    <CardTitle className="text-2xl text-brand-200 flex items-center gap-2">
                      <BuildingIcon className="w-6 h-6 text-brand-300" />
                      Company Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {order.seller.company?.logo_url && (
                        <div className="flex justify-center mb-6">
                          <div className="relative w-28 h-28 rounded-xl overflow-hidden shadow-lg">
                            <Image
                              src={order.seller.company.logo_url}
                              alt={order.seller.company.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                        </div>
                      )}
                      <div className="p-3 bg-brand-100/5 rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground">Company Name</h3>
                        <p className="text-base font-semibold text-brand-200 mt-0.5">{order.seller.company?.name}</p>
                      </div>
                      <div className="p-3 bg-brand-100/5 rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground">Business Category</h3>
                        <p className="text-base font-semibold text-brand-200 mt-0.5">{order.seller.company?.business_category}</p>
                      </div>
                      <div className="p-3 bg-brand-100/5 rounded-lg">
                        <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                        <p className="text-base font-semibold text-brand-200 mt-0.5">{order.seller.company?.address}</p>
                      </div>
                      {order.seller.company?.certifications && (
                        <div className="p-3 bg-brand-100/5 rounded-lg">
                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Certifications</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {order.seller.company.certifications.map((cert, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="bg-brand-300/10 border-brand-300/20 text-brand-200 text-xs"
                              >
                                <CheckCircleIcon className="w-3 h-3 mr-1" />
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="mt-6 pt-6 border-t border-brand-100/20">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
                          <Settings2Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <button 
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-3",
                              "rounded-lg border border-brand-100/20 bg-background",
                              "hover:border-red-500/30 hover:bg-red-50/5",
                              "transition-all duration-300",
                              "focus:outline-none focus:ring-2 focus:ring-red-500/20"
                            )}
                            onClick={() => {/* Add your open dispute handler */}}
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                              <AlertTriangleIcon className="w-4 h-4 text-red-500" />
                            </div>
                            <span className="text-sm font-medium text-brand-200">Open Dispute</span>
                          </button>

                          <button 
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-3",
                              "rounded-lg border border-brand-100/20 bg-background",
                              "hover:border-blue-500/30 hover:bg-blue-50/5",
                              "transition-all duration-300",
                              "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            )}
                            onClick={() => {/* Add your contact support handler */}}
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <MessageSquareIcon className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="text-sm font-medium text-brand-200">Contact Support</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </Container>
  )
}
