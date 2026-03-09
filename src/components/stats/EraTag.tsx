'use client';

import React from 'react';
import { getEraForYear, getEraForSeasonLabel } from '@/lib/stats/era-adjustment';

interface EraTagProps {
  /**
   * Season year (e.g., 2015) or season label (e.g., "2015-16")
   */
  seasonYear?: number;
  seasonLabel?: string;

  /**
   * Optional CSS class for styling
   */
  className?: string;

  /**
   * Display variant
   * - 'pill': rounded pill (default)
   * - 'badge': small badge
   * - 'text': plain text
   */
  variant?: 'pill' | 'badge' | 'text';
}

/**
 * Displays an era identifier pill/badge
 *
 * Examples:
 *   - Pill: "Data Era (2015-2025)"
 *   - Badge: "Data Era"
 *   - Text: "Data Era"
 *
 * Eras:
 *   - Pre-Merger (1887-1969)
 *   - Modern (1970-1999)
 *   - MaxPreps (2000-2014)
 *   - Data Era (2015-2025)
 */
export default function EraTag({
  seasonYear,
  seasonLabel,
  className = '',
  variant = 'pill',
}: EraTagProps) {
  let era = null;

  if (seasonYear !== undefined) {
    era = getEraForYear(seasonYear);
  } else if (seasonLabel) {
    era = getEraForSeasonLabel(seasonLabel);
  }

  if (!era) {
    return null;
  }

  const displayText =
    variant === 'pill'
      ? `${era.displayName} (${era.startYear}-${era.endYear})`
      : era.displayName;

  const baseClasses = {
    pill: 'px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700',
    badge: 'px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800',
    text: 'text-xs font-semibold text-blue-700',
  };

  return (
    <span
      className={`${baseClasses[variant]} ${className}`}
      title={era.description}
    >
      {displayText}
    </span>
  );
}
