"use client"

import { motion } from "framer-motion"
import { Target, Lightbulb, Users, Globe2 } from "lucide-react"

interface VisionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
}

export default function AboutVision() {
  return (
    <section id="about-vision" className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 tech-pattern opacity-10" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-6 py-2 rounded-full bg-brand-100/10 border border-brand-200/20 shadow-sm mb-6"
          >
            <span className="text-sm font-medium text-brand-200 tracking-wide uppercase">Our Vision</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-text-light mb-6"
          >
            Transforming Global Trade Through
            <span className="text-brand-200 ml-2">Innovation</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-brand-400 leading-relaxed"
          >
            We envision a future where international trade is as seamless as local commerce, 
            powered by cutting-edge technology and built on trust.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <VisionCard
            icon={<Target className="w-8 h-8" />}
            title="Mission"
            description="To simplify global trade by connecting quality Indian manufacturers with international buyers through innovative technology."
            delay={0.2}
          />
          <VisionCard
            icon={<Lightbulb className="w-8 h-8" />}
            title="Innovation"
            description="Leveraging cutting-edge technology to create efficient, transparent, and secure trading processes."
            delay={0.3}
          />
          <VisionCard
            icon={<Users className="w-8 h-8" />}
            title="Community"
            description="Building a trusted network of verified manufacturers and buyers to foster long-term business relationships."
            delay={0.4}
          />
          <VisionCard
            icon={<Globe2 className="w-8 h-8" />}
            title="Impact"
            description="Empowering businesses globally while promoting sustainable and ethical trading practices."
            delay={0.5}
          />
        </div>
      </div>
    </section>
  )
}

function VisionCard({ icon, title, description, delay = 0 }: VisionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative p-8 rounded-2xl bg-white hover:bg-brand-100/5 border border-brand-100/20 transition-all duration-300 futuristic-border"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-100/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-100/10 text-brand-200 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-brand-200">{title}</h3>
        <p className="text-brand-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
} 