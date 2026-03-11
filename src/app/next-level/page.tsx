'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEffect } from 'react';
import AdPlaceholder from '@/components/ads/AdPlaceholder';
import { createProAthleteSlug } from '@/lib/slug-utils';

interface ProAthlete {
  id: number;
  person_name: string;
  high_school_id: number | null;
  sport_id: string | null;
  pro_team: string | null;
  pro_league: string | null;
  draft_info: string | null;
  college: string | null;
  status: string;
  schools?: {
    name: string;
    slug: string;
  } | null;
}

async function fetchProAthletes(league?: string, search?: string): Promise<ProAthlete[]> {
  try {
    const params = new URLSearchParams();
    if (league && league !== 'all') params.append('league', league);
    if (search) params.append('search', search);

    const response = await fetch(`/api/next-level?${params.toString()}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.athletes || [];
  } catch (error) {
    console.error('Error fetching pro athletes:', error);
    return [];
  }
}

async function fetchProAthleteStats() {
  try {
    const response = await fetch('/api/next-level/stats');
    if (!response.ok) return { nfl: 0, nba: 0, mlb: 0, wnba: 0, total: 0 };
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { nfl: 0, nba: 0, mlb: 0, wnba: 0, total: 0 };
  }
}

interface ProAthleteGridProps {
  athletes: ProAthlete[];
  selectedLeague: string;
}

function ProAthleteGrid({ athletes, selectedLeague }: ProAthleteGridProps) {
  const leagueColors: Record<string, string> = {
    NFL: '#003da5',
    NBA: '#c4122e',
    MLB: '#002d72',
    WNBA: '#552583',
  };

  const sportEmojis: Record<string, string> = {
    football: '🏈',
    basketball: '🏀',
    baseball: '⚾',
    soccer: '⚽',
    lacrosse: '🥍',
  };

  const filteredAthletes = selectedLeague === 'all'
    ? athletes
    : athletes.filter((a) => a.pro_league === selectedLeague);

  if (filteredAthletes.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: 'var(--g400)',
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No athletes found</div>
        <div style={{ fontSize: 13 }}>Try adjusting your filters or search term</div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
        marginBottom: 24,
      }}
    >
      {filteredAthletes.map((athlete) => {
        const leagueColor = leagueColors[athlete.pro_league || ''] || '#0a1628';
        const sportEmoji = sportEmojis[athlete.sport_id?.toLowerCase() || ''] || '🏆';
        const athleteSlug = createProAthleteSlug(athlete.person_name, athlete.id);

        return (
          <Link
            key={athlete.id}
            href={`/next-level/${athleteSlug}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div
              style={{
                background: '#fff',
                border: '1px solid var(--g100)',
                borderRadius: 8,
                overflow: 'hidden',
                transition: 'all .2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,.08)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {/* Header */}
              <div
                style={{
                  background: leagueColor,
                  padding: '12px 16px',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 20 }}>{sportEmoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "'Bebas Neue', sans-serif",
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {athlete.person_name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '12px 16px' }}>
                {/* HS & Sport */}
                <div style={{ fontSize: 11, color: 'var(--g400)', marginBottom: 12 }}>
                  {athlete.schools?.name || 'Unknown School'} •{' '}
                  {athlete.sport_id || 'Unknown'}
                </div>

                {/* Pro Info */}
                <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--g100)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                    {athlete.pro_team || 'Unknown Team'}
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      background: leagueColor,
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {athlete.pro_league || 'N/A'}
                  </div>
                </div>

                {/* College or Draft Info */}
                {athlete.college && (
                  <div style={{ fontSize: 11, color: 'var(--text)', marginBottom: 8 }}>
                    <div style={{ color: 'var(--g400)', fontSize: 9, marginBottom: 2 }}>
                      COLLEGE
                    </div>
                    <div style={{ fontWeight: 600 }}>{athlete.college}</div>
                  </div>
                )}

                {athlete.draft_info && (
                  <div style={{ fontSize: 10, color: 'var(--g400)', fontStyle: 'italic' }}>
                    {athlete.draft_info}
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function NextLevelPage() {
  const [athletes, setAthletes] = useState<ProAthlete[]>([]);
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ nfl: 0, nba: 0, mlb: 0, wnba: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [athletesData, statsData] = await Promise.all([
        fetchProAthletes(selectedLeague, searchTerm),
        fetchProAthleteStats(),
      ]);
      setAthletes(athletesData);
      setStats(statsData);
      setLoading(false);
    };

    const debounceTimer = setTimeout(loadData, searchTerm ? 300 : 0);
    return () => clearTimeout(debounceTimer);
  }, [selectedLeague, searchTerm]);

  // Calculate filtered counts
  const nflCount = athletes.filter((a) => a.pro_league === 'NFL').length || stats.nfl;
  const nbaCount = athletes.filter((a) => a.pro_league === 'NBA').length || stats.nba;
  const mlbCount = athletes.filter((a) => a.pro_league === 'MLB').length || stats.mlb;
  const wnbaCount = athletes.filter((a) => a.pro_league === 'WNBA').length || stats.wnba;

  // Top producer schools
  const schoolCounts: Record<string, number> = {};
  athletes.forEach((athlete) => {
    if (athlete.schools?.name) {
      schoolCounts[athlete.schools.name] = (schoolCounts[athlete.schools.name] || 0) + 1;
    }
  });

  const topSchools = Object.entries(schoolCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="espn-container" style={{ flex: 1 }}>
      <main>
        {/* Hero Card */}
        <div className="hero-card">
          <div className="hero-tag">Next Level</div>
          <div
            className="hero-img"
            style={{
              background: 'linear-gradient(180deg,#1a365d 0%,rgba(10,22,40,.95) 100%)',
            }}
          >
            <div>
              <h2>Philly Pro Athletes</h2>
              <div className="hero-sub">
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--psp-gold)' }}>
                  {stats.total || athletes.length}
                </span>{' '}
                high school alumni playing professional sports
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ marginBottom: 24 }}>
          {/* League Tabs */}
          <div className="subnav" style={{ background: 'transparent', borderBottom: 'none', padding: 0, margin: '16px 0 0 0' }}>
            <div className="subnav-inner" style={{ padding: 0, gap: 0 }}>
              {['all', 'NFL', 'NBA', 'MLB', 'WNBA'].map((league) => {
                const count =
                  league === 'all'
                    ? stats.total
                    : league === 'NBA'
                      ? nbaCount
                      : league === 'NFL'
                        ? nflCount
                        : league === 'MLB'
                          ? mlbCount
                          : wnbaCount;

                return (
                  <button
                    key={league}
                    onClick={() => setSelectedLeague(league)}
                    style={{
                      padding: '12px 20px',
                      fontSize: 13,
                      fontWeight: 600,
                      color: selectedLeague === league ? 'var(--psp-gold)' : 'var(--g500)',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: selectedLeague === league ? '3px solid var(--psp-gold)' : '3px solid transparent',
                      cursor: 'pointer',
                      transition: '.15s',
                    }}
                  >
                    {league === 'all' ? 'All' : league} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search */}
          <div style={{ marginTop: 16 }}>
            <input
              type="text"
              placeholder="Search athletes by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 6,
                border: '1px solid var(--g200)',
                background: '#fff',
                fontSize: 13,
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Section Header */}
        <div className="sec-head">
          <h2>Professional Athletes</h2>
          <span style={{ fontSize: 11, color: 'var(--g400)', marginLeft: 'auto' }}>
            {selectedLeague === 'all'
              ? athletes.length
              : athletes.filter((a) => a.pro_league === selectedLeague).length}{' '}
            athletes
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
              marginBottom: 24,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  background: 'var(--g100)',
                  borderRadius: 8,
                  height: 220,
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))}
          </div>
        )}

        {/* Athlete Cards Grid */}
        {!loading && (
          <ProAthleteGrid athletes={athletes} selectedLeague={selectedLeague} />
        )}
      </main>

      {/* Sidebar */}
      <aside className="sidebar">
        {/* Overview Stats */}
        <div className="widget">
          <div className="w-head">Pro Athletes Summary</div>
          <div className="w-body">
            <div className="w-row">
              <span className="name">Total Athletes</span>
              <span className="val">{stats.total}</span>
            </div>
            <div className="w-row">
              <span className="name">NFL Players</span>
              <span className="val">{nflCount}</span>
            </div>
            <div className="w-row">
              <span className="name">NBA Players</span>
              <span className="val">{nbaCount}</span>
            </div>
            <div className="w-row">
              <span className="name">MLB Players</span>
              <span className="val">{mlbCount}</span>
            </div>
            <div className="w-row">
              <span className="name">WNBA Players</span>
              <span className="val">{wnbaCount}</span>
            </div>
          </div>
        </div>

        {/* Top Producer Schools */}
        {topSchools.length > 0 && (
          <div className="widget">
            <div className="w-head">Top Producer Schools</div>
            <div className="w-body">
              {topSchools.map(([school, count], idx) => (
                <div key={school} className="w-row">
                  <span className={`rank ${idx < 3 ? 'top' : ''}`}>{idx + 1}</span>
                  <span className="name">{school}</span>
                  <span className="val">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notable Info */}
        <div className="widget">
          <div className="w-head">Notable Achievements</div>
          <div className="w-body">
            <div style={{ padding: '10px 14px', fontSize: 11, lineHeight: 1.6, color: 'var(--text)' }}>
              <div style={{ marginBottom: 8 }}>
                <strong>🏆 Hall of Famers:</strong> Wilt Chamberlain, Kobe Bryant, Mike Piazza, Reggie Jackson
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>🏀 NBA Pipeline:</strong> Roman Catholic & Neumann-Goretti lead historically
              </div>
              <div>
                <strong>🏈 SJP Dominance:</strong> St. Joseph's Prep leads NFL production
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="widget">
          <div className="w-head">Quick Links</div>
          <div className="w-body">
            <Link href="/football" className="w-link">
              ↦ Football
            </Link>
            <Link href="/basketball" className="w-link">
              ↦ Basketball
            </Link>
            <Link href="/baseball" className="w-link">
              ↦ Baseball
            </Link>
            <Link href="/search" className="w-link">
              ↦ Player Search
            </Link>
          </div>
        </div>

        {/* Ad Space */}
        <AdPlaceholder size="sidebar-rect" id="psp-nextlevel-rail" />
      </aside>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
