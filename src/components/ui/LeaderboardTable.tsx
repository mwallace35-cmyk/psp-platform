'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import SortableTable, { SortableColumn } from './SortableTable';
import PercentileBadge from './PercentileBadge';
import StatTooltip from './StatTooltip';
import { STAT_DEFINITIONS } from '@/lib/stats';
import { AdvancedFilterPanel, type FilterState } from '@/components/leaderboards';

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

interface School {
  name: string;
  slug: string;
}

interface LeaderboardTableProps {
  data: LeaderboardRow[];
  sport: string;
  statColumns: StatColumnDef[];
  isCareer: boolean;
  primaryStatKey?: string;
  highlightTop3?: boolean;
  mobileCardMode?: boolean;
  emptyMessage?: string;
  ariaLabel?: string;
  seasons?: string[];
  schools?: School[];
  positions?: string[];
  leagues?: string[];
  totalPlayers?: number;
}

export default function LeaderboardTable({
  data,
  sport,
  statColumns,
  isCareer,
  primaryStatKey,
  highlightTop3 = true,
  mobileCardMode = true,
  emptyMessage = 'No leaderboard data available',
  ariaLabel,
  seasons = [],
  schools = [],
  positions = [],
  leagues = [],
  totalPlayers,
}: LeaderboardTableProps) {
  const [filters, setFilters] = useState<FilterState>({
    positions: [],
    schools: [],
    yearStart: null,
    yearEnd: null,
    league: '',
    minGames: null,
  });

  // Filter data based on advanced filters
  const filteredData = useMemo(() => {
    let result = data;

    // Position filter (if applicable)
    if (filters.positions.length > 0 && positions.length > 0) {
      result = result.filter(row => {
        const pos = row.position as string;
        return pos && filters.positions.includes(pos);
      });
    }

    // School filter
    if (filters.schools.length > 0) {
      result = result.filter(row => filters.schools.includes(row.schoolName));
    }

    // Year range filter
    if (filters.yearStart !== null || filters.yearEnd !== null) {
      result = result.filter(row => {
        const seasonLabel = row.seasonLabel as string;
        if (!seasonLabel || seasonLabel === '—') return true;

        // Extract year from season label (e.g., "2023-24" -> 2023)
        const yearMatch = seasonLabel.match(/(\d{4})/);
        if (!yearMatch) return true;

        const year = parseInt(yearMatch[1]);
        const startOk = filters.yearStart === null || year >= filters.yearStart;
        const endOk = filters.yearEnd === null || year <= filters.yearEnd;
        return startOk && endOk;
      });
    }

    // League filter
    if (filters.league) {
      result = result.filter(row => {
        const league = row.league as string;
        return league && league === filters.league;
      });
    }

    // Minimum games filter
    if (filters.minGames !== null && filters.minGames > 0) {
      result = result.filter(row => {
        const gamesPlayed = row.games_played as number;
        const minGames = filters.minGames as number;
        return gamesPlayed && gamesPlayed >= minGames;
      });
    }

    return result;
  }, [data, filters, positions]);

  const columns: SortableColumn[] = [
    {
      key: 'rank',
      label: '#',
      align: 'center',
      sortable: false,
      render: (value: unknown, row: Record<string, any>) =>
        totalPlayers ? (
          <PercentileBadge rank={row.rank} totalPlayers={totalPlayers} />
        ) : (
          <span>#{row.rank}</span>
        ),
    },
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
      hideOnMobile: false,
    },
  ];

  // Add stat columns with visual hierarchy based on primaryStatKey
  for (const col of statColumns) {
    const definition = STAT_DEFINITIONS[col.label];
    const isPrimary = primaryStatKey === col.key;

    columns.push({
      key: col.key,
      label: definition ? (
        <StatTooltip abbr={col.label} definition={definition} />
      ) : (
        col.label
      ),
      align: 'right',
      sortable: true,
      hideOnMobile: false,
      render: (value: unknown, row: Record<string, any>) => {
        const isTop3 = row.rank <= 3;
        const displayValue = String(value ?? '—');

        // Primary stat styling: bold, larger, and gold color for top 3
        if (isPrimary) {
          return (
            <span
              className="font-bold"
              style={{
                fontSize: isTop3 ? '0.95rem' : '0.875rem',
                color: isTop3 ? 'var(--psp-gold)' : 'inherit',
              }}
            >
              {displayValue}
            </span>
          );
        }

        // Secondary stats: smaller, gray color
        return (
          <span
            className="text-xs"
            style={{ color: 'var(--psp-gray-500)' }}
          >
            {displayValue}
          </span>
        );
      },
    } as SortableColumn);
  }

  return (
    <div>
      {/* Advanced Filter Panel */}
      <AdvancedFilterPanel
        sport={sport}
        positions={positions}
        schools={schools}
        leagues={leagues}
        onFilter={setFilters}
      />

      <SortableTable
        columns={columns}
        data={filteredData}
        highlightTop3={highlightTop3}
        mobileCardMode={mobileCardMode}
        emptyMessage={emptyMessage}
        ariaLabel={ariaLabel}
      />
    </div>
  );
}
