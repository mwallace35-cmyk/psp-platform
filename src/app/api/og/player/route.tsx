/**
 * Dynamic OG image for Player Cards
 *
 * Query params:
 * - name (required): Player name
 * - school (optional): School name
 * - sport (optional): Sport ID for color/emoji
 * - stat (optional): Key stat line
 */

import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

const SPORT_EMOJI: Record<string, string> = {
  football: '🏈', basketball: '🏀', baseball: '⚾', soccer: '⚽',
  lacrosse: '🥍', 'track-field': '🏃', wrestling: '🤼',
};

const SPORT_COLORS: Record<string, { accent: string; glow: string }> = {
  football:      { accent: '#16a34a', glow: '#22c55e' },
  basketball:    { accent: '#ea580c', glow: '#fb923c' },
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
    const name = searchParams.get('name') || 'Player';
    const school = searchParams.get('school') || '';
    const sport = searchParams.get('sport') || '';
    const stat = searchParams.get('stat') || '';

    const emoji = SPORT_EMOJI[sport] || '🏅';
    const colors = SPORT_COLORS[sport] || DEFAULT_SPORT;

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

          {/* Large decorative emoji background */}
          <div
            style={{
              position: 'absolute',
              top: -40,
              right: -20,
              fontSize: 280,
              opacity: 0.08,
              display: 'flex',
            }}
          >
            {emoji}
          </div>

          {/* Decorative circle glow */}
          <div
            style={{
              position: 'absolute',
              bottom: -100,
              right: -100,
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: colors.accent,
              opacity: 0.06,
            }}
          />

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '60px 80px',
              height: '100%',
              gap: '16px',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Sport emoji + label */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: 48 }}>{emoji}</span>
              {sport && (
                <div
                  style={{
                    display: 'flex',
                    fontSize: 22,
                    fontWeight: 600,
                    color: colors.glow,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {sport.replace('-', ' ')}
                </div>
              )}
            </div>

            {/* Player name — large display */}
            <div
              style={{
                display: 'flex',
                fontSize: 72,
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                maxWidth: '90%',
              }}
            >
              {name.length > 28 ? name.slice(0, 28) + '...' : name}
            </div>

            {/* School name */}
            {school && (
              <div
                style={{
                  display: 'flex',
                  fontSize: 32,
                  fontWeight: 400,
                  color: '#94a3b8',
                  lineHeight: 1.3,
                }}
              >
                {school}
              </div>
            )}

            {/* Stat line */}
            {stat && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    fontSize: 28,
                    fontWeight: 700,
                    color: '#ffffff',
                    backgroundColor: `${colors.accent}33`,
                    border: `2px solid ${colors.accent}`,
                    borderRadius: '12px',
                    padding: '10px 24px',
                  }}
                >
                  {stat}
                </div>
              </div>
            )}
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
            {/* PSP branding */}
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
      console.error('Player OG image error:', error);
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
