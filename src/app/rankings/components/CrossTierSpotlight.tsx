'use client';

import Link from 'next/link';

interface SpotlightTeam {
  name: string;
  slug: string;
  rank: number;
  category: string;
  record: string;
}

interface SpotlightGame {
  homeTeam: SpotlightTeam;
  awayTeam: SpotlightTeam;
  gameDate: string;
  venue?: string;
  historicalContext?: string;
}

interface CrossTierSpotlightProps {
  spotlightGames: SpotlightGame[];
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  public: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'PUBLIC' },
  pcl: { bg: 'bg-[var(--psp-gold,#f0a500)]/15', text: 'text-[var(--psp-gold-text)]', label: 'PCL' },
  city: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'CITY' },
  'inter-ac': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'INTER-AC' },
  independent: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'IND' },
};

function getCategoryStyle(category: string) {
  return CATEGORY_STYLES[category.toLowerCase()] || CATEGORY_STYLES.city;
}

function TeamSide({ team, sport }: { team: SpotlightTeam; sport: string }) {
  const style = getCategoryStyle(team.category);

  return (
    <div className="flex-1 text-center space-y-1.5">
      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${style.bg} ${style.text}`}>
        {style.label} #{team.rank}
      </span>
      <Link
        href={`/${sport}/schools/${team.slug}`}
        className="block font-bold text-navy text-sm hover:text-blue-600 transition leading-tight"
      >
        {team.name}
      </Link>
      <p className="text-xs text-gray-400 font-medium">{team.record}</p>
    </div>
  );
}

export default function CrossTierSpotlight({ spotlightGames }: CrossTierSpotlightProps) {
  if (!spotlightGames || spotlightGames.length === 0) return null;

  // Infer sport from first team slug path (fallback to basketball)
  const sport = 'basketball';

  return (
    <div className="rounded-xl border-2 border-[var(--psp-gold,#f0a500)]/20 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 bg-[var(--psp-navy,#0a1628)]">
        <h3 className="text-[var(--psp-gold,#f0a500)] font-bold text-sm tracking-wide uppercase">
          LEAGUE CLASH THIS WEEK
        </h3>
        <p className="text-gray-400 text-xs mt-0.5">Cross-tier games that move the rankings</p>
      </div>

      {/* Matchups */}
      <div className="divide-y divide-gray-100">
        {spotlightGames.map((game, i) => (
          <div key={i} className="p-4">
            {/* Matchup row */}
            <div className="flex items-center gap-2">
              <TeamSide team={game.awayTeam} sport={sport} />

              {/* VS divider */}
              <div className="flex-shrink-0 w-12 text-center">
                <span className="text-lg font-black text-gray-300 tracking-tighter">VS</span>
              </div>

              <TeamSide team={game.homeTeam} sport={sport} />
            </div>

            {/* Game details */}
            <div className="mt-3 text-center space-y-1">
              <p className="text-xs text-gray-500">
                {game.gameDate}
                {game.venue && <span className="text-gray-300"> &middot; </span>}
                {game.venue && <span>{game.venue}</span>}
              </p>
              {game.historicalContext && (
                <p className="text-xs text-gray-400 italic">{game.historicalContext}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
