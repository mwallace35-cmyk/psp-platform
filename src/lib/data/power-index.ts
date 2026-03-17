/**
 * Power index data layer
 * Ranked school scores based on championships, win%, recruiting, and pro athletes
 */

import { createClient } from "./common";

export interface PowerIndexEntry {
  id: number;
  school_id: number;
  sport_id: string;
  season_id: number | null;
  overall_score: number;
  championship_score: number;
  win_pct_score: number;
  pro_athletes_score: number;
  recruiting_score: number;
  strength_of_schedule: number;
  rank: number | null;
  previous_rank: number | null;
  trend: string | null;
  calculated_at: string;
  schools?: { id: number; name: string; slug: string } | null;
}

export interface PowerIndexWithHistory extends PowerIndexEntry {
  history?: PowerIndexEntry[];
}

/**
 * Get ranked list of schools by composite score
 */
export async function getPowerIndexRankings(sportId: string, seasonId?: number) {
  const supabase = await createClient();

  let query = supabase
    .from("power_index")
    .select(
      `
      id,
      school_id,
      sport_id,
      season_id,
      overall_score,
      championship_score,
      win_pct_score,
      pro_athletes_score,
      recruiting_score,
      strength_of_schedule,
      rank,
      previous_rank,
      trend,
      calculated_at,
      schools(id, name, slug)
    `
    )
    .eq("sport_id", sportId)
    .order("overall_score", { ascending: false });

  if (seasonId) {
    query = query.eq("season_id", seasonId);
  } else {
    // Default to most recent season
    query = query.is("season_id", null);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching power rankings:", error);
    return [];
  }

  return data || [];
}

/**
 * Get a single school's power index with breakdown
 */
export async function getSchoolPowerIndex(
  schoolId: number,
  sportId: string,
  seasonId?: number
) {
  const supabase = await createClient();

  let query = supabase
    .from("power_index")
    .select(
      `
      id,
      school_id,
      sport_id,
      season_id,
      overall_score,
      championship_score,
      win_pct_score,
      pro_athletes_score,
      recruiting_score,
      strength_of_schedule,
      rank,
      previous_rank,
      trend,
      calculated_at,
      schools(id, name, slug)
    `
    )
    .eq("school_id", schoolId)
    .eq("sport_id", sportId);

  if (seasonId) {
    query = query.eq("season_id", seasonId);
  } else {
    query = query.is("season_id", null);
  }

  const { data, error } = await query.single();

  if (error) {
    console.error("Error fetching school power index:", error);
    return null;
  }

  return data;
}

/**
 * Get historical power rankings for a school across multiple seasons
 */
export async function getPowerIndexHistory(
  schoolId: number,
  sportId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("power_index")
    .select(
      `
      id,
      school_id,
      sport_id,
      season_id,
      overall_score,
      championship_score,
      win_pct_score,
      pro_athletes_score,
      recruiting_score,
      strength_of_schedule,
      rank,
      previous_rank,
      trend,
      calculated_at,
      seasons(label)
    `
    )
    .eq("school_id", schoolId)
    .eq("sport_id", sportId)
    .order("calculated_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching power index history:", error);
    return [];
  }

  return data || [];
}

/**
 * Get top movers (biggest rank changes)
 */
export async function getTopMovers(sportId: string, limit: number = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("power_index")
    .select(
      `
      id,
      school_id,
      sport_id,
      season_id,
      overall_score,
      championship_score,
      win_pct_score,
      pro_athletes_score,
      recruiting_score,
      strength_of_schedule,
      rank,
      previous_rank,
      trend,
      calculated_at,
      schools(id, name, slug)
    `
    )
    .eq("sport_id", sportId)
    .not("previous_rank", "is", null)
    .order("overall_score", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching top movers:", error);
    return [];
  }

  // Filter for actual movers
  return (data || []).filter(
    (entry) => entry.previous_rank !== entry.rank && entry.rank !== null
  );
}
