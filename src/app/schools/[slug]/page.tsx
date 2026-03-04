import { notFound } from "next/navigation";
import {
  getSchoolBySlug,
  getSchoolAllTeamSeasons,
  getSchoolChampionships,
  getSchoolAllPlayers,
  getSchoolAwards,
  getSchoolAllRecentGames,
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
  const school = await getSchoolBySlug(slug);
  if (!school) return {};
  const mascotStr = school.mascot ? ` ${school.mascot}` : "";
  return {
    title: `${school.name}${mascotStr} — PhillySportsPack`,
    description: `${school.name}${mascotStr} — season results, statistics, championships, roster, and notable alumni across all sports. ${school.city}, ${school.state}.`,
  };
}

export default async function SchoolProfilePage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const school = await getSchoolBySlug(slug);
  if (!school) notFound();

  const [teamSeasons, championships, players, awards, recentGames] = await Promise.all([
    getSchoolAllTeamSeasons(school.id),
    getSchoolChampionships(school.id),
    getSchoolAllPlayers(school.id),
    getSchoolAwards(school.id),
    getSchoolAllRecentGames(school.id),
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
  const activeSports = Array.from(sportSet).sort();

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

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Schools", href: "/schools" }, { label: school.name }]} />

      {/* ═══════════════ ESPN TEAM BANNER ═══════════════ */}
      <div
        className="team-banner"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${secondaryColor}aa 100%)`,
        }}
      >
        <div className="team-banner-inner">
          {/* Logo / Monogram */}
          {school.logo_url ? (
            <div className="team-logo">
              <img src={school.logo_url} alt={`${school.name} logo`} width={72} height={72} style={{ objectFit: "contain" }} />
            </div>
          ) : (
            <div className="team-logo team-monogram">
              {(school.short_name || school.name.charAt(0)).substring(0, 4)}
            </div>
          )}

          {/* Team Info */}
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

          {/* Stat Badges */}
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

      {/* ═══════════════ TABS + CONTENT ═══════════════ */}
      <SchoolProfileTabs
        school={school}
        activeSports={activeSports}
        allTimeRecord={allTimeRecord}
        winPct={winPct}
        primaryColor={primaryColor}
        sportName={(id: string) => (SPORT_META as any)[id]?.name || id.charAt(0).toUpperCase() + id.slice(1)}
        sportEmoji={(id: string) => (SPORT_META as any)[id]?.emoji || "🏅"}
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
