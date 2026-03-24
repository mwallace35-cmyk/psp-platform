export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      {/* Hero section skeleton */}
      <div className="py-16 px-4 text-center mb-8">
        <div className="h-12 bg-gray-200 rounded w-2/3 mx-auto mb-4" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-6 h-32" />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* POTW History */}
        <div className="lg:col-span-2">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-28 bg-gray-200 rounded" />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="h-56 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
