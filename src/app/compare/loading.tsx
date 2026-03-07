export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      {/* Page title skeleton */}
      <div className="h-10 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-8" />

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-96 bg-gray-200 rounded" />
        <div className="h-96 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
