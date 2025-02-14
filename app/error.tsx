"use client"
import Error from '@/components/error'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({
  error,
  reset,
}: ErrorProps) {
  return (
    <Error 
      error={error}
      reset={reset}
      message="We're having trouble loading this page."
    />
  )
}
