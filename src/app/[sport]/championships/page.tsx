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
type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const sport = await validateSportParamForMetadata(params);
  if (!sport) return {};
  return {
    title: `Championships - ${SPORT_META[sport].name} - PhillySportsPack`,
    description: `Championship history and dynasty tracker for Philadelphia high school ${SPORT_META[sport].name.toLowerCase()}.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/championships`,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Championship type → display config                                 */
/* ------------------------------------------------------------------ */

interface TypeConfig {
  label: string;
  bg: string;
  text: string;
  /** Sort tier: 1 = state, 2 = city/district, 3 = league */
  tier: number;
  /** Sort within tier */
  order: number;
}

/** Memoization cache for getTypeConfig — avoids creating new objects for repeated inputs */
const typeConfigCache = new Map<string, TypeConfig>();

/** Build a human-readable badge label from the raw championship_type + level */
function getTypeConfig(champType: string | undefined, level: string | undefined): TypeConfig {
  const ct = (champType ?? "").trim();
  const lv = (level ?? "").trim();

  const cacheKey = `${ct}|${lv}`;
  const cached = typeConfigCache.get(cacheKey);
  if (cached) return cached;

  const result = computeTypeConfig(ct, lv);
  typeConfigCache.set(cacheKey, result);
  return result;
}

function computeTypeConfig(ct: string, lv: string): TypeConfig {
  /* ── PIAA State Championships ── */

  // championship_type = "PIAA State", level = class ("6A", "AAA", etc.)
  if (ct === "PIAA State" && /^[1-6]A$/.test(lv)) {
    return { label: `PIAA ${lv} State Champion`, bg: "var(--psp-gold)", text: "var(--psp-navy)", tier: 1, order: classSort(lv) };
  }
  if (ct === "PIAA State" && /^A{1,4}$/.test(lv)) {
    return { label: `PIAA ${lv} State Champion`, bg: "var(--psp-gold)", text: "var(--psp-navy)", tier: 1, order: classSort(lv) };
  }
  // championship_type = "PIAA State", level = "state" (no class)
  if (ct === "PIAA State") {
    return { label: "PIAA State Champion", bg: "var(--psp-gold)", text: "var(--psp-navy)", tier: 1, order: 0 };
  }
  // championship_type = class ("6A"), level = "state"  (football pattern)
  if (lv === "state" && /^[1-6]A$/.test(ct)) {
    return { label: `PIAA ${ct} State Champion`, bg: "var(--psp-gold)", text: "var(--psp-navy)", tier: 1, order: classSort(ct) };
  }
  if (lv === "state" && /^A{1,4}$/.test(ct)) {
    return { label: `PIAA ${ct} State Champion`, bg: "var(--psp-gold)", text: "var(--psp-navy)", tier: 1, order: classSort(ct) };
  }
  // championship_type = null, level = "state" (older football records)
  if (lv === "state" && !ct) {
    return { label: "PIAA State Champion", bg: "var(--psp-gold)", text: "var(--psp-navy)", tier: 1, order: 0 };
  }

  /* ── PCL (Catholic League) ── */

  if (ct === "PCL Red") {
    return { label: "PCL Red Division Champion", bg: "#d4a017", text: "var(--psp-navy)", tier: 3, order: 10 };
  }
  if (ct === "PCL Blue") {
    return { label: "PCL Blue Division Champion", bg: "#3b82f6", text: "white", tier: 3, order: 11 };
  }
  if (ct === "PCL" || ct === "catholic-league" || lv === "catholic-league") {
    return { label: "PCL Champion", bg: "#7c3aed", text: "white", tier: 3, order: 12 };
  }

  /* ── Public League ── */

  if (ct === "Public League" || ct === "public-league" || lv === "public-league") {
    return { label: "Public League Champion", bg: "#16a34a", text: "white", tier: 3, order: 20 };
  }

  /* ── Inter-Ac ── */
  // Handles both level="inter-ac" (basketball) and level="league" (football)
  if (ct === "Inter-Ac" || ct === "inter-ac" || lv === "inter-ac") {
    return { label: "Inter-Ac Champion", bg: "#0891b2", text: "white", tier: 3, order: 25 };
  }

  /* ── District 12 ── */

  if (ct === "District 12") {
    const cls = /^[1-6]A$/.test(lv) ? `${lv} ` : lv === "City Title" ? "" : "";
    return { label: `District 12 ${cls}Champion`, bg: "#3b82f6", text: "white", tier: 2, order: 39 };
  }

  /* ── City Championships (football: championship_type = class, level = "city") ── */

  if (lv === "city" || lv === "City Title" || ct === "city-title") {
    if (/^[1-6]A$/.test(ct)) {
      return { label: `City ${ct} Champion`, bg: "#3b82f6", text: "white", tier: 2, order: 30 + classSort(ct) };
    }
    if (/^A{1,4}$/.test(ct)) {
      return { label: `City ${ct} Champion`, bg: "#3b82f6", text: "white", tier: 2, order: 30 + classSort(ct) };
    }
    return { label: "City Champion", bg: "#3b82f6", text: "white", tier: 2, order: 40 };
  }

  /* ── Other League (catch-all for "league" level after specific leagues) ── */

  if (ct === "Other League" || ct === "league" || lv === "league") {
    return { label: "League Champion", bg: "#6b7280", text: "white", tier: 3, order: 30 };
  }

  /* ── Fallback ── */

  const fallbackLabel = ct || lv || "Champion";
  return { label: `${fallbackLabel} Champion`, bg: "#6b7280", text: "white", tier: 4, order: 99 };
}

const CLASS_ORDER = ["6A", "5A", "4A", "3A", "2A", "1A", "AAAA", "AAA", "AA", "A"];
function classSort(c: string): number {
  const idx = CLASS_ORDER.indexOf(c);
  return idx === -1 ? 50 : idx;
}

/* ------------------------------------------------------------------ */
/*  Group labels for sections within a year                            */
/* ------------------------------------------------------------------ */
function tierLabel(tier: number): string {
  switch (tier) {
    case 1: return "STATE CHAMPIONSHIPS";
    case 2: return "CITY CHAMPIONSHIPS";
    case 3: return "LEAGUE CHAMPIONSHIPS";
    default: return "Other";
  }
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default async function ChampionshipsPage({ params }: { params: Promise<PageParams> }) {
  const sport = await validateSportParam(params);

  const meta = SPORT_META[sport];
  const champData = await getChampionshipsBySport(sport);
  const champGamesMap = await getChampionshipGamesWithBoxScores(sport);
  const championships = ((champData ?? []) as Championship[]).filter(c => c.schools?.name);

  // Dynasty analysis
  const dynastyByLevel: Record<string, Record<string, { name: string; slug: string | undefined; count: number }>> = {};
  const dynastyAll: Record<string, { name: string; slug: string | undefined; count: number }> = {};
  for (const c of championships) {
    const schoolName = c.schools?.name;
    const schoolSlug = c.schools?.slug;
    const cfg = getTypeConfig(c.championship_type, c.level);
    const levelKey = cfg.tier === 1 ? "state" : cfg.tier === 2 ? "city" : "league";
    if (schoolName) {
      if (!dynastyAll[schoolName]) dynastyAll[schoolName] = { name: schoolName, slug: schoolSlug, count: 0 };
      dynastyAll[schoolName].count++;
      if (!dynastyByLevel[levelKey]) dynastyByLevel[levelKey] = {};
      if (!dynastyByLevel[levelKey][schoolName]) dynastyByLevel[levelKey][schoolName] = { name: schoolName, slug: schoolSlug, count: 0 };
      dynastyByLevel[levelKey][schoolName].count++;
    }
  }

  const stateDynasties = dynastyByLevel["state"]
    ? Object.values(dynastyByLevel["state"]).sort((a, b) => b.count - a.count).slice(0, 10)
    : [];
  const allDynasties = Object.values(dynastyAll).sort((a, b) => b.count - a.count).slice(0, 10);

  // Count by tier for hero summary
  const tierCounts: Record<number, number> = {};
  for (const c of championships) {
    const cfg = getTypeConfig(c.championship_type, c.level);
    tierCounts[cfg.tier] = (tierCounts[cfg.tier] || 0) + 1;
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

  // Sort years descending; within each year sort by tier then class
  const sortedYears = Object.values(bySeason).sort((a, b) => b.yearStart - a.yearStart);
  for (const year of sortedYears) {
    year.champs.sort((a, b) => {
      const aCfg = getTypeConfig(a.championship_type, a.level);
      const bCfg = getTypeConfig(b.championship_type, b.level);
      if (aCfg.tier !== bCfg.tier) return aCfg.tier - bCfg.tier;
      return aCfg.order - bCfg.order;
    });
  }

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
      <section className="py-10 border-b-4 border-[var(--psp-gold)]" style={{ background: '#0a1628', color: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: meta.name, href: `/${sport}` }, { label: "Championships" }]} />
          <h1 className="psp-h1 text-white mb-3">
            <span aria-hidden="true">{meta.emoji}</span> {meta.name} Championships
          </h1>
          <div className="flex flex-wrap gap-3 text-sm items-center">
            {tierCounts[1] && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}>
                {tierCounts[1]} State Titles
              </span>
            )}
            {tierCounts[2] && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "#3b82f6", color: "white" }}>
                {tierCounts[2]} City Titles
              </span>
            )}
            {tierCounts[3] && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "#7c3aed", color: "white" }}>
                {tierCounts[3]} League Titles
              </span>
            )}
            <span className="text-gray-400 text-xs">
              across {displayYears.length} seasons
            </span>
          </div>
        </div>
      </section>

      <PSPPromo size="banner" variant={3} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
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
                    <strong>Championship levels:</strong> We track State (PIAA-sanctioned), League (PCL, Public League, Inter-Ac), and City (District 12/citywide tournaments).
                  </p>
                  <p>
                    <strong>Coverage:</strong> State championships date back to 1903 in some sports. City and league championships are documented from available historical records.
                  </p>
                  <p>
                    <strong>Verification:</strong> PIAA official records take precedence. Historical records are verified against newspaper archives and school records.
                  </p>
                </div>
              </MethodologyNote>
            </div>

            {displayYears.map((yearData) => {
              // Group championships within the year by tier
              const champsByTier: Record<number, Championship[]> = {};
              for (const c of yearData.champs) {
                const cfg = getTypeConfig(c.championship_type, c.level);
                if (!champsByTier[cfg.tier]) champsByTier[cfg.tier] = [];
                champsByTier[cfg.tier].push(c);
              }
              const tiers = Object.keys(champsByTier).map(Number).sort();

              return (
                <div key={yearData.label} className="rounded-xl overflow-hidden border"
                  style={{ borderColor: "rgba(240,165,0,0.2)" }}>
                  {/* Year header */}
                  <div className="px-5 py-3 flex items-center justify-between"
                    style={{ background: "#0a1628", borderBottom: "2px solid var(--psp-gold)" }}>
                    <h2 className="font-heading text-white text-xl tracking-wide">
                      {yearData.label}
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(240,165,0,0.15)", color: "var(--psp-gold)" }}>
                      {yearData.champs.length} {yearData.champs.length === 1 ? "title" : "titles"}
                    </span>
                  </div>

                  {/* Championship entries grouped by tier */}
                  <div style={{ background: "#0f2040" }}>
                    {tiers.map((tier, tierIdx) => (
                      <div key={tier}>
                        {/* Tier sub-header (only if multiple tiers present) */}
                        {tiers.length > 1 && (
                          <div className="px-5 py-1.5 text-[11px] font-bold uppercase tracking-widest"
                            style={{
                              color: tier === 1 ? "var(--psp-gold)" : tier === 2 ? "#60a5fa" : "#a78bfa",
                              background: "rgba(0,0,0,0.2)",
                              borderTop: tierIdx > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                            }}>
                            {tierLabel(tier)}
                          </div>
                        )}

                        {champsByTier[tier].map((c, idx) => {
                          const cfg = getTypeConfig(c.championship_type, c.level);
                          const champGame = c.season_id ? champGamesMap[`${c.season_id}|${c.school_id}|${c.opponent_id}`] : null;

                          return (
                            <div key={c.id} className="px-5 py-3"
                              style={{
                                borderBottom: idx < champsByTier[tier].length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                              }}>
                              {/* Championship type badge — the main label */}
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span
                                  className="inline-flex items-center px-3 py-1 rounded text-xs font-bold tracking-wide whitespace-nowrap"
                                  style={{ background: cfg.bg, color: cfg.text }}>
                                  {cfg.label}
                                </span>
                              </div>

                              {/* School + opponent + score row */}
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                {/* Champion school */}
                                {c.schools?.name ? (
                                  <Link href={`/${sport}/schools/${c.schools.slug}`}
                                    className="font-semibold text-[15px] hover:underline"
                                    style={{ color: "var(--psp-gold)" }}>
                                    {c.schools.name}
                                  </Link>
                                ) : (
                                  <span className="text-sm text-gray-400 italic">Unknown</span>
                                )}

                                {/* Score */}
                                {(c.score || (champGame && champGame.home_score !== null && champGame.away_score !== null)) && (
                                  <span className="text-sm font-mono px-2 py-0.5 rounded"
                                    style={{ background: "rgba(240,165,0,0.12)", color: "var(--psp-gold)" }}>
                                    {c.score ? c.score : (
                                      champGame && champGame.home_school?.name === c.schools?.name
                                        ? `${champGame.home_score}-${champGame.away_score}`
                                        : champGame ? `${champGame.away_score}-${champGame.home_score}` : null
                                    )}
                                  </span>
                                )}

                                {/* Opponent */}
                                {c.opponent?.name && (
                                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                                    vs {c.opponent.name}
                                  </span>
                                )}
                              </div>

                              {/* Notes / league / game details */}
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                {c.notes && (
                                  <span className="text-xs" style={{ color: "var(--psp-gray-400, #9ca3af)" }}>
                                    {c.notes}
                                  </span>
                                )}
                                {champGame && champGame.game_date && (
                                  <span className="text-xs" style={{ color: "var(--psp-gray-400, #9ca3af)" }}>
                                    {new Date(champGame.game_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                )}
                                {champGame?.hasBoxScore && (
                                  <Link
                                    href={`/${sport}/games/${champGame.id}`}
                                    className="px-2 py-0.5 rounded text-xs font-semibold hover:underline"
                                    style={{ background: "var(--psp-blue)", color: "white" }}>
                                    Box Score
                                  </Link>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Championships without a season */}
            {unknownGroup && unknownGroup.champs.length > 0 && (
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <div className="px-5 py-3" style={{ background: "#0a1628", borderBottom: "2px solid var(--psp-gray-500)" }}>
                  <h2 className="font-heading text-white text-xl tracking-wide">
                    Undated Championships
                  </h2>
                </div>
                <div style={{ background: "#0f2040" }}>
                  {unknownGroup.champs.map((c, idx) => {
                    const cfg = getTypeConfig(c.championship_type, c.level);
                    return (
                      <div key={c.id} className="px-5 py-3"
                        style={{ borderBottom: idx < unknownGroup.champs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="inline-flex items-center px-3 py-1 rounded text-xs font-bold tracking-wide whitespace-nowrap"
                            style={{ background: cfg.bg, color: cfg.text }}>
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          {c.schools?.name ? (
                            <Link href={`/${sport}/schools/${c.schools.slug}`}
                              className="font-semibold text-[15px] hover:underline"
                              style={{ color: "var(--psp-gold)" }}>
                              {c.schools.name}
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Unknown</span>
                          )}
                          {c.opponent?.name && (
                            <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                              vs {c.opponent.name}
                            </span>
                          )}
                        </div>
                        {c.notes && (
                          <span className="text-xs block mt-1" style={{ color: "var(--psp-gray-400, #9ca3af)" }}>
                            {c.notes}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {championships.length === 0 && (
              <div className="rounded-xl border p-8" style={{ borderColor: "var(--psp-gray-700, #374151)", background: "linear-gradient(135deg, rgba(10, 22, 40, 0.5) 0%, rgba(15, 32, 64, 0.3) 100%)" }}>
                <div className="text-center">
                  <div className="text-6xl mb-4">🏆</div>
                  <h2 className="psp-h2 text-white mb-3">
                    Coming Soon
                  </h2>
                  <p className="text-lg text-gray-300 mb-6 max-w-md mx-auto">
                    We are building out {meta.name.toLowerCase()} championship records. Check back soon!
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

          {/* Sidebar -- Dynasty trackers */}
          <div className="space-y-6">
            {/* State dynasty (most prestigious) */}
            {stateDynasties.length > 0 && (
              <div className="rounded-xl border p-5" style={{ borderColor: "rgba(240,165,0,0.2)", background: "#0f2040" }}>
                <h2 className="font-heading text-white text-lg tracking-wide mb-1">
                  State Title Leaders
                </h2>
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
                      {d.slug ? (
                        <Link href={`/${sport}/schools/${d.slug}`} className="flex-1 text-sm font-medium hover:underline truncate" style={{ color: "white" }}>
                          {d.name}
                        </Link>
                      ) : (
                        <span className="flex-1 text-sm font-medium truncate" style={{ color: "white" }}>{d.name}</span>
                      )}
                      <span className="font-bold text-sm" style={{ color: "var(--psp-gold)" }}>{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All-time dynasty */}
            <div className="rounded-xl border p-5" style={{ borderColor: "rgba(255,255,255,0.1)", background: "#0f2040" }}>
              <h2 className="font-heading text-white text-lg tracking-wide mb-1">
                All-Time Title Leaders
              </h2>
              <p className="text-xs mb-4" style={{ color: "var(--psp-gray-400, #9ca3af)" }}>
                State + League + City titles combined
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
                    {d.slug ? (
                      <Link href={`/${sport}/schools/${d.slug}`} className="flex-1 text-sm font-medium hover:underline truncate" style={{ color: "white" }}>
                        {d.name}
                      </Link>
                    ) : (
                      <span className="flex-1 text-sm font-medium truncate" style={{ color: "white" }}>{d.name}</span>
                    )}
                    <span className="font-bold text-sm" style={{ color: "var(--psp-gold)" }}>{d.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Pages */}
            <div className="rounded-lg overflow-hidden" style={{ background: "rgba(15,32,64,0.8)", border: "1px solid rgba(59,130,246,0.3)" }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: "var(--psp-blue, #3b82f6)" }}>
                <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color: "var(--psp-blue, #3b82f6)" }}>
                  Related Pages
                </h2>
              </div>
              <div className="p-4 space-y-3">
                <Link
                  href={`/${sport}/awards`}
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: "var(--psp-gold)" }}
                >
                  {meta.name} Awards & Honors
                </Link>
                <Link
                  href={`/${sport}/records`}
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: "var(--psp-gold)" }}
                >
                  {meta.name} Records
                </Link>
                <Link
                  href={`/${sport}/leaderboards/${meta.statCategories?.[0] || "scoring"}`}
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: "var(--psp-gold)" }}
                >
                  {meta.name} Leaderboards
                </Link>
                {sport === "football" && (
                  <Link
                    href="/football/awards"
                    className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: "var(--psp-gold)" }}
                  >
                    All-City Archive
                  </Link>
                )}
                <Link
                  href="/awards"
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  All Sports Awards Hub
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
