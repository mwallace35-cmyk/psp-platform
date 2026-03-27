import React from 'react';
import {
  getStatReliability,
  getConfidenceIndicator,
  getConfidenceColorClass,
} from '@/lib/stats/confidence';
import type { SportId } from '@/lib/sports';

interface ConfidenceBadgeProps {
  /**
   * Number of games played
   */
  gamesPlayed: number | null | undefined;

  /**
   * Sport identifier
   */
  sport: SportId;

  /**
   * Stat name (optional, for more precise assessment)
   */
  statName?: string;

  /**
   * Show icon before text? (default: true)
   */
  showIcon?: boolean;

  /**
   * CSS class for additional styling
   */
  className?: string;

  /**
   * Variant of badge display
   * - 'compact': just the indicator and number (default)
   * - 'full': full text description
   */
  variant?: 'compact' | 'full';
}

/**
 * Displays sample size reliability as a badge
 *
 * Examples:
 *   - Compact: "✅ 16 games"
 *   - Full: "✅ High confidence (16 games)"
 *
 * Color codes:
 *   - Green (✅): High confidence (13+ games for football, 25+ for basketball)
 *   - Blue (🟢): Medium confidence
 *   - Yellow (🟡): Low confidence
 *   - Red (🔴): Insufficient data
 */
export default function ConfidenceBadge({
  gamesPlayed,
  sport,
  statName,
  showIcon = true,
  className = '',
  variant = 'compact',
}: ConfidenceBadgeProps) {
  const reliability = getStatReliability(gamesPlayed, sport);
  const indicator = getConfidenceIndicator(gamesPlayed, sport);
  const colorClass = getConfidenceColorClass(gamesPlayed, sport);

  const reliabilityText = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    insufficient: 'Insufficient',
  };

  const baseClasses = `
    inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
    ${colorClass}
  `;

  if (variant === 'full') {
    return (
      <div className={`${baseClasses} ${className}`}>
        {showIcon && <span>{indicator}</span>}
        <span>
          {reliabilityText[reliability]} confidence ({gamesPlayed || 0} games)
        </span>
      </div>
    );
  }

  // compact variant
  return (
    <div className={`${baseClasses} ${className}`}>
      {showIcon && <span>{indicator}</span>}
      <span>{gamesPlayed || 0} games</span>
    </div>
  );
}
