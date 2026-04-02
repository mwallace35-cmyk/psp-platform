import { cache } from "react";
import { createClient, withErrorHandling } from "./common";

// ============================================================================
// TYPES
// ============================================================================

export interface ScheduleSchool {
  id: number;
  name: string;
  slug: string;
  colors: Record<string, string> | null;
  city: string | null;
  league_id: number | null;
}

export interface ScheduleGame {
  id: number;
  game_date: string;
  game_time: string | null;
  game_type: string | null;
  home_score: number | null;
  away_score: number | null;
  notes: string | null;
  venue: string | null;
  playoff_round: string | null;
  home_school: ScheduleSchool | null;
  away_school: ScheduleSchool | null;
  has_box_score: boolean;
  sport_id?: string;
}

export interface ScheduleSeason {
  id: number;
  label: string;
  game_count: number;
}

export interface LeagueSchoolEntry {
  school_id: number;
  league_id: number;
  league_name: string;
  league_short: string;
  division: string | null;
  conference: string | null;
}

export interface ScheduleTeam {
  id: number;
  name: string;
  slug: string;
  colors: Record<string, string> | null;
  gameCount: number;
  league_id: number | null;
  division: string | null;
}

// ============================================================================
// LEAGUE DISPLAY ORDER
// ============================================================================

/** Canonical display order for leagues */
export const LEAGUE_DISPLAY_ORDER: Record<number, number> = {
  1: 0, // Catholic League
  2: 1, // Public League
  3: 2, // Inter-Ac
  4: 3, // Suburban One
  5: 4, // Bicentennial
  6: 5, // Del Val
  7: 6, // Independent
};

export const LEAGUE_COLORS: Record<number, string> = {
  1: "#7c3aed", // Catholic — purple
  2: "#2563eb", // Public — blue
  3: "#059669", // Inter-Ac — emerald
  4: "#d97706", // SOL — amber
  5: "#dc2626", // BAL — red
  6: "#0891b2", // Del Val — teal
  7: "#6b7280", // Independent — gray
};

// ============================================================================
// DATA FETCHERS
// ============================================================================

/**
 * Get all games for a sport + season with school details and box score flags.
 * No artificial limit — loads all games for the season.
 */
export const getScheduleGames = cache(
  async (
    sportSlug: string,
    seasonLabel: string
  ): Promise<ScheduleGame[]> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();

        // Resolve season
        const { data: season } = await supabase
          .from("seasons")
          .select("id")
          .eq("label", seasonLabel)
          .single();

        if (!season) return [];

        // Resolve sport
        const { data: sport } = await supabase
          .from("sports")
          .select("id")
          .eq("slug", sportSlug)
          .single();

        if (!sport) return [];

        // Fetch games with school joins
        const { data: rawGames } = await supabase
          .from("games")
          .select(
            `id, game_date, game_time, game_type, home_score, away_score, notes, venue, playoff_round,
             home_school:home_school_id(id, name, slug, colors, city, league_id),
             away_school:away_school_id(id, name, slug, colors, city, league_id)`
          )
          .eq("season_id", season.id)
          .eq("sport_id", sport.id)
          .order("game_date", { ascending: true })
          .order("game_time", { ascending: true });

        if (!rawGames || rawGames.length === 0) return [];

        // Batch check which games have box scores
        const gameIds = rawGames.map((g: Record<string, unknown>) => g.id as number);
        const { data: boxScoreGames } = await supabase
          .from("game_player_stats")
          .select("game_id")
          .in("game_id", gameIds);

        const boxScoreSet = new Set(
          (boxScoreGames ?? []).map((r: { game_id: number }) => r.game_id)
        );

        // Normalize school joins (Supabase returns arrays for joins)
        return rawGames.map((g: Record<string, unknown>) => ({
          ...g,
          home_school: Array.isArray(g.home_school)
            ? g.home_school[0]
            : g.home_school,
          away_school: Array.isArray(g.away_school)
            ? g.away_school[0]
            : g.away_school,
          has_box_score: boxScoreSet.has(g.id as number),
        })) as ScheduleGame[];
      },
      [],
      "SCHEDULE_GAMES",
      { sportSlug, seasonLabel }
    );
  }
);

/**
 * Get all seasons that have games for a given sport, with game counts.
 * Ordered most recent first.
 */
export const getScheduleSeasons = cache(
  async (sportSlug: string): Promise<ScheduleSeason[]> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();

        const { data: sport } = await supabase
          .from("sports")
          .select("id")
          .eq("slug", sportSlug)
          .single();

        if (!sport) return [];

        // Get seasons with game counts using a raw query approach
        const { data: seasons } = await supabase
          .from("seasons")
          .select("id, label");

        if (!seasons) return [];

        // Get game counts per season for this sport
        const { data: gameCounts } = await supabase
          .from("games")
          .select("season_id")
          .eq("sport_id", sport.id);

        if (!gameCounts) return [];

        // Count games per season
        const countMap = new Map<number, number>();
        for (const row of gameCounts) {
          countMap.set(
            row.season_id,
            (countMap.get(row.season_id) || 0) + 1
          );
        }

        // Build result: only seasons with games
        const result: ScheduleSeason[] = [];
        for (const s of seasons) {
          const count = countMap.get(s.id);
          if (count && count > 0) {
            result.push({ id: s.id, label: s.label, game_count: count });
          }
        }

        // Sort by label descending (most recent first)
        result.sort((a, b) => b.label.localeCompare(a.label));

        return result;
      },
      [],
      "SCHEDULE_SEASONS",
      { sportSlug }
    );
  }
);

/**
 * Get league membership for all schools in a given season.
 * Returns a Map of school_id → league info (league, division, conference).
 */
export const getLeagueSchoolMap = cache(
  async (
    seasonId: number
  ): Promise<Map<number, LeagueSchoolEntry>> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();

        const { data } = await supabase
          .from("league_seasons")
          .select(
            `school_id, league_id, division, conference,
             leagues:league_id(name, short_name)`
          )
          .eq("season_id", seasonId);

        const map = new Map<number, LeagueSchoolEntry>();
        if (!data) return map;

        for (const row of data) {
          const league = Array.isArray(row.leagues)
            ? row.leagues[0]
            : row.leagues;
          map.set(row.school_id, {
            school_id: row.school_id,
            league_id: row.league_id,
            league_name: league?.name ?? "Unknown",
            league_short: league?.short_name ?? "?",
            division: row.division,
            conference: row.conference,
          });
        }

        return map;
      },
      new Map(),
      "LEAGUE_SCHOOL_MAP",
      { seasonId }
    );
  }
);

/**
 * Get games for the Game Day view — all football games on a specific date.
 * Shorter cache for near-live feel.
 */
export const getGameDayGames = cache(
  async (date: string): Promise<ScheduleGame[]> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();

        const { data: sport } = await supabase
          .from("sports")
          .select("id")
          .eq("slug", "football")
          .single();

        if (!sport) return [];

        const { data: rawGames } = await supabase
          .from("games")
          .select(
            `id, game_date, game_time, game_type, home_score, away_score, notes, venue, playoff_round,
             home_school:home_school_id(id, name, slug, colors, city, league_id),
             away_school:away_school_id(id, name, slug, colors, city, league_id)`
          )
          .eq("sport_id", sport.id)
          .eq("game_date", date)
          .order("game_time", { ascending: true });

        if (!rawGames) return [];

        const gameIds = rawGames.map((g: Record<string, unknown>) => g.id as number);
        const { data: boxScoreGames } = await supabase
          .from("game_player_stats")
          .select("game_id")
          .in("game_id", gameIds);

        const boxScoreSet = new Set(
          (boxScoreGames ?? []).map((r: { game_id: number }) => r.game_id)
        );

        return rawGames.map((g: Record<string, unknown>) => ({
          ...g,
          home_school: Array.isArray(g.home_school)
            ? g.home_school[0]
            : g.home_school,
          away_school: Array.isArray(g.away_school)
            ? g.away_school[0]
            : g.away_school,
          has_box_score: boxScoreSet.has(g.id as number),
        })) as ScheduleGame[];
      },
      [],
      "GAME_DAY_GAMES",
      { date }
    );
  }
);

/**
 * Get games across all sports for a date range (master schedule).
 * Returns games with sport_id for color coding.
 */
export const getMasterScheduleGames = cache(
  async (
    startDate: string,
    endDate: string,
    sportFilter?: string
  ): Promise<ScheduleGame[]> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();

        let query = supabase
          .from("games")
          .select(
            `id, game_date, game_time, game_type, home_score, away_score, notes, venue, playoff_round, sport_id,
             home_school:home_school_id(id, name, slug, colors, city, league_id),
             away_school:away_school_id(id, name, slug, colors, city, league_id)`
          )
          .gte("game_date", startDate)
          .lte("game_date", endDate)
          .order("game_date", { ascending: true })
          .order("game_time", { ascending: true })
          .limit(300);

        if (sportFilter) {
          const { data: sport } = await supabase
            .from("sports")
            .select("id")
            .eq("slug", sportFilter)
            .single();
          if (sport) {
            query = query.eq("sport_id", sport.id);
          }
        }

        const { data: rawGames } = await query;
        if (!rawGames) return [];

        // Batch box score check
        const gameIds = rawGames.map((g: Record<string, unknown>) => g.id as number);
        const { data: boxScoreGames } = gameIds.length > 0
          ? await supabase
              .from("game_player_stats")
              .select("game_id")
              .in("game_id", gameIds)
          : { data: [] };

        const boxScoreSet = new Set(
          (boxScoreGames ?? []).map((r: { game_id: number }) => r.game_id)
        );

        return rawGames.map((g: Record<string, unknown>) => ({
          ...g,
          home_school: Array.isArray(g.home_school)
            ? g.home_school[0]
            : g.home_school,
          away_school: Array.isArray(g.away_school)
            ? g.away_school[0]
            : g.away_school,
          has_box_score: boxScoreSet.has(g.id as number),
        })) as ScheduleGame[];
      },
      [],
      "MASTER_SCHEDULE_GAMES",
      { startDate, endDate, sportFilter }
    );
  }
);

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Build team list from games, enriched with league info.
 */
export function buildTeamList(
  games: ScheduleGame[],
  leagueMap: Map<number, LeagueSchoolEntry>
): ScheduleTeam[] {
  const teamMap = new Map<number, ScheduleTeam>();

  for (const g of games) {
    for (const school of [g.home_school, g.away_school]) {
      if (!school) continue;
      const existing = teamMap.get(school.id);
      if (existing) {
        existing.gameCount++;
      } else {
        const leagueInfo = leagueMap.get(school.id);
        teamMap.set(school.id, {
          id: school.id,
          name: school.name,
          slug: school.slug,
          colors: school.colors,
          gameCount: 1,
          league_id: leagueInfo?.league_id ?? school.league_id,
          division: leagueInfo?.division ?? null,
        });
      }
    }
  }

  return [...teamMap.values()].sort((a, b) => {
    if (b.gameCount !== a.gameCount) return b.gameCount - a.gameCount;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Determine the league context of a game.
 * If both teams share a league, it's a league game. Otherwise non-league.
 */
export function getGameLeagueContext(
  game: ScheduleGame,
  leagueMap: Map<number, LeagueSchoolEntry>
): { league_id: number | null; league_name: string; division: string | null } {
  const homeId = game.home_school?.id;
  const awayId = game.away_school?.id;

  if (!homeId || !awayId) {
    return { league_id: null, league_name: "Other", division: null };
  }

  const homeLeague = leagueMap.get(homeId);
  const awayLeague = leagueMap.get(awayId);

  // Playoff games get their own section
  if (game.game_type === "playoff" || game.game_type === "championship") {
    return { league_id: -1, league_name: "Playoffs", division: game.playoff_round ?? null };
  }

  // Both teams in the same league = league game
  if (homeLeague && awayLeague && homeLeague.league_id === awayLeague.league_id) {
    return {
      league_id: homeLeague.league_id,
      league_name: homeLeague.league_name,
      division: homeLeague.division ?? awayLeague.division ?? null,
    };
  }

  // Cross-league or missing data
  return { league_id: 0, league_name: "Non-League", division: null };
}

/**
 * Group games by week (Monday–Sunday boundaries).
 */
export function groupByWeek(
  games: ScheduleGame[]
): { weekLabel: string; weekKey: string; games: ScheduleGame[] }[] {
  const map = new Map<string, ScheduleGame[]>();
  const keyOrder: string[] = [];

  for (const g of games) {
    const d = new Date(g.game_date + "T12:00:00");
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((day + 6) % 7));
    const key = monday.toISOString().slice(0, 10);
    if (!map.has(key)) {
      map.set(key, []);
      keyOrder.push(key);
    }
    map.get(key)!.push(g);
  }

  return keyOrder.map((key) => {
    const monday = new Date(key + "T12:00:00");
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const label = `${monday.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${sunday.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
    return { weekLabel: label, weekKey: key, games: map.get(key)! };
  });
}

/**
 * Group games by day (for basketball/baseball daily view).
 */
export function groupByDay(
  games: ScheduleGame[]
): { dateLabel: string; dateKey: string; games: ScheduleGame[] }[] {
  const map = new Map<string, ScheduleGame[]>();
  const keyOrder: string[] = [];

  for (const g of games) {
    const key = g.game_date;
    if (!map.has(key)) {
      map.set(key, []);
      keyOrder.push(key);
    }
    map.get(key)!.push(g);
  }

  return keyOrder.map((key) => {
    const d = new Date(key + "T12:00:00");
    const label = d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return { dateLabel: label, dateKey: key, games: map.get(key)! };
  });
}

/**
 * Group games by league, then by division within each league.
 * Returns sections in canonical league display order.
 */
export function groupByLeague(
  games: ScheduleGame[],
  leagueMap: Map<number, LeagueSchoolEntry>
): {
  league_id: number | null;
  league_name: string;
  divisions: {
    division: string | null;
    games: ScheduleGame[];
  }[];
}[] {
  // First pass: assign each game to a league+division
  const leagueGroups = new Map<
    string,
    { league_id: number | null; league_name: string; divGames: Map<string, ScheduleGame[]> }
  >();

  for (const g of games) {
    const ctx = getGameLeagueContext(g, leagueMap);
    const leagueKey = String(ctx.league_id ?? "null");

    if (!leagueGroups.has(leagueKey)) {
      leagueGroups.set(leagueKey, {
        league_id: ctx.league_id,
        league_name: ctx.league_name,
        divGames: new Map(),
      });
    }

    const group = leagueGroups.get(leagueKey)!;
    const divKey = ctx.division ?? "__none__";
    if (!group.divGames.has(divKey)) {
      group.divGames.set(divKey, []);
    }
    group.divGames.get(divKey)!.push(g);
  }

  // Convert to array and sort by canonical league order
  const result = [...leagueGroups.values()]
    .map((lg) => ({
      league_id: lg.league_id,
      league_name: lg.league_name,
      divisions: [...lg.divGames.entries()]
        .map(([divKey, games]) => ({
          division: divKey === "__none__" ? null : divKey,
          games: games.sort(
            (a, b) => a.game_date.localeCompare(b.game_date) || (a.game_time ?? "").localeCompare(b.game_time ?? "")
          ),
        }))
        .sort((a, b) => (a.division ?? "zzz").localeCompare(b.division ?? "zzz")),
    }))
    .sort((a, b) => {
      const orderA = LEAGUE_DISPLAY_ORDER[a.league_id ?? 99] ?? 99;
      const orderB = LEAGUE_DISPLAY_ORDER[b.league_id ?? 99] ?? 99;
      return orderA - orderB;
    });

  return result;
}

// ============================================================================
// FORMAT HELPERS
// ============================================================================

export function formatGameDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatGameTime(time: string | null): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  if (hour === 0) return "12:" + m + " AM";
  if (hour < 12) return hour + ":" + m + " AM";
  if (hour === 12) return "12:" + m + " PM";
  return hour - 12 + ":" + m + " PM";
}

export function getWinnerSide(
  game: ScheduleGame
): "home" | "away" | "tie" | null {
  if (game.home_score === null || game.away_score === null) return null;
  if (game.home_score > game.away_score) return "home";
  if (game.away_score > game.home_score) return "away";
  return "tie";
}
