import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getRecordsBySport, type SchoolRecord } from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { LeaderboardAd, InContentAd } from "@/components/ads/AdPlaceholder";
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
    description: `All-time ${meta.name.toLowerCase()} records for Philadelphia area high schools.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/records`,
    },
  };
}

export default async function RecordsPage({ params }: { params: Promise<PageParams> }) {
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

  const meta = SPORT_META[sport];
  const recordsData = await getRecordsBySport(sport);

  // Group records by category
  const grouped: { [key: string]: typeof recordsData } = {};
  for (const rec of recordsData) {
    const cat = rec.category || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(rec);
  }
  const categories = Object.keys(grouped).sort();

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
          <h1 className="text-4xl md:text-5xl text-white mb-2" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
            {meta.emoji} {meta.name} Records
          </h1>
          <p className="text-gray-300">All-time records across {categories.length} categories</p>
        </div>
      </section>

      <LeaderboardAd id="psp-records-banner" />

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8" style={{ flex: 1 }}>
        {recordsData.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <div className="text-4xl mb-4">📈</div>
            <p className="text-gray-500">No records data found for {meta.name} yet.</p>
            <p className="text-sm text-gray-400 mt-2">Records will be populated as more historical data is added.</p>
          </div>
        ) : (
          categories.map((category, idx) => (
            <div key={category} className="mb-10">
              <h2 className="text-2xl font-bold mb-4 capitalize" style={{ fontFamily: "Bebas Neue, sans-serif", color: "var(--psp-navy)" }}>
                {category}
              </h2>
              <div className="overflow-x-auto">
                <table className="data-table w-full">
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: "60px" }}>#</th>
                      <th scope="col">Player</th>
                      <th scope="col">School</th>
                      <th scope="col">Season</th>
                      <th scope="col" className="text-right">Record</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped[category].map((rec: SchoolRecord, i: number) => (
                      <tr key={rec.id}>
                        <td className={`font-bold ${i === 0 ? "text-yellow-500" : "text-gray-400"}`}>{i + 1}</td>
                        <td>
                          {rec.players ? (
                            <Link href={`/${sport}/players/${rec.players.slug}`} className="hover:underline font-medium" style={{ color: "var(--psp-navy)" }}>
                              {rec.players.name}
                            </Link>
                          ) : rec.record_holder || rec.holder_name || "—"}
                        </td>
                        <td>
                          {rec.schools ? (
                            <Link href={`/${sport}/schools/${rec.schools.slug}`} className="hover:underline text-sm" style={{ color: "var(--psp-gold)" }}>
                              {rec.schools.name}
                            </Link>
                          ) : rec.holder_school || "—"}
                        </td>
                        <td className="text-sm text-gray-500">{rec.seasons?.label ?? rec.record_year ?? rec.year_set ?? "—"}</td>
                        <td className="text-right font-bold" style={{ color: meta.color }}>
                          {typeof rec.record_value === "number" ? rec.record_value.toLocaleString() : rec.record_value ?? rec.record_number ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {idx > 0 && idx % 3 === 0 && <InContentAd id={`psp-records-mid-${idx}`} />}
            </div>
          ))
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
            numberOfItems: recordsData.length,
          }),
        }}
      />
    </>
  );
}
