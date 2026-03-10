import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getRecordsBySport } from "@/lib/data";
import { getAllComputedRecords } from "@/lib/data/computed-records";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import RecordsView from "./RecordsView";
import type { Metadata } from "next";

export const revalidate = 86400;

type PageParams = { sport: string };

export function generateStaticParams() {
  return [
    { sport: "football" },
    { sport: "basketball" },
    { sport: "baseball" },
    { sport: "track-field" },
    { sport: "lacrosse" },
    { sport: "wrestling" },
    { sport: "soccer" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport } = await params;
  if (!isValidSport(sport)) return {};
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
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

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

  // Flatten computed records from nested structure into a single array
  const computedRecords = Object.values(computedRecordsObj)
    .flat()
    .slice(0, 100); // Limit total computed records for display

  // Build school record books from top schools by data volume
  const schoolRecordMap = new Map<string, { name: string; slug: string; count: number }>();
  for (const record of computedRecords) {
    const key = record.school_slug;
    if (!schoolRecordMap.has(key)) {
      schoolRecordMap.set(key, {
        name: record.school_name,
        slug: record.school_slug,
        count: 0,
      });
    }
    const school = schoolRecordMap.get(key)!;
    school.count++;
  }

  const schoolRecordBooks = Array.from(schoolRecordMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 50)
    .map((school) => ({
      school_name: school.name,
      school_slug: school.slug,
      records: computedRecords.filter((r) => r.school_slug === school.slug),
    }));

  // Count records by type for the subtitle
  const individualRecords = curatedRecords.filter((r: any) => r.subcategory !== "Yards");
  const schoolRecords = curatedRecords.filter((r: any) => r.subcategory === "Yards");
  const totalCuratedRecords = individualRecords.length;
  const totalComputedRecords = computedRecords.length;
  const schoolCount = new Set(schoolRecords.map((r: any) => r.holder_school || r.school_name)).size;
  const categoryCount = new Set(individualRecords.map((r: any) => r.category)).size;
  const totalItems = totalCuratedRecords + totalComputedRecords;

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
        { name: "Records", url: `https://phillysportspack.com/${sport}/records` },
      ]} />
      <section className="py-10" style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, ${meta.color}33 100%)` }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: meta.name, href: `/${sport}` }, { label: "Records" }]} />
          <h1 className="text-4xl md:text-5xl text-white mb-2 font-bebas">
            {meta.emoji} {meta.name} Records
          </h1>
          <p className="text-gray-300">
            {totalCuratedRecords} curated records + {totalComputedRecords} computed leaderboard entries across {categoryCount} categories
            {schoolCount > 0 && ` + ${schoolCount} school record books`}
          </p>
        </div>
      </section>

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8" style={{ flex: 1 }}>
        {curatedRecords.length === 0 && computedRecords.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="text-4xl mb-4">📈</div>
            <p className="text-gray-500">No records data found for {meta.name} yet.</p>
            <p className="text-sm text-gray-400 mt-2">Records will be populated as more historical data is added.</p>
          </div>
        ) : (
          <RecordsView
            curatedRecords={curatedRecords}
            computedRecords={computedRecords}
            schoolRecordBooks={schoolRecordBooks}
            sport={sport}
            sportName={meta.name}
            sportColor={meta.color}
            sportEmoji={meta.emoji}
          />
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
