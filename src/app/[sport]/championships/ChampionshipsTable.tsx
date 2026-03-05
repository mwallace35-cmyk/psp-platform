'use client';

import Link from 'next/link';
import ResponsiveDataTable from '@/components/ui/ResponsiveDataTable';
import type { RDTColumn } from '@/components/ui/ResponsiveDataTable';

interface ChampionshipsTableProps {
  data: any[];
}

export default function ChampionshipsTable({ data }: ChampionshipsTableProps) {
  const columns: RDTColumn[] = [
    {
      key: 'season',
      label: 'Season',
      sortable: true,
      primary: true,
      render: (value: string) => (
        <span style={{ fontWeight: 600, color: 'var(--psp-navy)', whiteSpace: 'nowrap' }}>{value}</span>
      ),
    },
    {
      key: 'champion',
      label: 'Champion',
      sortable: true,
      render: (value: string, row: any) => (
        <Link
          href={`/schools/${row.championSlug}`}
          className="hover:underline"
          style={{ fontWeight: 700, color: 'var(--psp-gold)', fontSize: '0.8125rem' }}
        >
          🏆 {value}
        </Link>
      ),
    },
    {
      key: 'league',
      label: 'League',
      sortable: true,
      hideOnMobile: true,
    },
    {
      key: 'score',
      label: 'Score',
      align: 'center',
      sortable: false,
    },
    {
      key: 'opponent',
      label: 'Opponent',
      sortable: true,
      hideOnMobile: true,
    },
  ];

  return (
    <ResponsiveDataTable
      columns={columns}
      data={data}
      highlightTop={0}
      showRank={false}
      emptyMessage="No championship data available"
      emptyIcon="🏆"
    />
  );
}
