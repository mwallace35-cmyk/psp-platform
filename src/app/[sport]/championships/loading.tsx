export default function ChampionshipsSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#0f2040] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-64 bg-gray-400 rounded animate-pulse"></div>
          <div className="h-4 w-96 bg-gray-400 rounded animate-pulse mt-2"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Championship Groups */}
            {[...Array(3)].map((_, groupIdx) => (
              <div
                key={groupIdx}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="bg-[#0a1628] text-white px-6 py-4">
                  <div className="h-6 w-40 bg-gray-400 rounded animate-pulse"></div>
                </div>
                <div className="divide-y divide-gray-200">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`p-4 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="h-5 w-48 bg-gray-300 rounded animate-pulse mb-2"></div>
                          <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                        <div className="h-6 w-16 bg-[#f0a500] rounded animate-pulse ml-2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar - Dynasty Tracker */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-4">
              <div className="h-6 w-40 bg-gray-300 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    <div className="h-5 w-12 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
