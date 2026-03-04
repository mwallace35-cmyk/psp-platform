'use client';

import Link from 'next/link';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdPlaceholder from '@/components/ads/AdPlaceholder';

const BASKETBALL_COLOR = 'var(--bb)';
const BASKETBALL_HEX = '#ea580c';

// Featured article data
const FEATURED_ARTICLE = {
  tag: 'Basketball',
  tagBg: '#fff7ed',
  tagColor: BASKETBALL_HEX,
  title: 'Imhotep Charter Extends Historic Win Streak to 85 Games',
  subtitle:
    'The Panthers capture a 6th consecutive Public League title and remain unbeaten in the 2024-25 season.',
  image: 'https://placehold.co/800x400/ea580c/ffffff?text=Basketball+Action',
  href: '/basketball/schools/imhotep-charter',
};

// Latest news articles
const NEWS_ARTICLES = [
  {
    id: 1,
    tag: 'Championship',
    tagColor: '#dc2626',
    title: "Neumann-Goretti Captures 10th PIAA State Title",
    description: 'N-G defeats Imhotep 68-65 in thrilling overtime in the PIAA 4A state championship game.',
    timestamp: '2h ago',
    image: 'https://placehold.co/300x180/ea580c/ffffff?text=NG+Championship',
    href: '/basketball/schools/neumann-goretti',
  },
  {
    id: 2,
    tag: 'Recruiting',
    tagColor: '#2563eb',
    title: "Roman Catholic's Freshman Phenom Commits to Villanova",
    description: 'Basketball standout DeShawn Carter signs early commitment to play for the Wildcats.',
    timestamp: '5h ago',
    image: 'https://placehold.co/300x180/ea580c/ffffff?text=Recruiting',
    href: '/basketball/schools/roman-catholic',
  },
  {
    id: 3,
    tag: 'Preview',
    tagColor: '#16a34a',
    title: 'Catholic League Playoffs Preview: Key Matchups to Watch',
    description:
      'Roman Catholic, Neumann-Goretti, Father Judge, and Archbishop Wood position for deep tournament runs.',
    timestamp: '1d ago',
    image: 'https://placehold.co/300x180/ea580c/ffffff?text=PCL+Playoffs',
    href: '/basketball',
  },
  {
    id: 4,
    tag: 'Historic',
    tagColor: '#9333ea',
    title: "Father Judge Wins First-Ever State Championship",
    description: 'The Crusaders defeat Loyalsock 72-68 to capture their first PIAA state title in program history.',
    timestamp: '3d ago',
    image: 'https://placehold.co/300x180/ea580c/ffffff?text=FJ+Historic',
    href: '/basketball/schools/father-judge-hs',
  },
];

// Standings data
const STANDINGS = {
  catholicLeague: [
    { rank: 1, school: 'Roman Catholic', wins: 12, losses: 0, pct: '1.000', gb: '-' },
    { rank: 2, school: 'Neumann-Goretti', wins: 10, losses: 2, pct: '.833', gb: '2.0' },
    { rank: 3, school: 'Father Judge', wins: 9, losses: 3, pct: '.750', gb: '3.0' },
    { rank: 4, school: 'Archbishop Wood', wins: 7, losses: 5, pct: '.583', gb: '5.0' },
    { rank: 5, school: 'La Salle College', wins: 6, losses: 6, pct: '.500', gb: '6.0' },
    { rank: 6, school: 'Bonner & Prendie', wins: 4, losses: 8, pct: '.333', gb: '8.0' },
  ],
  publicLeague: [
    { rank: 1, school: 'Imhotep Charter', wins: 14, losses: 0, pct: '1.000', gb: '-' },
    { rank: 2, school: 'MLK Science & Engineering', wins: 10, losses: 4, pct: '.714', gb: '4.0' },
    { rank: 3, school: 'Northeast High School', wins: 8, losses: 6, pct: '.571', gb: '6.0' },
    { rank: 4, school: 'Bartram High School', wins: 7, losses: 7, pct: '.500', gb: '7.0' },
  ],
};

// This week's schedule
const SCHEDULE = [
  {
    id: 1,
    day: 'Tuesday',
    date: 'Mar 4',
    games: [
      {
        time: '7:00 PM',
        home: 'Roman Catholic',
        away: 'Neumann-Goretti',
        location: 'The Palestra',
      },
      {
        time: '6:00 PM',
        home: 'Father Judge',
        away: 'La Salle College',
        location: 'Archbishop Wood',
      },
    ],
  },
  {
    id: 2,
    day: 'Friday',
    date: 'Mar 7',
    games: [
      {
        time: '7:00 PM',
        home: 'Imhotep Charter',
        away: 'MLK Science & Engineering',
        location: 'Lincoln HS',
      },
      {
        time: '6:00 PM',
        home: 'Archbishop Wood',
        away: 'Bonner & Prendie',
        location: 'Archbishop Wood',
      },
    ],
  },
];

// Top performers this week
const TOP_PERFORMERS = [
  {
    category: 'Scoring',
    leader: 'Jalen Smith',
    school: 'Roman Catholic',
    stats: '28 pts, 6 reb',
  },
  {
    category: 'Assists',
    leader: 'DeShawn Carter',
    school: 'Imhotep Charter',
    stats: '12 ast, 8 pts',
  },
  {
    category: 'Rebounds',
    leader: 'Marcus Thompson',
    school: 'Neumann-Goretti',
    stats: '15 reb, 12 pts',
  },
];

// Scoring leaders widget
const SCORING_LEADERS = [
  { rank: 1, name: 'Jalen Smith', school: 'Roman Catholic', pts: 487, pct: 100 },
  { rank: 2, name: 'DeShawn Carter', school: 'Imhotep Charter', pts: 421, pct: 86.4 },
  { rank: 3, name: 'Marcus Johnson', school: 'Neumann-Goretti', pts: 398, pct: 81.7 },
  { rank: 4, name: 'Tyler Williams', school: 'Father Judge', pts: 376, pct: 77.2 },
  { rank: 5, name: 'Raheem Reid', school: 'La Salle College', pts: 342, pct: 70.2 },
];

// Recent scores widget
const RECENT_SCORES = [
  { home: 'Imhotep Charter', away: 'MLK', homeScore: 82, awayScore: 59, homeWin: true },
  { home: 'Roman Catholic', away: 'Father Judge', homeScore: 68, awayScore: 61, homeWin: true },
  { home: 'Neumann-Goretti', away: 'La Salle', homeScore: 75, awayScore: 52, homeWin: true },
  { home: 'Archbishop Wood', away: 'Bonner', homeScore: 71, awayScore: 68, homeWin: true },
];

// Upcoming events
const UPCOMING_EVENTS = [
  {
    date: 'Mar 8',
    title: 'PCL Basketball Championship',
    location: 'The Palestra',
  },
  {
    date: 'Mar 15',
    title: 'PIAA State Regional',
    location: 'TBD',
  },
];

// More stories grid
const MORE_STORIES = [
  {
    icon: '🏅',
    title: 'Jalen Duren Earns All-State Honors',
    desc: 'Roman Catholic star selected to PA All-State team.',
    tag: 'Awards',
    href: '/basketball',
  },
  {
    icon: '🎯',
    title: 'Three-Point Shootout Preview',
    desc: 'Five sharpshooters compete in Catholic League skills challenge.',
    tag: 'Events',
    href: '/basketball',
  },
  {
    icon: '📊',
    title: '2024-25 Season Statistical Leaders',
    desc: 'Complete breakdown of scoring, rebounding, and assist records.',
    tag: 'Stats',
    href: '/basketball',
  },
  {
    icon: '🏆',
    title: 'Imhotep Charter: Road to 6-Peat',
    desc: 'Documentary-style feature on the Panthers\' unprecedented run.',
    tag: 'Feature',
    href: '/basketball',
  },
];

export default function BasketballPage() {
  const [activeStandings, setActiveStandings] = useState<'catholicLeague' | 'publicLeague'>('catholicLeague');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {/* Sport Header */}
      <div className="sport-hdr" style={{ borderBottomColor: BASKETBALL_HEX }}>
        <div className="sport-hdr-inner">
          <span style={{ fontSize: 28 }}>🏀</span>
          <h1>Basketball</h1>
          <div className="stat-pills">
            <div className="pill">
              <strong>2024-25</strong> Season
            </div>
            <div className="pill">
              <strong>98</strong> schools
            </div>
            <div className="pill">
              <strong>2,485</strong> players
            </div>
            <span className="db-tag">
              <span className="dot" /> Supabase
            </span>
          </div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="subnav">
        <div className="subnav-inner">
          <Link href="/basketball" className="active">
            Home
          </Link>
          <Link href="/basketball/leaderboards/scoring">Standings</Link>
          <Link href="/basketball/leaderboards/scoring">Schedule</Link>
          <Link href="/basketball/leaderboards/scoring">Leaders</Link>
          <Link href="/basketball">Teams</Link>
          <Link href="/basketball/championships">Championships</Link>
          <Link href="/basketball/records">Records</Link>
        </div>
      </div>

      <div className="espn-container">
        <main>
          {/* Featured Hero Article */}
          <div className="hero-card">
            <div className="hero-tag">{FEATURED_ARTICLE.tag}</div>
            <div
              className="hero-img"
              style={{
                background: `linear-gradient(180deg, ${BASKETBALL_HEX}88 0%, rgba(10,22,40,.95) 100%)`,
                backgroundImage: `url('${FEATURED_ARTICLE.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div>
                <h2>{FEATURED_ARTICLE.title}</h2>
                <div className="hero-sub">{FEATURED_ARTICLE.subtitle}</div>
              </div>
            </div>
          </div>

          {/* Latest News Section */}
          <div className="sec-head">
            <h2>Latest News</h2>
            <Link href="/articles" className="more">
              All Articles &#8594;
            </Link>
          </div>
          <div className="news-grid">
            {NEWS_ARTICLES.map((article) => (
              <Link
                key={article.id}
                href={article.href}
                className="news-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className="nc-img"
                  style={{
                    backgroundImage: `url('${article.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="nc-body">
                  <div className="nc-tag" style={{ background: article.tagColor, color: '#fff' }}>
                    {article.tag}
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <div className="meta">{article.timestamp}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Standings Section */}
          <div className="sec-head">
            <h2>Standings</h2>
          </div>
          <div className="standings-tabs">
            <button
              className={`tab ${activeStandings === 'catholicLeague' ? 'active' : ''}`}
              onClick={() => setActiveStandings('catholicLeague')}
            >
              Catholic League
            </button>
            <button
              className={`tab ${activeStandings === 'publicLeague' ? 'active' : ''}`}
              onClick={() => setActiveStandings('publicLeague')}
            >
              Public League
            </button>
          </div>

          <div className="standings-grid">
            <table className="standings-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', paddingLeft: 8 }}>TEAM</th>
                  <th style={{ textAlign: 'center' }}>W</th>
                  <th style={{ textAlign: 'center' }}>L</th>
                  <th style={{ textAlign: 'center' }}>PCT</th>
                  <th style={{ textAlign: 'center' }}>GB</th>
                </tr>
              </thead>
              <tbody>
                {(activeStandings === 'catholicLeague'
                  ? STANDINGS.catholicLeague
                  : STANDINGS.publicLeague
                ).map((team) => (
                  <tr key={team.school}>
                    <td style={{ paddingLeft: 8 }}>
                      <Link href={`/schools/${team.school.toLowerCase().replace(/\s+/g, '-')}`}>
                        <strong>{team.school}</strong>
                      </Link>
                    </td>
                    <td style={{ textAlign: 'center' }}>{team.wins}</td>
                    <td style={{ textAlign: 'center' }}>{team.losses}</td>
                    <td style={{ textAlign: 'center' }}>{team.pct}</td>
                    <td style={{ textAlign: 'center' }}>{team.gb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* This Week's Schedule */}
          <div className="sec-head">
            <h2>This Week&apos;s Schedule</h2>
          </div>
          <div className="schedule-grid">
            {SCHEDULE.map((day) => (
              <div key={day.id} className="schedule-day">
                <div className="sd-header">
                  <strong>{day.day}</strong>
                  <span className="date">{day.date}</span>
                </div>
                {day.games.map((game, idx) => (
                  <div key={idx} className="game">
                    <div className="g-time">{game.time}</div>
                    <div className="g-matchup">
                      <div className="team">{game.home}</div>
                      <div className="vs">vs</div>
                      <div className="team">{game.away}</div>
                    </div>
                    <div className="g-location">{game.location}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Top Performers This Week */}
          <div className="sec-head">
            <h2>Top Performers This Week</h2>
          </div>
          <div className="performers-grid">
            {TOP_PERFORMERS.map((perf) => (
              <div key={perf.category} className="perf-card">
                <div className="pc-category">{perf.category}</div>
                <div className="pc-leader">{perf.leader}</div>
                <div className="pc-school">{perf.school}</div>
                <div className="pc-stats">{perf.stats}</div>
              </div>
            ))}
          </div>

          {/* More Stories Grid */}
          <div className="sec-head">
            <h2>More Stories</h2>
          </div>
          <div className="stories-grid">
            {MORE_STORIES.map((story, idx) => (
              <Link
                key={idx}
                href={story.href}
                className="story-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="sc-icon">{story.icon}</div>
                <div className="sc-tag">{story.tag}</div>
                <h4>{story.title}</h4>
                <p>{story.desc}</p>
              </Link>
            ))}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* Scoring Leaders */}
          <div className="widget">
            <div className="w-head">🏀 Scoring Leaders</div>
            <div className="w-body">
              {SCORING_LEADERS.map((leader) => (
                <div key={leader.rank} className="w-row">
                  <span className={`rank ${leader.rank <= 3 ? 'top' : ''}`}>{leader.rank}</span>
                  <span className="name">{leader.name}</span>
                  <span className="val">{leader.pts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Scores */}
          <div className="widget">
            <div className="w-head">Recent Scores</div>
            <div className="w-body" style={{ padding: '10px 14px' }}>
              {RECENT_SCORES.map((score, idx) => (
                <div key={idx} className="score-item">
                  <div className={`team-score ${score.homeWin ? 'winner' : ''}`}>
                    <span className="team">{score.home}</span>
                    <span className="score">{score.homeScore}</span>
                  </div>
                  <div className={`team-score ${!score.homeWin ? 'winner' : ''}`}>
                    <span className="team">{score.away}</span>
                    <span className="score">{score.awayScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ad Space */}
          <AdPlaceholder size="sidebar-rect" id="psp-bball-rail-1" />

          {/* Quick Links */}
          <div className="widget">
            <div className="w-head">Basketball Tools</div>
            <div className="w-body">
              <Link href="/basketball/leaderboards/scoring" className="w-link">
                &#8594; Leaderboards
              </Link>
              <Link href="/basketball/championships" className="w-link">
                &#8594; Championships
              </Link>
              <Link href="/basketball/records" className="w-link">
                &#8594; All-Time Records
              </Link>
              <Link href="/search?sport=basketball" className="w-link">
                &#8594; Player Search
              </Link>
              <Link href="/compare" className="w-link">
                &#8594; Compare Players
              </Link>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="widget">
            <div className="w-head">Upcoming Events</div>
            <div className="w-body" style={{ padding: '10px 14px' }}>
              {UPCOMING_EVENTS.map((evt, idx) => (
                <div key={idx} className="evt-item">
                  <div className="evt-date">
                    <div className="d">{evt.date.split(' ')[1]}</div>
                  </div>
                  <div className="evt-info">
                    <h4>{evt.title}</h4>
                    <p>{evt.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ad Space 2 */}
          <AdPlaceholder size="sidebar-rect" id="psp-bball-rail-2" />
        </aside>
      </div>

      <Footer />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Philadelphia High School Basketball',
            description: 'Comprehensive basketball database for Philadelphia area high schools covering the 2024-25 season.',
            url: 'https://phillysportspack.com/basketball',
            isPartOf: {
              '@type': 'WebSite',
              name: 'PhillySportsPack',
              url: 'https://phillysportspack.com',
            },
            mainEntity: {
              '@type': 'SportsTeam',
              sport: 'Basketball',
              region: 'Philadelphia',
            },
          }),
        }}
      />

      <style jsx>{`
        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .news-card {
          border: 1px solid var(--g100);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .news-card:hover {
          border-color: ${BASKETBALL_HEX};
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.1);
        }

        .nc-img {
          width: 100%;
          height: 180px;
          background-color: var(--g100);
        }

        .nc-body {
          padding: 12px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .nc-tag {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 3px;
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 6px;
          width: fit-content;
        }

        .nc-body h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          line-height: 1.2;
          margin: 0 0 6px 0;
          color: var(--text);
        }

        .nc-body p {
          font-size: 12px;
          line-height: 1.4;
          color: var(--g500);
          margin: 0 0 8px 0;
          flex-grow: 1;
        }

        .meta {
          font-size: 11px;
          color: var(--g400);
          margin-top: auto;
        }

        .standings-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--g100);
        }

        .tab {
          padding: 10px 16px;
          border: none;
          background: none;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          color: var(--g400);
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .tab.active {
          color: ${BASKETBALL_HEX};
          border-bottom-color: ${BASKETBALL_HEX};
        }

        .standings-grid {
          margin-bottom: 32px;
          overflow-x: auto;
        }

        .standings-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .standings-table thead {
          background-color: var(--g50);
          border-bottom: 1px solid var(--g200);
        }

        .standings-table th {
          padding: 10px 8px;
          text-align: center;
          font-weight: 600;
          color: var(--g600);
        }

        .standings-table td {
          padding: 12px 8px;
          border-bottom: 1px solid var(--g100);
        }

        .standings-table tr:hover {
          background-color: var(--g50);
        }

        .standings-table a {
          color: var(--text);
          text-decoration: none;
          transition: all 0.2s;
        }

        .standings-table a:hover {
          color: ${BASKETBALL_HEX};
        }

        .schedule-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .schedule-day {
          border: 1px solid var(--g100);
          border-radius: 6px;
          overflow: hidden;
        }

        .sd-header {
          background: linear-gradient(135deg, var(--g50) 0%, var(--g100) 100%);
          padding: 12px;
          border-bottom: 1px solid var(--g200);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sd-header strong {
          font-size: 13px;
          color: var(--text);
        }

        .date {
          font-size: 11px;
          color: var(--g400);
        }

        .game {
          padding: 12px;
          border-bottom: 1px solid var(--g100);
        }

        .game:last-child {
          border-bottom: none;
        }

        .g-time {
          font-size: 11px;
          color: var(--g400);
          margin-bottom: 6px;
          font-weight: 600;
        }

        .g-matchup {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .team {
          flex: 1;
          color: var(--text);
        }

        .vs {
          font-size: 10px;
          color: var(--g400);
          padding: 0 4px;
        }

        .g-location {
          font-size: 11px;
          color: var(--g500);
        }

        .performers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .perf-card {
          background: linear-gradient(135deg, var(--g50) 0%, var(--g100) 100%);
          border: 1px solid var(--g100);
          border-radius: 6px;
          padding: 16px;
          text-align: center;
        }

        .pc-category {
          font-size: 11px;
          font-weight: 700;
          color: ${BASKETBALL_HEX};
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .pc-leader {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          color: var(--text);
          margin-bottom: 4px;
        }

        .pc-school {
          font-size: 11px;
          color: var(--g500);
          margin-bottom: 8px;
        }

        .pc-stats {
          font-size: 13px;
          font-weight: 600;
          color: ${BASKETBALL_HEX};
        }

        .stories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .story-card {
          border: 1px solid var(--g100);
          border-radius: 6px;
          padding: 16px;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
        }

        .story-card:hover {
          border-color: ${BASKETBALL_HEX};
          box-shadow: 0 4px 12px rgba(234, 88, 12, 0.1);
          transform: translateY(-2px);
        }

        .sc-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .sc-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          color: ${BASKETBALL_HEX};
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          width: fit-content;
        }

        .story-card h4 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          line-height: 1.2;
          margin: 0 0 6px 0;
          color: var(--text);
        }

        .story-card p {
          font-size: 12px;
          line-height: 1.4;
          color: var(--g500);
          margin: 0;
        }

        .score-item {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 8px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--g100);
        }

        .score-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .team-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px;
          background-color: var(--g50);
          border-radius: 4px;
          transition: all 0.2s;
        }

        .team-score.winner {
          background: linear-gradient(135deg, ${BASKETBALL_HEX}22 0%, ${BASKETBALL_HEX}11 100%);
          border: 1px solid ${BASKETBALL_HEX}44;
        }

        .team-score .team {
          font-size: 11px;
          color: var(--g600);
          margin-bottom: 3px;
        }

        .team-score .score {
          font-size: 14px;
          font-weight: 700;
          color: var(--text);
        }

        @media (max-width: 768px) {
          .news-grid {
            grid-template-columns: 1fr;
          }

          .schedule-grid {
            grid-template-columns: 1fr;
          }

          .performers-grid {
            grid-template-columns: 1fr;
          }

          .stories-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
