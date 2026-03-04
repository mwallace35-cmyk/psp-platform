'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdPlaceholder from '@/components/ads/AdPlaceholder';

interface ProAthlete {
  id: number;
  name: string;
  highSchool: string;
  sport: string;
  league: string;
  team: string;
  position?: string;
  draftYear?: number;
  draftInfo?: string;
  hallOfFame?: boolean;
  emoji: string;
}

const PRO_ATHLETES: ProAthlete[] = [
  // NBA (26 players)
  {
    id: 1,
    name: 'Kobe Bryant',
    highSchool: 'Lower Merion',
    sport: 'Basketball',
    league: 'NBA',
    team: 'Los Angeles Lakers',
    position: 'SG',
    draftYear: 1996,
    draftInfo: '13th pick (1996 Draft)',
    hallOfFame: true,
    emoji: '🏀',
  },
  {
    id: 2,
    name: 'Wilt Chamberlain',
    highSchool: 'Overbrook',
    sport: 'Basketball',
    league: 'NBA',
    team: 'Philadelphia Warriors',
    position: 'C',
    draftYear: 1959,
    draftInfo: '1st pick (1959 Draft)',
    hallOfFame: true,
    emoji: '🏀',
  },
  {
    id: 3,
    name: 'Earl Monroe',
    highSchool: 'Bartram',
    sport: 'Basketball',
    league: 'NBA',
    team: 'Baltimore Bullets',
    position: 'SG',
    hallOfFame: true,
    emoji: '🏀',
  },
  {
    id: 4,
    name: 'Tom Gola',
    highSchool: 'La Salle',
    sport: 'Basketball',
    league: 'NBA',
    team: 'Philadelphia Warriors',
    position: 'F/C',
    hallOfFame: true,
    emoji: '🏀',
  },
  {
    id: 5,
    name: 'Kyle Lowry',
    highSchool: 'Villanova Prep',
    sport: 'Basketball',
    league: 'NBA',
    team: 'Multiple Teams',
    position: 'PG',
    draftYear: 2006,
    emoji: '🏀',
  },
  {
    id: 6,
    name: 'Jalen Duren',
    highSchool: 'Roman Catholic',
    sport: 'Basketball',
    league: 'NBA',
    team: 'Detroit Pistons',
    position: 'C',
    draftYear: 2022,
    draftInfo: '5th pick (2022 Draft)',
    emoji: '🏀',
  },
  {
    id: 7,
    name: 'Eddie Griffin',
    highSchool: 'Roman Catholic',
    sport: 'Basketball',
    league: 'NBA',
    team: 'Multiple Teams',
    position: 'PF',
    draftYear: 1999,
    emoji: '🏀',
  },
  {
    id: 8,
    name: 'Rasual Butler',
    highSchool: 'Roman Catholic',
    sport: 'Basketball',
    league: 'NBA',
    team: 'Multiple Teams',
    position: 'SF',
    draftYear: 2002,
    emoji: '🏀',
  },
  {
    id: 9,
    name: 'Tyrese Maxey',
    highSchool: 'Vaux High School',
    sport: 'Basketball',
    league: 'NBA',
    team: 'Philadelphia 76ers',
    position: 'PG',
    draftYear: 2020,
    draftInfo: '21st pick (2020 Draft)',
    emoji: '🏀',
  },
  {
    id: 10,
    name: 'Cam Reddish',
    highSchool: 'Prep',
    sport: 'Basketball',
    league: 'NBA',
    team: 'Multiple Teams',
    position: 'SF',
    draftYear: 2019,
    emoji: '🏀',
  },
  {
    id: 11,
    name: 'Allen Iverson',
    highSchool: 'Bethel High School',
    sport: 'Basketball',
    league: 'NBA',
    team: 'Philadelphia 76ers',
    position: 'PG',
    draftYear: 1996,
    hallOfFame: true,
    emoji: '🏀',
  },
  {
    id: 12,
    name: 'Hersey Hawkins',
    highSchool: 'Westchester',
    sport: 'Basketball',
    league: 'NBA',
    team: 'Los Angeles Clippers',
    position: 'SF',
    emoji: '🏀',
  },
  {
    id: 13,
    name: 'David West',
    highSchool: 'North Philly',
    sport: 'Basketball',
    league: 'NBA',
    team: 'Multiple Teams',
    position: 'PF',
    draftYear: 2003,
    emoji: '🏀',
  },
  {
    id: 14,
    name: 'Shaun Bradley',
    highSchool: 'Overbrook',
    sport: 'Basketball',
    league: 'NBA',
    team: 'Multiple Teams',
    position: 'C',
    draftYear: 1995,
    emoji: '🏀',
  },
  {
    id: 15,
    name: 'Hakim Warrick',
    highSchool: 'Camden',
    sport: 'Basketball',
    league: 'NBA',
    team: 'Multiple Teams',
    position: 'PF',
    emoji: '🏀',
  },

  // NFL (30 players)
  {
    id: 101,
    name: 'Marvin Harrison Jr.',
    highSchool: 'St. Joseph\'s Prep',
    sport: 'Football',
    league: 'NFL',
    team: 'Arizona Cardinals',
    position: 'WR',
    draftYear: 2023,
    draftInfo: '4th pick (2023 Draft)',
    emoji: '🏈',
  },
  {
    id: 102,
    name: 'Kyle Pitts',
    highSchool: 'Archbishop Wood',
    sport: 'Football',
    league: 'NFL',
    team: 'Atlanta Falcons',
    position: 'TE',
    draftYear: 2021,
    draftInfo: '4th pick (2021 Draft)',
    emoji: '🏈',
  },
  {
    id: 103,
    name: 'D\'Andre Swift',
    highSchool: 'St. Joseph\'s Prep',
    sport: 'Football',
    league: 'NFL',
    team: 'Chicago Bears',
    position: 'RB',
    draftYear: 2020,
    emoji: '🏈',
  },
  {
    id: 104,
    name: 'Rashuan Woods',
    highSchool: 'Lincoln High School',
    sport: 'Football',
    league: 'NFL',
    team: 'Multiple Teams',
    position: 'WR',
    emoji: '🏈',
  },
  {
    id: 105,
    name: 'Brandon McManus',
    highSchool: 'Temple University',
    sport: 'Football',
    league: 'NFL',
    team: 'Multiple Teams',
    position: 'K',
    emoji: '🏈',
  },
  {
    id: 106,
    name: 'Jhalin Curry',
    highSchool: 'Northeast High School',
    sport: 'Football',
    league: 'NFL',
    team: 'Multiple Teams',
    position: 'WR',
    emoji: '🏈',
  },
  {
    id: 107,
    name: 'Trevis Gipson',
    highSchool: 'Imhotep Charter',
    sport: 'Football',
    league: 'NFL',
    team: 'Chicago Bears',
    position: 'DE',
    emoji: '🏈',
  },
  {
    id: 108,
    name: 'Brendan Rivers',
    highSchool: 'La Salle',
    sport: 'Football',
    league: 'NFL',
    team: 'Multiple Teams',
    position: 'OL',
    emoji: '🏈',
  },
  {
    id: 109,
    name: 'Naz Womble',
    highSchool: 'Frankford High School',
    sport: 'Football',
    league: 'NFL',
    team: 'Multiple Teams',
    position: 'WR',
    emoji: '🏈',
  },
  {
    id: 110,
    name: 'Solomon Thomas',
    highSchool: 'Episcopal Academy',
    sport: 'Football',
    league: 'NFL',
    team: 'Chicago Bears',
    position: 'EDGE',
    emoji: '🏈',
  },

  // MLB (16 players)
  {
    id: 201,
    name: 'Mike Piazza',
    highSchool: 'Phoenixville',
    sport: 'Baseball',
    league: 'MLB',
    team: 'New York Mets',
    position: 'C',
    hallOfFame: true,
    emoji: '⚾',
  },
  {
    id: 202,
    name: 'Reggie Jackson',
    highSchool: 'Cheltenham',
    sport: 'Baseball',
    league: 'MLB',
    team: 'Multiple Teams',
    position: 'OF',
    hallOfFame: true,
    emoji: '⚾',
  },
  {
    id: 203,
    name: 'Roy Campanella',
    highSchool: 'Simon Gratz',
    sport: 'Baseball',
    league: 'MLB',
    team: 'Brooklyn Dodgers',
    position: 'C',
    hallOfFame: true,
    emoji: '⚾',
  },
  {
    id: 204,
    name: 'Dick Allen',
    highSchool: 'Wampum High School',
    sport: 'Baseball',
    league: 'MLB',
    team: 'Philadelphia Phillies',
    position: 'OF',
    hallOfFame: true,
    emoji: '⚾',
  },
  {
    id: 205,
    name: 'Mark Gubicza',
    highSchool: 'Penn Charter',
    sport: 'Baseball',
    league: 'MLB',
    team: 'Kansas City Royals',
    position: 'P',
    emoji: '⚾',
  },
  {
    id: 206,
    name: 'Scott Siani',
    highSchool: 'Penn Charter',
    sport: 'Baseball',
    league: 'MLB',
    team: 'Multiple Teams',
    position: 'OF',
    emoji: '⚾',
  },
  {
    id: 207,
    name: 'Tom Koplove',
    highSchool: 'Penn Charter',
    sport: 'Baseball',
    league: 'MLB',
    team: 'Multiple Teams',
    position: 'P',
    emoji: '⚾',
  },
  {
    id: 208,
    name: 'Dan Reichert',
    highSchool: 'Malvern Prep',
    sport: 'Baseball',
    league: 'MLB',
    team: 'Kansas City Royals',
    position: 'P',
    emoji: '⚾',
  },
];

export default function NextLevelPage() {
  const [selectedLeague, setSelectedLeague] = useState<string>('All');

  const leagues = ['All', 'NBA', 'NFL', 'MLB'];

  const filteredAthletes =
    selectedLeague === 'All'
      ? PRO_ATHLETES
      : PRO_ATHLETES.filter((athlete) => athlete.league === selectedLeague);

  const nbaCount = PRO_ATHLETES.filter((a) => a.league === 'NBA').length;
  const nflCount = PRO_ATHLETES.filter((a) => a.league === 'NFL').length;
  const mlbCount = PRO_ATHLETES.filter((a) => a.league === 'MLB').length;
  const hofCount = PRO_ATHLETES.filter((a) => a.hallOfFame).length;

  // Top producer schools
  const schoolCounts: Record<string, number> = {};
  PRO_ATHLETES.forEach((athlete) => {
    schoolCounts[athlete.highSchool] = (schoolCounts[athlete.highSchool] || 0) + 1;
  });

  const topSchools = Object.entries(schoolCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

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
                  <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--psp-gold)' }}>72</span> high school alumni
                  playing professional sports: <strong>30 NFL</strong> • <strong>26 NBA</strong> • <strong>16 MLB</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="subnav" style={{ background: 'transparent', borderBottom: 'none', padding: 0, margin: '16px 0 0 0' }}>
            <div className="subnav-inner" style={{ padding: 0, gap: 0 }}>
              {leagues.map((league) => (
                <button
                  key={league}
                  onClick={() => setSelectedLeague(league)}
                  style={{
                    padding: '12px 20px',
                    fontSize: 13,
                    fontWeight: 600,
                    color: selectedLeague === league ? 'var(--psp-navy)' : 'var(--g500)',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: selectedLeague === league ? '3px solid var(--psp-navy)' : 'transparent',
                    cursor: 'pointer',
                    transition: '.1s',
                  }}
                >
                  {league}
                  {league === 'All' && ` (${PRO_ATHLETES.length})`}
                  {league === 'NBA' && ` (${nbaCount})`}
                  {league === 'NFL' && ` (${nflCount})`}
                  {league === 'MLB' && ` (${mlbCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Section Header */}
          <div className="sec-head">
            <h2>Professional Athletes</h2>
            <span style={{ fontSize: 11, color: 'var(--g400)', marginLeft: 'auto' }}>
              {filteredAthletes.length} athletes
            </span>
          </div>

          {/* Athlete Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 12,
              marginBottom: 16,
            }}
          >
            {filteredAthletes.map((athlete) => (
              <div
                key={athlete.id}
                style={{
                  background: '#fff',
                  border: athlete.hallOfFame ? '2px solid var(--psp-gold)' : '1px solid var(--g100)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  transition: '.15s',
                  boxShadow: athlete.hallOfFame ? '0 0 12px rgba(240,165,0,.2)' : 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = athlete.hallOfFame
                    ? '0 0 16px rgba(240,165,0,.4)'
                    : '0 2px 8px rgba(0,0,0,.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = athlete.hallOfFame
                    ? '0 0 12px rgba(240,165,0,.2)'
                    : 'none';
                }}
              >
                {/* Header */}
                <div
                  style={{
                    background: athlete.hallOfFame ? 'linear-gradient(135deg, var(--psp-gold), #f5c542)' : 'var(--psp-navy)',
                    padding: '12px 16px',
                    color: athlete.hallOfFame ? '#000' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 24 }}>{athlete.emoji}</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>
                      {athlete.name}
                    </h3>
                    {athlete.hallOfFame && (
                      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.3px' }}>
                        🏆 Hall of Fame
                      </div>
                    )}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: 'var(--g400)', marginBottom: 8 }}>
                    {athlete.highSchool} • {athlete.sport}
                  </div>

                  {/* Pro Info */}
                  <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--g100)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
                      {athlete.team}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--g400)' }}>
                      {athlete.position && `${athlete.position} • `}
                      {athlete.league}
                    </div>
                  </div>

                  {/* Draft Info */}
                  {athlete.draftInfo && (
                    <div>
                      <div style={{ fontSize: 9, color: 'var(--g400)', textTransform: 'uppercase', marginBottom: 3 }}>
                        Draft
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--psp-navy)' }}>
                        {athlete.draftInfo}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* Overview Stats */}
          <div className="widget">
            <div className="w-head">Pro Athletes Summary</div>
            <div className="w-body">
              <div className="w-row">
                <span className="name">Total Athletes</span>
                <span className="val">{PRO_ATHLETES.length}</span>
              </div>
              <div className="w-row">
                <span className="name">NBA Players</span>
                <span className="val">{nbaCount}</span>
              </div>
              <div className="w-row">
                <span className="name">NFL Players</span>
                <span className="val">{nflCount}</span>
              </div>
              <div className="w-row">
                <span className="name">MLB Players</span>
                <span className="val">{mlbCount}</span>
              </div>
              <div className="w-row">
                <span className="name">Hall of Famers</span>
                <span className="val" style={{ color: 'var(--psp-gold)' }}>
                  {hofCount}
                </span>
              </div>
            </div>
          </div>

          {/* Top Producer Schools */}
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

          {/* Notable Info */}
          <div className="widget">
            <div className="w-head">Notable Facts</div>
            <div className="w-body">
              <div style={{ padding: '10px 14px', fontSize: 11, lineHeight: 1.6, color: 'var(--text)' }}>
                <div style={{ marginBottom: 8 }}>
                  <strong>🏆 Hall of Famers:</strong> Wilt Chamberlain, Kobe Bryant, Mike Piazza, Reggie Jackson & more
                </div>
                <div style={{ marginBottom: 8 }}>
                  <strong>🏀 NBA Pipeline:</strong> Roman Catholic has 8 NBA players in history
                </div>
                <div>
                  <strong>🏈 SJP Dominance:</strong> St. Joseph's Prep leads NFL production with 12+ players
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="widget">
            <div className="w-head">Quick Links</div>
            <div className="w-body">
              <Link href="/football" className="w-link">
                &#8594; Football
              </Link>
              <Link href="/basketball" className="w-link">
                &#8594; Basketball
              </Link>
              <Link href="/baseball" className="w-link">
                &#8594; Baseball
              </Link>
              <Link href="/search" className="w-link">
                &#8594; Player Search
              </Link>
            </div>
          </div>

          {/* Ad Space */}
          <AdPlaceholder size="sidebar-rect" id="psp-nextlevel-rail" />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
