/**
 * Team page data layer
 * Functions for fetching team history, next games, league standings, and related articles
 */

import { createClient } from "./common";
import type { Season, TeamSeason, Championship, Game, School } from "./common";

export interface TeamHistory {
  season_id: number;
  label: string;
  year_start: number;
  year_end: number;
  wins: number;
  losses: number;
  ties?: number;
  points_for?: number;
  points_against?: number;
  playoff_result?: string;
  coaches?: { id: number; name: string; slug: string } | null;
}

export interface NextGame {
  id: number;
  date: string;
  time?: string;
  home_team_id: number;
  away_team_id: number;
  season_id: number;
  home_team?: { name: string; slug: string } | null;
  away_team?: { name: string; slug: string } | null;
  points_home?: number;
  points_away?: number;
  final_score?: boolean;
}

export interface LeagueStandingsRow {
  school_id: number;
  schools?: { name: string; slug: string; primary_color?: string } | null;
  total_wins: number;
  total_losses: number;
  total_ties?: number;
  championship_count: number;
}

export interface TeamArticle {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  featured_image_url?: string;
  created_at?: string;
}

/**
 * Get last N seasons for a team with records
 */
export async function getTeamHistory(
  schoolId: number,
  sportId: string,
  limit: number = 10
): Promise<TeamHistory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_seasons")
    .select(
      `
      id,
      season_id,
      wins,
      losses,
      ties,
      points_for,
      points_against,
      playoff_result,
      seasons(label, year_start, year_end),
      coaches(id, name, slug)
    `
    )
    .eq("school_id", schoolId)
    .eq("sport_id", sportId)
    .eq("deleted_at", null)
    .order("season_id", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching team history:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    season_id: row.season_id,
    label: row.seasons?.label || "",
    year_start: row.seasons?.year_start || 0,
    year_end: row.seasons?.year_end || 0,
    wins: row.wins || 0,
    losses: row.losses || 0,
    ties: row.ties || 0,
    points_for: row.points_for,
    points_against: row.points_against,
    playoff_result: row.playoff_result,
    coaches: row.coaches,
  }));
}

/**
 * Get next upcoming game for a team
 */
export async function getNextGame(
  schoolId: number,
  sportId: string
): Promise<NextGame | null> {
  const supabase = await createClient();

  const now = new Date().toISOString();

  // Try home games first
  const { data: homeGames, error: homeError } = await supabase
    .from("games")
    .select(
      `
      id,
      game_date,
      game_time,
      home_school_id,
      away_school_id,
      season_id,
      home_school:schools!games_home_team_id_fkey(name, slug),
      away_school:schools!games_away_team_id_fkey(name, slug),
      home_score,
      away_score
    `
    )
    .eq("sport_id", sportId)
    .eq("home_school_id", schoolId)
    .eq("deleted_at", null)
    .gte("game_date", now)
    .order("game_date", { ascending: true })
    .limit(1);

  if (!homeError && homeGames && homeGames.length > 0) {
    const game = homeGames[0] as any;
    return {
      id: game.id,
      date: game.game_date || "",
      time: game.game_time,
      home_team_id: game.home_school_id,
      away_team_id: game.away_school_id,
      season_id: game.season_id,
      home_team: game.home_school,
      away_team: game.away_school,
      points_home: game.home_score,
      points_away: game.away_score,
      final_score: game.home_score !== null && game.away_score !== null,
    };
  }

  // Try away games
  const { data: awayGames, error: awayError } = await supabase
    .from("games")
    .select(
      `
      id,
      game_date,
      game_time,
      home_school_id,
      away_school_id,
      season_id,
      home_school:schools!games_home_team_id_fkey(name, slug),
      away_school:schools!games_away_team_id_fkey(name, slug),
      home_score,
      away_score
    `
    )
    .eq("sport_id", sportId)
    .eq("away_school_id", schoolId)
    .eq("deleted_at", null)
    .gte("game_date", now)
    .order("game_date", { ascending: true })
    .limit(1);

  if (!awayError && awayGames && awayGames.length > 0) {
    const game = awayGames[0] as any;
    return {
      id: game.id,
      date: game.game_date || "",
      time: game.game_time,
      home_team_id: game.home_school_id,
      away_team_id: game.away_school_id,
      season_id: game.season_id,
      home_team: game.home_school,
      away_team: game.away_school,
      points_home: game.home_score,
      points_away: game.away_score,
      final_score: game.home_score !== null && game.away_score !== null,
    };
  }

  return null;
}

/**
 * Get league standings for a team's league
 * Returns top teams ranked by wins
 */
export async function getLeagueStandings(
  leagueId: number,
  sportId: string,
  seasonId: number,
  limit: number = 8
): Promise<LeagueStandingsRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_seasons")
    .select(
      `
      school_id,
      schools(name, slug, primary_color),
      wins,
      losses,
      ties
    `
    )
    .eq("sport_id", sportId)
    .eq("season_id", seasonId)
    .eq("deleted_at", null)
    .not("schools", "is", null)
    .order("wins", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching league standings:", error);
    return [];
  }

  // Count championships per school
  const standingsWithChamps: LeagueStandingsRow[] = (data || []).map((row: any) => ({
    school_id: row.school_id,
    schools: row.schools,
    total_wins: row.wins || 0,
    total_losses: row.losses || 0,
    total_ties: row.ties || 0,
    championship_count: 0, // Will be filled below if needed
  }));

  return standingsWithChamps;
}

/**
 * Get articles mentioning a school
 */
export async function getTeamArticles(
  schoolId: number,
  limit: number = 5
): Promise<TeamArticle[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("article_mentions")
    .select(
      `
      articles(id, slug, title, excerpt, featured_image_url, created_at)
    `
    )
    .eq("entity_id", schoolId)
    .eq("entity_type", "school")
    .eq("deleted_at", null)
    .not("articles", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching team articles:", error);
    return [];
  }

  const articles: TeamArticle[] = [];
  const seen = new Set<number>();

  (data || []).forEach((row: any) => {
    if (row.articles && !seen.has(row.articles.id)) {
      articles.push({
        id: row.articles.id,
        slug: row.articles.slug,
        title: row.articles.title,
        excerpt: row.articles.excerpt,
        featured_image_url: row.articles.featured_image_url,
        created_at: row.articles.created_at,
      });
      seen.add(row.articles.id);
    }
  });

  return articles.slice(0, limit);
}

/**
 * Fetch Ted Silary notes for a school + season (or all seasons for a school)
 */
export interface TeamSeasonNote {
  id: number;
  school_id: number;
  season_id: number;
  note_text: string;
  note_type?: string;
  source_url?: string | null;
  season_label?: string;
}

export async function getTeamSeasonNotes(
  schoolId: number,
  seasonId?: number
): Promise<TeamSeasonNote[]> {
  const supabase = await createClient();

  let query = supabase
    .from("team_season_notes")
    .select(`id, school_id, season_id, note_text, note_type, source_url, seasons(label)`)
    .eq("school_id", schoolId)
    .order("season_id", { ascending: false });

  if (seasonId) {
    query = query.eq("season_id", seasonId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching team season notes:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    school_id: row.school_id,
    season_id: row.season_id,
    note_text: row.note_text,
    note_type: row.note_type,
    source_url: row.source_url,
    season_label: row.seasons?.label,
  }));
}

/**
 * Check if a school has any Ted Silary notes (for badge display)
 */
export async function getSchoolHasTedNotes(
  schoolId: number
): Promise<{ hasNotes: boolean; seasonRange?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_season_notes")
    .select("season_id, seasons(label)")
    .eq("school_id", schoolId)
    .order("season_id", { ascending: true });

  if (error || !data || data.length === 0) {
    return { hasNotes: false };
  }

  const labels = data
    .map((r: any) => r.seasons?.label)
    .filter(Boolean) as string[];

  const first = labels[0];
  const last = labels[labels.length - 1];
  const range = first === last ? first : `${first} - ${last}`;

  return { hasNotes: true, seasonRange: range };
}

/**
 * Get related teams in the same league
 */
export async function getRelatedTeams(
  schoolId: number,
  leagueId: number,
  sportId: string,
  seasonId: number,
  limit: number = 5
): Promise<Array<{ id: number; name: string; slug: string }>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("team_seasons")
    .select(
      `
      school_id,
      schools(id, name, slug)
    `
    )
    .eq("sport_id", sportId)
    .eq("season_id", seasonId)
    .eq("deleted_at", null)
    .neq("school_id", schoolId)
    .not("schools", "is", null)
    .limit(limit);

  if (error) {
    console.error("Error fetching related teams:", error);
    return [];
  }

  return (data || [])
    .filter((row: any) => row.schools)
    .map((row: any) => ({
      id: row.school_id,
      name: row.schools.name,
      slug: row.schools.slug,
    }));
}
