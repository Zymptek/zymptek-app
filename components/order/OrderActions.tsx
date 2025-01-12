import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, MessageSquare, Ban, CheckCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface OrderActionsProps {
  order: any
  userRole: string
  onUpdate: (updates: any) => void
}

export function OrderActions({ order, userRole, onUpdate }: OrderActionsProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [reportType, setReportType] = useState('')
  const [reportDescription, setReportDescription] = useState('')
  const { toast } = useToast()

  const handleReport = async () => {
    try {
      // Implement report submission logic here
      toast({
        title: "Report Submitted",
        description: "Your report has been submitted successfully."
      })
      setIsReportDialogOpen(false)
      setReportType('')
      setReportDescription('')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report.",
        variant: "destructive"
      })
    }
  }

  const handleOrderAction = async (action: string) => {
    try {
      // Implement order action logic here
      toast({
        title: "Action Successful",
        description: `Order has been ${action} successfully.`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} order.`,
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
      <Card>
        <CardHeader>
          <CardTitle>Available Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userRole === 'buyer' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => handleOrderAction('confirm')}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Receipt
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => handleOrderAction('dispute')}
              >
                <Ban className="mr-2 h-4 w-4" />
                Open Dispute
              </Button>
            </div>
          )}

          {userRole === 'seller' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => handleOrderAction('ship')}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Shipped
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => handleOrderAction('cancel')}
              >
                <Ban className="mr-2 h-4 w-4" />
                Cancel Order
              </Button>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsReportDialogOpen(true)}
              className="w-full md:w-auto"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Report Issue
            </Button>
            <Button
              variant="outline"
              className="w-full md:w-auto"
              asChild
            >
              <a href={`/messages/${order.id}`}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Support
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quality">Quality Issue</SelectItem>
                <SelectItem value="shipping">Shipping Problem</SelectItem>
                <SelectItem value="payment">Payment Issue</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Describe the issue..."
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReport}>
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
