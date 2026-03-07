export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />

      {/* Page title skeleton */}
      <div className="h-12 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-8" />

      {/* Content sections */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="mb-12">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="space-y-2">
            {[...Array(8)].map((_, j) => (
              <div key={j} className="h-10 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
