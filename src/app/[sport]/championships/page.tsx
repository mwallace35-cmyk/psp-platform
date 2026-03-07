import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PSPPromo from "@/components/ads/PSPPromo";
import { isValidSport, SPORT_META, getChampionshipsBySport, type Championship } from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 86400;

type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport } = await params;
  if (!isValidSport(sport)) return {};
  return {
    title: `Championships — ${SPORT_META[sport].name} — PhillySportsPack`,
    description: `Championship history and dynasty tracker for Philadelphia high school ${SPORT_META[sport].name.toLowerCase()}.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/championships`,
    },
  };
}

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

export default async function ChampionshipsPage({ params }: { params: Promise<PageParams> }) {
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

  const meta = SPORT_META[sport];
  const champData = await getChampionshipsBySport(sport);
  const championships = (champData ?? []) as Championship[];

  // Dynasty analysis — count titles per school
  const dynastyMap: Record<string, { name: string; slug: string | undefined; count: number }> = {};
  for (const c of championships) {
    const schoolName = c.schools?.name;
    const schoolSlug = c.schools?.slug;
    if (schoolName) {
      if (!dynastyMap[schoolName]) dynastyMap[schoolName] = { name: schoolName, slug: schoolSlug, count: 0 };
      dynastyMap[schoolName].count++;
    }
  }
  const dynasties = Object.values(dynastyMap).sort((a, b) => b.count - a.count).slice(0, 10);

  // Group by season year, then by classification within each year
  // Each year may have a different number of classifications (PIAA changed over time: 4→6 classes)
  const bySeason: Record<string, { label: string; yearStart: number; champs: Championship[] }> = {};
  for (const c of championships) {
    const season = c.seasons;
    const yearKey = season?.year_start?.toString() || "unknown";
    if (!bySeason[yearKey]) {
      bySeason[yearKey] = {
        label: season?.label || yearKey,
        yearStart: season?.year_start ?? 0,
        champs: [],
      };
    }
    bySeason[yearKey].champs.push(c);
  }

  // Sort years descending, and within each year sort classifications naturally
  const sortedYears = Object.values(bySeason)
    .sort((a, b) => b.yearStart - a.yearStart);

  // Natural sort for classifications (e.g., "6A" > "5A" > "4A" > "3A" > "2A" > "1A", or "AAAA" > "AAA")
  const classificationOrder = (level: string): number => {
    const l = (level || "").toUpperCase();
    // Match patterns like "6A", "5A", etc.
    const numMatch = l.match(/(\d+)A/);
    if (numMatch) return parseInt(numMatch[1], 10);
    // Match patterns like "AAAAAA", "AAAAA", "AAAA", "AAA", "AA", "A"
    const aMatch = l.match(/^(A+)$/);
    if (aMatch) return aMatch[1].length;
    return 0;
  };

  for (const year of sortedYears) {
    year.champs.sort((a: Championship, b: Championship) => classificationOrder(b.level || "") - classificationOrder(a.level || ""));
  }

  // Collect all unique classifications across all years for context
  const allClassifications = new Set<string>();
  for (const c of championships) {
    if (c.level) allClassifications.add(c.level);
  }

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
        { name: "Championships", url: `https://phillysportspack.com/${sport}/championships` },
      ]} />
      <section className="py-10" style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, ${meta.color}33 100%)` }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{label: meta.name, href: `/${sport}`}, {label: "Championships"}]} />
          <h1 className="text-4xl md:text-5xl text-white mb-2" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
            {meta.emoji} {meta.name} Championships
          </h1>
          <p className="text-gray-300">
            {championships.length} titles across {sortedYears.length} seasons
            {allClassifications.size > 0 && ` • ${allClassifications.size} classifications`}
          </p>
        </div>
      </section>

      <PSPPromo size="banner" variant={3} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content — grouped by year, each year shows all classifications */}
          <div className="lg:col-span-2 space-y-8">
            {sortedYears.map((yearData) => (
              <div key={yearData.label}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                  {yearData.label}
                  <span className="text-base font-normal ml-2" style={{ color: "var(--psp-gray-400)" }}>
                    ({yearData.champs.length} {yearData.champs.length === 1 ? "classification" : "classifications"})
                  </span>
                </h2>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Classification</th>
                        <th>Champion</th>
                        <th>Score</th>
                        <th>Opponent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearData.champs.map((c: Championship) => (
                        <tr key={c.id}>
                          <td className="font-medium whitespace-nowrap" style={{ color: "var(--psp-navy)" }}>
                            {c.level || "—"}
                          </td>
                          <td>
                            <Link href={`/${sport}/schools/${c.schools?.slug}`} className="font-medium text-sm hover:underline" style={{ color: "var(--psp-gold)" }}>
                              🏆 {c.schools?.name}
                            </Link>
                          </td>
                          <td className="text-sm">{c.score || "—"}</td>
                          <td className="text-xs" style={{ color: "var(--psp-gray-400)" }}>
                            {c.opponent?.name || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {championships.length === 0 && (
              <div className="text-center py-16" style={{ color: "var(--psp-gray-400)" }}>
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-lg font-medium mb-2" style={{ color: "var(--psp-navy)" }}>No championship data yet</h3>
                <p className="text-sm">Championship records are being compiled.</p>
              </div>
            )}
          </div>

          {/* Sidebar — Dynasty tracker */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                Dynasty Tracker
              </h3>
              <p className="text-xs mb-4" style={{ color: "var(--psp-gray-500)" }}>
                Most titles by school (all classifications combined)
              </p>
              <div className="space-y-3">
                {dynasties.map((d, idx) => (
                  <div key={d.name} className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: idx === 0 ? "var(--psp-gold)" : idx < 3 ? "var(--psp-navy)" : "var(--psp-gray-100)",
                        color: idx < 3 ? (idx === 0 ? "var(--psp-navy)" : "white") : "var(--psp-gray-500)",
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <Link href={`/${sport}/schools/${d.slug}`} className="text-sm font-medium hover:underline truncate block" style={{ color: "var(--psp-navy)" }}>
                        {d.name}
                      </Link>
                    </div>
                    <span className="font-bold text-sm" style={{ color: "var(--psp-gold)" }}>{d.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <PSPPromo size="sidebar" variant={4} />
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Philadelphia ${meta.name} Championships`,
            url: `https://phillysportspack.com/${sport}/championships`,
            numberOfItems: championships.length,
          }),
        }}
      />
    </>
  );
}
