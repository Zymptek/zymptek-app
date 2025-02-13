'use client'

import Error from '@/components/error'

export default function AboutError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Error 
      error={error} 
      reset={reset} 
      message="We're having trouble loading the about page content."
    />
  )
} 