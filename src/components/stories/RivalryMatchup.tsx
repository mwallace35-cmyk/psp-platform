import Link from 'next/link';
import { SPORT_META, type SportId } from '@/lib/sports';

export interface SchoolInfo {
  name: string;
  slug: string;
  logo?: string;
}

export interface RivalryMatchupProps {
  school1: SchoolInfo;
  school2: SchoolInfo;
  sport: SportId;
  wins1: number;
  wins2: number;
  championships1: number;
  championships2: number;
  lastGame?: {
    winner: 'team1' | 'team2';
    score1: number;
    score2: number;
    date: string;
  };
}

function ProgressBar({
  value1,
  value2,
  label,
}: {
  value1: number;
  value2: number;
  label: string;
}) {
  const total = value1 + value2;
  const percent1 = total > 0 ? (value1 / total) * 100 : 50;
  const percent2 = total > 0 ? (value2 / total) * 100 : 50;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs sm:text-sm font-semibold">
        <span className="text-[var(--psp-gray-700)] [data-theme=dark]:text-[var(--psp-gray-300)]">
          {label}
        </span>
        <span className="text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)]">
          {value1} - {value2}
        </span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden bg-[var(--psp-gray-200)] [data-theme=dark]:bg-[var(--psp-navy)]">
        <div
          className="bg-[var(--psp-blue)] transition-all"
          style={{ width: `${percent1}%` }}
        />
        <div
          className="bg-[var(--psp-gold)]"
          style={{ width: `${percent2}%` }}
        />
      </div>
    </div>
  );
}

export default function RivalryMatchup({
  school1,
  school2,
  sport,
  wins1,
  wins2,
  championships1,
  championships2,
  lastGame,
}: RivalryMatchupProps) {
  const sportMeta = SPORT_META[sport];
  const seriesLeader = wins1 > wins2 ? 'team1' : wins2 > wins1 ? 'team2' : 'tied';

  return (
    <div className="flex flex-col gap-5 sm:gap-6 p-5 sm:p-6 bg-white [data-theme=dark]:bg-[var(--psp-navy-light)] rounded-lg border border-[var(--psp-gray-200)] [data-theme=dark]:border-[var(--psp-navy)] hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-[var(--psp-gray-100)] [data-theme=dark]:bg-[var(--psp-navy)] rounded-full">
          <span className="text-lg">{sportMeta.emoji}</span>
          <span className="text-xs sm:text-sm font-semibold text-[var(--psp-gray-700)] [data-theme=dark]:text-[var(--psp-gray-300)] uppercase">
            {sportMeta.name} Rivalry
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-[var(--psp-navy)] [data-theme=dark]:text-white">
          {school1.name} vs {school2.name}
        </h3>
      </div>

      {/* Series record and leader */}
      <div className="text-center">
        <div className="text-2xl sm:text-3xl font-bold text-[var(--psp-navy)] [data-theme=dark]:text-white mb-1">
          {wins1}-{wins2}
        </div>
        <div className="text-xs sm:text-sm text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)]">
          {seriesLeader === 'team1'
            ? `${school1.name} leads`
            : seriesLeader === 'team2'
              ? `${school2.name} leads`
              : 'Series tied'}
        </div>
      </div>

      {/* Stats comparison */}
      <div className="space-y-4">
        <ProgressBar
          value1={wins1}
          value2={wins2}
          label="Series Record"
        />
        <ProgressBar
          value1={championships1}
          value2={championships2}
          label="Championships"
        />
      </div>

      {/* Last game result (if available) */}
      {lastGame && (
        <div className="pt-4 sm:pt-5 border-t border-[var(--psp-gray-200)] [data-theme=dark]:border-[var(--psp-navy)]">
          <p className="text-xs font-semibold text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)] uppercase tracking-wider mb-3">
            Most Recent Matchup
          </p>
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 text-center">
              <div
                className={`text-xl sm:text-2xl font-bold ${
                  lastGame.winner === 'team1'
                    ? 'text-[var(--psp-navy)] [data-theme=dark]:text-white'
                    : 'text-[var(--psp-gray-500)] [data-theme=dark]:text-[var(--psp-gray-400)]'
                }`}
              >
                {lastGame.score1}
              </div>
              <div className="text-xs text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)]">
                {school1.name}
              </div>
            </div>
            <div className="text-[var(--psp-gray-400)]">-</div>
            <div className="flex-1 text-center">
              <div
                className={`text-xl sm:text-2xl font-bold ${
                  lastGame.winner === 'team2'
                    ? 'text-[var(--psp-navy)] [data-theme=dark]:text-white'
                    : 'text-[var(--psp-gray-500)] [data-theme=dark]:text-[var(--psp-gray-400)]'
                }`}
              >
                {lastGame.score2}
              </div>
              <div className="text-xs text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)]">
                {school2.name}
              </div>
            </div>
          </div>
          <div className="text-xs text-[var(--psp-gray-500)] [data-theme=dark]:text-[var(--psp-gray-400)] text-center mt-2">
            {new Date(lastGame.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
      )}

      {/* Links to school profiles */}
      <div className="pt-4 sm:pt-5 border-t border-[var(--psp-gray-200)] [data-theme=dark]:border-[var(--psp-navy)] grid grid-cols-2 gap-3">
        <Link
          href={`/${sport}/schools/${school1.slug}`}
          className="flex items-center justify-center gap-1 px-3 py-2 bg-[var(--psp-blue)]/10 text-[var(--psp-blue)] [data-theme=dark]:bg-[var(--psp-blue)]/20 font-semibold text-xs sm:text-sm rounded hover:bg-[var(--psp-blue)]/20 transition-colors"
        >
          {school1.name}
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
        <Link
          href={`/${sport}/schools/${school2.slug}`}
          className="flex items-center justify-center gap-1 px-3 py-2 bg-[var(--psp-gold)]/10 text-[var(--psp-gold)] [data-theme=dark]:bg-[var(--psp-gold)]/20 font-semibold text-xs sm:text-sm rounded hover:bg-[var(--psp-gold)]/20 transition-colors"
        >
          {school2.name}
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
