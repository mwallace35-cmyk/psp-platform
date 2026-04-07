import { cache } from "react";
import {
  loadLegendBySlug,
  loadAllLegends,
  getLegendSlugs as getMdxLegendSlugs,
} from "./loadLegend";
import type { LegendFrontmatter } from "@/content/legends-schema";
import {
  ALL_LEGENDS,
  getLegendBySlug as getLegacyLegendBySlug,
  type Legend as LegacyLegend,
} from "@/lib/data/legends";

/**
 * Unified adapter: a single view of all legends regardless of whether
 * they've been migrated to MDX yet. Consumers (route pages, related
 * rails, etc.) should call these helpers instead of touching the MDX
 * loader or the legacy TS data directly.
 *
 * Precedence: MDX file wins if present for a given slug. Legacy TS data
 * fills the gap until every legend has a .mdx file, at which point the
 * legacy files can be deleted (Phase 5).
 */

export interface UnifiedLegend {
  slug: string;
  source: "mdx" | "legacy";
  frontmatter: LegendFrontmatter;
  /**
   * Markdown body for the legend narrative. For MDX-backed legends this
   * is the MDX file body; for legacy-backed legends it's pulled from
   * `LegacyLegend.narrative` so the same rendering pipeline works for
   * both sources.
   */
  body: string;
  /**
   * Legacy fallback blob — raw Legend object from legends-coaches.ts etc.
   * Present for legacy-backed legends only. Retained so components can
   * read optional fields (photoUrl, born, etc.) during the migration.
   */
  legacy: LegacyLegend | null;
}

function legacyToFrontmatter(l: LegacyLegend): LegendFrontmatter {
  return {
    slug: l.slug,
    name: l.name,
    category: l.category,
    sport: l.sport,
    role: l.role,
    schools: l.schools,
    careerSpan: l.careerSpan,
    died: l.died,
    heroPhoto: undefined,
    heroCaption: undefined,
    excerpt: l.excerpt,
    highlights: l.highlights ?? [],
    stints:
      l.stints?.map((s) => ({
        school: s.school,
        sport: s.sport,
        startYear: s.startYear,
        endYear: s.endYear,
        role: s.role,
        overallRecord: s.overallRecord
          ? {
              wins: s.overallRecord.wins,
              losses: s.overallRecord.losses,
              ties: s.overallRecord.ties ?? 0,
            }
          : undefined,
      })) ?? [],
    championships:
      l.stints?.flatMap((s) =>
        (s.championships ?? []).map((c) => ({
          year: c.year,
          title: c.title,
          opponent: undefined,
          score: c.result,
          venue: undefined,
          date: undefined,
          weather: undefined,
          headline: undefined,
          recapId: undefined,
        })),
      ) ?? [],
    allStars:
      l.stints?.flatMap((s) =>
        (s.allStars ?? []).map((a) => ({
          team: "first" as const,
          player: a.name,
          position: a.position,
          year: a.year,
        })),
      ) ?? [],
    photos: [],
    pullQuotes: [],
    statsAtAGlance: [],
    sourceFiles: l.sourceFiles,
  };
}

export const getUnifiedLegendBySlug = cache(
  (slug: string): UnifiedLegend | null => {
    // 1. MDX first
    const mdx = loadLegendBySlug(slug);
    if (mdx) {
      return {
        slug,
        source: "mdx",
        frontmatter: mdx.frontmatter,
        body: mdx.body,
        legacy: null,
      };
    }

    // 2. Legacy TS fallback
    const legacy = getLegacyLegendBySlug(slug);
    if (legacy) {
      return {
        slug,
        source: "legacy",
        frontmatter: legacyToFrontmatter(legacy),
        body: legacy.narrative ?? "",
        legacy,
      };
    }

    return null;
  },
);

export const getAllUnifiedSlugs = cache((): string[] => {
  const mdxSlugs = new Set(getMdxLegendSlugs());
  for (const l of ALL_LEGENDS) mdxSlugs.add(l.slug);
  return Array.from(mdxSlugs);
});

export const getAllUnifiedLegends = cache((): UnifiedLegend[] => {
  // MDX wins on slug collision
  const mdxBySlug = new Map<string, UnifiedLegend>();
  for (const l of loadAllLegends()) {
    mdxBySlug.set(l.frontmatter.slug, {
      slug: l.frontmatter.slug,
      source: "mdx",
      frontmatter: l.frontmatter,
      body: l.body,
      legacy: null,
    });
  }
  const out: UnifiedLegend[] = [...mdxBySlug.values()];
  for (const legacy of ALL_LEGENDS) {
    if (mdxBySlug.has(legacy.slug)) continue;
    out.push({
      slug: legacy.slug,
      source: "legacy",
      frontmatter: legacyToFrontmatter(legacy),
      body: legacy.narrative ?? "",
      legacy,
    });
  }
  return out;
});
