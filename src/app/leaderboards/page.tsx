import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Leaderboards | Philadelphia High School Sports Stats',
  description:
    'Top statistical leaders across all Philadelphia high school sports â football, basketball, baseball, soccer, lacrosse, track & field, and wrestling.',
  openGraph: {
    title: 'Leaderboards | PhillySportsPack.com',
    description:
      'Top statistical leaders across all Philadelphia high school sports.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

const SPORTS = [
  {
    name: 'Football',
    slug: 'football',
    emoji: 'ð',
    stats: ['Rushing Yards', 'Passing Yards', 'Touchdowns', 'Tackles'],
    color: '#8B4513',
  },
  {
    name: 'Basketball',
    slug: 'basketball',
    emoji: 'ð',
    stats: ['Points Per Game', 'Rebounds', 'Assists', 'Steals'],
    color: '#FF6B00',
  },
  {
    name: 'Baseball',
    slug: 'baseball',
    emoji: 'â¾',
    stats: ['Batting Average', 'Home Runs', 'RBIs', 'ERA'],
    color: '#1B4D8E',
  },
  {
    name: 'Soccer',
    slug: 'soccer',
    emoji: 'â½',
    stats: ['Goals', 'Assists', 'Clean Sheets', 'Saves'],
    color: '#228B22',
  },
  {
    name: 'Lacrosse',
    slug: 'lacrosse',
    emoji: 'ð¥',
    stats: ['Goals', 'Assists', 'Ground Balls', 'Saves'],
    color: '#6A0DAD',
  },
  {
    name: 'Track & Field',
    slug: 'track-field',
    emoji: 'ð',
    stats: ['100m Time', 'Mile Time', 'Long Jump', 'Shot Put'],
    color: '#B8860B',
  },
  {
    name: 'Wrestling',
    slug: 'wrestling',
    emoji: 'ð¤¼',
    stats: ['Wins', 'Pins', 'Pin %', 'Tech Falls'],
    color: '#C0392B',
  },
];

export default function LeaderboardsPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'var(--psp-navy)',
            letterSpacing: '0.05em',
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

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--psp-muted)' }}>
        <Link href="/" style={{ color: 'var(--psp-gold-text)', textDecoration: 'none' }}>Home</Link>
        {' âº '}
        <span>Leaderboards</span>
      </nav>

      {/* Sport Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {SPORTS.map((sport) => (
          <Link
            key={sport.slug}
            href={`/${sport.slug}/leaderboards`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                border: '1px solid var(--psp-border)',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'var(--psp-surface)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              {/* Colour bar */}
              <div style={{ height: '4px', background: sport.color }} />

              {/* Card body */}
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>{sport.emoji}</span>
                  <h2
                    style={{
                      fontFamily: 'var(--font-bebas)',
                      fontSize: '1.5rem',
                      letterSpacing: '0.05em',
                      color: 'var(--psp-navy)',
                      margin: 0,
                    }}
                  >
                    {sport.name}
                  </h2>
                </div>

                {/* Stat categories */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                  {sport.stats.map((stat) => (
                    <span
                      key={stat}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.5rem',
                        background: 'var(--psp-surface-alt, #f5f5f5)',
                        borderRadius: '4px',
                        color: 'var(--psp-muted)',
                        border: '1px solid var(--psp-border)',
                      }}
                    >
                      {stat}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: sport.color,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  <span>View {sport.name} Leaders</span>
                  <span>â</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div
        style={{
          marginTop: '3rem',
          padding: '1.5rem',
          background: 'var(--psp-navy)',
          borderRadius: '12px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p style={{ color: 'var(--psp-gold-text, #FFC107)', fontFamily: 'var(--font-bebas)', fontSize: '1.25rem', margin: 0 }}>
            LOOKING FOR ALL-TIME RECORDS?
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
            View the greatest single-game and career performances in Philadelphia history.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            href="/football/records"
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--psp-gold-text, #FFC107)',
              color: 'var(--psp-navy)',
              borderRadius: '6px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            All-Time Records
          </Link>
          <Link
            href="/compare"
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              borderRadius: '6px',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '0.875rem',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            Compare Players
          </Link>
        </div>
      </div>
    </div>
  );
}
