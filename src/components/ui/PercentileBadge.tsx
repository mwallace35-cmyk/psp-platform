'use client';

import React from 'react';

interface PercentileBadgeProps {
  rank: number;
  totalPlayers: number;
  label?: string;
  /** e.g., "Philly QBs" — shown as "Top X% of all {statLabel}" */
  statLabel?: string;
}

export default function PercentileBadge({
  rank,
  totalPlayers,
  label = 'all-time',
  statLabel,
}: PercentileBadgeProps) {
  if (!totalPlayers || totalPlayers === 0) {
    return <span style={{ marginLeft: '4px' }}>#{rank}</span>;
  }

  // Calculate precise percentile: top X% means rank / total * 100
  const rawPercentile = (rank / totalPlayers) * 100;

  // Format percentile with appropriate precision
  let percentileText: string;
  if (rawPercentile < 1) {
    // Show one decimal, e.g., "Top 0.3%"
    percentileText = `${rawPercentile.toFixed(1)}%`;
  } else if (rawPercentile < 5) {
    percentileText = `${rawPercentile.toFixed(1)}%`;
  } else if (rawPercentile < 10) {
    percentileText = `${Math.round(rawPercentile)}%`;
  } else {
    percentileText = `${Math.round(rawPercentile)}%`;
  }

  const roundedPercentile = Math.round(rawPercentile);

  // Determine badge style based on percentile
  const baseBadgeStyle: React.CSSProperties = {
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    marginLeft: '4px',
    display: 'inline-block',
    lineHeight: '1.3',
  };

  // Build descriptive text
  const descriptiveText = statLabel ? `Top ${percentileText} of all ${statLabel}` : `Top ${percentileText}`;

  if (roundedPercentile <= 1) {
    // Top 1% - gold badge (only tier that shows percentile)
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>#{rank}</span>
        <span
          style={{
            ...baseBadgeStyle,
            background: 'var(--psp-gold, #f0a500)',
            color: 'var(--psp-navy, #0a1628)',
            fontWeight: 'bold',
          }}
          title={descriptiveText}
        >
          {descriptiveText}
        </span>
      </span>
    );
  } else {
    // Everyone else - just rank number, no percentile badge
    return <span style={{ marginLeft: '4px' }}>#{rank}</span>;
  }
}
