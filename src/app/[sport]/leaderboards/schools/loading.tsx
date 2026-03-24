export default function Loading() {
  return (
    <main role="status" aria-busy="true" aria-label="Loading school leaderboards">
      <section className="py-10" style={{ background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-4 w-48 bg-white/10 rounded mb-4 animate-pulse" />
          <div className="h-12 w-72 bg-white/20 rounded animate-pulse" />
          <div className="h-4 w-64 bg-white/10 rounded mt-3 animate-pulse" />
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 w-36 bg-gray-200 rounded-md animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
          ))}
        </div>
      </div>
    </main>
  );
}
