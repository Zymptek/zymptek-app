"use client"

import { motion } from "framer-motion"
import { Target, Lightbulb, Rocket } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TimelineItemProps {
  icon: React.ReactNode
  title: string
  description: string
  content: string
  index: number
}

interface TimelineConfig {
  header: {
    badge: string;
    title: string;
    highlightedText: string;
    description: string;
  };
  items: {
    icon: React.ReactNode;
    title: string;
    description: string;
    content: string;
  }[];
}

const timelineConfig: TimelineConfig = {
  header: {
    badge: "Our Story",
    title: "Building the Future of",
    highlightedText: "Global Trade",
    description: "We're building Zymptek with a simple yet powerful vision: making international trade seamless, secure, and efficient for businesses worldwide."
  },
  items: [
    {
      icon: <Target className="w-6 h-6" />,
      title: "The Challenge",
      description: "Identifying the Gap",
      content: "Born from firsthand experience with the challenges of global trade, we recognized that India's manufacturing potential wasn't being fully leveraged. Despite the country's enormous manufacturing capabilities, the lack of a reliable platform and trust issues in international trade were holding businesses back."
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Our Solution",
      description: "Bridging the Gap",
      content: "At Zymptek, we're bridging this gap by combining strong relationships with innovative technology. We verify every manufacturer on our platform, secure transactions through escrow payments, and provide real-time updates at every step. Our goal is to make importing from India a worry-free experience for businesses worldwide."
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "The Future",
      description: "Expanding Horizons",
      content: "Starting with textiles, we're building a comprehensive platform where trust and transparency aren't just promises – they're built into every feature. We're expanding into automotive parts, wooden & handcrafted items, chemicals, and medical equipment, creating a seamless experience that prioritizes quality and reliability."
    }
  ]
}

function TimelineItem({ icon, title, description, content, index }: TimelineItemProps) {
  const isLeft = index % 2 === 0;
  
  return (
    <div className="relative">
      {/* Desktop Layout */}
      <div className="hidden sm:block">
        <div className="mt-6 sm:mt-0 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-center">
            <div className={cn(
              "flex w-full mx-auto items-center",
              isLeft ? "justify-start" : "justify-end"
            )}>
              <div className={cn(
                "w-full sm:w-1/2",
                isLeft ? "sm:pr-8" : "sm:pl-8"
              )}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className="p-6 bg-white/80 backdrop-blur rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-border-light futuristic-border">
                    <div className="flex items-start gap-4 mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-200"
                      >
                        {icon}
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-semibold text-brand-200">{title}</h3>
                        <p className="text-sm text-brand-400">{description}</p>
                      </div>
                    </div>
                    <p className="text-brand-400 leading-relaxed">
                      {content}
                    </p>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Timeline Dot and Connecting Line */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              {/* Horizontal Line */}
              <div 
                className={cn(
                  "absolute h-0.5 bg-brand-200",
                  isLeft 
                    ? "w-[calc(50%-3rem)] -right-4" 
                    : "w-[calc(50%-3rem)] -left-4"
                )}
              />

              {/* Dot */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
                className="rounded-full bg-brand-200 border-4 border-white w-8 h-8 flex items-center justify-center shadow-md z-10"
              >
                <div className="w-2 h-2 rounded-full bg-white" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Modern Stacked Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="sm:hidden mb-8"
      >
        <Card className="p-6 bg-white/80 backdrop-blur rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-border-light futuristic-border">
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-200"
            >
              {icon}
            </motion.div>
            <div>
              <h3 className="text-xl font-semibold text-brand-200">{title}</h3>
              <p className="text-sm text-brand-400">{description}</p>
            </div>
          </div>
          <p className="text-brand-400 leading-relaxed">
            {content}
          </p>
        </Card>
      </motion.div>
    </div>
  )
}

export function AboutStory() {
  return (
    <section className="relative py-24 overflow-hidden bg-background-light">
      {/* Background Pattern */}
      <div className="absolute inset-0 tech-pattern opacity-10" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="px-6 py-2 text-brand-200 border-brand-200/20 mb-6">
              {timelineConfig.header.badge}
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-text-light mb-6"
          >
            {timelineConfig.header.title}
            <span className="text-brand-200 ml-2">{timelineConfig.header.highlightedText}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-brand-400 leading-relaxed"
          >
            {timelineConfig.header.description}
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-6xl sm:mx-auto w-full px-2 sm:px-0">
          {/* Main Vertical Line */}
          <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full">
            <div className="h-full bg-gradient-to-b from-brand-200 via-brand-300 to-brand-200" />
          </div>
          
          {/* Timeline Items */}
          <div className="relative text-brand-400 antialiased text-sm font-semibold">
            {timelineConfig.items.map((item, index) => (
              <TimelineItem
                key={index}
                {...item}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}