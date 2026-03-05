import { SPORT_META } from '@/lib/data';

interface GameHeaderProps {
  game: any;
  sportId: string;
}

export default function GameHeader({ game, sportId }: GameHeaderProps) {
  const meta = SPORT_META[sportId as keyof typeof SPORT_META];
  const homeTeam = game.home_school;
  const awayTeam = game.away_school;

  const homeScore = game.home_score ?? null;
  const awayScore = game.away_score ?? null;

  const gameDate = game.game_date
    ? new Date(game.game_date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date TBD';

  const gameTypeLabel =
    game.game_type === 'playoff'
      ? 'Playoff'
      : game.game_type === 'championship'
        ? 'Championship'
        : game.game_type === 'state'
          ? 'State Tournament'
          : null;

  const periodScores = game.period_scores && Array.isArray(game.period_scores) ? game.period_scores : null;

  return (
    <section
      style={{
        background: `linear-gradient(135deg, ${meta?.color || '#0a1628'} 0%, #0a1628 100%)`,
        padding: '48px 20px',
        color: '#fff',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Date and Type */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              opacity: 0.9,
            }}
          >
            {gameDate}
          </div>
          {gameTypeLabel && (
            <span
              style={{
                background: '#f0a500',
                color: '#0a1628',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {gameTypeLabel}
            </span>
          )}
        </div>

        {/* Main Score Display */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: 32,
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          {/* Away Team */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 12,
                opacity: 0.7,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 8,
              }}
            >
              {meta?.emoji} Visitor
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
              {awayTeam?.name || 'Away Team'}
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 900,
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: 2,
                color: '#f0a500',
                marginBottom: 8,
              }}
            >
              {awayScore !== null ? awayScore : '—'}
            </div>
            {awayTeam?.city && (
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {awayTeam.city}, {awayTeam.state || 'PA'}
              </div>
            )}
          </div>

          {/* Center VS */}
          <div
            style={{
              fontSize: 14,
              opacity: 0.7,
              textTransform: 'uppercase',
              fontWeight: 700,
              letterSpacing: 1,
              minWidth: 40,
              textAlign: 'center',
            }}
          >
            VS
          </div>

          {/* Home Team */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 12,
                opacity: 0.7,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 8,
              }}
            >
              {meta?.emoji} Home
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
              {homeTeam?.name || 'Home Team'}
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 900,
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: 2,
                color: '#f0a500',
                marginBottom: 8,
              }}
            >
              {homeScore !== null ? homeScore : '—'}
            </div>
            {homeTeam?.city && (
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {homeTeam.city}, {homeTeam.state || 'PA'}
              </div>
            )}
          </div>
        </div>

        {/* Period Scores Table (if available) */}
        {periodScores && periodScores.length > 0 && (
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: 16,
              overflowX: 'auto',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 12,
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                    Team
                  </th>
                  {periodScores[0].quarters?.map((q: number, idx: number) => (
                    <th
                      key={idx}
                      style={{
                        paddingBottom: 8,
                        borderBottom: '1px solid rgba(255,255,255,0.2)',
                        textAlign: 'center',
                      }}
                    >
                      Q{idx + 1}
                    </th>
                  ))}
                  <th
                    style={{
                      paddingBottom: 8,
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      textAlign: 'center',
                      fontWeight: 700,
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {periodScores.map((row: any, idx: number) => (
                  <tr key={idx} style={{ opacity: idx === 0 ? 1 : 0.9 }}>
                    <td style={{ paddingTop: 8, paddingBottom: 8, fontWeight: 600 }}>
                      {row.team === 'away' ? awayTeam?.short_name || awayTeam?.name : homeTeam?.short_name || homeTeam?.name}
                    </td>
                    {row.quarters?.map((q: number, qIdx: number) => (
                      <td
                        key={qIdx}
                        style={{
                          paddingTop: 8,
                          paddingBottom: 8,
                          textAlign: 'center',
                        }}
                      >
                        {q}
                      </td>
                    ))}
                    <td
                      style={{
                        paddingTop: 8,
                        paddingBottom: 8,
                        textAlign: 'center',
                        fontWeight: 700,
                      }}
                    >
                      {row.team === 'away' ? awayScore : homeScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mascots */}
        {(awayTeam?.mascot || homeTeam?.mascot) && (
          <div
            style={{
              marginTop: 24,
              display: 'flex',
              justifyContent: 'center',
              gap: 32,
              flexWrap: 'wrap',
              opacity: 0.8,
              fontSize: 12,
            }}
          >
            {awayTeam?.mascot && <span>Visitor: {awayTeam.mascot}</span>}
            {homeTeam?.mascot && <span>Home: {homeTeam.mascot}</span>}
          </div>
        )}
      </div>
    </section>
  );
}
