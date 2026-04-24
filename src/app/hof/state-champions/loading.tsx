export default function StateChampionsLoading() {
  return (
    <div className="min-h-screen bg-[var(--psp-navy)]">
      <div className="bg-[var(--psp-navy)] border-b border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-4 w-24 bg-white/10 rounded mb-4 animate-pulse" />
          <div className="h-10 w-80 bg-white/10 rounded mb-3 animate-pulse" />
          <div className="h-5 w-64 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[var(--psp-navy-mid)] rounded-xl border border-white/10 p-5 animate-pulse">
              <div className="h-4 w-32 bg-white/10 rounded mb-3" />
              <div className="h-6 w-48 bg-white/10 rounded mb-2" />
              <div className="h-4 w-40 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
