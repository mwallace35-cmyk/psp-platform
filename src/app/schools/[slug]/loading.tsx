import { SkeletonCard, SkeletonText, SkeletonTable, Skeleton } from "@/components/ui";

export default function SchoolHubLoading() {
  return (
    <>
      {/* Hero Section Skeleton */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-gray-100 to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb skeleton */}
          <div className="flex gap-2 mb-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Hero content skeleton */}
          <div className="flex items-start gap-6 mt-6">
            <Skeleton className="w-20 h-20 rounded-2xl flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-12 w-64 mb-3 rounded" />
              <div className="flex flex-wrap gap-2 mb-4">
                <Skeleton className="h-6 w-24 rounded" />
                <Skeleton className="h-6 w-20 rounded" />
                <Skeleton className="h-6 w-28 rounded" />
              </div>
              <Skeleton className="h-4 w-40 mb-4" />
              <div className="flex gap-4">
                <Skeleton className="h-8 w-32 rounded" />
                <Skeleton className="h-8 w-32 rounded" />
              </div>
            </div>
          </div>

          {/* Stats strip skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl p-4 bg-white/20">
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo skeleton */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 h-32" />

      {/* Main content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sports section */}
            <div>
              <Skeleton className="h-7 w-32 mb-4 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>

            {/* Next level section */}
            <div>
              <Skeleton className="h-7 w-48 mb-4 rounded" />
              <SkeletonTable rows={5} columns={4} />
            </div>

            {/* Championships section */}
            <div>
              <Skeleton className="h-7 w-40 mb-4 rounded" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info card */}
            <SkeletonCard />

            {/* Quick links */}
            <SkeletonCard />

            {/* Articles */}
            <SkeletonCard />

            {/* Promo */}
            <SkeletonCard />
          </div>
        </div>
      </div>
    </>
  );
}
