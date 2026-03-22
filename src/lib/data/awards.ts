import { cache } from "react";
import {
  createClient,
  withErrorHandling,
  withRetry,
  type Season,
} from "./common";

/**
 * Award record with all relations — uses direct fields from awards table
 * plus linked player/school data when available
 */
export interface AwardRecord {
  id: number;
  award_type: string;
  award_name?: string;
  category?: string;
  position?: string;
  source?: string;
  award_tier?: string;
  /** Player name — from linked player or direct award field */
  displayName: string;
  /** School info — from linked player's school or direct award school_id */
  school?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  players?: {
    id: number;
    name: string;
    slug: string;
    primary_school_id?: number;
    schools?: {
      id: number;
      name: string;
      slug: string;
    } | null;
  } | null;
  seasons?: Season | null;
}

/**
 * All-City selection by year
 */
export interface AllCityYear {
  year_start: number;
  year_end: number;
  label: string;
  awards: AwardRecord[];
}

/**
 * Helper: fetch all All-City awards for a sport using PostgREST
 * OPTIMIZED: Uses standard .from().select() instead of dropped RPC
 */
async function fetchAllCityAwardsJson(sport: string) {
  const supabase = await createClient();

  try {
    // Fetch awards for All-City category, ordered by year descending
    // OPTIMIZED: Uses year column directly instead of seasons FK join
    const { data, error, count } = await supabase
      .from("awards")
      .select(
        `id,
         award_type,
         award_name,
         category,
         position,
         source,
         award_tier,
         player_id,
         player_name,
         school_id,
         year,
         players(id, name, slug, graduation_year),
         schools(id, name, slug)`,
        { count: "exact" }
      )
      .eq("award_type", `${sport}-all-city`)
      .order("year", { ascending: false, nullsFirst: false })
      .limit(5000);

    if (error) {
      console.warn("[PSP] All-City awards query failed:", error.message);
      return null;
    }

    if (!data || !Array.isArray(data)) return null;

    // Transform data using year column directly
    const awards = data.map((row: any) => ({
      award_id: row.id,
      award_type: row.award_type,
      award_name: row.award_name,
      category: row.category,
      award_position: row.position,
      award_source: row.source,
      award_tier: row.award_tier,
      player_id: row.player_id,
      direct_player_name: row.player_name || null,
      player_name: row.players?.name || null,
      player_slug: row.players?.slug || null,
      graduation_year: row.players?.graduation_year || null,
      school_id: row.schools?.id || null,
      school_name: row.schools?.name || null,
      school_slug: row.schools?.slug || null,
      year_start: row.year || null,
      year_end: row.year ? row.year + 1 : null,
      season_label: row.year ? yearToSeasonLabel(row.year) : null,
    }));

    return { awards, total_count: count || 0 };
  } catch (err) {
    console.warn("[PSP] All-City awards fetch error:", err);
    return null;
  }
}

/**
 * Normalize award_tier to consistent format
 */
function normalizeTier(tier?: string | null, category?: string | null): string | undefined {
  const raw = tier || category || "";
  const lower = raw.toLowerCase().replace(/[- ]/g, "");
  if (lower.includes("first")) return "First Team";
  if (lower.includes("second")) return "Second Team";
  if (lower.includes("third")) return "Third Team";
  if (lower.includes("honorable")) return "Honorable Mention";
  if (lower === "offense") return undefined; // Not a tier
  if (lower === "defense") return undefined; // Not a tier
  return undefined;
}

/**
 * Classify position as offense or defense for post-1969 display
 */
function classifySide(position?: string | null): "offense" | "defense" | "special" | null {
  if (!position) return null;
  const pos = position.toUpperCase().replace(/[.\s]/g, "");
  // Offense positions
  if (["QB", "RB", "HB", "FB", "WR", "REC", "TE", "OL", "T", "G", "C", "E", "L", "B", "MP", "IL", "AP", "ATH", "MULTI-PURPOSE", "MULTIPURPOSE"].includes(pos)) {
    // L, B, E, IL are ambiguous (could be offensive or defensive linemen/backs/ends)
    // We'll handle these as "both" and let the category/award_tier context decide
    if (["L", "B", "E", "IL"].includes(pos)) return null; // ambiguous
    return "offense";
  }
  // Defense positions
  if (["DL", "LB", "ILB", "DB", "DE", "DT", "S", "CB", "NG"].includes(pos)) return "defense";
  // Special teams
  if (["K", "P", "KR", "SPEC"].includes(pos)) return "special";
  // Two-way players
  if (pos.includes("-") || pos.includes("/")) return null;
  return null;
}

/**
 * Map a raw JSON award row to AwardRecord format
 */
function mapAwardRow(row: any): AwardRecord {
  // Resolve display name: prefer linked player, then direct player_name
  // Do NOT fall through to award_name — it's the award publication (e.g. "Daily News All-City"), not a player
  const displayName =
    (row.player_id ? row.player_name : null) ||
    row.direct_player_name ||
    "Name Not Available";

  // Resolve school: COALESCE already handled in RPC (player school > direct school)
  const schoolId = row.school_id;
  const schoolName = row.school_name;
  const schoolSlug = row.school_slug;

  return {
    id: row.award_id,
    award_type: row.award_type,
    award_name: row.award_name,
    category: row.category,
    position: row.award_position,
    source: row.award_source,
    award_tier: normalizeTier(row.award_tier, row.category),
    displayName,
    school: schoolId
      ? { id: schoolId, name: schoolName, slug: schoolSlug }
      : null,
    players: row.player_id
      ? {
          id: row.player_id,
          name: row.player_name,
          slug: row.player_slug,
          primary_school_id: row.school_id,
          schools: row.school_id
            ? {
                id: row.school_id,
                name: row.school_name,
                slug: row.school_slug,
              }
            : null,
        }
      : null,
    seasons: row.year_start
      ? {
          year_start: row.year_start,
          year_end: row.year_end,
          label: row.season_label,
        }
      : null,
  };
}

/**
 * Get all-city awards by year for a sport — uses PostgREST to bypass timeout issues
 */
export const getAllCityByYear = cache(async (sport: string) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const result = await fetchAllCityAwardsJson(sport);
          if (!result?.awards) return [];
          return result.awards.map(mapAwardRow);
        },
        { maxRetries: 3 }
      );
    },
    [],
    "getAllCityByYear",
    { sport }
  );
});

/**
 * Get all-city summary stats — computed from the same PostgREST data
 */
export const getAllCitySummary = cache(async (sport: string) => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const result = await fetchAllCityAwardsJson(sport);
          if (!result?.awards) {
            return {
              totalSelections: 0,
              yearsSpanned: { min: 0, max: 0 },
              schoolsRepresented: 0,
              topSchools: [] as { name: string; count: number }[],
            };
          }

          const awards = result.awards;
          const totalSelections = awards.length;
          const yearsSet = new Set<number>();
          const schoolsSet = new Set<string>();
          const schoolCounts: Record<string, { name: string; count: number }> = {};

          for (const row of awards) {
            if (row.year_start) {
              yearsSet.add(row.year_start);
            }
            // Use COALESCE'd school_slug from RPC
            if (row.school_slug) {
              schoolsSet.add(row.school_slug);
              if (!schoolCounts[row.school_slug]) {
                schoolCounts[row.school_slug] = { name: row.school_name, count: 0 };
              }
              schoolCounts[row.school_slug].count++;
            }
          }

          const topSchools = Object.values(schoolCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

          return {
            totalSelections,
            yearsSpanned: {
              min: yearsSet.size > 0 ? Math.min(...Array.from(yearsSet)) : 0,
              max: yearsSet.size > 0 ? Math.max(...Array.from(yearsSet)) : 0,
            },
            schoolsRepresented: schoolsSet.size,
            topSchools,
          };
        },
        { maxRetries: 3 }
      );
    },
    {
      totalSelections: 0,
      yearsSpanned: { min: 0, max: 0 },
      schoolsRepresented: 0,
      topSchools: [],
    },
    "getAllCitySummary",
    { sport }
  );
});

// ─── Awards & Honors Page (All Types) ───────────────────────────────────────

/**
 * Tab category definitions for the Awards & Honors page
 */
export interface AwardTabCategory {
  id: string;
  label: string;
  shortLabel: string;
  matchTypes: string[];
  description: string;
}

export const AWARD_TAB_CATEGORIES: AwardTabCategory[] = [
  {
    id: "all-city",
    label: "All-City / All-Scholastic",
    shortLabel: "All-City",
    matchTypes: ["all-city", "all-scholastic"],
    description: "Philadelphia All-City and All-Scholastic selections",
  },
  {
    id: "all-catholic",
    label: "All-Catholic",
    shortLabel: "Catholic",
    matchTypes: ["all-catholic"],
    description: "Catholic League All-Star selections",
  },
  {
    id: "all-public",
    label: "All-Public",
    shortLabel: "Public",
    matchTypes: ["all-public"],
    description: "Public League All-Star selections",
  },
  {
    id: "all-inter-ac",
    label: "All-Inter-Ac",
    shortLabel: "Inter-Ac",
    matchTypes: ["all-inter-ac"],
    description: "Inter-Academic League All-Star selections",
  },
  {
    id: "all-state",
    label: "All-State",
    shortLabel: "State",
    matchTypes: ["all-state"],
    description: "Pennsylvania All-State selections",
  },
  {
    id: "poty",
    label: "Player of the Year",
    shortLabel: "POTY",
    matchTypes: ["player-of-year"],
    description: "Player of the Year and top individual awards",
  },
  {
    id: "all-era",
    label: "All-Decade / All-Era",
    shortLabel: "All-Era",
    matchTypes: ["all-decade", "all-era"],
    description: "All-Decade and All-Era team selections",
  },
  {
    id: "stat-leaders",
    label: "Stat Leaders & All-League",
    shortLabel: "Leaders",
    matchTypes: ["stat-leader", "all-league", "coaches-all-league"],
    description: "Statistical leaders and coaches All-League selections",
  },
];

/**
 * Normalize award_type by stripping the sport prefix if present
 * e.g. "football-all-city" → "all-city", "all-catholic" → "all-catholic"
 */
export function normalizeAwardType(awardType: string, sport: string): string {
  const prefix = `${sport}-`;
  if (awardType.startsWith(prefix)) {
    return awardType.slice(prefix.length);
  }
  return awardType;
}

/**
 * Match a normalized award_type to a tab category ID
 */
function matchAwardToTab(normalizedType: string): string | null {
  for (const tab of AWARD_TAB_CATEGORIES) {
    if (tab.matchTypes.includes(normalizedType)) {
      return tab.id;
    }
  }
  return null;
}

/**
 * Grouped awards data for the Awards & Honors page
 */
export interface AwardsPageData {
  tabs: {
    id: string;
    label: string;
    shortLabel: string;
    description: string;
    count: number;
    awards: AwardRecord[];
  }[];
  totalCount: number;
  topSchools: { name: string; slug: string; count: number }[];
  yearsSpanned: { min: number; max: number };
  schoolsRepresented: number;
}

/**
 * Compute season label from year: e.g. 2025 → "24-25" (school year format)
 * The year in the DB is the spring/end year, so 2025 means the 2024-25 season.
 */
function yearToSeasonLabel(year: number): string {
  const startYear = year - 1;
  return `${String(startYear).slice(-2)}-${String(year).slice(-2)}`;
}

/**
 * Helper: fetch ALL awards for a sport using PostgREST
 * OPTIMIZED: Uses year column directly instead of seasons FK join to avoid timeouts
 */
async function fetchAllAwardsForSport(sport: string) {
  const supabase = await createClient();

  try {
    // Use OR filter: sport_id matches OR award_type starts with sport-
    // NOTE: Removed seasons() FK join — uses denormalized year column instead
    // This reduces query complexity and prevents Supabase timeouts on 10K+ rows
    const { data, error, count } = await supabase
      .from("awards")
      .select(
        `id,
         award_type,
         award_name,
         category,
         position,
         source,
         award_tier,
         player_id,
         player_name,
         school_id,
         year,
         players(id, name, slug, graduation_year),
         schools(id, name, slug)`,
        { count: "exact" }
      )
      .or(`sport_id.eq.${sport},award_type.like.${sport}-%`)
      .order("year", { ascending: false, nullsFirst: false })
      .limit(15000);

    if (error) {
      console.warn("[PSP] All awards query failed:", error.message);
      return null;
    }

    if (!data || !Array.isArray(data)) return null;

    // Transform to flat format using year column directly
    const awards = data.map((row: any) => ({
      award_id: row.id,
      award_type: row.award_type,
      award_name: row.award_name,
      category: row.category,
      award_position: row.position,
      award_source: row.source,
      award_tier: row.award_tier,
      player_id: row.player_id,
      direct_player_name: row.player_name || null,
      player_name: row.players?.name || null,
      player_slug: row.players?.slug || null,
      graduation_year: row.players?.graduation_year || null,
      school_id: row.schools?.id || null,
      school_name: row.schools?.name || null,
      school_slug: row.schools?.slug || null,
      year_start: row.year || null,
      year_end: row.year ? row.year + 1 : null,
      season_label: row.year ? yearToSeasonLabel(row.year) : null,
    }));

    return { awards, total_count: count || 0 };
  } catch (err) {
    console.warn("[PSP] All awards fetch error:", err);
    return null;
  }
}

/**
 * Get all awards for a sport, grouped by tab category — for the Awards & Honors page
 */
export const getAwardsPageData = cache(async (sport: string): Promise<AwardsPageData> => {
  return withErrorHandling(
    async () => {
      return withRetry(
        async () => {
          const result = await fetchAllAwardsForSport(sport);
          if (!result?.awards) {
            return {
              tabs: AWARD_TAB_CATEGORIES.map((tab) => ({
                ...tab,
                count: 0,
                awards: [],
              })),
              totalCount: 0,
              topSchools: [],
              yearsSpanned: { min: 0, max: 0 },
              schoolsRepresented: 0,
            };
          }

          // Map all awards and group by tab
          const tabAwards: Record<string, AwardRecord[]> = {};
          for (const tab of AWARD_TAB_CATEGORIES) {
            tabAwards[tab.id] = [];
          }
          const uncategorized: AwardRecord[] = [];

          // Summary stats
          const yearsSet = new Set<number>();
          const schoolsSet = new Set<string>();
          const schoolCounts: Record<string, { name: string; slug: string; count: number }> = {};

          // Deduplicate by award ID (OR filter might return overlapping results)
          const seenIds = new Set<number>();

          for (const rawAward of result.awards) {
            if (seenIds.has(rawAward.award_id)) continue;
            seenIds.add(rawAward.award_id);

            const award = mapAwardRow(rawAward);
            const normalizedType = normalizeAwardType(rawAward.award_type, sport);
            const tabId = matchAwardToTab(normalizedType);

            if (tabId && tabAwards[tabId]) {
              tabAwards[tabId].push(award);
            } else {
              uncategorized.push(award);
            }

            // Track summary stats
            if (rawAward.year_start) {
              yearsSet.add(rawAward.year_start);
            }
            if (rawAward.school_slug) {
              schoolsSet.add(rawAward.school_slug);
              if (!schoolCounts[rawAward.school_slug]) {
                schoolCounts[rawAward.school_slug] = {
                  name: rawAward.school_name,
                  slug: rawAward.school_slug,
                  count: 0,
                };
              }
              schoolCounts[rawAward.school_slug].count++;
            }
          }

          // If uncategorized awards exist, append to stat-leaders tab
          if (uncategorized.length > 0 && tabAwards["stat-leaders"]) {
            tabAwards["stat-leaders"].push(...uncategorized);
          }

          const topSchools = Object.values(schoolCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 15);

          return {
            tabs: AWARD_TAB_CATEGORIES.map((tab) => ({
              id: tab.id,
              label: tab.label,
              shortLabel: tab.shortLabel,
              description: tab.description,
              count: tabAwards[tab.id]?.length || 0,
              awards: tabAwards[tab.id] || [],
            })).filter((tab) => tab.count > 0), // Only include tabs with data
            totalCount: seenIds.size,
            topSchools,
            yearsSpanned: {
              min: yearsSet.size > 0 ? Math.min(...Array.from(yearsSet)) : 0,
              max: yearsSet.size > 0 ? Math.max(...Array.from(yearsSet)) : 0,
            },
            schoolsRepresented: schoolsSet.size,
          };
        },
        { maxRetries: 3 }
      );
    },
    {
      tabs: [],
      totalCount: 0,
      topSchools: [],
      yearsSpanned: { min: 0, max: 0 },
      schoolsRepresented: 0,
    },
    "getAwardsPageData",
    { sport }
  );
});
