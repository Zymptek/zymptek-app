"use client"

import { motion } from "framer-motion"
import FAQHero from "./components/faq-hero"
import FAQBuyers from "./components/faq-buyers"
import FAQManufacturers from "./components/faq-manufacturers"
import FAQCTA from "./components/faq-cta"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background-light py-16 md:py-24">
      <motion.div 
        className="container mx-auto px-4 md:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <FAQHero />
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <FAQBuyers />
          <FAQManufacturers />
        </div>

        <FAQCTA />
      </motion.div>
    </div>
  )
} 