/**
 * Common data layer utilities for sport-related helpers
 */

/**
 * Check if a sport slug uses basketball tables/logic.
 * Both boys basketball ("basketball") and girls basketball ("girls-basketball")
 * share the same basketball_player_seasons table, differentiated by the gender column.
 */
export function isBasketballSport(sport: string): boolean {
  return sport === "basketball" || sport === "girls-basketball";
}

/**
 * Get the gender filter value for basketball_player_seasons queries.
 * Boys basketball = 'M', Girls basketball = 'F'.
 */
export function getBasketballGender(sport: string): "M" | "F" {
  return sport === "girls-basketball" ? "F" : "M";
}
