import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import { isValidSport, SPORT_META, getChampionshipsBySport } from "@/lib/data";
import ChampionshipsTable from "./ChampionshipsTable";
import type { Metadata } from "next";

export const revalidate = 86400;

type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport } = await params;
  if (!isValidSport(sport)) return {};
  return {
    title: `Championships — ${SPORT_META[sport].name} — PhillySportsPack`,
    description: `Championship history and dynasty tracker for Philadelphia high school ${SPORT_META[sport].name.toLowerCase()}.`,
  };
}

export default async function ChampionshipsPage({ params }: { params: Promise<PageParams> }) {
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

  const meta = SPORT_META[sport];
  const championships = await getChampionshipsBySport(sport);

  // Dynasty analysis
  const dynastyMap: Record<string, { name: string; slug: string; count: number }> = {};
  for (const c of championships) {
    const schoolName = (c as any).schools?.name;
    const schoolSlug = (c as any).schools?.slug;
    if (schoolName) {
      if (!dynastyMap[schoolName]) dynastyMap[schoolName] = { name: schoolName, slug: schoolSlug, count: 0 };
      dynastyMap[schoolName].count++;
    }
  }
  const dynasties = Object.values(dynastyMap).sort((a, b) => b.count - a.count).slice(0, 10);

  // Group by level and transform data
  const byLevel: Record<string, any[]> = {};
  for (const c of championships) {
    const lvl = c.level || "Other";
    if (!byLevel[lvl]) byLevel[lvl] = [];
    byLevel[lvl].push({
      id: c.id,
      season: (c as any).seasons?.label || "—",
      champion: (c as any).schools?.name || "Unknown",
      championSlug: (c as any).schools?.slug,
      league: (c as any).leagues?.name || "—",
      score: c.score || "—",
      opponent: (c as any).opponent?.name || "—",
    });
  }

  return (
    <>
      <section className="py-10" style={{ background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: meta.name, href: `/${sport}` }, { label: "Championships" }]} />
          <h1 className="text-4xl md:text-5xl text-white tracking-wider mt-4" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
            {meta.name} Championships
          </h1>
          <p className="text-sm text-gray-400 mt-2">{championships.length} titles on record</p>
        </div>
      </section>

      <PSPPromo size="banner" variant={3} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {Object.entries(byLevel).map(([level, rows]) => (
              <div key={level}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
                  {level} ({rows.length})
                </h2>
                <ChampionshipsTable data={rows} />
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
            <div className="dynasty-bar">
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: 'var(--psp-navy)', marginBottom: 4 }}>
                Dynasty Tracker
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--psp-gray-500)', marginBottom: 16 }}>
                Most titles by school (all levels combined)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {dynasties.map((d, idx) => (
                  <div key={d.name} className="dynasty-item" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="dynasty-rank" style={{
                      width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 800, flexShrink: 0,
                      background: idx === 0 ? 'var(--psp-gold)' : idx < 3 ? 'var(--psp-navy)' : 'var(--psp-gray-100)',
                      color: idx < 3 ? (idx === 0 ? 'var(--psp-navy)' : '#fff') : 'var(--psp-gray-500)',
                    }}>
                      {idx + 1}
                    </span>
                    <Link href={`/schools/${d.slug}`} className="dynasty-name hover:underline" style={{ flex: 1, fontSize: '0.875rem', fontWeight: 600, color: 'var(--psp-navy)' }}>
                      {d.name}
                    </Link>
                    <span style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--psp-gold)', fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {d.count}
                    </span>
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
