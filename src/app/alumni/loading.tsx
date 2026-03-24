import { Breadcrumb } from "@/components/ui";

export default function LoadingAlumni() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading alumni">
      {/* Header skeleton */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-gray-200 to-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: "..." }]} />

          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gray-300 flex-shrink-0 animate-pulse" />
            <div className="flex-1">
              <div className="h-10 w-2/3 bg-gray-300 rounded-lg mb-2 animate-pulse" />
              <div className="h-6 w-full bg-gray-300 rounded-lg animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl p-4 bg-gray-300 animate-pulse h-20" />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pro Athletes skeleton */}
            <div>
              <div className="h-8 w-48 bg-gray-300 rounded-lg mb-4 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                    <div className="h-32 bg-gray-300" />
                    <div className="p-4 space-y-3">
                      <div className="h-6 w-2/3 bg-gray-300 rounded-lg" />
                      <div className="h-4 w-1/2 bg-gray-300 rounded-lg" />
                      <div className="h-4 w-full bg-gray-300 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* College Athletes skeleton */}
            <div>
              <div className="h-8 w-48 bg-gray-300 rounded-lg mb-4 animate-pulse" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 h-16 animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-4 w-24 bg-gray-300 rounded-lg mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-12 bg-gray-300 rounded-lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
