"use client"

import { motion } from "framer-motion"

export default function FAQHero() {
  return (
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-brand-200">
        Frequently Asked Questions
      </h1>
      <p className="text-lg text-brand-300 max-w-2xl mx-auto">
        Find answers to common questions about using Zymptek's B2B trade platform
      </p>
    </motion.div>
  )
} 