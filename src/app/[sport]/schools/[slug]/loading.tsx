export default function SchoolProfileSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#0f2040] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 items-start">
            {/* Sport Icon Placeholder */}
            <div className="h-16 w-16 bg-gray-400 rounded-lg animate-pulse flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-8 w-64 bg-gray-400 rounded animate-pulse"></div>
              <div className="h-4 w-40 bg-gray-400 rounded animate-pulse mt-2"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stat Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center"
            >
              <div className="h-4 w-20 bg-gray-300 rounded animate-pulse mb-2 mx-auto"></div>
              <div className="h-8 w-16 bg-gray-300 rounded animate-pulse mx-auto"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Championships Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-[#0a1628] text-white px-6 py-4">
                <div className="h-6 w-48 bg-gray-400 rounded animate-pulse"></div>
              </div>
              <div className="divide-y divide-gray-200">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4">
                    <div className="h-5 w-40 bg-gray-300 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Season Results Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-[#0a1628] text-white px-6 py-4">
                <div className="h-6 w-48 bg-gray-400 rounded animate-pulse"></div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3">
                        <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                      </th>
                      <th className="px-4 py-3">
                        <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
                      </th>
                      <th className="px-4 py-3">
                        <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                      </th>
                      <th className="px-4 py-3">
                        <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                      </th>
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
                        <td className="px-4 py-3">
                          <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-4">
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
