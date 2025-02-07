"use client"

import { Card, CardContent } from "@/components/ui/card"
import { GetStartedButton } from "./get-started-button"
import { motion } from "framer-motion"
import { AboutCTAData } from '@/lib/data/about'

interface AboutCTAProps {
  data: AboutCTAData
}

export default function AboutCTA({ data }: AboutCTAProps) {
  return (
    <section className="container py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mx-8 md:mx-12 lg:mx-16"
      >
        <Card className="w-full overflow-hidden bg-white border border-brand-200/20 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl">
          <CardContent className="relative p-8 md:p-12">
            <div className="relative flex flex-col items-center text-center space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-4"
              >
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{
                  background: 'var(--brand-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Join Us in Reshaping Global Commerce
                </h2>
                <p className="text-brand-400 text-lg max-w-2xl mx-auto leading-relaxed">
                  Experience the future of international trade with Zymptek. Let's make global commerce simple, secure, and efficient together.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <GetStartedButton href="/sign-up" />
              </motion.div>
            </div>
            
            {/* Subtle accent line */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-brand-200/20 to-transparent" />
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
} 