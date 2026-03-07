import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getSchoolBySlug, getTeamSeason, getGamesByTeamSeason, getTeamRosterBySeason, getAvailableTeamSeasons, type TeamSeason, type Game, type RosterPlayer, type Season } from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import PSPPromo from "@/components/ads/PSPPromo";
import { captureError } from "@/lib/error-tracking";
import type { Metadata } from "next";

export const revalidate = 86400; // ISR: daily

type PageParams = { sport: string; slug: string; season: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport, slug, season } = await params;
  if (!isValidSport(sport)) return {};
  const school = await getSchoolBySlug(slug);
  if (!school) return {};
  return {
    title: `${school.name} ${SPORT_META[sport].name} — ${season} — PhillySportsPack`,
    description: `${school.name} ${SPORT_META[sport].name.toLowerCase()} for the ${season} season. Schedule, results, roster, and statistics.`,
    alternates: {
      canonical: `https://phillysportspack.com/${sport}/teams/${slug}/${season}`,
    },
  };
}

export default async function TeamSeasonPage({ params }: { params: Promise<PageParams> }) {
  const { sport, slug, season } = await params;
  if (!isValidSport(sport)) notFound();

  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const meta = SPORT_META[sport];

  // Get team season data
  const teamSeasonData = await getTeamSeason(school.id, sport, season);
  if (!teamSeasonData) notFound();
  const teamSeason: TeamSeason = teamSeasonData;

  // Get games and roster - use allSettled to prevent one failure from crashing the page
  let games: Game[] = [];
  let roster: RosterPlayer[] = [];
  let availableSeasons: Season[] = [];

  try {
    const results = await Promise.allSettled([
      getGamesByTeamSeason(school.id, sport, teamSeason.season_id),
      getTeamRosterBySeason(school.id, sport, teamSeason.season_id),
      getAvailableTeamSeasons(school.id, sport),
    ]);

    if (results[0].status === "fulfilled") games = results[0].value as Game[];
    if (results[1].status === "fulfilled") roster = results[1].value as RosterPlayer[];
    if (results[2].status === "fulfilled") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const seasonsData = (results[2].value as any[]) ?? [];
      availableSeasons = seasonsData.map((s) => ('seasons' in s && s.seasons ? s.seasons : s));
    }

    if (results[0].status === "rejected") captureError(results[0].reason, { sport, slug, season, fetch: "getGamesByTeamSeason" });
    if (results[1].status === "rejected") captureError(results[1].reason, { sport, slug, season, fetch: "getTeamRosterBySeason" });
    if (results[2].status === "rejected") captureError(results[2].reason, { sport, slug, season, fetch: "getAvailableTeamSeasons" });
  } catch (error) {
    captureError(error, { sport, slug, season, context: "data_fetching" });
  }

  // Calculate record and percentages
  const wins = teamSeason.wins || 0;
  const losses = teamSeason.losses || 0;
  const ties = teamSeason.ties || 0;
  const total = wins + losses + ties;
  const winPct = total > 0 ? (wins / total) : 0;
  const winPctDisplay = winPct === 1 ? "1.000" : `.${(winPct * 1000).toFixed(0).padStart(3, "0")}`;

  // Helper to format date
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
        { name: "Teams", url: `https://phillysportspack.com/${sport}/teams` },
        { name: school.name, url: `https://phillysportspack.com/${sport}/teams/${school.slug}` },
        { name: season, url: `https://phillysportspack.com/${sport}/teams/${school.slug}/${season}` },
      ]} />
      {/* Team Season Hero Header */}
      <section
        className="py-12 md:py-16"
        style={{ background: `linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 60%, ${meta.color}22 100%)` }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: meta.name, href: `/${sport}` },
              { label: "Teams", href: `/${sport}/teams` },
              { label: school.name, href: `/${sport}/teams/${school.slug}` },
              { label: season },
            ]}
          />

          <div className="flex items-start gap-6 mt-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
              style={{ background: `${meta.color}20` }}
            >
              {meta.emoji}
            </div>
            <div className="flex-1">
              <h1
                className="text-4xl md:text-5xl text-white mb-2 tracking-wider"
                style={{ fontFamily: "Bebas Neue, sans-serif" }}
              >
                {school.name} — {season}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-gray-400">{school.city}, {school.state}</span>
              </div>
            </div>
          </div>

          {/* Season Stat Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl">
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                {wins}-{losses}{ties > 0 ? `-${ties}` : ""}
              </div>
              <div className="text-xs text-gray-400">Season Record</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                {winPctDisplay}
              </div>
              <div className="text-xs text-gray-400">Win %</div>
            </div>
            {teamSeason.points_for !== null && (
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                  {teamSeason.points_for}
                </div>
                <div className="text-xs text-gray-400">Points For</div>
              </div>
            )}
            {teamSeason.points_against !== null && (
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="text-2xl font-bold text-white" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
                  {teamSeason.points_against}
                </div>
                <div className="text-xs text-gray-400">Points Against</div>
              </div>
            )}
          </div>

          {/* Coach Info */}
          {teamSeason.coaches && (
            <div className="mt-6 text-sm">
              <span className="text-gray-400">Coach: </span>
              <span className="text-white">
                <Link href={`/${sport}/coaches/${teamSeason.coaches.slug}`} className="hover:text-blue-400">
                  {teamSeason.coaches.name}
                </Link>
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Season Navigation Bar */}
        {availableSeasons.length > 1 && (
          <div className="mb-8 flex overflow-x-auto gap-2 pb-4 -mx-4 px-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            {availableSeasons.map((s: Season) => (
              <Link
                key={s.label}
                href={`/${sport}/teams/${school.slug}/${s.label}`}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  s.label === season
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                style={s.label === season ? { background: `${meta.color}40`, color: "white" } : {}}
              >
                {s.label}
              </Link>
            ))}
          </div>
        )}

        {/* Games Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
            Schedule & Results
          </h2>
          {games.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Opponent</th>
                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Result</th>
                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game: Game, idx: number) => {
                    const isHome = game.home_school_id === school.id;
                    const opponent = isHome ? game.away_school : game.home_school;
                    const schoolScore = isHome ? game.home_score : game.away_score;
                    const opponentScore = isHome ? game.away_score : game.home_score;
                    const result = schoolScore !== null && opponentScore !== null
                      ? ((schoolScore as number) > (opponentScore as number) ? "W" : (schoolScore as number) < (opponentScore as number) ? "L" : "T")
                      : null;

                    return (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          ...(result === "W" ? { borderLeft: `3px solid #10b981` } : result === "L" ? { borderLeft: `3px solid #ef4444` } : {}),
                        }}
                      >
                        <td className="py-3 px-4 text-gray-400">{formatDate(game.game_date)}</td>
                        <td className="py-3 px-4">
                          {opponent ? (
                            <Link href={`/${sport}/teams/${opponent.slug}/${season}`} className="text-blue-400 hover:underline">
                              {isHome ? "vs " : "at "}{opponent.name}
                            </Link>
                          ) : (
                            <span className="text-gray-400">{isHome ? "vs" : "at"} TBD</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {result ? (
                            <span
                              className="font-bold"
                              style={{ color: result === "W" ? "#10b981" : result === "L" ? "#ef4444" : "#f0a500" }}
                            >
                              {result}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-300">
                          {schoolScore !== null && opponentScore !== null ? `${schoolScore}-${opponentScore}` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="text-gray-400 text-center">No game results available for this season</p>
            </div>
          )}
        </section>

        {/* Roster & Stats Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
            Roster & Stats
          </h2>
          <p className="text-sm text-gray-400 mb-6">{roster.length} players on record</p>

          {roster.length > 0 ? (
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  {sport === "football" && (
                    <>
                      <thead>
                        <tr className="bg-[var(--psp-navy)]">
                          <th className="text-left py-3 px-4 text-white font-semibold sticky left-0 bg-[var(--psp-navy)]">#</th>
                          <th className="text-left py-3 px-4 text-white font-semibold sticky left-8 bg-[var(--psp-navy)]">Player</th>
                          <th className="text-center py-3 px-4 text-gray-300 font-semibold" colSpan={3} style={{ borderLeft: "1px solid rgba(255,255,255,0.15)" }}>Rushing</th>
                          <th className="text-center py-3 px-4 text-gray-300 font-semibold" colSpan={3} style={{ borderLeft: "1px solid rgba(255,255,255,0.15)" }}>Passing</th>
                          <th className="text-center py-3 px-4 text-gray-300 font-semibold" colSpan={2} style={{ borderLeft: "1px solid rgba(255,255,255,0.15)" }}>Receiving</th>
                          <th className="text-center py-3 px-4 text-gray-300 font-semibold" colSpan={2} style={{ borderLeft: "1px solid rgba(255,255,255,0.15)" }}>Scoring</th>
                        </tr>
                        <tr style={{ background: "var(--psp-navy-mid, #0f2040)" }}>
                          <th className="py-2 px-4 sticky left-0" style={{ background: "var(--psp-navy-mid, #0f2040)" }}></th>
                          <th className="py-2 px-4 sticky left-8" style={{ background: "var(--psp-navy-mid, #0f2040)" }}></th>
                          <th className="py-2 px-4 text-xs text-gray-400 text-right" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}>CAR</th>
                          <th className="py-2 px-4 text-xs text-gray-400 text-right">YDS</th>
                          <th className="py-2 px-4 text-xs text-gray-400 text-right">TD</th>
                          <th className="py-2 px-4 text-xs text-gray-400 text-right" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}>CMP/ATT</th>
                          <th className="py-2 px-4 text-xs text-gray-400 text-right">YDS</th>
                          <th className="py-2 px-4 text-xs text-gray-400 text-right">TD/INT</th>
                          <th className="py-2 px-4 text-xs text-gray-400 text-right" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}>REC</th>
                          <th className="py-2 px-4 text-xs text-gray-400 text-right">YDS</th>
                          <th className="py-2 px-4 text-xs text-gray-400 text-right" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}>TD</th>
                          <th className="py-2 px-4 text-xs text-gray-400 text-right">PTS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roster.map((player: unknown, idx: number) => {
                          // Roster API returns enriched data with stats beyond RosterPlayer type
                          const p = player as RosterPlayer & Record<string, unknown>;
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          const stats = p as any;
                          const hasRush = (stats.rush_yards as number | null) !== null && (stats.rush_yards as number) !== 0;
                          const hasPass = (stats.pass_yards as number | null) !== null && (stats.pass_yards as number) !== 0;
                          const hasRec = (stats.rec_yards as number | null) !== null && (stats.rec_yards as number) !== 0;
                          return (
                            <tr key={p.id || idx} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: "1px solid var(--psp-gray-100, #f3f4f6)" }}>
                              <td className="py-3 px-4 text-xs text-gray-400 sticky left-0 bg-white">{idx + 1}</td>
                              <td className="py-3 px-4 font-medium sticky left-8 bg-white" style={{ color: "var(--psp-navy)" }}>
                                {p.players ? (
                                  <Link href={`/${sport}/players/${p.players.slug}`} className="hover:underline" style={{ color: "var(--psp-blue, #3b82f6)" }}>
                                    {p.players.name}
                                  </Link>
                                ) : "Unknown"}
                              </td>
                              <td className="py-3 px-4 text-right text-sm" style={{ borderLeft: "1px solid var(--psp-gray-100, #f3f4f6)", color: hasRush ? "var(--psp-navy)" : "#ccc" }}>
                                {String(stats.rush_carries ?? "—")}
                              </td>
                              <td className="py-3 px-4 text-right text-sm font-medium" style={{ color: hasRush ? "var(--psp-navy)" : "#ccc" }}>
                                {hasRush ? String(stats.rush_yards) : "—"}
                              </td>
                              <td className="py-3 px-4 text-right text-sm" style={{ color: ((stats.rush_td ?? 0) as number) > 0 ? "var(--psp-gold)" : "#ccc" }}>
                                {String(stats.rush_td ?? "—")}
                              </td>
                              <td className="py-3 px-4 text-right text-sm" style={{ borderLeft: "1px solid var(--psp-gray-100, #f3f4f6)", color: hasPass ? "var(--psp-navy)" : "#ccc" }}>
                                {hasPass ? `${stats.pass_comp ?? 0}/${stats.pass_att ?? 0}` : "—"}
                              </td>
                              <td className="py-3 px-4 text-right text-sm font-medium" style={{ color: hasPass ? "var(--psp-navy)" : "#ccc" }}>
                                {hasPass ? String(stats.pass_yards) : "—"}
                              </td>
                              <td className="py-3 px-4 text-right text-sm" style={{ color: hasPass ? "var(--psp-navy)" : "#ccc" }}>
                                {hasPass ? `${String(stats.pass_td ?? 0)}/${String(stats.pass_int ?? 0)}` : "—"}
                              </td>
                              <td className="py-3 px-4 text-right text-sm" style={{ borderLeft: "1px solid var(--psp-gray-100, #f3f4f6)", color: hasRec ? "var(--psp-navy)" : "#ccc" }}>
                                {hasRec ? String(stats.receptions) : "—"}
                              </td>
                              <td className="py-3 px-4 text-right text-sm font-medium" style={{ color: hasRec ? "var(--psp-navy)" : "#ccc" }}>
                                {hasRec ? String(stats.rec_yards) : "—"}
                              </td>
                              <td className="py-3 px-4 text-right text-sm font-bold" style={{ borderLeft: "1px solid var(--psp-gray-100, #f3f4f6)", color: ((stats.total_td ?? 0) as number) > 0 ? "var(--psp-gold)" : "#ccc" }}>
                                {String(stats.total_td ?? "—")}
                              </td>
                              <td className="py-3 px-4 text-right text-sm font-bold" style={{ color: ((stats.points ?? 0) as number) > 0 ? "var(--psp-navy)" : "#ccc" }}>
                                {String(stats.points ?? "—")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </>
                  )}

                  {sport === "basketball" && (
                    <>
                      <thead>
                        <tr className="bg-[var(--psp-navy)]">
                          <th className="text-left py-3 px-4 text-white font-semibold">#</th>
                          <th className="text-left py-3 px-4 text-white font-semibold">Player</th>
                          <th className="text-center py-3 px-3 text-gray-300 font-semibold">GP</th>
                          <th className="text-right py-3 px-3 text-gray-300 font-semibold">PTS</th>
                          <th className="text-right py-3 px-3 text-gray-300 font-semibold">PPG</th>
                          <th className="text-right py-3 px-3 text-gray-300 font-semibold">REB</th>
                          <th className="text-right py-3 px-3 text-gray-300 font-semibold">AST</th>
                          <th className="text-right py-3 px-3 text-gray-300 font-semibold">STL</th>
                          <th className="text-right py-3 px-3 text-gray-300 font-semibold">BLK</th>
                          <th className="text-right py-3 px-3 text-gray-300 font-semibold">FG%</th>
                          <th className="text-right py-3 px-3 text-gray-300 font-semibold">3P%</th>
                          <th className="text-right py-3 px-3 text-gray-300 font-semibold">FT%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roster.map((player: unknown, idx: number) => {
                          const p = player as RosterPlayer & Record<string, unknown>;
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          const stats = p as any;
                          return (
                            <tr key={p.id || idx} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: "1px solid var(--psp-gray-100, #f3f4f6)" }}>
                              <td className="py-3 px-4 text-xs text-gray-400">{idx + 1}</td>
                              <td className="py-3 px-4 font-medium" style={{ color: "var(--psp-navy)" }}>
                                {p.players ? (
                                  <Link href={`/${sport}/players/${p.players.slug}`} className="hover:underline" style={{ color: "var(--psp-blue, #3b82f6)" }}>
                                    {p.players.name}
                                  </Link>
                                ) : "Unknown"}
                              </td>
                              <td className="py-3 px-3 text-center" style={{ color: "var(--psp-navy)" }}>{String(stats.games_played ?? "—")}</td>
                            <td className="py-3 px-3 text-right font-bold" style={{ color: "var(--psp-navy)" }}>{String(stats.points ?? "—")}</td>
                            <td className="py-3 px-3 text-right font-medium" style={{ color: "var(--psp-gold)" }}>{stats.ppg ? Number(stats.ppg).toFixed(1) : "—"}</td>
                            <td className="py-3 px-3 text-right" style={{ color: ((stats.rebounds ?? 0) as number) > 0 ? "var(--psp-navy)" : "#ccc" }}>{String(stats.rebounds ?? "—")}</td>
                            <td className="py-3 px-3 text-right" style={{ color: ((stats.assists ?? 0) as number) > 0 ? "var(--psp-navy)" : "#ccc" }}>{String(stats.assists ?? "—")}</td>
                            <td className="py-3 px-3 text-right" style={{ color: ((stats.steals ?? 0) as number) > 0 ? "var(--psp-navy)" : "#ccc" }}>{String(stats.steals ?? "—")}</td>
                            <td className="py-3 px-3 text-right" style={{ color: ((stats.blocks ?? 0) as number) > 0 ? "var(--psp-navy)" : "#ccc" }}>{String(stats.blocks ?? "—")}</td>
                            <td className="py-3 px-3 text-right text-sm" style={{ color: stats.fg_pct ? "var(--psp-navy)" : "#ccc" }}>{stats.fg_pct ? `${(Number(stats.fg_pct) * 100).toFixed(0)}%` : "—"}</td>
                            <td className="py-3 px-3 text-right text-sm" style={{ color: stats.three_pct ? "var(--psp-navy)" : "#ccc" }}>{stats.three_pct ? `${(Number(stats.three_pct) * 100).toFixed(0)}%` : "—"}</td>
                              <td className="py-3 px-3 text-right text-sm" style={{ color: stats.ft_pct ? "var(--psp-navy)" : "#ccc" }}>{stats.ft_pct ? `${(Number(stats.ft_pct) * 100).toFixed(0)}%` : "—"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </>
                  )}

                  {sport === "baseball" && (
                    <>
                      <thead>
                        <tr className="bg-[var(--psp-navy)]">
                          <th className="text-left py-3 px-4 text-white font-semibold">#</th>
                          <th className="text-left py-3 px-4 text-white font-semibold">Player</th>
                          <th className="text-left py-3 px-4 text-gray-300 font-semibold">Award</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roster.map((p: RosterPlayer, idx: number) => (
                          <tr key={p.id || idx} className="hover:bg-gray-50" style={{ borderBottom: "1px solid var(--psp-gray-100, #f3f4f6)" }}>
                            <td className="py-3 px-4 text-xs text-gray-400">{idx + 1}</td>
                            <td className="py-3 px-4 font-medium" style={{ color: "var(--psp-navy)" }}>
                              {p.players ? (
                                <Link href={`/${sport}/players/${p.players.slug}`} className="hover:underline" style={{ color: "var(--psp-blue, #3b82f6)" }}>
                                  {p.players.name}
                                </Link>
                              ) : "Unknown"}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-500">{String((p as unknown as Record<string, unknown>).honor_level || "—")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}

                  {!["football", "basketball", "baseball"].includes(sport) && (
                    <>
                      <thead>
                        <tr className="bg-[var(--psp-navy)]">
                          <th className="text-left py-3 px-4 text-white font-semibold">#</th>
                          <th className="text-left py-3 px-4 text-white font-semibold">Player</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roster.map((p: RosterPlayer, idx: number) => (
                          <tr key={p.id || idx} className="hover:bg-gray-50" style={{ borderBottom: "1px solid var(--psp-gray-100, #f3f4f6)" }}>
                            <td className="py-3 px-4 text-xs text-gray-400">{idx + 1}</td>
                            <td className="py-3 px-4 font-medium" style={{ color: "var(--psp-navy)" }}>
                              {p.players ? (
                                <Link href={`/${sport}/players/${p.players.slug}`} className="hover:underline" style={{ color: "var(--psp-blue, #3b82f6)" }}>
                                  {p.players.name}
                                </Link>
                              ) : "Unknown"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[var(--psp-gray-200)] p-8 text-center">
              <div className="text-3xl mb-3">📋</div>
              <p className="text-gray-500 font-medium">No individual player stats available for this season</p>
              <p className="text-sm text-gray-400 mt-1">
                Player stats are available for seasons 2001-2019. Try selecting an earlier season above.
              </p>
            </div>
          )}
        </section>

        {/* PSP Promo */}
        <PSPPromo size="banner" />
      </div>
    </>
  );
}
