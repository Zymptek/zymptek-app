import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CheckCircle2, Circle } from "lucide-react"

interface OrderTimelineProps {
  order: any // Replace with proper type
}

export const OrderTimeline = ({ order }: OrderTimelineProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'processing': return 'bg-blue-500'
      case 'shipped': return 'bg-purple-500'
      case 'delivered': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const timelineEvents = [
    {
      title: 'Order Created',
      date: order.created_at,
      status: 'completed'
    },
    {
      title: 'Payment Received',
      date: order.payment_received_at,
      status: order.payment_received_at ? 'completed' : 'pending'
    },
    {
      title: 'Documents Signed',
      date: order.documents_signed_at,
      status: order.documents_signed_at ? 'completed' : 'pending'
    },
    {
      title: 'Order Shipped',
      date: order.shipped_at,
      status: order.shipped_at ? 'completed' : 'pending'
    },
    {
      title: 'Order Delivered',
      date: order.delivered_at,
      status: order.delivered_at ? 'completed' : 'pending'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Order Status</h3>
        <Badge className={getStatusColor(order.status)}>
          {order.status.toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-4">
        {timelineEvents.map((event, index) => (
          <div key={index} className="flex items-start space-x-3">
            {event.status === 'completed' ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
            ) : (
              <Circle className="h-5 w-5 text-gray-300 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="font-medium">{event.title}</p>
                <span className="text-sm text-gray-500">
                  {event.date ? format(new Date(event.date), 'PPP') : 'Pending'}
                </span>
              </div>
              {index !== timelineEvents.length - 1 && (
                <div className="w-px h-6 bg-gray-200 ml-2 my-1" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
