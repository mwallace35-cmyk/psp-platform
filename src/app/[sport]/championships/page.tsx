import Link from "next/link";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PSPPromo from "@/components/ads/PSPPromo";
import DataSourceBadge from "@/components/ui/DataSourceBadge";
import MethodologyNote from "@/components/ui/MethodologyNote";
import { SPORT_META, getChampionshipsBySport, getChampionshipGamesWithBoxScores, type Championship } from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 86400;
export const dynamic = "force-dynamic";
type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  return {
    title: `Championships — ${SPORT_META[sport].name} — PhillySportsPack`,
    description: `Championship history and dynasty tracker for Philadelphia high school ${SPORT_META[sport].name.toLowerCase()}.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/championships`,
    },
  };
}

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
  const sport = await validateSportParam(params);

  const meta = SPORT_META[sport];
  const champData = await getChampionshipsBySport(sport);
  const champGamesMap = await getChampionshipGamesWithBoxScores(sport);
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
  const classOrder = ['6A', '5A', '4A', '3A', '2A', '1A', 'AAAA', 'AAA', 'AA', 'A'];
  for (const year of sortedYears) {
    year.champs.sort((a, b) => {
      const aLevelOrder = getLevelConfig(a.level || "").order;
      const bLevelOrder = getLevelConfig(b.level || "").order;
      if (aLevelOrder !== bLevelOrder) return aLevelOrder - bLevelOrder;
      // Within same level, sort by classification (6A first)
      const aClass = classOrder.indexOf(a.championship_type || "");
      const bClass = classOrder.indexOf(b.championship_type || "");
      return (aClass === -1 ? 99 : aClass) - (bClass === -1 ? 99 : bClass);
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
      <section className="py-10" style={{ background: "var(--psp-navy)" }}>
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
            {/* Data Source Badge & Methodology */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <DataSourceBadge
                  source="PIAA + Ted Silary Archives"
                  lastUpdated="2026-03-10"
                  confidence="verified"
                  detail="Championship data sourced from PIAA (state championships) and Ted Silary archives (historical records dating back to 1903). All city and league championships cross-referenced against multiple sources."
                />
              </div>

              <MethodologyNote title="How we track championships">
                <div className="space-y-2">
                  <p>
                    <strong>Championship levels:</strong> We track State (PIAA-sanctioned), City (regional/city tournaments), and League (regular-season conference titles).
                  </p>
                  <p>
                    <strong>Coverage:</strong> State championships date back to 1903 in some sports. City and league championships are documented from available historical records.
                  </p>
                  <p>
                    <strong>Verification:</strong> PIAA official records take precedence. Historical records are verified against newspaper archives and school records.
                  </p>
                  <p>
                    <strong>Dynasty tracker:</strong> Schools are ranked by total state championship count (most meaningful), but can also be sorted by city or league titles.
                  </p>
                </div>
              </MethodologyNote>
            </div>

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
                  {yearData.champs.map((c, idx) => {
                    // Try to find the championship game using season_id (not season object id)
                    const champGame = c.season_id ? champGamesMap[`${c.season_id}|${c.school_id}|${c.opponent_id}`] : null;

                    return (
                      <div key={c.id} className="flex flex-col px-5 py-3"
                        style={{
                          borderBottom: idx < yearData.champs.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                        }}>
                        {/* Main row */}
                        <div className="flex items-center gap-3">
                          {/* Level badge + classification */}
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold flex-shrink-0 whitespace-nowrap"
                            style={{
                              background: getLevelConfig(c.level || "").bg,
                              color: getLevelConfig(c.level || "").text,
                              minWidth: "70px",
                              justifyContent: "center",
                            }}>
                            {getLevelConfig(c.level || "").label}
                            {c.championship_type && (
                              <span style={{ opacity: 0.85, marginLeft: "2px" }}>{c.championship_type}</span>
                            )}
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

                          {/* Score from championship record if available */}
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

                        {/* Game details row (if game found) */}
                        {champGame && (
                          <div className="flex items-center gap-2 mt-2 pl-[78px] text-xs">
                            {/* Game score */}
                            {champGame.home_score !== null && champGame.away_score !== null && (
                              <span className="font-mono px-2 py-0.5 rounded flex-shrink-0"
                                style={{ background: "rgba(240, 165, 0, 0.15)", color: "var(--psp-gold)" }}>
                                {champGame.home_school?.name === c.schools?.name
                                  ? `${champGame.home_score}-${champGame.away_score}`
                                  : `${champGame.away_score}-${champGame.home_score}`}
                              </span>
                            )}

                            {/* Game date */}
                            {champGame.game_date && (
                              <span style={{ color: "var(--psp-gray-400, #9ca3af)" }}>
                                {new Date(champGame.game_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            )}

                            {/* Box score link */}
                            {champGame.hasBoxScore && (
                              <Link
                                href={`/${sport}/games/${champGame.id}`}
                                className="px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0 hover:underline"
                                style={{ background: "var(--psp-blue)", color: "white" }}>
                                📊 Box Score
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
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
              <div className="rounded-xl border p-8" style={{ borderColor: "var(--psp-gray-700, #374151)", background: "linear-gradient(135deg, rgba(10, 22, 40, 0.5) 0%, rgba(15, 32, 64, 0.3) 100%)" }}>
                <div className="text-center">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold mb-3 text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                    Coming Soon
                  </h3>
                  <p className="text-lg text-gray-300 mb-6 max-w-md mx-auto">
                    We're building out {meta.name.toLowerCase()} championship records. Check back soon!
                  </p>
                  <Link
                    href={`/${sport}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition"
                    style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
                  >
                    Back to {meta.name} Hub
                  </Link>
                </div>
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

            {/* Related Pages */}
            <div className="rounded-lg overflow-hidden" style={{ background: "rgba(15,32,64,0.8)", border: "1px solid rgba(59,130,246,0.3)" }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: "var(--psp-blue, #3b82f6)" }}>
                <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: "var(--psp-blue, #3b82f6)" }}>
                  Related Pages
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <Link
                  href={`/${sport}/awards`}
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: "var(--psp-gold)" }}
                >
                  <span>🏅</span> {meta.name} Awards & Honors
                </Link>
                <Link
                  href={`/${sport}/records`}
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: "var(--psp-gold)" }}
                >
                  <span>📈</span> {meta.name} Records
                </Link>
                <Link
                  href={`/${sport}/leaderboards/${meta.statCategories?.[0] || "scoring"}`}
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: "var(--psp-gold)" }}
                >
                  <span>📊</span> {meta.name} Leaderboards
                </Link>
                {sport === "football" && (
                  <Link
                    href="/football/all-city"
                    className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: "var(--psp-gold)" }}
                  >
                    <span>📋</span> All-City Archive
                  </Link>
                )}
                <Link
                  href="/awards"
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  <span>🏅</span> All Sports Awards Hub
                </Link>
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
