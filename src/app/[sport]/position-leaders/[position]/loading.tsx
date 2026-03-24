import { Skeleton } from "@/components/ui";

export default function PositionLeadersLoading() {
  return (
    <div className="space-y-8" role="status" aria-busy="true" aria-label="Loading position leaders">
      {/* Header Skeleton */}
      <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />

      {/* League Filter Skeleton */}
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-100 p-4 h-12" />
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="border-t border-gray-200 p-4 h-16 flex items-center gap-4"
          >
            <Skeleton className="h-6 w-12 flex-shrink-0" />
            <Skeleton className="h-6 w-32 flex-shrink-0" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-6 w-20 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
