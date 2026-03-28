/**
 * Maps raw DB category slugs to human-readable labels.
 * Used in records-explorer page and anywhere record categories are displayed.
 */
const CATEGORY_LABELS: Record<string, string> = {
  // Slug-style categories
  "career-1000-points": "Career 1,000-Point Scorers",
  "coaching-best-winning-pct": "Coaching: Best Winning Pct.",
  "coaching-career-wins": "Coaching: Career Wins",
  "highest-league-scoring-average": "Highest League Scoring Average",
  "school-single-game-scoring": "School Single-Game Scoring",
  "single-game-50-points": "Single-Game 50+ Points",
  "no-hitter": "No-Hitters",
  // Underscore-style categories
  "1000_point_scorer": "1,000-Point Scorers",
  "high_league_average": "High League Average",
  // Already human-readable but normalize casing
  "Team Records": "Team Records",
  "Return Touchdowns": "Return Touchdowns",
  "Longest TD": "Longest Touchdown",
  "Three-Pointers": "Three-Pointers",
};

/**
 * Convert a raw category slug/name to a user-friendly display label.
 * Falls back to title-casing the slug if no explicit mapping exists.
 */
export function formatCategoryLabel(raw: string): string {
  if (CATEGORY_LABELS[raw]) return CATEGORY_LABELS[raw];

  // Auto-format: replace hyphens/underscores with spaces and title-case
  return raw
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
