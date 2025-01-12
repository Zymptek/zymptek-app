import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OrderTimeline } from '@/components/order/OrderTimeline'

interface OrderOverviewProps {
  order: any
}

export const OrderOverview = ({ order }: OrderOverviewProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Status</span>
              <Badge variant="outline">{order.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount</span>
              <span>${order.total_amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Buyer</span>
              <span>{order.buyer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Seller</span>
              <span>{order.seller.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTimeline order={order} />
        </CardContent>
      </Card>
    </div>
  )
}
