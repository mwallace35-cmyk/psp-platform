import Link from 'next/link';
import { SPORT_META, type SportId } from '@/lib/sports';

export interface ProAlumnus {
  name: string;
  team: string;
  school: string;
  sport: SportId;
  isHOF?: boolean;
}

export interface ProAlumniSectionProps {
  alumni: ProAlumnus[];
}

function AlumniCard({ alumnus }: { alumnus: ProAlumnus }) {
  const sportMeta = SPORT_META[alumnus.sport] || SPORT_META.football;

  return (
    <div className="flex flex-col items-center gap-3 p-4 sm:p-5 bg-[var(--psp-gray-50)] [data-theme=dark]:bg-[var(--psp-navy-light)] rounded-lg border border-[var(--psp-gray-200)] [data-theme=dark]:border-[var(--psp-navy)] hover:shadow-md transition-shadow group">
      {/* Sport emoji and achievement badge */}
      <div className="relative">
        <div className="text-4xl sm:text-5xl">{sportMeta.emoji}</div>
        {alumnus.isHOF && (
          <div
            className="absolute -top-2 -right-2 text-lg sm:text-xl"
            title="Hall of Fame"
          >
            👑
          </div>
        )}
      </div>

      {/* Name */}
      <div className="text-center">
        <h4 className="text-sm sm:text-base font-bold text-[var(--psp-navy)] [data-theme=dark]:text-white line-clamp-2 group-hover:text-[var(--psp-blue)] [data-theme=dark]:group-hover:text-[var(--psp-gold)] transition-colors">
          {alumnus.name}
        </h4>
      </div>

      {/* Professional team */}
      <div className="text-xs sm:text-sm font-semibold text-[var(--psp-gold)] text-center line-clamp-1">
        {alumnus.team}
      </div>

      {/* High school */}
      <div className="text-xs text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-400)] text-center line-clamp-1">
        {alumnus.school}
      </div>
    </div>
  );
}

export default function ProAlumniSection({ alumni }: ProAlumniSectionProps) {
  if (!alumni || alumni.length === 0) {
    return null;
  }

  const displayAlumni = alumni.slice(0, 12);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-[var(--psp-gray-50)] [data-theme=dark]:bg-[var(--psp-navy)]/40">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--psp-navy)] [data-theme=dark]:text-white font-bebas tracking-wide mb-3 sm:mb-4">
            Philly&apos;s Pro Athletes
          </h2>
          <p className="text-base sm:text-lg text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-300)] max-w-2xl">
            Track Philadelphia&apos;s next-level athletes competing at the highest levels of college and professional sports across all disciplines
          </p>
        </div>

        {/* Alumni grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-10 sm:mb-12 lg:mb-16">
          {displayAlumni.map((alumnus, idx) => (
            <AlumniCard key={`${alumnus.name}-${alumnus.team}-${idx}`} alumnus={alumnus} />
          ))}
        </div>

        {/* Call to action cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {/* Search alumni */}
          <Link
            href="/search?type=alumni"
            className="group p-6 sm:p-8 bg-white [data-theme=dark]:bg-[var(--psp-navy-light)] rounded-lg border border-[var(--psp-gray-200)] [data-theme=dark]:border-[var(--psp-navy)] hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl sm:text-4xl mb-3">🔍</div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--psp-navy)] [data-theme=dark]:text-white mb-2 group-hover:text-[var(--psp-blue)] [data-theme=dark]:group-hover:text-[var(--psp-gold)] transition-colors">
              View All Alumni
            </h3>
            <p className="text-sm sm:text-base text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-300)]">
              Browse the complete database of 300+ pro athletes from Philly high schools
            </p>
          </Link>

          {/* Filter by sport */}
          <Link
            href="/football/leaderboards/pro-athletes"
            className="group p-6 sm:p-8 bg-white [data-theme=dark]:bg-[var(--psp-navy-light)] rounded-lg border border-[var(--psp-gray-200)] [data-theme=dark]:border-[var(--psp-navy)] hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl sm:text-4xl mb-3">🎯</div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--psp-navy)] [data-theme=dark]:text-white mb-2 group-hover:text-[var(--psp-blue)] [data-theme=dark]:group-hover:text-[var(--psp-gold)] transition-colors">
              By Sport
            </h3>
            <p className="text-sm sm:text-base text-[var(--psp-gray-600)] [data-theme=dark]:text-[var(--psp-gray-300)]">
              Explore pro athlete pipelines from Philadelphia schools by sport
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
