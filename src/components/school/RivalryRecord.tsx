'use client';

import Link from 'next/link';
import WinLossBar from '@/components/ui/WinLossBar';

export interface RivalryData {
  opponentName: string;
  opponentSlug: string;
  wins: number;
  losses: number;
  ties: number;
  totalGames: number;
  lastResult?: {
    date: string;
    homeScore: number;
    awayScore: number;
    isHome: boolean;
  };
}

interface RivalryRecordProps {
  rivalries: RivalryData[];
  sport: string;
  schoolName: string;
}

export default function RivalryRecord({ rivalries, sport, schoolName }: RivalryRecordProps) {
  if (!rivalries || rivalries.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--psp-gray-200)] p-6 bg-gray-50">
        <p className="text-sm text-gray-400 text-center">No rivalry data available yet.</p>
      </div>
    );
  }

  const winPercentage = (r: RivalryData) => {
    const total = r.wins + r.losses + r.ties;
    return total > 0 ? ((r.wins / total) * 100).toFixed(1) : '—';
  };

  const formatLastResult = (result: RivalryData['lastResult']) => {
    if (!result) return '—';
    const year = new Date(result.date).getFullYear();
    const score = result.isHome
      ? `${result.homeScore}-${result.awayScore}`
      : `${result.awayScore}-${result.homeScore}`;
    const resultChar = result.isHome
      ? result.homeScore > result.awayScore
        ? 'W'
        : 'L'
      : result.awayScore > result.homeScore
        ? 'W'
        : 'L';
    return `${resultChar} ${score} (${year})`;
  };

  return (
    <div className="space-y-3">
      {rivalries.map((rivalry) => (
        <div
          key={rivalry.opponentSlug}
          className="rounded-lg border border-[var(--psp-gray-200)] p-4 bg-white hover:shadow-md transition-shadow"
        >
          {/* Header row: opponent name + record */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <Link
                href={`/${sport}/schools/${rivalry.opponentSlug}`}
                className="font-semibold text-sm hover:underline"
                style={{ color: 'var(--psp-blue, #3b82f6)' }}
              >
                {rivalry.opponentName}
              </Link>
              <p className="text-xs" style={{ color: 'var(--psp-gray-500)' }}>
                {rivalry.totalGames} game{rivalry.totalGames !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-sm" style={{ color: 'var(--psp-navy)' }}>
                {rivalry.wins}-{rivalry.losses}{rivalry.ties > 0 ? `-${rivalry.ties}` : ''}
              </div>
              <p className="text-xs" style={{ color: 'var(--psp-gray-500)' }}>
                {winPercentage(rivalry)}% W
              </p>
            </div>
          </div>

          {/* Win-loss bar */}
          <div className="mb-3">
            <WinLossBar wins={rivalry.wins} losses={rivalry.losses} ties={rivalry.ties} height={6} showLabel={false} />
          </div>

          {/* Last result */}
          <div className="text-xs" style={{ color: 'var(--psp-gray-500)' }}>
            <span>Last: </span>
            <span className="font-medium">{formatLastResult(rivalry.lastResult)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
