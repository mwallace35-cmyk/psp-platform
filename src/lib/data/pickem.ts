import { cache } from 'react';
import { createClient, withErrorHandling, withRetry, Season } from './common';

export interface PickemWeek {
  id: number;
  sport_id: string;
  season_id: number;
  week_number: number;
  title?: string;
  status: string;
  opens_at?: string;
  closes_at?: string;
  created_at?: string;
  seasons?: Season;
}

export interface PickemGame {
  id: number;
  week_id: number;
  game_id: number;
  home_school_id: number;
  away_school_id: number;
  featured: boolean;
  created_at?: string;
}

export interface PickemPick {
  id: number;
  week_id: number;
  game_id: number;
  user_id: string;
  picked_school_id: number;
  is_correct?: boolean;
  created_at?: string;
}

export interface PickemLeaderboardEntry {
  id: number;
  user_id: string;
  sport_id: string;
  season_id: number;
  total_picks: number;
  correct_picks: number;
  current_streak: number;
  best_streak: number;
  updated_at?: string;
}

/**
 * Get the current active pickem week for a sport
 * OPTIMIZED: Explicit column selection
 */
export const getCurrentPickemWeek = cache(
  async (sportId: string) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const now = new Date().toISOString();
            const { data } = await supabase
              .from('pickem_weeks')
              .select(
                'id, sport_id, season_id, week_number, title, status, opens_at, closes_at, created_at, seasons(year_start, year_end, label)'
              )
              .eq('sport_id', sportId)
              .lt('opens_at', now)
              .gt('closes_at', now)
              .single();
            return data ?? null;
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      null,
      'DATA_CURRENT_PICKEM_WEEK',
      { sportId }
    );
  }
);

/**
 * Get all pickem games for a specific week
 * OPTIMIZED: Explicit column selection
 */
export const getPickemGames = cache(
  async (weekId: number) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('pickem_games')
              .select(
                'id, week_id, game_id, home_school_id, away_school_id, featured, created_at'
              )
              .eq('week_id', weekId)
              .order('created_at', { ascending: true });
            return data ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      'DATA_PICKEM_GAMES',
      { weekId }
    );
  }
);

/**
 * Get user's picks for a specific week
 * OPTIMIZED: Explicit column selection
 */
export const getUserPicks = cache(
  async (userId: string, weekId: number) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('pickem_picks')
              .select(
                'id, week_id, game_id, user_id, picked_school_id, is_correct, created_at'
              )
              .eq('user_id', userId)
              .eq('week_id', weekId);
            return data ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      'DATA_USER_PICKS',
      { userId, weekId }
    );
  }
);

/**
 * Get pickem leaderboard for a sport and season
 * OPTIMIZED: Explicit column selection
 */
export const getPickemLeaderboard = cache(
  async (sportId: string, seasonId: number) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('pickem_leaderboard')
              .select(
                'id, user_id, sport_id, season_id, total_picks, correct_picks, current_streak, best_streak, updated_at'
              )
              .eq('sport_id', sportId)
              .eq('season_id', seasonId)
              .order('correct_picks', { ascending: false })
              .order('best_streak', { ascending: false })
              .limit(100);
            return data ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      'DATA_PICKEM_LEADERBOARD',
      { sportId, seasonId }
    );
  }
);

/**
 * Get a user's pickem history (all seasons and sports)
 * OPTIMIZED: Explicit column selection
 */
export const getPickemHistory = cache(
  async (userId: string) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('pickem_leaderboard')
              .select(
                'id, user_id, sport_id, season_id, total_picks, correct_picks, current_streak, best_streak, updated_at'
              )
              .eq('user_id', userId)
              .order('updated_at', { ascending: false });
            return data ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      'DATA_PICKEM_HISTORY',
      { userId }
    );
  }
);
