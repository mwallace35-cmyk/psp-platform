export default function LeaderboardSkeleton() {
  return (
    <div className="min-h-screen bg-white" role="status" aria-busy="true" aria-label="Loading leaderboard">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#0f2040] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-gray-400 rounded animate-pulse"></div>
          <div className="h-4 w-96 bg-gray-400 rounded animate-pulse mt-2"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Bar */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-32 bg-gray-200 rounded-full animate-pulse flex-shrink-0"
            ></div>
          ))}
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left w-12">
                  <div className="h-4 w-6 bg-gray-300 rounded animate-pulse"></div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                </th>
                {[...Array(4)].map((_, i) => (
                  <th key={i} className="px-4 py-3 text-right hidden sm:table-cell">
                    <div className="h-4 w-16 bg-gray-300 rounded animate-pulse ml-auto"></div>
                  </th>
                ))}
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
                    <div className="h-4 w-6 bg-gray-300 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-28 bg-gray-300 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                  </td>
                  {[...Array(4)].map((_, j) => (
                    <td key={j} className="px-4 py-3 text-right hidden sm:table-cell">
                      <div className="h-4 w-12 bg-gray-300 rounded animate-pulse ml-auto"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
  );
}
