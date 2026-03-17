import { cache } from 'react';
import { createClient, withErrorHandling, withRetry } from './common';

export interface CoachingStaffMember {
  id: number;
  school_id: number;
  sport_id: string;
  coach_name: string;
  role: string;
  start_year?: number;
  end_year?: number;
  bio?: string;
  photo_url?: string;
  twitter_handle?: string;
  instagram_handle?: string;
  email?: string;
  former_player_id?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get coaching staff for a specific school and sport
 * OPTIMIZED: Explicit column selection
 */
export const getCoachingStaff = cache(
  async (schoolId: number, sportId: string) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('coaching_staff')
              .select(
                'id, school_id, sport_id, coach_name, role, start_year, end_year, bio, photo_url, twitter_handle, instagram_handle, email, former_player_id'
              )
              .eq('school_id', schoolId)
              .eq('sport_id', sportId)
              .order('start_year', { ascending: false });
            return data ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      'DATA_COACHING_STAFF',
      { schoolId, sportId }
    );
  }
);

/**
 * Get all coaching staff for a school across all sports
 * OPTIMIZED: Explicit column selection
 */
export const getCoachingStaffBySchool = cache(
  async (schoolId: number) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('coaching_staff')
              .select(
                'id, school_id, sport_id, coach_name, role, start_year, end_year, bio, photo_url, twitter_handle, instagram_handle, email, former_player_id'
              )
              .eq('school_id', schoolId)
              .order('sport_id', { ascending: true })
              .order('start_year', { ascending: false });
            return data ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      'DATA_COACHING_STAFF_BY_SCHOOL',
      { schoolId }
    );
  }
);

/**
 * Get current head coach for a school and sport
 * OPTIMIZED: Explicit column selection
 */
export const getCurrentHeadCoach = cache(
  async (schoolId: number, sportId: string) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('coaching_staff')
              .select(
                'id, school_id, sport_id, coach_name, role, start_year, end_year, bio, photo_url, twitter_handle, instagram_handle, email, former_player_id'
              )
              .eq('school_id', schoolId)
              .eq('sport_id', sportId)
              .eq('role', 'head-coach')
              .is('end_year', null)
              .order('start_year', { ascending: false })
              .limit(1)
              .single();
            return data ?? null;
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      null,
      'DATA_CURRENT_HEAD_COACH',
      { schoolId, sportId }
    );
  }
);

/**
 * Get coaching history for a school and sport
 * OPTIMIZED: Explicit column selection
 */
export const getCoachingHistory = cache(
  async (schoolId: number, sportId: string) => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();
            const { data } = await supabase
              .from('coaching_staff')
              .select(
                'id, school_id, sport_id, coach_name, role, start_year, end_year, bio, photo_url, twitter_handle, instagram_handle, email, former_player_id'
              )
              .eq('school_id', schoolId)
              .eq('sport_id', sportId)
              .eq('role', 'head-coach')
              .order('end_year', { ascending: false, nullsFirst: true })
              .order('start_year', { ascending: false });
            return data ?? [];
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      [],
      'DATA_COACHING_HISTORY',
      { schoolId, sportId }
    );
  }
);
