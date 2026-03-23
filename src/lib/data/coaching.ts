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
              .from('coaching_stints')
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
              .from('coaching_stints')
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
              .from('coaching_stints')
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
              .from('coaching_stints')
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

// ============================================================================
// COACHING RECORDS (computed from team_seasons + coaching_stints)
// ============================================================================

export interface CoachingRecordStint {
  school_name: string;
  school_slug: string;
  sport: string;
  start_year: number;
  end_year: number | null;
  wins: number;
  losses: number;
  ties: number;
  championships: number;
}

export interface CoachingRecordResult {
  coach_name: string;
  coach_id: number;
  stints: CoachingRecordStint[];
  career_wins: number;
  career_losses: number;
  career_ties: number;
  career_championships: number;
}

/**
 * Get full coaching record for a coach across all stints.
 * Joins coaching_stints with team_seasons to compute W-L-T per stint,
 * falling back to the pre-computed record_wins/record_losses on the stint.
 */
export const getCoachingRecord = cache(
  async (coachId: number): Promise<CoachingRecordResult | null> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Get all stints for this coach with school info
            const { data: stints } = await supabase
              .from('coaching_stints')
              .select(
                `id, coach_id, school_id, sport_id, coach_name, role, start_year, end_year,
                 record_wins, record_losses, record_ties, championships,
                 schools!coaching_stints_school_id_fkey(id, name, slug)`
              )
              .eq('coach_id', coachId)
              .order('start_year', { ascending: true });

            if (!stints || stints.length === 0) return null;

            const coachName = (stints[0] as any).coach_name ?? 'Unknown Coach';

            // For each stint, try to compute record from team_seasons
            const result: CoachingRecordStint[] = [];

            for (const stint of stints as any[]) {
              const school = Array.isArray(stint.schools) ? stint.schools[0] : stint.schools;
              const schoolName = school?.name ?? 'Unknown School';
              const schoolSlug = school?.slug ?? '';

              // Query team_seasons that overlap with this stint
              let query = supabase
                .from('team_seasons')
                .select('wins, losses, ties, seasons!inner(year_start)')
                .eq('school_id', stint.school_id)
                .eq('sport_id', stint.sport_id)
                .gte('seasons.year_start', stint.start_year);

              if (stint.end_year != null) {
                query = query.lte('seasons.year_start', stint.end_year);
              }

              const { data: seasons } = await query;

              let wins = 0;
              let losses = 0;
              let ties = 0;

              if (seasons && seasons.length > 0) {
                // Sum from actual team_seasons data
                for (const s of seasons as any[]) {
                  wins += s.wins ?? 0;
                  losses += s.losses ?? 0;
                  ties += s.ties ?? 0;
                }
              } else {
                // Fall back to pre-computed record on the stint
                wins = stint.record_wins ?? 0;
                losses = stint.record_losses ?? 0;
                ties = stint.record_ties ?? 0;
              }

              result.push({
                school_name: schoolName,
                school_slug: schoolSlug,
                sport: stint.sport_id,
                start_year: stint.start_year,
                end_year: stint.end_year,
                wins,
                losses,
                ties,
                championships: stint.championships ?? 0,
              });
            }

            const careerWins = result.reduce((sum, s) => sum + s.wins, 0);
            const careerLosses = result.reduce((sum, s) => sum + s.losses, 0);
            const careerTies = result.reduce((sum, s) => sum + s.ties, 0);
            const careerChampionships = result.reduce((sum, s) => sum + s.championships, 0);

            return {
              coach_name: coachName,
              coach_id: coachId,
              stints: result,
              career_wins: careerWins,
              career_losses: careerLosses,
              career_ties: careerTies,
              career_championships: careerChampionships,
            };
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      null,
      'DATA_COACHING_RECORD',
      { coachId }
    );
  }
);

/**
 * Get the current head coach's record at a specific school and sport.
 * Returns the coach name, record at this school, career record, and years.
 */
export const getCoachRecord = cache(
  async (schoolId: number, sportId: string): Promise<{
    coach_name: string;
    coach_id: number;
    start_year: number;
    school_wins: number;
    school_losses: number;
    school_ties: number;
    school_championships: number;
    career_wins: number;
    career_losses: number;
    career_ties: number;
    career_championships: number;
  } | null> => {
    return withErrorHandling(
      async () => {
        return withRetry(
          async () => {
            const supabase = await createClient();

            // Find the current head coach stint at this school
            const { data: currentStint } = await supabase
              .from('coaching_stints')
              .select(
                'id, coach_id, school_id, sport_id, coach_name, start_year, end_year, record_wins, record_losses, record_ties, championships'
              )
              .eq('school_id', schoolId)
              .eq('sport_id', sportId)
              .eq('role', 'head-coach')
              .is('end_year', null)
              .order('start_year', { ascending: false })
              .limit(1)
              .single();

            if (!currentStint) return null;
            const stint = currentStint as any;

            // Get team_seasons for this coach's tenure at this school
            const { data: seasons } = await supabase
              .from('team_seasons')
              .select('wins, losses, ties, seasons!inner(year_start)')
              .eq('school_id', schoolId)
              .eq('sport_id', sportId)
              .gte('seasons.year_start', stint.start_year);

            let schoolWins = 0;
            let schoolLosses = 0;
            let schoolTies = 0;

            if (seasons && seasons.length > 0) {
              for (const s of seasons as any[]) {
                schoolWins += s.wins ?? 0;
                schoolLosses += s.losses ?? 0;
                schoolTies += s.ties ?? 0;
              }
            } else {
              schoolWins = stint.record_wins ?? 0;
              schoolLosses = stint.record_losses ?? 0;
              schoolTies = stint.record_ties ?? 0;
            }

            // Get all stints for this coach to compute career record
            const { data: allStints } = await supabase
              .from('coaching_stints')
              .select('school_id, sport_id, start_year, end_year, record_wins, record_losses, record_ties, championships')
              .eq('coach_id', stint.coach_id);

            let careerWins = 0;
            let careerLosses = 0;
            let careerTies = 0;
            let careerChampionships = 0;

            if (allStints) {
              for (const s of allStints as any[]) {
                // Try team_seasons for each stint
                let stintQuery = supabase
                  .from('team_seasons')
                  .select('wins, losses, ties, seasons!inner(year_start)')
                  .eq('school_id', s.school_id)
                  .eq('sport_id', s.sport_id)
                  .gte('seasons.year_start', s.start_year);

                if (s.end_year != null) {
                  stintQuery = stintQuery.lte('seasons.year_start', s.end_year);
                }

                const { data: stintSeasons } = await stintQuery;

                if (stintSeasons && stintSeasons.length > 0) {
                  for (const ss of stintSeasons as any[]) {
                    careerWins += ss.wins ?? 0;
                    careerLosses += ss.losses ?? 0;
                    careerTies += ss.ties ?? 0;
                  }
                } else {
                  careerWins += s.record_wins ?? 0;
                  careerLosses += s.record_losses ?? 0;
                  careerTies += s.record_ties ?? 0;
                }
                careerChampionships += s.championships ?? 0;
              }
            }

            return {
              coach_name: stint.coach_name,
              coach_id: stint.coach_id,
              start_year: stint.start_year,
              school_wins: schoolWins,
              school_losses: schoolLosses,
              school_ties: schoolTies,
              school_championships: stint.championships ?? 0,
              career_wins: careerWins,
              career_losses: careerLosses,
              career_ties: careerTies,
              career_championships: careerChampionships,
            };
          },
          { maxRetries: 2, baseDelay: 500 }
        );
      },
      null,
      'DATA_COACH_RECORD',
      { schoolId, sportId }
    );
  }
);
