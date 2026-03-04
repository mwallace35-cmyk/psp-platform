export default function TeamSeasonSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div
        className="py-12 md:py-16"
        style={{ background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 60%, rgba(59,130,246,0.13) 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex gap-2 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-20 bg-gray-400 rounded animate-pulse"></div>
                {i < 3 && <span className="text-gray-400">/</span>}
              </div>
            ))}
          </div>

          {/* Hero section */}
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gray-400 rounded-2xl animate-pulse flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-10 w-96 bg-gray-400 rounded animate-pulse mb-4"></div>
              <div className="flex flex-wrap gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 w-32 bg-gray-400 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Stat bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl p-4 bg-gray-400 bg-opacity-20 animate-pulse">
                <div className="h-8 w-12 bg-gray-400 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-20 bg-gray-400 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Coach info */}
          <div className="mt-6 h-4 w-48 bg-gray-400 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Season nav bar */}
        <div className="mb-8 flex gap-2 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-400 rounded-lg animate-pulse"></div>
          ))}
        </div>

        {/* Schedule Section */}
        <section className="mb-12">
          <div className="h-8 w-48 bg-gray-400 rounded animate-pulse mb-6"></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
                  {[...Array(4)].map((_, i) => (
                    <th key={i} className="py-3 px-4">
                      <div className="h-4 w-20 bg-gray-400 rounded animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(6)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {[...Array(4)].map((_, j) => (
                      <td key={j} className="py-3 px-4">
                        <div className="h-4 w-24 bg-gray-400 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Roster Section */}
        <section className="mb-12">
          <div className="h-8 w-32 bg-gray-400 rounded animate-pulse mb-6"></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
                  {[...Array(6)].map((_, i) => (
                    <th key={i} className="py-3 px-4">
                      <div className="h-4 w-16 bg-gray-400 rounded animate-pulse"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(10)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="py-3 px-4">
                        <div className="h-4 w-20 bg-gray-400 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Promo */}
        <div className="h-32 bg-gray-400 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
