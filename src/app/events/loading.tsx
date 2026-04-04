export default function EventsLoading() {
  return (
    <main className="min-h-screen" style={{ background: "var(--psp-gray-50, #f8fafc)" }}>
      {/* Hero skeleton */}
      <div className="py-10 md:py-14 px-4" style={{ background: "var(--psp-navy)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="h-12 w-80 bg-white/10 rounded mb-3 animate-pulse" />
          <div className="h-5 w-96 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
      {/* Filter skeleton */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        {[1, 2, 3].map((row) => (
          <div key={row} className="flex gap-2 mb-3">
            <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-gray-100 rounded-full animate-pulse" />
            ))}
          </div>
        ))}
      </div>
      {/* Cards skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex h-12">
              <div className="w-16 bg-gray-200 animate-pulse" />
              <div className="flex-1 bg-gray-50 animate-pulse" />
            </div>
            <div className="p-4 space-y-3">
              <div className="h-4 w-16 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-36 bg-gray-50 rounded animate-pulse" />
            </div>
            <div className="h-10 border-t border-gray-100 bg-gray-50/50 animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  );
}
