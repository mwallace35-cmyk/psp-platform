import Link from 'next/link';
import { SPORT_META, type SportId } from '@/lib/sports';

export interface DynastyCardProps {
  schoolName: string;
  schoolSlug: string;
  sport: SportId;
  championships: number;
  winPct: number;
  yearsActive: string;
  keyPlayers: string[];
  proAlumni: number;
}

export default function DynastyCard({
  schoolName,
  schoolSlug,
  sport,
  championships,
  winPct,
  yearsActive,
  keyPlayers,
  proAlumni,
}: DynastyCardProps) {
  const sportMeta = SPORT_META[sport];
  const isDominant = championships >= 5;
  const borderColor = isDominant ? 'border-[var(--psp-gold)]' : 'border-[var(--psp-gray-300)]';
  const bgAccent = isDominant ? 'bg-[var(--psp-gold)]/5' : 'bg-[var(--psp-gray-50)]';

  return (
    <Link
      href={`/${sport}/schools/${schoolSlug}`}
      className={`group flex flex-col gap-4 p-5 sm:p-6 rounded-lg border-2 ${borderColor} [data-theme=dark]:border-[var(--psp-gold)]/40 ${bgAccent} [data-theme=dark]:bg-[var(--psp-navy-light)] hover:shadow-lg transition-shadow`}
    >
      {/* Header with school info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{sportMeta.emoji}</span>
            {isDominant && <span className="text-lg">👑</span>}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[var(--psp-navy)] [data-theme=dark]:text-white group-hover:text-[var(--psp-blue)] [data-theme=dark]:group-hover:text-[var(--psp-gold)] transition-colors">
            {schoolName}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)]">
            {yearsActive}
          </p>
        </div>

        {/* Championship count */}
        <div className="text-right">
          <div className="text-3xl sm:text-4xl font-bold text-[var(--psp-gold)]">
            {championships}
          </div>
          <div className="text-xs sm:text-sm text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)] font-medium">
            {championships === 1 ? 'Title' : 'Titles'}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-white [data-theme=dark]:bg-[var(--psp-navy)] rounded border border-[var(--psp-gray-200)] [data-theme=dark]:border-[var(--psp-navy)]">
          <div className="text-2xl font-bold text-[var(--psp-navy)] [data-theme=dark]:text-[var(--psp-gold)]">
            {(winPct * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)]">
            Win %
          </div>
        </div>
        <div className="p-3 bg-white [data-theme=dark]:bg-[var(--psp-navy)] rounded border border-[var(--psp-gray-200)] [data-theme=dark]:border-[var(--psp-navy)]">
          <div className="text-2xl font-bold text-[var(--psp-navy)] [data-theme=dark]:text-[var(--psp-gold)]">
            {proAlumni}
          </div>
          <div className="text-xs text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)]">
            Pro Athletes
          </div>
        </div>
      </div>

      {/* Key players */}
      {keyPlayers.length > 0 && (
        <div className="pt-3 border-t border-[var(--psp-gray-200)] [data-theme=dark]:border-[var(--psp-navy)]">
          <p className="text-xs font-semibold text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)] uppercase tracking-wider mb-2">
            Notable Alumni
          </p>
          <div className="flex flex-wrap gap-2">
            {keyPlayers.slice(0, 2).map((player) => (
              <span
                key={player}
                className="text-xs px-2.5 py-1 bg-[var(--psp-gray-100)] [data-theme=dark]:bg-[var(--psp-navy)] text-[var(--psp-gray-700)] [data-theme=dark]:text-[var(--psp-gray-300)] rounded-full font-semibold"
              >
                {player}
              </span>
            ))}
            {keyPlayers.length > 2 && (
              <span className="text-xs px-2.5 py-1 bg-[var(--psp-gray-100)] [data-theme=dark]:bg-[var(--psp-navy)] text-[var(--psp-gray-700)] [data-theme=dark]:text-[var(--psp-gray-300)] rounded-full font-semibold">
                +{keyPlayers.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* View full history link */}
      <div className="text-sm font-semibold text-[var(--psp-blue)] [data-theme=dark]:text-[var(--psp-gold)] opacity-0 group-hover:opacity-100 transition-opacity">
        View Full History →
      </div>
    </Link>
  );
}
