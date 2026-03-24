import { Skeleton } from "@/components/ui";

export default function GreatestSeasonsLoading() {
  return (
    <div className="space-y-8" role="status" aria-busy="true" aria-label="Loading greatest seasons">
      {/* Header Skeleton */}
      <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />

      {/* Filter Pills Skeleton */}
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-4 h-12" />
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="border-t border-gray-200 p-4 h-16 flex items-center gap-4"
            >
              <Skeleton className="h-6 w-12 flex-shrink-0" />
              <Skeleton className="h-6 w-32 flex-shrink-0" />
              <Skeleton className="h-6 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
