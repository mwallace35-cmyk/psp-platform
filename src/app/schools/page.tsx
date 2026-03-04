import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { getAllSchools } from '@/lib/data';
import SchoolsGrid from './SchoolsGrid';

export const metadata: Metadata = {
  title: 'Schools Directory — PhillySportsPack',
  description: 'Browse all Philadelphia-area high schools covered by PhillySportsPack. Filter by league, search by name, and explore team profiles.',
};

export const revalidate = 3600; // ISR: revalidate every hour

const LEAGUE_COLORS: Record<string, string> = {
  'Catholic League': '#f0a500',
  'Public League': '#0a1628',
  'Inter-Ac': '#16a34a',
  'Central League': '#ea580c',
  'Delaware Valley': '#0891b2',
  'Suburban One': '#7c3aed',
  'Ches-Mont': '#dc2626',
  'Independent': '#999',
};

export default async function SchoolsPage() {
  const schools = await getAllSchools();

  // Extract unique leagues from actual data
  const leagueSet = new Map<string, number>();
  schools.forEach((s: any) => {
    const name = s.leagues?.name;
    if (name) leagueSet.set(name, (leagueSet.get(name) || 0) + 1);
  });
  const leagues = Array.from(leagueSet.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div className="espn-container" style={{ flex: 1 }}>
        <main>
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Schools' }]} />

          {/* Hero */}
          <div className="hero-card">
            <div className="hero-tag">Directory</div>
            <div
              className="hero-img"
              style={{
                background: 'linear-gradient(180deg,#1a365d 0%,rgba(10,22,40,.95) 100%)',
              }}
            >
              <div>
                <h2>Philadelphia-Area High Schools</h2>
                <div className="hero-sub">
                  Explore {schools.length} schools across {leagues.length} leagues
                </div>
              </div>
            </div>
          </div>

          {/* Client-side filtering + grid */}
          <SchoolsGrid schools={schools} leagues={leagues} leagueColors={LEAGUE_COLORS} />
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* League Legend */}
          <div className="widget">
            <div className="w-head">Leagues ({leagues.length})</div>
            <div className="w-body">
              {leagues.map((league) => (
                <div key={league.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderBottom: '1px solid var(--g100)' }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: LEAGUE_COLORS[league.name] || '#666',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', flex: 1 }}>
                    {league.name}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--g400)' }}>{league.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="widget">
            <div className="w-head">Quick Links</div>
            <div className="w-body">
              <Link href="/football" className="w-link">&#8594; Football Hub</Link>
              <Link href="/basketball" className="w-link">&#8594; Basketball Hub</Link>
              <Link href="/search" className="w-link">&#8594; Player Search</Link>
              <Link href="/compare" className="w-link">&#8594; Compare Players</Link>
            </div>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
