export default function GameDetailLoading() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8 animate-pulse" role="status" aria-busy="true" aria-label="Loading game details">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-64 bg-gray-800 rounded mb-6" />

      {/* Score header */}
      <div className="bg-[var(--psp-navy)] rounded-xl border border-gray-700 overflow-hidden mb-8">
        <div className="h-8 bg-gray-800" />
        <div className="px-6 py-8">
          <div className="grid grid-cols-3 items-center text-center gap-4">
            <div className="space-y-3">
              <div className="h-6 w-32 bg-gray-700 rounded mx-auto" />
              <div className="h-12 w-16 bg-gray-700 rounded mx-auto" />
            </div>
            <div className="h-4 w-12 bg-gray-800 rounded mx-auto" />
            <div className="space-y-3">
              <div className="h-6 w-32 bg-gray-700 rounded mx-auto" />
              <div className="h-12 w-16 bg-gray-700 rounded mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Box score skeleton */}
      <div className="h-8 w-32 bg-gray-800 rounded mb-4" />
      <div className="bg-[var(--psp-navy)] rounded-xl border border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-6 w-40 bg-gray-700 rounded" />
              {[0, 1, 2, 3, 4].map((j) => (
                <div key={j} className="h-4 bg-gray-800 rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
