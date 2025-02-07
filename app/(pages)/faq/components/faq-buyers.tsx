"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const buyerFAQs = [
  {
    question: "How do you verify manufacturers?",
    answer: "All manufacturers go through a rigorous verification process. Required documents are verified by our trusted third-party verification partner to ensure authenticity and reliability."
  },
  {
    question: "Is my payment secure?",
    answer: "Yes, absolutely. We use escrow for all transactions. Your money is held securely until you receive and approve your order according to the agreed terms."
  },
  {
    question: "How do you ensure product quality?",
    answer: "We maintain quality through regular updates during production. We're also partnering with professional quality inspection houses to provide additional verification services."
  },
  {
    question: "What if I receive defective products?",
    answer: "We have a dedicated dispute resolution center. You can raise a case through your dashboard, and our team will work with both parties to resolve the issue fairly."
  },
  {
    question: "What products can I source through Zymptek?",
    answer: "We currently specialize in textiles and are actively expanding into other categories. Stay tuned for updates!"
  },
  {
    question: "Is there a minimum order value?",
    answer: "We don't set a minimum order value. We recommend discussing quantity requirements directly with manufacturers to ensure optimal pricing."
  },
  {
    question: "Do you handle shipping and logistics?",
    answer: "While we don't directly handle shipping, we can connect you with our trusted logistics partners who can assist with your shipping needs."
  }
]

export default function FAQBuyers() {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-brand-100/20">
        <h2 className="text-2xl font-bold mb-6 text-brand-200">For Buyers</h2>
        <Accordion type="single" collapsible className="space-y-4">
          {buyerFAQs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`buyer-${index}`}
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