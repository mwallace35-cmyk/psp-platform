import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getChampionshipsBySport } from "@/lib/data";
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

  // Dynasty analysis — count titles per school
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

  // Group by level
  const byLevel: Record<string, any[]> = {};
  for (const c of championships) {
    const lvl = c.level || "Other";
    if (!byLevel[lvl]) byLevel[lvl] = [];
    byLevel[lvl].push(c);
  }

  return (
    <>
      <section className="py-10" style={{ background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href={`/${sport}`} className="hover:text-white transition-colors">{meta.name}</Link>
            <span>/</span>
            <span className="text-white">Championships</span>
          </div>
          <h1 className="text-4xl md:text-5xl text-white tracking-wider" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
            {meta.name} Championships
          </h1>
          <p className="text-sm text-gray-400 mt-2">{championships.length} titles on record</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {Object.entries(byLevel).map(([level, champs]) => (
              <div key={level}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                  {level} ({champs.length})
                </h2>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Season</th>
                        <th>Champion</th>
                        <th>League</th>
                        <th>Score</th>
                        <th>Opponent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {champs.map((c: any) => (
                        <tr key={c.id}>
                          <td className="font-medium whitespace-nowrap" style={{ color: "var(--psp-navy)" }}>
                            {c.seasons?.label || "—"}
                          </td>
                          <td>
                            <Link href={`/${sport}/schools/${c.schools?.slug}`} className="font-medium text-sm hover:underline" style={{ color: "var(--psp-gold)" }}>
                              🏆 {c.schools?.name}
                            </Link>
                          </td>
                          <td className="text-xs" style={{ color: "var(--psp-gray-500)" }}>{c.leagues?.name || "—"}</td>
                          <td className="text-sm">{c.score || "—"}</td>
                          <td className="text-xs" style={{ color: "var(--psp-gray-400)" }}>
                            {(c as any).schools?.name || "—"}
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
                Most titles by school (all levels combined)
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
