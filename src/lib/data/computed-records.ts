import { createStaticClient } from "@/lib/supabase/static";
import { withErrorHandling } from "@/lib/errors";
import { withRetry } from "@/lib/retry";
import type { Player, School } from "@/lib/data/common";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ComputedRecord {
  stat_category: string; // "Rushing", "Passing", "Receiving", "Scoring", etc.
  stat_name: string; // "Rush Yards", "Pass TDs", "Points", etc.
  scope: "career" | "season"; // career or single-season
  rank: number;
  value: number;
  display_value: string; // formatted: "2,847 yds" or "42 TDs"
  player_name: string;
  player_slug: string;
  school_name: string;
  school_slug: string;
  season_label: string | null; // for season records: "2019-20"
  year: number | null;
  source: "computed";
}

export interface StatDefinition {
  key: string; // column name from stats table
  name: string; // display name
  category: string; // grouping category
  unit: string; // "yds", "TDs", "pts", etc.
  scope: "career" | "season";
  minGames?: number; // minimum games for rate stats
  minValue?: number; // minimum value (e.g., 30 AB for batting avg)
  orderDir: "desc" | "asc"; // desc for most, asc for lowest ERA
  isRate?: boolean; // if true, value is already a rate (ppg, era, etc.)
  format?: (val: number) => string; // custom formatter
}

interface RawStatRow {
  player_id: number;
  school_id: number;
  player_name: string;
  player_slug: string;
  school_name: string;
  school_slug: string;
  season_id?: number;
  season_label?: string;
  year_start?: number;
  stat_value: number;
  games_played?: number;
}

// ============================================================================
// STAT DEFINITIONS BY SPORT
// ============================================================================

const FB_STAT_DEFS: Record<string, StatDefinition> = {
  // RUSHING
  "rush-career": {
    key: "rush_yards",
    name: "Career Rushing Yards",
    category: "Rushing",
    unit: "yds",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} yds`,
  },
  "rush-career-td": {
    key: "rush_td",
    name: "Career Rushing TDs",
    category: "Rushing",
    unit: "TDs",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${v || 0} TDs`,
  },
  "rush-season": {
    key: "rush_yards",
    name: "Season Rushing Yards",
    category: "Rushing",
    unit: "yds",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} yds`,
  },
  "rush-season-td": {
    key: "rush_td",
    name: "Season Rushing TDs",
    category: "Rushing",
    unit: "TDs",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${v || 0} TDs`,
  },
  "rush-season-carries": {
    key: "rush_carries",
    name: "Season Rushing Carries",
    category: "Rushing",
    unit: "carries",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${v || 0} carries`,
  },
  // PASSING
  "pass-career": {
    key: "pass_yards",
    name: "Career Passing Yards",
    category: "Passing",
    unit: "yds",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} yds`,
  },
  "pass-career-td": {
    key: "pass_td",
    name: "Career Passing TDs",
    category: "Passing",
    unit: "TDs",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${v || 0} TDs`,
  },
  "pass-season": {
    key: "pass_yards",
    name: "Season Passing Yards",
    category: "Passing",
    unit: "yds",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} yds`,
  },
  "pass-season-td": {
    key: "pass_td",
    name: "Season Passing TDs",
    category: "Passing",
    unit: "TDs",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${v || 0} TDs`,
  },
  "pass-season-comp": {
    key: "pass_comp",
    name: "Season Pass Completions",
    category: "Passing",
    unit: "comps",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${v || 0} comps`,
  },
  // RECEIVING
  "rec-career": {
    key: "rec_yards",
    name: "Career Receiving Yards",
    category: "Receiving",
    unit: "yds",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} yds`,
  },
  "rec-career-td": {
    key: "rec_td",
    name: "Career Receiving TDs",
    category: "Receiving",
    unit: "TDs",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${v || 0} TDs`,
  },
  "rec-season": {
    key: "rec_yards",
    name: "Season Receiving Yards",
    category: "Receiving",
    unit: "yds",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} yds`,
  },
  "rec-season-td": {
    key: "rec_td",
    name: "Season Receiving TDs",
    category: "Receiving",
    unit: "TDs",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${v || 0} TDs`,
  },
  "rec-season-receptions": {
    key: "receptions",
    name: "Season Receptions",
    category: "Receiving",
    unit: "receptions",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${v || 0} rec`,
  },
  // SCORING
  "score-career-td": {
    key: "total_td",
    name: "Career Total TDs",
    category: "Scoring",
    unit: "TDs",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${v || 0} TDs`,
  },
  "score-career-points": {
    key: "points",
    name: "Career Points",
    category: "Scoring",
    unit: "pts",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} pts`,
  },
  "score-season-td": {
    key: "total_td",
    name: "Season Total TDs",
    category: "Scoring",
    unit: "TDs",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${v || 0} TDs`,
  },
  "score-season-points": {
    key: "points",
    name: "Season Points",
    category: "Scoring",
    unit: "pts",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} pts`,
  },
  // DEFENSE
  "def-career-tackles": {
    key: "tackles",
    name: "Career Tackles",
    category: "Defense",
    unit: "tackles",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} tackles`,
  },
  "def-career-sacks": {
    key: "sacks",
    name: "Career Sacks",
    category: "Defense",
    unit: "sacks",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} sacks`,
  },
  "def-career-int": {
    key: "interceptions",
    name: "Career Interceptions",
    category: "Defense",
    unit: "ints",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} ints`,
  },
  "def-season-tackles": {
    key: "tackles",
    name: "Season Tackles",
    category: "Defense",
    unit: "tackles",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} tackles`,
  },
  "def-season-sacks": {
    key: "sacks",
    name: "Season Sacks",
    category: "Defense",
    unit: "sacks",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} sacks`,
  },
  "def-season-int": {
    key: "interceptions",
    name: "Season Interceptions",
    category: "Defense",
    unit: "ints",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} ints`,
  },
};

const BB_STAT_DEFS: Record<string, StatDefinition> = {
  // SCORING
  "score-career": {
    key: "points",
    name: "Career Points",
    category: "Scoring",
    unit: "pts",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} pts`,
  },
  "score-season": {
    key: "points",
    name: "Season Points",
    category: "Scoring",
    unit: "pts",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} pts`,
  },
  "score-season-ppg": {
    key: "ppg",
    name: "Season PPG",
    category: "Scoring",
    unit: "ppg",
    scope: "season",
    minGames: 10,
    orderDir: "desc",
    isRate: true,
    format: (v) => `${(v || 0).toFixed(1)} ppg`,
  },
  // REBOUNDS
  "reb-career": {
    key: "rebounds",
    name: "Career Rebounds",
    category: "Rebounds",
    unit: "rebs",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} rebs`,
  },
  "reb-season": {
    key: "rebounds",
    name: "Season Rebounds",
    category: "Rebounds",
    unit: "rebs",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} rebs`,
  },
  "reb-season-rpg": {
    key: "rpg",
    name: "Season RPG",
    category: "Rebounds",
    unit: "rpg",
    scope: "season",
    minGames: 10,
    orderDir: "desc",
    isRate: true,
    format: (v) => `${(v || 0).toFixed(1)} rpg`,
  },
  // ASSISTS
  "ast-career": {
    key: "assists",
    name: "Career Assists",
    category: "Assists",
    unit: "asts",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} asts`,
  },
  "ast-season": {
    key: "assists",
    name: "Season Assists",
    category: "Assists",
    unit: "asts",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} asts`,
  },
  "ast-season-apg": {
    key: "apg",
    name: "Season APG",
    category: "Assists",
    unit: "apg",
    scope: "season",
    minGames: 10,
    orderDir: "desc",
    isRate: true,
    format: (v) => `${(v || 0).toFixed(1)} apg`,
  },
  // STEALS
  "steal-career": {
    key: "steals",
    name: "Career Steals",
    category: "Steals",
    unit: "steals",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} steals`,
  },
  "steal-season": {
    key: "steals",
    name: "Season Steals",
    category: "Steals",
    unit: "steals",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} steals`,
  },
  // BLOCKS
  "block-career": {
    key: "blocks",
    name: "Career Blocks",
    category: "Blocks",
    unit: "blks",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} blks`,
  },
  "block-season": {
    key: "blocks",
    name: "Season Blocks",
    category: "Blocks",
    unit: "blks",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} blks`,
  },
  // SHOOTING
  "shoot-season-fg": {
    key: "fg_pct",
    name: "Season FG%",
    category: "Shooting",
    unit: "%",
    scope: "season",
    minValue: 50,
    orderDir: "desc",
    isRate: true,
    format: (v) => `${(v || 0).toFixed(1)}%`,
  },
  "shoot-season-ft": {
    key: "ft_pct",
    name: "Season FT%",
    category: "Shooting",
    unit: "%",
    scope: "season",
    minValue: 30,
    orderDir: "desc",
    isRate: true,
    format: (v) => `${(v || 0).toFixed(1)}%`,
  },
  "shoot-season-3p": {
    key: "three_pm",
    name: "Season 3-Pointers",
    category: "Shooting",
    unit: "3PM",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} 3PM`,
  },
};

const BASE_STAT_DEFS: Record<string, StatDefinition> = {
  // BATTING
  "bat-career-hits": {
    key: "hits",
    name: "Career Hits",
    category: "Batting",
    unit: "hits",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} hits`,
  },
  "bat-career-hr": {
    key: "home_runs",
    name: "Career Home Runs",
    category: "Batting",
    unit: "HRs",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} HRs`,
  },
  "bat-career-rbi": {
    key: "rbi",
    name: "Career RBIs",
    category: "Batting",
    unit: "RBIs",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} RBIs`,
  },
  "bat-season-avg": {
    key: "batting_avg",
    name: "Season Batting Avg",
    category: "Batting",
    unit: "avg",
    scope: "season",
    minValue: 30,
    orderDir: "desc",
    isRate: true,
    format: (v) => `${(v || 0).toFixed(3)}`,
  },
  "bat-season-hits": {
    key: "hits",
    name: "Season Hits",
    category: "Batting",
    unit: "hits",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} hits`,
  },
  "bat-season-hr": {
    key: "home_runs",
    name: "Season Home Runs",
    category: "Batting",
    unit: "HRs",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} HRs`,
  },
  "bat-season-rbi": {
    key: "rbi",
    name: "Season RBIs",
    category: "Batting",
    unit: "RBIs",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} RBIs`,
  },
  "bat-season-runs": {
    key: "runs",
    name: "Season Runs",
    category: "Batting",
    unit: "runs",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} runs`,
  },
  "bat-season-sb": {
    key: "stolen_bases",
    name: "Season Stolen Bases",
    category: "Batting",
    unit: "SBs",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} SBs`,
  },
  // PITCHING
  "pit-career-wins": {
    key: "wins",
    name: "Career Wins",
    category: "Pitching",
    unit: "W",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} W`,
  },
  "pit-career-k": {
    key: "strikeouts_p",
    name: "Career Strikeouts",
    category: "Pitching",
    unit: "Ks",
    scope: "career",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} Ks`,
  },
  "pit-season-wins": {
    key: "wins",
    name: "Season Wins",
    category: "Pitching",
    unit: "W",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} W`,
  },
  "pit-season-era": {
    key: "era",
    name: "Season ERA",
    category: "Pitching",
    unit: "ERA",
    scope: "season",
    minValue: 20,
    orderDir: "asc",
    isRate: true,
    format: (v) => `${(v || 0).toFixed(2)}`,
  },
  "pit-season-k": {
    key: "strikeouts_p",
    name: "Season Strikeouts",
    category: "Pitching",
    unit: "Ks",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} Ks`,
  },
  "pit-season-saves": {
    key: "saves",
    name: "Season Saves",
    category: "Pitching",
    unit: "SV",
    scope: "season",
    orderDir: "desc",
    format: (v) => `${(v || 0).toLocaleString()} SV`,
  },
};

export const SPORT_STAT_DEFS: Record<string, Record<string, StatDefinition>> = {
  football: FB_STAT_DEFS,
  basketball: BB_STAT_DEFS,
  baseball: BASE_STAT_DEFS,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatStatValue(value: number | null | undefined, def: StatDefinition): string {
  if (value === null || value === undefined) return "0";
  if (def.format) return def.format(value);
  if (def.unit === "yds") return `${(value || 0).toLocaleString()} yds`;
  if (def.unit === "pts") return `${(value || 0).toLocaleString()} pts`;
  if (def.unit === "TDs") return `${(value || 0)} TDs`;
  if (def.unit === "%") return `${(value || 0).toFixed(1)}%`;
  if (def.unit === "avg") return `${(value || 0).toFixed(3)}`;
  return String(value);
}

async function aggregateCareerStats(
  tableName: string,
  statKey: string,
  def: StatDefinition,
  sportSlug: string,
  limit: number = 25
): Promise<ComputedRecord[]> {
  const client = createStaticClient();

  // Use server-side RPC function for proper aggregation across ALL rows
  const { data: rows, error } = await client.rpc("get_career_leaders", {
    p_table_name: tableName,
    p_stat_column: statKey,
    p_order_dir: def.orderDir,
    p_limit: limit,
  });

  if (error || !rows) {
    console.error(`Career leaders RPC error for ${tableName}.${statKey}:`, error);
    return [];
  }

  return (rows as any[]).map((row, idx) => ({
    stat_category: def.category,
    stat_name: def.name,
    scope: "career" as const,
    rank: idx + 1,
    value: Number(row.stat_value) || 0,
    display_value: formatStatValue(Number(row.stat_value) || 0, def),
    player_name: row.player_name || "Unknown",
    player_slug: row.player_slug || "",
    school_name: row.school_name || "Unknown",
    school_slug: row.school_slug || "",
    season_label: null,
    year: null,
    source: "computed" as const,
  }));
}

async function fetchSeasonLeaders(
  tableName: string,
  statKey: string,
  def: StatDefinition,
  sportSlug: string,
  limit: number = 25
): Promise<ComputedRecord[]> {
  const client = createStaticClient();

  // Use server-side RPC function for proper ordering across ALL rows
  const { data: rows, error } = await client.rpc("get_season_leaders", {
    p_table_name: tableName,
    p_stat_column: statKey,
    p_order_dir: def.orderDir,
    p_limit: limit,
    p_min_games: def.minGames || 0,
  });

  if (error || !rows) {
    console.error(`Season leaders RPC error for ${tableName}.${statKey}:`, error);
    return [];
  }

  return (rows as any[]).map((row, idx) => ({
    stat_category: def.category,
    stat_name: def.name,
    scope: "season" as const,
    rank: idx + 1,
    value: Number(row.stat_value) || 0,
    display_value: formatStatValue(Number(row.stat_value) || 0, def),
    player_name: row.player_name || "Unknown",
    player_slug: row.player_slug || "",
    school_name: row.school_name || "Unknown",
    school_slug: row.school_slug || "",
    season_label: row.season_label || null,
    year: row.year_start || null,
    source: "computed" as const,
  }));
}

// ============================================================================
// PUBLIC API FUNCTIONS
// ============================================================================

/**
 * Get career leaders for a specific stat (sum across all seasons for each player)
 */
export async function getComputedCareerLeaders(
  sportSlug: string,
  statKey: string,
  limit: number = 25
): Promise<ComputedRecord[]> {
  return withErrorHandling(
    async () => {
      return withRetry(async () => {
        const defs = SPORT_STAT_DEFS[sportSlug];
        if (!defs) return [];

        const def = defs[statKey];
        if (!def || def.scope !== "career") return [];

        let tableName = "";
        if (sportSlug === "football") tableName = "football_player_seasons";
        else if (sportSlug === "basketball") tableName = "basketball_player_seasons";
        else if (sportSlug === "baseball") tableName = "baseball_player_seasons";
        else return [];

        return aggregateCareerStats(tableName, def.key, def, sportSlug, limit);
      }, { maxRetries: 2, baseDelay: 500 });
    },
    [],
    "COMPUTED_CAREER_LEADERS",
    { sportSlug, statKey }
  );
}

/**
 * Get single-season leaders for a specific stat
 */
export async function getComputedSeasonLeaders(
  sportSlug: string,
  statKey: string,
  limit: number = 25
): Promise<ComputedRecord[]> {
  return withErrorHandling(
    async () => {
      return withRetry(async () => {
        const defs = SPORT_STAT_DEFS[sportSlug];
        if (!defs) return [];

        const def = defs[statKey];
        if (!def || def.scope !== "season") return [];

        let tableName = "";
        if (sportSlug === "football") tableName = "football_player_seasons";
        else if (sportSlug === "basketball") tableName = "basketball_player_seasons";
        else if (sportSlug === "baseball") tableName = "baseball_player_seasons";
        else return [];

        return fetchSeasonLeaders(tableName, def.key, def, sportSlug, limit);
      }, { maxRetries: 2, baseDelay: 500 });
    },
    [],
    "COMPUTED_SEASON_LEADERS",
    { sportSlug, statKey }
  );
}

/**
 * Get all computed records for a sport, organized by category
 * Returns top 10 for each stat category
 */
export async function getAllComputedRecords(
  sportSlug: string,
  limit: number = 10
): Promise<Record<string, ComputedRecord[]>> {
  return withErrorHandling(
    async () => {
      const defs = SPORT_STAT_DEFS[sportSlug];
      if (!defs) return {};

      const result: Record<string, ComputedRecord[]> = {};

      // Fetch all stat keys in parallel by category
      const promises: Promise<void>[] = [];
      for (const [key, def] of Object.entries(defs)) {
        promises.push(
          (async () => {
            let records: ComputedRecord[] = [];
            if (def.scope === "career") {
              records = await getComputedCareerLeaders(sportSlug, key, limit);
            } else {
              records = await getComputedSeasonLeaders(sportSlug, key, limit);
            }
            if (records.length > 0) {
              const category = def.category;
              if (!result[category]) {
                result[category] = [];
              }
              result[category].push(...records);
            }
          })()
        );
      }
      await Promise.all(promises);

      return result;
    },
    {},
    "COMPUTED_ALL_RECORDS",
    { sportSlug }
  );
}

/**
 * Get all computed records (career + season leaders) for a specific school
 */
export async function getSchoolRecordBook(
  sportSlug: string,
  schoolId: number
): Promise<Record<string, ComputedRecord[]>> {
  return withErrorHandling(
    async () => {
      const defs = SPORT_STAT_DEFS[sportSlug];
      if (!defs) return {};

      const client = createStaticClient();

      let tableName = "";
      if (sportSlug === "football") tableName = "football_player_seasons";
      else if (sportSlug === "basketball") tableName = "basketball_player_seasons";
      else if (sportSlug === "baseball") tableName = "baseball_player_seasons";
      else return {};

      // Fetch all seasons for this school — select * to avoid PostgREST template parsing issues
      const { data: schoolSeasons, error } = await client
        .from(tableName)
        .select("*, players(name, slug), schools(name, slug), seasons(label, year_start)")
        .eq("school_id", schoolId)
        .limit(500) as { data: any[] | null; error: any };

      if (error || !schoolSeasons) {
        return {};
      }

      const result: Record<string, ComputedRecord[]> = {};

      // For each stat definition, compute leader for this school
      for (const [key, def] of Object.entries(defs)) {
        const category = def.category;
        if (!result[category]) {
          result[category] = [];
        }

        if (def.scope === "career") {
          // Aggregate by player
          const aggregated = new Map<
            number,
            { player_id: number; value: number; player_name: string; player_slug: string }
          >();

          for (const row of schoolSeasons) {
            const statValue = (row as any)[def.key] || 0;
            const player = (row as any).players as Player | null;
            if (!player) continue;

            const existing = aggregated.get(row.player_id);
            if (existing) {
              existing.value += statValue;
            } else {
              aggregated.set(row.player_id, {
                player_id: row.player_id,
                value: statValue,
                player_name: player.name,
                player_slug: player.slug,
              });
            }
          }

          // Sort and format
          const sorted = Array.from(aggregated.values())
            .sort((a, b) => (def.orderDir === "asc" ? a.value - b.value : b.value - a.value))
            .slice(0, 3);

          result[category].push(
            ...sorted.map((item, idx) => ({
              stat_category: def.category,
              stat_name: def.name,
              scope: "career" as const,
              rank: idx + 1,
              value: item.value,
              display_value: formatStatValue(item.value, def),
              player_name: item.player_name,
              player_slug: item.player_slug,
              school_name: schoolSeasons[0]?.schools?.name || "Unknown",
              school_slug: schoolSeasons[0]?.schools?.slug || "",
              season_label: null,
              year: null,
              source: "computed" as const,
            }))
          );
        } else {
          // Season leaders
          const filtered = schoolSeasons.filter((row: any) => {
            const val = (row as any)[def.key];
            if (val === null || val === undefined) return false;

            // Check minimums
            if (def.minGames && (row as any).games_played < def.minGames) {
              return false;
            }
            if (def.minValue) {
              if (
                (def.key === "batting_avg" && (row as any).at_bats < def.minValue) ||
                (def.key === "era" && (row as any).innings_pitched < def.minValue)
              ) {
                return false;
              }
            }

            return true;
          });

          filtered.sort((a: any, b: any) => {
            const aVal = (a as any)[def.key] || 0;
            const bVal = (b as any)[def.key] || 0;
            return def.orderDir === "asc" ? aVal - bVal : bVal - aVal;
          });

          result[category].push(
            ...filtered.slice(0, 3).map((row: any, idx: number) => {
              const player = row.players as Player | null;
              const season = row.seasons as any | null;
              return {
                stat_category: def.category,
                stat_name: def.name,
                scope: "season" as const,
                rank: idx + 1,
                value: (row as any)[def.key] || 0,
                display_value: formatStatValue((row as any)[def.key], def),
                player_name: player?.name || "Unknown",
                player_slug: player?.slug || "",
                school_name: schoolSeasons[0]?.schools?.name || "Unknown",
                school_slug: schoolSeasons[0]?.schools?.slug || "",
                season_label: season?.label || null,
                year: season?.year_start || null,
                source: "computed" as const,
              };
            })
          );
        }
      }

      return result;
    },
    {},
    "COMPUTED_SCHOOL_RECORD_BOOK",
    { sportSlug, schoolId }
  );
}

// ============================================================================
// COMPOUND LEADERBOARDS
// ============================================================================

export interface CompoundLeaderEntry {
  player_name: string;
  player_slug: string;
  school_name: string;
  school_slug: string;
  value: number;
  components: Record<string, number>;
}

export type CompoundCategory =
  | "dual-threat-qb"
  | "complete-back"
  | "defensive-impact"
  | "all-around-guard"
  | "double-double-machine";

interface CompoundCategoryDef {
  label: string;
  sport: string;
  description: string;
}

export const COMPOUND_CATEGORIES: Record<CompoundCategory, CompoundCategoryDef> = {
  "dual-threat-qb": {
    label: "Dual Threat QBs",
    sport: "football",
    description: "Pass yards + rush yards combined (min 5 games)",
  },
  "complete-back": {
    label: "Complete Backs",
    sport: "football",
    description: "Rush yards + rec yards + (rush TDs + rec TDs) x 50 (min 5 games)",
  },
  "defensive-impact": {
    label: "Defensive Impact",
    sport: "football",
    description: "Tackles + sacks x 2 + interceptions x 3",
  },
  "all-around-guard": {
    label: "All-Around Guards",
    sport: "basketball",
    description: "Points + assists x 2 + steals x 3",
  },
  "double-double-machine": {
    label: "Double-Double Machines",
    sport: "basketball",
    description: "PPG x RPG score (min 10 PPG and 8 RPG)",
  },
};

export function getCompoundCategoriesForSport(sport: string): CompoundCategory[] {
  return (Object.entries(COMPOUND_CATEGORIES) as [CompoundCategory, CompoundCategoryDef][])
    .filter(([, def]) => def.sport === sport)
    .map(([key]) => key);
}

/**
 * Get compound leaderboard data for a specific category.
 * Fetches current season stats and computes multi-column formulas client-side.
 */
export async function getCompoundLeaders(
  sport: string,
  category: CompoundCategory,
  limit: number = 10
): Promise<CompoundLeaderEntry[]> {
  return withErrorHandling(
    async () => {
      return withRetry(async () => {
        const client = createStaticClient();

        if (sport === "football") {
          const { data: rows, error } = await client
            .from("football_player_seasons")
            .select(
              "player_id, games_played, rush_yards, rush_td, pass_yards, pass_td, rec_yards, rec_td, tackles, sacks, interceptions, receptions, players(name, slug), schools(name, slug), season_id, seasons!inner(id, is_current)"
            )
            .eq("seasons.is_current", true)
            .limit(1000) as { data: any[] | null; error: any };

          if (error || !rows) return [];

          if (category === "dual-threat-qb") {
            return rows
              .filter((r: any) => (r.games_played || 0) >= 5 && ((r.pass_yards || 0) > 0))
              .map((r: any) => {
                const passYds = r.pass_yards || 0;
                const rushYds = r.rush_yards || 0;
                return {
                  player_name: r.players?.name || "Unknown",
                  player_slug: r.players?.slug || "",
                  school_name: r.schools?.name || "Unknown",
                  school_slug: r.schools?.slug || "",
                  value: passYds + rushYds,
                  components: { "Pass Yds": passYds, "Rush Yds": rushYds },
                };
              })
              .sort((a: CompoundLeaderEntry, b: CompoundLeaderEntry) => b.value - a.value)
              .slice(0, limit);
          }

          if (category === "complete-back") {
            return rows
              .filter((r: any) => (r.games_played || 0) >= 5 && ((r.rush_yards || 0) > 0))
              .map((r: any) => {
                const rushYds = r.rush_yards || 0;
                const recYds = r.rec_yards || 0;
                const rushTd = r.rush_td || 0;
                const recTd = r.rec_td || 0;
                return {
                  player_name: r.players?.name || "Unknown",
                  player_slug: r.players?.slug || "",
                  school_name: r.schools?.name || "Unknown",
                  school_slug: r.schools?.slug || "",
                  value: rushYds + recYds + (rushTd + recTd) * 50,
                  components: {
                    "Rush Yds": rushYds,
                    "Rec Yds": recYds,
                    "Rush TDs": rushTd,
                    "Rec TDs": recTd,
                  },
                };
              })
              .sort((a: CompoundLeaderEntry, b: CompoundLeaderEntry) => b.value - a.value)
              .slice(0, limit);
          }

          if (category === "defensive-impact") {
            return rows
              .filter(
                (r: any) =>
                  (r.tackles || 0) > 0 || (r.sacks || 0) > 0 || (r.interceptions || 0) > 0
              )
              .map((r: any) => {
                const tackles = r.tackles || 0;
                const sacks = r.sacks || 0;
                const ints = r.interceptions || 0;
                return {
                  player_name: r.players?.name || "Unknown",
                  player_slug: r.players?.slug || "",
                  school_name: r.schools?.name || "Unknown",
                  school_slug: r.schools?.slug || "",
                  value: tackles + sacks * 2 + ints * 3,
                  components: { Tackles: tackles, Sacks: sacks, INTs: ints },
                };
              })
              .sort((a: CompoundLeaderEntry, b: CompoundLeaderEntry) => b.value - a.value)
              .slice(0, limit);
          }
        }

        if (sport === "basketball") {
          const { data: rows, error } = await client
            .from("basketball_player_seasons")
            .select(
              "player_id, games_played, points, ppg, rebounds, rpg, assists, steals, players(name, slug), schools(name, slug), season_id, seasons!inner(id, is_current)"
            )
            .eq("seasons.is_current", true)
            .limit(1000) as { data: any[] | null; error: any };

          if (error || !rows) return [];

          if (category === "all-around-guard") {
            return rows
              .filter((r: any) => (r.points || 0) > 0 && (r.assists || 0) > 0)
              .map((r: any) => {
                const pts = r.points || 0;
                const ast = r.assists || 0;
                const stl = r.steals || 0;
                return {
                  player_name: r.players?.name || "Unknown",
                  player_slug: r.players?.slug || "",
                  school_name: r.schools?.name || "Unknown",
                  school_slug: r.schools?.slug || "",
                  value: pts + ast * 2 + stl * 3,
                  components: { Points: pts, Assists: ast, Steals: stl },
                };
              })
              .sort((a: CompoundLeaderEntry, b: CompoundLeaderEntry) => b.value - a.value)
              .slice(0, limit);
          }

          if (category === "double-double-machine") {
            return rows
              .filter((r: any) => (r.ppg || 0) >= 10 && (r.rpg || 0) >= 8)
              .map((r: any) => {
                const ppg = r.ppg || 0;
                const rpg = r.rpg || 0;
                return {
                  player_name: r.players?.name || "Unknown",
                  player_slug: r.players?.slug || "",
                  school_name: r.schools?.name || "Unknown",
                  school_slug: r.schools?.slug || "",
                  value: Math.round(ppg * rpg * 10) / 10,
                  components: { PPG: ppg, RPG: rpg },
                };
              })
              .sort((a: CompoundLeaderEntry, b: CompoundLeaderEntry) => b.value - a.value)
              .slice(0, limit);
          }
        }

        return [];
      }, { maxRetries: 2, baseDelay: 500 });
    },
    [],
    "COMPOUND_LEADERS",
    { sport, category }
  );
}

// ============================================================================
// RECORD WATCH
// ============================================================================

export interface RecordWatchEntry {
  player_name: string;
  player_slug: string;
  school_name: string;
  school_slug: string;
  stat_name: string;
  current_value: number;
  record_value: number;
  record_holder: string;
  record_year: number | null;
  games_played: number;
  estimated_games_remaining: number;
  pace_projection: number;
  on_pace: boolean;
  needs_per_game: number | null;
}

/**
 * Get Record Watch data: current season leaders vs all-time records.
 * Compares current season pace against season records.
 */
export async function getRecordWatchData(
  sport: string,
  seasonLength: number = 11
): Promise<RecordWatchEntry[]> {
  return withErrorHandling(
    async () => {
      return withRetry(async () => {
        const client = createStaticClient();

        // Fetch season-scope records for this sport
        const { data: records, error: recErr } = await client
          .from("records")
          .select("id, category, subcategory, scope, record_value, record_number, holder_name, year_set, sport_id")
          .eq("scope", "season")
          .limit(200);

        if (recErr || !records || records.length === 0) return [];

        // Filter records that have numeric values
        const numericRecords = records.filter(
          (r: any) => r.record_number != null && r.record_number > 0
        );

        if (numericRecords.length === 0) return [];

        // Map stat columns to labels for matching
        const statMappings: Record<string, { column: string; label: string }[]> = {
          football: [
            { column: "rush_yards", label: "Rush Yards" },
            { column: "rush_td", label: "Rush TDs" },
            { column: "pass_yards", label: "Pass Yards" },
            { column: "pass_td", label: "Pass TDs" },
            { column: "rec_yards", label: "Rec Yards" },
            { column: "tackles", label: "Tackles" },
            { column: "sacks", label: "Sacks" },
            { column: "interceptions", label: "INTs" },
          ],
          basketball: [
            { column: "points", label: "Points" },
            { column: "rebounds", label: "Rebounds" },
            { column: "assists", label: "Assists" },
            { column: "steals", label: "Steals" },
            { column: "blocks", label: "Blocks" },
            { column: "three_pm", label: "3-Pointers" },
          ],
        };

        const mappings = statMappings[sport];
        if (!mappings) return [];

        const tableName = sport === "football" ? "football_player_seasons" : "basketball_player_seasons";

        // Fetch current season leaders
        const { data: currentLeaders, error: leadErr } = await client
          .from(tableName)
          .select(
            "*, players(name, slug), schools(name, slug), seasons!inner(id, is_current)"
          )
          .eq("seasons.is_current", true)
          .limit(500) as { data: any[] | null; error: any };

        if (leadErr || !currentLeaders) return [];

        const results: RecordWatchEntry[] = [];

        for (const mapping of mappings) {
          // Find the matching record (fuzzy match on category/subcategory)
          const matchingRecord = numericRecords.find((r: any) => {
            const cat = (r.category || "").toLowerCase();
            const sub = (r.subcategory || "").toLowerCase();
            const label = mapping.label.toLowerCase();
            return cat.includes(label) || sub.includes(label) || label.includes(cat);
          });

          if (!matchingRecord) continue;

          const recordNum = Number(matchingRecord.record_number);
          if (!recordNum || recordNum <= 0) continue;

          // Find current season leader for this stat
          const sorted = currentLeaders
            .filter((r: any) => (r[mapping.column] || 0) > 0)
            .sort((a: any, b: any) => (b[mapping.column] || 0) - (a[mapping.column] || 0));

          const leader = sorted[0];
          if (!leader) continue;

          const currentVal = leader[mapping.column] || 0;
          const gamesPlayed = leader.games_played || 1;
          const gamesRemaining = Math.max(0, seasonLength - gamesPlayed);
          const perGame = currentVal / gamesPlayed;
          const paceProjection = Math.round(perGame * seasonLength);
          const onPace = paceProjection >= recordNum;
          const deficit = recordNum - currentVal;
          const needsPerGame =
            gamesRemaining > 0 ? Math.round((deficit / gamesRemaining) * 10) / 10 : null;

          // Only show if player is within 70% of record pace or ahead
          if (paceProjection < recordNum * 0.7) continue;

          results.push({
            player_name: leader.players?.name || "Unknown",
            player_slug: leader.players?.slug || "",
            school_name: leader.schools?.name || "Unknown",
            school_slug: leader.schools?.slug || "",
            stat_name: mapping.label,
            current_value: currentVal,
            record_value: recordNum,
            record_holder: matchingRecord.holder_name || "Unknown",
            record_year: matchingRecord.year_set || null,
            games_played: gamesPlayed,
            estimated_games_remaining: gamesRemaining,
            pace_projection: paceProjection,
            on_pace: onPace,
            needs_per_game: needsPerGame,
          });
        }

        // Sort by closest to record (highest ratio)
        results.sort(
          (a, b) => b.pace_projection / b.record_value - a.pace_projection / a.record_value
        );

        return results.slice(0, 8);
      }, { maxRetries: 2, baseDelay: 500 });
    },
    [],
    "RECORD_WATCH",
    { sport }
  );
}
