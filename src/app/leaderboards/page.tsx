import type { Metadata } from 'next';
import Link from 'next/link';
import { getFootballLeaders, getBasketballLeaders } from '@/lib/data';

export const revalidate = 3600;
export const metadata: Metadata = {
  title: 'Leaderboards | Philadelphia High School Sports Stats',
  description:
    'Top statistical leaders across all Philadelphia high school sports – football, basketball, baseball, soccer, lacrosse, track & field, and wrestling.',
  alternates: { canonical: 'https://phillysportspack.com/leaderboards' },
  openGraph: {
    title: 'Leaderboards | PhillySportsPack.com',
    description: 'Top statistical leaders across all Philadelphia high school sports.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

const STATIC_SPORTS = [
  { name: 'Baseball',      slug: 'baseball',    emoji: '⚾', stats: ['Batting Average', 'Home Runs', 'RBIs', 'ERA'],          color: '#dc2626' },
  { name: 'Soccer',        slug: 'soccer',      emoji: '⚽', stats: ['Goals', 'Assists', 'Clean Sheets', 'Saves'],            color: '#228B22' },
  { name: 'Lacrosse',      slug: 'lacrosse',    emoji: '🥍', stats: ['Goals', 'Assists', 'Ground Balls', 'Saves'],            color: '#6A0DAD' },
  { name: 'Track & Field', slug: 'track-field', emoji: '🏃', stats: ['100m Time', 'Mile Time', 'Long Jump', 'Shot Put'],      color: '#B8860B' },
  { name: 'Wrestling',     slug: 'wrestling',   emoji: '🤼', stats: ['Wins', 'Pins', 'Pin %', 'Tech Falls'],                 color: '#C0392B' },
];

interface LeaderRow {
  players?: {
    name?: string | null;
    slug?: string | null;
    schools?: { name?: string | null; slug?: string | null } | null;
  } | null;
  schools?: { name?: string | null; slug?: string | null } | null;
  rush_yards?: number | null;
  ppg?: number | string | null;
}

function playerName(row: LeaderRow): string {
  return row.players?.name ?? 'Unknown';
}
function schoolName(row: LeaderRow): string {
  return row.players?.schools?.name ?? row.schools?.name ?? '—';
}

function StatPills({ stats }: { stats: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
      {stats.map((s) => (
        <span
          key={s}
          style={{
            fontSize: '0.75rem',
            padding: '0.2rem 0.5rem',
            background: 'var(--psp-surface-alt, #f5f5f5)',
            borderRadius: '4px',
            color: 'var(--psp-muted)',
            border: '1px solid var(--psp-border)',
          }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

export default async function LeaderboardsPage() {
  const [fbRaw, bbRaw] = await Promise.all([
    (getFootballLeaders('rushing', 3) as Promise<unknown[]>).catch(() => [] as unknown[]),
    (getBasketballLeaders('ppg', 3) as Promise<unknown[]>).catch(() => [] as unknown[]),
  ]);

  const fbRows = (fbRaw as LeaderRow[]).slice(0, 3);
  const bbRows = (bbRaw as LeaderRow[]).slice(0, 3);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1
          className="psp-h1"
          style={{
            color: 'var(--psp-navy)',
            marginBottom: '0.5rem',
          }}
        >
          LEADERBOARDS
        </h1>
        <p style={{ color: 'var(--psp-muted)', fontSize: '1rem', maxWidth: '600px' }}>
          Top statistical leaders across all Philadelphia high school sports. Select a sport to
          view full rankings.
        </p>
      </div>

      <nav
        aria-label="Breadcrumb"
        style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--psp-muted)' }}
      >
        <Link href="/" style={{ color: 'var(--psp-gold-text)', textDecoration: 'none' }}>
          Home
        </Link>
        {' › '}
        <span>Leaderboards</span>
      </nav>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.25rem',
        }}
      >
        <Link href="/football/leaderboards" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div
            style={{
              border: '1px solid var(--psp-border)',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'var(--psp-surface)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            className="hover:shadow-lg hover:-translate-y-0.5"
          >
            <div style={{ height: '4px', background: '#8B4513' }} />
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }} role="img" aria-label="football">🏈</span>
                <h2 className="psp-h3" style={{ color: 'var(--psp-navy)', margin: 0 }}>
                  Football
                </h2>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', padding: '0.15rem 0.45rem', background: '#e8f5e9', color: '#2e7d32', borderRadius: '3px', fontWeight: 700, letterSpacing: '0.04em' }}>
                  LIVE
                </span>
              </div>
              {fbRows.length > 0 ? (
                <div style={{ marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--psp-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.5rem' }}>
                    Rush Yards Leaders
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {fbRows.map((row, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <span style={{ color: '#8B4513', fontWeight: 700, minWidth: '1.1rem', fontSize: '0.75rem' }}>{i + 1}.</span>
                        <span style={{ fontWeight: 600, color: 'var(--psp-navy)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{playerName(row)}</span>
                        <span style={{ color: 'var(--psp-muted)', fontSize: '0.75rem', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{schoolName(row)}</span>
                        <span style={{ fontWeight: 700, color: '#8B4513', fontSize: '0.78rem', minWidth: '3.5rem', textAlign: 'right' }}>
                          {row.rush_yards != null ? Number(row.rush_yards).toLocaleString() : '—'}{' '}yds
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <StatPills stats={['Rushing Yards', 'Passing Yards', 'Touchdowns', 'Tackles']} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#8B4513', fontWeight: 600, fontSize: '0.875rem', marginTop: fbRows.length > 0 ? '0.5rem' : 0 }}>
                <span>View Football Leaders</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/basketball/leaderboards" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div
            style={{
              border: '1px solid var(--psp-border)',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'var(--psp-surface)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            className="hover:shadow-lg hover:-translate-y-0.5"
          >
            <div style={{ height: '4px', background: '#FF6B00' }} />
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }} role="img" aria-label="basketball">🏀</span>
                <h2 className="psp-h3" style={{ color: 'var(--psp-navy)', margin: 0 }}>
                  Basketball
                </h2>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', padding: '0.15rem 0.45rem', background: '#e8f5e9', color: '#2e7d32', borderRadius: '3px', fontWeight: 700, letterSpacing: '0.04em' }}>
                  LIVE
                </span>
              </div>
              {bbRows.length > 0 ? (
                <div style={{ marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--psp-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.5rem' }}>
                    PPG Leaders
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {bbRows.map((row, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <span style={{ color: '#FF6B00', fontWeight: 700, minWidth: '1.1rem', fontSize: '0.75rem' }}>{i + 1}.</span>
                        <span style={{ fontWeight: 600, color: 'var(--psp-navy)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{playerName(row)}</span>
                        <span style={{ color: 'var(--psp-muted)', fontSize: '0.75rem', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{schoolName(row)}</span>
                        <span style={{ fontWeight: 700, color: '#FF6B00', fontSize: '0.78rem', minWidth: '3.5rem', textAlign: 'right' }}>
                          {row.ppg ?? '—'} PPG
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <StatPills stats={['Points Per Game', 'Rebounds', 'Assists', 'Steals']} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#FF6B00', fontWeight: 600, fontSize: '0.875rem', marginTop: bbRows.length > 0 ? '0.5rem' : 0 }}>
                <span>View Basketball Leaders</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {STATIC_SPORTS.map((sport) => (
          <Link key={sport.slug} href={`/${sport.slug}/leaderboards`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              style={{ border: '1px solid var(--psp-border)', borderRadius: '12px', overflow: 'hidden', background: 'var(--psp-surface)', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }}
              className="hover:shadow-lg hover:-translate-y-0.5"
            >
              <div style={{ height: '4px', background: sport.color }} />
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }} role="img" aria-label={sport.name}>{sport.emoji}</span>
                  <h2 className="psp-h3" style={{ color: 'var(--psp-navy)', margin: 0 }}>{sport.name}</h2>
                </div>
                <StatPills stats={sport.stats} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: sport.color, fontWeight: 600, fontSize: '0.875rem' }}>
                  <span>View {sport.name} Leaders</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* By Class Year */}
      <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--psp-surface)', borderRadius: '12px', border: '1px solid var(--psp-border)' }}>
        <p className="psp-h4" style={{ color: 'var(--psp-navy)', margin: '0 0 0.75rem' }}>
          BROWSE BY CLASS YEAR
        </p>
        <p style={{ color: 'var(--psp-muted)', fontSize: '0.85rem', margin: '0 0 1rem' }}>
          See top performers from each graduating class across all sports.
        </p>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {[2025, 2026, 2027, 2028].map((yr) => (
            <Link
              key={yr}
              href={`/class/${yr}`}
              style={{
                padding: '0.45rem 1.25rem',
                borderRadius: '8px',
                background: 'var(--psp-navy)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'opacity 0.15s',
              }}
            >
              Class of {yr}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'var(--psp-navy)', borderRadius: '12px', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p className="psp-h4" style={{ color: 'var(--psp-gold-text, #FFC107)', margin: 0 }}>
            LOOKING FOR ALL-TIME RECORDS?
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
            View the greatest single-game and career performances in Philadelphia history.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/football/records" style={{ padding: '0.5rem 1rem', background: 'var(--psp-gold-text, #FFC107)', color: 'var(--psp-navy)', borderRadius: '6px', fontWeight: 700, textDecoration: 'none', fontSize: '0.875rem' }}>
            All-Time Records
          </Link>
          <Link href="/compare" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontWeight: 600, textDecoration: 'none', fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            Compare Players
          </Link>
        </div>
      </div>
    </div>
  );
}
