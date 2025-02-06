"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const manufacturerFAQs = [
  {
    question: "How do I get verified on Zymptek?",
    answer: "Simply sign up, create your account, and upload the required documentation. Our verification team will review your documents within a few days and notify you via email."
  },
  {
    question: "How and when do I receive payments?",
    answer: "Payments are processed through our secure escrow system. Funds are released according to the milestones agreed upon in your escrow agreement."
  },
  {
    question: "How do you protect me from payment fraud?",
    answer: "Our escrow system ensures 100% payment security. Funds are verified and secured in escrow before you begin production, guaranteeing payment for your work."
  },
  {
    question: "What are the fees for using Zymptek?",
    answer: "Currently, listing your company on Zymptek is free. There is a small fee for escrow services to ensure secure transactions."
  },
  {
    question: "How do I handle disputes?",
    answer: "If any issues arise, create a ticket through your dashboard and submit relevant documentation. Our dispute resolution team will work promptly to address the situation."
  }
]

export default function FAQManufacturers() {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-brand-100/20">
        <h2 className="text-2xl font-bold mb-6 text-brand-200">For Manufacturers</h2>
        <Accordion type="single" collapsible className="space-y-4">
          {manufacturerFAQs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`manufacturer-${index}`}
              className="border-b border-brand-100/20 last:border-0"
            >
              <AccordionTrigger className="text-left text-brand-200 hover:text-brand-300 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-brand-300">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.div>
  )
} 