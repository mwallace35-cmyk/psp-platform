import { createStaticClient } from "@/lib/supabase/static";
import { withErrorHandling } from "@/lib/errors";
import { withRetry } from "@/lib/retry";

// Re-export client creation (cookie-free for ISR/static compatibility)
// Re-export sports constants
export { VALID_SPORTS, SPORT_META, isValidSport } from "@/lib/sports";
export type { SportId } from "@/lib/sports";

/**
 * Creates a Supabase client for public data reads.
 * Uses the static (cookie-free) client so it works during
 * build-time static generation, ISR revalidation, and runtime.
 */
export async function createClient() {
  return createStaticClient();
}

export { withErrorHandling, withRetry };

// ============================================================================
// SECURITY: Input Sanitization
// ============================================================================

/**
 * Sanitizes user input for safe use in PostgREST ILIKE queries.
 * Escapes special PostgREST characters that could be used for injection.
 */
export function sanitizePostgREST(input: string): string {
  return input
    .replace(/\\/g, "\\\\") // Backslash first (must be first!)
    .replace(/%/g, "\\%")   // Percent (wildcard)
    .replace(/_/g, "\\_")   // Underscore (single char wildcard)
    .replace(/\*/g, "\\*")  // Asterisk
    .replace(/\(/g, "\\(")  // Parenthesis
    .replace(/\)/g, "\\)")  // Parenthesis
    .replace(/,/g, "\\,")   // Comma
    .replace(/\./g, "\\.")  // Period
    .trim()
    .slice(0, 100);         // Enforce max length
}

// ============================================================================
// SHARED TYPE DEFINITIONS
// ============================================================================

export interface Season {
  year_start: number;
  year_end: number;
  label: string;
}

export interface School {
  id: number;
  slug: string;
  name: string;
  short_name?: string;
  city?: string;
  state?: string;
  league_id?: number;
  mascot?: string;
  closed_year?: number;
  founded_year?: number;
  website_url?: string;
  leagues?: { name: string; short_name?: string } | null;
}

export interface Player {
  id: number;
  slug: string;
  name: string;
  college?: string;
  pro_team?: string;
  primary_school_id?: number;
  graduation_year?: number;
  positions?: string[];
  height?: string;
  is_multi_sport?: boolean;
  pro_draft_info?: string;
  schools?: { name: string; slug: string } | null;
}

export interface FootballPlayerSeason {
  id: number;
  player_id: number;
  season_id: number;
  school_id: number;
  games_played?: number;
  rush_carries?: number;
  rush_yards?: number;
  rush_td?: number;
  pass_yards?: number;
  pass_td?: number;
  rec_yards?: number;
  rec_td?: number;
  total_td?: number;
  total_yards?: number;
  interceptions?: number;
  points?: number;
  seasons?: Season;
  schools?: { name: string; slug: string };
  players?: Player;
}

export interface BasketballPlayerSeason {
  id: number;
  player_id: number;
  season_id: number;
  school_id: number;
  games_played?: number;
  points?: number;
  ppg?: number;
  rebounds?: number;
  assists?: number;
  steals?: number;
  blocks?: number;
  seasons?: Season;
  schools?: { name: string; slug: string };
  players?: Player;
}

export interface BaseballPlayerSeason {
  id: number;
  player_id: number;
  season_id: number;
  school_id: number;
  batting_avg?: number;
  home_runs?: number;
  era?: number;
  seasons?: Season;
  schools?: { name: string; slug: string };
  players?: Player;
}

export interface TeamSeason {
  id: number;
  school_id: number;
  sport_id: string;
  season_id: number;
  wins?: number;
  losses?: number;
  ties?: number;
  points_for?: number;
  points_against?: number;
  playoff_result?: string;
  seasons?: Season;
  schools?: School;
  coaches?: { id: number; name: string; slug: string } | null;
}

export interface Award {
  id: number;
  player_id: number;
  award_name?: string;
  award_type?: string;
  category?: string;
  seasons?: Season;
}

export interface SchoolRecord {
  id: number;
  sport_id: string;
  category?: string;
  record_number?: number;
  record_holder?: string;
  holder_name?: string;
  record_value?: number;
  holder_school?: string;
  record_year?: number;
  year_set?: number;
  players?: { name: string; slug: string };
  schools?: { name: string; slug: string };
  seasons?: { label: string };
}

export interface Game {
  id: number;
  sport_id: string;
  season_id: number;
  game_date?: string;
  home_school_id?: number;
  away_school_id?: number;
  home_score?: number | null;
  away_score?: number | null;
  home_team?: { name: string } | null;
  away_team?: { name: string } | null;
  seasons?: { label: string };
  home_school?: { id: number; name: string; slug: string } | null;
  away_school?: { id: number; name: string; slug: string } | null;
}

export interface RosterPlayer {
  id: number;
  player_id: number;
  school_id: number;
  season_id: number;
  sport_id: string;
  jersey_number?: number;
  position?: string;
  players?: { id: number; name: string; slug: string };
}

export interface Championship {
  id: number;
  school_id: number;
  season_id: number;
  sport_id: string;
  level?: string;
  result?: string;
  score?: string;
  opponent_id?: number;
  schools?: { name: string; slug: string };
  seasons?: Season;
  leagues?: { name: string };
  opponent?: { name: string };
}

export interface SearchResult {
  entity_type: "school" | "player" | "coach";
  entity_id: number;
  display_name: string;
  context: string;
  url_path: string;
}

export interface PlayerSearchResult {
  id: number;
  slug: string;
  name: string;
  college?: string;
  pro_team?: string;
  primary_school_id?: number;
  schools?: {
    name: string;
    slug: string;
  } | null;
}

export interface TeamSeasonWithRelations {
  id: number;
  school_id: number;
  sport_id: string;
  season_id: number;
  wins: number;
  losses: number;
  ties: number;
  seasons?: Season;
  schools?: School & { leagues?: { name: string } };
  coaches?: { id: number; name: string; slug: string };
}

export interface LeaderboardEntry {
  rank: number;
  value: number;
  player: { id: number; name: string; slug: string } | null;
  school: { name: string; slug: string } | null;
  season: { label: string } | null;
  sport: string;
  stat: string;
}
