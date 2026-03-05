'use client';

import Link from 'next/link';
import ResponsiveDataTable from './ResponsiveDataTable';
import type { RDTColumn } from './ResponsiveDataTable';

interface LeaderboardTableProps {
  sport: string;
  statCols: string[];
  colLabels: Record<string, string>;
  data: any[];
  accentColor?: string;
}

export default function LeaderboardTable({ sport, statCols, colLabels, data, accentColor }: LeaderboardTableProps) {
  const columns: RDTColumn[] = [
    {
      key: 'rank',
      label: '#',
      align: 'center',
      sortable: false,
      width: '48px',
      hideOnMobile: true,
    },
    {
      key: 'playerName',
      label: 'Player',
      sortable: true,
      primary: true,
      render: (value: string, row: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {row.pro_team && <span style={{ color: 'var(--psp-gold)' }}>⭐</span>}
          <Link
            href={`/${sport}/players/${row.playerSlug}`}
            className="hover:underline"
            style={{ color: 'var(--psp-navy)', fontWeight: 600, fontSize: '0.8125rem' }}
          >
            {value}
          </Link>
        </div>
      ),
    },
    {
      key: 'schoolName',
      label: 'School',
      sortable: true,
      render: (value: string, row: any) => (
        <Link
          href={`/schools/${row.schoolSlug}`}
          className="hover:underline"
          style={{ color: 'var(--psp-gray-500)', fontSize: '0.8125rem' }}
        >
          {value}
        </Link>
      ),
    },
    {
      key: 'seasonLabel',
      label: 'Season',
      sortable: true,
      hideOnMobile: true,
    },
  ];

  // Add stat columns
  for (const col of statCols) {
    columns.push({
      key: col,
      label: colLabels[col] || col,
      align: 'right',
      sortable: true,
      render: (value: any) => (
        <span style={{ fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.875rem' }}>
          {value ?? '—'}
        </span>
      ),
    });
  }

  return (
    <ResponsiveDataTable
      columns={columns}
      data={data}
      highlightTop={3}
      defaultSort={statCols[0]}
      defaultDir="desc"
      accentColor={accentColor}
      emptyMessage="No leaderboard data available"
      emptyIcon="📊"
    />
  );
}
