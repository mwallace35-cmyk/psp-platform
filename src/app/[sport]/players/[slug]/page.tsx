import Link from "next/link";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getPlayerBySlug, getFootballPlayerStats, getBasketballPlayerStats, getBaseballPlayerStats, getPlayerAwards, getPlayerGameLog, type Player, type FootballPlayerSeason, type BasketballPlayerSeason, type BaseballPlayerSeason, type Award, type PlayerGameLog } from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import SparkLine from "@/components/ui/SparkLine";
import PSPPromo from "@/components/ads/PSPPromo";
import ShareButtons from "@/components/social/ShareButtons";
import { BreadcrumbJsonLd, PersonJsonLd } from "@/components/seo/JsonLd";
import RelatedArticles from "@/components/articles/RelatedArticles";
import { buildOgImageUrl } from "@/lib/og-utils";
import { ComputedMetricsPanel } from "@/components/stats";
import type { Metadata } from "next";
import type { SeasonData } from "@/components/viz/types";

// Dynamic imports for heavy client components
const CorrectionForm = dynamic(() => import("@/components/corrections/CorrectionForm"), {
  loading: () => <div className="text-center py-4 text-gray-500 text-sm">Loading form...</div>,
});

// ClientCareerTrajectory is a client component wrapper, import it directly
import ClientCareerTrajectory from "@/components/viz/ClientCareerTrajectory";

export const revalidate = 86400;

type PageParams = { sport: string; slug: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) return {};
  const player = await getPlayerBySlug(slug);
  if (!player) return {};
  const ogImageUrl = buildOgImageUrl({
    title: player.name,
    subtitle: `${SPORT_META[sport].name} — Career Profile`,
    sport: sport,
    type: "player",
  });
  return {
    title: `${player.name} — ${SPORT_META[sport].name} — PhillySportsPack`,
    description: `${player.name} career stats, season-by-season breakdown, awards, and honors.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/players/${slug}`,
    },
    openGraph: {
      title: `${player.name} — ${SPORT_META[sport].name} — PhillySportsPack`,
      description: `${player.name} career stats, season-by-season breakdown, awards, and honors.`,
      url: `https://phillysportspack.com/${sport}/players/${slug}`,
      type: "profile",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${player.name} profile`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${player.name} — ${SPORT_META[sport].name} — PhillySportsPack`,
      description: `${player.name} career stats, season-by-season breakdown, awards, and honors.`,
      images: [ogImageUrl],
    },
  };
}

export default async function PlayerCareerPage({ params }: { params: Promise<PageParams> }) {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) notFound();

  const playerData = await getPlayerBySlug(slug);
  if (!playerData) notFound();

  const player = playerData as unknown as Player;
  const meta = SPORT_META[sport];

  // Get sport-specific stats
  let stats: (FootballPlayerSeason | BasketballPlayerSeason | BaseballPlayerSeason)[] = [];
  if (sport === "football") stats = (await getFootballPlayerStats(player.id)) as FootballPlayerSeason[];
  else if (sport === "basketball") stats = (await getBasketballPlayerStats(player.id)) as BasketballPlayerSeason[];
  else if (sport === "baseball") stats = (await getBaseballPlayerStats(player.id)) as BaseballPlayerSeason[];

  const awards = await getPlayerAwards(player.id);

  // Get per-game stats (game log) if player has box score data
  let gameLog: PlayerGameLog[] = [];
  if (sport === "football" || sport === "basketball") {
    gameLog = await getPlayerGameLog(player.id);
  }

  // Football career totals
  const footballTotals = sport === "football" && stats.length > 0 ? {
    rushYards: (stats as FootballPlayerSeason[]).reduce((sum: number, s: FootballPlayerSeason) => sum + (s.rush_yards || 0), 0),
    rushTd: (stats as FootballPlayerSeason[]).reduce((sum: number, s: FootballPlayerSeason) => sum + (s.rush_td || 0), 0),
    passYards: (stats as FootballPlayerSeason[]).reduce((sum: number, s: FootballPlayerSeason) => sum + (s.pass_yards || 0), 0),
    passTd: (stats as FootballPlayerSeason[]).reduce((sum: number, s: FootballPlayerSeason) => sum + (s.pass_td || 0), 0),
    recYards: (stats as FootballPlayerSeason[]).reduce((sum: number, s: FootballPlayerSeason) => sum + (s.rec_yards || 0), 0),
    recTd: (stats as FootballPlayerSeason[]).reduce((sum: number, s: FootballPlayerSeason) => sum + (s.rec_td || 0), 0),
    totalTd: (stats as FootballPlayerSeason[]).reduce((sum: number, s: FootballPlayerSeason) => sum + (s.total_td || 0), 0),
    totalYards: (stats as FootballPlayerSeason[]).reduce((sum: number, s: FootballPlayerSeason) => sum + (s.total_yards || 0), 0),
  } : null;

  // Basketball career totals
  const basketballTotals = sport === "basketball" && stats.length > 0 ? {
    points: (stats as BasketballPlayerSeason[]).reduce((sum: number, s: BasketballPlayerSeason) => sum + (s.points || 0), 0),
    games: (stats as BasketballPlayerSeason[]).reduce((sum: number, s: BasketballPlayerSeason) => sum + (s.games_played || 0), 0),
    rebounds: (stats as BasketballPlayerSeason[]).reduce((sum: number, s: BasketballPlayerSeason) => sum + (s.rebounds || 0), 0),
    assists: (stats as BasketballPlayerSeason[]).reduce((sum: number, s: BasketballPlayerSeason) => sum + (s.assists || 0), 0),
  } : null;

  // Determine which columns to show for football (hide all-zero columns)
  const footballColumnVisibility = sport === "football" && stats.length > 0 ? {
    pass_yards: (stats as FootballPlayerSeason[]).some((s: FootballPlayerSeason) => s.pass_yards && s.pass_yards > 0),
    pass_td: (stats as FootballPlayerSeason[]).some((s: FootballPlayerSeason) => s.pass_td && s.pass_td > 0),
    rec_yards: (stats as FootballPlayerSeason[]).some((s: FootballPlayerSeason) => s.rec_yards && s.rec_yards > 0),
    rec_td: (stats as FootballPlayerSeason[]).some((s: FootballPlayerSeason) => s.rec_td && s.rec_td > 0),
  } : null;

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
        { name: "Players", url: `https://phillysportspack.com/${sport}/players` },
        { name: player.name, url: `https://phillysportspack.com/${sport}/players/${slug}` },
      ]} />
      {/* Rendered HTML breadcrumbs with aria attributes */}
      <PersonJsonLd
        name={player.name}
        description={`${player.name} is a Philadelphia high school ${meta.name.toLowerCase()} player.`}
        sport={meta.name}
        school={player.schools?.name}
        url={`https://phillysportspack.com/${sport}/players/${slug}`}
        college={player.college}
        proTeam={player.pro_team}
      />
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
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {player.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm">
                {player.schools && (
                  <Link href={`/${sport}/schools/${player.schools?.slug}`} className="hover:underline" style={{ color: "var(--psp-gold)" }}>
                    {player.schools?.name}
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
              <div className="mt-4">
                <ShareButtons
                  url={`/${sport}/players/${slug}`}
                  title={`${player.name} — ${meta.name} Stats | PhillySportsPack`}
                  description={`Check out ${player.name}'s career stats on PhillySportsPack.com`}
                />
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
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>{s.value}</div>
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
                  <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>{s.value}</div>
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
            {/* Career Trajectory Chart */}
            {sport === "football" && stats.length > 1 && (
              <ClientCareerTrajectory
                seasons={(stats as FootballPlayerSeason[]).map((s) => ({
                  year: s.seasons?.label || "Unknown",
                  value: s.rush_yards || s.total_yards || 0,
                  isChampionship: false,
                }))}
                stat="Total Yards"
                sport={sport}
                height={300}
              />
            )}

            {/* Season-by-season stats */}
            {sport === "football" && stats.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                  Season-by-Season Stats
                </h2>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th scope="col">Season</th>
                        <th scope="col">School</th>
                        <th scope="col" className="text-right">Rush Yds</th>
                        <th scope="col" className="text-right">Rush TD</th>
                        {footballColumnVisibility?.pass_yards && <th scope="col" className="text-right">Pass Yds</th>}
                        {footballColumnVisibility?.pass_td && <th scope="col" className="text-right">Pass TD</th>}
                        {footballColumnVisibility?.rec_yards && <th scope="col" className="text-right">Rec Yds</th>}
                        {footballColumnVisibility?.rec_td && <th scope="col" className="text-right">Rec TD</th>}
                        <th scope="col" className="text-right">Total TD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats as FootballPlayerSeason[]).map((s: FootballPlayerSeason) => (
                        <tr key={s.id}>
                          <td className="font-medium whitespace-nowrap" style={{ color: "var(--psp-navy)" }}>{s.seasons?.label}</td>
                          <td className="text-xs">
                            <Link href={`/${sport}/schools/${s.schools?.slug}`} className="hover:underline" style={{ color: "var(--psp-gold)" }}>
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

            {/* Career Trajectory Chart */}
            {sport === "basketball" && stats.length > 1 && (
              <ClientCareerTrajectory
                seasons={(stats as BasketballPlayerSeason[]).map((s) => ({
                  year: s.seasons?.label || "Unknown",
                  value: s.points || 0,
                  isChampionship: false,
                }))}
                stat="Points"
                sport={sport}
                height={300}
              />
            )}

            {sport === "basketball" && stats.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                  Season-by-Season Stats
                </h2>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th scope="col">Season</th>
                        <th scope="col">School</th>
                        <th scope="col" className="text-right">GP</th>
                        <th scope="col" className="text-right">PTS</th>
                        <th scope="col" className="text-right">PPG</th>
                        <th scope="col" className="text-right">REB</th>
                        <th scope="col" className="text-right">AST</th>
                        <th scope="col" className="text-right">STL</th>
                        <th scope="col" className="text-right">BLK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats as BasketballPlayerSeason[]).map((s: BasketballPlayerSeason) => (
                        <tr key={s.id}>
                          <td className="font-medium whitespace-nowrap" style={{ color: "var(--psp-navy)" }}>{s.seasons?.label}</td>
                          <td className="text-xs">
                            <Link href={`/${sport}/schools/${s.schools?.slug}`} className="hover:underline" style={{ color: "var(--psp-gold)" }}>
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

            {/* Game Log */}
            {gameLog.length > 0 && sport === "football" && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                  Game Log ({gameLog.length} games)
                </h2>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Opponent</th>
                        <th scope="col" className="text-right">Rush Yds</th>
                        <th scope="col" className="text-right">Pass Yds</th>
                        <th scope="col" className="text-right">Rec Yds</th>
                        <th scope="col" className="text-right">PTS</th>
                        <th scope="col" className="text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameLog.map((g) => {
                        const game = g.games;
                        if (!game) return null;
                        const isHome = game.home_school_id === player.primary_school_id;
                        const opp = isHome ? game.away_school : game.home_school;
                        const dateStr = game.game_date ? new Date(game.game_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" }) : "—";
                        return (
                          <tr key={g.id}>
                            <td className="whitespace-nowrap text-xs text-gray-500">{dateStr}</td>
                            <td className="whitespace-nowrap text-xs">
                              {opp ? (
                                <Link href={`/${sport}/schools/${opp.slug}`} className="hover:underline" style={{ color: "var(--psp-blue)" }}>
                                  {isHome ? "vs " : "at "}{opp.name}
                                </Link>
                              ) : "—"}
                            </td>
                            <td className="text-right">{g.rush_yards ?? "—"}</td>
                            <td className="text-right">{g.pass_yards ?? "—"}</td>
                            <td className="text-right">{g.rec_yards ?? "—"}</td>
                            <td className="text-right font-bold">{g.points ?? "—"}</td>
                            <td className="text-center">
                              <Link
                                href={`/${sport}/games/${game.id}`}
                                className="text-xs px-2 py-0.5 rounded"
                                style={{ background: "var(--psp-blue)", color: "white" }}
                              >
                                Box Score
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {gameLog.length > 0 && sport === "basketball" && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                  Game Log ({gameLog.length} games)
                </h2>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Opponent</th>
                        <th scope="col" className="text-right">PTS</th>
                        <th scope="col" className="text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameLog.map((g) => {
                        const game = g.games;
                        if (!game) return null;
                        const isHome = game.home_school_id === player.primary_school_id;
                        const opp = isHome ? game.away_school : game.home_school;
                        const dateStr = game.game_date ? new Date(game.game_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" }) : "—";
                        return (
                          <tr key={g.id}>
                            <td className="whitespace-nowrap text-xs text-gray-500">{dateStr}</td>
                            <td className="whitespace-nowrap text-xs">
                              {opp ? (
                                <Link href={`/${sport}/schools/${opp.slug}`} className="hover:underline" style={{ color: "var(--psp-blue)" }}>
                                  {isHome ? "vs " : "at "}{opp.name}
                                </Link>
                              ) : "—"}
                            </td>
                            <td className="text-right font-bold">{g.points ?? "—"}</td>
                            <td className="text-center">
                              <Link
                                href={`/${sport}/games/${game.id}`}
                                className="text-xs px-2 py-0.5 rounded"
                                style={{ background: "var(--psp-blue)", color: "white" }}
                              >
                                Box Score
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Awards */}
            {awards.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                  Honors & Awards
                </h2>
                <div className="space-y-2">
                  {(awards as Award[]).map((a: Award) => (
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
                <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                  More from {player.schools?.name}
                </h2>
                <p className="text-sm text-gray-500 mb-4">Explore other players from this school</p>
                <Link href={`/${sport}/schools/${player.schools?.slug}`} className="inline-block px-6 py-3 rounded-lg font-medium" style={{ background: "var(--psp-navy)", color: "white" }}>
                  View all {player.schools?.name} players →
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
                      <Link href={`/${sport}/schools/${player.schools?.slug}`} className="font-medium hover:underline" style={{ color: "var(--psp-navy)" }}>
                        {player.schools?.name}
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
    </>
  );
}
