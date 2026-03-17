/**
 * Stat milestones data layer
 * Tracks player progress toward statistical milestones (1000 yards, 3000 points, etc.)
 */

import { createClient } from "./common";

export interface StatMilestone {
  id: number;
  player_id: number;
  sport_id: string;
  stat_type: string;
  current_value: number;
  milestone_target: number;
  remaining: number;
  projected_games_to_reach: number | null;
  season_id: number | null;
  achieved: boolean;
  achieved_date: string | null;
  created_at: string;
  players?: { id: number; name: string; slug: string } | null;
  schools?: { id: number; name: string; slug: string } | null;
  seasons?: { label: string } | null;
}

/**
 * Get players approaching milestones (within 1-2 games)
 */
export async function getUpcomingMilestones(
  sportId?: string,
  limit: number = 10
) {
  const supabase = await createClient();

  let query = supabase
    .from("stat_milestones")
    .select(
      `
      id,
      player_id,
      sport_id,
      stat_type,
      current_value,
      milestone_target,
      remaining,
      projected_games_to_reach,
      season_id,
      achieved,
      achieved_date,
      created_at,
      players(id, name, slug),
      seasons(label)
    `
    )
    .eq("achieved", false)
    .not("projected_games_to_reach", "is", null)
    .lt("projected_games_to_reach", 3) // Within 3 games
    .order("remaining", { ascending: true })
    .limit(limit);

  if (sportId) {
    query = query.eq("sport_id", sportId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching upcoming milestones:", error);
    return [];
  }

  return data || [];
}

/**
 * Get recently achieved milestones
 */
export async function getRecentMilestones(
  sportId?: string,
  limit: number = 10
) {
  const supabase = await createClient();

  let query = supabase
    .from("stat_milestones")
    .select(
      `
      id,
      player_id,
      sport_id,
      stat_type,
      current_value,
      milestone_target,
      remaining,
      projected_games_to_reach,
      season_id,
      achieved,
      achieved_date,
      created_at,
      players(id, name, slug),
      seasons(label)
    `
    )
    .eq("achieved", true)
    .not("achieved_date", "is", null)
    .order("achieved_date", { ascending: false })
    .limit(limit);

  if (sportId) {
    query = query.eq("sport_id", sportId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching recent milestones:", error);
    return [];
  }

  return data || [];
}

/**
 * Get all milestones for a player
 */
export async function getPlayerMilestones(playerId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("stat_milestones")
    .select(
      `
      id,
      player_id,
      sport_id,
      stat_type,
      current_value,
      milestone_target,
      remaining,
      projected_games_to_reach,
      season_id,
      achieved,
      achieved_date,
      created_at,
      players(id, name, slug),
      seasons(label)
    `
    )
    .eq("player_id", playerId)
    .order("milestone_target", { ascending: false });

  if (error) {
    console.error("Error fetching player milestones:", error);
    return [];
  }

  return data || [];
}

/**
 * Get milestones within 1-2 games of achievement (for homepage widget)
 */
export async function getMilestoneAlerts(sportId?: string, limit: number = 5) {
  const supabase = await createClient();

  let query = supabase
    .from("stat_milestones")
    .select(
      `
      id,
      player_id,
      sport_id,
      stat_type,
      current_value,
      milestone_target,
      remaining,
      projected_games_to_reach,
      season_id,
      achieved,
      achieved_date,
      created_at,
      players(id, name, slug),
      seasons(label)
    `
    )
    .eq("achieved", false)
    .not("projected_games_to_reach", "is", null)
    .lte("projected_games_to_reach", 2) // Within 2 games
    .order("projected_games_to_reach", { ascending: true })
    .limit(limit);

  if (sportId) {
    query = query.eq("sport_id", sportId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching milestone alerts:", error);
    return [];
  }

  return data || [];
}
