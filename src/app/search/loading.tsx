export default function SearchSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#0f2040] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-gray-400 rounded animate-pulse mb-4"></div>
          {/* Search Bar Skeleton */}
          <div className="relative">
            <div className="h-12 w-full bg-gray-400 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Result Groups */}
          {[...Array(3)].map((_, groupIdx) => (
            <div key={groupIdx}>
              {/* Group Title */}
              <div className="h-6 w-40 bg-gray-300 rounded animate-pulse mb-4"></div>

              {/* Result Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="h-5 w-48 bg-gray-300 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-32 bg-gray-300 rounded animate-pulse mb-3"></div>
                    <div className="flex gap-2">
                      <div className="h-6 w-20 bg-gray-300 rounded-full animate-pulse"></div>
                      <div className="h-6 w-24 bg-gray-300 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Empty State Skeleton */}
          <div className="text-center py-12">
            <div className="h-6 w-64 bg-gray-300 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-4 w-80 bg-gray-300 rounded animate-pulse mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
