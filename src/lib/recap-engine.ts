// ============================================================================
// Recap Engine — Performance Scoring, Tier Assignment, AI Narrative Generation
// ============================================================================
// Used by the /api/cron/generate-recaps cron job to produce the three-tier
// "Our Guys" recap system: Spotlight / Box Score / Also Active.
// ============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GamePerformance {
  id: number;
  nltId: number;
  gameId: number;
  playerName: string;
  teamName: string;
  sport: string;
  stats: Record<string, number>;
  teamStats?: Record<string, number> | null;
  recapTier: number;
  performanceScore: number;
  highSchool: string | null;
  highSchoolId: number | null;
}

export interface SpotlightPlayer extends GamePerformance {
  opponent: string;
  gameResult: string; // "W 31-20" or "L 17-24"
  schoolName: string; // HS name for narrative
}

export interface HSCareerStats {
  rushYards?: number;
  passingYards?: number;
  receivingYards?: number;
  totalTDs?: number;
  points?: number;
  ppg?: number;
  awards?: string[];
  careerRanking?: string; // e.g. "3rd all-time at Imhotep"
}

export interface TieredRecap {
  spotlight: GamePerformance[];
  boxScore: GamePerformance[];
  alsoActive: GamePerformance[];
  date: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Minimum performance score to qualify for Tier 1 (Spotlight). */
const SPOTLIGHT_THRESHOLD = 15;

/** Minimum performance score to qualify for Tier 2 (Box Score). */
const BOX_SCORE_THRESHOLD = 3;

/** Guaranteed minimum number of Spotlight players (if enough performances). */
const MIN_SPOTLIGHT = 3;

/** Maximum number of Spotlight players per recap. */
const MAX_SPOTLIGHT = 5;

// ---------------------------------------------------------------------------
// AI Prompt Templates
// ---------------------------------------------------------------------------

const SPOTLIGHT_SYSTEM_PROMPT = `You are the editorial voice of Philly Sports Pack — a Philly sports lifer talking to your people at the bar. You know these kids grew up in Philly, you watched them in high school. Write a 2-3 sentence recap that ties their performance back to their Philly roots. Be conversational, passionate, knowledgeable. Reference the high school by name. If they had a monster game, hype it up. If they struggled, keep it real but respectful — that's still our guy.`;

const DYK_SYSTEM_PROMPT = `Generate a "Did You Know?" fact that connects this player's high school career to their performance last night. One sentence max. Make it surprising or impressive.`;

// ---------------------------------------------------------------------------
// Core Functions
// ---------------------------------------------------------------------------

/**
 * Assign recap tiers to an array of game performances for a single date.
 *
 * - Tier 1 (Spotlight): Top 3-5 by score (min threshold applies)
 * - Tier 2 (Box Score): Meaningful stats but not top tier
 * - Tier 3 (Also Active): On roster / active but no notable stat line
 */
export function assignRecapTiers(performances: GamePerformance[]): TieredRecap {
  const date = getRecapDate();

  if (performances.length === 0) {
    return { spotlight: [], boxScore: [], alsoActive: [], date };
  }

  // Sort descending by performance score
  const sorted = [...performances].sort(
    (a, b) => b.performanceScore - a.performanceScore
  );

  const spotlight: GamePerformance[] = [];
  const boxScore: GamePerformance[] = [];
  const alsoActive: GamePerformance[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const perf = sorted[i];

    // Tier 1: top players above threshold (guarantee at least MIN_SPOTLIGHT)
    const isAboveThreshold = perf.performanceScore >= SPOTLIGHT_THRESHOLD;
    const isInMinSlots = i < MIN_SPOTLIGHT && perf.performanceScore > 0;
    const spotlightNotFull = spotlight.length < MAX_SPOTLIGHT;

    if (spotlightNotFull && (isAboveThreshold || isInMinSlots)) {
      spotlight.push({ ...perf, recapTier: 1 });
    } else if (perf.performanceScore >= BOX_SCORE_THRESHOLD) {
      boxScore.push({ ...perf, recapTier: 2 });
    } else {
      alsoActive.push({ ...perf, recapTier: 3 });
    }
  }

  return { spotlight, boxScore, alsoActive, date };
}

/**
 * Build the AI prompt for a single Tier 1 (Spotlight) player narrative.
 * Returns the user-facing prompt string; the system prompt is separate.
 */
export function generateSpotlightNarrative(player: SpotlightPlayer): string {
  const statLine = formatStatLine(player.stats, player.sport);
  const school = player.schoolName || player.highSchool || "a Philly school";

  return [
    `Player: ${player.playerName}`,
    `High School: ${school}`,
    `Current Team: ${player.teamName}`,
    `Opponent: ${player.opponent}`,
    `Result: ${player.gameResult}`,
    `Stat Line: ${statLine}`,
    "",
    "Write a 2-3 sentence spotlight recap for this player.",
  ].join("\n");
}

/**
 * Build the AI prompt for a reactive "Did You Know?" fact that bridges the
 * player's HS career to last night's performance.
 *
 * Returns empty string when no HS stats are available (skip DYK).
 */
export function generateReactiveDYK(
  player: SpotlightPlayer,
  hsStats: HSCareerStats | null
): string {
  if (!hsStats) return "";

  const statLine = formatStatLine(player.stats, player.sport);
  const school = player.schoolName || player.highSchool || "a Philly school";

  const hsFacts: string[] = [];
  if (hsStats.rushYards) hsFacts.push(`${hsStats.rushYards} career rush yards`);
  if (hsStats.passingYards)
    hsFacts.push(`${hsStats.passingYards} career passing yards`);
  if (hsStats.receivingYards)
    hsFacts.push(`${hsStats.receivingYards} career receiving yards`);
  if (hsStats.totalTDs) hsFacts.push(`${hsStats.totalTDs} career TDs`);
  if (hsStats.points) hsFacts.push(`${hsStats.points} career points`);
  if (hsStats.ppg) hsFacts.push(`${hsStats.ppg} PPG`);
  if (hsStats.awards && hsStats.awards.length > 0)
    hsFacts.push(`Awards: ${hsStats.awards.join(", ")}`);
  if (hsStats.careerRanking) hsFacts.push(hsStats.careerRanking);

  if (hsFacts.length === 0) return "";

  return [
    `Player: ${player.playerName}`,
    `High School: ${school}`,
    `Last Night: ${statLine} (${player.gameResult} vs ${player.opponent})`,
    `HS Career Highlights: ${hsFacts.join("; ")}`,
    "",
    'Generate a one-sentence "Did You Know?" fact connecting their HS career to last night.',
  ].join("\n");
}

/**
 * Finds the first matching stat from a list of possible key names.
 * ESPN uses inconsistent naming across sports and endpoints (e.g. PTS vs points).
 */
function findStat(stats: Record<string, number>, keys: string[]): number {
  for (const key of keys) {
    if (key in stats) return stats[key];
    const lower = key.toLowerCase();
    for (const [k, v] of Object.entries(stats)) {
      if (k.toLowerCase() === lower) return v;
    }
  }
  return 0;
}

/** Check if any of the given stat keys exist in the object. */
function hasStat(stats: Record<string, number>, keys: string[]): boolean {
  return findStat(stats, keys) !== 0 || keys.some((k) => {
    const lower = k.toLowerCase();
    return Object.keys(stats).some((sk) => sk.toLowerCase() === lower);
  });
}

/**
 * Format a raw stat JSON object into a human-readable one-liner.
 * Handles both ESPN uppercase keys (PTS, REB, AST) and lowercase variants.
 */
export function formatStatLine(
  stats: Record<string, number>,
  sport: string
): string {
  if (!stats || Object.keys(stats).length === 0) return "No stats recorded";

  switch (sport.toLowerCase()) {
    case "football":
    case "nfl":
    case "cfb": {
      const parts: string[] = [];
      // Rushing
      const rushCar = findStat(stats, ["rush_carries", "CAR", "rushingAttempts", "carries"]);
      const rushYds = findStat(stats, ["rush_yards", "YDS", "rushingYards", "rushYards"]);
      const rushTd = findStat(stats, ["rush_td", "TD", "rushingTouchdowns"]);
      if (rushCar || rushYds) {
        parts.push(
          `${rushCar} car, ${rushYds} yds${rushTd ? `, ${rushTd} TD` : ""}`
        );
      }
      // Passing
      const passComp = findStat(stats, ["pass_completions", "C/ATT", "completions"]);
      const passAtt = findStat(stats, ["pass_attempts", "passingAttempts"]);
      const passYds = findStat(stats, ["pass_yards", "passingYards", "passYards"]);
      const passTd = findStat(stats, ["pass_td", "passingTouchdowns"]);
      const ints = findStat(stats, ["interceptions", "INT", "int_thrown"]);
      if (passComp || passYds) {
        parts.push(
          `${passComp}/${passAtt}, ${passYds} pass yds${passTd ? `, ${passTd} TD` : ""}${ints ? `, ${ints} INT` : ""}`
        );
      }
      // Receiving
      const recCat = findStat(stats, ["rec_catches", "REC", "receptions"]);
      const recYds = findStat(stats, ["rec_yards", "receivingYards", "recYards"]);
      const recTd = findStat(stats, ["rec_td", "receivingTouchdowns"]);
      if (recCat || recYds) {
        parts.push(
          `${recCat} rec, ${recYds} yds${recTd ? `, ${recTd} TD` : ""}`
        );
      }
      // Scoring only (kicker, return TD, etc.)
      if (parts.length === 0) {
        const pts = findStat(stats, ["points", "PTS"]);
        if (pts) parts.push(`${pts} pts`);
      }
      return parts.join(" | ") || "Active";
    }

    case "basketball":
    case "nba":
    case "cbb": {
      const parts: string[] = [];
      const pts = findStat(stats, ["PTS", "points", "pts"]);
      const reb = findStat(stats, ["REB", "rebounds", "reb", "totalRebounds"]);
      const ast = findStat(stats, ["AST", "assists", "ast"]);
      const stl = findStat(stats, ["STL", "steals", "stl"]);
      const blk = findStat(stats, ["BLK", "blocks", "blk"]);
      if (pts || hasStat(stats, ["PTS", "points", "pts"])) parts.push(`${pts} pts`);
      if (reb || hasStat(stats, ["REB", "rebounds", "reb"])) parts.push(`${reb} reb`);
      if (ast || hasStat(stats, ["AST", "assists", "ast"])) parts.push(`${ast} ast`);
      if (stl > 0) parts.push(`${stl} stl`);
      if (blk > 0) parts.push(`${blk} blk`);
      return parts.join(", ") || "Active";
    }

    case "baseball":
    case "mlb": {
      const parts: string[] = [];
      const hits = findStat(stats, ["hits", "H"]);
      const ab = findStat(stats, ["at_bats", "AB"]);
      if (hits || ab) {
        parts.push(`${hits}-${ab}`);
      }
      const rbi = findStat(stats, ["rbi", "RBI"]);
      if (rbi > 0) parts.push(`${rbi} RBI`);
      const hr = findStat(stats, ["home_runs", "HR", "homeRuns"]);
      if (hr > 0) parts.push(`${hr} HR`);
      const runs = findStat(stats, ["runs", "R"]);
      if (runs > 0) parts.push(`${runs} R`);
      const sb = findStat(stats, ["stolen_bases", "SB", "stolenBases"]);
      if (sb > 0) parts.push(`${sb} SB`);
      // Pitching
      const ip = findStat(stats, ["innings_pitched", "IP", "inningsPitched"]);
      if (ip) {
        const k = findStat(stats, ["strikeouts", "K", "SO"]);
        const er = findStat(stats, ["earned_runs", "ER", "earnedRuns"]);
        parts.push(
          `${ip} IP, ${k} K${er ? `, ${er} ER` : ""}`
        );
      }
      return parts.join(", ") || "Active";
    }

    default: {
      // Generic fallback: list all non-zero stats
      const parts = Object.entries(stats)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${v} ${k.replace(/_/g, " ")}`);
      return parts.join(", ") || "Active";
    }
  }
}

/**
 * Return yesterday's date in YYYY-MM-DD format.
 * Recaps are generated the morning after game day.
 */
export function getRecapDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().slice(0, 10);
}

/**
 * Return the system prompt for spotlight narratives.
 */
export function getSpotlightSystemPrompt(): string {
  return SPOTLIGHT_SYSTEM_PROMPT;
}

/**
 * Return the system prompt for DYK facts.
 */
export function getDYKSystemPrompt(): string {
  return DYK_SYSTEM_PROMPT;
}
