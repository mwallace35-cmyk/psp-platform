import { cache } from 'react';
import { createClient, withErrorHandling, withRetry } from './common';

export interface MediaItem {
  id: string;
  storage_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  media_type: 'photo' | 'video';
  width?: number;
  height?: number;
  duration_seconds?: number;
  thumbnail_path?: string;
  status: 'pending' | 'approved' | 'rejected';
  moderated_by?: string;
  moderated_at?: string;
  rejection_reason?: string;
  game_id?: number;
  school_id?: number;
  season_id?: number;
  sport?: string;
  player_id?: number;
  category: 'game_action' | 'headshot' | 'team_photo' | 'highlight_clip' | 'recap' | 'other';
  caption?: string;
  tags?: string[];
  uploaded_by?: string;
  is_featured: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

const MEDIA_COLUMNS =
  'id, storage_path, file_name, file_size, mime_type, media_type, width, height, duration_seconds, thumbnail_path, status, moderated_by, moderated_at, rejection_reason, game_id, school_id, season_id, sport, player_id, category, caption, tags, uploaded_by, is_featured, sort_order, created_at, updated_at';

/**
 * Get approved media for a specific game
 * OPTIMIZED: Explicit column selection
 */
export const getMediaForGame = cache(
  async (gameId: number) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('media')
              .select(MEDIA_COLUMNS)
              .eq('game_id', gameId)
              .eq('status', 'approved')
              .order('sort_order', { ascending: true, nullsFirst: false })
              .order('created_at', { ascending: false });
            return (data ?? []) as MediaItem[];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      'DATA_MEDIA_GAME',
      { gameId }
    );
  }
);

/**
 * Get approved media for a specific school
 * OPTIMIZED: Explicit column selection
 */
export const getMediaForSchool = cache(
  async (schoolId: number) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('media')
              .select(MEDIA_COLUMNS)
              .eq('school_id', schoolId)
              .eq('status', 'approved')
              .order('sort_order', { ascending: true, nullsFirst: false })
              .order('created_at', { ascending: false });
            return (data ?? []) as MediaItem[];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      'DATA_MEDIA_SCHOOL',
      { schoolId }
    );
  }
);

/**
 * Get approved media for a specific player
 * OPTIMIZED: Explicit column selection
 */
export const getMediaForPlayer = cache(
  async (playerId: number) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('media')
              .select(MEDIA_COLUMNS)
              .eq('player_id', playerId)
              .eq('status', 'approved')
              .order('sort_order', { ascending: true, nullsFirst: false })
              .order('created_at', { ascending: false });
            return (data ?? []) as MediaItem[];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      'DATA_MEDIA_PLAYER',
      { playerId }
    );
  }
);

/**
 * Get all pending media for admin moderation queue
 * OPTIMIZED: Explicit column selection
 */
export const getPendingMedia = cache(
  async () => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('media')
              .select(MEDIA_COLUMNS)
              .eq('status', 'pending')
              .order('created_at', { ascending: true });
            return (data ?? []) as MediaItem[];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      'DATA_MEDIA_PENDING',
      {}
    );
  }
);

/**
 * Get approved + featured media, optionally filtered by sport
 * OPTIMIZED: Explicit column selection
 */
export const getFeaturedMedia = cache(
  async (sport?: string, limit = 20) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            let query = supabase
              .from('media')
              .select(MEDIA_COLUMNS)
              .eq('status', 'approved')
              .eq('is_featured', true)
              .order('sort_order', { ascending: true, nullsFirst: false })
              .order('created_at', { ascending: false })
              .limit(limit);

            if (sport) {
              query = query.eq('sport', sport);
            }

            const { data } = await query;
            return (data ?? []) as MediaItem[];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      'DATA_MEDIA_FEATURED',
      { sport, limit }
    );
  }
);

/**
 * Get a single media item by ID
 * OPTIMIZED: Explicit column selection
 */
export const getMediaById = cache(
  async (id: string) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('media')
              .select(MEDIA_COLUMNS)
              .eq('id', id)
              .single();
            return (data ?? null) as MediaItem | null;
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      null,
      'DATA_MEDIA_BY_ID',
      { id }
    );
  }
);
