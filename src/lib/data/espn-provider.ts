/**
 * ESPN Data Provider
 *
 * Abstracts ESPN's free public API endpoints for the PSP "Our Guys" page.
 * Fetches scoreboards and box scores, caches them in Supabase, and matches
 * Philly-connected players from the next_level_tracking table.
 */

import { createClient } from "./common";
import type { NLTEntry } from "./player-matcher";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Supported league identifiers */
export type LeagueId = "NFL" | "NBA" | "MLB" | "CFB" | "CBB";

/** ESPN API sport/league path mapping */
const LEAGUE_PATHS: Record<LeagueId, { sport: string; league: string }> = {
  NFL: { sport: "football", league: "nfl" },
  NBA: { sport: "basketball", league: "nba" },
  MLB: { sport: "baseball", league: "mlb" },
  CFB: { sport: "football", league: "college-football" },
  CBB: { sport: "basketball", league: "mens-college-basketball" },
};

/** High-level sport category derived from league */
const LEAGUE_SPORT: Record<LeagueId, string> = {
  NFL: "football",
  NBA: "basketball",
  MLB: "baseball",
  CFB: "football",
  CBB: "basketball",
};

/** Team info within a game score */
export interface TeamInfo {
  id: string;
  name: string;
  abbreviation: string;
  logo?: string;
}

/** A single game from the scoreboard endpoint */
export interface GameScore {
  id: string;
  league: LeagueId;
  date: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  homeScore: number | null;
  awayScore: number | null;
  status: "scheduled" | "in_progress" | "final";
  statusDetail: string;
  hasPhillyConnection: boolean;
}

/** Individual player stats from a box score */
export interface ESPNPlayer {
  id: string;
  name: string;
  position: string;
  teamId: string;
  teamName: string;
  stats: Record<string, number>;
}

/** Full box score detail for a single game */
export interface BoxScoreDetail {
  gameId: string;
  league: LeagueId;
  date: string;
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  teamStats: {
    home: Record<string, number | string>;
    away: Record<string, number | string>;
  };
  players: ESPNPlayer[];
}

// NLTEntry is imported from ./player-matcher (snake_case matching Supabase columns)

/** A matched performance combining ESPN data with NLT identity */
export interface PerformanceMatch {
  nltId: number;
  playerName: string;
  teamName: string;
  sport: string;
  stats: Record<string, number>;
  performanceScore: number;
  recapTier: number; // 1=Spotlight, 2=BoxScore, 3=AlsoActive
  highSchool?: string | null;
  highSchoolId?: number | null;
}

/** Coach focus configuration for team stat extraction */
export interface CoachFocus {
  nltId: number;
  statFocus: string;
  positionGroup: string;
}

/** Result of team stat extraction for a coach */
export interface TeamStatResult {
  teamStats: Record<string, number | string>;
  standoutPlayers: {
    name: string;
    position: string;
    stats: Record<string, number>;
  }[];
}

// ============================================================================
// ESPN API BASE
// ============================================================================

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports";

/**
 * Builds the ESPN API URL for a given league and endpoint.
 */
function espnUrl(league: LeagueId, endpoint: string): string {
  const { sport, league: leaguePath } = LEAGUE_PATHS[league];
  return `${ESPN_BASE}/${sport}/${leaguePath}/${endpoint}`;
}

// ============================================================================
// SCOREBOARD
// ============================================================================

/**
 * Fetches all games for a league on a given date from ESPN's scoreboard API.
 *
 * @param league - The league to fetch (NFL, NBA, MLB, CFB, CBB)
 * @param date - Date in YYYYMMDD format
 * @returns Array of GameScore objects, or empty array on failure
 */
export async function fetchScoreboard(
  league: LeagueId,
  date: string
): Promise<GameScore[]> {
  try {
    const url = espnUrl(league, `scoreboard?dates=${date}`);
    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) {
      console.error(
        `ESPN scoreboard error: ${res.status} for ${league} on ${date}`
      );
      return [];
    }

    const data = await res.json();
    const events = data?.events ?? [];

    return events.map((event: any) => {
      const competition = event.competitions?.[0];
      const competitors = competition?.competitors ?? [];

      const home = competitors.find((c: any) => c.homeAway === "home");
      const away = competitors.find((c: any) => c.homeAway === "away");

      const statusType = competition?.status?.type?.name ?? "STATUS_SCHEDULED";

      let status: GameScore["status"] = "scheduled";
      if (statusType === "STATUS_FINAL" || statusType === "STATUS_END_PERIOD") {
        status = "final";
      } else if (statusType === "STATUS_IN_PROGRESS" || statusType === "STATUS_HALFTIME") {
        status = "in_progress";
      }

      return {
        id: event.id,
        league,
        date,
        homeTeam: {
          id: home?.team?.id ?? "",
          name: home?.team?.displayName ?? home?.team?.name ?? "Unknown",
          abbreviation: home?.team?.abbreviation ?? "",
          logo: home?.team?.logo ?? home?.team?.logos?.[0]?.href,
        },
        awayTeam: {
          id: away?.team?.id ?? "",
          name: away?.team?.displayName ?? away?.team?.name ?? "Unknown",
          abbreviation: away?.team?.abbreviation ?? "",
          logo: away?.team?.logo ?? away?.team?.logos?.[0]?.href,
        },
        homeScore: home?.score != null ? Number(home.score) : null,
        awayScore: away?.score != null ? Number(away.score) : null,
        status,
        statusDetail:
          competition?.status?.type?.shortDetail ??
          competition?.status?.type?.detail ??
          "",
        hasPhillyConnection: false, // Populated downstream by caller
      };
    });
  } catch (err) {
    console.error(`ESPN scoreboard fetch failed for ${league}/${date}:`, err);
    return [];
  }
}

// ============================================================================
// BOX SCORE
// ============================================================================

/**
 * Fetches the detailed box score / summary for a single ESPN game event.
 *
 * @param league - The league the game belongs to
 * @param eventId - The ESPN event ID
 * @returns BoxScoreDetail object, or null on failure
 */
export async function fetchBoxScore(
  league: LeagueId,
  eventId: string
): Promise<BoxScoreDetail | null> {
  try {
    const url = espnUrl(league, `summary?event=${eventId}`);
    const res = await fetch(url, { next: { revalidate: 300 } });

    if (!res.ok) {
      console.error(
        `ESPN box score error: ${res.status} for ${league} event ${eventId}`
      );
      return null;
    }

    const data = await res.json();

    // Extract header info
    const header = data?.header?.competitions?.[0];
    const competitors = header?.competitors ?? [];
    const home = competitors.find((c: any) => c.homeAway === "home");
    const away = competitors.find((c: any) => c.homeAway === "away");

    // Extract team stats
    const teamStats: BoxScoreDetail["teamStats"] = { home: {}, away: {} };
    const teamStatsRaw = data?.boxscore?.teams ?? [];
    for (const team of teamStatsRaw) {
      const side =
        team.team?.id === home?.id || team.homeAway === "home" ? "home" : "away";
      for (const statGroup of team.statistics ?? []) {
        for (const stat of statGroup.stats ?? []) {
          if (stat.name && stat.displayValue != null) {
            const numVal = Number(stat.displayValue);
            teamStats[side][stat.name] = isNaN(numVal)
              ? stat.displayValue
              : numVal;
          }
        }
      }
    }

    // Extract individual player stats
    const players: ESPNPlayer[] = [];
    const boxPlayers = data?.boxscore?.players ?? [];

    for (const teamBlock of boxPlayers) {
      const teamId = teamBlock.team?.id ?? "";
      const teamName =
        teamBlock.team?.displayName ?? teamBlock.team?.name ?? "Unknown";

      for (const statGroup of teamBlock.statistics ?? []) {
        const statNames: string[] = statGroup.names ?? statGroup.labels ?? [];

        for (const athlete of statGroup.athletes ?? []) {
          const athleteInfo = athlete.athlete ?? {};
          const statValues: string[] = athlete.stats ?? [];

          const statsObj: Record<string, number> = {};
          statNames.forEach((name: string, i: number) => {
            const val = Number(statValues[i]);
            if (!isNaN(val)) {
              statsObj[name] = val;
            }
          });

          // Only include players with at least one numeric stat
          if (Object.keys(statsObj).length > 0) {
            players.push({
              id: String(athleteInfo.id ?? ""),
              name: athleteInfo.displayName ?? athleteInfo.shortName ?? "",
              position: athleteInfo.position?.abbreviation ?? "",
              teamId,
              teamName,
              stats: statsObj,
            });
          }
        }
      }
    }

    return {
      gameId: eventId,
      league,
      date:
        header?.date ??
        data?.header?.gameNote ?? "",
      homeTeam: {
        id: home?.id ?? "",
        name: home?.team?.displayName ?? home?.team?.name ?? "Unknown",
        abbreviation: home?.team?.abbreviation ?? "",
        logo: home?.team?.logo ?? home?.team?.logos?.[0]?.href,
      },
      awayTeam: {
        id: away?.id ?? "",
        name: away?.team?.displayName ?? away?.team?.name ?? "Unknown",
        abbreviation: away?.team?.abbreviation ?? "",
        logo: away?.team?.logo ?? away?.team?.logos?.[0]?.href,
      },
      homeScore: home?.score != null ? Number(home.score) : null,
      awayScore: away?.score != null ? Number(away.score) : null,
      status: header?.status?.type?.name ?? "unknown",
      teamStats,
      players,
    };
  } catch (err) {
    console.error(
      `ESPN box score fetch failed for ${league} event ${eventId}:`,
      err
    );
    return null;
  }
}

// ============================================================================
// PHILLY PLAYER MATCHING
// ============================================================================

/**
 * Normalizes a player name for fuzzy comparison.
 * Strips suffixes (Jr, Sr, III), lowercases, removes punctuation.
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(jr|sr|ii|iii|iv|v)\b\.?/gi, "")
    .replace(/['.,-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Checks if two normalized names are a fuzzy match.
 * Handles first/last name matching and common abbreviation patterns.
 */
function isFuzzyNameMatch(espnName: string, nltName: string): boolean {
  const a = normalizeName(espnName);
  const b = normalizeName(nltName);

  // Exact match after normalization
  if (a === b) return true;

  // Check last name match + first initial match
  const aParts = a.split(" ");
  const bParts = b.split(" ");

  if (aParts.length >= 2 && bParts.length >= 2) {
    const aLast = aParts[aParts.length - 1];
    const bLast = bParts[bParts.length - 1];
    const aFirst = aParts[0];
    const bFirst = bParts[0];

    // Same last name and first name starts with same letter
    if (aLast === bLast && aFirst[0] === bFirst[0]) {
      // If one is just an initial
      if (aFirst.length === 1 || bFirst.length === 1) return true;
      // Or if first names share a significant prefix (3+ chars)
      if (
        aFirst.length >= 3 &&
        bFirst.length >= 3 &&
        aFirst.slice(0, 3) === bFirst.slice(0, 3)
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Normalizes an organization/team name for comparison.
 */
function normalizeTeam(team: string): string {
  return team
    .toLowerCase()
    .replace(/\b(university|college|state|of|the)\b/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Matches ESPN player performances to NLT (next_level_tracking) entries.
 *
 * Uses espn_player_id for primary matching. Falls back to fuzzy name + team
 * matching when no ESPN ID is available.
 *
 * @param boxScore - The box score containing player stats
 * @param nltEntries - List of NLT entries to match against
 * @returns Array of matched performances with computed scores and tiers
 */
export async function matchPhillyPlayers(
  boxScore: BoxScoreDetail,
  nltEntries: NLTEntry[]
): Promise<PerformanceMatch[]> {
  try {
    const sport = LEAGUE_SPORT[boxScore.league];
    const matches: PerformanceMatch[] = [];

    for (const nltEntry of nltEntries) {
      let matchedPlayer: ESPNPlayer | undefined;

      // Primary: match by espn_player_id
      if (nltEntry.espn_player_id) {
        matchedPlayer = boxScore.players.find(
          (p) => p.id === nltEntry.espn_player_id
        );
      }

      // Secondary: fuzzy name + team matching
      if (!matchedPlayer && nltEntry.current_org) {
        const normalizedOrg = normalizeTeam(nltEntry.current_org);
        matchedPlayer = boxScore.players.find((p) => {
          const nameMatch = isFuzzyNameMatch(p.name, nltEntry.person_name);
          const teamMatch = normalizeTeam(p.teamName).includes(normalizedOrg) ||
            normalizedOrg.includes(normalizeTeam(p.teamName));
          return nameMatch && teamMatch;
        });
      }

      if (matchedPlayer) {
        const perfScore = computePerformanceScore(matchedPlayer.stats, sport);
        console.log(
          `[matchPhillyPlayers] MATCHED: "${nltEntry.person_name}" (NLT ${nltEntry.id}) → ESPN "${matchedPlayer.name}" (${matchedPlayer.id}) on ${matchedPlayer.teamName} | score=${perfScore.toFixed(1)}`
        );

        // Store ESPN player ID for future instant lookups
        if (!nltEntry.espn_player_id && matchedPlayer.id) {
          try {
            const supabase = await createClient();
            await (supabase as any)
              .from("next_level_tracking")
              .update({ espn_player_id: matchedPlayer.id })
              .eq("id", nltEntry.id);
          } catch {
            // Non-critical — continue even if update fails
          }
        }

        matches.push({
          nltId: nltEntry.id,
          playerName: nltEntry.person_name,
          teamName: matchedPlayer.teamName,
          sport,
          stats: matchedPlayer.stats,
          performanceScore: perfScore,
          recapTier: assignTier(perfScore, sport),
          highSchool: nltEntry.high_school_name,
          highSchoolId: nltEntry.high_school_id,
        });
      }
    }

    console.log(
      `[matchPhillyPlayers] ${matches.length} matches from ${boxScore.players.length} ESPN players vs ${nltEntries.length} NLT entries`
    );

    return matches;
  } catch (err) {
    console.error("matchPhillyPlayers failed:", err);
    return [];
  }
}

// ============================================================================
// COACH TEAM STATS
// ============================================================================

/** Stat focus keywords mapped to relevant stat name patterns */
const FOCUS_STAT_MAP: Record<string, string[]> = {
  rushing: ["rush", "carry", "carries", "rushingYards", "rushingTouchdowns", "yardsPerRushAttempt"],
  passing: ["pass", "completions", "attempts", "passingYards", "passingTouchdowns", "interceptions", "QBRating"],
  receiving: ["rec", "receptions", "receivingYards", "receivingTouchdowns", "targets"],
  defense: ["sack", "tackle", "interception", "fumble", "passDeflections", "tacklesForLoss"],
  scoring: ["points", "touchdowns", "fieldGoals"],
  rebounding: ["rebounds", "offensiveRebounds", "defensiveRebounds", "reboundsPerGame"],
  assists: ["assists", "assistsPerGame", "assistTurnoverRatio"],
  pitching: ["innings", "strikeouts", "earnedRuns", "ERA", "hits", "walks", "saves"],
  batting: ["battingAverage", "hits", "homeRuns", "RBI", "stolenBases", "onBasePct"],
};

/**
 * Extracts team and player stats relevant to a coach's stat focus.
 *
 * For example, an RB coach gets rushing stats; a DC gets defensive stats.
 *
 * @param boxScore - The full box score detail
 * @param coachFocus - The coach's stat focus configuration
 * @returns Filtered team stats and standout players for the focus area
 */
export function mapTeamStats(
  boxScore: BoxScoreDetail,
  coachFocus: CoachFocus
): TeamStatResult {
  try {
    const focusPatterns =
      FOCUS_STAT_MAP[coachFocus.statFocus.toLowerCase()] ?? [];

    // Filter team stats to relevant ones
    const filteredStats: Record<string, number | string> = {};
    for (const [key, val] of Object.entries(boxScore.teamStats.home)) {
      if (
        focusPatterns.some(
          (pattern) =>
            key.toLowerCase().includes(pattern.toLowerCase())
        )
      ) {
        filteredStats[`home_${key}`] = val;
      }
    }
    for (const [key, val] of Object.entries(boxScore.teamStats.away)) {
      if (
        focusPatterns.some(
          (pattern) =>
            key.toLowerCase().includes(pattern.toLowerCase())
        )
      ) {
        filteredStats[`away_${key}`] = val;
      }
    }

    // Find standout players in the position group
    const posGroup = coachFocus.positionGroup.toLowerCase();
    const relevantPlayers = boxScore.players.filter((p) =>
      p.position.toLowerCase().includes(posGroup) ||
      posGroup.includes(p.position.toLowerCase())
    );

    // Sort by total stat values descending
    const standoutPlayers = relevantPlayers
      .map((p) => ({
        name: p.name,
        position: p.position,
        stats: p.stats,
      }))
      .sort((a, b) => {
        const aTotal = Object.values(a.stats).reduce((s, v) => s + v, 0);
        const bTotal = Object.values(b.stats).reduce((s, v) => s + v, 0);
        return bTotal - aTotal;
      })
      .slice(0, 5);

    return {
      teamStats: filteredStats,
      standoutPlayers,
    };
  } catch (err) {
    console.error("mapTeamStats failed:", err);
    return { teamStats: {}, standoutPlayers: [] };
  }
}

// ============================================================================
// PERFORMANCE SCORING
// ============================================================================

/**
 * Computes a numeric performance score for tier assignment.
 *
 * Sport-specific formulas:
 * - Football: (rush_yds * 1) + (rec_yds * 1) + (pass_yds * 0.5) + (total_td * 6) + (int_thrown * -3) + (sacks * 2)
 * - Basketball: (pts * 1) + (reb * 1.2) + (ast * 1.5) + (stl * 2) + (blk * 2) + (to * -1)
 * - Baseball: (hits * 2) + (rbi * 2) + (hr * 4) + (sb * 2) + (ip * 3) + (k_pitched * 1) + (er * -2)
 *
 * @param stats - Player stat key-value pairs from ESPN
 * @param sport - The sport category ("football", "basketball", or "baseball")
 * @returns Numeric performance score
 */
export function computePerformanceScore(
  stats: Record<string, number>,
  sport: string
): number {
  try {
    if (sport === "football") {
      return (
        (findStat(stats, ["rushingYards", "rush_yds", "rushYards"]) * 1) +
        (findStat(stats, ["receivingYards", "rec_yds", "recYards"]) * 1) +
        (findStat(stats, ["passingYards", "pass_yds", "passYards"]) * 0.5) +
        (findStat(stats, ["touchdowns", "total_td", "TD"]) * 6) +
        (findStat(stats, ["interceptions", "int_thrown", "INT"]) * -3) +
        (findStat(stats, ["sacks", "sackYards"]) * 2)
      );
    }

    if (sport === "basketball") {
      return (
        (findStat(stats, ["points", "pts", "PTS"]) * 1) +
        (findStat(stats, ["rebounds", "reb", "REB", "totalRebounds"]) * 1.2) +
        (findStat(stats, ["assists", "ast", "AST"]) * 1.5) +
        (findStat(stats, ["steals", "stl", "STL"]) * 2) +
        (findStat(stats, ["blocks", "blk", "BLK"]) * 2) +
        (findStat(stats, ["turnovers", "to", "TO"]) * -1)
      );
    }

    if (sport === "baseball") {
      return (
        (findStat(stats, ["hits", "H"]) * 2) +
        (findStat(stats, ["RBI", "rbi"]) * 2) +
        (findStat(stats, ["homeRuns", "hr", "HR"]) * 4) +
        (findStat(stats, ["stolenBases", "sb", "SB"]) * 2) +
        (findStat(stats, ["inningsPitched", "ip", "IP"]) * 3) +
        (findStat(stats, ["strikeouts", "k_pitched", "SO", "K"]) * 1) +
        (findStat(stats, ["earnedRuns", "er", "ER"]) * -2)
      );
    }

    // Fallback: sum all positive stats
    return Object.values(stats).reduce(
      (sum, val) => sum + Math.max(0, val),
      0
    );
  } catch (err) {
    console.error("computePerformanceScore failed:", err);
    return 0;
  }
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Finds the first matching stat from a list of possible key names.
 * ESPN uses inconsistent naming across sports and endpoints.
 */
function findStat(stats: Record<string, number>, keys: string[]): number {
  for (const key of keys) {
    if (key in stats) return stats[key];
    // Also check case-insensitive
    const lower = key.toLowerCase();
    for (const [k, v] of Object.entries(stats)) {
      if (k.toLowerCase() === lower) return v;
    }
  }
  return 0;
}

/**
 * Assigns a recap tier based on performance score and sport.
 * Returns: 1=Spotlight, 2=BoxScore, 3=AlsoActive
 * Thresholds are calibrated per sport.
 */
function assignTier(score: number, sport: string): number {
  if (sport === "football") {
    if (score >= 30) return 1;
    if (score >= 5) return 2;
    return 3;
  }

  if (sport === "basketball") {
    if (score >= 35) return 1;
    if (score >= 10) return 2;
    return 3;
  }

  if (sport === "baseball") {
    if (score >= 15) return 1;
    if (score >= 4) return 2;
    return 3;
  }

  // Default thresholds
  if (score >= 25) return 1;
  if (score >= 5) return 2;
  return 3;
}

// ============================================================================
// SUPABASE CACHING
// ============================================================================

/**
 * Caches scoreboard results in Supabase game_scores_cache table.
 * Upserts by espn_event_id.
 *
 * @param games - Array of game scores to cache
 */
export async function cacheScoreboard(games: GameScore[]): Promise<void> {
  if (games.length === 0) return;

  try {
    const supabase = await createClient();

    const rows = games.map((g) => ({
      espn_event_id: g.id,
      league: g.league,
      game_date: g.date,
      home_team_id: g.homeTeam.id,
      away_team_id: g.awayTeam.id,
      home_team_name: g.homeTeam.name,
      away_team_name: g.awayTeam.name,
      home_score: g.homeScore,
      away_score: g.awayScore,
      status: g.status,
      has_philly_connection: g.hasPhillyConnection,
      raw_json: g,
      fetched_at: new Date().toISOString(),
    }));

    const { error } = await (supabase as any)
      .from("game_scores_cache")
      .upsert(rows, { onConflict: "espn_event_id" });

    if (error) {
      console.error("Failed to cache scoreboard:", error);
    }
  } catch (err) {
    console.error("cacheScoreboard failed:", err);
  }
}

/**
 * Caches a box score detail in Supabase game_scores_cache (updates raw_json).
 *
 * @param boxScore - The box score detail to cache
 */
export async function cacheBoxScore(
  boxScore: BoxScoreDetail
): Promise<void> {
  try {
    const supabase = await createClient();

    // Update the existing game_scores_cache row with full box score data
    const { error } = await (supabase as any)
      .from("game_scores_cache")
      .update({
        raw_json: boxScore,
        fetched_at: new Date().toISOString(),
      })
      .eq("espn_event_id", boxScore.gameId);

    if (error) {
      console.error("Failed to cache box score:", error);
    }
  } catch (err) {
    console.error("cacheBoxScore failed:", err);
  }
}

/**
 * Caches matched player performances in Supabase nlt_game_performances table.
 * Requires a game_scores_cache row to exist first (for FK).
 *
 * @param gameDbId - The game_scores_cache.id (integer FK)
 * @param matches - Array of performance matches to cache
 */
export async function cachePerformances(
  gameDbId: number,
  matches: PerformanceMatch[]
): Promise<void> {
  if (matches.length === 0) return;

  try {
    const supabase = await createClient();

    const rows = matches.map((m) => ({
      nlt_id: m.nltId,
      game_id: gameDbId,
      player_name: m.playerName,
      team_name: m.teamName,
      sport: m.sport,
      stats: m.stats,
      performance_score: m.performanceScore,
      recap_tier: m.recapTier,
      high_school: m.highSchool || null,
      high_school_id: m.highSchoolId || null,
    }));

    const { error } = await (supabase as any)
      .from("nlt_game_performances")
      .insert(rows);

    if (error) {
      console.error("Failed to cache performances:", error);
    }
  } catch (err) {
    console.error("cachePerformances failed:", err);
  }
}
