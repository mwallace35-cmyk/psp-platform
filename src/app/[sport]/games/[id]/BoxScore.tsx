'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { SortableColumn } from '@/components/ui/SortableTable';
import SortableTable from '@/components/ui/SortableTable';

interface BoxScoreProps {
  boxScore: any[];
  sportId: string;
  homeSchoolId: number;
  awaySchoolId: number;
}

export default function BoxScore({
  boxScore,
  sportId,
  homeSchoolId,
  awaySchoolId,
}: BoxScoreProps) {
  const [activeTeam, setActiveTeam] = useState<'home' | 'away'>('home');

  // Split stats by team
  const homeStats = useMemo(
    () =>
      boxScore
        .filter((s) => s.school_id === homeSchoolId)
        .map((s) => ({
          ...s,
          playerName: s.players?.name || '—',
          playerSlug: s.players?.slug || '',
          schoolName: s.schools?.short_name || s.schools?.name || '—',
          schoolSlug: s.schools?.slug || '',
          positions: s.players?.positions || [],
        })),
    [boxScore, homeSchoolId]
  );

  const awayStats = useMemo(
    () =>
      boxScore
        .filter((s) => s.school_id === awaySchoolId)
        .map((s) => ({
          ...s,
          playerName: s.players?.name || '—',
          playerSlug: s.players?.slug || '',
          schoolName: s.schools?.short_name || s.schools?.name || '—',
          schoolSlug: s.schools?.slug || '',
          positions: s.players?.positions || [],
        })),
    [boxScore, awaySchoolId]
  );

  const activeStats = activeTeam === 'home' ? homeStats : awayStats;

  // Define columns based on sport
  const getColumns = (): SortableColumn[] => {
    if (sportId === 'football') {
      return [
        {
          key: 'playerName',
          label: 'Player',
          sortable: true,
          primary: true,
          render: (value: string, row: any) =>
            row.playerSlug ? (
              <Link
                href={`/${sportId}/players/${row.playerSlug}`}
                className="text-navy hover:text-gold font-semibold"
              >
                {value}
              </Link>
            ) : (
              <span className="font-semibold">{value}</span>
            ),
        },
        {
          key: 'rush_carries',
          label: 'Carries',
          sortable: true,
          align: 'right',
          render: (value: number) => value || '—',
        },
        {
          key: 'rush_yards',
          label: 'Rush Yds',
          sortable: true,
          align: 'right',
          render: (value: number) => value || '—',
        },
        {
          key: 'rush_td',
          label: 'Rush TD',
          sortable: true,
          align: 'right',
          render: (value: number) => value || '—',
        },
        {
          key: 'pass_att',
          label: 'Att',
          sortable: true,
          align: 'right',
          hideOnMobile: true,
          render: (value: number) => value || '—',
        },
        {
          key: 'pass_comp',
          label: 'Comp',
          sortable: true,
          align: 'right',
          hideOnMobile: true,
          render: (value: number) => value || '—',
        },
        {
          key: 'pass_yards',
          label: 'Pass Yds',
          sortable: true,
          align: 'right',
          render: (value: number) => value || '—',
        },
        {
          key: 'pass_td',
          label: 'Pass TD',
          sortable: true,
          align: 'right',
          render: (value: number) => value || '—',
        },
        {
          key: 'pass_int',
          label: 'INT',
          sortable: true,
          align: 'right',
          hideOnMobile: true,
          render: (value: number) => value || '—',
        },
        {
          key: 'receptions',
          label: 'Rec',
          sortable: true,
          align: 'right',
          hideOnMobile: true,
          render: (value: number) => value || '—',
        },
        {
          key: 'rec_yards',
          label: 'Rec Yds',
          sortable: true,
          align: 'right',
          render: (value: number) => value || '—',
        },
        {
          key: 'rec_td',
          label: 'Rec TD',
          sortable: true,
          align: 'right',
          hideOnMobile: true,
          render: (value: number) => value || '—',
        },
        {
          key: 'points',
          label: 'Points',
          sortable: true,
          align: 'right',
          render: (value: number) => value || '—',
        },
      ];
    }

    if (sportId === 'basketball') {
      return [
        {
          key: 'playerName',
          label: 'Player',
          sortable: true,
          primary: true,
          render: (value: string, row: any) =>
            row.playerSlug ? (
              <Link
                href={`/${sportId}/players/${row.playerSlug}`}
                className="text-navy hover:text-gold font-semibold"
              >
                {value}
              </Link>
            ) : (
              <span className="font-semibold">{value}</span>
            ),
        },
        {
          key: 'minutes_played',
          label: 'MIN',
          sortable: true,
          align: 'right',
          hideOnMobile: true,
          render: (value: number) => value || '—',
        },
        {
          key: 'points',
          label: 'PTS',
          sortable: true,
          align: 'right',
          render: (value: number) => value || '—',
        },
        {
          key: 'rebounds',
          label: 'REB',
          sortable: true,
          align: 'right',
          render: (value: number) => value || '—',
        },
        {
          key: 'assists',
          label: 'AST',
          sortable: true,
          align: 'right',
          hideOnMobile: true,
          render: (value: number) => value || '—',
        },
        {
          key: 'steals',
          label: 'STL',
          sortable: true,
          align: 'right',
          hideOnMobile: true,
          render: (value: number) => value || '—',
        },
        {
          key: 'blocks',
          label: 'BLK',
          sortable: true,
          align: 'right',
          hideOnMobile: true,
          render: (value: number) => value || '—',
        },
        {
          key: 'fg_percent',
          label: 'FG%',
          sortable: true,
          align: 'right',
          hideOnMobile: true,
          render: (value: number) => (value ? value.toFixed(1) : '—'),
        },
        {
          key: 'three_pm',
          label: '3PM',
          sortable: true,
          align: 'right',
          hideOnMobile: true,
          render: (value: number) => value || '—',
        },
      ];
    }

    // Default columns for other sports
    return [
      {
        key: 'playerName',
        label: 'Player',
        sortable: true,
        primary: true,
        render: (value: string, row: any) =>
          row.playerSlug ? (
            <Link
              href={`/${sportId}/players/${row.playerSlug}`}
              className="text-navy hover:text-gold font-semibold"
            >
              {value}
            </Link>
          ) : (
            <span className="font-semibold">{value}</span>
          ),
      },
    ];
  };

  const columns = getColumns();

  return (
    <div className="space-y-4">
      {/* Team tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTeam('away')}
          className={`px-4 py-3 font-semibold border-b-2 transition ${
            activeTeam === 'away'
              ? 'border-gold text-navy'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Away Team ({awayStats.length})
        </button>
        <button
          onClick={() => setActiveTeam('home')}
          className={`px-4 py-3 font-semibold border-b-2 transition ${
            activeTeam === 'home'
              ? 'border-gold text-navy'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Home Team ({homeStats.length})
        </button>
      </div>

      {/* Box score table */}
      {activeStats.length > 0 ? (
        <SortableTable
          columns={columns}
          data={activeStats}
          highlightTop3={false}
          mobileCardMode
          emptyMessage="No player stats available"
        />
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p>No player stats available for this team</p>
        </div>
      )}
    </div>
  );
}
