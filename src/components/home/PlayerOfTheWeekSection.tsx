import Link from 'next/link';
import { SPORT_META, type SportId } from '@/lib/sports';

export interface POTWNominee {
  id: string;
  playerName: string;
  schoolName: string;
  sportId: SportId;
  statLine: string;
  votes: number;
}

export interface PlayerOfTheWeekSectionProps {
  nominees: POTWNominee[];
}

function NomineeCard({ nominee }: { nominee: POTWNominee }) {
  const sportMeta = SPORT_META[nominee.sportId];

  return (
    <div className="flex flex-col gap-4 p-5 sm:p-6 bg-white [data-theme=dark]:bg-[var(--psp-navy-light)] rounded-lg border-2 border-[var(--psp-gold)] [data-theme=dark]:border-[var(--psp-gold)]/60 hover:shadow-lg transition-shadow">
      {/* Header with player info */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--psp-navy)] [data-theme=dark]:text-white">
            {nominee.playerName}
          </h3>
          <p className="text-sm sm:text-base text-[var(--psp-gold)] font-semibold mt-1">
            {nominee.schoolName}
          </p>
          <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-[var(--psp-gray-100)] [data-theme=dark]:bg-[var(--psp-navy)] rounded-full text-xs font-semibold text-[var(--psp-gray-700)] [data-theme=dark]:text-[var(--psp-gray-300)]">
            <span>{sportMeta.emoji}</span>
            <span>{sportMeta.name}</span>
          </span>
        </div>

        {/* Vote count */}
        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-bold text-[var(--psp-gold)]">
            {nominee.votes}
          </div>
          <div className="text-xs sm:text-sm text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)] font-medium">
            {nominee.votes === 1 ? 'vote' : 'votes'}
          </div>
        </div>
      </div>

      {/* Stat line */}
      <div className="p-3 sm:p-4 bg-[var(--psp-gray-50)] [data-theme=dark]:bg-[var(--psp-navy)] rounded-lg border border-[var(--psp-gray-200)] [data-theme=dark]:border-[var(--psp-navy-mid)]">
        <p className="text-sm sm:text-base text-[var(--psp-navy)] [data-theme=dark]:text-[var(--psp-gray-200)] italic">
          {nominee.statLine}
        </p>
      </div>

      {/* Vote button */}
      <Link
        href={`/potw?votee=${nominee.id}`}
        className="w-full px-4 py-2.5 sm:py-3 bg-[var(--psp-gold)] text-[var(--psp-navy)] font-semibold rounded-lg hover:shadow-lg transition-shadow text-center text-sm sm:text-base"
      >
        Vote for {nominee.playerName.split(' ')[0]}
      </Link>
    </div>
  );
}

export default function PlayerOfTheWeekSection({
  nominees,
}: PlayerOfTheWeekSectionProps) {
  if (!nominees || nominees.length === 0) {
    return null;
  }

  const topNominee = nominees[0];
  const otherNominees = nominees.slice(1, 4);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white [data-theme=dark]:bg-[var(--psp-navy)]/40">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--psp-navy)] [data-theme=dark]:text-white font-bebas tracking-wide mb-3 sm:mb-4">
            Player of the Week
          </h2>
          <p className="text-base sm:text-lg text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-300)] max-w-2xl">
            Vote for the best performing student-athlete this week across all Philadelphia high schools
          </p>
        </div>

        {/* Main featured nominee (if available) */}
        {topNominee && (
          <div className="mb-8 sm:mb-10 lg:mb-12 p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-[var(--psp-navy)] to-[var(--psp-navy-light)] [data-theme=dark]:from-[var(--psp-navy)] [data-theme=dark]:to-[var(--psp-navy-light)] rounded-lg border-2 border-[var(--psp-gold)] overflow-hidden relative">
            {/* Decorative background element */}
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, var(--psp-gold) 0%, transparent 70%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div className="mb-2 text-xs sm:text-sm font-semibold uppercase tracking-widest text-[var(--psp-gold)]">
                Leading the votes
              </div>

              <div className="mb-6 sm:mb-8">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-bebas tracking-wide mb-2 sm:mb-4">
                  {topNominee.playerName}
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <p className="text-lg sm:text-xl text-[var(--psp-gold)]">
                    {topNominee.schoolName}
                  </p>
                  <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-sm sm:text-base font-semibold text-white w-fit">
                    <span className="text-lg sm:text-xl">
                      {SPORT_META[topNominee.sportId].emoji}
                    </span>
                    {SPORT_META[topNominee.sportId].name}
                  </span>
                </div>
              </div>

              <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white/10 rounded-lg border border-white/20">
                <p className="text-base sm:text-lg text-white italic">
                  {topNominee.statLine}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                <div>
                  <div className="text-4xl sm:text-5xl font-bold text-[var(--psp-gold)]">
                    {topNominee.votes}
                  </div>
                  <div className="text-sm text-white/70 font-medium">
                    {topNominee.votes === 1 ? 'vote' : 'votes'} so far
                  </div>
                </div>

                <Link
                  href="/potw"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[var(--psp-gold)] text-[var(--psp-navy)] font-bold rounded-lg hover:shadow-lg transition-shadow text-center"
                >
                  Cast Your Vote
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Other nominees grid */}
        {otherNominees.length > 0 && (
          <div className="mb-10 sm:mb-12 lg:mb-16">
            <h3 className="text-lg sm:text-xl font-bold text-[var(--psp-navy)] [data-theme=dark]:text-white mb-6 sm:mb-8">
              Also receiving votes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {otherNominees.map((nominee) => (
                <NomineeCard key={nominee.id} nominee={nominee} />
              ))}
            </div>
          </div>
        )}

        {/* Call to action */}
        <div className="text-center">
          <Link
            href="/potw"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-[var(--psp-navy)] [data-theme=dark]:bg-[var(--psp-gold)] text-white [data-theme=dark]:text-[var(--psp-navy)] font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            View All Nominees
            <svg
              className="w-4 h-4"
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
    </section>
  );
}
