import { cache } from "react";
import { createClient, withErrorHandling } from "./common";

// ============================================================================
// Types
// ============================================================================

export interface PlayoffBracket {
  id: number;
  sport_id: string;
  season_id: number;
  name: string;
  bracket_type: string;
  classification: string | null;
  created_at: string;
}

export interface PlayoffBracketGame {
  id: number;
  bracket_id: number;
  round_name: string;
  round_number: number;
  game_number: number;
  team1_school_id: number | null;
  team1_name: string | null;
  team1_score: number | null;
  team1_seed: number | null;
  team2_school_id: number | null;
  team2_name: string | null;
  team2_score: number | null;
  team2_seed: number | null;
  winner_school_id: number | null;
  game_date: string | null;
  game_id: number | null;
  next_game_id: number | null;
  created_at: string;
}

export interface PlayoffBracketWithGames extends PlayoffBracket {
  games: PlayoffBracketGame[];
}

// ============================================================================
// Data functions
// ============================================================================

/**
 * Get all playoff brackets for a sport in the current (most recent) season.
 * Includes all bracket games for each bracket.
 */
export const getPlayoffBrackets = cache(
  async (sportId: string): Promise<PlayoffBracketWithGames[]> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();

        // Get current season (or most recent with bracket data for this sport)
        let seasonId: number | null = null;

        // Try current season first
        const { data: currentSeason } = await supabase
          .from("seasons")
          .select("id")
          .eq("is_current", true)
          .single();

        if (currentSeason?.id) {
          // Check if this season has brackets for this sport
          const { count } = await supabase
            .from("playoff_brackets")
            .select("id", { count: "exact", head: true })
            .eq("sport_id", sportId)
            .eq("season_id", currentSeason.id);
          if (count && count > 0) {
            seasonId = currentSeason.id;
          }
        }

        // If no brackets in current season, find the most recent season that has them
        if (!seasonId) {
          const { data: recentBracket } = await supabase
            .from("playoff_brackets")
            .select("season_id")
            .eq("sport_id", sportId)
            .order("season_id", { ascending: false })
            .limit(1)
            .single();
          seasonId = recentBracket?.season_id ?? null;
        }

        if (!seasonId) return [];

        // Get brackets for this sport + season
        const { data: brackets, error: bracketsError } = await supabase
          .from("playoff_brackets")
          .select("*")
          .eq("sport_id", sportId)
          .eq("season_id", seasonId)
          .order("name");

        if (bracketsError || !brackets || brackets.length === 0) return [];

        // Get all games for these brackets
        const bracketIds = brackets.map((b: PlayoffBracket) => b.id);
        const { data: allGames, error: gamesError } = await supabase
          .from("playoff_bracket_games")
          .select("*")
          .in("bracket_id", bracketIds)
          .order("round_number")
          .order("game_number");

        if (gamesError) return [];

        const games = (allGames || []) as PlayoffBracketGame[];

        // Attach games to their brackets
        return brackets.map((bracket: PlayoffBracket) => ({
          ...bracket,
          games: games.filter((g) => g.bracket_id === bracket.id),
        }));
      },
      [] as PlayoffBracketWithGames[],
      "getPlayoffBrackets"
    );
  }
);

/**
 * Get a single playoff bracket by ID with all its games.
 */
export const getPlayoffBracketById = cache(
  async (bracketId: number): Promise<PlayoffBracketWithGames | null> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();

        const { data: bracket, error: bracketError } = await supabase
          .from("playoff_brackets")
          .select("*")
          .eq("id", bracketId)
          .single();

        if (bracketError || !bracket) return null;

        const { data: games } = await supabase
          .from("playoff_bracket_games")
          .select("*")
          .eq("bracket_id", bracketId)
          .order("round_number")
          .order("game_number");

        return {
          ...bracket,
          games: (games || []) as PlayoffBracketGame[],
        } as PlayoffBracketWithGames;
      },
      null,
      "getPlayoffBracketById"
    );
  }
);

/**
 * Get bracket types available for a sport (used for tab/filter options).
 */
export const getPlayoffBracketTypes = cache(
  async (sportId: string): Promise<{ bracket_type: string; name: string }[]> => {
    return withErrorHandling(
      async () => {
        const supabase = await createClient();

        // Use current season, fallback to most recent with brackets
        const { data: currentSeason } = await supabase
          .from("seasons")
          .select("id")
          .eq("is_current", true)
          .single();

        let typeSeasonId = currentSeason?.id;
        if (!typeSeasonId) {
          const { data: recent } = await supabase
            .from("playoff_brackets")
            .select("season_id")
            .eq("sport_id", sportId)
            .order("season_id", { ascending: false })
            .limit(1)
            .single();
          typeSeasonId = recent?.season_id;
        }
        if (!typeSeasonId) return [];

        const { data, error } = await supabase
          .from("playoff_brackets")
          .select("bracket_type, name")
          .eq("sport_id", sportId)
          .eq("season_id", typeSeasonId)
          .order("name");

        if (error || !data) return [];
        return data as { bracket_type: string; name: string }[];
      },
      [] as { bracket_type: string; name: string }[],
      "getPlayoffBracketTypes"
    );
  }
);
