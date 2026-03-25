import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { SPORT_META, getRecordsBySport } from "@/lib/data";
import { getAllComputedRecords } from "@/lib/data/computed-records";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import RecordTimeline from "@/components/records/RecordTimeline";
import RecordsView from "./RecordsView";
import type { Metadata } from "next";

export const revalidate = 86400;
export const dynamic = "force-dynamic";
type PageParams = { sport: string };

// export function generateStaticParams() {
//   return [
//     { sport: "football" },
//     { sport: "basketball" },
//     { sport: "baseball" },
//     { sport: "track-field" },
//     { sport: "lacrosse" },
//     { sport: "wrestling" },
//     { sport: "soccer" },
//   ];
// }

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  const meta = SPORT_META[sport];

  const rawRecords = await getRecordsBySport(sport);
  const computedCount = Object.keys(await getAllComputedRecords(sport, 10)).length;

  return {
    title: `${meta.name} Records — PhillySportsPack`,
    description: `All-time ${meta.name.toLowerCase()} records for Philadelphia area high schools — ${(rawRecords || []).length} curated records plus computed leaderboards across ${computedCount} stat categories.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/records`,
    },
  };
}

export default async function RecordsPage({ params }: { params: Promise<PageParams> }) {
  const sport = await validateSportParam(params);

  const meta = SPORT_META[sport];

  // Fetch curated records and computed leaderboards in parallel
  const [rawRecords, computedRecordsObj] = await Promise.all([
    getRecordsBySport(sport),
    getAllComputedRecords(sport, 25),
  ]);

  // Transform curated records for the client component
  const curatedRecords = (rawRecords || []).map((rec: any) => ({
    id: rec.id,
    category: rec.category || "Other",
    subcategory: rec.subcategory || null,
    scope: rec.scope || null,
    record_value: rec.record_value || null,
    record_number: rec.record_number != null ? Number(rec.record_number) : null,
    holder_name: rec.holder_name || null,
    holder_school: rec.holder_school || null,
    year_set: rec.year_set || null,
    description: rec.description || null,
    player_name: rec.players?.name || null,
    player_slug: rec.players?.slug || null,
    school_name: rec.schools?.name || null,
    school_slug: rec.schools?.slug || null,
    season_label: rec.seasons?.label || null,
  }));

  // Count statistics for the subtitle
  const totalCuratedRecords = curatedRecords.length;
  const categoryCount = Object.keys(computedRecordsObj).length;

  // Count unique stat names across all computed records
  const uniqueStatNames = new Set<string>();
  Object.values(computedRecordsObj).forEach((records) => {
    records.forEach((rec) => {
      uniqueStatNames.add(rec.stat_name);
    });
  });
  const computedStatCount = uniqueStatNames.size;
  const totalItems = totalCuratedRecords + computedStatCount;

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
        { name: "Records", url: `https://phillysportspack.com/${sport}/records` },
      ]} />
      <section className="py-10 border-b-4 border-[var(--psp-gold)]" style={{ background: '#0a1628', color: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: meta.name, href: `/${sport}` }, { label: "Records" }]} />
          <h1 className="psp-h1 text-white mb-2">
            {meta.emoji} {meta.name} Records
          </h1>
          <p className="text-gray-300">
            {totalCuratedRecords} archive records + {computedStatCount} stat leaderboards across {categoryCount} categories
          </p>
        </div>
      </section>

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8" style={{ flex: 1 }}>
        {curatedRecords.length === 0 && computedStatCount === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="text-4xl mb-4">📈</div>
            <p className="text-gray-400">No records data found for {meta.name} yet.</p>
            <p className="text-sm text-gray-300 mt-2">Records will be populated as more historical data is added.</p>
          </div>
        ) : (
          <>
            {/* Longest-Held Records Timeline */}
            {curatedRecords.length > 0 && (
              <RecordTimeline
                records={curatedRecords}
                sport={sport}
                limit={10}
              />
            )}

            {/* Main Records View */}
            <RecordsView
              curatedRecords={curatedRecords}
              computedByCategory={computedRecordsObj}
              sport={sport}
              sportName={meta.name}
              sportColor={meta.color}
              sportEmoji={meta.emoji}
            />
          </>
        )}
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Philadelphia ${meta.name} Records`,
            url: `https://phillysportspack.com/${sport}/records`,
            numberOfItems: totalItems,
          }),
        }}
      />
    </>
  );
}
