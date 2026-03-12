import { createStaticClient } from "@/lib/supabase/static";
import { withErrorHandling, withRetry } from "./common";

export interface RecordWithDetails {
  id: number;
  category: string;
  subcategory: string | null;
  scope: string | null;
  record_value: string | null;
  record_number: number | null;
  holder_name: string | null;
  holder_school: string | null;
  year_set: number | null;
  description: string | null;
  player_name: string | null;
  player_slug: string | null;
  school_name: string | null;
  school_slug: string | null;
  season_label: string | null;
  sport_id: string | null;
}

export interface RecordStats {
  total_records: number;
  categories_count: number;
  most_common_category: string;
  school_with_most_records: string;
  school_record_count: number;
}

export type RecordFilter = {
  sport?: string;
  category?: string;
  era?: "all-time" | "2020-26" | "2010-19" | "2000-09" | "pre-2000";
  scope?: "career" | "season" | "game" | "team";
  schoolId?: number;
  schoolSlug?: string;
};

/**
 * Get records with filters applied
 * Supports filtering by sport, category, era, scope, school
 */
export async function getFilteredRecords(
  filters: RecordFilter = {},
  limit: number = 100,
  offset: number = 0
): Promise<RecordWithDetails[]> {
  return withErrorHandling(
    async () => {
      const supabase = createStaticClient();

      // Build query with filters
      let query = supabase
        .from("records")
        .select(
          `
          id,
          category,
          subcategory,
          scope,
          record_value,
          record_number,
          holder_name,
          holder_school,
          year_set,
          description,
          sport_id,
          players(name, slug),
          schools(name, slug),
          seasons(label)
        `
        );

      // Apply era filter (year_set)
      if (filters.era && filters.era !== "all-time") {
        const eraMap: Record<string, [number, number]> = {
          "2020-26": [2020, 2026],
          "2010-19": [2010, 2019],
          "2000-09": [2000, 2009],
          "pre-2000": [1900, 1999],
        };

        const [minYear, maxYear] = eraMap[filters.era];
        query = query
          .gte("year_set", minYear)
          .lte("year_set", maxYear);
      }

      // Apply category filter
      if (filters.category) {
        query = query.ilike("category", `%${filters.category}%`);
      }

      // Apply scope filter
      if (filters.scope) {
        query = query.eq("scope", filters.scope);
      }

      // Apply school filter
      if (filters.schoolId) {
        query = query.eq("school_id", filters.schoolId);
      } else if (filters.schoolSlug) {
        // Need to join schools table for slug filtering
        // This is a limitation of PostgREST - would need RPC for complex filters
        query = query.select(
          `
          id,
          category,
          subcategory,
          scope,
          record_value,
          record_number,
          holder_name,
          holder_school,
          year_set,
          description,
          sport_id,
          players(name, slug),
          schools!inner(name, slug),
          seasons(label)
        `
        );
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) throw error;

      return (
        (data || []).map((record: any) => ({
          id: record.id,
          category: record.category || "Other",
          subcategory: record.subcategory || null,
          scope: record.scope || null,
          record_value: record.record_value || null,
          record_number: record.record_number != null ? Number(record.record_number) : null,
          holder_name: record.holder_name || null,
          holder_school: record.holder_school || record.schools?.name || null,
          year_set: record.year_set || null,
          description: record.description || null,
          player_name: record.players?.name || null,
          player_slug: record.players?.slug || null,
          school_name: record.schools?.name || null,
          school_slug: record.schools?.slug || null,
          season_label: record.seasons?.label || null,
          sport_id: record.sport_id || null,
        })) || []
      );
    },
    [],
    "getFilteredRecords"
  );
}

/**
 * Get distinct categories available for a sport
 */
export async function getRecordCategories(sport?: string): Promise<string[]> {
  return withErrorHandling(
    async () => {
      const supabase = createStaticClient();

      // Get distinct categories
      // Note: PostgREST doesn't support SELECT DISTINCT well, so we fetch all and deduplicate
      const { data, error } = await supabase
        .from("records")
        .select("category")
                .order("category", { ascending: true });

      if (error) throw error;

      const categories = Array.from(
        new Set((data || []).map((r: any) => r.category).filter(Boolean))
      ).sort();

      return categories;
    },
    [],
    "getRecordCategories"
  );
}

/**
 * Get record statistics (total count, most common category, etc.)
 */
export async function getRecordStats(): Promise<RecordStats> {
  return withErrorHandling(
    async () => {
      const supabase = createStaticClient();

      // Fetch all records for analysis
      const { data: allRecords, error: recordsError } = await supabase
        .from("records")
        .select("category, school_id, schools(name)");

      if (recordsError) throw recordsError;

      const records = allRecords || [];

      // Calculate stats
      const categoryCount = new Map<string, number>();
      const schoolCount = new Map<number, string>();

      records.forEach((record: any) => {
        // Count by category
        const cat = record.category || "Other";
        categoryCount.set(cat, (categoryCount.get(cat) || 0) + 1);

        // Count by school
        if (record.school_id) {
          schoolCount.set(record.school_id, record.schools?.name || `School ${record.school_id}`);
        }
      });

      // Find most common category
      let mostCommonCategory = "Other";
      let maxCategoryCount = 0;
      categoryCount.forEach((count, category) => {
        if (count > maxCategoryCount) {
          maxCategoryCount = count;
          mostCommonCategory = category;
        }
      });

      // Find school with most records
      let schoolWithMostRecords = "Unknown";
      let maxSchoolCount = 0;
      let schoolRecordCountValue = 0;

      const schoolRecordMap = new Map<number, number>();
      records.forEach((record: any) => {
        if (record.school_id) {
          schoolRecordMap.set(record.school_id, (schoolRecordMap.get(record.school_id) || 0) + 1);
        }
      });

      schoolRecordMap.forEach((count, schoolId) => {
        if (count > maxSchoolCount) {
          maxSchoolCount = count;
          schoolWithMostRecords = schoolCount.get(schoolId) || `School ${schoolId}`;
          schoolRecordCountValue = count;
        }
      });

      return {
        total_records: records.length,
        categories_count: categoryCount.size,
        most_common_category: mostCommonCategory,
        school_with_most_records: schoolWithMostRecords,
        school_record_count: schoolRecordCountValue,
      };
    },
    {
      total_records: 0,
      categories_count: 0,
      most_common_category: "Other",
      school_with_most_records: "Unknown",
      school_record_count: 0,
    },
    "getRecordStats"
  );
}

/**
 * Get total count of records matching filters
 */
export async function getRecordCount(filters: RecordFilter = {}): Promise<number> {
  return withErrorHandling(
    async () => {
      const supabase = createStaticClient();

      let query = supabase
        .from("records")
        .select("id", { count: "exact", head: true });

      // Apply filters similarly to getFilteredRecords
      if (filters.era && filters.era !== "all-time") {
        const eraMap: Record<string, [number, number]> = {
          "2020-26": [2020, 2026],
          "2010-19": [2010, 2019],
          "2000-09": [2000, 2009],
          "pre-2000": [1900, 1999],
        };

        const [minYear, maxYear] = eraMap[filters.era];
        query = query
          .gte("year_set", minYear)
          .lte("year_set", maxYear);
      }

      if (filters.category) {
        query = query.ilike("category", `%${filters.category}%`);
      }

      if (filters.scope) {
        query = query.eq("scope", filters.scope);
      }

      if (filters.schoolId) {
        query = query.eq("school_id", filters.schoolId);
      }

      const { count, error } = await query;

      if (error) throw error;

      return count || 0;
    },
    0,
    "getRecordCount"
  );
}
