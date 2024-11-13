import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface OrderPaymentProps {
  order: any
}

export const OrderPayment = ({ order }: OrderPaymentProps) => {
  const [paymentLink, setPaymentLink] = useState('')
  const { toast } = useToast()

  const handlePaymentLinkUpdate = () => {
    toast({
      title: "Payment Link Updated",
      description: "The payment link has been updated successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Total Amount</h3>
            <p className="text-3xl font-bold">${order.total_amount}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Link</label>
            <div className="flex space-x-2">
              <Input
                value={paymentLink}
                onChange={(e) => setPaymentLink(e.target.value)}
                placeholder="Enter payment link"
              />
              <Button onClick={handlePaymentLinkUpdate}>Update</Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Payment Status</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm">Status: {order.status}</p>
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <Button className="w-full">
            Proceed to Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
