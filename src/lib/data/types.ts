// Core type definitions for the PSP platform
// These are shared across all data modules

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
  rush_yards?: number;
  rush_td?: number;
  pass_yards?: number;
  pass_td?: number;
  rec_yards?: number;
  rec_td?: number;
  total_td?: number;
  total_yards?: number;
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
  school_id: number;
  opponent_id: number;
  season_id: number;
  sport_id: string;
  date: string;
  home_score?: number;
  away_score?: number;
  location?: string;
  schools?: { name: string; slug: string };
  seasons?: Season;
}

export interface RosterPlayer {
  id: number;
  player_id: number;
  team_season_id: number;
  number?: string;
  position?: string;
  players?: Player;
}

export interface Championship {
  id: number;
  school_id: number;
  season_id: number;
  sport_id: string;
  level?: string;
  championship_type?: string;
  result?: string;
  score?: string;
  notes?: string;
  venue?: string;
  opponent_id?: number;
  league_id?: number;
  schools?: School;
  seasons?: Season;
  leagues?: { name: string };
  opponent?: { name: string };
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

export type StatCategory = "rushing" | "passing" | "receiving" | "scoring" | "points" | "ppg" | "rebounds" | "assists" | "batting_avg" | "home_runs" | "era";

export interface SearchResult {
  entity_type: "school" | "player" | "coach";
  entity_id: number;
  display_name: string;
  context: string;
  url_path: string;
}
