import Link from "next/link";
import { notFound } from "next/navigation";
import {
  isValidSport,
  SPORT_META,
  getSchoolBySlug,
  getSchoolTeamSeasons,
  getSchoolChampionships,
  getSchoolPlayers,
  getSchoolAwards,
  getSchoolRecentGames,
} from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import CorrectionForm from "@/components/corrections/CorrectionForm";
import RelatedArticles from "@/components/articles/RelatedArticles";
import type { Metadata } from "next";

export const revalidate = 86400; // ISR: daily

type PageParams = { sport: string; slug: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) return {};
  const school = await getSchoolBySlug(slug);
  if (!school) return {};
  const mascotStr = school.mascot ? ` ${school.mascot}` : "";
  return {
    title: `${school.name}${mascotStr} ${SPORT_META[sport].name} — PhillySportsPack`,
    description: `${school.name}${mascotStr} ${SPORT_META[sport].name.toLowerCase()} — season results, statistics, championships, roster, and notable alumni. ${school.city}, ${school.state}.`,
  };
}

export default async function SchoolProfilePage({ params }: { params: Promise<PageParams> }) {
  const { sport, slug } = await params;
  if (!isValidSport(sport)) notFound();

  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const meta = SPORT_META[sport];
  const [teamSeasons, championships, players, awards, recentGames] = await Promise.all([
    getSchoolTeamSeasons(school.id, sport),
    getSchoolChampionships(school.id, sport),
    getSchoolPlayers(school.id, sport),
    getSchoolAwards(school.id, sport),
    getSchoolRecentGames(school.id, sport),
  ]);

  // Compute all-time record
  const allTimeRecord = teamSeasons.reduce(
    (acc: { w: number; l: number; t: number; pf: number; pa: number }, ts: any) => ({
      w: acc.w + (ts.wins || 0),
      l: acc.l + (ts.losses || 0),
      t: acc.t + (ts.ties || 0),
      pf: acc.pf + (ts.points_for || 0),
      pa: acc.pa + (ts.points_against || 0),
    }),
    { w: 0, l: 0, t: 0, pf: 0, pa: 0 }
  );

  const totalGames = allTimeRecord.w + allTimeRecord.l + allTimeRecord.t;
  const winPct = totalGames > 0 ? ((allTimeRecord.w / totalGames) * 100).toFixed(1) : null;

  // School colors from MaxPreps data
  const colors = school.colors as { primary?: string; secondary?: string } | null;
  const primaryColor = colors?.primary || meta.color;
  const secondaryColor = colors?.secondary || "#222";

  // Pro players (players with college or pro_team)
  const proPlayers = players.filter((p: any) => p.pro_team || p.college);
  const collegePlayers = players.filter((p: any) => p.college && !p.pro_team);

  return (
    <>
      {/* ═══════════════════════ HERO HEADER ═══════════════════════ */}
      <section
        className="py-10 md:py-14"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 40%, ${secondaryColor}aa 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: meta.name, href: `/${sport}` },
              { label: "Schools", href: "/schools" },
              { label: school.short_name || school.name },
            ]}
          />

          <div className="flex items-start gap-5 mt-4">
            {/* School logo or fallback */}
            {school.logo_url ? (
              <div
                className="flex-shrink-0 rounded-2xl overflow-hidden flex items-center justify-center"
                style={{
                  width: 88,
                  height: 88,
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <img
                  src={school.logo_url}
                  alt={`${school.name} logo`}
                  width={72}
                  height={72}
                  style={{ objectFit: "contain" }}
                />
              </div>
            ) : (
              <div
                className="flex-shrink-0 rounded-2xl flex items-center justify-center text-3xl"
                style={{
                  width: 88,
                  height: 88,
                  background: "rgba(255,255,255,0.12)",
                  fontFamily: "Bebas Neue, sans-serif",
                  color: "#fff",
                  letterSpacing: 2,
                }}
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
              {school.mascot && (
                <div
                  className="text-lg md:text-xl mb-2"
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    color: "rgba(255,255,255,0.85)",
                    letterSpacing: 1,
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  }}
                >
                  {school.mascot}
                </div>
              )}
              <div className="flex flex-wrap gap-3 text-sm">
                {school.leagues && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "rgba(240,165,0,0.25)", color: "#f0a500" }}>
                    {(school as any).leagues?.name}
                  </span>
                )}
                <span className="text-white/70">{school.city}, {school.state}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
                  {meta.emoji} {meta.name}
                </span>
                {school.closed_year && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/30 text-red-300">
                    Closed {school.closed_year}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ═══ Stat Bar ═══ */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8 max-w-3xl">
            <StatCard label="All-Time Record" value={totalGames > 0 ? `${allTimeRecord.w}-${allTimeRecord.l}${allTimeRecord.t > 0 ? `-${allTimeRecord.t}` : ""}` : "—"} />
            <StatCard label="Championships" value={String(championships.length)} highlight={championships.length > 0} />
            <StatCard label="Seasons" value={String(teamSeasons.length)} />
            <StatCard label="Win %" value={winPct ? `${winPct}%` : "—"} highlight={Number(winPct) >= 60} />
            <StatCard label="Players" value={String(players.length)} />
          </div>
        </div>
      </section>

      <PSPPromo size="banner" variant={1} />

      {/* ═══════════════════════ MAIN CONTENT ═══════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ═══ Left Column ═══ */}
          <div className="lg:col-span-2 space-y-8">

            {/* Recent Games */}
            {recentGames.length > 0 && (
              <SectionCard title="Recent Games" count={recentGames.length}>
                <div className="overflow-x-auto">
                  <table className="data-table w-full">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Opponent</th>
                        <th className="text-center">Result</th>
                        <th className="text-center">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentGames.map((g: any) => {
                        const isHome = g.home_school_id === school.id;
                        const opp = isHome ? g.away_school : g.home_school;
                        const ourScore = isHome ? g.home_score : g.away_score;
                        const theirScore = isHome ? g.away_score : g.home_score;
                        const won = ourScore != null && theirScore != null ? ourScore > theirScore : null;
                        return (
                          <tr key={g.id}>
                            <td className="text-xs text-gray-500">{g.game_date ? new Date(g.game_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : g.seasons?.label || "—"}</td>
                            <td className="text-sm">
                              <span className="text-xs text-gray-400 mr-1">{isHome ? "vs" : "@"}</span>
                              {opp ? (
                                <Link href={`/${sport}/schools/${opp.slug}`} className="hover:underline" style={{ color: "var(--psp-blue, #3b82f6)" }}>
                                  {opp.name}
                                </Link>
                              ) : "—"}
                            </td>
                            <td className="text-center">
                              {won !== null && (
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${won ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                  {won ? "W" : "L"}
                                </span>
                              )}
                            </td>
                            <td className="text-center text-sm font-medium">
                              {ourScore != null ? `${ourScore}-${theirScore}` : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            )}

            {/* Championships */}
            {championships.length > 0 && (
              <SectionCard title="Championships" count={championships.length}>
                <div className="space-y-2">
                  {championships.map((c: any) => (
                    <div key={c.id} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: "var(--card-bg)", border: "1px solid var(--g100)" }}>
                      <span className="text-xl">🏆</span>
                      <div className="flex-1">
                        <span className="font-medium text-sm" style={{ color: "var(--text)" }}>
                          {c.seasons?.label}
                        </span>
                        <span className="text-xs ml-2" style={{ color: "var(--g400)" }}>
                          {c.level}{c.leagues?.name ? ` — ${c.leagues.name}` : ""}
                        </span>
                        {c.score && (
                          <span className="text-xs ml-2" style={{ color: "var(--g300)" }}>
                            ({c.score})
                          </span>
                        )}
                        {c.opponent && (
                          <span className="text-xs ml-1" style={{ color: "var(--g400)" }}>
                            vs {(c.opponent as any)?.name}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Notable Players */}
            {players.length > 0 && (
              <SectionCard title={`Notable ${meta.name} Players`} count={players.length}>
                <div className="overflow-x-auto">
                  <table className="data-table w-full">
                    <thead>
                      <tr>
                        <th>Player</th>
                        <th>Pos</th>
                        <th>Years</th>
                        {sport === "football" && (
                          <>
                            <th className="text-right">Rush Yds</th>
                            <th className="text-right">Pass Yds</th>
                            <th className="text-right">TDs</th>
                          </>
                        )}
                        {sport === "basketball" && (
                          <>
                            <th className="text-right">Points</th>
                            <th className="text-right">PPG</th>
                          </>
                        )}
                        <th>Next Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((p: any) => (
                        <tr key={p.id}>
                          <td className="font-medium">
                            <Link href={`/${sport}/players/${p.slug}`} className="hover:underline" style={{ color: "var(--psp-blue, #3b82f6)" }}>
                              {p.name}
                            </Link>
                          </td>
                          <td className="text-xs text-gray-500">{(Array.isArray(p.positions) ? p.positions.join(", ") : p.positions) || "—"}</td>
                          <td className="text-xs text-gray-500">
                            {p.years?.length > 0 ? (
                              p.years.length > 2
                                ? `${p.years[p.years.length - 1]}–${p.years[0]}`
                                : p.years.join(", ")
                            ) : "—"}
                          </td>
                          {sport === "football" && (
                            <>
                              <td className="text-right text-sm">{p.total_stats.rush_yards || "—"}</td>
                              <td className="text-right text-sm">{p.total_stats.pass_yards || "—"}</td>
                              <td className="text-right text-sm font-bold" style={{ color: (p.total_stats.total_td || 0) > 10 ? "var(--psp-gold)" : "inherit" }}>
                                {p.total_stats.total_td || "—"}
                              </td>
                            </>
                          )}
                          {sport === "basketball" && (
                            <>
                              <td className="text-right text-sm">{p.total_stats.points?.toLocaleString() || "—"}</td>
                              <td className="text-right text-sm font-bold" style={{ color: (p.total_stats.ppg || 0) > 15 ? "var(--psp-gold)" : "inherit" }}>
                                {p.total_stats.ppg || "—"}
                              </td>
                            </>
                          )}
                          <td className="text-xs">
                            {p.pro_team ? (
                              <span className="px-1.5 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800 font-medium">{p.pro_team}</span>
                            ) : p.college ? (
                              <span className="text-gray-500">{p.college}</span>
                            ) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            )}

            {/* Awards */}
            {awards.length > 0 && (
              <SectionCard title="Awards & Honors" count={awards.length}>
                <div className="space-y-2">
                  {awards.map((a: any, i: number) => (
                    <div key={a.id || i} className="flex items-center gap-3 px-4 py-2 rounded-lg" style={{ background: "var(--card-bg)", border: "1px solid var(--g100)" }}>
                      <span className="text-lg">🏅</span>
                      <div className="flex-1">
                        <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                          {a.award_name || a.award_type || a.category || "Award"}
                        </span>
                        {a.position && (
                          <span className="text-xs ml-1" style={{ color: "var(--g400)" }}>({a.position})</span>
                        )}
                        {a.players && (
                          <Link href={`/${sport}/players/${a.players.slug}`} className="text-xs ml-2 hover:underline" style={{ color: "var(--psp-blue, #3b82f6)" }}>
                            {a.players.name}
                          </Link>
                        )}
                        <span className="text-xs ml-2" style={{ color: "var(--g400)" }}>
                          {a.seasons?.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Season-by-season results */}
            {teamSeasons.length > 0 && (
              <SectionCard title="Season-by-Season Results">
                <div className="overflow-x-auto">
                  <table className="data-table w-full">
                    <thead>
                      <tr>
                        <th>Season</th>
                        <th className="text-center">W</th>
                        <th className="text-center">L</th>
                        <th className="text-center">T</th>
                        <th className="text-center">PF</th>
                        <th className="text-center">PA</th>
                        <th>Playoff</th>
                        <th>Coach</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamSeasons.map((ts: any) => (
                        <tr key={ts.id}>
                          <td className="font-medium">
                            {ts.seasons?.label ? (
                              <Link
                                href={`/${sport}/teams/${slug}/${ts.seasons.label}`}
                                className="hover:underline"
                                style={{ color: "var(--psp-blue, #3b82f6)" }}
                              >
                                {ts.seasons.label}
                              </Link>
                            ) : "—"}
                          </td>
                          <td className="text-center">{ts.wins ?? "—"}</td>
                          <td className="text-center">{ts.losses ?? "—"}</td>
                          <td className="text-center">{ts.ties ?? "—"}</td>
                          <td className="text-center">{ts.points_for ?? "—"}</td>
                          <td className="text-center">{ts.points_against ?? "—"}</td>
                          <td className="text-xs">{ts.playoff_result || "—"}</td>
                          <td className="text-xs">
                            {ts.coaches ? (
                              <Link href={`/${sport}/coaches/${ts.coaches.slug}`} className="hover:underline" style={{ color: "var(--psp-gold)" }}>
                                {ts.coaches.name}
                              </Link>
                            ) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            )}
          </div>

          {/* ═══ Right Sidebar ═══ */}
          <div className="space-y-6">

            {/* School Info Card */}
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--g100)" }}>
              {/* Color header with logo */}
              <div
                className="p-4 flex items-center gap-3"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                {school.logo_url && (
                  <img src={school.logo_url} alt="" width={40} height={40} style={{ objectFit: "contain", borderRadius: 6 }} />
                )}
                <div>
                  <div className="text-white font-bold text-sm" style={{ fontFamily: "Bebas Neue, sans-serif", letterSpacing: 1 }}>
                    {school.short_name || school.name}
                  </div>
                  {school.mascot && <div className="text-white/80 text-xs">{school.mascot}</div>}
                </div>
              </div>

              <div className="p-4 space-y-3 text-sm" style={{ background: "var(--card-bg)" }}>
                <InfoRow label="Location" value={`${school.city}, ${school.state}`} />
                {school.leagues && <InfoRow label="League" value={(school as any).leagues?.name} />}
                {school.mascot && <InfoRow label="Mascot" value={school.mascot} />}
                {school.address && <InfoRow label="Address" value={school.address} />}
                {school.founded_year && <InfoRow label="Founded" value={String(school.founded_year)} />}
                {school.closed_year && <InfoRow label="Closed" value={String(school.closed_year)} />}

                {/* School Colors */}
                {colors && (
                  <div className="flex justify-between items-center">
                    <span style={{ color: "var(--g400)" }}>Colors</span>
                    <div className="flex gap-1.5">
                      {colors.primary && (
                        <div className="w-6 h-6 rounded" style={{ background: colors.primary, border: "1px solid var(--g200)" }} title={colors.primary} />
                      )}
                      {colors.secondary && (
                        <div className="w-6 h-6 rounded" style={{ background: colors.secondary, border: "1px solid var(--g200)" }} title={colors.secondary} />
                      )}
                    </div>
                  </div>
                )}

                {school.website_url && (
                  <div className="flex justify-between">
                    <span style={{ color: "var(--g400)" }}>Website</span>
                    <a href={school.website_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--psp-gold)" }}>
                      Visit →
                    </a>
                  </div>
                )}

                {/* All-time scoring */}
                {allTimeRecord.pf > 0 && (
                  <div className="pt-3 mt-3" style={{ borderTop: "1px solid var(--g100)" }}>
                    <div className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--g400)" }}>All-Time Scoring</div>
                    <div className="flex gap-4">
                      <div>
                        <div className="text-lg font-bold" style={{ fontFamily: "Bebas Neue, sans-serif", color: "var(--text)" }}>
                          {allTimeRecord.pf.toLocaleString()}
                        </div>
                        <div className="text-xs" style={{ color: "var(--g400)" }}>Points For</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold" style={{ fontFamily: "Bebas Neue, sans-serif", color: "var(--text)" }}>
                          {allTimeRecord.pa.toLocaleString()}
                        </div>
                        <div className="text-xs" style={{ color: "var(--g400)" }}>Points Against</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Next Level / Pro Alumni */}
            {proPlayers.length > 0 && (
              <div className="rounded-xl p-5" style={{ background: "var(--card-bg)", border: "1px solid var(--g100)" }}>
                <h3 className="font-bold text-xs uppercase tracking-wider mb-3" style={{ color: "var(--g400)" }}>
                  Next Level Alumni
                </h3>
                <div className="space-y-2">
                  {proPlayers.slice(0, 8).map((p: any) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <Link href={`/${sport}/players/${p.slug}`} className="text-sm font-medium hover:underline" style={{ color: "var(--psp-blue, #3b82f6)" }}>
                        {p.name}
                      </Link>
                      <span className="text-xs" style={{ color: "var(--g400)" }}>→</span>
                      <span className="text-xs" style={{ color: p.pro_team ? "var(--psp-gold)" : "var(--g400)" }}>
                        {p.pro_team || p.college}
                      </span>
                    </div>
                  ))}
                  {proPlayers.length > 8 && (
                    <div className="text-xs pt-1" style={{ color: "var(--g400)" }}>
                      +{proPlayers.length - 8} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="rounded-xl p-5" style={{ background: "var(--card-bg)", border: "1px solid var(--g100)" }}>
              <h3 className="font-bold text-xs uppercase tracking-wider mb-3" style={{ color: "var(--g400)" }}>
                Quick Links
              </h3>
              <div className="space-y-2">
                <Link href={`/${sport}/leaderboards/rushing?school=${slug}`} className="block text-sm py-1 hover:underline" style={{ color: "var(--text)" }}>
                  📊 {school.short_name || school.name} Stat Leaders
                </Link>
                <Link href={`/${sport}/championships`} className="block text-sm py-1 hover:underline" style={{ color: "var(--text)" }}>
                  🏆 All {meta.name} Championships
                </Link>
                <Link href={`/search?q=${encodeURIComponent(school.name)}`} className="block text-sm py-1 hover:underline" style={{ color: "var(--text)" }}>
                  🔍 Search {school.short_name || school.name} Players
                </Link>
                <Link href="/schools" className="block text-sm py-1 hover:underline" style={{ color: "var(--text)" }}>
                  🏫 All Schools Directory
                </Link>
              </div>
            </div>

            <RelatedArticles entityType="school" entityId={school.id} />

            <PSPPromo size="sidebar" variant={2} />
          </div>
        </div>
      </div>

      {/* Correction Form */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <CorrectionForm entityType="school" entityId={school.id} entityName={school.name} />
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SportsTeam",
            name: school.name,
            sport: meta.name,
            ...(school.logo_url && { logo: school.logo_url }),
            ...(school.mascot && { alternateName: `${school.name} ${school.mascot}` }),
            location: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressLocality: school.city,
                addressRegion: school.state,
                ...(school.address && { streetAddress: school.address }),
              },
            },
            url: `https://phillysportspack.com/${sport}/schools/${slug}`,
          }),
        }}
      />
    </>
  );
}

/* ─── Helper Components ─── */

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(4px)" }}>
      <div
        className="text-2xl font-bold"
        style={{
          fontFamily: "Bebas Neue, sans-serif",
          color: highlight ? "var(--psp-gold)" : "#fff",
        }}
      >
        {value}
      </div>
      <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{label}</div>
    </div>
  );
}

function SectionCard({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="text-2xl font-bold mb-4 flex items-center gap-2"
        style={{ fontFamily: "Bebas Neue, sans-serif", color: "var(--text)" }}
      >
        {title}
        {count !== undefined && count > 0 && (
          <span className="text-sm font-normal px-2 py-0.5 rounded-full" style={{ background: "var(--g100)", color: "var(--g400)" }}>
            {count}
          </span>
        )}
      </h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span style={{ color: "var(--g400)" }}>{label}</span>
      <span className="font-medium text-right" style={{ color: "var(--text)" }}>{value}</span>
    </div>
  );
}
