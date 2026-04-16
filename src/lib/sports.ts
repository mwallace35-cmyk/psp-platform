/**
 * Get the current academic season label (e.g., "2025-26").
 * Academic year runs August–July: before August = previous year's season.
 */
export function getCurrentSeasonLabel(): string {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  const year = now.getFullYear();
  if (month < 7) { // Jan-Jul = still in previous year's season
    return `${year - 1}-${String(year).slice(2)}`;
  }
  return `${year}-${String(year + 1).slice(2)}`;
}

// Valid sport IDs
export const VALID_SPORTS = ["football", "basketball", "girls-basketball", "baseball", "track-field", "lacrosse", "wrestling", "soccer"] as const;
export type SportId = (typeof VALID_SPORTS)[number];

export function isValidSport(sport: string): sport is SportId {
  return VALID_SPORTS.includes(sport as SportId);
}

// Canonical sport emoji map — import this instead of defining inline
export const SPORT_EMOJI: Record<string, string> = {
  football: "🏈",
  basketball: "🏀",
  "girls-basketball": "🏀",
  baseball: "⚾",
  "track-field": "🏃",
  "track-and-field": "🏃",
  lacrosse: "🥍",
  wrestling: "🤼",
  soccer: "⚽",
};

// Sport metadata — emoji field kept as sport key for backward compat (render via <SportIcon>)
export const SPORT_META: Record<SportId, { name: string; emoji: string; color: string; statCategories: string[] }> = {
  football: { name: "Football", emoji: "football", color: "#16a34a", statCategories: ["rushing", "passing", "receiving", "scoring"] },
  basketball: { name: "Boys Basketball", emoji: "basketball", color: "#3b82f6", statCategories: ["scoring", "ppg", "rebounds", "assists"] },
  "girls-basketball": { name: "Girls Basketball", emoji: "girls-basketball", color: "#ec4899", statCategories: ["scoring", "ppg", "rebounds", "assists"] },
  baseball: { name: "Baseball", emoji: "baseball", color: "#dc2626", statCategories: ["batting", "pitching", "home-runs"] },
  "track-field": { name: "Track & Field", emoji: "track-field", color: "#7c3aed", statCategories: ["sprints", "distance", "field"] },
  lacrosse: { name: "Lacrosse", emoji: "lacrosse", color: "#0891b2", statCategories: ["goals", "assists"] },
  wrestling: { name: "Wrestling", emoji: "wrestling", color: "#ca8a04", statCategories: ["wins", "pins"] },
  soccer: { name: "Soccer", emoji: "soccer", color: "#059669", statCategories: ["goals", "assists"] },
};
