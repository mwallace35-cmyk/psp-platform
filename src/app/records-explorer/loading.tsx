export default function RecordsExplorerSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-10 px-4 bg-gradient-to-r from-[#0a1628] to-[#0f2040] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-64 bg-gray-400 rounded animate-pulse mb-4"></div>
          <div className="h-4 w-full max-w-3xl bg-gray-400 rounded animate-pulse"></div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
              {/* Sport Filter */}
              <div>
                <div className="h-5 w-24 bg-gray-300 rounded animate-pulse mb-3"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-300 rounded animate-pulse flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Category Filter */}
              <div>
                <div className="h-5 w-28 bg-gray-300 rounded animate-pulse mb-3"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-4 w-24 bg-gray-300 rounded animate-pulse flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Era Filter */}
              <div>
                <div className="h-5 w-20 bg-gray-300 rounded animate-pulse mb-3"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-300 rounded animate-pulse flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="h-8 w-12 bg-gray-300 rounded animate-pulse mx-auto mb-2"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded animate-pulse mx-auto"></div>
                </div>
              ))}
            </div>

            {/* Records List */}
            <div className="space-y-4">
              {[...Array(4)].map((_, groupIdx) => (
                <div key={groupIdx} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {/* Section Header */}
                  <div className="bg-[#0a1628] text-white px-6 py-4">
                    <div className="h-6 w-40 bg-gray-400 rounded animate-pulse"></div>
                  </div>

                  {/* Records */}
                  <div className="divide-y divide-gray-200">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`p-4 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="h-5 w-56 bg-gray-300 rounded animate-pulse mb-2"></div>
                            <div className="h-4 w-40 bg-gray-300 rounded animate-pulse"></div>
                          </div>
                          <div className="h-7 w-20 bg-[#f0a500] rounded animate-pulse flex-shrink-0"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
