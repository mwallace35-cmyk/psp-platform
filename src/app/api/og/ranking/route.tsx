/**
 * Dynamic OG image for Power Rankings cards
 *
 * Query params:
 * - school (required): School name
 * - rank (required): Rank number
 * - week (required): Week label (e.g., "Week 12")
 * - vote_pct (optional): Fan agreement percentage (e.g., "78")
 * - sport (optional): Sport ID for color theming
 */

import { ImageResponse } from 'next/og';
import { getSportColors } from '@/lib/og-utils';
import type { SportId } from '@/lib/sports';

export const runtime = 'nodejs';
export const revalidate = 31536000;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const school = searchParams.get('school') || 'Team';
    const rank = searchParams.get('rank') || '1';
    const week = searchParams.get('week') || 'Week 1';
    const votePct = searchParams.get('vote_pct') || '';
    const sport = (searchParams.get('sport') || '') as SportId;

    const colors = getSportColors(sport || undefined);
    const pctNum = parseInt(votePct);
    const hasVotePct = votePct !== '' && !isNaN(pctNum);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, #0a1628 0%, #162032 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top accent bar — PSP gold */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 8,
              background: '#f0a500',
            }}
          />

          {/* Main content */}
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
              gap: '20px',
            }}
          >
            {/* Site branding */}
            <div
              style={{
                display: 'flex',
                fontSize: 18,
                fontWeight: 600,
                color: '#f0a500',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              PHILLYSPORTSPACK.COM
            </div>

            {/* Rank + School */}
            <div
              style={{
                display: 'flex',
                fontSize: school.length > 20 ? 52 : 64,
                fontWeight: 800,
                color: '#ffffff',
                textAlign: 'center',
                lineHeight: 1.1,
                maxWidth: '1000px',
              }}
            >
              #{rank} {school.length > 30 ? school.slice(0, 30) + '...' : school}
            </div>

            {/* Week label */}
            <div
              style={{
                display: 'flex',
                fontSize: 28,
                fontWeight: 500,
                color: '#94a3b8',
                letterSpacing: '0.05em',
              }}
            >
              {week} Power Rankings
            </div>

            {/* Sentiment bar */}
            {hasVotePct && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '16px',
                }}
              >
                {/* Bar background */}
                <div
                  style={{
                    display: 'flex',
                    width: '400px',
                    height: '16px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Filled portion */}
                  <div
                    style={{
                      display: 'flex',
                      width: `${Math.min(100, Math.max(0, pctNum))}%`,
                      height: '100%',
                      borderRadius: '8px',
                      background: pctNum >= 60
                        ? `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`
                        : 'linear-gradient(90deg, #ef4444, #f87171)',
                    }}
                  />
                </div>
                {/* Label */}
                <div
                  style={{
                    display: 'flex',
                    fontSize: 20,
                    fontWeight: 600,
                    color: '#cbd5e1',
                  }}
                >
                  {pctNum}% of fans agree
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 80px',
              background: 'rgba(0, 0, 0, 0.4)',
              zIndex: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#f0a500',
                  backgroundColor: 'rgba(240, 165, 0, 0.15)',
                  border: '1px solid rgba(240, 165, 0, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 24px',
                  letterSpacing: '0.1em',
                }}
              >
                See Full Rankings &rarr;
              </div>
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
      console.error('Ranking OG image error:', error);
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
          <div style={{ display: 'flex' }}>PhillySportsPack</div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}
