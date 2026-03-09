export default function ArticleDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#0f2040] text-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-6 h-6 bg-gray-400 rounded animate-pulse"></div>
            <div className="h-5 w-20 bg-gray-400 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-3/4 bg-gray-400 rounded animate-pulse mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 bg-gray-400 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-400 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2">
          {/* Featured Image */}
          <div className="mb-8 rounded-lg overflow-hidden bg-gray-200 h-96 animate-pulse"></div>

          {/* Article Text */}
          <div className="prose prose-sm max-w-none mb-8">
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-1">
          <div className="space-y-6">
            {/* Author Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="h-6 w-24 bg-gray-300 rounded animate-pulse mb-3"></div>
              <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
            </div>

            {/* Related Articles */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="h-6 w-24 bg-gray-300 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-full bg-gray-300 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-4/5 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
