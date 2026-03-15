import { Skeleton } from "@/components/ui";

export default function AwardsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#0f2040]">
      {/* Header Skeleton */}
      <header className="bg-gradient-to-r from-[#0a1628] to-[#0f2040] border-b-4 border-[#f0a500]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-5 w-64 mb-4" />
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Skeleton className="h-12 w-96 mb-3" />
              <Skeleton className="h-6 w-full max-w-xl" />
            </div>
            <Skeleton className="h-12 w-12 rounded" />
          </div>
        </div>
      </header>

      {/* Stats Strip Skeleton */}
      <div className="bg-[#0f2040] border-b border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-4">
            {/* Tab Bar */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-28 rounded-lg" />
              ))}
            </div>

            {/* Decade Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>

            {/* Year Accordions */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="px-4 py-3">
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Skeleton */}
          <aside className="lg:col-span-1">
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-6">
              <div className="bg-[#0a1628] border-b border-[#f0a500] px-4 py-3">
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-[#0a1628] border-b border-[#f0a500] px-4 py-3">
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="p-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
