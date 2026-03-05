import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSchoolBySlug,
  getCurrentTeamSeason,
  getGamesByTeamSeason,
  getTeamRosterBySeason,
  getSchoolChampionships,
  getSchoolAwards,
  getSchoolCoaches,
  getAvailableTeamSeasons,
  SPORT_META,
  isValidSport,
} from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageParams = { slug: string; sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug, sport } = await params;
  const school = await getSchoolBySlug(slug);
  if (!school) return {};
  const meta = (SPORT_META as any)[sport];
  const sportName = meta?.name || sport;
  return {
    title: `${school.name} ${sportName} — PhillySportsPack`,
    description: `${school.name} ${sportName} — current season schedule, results, roster, stats, and coach info.`,
  };
}

export default async function TeamProfilePage({ params }: { params: Promise<PageParams> }) {
  const { slug, sport } = await params;
  if (!isValidSport(sport)) notFound();

  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const meta = (SPORT_META as any)[sport];
  if (!meta) notFound();

  const teamSeason = await getCurrentTeamSeason(school.id, sport);
  const availableSeasons = await getAvailableTeamSeasons(school.id, sport);
  const allChampionships = await getSchoolChampionships(school.id, sport);

  // Colors
  const colors = school.colors as { primary?: string; secondary?: string } | null;
  const primaryColor = colors?.primary || meta.color || "#0a1628";
  const secondaryColor = colors?.secondary || "#222";

  // If no current season data, show "Coming Soon" with historical summary
  if (!teamSeason) {
    const totalRecord = { w: 0, l: 0, t: 0 };
    // We can't calculate without team seasons data, just show basic info
    return (
      <>
        <Breadcrumb items={[
          { label: "Schools", href: "/schools" },
          { label: school.name, href: `/schools/${slug}` },
          { label: meta.name },
        ]} />

        <div style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${secondaryColor}aa 100%)`,
          padding: "32px 20px", color: "#fff", textAlign: "center",
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>{meta.emoji}</div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, margin: "0 0 4px" }}>
            {school.name} {meta.name}
          </h1>
          <p style={{ opacity: 0.8, fontSize: 14 }}>{school.city}, {school.state}</p>
        </div>

        <div style={{ maxWidth: 800, margin: "32px auto", padding: "0 16px", textAlign: "center" }}>
          <div style={{
            background: "var(--card-bg)", border: "1px dashed var(--g200)", borderRadius: 12,
            padding: "40px 20px",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏗️</div>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, color: "var(--text)", marginBottom: 8 }}>
              Current Season Data Coming Soon
            </h2>
            <p style={{ color: "var(--g400)", fontSize: 14, maxWidth: 500, margin: "0 auto 16px" }}>
              We&apos;re working on getting 2024-25 season data for {school.name} {meta.name}.
              {allChampionships.length > 0 && ` They have ${allChampionships.length} championship${allChampionships.length !== 1 ? "s" : ""} in our records.`}
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {availableSeasons.length > 0 && (
                <Link
                  href={`/schools/${slug}/${sport}/history`}
                  style={{
                    padding: "10px 20px", borderRadius: 6, background: "var(--psp-gold)",
                    color: "#0a1628", fontWeight: 700, textDecoration: "none", fontSize: 14,
                  }}
                >
                  View History ({availableSeasons.length} seasons)
                </Link>
              )}
              <Link
                href={`/schools/${slug}`}
                style={{
                  padding: "10px 20px", borderRadius: 6, background: "var(--g100)",
                  color: "var(--text)", fontWeight: 600, textDecoration: "none", fontSize: 14,
                }}
              >
                Back to School Profile
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Load current season data
  const seasonId = teamSeason.season_id || teamSeason.seasons?.id;
  const [games, roster, seasonAwards] = await Promise.all([
    seasonId ? getGamesByTeamSeason(school.id, sport, seasonId) : Promise.resolve([]),
    seasonId ? getTeamRosterBySeason(school.id, sport, seasonId) : Promise.resolve([]),
    getSchoolAwards(school.id, sport),
  ]);

  const currentSeasonAwards = seasonAwards.filter((a: any) => a.seasons?.year_start === teamSeason.seasons?.year_start);
  const seasonChamps = allChampionships.filter((c: any) => c.seasons?.year_start === teamSeason.seasons?.year_start);

  // Coach info
  const coachingStints = await getSchoolCoaches(school.id);
  const currentCoach = (coachingStints as any[]).find(
    (cs: any) => cs.sport_id === sport && !cs.end_year
  );

  // Record
  const wins = teamSeason.wins || 0;
  const losses = teamSeason.losses || 0;
  const ties = teamSeason.ties || 0;
  const recordStr = `${wins}-${losses}${ties > 0 ? `-${ties}` : ""}`;
  const leagueRecord = teamSeason.league_wins != null
    ? `${teamSeason.league_wins}-${teamSeason.league_losses || 0}${teamSeason.league_ties ? `-${teamSeason.league_ties}` : ""}`
    : null;

  return (
    <>
      <Breadcrumb items={[
        { label: "Schools", href: "/schools" },
        { label: school.name, href: `/schools/${slug}` },
        { label: meta.name },
      ]} />

      {/* TEAM BANNER */}
      <div style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${secondaryColor}aa 100%)`,
        padding: "24px 20px", color: "#fff",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {school.logo_url ? (
            <div style={{
              width: 60, height: 60, borderRadius: 8, background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <img src={school.logo_url} alt="" width={50} height={50} style={{ objectFit: "contain" }} />
            </div>
          ) : (
            <div style={{ fontSize: 36 }}>{meta.emoji}</div>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, margin: 0 }}>
              {school.name} {meta.name}
            </h1>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>
              {teamSeason.seasons?.label} Season
              {(school as any).leagues && <span> · {(school as any).leagues?.name}</span>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>{recordStr}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Overall</div>
            </div>
            {leagueRecord && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>{leagueRecord}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>League</div>
              </div>
            )}
            {teamSeason.points_for != null && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>{teamSeason.points_for}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>Pts For</div>
              </div>
            )}
            {teamSeason.points_against != null && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>{teamSeason.points_against}</div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>Pts Against</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="espn-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
          {/* MAIN CONTENT */}
          <main>
            {/* Quick Action Buttons */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <Link
                href={`/schools/${slug}/${sport}/history`}
                style={{
                  padding: "8px 16px", borderRadius: 6, background: "var(--g100)",
                  color: "var(--text)", fontWeight: 600, textDecoration: "none", fontSize: 13,
                }}
              >
                View Full History
              </Link>
              <Link
                href={`/schools/${slug}`}
                style={{
                  padding: "8px 16px", borderRadius: 6, background: "var(--g100)",
                  color: "var(--text)", fontWeight: 600, textDecoration: "none", fontSize: 13,
                }}
              >
                School Profile
              </Link>
              {availableSeasons.length > 0 && availableSeasons[0]?.label && (
                <Link
                  href={`/schools/${slug}/${sport}/${availableSeasons[0].label}`}
                  style={{
                    padding: "8px 16px", borderRadius: 6, background: "var(--g100)",
                    color: "var(--text)", fontWeight: 600, textDecoration: "none", fontSize: 13,
                  }}
                >
                  {availableSeasons[0].label} Details
                </Link>
              )}
            </div>

            {/* SCHEDULE / RESULTS */}
            <div className="sec-head" style={{ marginBottom: 8 }}>
              <h2 style={{ margin: 0 }}>Schedule & Results</h2>
            </div>
            {games.length > 0 ? (
              <div style={{
                background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8,
                overflow: "hidden", marginBottom: 20,
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "var(--g50, rgba(0,0,0,0.03))", borderBottom: "2px solid var(--g200)" }}>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>Date</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>Opponent</th>
                      <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600 }}>Result</th>
                      <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600 }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {games.map((game: any, i: number) => {
                      const isHome = game.home_school_id === school.id;
                      const opponent = isHome ? game.away_school : game.home_school;
                      const ourScore = isHome ? game.home_score : game.away_score;
                      const theirScore = isHome ? game.away_score : game.home_score;
                      const won = ourScore != null && theirScore != null && ourScore > theirScore;
                      const lost = ourScore != null && theirScore != null && ourScore < theirScore;
                      const tied = ourScore != null && theirScore != null && ourScore === theirScore;
                      const result = won ? "W" : lost ? "L" : tied ? "T" : "—";
                      const resultColor = won ? "#16a34a" : lost ? "#dc2626" : "#888";

                      return (
                        <tr key={game.id || i} style={{ borderBottom: "1px solid var(--g100)" }}>
                          <td style={{ padding: "8px 12px", fontSize: 12, color: "var(--g400)" }}>
                            {game.game_date ? new Date(game.game_date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                          </td>
                          <td style={{ padding: "8px 12px" }}>
                            <span style={{ fontSize: 11, color: "var(--g400)", marginRight: 4 }}>
                              {isHome ? "vs" : "@"}
                            </span>
                            {opponent?.slug ? (
                              <Link href={`/schools/${opponent.slug}`} style={{ color: "var(--text)", textDecoration: "none", fontWeight: 500 }}>
                                {opponent.name || "Unknown"}
                              </Link>
                            ) : (
                              <span>{opponent?.name || "Unknown"}</span>
                            )}
                            {game.game_type !== "regular" && (
                              <span style={{
                                fontSize: 10, padding: "1px 6px", borderRadius: 8,
                                background: "var(--psp-gold)", color: "#0a1628", marginLeft: 6, fontWeight: 600,
                              }}>
                                {game.playoff_round || game.game_type}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: resultColor }}>
                            {result}
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600 }}>
                            {ourScore != null ? `${ourScore}-${theirScore}` : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{
                padding: "24px", textAlign: "center", color: "var(--g400)",
                background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, marginBottom: 20,
              }}>
                No game schedule available for this season yet.
              </div>
            )}

            {/* ROSTER */}
            <div className="sec-head" style={{ marginBottom: 8 }}>
              <h2 style={{ margin: 0 }}>Roster</h2>
            </div>
            {roster.length > 0 ? (
              <div style={{
                background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8,
                overflow: "hidden", marginBottom: 20,
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "var(--g50, rgba(0,0,0,0.03))", borderBottom: "2px solid var(--g200)" }}>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>Player</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>Pos</th>
                      <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600 }}>Class</th>
                      {sport === "football" && (
                        <>
                          <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600 }}>Rush</th>
                          <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600 }}>Pass</th>
                          <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600 }}>Rec</th>
                          <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600 }}>TD</th>
                        </>
                      )}
                      {sport === "basketball" && (
                        <>
                          <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600 }}>GP</th>
                          <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600 }}>PTS</th>
                          <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600 }}>PPG</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(roster as any[]).slice(0, 30).map((p: any, i: number) => {
                      const player = p.players;
                      return (
                        <tr key={p.id || i} style={{ borderBottom: "1px solid var(--g100)" }}>
                          <td style={{ padding: "8px 12px" }}>
                            {player?.slug ? (
                              <Link href={`/${sport}/players/${player.slug}`} style={{ color: "var(--psp-blue)", textDecoration: "none", fontWeight: 500 }}>
                                {player.name}
                              </Link>
                            ) : (
                              <span>{player?.name || "Unknown"}</span>
                            )}
                          </td>
                          <td style={{ padding: "8px 12px", fontSize: 12, color: "var(--g400)" }}>
                            {player?.positions?.join(", ") || "—"}
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "center", fontSize: 12 }}>
                            {player?.graduation_year || "—"}
                          </td>
                          {sport === "football" && (
                            <>
                              <td style={{ padding: "8px 12px", textAlign: "right" }}>{p.rush_yards || "—"}</td>
                              <td style={{ padding: "8px 12px", textAlign: "right" }}>{p.pass_yards || "—"}</td>
                              <td style={{ padding: "8px 12px", textAlign: "right" }}>{p.rec_yards || "—"}</td>
                              <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: (p.total_td || 0) > 0 ? "var(--psp-gold)" : "var(--g400)" }}>
                                {p.total_td || "—"}
                              </td>
                            </>
                          )}
                          {sport === "basketball" && (
                            <>
                              <td style={{ padding: "8px 12px", textAlign: "right" }}>{p.games_played || "—"}</td>
                              <td style={{ padding: "8px 12px", textAlign: "right" }}>{p.points || "—"}</td>
                              <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: parseFloat(p.ppg) > 10 ? "var(--psp-gold)" : "var(--g400)" }}>
                                {p.ppg || "—"}
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{
                padding: "24px", textAlign: "center", color: "var(--g400)",
                background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, marginBottom: 20,
              }}>
                No roster data available for this season yet.
              </div>
            )}

            {/* SEASON AWARDS */}
            {currentSeasonAwards.length > 0 && (
              <>
                <div className="sec-head" style={{ marginBottom: 8 }}>
                  <h2 style={{ margin: 0 }}>Awards</h2>
                </div>
                <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
                  {currentSeasonAwards.map((a: any, i: number) => (
                    <div key={a.id || i} style={{
                      padding: "10px 14px", background: "var(--card-bg)", border: "1px solid var(--g100)",
                      borderRadius: 8, display: "flex", alignItems: "center", gap: 10,
                    }}>
                      <span style={{ fontSize: 20 }}>🏆</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>
                          {a.award_name || a.award_type}
                        </div>
                        {a.players && (
                          <Link href={`/${sport}/players/${a.players.slug}`} style={{ fontSize: 12, color: "var(--psp-blue)", textDecoration: "none" }}>
                            {a.players.name}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {seasonChamps.length > 0 && (
              <>
                <div className="sec-head" style={{ marginBottom: 8 }}>
                  <h2 style={{ margin: 0 }}>Championships Won</h2>
                </div>
                <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
                  {seasonChamps.map((c: any, i: number) => (
                    <div key={c.id || i} style={{
                      padding: "12px 14px", background: "linear-gradient(135deg, #f0a50020, transparent)",
                      border: "1px solid var(--psp-gold)", borderRadius: 8,
                    }}>
                      <div style={{ fontWeight: 700, color: "var(--psp-gold)", fontSize: 14 }}>
                        🥇 {c.level} Championship
                      </div>
                      {c.score && <div style={{ fontSize: 12, color: "var(--g400)", marginTop: 2 }}>Score: {c.score}</div>}
                      {c.opponent && <div style={{ fontSize: 12, color: "var(--g400)" }}>vs {c.opponent.name}</div>}
                    </div>
                  ))}
                </div>
              </>
            )}

            <PSPPromo size="banner" variant={1} />
          </main>

          {/* SIDEBAR */}
          <aside>
            {/* Coach Card */}
            {currentCoach?.coaches && (
              <div className="widget" style={{ marginBottom: 16 }}>
                <div className="w-head">Head Coach</div>
                <div className="w-body" style={{ padding: 14 }}>
                  <Link
                    href={`/${sport}/coaches/${currentCoach.coaches.slug}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: "50%", background: "var(--g100)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, fontWeight: 700, color: "var(--g400)",
                      }}>
                        {currentCoach.coaches.name?.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "var(--psp-blue)" }}>{currentCoach.coaches.name}</div>
                        <div style={{ fontSize: 12, color: "var(--g400)" }}>
                          {currentCoach.start_year}-present
                        </div>
                        {(currentCoach.record_wins > 0 || currentCoach.record_losses > 0) && (
                          <div style={{ fontSize: 12, color: "var(--g300)" }}>
                            Career: {currentCoach.record_wins}-{currentCoach.record_losses}{currentCoach.record_ties ? `-${currentCoach.record_ties}` : ""}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Other Sports */}
            <div className="widget" style={{ marginBottom: 16 }}>
              <div className="w-head">Other Sports</div>
              <div className="w-body">
                {["football", "basketball", "baseball", "lacrosse", "soccer", "track-field", "wrestling"]
                  .filter(s => s !== sport)
                  .map(s => {
                    const sMeta = (SPORT_META as any)[s];
                    return (
                      <Link key={s} href={`/schools/${slug}/${s}`} className="w-link">
                        {sMeta?.emoji} {sMeta?.name}
                      </Link>
                    );
                  })}
              </div>
            </div>

            {/* Championships */}
            {allChampionships.length > 0 && (
              <div className="widget" style={{ marginBottom: 16 }}>
                <div className="w-head">{meta.name} Championships ({allChampionships.length})</div>
                <div className="w-body">
                  {allChampionships.slice(0, 8).map((c: any, i: number) => (
                    <div key={c.id || i} style={{
                      padding: "6px 14px", borderBottom: "1px solid var(--g100)",
                      fontSize: 12, display: "flex", justifyContent: "space-between",
                    }}>
                      <span style={{ color: "var(--psp-gold)" }}>{c.level}</span>
                      <span style={{ color: "var(--g400)" }}>{c.seasons?.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Seasons Quick Links */}
            {availableSeasons.length > 0 && (
              <div className="widget" style={{ marginBottom: 16 }}>
                <div className="w-head">Past Seasons</div>
                <div className="w-body">
                  {availableSeasons.slice(0, 10).map((s: any) => (
                    <Link key={s.label} href={`/schools/${slug}/${sport}/${s.label}`} className="w-link">
                      {s.label}
                    </Link>
                  ))}
                  {availableSeasons.length > 10 && (
                    <Link href={`/schools/${slug}/${sport}/history`} className="w-link" style={{ color: "var(--psp-gold)" }}>
                      View All →
                    </Link>
                  )}
                </div>
              </div>
            )}

            <PSPPromo size="sidebar" variant={2} />
          </aside>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsTeam",
            name: `${school.name} ${meta.name}`,
            sport: meta.name,
            url: `https://phillysportspack.com/schools/${slug}/${sport}`,
          }),
        }}
      />
    </>
  );
}
