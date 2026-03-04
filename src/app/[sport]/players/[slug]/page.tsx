import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getPlayerBySlug, getFootballPlayerStats, getBasketballPlayerStats, getBaseballPlayerStats, getPlayerAwards } from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import CorrectionForm from "@/components/corrections/CorrectionForm";
import RelatedArticles from "@/components/articles/RelatedArticles";
import type { Metadata } from "next";

export const revalidate = 86400;

type PageParams = { sport: string; slug: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) return {};
  const player = await getPlayerBySlug(slug);
  if (!player) return {};
  return {
    title: `${player.name} — ${SPORT_META[sport].name} — PhillySportsPack`,
    description: `${player.name} career stats, season-by-season breakdown, awards, and honors.`,
  };
}

export default async function PlayerCareerPage({ params }: { params: Promise<PageParams> }) {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) notFound();

  const player = await getPlayerBySlug(slug);
  if (!player) notFound();

  const meta = SPORT_META[sport];

  // Get sport-specific stats
  let stats: any[] = [];
  if (sport === "football") stats = await getFootballPlayerStats(player.id);
  else if (sport === "basketball") stats = await getBasketballPlayerStats(player.id);
  else if (sport === "baseball") stats = await getBaseballPlayerStats(player.id);

  const awards = await getPlayerAwards(player.id);

  // Football career totals
  const footballTotals = sport === "football" && stats.length > 0 ? {
    rushYards: stats.reduce((sum: number, s: any) => sum + (s.rush_yards || 0), 0),
    rushTd: stats.reduce((sum: number, s: any) => sum + (s.rush_td || 0), 0),
    passYards: stats.reduce((sum: number, s: any) => sum + (s.pass_yards || 0), 0),
    passTd: stats.reduce((sum: number, s: any) => sum + (s.pass_td || 0), 0),
    recYards: stats.reduce((sum: number, s: any) => sum + (s.rec_yards || 0), 0),
    recTd: stats.reduce((sum: number, s: any) => sum + (s.rec_td || 0), 0),
    totalTd: stats.reduce((sum: number, s: any) => sum + (s.total_td || 0), 0),
    totalYards: stats.reduce((sum: number, s: any) => sum + (s.total_yards || 0), 0),
  } : null;

  // Basketball career totals
  const basketballTotals = sport === "basketball" && stats.length > 0 ? {
    points: stats.reduce((sum: number, s: any) => sum + (s.points || 0), 0),
    games: stats.reduce((sum: number, s: any) => sum + (s.games_played || 0), 0),
    rebounds: stats.reduce((sum: number, s: any) => sum + (s.rebounds || 0), 0),
    assists: stats.reduce((sum: number, s: any) => sum + (s.assists || 0), 0),
  } : null;

  // Determine which columns to show for football (hide all-zero columns)
  const footballColumnVisibility = sport === "football" && stats.length > 0 ? {
    pass_yards: stats.some((s: any) => s.pass_yards && s.pass_yards > 0),
    pass_td: stats.some((s: any) => s.pass_td && s.pass_td > 0),
    rec_yards: stats.some((s: any) => s.rec_yards && s.rec_yards > 0),
    rec_td: stats.some((s: any) => s.rec_td && s.rec_td > 0),
  } : null;

  return (
    <>
      {/* Player header */}
      <section
        className="py-12 md:py-16"
        style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 60%, ${meta.color}22 100%)` }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[
            { label: meta.name, href: `/${sport}` },
            { label: "Players" },
            { label: player.name }
          ]} />

          <div className="flex items-start gap-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              👤
            </div>
            <div className="flex-1">
              <h1
                className="text-4xl md:text-5xl text-white mb-2 tracking-wider"
                style={{ fontFamily: "Barlow Condensed, sans-serif" }}
              >
                {player.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm">
                {player.schools && (
                  <Link href={`/schools/${(player as any).schools?.slug}`} className="hover:underline" style={{ color: "var(--psp-gold)" }}>
                    {(player as any).schools?.name}
                  </Link>
                )}
                {player.positions && player.positions.length > 0 && (
                  <span className="text-gray-400">{player.positions.join(", ")}</span>
                )}
                {player.graduation_year && (
                  <span className="text-gray-400">Class of {player.graduation_year}</span>
                )}
                {player.is_multi_sport && (
                  <span className="px-2 py-0.5 text-xs rounded-full" style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}>
                    Multi-Sport
                  </span>
                )}
                {player.pro_team && (
                  <span className="px-2 py-0.5 text-xs rounded-full" style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}>
                    ⭐ Pro Athlete
                  </span>
                )}
                {player.college && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-600 text-white">
                    🎓 College
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Career stat highlights */}
          {footballTotals && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl">
              {[
                { label: "Total Yards", value: footballTotals.totalYards.toLocaleString() },
                { label: "Total TDs", value: footballTotals.totalTd },
                { label: "Rush Yards", value: footballTotals.rushYards.toLocaleString() },
                { label: "Pass Yards", value: footballTotals.passYards.toLocaleString() },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>{s.value}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {basketballTotals && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl">
              {[
                { label: "Career Points", value: basketballTotals.points.toLocaleString() },
                { label: "PPG", value: basketballTotals.games > 0 ? (basketballTotals.points / basketballTotals.games).toFixed(1) : "—" },
                { label: "Games", value: basketballTotals.games },
                { label: "Rebounds", value: basketballTotals.rebounds },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>{s.value}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <PSPPromo size="banner" variant={2} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Season-by-season stats */}
            {sport === "football" && stats.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
                  Season-by-Season Stats
                </h2>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Season</th>
                        <th>School</th>
                        <th className="text-right">Rush Yds</th>
                        <th className="text-right">Rush TD</th>
                        {footballColumnVisibility?.pass_yards && <th className="text-right">Pass Yds</th>}
                        {footballColumnVisibility?.pass_td && <th className="text-right">Pass TD</th>}
                        {footballColumnVisibility?.rec_yards && <th className="text-right">Rec Yds</th>}
                        {footballColumnVisibility?.rec_td && <th className="text-right">Rec TD</th>}
                        <th className="text-right">Total TD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((s: any) => (
                        <tr key={s.id}>
                          <td className="font-medium whitespace-nowrap" style={{ color: "var(--psp-navy)" }}>{s.seasons?.label}</td>
                          <td className="text-xs">
                            <Link href={`/schools/${s.schools?.slug}`} className="hover:underline" style={{ color: "var(--psp-gold)" }}>
                              {s.schools?.name}
                            </Link>
                          </td>
                          <td className="text-right">{s.rush_yards || "—"}</td>
                          <td className="text-right">{s.rush_td || "—"}</td>
                          {footballColumnVisibility?.pass_yards && <td className="text-right">{s.pass_yards || "—"}</td>}
                          {footballColumnVisibility?.pass_td && <td className="text-right">{s.pass_td || "—"}</td>}
                          {footballColumnVisibility?.rec_yards && <td className="text-right">{s.rec_yards || "—"}</td>}
                          {footballColumnVisibility?.rec_td && <td className="text-right">{s.rec_td || "—"}</td>}
                          <td className="text-right font-bold">{s.total_td || "—"}</td>
                        </tr>
                      ))}
                      {stats.length > 1 && footballTotals && (
                        <tr className="font-bold" style={{ background: "var(--psp-gray-50)" }}>
                          <td colSpan={2}>Career Totals</td>
                          <td className="text-right">{footballTotals.rushYards.toLocaleString()}</td>
                          <td className="text-right">{footballTotals.rushTd}</td>
                          {footballColumnVisibility?.pass_yards && <td className="text-right">{footballTotals.passYards.toLocaleString()}</td>}
                          {footballColumnVisibility?.pass_td && <td className="text-right">{footballTotals.passTd}</td>}
                          {footballColumnVisibility?.rec_yards && <td className="text-right">{footballTotals.recYards.toLocaleString()}</td>}
                          {footballColumnVisibility?.rec_td && <td className="text-right">{footballTotals.recTd}</td>}
                          <td className="text-right">{footballTotals.totalTd}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {sport === "basketball" && stats.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
                  Season-by-Season Stats
                </h2>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Season</th>
                        <th>School</th>
                        <th className="text-right">GP</th>
                        <th className="text-right">PTS</th>
                        <th className="text-right">PPG</th>
                        <th className="text-right">REB</th>
                        <th className="text-right">AST</th>
                        <th className="text-right">STL</th>
                        <th className="text-right">BLK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((s: any) => (
                        <tr key={s.id}>
                          <td className="font-medium whitespace-nowrap" style={{ color: "var(--psp-navy)" }}>{s.seasons?.label}</td>
                          <td className="text-xs">
                            <Link href={`/schools/${s.schools?.slug}`} className="hover:underline" style={{ color: "var(--psp-gold)" }}>
                              {s.schools?.name}
                            </Link>
                          </td>
                          <td className="text-right">{s.games_played ?? "—"}</td>
                          <td className="text-right">{s.points ?? "—"}</td>
                          <td className="text-right">{s.ppg ?? "—"}</td>
                          <td className="text-right">{s.rebounds ?? "—"}</td>
                          <td className="text-right">{s.assists ?? "—"}</td>
                          <td className="text-right">{s.steals ?? "—"}</td>
                          <td className="text-right">{s.blocks ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Awards */}
            {awards.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
                  Honors & Awards
                </h2>
                <div className="space-y-2">
                  {awards.map((a: any) => (
                    <div key={a.id} className="bg-white rounded-lg border border-[var(--psp-gray-200)] px-4 py-3 flex items-center gap-3">
                      <span className="text-xl">🏅</span>
                      <div>
                        <span className="font-medium text-sm" style={{ color: "var(--psp-navy)" }}>
                          {a.award_name || a.award_type}
                        </span>
                        {a.seasons?.label && (
                          <span className="text-xs ml-2" style={{ color: "var(--psp-gray-500)" }}>{a.seasons.label}</span>
                        )}
                        {a.category && (
                          <span className="text-xs ml-2" style={{ color: "var(--psp-gray-400)" }}>{a.category}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related: More from this school */}
            {player.schools && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
                  More from {(player as any).schools?.name}
                </h2>
                <p className="text-sm text-gray-500 mb-4">Explore other players from this school</p>
                <Link href={`/schools/${(player as any).schools?.slug}`} className="inline-block px-6 py-3 rounded-lg font-medium" style={{ background: "var(--psp-navy)", color: "white" }}>
                  View all {(player as any).schools?.name} players →
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Player info */}
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                Player Info
              </h3>
              <dl className="space-y-3 text-sm">
                {player.primary_school_id && player.schools && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>School</dt>
                    <dd>
                      <Link href={`/schools/${(player as any).schools?.slug}`} className="font-medium hover:underline" style={{ color: "var(--psp-navy)" }}>
                        {(player as any).schools?.name}
                      </Link>
                    </dd>
                  </div>
                )}
                {player.positions && player.positions.length > 0 && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>Position</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{player.positions.join(", ")}</dd>
                  </div>
                )}
                {player.graduation_year && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>Class</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{player.graduation_year}</dd>
                  </div>
                )}
                {player.height && (
                  <div className="flex justify-between">
                    <dt style={{ color: "var(--psp-gray-500)" }}>Height</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{player.height}</dd>
                  </div>
                )}
              </dl>
            </div>

            <PSPPromo size="sidebar" variant={4} />

            {/* Pro/college info */}
            {(player.college || player.pro_team) && (
              <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                  Next Level
                </h3>
                <dl className="space-y-3 text-sm">
                  {player.college && (
                    <div className="flex justify-between">
                      <dt style={{ color: "var(--psp-gray-500)" }}>College</dt>
                      <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{player.college}</dd>
                    </div>
                  )}
                  {player.pro_team && (
                    <div className="flex justify-between">
                      <dt style={{ color: "var(--psp-gray-500)" }}>Pro Team</dt>
                      <dd className="font-medium" style={{ color: "var(--psp-gold)" }}>{player.pro_team}</dd>
                    </div>
                  )}
                  {player.pro_draft_info && (
                    <div className="flex justify-between">
                      <dt style={{ color: "var(--psp-gray-500)" }}>Draft</dt>
                      <dd className="font-medium text-xs" style={{ color: "var(--psp-navy)" }}>{player.pro_draft_info}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            <RelatedArticles entityType="player" entityId={player.id} />

            <PSPPromo size="sidebar" variant={3} />
          </div>
        </div>
      </div>

      {/* Correction Form */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <CorrectionForm entityType="player" entityId={player.id} entityName={player.name} />
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: player.name,
            description: `${player.name} — Philadelphia high school ${meta.name.toLowerCase()} player.`,
            url: `https://phillysportspack.com/${sport}/players/${slug}`,
            ...(player.college && { alumniOf: { "@type": "CollegeOrUniversity", name: player.college } }),
            ...(player.pro_team && { memberOf: { "@type": "SportsTeam", name: player.pro_team } }),
          }),
        }}
      />
    </>
  );
}
