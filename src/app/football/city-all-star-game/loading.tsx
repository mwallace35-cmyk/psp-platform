export default function CityAllStarGameLoading() {
  return (
    <main className="min-h-screen bg-[var(--psp-navy)] text-white" role="status" aria-busy="true" aria-label="Loading all-star game">
      {/* Breadcrumbs Skeleton */}
      <div className="border-b border-[var(--psp-gold)]/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 animate-pulse">
            <div className="h-4 w-12 bg-white/10 rounded" />
            <div className="h-4 w-12 bg-white/10 rounded" />
            <div className="h-4 w-24 bg-white/10 rounded" />
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <section className="border-b border-[var(--psp-gold)]/30 bg-gradient-to-b from-[var(--psp-navy-mid)] to-[var(--psp-navy)]">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl space-y-4 animate-pulse">
            <div className="h-12 w-96 bg-white/10 rounded" />
            <div className="h-6 w-64 bg-white/10 rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-white/10 rounded" />
              <div className="h-4 w-full bg-white/10 rounded" />
              <div className="h-4 w-48 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip Skeleton */}
      <section className="border-b border-[var(--psp-gold)]/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-6 space-y-3"
              >
                <div className="h-4 w-24 bg-white/10 rounded" />
                <div className="h-8 w-16 bg-white/10 rounded" />
                <div className="h-3 w-20 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Archive Section Skeleton */}
      <section className="container mx-auto px-4 py-12">
        <div className="space-y-8 animate-pulse">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-[var(--psp-gold)]/30 pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-24 bg-white/10 rounded" />
            ))}
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="h-8 w-48 bg-white/10 rounded" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="bg-white/5 rounded-lg border border-[var(--psp-gold)]/20 p-4 h-20"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
