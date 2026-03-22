import Link from 'next/link';

interface SportNavigationGridProps {
  sports: Array<{
    id: string;
    name: string;
    slug: string;
    playerCount: number;
  }>;
}

const SPORT_CONFIG: Record<string, { emoji: string; color: string; bgGlow: string }> = {
  football:       { emoji: '🏈', color: '#16a34a', bgGlow: 'rgba(22,163,74,0.15)' },
  basketball:     { emoji: '🏀', color: '#3b82f6', bgGlow: 'rgba(59,130,246,0.15)' },
  baseball:       { emoji: '⚾', color: '#ea580c', bgGlow: 'rgba(234,88,12,0.15)' },
  soccer:         { emoji: '⚽', color: '#059669', bgGlow: 'rgba(5,150,105,0.15)' },
  lacrosse:       { emoji: '🥍', color: '#0891b2', bgGlow: 'rgba(8,145,178,0.15)' },
  wrestling:      { emoji: '🤼', color: '#ca8a04', bgGlow: 'rgba(202,138,4,0.15)' },
  'track-field':  { emoji: '🏃', color: '#7c3aed', bgGlow: 'rgba(124,58,237,0.15)' },
};

function ShieldBadge({ sport, config }: { sport: { name: string; slug: string }; config: { emoji: string; color: string; bgGlow: string } }) {
  return (
    <Link href={`/${sport.slug}`} className="group block">
      <div className="relative flex flex-col items-center transition-transform duration-200 group-hover:scale-105">
        {/* Shield / Badge shape */}
        <div
          className="relative w-28 h-32 md:w-32 md:h-36 flex flex-col items-center justify-center transition-all duration-200 group-hover:shadow-lg"
          style={{
            clipPath: 'polygon(50% 0%, 100% 10%, 100% 75%, 50% 100%, 0% 75%, 0% 10%)',
            backgroundColor: config.bgGlow,
            border: `2px solid ${config.color}30`,
          }}
        >
          {/* Inner shield with sport color border */}
          <div
            className="absolute inset-1 flex flex-col items-center justify-center"
            style={{
              clipPath: 'polygon(50% 0%, 100% 10%, 100% 75%, 50% 100%, 0% 75%, 0% 10%)',
              backgroundColor: 'var(--psp-navy, #0a1628)',
              border: `2px solid ${config.color}`,
            }}
          >
            {/* Emoji */}
            <span className="text-3xl md:text-4xl mb-1 drop-shadow-sm transition-transform group-hover:scale-110">
              {config.emoji}
            </span>
            {/* Accent line */}
            <div className="w-8 h-0.5 rounded-full mb-1 transition-all group-hover:w-12" style={{ backgroundColor: config.color }} />
          </div>

          {/* Top accent triangle */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 rounded-b transition-all group-hover:w-10"
            style={{ backgroundColor: config.color }}
          />
        </div>

        {/* Sport name below shield */}
        <span
          className="mt-2 text-sm md:text-base font-black tracking-wider transition-colors"
          style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--text-body, #e5e7eb)' }}
        >
          {sport.name}
        </span>

        {/* Subtle glow on hover */}
        <div
          className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
          style={{ backgroundColor: config.bgGlow }}
        />
      </div>
    </Link>
  );
}

export default function SportNavigationGrid({ sports }: SportNavigationGridProps) {
  // Order: Football, Basketball, Baseball, Soccer on top row; Lacrosse, Track, Wrestling on bottom
  const sportOrder = ['football', 'basketball', 'baseball', 'soccer', 'lacrosse', 'track-field', 'wrestling'];
  const topRowCount = 3; // Football, Basketball, Baseball on first row
  const orderedSports = sportOrder
    .map(slug => sports.find(s => s.slug === slug))
    .filter((s): s is typeof sports[number] => !!s);
  // Add any sports not in the order list
  const remaining = sports.filter(s => !sportOrder.includes(s.slug));
  const allSports = [...orderedSports, ...remaining];

  return (
    <section className="py-12 px-4" style={{ backgroundColor: 'var(--psp-navy, #0a1628)' }}>
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-center text-2xl md:text-3xl mb-10 tracking-widest"
          style={{ fontFamily: "'Bebas Neue', sans-serif", color: 'var(--psp-gold, #f0a500)' }}
        >
          EXPLORE BY SPORT
        </h2>

        {/* Top row: Football, Basketball, Baseball */}
        <div className="flex justify-center gap-6 md:gap-10 mb-6 md:mb-8">
          {allSports.slice(0, topRowCount).map((sport) => {
            const config = SPORT_CONFIG[sport.slug] || { emoji: '🏅', color: '#6b7280', bgGlow: 'rgba(107,114,128,0.15)' };
            return <ShieldBadge key={sport.id} sport={sport} config={config} />;
          })}
        </div>
        {/* Bottom row: Soccer, Lacrosse, Track & Field, Wrestling */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {allSports.slice(topRowCount).map((sport) => {
            const config = SPORT_CONFIG[sport.slug] || { emoji: '🏅', color: '#6b7280', bgGlow: 'rgba(107,114,128,0.15)' };
            return <ShieldBadge key={sport.id} sport={sport} config={config} />;
          })}

        </div>
      </div>
    </section>
  );
}
