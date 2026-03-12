export default function AwardsSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#0f2040] text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-56 bg-gray-400 rounded animate-pulse mb-4"></div>
          <div className="h-4 w-full max-w-2xl bg-gray-400 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Filter Groups */}
              {[...Array(3)].map((_, groupIdx) => (
                <div key={groupIdx} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="h-5 w-32 bg-gray-300 rounded animate-pulse mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-4 w-24 bg-gray-300 rounded animate-pulse flex-1"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="h-8 w-12 bg-gray-300 rounded animate-pulse mx-auto mb-2"></div>
                  <div className="h-4 w-16 bg-gray-300 rounded animate-pulse mx-auto"></div>
                </div>
              ))}
            </div>

            {/* Awards Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left">
                        <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
                      </th>
                      <th className="px-4 py-3 text-left hidden sm:table-cell">
                        <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                      </th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">
                        <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                      </th>
                      <th className="px-4 py-3 text-center">
                        <div className="h-4 w-16 bg-gray-300 rounded animate-pulse mx-auto"></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(10)].map((_, i) => (
                      <tr
                        key={i}
                        className={`border-b border-gray-100 ${
                          i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="h-4 w-40 bg-gray-300 rounded animate-pulse"></div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="h-6 w-16 bg-[#f0a500] rounded animate-pulse mx-auto"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-10 bg-gray-300 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
