export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[var(--psp-navy)] to-[#0f2040] py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-10 w-32 bg-white/10 rounded animate-pulse mb-4" />
          <div className="h-12 w-full bg-white/10 rounded-lg animate-pulse" />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1">
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
