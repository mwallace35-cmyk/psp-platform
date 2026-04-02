import {
  createClient,
  withErrorHandling,
  withRetry,
  type Player,
  type School,
} from "./common";

/**
 * Recruit profile with measurables
 */
export interface RecruitProfile {
  id: number;
  name: string;
  slug: string;
  school_name: string;
  school_slug: string;
  graduation_year?: number;
  height?: string;
  weight?: number;
  positions?: string[];
  forty_time?: number;
  gpa?: number;
  star_rating?: number; // 1-5
  division_preference?: string;
  twitter?: string;
  instagram?: string;
  hudl_url?: string;
  contact_info?: {
    parent_phone?: string;
    parent_email?: string;
    coach_email?: string;
  };
  photo_url?: string;
}

/**
 * Recruiter registration
 */
export interface RecruiterProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  college_university: string;
  title: string;
  sports_recruited: string[];
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

/**
 * Search recruits with filters
 */
export async function searchRecruits(filters: {
  sport?: string;
  position?: string[];
  minHeight?: string;
  minWeight?: number;
  minGpa?: number;
  starRating?: number;
  divisionPreference?: string;
  graduationYearMin?: number;
  graduationYearMax?: number;
  search?: string;
  limit?: number;
}): Promise<RecruitProfile[]> {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();
          const { limit = 50 } = filters;

          let query = supabase
            .from("players")
            .select(
              "id, name, slug, height, weight, positions, graduation_year, primary_school_id, schools:schools!players_primary_school_id_fkey(name, slug)"
            )
            .is("deleted_at", null)
            .limit(limit);

          // Apply filters
          if (filters.search) {
            query = query.ilike("name", `%${filters.search}%`);
          }

          if (filters.graduationYearMin) {
            query = query.gte("graduation_year", filters.graduationYearMin);
          }

          if (filters.graduationYearMax) {
            query = query.lte("graduation_year", filters.graduationYearMax);
          }

          const { data: players, error } = await query;

          if (error) throw error;

          // Convert to recruit profiles
          return ((players ?? []) as any[]).map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            school_name: p.schools?.name || "Unknown",
            school_slug: p.schools?.slug || "",
            graduation_year: p.graduation_year,
            height: p.height,
            weight: p.weight,
            positions: p.positions,
            forty_time: undefined,
            gpa: undefined,
            star_rating: undefined,
            division_preference: undefined,
            twitter: undefined,
            instagram: undefined,
            hudl_url: undefined,
            contact_info: undefined,
            photo_url: undefined,
          }));
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_SEARCH_RECRUITS",
    filters
  );
}

/**
 * Get recruiter profile by user ID
 */
export async function getRecruiterProfile(
  userId: string
): Promise<RecruiterProfile | null> {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          const { data } = await supabase
            .from("recruiter_profiles")
            .select("*")
            .eq("user_id", userId)
            .single();

          return (data ?? null) as unknown as RecruiterProfile | null;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    null,
    "DATA_RECRUITER_PROFILE",
    { userId }
  );
}

/**
 * Get most notable players — ranked by award count as a proxy for visibility
 */
export async function getTopViewedPlayers(limit = 10) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          // Use award count as a popularity proxy (no view tracking yet)
          const { data: awardRows } = await supabase
            .from("awards")
            .select("player_id")
            .not("player_id", "is", null)
            .gte("season_id", 80) // roughly 2020+
            .limit(5000);

          const counts: Record<number, number> = {};
          for (const r of (awardRows ?? []) as { player_id: number }[]) {
            counts[r.player_id] = (counts[r.player_id] || 0) + 1;
          }
          const topIds = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([id]) => parseInt(id));

          if (topIds.length === 0) return [];

          const { data: players } = await supabase
            .from("players")
            .select(
              "id, name, slug, height, weight, positions, graduation_year, schools:schools!players_primary_school_id_fkey(name, slug)"
            )
            .in("id", topIds)
            .is("deleted_at", null);

          return ((players ?? []) as any[]).map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            school_name: p.schools?.name,
            school_slug: p.schools?.slug,
            graduation_year: p.graduation_year,
            height: p.height,
            weight: p.weight,
            positions: p.positions,
          }));
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_TOP_VIEWED_PLAYERS",
    { limit }
  );
}

/**
 * Get recent college commitments from next_level_tracking
 */
export async function getRecentCommits(limit = 10) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          const { data } = await supabase
            .from("next_level_tracking")
            .select("id, person_name, college, sport_id, created_at, schools:high_school_id(name, slug)")
            .eq("current_level", "college")
            .not("college", "is", null)
            .order("created_at", { ascending: false })
            .limit(limit);

          return ((data ?? []) as any[]).map((r) => ({
            id: r.id,
            player_name: r.person_name,
            college: r.college,
            sport_id: r.sport_id,
            school_name: Array.isArray(r.schools) ? r.schools[0]?.name : r.schools?.name,
            school_slug: Array.isArray(r.schools) ? r.schools[0]?.slug : r.schools?.slug,
            committed_at: r.created_at,
          }));
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_RECENT_COMMITS",
    { limit }
  );
}

/**
 * Create recruiter profile (registration)
 */
export async function createRecruiterProfile(
  userId: string,
  profile: Omit<RecruiterProfile, "id" | "user_id" | "created_at">
): Promise<RecruiterProfile> {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          const { data, error } = await supabase
            .from("recruiter_profiles")
            .insert({
              user_id: userId,
              ...profile,
              status: "pending", // Admin must approve
            })
            .select()
            .single();

          if (error) throw error;

          return (data as unknown as RecruiterProfile) || null;
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    {
      id: "",
      user_id: userId,
      name: "",
      email: "",
      college_university: "",
      title: "",
      sports_recruited: [],
      status: "pending",
      created_at: new Date().toISOString(),
    },
    "DATA_CREATE_RECRUITER_PROFILE",
    { userId }
  );
}
