"use client"

import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, Wallet } from "lucide-react"
import { GetStartedButton } from "./get-started-button"

interface FeatureCardProps {
  icon: React.ReactNode
  label: string
  description: string
  delay?: number
}

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background-light to-white">
      {/* Animated background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 tech-pattern opacity-20">
          <div className="absolute inset-0 animate-pulse-slow bg-gradient-to-br from-brand-100/10 via-transparent to-brand-300/10"></div>
        </div>
      </div>

      {/* Animated decorative blobs */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-100/20 rounded-full blur-3xl animate-blob"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-500/30 rounded-full blur-3xl animate-blob animation-delay-2000"
      />

      <div className="relative">
        <div className="container mx-auto">
          <div className="relative px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              {/* Left Column - Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-left space-y-12"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center px-6 py-2 rounded-full bg-brand-100/10 border border-brand-200/20 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <span className="w-2 h-2 rounded-full bg-brand-200 animate-pulse mr-2"></span>
                  <span className="text-sm font-medium text-brand-200 tracking-wide uppercase">About Zymptek</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-4xl md:text-5xl lg:text-7xl font-bold text-text-light tracking-tight leading-[1.1]"
                >
                  <span className="block mb-2">Revolutionizing</span>
                  <span className="relative inline-block whitespace-nowrap mx-2">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="absolute left-0 bottom-2 h-3 bg-brand-500/40 -z-10"
                    />
                    <span className="text-brand-200">Global Trade</span>
                  </span>
                  <span className="block mt-2">Through Innovation</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-xl md:text-2xl text-brand-400 leading-relaxed max-w-2xl font-light"
                >
                  At Zymptek, we're bridging the gap between global buyers and Indian manufacturers, creating a seamless ecosystem powered by trust, technology, and transparency.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex flex-wrap gap-6 pt-8"
                >
                  <GetStartedButton href="/sign-up" />
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      document.getElementById('about-vision')?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      })
                    }}
                    className="inline-flex items-center px-8 py-4 rounded-full border-2 border-brand-200/20 text-brand-200 font-semibold hover:bg-brand-100/10 transition-all duration-300"
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Right Column - Features */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-100/20 to-brand-300/10 rounded-3xl blur-2xl"></div>
                <motion.div 
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-brand-100/20 futuristic-border"
                >
                  <div className="grid gap-8">
                    <FeatureCard
                      icon={<ShieldCheck className="w-7 h-7 text-brand-200" />}
                      label="Verified Suppliers"
                      description="Thoroughly vetted manufacturers ensuring quality and reliability"
                      delay={0.3}
                    />
                    <FeatureCard
                      icon={<Wallet className="w-7 h-7 text-brand-200" />}
                      label="Secure Escrow"
                      description="Protected payments and guaranteed delivery through our escrow service"
                      delay={0.35}
                    />
                    <FeatureCard
                      icon={<CheckCircle2 className="w-7 h-7 text-brand-200" />}
                      label="Quality Assurance"
                      description="Rigorous quality control and inspection processes"
                      delay={0.4}
                    />
                    <FeatureCard
                      icon={<Clock className="w-7 h-7 text-brand-200" />}
                      label="24/7 Support"
                      description="Round-the-clock expert assistance for seamless trade"
                      delay={0.45}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, label, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="group p-6 rounded-2xl hover:bg-brand-100/5 transition-all duration-300 border border-transparent hover:border-brand-200/20 glow-effect"
    >
      <div className="flex items-start gap-4">
        <motion.div 
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="p-3 rounded-xl bg-brand-100/10 group-hover:bg-brand-100/20 transition-colors duration-300"
        >
          {icon}
        </motion.div>
        <div className="space-y-2">
          <div className="text-xl font-semibold text-brand-200">{label}</div>
          <div className="text-base text-brand-400 leading-relaxed">{description}</div>
        </div>
      </div>
    </motion.div>
  )
}