export default function PlayerProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[var(--psp-navy)] to-[#0f2040] py-10 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-5">
          <div className="w-20 h-20 bg-white/10 rounded-full animate-pulse" />
          <div>
            <div className="h-9 w-56 bg-white/10 rounded animate-pulse mb-2" />
            <div className="h-4 w-40 bg-white/10 rounded animate-pulse mb-1" />
            <div className="h-4 w-28 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-7 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-6 w-44 bg-gray-200 rounded animate-pulse mb-4" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
