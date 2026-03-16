export default function AwardsLoading() {
  return (
    <main className="flex-1 min-h-screen bg-gradient-to-b from-[#0a1628] to-[#0f2040]">
      {/* Hero skeleton */}
      <div className="border-b-4 border-[#f0a500]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <div className="h-4 w-32 bg-gray-700/50 rounded mx-auto mb-4 animate-pulse" />
          <div className="h-12 w-72 bg-gray-700/50 rounded mx-auto mb-3 animate-pulse" />
          <div className="h-5 w-96 max-w-full bg-gray-700/30 rounded mx-auto mb-8 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/5 animate-pulse">
                <div className="h-8 w-16 bg-gray-700/50 rounded mx-auto mb-2" />
                <div className="h-3 w-20 bg-gray-700/30 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sport cards skeleton */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-8 w-48 bg-gray-700/50 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border-2 border-gray-700/50 p-5 animate-pulse"
              style={{ backgroundColor: "#0a1628" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-700/50 rounded" />
                <div className="h-6 w-24 bg-gray-700/50 rounded" />
              </div>
              <div className="flex gap-4">
                <div className="h-5 w-20 bg-gray-700/30 rounded" />
                <div className="h-5 w-16 bg-gray-700/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div>
            <div className="flex gap-2 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-11 w-36 bg-gray-700/30 rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="rounded-lg border border-gray-700/30 bg-gray-800/30 animate-pulse">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="px-5 py-4 border-b border-gray-700/20">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-32 bg-gray-700/40 rounded" />
                    <div className="h-4 w-24 bg-gray-700/30 rounded" />
                    <div className="ml-auto h-4 w-12 bg-gray-700/30 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-gray-700/30 bg-gray-800/30 animate-pulse h-64" />
            ))}
          </aside>
        </div>
      </div>
    </main>
  );
}
