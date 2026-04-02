export default function SportHubLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-br from-[var(--psp-navy)] to-[#0f2040] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 w-48 bg-white/10 rounded animate-pulse mb-3" />
          <div className="h-5 w-72 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      {/* Sections skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Scores strip */}
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="min-w-[180px] bg-white rounded-lg border border-gray-200 p-3">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        {/* Leaderboard preview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="ml-auto h-4 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
