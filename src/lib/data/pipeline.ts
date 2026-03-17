import {
  createClient,
  withErrorHandling,
  withRetry,
  type School,
  type Player,
} from "./common";

/**
 * College with placement count and state info
 */
export interface CollegeWithStats {
  id: string;
  name: string;
  state: string;
  city?: string;
  division?: string;
  conference?: string;
  count: number;
  sports: Record<string, number>;
  players: Array<{
    id: number;
    name: string;
    slug: string;
    sport_id?: string;
  }>;
}

/**
 * HS School with college placement count
 */
export interface SchoolWithCollegePlacements {
  id: number;
  name: string;
  slug: string;
  city?: string;
  state?: string;
  count: number;
  topColleges: string[];
}

/**
 * Get all college placements grouped by college
 */
export async function getCollegePipeline() {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          // Fetch all college placements with sport info
          const { data: placements, error } = await supabase
            .from("next_level_tracking")
            .select("id, person_name, college, sport_id, high_school_id")
            .eq("current_level", "college")
            .eq("status", "active")
            .not("college", "is", null);

          if (error) throw error;

          // Group by college and aggregate stats
          const collegeMap = new Map<string, CollegeWithStats>();

          for (const p of (placements ?? []) as any[]) {
            const collegeName = p.college?.trim() || "Unknown";
            if (!collegeMap.has(collegeName)) {
              collegeMap.set(collegeName, {
                id: collegeName.toLowerCase().replace(/\s+/g, "-"),
                name: collegeName,
                state: "", // TODO: Could enrich with college database
                count: 0,
                sports: {},
                players: [],
              });
            }

            const college = collegeMap.get(collegeName)!;
            college.count++;
            college.sports[p.sport_id || "unknown"] =
              (college.sports[p.sport_id || "unknown"] || 0) + 1;
            college.players.push({
              id: p.person_name,
              name: p.person_name,
              slug: p.person_name.toLowerCase().replace(/\s+/g, "-"),
              sport_id: p.sport_id,
            });
          }

          return Array.from(collegeMap.values()).sort((a, b) => b.count - a.count);
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_COLLEGE_PIPELINE",
    {}
  );
}

/**
 * Get college placements grouped by state
 */
export async function getPipelineByState() {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          // Fetch all college placements
          const { data: placements, error } = await supabase
            .from("next_level_tracking")
            .select("college")
            .eq("current_level", "college")
            .eq("status", "active")
            .not("college", "is", null);

          if (error) throw error;

          // Group by state (using college name parsing or external mapping)
          // For now, we'll return a basic structure
          // A real implementation would use a college database lookup
          const stateMap = new Map<string, { count: number; colleges: Set<string> }>();

          for (const p of (placements ?? []) as any[]) {
            const collegeName = p.college?.trim() || "Unknown";
            // This is a simplified version - in production, you'd lookup the actual state
            // based on college name (using a college database or API)
            const state = "Unknown"; // Would be enriched

            if (!stateMap.has(state)) {
              stateMap.set(state, { count: 0, colleges: new Set() });
            }
            const entry = stateMap.get(state)!;
            entry.count++;
            entry.colleges.add(collegeName);
          }

          return Array.from(stateMap.entries()).map(([state, data]) => ({
            state,
            count: data.count,
            collegeCount: data.colleges.size,
            colleges: Array.from(data.colleges),
          }));
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_PIPELINE_BY_STATE",
    {}
  );
}

/**
 * Get college placements from a specific HS school
 */
export async function getPipelineBySchool(schoolId: number) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          const { data: placements, error } = await supabase
            .from("next_level_tracking")
            .select("person_name, college, sport_id")
            .eq("high_school_id", schoolId)
            .eq("current_level", "college")
            .eq("status", "active")
            .not("college", "is", null);

          if (error) throw error;

          // Group by college
          const collegeMap = new Map<string, { count: number; sports: Set<string> }>();

          for (const p of (placements ?? []) as any[]) {
            const collegeName = p.college?.trim() || "Unknown";
            if (!collegeMap.has(collegeName)) {
              collegeMap.set(collegeName, { count: 0, sports: new Set() });
            }
            const entry = collegeMap.get(collegeName)!;
            entry.count++;
            if (p.sport_id) entry.sports.add(p.sport_id);
          }

          return Array.from(collegeMap.entries())
            .map(([collegeName, data]) => ({
              collegeName,
              count: data.count,
              sports: Array.from(data.sports),
            }))
            .sort((a, b) => b.count - a.count);
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_PIPELINE_BY_SCHOOL",
    { schoolId }
  );
}

/**
 * Get top HS schools ranked by college placement count
 */
export async function getTopPipelineSchools(limit = 20) {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          const { data: placements, error } = await supabase
            .from("next_level_tracking")
            .select(
              "high_school_id, schools!next_level_tracking_high_school_id_fkey(id, name, slug, city, state)"
            )
            .eq("current_level", "college")
            .eq("status", "active");

          if (error) throw error;

          // Group by school
          const schoolMap = new Map<
            number,
            {
              id: number;
              name: string;
              slug: string;
              city?: string;
              state?: string;
              count: number;
            }
          >();

          for (const p of (placements ?? []) as any[]) {
            if (!p.high_school_id || !p.schools) continue;
            const schoolId = p.high_school_id;

            if (!schoolMap.has(schoolId)) {
              schoolMap.set(schoolId, {
                id: schoolId,
                name: p.schools.name,
                slug: p.schools.slug,
                city: p.schools.city,
                state: p.schools.state,
                count: 0,
              });
            }

            const school = schoolMap.get(schoolId)!;
            school.count++;
          }

          return Array.from(schoolMap.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    [],
    "DATA_TOP_PIPELINE_SCHOOLS",
    { limit }
  );
}

/**
 * Get pipeline summary stats
 */
export async function getPipelineSummary() {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const supabase = await createClient();

          const [collegeRes, proRes, collegeCountRes, schoolCountRes] =
            await Promise.all([
              supabase
                .from("next_level_tracking")
                .select("id", { count: "exact", head: true })
                .eq("current_level", "college")
                .eq("status", "active"),
              supabase
                .from("next_level_tracking")
                .select("id", { count: "exact", head: true })
                .eq("current_level", "pro"),
              supabase
                .from("next_level_tracking")
                .select("college", { count: "exact" })
                .eq("current_level", "college")
                .eq("status", "active")
                .not("college", "is", null),
              supabase
                .from("next_level_tracking")
                .select("high_school_id", { count: "exact" })
                .eq("current_level", "college")
                .eq("status", "active")
                .not("high_school_id", "is", null),
            ]);

          return {
            totalTracked: (collegeRes.count ?? 0) + (proRes.count ?? 0),
            collegeAthletes: collegeRes.count ?? 0,
            proAthletes: proRes.count ?? 0,
            collegeCount: collegeCountRes.count ?? 0,
            hsSchoolCount: schoolCountRes.count ?? 0,
          };
        },
        { maxRetries: 2, baseDelay: 500 }
      );
    },
    {
      totalTracked: 0,
      collegeAthletes: 0,
      proAthletes: 0,
      collegeCount: 0,
      hsSchoolCount: 0,
    },
    "DATA_PIPELINE_SUMMARY",
    {}
  );
}
