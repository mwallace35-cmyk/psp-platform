/**
 * Live scores data layer
 * Handles real-time game scoring and schedule queries
 */

import { createClient } from "./common";
import { Game } from "./common";

export interface LiveScore {
  id: number;
  game_id: number;
  period: string;
  home_score: number;
  away_score: number;
  is_final: boolean;
  reported_by: string | null;
  reported_at: string;
  verified: boolean;
  created_at: string;
}

export interface GameDaySchedule extends Game {
  live_score?: LiveScore | null;
  status: "scheduled" | "in_progress" | "final";
}

/**
 * Get all games currently in progress (is_final = false, game_date = today)
 */
export async function getLiveScores(sportId?: string) {
  const supabase = await createClient();

  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  let query = supabase
    .from("games")
    .select(
      `
      id,
      sport_id,
      game_date,
      home_score,
      away_score,
      home_school_id,
      away_school_id,
      season_id,
      home_school:schools!home_school_id(id, name, slug),
      away_school:schools!away_school_id(id, name, slug),
      seasons(label),
      live_scores(
        id,
        period,
        home_score,
        away_score,
        is_final,
        reported_at,
        verified
      )
    `
    )
    .eq("game_date", today)
    .order("game_date", { ascending: true });

  if (sportId) {
    query = query.eq("sport_id", sportId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching live scores:", error);
    return [];
  }

  return (data || []).map((game: any) => ({
    ...game,
    status:
      game.live_scores && game.live_scores.length > 0
        ? game.live_scores[0].is_final
          ? "final"
          : "in_progress"
        : "scheduled",
    live_score: game.live_scores?.[0] || null,
  }));
}

/**
 * Get the latest score for a specific game
 */
export async function getGameLiveScore(gameId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("live_scores")
    .select("*")
    .eq("game_id", gameId)
    .order("reported_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching game live score:", error);
    return null;
  }

  return data;
}

/**
 * Get recently completed games
 */
export async function getRecentFinalScores(
  sportId?: string,
  limit: number = 20
) {
  const supabase = await createClient();

  let query = supabase
    .from("games")
    .select(
      `
      id,
      sport_id,
      game_date,
      home_score,
      away_score,
      home_school_id,
      away_school_id,
      season_id,
      home_school:schools!home_school_id(id, name, slug),
      away_school:schools!away_school_id(id, name, slug),
      seasons(label)
    `
    )
    .not("home_score", "is", null)
    .not("away_score", "is", null)
    .order("game_date", { ascending: false })
    .limit(limit);

  if (sportId) {
    query = query.eq("sport_id", sportId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching recent final scores:", error);
    return [];
  }

  return data || [];
}

/**
 * Get all games scheduled for today
 */
export async function getTodaysGames(sportId?: string) {
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];

  let query = supabase
    .from("games")
    .select(
      `
      id,
      sport_id,
      game_date,
      game_time,
      home_score,
      away_score,
      home_school_id,
      away_school_id,
      season_id,
      home_school:schools!home_school_id(id, name, slug),
      away_school:schools!away_school_id(id, name, slug),
      seasons(label)
    `
    )
    .eq("game_date", today)
    .order("game_date", { ascending: true });

  if (sportId) {
    query = query.eq("sport_id", sportId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching today's games:", error);
    return [];
  }

  return data || [];
}

/**
 * Get games for a specific date
 */
export async function getGameDaySchedule(date: string, sportId?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("games")
    .select(
      `
      id,
      sport_id,
      game_date,
      game_time,
      home_score,
      away_score,
      home_school_id,
      away_school_id,
      season_id,
      home_school:schools!home_school_id(id, name, slug),
      away_school:schools!away_school_id(id, name, slug),
      seasons(label),
      live_scores(
        id,
        period,
        home_score,
        away_score,
        is_final,
        reported_at,
        verified
      )
    `
    )
    .eq("game_date", date)
    .order("game_date", { ascending: true });

  if (sportId) {
    query = query.eq("sport_id", sportId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching game day schedule:", error);
    return [];
  }

  return (data || []).map((game: any) => ({
    ...game,
    status:
      game.live_scores && game.live_scores.length > 0
        ? game.live_scores[0].is_final
          ? "final"
          : "in_progress"
        : game.home_score !== null && game.away_score !== null
        ? "final"
        : "scheduled",
    live_score: game.live_scores?.[0] || null,
  }));
}
