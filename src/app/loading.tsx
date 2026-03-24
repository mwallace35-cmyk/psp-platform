export default function RootLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--psp-navy)] via-[var(--psp-navy-mid)] to-[#1a4d8f]">
      {/* Hero skeleton */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Heading skeleton */}
          <div className="mb-6 sm:mb-8">
            <div className="h-14 sm:h-16 lg:h-20 bg-white/10 rounded-lg animate-pulse mb-4" />
            <div className="h-6 sm:h-8 bg-white/10 rounded-lg animate-pulse max-w-2xl" />
          </div>

          {/* Search box skeleton */}
          <div className="mb-10 sm:mb-12">
            <div className="h-12 sm:h-16 bg-white/10 rounded-lg animate-pulse" />
          </div>

          {/* Quick action cards skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 sm:h-40 bg-white/10 rounded-lg animate-pulse"
              />
            ))}
          </div>

          {/* Stats strip skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-8 sm:pt-10 border-t border-white/10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center sm:text-left">
                <div className="h-8 sm:h-10 bg-white/10 rounded animate-pulse mb-2" />
                <div className="h-4 bg-white/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent games section skeleton */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-[var(--psp-navy)]">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 sm:h-12 bg-white/10 rounded-lg animate-pulse mb-8 max-w-xs" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-white/10 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest coverage section skeleton */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white [data-theme=dark]:bg-[var(--psp-navy)]/40">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 sm:h-12 bg-gray-200 [data-theme=dark]:bg-gray-700 rounded-lg animate-pulse mb-8 max-w-xs" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-80 sm:h-96 bg-gray-200 [data-theme=dark]:bg-gray-700 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sport navigation section skeleton */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-[var(--psp-gray-50)] [data-theme=dark]:bg-[var(--psp-navy)]/40">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 sm:h-12 bg-gray-200 [data-theme=dark]:bg-gray-700 rounded-lg animate-pulse mb-8 max-w-xs" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="h-72 bg-gray-200 [data-theme=dark]:bg-gray-700 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
