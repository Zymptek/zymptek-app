import { Skeleton } from "@/components/ui/skeleton"

export default function AboutLoading() {
  return (
    <div className="min-h-screen space-y-10 p-4">
      {/* Hero Section Loading */}
      <div className="container mx-auto space-y-6">
        <Skeleton className="h-12 w-3/4 max-w-2xl" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-24 w-full max-w-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Vision Section Loading */}
      <div className="container mx-auto space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-16 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Story Section Loading */}
      <div className="container mx-auto space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-16 w-2/3" />
        <div className="space-y-8 mt-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section Loading */}
      <div className="container mx-auto text-center space-y-6">
        <Skeleton className="h-10 w-1/2 mx-auto" />
        <Skeleton className="h-16 w-3/4 mx-auto" />
        <Skeleton className="h-12 w-48 mx-auto" />
      </div>
    </div>
  )
} 