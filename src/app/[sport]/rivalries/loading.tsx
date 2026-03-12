export default function Rivals()  {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#0f2040] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-gray-400 rounded animate-pulse"></div>
          <div className="h-4 w-96 bg-gray-400 rounded animate-pulse mt-2"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter Section */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="h-5 w-32 bg-gray-300 rounded animate-pulse mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-white border border-gray-300 rounded animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Rivalry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-[#0a1628] to-[#0f2040] px-6 py-4">
                <div className="h-6 w-40 bg-gray-400 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-32 bg-gray-400 rounded animate-pulse"></div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {/* Schools */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-gray-300 rounded animate-pulse mb-1"></div>
                  </div>
                  <div className="h-5 w-12 bg-[#f0a500] rounded animate-pulse"></div>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-gray-300 rounded animate-pulse mb-1"></div>
                  </div>
                  <div className="h-5 w-12 bg-gray-300 rounded animate-pulse"></div>
                </div>

                {/* Stats */}
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
