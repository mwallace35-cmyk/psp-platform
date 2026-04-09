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
  // Passing
  passCompletions: number | null;
  passAttempts: number | null;
  passYards: number | null;
  passTd: number | null;
  passInt: number | null;
  // Rushing
  rushCarries: number | null;
  rushYards: number | null;
  rushTd: number | null;
  // Receiving
  recCatches: number | null;
  recYards: number | null;
  recTd: number | null;
  // Scoring / basketball
  points: number | null;
  bbPoints: number | null;
  sourceType: string | null;
}

// Exported utilities (also used by GameLogAccordion)
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'N/A';
  }
}

export function didPlayerWin(game: MergedGameEntry, playerSchoolId: number | null): boolean | null {
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

export function getOpponent(game: MergedGameEntry, playerSchoolId: number | null) {
  const isHome = game.homeSchoolId === playerSchoolId;
  const opponent = isHome ? game.awaySchool : game.homeSchool;
  return opponent;
}

// Helper: does any box-scored game in the set have a non-null value for this key?
function anyHas(games: MergedGameEntry[], key: keyof MergedGameEntry): boolean {
  return games.some((g) => g.hasBoxScore && g[key] != null && (g[key] as number) !== 0);
}

// Short display for completions / attempts
function cmpAtt(c: number | null, a: number | null): string {
  if (c == null && a == null) return '—';
  if (c != null && a != null) return `${c}/${a}`;
  if (c != null) return String(c);
  return String(a);
}

function cellNum(v: number | null): string {
  return v == null ? '—' : v.toLocaleString();
}

// Sum a numeric field across box-scored games only
function sumField(games: MergedGameEntry[], key: keyof MergedGameEntry): number | null {
  let total = 0;
  let any = false;
  for (const g of games) {
    if (!g.hasBoxScore) continue;
    const v = g[key] as number | null | undefined;
    if (typeof v === 'number') {
      total += v;
      any = true;
    }
  }
  return any ? total : null;
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
  // Only show each column group if at least one game in the season has that stat
  const showPass = anyHas(games, 'passYards') || anyHas(games, 'passCompletions') || anyHas(games, 'passTd');
  const showRush = anyHas(games, 'rushYards') || anyHas(games, 'rushCarries') || anyHas(games, 'rushTd');
  const showRec  = anyHas(games, 'recYards') || anyHas(games, 'recCatches') || anyHas(games, 'recTd');

  const passCols = showPass ? 4 : 0; // C/ATT, YDS, TD, INT
  const rushCols = showRush ? 3 : 0; // CAR, YDS, TD
  const recCols  = showRec ? 3 : 0;  // REC, YDS, TD

  const headerCellStyle = { color: 'var(--psp-text-cream)' } as const;
  const groupHeaderStyle = { color: 'var(--psp-text-cream-muted)' } as const;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs" aria-label="Football game log">
        <caption className="sr-only">Football game log</caption>
        <thead>
          {/* Group header row (PASSING / RUSHING / RECEIVING) */}
          <tr className="border-b border-[var(--psp-rule)]">
            <th colSpan={3} className="px-3 py-2" />
            {showPass && (
              <th colSpan={passCols} scope="colgroup" className="text-center px-2 py-1 font-bebas tracking-widest text-[10px] uppercase border-l border-[var(--psp-rule)]" style={groupHeaderStyle}>
                Passing
              </th>
            )}
            {showRush && (
              <th colSpan={rushCols} scope="colgroup" className="text-center px-2 py-1 font-bebas tracking-widest text-[10px] uppercase border-l border-[var(--psp-rule)]" style={groupHeaderStyle}>
                Rushing
              </th>
            )}
            {showRec && (
              <th colSpan={recCols} scope="colgroup" className="text-center px-2 py-1 font-bebas tracking-widest text-[10px] uppercase border-l border-[var(--psp-rule)]" style={groupHeaderStyle}>
                Receiving
              </th>
            )}
          </tr>
          <tr className="border-b border-[var(--psp-rule-strong)]">
            <th scope="col" className="text-left px-3 py-2 font-bebas tracking-wider" style={headerCellStyle}>Date</th>
            <th scope="col" className="text-left px-3 py-2 font-bebas tracking-wider" style={headerCellStyle}>Opponent</th>
            <th scope="col" className="text-center px-3 py-2 font-bebas tracking-wider" style={headerCellStyle}>Result</th>
            {showPass && (
              <>
                <th scope="col" className="text-right px-2 py-2 font-bebas tracking-wider border-l border-[var(--psp-rule)]" style={headerCellStyle}>C/ATT</th>
                <th scope="col" className="text-right px-2 py-2 font-bebas tracking-wider" style={headerCellStyle}>YDS</th>
                <th scope="col" className="text-right px-2 py-2 font-bebas tracking-wider" style={headerCellStyle}>TD</th>
                <th scope="col" className="text-right px-2 py-2 font-bebas tracking-wider" style={headerCellStyle}>INT</th>
              </>
            )}
            {showRush && (
              <>
                <th scope="col" className="text-right px-2 py-2 font-bebas tracking-wider border-l border-[var(--psp-rule)]" style={headerCellStyle}>CAR</th>
                <th scope="col" className="text-right px-2 py-2 font-bebas tracking-wider" style={headerCellStyle}>YDS</th>
                <th scope="col" className="text-right px-2 py-2 font-bebas tracking-wider" style={headerCellStyle}>TD</th>
              </>
            )}
            {showRec && (
              <>
                <th scope="col" className="text-right px-2 py-2 font-bebas tracking-wider border-l border-[var(--psp-rule)]" style={headerCellStyle}>REC</th>
                <th scope="col" className="text-right px-2 py-2 font-bebas tracking-wider" style={headerCellStyle}>YDS</th>
                <th scope="col" className="text-right px-2 py-2 font-bebas tracking-wider" style={headerCellStyle}>TD</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {games.map((game) => {
            const opponent = getOpponent(game, playerSchoolId);
            const won = didPlayerWin(game, playerSchoolId);
            const isHome = game.homeSchoolId === playerSchoolId;
            const prefix = isHome ? 'vs' : '@';
            const teamScore = isHome ? game.homeScore : game.awayScore;
            const oppScore = isHome ? game.awayScore : game.homeScore;
            const scoreStr = teamScore != null && oppScore != null ? `${teamScore}-${oppScore}` : '—';

            return (
              <tr
                key={game.gameId}
                className={`border-b border-[var(--psp-rule)] hover:bg-white/5 ${!game.hasBoxScore ? 'opacity-60' : ''}`}
              >
                <td className="px-3 py-2.5 whitespace-nowrap" style={{ color: 'var(--psp-text-cream-muted)' }}>{formatDate(game.gameDate)}</td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  {opponent ? (
                    <Link
                      href={`/${sport}/schools/${opponent.slug}`}
                      className="hover:underline font-medium"
                      style={{ color: 'var(--psp-text-cream)' }}
                    >
                      <span style={{ color: 'var(--psp-text-cream-muted)' }}>{prefix} </span>
                      {opponent.name}
                    </Link>
                  ) : (
                    <span style={{ color: 'var(--psp-text-cream-muted)' }}>Unknown</span>
                  )}
                </td>
                <td className="text-center px-3 py-2.5 whitespace-nowrap">
                  {won !== null ? (
                    <Link
                      href={`/${sport}/games/${game.gameId}`}
                      className="font-bold hover:underline"
                      style={{ color: won ? '#22c55e' : '#ef4444' }}
                    >
                      {won ? 'W' : 'L'} {scoreStr}
                    </Link>
                  ) : (
                    <Link href={`/${sport}/games/${game.gameId}`} className="hover:underline" style={{ color: 'var(--psp-text-cream-muted)' }}>
                      {scoreStr}
                    </Link>
                  )}
                </td>
                {showPass && (
                  <>
                    <td className="text-right px-2 py-2.5 tabular-nums border-l border-[var(--psp-rule)]" style={{ color: 'var(--psp-text-cream)' }}>
                      {game.hasBoxScore ? cmpAtt(game.passCompletions, game.passAttempts) : '—'}
                    </td>
                    <td className="text-right px-2 py-2.5 tabular-nums" style={{ color: 'var(--psp-text-cream)' }}>
                      {game.hasBoxScore ? cellNum(game.passYards) : '—'}
                    </td>
                    <td className="text-right px-2 py-2.5 tabular-nums" style={{ color: 'var(--psp-text-cream)' }}>
                      {game.hasBoxScore ? cellNum(game.passTd) : '—'}
                    </td>
                    <td className="text-right px-2 py-2.5 tabular-nums" style={{ color: 'var(--psp-text-cream)' }}>
                      {game.hasBoxScore ? cellNum(game.passInt) : '—'}
                    </td>
                  </>
                )}
                {showRush && (
                  <>
                    <td className="text-right px-2 py-2.5 tabular-nums border-l border-[var(--psp-rule)]" style={{ color: 'var(--psp-text-cream)' }}>
                      {game.hasBoxScore ? cellNum(game.rushCarries) : '—'}
                    </td>
                    <td className="text-right px-2 py-2.5 tabular-nums" style={{ color: 'var(--psp-text-cream)' }}>
                      {game.hasBoxScore ? cellNum(game.rushYards) : '—'}
                    </td>
                    <td className="text-right px-2 py-2.5 tabular-nums" style={{ color: 'var(--psp-text-cream)' }}>
                      {game.hasBoxScore ? cellNum(game.rushTd) : '—'}
                    </td>
                  </>
                )}
                {showRec && (
                  <>
                    <td className="text-right px-2 py-2.5 tabular-nums border-l border-[var(--psp-rule)]" style={{ color: 'var(--psp-text-cream)' }}>
                      {game.hasBoxScore ? cellNum(game.recCatches) : '—'}
                    </td>
                    <td className="text-right px-2 py-2.5 tabular-nums" style={{ color: 'var(--psp-text-cream)' }}>
                      {game.hasBoxScore ? cellNum(game.recYards) : '—'}
                    </td>
                    <td className="text-right px-2 py-2.5 tabular-nums" style={{ color: 'var(--psp-text-cream)' }}>
                      {game.hasBoxScore ? cellNum(game.recTd) : '—'}
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-[var(--psp-gold)]" style={{ background: 'var(--psp-ink-deep)' }}>
            <td colSpan={3} className="px-3 py-3 font-bebas tracking-wider uppercase" style={{ color: 'var(--psp-gold)' }}>
              Season Totals
            </td>
            {showPass && (
              <>
                <td className="text-right px-2 py-3 tabular-nums font-bold border-l border-[var(--psp-rule)]" style={{ color: 'var(--psp-gold)' }}>
                  {(() => {
                    const c = sumField(games, 'passCompletions');
                    const a = sumField(games, 'passAttempts');
                    return c == null && a == null ? '—' : `${c ?? '—'}/${a ?? '—'}`;
                  })()}
                </td>
                <td className="text-right px-2 py-3 tabular-nums font-bold" style={{ color: 'var(--psp-gold)' }}>{cellNum(sumField(games, 'passYards'))}</td>
                <td className="text-right px-2 py-3 tabular-nums font-bold" style={{ color: 'var(--psp-gold)' }}>{cellNum(sumField(games, 'passTd'))}</td>
                <td className="text-right px-2 py-3 tabular-nums font-bold" style={{ color: 'var(--psp-gold)' }}>{cellNum(sumField(games, 'passInt'))}</td>
              </>
            )}
            {showRush && (
              <>
                <td className="text-right px-2 py-3 tabular-nums font-bold border-l border-[var(--psp-rule)]" style={{ color: 'var(--psp-gold)' }}>{cellNum(sumField(games, 'rushCarries'))}</td>
                <td className="text-right px-2 py-3 tabular-nums font-bold" style={{ color: 'var(--psp-gold)' }}>{cellNum(sumField(games, 'rushYards'))}</td>
                <td className="text-right px-2 py-3 tabular-nums font-bold" style={{ color: 'var(--psp-gold)' }}>{cellNum(sumField(games, 'rushTd'))}</td>
              </>
            )}
            {showRec && (
              <>
                <td className="text-right px-2 py-3 tabular-nums font-bold border-l border-[var(--psp-rule)]" style={{ color: 'var(--psp-gold)' }}>{cellNum(sumField(games, 'recCatches'))}</td>
                <td className="text-right px-2 py-3 tabular-nums font-bold" style={{ color: 'var(--psp-gold)' }}>{cellNum(sumField(games, 'recYards'))}</td>
                <td className="text-right px-2 py-3 tabular-nums font-bold" style={{ color: 'var(--psp-gold)' }}>{cellNum(sumField(games, 'recTd'))}</td>
              </>
            )}
          </tr>
        </tfoot>
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
      <table className="data-table w-full text-sm" aria-label="Basketball game log">
        <caption className="sr-only">Basketball game log</caption>
        <thead>
          <tr className="border-b border-gray-300">
            <th scope="col" className="text-left px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Date
            </th>
            <th scope="col" className="text-left px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Opponent
            </th>
            <th scope="col" className="text-center px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              Score
            </th>
            <th scope="col" className="text-right px-3 py-2 font-bebas tracking-wider" style={{ color: 'var(--psp-navy)' }}>
              PTS
            </th>
            <th scope="col" className="hidden sm:table-cell text-center px-3 py-2" />
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
                className={`border-b border-gray-200 hover:bg-gray-50 ${!game.hasBoxScore ? 'opacity-75' : ''}`}
              >
                <td className="px-3 py-3 text-xs text-gray-400">{formatDate(game.gameDate)}</td>
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
                  {game.hasBoxScore ? (game.bbPoints ?? '—') : <span className="text-gray-300 font-normal italic text-xs">—</span>}
                </td>
                <td className="hidden sm:table-cell text-center px-3 py-3">
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
        <tfoot>
          {(() => {
            const boxGames = games.filter(g => g.hasBoxScore);
            const totalPts = sumField(games, 'bbPoints');
            const ppg = totalPts != null && boxGames.length > 0 ? (totalPts / boxGames.length).toFixed(1) : '—';
            return (
              <tr className="border-t-2 border-[var(--psp-navy)]" style={{ background: 'var(--psp-ink-deep)' }}>
                <td colSpan={3} className="px-3 py-3 font-bebas tracking-wider uppercase" style={{ color: 'var(--psp-gold)' }}>
                  Season Totals <span className="text-xs font-normal ml-2 opacity-70">({boxGames.length} games · {ppg} PPG)</span>
                </td>
                <td className="text-right px-3 py-3 font-bold tabular-nums" style={{ color: 'var(--psp-gold)' }}>
                  {cellNum(totalPts)}
                </td>
                <td className="hidden sm:table-cell" />
              </tr>
            );
          })()}
        </tfoot>
      </table>
    </div>
  );
}
