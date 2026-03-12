import { Skeleton } from "@/components/ui";

export default function DynastiesLoading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />

      {/* Decade Filter Skeleton */}
      <div className="flex gap-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-20" />
        ))}
      </div>

      {/* Timeline Skeleton */}
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <div className="space-y-3">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="flex items-center gap-4">
                  <Skeleton className="h-6 w-32 flex-shrink-0" />
                  <Skeleton className="h-8 flex-1 rounded-full" />
                  <Skeleton className="h-6 w-12 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
