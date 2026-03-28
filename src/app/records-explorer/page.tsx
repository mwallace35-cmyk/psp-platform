import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { getRecordCount, getRecordStats, getRecordCategories, VALID_SPORTS } from "@/lib/data";
import { formatCategoryLabel } from "@/lib/utils/format-category";
import RecordsExplorerView from "./RecordsExplorerView";

export const revalidate = 3600; // 1 hour
export const metadata: Metadata = {
  title: "Records Explorer — PhillySportsPack",
  description:
    "Explore Philadelphia high school sports records by category, era, and scope. Filter across all sports and find record holders.",
  alternates: {
    canonical: "https://phillysportspack.com/records-explorer",
  },
};

export default async function RecordsExplorerPage() {
  // Fetch data in parallel
  const [recordStats, categories] = await Promise.all([
    getRecordStats(),
    getRecordCategories(),
  ]);

  if (!recordStats || recordStats.total_records === 0) {
    notFound();
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://phillysportspack.com" },
          { name: "Records Explorer", url: "https://phillysportspack.com/records-explorer" },
        ]}
      />

      {/* Hero Section */}
      <section className="py-10" style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)` }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: "Records Explorer" }]} />
          <div className="mt-6 flex items-baseline gap-4">
            <h1 className="psp-h1 text-white">Records Explorer</h1>
            <span
              className="px-4 py-2 rounded-full text-white font-semibold"
              style={{ background: "var(--psp-gold)" }}
            >
              {recordStats.total_records.toLocaleString()} Records
            </span>
          </div>
          <p className="text-gray-300 mt-3 max-w-2xl">
            Explore Philadelphia high school sports records across all sports, eras, and categories. Filter by sport, era,
            category, and more.
          </p>
        </div>
      </section>

      {/* Quick Insights */}
      <section className="py-8" style={{ background: "rgba(240, 165, 0, 0.03)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Most Common Category */}
            <div className="p-4 rounded-lg border" style={{ borderColor: "var(--psp-gold)" }}>
              <p className="text-sm text-gray-600 mb-1">Most Common Category</p>
              <p className="text-xl font-bold" style={{ color: "var(--psp-navy)" }}>
                {formatCategoryLabel(recordStats.most_common_category)}
              </p>
            </div>

            {/* Categories Count */}
            <div className="p-4 rounded-lg border" style={{ borderColor: "var(--psp-blue)" }}>
              <p className="text-sm text-gray-600 mb-1">Record Categories</p>
              <p className="text-xl font-bold" style={{ color: "var(--psp-navy)" }}>
                {recordStats.categories_count}
              </p>
            </div>

            {/* School with Most Records */}
            <div className="p-4 rounded-lg border" style={{ borderColor: "var(--psp-navy)" }}>
              <p className="text-sm text-gray-600 mb-1">Most Records Held</p>
              <p className="text-xl font-bold" style={{ color: "var(--psp-navy)" }}>
                {recordStats.school_with_most_records} ({recordStats.school_record_count})
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <RecordsExplorerView
          initialRecordCount={recordStats.total_records}
          categories={categories}
          sports={[...VALID_SPORTS]}
        />
      </main>

      {/* Schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Philadelphia High School Sports Records",
            description: "Explore all-time records from Philadelphia area high schools",
            url: "https://phillysportspack.com/records-explorer",
            creator: {
              "@type": "Organization",
              name: "PhillySportsPack",
            },
          }),
        }}
      />
    </>
  );
}
