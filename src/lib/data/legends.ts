// Legends data types, helpers, and combined export
// Content split across sub-files by category

export type LegendCategory = "coach" | "in-memoriam" | "player-spotlight";

export type LegendSport =
  | "football"
  | "basketball"
  | "baseball"
  | "track-field"
  | "soccer"
  | "multi";

export interface SeasonRecord {
  season: string;
  wins: number;
  losses: number;
  ties?: number;
  notes?: string; // e.g. "Catholic League Champions"
}

export interface AllStarSelection {
  year: number;
  name: string;
  position?: string;
  team?: string; // e.g. "All-Catholic", "All-City"
}

export interface Championship {
  year: number;
  title: string;
  result?: string; // e.g. "55-38 vs O'Hara"
}

export interface CoachingStint {
  school: string;
  sport: LegendSport;
  startYear: number;
  endYear: number | null;
  role: string; // "Head Coach", "Assistant", etc.
  overallRecord?: { wins: number; losses: number; ties?: number };
  seasons?: SeasonRecord[];
  championships?: Championship[];
  allStars?: AllStarSelection[];
}

export interface Legend {
  slug: string;
  name: string;
  category: LegendCategory;
  role: string; // "Football Coach", "Basketball Player", etc.
  sport: LegendSport;
  schools: string[];
  excerpt: string; // 1-2 sentence summary for hub card
  narrative: string; // Full markdown content
  stints?: CoachingStint[];
  highlights?: string[]; // Quick-hit facts for highlight box
  careerSpan?: string; // e.g. "1965-84"
  born?: string;
  died?: string;
  photoUrl?: string;
  sourceFiles: string[]; // Original HTML filenames
  featured?: boolean; // Surface on /hof "Featured Legends" strip
}

// Import entries from sub-files
import { COACH_LEGENDS } from "./legends-coaches";
import { COACH_LEGENDS_PT2 } from "./legends-coaches-pt2";
import { MEMORIAM_LEGENDS } from "./legends-memoriam";
import { PLAYER_LEGENDS } from "./legends-players";

// Combined collection
export const ALL_LEGENDS: Legend[] = [
  ...COACH_LEGENDS,
  ...COACH_LEGENDS_PT2,
  ...MEMORIAM_LEGENDS,
  ...PLAYER_LEGENDS,
];

// Helper functions
export function getLegendBySlug(slug: string): Legend | undefined {
  return ALL_LEGENDS.find((l) => l.slug === slug);
}

export function getAllLegends(): Legend[] {
  return ALL_LEGENDS;
}

export function getAllLegendSlugs(): string[] {
  return ALL_LEGENDS.map((l) => l.slug);
}

export function getLegendsByCategory(category: LegendCategory): Legend[] {
  return ALL_LEGENDS.filter((l) => l.category === category);
}

export function getLegendsBySport(sport: LegendSport): Legend[] {
  return ALL_LEGENDS.filter((l) => l.sport === sport);
}

const CATEGORY_ROUTE: Record<LegendCategory, string> = {
  coach: "/hof/legends",
  "in-memoriam": "/hof/in-memoriam",
  "player-spotlight": "/hof/spotlights",
};

export function getLegendHref(legend: Pick<Legend, "slug" | "category">): string {
  return `${CATEGORY_ROUTE[legend.category]}/${legend.slug}`;
}

export function getFeaturedLegends(limit?: number): Legend[] {
  const featured = ALL_LEGENDS.filter((l) => l.featured === true);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export function getLegendCount(): {
  total: number;
  coaches: number;
  memoriam: number;
  players: number;
} {
  return {
    total: ALL_LEGENDS.length,
    coaches: COACH_LEGENDS.length,
    memoriam: MEMORIAM_LEGENDS.length,
    players: PLAYER_LEGENDS.length,
  };
}

export const SPORT_LABELS: Record<LegendSport, string> = {
  football: "Football",
  basketball: "Basketball",
  baseball: "Baseball",
  "track-field": "Track & Field",
  soccer: "Soccer",
  multi: "Multi-Sport",
};

export const SPORT_EMOJIS: Record<LegendSport, string> = {
  football: "\u{1F3C8}",
  basketball: "\u{1F3C0}",
  baseball: "\u26BE",
  "track-field": "\u{1F3C3}",
  soccer: "\u26BD",
  multi: "\u{1F3C5}",
};

// Brand-aligned sport accent colors (match global sport palette)
export const SPORT_ACCENT_COLORS: Record<LegendSport, string> = {
  football: "#16a34a",
  basketball: "#3b82f6",
  baseball: "#dc2626",
  "track-field": "#7c3aed",
  soccer: "#059669",
  multi: "#f0a500",
};

export const CATEGORY_LABELS: Record<LegendCategory, string> = {
  coach: "Coaches",
  "in-memoriam": "In Memoriam",
  "player-spotlight": "Player Spotlights",
};
