/**
 * Data layer for /legacy/[slug] career arc pages.
 *
 * All queries use createStaticClient() so they are safe for ISR / build-time
 * static generation. Aggregation pulls from existing tables and MDX — no
 * duplicate logic, reuses existing getters where possible.
 */

import { createStaticClient } from "@/lib/supabase/static";
import {
  getUnifiedLegendBySlug,
} from "@/lib/mdx/legendAdapter";

// ─────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────

export interface LegacyProfile {
  id: number;
  slug: string;
  display_name: string;
  era_summary: string | null;
  hero_photo_url: string | null;
  birth_year: number | null;
  death_year: number | null;
  primary_sport: string | null;
  primary_school_id: number | null;
  player_id: number | null;
  coach_id: number | null;
  legend_slug: string | null;
  narrative_md: string | null;
  eligibility_reason: string;
  is_published: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

export interface LegacyRelation {
  id: number;
  from_profile_id: number;
  to_profile_id: number;
  relation: string;
  note: string | null;
  /** Populated by join */
  related_profile?: Pick<LegacyProfile, "id" | "slug" | "display_name" | "hero_photo_url" | "era_summary">;
}

export interface TimelineEra {
  kind: "player" | "coach" | "legend" | "gap";
  label: string;
  startYear: number;
  endYear: number | null; // null = ongoing
  school: string;
  role: string;
  color: string; // CSS hex
  milestones: TimelineMilestone[];
}

export interface TimelineMilestone {
  year: number;
  text: string;
}

export interface CoachingStintRow {
  id: number;
  school_name: string;
  school_slug: string;
  sport_id: string;
  start_year: number;
  end_year: number | null;
  role: string;
  record_wins: number;
  record_losses: number;
  record_ties: number;
  championships: number;
}

export interface DualStats {
  asPlayer: PlayerStats | null;
  asCoach: CoachStats | null;
}

export interface PlayerStats {
  sport: string;
  careerSpan: string;
  schools: string[];
  highlights: string[];
}

export interface CoachStats {
  careerSpan: string;
  totalWins: number;
  totalLosses: number;
  totalTies: number;
  championships: number;
  stints: CoachingStintRow[];
}

export interface Accolade {
  id: string;
  text: string;
  year?: number;
  tier: "hof" | "championship" | "all-city" | "milestone";
  kind: "player" | "coach";
}

export interface CoachingTree {
  mentors: RelatedPerson[];
  proteges: RelatedPerson[];
  family: RelatedPerson[];
}

export interface RelatedPerson {
  name: string;
  slug: string;
  relation: string;
  note: string | null;
  hasLegacyPage: boolean;
  legacySlug?: string;
}

// ─────────────────────────────────────────────
// Core getter: getLegacyProfile
// ─────────────────────────────────────────────

export async function getLegacyProfile(slug: string): Promise<LegacyProfile | null> {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from("legacy_profiles" as any)
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error || !data) return null;
    return data as unknown as LegacyProfile;
  } catch {
    return null;
  }
}

export async function getAllPublishedLegacySlugs(): Promise<string[]> {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("legacy_profiles" as any)
      .select("slug")
      .eq("is_published", true);
    return (data ?? []).map((r: any) => r.slug as string);
  } catch {
    return [];
  }
}

export async function getLegacyProfileForPlayer(playerId: number): Promise<LegacyProfile | null> {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("legacy_profiles" as any)
      .select("*")
      .eq("player_id", playerId)
      .eq("is_published", true)
      .maybeSingle();
    return (data as unknown as LegacyProfile) ?? null;
  } catch {
    return null;
  }
}

export async function getLegacyProfileForCoach(coachId: number): Promise<LegacyProfile | null> {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("legacy_profiles" as any)
      .select("*")
      .eq("coach_id", coachId)
      .eq("is_published", true)
      .maybeSingle();
    return (data as unknown as LegacyProfile) ?? null;
  } catch {
    return null;
  }
}

export async function getLegacyProfileForLegend(legendSlug: string): Promise<LegacyProfile | null> {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("legacy_profiles" as any)
      .select("*")
      .eq("legend_slug", legendSlug)
      .eq("is_published", true)
      .maybeSingle();
    return (data as unknown as LegacyProfile) ?? null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// getCareerTimeline
// ─────────────────────────────────────────────

export async function getCareerTimeline(profile: LegacyProfile): Promise<TimelineEra[]> {
  const eras: TimelineEra[] = [];

  // --- Player era via football/basketball season tables ---
  if (profile.player_id && profile.primary_sport === "football") {
    try {
      const supabase = createStaticClient();
      const { data: seasons } = await supabase
        .from("football_player_seasons")
        .select("season_id, seasons(label, year_start, year_end)")
        .eq("player_id", profile.player_id)
        .order("season_id");

      if (seasons && seasons.length > 0) {
        const years = seasons
          .map((s: any) => {
            const season = Array.isArray(s.seasons) ? s.seasons[0] : s.seasons;
            return season?.year_start as number | undefined;
          })
          .filter(Boolean) as number[];

        if (years.length > 0) {
          const schoolName = await getSchoolName(profile.primary_school_id);
          eras.push({
            kind: "player",
            label: "Player Era",
            startYear: Math.min(...years),
            endYear: Math.max(...years),
            school: schoolName,
            role: "Quarterback",
            color: "#f0a500", // PSP gold
            milestones: buildPlayerMilestones(profile),
          });
        }
      }
    } catch { /* no seasons, skip */ }
  }

  // --- Coach era via coaching_stints ---
  if (profile.coach_id) {
    try {
      const stints = await getCoachingStints(profile.coach_id);
      for (const stint of stints) {
        eras.push({
          kind: "coach",
          label: stint.role || "Head Coach",
          startYear: stint.start_year,
          endYear: stint.end_year,
          school: stint.school_name,
          role: stint.role || "Head Coach",
          color: "#0f2040", // PSP navy-mid
          milestones: [],
        });
      }
    } catch { /* no stints */ }
  }

  // --- Legend era from MDX ---
  if (profile.legend_slug) {
    const unified = getUnifiedLegendBySlug(profile.legend_slug);
    if (unified?.frontmatter?.stints) {
      for (const stint of unified.frontmatter.stints) {
        const alreadyCovered = eras.some(
          (e) => e.kind === "coach" && e.startYear === stint.startYear
        );
        if (!alreadyCovered) {
          eras.push({
            kind: "legend",
            label: stint.role,
            startYear: stint.startYear,
            endYear: stint.endYear,
            school: stint.school,
            role: stint.role,
            color: "#7c3aed", // HOF purple variant
            milestones: buildLegendMilestones(unified.frontmatter),
          });
        }
      }
    }
  }

  // Sort by start year
  eras.sort((a, b) => a.startYear - b.startYear);
  return eras;
}

function buildPlayerMilestones(profile: LegacyProfile): TimelineMilestone[] {
  // Hardcoded for Brett Gordon pilot; auto-query from awards table in a future pass
  if (profile.slug === "brett-gordon") {
    return [
      { year: 1995, text: "All-City 1st Team QB" },
      { year: 1996, text: "All-City 1st Team QB" },
      { year: 1997, text: "All-City 1st Team QB — State record 84 career TD passes" },
      { year: 1999, text: "Daily News Player of the Century" },
    ];
  }
  return [];
}

function buildLegendMilestones(frontmatter: any): TimelineMilestone[] {
  return (frontmatter.championships ?? []).map((c: any) => ({
    year: c.year,
    text: c.title,
  }));
}

// ─────────────────────────────────────────────
// getDualRoleStats
// ─────────────────────────────────────────────

export async function getDualRoleStats(profile: LegacyProfile): Promise<DualStats> {
  const [asPlayer, asCoach] = await Promise.all([
    buildPlayerStats(profile),
    buildCoachStats(profile),
  ]);
  return { asPlayer, asCoach };
}

async function buildPlayerStats(profile: LegacyProfile): Promise<PlayerStats | null> {
  if (!profile.player_id) return null;

  // Pull highlights from legend MDX if legend_slug exists; otherwise use narrative
  const unified = profile.legend_slug ? getUnifiedLegendBySlug(profile.legend_slug) : null;
  const highlights = unified?.frontmatter?.highlights ?? [];

  const schoolName = await getSchoolName(profile.primary_school_id);

  return {
    sport: profile.primary_sport ?? "football",
    careerSpan: extractCareerSpan(profile),
    schools: [schoolName],
    highlights,
  };
}

async function buildCoachStats(profile: LegacyProfile): Promise<CoachStats | null> {
  if (!profile.coach_id) return null;
  const stints = await getCoachingStints(profile.coach_id);
  if (stints.length === 0) return null;

  const totalWins = stints.reduce((s, r) => s + (r.record_wins ?? 0), 0);
  const totalLosses = stints.reduce((s, r) => s + (r.record_losses ?? 0), 0);
  const totalTies = stints.reduce((s, r) => s + (r.record_ties ?? 0), 0);
  const championships = stints.reduce((s, r) => s + (r.championships ?? 0), 0);

  const startYear = Math.min(...stints.map((s) => s.start_year));
  const endYears = stints.map((s) => s.end_year).filter(Boolean) as number[];
  const endYear = stints.some((s) => !s.end_year) ? null : Math.max(...endYears);

  // Supplement with MDX legend data if available (richer record for legend coaches)
  const unified = profile.legend_slug ? getUnifiedLegendBySlug(profile.legend_slug) : null;
  if (unified?.frontmatter?.stints?.length && totalWins === 0) {
    const mdxStint = unified.frontmatter.stints[0];
    if (mdxStint.overallRecord) {
      return {
        careerSpan: `${startYear}–${endYear ?? "present"}`,
        totalWins: mdxStint.overallRecord.wins,
        totalLosses: mdxStint.overallRecord.losses,
        totalTies: mdxStint.overallRecord.ties ?? 0,
        championships,
        stints,
      };
    }
  }

  return {
    careerSpan: `${startYear}–${endYear ?? "present"}`,
    totalWins,
    totalLosses,
    totalTies,
    championships,
    stints,
  };
}

// ─────────────────────────────────────────────
// getAchievements
// ─────────────────────────────────────────────

export async function getAchievements(profile: LegacyProfile): Promise<Accolade[]> {
  const accolades: Accolade[] = [];

  // HOF badge from legend_slug
  if (profile.legend_slug) {
    accolades.push({
      id: `hof-${profile.legend_slug}`,
      text: "HOF Legend",
      tier: "hof",
      kind: "coach",
    });
  }

  // Championships from coaching stints
  if (profile.coach_id) {
    const stints = await getCoachingStints(profile.coach_id);
    const totalChamps = stints.reduce((s, r) => s + (r.championships ?? 0), 0);
    if (totalChamps > 0) {
      accolades.push({
        id: `coach-champs-${profile.coach_id}`,
        text: `${totalChamps} Championship${totalChamps !== 1 ? "s" : ""} (Coach)`,
        tier: "championship",
        kind: "coach",
      });
    }
  }

  // Player awards from DB
  if (profile.player_id) {
    try {
      const supabase = createStaticClient();
      const { data: awards } = await supabase
        .from("awards")
        .select("award_name, year")
        .eq("player_id", profile.player_id)
        .order("year");

      for (const award of awards ?? []) {
        const text = award.award_name as string;
        const year = award.year as number | undefined;
        const tier = text.toLowerCase().includes("all-city") ? "all-city"
          : text.toLowerCase().includes("champion") ? "championship"
          : "milestone";
        accolades.push({ id: `award-${text}-${year}`, text, year, tier, kind: "player" });
      }
    } catch { /* no awards */ }
  }

  // Legend highlights as milestone badges
  if (profile.legend_slug) {
    const unified = getUnifiedLegendBySlug(profile.legend_slug);
    for (const highlight of unified?.frontmatter?.highlights ?? []) {
      accolades.push({
        id: `legend-highlight-${highlight.slice(0, 20)}`,
        text: highlight,
        tier: "milestone",
        kind: "coach",
      });
    }
  }

  return accolades;
}

// ─────────────────────────────────────────────
// getCoachingTree
// ─────────────────────────────────────────────

export async function getCoachingTreeData(profile: LegacyProfile): Promise<CoachingTree> {
  const family: RelatedPerson[] = [];
  const mentors: RelatedPerson[] = [];
  const proteges: RelatedPerson[] = [];

  try {
    const supabase = createStaticClient();
    const { data: relations } = await supabase
      .from("legacy_relations" as any)
      .select(`
        relation,
        note,
        to_profile_id
      `)
      .eq("from_profile_id", profile.id);

    if (!relations) return { mentors, proteges, family };

    const toIds = relations.map((r: any) => r.to_profile_id as number);
    let profileMap: Record<number, any> = {};

    if (toIds.length > 0) {
      const { data: related } = await supabase
        .from("legacy_profiles" as any)
        .select("id, slug, display_name, hero_photo_url, era_summary")
        .in("id", toIds);

      for (const p of (related ?? []) as any[]) {
        profileMap[p.id] = p;
      }
    }

    for (const rel of relations as any[]) {
      const relatedProfile = profileMap[rel.to_profile_id];
      if (!relatedProfile) continue;

      const person: RelatedPerson = {
        name: relatedProfile.display_name,
        slug: relatedProfile.slug,
        relation: rel.relation,
        note: rel.note ?? null,
        hasLegacyPage: true,
        legacySlug: relatedProfile.slug,
      };

      if (["father_of", "son_of", "brother_of", "spouse_of"].includes(rel.relation)) {
        family.push(person);
      } else if (["coached_by", "mentored_by"].includes(rel.relation)) {
        mentors.push(person);
      } else {
        proteges.push(person);
      }
    }

    // Also surface nextLevelAlumni from legend MDX as proteges
    if (profile.legend_slug) {
      const unified = getUnifiedLegendBySlug(profile.legend_slug);
      for (const alumni of unified?.frontmatter?.nextLevelAlumni ?? []) {
        proteges.push({
          name: typeof alumni === "string" ? alumni : (alumni as any).name,
          slug: "",
          relation: "alumnus",
          note: null,
          hasLegacyPage: false,
        });
      }
    }
  } catch { /* graceful fallback */ }

  return { mentors, proteges, family };
}

// ─────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────

async function getCoachingStints(coachId: number): Promise<CoachingStintRow[]> {
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("coaching_stints")
      .select(`
        id,
        start_year,
        end_year,
        role,
        record_wins,
        record_losses,
        record_ties,
        championships,
        sport_id,
        school_names(name, slug)
      `)
      .eq("coach_id", coachId)
      .order("start_year");

    return (data ?? []).map((r: any) => {
      const school = Array.isArray(r.school_names) ? r.school_names[0] : r.school_names;
      return {
        id: r.id,
        school_name: school?.name ?? "Unknown School",
        school_slug: school?.slug ?? "",
        sport_id: r.sport_id,
        start_year: r.start_year,
        end_year: r.end_year ?? null,
        role: r.role ?? "Head Coach",
        record_wins: r.record_wins ?? 0,
        record_losses: r.record_losses ?? 0,
        record_ties: r.record_ties ?? 0,
        championships: r.championships ?? 0,
      };
    });
  } catch {
    return [];
  }
}

async function getSchoolName(schoolId: number | null): Promise<string> {
  if (!schoolId) return "Unknown School";
  try {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from("school_names")
      .select("name")
      .eq("id", schoolId)
      .single();
    return (data as any)?.name ?? "Unknown School";
  } catch {
    return "Unknown School";
  }
}

function extractCareerSpan(profile: LegacyProfile): string {
  // For now use era_summary to extract span; a full DB query per player could be added
  const match = profile.era_summary?.match(/(\d{4})[–-](\d{2,4})/);
  if (match) {
    const start = match[1];
    const end = match[2].length === 2 ? start.slice(0, 2) + match[2] : match[2];
    return `${start}–${end}`;
  }
  return "N/A";
}
