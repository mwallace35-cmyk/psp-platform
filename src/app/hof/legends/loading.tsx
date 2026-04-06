export default function LegendsLoading() {
  return (
    <div className="min-h-screen bg-[var(--psp-cream)]">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-r from-[var(--psp-navy)] to-[var(--psp-navy-mid)] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-4 w-24 bg-white/10 rounded mb-4 animate-pulse" />
          <div className="h-10 w-96 bg-white/10 rounded mb-3 animate-pulse" />
          <div className="h-5 w-64 bg-white/10 rounded mb-6 animate-pulse" />
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-8 w-20 bg-white/10 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Card grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-5 animate-pulse"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-[var(--psp-gray-200)]" />
                <div className="flex-1">
                  <div className="h-5 w-32 bg-[var(--psp-gray-200)] rounded mb-2" />
                  <div className="h-3 w-48 bg-[var(--psp-gray-100)] rounded mb-1" />
                  <div className="h-3 w-40 bg-[var(--psp-gray-100)] rounded" />
                </div>
              </div>
              <div className="h-3 w-full bg-[var(--psp-gray-100)] rounded mt-4" />
              <div className="h-3 w-3/4 bg-[var(--psp-gray-100)] rounded mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
