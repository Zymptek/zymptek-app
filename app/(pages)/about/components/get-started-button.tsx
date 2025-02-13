import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface GetStartedButtonProps {
  href: string
  className?: string
  text?: string
}

export function GetStartedButton({ href, className = "", text = "Get Started" }: GetStartedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link 
        href={href}
        className={`inline-flex items-center px-8 py-4 rounded-full bg-brand-200 text-white font-semibold shadow-lg hover:shadow-xl hover:bg-brand-300 transition-all duration-300 ${className}`}
      >
        {text}
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowRight className="ml-2 h-5 w-5" />
        </motion.div>
      </Link>
    </motion.div>
  )
} 