/**
 * Confidence & Uncertainty Module
 *
 * Assesses statistical reliability based on sample size and sport.
 * Provides confidence intervals and minimum game thresholds.
 *
 * Key principle: Small samples have high variance. A QB with 300 yards
 * in 3 games (100 YPG) is unreliable; the same player with 2,400 yards
 * in 12 games (200 YPG) is a different story.
 */

import type { SportId } from "@/lib/sports";

// ============================================================================
// TYPES
// ============================================================================

/**
 * Statistical reliability level based on sample size
 */
export type ReliabilityLevel = "high" | "medium" | "low" | "insufficient";

/**
 * Confidence interval result
 */
export interface ConfidenceInterval {
  lower: number;
  upper: number;
  confidence: number; // Confidence level (0-1), typically 0.95 (95%)
}

/**
 * Stat reliability assessment with metadata
 */
export interface ReliabilityAssessment {
  level: ReliabilityLevel;
  gamesPlayed: number;
  minGamesRequired: number;
  confidence: number; // 0-1
  recommendation: string;
}

// ============================================================================
// SAMPLE SIZE THRESHOLDS
// ============================================================================

/**
 * Minimum games played thresholds by sport and reliability level
 *
 * These thresholds are based on statistical principles:
 * - Insufficient: Not enough data for any meaningful comparison
 * - Low: Preliminary data only; prone to variance
 * - Medium: Approaching reliability; ok for comparisons with caveats
 * - High: Reliable data; safe for comparisons
 */
const GAME_THRESHOLDS: Record<SportId, Record<ReliabilityLevel, number>> = {
  football: {
    insufficient: 4,
    low: 8,
    medium: 12,
    high: 13, // Full high school season
  },
  basketball: {
    insufficient: 8,
    low: 15,
    medium: 24,
    high: 25, // Full high school season
  },
  baseball: {
    insufficient: 10,
    low: 20,
    medium: 35,
    high: 40, // Full HS season varies 30-50 games
  },
  "track-field": {
    insufficient: 1,
    low: 3,
    medium: 5,
    high: 8, // Individual event counts
  },
  lacrosse: {
    insufficient: 5,
    low: 10,
    medium: 15,
    high: 18, // Typical HS season
  },
  wrestling: {
    insufficient: 5,
    low: 15,
    medium: 25,
    high: 30, // Dual meets + tournaments
  },
  soccer: {
    insufficient: 5,
    low: 10,
    medium: 15,
    high: 20, // Typical HS season
  },
};

/**
 * Minimum games for specific high-variance statistics
 *
 * Some stats have higher inherent variance (e.g., interceptions, steals)
 * and require more games to be considered reliable.
 */
const STAT_SPECIFIC_THRESHOLDS: Record<string, Record<SportId, number>> = {
  // Football turnovers/INT are high-variance
  pass_int: {
    football: 8,
    basketball: 0,
    baseball: 0,
    "track-field": 0,
    lacrosse: 0,
    wrestling: 0,
    soccer: 0,
  },
  // Basketball steals/blocks are high-variance
  steals: {
    football: 0,
    basketball: 20,
    baseball: 0,
    "track-field": 0,
    lacrosse: 0,
    wrestling: 0,
    soccer: 0,
  },
  blocks: {
    football: 0,
    basketball: 20,
    baseball: 0,
    "track-field": 0,
    lacrosse: 0,
    wrestling: 0,
    soccer: 0,
  },
};

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Determines statistical reliability level based on games played
 *
 * @param gamesPlayed Number of games or contests
 * @param sport Sport identifier
 * @returns Reliability level: 'insufficient' | 'low' | 'medium' | 'high'
 */
export function getStatReliability(
  gamesPlayed: number | null | undefined,
  sport: SportId
): ReliabilityLevel {
  if (gamesPlayed === null || gamesPlayed === undefined) {
    return "insufficient";
  }

  const thresholds = GAME_THRESHOLDS[sport];

  // Check in reverse order (highest threshold first)
  if (gamesPlayed >= thresholds.high) {
    return "high";
  }
  if (gamesPlayed >= thresholds.medium) {
    return "medium";
  }
  if (gamesPlayed >= thresholds.low) {
    return "low";
  }

  return "insufficient";
}

/**
 * Checks if a sample is too small for reliable statistical inference
 *
 * @param gamesPlayed Number of games or contests
 * @param sport Sport identifier
 * @returns true if sample is insufficient, false otherwise
 */
export function isSmallSample(
  gamesPlayed: number | null | undefined,
  sport: SportId
): boolean {
  return getStatReliability(gamesPlayed, sport) === "insufficient";
}

/**
 * Gets the minimum games required for a specific statistic
 *
 * Some statistics (like turnovers, steals) have higher minimum thresholds
 * due to their variance.
 *
 * @param sport Sport identifier
 * @param statName Stat name (e.g., 'steals', 'pass_int')
 * @returns Minimum games required for that stat to be reliable
 */
export function getMinGamesThreshold(
  sport: SportId,
  statName?: string
): number {
  // Check stat-specific threshold first
  if (statName && STAT_SPECIFIC_THRESHOLDS[statName]) {
    const threshold = STAT_SPECIFIC_THRESHOLDS[statName][sport];
    if (threshold > 0) {
      return threshold;
    }
  }

  // Fall back to general high-reliability threshold for the sport
  return GAME_THRESHOLDS[sport].high;
}

/**
 * Calculates confidence interval for a statistic using t-distribution
 *
 * Uses simplified confidence interval calculation based on sample size.
 * Larger samples = narrower confidence intervals = more precision.
 *
 * @param statValue The calculated statistic (e.g., 5.2 YPC)
 * @param gamesPlayed Number of games played
 * @param sport Sport identifier
 * @param statName Specific stat name (optional, for variance estimates)
 * @returns Confidence interval with bounds and confidence level
 */
export function getConfidenceInterval(
  statValue: number | null | undefined,
  gamesPlayed: number | null | undefined,
  sport: SportId,
  statName?: string
): ConfidenceInterval | null {
  if (
    statValue === null ||
    statValue === undefined ||
    gamesPlayed === null ||
    gamesPlayed === undefined ||
    gamesPlayed === 0
  ) {
    return null;
  }

  // Confidence level starts at 0.68 (1 std dev) and increases with sample size
  // At 20+ games, approaches 0.95 (1.96 std dev / 95% confidence)
  // This is a simplified model that mimics real confidence growth

  let confidence: number;
  let marginOfError: number;

  if (gamesPlayed < 5) {
    // Extremely uncertain
    confidence = 0.50;
    marginOfError = Math.abs(statValue * 0.5); // ±50% error margin
  } else if (gamesPlayed < 10) {
    // Low confidence
    confidence = 0.68;
    marginOfError = Math.abs(statValue * 0.35); // ±35% error margin
  } else if (gamesPlayed < 15) {
    // Medium confidence
    confidence = 0.80;
    marginOfError = Math.abs(statValue * 0.25); // ±25% error margin
  } else if (gamesPlayed < 20) {
    // High confidence
    confidence = 0.90;
    marginOfError = Math.abs(statValue * 0.15); // ±15% error margin
  } else {
    // Very high confidence
    confidence = 0.95;
    marginOfError = Math.abs(statValue * 0.10); // ±10% error margin
  }

  // For high-variance stats, increase margin of error
  if (statName && ["steals", "blocks", "pass_int", "turnovers"].includes(statName)) {
    marginOfError *= 1.5; // Increase uncertainty for volatile stats
  }

  return {
    lower: Math.max(0, statValue - marginOfError),
    upper: statValue + marginOfError,
    confidence,
  };
}

/**
 * Provides comprehensive reliability assessment with recommendation
 *
 * @param gamesPlayed Number of games played
 * @param sport Sport identifier
 * @param statName Optional stat name for more precise assessment
 * @returns Detailed reliability assessment with recommendation
 */
export function assessReliability(
  gamesPlayed: number | null | undefined,
  sport: SportId,
  statName?: string
): ReliabilityAssessment {
  const level = getStatReliability(gamesPlayed, sport);
  const minRequired = getMinGamesThreshold(sport, statName);
  const actualGames = gamesPlayed || 0;

  // Map reliability level to confidence score (0-1)
  const confidenceMap: Record<ReliabilityLevel, number> = {
    insufficient: 0.3,
    low: 0.6,
    medium: 0.8,
    high: 0.95,
  };

  // Generate recommendation based on level
  const recommendationMap: Record<ReliabilityLevel, string> = {
    insufficient: `Requires ${minRequired - actualGames} more games for low reliability. Data is preliminary.`,
    low: `Approaching reliability. Good for context but avoid strong comparisons.`,
    medium: `Reasonably reliable. Suitable for most comparisons.`,
    high: `Highly reliable. Safe for all analytical comparisons.`,
  };

  return {
    level,
    gamesPlayed: actualGames,
    minGamesRequired: minRequired,
    confidence: confidenceMap[level],
    recommendation: recommendationMap[level],
  };
}

// ============================================================================
// CONFIDENCE SCORING
// ============================================================================

/**
 * Calculates a confidence score (0-1) based on game count for displays
 *
 * Useful for visual indicators (e.g., green dot for high confidence,
 * yellow for medium, red for low).
 *
 * @param gamesPlayed Number of games played
 * @param sport Sport identifier
 * @returns Confidence score (0-1)
 */
export function getConfidenceScore(
  gamesPlayed: number | null | undefined,
  sport: SportId
): number {
  const level = getStatReliability(gamesPlayed, sport);

  const scoreMap: Record<ReliabilityLevel, number> = {
    insufficient: 0.25,
    low: 0.5,
    medium: 0.75,
    high: 1.0,
  };

  return scoreMap[level];
}

/**
 * Gets visual indicator string for confidence level
 *
 * @param gamesPlayed Number of games played
 * @param sport Sport identifier
 * @returns Visual indicator (e.g., "⚡" for high, "⚠️" for low)
 */
export function getConfidenceIndicator(
  gamesPlayed: number | null | undefined,
  sport: SportId
): string {
  const level = getStatReliability(gamesPlayed, sport);

  const indicatorMap: Record<ReliabilityLevel, string> = {
    insufficient: "🔴", // Red dot - unreliable
    low: "🟡", // Yellow dot - low confidence
    medium: "🟢", // Green dot - medium confidence
    high: "✅", // Checkmark - high confidence
  };

  return indicatorMap[level];
}

/**
 * Gets a color class for confidence level (for Tailwind CSS)
 *
 * @param gamesPlayed Number of games played
 * @param sport Sport identifier
 * @returns Tailwind color class (e.g., "text-green-600")
 */
export function getConfidenceColorClass(
  gamesPlayed: number | null | undefined,
  sport: SportId
): string {
  const level = getStatReliability(gamesPlayed, sport);

  const colorMap: Record<ReliabilityLevel, string> = {
    insufficient: "text-red-600",
    low: "text-yellow-600",
    medium: "text-blue-600",
    high: "text-green-600",
  };

  return colorMap[level];
}

// ============================================================================
// SMALL SAMPLE DETECTION
// ============================================================================

/**
 * Gets detailed small-sample warning message
 *
 * @param gamesPlayed Number of games played
 * @param sport Sport identifier
 * @returns Warning message, or null if sample is sufficient
 */
export function getSmallSampleWarning(
  gamesPlayed: number | null | undefined,
  sport: SportId
): string | null {
  if (!isSmallSample(gamesPlayed, sport)) {
    return null;
  }

  const actualGames = gamesPlayed || 0;
  const minRequired = GAME_THRESHOLDS[sport].low;

  return `⚠️ Based on only ${actualGames} game${actualGames !== 1 ? "s" : ""}. Statistics may not be representative. Minimum recommended: ${minRequired} games.`;
}
