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

/* Level display config */
const LEVEL_CONFIG: Record<string, { label: string; emoji: string; bg: string; text: string; order: number }> = {
  state: { label: "State", emoji: "🏆", bg: "var(--psp-gold)", text: "var(--psp-navy)", order: 1 },
  city: { label: "City", emoji: "🏅", bg: "var(--psp-blue)", text: "white", order: 2 },
  league: { label: "League", emoji: "🎖️", bg: "var(--psp-navy-mid, #0f2040)", text: "var(--psp-gray-300, #d1d5db)", order: 3 },
};

function getLevelConfig(level: string) {
  return LEVEL_CONFIG[level] || { label: level, emoji: "🏆", bg: "var(--psp-gray-500)", text: "white", order: 99 };
}

export default async function ChampionshipsPage({ params }: { params: Promise<PageParams> }) {
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

  const meta = SPORT_META[sport];
  const champData = await getChampionshipsBySport(sport);
  const championships = (champData ?? []) as Championship[];

  // Dynasty analysis — count titles per school, split by level
  const dynastyByLevel: Record<string, Record<string, { name: string; slug: string | undefined; count: number }>> = {};
  const dynastyAll: Record<string, { name: string; slug: string | undefined; count: number }> = {};
  for (const c of championships) {
    const schoolName = c.schools?.name;
    const schoolSlug = c.schools?.slug;
    const level = c.level || "other";
    if (schoolName) {
      // All-level dynasty
      if (!dynastyAll[schoolName]) dynastyAll[schoolName] = { name: schoolName, slug: schoolSlug, count: 0 };
      dynastyAll[schoolName].count++;
      // Per-level dynasty
      if (!dynastyByLevel[level]) dynastyByLevel[level] = {};
      if (!dynastyByLevel[level][schoolName]) dynastyByLevel[level][schoolName] = { name: schoolName, slug: schoolSlug, count: 0 };
      dynastyByLevel[level][schoolName].count++;
    }
  }

  // Get top schools by state titles (most meaningful), fall back to all
  const stateDynasties = dynastyByLevel["state"]
    ? Object.values(dynastyByLevel["state"]).sort((a, b) => b.count - a.count).slice(0, 10)
    : [];
  const allDynasties = Object.values(dynastyAll).sort((a, b) => b.count - a.count).slice(0, 10);

  // Count by level
  const levelCounts: Record<string, number> = {};
  for (const c of championships) {
    const l = c.level || "other";
    levelCounts[l] = (levelCounts[l] || 0) + 1;
  }

  // Group by season year
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

  // Sort years descending; within each year sort by level priority (state > city > league)
  const sortedYears = Object.values(bySeason).sort((a, b) => b.yearStart - a.yearStart);
  for (const year of sortedYears) {
    year.champs.sort((a, b) => {
      const aOrder = getLevelConfig(a.level || "").order;
      const bOrder = getLevelConfig(b.level || "").order;
      return aOrder - bOrder;
    });
  }

  // Filter out "unknown" year group if it exists — these are championships with no season
  const unknownGroup = bySeason["unknown"];
  const displayYears = sortedYears.filter(y => y.label !== "unknown");

  return (
    <main id="main-content">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
        { name: "Championships", url: `https://phillysportspack.com/${sport}/championships` },
      ]} />

      {/* Hero */}
      <section className="py-10" style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, ${meta.color}33 100%)` }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: meta.name, href: `/${sport}` }, { label: "Championships" }]} />
          <h1 className="text-4xl md:text-5xl text-white mb-3" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
            <span aria-hidden="true">{meta.emoji}</span> {meta.name} Championships
          </h1>
          <div className="flex flex-wrap gap-4 text-sm">
            {Object.entries(levelCounts)
              .sort(([a], [b]) => (getLevelConfig(a).order) - (getLevelConfig(b).order))
              .map(([level, count]) => {
                const cfg = getLevelConfig(level);
                return (
                  <span key={level} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: cfg.bg, color: cfg.text }}>
                    {cfg.emoji} {count} {cfg.label}
                  </span>
                );
              })}
            <span className="text-gray-400">
              {displayYears.length} seasons
            </span>
          </div>
        </div>
      </section>

      <PSPPromo size="banner" variant={3} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {displayYears.map((yearData) => (
              <div key={yearData.label} className="rounded-xl overflow-hidden border"
                style={{ borderColor: "var(--psp-gray-700, #374151)" }}>
                {/* Year header */}
                <div className="px-5 py-3 flex items-center justify-between"
                  style={{ background: "var(--psp-navy)", borderBottom: "2px solid var(--psp-gold)" }}>
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                    {yearData.label}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(240,165,0,0.15)", color: "var(--psp-gold)" }}>
                    {yearData.champs.length} {yearData.champs.length === 1 ? "title" : "titles"}
                  </span>
                </div>

                {/* Championship rows */}
                <div style={{ background: "var(--psp-navy-mid, #0f2040)" }}>
                  {yearData.champs.map((c, idx) => (
                    <div key={c.id} className="flex items-center gap-3 px-5 py-3"
                      style={{
                        borderBottom: idx < yearData.champs.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                      }}>
                      {/* Level badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold flex-shrink-0 whitespace-nowrap"
                        style={{
                          background: getLevelConfig(c.level || "").bg,
                          color: getLevelConfig(c.level || "").text,
                          minWidth: "70px",
                          justifyContent: "center",
                        }}>
                        {getLevelConfig(c.level || "").label}
                      </span>

                      {/* Champion */}
                      <div className="flex-1 min-w-0">
                        {c.schools?.name ? (
                          <Link href={`/${sport}/schools/${c.schools.slug}`}
                            className="font-semibold text-sm hover:underline truncate block"
                            style={{ color: "var(--psp-gold)" }}>
                            {c.schools.name}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-500 italic">Unknown</span>
                        )}
                        {/* Notes / league info */}
                        {(c.notes || c.leagues?.name) && (
                          <span className="text-xs block truncate" style={{ color: "var(--psp-gray-400, #9ca3af)" }}>
                            {c.notes || c.leagues?.name}
                          </span>
                        )}
                      </div>

                      {/* Score if available */}
                      {c.score && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded flex-shrink-0"
                          style={{ background: "rgba(255,255,255,0.05)", color: "var(--psp-gray-300, #d1d5db)" }}>
                          {c.score}
                        </span>
                      )}

                      {/* Opponent if available */}
                      {c.opponent?.name && (
                        <span className="text-xs flex-shrink-0" style={{ color: "var(--psp-gray-400, #9ca3af)" }}>
                          vs {c.opponent.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Championships without a season */}
            {unknownGroup && unknownGroup.champs.length > 0 && (
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--psp-gray-700, #374151)" }}>
                <div className="px-5 py-3" style={{ background: "var(--psp-navy)", borderBottom: "2px solid var(--psp-gray-500)" }}>
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                    Undated Championships
                  </h2>
                </div>
                <div style={{ background: "var(--psp-navy-mid, #0f2040)" }}>
                  {unknownGroup.champs.map((c, idx) => (
                    <div key={c.id} className="flex items-center gap-3 px-5 py-3"
                      style={{ borderBottom: idx < unknownGroup.champs.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold flex-shrink-0 whitespace-nowrap"
                        style={{ background: getLevelConfig(c.level || "").bg, color: getLevelConfig(c.level || "").text, minWidth: "70px", justifyContent: "center" }}>
                        {getLevelConfig(c.level || "").label}
                      </span>
                      <div className="flex-1 min-w-0">
                        {c.schools?.name ? (
                          <Link href={`/${sport}/schools/${c.schools.slug}`} className="font-semibold text-sm hover:underline truncate block" style={{ color: "var(--psp-gold)" }}>
                            {c.schools.name}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-500 italic">Unknown</span>
                        )}
                        {(c.notes || c.leagues?.name) && (
                          <span className="text-xs block truncate" style={{ color: "var(--psp-gray-400, #9ca3af)" }}>
                            {c.notes || c.leagues?.name}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {championships.length === 0 && (
              <div className="text-center py-16" style={{ color: "var(--psp-gray-400)" }}>
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-lg font-medium mb-2 text-white">No championship data yet</h3>
                <p className="text-sm">Championship records are being compiled.</p>
              </div>
            )}
          </div>

          {/* Sidebar — Dynasty trackers */}
          <div className="space-y-6">
            {/* State dynasty (most prestigious) */}
            {stateDynasties.length > 0 && (
              <div className="rounded-xl border p-5" style={{ borderColor: "var(--psp-gray-700, #374151)", background: "var(--psp-navy-mid, #0f2040)" }}>
                <h3 className="text-lg font-bold mb-1 text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                  🏆 State Title Leaders
                </h3>
                <p className="text-xs mb-4" style={{ color: "var(--psp-gray-400, #9ca3af)" }}>
                  PIAA state championships
                </p>
                <div className="space-y-2.5">
                  {stateDynasties.map((d, idx) => (
                    <div key={d.name} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          background: idx === 0 ? "var(--psp-gold)" : idx < 3 ? "var(--psp-blue)" : "rgba(255,255,255,0.1)",
                          color: idx === 0 ? "var(--psp-navy)" : "white",
                        }}>
                        {idx + 1}
                      </span>
                      <Link href={`/${sport}/schools/${d.slug}`} className="flex-1 text-sm font-medium hover:underline truncate" style={{ color: "white" }}>
                        {d.name}
                      </Link>
                      <span className="font-bold text-sm" style={{ color: "var(--psp-gold)" }}>{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All-time dynasty */}
            <div className="rounded-xl border p-5" style={{ borderColor: "var(--psp-gray-700, #374151)", background: "var(--psp-navy-mid, #0f2040)" }}>
              <h3 className="text-lg font-bold mb-1 text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                🎖️ All-Time Title Leaders
              </h3>
              <p className="text-xs mb-4" style={{ color: "var(--psp-gray-400, #9ca3af)" }}>
                State + City + League titles combined
              </p>
              <div className="space-y-2.5">
                {allDynasties.map((d, idx) => (
                  <div key={d.name} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: idx === 0 ? "var(--psp-gold)" : idx < 3 ? "var(--psp-blue)" : "rgba(255,255,255,0.1)",
                        color: idx === 0 ? "var(--psp-navy)" : "white",
                      }}>
                      {idx + 1}
                    </span>
                    <Link href={`/${sport}/schools/${d.slug}`} className="flex-1 text-sm font-medium hover:underline truncate" style={{ color: "white" }}>
                      {d.name}
                    </Link>
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
    </main>
  );
}
