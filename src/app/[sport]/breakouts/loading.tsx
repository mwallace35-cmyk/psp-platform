import { Skeleton } from "@/components/ui";

export default function BreakoutsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--psp-navy)] to-[var(--psp-navy-mid)]">
      {/* Hero Section */}
      <div className="border-b-4 border-[var(--psp-gold)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        {/* Content Area */}
        <div className="lg:col-span-2">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
