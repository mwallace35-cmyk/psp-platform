import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Players | Philadelphia High School Sports Stats',
  description: 'Browse Philadelphia high school athletes. Stats, profiles, and college recruiting info.',
  openGraph: {
    title: 'Players | PhillySportsPack.com',
    description: 'Philadelphia high school athletes \u2014 stats and profiles.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

const SPORTS = [
  { name: 'Football',      slug: 'football',    emoji: '\uD83C\uDFC8', color: '#8B4513' },
  { name: 'Basketball',    slug: 'basketball',  emoji: '\uD83C\uDFC0', color: '#FF6B00' },
  { name: 'Baseball',      slug: 'baseball',    emoji: '\u26BE',        color: '#1B4D8E' },
  { name: 'Soccer',        slug: 'soccer',      emoji: '\u26BD',        color: '#228B22' },
  { name: 'Lacrosse',      slug: 'lacrosse',    emoji: '\uD83E\uDD4D', color: '#6A0DAD' },
  { name: 'Track & Field', slug: 'track-field', emoji: '\uD83C\uDFC3', color: '#B8860B' },
  { name: 'Wrestling',     slug: 'wrestling',   emoji: '\uD83E\uDD3C', color: '#C0392B' },
];

export default function PlayersPage() {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="psp-h1" style={{ color: 'var(--psp-navy)', marginBottom: '0.5rem' }}>
          PLAYERS
        </h1>
        <p style={{ color: 'var(--psp-muted)', fontSize: '1rem', maxWidth: '600px' }}>
          Browse Philadelphia high school athletes across all sports. Find stats, profiles, and recruiting info.
        </p>
      </div>
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--psp-muted)' }}>
        <Link href="/" style={{ color: 'var(--psp-gold-text)', textDecoration: 'none' }}>Home</Link>
        {' \u203A '}
        <span>Players</span>
      </nav>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 className="psp-h2" style={{ color: 'var(--psp-navy)', marginBottom: '1rem' }}>
          BROWSE BY SPORT
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {SPORTS.map((sport) => (
            <Link key={sport.slug} href={`/${sport.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.9rem', background: 'var(--psp-surface)', border: '1px solid var(--psp-border)', borderRadius: '999px', textDecoration: 'none', color: 'var(--psp-navy)', fontSize: '0.875rem', fontWeight: 600 }}>
              <span>{sport.emoji}</span>
              <span>{sport.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {SPORTS.map((sport) => (
          <Link key={sport.slug} href={`/${sport.slug}/leaderboards`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid var(--psp-border)', borderRadius: '12px', overflow: 'hidden', background: 'var(--psp-surface)', transition: 'transform 0.15s ease, box-shadow 0.15s ease' }} className="hover:shadow-lg hover:-translate-y-0.5">
              <div style={{ height: '4px', background: sport.color }} />
              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2rem' }}>{sport.emoji}</span>
                  <h2 className="psp-h3" style={{ color: 'var(--psp-navy)', margin: 0 }}>{sport.name}</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: sport.color, fontWeight: 600, fontSize: '0.875rem', marginTop: '0.75rem' }}>
                  <span>Top {sport.name} Players</span>
                  <span>\u2192</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ padding: '1.5rem', background: 'var(--psp-navy)', borderRadius: '12px', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p className="psp-h4" style={{ color: 'var(--psp-gold-text, #FFC107)', margin: 0 }}>LOOKING FOR A SPECIFIC PLAYER?</p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>Use search to find athletes by name, school, or sport.</p>
        </div>
        <Link href="/search" style={{ padding: '0.5rem 1rem', background: 'var(--psp-gold-text, #FFC107)', color: 'var(--psp-navy)', borderRadius: '6px', fontWeight: 700, textDecoration: 'none', fontSize: '0.875rem' }}>
          Search Players
        </Link>
      </div>
    </div>
  );
}