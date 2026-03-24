export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse" role="status" aria-busy="true" aria-label="Loading schedule">
      <div className="bg-gradient-to-br from-navy via-navy-mid to-navy py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-3 w-40 bg-white/10 rounded mb-4" />
          <div className="h-10 w-96 bg-white/10 rounded mb-3" />
          <div className="h-4 w-72 bg-white/10 rounded mb-4" />
          <div className="flex gap-6 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 w-20 bg-white/10 rounded" />
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 py-3 px-4">
        <div className="max-w-6xl mx-auto flex gap-3">
          <div className="h-8 w-48 bg-gray-200 rounded-lg" />
          <div className="h-8 w-40 bg-gray-200 rounded-lg" />
          <div className="flex gap-1 ml-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-7 w-16 bg-gray-200 rounded-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {[1, 2, 3].map((w) => (
          <div key={w}>
            <div className="h-6 w-64 bg-gray-200 rounded mb-3" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((g) => (
                <div
                  key={g}
                  className="h-14 bg-gray-200 rounded-lg"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
