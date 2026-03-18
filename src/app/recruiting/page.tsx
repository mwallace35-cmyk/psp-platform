import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Recruiting | Philadelphia High School Sports',
  description: 'Recruiting hub for Philadelphia high school athletes.',
};

export default function RecruitingPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '960px', margin: '0 auto' }}>
      <section style={{ background: 'var(--psp-navy)', borderRadius: '12px', padding: '2.5rem', marginBottom: '2.5rem', color: '#fff' }}>
        <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.75rem', margin: '0 0 0.5rem' }}>
          Recruiting Hub
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '560px', marginBottom: '1.5rem' }}>
          The definitive source for Philadelphia high school recruiting. Discover top prospects, track stats, and connect with athletes.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/players" style={{ background: 'var(--psp-gold)', color: 'var(--psp-navy)', padding: '0.65rem 1.5rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 700, fontFamily: 'var(--font-bebas)', fontSize: '1.1rem' }}>
            Browse Prospects
          </Link>
          <a href="mailto:mwallace35@gmail.com?subject=Coach Inquiry" style={{ background: 'transparent', color: '#fff', padding: '0.65rem 1.5rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, border: '2px solid rgba(255,255,255,0.4)' }}>
            Coach Inquiry
          </a>
        </div>
      </section>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { href: '/players', label: 'Find Prospects', desc: 'Search 10,000+ athletes by sport, school, and year' },
          { href: '/leaderboards', label: 'Stat Leaders', desc: 'Top performers across every sport and season' },
          { href: '/leaderboards/trending', label: 'Trending', desc: 'Athletes gaining the most attention right now' },
          { href: '/standings', label: 'Team Records', desc: 'School performance and league standings' },
        ].map((card) => (
          <Link key={card.href} href={card.href} style={{ display: 'block', background: 'var(--psp-card-bg)', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.15rem', color: 'var(--psp-navy)', marginBottom: '0.25rem' }}>{card.label}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--psp-muted)' }}>{card.desc}</div>
          </Link>
        ))}
      </div>
      <section style={{ background: 'var(--psp-card-bg)', borderRadius: '10px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', color: 'var(--psp-navy)', marginBottom: '1rem' }}>
          Pro Pipeline
        </h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            { label: 'NFL Players', count: '222+' },
            { label: 'NBA Players', count: '87+' },
            { label: 'MLB Players', count: '116+' },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', color: 'var(--psp-gold)' }}>{stat.count}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--psp-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
      <section style={{ background: 'var(--psp-navy)', borderRadius: '10px', padding: '1.5rem', color: '#fff', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', margin: '0 0 0.5rem' }}>
          Coaches: Get Early Access
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Advanced recruiting tools and verified athlete profiles coming soon.
        </p>
        <a href="mailto:mwallace35@gmail.com?subject=Coach Early Access" style={{ background: 'var(--psp-gold)', color: 'var(--psp-navy)', padding: '0.6rem 1.5rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 700, fontFamily: 'var(--font-bebas)' }}>
          Request Access
        </a>
      </section>
    </main>
  );
}
