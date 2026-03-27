import React from 'react';
import { formatRateStat } from '@/lib/stats/computed-metrics';

interface RateStatDisplayProps {
  /**
   * The rate stat value (e.g., 5.2 for YPC)
   */
  value: number | null;

  /**
   * The numerator for display (e.g., 187 for 187 carries)
   */
  numerator: number | null;

  /**
   * Unit label (e.g., "carries", "games", "receptions")
   */
  denominatorLabel: string;

  /**
   * Stat abbreviation (e.g., "YPC", "PPG")
   */
  abbreviation: string;

  /**
   * Full stat name for tooltips (e.g., "Yards Per Carry")
   */
  fullName?: string;

  /**
   * CSS class for additional styling
   */
  className?: string;

  /**
   * Display variant
   * - 'inline': single line (default)
   * - 'stacked': value on top, denominator below
   * - 'minimal': just the value
   */
  variant?: 'inline' | 'stacked' | 'minimal';

  /**
   * Highlight color (e.g., "text-gold", "text-green-600")
   */
  highlight?: boolean;
}

/**
 * Displays a rate statistic with its denominator
 *
 * Examples:
 *   - Inline: "5.2 YPC (187 carries)"
 *   - Stacked: "5.2 YPC\n187 carries"
 *   - Minimal: "5.2"
 *
 * Used throughout the site to show calculated metrics clearly with context.
 */
export default function RateStatDisplay({
  value,
  numerator,
  denominatorLabel,
  abbreviation,
  fullName,
  className = '',
  variant = 'inline',
  highlight = false,
}: RateStatDisplayProps) {
  if (value === null) {
    return (
      <span className={`text-gray-300 ${className}`}>
        {fullName || abbreviation} — N/A
      </span>
    );
  }

  const formattedValue = formatRateStat(value);
  const highlightClass = highlight ? 'text-[var(--psp-gold)] font-bold' : '';

  const denominatorText =
    numerator !== null
      ? `${numerator.toLocaleString()} ${denominatorLabel}`
      : `— ${denominatorLabel}`;

  if (variant === 'minimal') {
    return (
      <span
        className={`text-lg font-semibold ${highlightClass} ${className}`}
        title={fullName}
      >
        {formattedValue}
      </span>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col gap-0.5 ${className}`}>
        <span
          className={`text-lg font-bold ${highlightClass}`}
          title={fullName}
        >
          {formattedValue}
          <span className="text-xs ml-1 font-normal text-gray-600">
            {abbreviation}
          </span>
        </span>
        <span className="text-xs text-gray-400">{denominatorText}</span>
      </div>
    );
  }

  // inline variant (default)
  return (
    <span
      className={`inline-flex items-baseline gap-1 ${className}`}
      title={fullName}
    >
      <span className={`text-lg font-bold ${highlightClass}`}>
        {formattedValue}
      </span>
      <span className="text-sm text-gray-700 font-medium">{abbreviation}</span>
      <span className="text-sm text-gray-600">({denominatorText})</span>
    </span>
  );
}
