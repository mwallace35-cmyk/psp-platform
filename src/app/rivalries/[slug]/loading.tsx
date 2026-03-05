import { Skeleton } from "@/components/ui";

export default function RivalryLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb skeleton */}
      <Skeleton className="h-6 w-64" />

      {/* Header skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-6 w-full max-w-2xl" />
      </div>

      {/* Hero section skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-48 rounded-lg" />
        <Skeleton className="h-48 rounded-lg" />
      </div>

      {/* Stats section skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-10 w-20 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        ))}
      </div>

      {/* Timeline section skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24" />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Players section skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-16 rounded-lg" />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar section skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2" />
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
