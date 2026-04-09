import React from "react";
import Link from "next/link";
import nextDynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { validateSportParam, validateSportParamForMetadata } from "@/lib/validateSport";
import { SPORT_META, getPlayerBySlug, getFootballPlayerStats, getBasketballPlayerStats, getBaseballPlayerStats, getPlayerAwards, getPlayerGameLog, getPlayerTeamGames, getCrossSportPlayers, getPlayerJerseyNumber, getPlayerSchoolHistory, isBasketballSport, type Player, type FootballPlayerSeason, type BasketballPlayerSeason, type BaseballPlayerSeason, type Award, type PlayerGameLog, type TeamGame } from "@/lib/data";
import { ClaimProfileButton } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import { BreadcrumbJsonLd, PersonJsonLd } from "@/components/seo/JsonLd";
import RelatedArticles from "@/components/articles/RelatedArticles";
import PlayerHofBadges from "@/components/hof/PlayerHofBadges";
import { getLegacyProfileForPlayer } from "@/lib/data/legacy";
import MultiSportBanner from "@/components/players/MultiSportBanner";
import { buildOgImageUrl } from "@/lib/og-utils";
import GameLogAccordion from "@/components/game-log/GameLogAccordion";
import DataSourceBadge from "@/components/ui/DataSourceBadge";
import MethodologyNote from "@/components/ui/MethodologyNote";
import PlayerHighlightsSection from "@/components/highlights/PlayerHighlightsSection";
import MediaGallery from "@/components/media/MediaGallery";
import PlayerStatTable from "@/components/players/PlayerStatTable";
import PlayerProfileTabs from "@/components/players/PlayerProfileTabs";
import InTheNews from "@/components/players/InTheNews";
import type { MergedGameEntry } from "@/components/game-log/GameLogAccordion";
import type { Metadata } from "next";
import PlayerHero from "./PlayerHero";
import AwardsSection from "./AwardsSection";

// Dynamic imports for heavy client components (below fold)
const CorrectionForm = nextDynamic(() => import("@/components/corrections/CorrectionForm"), {
  loading: () => <div className="text-center py-4 text-gray-400 text-sm">Loading form...</div>,
});

const SimilarPlayers = nextDynamic(() => import("@/components/player/SimilarPlayers"), {
  loading: () => <div className="bg-white rounded-lg border border-gray-200 p-6 h-64 animate-pulse" role="status" aria-busy="true" aria-label="Loading similar players" />,
});

export const revalidate = 86400; // ISR: daily

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
      : isBasketballSport(sport)
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
  const [awards, gameLog, teamGames, crossSportPlayers, recruitingProfile, jerseyNumber, schoolHistory] = await Promise.all([
    getPlayerAwards(player.id),
    (sport === "football" || isBasketballSport(sport)) ? getPlayerGameLog(player.id, sport) : Promise.resolve([]),
    (sport === "football" || isBasketballSport(sport)) && player.primary_school_id && seasonIds.length > 0
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
    getPlayerJerseyNumber(player.id),
    getPlayerSchoolHistory(player.id, player.primary_school_id),
  ]) as [Award[], PlayerGameLog[], TeamGame[], any[], any, string | null, Awaited<ReturnType<typeof getPlayerSchoolHistory>>];

  const legacyProfile = await getLegacyProfileForPlayer(player.id);

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
  const basketballTotals = isBasketballSport(sport) && stats.length > 0 ? {
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

  // Pull a numeric key from stats_json with graceful fallbacks for naming variants
  const jsonNum = (sj: Record<string, unknown> | null | undefined, ...keys: string[]): number | null => {
    if (!sj) return null;
    for (const k of keys) {
      const v = (sj as any)[k];
      if (typeof v === "number") return v;
      if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) return Number(v);
    }
    return null;
  };

  const buildEntryFromBox = (bs: PlayerGameLog | undefined) => {
    const sj = bs?.stats_json as Record<string, unknown> | null | undefined;
    return {
      passCompletions: bs?.pass_completions ?? null,
      passAttempts: jsonNum(sj, "pass_attempts", "pass_att"),
      passYards: bs?.pass_yards ?? null,
      passTd: jsonNum(sj, "pass_td", "pass_tds"),
      passInt: jsonNum(sj, "interceptions", "pass_int"),
      rushCarries: bs?.rush_carries ?? null,
      rushYards: bs?.rush_yards ?? null,
      rushTd: jsonNum(sj, "rush_td", "rush_tds"),
      recCatches: bs?.rec_catches ?? null,
      recYards: bs?.rec_yards ?? null,
      recTd: jsonNum(sj, "rec_td", "rec_tds"),
      points: bs?.points ?? null,
      bbPoints: bs?.points ?? null,
      sourceType: bs?.source_type ?? null,
    };
  };

  const emptyBoxFields = {
    passCompletions: null,
    passAttempts: null,
    passYards: null,
    passTd: null,
    passInt: null,
    rushCarries: null,
    rushYards: null,
    rushTd: null,
    recCatches: null,
    recYards: null,
    recTd: null,
    points: null,
    bbPoints: null,
    sourceType: null,
  };

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
      ...(bs ? buildEntryFromBox(bs) : emptyBoxFields),
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
        ...buildEntryFromBox(g),
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

  // Helper: only push a stat card if the raw numeric value is > 0
  const pushIfNonZero = (
    target: { label: string; value: string; sub?: string }[],
    raw: number | null | undefined,
    label: string,
    formatted?: string,
  ) => {
    if (raw == null || !Number.isFinite(raw) || raw <= 0) return;
    target.push({ label, value: formatted ?? raw.toLocaleString() });
  };

  if (sport === "football" && footballTotals) {
    // Position-aware ordering. Priority list per position; first 3 with non-zero values win.
    const candidates: { label: string; value: string; sub?: string }[] = [];
    const primaryPos = (player.positions?.[0] || "").toUpperCase();

    const ypcRaw = footballTotals.rushCarries > 0 ? footballTotals.rushYards / footballTotals.rushCarries : 0;
    const ypcFmt = footballTotals.rushCarries > 0 ? (footballTotals.rushYards / footballTotals.rushCarries).toFixed(1) : "0";

    const CARD_POOL: Record<string, { label: string; raw: number; formatted?: string }> = {
      passYards: { label: "Pass Yards", raw: footballTotals.passYards },
      passTds: { label: "Pass TDs", raw: footballTotals.passTd },
      rushYards: { label: "Rush Yards", raw: footballTotals.rushYards },
      rushTds: { label: "Rush TDs", raw: footballTotals.rushTd },
      recYards: { label: "Rec Yards", raw: footballTotals.recYards },
      recTds: { label: "Rec TDs", raw: footballTotals.recTd },
      totalTds: { label: "Total TDs", raw: footballTotals.totalTd },
      ypc: { label: "YPC", raw: ypcRaw, formatted: ypcFmt },
      games: { label: "Games", raw: footballTotals.gamesPlayed },
    };

    const positionOrder: Record<string, string[]> = {
      QB: ["passYards", "passTds", "rushYards", "rushTds", "totalTds"],
      RB: ["rushYards", "rushTds", "ypc", "recYards", "totalTds"],
      WR: ["recYards", "recTds", "rushYards", "totalTds"],
      TE: ["recYards", "recTds", "totalTds"],
      ATH: ["rushYards", "recYards", "passYards", "totalTds"],
      OL: ["games"],
      DL: ["games"],
      LB: ["games"],
      DB: ["games"],
      K:  ["games"],
      P:  ["games"],
    };

    // Fallback order: whichever career totals are biggest (legacy heuristic)
    const fallbackOrder = (() => {
      const buckets = [
        { key: "passYards", val: footballTotals.passYards },
        { key: "rushYards", val: footballTotals.rushYards },
        { key: "recYards", val: footballTotals.recYards },
      ].sort((a, b) => b.val - a.val);
      const primaryKey = buckets[0].key as "passYards" | "rushYards" | "recYards";
      if (primaryKey === "passYards") return ["passYards", "passTds", "rushYards", "totalTds"];
      if (primaryKey === "rushYards") return ["rushYards", "rushTds", "ypc", "totalTds"];
      return ["recYards", "recTds", "rushYards", "totalTds"];
    })();

    const order = positionOrder[primaryPos] || fallbackOrder;
    for (const key of order) {
      const card = CARD_POOL[key];
      if (!card) continue;
      pushIfNonZero(candidates, card.raw, card.label, card.formatted);
      if (candidates.length >= 3) break;
    }
    heroStats.push(...candidates.slice(0, 3));
  } else if (isBasketballSport(sport) && basketballTotals) {
    const ppg = basketballTotals.games > 0 ? basketballTotals.points / basketballTotals.games : 0;
    const rpg = basketballTotals.games > 0 ? basketballTotals.rebounds / basketballTotals.games : 0;
    const apg = basketballTotals.games > 0 ? basketballTotals.assists / basketballTotals.games : 0;
    pushIfNonZero(heroStats, ppg, "PPG", ppg.toFixed(1));
    pushIfNonZero(heroStats, rpg, "RPG", rpg.toFixed(1));
    pushIfNonZero(heroStats, apg, "APG", apg.toFixed(1));
  } else if (sport === "baseball" && stats.length > 0) {
    const bbStats = stats as BaseballPlayerSeason[];
    const last = bbStats[bbStats.length - 1];
    if (last.batting_avg != null && last.batting_avg > 0) {
      heroStats.push({ label: "AVG", value: last.batting_avg.toFixed(3) });
    }
    pushIfNonZero(heroStats, last.home_runs, "HR", String(last.home_runs || 0));
    if (last.era != null && last.era > 0) {
      heroStats.push({ label: "ERA", value: last.era.toFixed(2) });
    }
  }

  /* ===== Build tab list ===== */
  const tabList: { id: string; label: string }[] = [
    { id: "stats", label: "Stats" },
  ];
  if (mergedGames.length > 0 && (sport === "football" || isBasketballSport(sport))) {
    tabList.push({ id: "game-log", label: "Game Log" });
  }
  tabList.push({ id: "overview", label: "Overview" });
  if ((awards as Award[]).length > 0) {
    tabList.push({ id: "awards", label: "Awards" });
  }

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
      <PlayerHero
        player={player}
        sport={sport}
        slug={slug}
        meta={meta}
        jerseyNumber={jerseyNumber}
        schoolInitials={schoolInitials}
        schoolHistory={schoolHistory}
        legacyProfile={legacyProfile}
        awards={awards as Award[]}
        footballTotals={footballTotals}
        basketballTotals={basketballTotals}
        heroStats={heroStats}
        recruitingProfile={recruitingProfile}
        isBasketball={isBasketballSport(sport)}
      />

      {/* ============ STICKY TAB NAVIGATION ============ */}
      <PlayerProfileTabs sportColor={meta.color} tabs={tabList} />

      {/* ============ MULTI-SPORT BANNER ============ */}
      {player.primary_school_id && (
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <MultiSportBanner
            playerName={player.name}
            schoolId={player.primary_school_id}
            currentSport={sport}
            schoolName={typeof player.schools === 'object' && player.schools && 'name' in player.schools ? (player.schools as any).name : undefined}
          />
        </div>
      )}

      {/* ============ STATS SECTION ============ */}
      <section id="stats" className="scroll-mt-16 max-w-7xl mx-auto px-4 py-8 border-b border-gray-200">
        <h2
          className="psp-h2 mb-6"
          style={{ color: "var(--psp-navy)" }}
        >
          Season-by-Season Stats
        </h2>
        {stats.length > 0 && (sport === "football" || isBasketballSport(sport) || sport === "baseball") ? (
          <PlayerStatTable
            sport={sport as "football" | "basketball" | "baseball"}
            stats={stats}
            sportColor={meta.color}
            playerName={player.name}
          />
        ) : (
          <p className="text-gray-400 text-sm">No season statistics available.</p>
        )}

      </section>

      {/* ============ GAME LOG SECTION ============ */}
      {mergedGames.length > 0 && (sport === "football" || isBasketballSport(sport)) && (
        <section id="game-log" className="scroll-mt-16 max-w-7xl mx-auto px-4 py-8 border-b border-gray-200">
          <h2
            className="psp-h2 text-[var(--psp-navy)] mb-6"
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
              // Prefer seasons.label; fall back to deriving from a.year (year = season_start)
              seasonLabel: a.seasons?.label ?? (a.year ? `${a.year}-${String((a.year + 1) % 100).padStart(2, '0')}` : undefined),
            }))}
            sport={sport}
            playerSchoolId={player.primary_school_id ?? null}
            playerName={player.name}
            playerPositions={player.positions ?? []}
            seasonTotals={
              sport === "football"
                ? (stats as FootballPlayerSeason[]).map(s => ({
                    seasonLabel: s.seasons?.label ?? "",
                    passYards: s.pass_yards,
                    passTd: s.pass_td,
                    rushYards: s.rush_yards,
                    rushTd: s.rush_td,
                    recYards: s.rec_yards,
                    recTd: s.rec_td,
                  }))
                : []
            }
          />
        </section>
      )}

      <PSPPromo size="banner" variant={2} />

      {/* ============ OVERVIEW SECTION ============ */}
      <section id="overview" className="scroll-mt-16 max-w-7xl mx-auto px-4 py-8 border-b border-gray-200">
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

            {/* In The News */}
            <InTheNews entityType="player" entityId={player.id} />

            {/* Player Highlights Section */}
            <PlayerHighlightsSection
              playerId={player.id}
              playerName={player.name}
              hudlProfileUrl={player.hudl_profile_url}
            />

            {/* Player Media Gallery */}
            <MediaGallery playerId={player.id} sport={sport} showUpload />

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
              <div className="bg-[var(--psp-navy-mid)] rounded-xl border border-[var(--psp-rule-strong)] p-6">
                <h2 className="font-bold text-xs uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                  Next Level
                </h2>
                <dl className="space-y-3 text-sm">
                  {player.college && (
                    <div className="flex justify-between">
                      <dt className="text-gray-400">College</dt>
                      <dd className="font-medium" style={{ color: "var(--psp-text-cream)" }}>{player.college}</dd>
                    </div>
                  )}
                  {player.pro_team && (
                    <div className="flex justify-between">
                      <dt className="text-gray-400">Pro Team</dt>
                      <dd className="font-medium" style={{ color: "var(--psp-gold)" }}>{player.pro_team}</dd>
                    </div>
                  )}
                  {player.pro_draft_info && (
                    <div className="flex justify-between">
                      <dt className="text-gray-400">Draft</dt>
                      <dd className="font-medium text-xs" style={{ color: "var(--psp-text-cream)" }}>{player.pro_draft_info}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Hall of Fame Badges */}
            <PlayerHofBadges playerId={player.id} />

            {/* Cross-sport links */}
            {crossSportPlayers && crossSportPlayers.length > 0 && (
              <div className="bg-[var(--psp-navy-mid)] rounded-xl border border-[var(--psp-rule-strong)] p-6">
                <h2 className="font-bold text-xs uppercase tracking-wider mb-4" style={{ color: "var(--psp-gray-400)" }}>
                  Also Plays
                </h2>
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

      {/* ============ AWARDS SECTION ============ */}
      {(awards as Award[]).length > 0 && (
        <AwardsSection awards={awards as Award[]} sport={sport} sportName={meta.name} />
      )}

      {/* ============ MORE FROM SCHOOL ============ */}
      {player.schools && (
        <section className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-200">
          <h2 className="psp-h3 mb-2" style={{ color: "var(--psp-navy)" }}>
            More from {player.schools?.name}
          </h2>
          <p className="text-sm text-gray-500 mb-3">Explore other players from this school</p>
          <Link
            href={`/${sport}/schools/${player.schools?.slug}`}
            className="inline-block px-5 py-2.5 rounded-lg font-medium text-sm"
            style={{ background: "var(--psp-navy)", color: "white" }}
          >
            View {player.schools?.name} roster
          </Link>
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
