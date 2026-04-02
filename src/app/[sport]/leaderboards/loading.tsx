export default function LeaderboardsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[var(--psp-navy)] to-[#0f2040] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 w-56 bg-white/10 rounded animate-pulse mb-3" />
          <div className="h-5 w-80 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="h-5 w-36 bg-gray-200 rounded animate-pulse mb-4" />
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                  <div className="ml-auto h-4 w-10 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
