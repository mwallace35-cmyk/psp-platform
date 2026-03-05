'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const SPORT_EMOJI: Record<string, { emoji: string; name: string }> = {
  football: { emoji: '🏈', name: 'Football' },
  basketball: { emoji: '🏀', name: 'Basketball' },
  baseball: { emoji: '⚾', name: 'Baseball' },
  'track-field': { emoji: '🏃', name: 'Track' },
  lacrosse: { emoji: '🥍', name: 'Lacrosse' },
  wrestling: { emoji: '🤼', name: 'Wrestling' },
  soccer: { emoji: '⚽', name: 'Soccer' },
};

interface School {
  id: number;
  slug: string;
  name: string;
  short_name?: string;
  city?: string;
  state?: string;
  mascot?: string;
  colors?: { primary?: string; secondary?: string } | null;
  logo_url?: string | null;
  address?: string | null;
  leagues?: { name: string; short_name?: string } | null;
  championships_count: number;
  active_sports?: string[];
  principal?: string | null;
  athletic_director?: string | null;
  enrollment?: number | null;
  school_type?: string | null;
}

interface League {
  name: string;
  count: number;
}

interface SchoolsGridProps {
  schools: School[];
  leagues: League[];
  leagueColors: Record<string, string>;
}

export default function SchoolsGrid({ schools, leagues, leagueColors }: SchoolsGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedSport, setSelectedSport] = useState('');

  // Get all unique sports across all schools
  const allSports = useMemo(() => {
    const sportSet = new Set<string>();
    schools.forEach((s) => {
      (s.active_sports ?? []).forEach((sp) => sportSet.add(sp));
    });
    return Array.from(sportSet).sort((a, b) => {
      const order = ['football', 'basketball', 'baseball', 'lacrosse', 'soccer', 'track-field', 'wrestling'];
      return order.indexOf(a) - order.indexOf(b);
    });
  }, [schools]);

  const filtered = useMemo(() => {
    let result = schools;

    if (selectedLeague) {
      result = result.filter((s) => s.leagues?.name === selectedLeague);
    }

    if (selectedSport) {
      result = result.filter((s) => (s.active_sports ?? []).includes(selectedSport));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          (s.city && s.city.toLowerCase().includes(term)) ||
          (s.mascot && s.mascot.toLowerCase().includes(term)) ||
          (s.short_name && s.short_name.toLowerCase().includes(term))
      );
    }

    return result;
  }, [schools, searchTerm, selectedLeague, selectedSport]);

  return (
    <>
      {/* Sport Filter Pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedSport('')}
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            border: 'none',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            background: !selectedSport ? 'var(--psp-gold)' : 'var(--g100)',
            color: !selectedSport ? '#0a1628' : 'var(--text)',
            transition: 'all .15s',
          }}
        >
          All Sports
        </button>
        {allSports.map((sport) => {
          const meta = SPORT_EMOJI[sport];
          const isActive = selectedSport === sport;
          return (
            <button
              key={sport}
              onClick={() => setSelectedSport(isActive ? '' : sport)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                background: isActive ? 'var(--psp-gold)' : 'var(--g100)',
                color: isActive ? '#0a1628' : 'var(--text)',
                transition: 'all .15s',
              }}
            >
              {meta?.emoji} {meta?.name || sport}
            </button>
          );
        })}
      </div>

      {/* Search + League Filter */}
      <div className="filter-bar" style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search schools, cities, or mascots..."
          className="filter-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 6, border: '1px solid var(--g200)', fontSize: 14, background: 'var(--card-bg)', color: 'var(--text)' }}
        />
        <select
          className="filter-select"
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid var(--g200)', fontSize: 14, background: 'var(--card-bg)', color: 'var(--text)' }}
        >
          <option value="">All Leagues ({schools.length})</option>
          {leagues.map((league) => (
            <option key={league.name} value={league.name}>
              {league.name} ({league.count})
            </option>
          ))}
        </select>
      </div>

      {/* Section header */}
      <div className="sec-head" style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>School Directory</h2>
        <span style={{ fontSize: 11, color: 'var(--g400)', marginLeft: 'auto' }}>
          {filtered.length} {filtered.length === 1 ? 'school' : 'schools'}
        </span>
      </div>

      {/* School Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {filtered.map((school) => {
          const leagueName = school.leagues?.name || 'Unknown';
          const leagueColor = leagueColors[leagueName] || '#666';
          const primaryColor = school.colors?.primary || leagueColor;
          const secondaryColor = school.colors?.secondary || '#222';
          const sports = school.active_sports ?? [];

          return (
            <Link
              key={school.id}
              href={`/schools/${school.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--g100)',
                  borderRadius: 8,
                  overflow: 'hidden',
                  transition: 'box-shadow .15s, transform .15s',
                  cursor: 'pointer',
                }}
                className="school-card"
              >
                {/* Header with school colors */}
                <div
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 60%, ${secondaryColor} 100%)`,
                    padding: '12px 14px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    minHeight: 56,
                  }}
                >
                  {school.logo_url ? (
                    <div style={{
                      width: 40, height: 40, borderRadius: 6, background: 'rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden',
                    }}>
                      <img src={school.logo_url} alt={`${school.name} logo`} width={34} height={34} style={{ objectFit: 'contain' }} loading="lazy" />
                    </div>
                  ) : (
                    <div style={{
                      width: 40, height: 40, borderRadius: 6, background: 'rgba(255,255,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      fontSize: 16, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif",
                    }}>
                      {(school.short_name || school.name.charAt(0)).substring(0, 3)}
                    </div>
                  )}

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 style={{
                      margin: 0, fontSize: 15, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif",
                      letterSpacing: '0.02em', lineHeight: 1.2, textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {school.name}
                    </h3>
                    {school.mascot && (
                      <div style={{ fontSize: 11, opacity: 0.85, marginTop: 1, textShadow: '0 1px 1px rgba(0,0,0,0.2)' }}>
                        {school.mascot}
                      </div>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: leagueColor, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: 'var(--g400)' }}>{leagueName}</span>
                    {school.school_type && (
                      <span style={{ fontSize: 10, color: 'var(--g300)', textTransform: 'capitalize', marginLeft: 'auto' }}>
                        {school.school_type}
                      </span>
                    )}
                  </div>

                  {school.city && (
                    <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 6 }}>
                      {school.city}{school.state ? `, ${school.state}` : ''}
                      {school.enrollment && <span style={{ color: 'var(--g400)', marginLeft: 6 }}>({school.enrollment.toLocaleString()} students)</span>}
                    </div>
                  )}

                  {/* Sport badges */}
                  {sports.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                      {sports.map((sp) => {
                        const meta = SPORT_EMOJI[sp];
                        return (
                          <span
                            key={sp}
                            title={meta?.name || sp}
                            style={{
                              fontSize: 14,
                              lineHeight: 1,
                              padding: '2px 4px',
                              borderRadius: 4,
                              background: 'var(--g50, rgba(0,0,0,0.05))',
                            }}
                          >
                            {meta?.emoji || '🏅'}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Stats row */}
                  <div style={{ display: 'flex', gap: 16, paddingTop: 8, borderTop: '1px solid var(--g100)' }}>
                    <div>
                      <div style={{ fontSize: 9, color: 'var(--g400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Titles</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: school.championships_count > 0 ? 'var(--psp-gold)' : 'var(--g300)', fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {school.championships_count}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: 'var(--g400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sports</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: "'Barlow Condensed', sans-serif" }}>
                        {sports.length}
                      </div>
                    </div>
                    {school.colors && (
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--g400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Colors</div>
                        <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
                          <div style={{ width: 14, height: 14, borderRadius: 3, background: school.colors.primary || '#666', border: '1px solid var(--g200)' }} />
                          <div style={{ width: 14, height: 14, borderRadius: 3, background: school.colors.secondary || '#999', border: '1px solid var(--g200)' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--g400)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>&#128270;</div>
          <p>No schools match your search. Try adjusting your filters.</p>
        </div>
      )}

      <style jsx>{`
        .school-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,.15);
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
}
