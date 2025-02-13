import { Skeleton } from "@/components/ui/skeleton"

interface LoadingProps {
  type?: 'default' | 'content' | 'minimal'
}

export const Loading = ({ type = 'default' }: LoadingProps) => {
  if (type === 'minimal') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (type === 'content') {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-8 w-3/4 max-w-2xl" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[50vh] space-y-8 p-4">
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4 max-w-2xl" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-24 w-full max-w-3xl" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
} 