'use client';

import Link from 'next/link';
import ResponsiveDataTable from '@/components/ui/ResponsiveDataTable';
import type { RDTColumn } from '@/components/ui/ResponsiveDataTable';

interface RecordsTableProps {
  sport: string;
  data: any[];
}

export default function RecordsTable({ sport, data }: RecordsTableProps) {
  const columns: RDTColumn[] = [
    {
      key: 'record',
      label: 'Record',
      primary: true,
      sortable: true,
      render: (value: string) => (
        <span style={{ fontWeight: 600, color: 'var(--psp-navy)' }}>{value}</span>
      ),
    },
    {
      key: 'value',
      label: 'Value',
      align: 'right',
      sortable: false,
      render: (value: any) => (
        <span style={{ fontWeight: 800, color: 'var(--psp-gold)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1rem' }}>
          {value}
        </span>
      ),
    },
    {
      key: 'playerName',
      label: 'Player',
      sortable: true,
      render: (value: string, row: any) =>
        row.playerSlug ? (
          <Link href={`/${sport}/players/${row.playerSlug}`} className="hover:underline" style={{ color: 'var(--psp-navy)', fontSize: '0.8125rem' }}>
            {value}
          </Link>
        ) : (
          <span style={{ fontSize: '0.8125rem' }}>{value}</span>
        ),
    },
    {
      key: 'schoolName',
      label: 'School',
      sortable: true,
      render: (value: string, row: any) =>
        row.schoolSlug ? (
          <Link href={`/schools/${row.schoolSlug}`} className="hover:underline" style={{ color: 'var(--psp-gray-500)', fontSize: '0.8125rem' }}>
            {value}
          </Link>
        ) : (
          <span style={{ color: 'var(--psp-gray-500)', fontSize: '0.8125rem' }}>{value}</span>
        ),
    },
    {
      key: 'year',
      label: 'Year',
      sortable: true,
      hideOnMobile: false,
      align: 'right',
    },
  ];

  return (
    <ResponsiveDataTable
      columns={columns}
      data={data}
      highlightTop={0}
      showRank={false}
      emptyMessage="No records available"
      emptyIcon="🏅"
    />
  );
}
