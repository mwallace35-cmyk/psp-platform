import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSchoolBySlug,
  getSchoolTeamSeasons,
  getSchoolChampionships,
  getSchoolPlayers,
  SPORT_META,
  isValidSport,
} from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import type { Metadata } from "next";

export const revalidate = 86400;

type PageParams = { slug: string; sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug, sport } = await params;
  const school = await getSchoolBySlug(slug);
  if (!school) return {};
  const meta = (SPORT_META as any)[sport];
  const sportName = meta?.name || sport;
  return {
    title: `${school.name} ${sportName} History — PhillySportsPack`,
    description: `Complete ${school.name} ${sportName} history — season-by-season records, championships, notable players, and coaching history.`,
  };
}

export default async function TeamHistoryPage({ params }: { params: Promise<PageParams> }) {
  const { slug, sport } = await params;
  if (!isValidSport(sport)) notFound();

  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const meta = (SPORT_META as any)[sport];
  if (!meta) notFound();

  const [teamSeasons, championships, players] = await Promise.all([
    getSchoolTeamSeasons(school.id, sport),
    getSchoolChampionships(school.id, sport),
    getSchoolPlayers(school.id, sport, 20),
  ]);

  // All-time record
  const allTime = teamSeasons.reduce(
    (acc: any, ts: any) => ({
      w: acc.w + (ts.wins || 0),
      l: acc.l + (ts.losses || 0),
      t: acc.t + (ts.ties || 0),
    }),
    { w: 0, l: 0, t: 0 }
  );
  const totalGames = allTime.w + allTime.l + allTime.t;
  const winPct = totalGames > 0 ? ((allTime.w / totalGames) * 100).toFixed(1) : null;

  const colors = school.colors as { primary?: string; secondary?: string } | null;
  const primaryColor = colors?.primary || meta.color || "#0a1628";
  const secondaryColor = colors?.secondary || "#222";

  return (
    <>
      <Breadcrumb items={[
        { label: "Schools", href: "/schools" },
        { label: school.name, href: `/schools/${slug}` },
        { label: meta.name, href: `/schools/${slug}/${sport}` },
        { label: "History" },
      ]} />

      {/* HISTORY BANNER */}
      <div style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${secondaryColor}aa 100%)`,
        padding: "24px 20px", color: "#fff",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ fontSize: 36 }}>{meta.emoji}</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, margin: 0 }}>
              {school.name} {meta.name} History
            </h1>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>
              {teamSeasons.length} seasons on record · {school.city}, {school.state}
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>
                {totalGames > 0 ? `${allTime.w}-${allTime.l}${allTime.t > 0 ? `-${allTime.t}` : ""}` : "—"}
              </div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>All-Time</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>{winPct ? `${winPct}%` : "—"}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Win %</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", color: "var(--psp-gold)" }}>
                {championships.length}
              </div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Championships</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>{teamSeasons.length}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Seasons</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
          {/* MAIN */}
          <main>
            {/* Team page callout — season dropdown handles history inline now */}
            <div style={{
              display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap",
              padding: "12px 16px", background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: 8,
            }}>
              <span style={{ fontSize: 14 }}>💡</span>
              <span style={{ fontSize: 13, color: "var(--text)", flex: 1 }}>
                Use the <strong>season dropdown</strong> on the team page to browse any season&apos;s schedule, roster, and stats.
              </span>
              <Link
                href={`/schools/${slug}/${sport}`}
                style={{
                  padding: "8px 16px", borderRadius: 6, background: meta.color,
                  color: "#fff", fontWeight: 600, textDecoration: "none", fontSize: 13,
                  whiteSpace: "nowrap",
                }}
              >
                Go to Team Page →
              </Link>
            </div>

            {/* Back links */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <Link
                href={`/schools/${slug}/${sport}`}
                style={{
                  padding: "8px 16px", borderRadius: 6, background: meta.color,
                  color: "#fff", fontWeight: 600, textDecoration: "none", fontSize: 13,
                }}
              >
                Team Page
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
            </div>

            {/* SEASON-BY-SEASON TABLE */}
            <div className="sec-head" style={{ marginBottom: 8 }}>
              <h2 style={{ margin: 0 }}>Season-by-Season Results</h2>
            </div>
            {teamSeasons.length > 0 ? (
              <div style={{
                background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8,
                overflow: "hidden", marginBottom: 24,
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "var(--g50, rgba(0,0,0,0.03))", borderBottom: "2px solid var(--g200)" }}>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>Season</th>
                      <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600 }}>Record</th>
                      <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600 }}>League</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>Coach</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>Playoff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamSeasons.map((ts: any, i: number) => {
                      const record = `${ts.wins || 0}-${ts.losses || 0}${ts.ties ? `-${ts.ties}` : ""}`;
                      const leagueRecord = ts.league_wins != null
                        ? `${ts.league_wins}-${ts.league_losses || 0}${ts.league_ties ? `-${ts.league_ties}` : ""}`
                        : "—";
                      const seasonLabel = ts.seasons?.label || "—";
                      const coach = ts.coaches;
                      const isChampSeason = championships.some((c: any) =>
                        c.seasons?.year_start === ts.seasons?.year_start
                      );

                      return (
                        <tr key={ts.id || i} style={{
                          borderBottom: "1px solid var(--g100)",
                          background: isChampSeason ? "rgba(240, 165, 0, 0.08)" : undefined,
                        }}>
                          <td style={{ padding: "8px 12px" }}>
                            <Link
                              href={`/schools/${slug}/${sport}/${seasonLabel}`}
                              style={{ color: "var(--psp-blue)", textDecoration: "none", fontWeight: 500 }}
                            >
                              {seasonLabel}
                            </Link>
                            {isChampSeason && <span style={{ marginLeft: 4, fontSize: 12 }}>🏆</span>}
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600 }}>{record}</td>
                          <td style={{ padding: "8px 12px", textAlign: "center", color: "var(--g400)" }}>{leagueRecord}</td>
                          <td style={{ padding: "8px 12px" }}>
                            {coach?.slug ? (
                              <Link href={`/${sport}/coaches/${coach.slug}`} style={{ color: "var(--text)", textDecoration: "none", fontSize: 12 }}>
                                {coach.name}
                              </Link>
                            ) : (
                              <span style={{ fontSize: 12, color: "var(--g400)" }}>—</span>
                            )}
                          </td>
                          <td style={{ padding: "8px 12px", fontSize: 12, color: "var(--g400)" }}>
                            {ts.playoff_result || ts.league_finish || "—"}
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
                background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8, marginBottom: 24,
              }}>
                No season records available yet.
              </div>
            )}

            {/* CHAMPIONSHIPS TIMELINE */}
            {championships.length > 0 && (
              <>
                <div className="sec-head" style={{ marginBottom: 8 }}>
                  <h2 style={{ margin: 0 }}>Championships ({championships.length})</h2>
                </div>
                <div style={{ display: "grid", gap: 8, marginBottom: 24 }}>
                  {championships.map((c: any, i: number) => (
                    <div key={c.id || i} style={{
                      padding: "12px 16px",
                      background: "linear-gradient(135deg, rgba(240, 165, 0, 0.1), transparent)",
                      border: "1px solid var(--psp-gold)",
                      borderRadius: 8,
                      display: "flex", alignItems: "center", gap: 12,
                    }}>
                      <span style={{ fontSize: 24 }}>🥇</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--psp-gold)" }}>
                          {c.level} Championship
                        </div>
                        <div style={{ fontSize: 12, color: "var(--g400)" }}>
                          {c.seasons?.label}
                          {c.score && ` · ${c.score}`}
                          {c.opponent && ` vs ${c.opponent.name}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <PSPPromo size="banner" variant={1} />
          </main>

          {/* SIDEBAR */}
          <aside>
            {/* Notable Players */}
            {players.length > 0 && (
              <div className="widget" style={{ marginBottom: 16 }}>
                <div className="w-head">Notable Players</div>
                <div className="w-body">
                  {players.slice(0, 10).map((p: any, i: number) => (
                    <Link
                      key={p.slug || i}
                      href={`/${sport}/players/${p.slug}`}
                      className="w-link"
                      style={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <span>{p.name}</span>
                      <span style={{ fontSize: 11, color: "var(--g400)" }}>
                        {sport === "football"
                          ? `${(p.total_stats?.rush_yards || 0) + (p.total_stats?.pass_yards || 0) + (p.total_stats?.rec_yards || 0)} yds`
                          : sport === "basketball"
                          ? `${p.total_stats?.points || 0} pts`
                          : ""}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="widget" style={{ marginBottom: 16 }}>
              <div className="w-head">Quick Links</div>
              <div className="w-body">
                <Link href={`/schools/${slug}/${sport}`} className="w-link">→ Current Season</Link>
                <Link href={`/schools/${slug}`} className="w-link">→ School Profile</Link>
                <Link href={`/${sport}`} className="w-link">→ {meta.name} Hub</Link>
                <Link href={`/${sport}/championships`} className="w-link">→ All Championships</Link>
              </div>
            </div>

            <PSPPromo size="sidebar" variant={2} />
          </aside>
        </div>
      </div>
    </>
  );
}
