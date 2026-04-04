export default function EventDetailLoading() {
  return (
    <main className="min-h-screen" style={{ background: "var(--psp-gray-50, #f8fafc)" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-5" />
        <div className="h-5 w-20 bg-gray-100 rounded-full animate-pulse mb-3" />
        <div className="h-10 w-96 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-5 w-48 bg-gray-100 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 h-20 animate-pulse" />
          ))}
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 h-40 animate-pulse" />
      </div>
    </main>
  );
}
