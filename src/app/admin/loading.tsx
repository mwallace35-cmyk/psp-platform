import { SkeletonCard, SkeletonText } from "@/components/ui";

export default function AdminDashboardLoading() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading admin dashboard">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-64" />
      </div>

      {/* Stat cards skeleton grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="admin-card text-center">
            <div className="h-8 bg-gray-200 rounded mb-2" />
            <div className="h-6 bg-gray-100 rounded mb-1" />
            <div className="h-4 bg-gray-100 rounded w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Sport breakdown table skeleton */}
      <div className="admin-card">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
        <table className="data-table">
          <thead>
            <tr>
              <th><div className="h-4 bg-gray-100 rounded w-24" /></th>
              <th><div className="h-4 bg-gray-100 rounded w-28 ml-auto" /></th>
              <th><div className="h-4 bg-gray-100 rounded w-28 ml-auto" /></th>
              <th><div className="h-4 bg-gray-100 rounded w-28 ml-auto" /></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 7 }).map((_, i) => (
              <tr key={i}>
                <td><div className="h-4 bg-gray-100 rounded w-32" /></td>
                <td><div className="h-4 bg-gray-100 rounded w-16 ml-auto" /></td>
                <td><div className="h-4 bg-gray-100 rounded w-16 ml-auto" /></td>
                <td><div className="h-4 bg-gray-100 rounded w-16 ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick actions skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="admin-card">
            <div className="h-5 bg-gray-200 rounded w-40 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-48" />
          </div>
        ))}
      </div>
    </div>
  );
}
