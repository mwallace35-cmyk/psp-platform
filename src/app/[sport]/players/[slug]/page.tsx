import React from "react";
import Link from "next/link";
import nextDynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { SPORT_META, getPlayerBySlug, getFootballPlayerStats, getBasketballPlayerStats, getBaseballPlayerStats, getPlayerAwards, getPlayerGameLog, getPlayerTeamGames, getCrossSportPlayers, type Player, type FootballPlayerSeason, type BasketballPlayerSeason, type BaseballPlayerSeason, type Award, type PlayerGameLog, type TeamGame } from "@/lib/data";
import { Breadcrumb, SocialProfileBar, ClaimProfileButton } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import ShareButtons from "@/components/social/ShareButtons";
import { BreadcrumbJsonLd, PersonJsonLd } from "@/components/seo/JsonLd";
import RelatedArticles from "@/components/articles/RelatedArticles";
import { buildOgImageUrl } from "@/lib/og-utils";
import GameLogAccordion from "@/components/game-log/GameLogAccordion";
import DataSourceBadge from "@/components/ui/DataSourceBadge";
import MethodologyNote from "@/components/ui/MethodologyNote";
import PlayerHighlightsSection from "@/components/highlights/PlayerHighlightsSection";
import PlayerStatTable from "@/components/players/PlayerStatTable";
import PlayerProfileTabs from "@/components/players/PlayerProfileTabs";
import InTheNews from "@/components/players/InTheNews";
import type { MergedGameEntry, SeasonAward } from "@/components/game-log/GameLogAccordion";
import type { Metadata } from "next";

// Dynamic imports for heavy client components (below fold)
const CorrectionForm = nextDynamic(() => import("@/components/corrections/CorrectionForm"), {
  loading: () => <div className="text-center py-4 text-gray-500 text-sm">Loading form...</div>,
});

const CareerTrajectoryChart = nextDynamic(() => import("@/components/players/CareerTrajectoryChart"), {
  loading: () => <div className="w-full bg-white rounded-lg border border-gray-200 p-4 h-[340px] animate-pulse" />,
});

const SimilarPlayers = nextDynamic(() => import("@/components/player/SimilarPlayers"), {
  loading: () => <div className="bg-white rounded-lg border border-gray-200 p-6 h-64 animate-pulse" />,
});

export const revalidate = 86400; // ISR: daily
export const dynamic = "force-dynamic";export const dynamicParams = true; // Allow ISR for slugs not in generateStaticParams

type PageParams = { sport: string; slug: string };

/**
 * Pre-render a curated set of notable/high-traffic player profiles at build time.
 * All other players are generated on first request via ISR.
 * With 52,000+ players, generating all at build time is impractical.
 */
// Dynamic -- too many slug combos to pre-render
export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport, slug } = await params;
  const validSport = await validateSportParamForMetadata({ sport });
  if (!validSport) return {};
  const player = await getPlayerBySlug(slug);
  if (!player) return {};

  // Build dynamic description with actual stats
  const schoolName = Array.isArray(player.schools) && player.schools.length > 0 ? player.schools[0].name : (typeof player.schools === 'object' && player.schools !== null && 'name' in player.schools ? (player.schools as any).name : "a Philadelphia school");
  const school = schoolName || "a Philadelphia school";
  const classYear = player.graduation_year ? ` (Class of ${player.graduation_year})` : "";
  const description = `${player.name} career stats at ${school}${classYear}. Season-by-season breakdown, game log, awards, and honors on PhillySportsPack.com.`;

  const ogImageUrl = buildOgImageUrl({
    title: player.name,
    subtitle: `${SPORT_META[validSport].name} -- Career Profile`,
    sport: validSport,
    type: "player",
  });
  return {
    title: `${player.name} -- ${school} ${SPORT_META[validSport].name} -- PhillySportsPack`,
    description,
    alternates: {
      canonical: `https://phillysportspack.com/${validSport}/players/${slug}`,
    },
    openGraph: {
      title: `${player.name} -- ${school} ${SPORT_META[validSport].name} -- PhillySportsPack`,
      description,
      url: `https://phillysportspack.com/${validSport}/players/${slug}`,
      type: "profile",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${player.name} profile` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${player.name} -- ${school} ${SPORT_META[validSport].name} -- PhillySportsPack`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function PlayerCareerPage({ params }: { params: Promise<PageParams> }) {
  const sport = await validateSportParam(params);

  const { slug } = await params;
  const playerData = await getPlayerBySlug(slug);
  if (!playerData) notFound();

  const player = playerData as unknown as Player;
  const meta = SPORT_META[sport];

  // Fetch stats first (needed to derive season IDs for team games)
  const stats = await (
    sport === "football"
      ? getFootballPlayerStats(player.id) as unknown as Promise<FootballPlayerSeason[]>
      : sport === "basketball"
      ? getBasketballPlayerStats(player.id) as unknown as Promise<BasketballPlayerSeason[]>
      : sport === "baseball"
      ? getBaseballPlayerStats(player.id) as unknown as Promise<BaseballPlayerSeason[]>
      : Promise.resolve([])
  ) as (FootballPlayerSeason | BasketballPlayerSeason | BaseballPlayerSeason)[];

  // Extract season IDs from player stats for team game lookup
  const seasonIds = stats
    .map((s) => (s as { season_id?: number }).season_id)
    .filter((id): id is number => id != null);

  // Parallelize remaining fetches
  const [awards, gameLog, teamGames, crossSportPlayers, recruitingProfile] = await Promise.all([
    getPlayerAwards(player.id),
    (sport === "football" || sport === "basketball") ? getPlayerGameLog(player.id) : Promise.resolve([]),
    (sport === "football" || sport === "basketball") && player.primary_school_id && seasonIds.length > 0
      ? getPlayerTeamGames(player.primary_school_id, sport, seasonIds)
      : Promise.resolve([]),
    player.primary_school_id ? getCrossSportPlayers(player.name, player.primary_school_id) : Promise.resolve([]),
    // Fetch recruiting profile for social links
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();
        const { data } = await supabase
          .from("recruiting_profiles")
          .select("*")
          .eq("player_id", player.id)
          .maybeSingle();
        return data;
      } catch {
        return null;
      }
    })(),
  ]) as [Award[], PlayerGameLog[], TeamGame[], any[], any];

  // Football career totals
  const footballTotals = sport === "football" && stats.length > 0 ? (() => {
    const fbStats = stats as FootballPlayerSeason[];
    const rushYards = fbStats.reduce((sum, s) => sum + (s.rush_yards || 0), 0);
    const rushTd = fbStats.reduce((sum, s) => sum + (s.rush_td || 0), 0);
    const passYards = fbStats.reduce((sum, s) => sum + (s.pass_yards || 0), 0);
    const passTd = fbStats.reduce((sum, s) => sum + (s.pass_td || 0), 0);
    const recYards = fbStats.reduce((sum, s) => sum + (s.rec_yards || 0), 0);
    const recTd = fbStats.reduce((sum, s) => sum + (s.rec_td || 0), 0);
    const totalTd = fbStats.reduce((sum, s) => sum + (s.total_td || 0), 0);
    const rushCarries = fbStats.reduce((sum, s) => sum + (s.rush_carries || 0), 0);
    const gamesPlayed = fbStats.reduce((sum, s) => sum + (s.games_played || 0), 0);
    return { rushYards, rushTd, passYards, passTd, recYards, recTd, totalTd, rushCarries, gamesPlayed };
  })() : null;

  // Basketball career totals
  const basketballTotals = sport === "basketball" && stats.length > 0 ? {
    points: (stats as BasketballPlayerSeason[]).reduce((sum, s) => sum + (s.points || 0), 0),
    games: (stats as BasketballPlayerSeason[]).reduce((sum, s) => sum + (s.games_played || 0), 0),
    rebounds: (stats as BasketballPlayerSeason[]).reduce((sum, s) => sum + (s.rebounds || 0), 0),
    assists: (stats as BasketballPlayerSeason[]).reduce((sum, s) => sum + (s.assists || 0), 0),
  } : null;

  // Build merged game log: all team games + individual stats where available
  const boxScoreByGameId = new Map<number, PlayerGameLog>();
  for (const g of gameLog) {
    if (g.games?.id) boxScoreByGameId.set(g.games.id, g);
  }

  const mergedGames: MergedGameEntry[] = teamGames.map((tg) => {
    const bs = boxScoreByGameId.get(tg.id);
    return {
      gameId: tg.id,
      gameDate: tg.game_date,
      seasonLabel: tg.seasons?.label ?? null,
      homeSchoolId: tg.home_school_id,
      awaySchoolId: tg.away_school_id,
      homeScore: tg.home_score,
      awayScore: tg.away_score,
      homeSchool: tg.home_school,
      awaySchool: tg.away_school,
      hasBoxScore: !!bs,
      rushYards: bs?.rush_yards ?? null,
      passYards: bs?.pass_yards ?? null,
      recYards: bs?.rec_yards ?? null,
      points: bs?.points ?? null,
      bbPoints: bs?.points ?? null,
      sourceType: bs?.source_type ?? null,
    };
  });

  // Also add any box score entries not already in team games (edge case: game school_id mismatch)
  const teamGameIds = new Set(teamGames.map((tg) => tg.id));
  for (const g of gameLog) {
    if (g.games && !teamGameIds.has(g.games.id)) {
      mergedGames.push({
        gameId: g.games.id,
        gameDate: g.games.game_date,
        seasonLabel: g.games.seasons?.label ?? null,
        homeSchoolId: g.games.home_school_id,
        awaySchoolId: g.games.away_school_id,
        homeScore: g.games.home_score,
        awayScore: g.games.away_score,
        homeSchool: g.games.home_school,
        awaySchool: g.games.away_school,
        hasBoxScore: true,
        rushYards: g.rush_yards,
        passYards: g.pass_yards,
        recYards: g.rec_yards,
        points: g.points,
        bbPoints: g.points,
        sourceType: g.source_type ?? null,
      });
    }
  }

  // Sort merged games by season descending, then by date descending within each season
  mergedGames.sort((a, b) => {
    const seasonCmp = (b.seasonLabel || "").localeCompare(a.seasonLabel || "");
    if (seasonCmp !== 0) return seasonCmp;
    return (b.gameDate || "").localeCompare(a.gameDate || "");
  });

  // Determine which columns to show for football (hide all-zero columns)
  const fbVis = sport === "football" && stats.length > 0 ? {
    pass_yards: (stats as FootballPlayerSeason[]).some(s => s.pass_yards && s.pass_yards > 0),
    pass_td: (stats as FootballPlayerSeason[]).some(s => s.pass_td && s.pass_td > 0),
    rec_yards: (stats as FootballPlayerSeason[]).some(s => s.rec_yards && s.rec_yards > 0),
    rec_td: (stats as FootballPlayerSeason[]).some(s => s.rec_td && s.rec_td > 0),
    rush_carries: (stats as FootballPlayerSeason[]).some(s => s.rush_carries && s.rush_carries > 0),
    games_played: (stats as FootballPlayerSeason[]).some(s => s.games_played && s.games_played > 0),
    interceptions: (stats as FootballPlayerSeason[]).some(s => s.interceptions && s.interceptions > 0),
  } : null;

  // School initials for avatar
  const schoolInitials = player.schools?.name
    ? player.schools.name.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  /* ===== Hero stat cards: pick top 3 stats from most recent season ===== */
  const heroStats: { label: string; value: string; sub?: string }[] = [];
  const mostRecent = stats.length > 0 ? stats[stats.length - 1] : null; // stats are usually sorted ascending

  if (sport === "football" && footballTotals) {
    // Decide if QB or skill position based on career totals
    const isQB = footballTotals.passYards > footballTotals.rushYards;
    if (isQB) {
      heroStats.push(
        { label: "Pass Yards", value: footballTotals.passYards.toLocaleString() },
        { label: "Pass TDs", value: String(footballTotals.passTd) },
        { label: "Total TDs", value: String(footballTotals.totalTd) },
      );
    } else {
      heroStats.push(
        { label: "Rush Yards", value: footballTotals.rushYards.toLocaleString() },
        { label: "TDs", value: String(footballTotals.totalTd) },
      );
      if (footballTotals.rushCarries > 0) {
        heroStats.push({ label: "YPC", value: (footballTotals.rushYards / footballTotals.rushCarries).toFixed(1) });
      } else if (footballTotals.recYards > 0) {
        heroStats.push({ label: "Rec Yards", value: footballTotals.recYards.toLocaleString() });
      }
    }
  } else if (sport === "basketball" && basketballTotals) {
    const ppg = basketballTotals.games > 0 ? (basketballTotals.points / basketballTotals.games).toFixed(1) : "0";
    const rpg = basketballTotals.games > 0 ? (basketballTotals.rebounds / basketballTotals.games).toFixed(1) : "0";
    const apg = basketballTotals.games > 0 ? (basketballTotals.assists / basketballTotals.games).toFixed(1) : "0";
    heroStats.push(
      { label: "PPG", value: ppg },
      { label: "RPG", value: rpg },
      { label: "APG", value: apg },
    );
  } else if (sport === "baseball" && stats.length > 0) {
    const bbStats = stats as BaseballPlayerSeason[];
    const last = bbStats[bbStats.length - 1];
    heroStats.push(
      { label: "AVG", value: last.batting_avg != null ? last.batting_avg.toFixed(3) : ".000" },
      { label: "HR", value: String(last.home_runs || 0) },
    );
    if (last.era != null) heroStats.push({ label: "ERA", value: last.era.toFixed(2) });
  }

  /* ===== Build tab list ===== */
  const tabList: { id: string; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "stats", label: "Stats" },
  ];
  if (mergedGames.length > 0 && (sport === "football" || sport === "basketball")) {
    tabList.push({ id: "game-log", label: "Game Log" });
  }
  if ((awards as Award[]).length > 0) {
    tabList.push({ id: "awards", label: "Awards" });
  }

  /* ===== Awards grouping (for awards section) ===== */
  const TIER_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    "First Team": { bg: "#fef3c7", border: "#f59e0b", text: "#92400e", badge: "#f59e0b" },
    "Second Team": { bg: "#e0e7ff", border: "#6366f1", text: "#3730a3", badge: "#6366f1" },
    "Third Team": { bg: "#ecfdf5", border: "#10b981", text: "#065f46", badge: "#10b981" },
    "Honorable Mention": { bg: "#f3f4f6", border: "#9ca3af", text: "#374151", badge: "#9ca3af" },
    "MVP": { bg: "#fef3c7", border: "#d97706", text: "#92400e", badge: "#d97706" },
  };
  const CAT_ICONS: Record<string, string> = { offense: "\u26A1", defense: "\uD83D\uDEE1\uFE0F", specialist: "\uD83C\uDFAF" };
  const DEFAULT_STYLE = { bg: "#f3f4f6", border: "#d1d5db", text: "#374151", badge: "#6b7280" };

  const awardsByYear: Record<number, Award[]> = {};
  (awards as Award[]).forEach(a => {
    const y = a.year || (a.seasons?.label ? parseInt(a.seasons.label.split("-")[0]) + 1 : 0);
    if (!awardsByYear[y]) awardsByYear[y] = [];
    awardsByYear[y].push(a);
  });
  const awardYears = Object.keys(awardsByYear).map(Number).sort((a, b) => b - a);

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "https://phillysportspack.com" },
        { name: meta.name, url: `https://phillysportspack.com/${sport}` },
        { name: "Players", url: `https://phillysportspack.com/${sport}/players` },
        { name: player.name, url: `https://phillysportspack.com/${sport}/players/${slug}` },
      ]} />
      <PersonJsonLd
        name={player.name}
        description={`${player.name} is a Philadelphia high school ${meta.name.toLowerCase()} player.`}
        sport={meta.name}
        school={player.schools?.name}
        url={`https://phillysportspack.com/${sport}/players/${slug}`}
        college={player.college}
        proTeam={player.pro_team}
      />

      {/* ============ HERO SECTION ============ */}
      <section className="relative" style={{ background: "var(--psp-navy)" }}>
        {/* Sport-colored accent bar at very top */}
        <div className="h-1" style={{ background: meta.color }} />

        <div className="max-w-7xl mx-auto px-4 pt-6 pb-10 md:pt-8 md:pb-12">
          {/* Breadcrumb */}
          <Breadcrumb items={[
            { label: meta.name, href: `/${sport}` },
            { label: "Players" },
            { label: player.name }
          ]} />

          <div className="flex items-start gap-5 mt-4">
            {/* Avatar */}
            <div
              className="psp-h2 w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${meta.color}25`, color: "var(--psp-gold)", border: `2px solid ${meta.color}40` }}
              aria-hidden="true"
            >
              {schoolInitials}
            </div>

            <div className="flex-1 min-w-0">
              {/* Player name */}
              <h1
                className="psp-h1-lg text-white leading-none"
              >
                {player.name}
              </h1>

              {/* Meta row: school, position, class, jersey, badges */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                {player.schools && (
                  <Link href={`/${sport}/schools/${player.schools?.slug}`} className="text-sm font-semibold hover:underline" style={{ color: "var(--psp-gold)" }}>
                    {player.schools?.name}
                  </Link>
                )}
                {player.positions && player.positions.length > 0 && (
                  <span
                    className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-md"
                    style={{ background: `${meta.color}30`, color: meta.color, border: `1px solid ${meta.color}50` }}
                  >
                    {player.positions.join(" / ")}
                  </span>
                )}
                {player.graduation_year && (
                  <span className="text-sm text-gray-400">Class of {player.graduation_year}</span>
                )}
                {player.is_multi_sport && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-md" style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}>
                    Multi-Sport
                  </span>
                )}
                {player.pro_team && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-md" style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}>
                    Pro Athlete
                  </span>
                )}
                {player.college && !player.pro_team && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-blue-600 text-white">
                    College
                  </span>
                )}
                {(awards as Award[]).length > 0 && (
                  <span
                    className="px-2 py-0.5 text-xs font-bold rounded-md"
                    style={{ background: "rgba(240,165,0,0.2)", color: "var(--psp-gold)", border: "1px solid rgba(240,165,0,0.3)" }}
                  >
                    {(awards as Award[]).length} Award{(awards as Award[]).length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Actions row */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <ShareButtons
                  url={`/${sport}/players/${slug}`}
                  title={`${player.name} -- ${meta.name} Stats | PhillySportsPack`}
                  description={`Check out ${player.name}'s career stats on PhillySportsPack.com`}
                />
                <Link
                  href={`/compare?players=${slug}&sport=${sport}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ background: "var(--psp-blue, #3b82f6)", color: "white" }}
                  title="Compare with another player"
                >
                  Compare
                </Link>
              </div>

              {/* Social Profile Bar */}
              <div className="mt-4">
                <SocialProfileBar
                  hudlUrl={player.hudl_profile_url || recruitingProfile?.url_hudl}
                  on3Url={recruitingProfile?.url_on3}
                  two47Url={recruitingProfile?.url_247}
                  rivalsUrl={recruitingProfile?.url_rivals}
                  twitterHandle={player.twitter_handle || recruitingProfile?.social_twitter}
                  instagramHandle={player.instagram_handle || recruitingProfile?.social_instagram}
                  maxPrepsUrl={recruitingProfile?.url_maxpreps}
                  highlightsUrl={recruitingProfile?.highlights_url}
                  isVerified={player.is_verified}
                />
              </div>
            </div>
          </div>

          {/* ---- Hero Stat Highlight Cards ---- */}
          {heroStats.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-8">
              {heroStats.map((hs) => (
                <div
                  key={hs.label}
                  className="rounded-xl px-6 py-4 min-w-[120px] flex-1 max-w-[200px]"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="psp-h1 text-white leading-none"
                  >
                    {hs.value}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider mt-1.5" style={{ color: meta.color }}>
                    {hs.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ STICKY TAB NAVIGATION ============ */}
      <PlayerProfileTabs sportColor={meta.color} tabs={tabList} />

      {/* ============ OVERVIEW SECTION ============ */}
      <section id="overview" className="scroll-mt-16 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main column */}
          <div className="lg:col-span-3 space-y-8">
            {/* Data Source Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <DataSourceBadge
                source={stats.length > 0 && stats.some(s => {
                  const season = (s as any).seasons?.year_start;
                  return season && season >= 2015;
                }) ? "Ted Silary Archives + MaxPreps" : "Ted Silary Archives"}
                lastUpdated="2026-03-10"
                confidence="verified"
                detail="Player statistics compiled from Ted Silary's historical archives and MaxPreps real-time data. All career statistics aggregated from season-by-season records in the database."
              />
            </div>

            {/* Career Trajectory Chart */}
            {sport === "football" && stats.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="psp-h2 mb-3" style={{ color: "var(--psp-navy)" }}>
                  Career Trajectory
                </h2>
                <CareerTrajectoryChart
                  sport={sport}
                  seasons={(stats as FootballPlayerSeason[]).map((s) => ({
                    label: s.seasons?.label || "Unknown",
                    stats: {
                      pass_yards: s.pass_yards || 0,
                      rush_yards: s.rush_yards || 0,
                      rec_yards: s.rec_yards || 0,
                    },
                  }))}
                />
              </div>
            )}
            {sport === "basketball" && stats.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="psp-h2 mb-3" style={{ color: "var(--psp-navy)" }}>
                  Career Trajectory
                </h2>
                <CareerTrajectoryChart
                  sport={sport}
                  seasons={(stats as BasketballPlayerSeason[]).map((s) => ({
                    label: s.seasons?.label || "Unknown",
                    stats: {
                      points: s.points || 0,
                      rebounds: s.rebounds || 0,
                      assists: s.assists || 0,
                    },
                  }))}
                />
              </div>
            )}
            {sport === "baseball" && stats.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="psp-h2 mb-3" style={{ color: "var(--psp-navy)" }}>
                  Career Trajectory
                </h2>
                <CareerTrajectoryChart
                  sport={sport}
                  seasons={(stats as BaseballPlayerSeason[]).map((s) => ({
                    label: s.seasons?.label || "Unknown",
                    stats: {
                      hits: (s as any).hits || 0,
                      rbi: (s as any).rbi || 0,
                      home_runs: s.home_runs || 0,
                    },
                  }))}
                />
              </div>
            )}

            {/* In The News */}
            <InTheNews entityType="player" entityId={player.id} />

            {/* Player Highlights Section */}
            <PlayerHighlightsSection
              playerId={player.id}
              playerName={player.name}
              hudlProfileUrl={player.hudl_profile_url}
            />

            {/* Career context cards */}
            {sport === "football" && footballTotals && footballTotals.rushYards > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="psp-h3 mb-4" style={{ color: "var(--psp-navy)" }}>
                  Career Context
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      {player.name} totaled <span className="font-bold" style={{ color: "var(--psp-gold)" }}>{footballTotals.rushYards.toLocaleString()}</span> career rushing yards
                      {footballTotals.passYards > 0 && (<>, <span className="font-bold" style={{ color: "var(--psp-gold)" }}>{footballTotals.passYards.toLocaleString()}</span> passing yards</>)}
                      {footballTotals.recYards > 0 && (<>, <span className="font-bold" style={{ color: "var(--psp-gold)" }}>{footballTotals.recYards.toLocaleString()}</span> receiving yards</>)}
                      {" "}and <span className="font-bold" style={{ color: "var(--psp-gold)" }}>{footballTotals.totalTd}</span> total touchdowns.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <Link href={`/${sport}/leaderboards/rushing`} className="text-xs font-medium hover:underline" style={{ color: "var(--psp-blue)" }}>
                        Rushing leaders
                      </Link>
                      {footballTotals.passYards > 0 && (
                        <Link href={`/${sport}/leaderboards/passing`} className="text-xs font-medium hover:underline" style={{ color: "var(--psp-blue)" }}>
                          Passing leaders
                        </Link>
                      )}
                      {footballTotals.recYards > 0 && (
                        <Link href={`/${sport}/leaderboards/receiving`} className="text-xs font-medium hover:underline" style={{ color: "var(--psp-blue)" }}>
                          Receiving leaders
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {sport === "basketball" && basketballTotals && basketballTotals.points > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="psp-h3 mb-4" style={{ color: "var(--psp-navy)" }}>
                  Career Context
                </h3>
                <p className="text-sm text-gray-600">
                  {player.name} scored <span className="font-bold" style={{ color: "var(--psp-gold)" }}>{basketballTotals.points.toLocaleString()} career points</span> at {player.schools?.name || "a Philadelphia school"}.
                </p>
                <Link href={`/${sport}/leaderboards/scoring`} className="text-xs font-medium hover:underline mt-3 inline-block" style={{ color: "var(--psp-blue)" }}>
                  See scoring leaders
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Player info card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-xs uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                Player Info
              </h3>
              <dl className="space-y-3 text-sm">
                {player.primary_school_id && player.schools && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">School</dt>
                    <dd>
                      <Link href={`/${sport}/schools/${player.schools?.slug}`} className="font-medium hover:underline" style={{ color: "var(--psp-navy)" }}>
                        {player.schools?.name}
                      </Link>
                    </dd>
                  </div>
                )}
                {player.positions && player.positions.length > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Position</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{player.positions.join(", ")}</dd>
                  </div>
                )}
                {player.graduation_year && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Class</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{player.graduation_year}</dd>
                  </div>
                )}
                {player.height && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Height</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{player.height}</dd>
                  </div>
                )}
                {footballTotals && fbVis?.rush_carries && footballTotals.rushCarries > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Yards/Carry</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>
                      {(footballTotals.rushYards / footballTotals.rushCarries).toFixed(1)}
                    </dd>
                  </div>
                )}
                {footballTotals && footballTotals.gamesPlayed > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Career Games</dt>
                    <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{footballTotals.gamesPlayed}</dd>
                  </div>
                )}
              </dl>
            </div>

            <PSPPromo size="sidebar" variant={4} />

            {/* Similar Players */}
            {stats.length > 0 && (
              <SimilarPlayers
                playerId={player.id}
                sportId={sport}
                currentPlayerSlug={slug}
              />
            )}

            {/* Pro/college info */}
            {(player.college || player.pro_team) && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-xs uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                  Next Level
                </h3>
                <dl className="space-y-3 text-sm">
                  {player.college && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">College</dt>
                      <dd className="font-medium" style={{ color: "var(--psp-navy)" }}>{player.college}</dd>
                    </div>
                  )}
                  {player.pro_team && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Pro Team</dt>
                      <dd className="font-medium" style={{ color: "var(--psp-gold)" }}>{player.pro_team}</dd>
                    </div>
                  )}
                  {player.pro_draft_info && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Draft</dt>
                      <dd className="font-medium text-xs" style={{ color: "var(--psp-navy)" }}>{player.pro_draft_info}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Cross-sport links */}
            {crossSportPlayers && crossSportPlayers.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-xs uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                  Also Plays
                </h3>
                <div className="space-y-3">
                  {crossSportPlayers
                    .filter((cp: any) => cp.sports && cp.sports.length > 0 && cp.sports.includes(sport) === false)
                    .map((cp: any) => (
                      <div key={`${cp.id}-${cp.sports[0]}`}>
                        {cp.sports.map((s: string) => (
                          <Link
                            key={s}
                            href={`/${s}/players/${cp.slug}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80 mr-2 mb-2"
                            style={{ background: "rgba(240, 165, 0, 0.15)", color: "var(--psp-gold)", border: "1px solid rgba(240, 165, 0, 0.3)" }}
                          >
                            <span>{SPORT_META[s as keyof typeof SPORT_META]?.emoji || ""}</span>
                            {SPORT_META[s as keyof typeof SPORT_META]?.name || s}
                          </Link>
                        ))}
                      </div>
                    ))}
                </div>
              </div>
            )}

            <RelatedArticles entityType="player" entityId={player.id} />
          </div>
        </div>
      </section>

      <PSPPromo size="banner" variant={2} />

      {/* ============ STATS SECTION ============ */}
      <section id="stats" className="scroll-mt-16 max-w-7xl mx-auto px-4 py-8">
        <h2
          className="psp-h2 mb-6"
          style={{ color: "var(--psp-navy)" }}
        >
          Season-by-Season Stats
        </h2>
        {stats.length > 0 && (sport === "football" || sport === "basketball" || sport === "baseball") ? (
          <PlayerStatTable
            sport={sport as "football" | "basketball" | "baseball"}
            stats={stats}
            sportColor={meta.color}
          />
        ) : (
          <p className="text-gray-500 text-sm">No season statistics available.</p>
        )}

        {/* More from school link */}
        {player.schools && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="psp-h3 mb-2" style={{ color: "var(--psp-navy)" }}>
              More from {player.schools?.name}
            </h3>
            <p className="text-sm text-gray-500 mb-3">Explore other players from this school</p>
            <Link href={`/${sport}/schools/${player.schools?.slug}`} className="inline-block px-5 py-2.5 rounded-lg font-medium text-sm" style={{ background: "var(--psp-navy)", color: "white" }}>
              View {player.schools?.name} roster
            </Link>
          </div>
        )}
      </section>

      {/* ============ GAME LOG SECTION ============ */}
      {mergedGames.length > 0 && (sport === "football" || sport === "basketball") && (
        <section id="game-log" className="scroll-mt-16 max-w-7xl mx-auto px-4 py-8">
          <h2
            className="psp-h2 mb-6"
          >
            Game Log
          </h2>
          {mergedGames.some(g => g.sourceType === 'season_average') && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: "rgba(240, 165, 0, 0.08)", border: "1px solid rgba(240, 165, 0, 0.2)", color: "#92400e" }}>
              Some game stats are estimated from season averages and may not reflect actual per-game performance.
            </div>
          )}
          <GameLogAccordion
            games={mergedGames}
            awards={(awards as Award[]).map(a => ({
              id: a.id,
              award_name: a.award_name,
              award_type: a.award_type,
              category: a.category,
              seasonLabel: a.seasons?.label,
            }))}
            sport={sport}
            playerSchoolId={player.primary_school_id ?? null}
            playerName={player.name}
          />
        </section>
      )}

      {/* ============ AWARDS SECTION ============ */}
      {(awards as Award[]).length > 0 && (
        <section id="awards" className="scroll-mt-16 max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="psp-h2"
              style={{ color: "var(--psp-navy)" }}
            >
              Honors & Awards
            </h2>
            <Link
              href={`/${sport}/awards`}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
              style={{ background: "rgba(59,130,246,0.1)", color: "var(--psp-blue, #3b82f6)", border: "1px solid rgba(59,130,246,0.2)" }}
            >
              All {meta.name} Awards
            </Link>
          </div>
          <div className="space-y-6">
            {awardYears.map(year => (
              <div key={year}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="psp-h4" style={{ color: "var(--psp-gold, #f0a500)" }}>
                    {year > 1900 ? `${String(year - 1).slice(-2)}-${String(year).slice(-2)}` : year}
                  </span>
                  <div className="flex-1 h-px" style={{ background: "var(--psp-gray-200, #e2e8f0)" }} />
                </div>
                <div className="flex flex-wrap gap-3">
                  {awardsByYear[year].map(a => {
                    const tier = a.award_tier || "";
                    const colors = TIER_COLORS[tier] || DEFAULT_STYLE;
                    const catIcon = CAT_ICONS[a.category || ""] || "\uD83C\uDFC6";
                    let label = a.award_name || a.award_type || "Award";
                    label = label.replace(/^(football|basketball|baseball|soccer|lacrosse|wrestling|track-field)-/, "").replace(/-/g, " ");
                    if (tier) {
                      label = label.replace(/First Team/i, "").replace(/Second Team/i, "").replace(/Third Team/i, "").replace(/Honorable Mention/i, "").replace(/Red Division/i, "").trim().replace(/[-\s]+$/, "") || label;
                    }

                    return (
                      <div
                        key={a.id}
                        className="rounded-xl px-4 py-3 transition-transform hover:-translate-y-0.5"
                        style={{
                          background: colors.bg,
                          border: `2px solid ${colors.border}`,
                          minWidth: "180px",
                          maxWidth: "300px",
                          boxShadow: `0 2px 8px ${colors.border}20`,
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg shrink-0">{catIcon}</span>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm leading-tight capitalize" style={{ color: colors.text }}>
                              {label}
                            </p>
                            {a.position && (
                              <p className="text-xs mt-0.5" style={{ color: colors.text, opacity: 0.7 }}>{a.position}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {tier && (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: colors.badge }}>
                              {tier}
                            </span>
                          )}
                          {a.category && (
                            <span className="text-[10px] uppercase tracking-wider font-medium capitalize" style={{ color: colors.text, opacity: 0.6 }}>
                              {a.category}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============ BOTTOM CTAs ============ */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <ClaimProfileButton
          playerId={player.id}
          playerName={player.name}
          schoolName={player.schools?.name || "Unknown School"}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-4">
        <CorrectionForm entityType="player" entityId={player.id} entityName={player.name} />
      </div>
    </>
  );
}
