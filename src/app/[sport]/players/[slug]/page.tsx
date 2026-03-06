import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getPlayerBySlug, getFootballPlayerStats, getBasketballPlayerStats, getBaseballPlayerStats, getPlayerAwards } from "@/lib/data";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import CorrectionForm from "@/components/corrections/CorrectionForm";
import RelatedArticles from "@/components/articles/RelatedArticles";
import PlayerStatsTable from "./PlayerStatsTable";
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

  // Try the URL sport first, then check all sport stat tables for this player
  let stats: any[] = [];
  let detectedSport = sport;
  if (sport === "football") stats = await getFootballPlayerStats(player.id);
  else if (sport === "basketball") stats = await getBasketballPlayerStats(player.id);
  else if (sport === "baseball") stats = await getBaseballPlayerStats(player.id);

  // If no stats found for URL sport, try other sports (handle cross-sport URLs)
  if (stats.length === 0 && sport !== "football") {
    const fbStats = await getFootballPlayerStats(player.id);
    if (fbStats.length > 0) { stats = fbStats; detectedSport = "football"; }
  }
  if (stats.length === 0 && sport !== "basketball") {
    const bbStats = await getBasketballPlayerStats(player.id);
    if (bbStats.length > 0) { stats = bbStats; detectedSport = "basketball"; }
  }
  if (stats.length === 0 && sport !== "baseball") {
    const bsbStats = await getBaseballPlayerStats(player.id);
    if (bsbStats.length > 0) { stats = bsbStats; detectedSport = "baseball"; }
  }

  const awards = await getPlayerAwards(player.id);

  // Football career totals
  const footballTotals = detectedSport === "football" && stats.length > 0 ? {
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
  const basketballTotals = detectedSport === "basketball" && stats.length > 0 ? {
    points: stats.reduce((sum: number, s: any) => sum + (s.points || 0), 0),
    games: stats.reduce((sum: number, s: any) => sum + (s.games_played || 0), 0),
    rebounds: stats.reduce((sum: number, s: any) => sum + (s.rebounds || 0), 0),
    assists: stats.reduce((sum: number, s: any) => sum + (s.assists || 0), 0),
  } : null;

  const careerHighlights = footballTotals ? [
    { label: "Total Yards", value: footballTotals.totalYards.toLocaleString() },
    { label: "Total TDs", value: footballTotals.totalTd.toString() },
    { label: "Rush Yards", value: footballTotals.rushYards.toLocaleString() },
    { label: "Pass Yards", value: footballTotals.passYards.toLocaleString() },
  ] : basketballTotals ? [
    { label: "Career Points", value: basketballTotals.points.toLocaleString() },
    { label: "PPG", value: basketballTotals.games > 0 ? (basketballTotals.points / basketballTotals.games).toFixed(1) : "—" },
    { label: "Games", value: basketballTotals.games.toString() },
    { label: "Rebounds", value: basketballTotals.rebounds.toString() },
  ] : [];

  // Serialize stats for client component
  const serializedStats = stats.map((s: any) => ({
    id: s.id,
    season: s.seasons?.label || "—",
    school: s.schools?.name || "—",
    schoolSlug: s.schools?.slug || "",
    rush_yards: s.rush_yards, rush_td: s.rush_td, rush_carries: s.rush_carries,
    pass_yards: s.pass_yards, pass_td: s.pass_td, pass_comp: s.pass_comp, pass_att: s.pass_att, pass_int: s.pass_int,
    rec_yards: s.rec_yards, rec_td: s.rec_td, receptions: s.receptions,
    total_td: s.total_td, total_yards: s.total_yards,
    games_played: s.games_played, points: s.points, ppg: s.ppg,
    rebounds: s.rebounds, assists: s.assists, steals: s.steals, blocks: s.blocks,
  }));

  return (
    <>
      {/* ESPN-style player banner */}
      <section className="player-banner" style={{ "--sport-accent": meta.color } as React.CSSProperties}>
        <div className="pb-inner">
          <Breadcrumb items={[
            { label: meta.name, href: `/${sport}` },
            { label: "Players" },
            { label: player.name }
          ]} />

          <div className="pb-profile">
            <div className="pb-avatar">
              <span className="pb-avatar-emoji">👤</span>
              {player.pro_team && <span className="pb-pro-badge">PRO</span>}
            </div>
            <div className="pb-info">
              <h1 className="pb-name">{player.name}</h1>
              <div className="pb-meta">
                {player.schools && (
                  <Link href={`/schools/${(player as any).schools?.slug}`} className="pb-school">
                    {(player as any).schools?.name}
                  </Link>
                )}
                {player.positions && player.positions.length > 0 && (
                  <span className="pb-pos">{player.positions.join(" / ")}</span>
                )}
                {player.graduation_year && (
                  <span className="pb-class">Class of {player.graduation_year}</span>
                )}
              </div>
              <div className="pb-badges">
                {player.pro_team && (
                  <span className="pb-badge pb-badge-pro">⭐ {player.pro_team}</span>
                )}
                {player.college && (
                  <span className="pb-badge pb-badge-college">🎓 {player.college}</span>
                )}
                {player.is_multi_sport && (
                  <span className="pb-badge pb-badge-multi">🔄 Multi-Sport</span>
                )}
                {awards.length > 0 && (
                  <span className="pb-badge pb-badge-awards">🏅 {awards.length} Award{awards.length !== 1 ? "s" : ""}</span>
                )}
              </div>
            </div>
          </div>

          {/* Career stat highlights */}
          {careerHighlights.length > 0 && (
            <div className="pb-stats">
              {careerHighlights.map((s) => (
                <div key={s.label} className="pb-stat">
                  <div className="pb-stat-value">{s.value}</div>
                  <div className="pb-stat-label">{s.label}</div>
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
            {serializedStats.length > 0 && (
              <div>
                <h2 className="espn-section-head">Season-by-Season Stats</h2>
                <PlayerStatsTable sport={detectedSport} stats={serializedStats} />
              </div>
            )}

            {awards.length > 0 && (
              <div>
                <h2 className="espn-section-head">Honors &amp; Awards</h2>
                <div className="awards-grid">
                  {awards.map((a: any) => (
                    <div key={a.id} className="award-card">
                      <span className="award-icon">🏅</span>
                      <div className="award-info">
                        <span className="award-name">{a.award_name || a.award_type}</span>
                        <span className="award-detail">
                          {a.seasons?.label}{a.category ? ` · ${a.category}` : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {player.schools && (
              <div>
                <h2 className="espn-section-head">More from {(player as any).schools?.name}</h2>
                <Link href={`/schools/${(player as any).schools?.slug}`} className="btn-primary" style={{ display: "inline-block", padding: "10px 24px", borderRadius: 8 }}>
                  View all players →
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sidebar-widget">
              <h3 className="sw-head">Player Info</h3>
              <dl className="sw-dl">
                {player.primary_school_id && player.schools && (
                  <div className="sw-row"><dt>School</dt><dd><Link href={`/schools/${(player as any).schools?.slug}`} className="hover:underline" style={{ color: "var(--psp-navy)", fontWeight: 600 }}>{(player as any).schools?.name}</Link></dd></div>
                )}
                {player.positions && player.positions.length > 0 && (
                  <div className="sw-row"><dt>Position</dt><dd>{player.positions.join(", ")}</dd></div>
                )}
                {player.graduation_year && (
                  <div className="sw-row"><dt>Class</dt><dd>{player.graduation_year}</dd></div>
                )}
                {player.height && (
                  <div className="sw-row"><dt>Height</dt><dd>{player.height}</dd></div>
                )}
              </dl>
            </div>

            <PSPPromo size="sidebar" variant={4} />

            {(player.college || player.pro_team) && (
              <div className="sidebar-widget">
                <h3 className="sw-head">Next Level</h3>
                <dl className="sw-dl">
                  {player.college && <div className="sw-row"><dt>College</dt><dd>{player.college}</dd></div>}
                  {player.pro_team && <div className="sw-row"><dt>Pro Team</dt><dd style={{ color: "var(--psp-gold)", fontWeight: 700 }}>{player.pro_team}</dd></div>}
                  {player.pro_draft_info && <div className="sw-row"><dt>Draft</dt><dd style={{ fontSize: "0.75rem" }}>{player.pro_draft_info}</dd></div>}
                </dl>
              </div>
            )}

            <RelatedArticles entityType="player" entityId={player.id} />
            <PSPPromo size="sidebar" variant={3} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-4">
        <CorrectionForm entityType="player" entityId={player.id} entityName={player.name} />
      </div>

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
