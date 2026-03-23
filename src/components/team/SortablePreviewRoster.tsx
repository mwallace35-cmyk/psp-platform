'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface RosterPlayer {
  player_id: number;
  player_name: string;
  player_slug: string;
  jersey_number: string | null;
  positions: string | null;
  projected_class: string | null;
  is_senior?: boolean;
}

type SortCol = 'jersey_number' | 'player_name' | 'positions' | 'projected_class';
type SortDir = 'asc' | 'desc';

const CLASS_ORDER: Record<string, number> = { Senior: 4, Junior: 3, Sophomore: 2, Freshman: 1 };

export default function SortablePreviewRoster({
  players,
  sport,
}: {
  players: RosterPlayer[];
  sport: string;
}) {
  const [sortCol, setSortCol] = useState<SortCol>('jersey_number');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const sorted = useMemo(() => {
    return [...players].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortCol) {
        case 'jersey_number': {
          const an = parseInt(a.jersey_number || '999', 10);
          const bn = parseInt(b.jersey_number || '999', 10);
          return (an - bn) * dir;
        }
        case 'player_name':
          return a.player_name.localeCompare(b.player_name) * dir;
        case 'positions':
          return (a.positions || '').localeCompare(b.positions || '') * dir;
        case 'projected_class': {
          const ao = CLASS_ORDER[a.projected_class || ''] || 0;
          const bo = CLASS_ORDER[b.projected_class || ''] || 0;
          return (ao - bo) * dir;
        }
        default:
          return 0;
      }
    });
  }, [players, sortCol, sortDir]);

  function handleSort(col: SortCol) {
    if (sortCol === col) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  }

  function SortHeader({ col, label, align }: { col: SortCol; label: string; align?: string }) {
    const isActive = sortCol === col;
    return (
      <th
        className={`py-3 px-4 font-semibold cursor-pointer select-none hover:text-gray-200 transition ${
          align === 'center' ? 'text-center' : 'text-left'
        } ${isActive ? 'text-gray-200' : 'text-gray-400'}`}
        onClick={() => handleSort(col)}
      >
        {label}
        {isActive && (
          <span className="ml-1 text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>
        )}
      </th>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-200">
        <thead>
          <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
            <SortHeader col="jersey_number" label="#" />
            <SortHeader col="player_name" label="Name" />
            <SortHeader col="positions" label="Position" />
            <SortHeader col="projected_class" label="Class" align="center" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((player) => (
            <tr
              key={player.player_id}
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <td className="py-3 px-4 text-gray-400 font-mono">
                {player.jersey_number || '\u2014'}
              </td>
              <td className="py-3 px-4">
                <Link
                  href={`/${sport}/players/${player.player_slug}`}
                  className="text-blue-400 hover:underline"
                >
                  {player.player_name}
                </Link>
              </td>
              <td className="py-3 px-4 text-gray-300">
                {player.positions || '\u2014'}
              </td>
              <td className="py-3 px-4 text-center">
                {player.projected_class ? (
                  <span
                    className="inline-block px-2 py-0.5 text-xs font-medium rounded"
                    style={{
                      background:
                        player.projected_class === 'Senior'
                          ? 'rgba(240, 165, 0, 0.2)'
                          : player.projected_class === 'Junior'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(16, 185, 129, 0.2)',
                      color:
                        player.projected_class === 'Senior'
                          ? '#f0a500'
                          : player.projected_class === 'Junior'
                          ? '#3b82f6'
                          : '#10b981',
                    }}
                  >
                    {player.projected_class}
                  </span>
                ) : (
                  <span className="text-gray-500">{'\u2014'}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
