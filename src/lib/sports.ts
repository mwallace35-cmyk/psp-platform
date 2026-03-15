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
export const VALID_SPORTS = ["football", "basketball", "baseball", "track-field", "lacrosse", "wrestling", "soccer"] as const;
export type SportId = (typeof VALID_SPORTS)[number];

export function isValidSport(sport: string): sport is SportId {
  return VALID_SPORTS.includes(sport as SportId);
}

// Sport metadata
export const SPORT_META: Record<SportId, { name: string; emoji: string; color: string; statCategories: string[] }> = {
  football: { name: "Football", emoji: "🏈", color: "#16a34a", statCategories: ["rushing", "passing", "receiving", "scoring"] },
  basketball: { name: "Basketball", emoji: "🏀", color: "#ea580c", statCategories: ["scoring", "ppg", "rebounds", "assists"] },
  baseball: { name: "Baseball", emoji: "⚾", color: "#dc2626", statCategories: ["batting", "pitching", "home-runs"] },
  "track-field": { name: "Track & Field", emoji: "🏃", color: "#7c3aed", statCategories: ["sprints", "distance", "field"] },
  lacrosse: { name: "Lacrosse", emoji: "🥍", color: "#0891b2", statCategories: ["goals", "assists"] },
  wrestling: { name: "Wrestling", emoji: "🤼", color: "#ca8a04", statCategories: ["wins", "pins"] },
  soccer: { name: "Soccer", emoji: "⚽", color: "#059669", statCategories: ["goals", "assists"] },
};
