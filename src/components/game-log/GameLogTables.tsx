import Link from 'next/link';

export interface MergedGameEntry {
  gameId: number;
  gameDate: string | null;
  seasonLabel: string | null;
  homeSchoolId: number | null;
  awaySchoolId: number | null;
  homeScore: number | null;
  awayScore: number | null;
  homeSchool: { id: number; name: string; slug: string } | null;
  awaySchool: { id: number; name: string; slug: string } | null;
  hasBoxScore: boolean;
  rushYards: number | null;
  passYards: number | null;
  recYards: number | null;
  points: number | null;
  bbPoints: number | null;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'N/A';
  }
}

function didPlayerWin(game: MergedGameEntry, playerSchoolId: number | null): boolean | null {
  if (!playerSchoolId || game.homeScore === null || game.awayScore === null) {
    return null;
  }

  if (game.homeSchoolId === playerSchoolId) {
    return game.homeScore > game.awayScore;
  } else if (game.awaySchoolId === playerSchoolId) {
    return game.awayScore > game.homeScore;
  }

  return null;
}

function getOpponent(game: MergedGameEntry, playerSchoolId: number | null) {
  const isHome = game.homeSchoolId === playerSchoolId;
  const opponent = isHome ? game.awaySchool : game.homeSchool;
  return opponent;
}

export function FootballGameTable({
  games,
  playerSchoolId,
  sport,
}: {
  games: MergedGameEntry[];
  playerSchoolId: number | null;
  sport: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table w-full text-sm">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Date
            </th>
            <th className="text-left px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Opponent
            </th>
            <th className="text-center px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Score
            </th>
            <th className="text-right px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Rush Yds
            </th>
            <th className="text-right px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Pass Yds
            </th>
            <th className="text-right px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Rec Yds
            </th>
            <th className="text-right px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              PTS
            </th>
            <th className="text-center px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {games.map((game) => {
            const opponent = getOpponent(game, playerSchoolId);
            const won = didPlayerWin(game, playerSchoolId);
            const scoreColor = won === true ? 'var(--psp-blue)' : won === false ? '#dc2626' : 'var(--psp-gray-500)';

            const isHome = game.homeSchoolId === playerSchoolId;
            const prefix = isHome ? 'vs' : 'at';
            const teamScore = isHome ? game.homeScore : game.awayScore;
            const oppScore = isHome ? game.awayScore : game.homeScore;
            const scoreStr = teamScore != null && oppScore != null ? `${teamScore}-${oppScore}` : '—';

            return (
              <tr
                key={game.gameId}
                className={`border-b border-gray-200 hover:bg-gray-50 ${!game.hasBoxScore ? 'opacity-60' : ''}`}
              >
                <td className="px-3 py-3 text-xs text-gray-500">{formatDate(game.gameDate)}</td>
                <td className="px-3 py-3 text-xs">
                  {opponent ? (
                    <Link
                      href={`/${sport}/schools/${opponent.slug}`}
                      className="hover:underline"
                      style={{ color: 'var(--psp-blue)' }}
                    >
                      {prefix} {opponent.name}
                    </Link>
                  ) : (
                    'Unknown'
                  )}
                </td>
                <td className="text-center px-3 py-3 text-xs whitespace-nowrap">
                  {won !== null ? (
                    <span className={won ? 'font-bold text-green-700' : 'text-red-600'}>
                      {won ? 'W' : 'L'} {scoreStr}
                    </span>
                  ) : scoreStr}
                </td>
                {game.hasBoxScore ? (
                  <>
                    <td className="text-right px-3 py-3">{game.rushYards ?? '—'}</td>
                    <td className="text-right px-3 py-3">{game.passYards ?? '—'}</td>
                    <td className="text-right px-3 py-3">{game.recYards ?? '—'}</td>
                    <td className="text-right px-3 py-3 font-bold">{game.points ?? '—'}</td>
                  </>
                ) : (
                  <td colSpan={4} className="text-center text-xs text-gray-400 italic px-3 py-3">no individual stats</td>
                )}
                <td className="text-center px-3 py-3">
                  {game.hasBoxScore ? (
                    <Link
                      href={`/${sport}/games/${game.gameId}`}
                      className="text-xs px-3 py-1 rounded"
                      style={{ background: 'var(--psp-blue)', color: 'white' }}
                    >
                      Box Score
                    </Link>
                  ) : (
                    <Link
                      href={`/${sport}/games/${game.gameId}`}
                      className="text-xs px-3 py-1 rounded border"
                      style={{ borderColor: 'var(--psp-gray-300)', color: 'var(--psp-gray-500)' }}
                    >
                      Details
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function BasketballGameTable({
  games,
  playerSchoolId,
  sport,
}: {
  games: MergedGameEntry[];
  playerSchoolId: number | null;
  sport: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="data-table w-full text-sm">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="text-left px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Date
            </th>
            <th className="text-left px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Opponent
            </th>
            <th className="text-center px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Score
            </th>
            <th className="text-right px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              PTS
            </th>
            <th className="text-center px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {games.map((game) => {
            const opponent = getOpponent(game, playerSchoolId);
            const won = didPlayerWin(game, playerSchoolId);
            const isHome = game.homeSchoolId === playerSchoolId;
            const prefix = isHome ? 'vs' : 'at';
            const teamScore = isHome ? game.homeScore : game.awayScore;
            const oppScore = isHome ? game.awayScore : game.homeScore;
            const scoreStr = teamScore != null && oppScore != null ? `${teamScore}-${oppScore}` : '—';

            return (
              <tr
                key={game.gameId}
                className={`border-b border-gray-200 hover:bg-gray-50 ${!game.hasBoxScore ? 'opacity-60' : ''}`}
              >
                <td className="px-3 py-3 text-xs text-gray-500">{formatDate(game.gameDate)}</td>
                <td className="px-3 py-3 text-xs">
                  {opponent ? (
                    <Link
                      href={`/${sport}/schools/${opponent.slug}`}
                      className="hover:underline"
                      style={{ color: 'var(--psp-blue)' }}
                    >
                      {prefix} {opponent.name}
                    </Link>
                  ) : (
                    'Unknown'
                  )}
                </td>
                <td className="text-center px-3 py-3 text-xs whitespace-nowrap">
                  {won !== null ? (
                    <span className={won ? 'font-bold text-green-700' : 'text-red-600'}>
                      {won ? 'W' : 'L'} {scoreStr}
                    </span>
                  ) : scoreStr}
                </td>
                <td className="text-right px-3 py-3 font-bold">
                  {game.hasBoxScore ? (game.bbPoints ?? '—') : <span className="text-gray-400 font-normal italic text-xs">—</span>}
                </td>
                <td className="text-center px-3 py-3">
                  {game.hasBoxScore ? (
                    <Link
                      href={`/${sport}/games/${game.gameId}`}
                      className="text-xs px-3 py-1 rounded"
                      style={{ background: 'var(--psp-blue)', color: 'white' }}
                    >
                      Box Score
                    </Link>
                  ) : (
                    <Link
                      href={`/${sport}/games/${game.gameId}`}
                      className="text-xs px-3 py-1 rounded border"
                      style={{ borderColor: 'var(--psp-gray-300)', color: 'var(--psp-gray-500)' }}
                    >
                      Details
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
