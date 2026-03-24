export default function ProsProsLoading() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading pro athletes">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-br from-navy to-navy-mid py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-6 bg-navy-light rounded w-32 mb-8 animate-pulse" />

          <div className="mt-6">
            <div className="h-12 bg-navy-light rounded w-2/3 mb-3 animate-pulse" />
            <div className="h-6 bg-navy-light rounded w-full mb-2 animate-pulse" />
            <div className="h-6 bg-navy-light rounded w-2/3 animate-pulse" />
          </div>

          {/* Stats Strip */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-navy-light rounded-lg p-4 border border-gold animate-pulse">
                <div className="h-3 bg-navy rounded w-20 mb-2" />
                <div className="h-8 bg-navy rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="border-b border-gray-200 bg-white sticky top-14 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 rounded animate-pulse w-32"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Pro Player Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-20 mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                  <div className="flex gap-2 mb-4">
                    {[...Array(2)].map((_, j) => (
                      <div
                        key={j}
                        className="h-6 bg-gray-200 rounded w-12"
                      />
                    ))}
                  </div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j}>
                        <div className="h-3 bg-gray-200 rounded w-16 mb-1" />
                        <div className="h-5 bg-gray-200 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-navy-light rounded-lg border border-gold p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-24 mb-4" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-700 rounded" />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-6 h-64 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
