import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getRecordsBySport } from "@/lib/data";
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
  return {
    title: `${meta.name} Records — PhillySportsPack`,
    description: `All-time ${meta.name.toLowerCase()} records for Philadelphia area high schools — game, season, career, postseason, and city title records.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/records`,
    },
  };
}

export default async function RecordsPage({ params }: { params: Promise<PageParams> }) {
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

  const meta = SPORT_META[sport];
  const rawRecords = await getRecordsBySport(sport);

  // Transform records for the client component
  const records = (rawRecords || []).map((rec: any) => ({
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

  // Count records by type for the subtitle
  const individualRecords = records.filter((r: any) => r.subcategory !== "Yards");
  const schoolRecords = records.filter((r: any) => r.subcategory === "Yards");
  const totalRecords = individualRecords.length;
  const schoolCount = new Set(schoolRecords.map((r: any) => r.holder_school || r.school_name)).size;
  const categoryCount = new Set(individualRecords.map((r: any) => r.category)).size;

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
            {totalRecords} records across {categoryCount} categories + {schoolCount} school record books
          </p>
        </div>
      </section>

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8" style={{ flex: 1 }}>
        {records.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="text-4xl mb-4">📈</div>
            <p className="text-gray-500">No records data found for {meta.name} yet.</p>
            <p className="text-sm text-gray-400 mt-2">Records will be populated as more historical data is added.</p>
          </div>
        ) : (
          <RecordsView records={records} sport={sport} sportColor={meta.color} />
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
            numberOfItems: totalRecords,
          }),
        }}
      />
    </>
  );
}
