'use client';

import Link from 'next/link';
import SortableTable from './SortableTable';

interface LeaderboardTableProps {
  sport: string;
  statCols: string[];
  colLabels: Record<string, string>;
  data: any[];
}

export default function LeaderboardTable({ sport, statCols, colLabels, data }: LeaderboardTableProps) {
  const columns: any[] = [
    {
      key: 'rank',
      label: '#',
      align: 'center',
      sortable: false,
      width: 'w-12',
    },
    {
      key: 'playerName',
      label: 'Player',
      sortable: true,
      primary: true,
      render: (value: string, row: any) => (
        <div className="flex items-center gap-2">
          {row.pro_team && <span className="text-gold">⭐</span>}
          <Link
            href={`/${sport}/players/${row.playerSlug}`}
            className="font-medium text-sm hover:underline"
            style={{ color: 'var(--psp-navy)' }}
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
          href={`/${sport}/schools/${row.schoolSlug}`}
          className="hover:underline text-sm"
          style={{ color: 'var(--psp-gray-500)' }}
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
      hideOnMobile: false,
      render: (value: any) => value ?? '—',
    });
  }

  return (
    <SortableTable
      columns={columns}
      data={data}
      highlightTop3={true}
      mobileCardMode={true}
      emptyMessage="No leaderboard data available"
    />
  );
}
