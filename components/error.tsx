'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
  message?: string
}

export default function Error({
  error,
  reset,
  message = "We're having trouble loading the content.",
}: ErrorProps) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden relative futuristic-border bg-white/80 backdrop-blur-sm">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#8f1e00]/10 via-[#dd6236]/10 to-[#FF7F50]/10 animate-gradient opacity-50" />
        
        <div className="relative p-8 space-y-8">
          {/* Zymptek Logo */}
          <div className="relative flex flex-row items-center justify-center">
            {/* <div className="absolute -inset-2 bg-gradient-to-r from-[#8f1e00] via-[#dd6236] to-[#FF7F50] opacity-30 blur-xl animate-pulse-glow" /> */}
            <AlertCircle className="relative h-24 w-24 text-[#dd6236] drop-shadow-lg" />
          </div>

          {/* Error Message */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-[#8f1e00] via-[#dd6236] to-[#FF7F50] bg-clip-text text-transparent animate-gradient">
              Oops! Something went wrong
            </h2>
            <p className="text-muted-foreground/80 text-lg leading-relaxed">
              {message}
            </p>
          </div>

          {/* Action Button with hover effect */}
          <div className="relative group">
            <Button
              onClick={() => reset()}
              size="lg"
              className="relative w-full px-8 py-6 text-lg font-semibold rounded-xl bg-gradient-to-r from-[#8f1e00] via-[#dd6236] to-[#FF7F50] text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] hover:from-[#FF7F50] hover:via-[#dd6236] hover:to-[#8f1e00] animate-gradient"
            >
              Try Again
            </Button>
          </div>

          {/* Error ID - Only shown in development */}
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mt-4 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-[#dd6236]/20">
              <p className="text-sm text-muted-foreground/70 font-mono">
                Error ID: {error.message}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
} 