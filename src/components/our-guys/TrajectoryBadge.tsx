'use client';

import React from 'react';

export type TrajectoryLabel =
  | 'overachiever'
  | 'met_expectations'
  | 'below_projection'
  | 'undrafted_star';

interface TrajectoryBadgeProps {
  label: TrajectoryLabel | null | undefined;
  /** Compact mode for tight card layouts */
  compact?: boolean;
}

const BADGE_CONFIG: Record<
  string,
  { text: string; icon: string; bg: string; border: string; textColor: string } | null
> = {
  overachiever: {
    text: 'Overachiever',
    icon: '\u2B06',
    bg: 'bg-gradient-to-r from-amber-500/15 to-yellow-400/10',
    border: 'border-amber-400/40',
    textColor: 'text-amber-600',
  },
  undrafted_star: {
    text: 'Undrafted Star',
    icon: '\u2B50',
    bg: 'bg-gradient-to-r from-amber-500/15 to-yellow-400/10',
    border: 'border-amber-400/40',
    textColor: 'text-amber-600',
  },
  met_expectations: {
    text: 'Expected Path',
    icon: '',
    bg: 'bg-gray-100/60',
    border: 'border-gray-200/60',
    textColor: 'text-gray-400',
  },
  below_projection: null, // No badge shown
};

/**
 * Small inline badge showing a pro athlete's career trajectory label.
 * - overachiever: Gold upward arrow
 * - undrafted_star: Gold star
 * - met_expectations: Subtle gray "Expected Path"
 * - below_projection: Hidden (no badge)
 */
export default function TrajectoryBadge({ label, compact = false }: TrajectoryBadgeProps) {
  if (!label) return null;

  const config = BADGE_CONFIG[label];
  if (!config) return null;

  if (compact) {
    // Ultra-compact: icon only for gold badges, hidden for gray
    if (label === 'met_expectations') return null;
    return (
      <span
        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold border ${config.bg} ${config.border} ${config.textColor}`}
        title={config.text}
      >
        {config.icon && <span aria-hidden="true">{config.icon}</span>}
        <span className="sr-only">{config.text}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${config.bg} ${config.border} ${config.textColor} whitespace-nowrap`}
    >
      {config.icon && <span aria-hidden="true">{config.icon}</span>}
      {config.text}
    </span>
  );
}
