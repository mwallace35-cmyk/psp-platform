import React from 'react';
import {
  getConfidenceIndicator,
  getConfidenceColorClass,
  getStatReliability,
  type ReliabilityLevel,
} from '@/lib/stats/confidence';
import { getEraForYear } from '@/lib/stats/era-adjustment';
import type { SportId } from '@/lib/sports';

interface StatWithContextProps {
  /**
   * The stat value to display (e.g., 5.2, 18.7)
   */
  value: number | null;

  /**
   * The name of the statistic (for confidence assessment)
   */
  statName: string;

  /**
   * Human-readable label for the stat (e.g., "Yards Per Carry")
   */
  label: string;

  /**
   * Unit for display (e.g., "YPC", "PPG", "yards")
   */
  unit?: string;

  /**
   * Number of games played (for confidence calculation)
   */
  gamesPlayed?: number;

  /**
   * Sport identifier (for sport-specific thresholds)
   */
  sport: SportId;

  /**
   * Season year (for era context)
   */
  seasonYear?: number;

  /**
   * Optional percentile rank (0-100)
   */
  percentile?: number;

  /**
   * Optional CSS class for additional styling
   */
  className?: string;

  /**
   * Show confidence indicator badge? (default: true)
   */
  showConfidenceIndicator?: boolean;

  /**
   * Show era tag? (default: true)
   */
  showEraTag?: boolean;

  /**
   * Number of decimal places to display (default: 1)
   */
  decimals?: number;
}

/**
 * Displays a statistic with confidence indicator and era context
 *
 * Example output:
 *   "5.2 YPC ✅ (87th percentile, Data Era)"
 *
 * Where:
 *   - 5.2 = the actual stat value
 *   - YPC = unit (yards per carry)
 *   - ✅ = confidence indicator (green = high, yellow = medium, red = low, 🔴 = insufficient)
 *   - 87th percentile = where it ranks among peers
 *   - Data Era = time period (1887-2025)
 */
export default function StatWithContext({
  value,
  statName,
  label,
  unit,
  gamesPlayed,
  sport,
  seasonYear,
  percentile,
  className = '',
  showConfidenceIndicator = true,
  showEraTag = true,
  decimals = 1,
}: StatWithContextProps) {
  if (value === null) {
    return (
      <div className={`text-gray-300 text-sm ${className}`}>
        <span className="line-through">{label}</span>
        <span className="ml-2">—</span>
      </div>
    );
  }

  const reliability = getStatReliability(gamesPlayed, sport);
  const confidenceIndicator = showConfidenceIndicator
    ? getConfidenceIndicator(gamesPlayed, sport)
    : null;
  const confidenceColor = getConfidenceColorClass(gamesPlayed, sport);

  const era = seasonYear ? getEraForYear(seasonYear) : null;

  // Format the number
  const formattedValue = value.toFixed(decimals);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Main stat display */}
      <span className="font-semibold text-lg">
        {formattedValue}
        {unit && <span className="text-xs ml-1 text-gray-600">{unit}</span>}
      </span>

      {/* Confidence indicator */}
      {confidenceIndicator && showConfidenceIndicator && (
        <span
          className={`text-lg ${confidenceColor}`}
          title={`Confidence: ${reliability}`}
          aria-label={`${reliability} confidence based on ${gamesPlayed || 0} games`}
        >
          {confidenceIndicator}
        </span>
      )}

      {/* Context annotation */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
        {/* Percentile */}
        {percentile !== undefined && percentile !== null && (
          <span className="font-medium">
            {Math.round(percentile)}th percentile
          </span>
        )}

        {/* Era tag */}
        {era && showEraTag && (
          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
            {era.displayName}
          </span>
        )}

        {/* Games played indicator for low confidence */}
        {reliability === 'low' && (
          <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">
            {gamesPlayed} games
          </span>
        )}
      </div>
    </div>
  );
}
