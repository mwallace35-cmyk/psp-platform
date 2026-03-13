'use client';

import React from 'react';

interface PercentileBadgeProps {
  rank: number;
  totalPlayers: number;
  label?: string;
}

export default function PercentileBadge({
  rank,
  totalPlayers,
  label = 'all-time',
}: PercentileBadgeProps) {
  const percentile = Math.round((rank / totalPlayers) * 100);

  // Determine badge style based on percentile
  let badgeStyle: React.CSSProperties = {};
  let textContent = `#${rank}`;

  if (percentile <= 1) {
    // Top 1% - gold badge
    badgeStyle = {
      background: 'var(--psp-gold, #f0a500)',
      color: 'var(--psp-navy, #0a1628)',
      fontWeight: 'bold',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      whiteSpace: 'nowrap',
      marginLeft: '4px',
      display: 'inline-block',
    };
    textContent = `#${rank} (top 1%)`;
  } else if (percentile <= 5) {
    // Top 5% - blue badge
    badgeStyle = {
      background: 'var(--psp-blue, #3b82f6)',
      color: 'white',
      fontWeight: '600',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      whiteSpace: 'nowrap',
      marginLeft: '4px',
      display: 'inline-block',
    };
    textContent = `#${rank} (top 5%)`;
  } else if (percentile <= 10) {
    // Top 10% - gray badge
    badgeStyle = {
      background: 'var(--psp-gray-200, #e5e7eb)',
      color: 'var(--psp-navy, #0a1628)',
      fontWeight: '600',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      whiteSpace: 'nowrap',
      marginLeft: '4px',
      display: 'inline-block',
    };
    textContent = `#${rank} (top 10%)`;
  } else if (percentile <= 25) {
    // Top 25% - muted text only
    return (
      <span style={{ marginLeft: '4px', fontSize: '0.75rem', color: 'var(--psp-gray-500, #6b7280)' }}>
        #{rank}
      </span>
    );
  } else {
    // Beyond top 25% - just rank number
    return <span style={{ marginLeft: '4px' }}>#{rank}</span>;
  }

  return <span style={badgeStyle}>{textContent}</span>;
}
