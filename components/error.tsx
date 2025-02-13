'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

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
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      <Button
        onClick={() => reset()}
        variant="default"
      >
        Try again
      </Button>
    </div>
  )
} 