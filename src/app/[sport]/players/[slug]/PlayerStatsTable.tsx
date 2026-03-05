'use client';

import Link from 'next/link';
import ResponsiveDataTable from '@/components/ui/ResponsiveDataTable';
import type { RDTColumn } from '@/components/ui/ResponsiveDataTable';

interface PlayerStatsTableProps {
  sport: string;
  stats: any[];
}

export default function PlayerStatsTable({ sport, stats }: PlayerStatsTableProps) {
  const baseColumns: RDTColumn[] = [
    {
      key: 'season',
      label: 'Season',
      primary: true,
      sortable: true,
      render: (value: string) => (
        <span style={{ fontWeight: 700, color: 'var(--psp-navy)', whiteSpace: 'nowrap' }}>{value}</span>
      ),
    },
    {
      key: 'school',
      label: 'School',
      sortable: true,
      hideOnMobile: true,
      render: (value: string, row: any) => (
        <Link href={`/schools/${row.schoolSlug}`} className="hover:underline" style={{ color: 'var(--psp-gold)', fontSize: '0.8125rem' }}>
          {value}
        </Link>
      ),
    },
  ];

  const statRender = (value: any) => (
    <span style={{ fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.9375rem' }}>
      {value ?? '—'}
    </span>
  );

  let columns: RDTColumn[] = [];

  if (sport === 'football') {
    const hasPass = stats.some((s) => s.pass_yards && s.pass_yards > 0);
    const hasRec = stats.some((s) => s.rec_yards && s.rec_yards > 0);

    columns = [
      ...baseColumns,
      { key: 'rush_yards', label: 'Rush Yds', align: 'right', sortable: true, render: statRender },
      { key: 'rush_td', label: 'Rush TD', align: 'right', sortable: true, render: statRender },
      ...(hasPass ? [
        { key: 'pass_yards', label: 'Pass Yds', align: 'right' as const, sortable: true, render: statRender },
        { key: 'pass_td', label: 'Pass TD', align: 'right' as const, sortable: true, render: statRender, hideOnMobile: true },
      ] : []),
      ...(hasRec ? [
        { key: 'rec_yards', label: 'Rec Yds', align: 'right' as const, sortable: true, render: statRender, hideOnMobile: true },
        { key: 'rec_td', label: 'Rec TD', align: 'right' as const, sortable: true, render: statRender, hideOnMobile: true },
      ] : []),
      { key: 'total_td', label: 'Total TD', align: 'right', sortable: true, render: (value: any) => (
        <span style={{ fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', color: 'var(--psp-gold)' }}>
          {value ?? '—'}
        </span>
      )},
    ];
  } else if (sport === 'basketball') {
    columns = [
      ...baseColumns,
      { key: 'games_played', label: 'GP', align: 'right', sortable: true, render: statRender },
      { key: 'points', label: 'PTS', align: 'right', sortable: true, render: statRender },
      { key: 'ppg', label: 'PPG', align: 'right', sortable: true, render: (value: any) => (
        <span style={{ fontWeight: 800, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem', color: 'var(--psp-gold)' }}>
          {value ?? '—'}
        </span>
      )},
      { key: 'rebounds', label: 'REB', align: 'right', sortable: true, render: statRender, hideOnMobile: true },
      { key: 'assists', label: 'AST', align: 'right', sortable: true, render: statRender, hideOnMobile: true },
      { key: 'steals', label: 'STL', align: 'right', sortable: true, render: statRender, hideOnMobile: true },
      { key: 'blocks', label: 'BLK', align: 'right', sortable: true, render: statRender, hideOnMobile: true },
    ];
  } else {
    columns = baseColumns;
  }

  return (
    <ResponsiveDataTable
      columns={columns}
      data={stats}
      highlightTop={0}
      showRank={false}
      emptyMessage="No stats available"
      emptyIcon="📊"
    />
  );
}
