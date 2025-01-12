import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CircleDollarSign, Lock, ArrowUpRight, AlertCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface OrderEscrowProps {
  order: any
  userRole: string
  onUpdate: (updates: any) => void
}

export function OrderEscrow({ order, userRole, onUpdate }: OrderEscrowProps) {
  const [paymentLink, setPaymentLink] = useState(order.escrow.paymentLink)
  const { toast } = useToast()

  const handlePaymentLinkUpdate = async () => {
    try {
      await onUpdate({ escrow: { ...order.escrow, paymentLink } })
      toast({
        title: "Payment Link Updated",
        description: "The payment link has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment link.",
        variant: "destructive"
      })
    }
  }

  const escrowHistory = [
    {
      date: new Date(order.created_at).toLocaleDateString(),
      amount: order.escrow.inEscrow,
      action: "Funds Deposited",
      status: "Completed"
    }
  ]

  const handleEscrowAction = async (action: string) => {
    try {
      // Implement escrow action logic here
      toast({
        title: "Action Initiated",
        description: `${action} request has been submitted.`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process request.",
        variant: "destructive"
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-brand-50 p-6 rounded-lg border border-brand-100"
        >
          <h3 className="text-sm font-medium text-brand-600 mb-2">Total Amount</h3>
          <div className="flex items-center space-x-2">
            <CircleDollarSign className="h-5 w-5 text-brand-500" />
            <span className="text-2xl font-bold text-brand-700">
              ${order.escrow.totalAmount.toLocaleString()}
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-blue-50 p-6 rounded-lg border border-blue-100"
        >
          <h3 className="text-sm font-medium text-blue-600 mb-2">In Escrow</h3>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-blue-500" />
            <span className="text-2xl font-bold text-blue-700">
              ${order.escrow.inEscrow.toLocaleString()}
            </span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-green-50 p-6 rounded-lg border border-green-100"
        >
          <h3 className="text-sm font-medium text-green-600 mb-2">Released</h3>
          <div className="flex items-center space-x-2">
            <ArrowUpRight className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-bold text-green-700">
              ${order.escrow.released.toLocaleString()}
            </span>
          </div>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Escrow History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escrowHistory.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>${entry.amount.toLocaleString()}</TableCell>
                  <TableCell>{entry.action}</TableCell>
                  <TableCell>
                    <Badge variant={entry.status === "Completed" ? "default" : "destructive"}>
                      {entry.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
