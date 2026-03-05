import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  getSchoolBySlug,
  getSchoolAllTeamSeasons,
  getSchoolChampionships,
  getSchoolAllPlayers,
  getSchoolAwards,
  getSchoolAllRecentGames,
  getSchoolCoaches,
  getActiveSportsBySchool,
  getArticlesForEntity,
  SPORT_META,
} from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import CorrectionForm from "@/components/corrections/CorrectionForm";
import SchoolProfileTabs from "@/components/school/SchoolProfileTabs";
import type { Metadata } from "next";

export const revalidate = 86400;

type PageParams = { slug: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug } = await params;
  let school = await getSchoolBySlug(slug);
  if (!school && slug.endsWith("-hs")) {
    school = await getSchoolBySlug(slug.replace(/-hs$/, ""));
  }
  if (!school) return {};
  const mascotStr = school.mascot ? ` ${school.mascot}` : "";
  return {
    title: `${school.name}${mascotStr} — PhillySportsPack`,
    description: `${school.name}${mascotStr} — season results, statistics, championships, roster, and notable alumni across all sports. ${school.city}, ${school.state}.`,
  };
}

export default async function SchoolProfilePage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  let school = await getSchoolBySlug(slug);

  if (!school && slug.endsWith("-hs")) {
    const canonicalSlug = slug.replace(/-hs$/, "");
    const canonicalSchool = await getSchoolBySlug(canonicalSlug);
    if (canonicalSchool) {
      redirect(`/schools/${canonicalSlug}`);
    }
  }

  if (!school) notFound();

  const [teamSeasons, championships, players, awards, recentGames, coachingStints, activeSportsData, schoolArticles] = await Promise.all([
    getSchoolAllTeamSeasons(school.id),
    getSchoolChampionships(school.id),
    getSchoolAllPlayers(school.id),
    getSchoolAwards(school.id),
    getSchoolAllRecentGames(school.id),
    getSchoolCoaches(school.id),
    getActiveSportsBySchool(school.id),
    getArticlesForEntity("school", school.id, 20),
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

  // Colors
  const colors = school.colors as { primary?: string; secondary?: string } | null;
  const primaryColor = colors?.primary || "#0a1628";
  const secondaryColor = colors?.secondary || "#222";

  // Active sports
  const sportSet = new Set<string>();
  teamSeasons.forEach((ts: any) => { if (ts.sport_id) sportSet.add(ts.sport_id); });
  championships.forEach((c: any) => { if (c.sport_id) sportSet.add(c.sport_id); });
  // Sort: Football → Basketball → Baseball first, then remaining alphabetically
  const SPORT_PRIORITY: Record<string, number> = { football: 0, basketball: 1, baseball: 2 };
  const activeSports = Array.from(sportSet).sort((a, b) => {
    const pa = SPORT_PRIORITY[a] ?? 99;
    const pb = SPORT_PRIORITY[b] ?? 99;
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b);
  });

  // Group data by sport
  const gamesBySport: Record<string, any[]> = {};
  const champsBySport: Record<string, any[]> = {};
  const playersBySport: Record<string, any[]> = {};
  const seasonsBySport: Record<string, any[]> = {};

  recentGames.forEach((g: any) => {
    const sid = g.sport_id || "other";
    if (!gamesBySport[sid]) gamesBySport[sid] = [];
    gamesBySport[sid].push(g);
  });
  championships.forEach((c: any) => {
    const sid = c.sport_id || "other";
    if (!champsBySport[sid]) champsBySport[sid] = [];
    champsBySport[sid].push(c);
  });
  players.forEach((p: any) => {
    const sid = p.sport || "other";
    if (!playersBySport[sid]) playersBySport[sid] = [];
    playersBySport[sid].push(p);
  });
  teamSeasons.forEach((ts: any) => {
    const sid = ts.sport_id || "other";
    if (!seasonsBySport[sid]) seasonsBySport[sid] = [];
    seasonsBySport[sid].push(ts);
  });

  const proPlayers = players.filter((p: any) => p.pro_team || p.college);

  // Sport meta for client
  const sportMeta: Record<string, any> = {};
  for (const sid of activeSports) {
    sportMeta[sid] = (SPORT_META as any)[sid] || { name: sid, emoji: "🏅", color: "#666" };
  }

  // Build sport cards data for the team pages section
  const sportCardsData = activeSports.map((sid) => {
    const meta = (SPORT_META as any)[sid] || { name: sid, emoji: "🏅", color: "#666" };
    // Find most recent team season for this sport
    const sportSeasons = seasonsBySport[sid] || [];
    const latest = sportSeasons[0]; // already sorted desc
    const sportChamps = champsBySport[sid] || [];
    // Find active coach from coaching stints
    const coachStint = (coachingStints as any[]).find(
      (cs: any) => cs.sports?.id === sid && !cs.end_year
    );
    return {
      sportId: sid,
      name: meta.name,
      emoji: meta.emoji,
      color: meta.color,
      latestRecord: latest ? `${latest.wins || 0}-${latest.losses || 0}${latest.ties ? `-${latest.ties}` : ""}` : null,
      latestSeason: latest?.seasons?.label || null,
      championships: sportChamps.length,
      coach: coachStint?.coaches ? { name: coachStint.coaches.name, slug: coachStint.coaches.slug } : null,
      coachSport: sid,
    };
  });

  // Unique coaches from stints
  const uniqueCoaches = new Map<number, any>();
  (coachingStints as any[]).forEach((cs: any) => {
    if (cs.coaches && !uniqueCoaches.has(cs.coaches.id)) {
      uniqueCoaches.set(cs.coaches.id, {
        ...cs.coaches,
        sport: cs.sports?.name || cs.sport_id,
        sportId: cs.sport_id,
        role: cs.role,
        startYear: cs.start_year,
        endYear: cs.end_year,
        record: `${cs.record_wins || 0}-${cs.record_losses || 0}${cs.record_ties ? `-${cs.record_ties}` : ""}`,
        championships: cs.championships || 0,
      });
    }
  });
  const coaches = Array.from(uniqueCoaches.values());

  return (
    <>
      <Breadcrumb items={[{ label: "Schools", href: "/schools" }, { label: school.name }]} />

      {/* TEAM BANNER */}
      <div
        className="team-banner"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${secondaryColor}aa 100%)`,
        }}
      >
        <div className="team-banner-inner">
          {school.logo_url ? (
            <div className="team-logo">
              <img src={school.logo_url} alt={`${school.name} logo`} width={72} height={72} style={{ objectFit: "contain" }} />
            </div>
          ) : (
            <div className="team-logo team-monogram">
              {(school.short_name || school.name.charAt(0)).substring(0, 4)}
            </div>
          )}

          <div className="team-info">
            <h1>{school.name}</h1>
            <div className="team-sub">
              {school.mascot && <span>{school.mascot}</span>}
              {school.leagues && <span className="team-league">{(school as any).leagues?.name}</span>}
              <span>{school.city}, {school.state}</span>
              {activeSports.map(sid => (
                <span key={sid} className="team-sport-badge">
                  {(SPORT_META as any)[sid]?.emoji || "🏅"} {(SPORT_META as any)[sid]?.name || sid}
                </span>
              ))}
            </div>
          </div>

          <div className="team-stats">
            <div className="team-stat">
              <span className="ts-val">
                {totalGames > 0 ? `${allTimeRecord.w}-${allTimeRecord.l}${allTimeRecord.t > 0 ? `-${allTimeRecord.t}` : ""}` : "—"}
              </span>
              <span className="ts-label">All-Time</span>
            </div>
            <div className="team-stat">
              <span className="ts-val" style={{ color: championships.length > 0 ? "var(--psp-gold)" : undefined }}>
                {championships.length}
              </span>
              <span className="ts-label">Titles</span>
            </div>
            <div className="team-stat">
              <span className="ts-val">{winPct ? `${winPct}%` : "—"}</span>
              <span className="ts-label">Win %</span>
            </div>
            <div className="team-stat">
              <span className="ts-val">{players.length}</span>
              <span className="ts-label">Players</span>
            </div>
          </div>
        </div>
      </div>

      {/* SCHOOL INFO BAR */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 16px" }}>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 16, padding: "12px 16px",
          background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8,
          fontSize: 13, color: "var(--text)",
        }}>
          {(school as any).principal && (
            <div><span style={{ color: "var(--g400)", fontSize: 11 }}>Principal:</span> {(school as any).principal}</div>
          )}
          {(school as any).athletic_director && (
            <div>
              <span style={{ color: "var(--g400)", fontSize: 11 }}>AD:</span> {(school as any).athletic_director}
              {(school as any).athletic_director_email && (
                <a href={`mailto:${(school as any).athletic_director_email}`} style={{ marginLeft: 4, color: "var(--psp-blue)", fontSize: 11 }}>
                  (email)
                </a>
              )}
            </div>
          )}
          {(school as any).phone && (
            <div><span style={{ color: "var(--g400)", fontSize: 11 }}>Phone:</span> {(school as any).phone}</div>
          )}
          {(school as any).enrollment && (
            <div><span style={{ color: "var(--g400)", fontSize: 11 }}>Enrollment:</span> {(school as any).enrollment.toLocaleString()}</div>
          )}
          {(school as any).school_type && (
            <div>
              <span style={{
                fontSize: 11, padding: "2px 8px", borderRadius: 10,
                background: "var(--g100)", color: "var(--text)", textTransform: "capitalize",
              }}>
                {(school as any).school_type}
              </span>
            </div>
          )}
          {school.website_url && (
            <div>
              <a href={school.website_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--psp-blue)", fontSize: 12 }}>
                Website &#8599;
              </a>
            </div>
          )}
        </div>
      </div>

      {/* SPORT TEAM CARDS — Major Sports First */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px 16px" }}>
        <h2 style={{ fontSize: 18, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, textTransform: "uppercase", marginBottom: 12, color: "var(--text)" }}>
          Team Pages
        </h2>

        {/* Major Sports: Football, Basketball, Baseball — always shown */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 16 }}>
          {(["football", "basketball", "baseball"] as const).map((sid) => {
            const sc = sportCardsData.find((s) => s.sportId === sid);
            const sMeta = (SPORT_META as any)[sid] || { name: sid, emoji: "🏅", color: "#666" };
            const hasData = !!sc;

            return (
              <Link
                key={sid}
                href={`/schools/${slug}/${sid}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    background: "var(--card-bg)",
                    border: hasData ? "1px solid var(--g100)" : "1px dashed var(--g200)",
                    borderRadius: 8,
                    overflow: "hidden",
                    transition: "transform .15s, box-shadow .15s",
                    cursor: "pointer",
                    opacity: hasData ? 1 : 0.7,
                    height: "100%",
                  }}
                  className="school-card"
                >
                  <div style={{
                    padding: "12px 16px",
                    background: hasData ? sMeta.color : "var(--g100)",
                    color: hasData ? "#fff" : "var(--g400)",
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <span style={{ fontSize: 26 }}>{sMeta.emoji}</span>
                    <span style={{ fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18 }}>{sMeta.name}</span>
                  </div>
                  <div style={{ padding: "12px 16px" }}>
                    {sc?.latestRecord ? (
                      <>
                        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", color: "var(--text)" }}>
                          {sc.latestRecord}
                          <span style={{ fontSize: 11, fontWeight: 400, color: "var(--g400)", marginLeft: 6 }}>{sc.latestSeason}</span>
                        </div>
                        {sc.coach && (
                          <div style={{ fontSize: 12, color: "var(--g400)", marginTop: 4 }}>
                            Coach: {sc.coach.name}
                          </div>
                        )}
                        {sc.championships > 0 && (
                          <div style={{ fontSize: 12, color: "var(--psp-gold)", marginTop: 2 }}>
                            {sc.championships} championship{sc.championships !== 1 ? "s" : ""}
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ fontSize: 13, color: "var(--g400)", fontStyle: "italic", textAlign: "center", padding: "4px 0" }}>
                        Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Minor Sports: Flag Football, Girls Basketball, Track & Field, Lacrosse, Wrestling, Soccer */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {(["flag-football", "girls-basketball", "track-field", "lacrosse", "wrestling", "soccer"] as const).map((sid) => {
            const sc = sportCardsData.find((s) => s.sportId === sid);
            const sMeta = (SPORT_META as any)[sid] || { name: sid, emoji: "🏅", color: "#666" };
            const hasData = !!sc;

            return (
              <Link
                key={sid}
                href={`/schools/${slug}/${sid}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    background: "var(--card-bg)",
                    border: hasData ? "1px solid var(--g100)" : "1px dashed var(--g200)",
                    borderRadius: 8,
                    overflow: "hidden",
                    transition: "transform .15s",
                    cursor: "pointer",
                    opacity: hasData ? 1 : 0.6,
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px",
                  }}
                  className="school-card"
                >
                  <span style={{ fontSize: 20 }}>{sMeta.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, color: "var(--text)" }}>
                      {sMeta.name}
                    </div>
                    {sc?.latestRecord ? (
                      <div style={{ fontSize: 12, color: "var(--g400)" }}>
                        {sc.latestRecord} {sc.latestSeason && `(${sc.latestSeason})`}
                        {sc.championships > 0 && <span style={{ color: "var(--psp-gold)", marginLeft: 6 }}>{sc.championships}×🏆</span>}
                      </div>
                    ) : (
                      <div style={{ fontSize: 11, color: "var(--g400)", fontStyle: "italic" }}>Coming Soon</div>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: "var(--g300)" }}>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* COACHES SECTION */}
      {coaches.length > 0 && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px 16px" }}>
          <h2 style={{ fontSize: 18, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, textTransform: "uppercase", marginBottom: 12, color: "var(--text)" }}>
            Coaches
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
            {coaches.map((coach: any) => (
              <Link
                key={coach.id}
                href={`/${coach.sportId || "football"}/coaches/${coach.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                  background: "var(--card-bg)", border: "1px solid var(--g100)", borderRadius: 8,
                  transition: "transform .15s", cursor: "pointer",
                }}
                className="school-card"
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", background: "var(--g100)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: "var(--g400)", flexShrink: 0,
                  }}>
                    {coach.name?.charAt(0)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{coach.name}</div>
                    <div style={{ fontSize: 11, color: "var(--g400)" }}>
                      {coach.sport} {coach.role === "head_coach" ? "Head Coach" : coach.role || ""} {coach.startYear ? `(${coach.startYear}${coach.endYear ? `-${coach.endYear}` : "-present"})` : ""}
                    </div>
                    {coach.record && coach.record !== "0-0" && (
                      <div style={{ fontSize: 11, color: "var(--g300)" }}>Record: {coach.record}</div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* TABS + CONTENT */}
      <SchoolProfileTabs
        school={school}
        activeSports={activeSports}
        allTimeRecord={allTimeRecord}
        winPct={winPct}
        primaryColor={primaryColor}
        sportMeta={sportMeta}
        gamesBySport={gamesBySport}
        champsBySport={champsBySport}
        playersBySport={playersBySport}
        seasonsBySport={seasonsBySport}
        awards={awards}
        proPlayers={proPlayers}
        championships={championships}
        players={players}
        teamSeasons={teamSeasons}
        recentGames={recentGames}
        articles={schoolArticles}
      />

      {/* Correction Form */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px 16px" }}>
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
            url: `https://phillysportspack.com/schools/${slug}`,
          }),
        }}
      />
    </>
  );
}
