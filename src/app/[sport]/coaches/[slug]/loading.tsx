export default function CoachProfileSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#0f2040] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-gray-400 rounded animate-pulse mb-4"></div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="h-6 w-32 bg-gray-400 rounded animate-pulse mb-2"></div>
              <div className="h-6 w-24 bg-gray-400 rounded animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="h-6 w-32 bg-gray-400 rounded animate-pulse mb-2"></div>
              <div className="h-6 w-24 bg-gray-400 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Career Stats Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
              <div className="bg-[#0a1628] text-white px-6 py-4">
                <div className="h-6 w-48 bg-gray-400 rounded animate-pulse"></div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="text-center">
                      <div className="h-8 w-16 bg-gray-300 rounded animate-pulse mb-2 mx-auto"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coaching Timeline Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-[#0a1628] text-white px-6 py-4">
                <div className="h-6 w-48 bg-gray-400 rounded animate-pulse"></div>
              </div>
              <div className="p-6 space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <div className="h-6 w-40 bg-gray-300 rounded animate-pulse mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-56 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
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
