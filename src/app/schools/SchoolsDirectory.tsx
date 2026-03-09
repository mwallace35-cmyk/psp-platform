'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface SchoolData {
  id: number;
  slug: string;
  name: string;
  city: string;
  state: string;
  league: string | null;
  colors: string | null;
  championships_count: number;
  total_wins: number;
  total_losses: number;
  has_data: boolean;
  sports: string[];
  award_count: number;
}

interface RisingProgram {
  id: number;
  slug: string;
  name: string;
  league: string;
  recentTitles: number;
}

interface Props {
  schools: SchoolData[];
  leagues: string[];
  risingPrograms: RisingProgram[];
}

const LEAGUE_COLORS: Record<string, string> = {
  'Philadelphia Catholic League': '#f0a500',
  'Catholic League': '#f0a500',
  'Philadelphia Public League': '#0a1628',
  'Public League': '#0a1628',
  'Inter-Academic League': '#16a34a',
  'Inter-Ac League': '#16a34a',
  'Inter-Ac': '#16a34a',
  'Central League': '#ea580c',
  'Delaware Valley League': '#0891b2',
  'Suburban One League': '#7c3aed',
  'Ches-Mont League': '#db2777',
  'SOL Conference': '#7c3aed',
  'PIAA Independent': '#64748b',
};

const SPORT_EMOJI: Record<string, string> = {
  'football': '🏈',
  'basketball': '🏀',
  'baseball': '⚾',
  'soccer': '⚽',
  'lacrosse': '🥍',
  'track-field': '🏃',
  'wrestling': '🤼',
};

function getLeagueColor(league: string | null): string {
  if (!league) return '#64748b';
  if (LEAGUE_COLORS[league]) return LEAGUE_COLORS[league];
  const key = Object.keys(LEAGUE_COLORS).find(k => league.includes(k) || k.includes(league));
  return key ? LEAGUE_COLORS[key] : '#64748b';
}

function getLeagueGroupKey(league: string | null): 'catholic' | 'public' | 'interac' | 'independent' {
  if (!league) return 'independent';
  const l = league.toLowerCase();
  if (l.includes('catholic')) return 'catholic';
  if (l.includes('public')) return 'public';
  if (l.includes('inter') || l.includes('inter-ac')) return 'interac';
  return 'independent';
}

type ViewMode = 'cards' | 'league';

const MAIN_LEAGUES = [
  { key: 'catholic', name: 'Philadelphia Catholic League', color: '#f0a500' },
  { key: 'public', name: 'Philadelphia Public League', color: '#0a1628' },
  { key: 'interac', name: 'Inter-Academic League', color: '#16a34a' },
  { key: 'independent', name: 'Independent', color: '#64748b' },
];

export default function SchoolsDirectory({ schools, leagues, risingPrograms }: Props) {
  const [showAllSchools, setShowAllSchools] = useState(false);
  const [selectedLeagueKey, setSelectedLeagueKey] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  // Filter schools based on data availability
  const schoolsToShow = useMemo(() => {
    if (showAllSchools) return schools;
    return schools.filter(s => s.has_data);
  }, [schools, showAllSchools]);

  // Apply filters
  const filtered = useMemo(() => {
    let result = schoolsToShow;

    if (selectedLeagueKey) {
      result = result.filter(s => getLeagueGroupKey(s.league) === selectedLeagueKey);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          (s.league && s.league.toLowerCase().includes(q))
      );
    }

    if (selectedLetter) {
      result = result.filter(s => s.name.toUpperCase().startsWith(selectedLetter));
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [schoolsToShow, selectedLeagueKey, searchTerm, selectedLetter]);

  // Get available letters from filtered schools
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    schoolsToShow.forEach(s => {
      const letter = s.name.toUpperCase().charAt(0);
      if (/[A-Z]/.test(letter)) letters.add(letter);
    });
    return Array.from(letters).sort();
  }, [schoolsToShow]);

  // Group by league for league view
  const groupedByLeague = useMemo(() => {
    const groups: Record<string, SchoolData[]> = {};
    filtered.forEach(s => {
      const groupKey = getLeagueGroupKey(s.league);
      const displayName = MAIN_LEAGUES.find(l => l.key === groupKey)?.name || 'Other Leagues';
      if (!groups[displayName]) groups[displayName] = [];
      groups[displayName].push(s);
    });
    return Object.entries(groups).sort((a, b) => {
      const orderMap: Record<string, number> = {
        'Philadelphia Catholic League': 1,
        'Philadelphia Public League': 2,
        'Inter-Academic League': 3,
        'Independent': 4,
        'Other Leagues': 5,
      };
      return (orderMap[a[0]] || 99) - (orderMap[b[0]] || 99);
    });
  }, [filtered]);

  // Stats for league tiles
  const leagueStats = useMemo(() => {
    const stats: Record<string, number> = {};
    MAIN_LEAGUES.forEach(league => {
      stats[league.key] = schoolsToShow.filter(s => getLeagueGroupKey(s.league) === league.key).length;
    });
    return stats;
  }, [schoolsToShow]);

  return (
    <div className="espn-container" style={{ flex: 1 }}>
      <main>
        {/* Compact Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--psp-navy)', margin: '0 0 4px', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 0.5 }}>
            School Directory
          </h1>
          <p style={{ fontSize: 14, color: 'var(--g400)', margin: 0 }}>
            Browse Philadelphia-area high schools with complete historical data and statistics
          </p>
        </div>

        {/* League Browse Tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 32 }}>
          {MAIN_LEAGUES.map(league => (
            <button
              key={league.key}
              onClick={() => {
                setSelectedLeagueKey(selectedLeagueKey === league.key ? '' : league.key);
                setSelectedLetter('');
                setSearchTerm('');
              }}
              style={{
                background: selectedLeagueKey === league.key
                  ? league.color
                  : 'var(--surface, #fff)',
                border: selectedLeagueKey === league.key
                  ? 'none'
                  : `1px solid var(--g100)`,
                color: selectedLeagueKey === league.key ? '#fff' : 'var(--text)',
                padding: 16,
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all .2s',
                textAlign: 'left',
              }}
              onMouseEnter={e => {
                if (selectedLeagueKey !== league.key) {
                  (e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,.1)';
                  (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={e => {
                if (selectedLeagueKey !== league.key) {
                  (e.target as HTMLElement).style.boxShadow = 'none';
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                }
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", marginBottom: 4 }}>
                {league.name}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>
                {leagueStats[league.key]}
              </div>
              <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.8, marginTop: 4 }}>
                {leagueStats[league.key] === 1 ? 'school' : 'schools'}
              </div>
            </button>
          ))}
        </div>

        {/* Search & View Mode */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by name or city..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedLetter('');
            }}
            style={{
              flex: 1,
              minWidth: 200,
              padding: '10px 14px',
              fontSize: 13,
              border: '1px solid var(--g100)',
              borderRadius: 4,
              fontFamily: 'inherit',
              background: 'var(--surface, #fff)',
              color: 'var(--text, #333)',
            }}
          />

          <div style={{ display: 'flex', gap: 6 }}>
            {(['cards', 'league'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 4,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: viewMode === mode ? 'var(--psp-gold)' : 'var(--psp-navy)',
                  color: viewMode === mode ? 'var(--psp-navy)' : '#fff',
                  transition: '.15s',
                }}
              >
                {mode === 'cards' ? '📊 Cards' : '📂 By League'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAllSchools(!showAllSchools)}
            style={{
              padding: '10px 14px',
              borderRadius: 4,
              border: showAllSchools ? 'none' : '1px solid var(--g100)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              background: showAllSchools ? 'var(--psp-blue)' : 'var(--surface, #fff)',
              color: showAllSchools ? '#fff' : 'var(--text)',
              transition: '.15s',
            }}
          >
            {showAllSchools ? '✓ All Schools' : '↓ Show All'}
          </button>
        </div>

        {/* Alphabet Quick-Jump */}
        {!searchTerm && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--g400)', marginRight: 4 }}>Jump:</span>
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(letter => {
              const hasSchools = availableLetters.includes(letter);
              return (
                <button
                  key={letter}
                  onClick={() => {
                    setSelectedLetter(selectedLetter === letter ? '' : letter);
                    setSearchTerm('');
                  }}
                  disabled={!hasSchools}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 3,
                    border: selectedLetter === letter ? 'none' : '1px solid var(--g100)',
                    background: selectedLetter === letter
                      ? 'var(--psp-gold)'
                      : hasSchools
                        ? 'var(--surface, #fff)'
                        : 'var(--g100)',
                    color: selectedLetter === letter ? 'var(--psp-navy)' : 'var(--text)',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: hasSchools ? 'pointer' : 'default',
                    opacity: hasSchools ? 1 : 0.5,
                    transition: '.1s',
                  }}
                >
                  {letter}
                </button>
              );
            })}
            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter('')}
                style={{
                  marginLeft: 8,
                  padding: '4px 8px',
                  fontSize: 11,
                  color: 'var(--g400)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--g100)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--psp-navy)', margin: 0, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 0.5 }}>
            {viewMode === 'league' ? 'Schools by League' : 'Schools'}
          </h2>
          <span style={{ fontSize: 12, color: 'var(--g400)' }}>
            {filtered.length} {filtered.length === 1 ? 'school' : 'schools'} {showAllSchools && schoolsToShow.length < schools.length ? `of ${schoolsToShow.length} with data` : ''}
          </span>
        </div>

        {/* Cards View */}
        {viewMode === 'cards' && (
          <>
            {filtered.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 14,
                marginBottom: 16,
              }}>
                {filtered.map(school => (
                  <SchoolCard key={school.id} school={school} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--g400)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <p style={{ fontSize: 14, margin: 0 }}>
                  {searchTerm ? 'No schools match your search.' : selectedLetter ? `No schools starting with "${selectedLetter}".` : 'No schools found.'}
                </p>
              </div>
            )}
          </>
        )}

        {/* League View */}
        {viewMode === 'league' && (
          <>
            {groupedByLeague.length > 0 ? (
              groupedByLeague.map(([leagueName, leagueSchools]) => {
                const leagueConfig = MAIN_LEAGUES.find(l => l.name === leagueName);
                const leagueColor = leagueConfig?.color || '#64748b';
                return (
                  <div key={leagueName} style={{ marginBottom: 32 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 16,
                      paddingBottom: 12,
                      borderBottom: `3px solid ${leagueColor}`,
                    }}>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', background: leagueColor }} />
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--psp-navy)', fontFamily: "'Bebas Neue', sans-serif", margin: 0, letterSpacing: 0.5 }}>
                        {leagueName}
                      </h3>
                      <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--g400)', fontWeight: 600 }}>
                        {leagueSchools.length} {leagueSchools.length === 1 ? 'school' : 'schools'}
                      </span>
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                      gap: 14,
                    }}>
                      {leagueSchools.map(school => (
                        <SchoolCard key={school.id} school={school} />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--g400)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <p style={{ fontSize: 14, margin: 0 }}>No schools found matching your filters.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="widget">
          <div className="w-head">League Breakdown</div>
          <div className="w-body">
            {MAIN_LEAGUES.map(league => {
              const count = schoolsToShow.filter(s => getLeagueGroupKey(s.league) === league.key).length;
              return (
                <div
                  key={league.key}
                  onClick={() => {
                    setSelectedLeagueKey(selectedLeagueKey === league.key ? '' : league.key);
                    setSelectedLetter('');
                    setSearchTerm('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    borderBottom: '1px solid var(--g100)',
                    cursor: 'pointer',
                    background: selectedLeagueKey === league.key ? 'rgba(240, 165, 0, 0.1)' : 'transparent',
                    transition: '.1s',
                  }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: league.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', flex: 1 }}>{league.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--g400)', fontWeight: 600 }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="widget">
          <div className="w-head">Data Coverage</div>
          <div className="w-body" style={{ fontSize: 12, color: 'var(--text)' }}>
            <div style={{ marginBottom: 8 }}>
              <strong>{schoolsToShow.length}</strong> schools with real data
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>{schools.length}</strong> total in database
            </div>
            <p style={{ fontSize: 11, color: 'var(--g400)', margin: '12px 0 0' }}>
              {showAllSchools ? 'Showing all opponent-only schools' : 'Showing only schools with statistics and records'}
            </p>
          </div>
        </div>

        <div className="widget">
          <div className="w-head">Quick Links</div>
          <div className="w-body">
            <Link href="/football" className="w-link">↳ Football</Link>
            <Link href="/basketball" className="w-link">↳ Basketball</Link>
            <Link href="/baseball" className="w-link">↳ Baseball</Link>
            <Link href="/search" className="w-link">↳ Player Search</Link>
            <Link href="/compare" className="w-link">↳ Compare Players</Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ============ School Card Component ============

function SchoolCard({ school }: { school: SchoolData }) {
  const leagueColor = getLeagueColor(school.league);
  const primaryColor = school.colors && school.colors.startsWith('#') ? school.colors : leagueColor;
  const record = school.total_wins > 0 || school.total_losses > 0
    ? `${school.total_wins}-${school.total_losses}`
    : null;

  return (
    <Link href={`/football/schools/${school.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: 'var(--surface, #fff)',
        border: '1px solid var(--g100)',
        borderRadius: 6,
        overflow: 'hidden',
        transition: 'all .2s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.boxShadow = '0 8px 24px rgba(0,0,0,.12)';
        el.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.boxShadow = 'none';
        el.style.transform = 'translateY(0)';
      }}
      >
        {/* Header with School Color */}
        <div style={{
          background: primaryColor,
          padding: '12px 14px',
          color: '#fff',
          borderLeft: school.championships_count > 0 ? `4px solid var(--psp-gold)` : 'none',
        }}>
          <h3 style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: 0.3,
            lineHeight: 1.2,
          }}>
            {school.name}
          </h3>
        </div>

        {/* Body */}
        <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Location */}
          <div style={{ fontSize: 11, color: 'var(--g400)', marginBottom: 8 }}>
            {school.city}, {school.state}
          </div>

          {/* Sports Icons */}
          {school.sports.length > 0 && (
            <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
              {school.sports.map(sport => (
                <span key={sport} title={sport} style={{ fontSize: 16 }}>
                  {SPORT_EMOJI[sport] || '•'}
                </span>
              ))}
            </div>
          )}

          {/* League */}
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--psp-navy)', marginBottom: 8, textTransform: 'uppercase', opacity: 0.8 }}>
            {school.league || 'Independent'}
          </div>

          {/* Stats Row */}
          <div style={{ display: 'flex', gap: 12, marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--g100)' }}>
            {record && (
              <div>
                <div style={{ fontSize: 9, color: 'var(--g400)', textTransform: 'uppercase', fontWeight: 600 }}>Record</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--psp-navy)' }}>{record}</div>
              </div>
            )}
            {school.championships_count > 0 && (
              <div>
                <div style={{ fontSize: 9, color: 'var(--g400)', textTransform: 'uppercase', fontWeight: 600 }}>🏆</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--psp-gold)' }}>{school.championships_count}</div>
              </div>
            )}
            {school.award_count > 0 && !school.championships_count && (
              <div>
                <div style={{ fontSize: 9, color: 'var(--g400)', textTransform: 'uppercase', fontWeight: 600 }}>Awards</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--psp-blue)' }}>{school.award_count}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
