import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MessageSquare, HelpCircle } from 'lucide-react'
import Link from 'next/link'

interface OrderHeaderProps {
  order: any
  activeView: string
  onViewChange: (view: string) => void
}

export function OrderHeader({ order, activeView, onViewChange }: OrderHeaderProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-200">{order.title}</h1>
          <p className="text-muted-foreground">Order #{order.number}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={activeView} onValueChange={onViewChange}>
            <SelectTrigger className="w-[180px] border-brand-200">
              <SelectValue placeholder="View as" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buyer">View as Buyer</SelectItem>
              <SelectItem value="seller">View as Seller</SelectItem>
            </SelectContent>
          </Select>

          <Link href={`/communication/${order.id}`} passHref>
            <Button variant="outline" className="border-brand-200">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
          </Link>

          <Button variant="outline" className="border-brand-200">
            <HelpCircle className="mr-2 h-4 w-4" />
            Support
          </Button>
        </div>
      </div>

      <Card className="border-brand-100">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge 
                variant="outline" 
                className="ml-2 bg-brand-100 text-brand-300"
              >
                {order.status}
              </Badge>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Progress</span>
              <Progress 
                value={order.progress} 
                className="mt-2 bg-brand-300"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
