import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSchoolBySlug,
  getTeamSeason,
  getGamesByTeamSeason,
  getTeamRosterBySeason,
  getSchoolChampionships,
  getSchoolAwards,
  SPORT_META,
} from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import type { Metadata } from "next";

export const revalidate = 86400; // ISR: daily

type PageParams = { slug: string; sport: string; season: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug, sport, season } = await params;
  const school = await getSchoolBySlug(slug);
  if (!school) return {};
  const meta = (SPORT_META as any)[sport];
  const sportName = meta?.name || sport;
  return {
    title: `${school.name} ${sportName} ${season} — PhillySportsPack`,
    description: `${school.name} ${sportName} ${season} season — schedule, results, player stats, championships, and more.`,
  };
}

export default async function TeamSeasonPage({ params }: { params: Promise<PageParams> }) {
  const { slug, sport, season } = await params;
  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const meta = (SPORT_META as any)[sport];
  if (!meta) notFound();

  const teamSeason = await getTeamSeason(school.id, sport, season);
  if (!teamSeason) notFound();

  const seasonId = teamSeason.season_id || teamSeason.seasons?.id;
  const [games, players, championships, awards] = await Promise.all([
    seasonId ? getGamesByTeamSeason(school.id, sport, seasonId) : Promise.resolve([]),
    seasonId ? getTeamRosterBySeason(school.id, sport, seasonId) : Promise.resolve([]),
    seasonId ? getSchoolChampionships(school.id, sport) : Promise.resolve([]),
    seasonId ? getSchoolAwards(school.id, sport) : Promise.resolve([]),
  ]);

  // Filter championships and awards to this specific season
  const seasonChamps = championships.filter((c: any) => c.seasons?.year_start === teamSeason.seasons?.year_start);
  const seasonAwards = awards.filter((a: any) => a.seasons?.year_start === teamSeason.seasons?.year_start);

  // School colors
  const colors = school.colors as { primary?: string; secondary?: string } | null;
  const primaryColor = colors?.primary || "#0a1628";
  const secondaryColor = colors?.secondary || "#222";

  // Record
  const w = teamSeason.wins ?? 0;
  const l = teamSeason.losses ?? 0;
  const t = teamSeason.ties ?? 0;
  const record = t > 0 ? `${w}-${l}-${t}` : `${w}-${l}`;
  const totalGames = w + l + t;
  const winPct = totalGames > 0 ? ((w / totalGames) * 100).toFixed(1) : null;

  // Sort players by key stat
  const sortedPlayers = [...players].sort((a: any, b: any) => {
    if (sport === "football") {
      const aYds = (a.rush_yards || 0) + (a.pass_yards || 0) + (a.rec_yards || 0);
      const bYds = (b.rush_yards || 0) + (b.pass_yards || 0) + (b.rec_yards || 0);
      return bYds - aYds;
    }
    if (sport === "basketball") return (b.points || 0) - (a.points || 0);
    return 0;
  });

  return (
    <>
      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section
        className="py-10 md:py-14"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 40%, ${meta.color}88 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "Schools", href: "/schools" },
              { label: school.name, href: `/schools/${slug}` },
              { label: `${meta.name} ${season}` },
            ]}
          />

          <div className="flex items-start gap-5 mt-4">
            {school.logo_url ? (
              <div
                className="flex-shrink-0 rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ width: 88, height: 88, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}
              >
                <img src={school.logo_url} alt={`${school.name} logo`} width={72} height={72} style={{ objectFit: "contain" }} />
              </div>
            ) : (
              <div
                className="flex-shrink-0 rounded-2xl flex items-center justify-center text-3xl"
                style={{ width: 88, height: 88, background: "rgba(255,255,255,0.12)", fontFamily: "Bebas Neue, sans-serif", color: "#fff", letterSpacing: 2 }}
              >
                {(school.short_name || school.name.charAt(0)).substring(0, 4)}
              </div>
            )}

            <div className="min-w-0">
              <h1
                className="text-3xl md:text-5xl text-white mb-1 tracking-wider"
                style={{ fontFamily: "Bebas Neue, sans-serif", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
              >
                {school.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-lg" style={{ fontFamily: "Bebas Neue, sans-serif", color: "rgba(255,255,255,0.85)", letterSpacing: 1 }}>
                  {meta.emoji} {meta.name} — {season}
                </span>
                {school.mascot && (
                  <span className="text-sm px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}>
                    {school.mascot}
                  </span>
                )}
              </div>

              {/* Big Record Display */}
              <div className="flex flex-wrap items-center gap-4">
                <span
                  className="text-4xl md:text-6xl font-bold text-white"
                  style={{ fontFamily: "Bebas Neue, sans-serif", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                >
                  {record}
                </span>
                {winPct && (
                  <span className="text-xl" style={{ color: "#f0a500", fontFamily: "Bebas Neue, sans-serif" }}>
                    {winPct}%
                  </span>
                )}
                {teamSeason.league_finish && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: "rgba(240,165,0,0.25)", color: "#f0a500", border: "1px solid rgba(240,165,0,0.4)" }}>
                    {teamSeason.league_finish}
                  </span>
                )}
                {teamSeason.playoff_result && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
                    {teamSeason.playoff_result}
                  </span>
                )}
              </div>

              {/* Coach + Points */}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                {teamSeason.coaches?.name && (
                  <span>
                    Coach:{" "}
                    {teamSeason.coaches.slug ? (
                      <Link href={`/${sport}/coaches/${teamSeason.coaches.slug}`} className="underline hover:text-white">{teamSeason.coaches.name}</Link>
                    ) : (
                      teamSeason.coaches.name
                    )}
                  </span>
                )}
                {teamSeason.points_for != null && (
                  <span>PF: {teamSeason.points_for}</span>
                )}
                {teamSeason.points_against != null && (
                  <span>PA: {teamSeason.points_against}</span>
                )}
                {teamSeason.ranking && (
                  <span>Ranked #{teamSeason.ranking}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CONTENT ═══════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <main className="flex-1 min-w-0 space-y-8">

          {/* Championships */}
          {seasonChamps.length > 0 && (
            <section>
              <h2
                className="text-lg font-bold uppercase tracking-wider mb-4"
                style={{ fontFamily: "Bebas Neue, sans-serif", color: "var(--text)" }}
              >
                Championships Won
              </h2>
              <div className="space-y-2">
                {seasonChamps.map((c: any) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: "linear-gradient(90deg, rgba(240,165,0,0.15), rgba(240,165,0,0.05))", border: "1px solid rgba(240,165,0,0.3)" }}
                  >
                    <span className="text-2xl">🏆</span>
                    <div>
                      <div className="font-bold text-sm" style={{ color: "#f0a500" }}>
                        {c.level ? c.level.charAt(0).toUpperCase() + c.level.slice(1) : "Championship"}
                        {c.leagues?.name && ` — ${c.leagues.name}`}
                      </div>
                      {c.opponent?.name && (
                        <div className="text-xs" style={{ color: "var(--g400)" }}>
                          vs {c.opponent.name}{c.score ? ` (${c.score})` : ""}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Schedule & Results */}
          {games.length > 0 && (
            <section>
              <h2
                className="text-lg font-bold uppercase tracking-wider mb-4"
                style={{ fontFamily: "Bebas Neue, sans-serif", color: "var(--text)" }}
              >
                Schedule & Results
              </h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--g100)" }}>
                <table className="data-table w-full">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Opponent</th>
                      <th className="text-center">H/A</th>
                      <th className="text-center">Result</th>
                      <th className="text-center">Score</th>
                      <th>Type</th>
                      {games.some((g: any) => g.venue) && <th>Venue</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {games.map((g: any) => {
                      const isHome = g.home_school_id === school.id;
                      const opponent = isHome ? g.away_school : g.home_school;
                      const ourScore = isHome ? g.home_score : g.away_score;
                      const theirScore = isHome ? g.away_score : g.home_score;
                      const isWin = ourScore != null && theirScore != null && ourScore > theirScore;
                      const isLoss = ourScore != null && theirScore != null && ourScore < theirScore;
                      const isTie = ourScore != null && theirScore != null && ourScore === theirScore;
                      const resultBadge = isWin ? "W" : isLoss ? "L" : isTie ? "T" : "—";
                      const resultColor = isWin ? "#16a34a" : isLoss ? "#dc2626" : "#ca8a04";
                      const gameType = g.game_type || "regular";
                      const isPlayoff = gameType !== "regular" && gameType !== "scrimmage";

                      return (
                        <tr key={g.id}>
                          <td className="text-sm whitespace-nowrap">
                            {g.game_date ? new Date(g.game_date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                          </td>
                          <td className="text-sm">
                            <span className="text-xs mr-1" style={{ color: "var(--g400)" }}>{isHome ? "vs" : "@"}</span>
                            {opponent?.slug ? (
                              <Link href={`/schools/${opponent.slug}`} className="hover:underline" style={{ color: "var(--link)" }}>
                                {opponent.name || "Unknown"}
                              </Link>
                            ) : (
                              opponent?.name || "Unknown"
                            )}
                          </td>
                          <td className="text-center text-xs" style={{ color: "var(--g400)" }}>
                            {isHome ? "H" : "A"}
                          </td>
                          <td className="text-center">
                            {ourScore != null ? (
                              <span
                                className="inline-block w-6 h-6 rounded-full text-xs font-bold leading-6 text-center text-white"
                                style={{ background: resultColor }}
                              >
                                {resultBadge}
                              </span>
                            ) : (
                              <span style={{ color: "var(--g300)" }}>—</span>
                            )}
                          </td>
                          <td className="text-center text-sm font-medium">
                            {ourScore != null && theirScore != null ? `${ourScore}-${theirScore}` : "—"}
                          </td>
                          <td className="text-xs">
                            {isPlayoff ? (
                              <span className="px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(240,165,0,0.15)", color: "#f0a500" }}>
                                {g.playoff_round || gameType.charAt(0).toUpperCase() + gameType.slice(1)}
                              </span>
                            ) : (
                              <span style={{ color: "var(--g400)" }}>Regular</span>
                            )}
                          </td>
                          {games.some((gg: any) => gg.venue) && (
                            <td className="text-xs" style={{ color: "var(--g400)" }}>{g.venue || ""}</td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Player Stats */}
          {sortedPlayers.length > 0 && (
            <section>
              <h2
                className="text-lg font-bold uppercase tracking-wider mb-4"
                style={{ fontFamily: "Bebas Neue, sans-serif", color: "var(--text)" }}
              >
                Player Stats
              </h2>
              <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--g100)" }}>
                {sport === "football" && (
                  <table className="data-table w-full">
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Pos</th>
                        <th className="text-center">GP</th>
                        <th className="text-center">Rush Yds</th>
                        <th className="text-center">Rush TD</th>
                        <th className="text-center">Pass Yds</th>
                        <th className="text-center">Pass TD</th>
                        <th className="text-center">Rec Yds</th>
                        <th className="text-center">Rec TD</th>
                        <th className="text-center">Total TD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPlayers.map((p: any) => (
                        <tr key={p.id}>
                          <td className="text-sm font-medium">
                            {p.players?.slug ? (
                              <Link href={`/football/players/${p.players.slug}`} className="hover:underline" style={{ color: "var(--link)" }}>
                                {p.players.name}
                              </Link>
                            ) : (
                              p.players?.name || "—"
                            )}
                          </td>
                          <td className="text-xs" style={{ color: "var(--g400)" }}>
                            {Array.isArray(p.players?.positions) ? p.players.positions.join(", ") : p.players?.positions || "—"}
                          </td>
                          <td className="text-center text-sm">{p.games_played ?? "—"}</td>
                          <td className="text-center text-sm">{p.rush_yards || "—"}</td>
                          <td className="text-center text-sm" style={{ color: p.rush_td > 0 ? "#f0a500" : undefined }}>{p.rush_td || "—"}</td>
                          <td className="text-center text-sm">{p.pass_yards || "—"}</td>
                          <td className="text-center text-sm" style={{ color: p.pass_td > 0 ? "#f0a500" : undefined }}>{p.pass_td || "—"}</td>
                          <td className="text-center text-sm">{p.rec_yards || "—"}</td>
                          <td className="text-center text-sm" style={{ color: p.rec_td > 0 ? "#f0a500" : undefined }}>{p.rec_td || "—"}</td>
                          <td className="text-center text-sm font-bold" style={{ color: p.total_td > 0 ? "#f0a500" : undefined }}>{p.total_td || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {sport === "basketball" && (
                  <table className="data-table w-full">
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Pos</th>
                        <th className="text-center">GP</th>
                        <th className="text-center">PTS</th>
                        <th className="text-center">PPG</th>
                        <th className="text-center">REB</th>
                        <th className="text-center">AST</th>
                        <th className="text-center">STL</th>
                        <th className="text-center">BLK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPlayers.map((p: any) => {
                        const ppg = p.games_played > 0 ? ((p.points || 0) / p.games_played).toFixed(1) : "—";
                        return (
                          <tr key={p.id}>
                            <td className="text-sm font-medium">
                              {p.players?.slug ? (
                                <Link href={`/basketball/players/${p.players.slug}`} className="hover:underline" style={{ color: "var(--link)" }}>
                                  {p.players.name}
                                </Link>
                              ) : (
                                p.players?.name || "—"
                              )}
                            </td>
                            <td className="text-xs" style={{ color: "var(--g400)" }}>
                              {Array.isArray(p.players?.positions) ? p.players.positions.join(", ") : p.players?.positions || "—"}
                            </td>
                            <td className="text-center text-sm">{p.games_played ?? "—"}</td>
                            <td className="text-center text-sm font-bold">{p.points || "—"}</td>
                            <td className="text-center text-sm" style={{ color: "#f0a500" }}>{ppg}</td>
                            <td className="text-center text-sm">{p.rebounds || "—"}</td>
                            <td className="text-center text-sm">{p.assists || "—"}</td>
                            <td className="text-center text-sm">{p.steals || "—"}</td>
                            <td className="text-center text-sm">{p.blocks || "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {sport === "baseball" && (
                  <table className="data-table w-full">
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Pos</th>
                        <th>Award</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPlayers.map((p: any) => (
                        <tr key={p.id}>
                          <td className="text-sm font-medium">
                            {p.players?.slug ? (
                              <Link href={`/baseball/players/${p.players.slug}`} className="hover:underline" style={{ color: "var(--link)" }}>
                                {p.players.name}
                              </Link>
                            ) : (
                              p.players?.name || "—"
                            )}
                          </td>
                          <td className="text-xs" style={{ color: "var(--g400)" }}>
                            {Array.isArray(p.players?.positions) ? p.players.positions.join(", ") : p.players?.positions || "—"}
                          </td>
                          <td className="text-xs">{p.award_name || p.notes || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Minor sports - generic JSONB display */}
                {!["football", "basketball", "baseball"].includes(sport) && (
                  <table className="data-table w-full">
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPlayers.map((p: any) => (
                        <tr key={p.id}>
                          <td className="text-sm font-medium">{p.players?.name || "—"}</td>
                          <td className="text-xs" style={{ color: "var(--g400)" }}>
                            {p.stats ? JSON.stringify(p.stats) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          )}

          {/* Awards */}
          {seasonAwards.length > 0 && (
            <section>
              <h2
                className="text-lg font-bold uppercase tracking-wider mb-4"
                style={{ fontFamily: "Bebas Neue, sans-serif", color: "var(--text)" }}
              >
                Awards & Honors
              </h2>
              <div className="space-y-2">
                {seasonAwards.map((a: any) => (
                  <div key={a.id} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: "var(--bg)", border: "1px solid var(--g100)" }}>
                    <span className="text-lg">🏅</span>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--text)" }}>
                        {a.award_name || a.award_type || a.category || "Award"}
                      </div>
                      {a.players?.name && (
                        <div className="text-xs" style={{ color: "var(--g400)" }}>
                          {a.players.slug ? (
                            <Link href={`/${sport}/players/${a.players.slug}`} className="hover:underline" style={{ color: "var(--link)" }}>
                              {a.players.name}
                            </Link>
                          ) : (
                            a.players.name
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Notes */}
          {teamSeason.notes && (
            <section>
              <h2
                className="text-lg font-bold uppercase tracking-wider mb-4"
                style={{ fontFamily: "Bebas Neue, sans-serif", color: "var(--text)" }}
              >
                Season Notes
              </h2>
              <div className="prose text-sm" style={{ color: "var(--g400)" }}>
                {teamSeason.notes}
              </div>
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside className="w-full lg:w-[340px] flex-shrink-0 space-y-6">
          {/* Season Summary Card */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--g100)" }}>
            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${meta.color}88)` }}
            >
              <span className="text-2xl">{meta.emoji}</span>
              <div>
                <div className="text-white font-bold text-sm" style={{ fontFamily: "Bebas Neue, sans-serif", letterSpacing: 1 }}>
                  {season} Season
                </div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {meta.name}
                </div>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--g400)" }}>Record</span>
                <span className="font-bold" style={{ color: "var(--text)" }}>{record}</span>
              </div>
              {winPct && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--g400)" }}>Win %</span>
                  <span className="font-bold" style={{ color: "var(--text)" }}>{winPct}%</span>
                </div>
              )}
              {teamSeason.points_for != null && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--g400)" }}>Points For</span>
                  <span className="font-bold" style={{ color: "var(--text)" }}>{teamSeason.points_for}</span>
                </div>
              )}
              {teamSeason.points_against != null && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--g400)" }}>Points Against</span>
                  <span className="font-bold" style={{ color: "var(--text)" }}>{teamSeason.points_against}</span>
                </div>
              )}
              {teamSeason.league_finish && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--g400)" }}>League Finish</span>
                  <span className="font-bold" style={{ color: "#f0a500" }}>{teamSeason.league_finish}</span>
                </div>
              )}
              {teamSeason.playoff_result && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--g400)" }}>Playoff</span>
                  <span className="font-bold" style={{ color: "var(--text)" }}>{teamSeason.playoff_result}</span>
                </div>
              )}
              {teamSeason.coaches?.name && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--g400)" }}>Coach</span>
                  <span className="font-medium" style={{ color: "var(--text)" }}>
                    {teamSeason.coaches.slug ? (
                      <Link href={`/${sport}/coaches/${teamSeason.coaches.slug}`} className="hover:underline" style={{ color: "var(--link)" }}>
                        {teamSeason.coaches.name}
                      </Link>
                    ) : (
                      teamSeason.coaches.name
                    )}
                  </span>
                </div>
              )}
              {teamSeason.ranking && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--g400)" }}>Final Ranking</span>
                  <span className="font-bold" style={{ color: "#f0a500" }}>#{teamSeason.ranking}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--g100)" }}>
            <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--g100)" }}>
              <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--g400)" }}>Quick Links</h3>
            </div>
            <div className="px-5 py-3 space-y-2">
              <Link href={`/schools/${slug}`} className="block text-sm py-1 hover:underline" style={{ color: "var(--link)" }}>
                ← Back to {school.short_name || school.name}
              </Link>
              <Link href={`/${sport}`} className="block text-sm py-1 hover:underline" style={{ color: "var(--link)" }}>
                {meta.emoji} {meta.name} Hub
              </Link>
              <Link href={`/${sport}/championships`} className="block text-sm py-1 hover:underline" style={{ color: "var(--link)" }}>
                🏆 {meta.name} Championships
              </Link>
              <Link href={`/${sport}/leaderboards/rushing`} className="block text-sm py-1 hover:underline" style={{ color: "var(--link)" }}>
                📊 {meta.name} Leaderboards
              </Link>
            </div>
          </div>

          {/* Promo */}
          <PSPPromo size="sidebar" />
        </aside>
      </div>
    </>
  );
}
