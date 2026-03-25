/**
 * Dynamic OG image for Game/Matchup Cards
 *
 * Query params:
 * - home (required): Home team name
 * - away (required): Away team name
 * - homeScore (optional): Home score
 * - awayScore (optional): Away score
 * - sport (optional): Sport ID for color/emoji
 * - date (optional): Game date display string
 */

import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

const SPORT_EMOJI: Record<string, string> = {
  football: '🏈', basketball: '🏀', baseball: '⚾', soccer: '⚽',
  lacrosse: '🥍', 'track-field': '🏃', wrestling: '🤼',
};

const SPORT_COLORS: Record<string, { accent: string; glow: string }> = {
  football:      { accent: '#16a34a', glow: '#22c55e' },
  basketball:    { accent: '#3b82f6', glow: '#60a5fa' },
  baseball:      { accent: '#dc2626', glow: '#ef4444' },
  soccer:        { accent: '#059669', glow: '#10b981' },
  lacrosse:      { accent: '#0891b2', glow: '#06b6d4' },
  'track-field': { accent: '#7c3aed', glow: '#a78bfa' },
  wrestling:     { accent: '#ca8a04', glow: '#eab308' },
};

const DEFAULT_SPORT = { accent: '#3b82f6', glow: '#60a5fa' };

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const home = searchParams.get('home') || 'Home';
    const away = searchParams.get('away') || 'Away';
    const homeScore = searchParams.get('homeScore') || '';
    const awayScore = searchParams.get('awayScore') || '';
    const sport = searchParams.get('sport') || '';
    const date = searchParams.get('date') || '';

    const emoji = SPORT_EMOJI[sport] || '🏅';
    const colors = SPORT_COLORS[sport] || DEFAULT_SPORT;

    const hasScores = homeScore !== '' && awayScore !== '';
    const homeNum = parseInt(homeScore);
    const awayNum = parseInt(awayScore);
    const homeWon = hasScores && homeNum > awayNum;
    const awayWon = hasScores && awayNum > homeNum;

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#0a1628',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Sport-colored accent bar at top */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 8,
              background: `linear-gradient(90deg, ${colors.accent}, ${colors.glow})`,
            }}
          />

          {/* Decorative background emoji */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 300,
              opacity: 0.04,
              display: 'flex',
            }}
          >
            {emoji}
          </div>

          {/* Main content — matchup layout */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '40px 60px',
              position: 'relative',
              zIndex: 10,
              gap: '24px',
            }}
          >
            {/* Sport + date header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: 36 }}>{emoji}</span>
              {date && (
                <div
                  style={{
                    display: 'flex',
                    fontSize: 22,
                    color: '#94a3b8',
                    fontWeight: 500,
                  }}
                >
                  {date}
                </div>
              )}
            </div>

            {/* Matchup row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                gap: '40px',
              }}
            >
              {/* Away team */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: away.length > 20 ? 36 : 44,
                    fontWeight: 700,
                    color: awayWon ? '#ffffff' : hasScores ? '#64748b' : '#ffffff',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    maxWidth: '400px',
                  }}
                >
                  {away.length > 25 ? away.slice(0, 25) + '...' : away}
                </div>
                {hasScores && (
                  <div
                    style={{
                      display: 'flex',
                      fontSize: 80,
                      fontWeight: 800,
                      color: awayWon ? '#ffffff' : '#475569',
                      lineHeight: 1,
                    }}
                  >
                    {awayScore}
                  </div>
                )}
              </div>

              {/* VS / AT divider */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: 28,
                    fontWeight: 700,
                    color: colors.accent,
                    letterSpacing: '0.1em',
                  }}
                >
                  {hasScores ? '' : 'VS'}
                </div>
                {hasScores && (
                  <div
                    style={{
                      display: 'flex',
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#ef4444',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '6px',
                      padding: '6px 16px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                    }}
                  >
                    FINAL
                  </div>
                )}
              </div>

              {/* Home team */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: home.length > 20 ? 36 : 44,
                    fontWeight: 700,
                    color: homeWon ? '#ffffff' : hasScores ? '#64748b' : '#ffffff',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    maxWidth: '400px',
                  }}
                >
                  {home.length > 25 ? home.slice(0, 25) + '...' : home}
                </div>
                {hasScores && (
                  <div
                    style={{
                      display: 'flex',
                      fontSize: 80,
                      fontWeight: 800,
                      color: homeWon ? '#ffffff' : '#475569',
                      lineHeight: 1,
                    }}
                  >
                    {homeScore}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer branding */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '24px 80px',
              background: 'rgba(0, 0, 0, 0.4)',
              zIndex: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: '0.15em',
              }}
            >
              <span style={{ color: '#ffffff' }}>PHILLY</span>
              <span style={{ color: '#f0a500' }}>SPORTS</span>
              <span style={{ color: '#ffffff' }}>PACK</span>
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: 18,
                color: '#64748b',
                fontWeight: 500,
              }}
            >
              phillysportspack.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=604800',
          'Content-Type': 'image/png',
        },
      }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Game OG image error:', error);
    }
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#0a1628',
            color: '#ffffff',
            fontSize: 48,
          }}
        >
          <div>PhillySportsPack</div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}
