'use client';

import React from 'react';
import Link from 'next/link';
import SortableTable, { SortableColumn } from './SortableTable';

interface LeaderboardRow {
  id: string;
  rank: number;
  playerName: string;
  playerSlug: string;
  schoolName: string;
  schoolSlug: string;
  seasonLabel: string;
  pro_team?: string | null;
  [key: string]: unknown;
}

interface StatColumnDef {
  key: string;
  label: string;
}

interface LeaderboardTableProps {
  data: LeaderboardRow[];
  sport: string;
  statColumns: StatColumnDef[];
  isCareer: boolean;
  highlightTop3?: boolean;
  mobileCardMode?: boolean;
  emptyMessage?: string;
  ariaLabel?: string;
}

export default function LeaderboardTable({
  data,
  sport,
  statColumns,
  isCareer,
  highlightTop3 = true,
  mobileCardMode = true,
  emptyMessage = 'No leaderboard data available',
  ariaLabel,
}: LeaderboardTableProps) {
  const columns: SortableColumn[] = [
    { key: 'rank', label: '#', align: 'center', sortable: false },
    {
      key: 'playerName',
      label: 'Player',
      sortable: true,
      primary: true,
      render: (value: unknown, row: Record<string, any>) => (
        <div className="flex items-center gap-2">
          {row?.pro_team && <span className="text-gold">⭐</span>}
          <Link
            href={`/${sport}/players/${row?.playerSlug || ''}`}
            className="font-medium text-sm hover:underline"
            style={{ color: 'var(--psp-navy)' }}
          >
            {String(value)}
          </Link>
        </div>
      ),
    },
    {
      key: 'schoolName',
      label: 'School',
      sortable: true,
      render: (value: unknown, row: Record<string, any>) => (
        <Link
          href={`/${sport}/schools/${row?.schoolSlug || ''}`}
          className="hover:underline text-sm"
          style={{ color: 'var(--psp-gray-500)' }}
        >
          {String(value)}
        </Link>
      ),
    },
    {
      key: 'seasonLabel',
      label: isCareer ? 'Years' : 'Season',
      sortable: true,
      hideOnMobile: true,
    },
  ];

  for (const col of statColumns) {
    columns.push({
      key: col.key,
      label: col.label,
      align: 'right',
      sortable: true,
      hideOnMobile: false,
      render: (value: unknown) => String(value ?? '—'),
    });
  }

  return (
    <SortableTable
      columns={columns}
      data={data}
      highlightTop3={highlightTop3}
      mobileCardMode={mobileCardMode}
      emptyMessage={emptyMessage}
      ariaLabel={ariaLabel}
    />
  );
}
