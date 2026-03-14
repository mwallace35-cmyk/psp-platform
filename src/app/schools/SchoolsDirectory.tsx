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
  secondary_color: string | null;
  championships_count: number;
  total_wins: number;
  total_losses: number;
  has_data: boolean;
  sports: string[];
  award_count: number;
  closed_year: number | null;
  player_count: number;
  pro_count: number;
  game_count: number;
  sport_count: number;
  win_pct: number | null;
}

interface RisingProgram {
  id: number;
  slug: string;
  name: string;
  league: string;
  recentTitles: number;
}

interface AggregateStats {
  totalSchools: number;
  totalPlayers: number;
  totalChampionships: number;
  totalPros: number;
  totalGames: number;
  totalAwards: number;
  yearsOfData: number;
}

interface Props {
  schools: SchoolData[];
  leagues: string[];
  risingPrograms: RisingProgram[];
  aggregateStats: AggregateStats;
  topSchools?: unknown[];
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

function getLeagueGroupKey(league: string | null, closedYear: number | null): 'catholic' | 'public' | 'interac' | 'independent' | 'closed' {
  if (closedYear) return 'closed';
  if (!league) return 'independent';
  const l = league.toLowerCase();
  if (l.includes('catholic')) return 'catholic';
  if (l.includes('public')) return 'public';
  if (l.includes('inter') || l.includes('inter-ac')) return 'interac';
  return 'independent';
}

type SortMode = 'alpha' | 'championships' | 'win_pct' | 'players' | 'pro' | 'games';
type ViewMode = 'cards' | 'league' | 'table';

const MAIN_LEAGUES = [
  { key: 'catholic', name: 'Catholic League', fullName: 'Philadelphia Catholic League', color: '#f0a500', icon: '⛪' },
  { key: 'public', name: 'Public League', fullName: 'Philadelphia Public League', color: '#1e40af', icon: '🏫' },
  { key: 'interac', name: 'Inter-Ac', fullName: 'Inter-Academic League', color: '#16a34a', icon: '🎓' },
];

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'alpha', label: 'A → Z' },
  { value: 'championships', label: 'Championships' },
  { value: 'win_pct', label: 'Win %' },
  { value: 'players', label: 'Most Players' },
  { value: 'pro', label: 'Pro Athletes' },
  { value: 'games', label: 'Most Games' },
];

export default function SchoolsDirectory({ schools, leagues, risingPrograms, aggregateStats }: Props) {
  const [selectedLeagueKey, setSelectedLeagueKey] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('league');
  const [sortMode, setSortMode] = useState<SortMode>('alpha');

  const schoolsToShow = useMemo(() => {
    return schools.filter(s => s.has_data);
  }, [schools]);

  const filtered = useMemo(() => {
    let result = schoolsToShow;

    if (selectedLeagueKey) {
      result = result.filter(s => getLeagueGroupKey(s.league, s.closed_year) === selectedLeagueKey);
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

    // Sort
    return [...result].sort((a, b) => {
      switch (sortMode) {
        case 'championships':
          return (b.championships_count - a.championships_count) || a.name.localeCompare(b.name);
        case 'win_pct':
          return ((b.win_pct ?? -1) - (a.win_pct ?? -1)) || a.name.localeCompare(b.name);
        case 'players':
          return (b.player_count - a.player_count) || a.name.localeCompare(b.name);
        case 'pro':
          return (b.pro_count - a.pro_count) || a.name.localeCompare(b.name);
        case 'games':
          return (b.game_count - a.game_count) || a.name.localeCompare(b.name);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [schoolsToShow, selectedLeagueKey, searchTerm, selectedLetter, sortMode]);

  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    schoolsToShow.forEach(s => {
      const letter = s.name.toUpperCase().charAt(0);
      if (/[A-Z]/.test(letter)) letters.add(letter);
    });
    return Array.from(letters).sort();
  }, [schoolsToShow]);

  const groupedByLeague = useMemo(() => {
    const groups: Record<string, SchoolData[]> = {};
    filtered.forEach(s => {
      const groupKey = getLeagueGroupKey(s.league, s.closed_year);
      const displayName = MAIN_LEAGUES.find(l => l.key === groupKey)?.fullName || 'Other Leagues';
      if (!groups[displayName]) groups[displayName] = [];
      groups[displayName].push(s);
    });
    return Object.entries(groups).sort((a, b) => {
      const orderMap: Record<string, number> = {
        'Philadelphia Catholic League': 1,
        'Philadelphia Public League': 2,
        'Inter-Academic League': 3,
        'Independent': 4,
        'Closed / Historic': 5,
        'Other Leagues': 6,
      };
      return (orderMap[a[0]] || 99) - (orderMap[b[0]] || 99);
    });
  }, [filtered]);

  const leagueStats = useMemo(() => {
    const stats: Record<string, { count: number; champs: number; pros: number; winPct: number | null }> = {};
    MAIN_LEAGUES.forEach(league => {
      const leagueSchools = schoolsToShow.filter(s => getLeagueGroupKey(s.league, s.closed_year) === league.key);
      const totalChamps = leagueSchools.reduce((sum, s) => sum + s.championships_count, 0);
      const totalPros = leagueSchools.reduce((sum, s) => sum + s.pro_count, 0);
      const withWinPct = leagueSchools.filter(s => s.win_pct !== null);
      const avgWinPct = withWinPct.length > 0
        ? Math.round(withWinPct.reduce((sum, s) => sum + (s.win_pct || 0), 0) / withWinPct.length * 10) / 10
        : null;
      stats[league.key] = { count: leagueSchools.length, champs: totalChamps, pros: totalPros, winPct: avgWinPct };
    });
    return stats;
  }, [schoolsToShow]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px' }}>
      {/* ========== HERO SECTION ========== */}
      <div style={{
        background: 'linear-gradient(135deg, var(--psp-navy) 0%, #0f2040 50%, #1a3060 100%)',
        borderRadius: 16,
        padding: '36px 32px 28px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 25% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 75% 50%, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: 40,
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 4px',
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: 1,
          }}>
            School Directory
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', margin: '0 0 24px', maxWidth: 600 }}>
            Explore every Philadelphia-area high school — championships, player stats, win records, and pro alumni spanning {aggregateStats.yearsOfData}+ years.
          </p>

          {/* Stats strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 16,
            maxWidth: 800,
          }}>
            {[
              { label: 'Schools', value: aggregateStats.totalSchools, icon: '🏫' },
              { label: 'Players', value: aggregateStats.totalPlayers, icon: '👤' },
              { label: 'Championships', value: aggregateStats.totalChampionships, icon: '🏆' },
              { label: 'Pro Athletes', value: aggregateStats.totalPros, icon: '⭐' },
              { label: 'Games', value: aggregateStats.totalGames, icon: '📊' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 10,
                padding: '12px 14px',
                backdropFilter: 'blur(4px)',
                borderLeft: '3px solid var(--psp-gold)',
              }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                  {stat.icon} {stat.label}
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--psp-gold)', fontFamily: "'Bebas Neue', sans-serif" }}>
                  {stat.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== LEAGUE TILES ========== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
        marginBottom: 28,
      }}>
        {MAIN_LEAGUES.map(league => {
          const stats = leagueStats[league.key];
          const isActive = selectedLeagueKey === league.key;
          return (
            <button
              key={league.key}
              onClick={() => {
                setSelectedLeagueKey(isActive ? '' : league.key);
                setSelectedLetter('');
                setSearchTerm('');
              }}
              style={{
                background: isActive
                  ? league.color
                  : 'var(--surface, #fff)',
                border: isActive ? 'none' : '1px solid var(--g100)',
                color: isActive ? '#fff' : 'var(--text)',
                padding: '14px 16px',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all .2s',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = league.color;
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--g100)';
                }
              }}
            >
              {/* Colored top accent */}
              {!isActive && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: league.color,
                }} />
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "'Bebas Neue', sans-serif",
                  letterSpacing: 0.3,
                }}>
                  {league.icon} {league.name}
                </div>
                <div style={{
                  fontSize: 22,
                  fontWeight: 800,
                  lineHeight: 1,
                  fontFamily: "'Bebas Neue', sans-serif",
                }}>
                  {stats?.count || 0}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 10, fontWeight: 600, opacity: 0.75 }}>
                {(stats?.champs || 0) > 0 && (
                  <span>🏆 {stats.champs}</span>
                )}
                {(stats?.pros || 0) > 0 && (
                  <span>⭐ {stats.pros}</span>
                )}
                {stats?.winPct !== null && (
                  <span>{stats.winPct}% avg</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ========== TOOLBAR: Search + Sort + View + Toggle ========== */}
      <div style={{
        display: 'flex',
        gap: 10,
        marginBottom: 16,
        alignItems: 'center',
        flexWrap: 'wrap',
        background: 'var(--surface, #fff)',
        border: '1px solid var(--g100)',
        borderRadius: 10,
        padding: '10px 14px',
      }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--g400)', pointerEvents: 'none' }}>🔍</span>
          <input
            type="text"
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setSelectedLetter(''); }}
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              fontSize: 13,
              border: '1px solid var(--g100)',
              borderRadius: 6,
              fontFamily: 'inherit',
              background: 'var(--surface, #fff)',
              color: 'var(--text, #333)',
              outline: 'none',
            }}
          />
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--g400)', whiteSpace: 'nowrap' }}>Sort:</span>
          <select
            value={sortMode}
            onChange={e => setSortMode(e.target.value as SortMode)}
            style={{
              padding: '8px 28px 8px 10px',
              fontSize: 12,
              border: '1px solid var(--g100)',
              borderRadius: 6,
              fontFamily: 'inherit',
              fontWeight: 600,
              background: 'var(--surface, #fff)',
              color: 'var(--text, #333)',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%2364748b' stroke-width='1.5'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
            }}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'var(--g100)' }} />

        {/* View mode */}
        <div style={{ display: 'flex', gap: 4 }}>
          {([
            { mode: 'cards' as ViewMode, label: '▦', title: 'Card View' },
            { mode: 'league' as ViewMode, label: '☰', title: 'League View' },
            { mode: 'table' as ViewMode, label: '▤', title: 'Table View' },
          ]).map(({ mode, label, title }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              title={title}
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                border: 'none',
                fontSize: 16,
                cursor: 'pointer',
                background: viewMode === mode ? 'var(--psp-gold)' : 'transparent',
                color: viewMode === mode ? 'var(--psp-navy)' : 'var(--g400)',
                transition: '.15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {label}
            </button>
          ))}
        </div>

      </div>

      {/* ========== ALPHABET QUICK-JUMP ========== */}
      {!searchTerm && sortMode === 'alpha' && (
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(letter => {
            const hasSchools = availableLetters.includes(letter);
            return (
              <button
                key={letter}
                onClick={() => { setSelectedLetter(selectedLetter === letter ? '' : letter); setSearchTerm(''); }}
                disabled={!hasSchools}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  border: selectedLetter === letter ? 'none' : '1px solid var(--g100)',
                  background: selectedLetter === letter ? 'var(--psp-gold)' : hasSchools ? 'var(--surface, #fff)' : 'transparent',
                  color: selectedLetter === letter ? 'var(--psp-navy)' : hasSchools ? 'var(--text)' : 'var(--g100)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: hasSchools ? 'pointer' : 'default',
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
              style={{ marginLeft: 4, padding: '4px 8px', fontSize: 11, color: 'var(--g400)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* ========== RESULTS HEADER ========== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--psp-navy)' }}>
          {filtered.length} {filtered.length === 1 ? 'school' : 'schools'}
          {selectedLeagueKey && ` in ${MAIN_LEAGUES.find(l => l.key === selectedLeagueKey)?.name}`}
          {selectedLetter && ` starting with ${selectedLetter}`}
          {sortMode !== 'alpha' && ` · sorted by ${SORT_OPTIONS.find(o => o.value === sortMode)?.label}`}
        </span>
        {(selectedLeagueKey || searchTerm || selectedLetter) && (
          <button
            onClick={() => { setSelectedLeagueKey(''); setSearchTerm(''); setSelectedLetter(''); }}
            style={{ fontSize: 11, color: 'var(--psp-blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ========== CARDS VIEW ========== */}
      {viewMode === 'cards' && (
        <>
          {filtered.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 14,
              marginBottom: 32,
            }}>
              {filtered.map((school, i) => (
                <SchoolCard key={school.id} school={school} rank={sortMode !== 'alpha' ? i + 1 : undefined} />
              ))}
            </div>
          ) : (
            <EmptyState searchTerm={searchTerm} selectedLetter={selectedLetter} />
          )}
        </>
      )}

      {/* ========== LEAGUE VIEW ========== */}
      {viewMode === 'league' && (
        <>
          {groupedByLeague.length > 0 ? (
            groupedByLeague.map(([leagueName, leagueSchools]) => {
              const leagueConfig = MAIN_LEAGUES.find(l => l.fullName === leagueName);
              const leagueColor = leagueConfig?.color || '#64748b';
              return (
                <div key={leagueName} style={{ marginBottom: 32 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 14,
                    paddingBottom: 10,
                    borderBottom: `3px solid ${leagueColor}`,
                  }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: leagueColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                    }}>
                      {leagueConfig?.icon || '🏫'}
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--psp-navy)', fontFamily: "'Bebas Neue', sans-serif", margin: 0, letterSpacing: 0.5 }}>
                      {leagueName}
                    </h3>
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--g400)', fontWeight: 600 }}>
                      {leagueSchools.length} {leagueSchools.length === 1 ? 'school' : 'schools'}
                    </span>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
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
            <EmptyState searchTerm={searchTerm} selectedLetter={selectedLetter} />
          )}
        </>
      )}

      {/* ========== TABLE VIEW ========== */}
      {viewMode === 'table' && (
        <>
          {filtered.length > 0 ? (
            <div style={{
              overflowX: 'auto',
              marginBottom: 32,
              border: '1px solid var(--g100)',
              borderRadius: 10,
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--psp-navy)', color: '#fff' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 0.5, fontSize: 12 }}>#</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 0.5, fontSize: 12 }}>School</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 0.5, fontSize: 12 }}>League</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 0.5, fontSize: 12 }}>Record</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 0.5, fontSize: 12 }}>Win %</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 0.5, fontSize: 12 }}>🏆</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 0.5, fontSize: 12 }}>Players</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 0.5, fontSize: 12 }}>Pros</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 0.5, fontSize: 12 }}>Games</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((school, i) => {
                    const record = school.total_wins > 0 || school.total_losses > 0
                      ? `${school.total_wins}-${school.total_losses}`
                      : '—';
                    const lcColor = getLeagueColor(school.league);
                    return (
                      <tr
                        key={school.id}
                        style={{
                          borderBottom: '1px solid var(--g100)',
                          transition: 'background .1s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,165,0,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        onClick={() => window.location.href = `/schools/${school.slug}`}
                      >
                        <td style={{ padding: '8px 14px', fontSize: 11, color: 'var(--g400)', fontWeight: 600 }}>{i + 1}</td>
                        <td style={{ padding: '8px 14px' }}>
                          <Link href={`/schools/${school.slug}`} style={{ textDecoration: 'none', color: 'var(--psp-navy)', fontWeight: 700 }}>
                            <span style={{
                              display: 'inline-block',
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: school.colors || lcColor,
                              marginRight: 8,
                              verticalAlign: 'middle',
                            }} />
                            {school.name}
                            {school.closed_year && <span style={{ fontSize: 10, color: 'var(--g400)', marginLeft: 4 }}>({school.closed_year})</span>}
                          </Link>
                        </td>
                        <td style={{ padding: '8px 14px', fontSize: 11, color: lcColor, fontWeight: 600 }}>{school.league || 'Ind.'}</td>
                        <td style={{ padding: '8px 14px', textAlign: 'center', fontWeight: 700, fontSize: 12 }}>{record}</td>
                        <td style={{
                          padding: '8px 14px',
                          textAlign: 'center',
                          fontWeight: 700,
                          fontSize: 12,
                          color: school.win_pct !== null
                            ? school.win_pct >= 60 ? '#16a34a' : school.win_pct >= 50 ? 'var(--psp-navy)' : '#dc2626'
                            : 'var(--g400)',
                        }}>
                          {school.win_pct !== null ? `${school.win_pct}%` : '—'}
                        </td>
                        <td style={{ padding: '8px 14px', textAlign: 'center', fontWeight: 800, color: school.championships_count > 0 ? '#b45309' : 'var(--g400)', fontSize: 13 }}>
                          {school.championships_count || '—'}
                        </td>
                        <td style={{ padding: '8px 14px', textAlign: 'center', fontSize: 12 }}>{school.player_count > 0 ? formatNumber(school.player_count) : '—'}</td>
                        <td style={{ padding: '8px 14px', textAlign: 'center', fontSize: 12, fontWeight: school.pro_count > 0 ? 700 : 400, color: school.pro_count > 0 ? 'var(--psp-blue)' : 'var(--g400)' }}>
                          {school.pro_count || '—'}
                        </td>
                        <td style={{ padding: '8px 14px', textAlign: 'center', fontSize: 12 }}>{school.game_count > 0 ? formatNumber(school.game_count) : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState searchTerm={searchTerm} selectedLetter={selectedLetter} />
          )}
        </>
      )}
    </div>
  );
}

// ============ Empty State ============

function EmptyState({ searchTerm, selectedLetter }: { searchTerm: string; selectedLetter: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--g400)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
      <p style={{ fontSize: 14, margin: 0 }}>
        {searchTerm ? 'No schools match your search.' : selectedLetter ? `No schools starting with "${selectedLetter}".` : 'No schools found.'}
      </p>
    </div>
  );
}

// ============ School Card Component ============

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function SchoolCard({ school, rank }: { school: SchoolData; rank?: number }) {
  const leagueColor = getLeagueColor(school.league);
  const primaryColor = school.colors && school.colors.startsWith('#') ? school.colors : leagueColor;
  const secondaryColor = school.secondary_color && school.secondary_color.startsWith('#') ? school.secondary_color : null;
  const isClosed = !!school.closed_year;
  const record = school.total_wins > 0 || school.total_losses > 0
    ? `${school.total_wins}-${school.total_losses}`
    : null;

  const hasRichData = school.player_count > 0 || school.game_count > 0 || school.pro_count > 0;

  return (
    <Link href={`/schools/${school.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: 'var(--surface, #fff)',
        border: isClosed ? '1px solid #d6d3d1' : '1px solid var(--g100)',
        borderRadius: 10,
        overflow: 'hidden',
        transition: 'all .2s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: isClosed ? 0.85 : 1,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.boxShadow = '0 8px 24px rgba(0,0,0,.12)';
        el.style.transform = 'translateY(-4px)';
        el.style.opacity = '1';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.boxShadow = 'none';
        el.style.transform = 'translateY(0)';
        el.style.opacity = isClosed ? '0.85' : '1';
      }}
      >
        {/* Header */}
        <div style={{
          background: isClosed
            ? `linear-gradient(135deg, ${primaryColor}cc, ${primaryColor}88)`
            : secondaryColor
              ? `linear-gradient(135deg, ${primaryColor} 60%, ${secondaryColor})`
              : primaryColor,
          padding: '14px 14px 12px',
          color: '#fff',
          position: 'relative',
          minHeight: 54,
        }}>
          {/* Championship gold stripe */}
          {school.championships_count > 0 && (
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--psp-gold)' }} />
          )}

          {/* Rank badge */}
          {rank !== undefined && rank <= 20 && (
            <div style={{
              position: 'absolute',
              top: 8,
              left: school.championships_count > 0 ? 12 : 8,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 800,
              color: '#fff',
              backdropFilter: 'blur(4px)',
            }}>
              {rank}
            </div>
          )}

          <h3 style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'Bebas Neue', sans-serif",
            letterSpacing: 0.5,
            lineHeight: 1.2,
            paddingLeft: rank !== undefined && rank <= 20 ? 28 : 0,
            paddingRight: isClosed ? 70 : 0,
            textShadow: '0 1px 2px rgba(0,0,0,.3)',
          }}>
            {school.name}
          </h3>

          <div style={{
            fontSize: 10,
            opacity: 0.85,
            marginTop: 3,
            fontWeight: 500,
            textShadow: '0 1px 1px rgba(0,0,0,.2)',
            paddingLeft: rank !== undefined && rank <= 20 ? 28 : 0,
          }}>
            {school.city}{school.city && school.state ? ', ' : ''}{school.state}
          </div>

          {isClosed && (
            <span style={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontSize: 8,
              fontWeight: 700,
              background: 'rgba(0,0,0,0.45)',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: 3,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}>
              Closed {school.closed_year}
            </span>
          )}

          {school.pro_count > 0 && (
            <span style={{
              position: 'absolute',
              bottom: 6,
              right: 8,
              fontSize: 9,
              fontWeight: 700,
              background: 'rgba(255,255,255,0.25)',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: 3,
              backdropFilter: 'blur(4px)',
            }}>
              ⭐ {school.pro_count} Pro{school.pro_count !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '10px 14px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* League + Sports Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: leagueColor,
              textTransform: 'uppercase',
              letterSpacing: 0.3,
              lineHeight: 1,
            }}>
              {school.league || 'Independent'}
            </div>
            {school.sports.length > 0 && (
              <div style={{ display: 'flex', gap: 3 }}>
                {school.sports.map(sport => (
                  <span key={sport} title={sport.charAt(0).toUpperCase() + sport.slice(1)} style={{ fontSize: 14 }}>
                    {SPORT_EMOJI[sport] || '•'}
                  </span>
                ))}
                {school.sport_count > school.sports.length && (
                  <span style={{ fontSize: 10, color: 'var(--g400)', fontWeight: 600, lineHeight: '14px' }}>
                    +{school.sport_count - school.sports.length}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Win Percentage Bar */}
          {school.win_pct !== null && record && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: 'var(--g400)', fontWeight: 600, textTransform: 'uppercase' }}>All-Time</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--psp-navy)' }}>
                  {record} <span style={{ fontSize: 10, fontWeight: 600, color: school.win_pct >= 60 ? '#16a34a' : school.win_pct >= 50 ? 'var(--psp-navy)' : '#dc2626' }}>({school.win_pct}%)</span>
                </span>
              </div>
              <div style={{ height: 4, background: 'var(--g100)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(school.win_pct, 100)}%`,
                  background: school.win_pct >= 60 ? '#16a34a' : school.win_pct >= 50 ? 'var(--psp-blue)' : '#dc2626',
                  borderRadius: 2,
                  transition: 'width .3s',
                }} />
              </div>
            </div>
          )}

          {/* Stat Pills */}
          {hasRichData && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto', paddingTop: 6 }}>
              {school.championships_count > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  padding: '3px 8px', borderRadius: 4,
                  background: 'rgba(240, 165, 0, 0.12)',
                  fontSize: 10, fontWeight: 700, color: '#b45309',
                }}>
                  🏆 {school.championships_count}
                </span>
              )}
              {school.player_count > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  padding: '3px 8px', borderRadius: 4,
                  background: 'rgba(59, 130, 246, 0.08)',
                  fontSize: 10, fontWeight: 700, color: 'var(--psp-blue)',
                }}>
                  {formatNumber(school.player_count)} players
                </span>
              )}
              {school.game_count > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  padding: '3px 8px', borderRadius: 4,
                  background: 'rgba(10, 22, 40, 0.06)',
                  fontSize: 10, fontWeight: 700, color: 'var(--psp-navy)',
                }}>
                  {formatNumber(school.game_count)} games
                </span>
              )}
              {school.award_count > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  padding: '3px 8px', borderRadius: 4,
                  background: 'rgba(124, 58, 237, 0.08)',
                  fontSize: 10, fontWeight: 700, color: '#7c3aed',
                }}>
                  {formatNumber(school.award_count)} awards
                </span>
              )}
            </div>
          )}

          {/* No-data fallback */}
          {!hasRichData && !record && (
            <div style={{ fontSize: 11, color: 'var(--g400)', fontStyle: 'italic', marginTop: 'auto' }}>
              Opponent record only
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
