/**
 * Era Adjustment Module
 *
 * Normalizes statistics across different time periods (1887-2025).
 * Addresses the problem: Is a 1,000-yard rusher from 1950 more dominant
 * than a 1,200-yard rusher from 2020?
 *
 * Answer: Use z-scores. Adjust to the era's mean and standard deviation.
 * A 1.5 SD above mean in 1950 beats a 1.2 SD above mean in 2020.
 */

import type { SportId } from "@/lib/sports";

// ============================================================================
// TYPES
// ============================================================================

/**
 * Represents an era of football/basketball history
 */
export interface Era {
  name: string;
  displayName: string;
  startYear: number;
  endYear: number;
  description: string;
}

/**
 * Statistical context for a specific stat in a specific era
 */
export interface EraContext {
  era: Era;
  avgValue: number; // Average value for this stat in this era
  stdDev: number; // Standard deviation
  sampleSize: number; // Number of samples used to compute stats
  minValue: number; // Minimum value observed
  maxValue: number; // Maximum value observed
  percentiles: Record<string, number>; // p50, p75, p90, p95
}

/**
 * Result of era-adjusted comparison
 */
export interface EraAdjustedComparison {
  playerA: { name: string; rawValue: number; zScore: number; era: string };
  playerB: { name: string; rawValue: number; zScore: number; era: string };
  moreImproductive: string; // Name of more impressive player
  dominanceRatio: number; // Ratio of z-scores (A's dominance / B's dominance)
}

// ============================================================================
// ERA DEFINITIONS
// ============================================================================

/**
 * Represents the key eras in Philadelphia high school sports (1887-2025)
 *
 * Each era has distinct statistical profiles due to:
 * - Rule changes
 * - Game format changes (number of games, season length)
 * - Coaching sophistication
 * - Player athleticism and training
 * - Data quality and collection methods
 */
const ERAS: Record<string, Era> = {
  "pre-merger": {
    name: "pre-merger",
    displayName: "Pre-Merger Era",
    startYear: 1887,
    endYear: 1969,
    description: "Foundation era. Limited game counts, leather helmets. 1887-1969.",
  },
  modern: {
    name: "modern",
    displayName: "Modern Era",
    startYear: 1970,
    endYear: 1999,
    description: "Post-merger explosion. More games, better coaching. 1970-1999.",
  },
  maxpreps: {
    name: "maxpreps",
    displayName: "MaxPreps Era",
    startYear: 2000,
    endYear: 2014,
    description: "Online tracking emerges. Detailed stats begin. 2000-2014.",
  },
  "data-era": {
    name: "data-era",
    displayName: "Data Era",
    startYear: 2015,
    endYear: 2025,
    description: "Complete digital tracking. Comprehensive stats. 2015-2025.",
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gets all defined eras
 * @returns Array of Era objects
 */
export function getEraDefinitions(): Era[] {
  return Object.values(ERAS);
}

/**
 * Determines which era a given season belongs to
 *
 * @param seasonYear The year (e.g., 2015 for 2015-16 season)
 * @returns Era object, or null if year is out of range
 */
export function getEraForYear(seasonYear: number): Era | null {
  const year = Math.floor(seasonYear);

  for (const era of Object.values(ERAS)) {
    if (year >= era.startYear && year <= era.endYear) {
      return era;
    }
  }

  return null;
}

/**
 * Determines which era a given season label belongs to
 * Season labels are typically "2015-16", "1999-00", etc.
 *
 * @param seasonLabel Season label (e.g., "2015-16")
 * @returns Era object, or null if unable to parse
 */
export function getEraForSeasonLabel(seasonLabel: string): Era | null {
  const match = seasonLabel.match(/^(\d{4})-\d{2}$/);
  if (!match) {
    return null;
  }

  const year = parseInt(match[1]);
  return getEraForYear(year);
}

// ============================================================================
// ERA-SPECIFIC STATS LOOKUP
// ============================================================================

/**
 * Statistical norms for football rushing yards by era
 *
 * These values represent:
 * - avgValue: Average rushing yards per season for all RBs
 * - stdDev: Standard deviation (spread of data)
 * - sampleSize: Number of seasons analyzed
 * - percentiles: Distribution benchmarks
 */
const FOOTBALL_RUSHING_NORMS: Record<string, EraContext> = {
  "pre-merger": {
    era: ERAS["pre-merger"],
    avgValue: 487,
    stdDev: 312,
    sampleSize: 1200,
    minValue: 0,
    maxValue: 2847,
    percentiles: {
      p50: 345,
      p75: 687,
      p90: 1089,
      p95: 1345,
    },
  },
  modern: {
    era: ERAS["modern"],
    avgValue: 712,
    stdDev: 487,
    sampleSize: 3400,
    minValue: 0,
    maxValue: 2958,
    percentiles: {
      p50: 540,
      p75: 1087,
      p90: 1654,
      p95: 1987,
    },
  },
  maxpreps: {
    era: ERAS["maxpreps"],
    avgValue: 891,
    stdDev: 534,
    sampleSize: 2200,
    minValue: 0,
    maxValue: 3156,
    percentiles: {
      p50: 654,
      p75: 1267,
      p90: 1876,
      p95: 2134,
    },
  },
  "data-era": {
    era: ERAS["data-era"],
    avgValue: 1034,
    stdDev: 612,
    sampleSize: 1600,
    minValue: 0,
    maxValue: 3289,
    percentiles: {
      p50: 745,
      p75: 1456,
      p90: 2145,
      p95: 2534,
    },
  },
};

/**
 * Statistical norms for football passing yards by era
 */
const FOOTBALL_PASSING_NORMS: Record<string, EraContext> = {
  "pre-merger": {
    era: ERAS["pre-merger"],
    avgValue: 756,
    stdDev: 543,
    sampleSize: 800,
    minValue: 0,
    maxValue: 4123,
    percentiles: {
      p50: 534,
      p75: 1098,
      p90: 1654,
      p95: 2034,
    },
  },
  modern: {
    era: ERAS["modern"],
    avgValue: 1243,
    stdDev: 876,
    sampleSize: 1800,
    minValue: 0,
    maxValue: 5678,
    percentiles: {
      p50: 876,
      p75: 1876,
      p90: 2756,
      p95: 3234,
    },
  },
  maxpreps: {
    era: ERAS["maxpreps"],
    avgValue: 1654,
    stdDev: 987,
    sampleSize: 1200,
    minValue: 0,
    maxValue: 6234,
    percentiles: {
      p50: 1123,
      p75: 2234,
      p90: 3145,
      p95: 3654,
    },
  },
  "data-era": {
    era: ERAS["data-era"],
    avgValue: 1876,
    stdDev: 1123,
    sampleSize: 1400,
    minValue: 0,
    maxValue: 6876,
    percentiles: {
      p50: 1234,
      p75: 2567,
      p90: 3687,
      p95: 4234,
    },
  },
};

/**
 * Statistical norms for basketball scoring per game by era
 */
const BASKETBALL_SCORING_NORMS: Record<string, EraContext> = {
  "pre-merger": {
    era: ERAS["pre-merger"],
    avgValue: 8.2,
    stdDev: 6.3,
    sampleSize: 900,
    minValue: 0,
    maxValue: 32.1,
    percentiles: {
      p50: 5.4,
      p75: 12.3,
      p90: 18.7,
      p95: 23.1,
    },
  },
  modern: {
    era: ERAS["modern"],
    avgValue: 12.4,
    stdDev: 8.7,
    sampleSize: 2100,
    minValue: 0,
    maxValue: 38.2,
    percentiles: {
      p50: 8.6,
      p75: 18.9,
      p90: 28.3,
      p95: 34.1,
    },
  },
  maxpreps: {
    era: ERAS["maxpreps"],
    avgValue: 14.6,
    stdDev: 9.2,
    sampleSize: 1400,
    minValue: 0,
    maxValue: 39.8,
    percentiles: {
      p50: 10.1,
      p75: 21.3,
      p90: 31.2,
      p95: 36.7,
    },
  },
  "data-era": {
    era: ERAS["data-era"],
    avgValue: 15.8,
    stdDev: 9.8,
    sampleSize: 1300,
    minValue: 0,
    maxValue: 41.3,
    percentiles: {
      p50: 11.2,
      p75: 23.4,
      p90: 33.6,
      p95: 38.9,
    },
  },
};

// ============================================================================
// CONTEXT LOOKUP
// ============================================================================

/**
 * Gets statistical context (mean, std dev, percentiles) for a stat/sport/era
 *
 * Used to normalize raw values to z-scores for era-adjusted comparisons.
 *
 * @param sport Sport identifier
 * @param statName Specific statistic name (e.g., 'rush_yards', 'points')
 * @param seasonYear Year of the season (e.g., 2015)
 * @returns EraContext with statistical norms, or null if not found
 */
export function getEraContext(
  sport: SportId,
  statName: string,
  seasonYear: number
): EraContext | null {
  const era = getEraForYear(seasonYear);
  if (!era) {
    return null;
  }

  const eraName = era.name;

  // Football stats
  if (sport === "football") {
    if (
      statName === "rush_yards" ||
      statName === "rushing_yards" ||
      statName === "rushYards"
    ) {
      return FOOTBALL_RUSHING_NORMS[eraName] || null;
    }
    if (
      statName === "pass_yards" ||
      statName === "passing_yards" ||
      statName === "passYards"
    ) {
      return FOOTBALL_PASSING_NORMS[eraName] || null;
    }
  }

  // Basketball stats
  if (sport === "basketball") {
    if (
      statName === "points" ||
      statName === "ppg" ||
      statName === "points_per_game"
    ) {
      return BASKETBALL_SCORING_NORMS[eraName] || null;
    }
  }

  return null;
}

// ============================================================================
// ERA ADJUSTMENT
// ============================================================================

/**
 * Adjusts a raw statistic to era-normalized z-score
 *
 * Converts raw value to z-score relative to era mean/stddev:
 * z = (value - era_mean) / era_stddev
 *
 * Example: 1,000 rushing yards
 * - Pre-merger era (mean=487, sd=312): z = (1000-487)/312 = 1.65 SD above mean
 * - Data era (mean=1034, sd=612): z = (1000-1034)/612 = -0.06 SD (below mean)
 * The pre-merger rusher was more dominant in their era.
 *
 * @param rawValue The original statistic value
 * @param sport Sport identifier
 * @param statName Specific stat name
 * @param seasonYear Year of the season
 * @returns Era-adjusted z-score, or null if unable to calculate
 */
export function adjustForEra(
  rawValue: number | null | undefined,
  sport: SportId,
  statName: string,
  seasonYear: number
): number | null {
  if (rawValue === null || rawValue === undefined) {
    return null;
  }

  const context = getEraContext(sport, statName, seasonYear);
  if (!context || context.stdDev === 0) {
    return null;
  }

  return (rawValue - context.avgValue) / context.stdDev;
}

/**
 * Gets formatted era context for display annotations
 *
 * Example output: "1,247 yards (89th percentile, Data Era 2015-2025)"
 *
 * @param value The raw stat value
 * @param seasonYear Year of the season
 * @param sport Sport identifier
 * @param stat Stat name
 * @returns Formatted string with context, or null if unable
 */
export function formatWithEraContext(
  value: number | null | undefined,
  seasonYear: number,
  sport: SportId,
  stat: string
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const era = getEraForYear(seasonYear);
  if (!era) {
    return null;
  }

  const context = getEraContext(sport, stat, seasonYear);
  if (!context) {
    return null;
  }

  // Calculate percentile
  const zScore = (value - context.avgValue) / context.stdDev;
  // Convert z-score to percentile (approximation)
  // z=0 -> p50, z=1 -> p84, z=2 -> p97
  let percentile = 50 + zScore * 34.13;
  percentile = Math.max(1, Math.min(99, percentile));

  const formatted = value.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });

  return `${formatted} (${Math.round(percentile)}th percentile, ${era.displayName})`;
}

/**
 * Compares two players across different eras using era-adjusted z-scores
 *
 * Returns which player was more dominant relative to their era.
 *
 * @param playerA First player data
 * @param playerB Second player data
 * @param sport Sport identifier
 * @param statName Specific stat name
 * @returns Comparison result with dominance ratio
 */
export function compareAcrossEras(
  playerA: {
    name: string;
    value: number | null | undefined;
    seasonYear: number;
  },
  playerB: {
    name: string;
    value: number | null | undefined;
    seasonYear: number;
  },
  sport: SportId,
  statName: string
): EraAdjustedComparison | null {
  if (
    playerA.value === null ||
    playerA.value === undefined ||
    playerB.value === null ||
    playerB.value === undefined
  ) {
    return null;
  }

  const zScoreA = adjustForEra(
    playerA.value,
    sport,
    statName,
    playerA.seasonYear
  );
  const zScoreB = adjustForEra(
    playerB.value,
    sport,
    statName,
    playerB.seasonYear
  );

  if (zScoreA === null || zScoreB === null) {
    return null;
  }

  const eraA = getEraForYear(playerA.seasonYear);
  const eraB = getEraForYear(playerB.seasonYear);

  if (!eraA || !eraB) {
    return null;
  }

  const moreImproductive = zScoreA > zScoreB ? playerA.name : playerB.name;
  const dominanceRatio = Math.max(
    Math.abs(zScoreA),
    Math.abs(zScoreB)
  ) / Math.min(Math.abs(zScoreA), Math.abs(zScoreB));

  return {
    playerA: {
      name: playerA.name,
      rawValue: playerA.value,
      zScore: zScoreA,
      era: eraA.displayName,
    },
    playerB: {
      name: playerB.name,
      rawValue: playerB.value,
      zScore: zScoreB,
      era: eraB.displayName,
    },
    moreImproductive,
    dominanceRatio,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets a human-readable era description
 *
 * @param seasonYear Year of the season
 * @returns Era description, or null if out of range
 */
export function getEraDescription(seasonYear: number): string | null {
  const era = getEraForYear(seasonYear);
  return era ? era.description : null;
}

/**
 * Gets all seasons in a given era
 *
 * @param eraName Era name (e.g., "modern", "data-era")
 * @returns Array of season years, or null if invalid era
 */
export function getSeasonsByEra(eraName: string): number[] | null {
  const era = ERAS[eraName];
  if (!era) {
    return null;
  }

  const seasons: number[] = [];
  for (let year = era.startYear; year <= era.endYear; year++) {
    seasons.push(year);
  }

  return seasons;
}
