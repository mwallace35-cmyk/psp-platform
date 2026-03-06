import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSchoolBySlug,
  getAllTeamSeasonData,
  getSchoolCoaches,
  getActiveSportsBySchool,
  getLeagueTeams,
  getTopProgramsBySport,
  getSchoolChampionships,
  getSchoolAwards,
  getSchoolNotableAlumni,
  getSchoolSeasonSummaries,
  getSchoolPlayers,
  SPORT_META,
  VALID_SPORTS,
  isValidSport,
} from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import TeamPageTabs from "@/components/school/TeamPageTabs";
import PSPPromo from "@/components/ads/PSPPromo";
import type { Metadata } from "next";

export const revalidate = 3600;

type PageParams = { slug: string; sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug, sport } = await params;
  if (!isValidSport(sport)) return {};
  const school = await getSchoolBySlug(slug);
  if (!school) return {};
  const meta = (SPORT_META as any)[sport];
  return {
    title: `${school.name} ${meta?.name || sport} — PhillySportsPack`,
    description: `${school.name} ${meta?.name || sport} team page — schedule, roster, stats, awards, and season history.`,
  };
}

export default async function TeamProfilePage({ params }: { params: Promise<PageParams> }) {
  const { slug, sport } = await params;
  if (!isValidSport(sport)) notFound();

  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const meta = (SPORT_META as any)[sport];
  if (!meta) notFound();

  // Fetch all season data + sidebar data + program data in parallel
  const [seasonsData, coaches, activeSports, leagueTeams, topPrograms, allChamps, allAwards, notableAlumni, seasonSummaries, topPlayers] = await Promise.all([
    getAllTeamSeasonData(school.id, sport),
    getSchoolCoaches(school.id),
    getActiveSportsBySchool(school.id),
    getLeagueTeams(school.league_id, sport, school.id, 8),
    getTopProgramsBySport(sport, school.id, 6),
    getSchoolChampionships(school.id, sport),
    getSchoolAwards(school.id, sport),
    getSchoolNotableAlumni(school.id, sport, 15),
    getSchoolSeasonSummaries(school.id, sport),
    getSchoolPlayers(school.id, sport, 30),
  ]);

  const seasonLabels = Object.keys(seasonsData).sort((a, b) => {
    // Sort by year descending (e.g., "2024-25" > "2023-24")
    const aYear = parseInt(a.split("-")[0]) || 0;
    const bYear = parseInt(b.split("-")[0]) || 0;
    return bYear - aYear;
  });

  const hasData = seasonLabels.length > 0;
  const latestSeason = hasData ? seasonsData[seasonLabels[0]]?.teamSeason : null;

  // Current coach for this sport
  const sportCoaches = (coaches as any[]).filter((c: any) => {
    const sportId = c.sports?.id || c.sport_id;
    return sportId === sport && !c.end_year;
  });
  const currentCoach = sportCoaches[0];

  // School colors
  const schoolColors = school.colors as string[] | null;
  const primaryColor = schoolColors?.[0] || meta.color;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Schools", href: "/schools" },
          { label: school.short_name || school.name, href: `/schools/${slug}` },
          { label: meta.name },
        ]}
      />

      {/* Team Banner — MaxPreps Style */}
      <div
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, var(--psp-navy) 100%)`,
          padding: "24px 20px",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div
              style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, border: "2px solid rgba(255,255,255,0.3)", flexShrink: 0,
              }}
            >
              {meta.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, opacity: 0.8, fontWeight: 500, letterSpacing: 0.5 }}>
                {school.name}{school.mascot ? ` ${school.mascot}` : ""}
              </div>
              <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, margin: "2px 0 0", letterSpacing: 0.5 }}>
                Varsity {meta.name}
              </h1>
              <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                {school.leagues?.name && (
                  <span>{(school.leagues as any).name}</span>
                )}
                {school.city && <span>{school.city}, {school.state || "PA"}</span>}
                {currentCoach && (
                  <span>
                    Coach:{" "}
                    <Link
                      href={`/${sport}/coaches/${currentCoach.coaches?.slug}`}
                      style={{ color: "var(--psp-gold)", textDecoration: "none" }}
                    >
                      {currentCoach.coaches?.name}
                    </Link>
                  </span>
                )}
              </div>
            </div>
            {/* Quick stats — MaxPreps style */}
            {hasData && latestSeason && (
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, opacity: 0.6, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Overall</div>
                  <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {latestSeason.wins}-{latestSeason.losses}{latestSeason.ties ? `-${latestSeason.ties}` : ""}
                  </div>
                </div>
                {latestSeason.league_wins != null && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, opacity: 0.6, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Conference</div>
                    <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {latestSeason.league_wins}-{latestSeason.league_losses || 0}{latestSeason.league_ties ? `-${latestSeason.league_ties}` : ""}
                      {latestSeason.league_finish && (
                        <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.7, marginLeft: 4 }}>
                          ({latestSeason.league_finish})
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, opacity: 0.6, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Titles</div>
                  <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", color: "var(--psp-gold)" }}>
                    {allChamps.length}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, opacity: 0.6, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Seasons</div>
                  <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {seasonLabels.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content: Tabs + Sidebar layout */}
      {hasData ? (
        <>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
              {/* Main: Tabs */}
              <div>
                <TeamPageTabs
                  schoolSlug={slug}
                  sportId={sport}
                  sportName={meta.name}
                  sportEmoji={meta.emoji}
                  sportColor={meta.color}
                  seasonLabels={seasonLabels}
                  seasonsData={seasonsData}
                  allChamps={allChamps}
                  allAwards={allAwards}
                  notableAlumni={notableAlumni}
                  seasonSummaries={seasonSummaries}
                  topPlayers={topPlayers}
                />
              </div>

              {/* Sidebar */}
              <aside style={{ paddingTop: 8 }}>
                {/* Coach Card */}
                {currentCoach && (
                  <div className="widget" style={{ marginBottom: 16 }}>
                    <div className="w-head">Head Coach</div>
                    <div className="w-body" style={{ padding: 12 }}>
                      <Link
                        href={`/${sport}/coaches/${currentCoach.coaches?.slug}`}
                        style={{ fontWeight: 700, fontSize: 15, color: "var(--psp-blue)", textDecoration: "none", display: "block", marginBottom: 4 }}
                      >
                        {currentCoach.coaches?.name}
                      </Link>
                      <div style={{ fontSize: 12, color: "var(--g400)" }}>
                        Since {currentCoach.start_year}
                        {currentCoach.record_wins != null && (
                          <> · {currentCoach.record_wins}-{currentCoach.record_losses}{currentCoach.record_ties ? `-${currentCoach.record_ties}` : ""}</>
                        )}
                        {currentCoach.championships > 0 && (
                          <span style={{ color: "var(--psp-gold)", marginLeft: 4 }}> · {currentCoach.championships} titles</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Other [Sport] Teams — Rivals first */}
                {(leagueTeams.length > 0 || topPrograms.length > 0) && (
                  <div className="widget" style={{ marginBottom: 16 }}>
                    <div className="w-head">{meta.name} Teams</div>
                    <div className="w-body">
                      {leagueTeams.length > 0 && (
                        <>
                          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--g400)", padding: "4px 0", letterSpacing: 0.5 }}>
                            League
                          </div>
                          {leagueTeams.map((team: any) => (
                            <Link key={team.id} href={`/schools/${team.slug}/${sport}`} className="w-link" style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>{team.name}</span>
                              {team.latestRecord && <span style={{ fontSize: 11, color: "var(--g400)" }}>{team.latestRecord}</span>}
                            </Link>
                          ))}
                        </>
                      )}
                      {topPrograms.length > 0 && (
                        <>
                          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--g400)", padding: "8px 0 4px", letterSpacing: 0.5, borderTop: leagueTeams.length > 0 ? "1px solid var(--g100)" : "none", marginTop: leagueTeams.length > 0 ? 8 : 0 }}>
                            Top Programs
                          </div>
                          {topPrograms.map((team: any) => (
                            <Link key={team.id} href={`/schools/${team.slug}/${sport}`} className="w-link" style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>{team.name}</span>
                              <span style={{ fontSize: 11, color: "var(--psp-gold)" }}>{team.championships} titles</span>
                            </Link>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                )}

                <PSPPromo size="sidebar" variant={2} />

                {/* Other Sports at [School] — compact */}
                <div style={{
                  marginBottom: 16, padding: "10px 12px",
                  background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--g400)", letterSpacing: 0.5, marginBottom: 6 }}>
                    Other Sports at {school.short_name || school.name}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {VALID_SPORTS.map((sid) => {
                      if (sid === sport) return null;
                      const sMeta = (SPORT_META as any)[sid];
                      if (!sMeta) return null;
                      const sportData = (activeSports as any[]).find((as: any) => as.sport_id === sid);
                      return (
                        <Link
                          key={sid}
                          href={`/schools/${slug}/${sid}`}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            padding: "4px 10px", borderRadius: 20,
                            background: "var(--g50, rgba(0,0,0,0.03))", border: "1px solid var(--g100)",
                            fontSize: 12, color: "var(--text)", textDecoration: "none",
                            whiteSpace: "nowrap", transition: "background .15s",
                          }}
                        >
                          <span>{sMeta.emoji}</span>
                          <span>{sMeta.name}</span>
                          {sportData && (
                            <span style={{ fontSize: 10, color: "var(--g400)" }}>{sportData.wins}-{sportData.losses}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </>
      ) : (
        /* Coming Soon State */
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>{meta.emoji}</div>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, color: "var(--text)", marginBottom: 8 }}>
                {school.name} {meta.name}
              </h2>
              <p style={{ color: "var(--g400)", fontSize: 14, marginBottom: 24 }}>
                No season data available yet. Check back soon or explore other sports.
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  href={`/schools/${slug}`}
                  style={{ padding: "10px 20px", borderRadius: 6, background: "var(--psp-navy)", color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 13 }}
                >
                  School Profile
                </Link>
                <Link
                  href={`/${sport}`}
                  style={{ padding: "10px 20px", borderRadius: 6, background: "var(--g100)", color: "var(--text)", textDecoration: "none", fontWeight: 600, fontSize: 13 }}
                >
                  {meta.name} Hub
                </Link>
              </div>
            </div>

            {/* Sidebar even on Coming Soon */}
            <aside>
              <div className="widget" style={{ marginBottom: 16 }}>
                <div className="w-head">{school.short_name || school.name}</div>
                <div className="w-body">
                  {VALID_SPORTS.map((sid) => {
                    if (sid === sport) return null;
                    const sMeta = (SPORT_META as any)[sid];
                    if (!sMeta) return null;
                    return (
                      <Link key={sid} href={`/schools/${slug}/${sid}`} className="w-link">
                        {sMeta.emoji} {sMeta.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <PSPPromo size="sidebar" variant={3} />
            </aside>
          </div>
        </div>
      )}

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
            memberOf: school.leagues ? { "@type": "SportsOrganization", name: (school.leagues as any).name } : undefined,
          }),
        }}
      />
    </>
  );
}
