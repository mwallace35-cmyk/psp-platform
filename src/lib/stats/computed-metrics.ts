/**
 * Computed Metrics Module
 *
 * Calculates derived statistical measures from raw player data.
 * Handles rate stats, efficiency metrics, and percentile rankings.
 * All functions handle null/undefined inputs gracefully.
 */

import { VALID_SPORTS, type SportId } from "@/lib/sports";

// ============================================================================
// TYPES
// ============================================================================

/**
 * Result of a percentile rank calculation
 */
export interface PercentileResult {
  percentile: number; // 0-100
  rank: number; // 1-based rank
  total: number; // total items in dataset
}

/**
 * Result of a z-score calculation
 */
export interface ZScoreResult {
  zScore: number;
  stdDev: number;
  mean: number;
}

// ============================================================================
// FOOTBALL METRICS
// ============================================================================

/**
 * Calculates yards per carry
 * Formula: rushing_yards / rushing_attempts
 *
 * @param rushingYards Total rushing yards (or null)
 * @param rushingAttempts Number of carries (or null)
 * @returns Yards per carry, or null if unable to calculate
 */
export function calculateYardsPerCarry(
  rushingYards: number | null | undefined,
  rushingAttempts: number | null | undefined
): number | null {
  if (
    rushingYards === null ||
    rushingYards === undefined ||
    rushingAttempts === null ||
    rushingAttempts === undefined ||
    rushingAttempts === 0
  ) {
    return null;
  }
  return rushingYards / rushingAttempts;
}

/**
 * Calculates yards per attempt (passing)
 * Formula: passing_yards / passing_attempts
 *
 * @param passingYards Total passing yards (or null)
 * @param passingAttempts Number of pass attempts (or null)
 * @returns Yards per attempt, or null if unable to calculate
 */
export function calculateYardsPerAttempt(
  passingYards: number | null | undefined,
  passingAttempts: number | null | undefined
): number | null {
  if (
    passingYards === null ||
    passingYards === undefined ||
    passingAttempts === null ||
    passingAttempts === undefined ||
    passingAttempts === 0
  ) {
    return null;
  }
  return passingYards / passingAttempts;
}

/**
 * Calculates NCAA Passer Efficiency Rating
 * Formula: (8.4 � yards + 330 � TD + 100 � completions - 200 � INT) / attempts
 *
 * This metric was pioneered by Dave Ominski and is standard in college football.
 * A rating of 150+ is elite, 140-150 is excellent, 120-140 is very good.
 *
 * @param passingYards Total passing yards
 * @param passingTouchdowns Passing touchdowns
 * @param completions Pass completions
 * @param interceptions Interceptions thrown
 * @param passingAttempts Total pass attempts
 * @returns Passer efficiency rating, or null if unable to calculate
 */
export function calculatePasserEfficiency(
  passingYards: number | null | undefined,
  passingTouchdowns: number | null | undefined,
  completions: number | null | undefined,
  interceptions: number | null | undefined,
  passingAttempts: number | null | undefined
): number | null {
  if (
    passingYards === null ||
    passingYards === undefined ||
    passingTouchdowns === null ||
    passingTouchdowns === undefined ||
    completions === null ||
    completions === undefined ||
    interceptions === null ||
    interceptions === undefined ||
    passingAttempts === null ||
    passingAttempts === undefined ||
    passingAttempts === 0
  ) {
    return null;
  }

  const rating =
    (8.4 * passingYards +
      330 * passingTouchdowns +
      100 * completions -
      200 * interceptions) /
    passingAttempts;

  return rating;
}

/**
 * Calculates yards per reception
 * Formula: receiving_yards / receptions
 *
 * @param receivingYards Total receiving yards
 * @param receptions Number of receptions
 * @returns Yards per reception, or null if unable to calculate
 */
export function calculateYardsPerReception(
  receivingYards: number | null | undefined,
  receptions: number | null | undefined
): number | null {
  if (
    receivingYards === null ||
    receivingYards === undefined ||
    receptions === null ||
    receptions === undefined ||
    receptions === 0
  ) {
    return null;
  }
  return receivingYards / receptions;
}

/**
 * Calculates TD-to-Turnover ratio (TD:INT for QBs)
 * Formula: touchdowns / interceptions
 *
 * @param touchdowns Passing touchdowns
 * @param interceptions Interceptions thrown
 * @returns TD-to-INT ratio, or null if unable to calculate
 */
export function calculateTDToTurnoverRatio(
  touchdowns: number | null | undefined,
  interceptions: number | null | undefined
): number | null {
  if (
    touchdowns === null ||
    touchdowns === undefined ||
    interceptions === null ||
    interceptions === undefined ||
    interceptions === 0
  ) {
    return null;
  }
  return touchdowns / interceptions;
}

/**
 * Calculates completion percentage
 * Formula: (completions / attempts) � 100
 *
 * @param completions Pass completions
 * @param attempts Pass attempts
 * @returns Completion percentage (0-100), or null if unable to calculate
 */
export function calculateCompletionPercentage(
  completions: number | null | undefined,
  attempts: number | null | undefined
): number | null {
  if (
    completions === null ||
    completions === undefined ||
    attempts === null ||
    attempts === undefined ||
    attempts === 0
  ) {
    return null;
  }
  return (completions / attempts) * 100;
}

/**
 * Calculates TD percentage (for any position with TDs and carrying attempts)
 * Formula: (touchdowns / touches) � 100
 *
 * @param touchdowns Touchdowns scored
 * @param touches Number of touches (carries, receptions, etc.)
 * @returns TD percentage, or null if unable to calculate
 */
export function calculateTDPercentage(
  touchdowns: number | null | undefined,
  touches: number | null | undefined
): number | null {
  if (
    touchdowns === null ||
    touchdowns === undefined ||
    touches === null ||
    touches === undefined ||
    touches === 0
  ) {
    return null;
  }
  return (touchdowns / touches) * 100;
}

// ============================================================================
// BASKETBALL METRICS
// ============================================================================

/**
 * Calculates points per game
 * Formula: total_points / games_played
 *
 * Note: This data may already exist in the database as `ppg`, but
 * this function provides a standardized calculation.
 *
 * @param points Total points scored
 * @param gamesPlayed Number of games played
 * @returns Points per game, or null if unable to calculate
 */
export function calculatePointsPerGame(
  points: number | null | undefined,
  gamesPlayed: number | null | undefined
): number | null {
  if (
    points === null ||
    points === undefined ||
    gamesPlayed === null ||
    gamesPlayed === undefined ||
    gamesPlayed === 0
  ) {
    return null;
  }
  return points / gamesPlayed;
}

/**
 * Calculates rebounds per game
 * Formula: total_rebounds / games_played
 *
 * @param rebounds Total rebounds
 * @param gamesPlayed Number of games played
 * @returns Rebounds per game, or null if unable to calculate
 */
export function calculateReboundsPerGame(
  rebounds: number | null | undefined,
  gamesPlayed: number | null | undefined
): number | null {
  if (
    rebounds === null ||
    rebounds === undefined ||
    gamesPlayed === null ||
    gamesPlayed === undefined ||
    gamesPlayed === 0
  ) {
    return null;
  }
  return rebounds / gamesPlayed;
}

/**
 * Calculates assists per game
 * Formula: total_assists / games_played
 *
 * @param assists Total assists
 * @param gamesPlayed Number of games played
 * @returns Assists per game, or null if unable to calculate
 */
export function calculateAssistsPerGame(
  assists: number | null | undefined,
  gamesPlayed: number | null | undefined
): number | null {
  if (
    assists === null ||
    assists === undefined ||
    gamesPlayed === null ||
    gamesPlayed === undefined ||
    gamesPlayed === 0
  ) {
    return null;
  }
  return assists / gamesPlayed;
}

/**
 * Calculates steals per game
 * Formula: total_steals / games_played
 *
 * @param steals Total steals
 * @param gamesPlayed Number of games played
 * @returns Steals per game, or null if unable to calculate
 */
export function calculateStealsPerGame(
  steals: number | null | undefined,
  gamesPlayed: number | null | undefined
): number | null {
  if (
    steals === null ||
    steals === undefined ||
    gamesPlayed === null ||
    gamesPlayed === undefined ||
    gamesPlayed === 0
  ) {
    return null;
  }
  return steals / gamesPlayed;
}

/**
 * Calculates blocks per game
 * Formula: total_blocks / games_played
 *
 * @param blocks Total blocks
 * @param gamesPlayed Number of games played
 * @returns Blocks per game, or null if unable to calculate
 */
export function calculateBlocksPerGame(
  blocks: number | null | undefined,
  gamesPlayed: number | null | undefined
): number | null {
  if (
    blocks === null ||
    blocks === undefined ||
    gamesPlayed === null ||
    gamesPlayed === undefined ||
    gamesPlayed === 0
  ) {
    return null;
  }
  return blocks / gamesPlayed;
}

// ============================================================================
// STATISTICAL ANALYSIS
// ============================================================================

/**
 * Calculates z-score for a value within a dataset
 *
 * Z-score measures how many standard deviations away from the mean a value is.
 * Used for era-adjusted comparisons and identifying outliers.
 *
 * Formula: (value - mean) / stdDev
 *
 * @param value The data point to evaluate
 * @param mean Average of the dataset
 * @param stdDev Standard deviation of the dataset
 * @returns Z-score result object or null if unable to calculate
 */
export function calculateZScore(
  value: number | null | undefined,
  mean: number | null | undefined,
  stdDev: number | null | undefined
): ZScoreResult | null {
  if (
    value === null ||
    value === undefined ||
    mean === null ||
    mean === undefined ||
    stdDev === null ||
    stdDev === undefined ||
    stdDev === 0
  ) {
    return null;
  }

  return {
    zScore: (value - mean) / stdDev,
    stdDev,
    mean,
  };
}

/**
 * Calculates percentile rank of a value in a dataset
 *
 * Percentile represents the percentage of values below a given value.
 * Useful for leaderboard rankings and era-adjusted comparisons.
 *
 * @param value The value to rank
 * @param dataset Array of all values in the dataset
 * @returns Percentile result with rank and total count, or null if unable to calculate
 */
export function calculatePercentileRank(
  value: number | null | undefined,
  dataset: (number | null | undefined)[]
): PercentileResult | null {
  if (value === null || value === undefined || dataset.length === 0) {
    return null;
  }

  // Filter out null/undefined values
  const validData = dataset.filter(
    (v): v is number => v !== null && v !== undefined
  );

  if (validData.length === 0) {
    return null;
  }

  // Count how many values are less than the target value
  const valuesBelow = validData.filter((v) => v < value).length;
  const percentile = (valuesBelow / validData.length) * 100;
  const rank = valuesBelow + 1;

  return {
    percentile: Math.round(percentile * 100) / 100, // Round to 2 decimals
    rank,
    total: validData.length,
  };
}

/**
 * Calculates percentile rank comparing value to a pre-computed percentile threshold
 *
 * Faster than calculatePercentileRank when you already have dataset statistics.
 * Used in era-adjusted comparisons.
 *
 * @param value The value to evaluate
 * @param percentiles Pre-computed percentile thresholds (e.g., { p50: 100, p75: 150, p90: 200 })
 * @returns Estimated percentile (0-100), or null if unable to calculate
 */
export function estimatePercentile(
  value: number | null | undefined,
  percentiles: Record<string, number>
): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const sortedKeys = Object.keys(percentiles)
    .filter((k) => k.match(/^p\d+$/))
    .sort((a, b) => {
      const numA = parseInt(a.substring(1));
      const numB = parseInt(b.substring(1));
      return numA - numB;
    });

  if (sortedKeys.length === 0) {
    return null;
  }

  // Find the two percentile brackets to interpolate between
  for (let i = 0; i < sortedKeys.length - 1; i++) {
    const currentKey = sortedKeys[i];
    const nextKey = sortedKeys[i + 1];
    const currentPercentile = parseInt(currentKey.substring(1));
    const nextPercentile = parseInt(nextKey.substring(1));
    const currentValue = percentiles[currentKey];
    const nextValue = percentiles[nextKey];

    if (value >= currentValue && value <= nextValue) {
      // Linear interpolation
      const ratio = (value - currentValue) / (nextValue - currentValue);
      return (
        currentPercentile + ratio * (nextPercentile - currentPercentile)
      );
    }
  }

  // If value is below the lowest percentile
  const firstKey = sortedKeys[0];
  if (value < percentiles[firstKey]) {
    return 0;
  }

  // If value is above the highest percentile
  const lastKey = sortedKeys[sortedKeys.length - 1];
  if (value > percentiles[lastKey]) {
    return 100;
  }

  return null;
}

// ============================================================================
// ERA ADJUSTMENT
// ============================================================================

/**
 * Applies era adjustment to a raw value using z-score normalization
 *
 * Converts a raw statistic to a z-score relative to the era it occurred in,
 * making comparisons across different time periods valid.
 *
 * @param rawValue The original stat value
 * @param eraMean The average value for this stat in this era
 * @param eraStdDev The standard deviation for this stat in this era
 * @returns Era-adjusted z-score, or null if unable to calculate
 */
export function applyEraAdjustment(
  rawValue: number | null | undefined,
  eraMean: number | null | undefined,
  eraStdDev: number | null | undefined
): number | null {
  if (
    rawValue === null ||
    rawValue === undefined ||
    eraMean === null ||
    eraMean === undefined ||
    eraStdDev === null ||
    eraStdDev === undefined ||
    eraStdDev === 0
  ) {
    return null;
  }

  return (rawValue - eraMean) / eraStdDev;
}

/**
 * Converts an era-adjusted z-score back to a specific year's scale
 *
 * Useful for displaying era-adjusted values in the context of a specific season.
 *
 * @param zScore The era-adjusted z-score
 * @param targetEraMean Mean for the target era
 * @param targetEraStdDev Standard deviation for the target era
 * @returns Value scaled to target era, or null if unable to calculate
 */
export function unadjustToEra(
  zScore: number | null | undefined,
  targetEraMean: number | null | undefined,
  targetEraStdDev: number | null | undefined
): number | null {
  if (
    zScore === null ||
    zScore === undefined ||
    targetEraMean === null ||
    targetEraMean === undefined ||
    targetEraStdDev === null ||
    targetEraStdDev === undefined
  ) {
    return null;
  }

  return targetEraMean + zScore * targetEraStdDev;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Formats a number as a rate stat with one decimal place
 * Handles null/undefined inputs gracefully
 *
 * @param value The value to format
 * @returns Formatted string (e.g., "5.2") or "-" if null
 */
export function formatRateStat(value: number | null): string {
  if (value === null) return "-";
  return value.toFixed(1);
}

/**
 * Formats a number as a percentage with one decimal place
 * Handles null/undefined inputs gracefully
 *
 * @param value The percentage value (0-100)
 * @returns Formatted string (e.g., "52.3%") or "-" if null
 */
export function formatPercentage(value: number | null): string {
  if (value === null) return "-";
  return `${value.toFixed(1)}%`;
}

/**
 * Formats a number with comma separators
 * Handles null/undefined inputs gracefully
 *
 * @param value The value to format
 * @returns Formatted string (e.g., "1,247") or "-" if null
 */
export function formatNumber(value: number | null): string {
  if (value === null) return "-";
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

/**
 * Calculates the standard deviation of a dataset
 * Used internally for era comparisons
 *
 * @param data Array of numbers
 * @returns Standard deviation, or null if unable to calculate
 */
export function calculateStdDev(data: (number | null | undefined)[]): number | null {
  const validData = data.filter(
    (v): v is number => v !== null && v !== undefined
  );

  if (validData.length < 2) {
    return null;
  }

  const mean = validData.reduce((a, b) => a + b, 0) / validData.length;
  const variance =
    validData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    validData.length;

  return Math.sqrt(variance);
}

/**
 * Calculates the mean (average) of a dataset
 * Used internally for era comparisons
 *
 * @param data Array of numbers
 * @returns Mean, or null if unable to calculate
 */
export function calculateMean(
  data: (number | null | undefined)[]
): number | null {
  const validData = data.filter(
    (v): v is number => v !== null && v !== undefined
  );

  if (validData.length === 0) {
    return null;
  }

  return validData.reduce((a, b) => a + b, 0) / validData.length;
}
