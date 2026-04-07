import { z } from "zod";

/**
 * Zod schema for Legend MDX frontmatter.
 *
 * Content lives in src/content/legends/<slug>.mdx. Each file has YAML-ish
 * frontmatter that matches this schema and a markdown body that can embed
 * component placeholders like {{PhotoInline id="photo-1"}} which the page
 * renders from the structured frontmatter fields below.
 *
 * This schema is the single source of truth for the shape of a tribute —
 * the MDX loader validates against it at build time and fails loudly on
 * any mismatch so bad data can't make it to production.
 */

// These must stay in sync with src/lib/data/legends.ts LegendSport / LegendCategory
// so the new MDX-backed content can drop into the existing route helpers.
export const SPORTS = [
  "football",
  "basketball",
  "baseball",
  "track-field",
  "soccer",
  "multi",
] as const;

export const CATEGORIES = ["coach", "in-memoriam", "player-spotlight"] as const;

export const ALLSTAR_TEAMS = ["first", "second", "third", "honorable"] as const;

const OverallRecordSchema = z.object({
  wins: z.number().int().nonnegative(),
  losses: z.number().int().nonnegative(),
  ties: z.number().int().nonnegative().optional().default(0),
});

const StintTitlesSchema = z.object({
  league: z.number().int().nonnegative().optional(),
  city: z.number().int().nonnegative().optional(),
  state: z.number().int().nonnegative().optional(),
});

const StintStreakSchema = z.object({
  games: z.number().int().positive(),
  type: z.enum(["win", "unbeaten"]),
  span: z.string().min(1), // free-form, e.g. "1995-1997"
});

const StintSchema = z.object({
  school: z.string().min(1),
  sport: z.enum(SPORTS),
  startYear: z.number().int().min(1900).max(2100),
  endYear: z.number().int().min(1900).max(2100).nullable(),
  role: z.string().min(1),
  overallRecord: OverallRecordSchema.optional(),
  // Optional richer fields rendered by {{CareerLedger}}.
  // Existing files without these still validate.
  titles: StintTitlesSchema.optional(),
  streak: StintStreakSchema.optional(),
  notes: z.array(z.string()).optional(),
});

export const NEXTLEVEL_LEAGUES = [
  "NFL",
  "NBA",
  "MLB",
  "NHL",
  "MLS",
  "WNBA",
  "D1",
  "D2",
  "D3",
] as const;

const NextLevelAlumSchema = z.object({
  name: z.string().min(1),
  level: z.enum(NEXTLEVEL_LEAGUES),
  team: z.string().optional(), // college or pro team
  position: z.string().optional(),
  draftYear: z.number().int().min(1900).max(2100).optional(),
  draftRound: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

const ArchivalQuoteSchema = z.object({
  id: z.string().min(1), // referenced by {{ArchivalQuote id="..."}}
  text: z.string().min(1),
  speaker: z.string().min(1),
  role: z.string().optional(), // "Roman Catholic '02"
  context: z.string().optional(), // "after the 1999 CL final"
  date: z.string().optional(),
});

const ChampionshipSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  title: z.string().min(1),
  opponent: z.string().optional(),
  score: z.string().optional(),
  venue: z.string().optional(),
  date: z.string().optional(), // ISO date if known
  weather: z.string().optional(),
  headline: z.string().optional(),
  recapId: z.string().optional(), // matches {{ChampionshipRecap id="..."}} token in body
});

const AllStarSchema = z.object({
  team: z.enum(ALLSTAR_TEAMS),
  player: z.string().min(1),
  position: z.string().optional(),
  year: z.number().int().min(1900).max(2100),
});

const PhotoSchema = z.object({
  id: z.string().min(1), // referenced by {{PhotoInline id="..."}}
  file: z.string().min(1), // filename in Supabase Storage legend-photos/<slug>/
  caption: z.string().optional(),
  alt: z.string().optional(),
  credit: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

const PullQuoteSchema = z.object({
  id: z.string().min(1).optional(),
  text: z.string().min(1),
  attribution: z.string().optional(),
});

const StatAtAGlanceSchema = z.object({
  label: z.string().min(1),
  value: z.union([z.number(), z.string()]),
  suffix: z.string().optional(),
  prefix: z.string().optional(),
});

export const LegendFrontmatterSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "slug must be kebab-case"),
  name: z.string().min(1),
  category: z.enum(CATEGORIES),
  sport: z.enum(SPORTS),
  role: z.string().min(1),
  schools: z.array(z.string()).default([]),
  careerSpan: z.string().optional(),
  died: z.string().optional(), // free-form date string for now
  heroPhoto: z.string().optional(), // filename in legend-photos/<slug>/
  heroCaption: z.string().optional(),
  excerpt: z.string().min(1),
  highlights: z.array(z.string()).default([]),
  stints: z.array(StintSchema).optional().default([]),
  championships: z.array(ChampionshipSchema).optional().default([]),
  allStars: z.array(AllStarSchema).optional().default([]),
  photos: z.array(PhotoSchema).optional().default([]),
  pullQuotes: z.array(PullQuoteSchema).optional().default([]),
  statsAtAGlance: z.array(StatAtAGlanceSchema).optional().default([]),
  // Phase 6/7 toolkit additions — opt-in, existing files default to empty.
  nextLevelAlumni: z.array(NextLevelAlumSchema).optional().default([]),
  archivalQuotes: z.array(ArchivalQuoteSchema).optional().default([]),
  sourceFiles: z.array(z.string()).default([]),
});

export type LegendFrontmatter = z.infer<typeof LegendFrontmatterSchema>;
export type Stint = z.infer<typeof StintSchema>;
export type Championship = z.infer<typeof ChampionshipSchema>;
export type AllStar = z.infer<typeof AllStarSchema>;
export type Photo = z.infer<typeof PhotoSchema>;
export type PullQuote = z.infer<typeof PullQuoteSchema>;
export type StatAtAGlance = z.infer<typeof StatAtAGlanceSchema>;
export type NextLevelAlum = z.infer<typeof NextLevelAlumSchema>;
export type ArchivalQuote = z.infer<typeof ArchivalQuoteSchema>;

export interface LoadedLegend {
  frontmatter: LegendFrontmatter;
  body: string; // raw markdown with {{Component id="..."}} tokens
}
