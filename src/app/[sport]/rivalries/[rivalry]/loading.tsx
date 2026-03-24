import { Skeleton } from '@/components/ui';

export default function RivalryDetailLoading() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-16 border-b border-gray-700 bg-[var(--psp-navy-mid)]">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Skeleton className="h-4 w-64" />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <Skeleton className="h-12 w-80 mx-auto mb-4" />
            <Skeleton className="h-8 w-20 mx-auto mb-4" />
            <Skeleton className="h-12 w-80 mx-auto" />
          </div>

          {/* Series Bar */}
          <div className="max-w-md mx-auto mb-6">
            <Skeleton className="h-6 w-full rounded-lg" />
          </div>

          {/* Series Record */}
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-40 mx-auto mb-2" />
            <Skeleton className="h-4 w-80 mx-auto" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg p-4 border border-gray-700">
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Game History Table */}
            <section>
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </section>

            {/* Decade Chart */}
            <section>
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* School Cards */}
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-[var(--psp-navy)] rounded-lg border border-gray-700 p-4"
              >
                <Skeleton className="h-6 w-40 mb-3" />
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j}>
                      <Skeleton className="h-3 w-16 mb-2" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="bg-[var(--psp-navy)] rounded-lg border border-gray-700 p-4">
              <Skeleton className="h-5 w-20 mb-3" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
