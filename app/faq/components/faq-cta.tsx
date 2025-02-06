"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function FAQCTA() {
  return (
    <motion.div 
      className="mt-16 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="bg-gradient-to-r from-brand-100 to-brand-200 rounded-2xl p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
          Ready to Get Started?
        </h2>
        <p className="text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of businesses already trading on Zymptek. Start exploring opportunities or list your products today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-brand-200 font-semibold rounded-full hover:bg-opacity-90 transition-colors duration-200"
            >
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-white font-semibold rounded-full border-2 border-white hover:bg-white/10 transition-colors duration-200"
            >
              Explore Products
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
} 