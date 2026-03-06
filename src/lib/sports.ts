// Valid sport IDs
export const VALID_SPORTS = ["football", "basketball", "baseball", "flag-football", "girls-basketball", "girls-soccer", "softball", "field-hockey", "track-field", "lacrosse", "wrestling", "soccer"] as const;
export type SportId = (typeof VALID_SPORTS)[number];

export function isValidSport(sport: string): sport is SportId {
  return VALID_SPORTS.includes(sport as SportId);
}

// Sport metadata
export const SPORT_META: Record<SportId, { name: string; emoji: string; color: string; statCategories: string[] }> = {
  football: { name: "Football", emoji: "🏈", color: "#16a34a", statCategories: ["rushing", "passing", "receiving", "scoring"] },
  basketball: { name: "Basketball", emoji: "🏀", color: "#ea580c", statCategories: ["scoring", "rebounds", "assists"] },
  baseball: { name: "Baseball", emoji: "⚾", color: "#dc2626", statCategories: ["batting", "pitching"] },
  "flag-football": { name: "Flag Football", emoji: "🏳️", color: "#ec4899", statCategories: ["passing", "receiving", "rushing", "scoring"] },
  "girls-basketball": { name: "Girls Basketball", emoji: "🏀", color: "#f59e0b", statCategories: ["scoring", "rebounds", "assists"] },
  "girls-soccer": { name: "Girls Soccer", emoji: "⚽", color: "#ec4899", statCategories: ["goals", "assists"] },
  softball: { name: "Softball", emoji: "🥎", color: "#f472b6", statCategories: ["batting", "pitching"] },
  "field-hockey": { name: "Field Hockey", emoji: "🏑", color: "#a855f7", statCategories: ["goals", "assists"] },
  "track-field": { name: "Track & Field", emoji: "🏃", color: "#7c3aed", statCategories: ["sprints", "distance", "field"] },
  lacrosse: { name: "Lacrosse", emoji: "🥍", color: "#0891b2", statCategories: ["goals", "assists"] },
  wrestling: { name: "Wrestling", emoji: "🤼", color: "#ca8a04", statCategories: ["wins", "pins"] },
  soccer: { name: "Soccer", emoji: "⚽", color: "#059669", statCategories: ["goals", "assists"] },
};
