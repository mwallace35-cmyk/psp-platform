'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface School {
  id: number;
  slug: string;
  name: string;
  city: string;
  state: string;
  league: string | null;
  championships_count: number;
  colors: string | null;
}

interface RisingProgram {
  id: number;
  slug: string;
  name: string;
  league: string;
  recentTitles: number;
}

interface Props {
  schools: School[];
  leagues: string[];
  risingPrograms: RisingProgram[];
}

const LEAGUE_COLORS: Record<string, string> = {
  'Catholic League': '#f0a500',
  'Public League': '#0a1628',
  'Inter-Ac League': '#16a34a',
  'Inter-Ac': '#16a34a',
  'Central League': '#ea580c',
  'Delaware Valley League': '#0891b2',
  'Suburban One League': '#7c3aed',
  'Ches-Mont League': '#db2777',
  'SOL Conference': '#7c3aed',
  'PIAA Independent': '#64748b',
};

function getLeagueColor(league: string | null): string {
  if (!league) return '#64748b';
  // Try exact match first, then partial
  if (LEAGUE_COLORS[league]) return LEAGUE_COLORS[league];
  const key = Object.keys(LEAGUE_COLORS).find(k => league.includes(k) || k.includes(league));
  return key ? LEAGUE_COLORS[key] : '#64748b';
}

type ViewMode = 'grid' | 'league' | 'search';

export default function SchoolsDirectory({ schools, leagues, risingPrograms }: Props) {
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filtered = useMemo(() => {
    let result = schools;
    if (selectedLeague) {
      result = result.filter((s) => s.league === selectedLeague);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          (s.league && s.league.toLowerCase().includes(q))
      );
    }
    return result;
  }, [schools, selectedLeague, searchTerm]);

  // Group by league for league view
  const groupedByLeague = useMemo(() => {
    const groups: Record<string, School[]> = {};
    const source = selectedLeague ? filtered : schools;
    source.forEach((s) => {
      const key = s.league || 'Unaffiliated';
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    });
    // Sort groups by count descending
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  }, [schools, filtered, selectedLeague]);

  return (
    <div className="espn-container" style={{ flex: 1 }}>
      <main>
        {/* Hero */}
        <div className="hero-card">
          <div className="hero-tag">Directory</div>
          <div
            className="hero-img"
            style={{ background: 'linear-gradient(180deg,#1a365d 0%,rgba(10,22,40,.95) 100%)' }}
          >
            <div>
              <h2>Philadelphia-Area High Schools</h2>
              <div className="hero-sub">
                Explore <strong style={{ color: 'var(--psp-gold)' }}>{schools.length}</strong> schools across{' '}
                {leagues.length} leagues
              </div>
            </div>
          </div>
        </div>

        {/* Rising Programs */}
        {risingPrograms.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--psp-navy)', margin: 0, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1 }}>
                Recent Championship Leaders
              </h2>
              <p style={{ fontSize: 12, color: 'var(--g400)', margin: '4px 0 0 0' }}>
                Most state/league titles since 2020
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
              {risingPrograms.map((program) => (
                <Link key={program.id} href={`/football/schools/${program.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #f0a500 0%, #d4a843 100%)',
                    borderRadius: 6, padding: 16, transition: '.15s', cursor: 'pointer',
                    border: '1px solid rgba(212,168,67,.4)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 4px', fontFamily: "'Bebas Neue', sans-serif" }}>
                          {program.name}
                        </h3>
                        <div style={{ fontSize: 11, color: 'rgba(0,0,0,.7)', fontWeight: 600 }}>{program.league}</div>
                      </div>
                      <div style={{ fontSize: 32 }}>🏆</div>
                    </div>
                    <div style={{ paddingTop: 12, borderTop: '1px solid rgba(0,0,0,.1)' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(0,0,0,.7)', textTransform: 'uppercase', marginBottom: 2 }}>
                        Titles Since 2020
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: "'Bebas Neue', sans-serif" }}>
                        {program.recentTitles}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* View Mode Switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--g100)', paddingBottom: 16 }}>
          {([
            { mode: 'grid' as ViewMode, label: 'All Schools' },
            { mode: 'league' as ViewMode, label: 'By League' },
            { mode: 'search' as ViewMode, label: 'Search' },
          ]).map((tab) => (
            <button
              key={tab.mode}
              onClick={() => { setViewMode(tab.mode); setSearchTerm(''); setSelectedLeague(''); }}
              style={{
                padding: '10px 16px', borderRadius: 4, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                background: viewMode === tab.mode ? 'var(--psp-gold)' : 'var(--psp-navy)',
                color: viewMode === tab.mode ? 'var(--psp-navy)' : '#fff',
                transition: '.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        {(viewMode === 'grid' || viewMode === 'league') && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Filter by name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1, minWidth: 200, padding: '10px 14px', fontSize: 13,
                border: '1px solid var(--g100)', borderRadius: 4, fontFamily: 'inherit',
                background: 'var(--surface, #fff)', color: 'var(--text, #333)',
              }}
            />
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              style={{
                padding: '10px 14px', fontSize: 13, border: '1px solid var(--g100)',
                borderRadius: 4, fontFamily: 'inherit', minWidth: 180,
                background: 'var(--surface, #fff)', color: 'var(--text, #333)',
              }}
            >
              <option value="">All Leagues ({schools.length})</option>
              {leagues.map((league) => {
                const count = schools.filter(s => s.league === league).length;
                return (
                  <option key={league} value={league}>{league} ({count})</option>
                );
              })}
            </select>
          </div>
        )}

        {/* Search View */}
        {viewMode === 'search' && (
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Search schools by name, city, or league..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px', fontSize: 14,
                border: '1px solid var(--g100)', borderRadius: 4, fontFamily: 'inherit',
                background: 'var(--surface, #fff)', color: 'var(--text, #333)',
              }}
              autoFocus
            />
          </div>
        )}

        {/* Results Header */}
        <div className="sec-head">
          <h2>
            {viewMode === 'league' ? 'Schools by League' : viewMode === 'search' ? 'Search Results' : 'School Directory'}
          </h2>
          <span style={{ fontSize: 11, color: 'var(--g400)', marginLeft: 'auto' }}>
            {filtered.length} {filtered.length === 1 ? 'school' : 'schools'}
          </span>
        </div>

        {/* Grid View */}
        {(viewMode === 'grid' || viewMode === 'search') && (
          <>
            {filtered.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 12, marginBottom: 16,
              }}>
                {filtered.map((school) => (
                  <SchoolCard key={school.id} school={school} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--g400)' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                <p>{searchTerm ? 'No schools match your search.' : 'No schools found.'}</p>
              </div>
            )}
          </>
        )}

        {/* League View */}
        {viewMode === 'league' && (
          <>
            {groupedByLeague.map(([league, leagueSchools]) => (
              <div key={league} style={{ marginBottom: 32 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 12,
                  borderBottom: `2px solid ${getLeagueColor(league)}`,
                }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: getLeagueColor(league) }} />
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--psp-navy)', fontFamily: "'Bebas Neue', sans-serif", margin: 0 }}>
                    {league}
                  </h3>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--g400)' }}>
                    {leagueSchools.length} schools
                  </span>
                </div>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12,
                }}>
                  {leagueSchools.map((school) => (
                    <SchoolCard key={school.id} school={school} compact />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </main>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="widget">
          <div className="w-head">League Breakdown</div>
          <div className="w-body">
            {leagues.slice(0, 12).map((league) => {
              const count = schools.filter(s => s.league === league).length;
              return (
                <div
                  key={league}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
                  onClick={() => { setSelectedLeague(league); setViewMode('grid'); }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: getLeagueColor(league), flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', flex: 1 }}>{league}</span>
                  <span style={{ fontSize: 11, color: 'var(--g400)' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="widget">
          <div className="w-head">Quick Links</div>
          <div className="w-body">
            <Link href="/football" className="w-link">&#8594; Football</Link>
            <Link href="/basketball" className="w-link">&#8594; Basketball</Link>
            <Link href="/baseball" className="w-link">&#8594; Baseball</Link>
            <Link href="/search" className="w-link">&#8594; Player Search</Link>
            <Link href="/compare" className="w-link">&#8594; Compare Players</Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ============ School Card Component ============

function SchoolCard({ school, compact }: { school: School; compact?: boolean }) {
  const leagueColor = getLeagueColor(school.league);
  const headerBg = school.colors || leagueColor;

  return (
    <Link href={`/football/schools/${school.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: 'var(--surface, #fff)',
        border: compact ? 'none' : '1px solid var(--g100)',
        borderLeft: compact ? `4px solid ${leagueColor}` : undefined,
        borderRadius: 4, overflow: 'hidden', transition: '.15s', cursor: 'pointer',
      }}>
        {!compact && (
          <div style={{ background: headerBg, padding: '10px 12px', color: '#fff' }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif" }}>
              {school.name}
            </h3>
          </div>
        )}
        <div style={{ padding: compact ? '10px 12px' : '10px 12px' }}>
          {compact && (
            <h3 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: 'var(--psp-navy)' }}>
              {school.name}
            </h3>
          )}
          <div style={{ fontSize: 11, color: 'var(--g400)', marginBottom: 4 }}>
            {school.league || 'Independent'}
          </div>
          {school.city && (
            <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 6 }}>
              {school.city}, {school.state}
            </div>
          )}
          {school.championships_count > 0 && (
            <div style={{ display: 'flex', gap: 8, paddingTop: 6, borderTop: '1px solid var(--g100)' }}>
              <div>
                <div style={{ fontSize: 9, color: 'var(--g400)', textTransform: 'uppercase' }}>Championships</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--psp-gold)' }}>
                  {school.championships_count}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
