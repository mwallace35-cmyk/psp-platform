export default function PlayerProfileSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#0f2040] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 items-start">
            {/* Avatar Skeleton */}
            <div className="h-20 w-20 bg-gray-400 rounded-full animate-pulse flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-8 w-48 bg-gray-400 rounded animate-pulse"></div>
              <div className="flex gap-2 mt-3">
                <div className="h-6 w-24 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="h-4 w-16 bg-gray-300 rounded animate-pulse mb-2"></div>
                  <div className="h-8 w-20 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Season Stats Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-[#0a1628] text-white px-6 py-4">
                <div className="h-6 w-48 bg-gray-400 rounded animate-pulse"></div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      {[...Array(6)].map((_, i) => (
                        <th key={i} className="px-4 py-3">
                          <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(6)].map((_, i) => (
                      <tr
                        key={i}
                        className={`border-b border-gray-100 ${
                          i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="h-6 w-32 bg-gray-300 rounded animate-pulse mb-4"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-20 bg-gray-300 rounded animate-pulse mb-2"></div>
                    <div className="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
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
