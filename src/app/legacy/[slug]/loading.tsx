export default function LegacyLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero skeleton */}
      <section className="bg-[var(--psp-navy)] py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-8 items-start">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-3 pt-2">
            <div className="h-3 w-24 bg-white/10 rounded-full animate-pulse" />
            <div className="h-10 w-64 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </section>

      {/* Content skeletons */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-100 rounded" />
              <div className="h-4 w-3/4 bg-gray-100 rounded" />
              <div className="h-4 w-1/2 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
