import { cache } from 'react';
import { createClient, withErrorHandling, withRetry } from './common';

export interface PlayerHighlight {
  id: number;
  player_id: number;
  hudl_url: string;
  title?: string;
  sport_id?: string;
  season_id?: number;
  game_id?: number;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all highlights for a specific player
 * OPTIMIZED: Explicit column selection
 */
export const getPlayerHighlights = cache(
  async (playerId: number) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('player_highlights')
              .select(
                'id, player_id, hudl_url, title, sport_id, season_id, game_id, is_featured, created_at, updated_at'
              )
              .eq('player_id', playerId)
              .order('created_at', { ascending: false });
            return data ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      'DATA_PLAYER_HIGHLIGHTS',
      { playerId }
    );
  }
);

/**
 * Get featured/primary highlight for a player
 * OPTIMIZED: Explicit column selection
 */
export const getFeaturedHighlight = cache(
  async (playerId: number) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('player_highlights')
              .select(
                'id, player_id, hudl_url, title, sport_id, season_id, game_id, is_featured, created_at, updated_at'
              )
              .eq('player_id', playerId)
              .eq('is_featured', true)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
            return data ?? null;
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      null,
      'DATA_FEATURED_HIGHLIGHT',
      { playerId }
    );
  }
);

/**
 * Get highlights for a specific game
 * OPTIMIZED: Explicit column selection
 */
export const getGameHighlights = cache(
  async (gameId: number) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('player_highlights')
              .select(
                'id, player_id, hudl_url, title, sport_id, season_id, game_id, is_featured, created_at, updated_at'
              )
              .eq('game_id', gameId)
              .order('created_at', { ascending: false });
            return data ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      'DATA_GAME_HIGHLIGHTS',
      { gameId }
    );
  }
);
