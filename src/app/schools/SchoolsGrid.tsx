'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface School {
  id: number;
  slug: string;
  name: string;
  short_name?: string;
  city?: string;
  state?: string;
  mascot?: string;
  leagues?: { name: string; short_name?: string } | null;
  championships_count: number;
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

  const filtered = useMemo(() => {
    let result = schools;

    if (selectedLeague) {
      result = result.filter((s) => s.leagues?.name === selectedLeague);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          (s.city && s.city.toLowerCase().includes(term)) ||
          (s.mascot && s.mascot.toLowerCase().includes(term))
      );
    }

    return result;
  }, [schools, searchTerm, selectedLeague]);

  return (
    <>
      {/* Filters */}
      <div className="filter-bar" style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search schools or cities..."
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 12,
          marginBottom: 16,
        }}
      >
        {filtered.map((school) => {
          const leagueName = school.leagues?.name || 'Unknown';
          const color = leagueColors[leagueName] || '#666';

          return (
            <Link
              key={school.id}
              href={`/football/schools/${school.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--g100)',
                  borderRadius: 6,
                  overflow: 'hidden',
                  transition: 'box-shadow .15s, transform .15s',
                  cursor: 'pointer',
                }}
                className="school-card"
              >
                {/* League color header */}
                <div style={{ background: color, padding: '10px 14px', color: '#fff' }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}>
                    {school.name}
                  </h3>
                </div>

                {/* Body */}
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, color: 'var(--g400)', marginBottom: 4 }}>
                    {leagueName}
                  </div>
                  {school.city && (
                    <div style={{ fontSize: 12, color: 'var(--text)', marginBottom: 8 }}>
                      {school.city}{school.state ? `, ${school.state}` : ''}
                    </div>
                  )}

                  {/* Stats row */}
                  <div style={{ display: 'flex', gap: 16, paddingTop: 8, borderTop: '1px solid var(--g100)' }}>
                    <div>
                      <div style={{ fontSize: 9, color: 'var(--g400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Titles</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: school.championships_count > 0 ? 'var(--psp-gold)' : 'var(--g300)', fontFamily: "'Bebas Neue', sans-serif" }}>
                        {school.championships_count}
                      </div>
                    </div>
                    {school.mascot && (
                      <div>
                        <div style={{ fontSize: 9, color: 'var(--g400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mascot</div>
                        <div style={{ fontSize: 12, color: 'var(--text)', marginTop: 2 }}>
                          {school.mascot}
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
          box-shadow: 0 2px 12px rgba(0,0,0,.1);
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}
