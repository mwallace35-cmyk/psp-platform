'use client';

import type { RankingRow } from '../RankingsClient';

interface WeekComparisonProps {
  currentWeek: RankingRow[];
  previousWeek: RankingRow[];
}

interface Movement {
  name: string;
  from: number;
  to: number;
  magnitude: number;
}

export default function WeekComparison({ currentWeek, previousWeek }: WeekComparisonProps) {
  if (currentWeek.length === 0 || previousWeek.length === 0) return null;

  const currentWeekLabel = currentWeek[0]?.week_label || '';
  const previousWeekLabel = previousWeek[0]?.week_label || '';

  // Build lookup maps by school name
  const currentMap = new Map<string, RankingRow>();
  currentWeek.forEach(r => {
    const name = r.schools?.name || 'Unknown';
    currentMap.set(name, r);
  });

  const previousMap = new Map<string, RankingRow>();
  previousWeek.forEach(r => {
    const name = r.schools?.name || 'Unknown';
    previousMap.set(name, r);
  });

  // Compute diffs
  const risers: Movement[] = [];
  const fallers: Movement[] = [];
  const newEntries: { name: string; rank: number }[] = [];
  const droppedOut: { name: string; previousRank: number }[] = [];

  currentMap.forEach((row, name) => {
    const prev = previousMap.get(name);
    if (prev) {
      const diff = prev.rank_position - row.rank_position;
      if (diff > 0) {
        risers.push({ name, from: prev.rank_position, to: row.rank_position, magnitude: diff });
      } else if (diff < 0) {
        fallers.push({ name, from: prev.rank_position, to: row.rank_position, magnitude: Math.abs(diff) });
      }
    } else {
      newEntries.push({ name, rank: row.rank_position });
    }
  });

  previousMap.forEach((row, name) => {
    if (!currentMap.has(name)) {
      droppedOut.push({ name, previousRank: row.rank_position });
    }
  });

  // Sort by magnitude (biggest first)
  risers.sort((a, b) => b.magnitude - a.magnitude);
  fallers.sort((a, b) => b.magnitude - a.magnitude);
  newEntries.sort((a, b) => a.rank - b.rank);
  droppedOut.sort((a, b) => a.previousRank - b.previousRank);

  const hasChanges = risers.length > 0 || fallers.length > 0 || newEntries.length > 0 || droppedOut.length > 0;

  return (
    <div className="w-full">
      {/* Header */}
      <h3 className="text-sm font-bold text-[#f0a500] uppercase tracking-wide mb-3">
        What Changed: {previousWeekLabel} &rarr; {currentWeekLabel}
      </h3>

      {!hasChanges ? (
        <p className="text-sm text-gray-400 italic">No movement this week</p>
      ) : (
        <div className="space-y-2">
          {/* Risers */}
          {risers.map(r => (
            <div
              key={`rise-${r.name}`}
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-green-50 border-l-3 border-green-500"
            >
              <span className="text-green-600 text-sm font-bold flex-shrink-0">&#9650;</span>
              <span className="text-sm font-semibold text-gray-800 flex-1 min-w-0 truncate">{r.name}</span>
              <span className="text-sm font-bold text-green-600 flex-shrink-0">
                #{r.from} &rarr; #{r.to} (+{r.magnitude})
              </span>
            </div>
          ))}

          {/* Fallers */}
          {fallers.map(r => (
            <div
              key={`fall-${r.name}`}
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-red-50 border-l-3 border-red-500"
            >
              <span className="text-red-500 text-sm font-bold flex-shrink-0">&#9660;</span>
              <span className="text-sm font-semibold text-gray-800 flex-1 min-w-0 truncate">{r.name}</span>
              <span className="text-sm font-bold text-red-500 flex-shrink-0">
                #{r.from} &rarr; #{r.to} (-{r.magnitude})
              </span>
            </div>
          ))}

          {/* New entries */}
          {newEntries.map(r => (
            <div
              key={`new-${r.name}`}
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-blue-50 border-l-3 border-blue-500"
            >
              <span className="text-blue-500 text-sm font-bold flex-shrink-0">&#9733;</span>
              <span className="text-sm font-semibold text-gray-800 flex-1 min-w-0 truncate">{r.name}</span>
              <span className="text-sm font-bold text-blue-500 flex-shrink-0">NEW at #{r.rank}</span>
            </div>
          ))}

          {/* Dropped out */}
          {droppedOut.map(r => (
            <div
              key={`drop-${r.name}`}
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-gray-50 border-l-3 border-gray-400"
            >
              <span className="text-gray-400 text-sm font-bold flex-shrink-0">&#10005;</span>
              <span className="text-sm font-semibold text-gray-500 flex-1 min-w-0 truncate">{r.name}</span>
              <span className="text-sm font-bold text-gray-400 flex-shrink-0">Dropped from #{r.previousRank}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
