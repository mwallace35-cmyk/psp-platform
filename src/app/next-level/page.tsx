import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdPlaceholder from '@/components/ads/AdPlaceholder';

export const revalidate = 3600;

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

const FALLBACK_ATHLETES: ProAthlete[] = [
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
    id: 3,
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
];

async function fetchProAthletes(): Promise<ProAthlete[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('next_level_tracking')
      .select(`
        id,
        person_name,
        current_org,
        current_role,
        sport_id,
        pro_league,
        pro_team,
        draft_info,
        schools!next_level_tracking_high_school_id_fkey(name)
      `)
      .in('current_level', ['pro', 'college'])
      .eq('status', 'active')
      .order('pro_league', { ascending: true })
      .order('person_name', { ascending: true });

    if (error) {
      console.error('Error fetching pro athletes:', error);
      return FALLBACK_ATHLETES;
    }

    if (!data || data.length === 0) {
      return FALLBACK_ATHLETES;
    }

    // Map database records to ProAthlete interface
    const athletes: ProAthlete[] = data.map((record: any, idx: number) => {
      const sportEmojis: Record<string, string> = {
        basketball: '🏀',
        football: '🏈',
        baseball: '⚾',
        soccer: '⚽',
        volleyball: '🏐',
        lacrosse: '🥍',
      };

      return {
        id: record.id || idx,
        name: record.person_name || 'Unknown',
        highSchool: record.schools?.name || record.current_org || 'Unknown',
        sport: record.sport_id || 'Unknown',
        league: record.pro_league || 'Unknown',
        team: record.pro_team || 'Unknown',
        draftInfo: record.draft_info || undefined,
        emoji: sportEmojis[record.sport_id?.toLowerCase()] || '🏆',
      };
    });

    return athletes;
  } catch (error) {
    console.error('Error fetching pro athletes:', error);
    return FALLBACK_ATHLETES;
  }
}

interface ProAthleteGridProps {
  athletes: ProAthlete[];
}

function ProAthleteGrid({ athletes }: ProAthleteGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 12,
        marginBottom: 16,
      }}
    >
      {athletes.map((athlete) => (
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
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif" }}>
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
  );
}

export default async function NextLevelPage() {
  const athletes = await fetchProAthletes();

  const leagues = ['All', 'NBA', 'NFL', 'MLB'];
  const nbaCount = athletes.filter((a) => a.league === 'NBA').length;
  const nflCount = athletes.filter((a) => a.league === 'NFL').length;
  const mlbCount = athletes.filter((a) => a.league === 'MLB').length;
  const hofCount = athletes.filter((a) => a.hallOfFame).length;

  // Top producer schools
  const schoolCounts: Record<string, number> = {};
  athletes.forEach((athlete) => {
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
                  <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--psp-gold)' }}>
                    {athletes.length}
                  </span>{' '}
                  high school alumni playing professional sports: <strong>{nflCount} NFL</strong> •{' '}
                  <strong>{nbaCount} NBA</strong> • <strong>{mlbCount} MLB</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="subnav" style={{ background: 'transparent', borderBottom: 'none', padding: 0, margin: '16px 0 0 0' }}>
            <div className="subnav-inner" style={{ padding: 0, gap: 0 }}>
              {leagues.map((league) => {
                const count =
                  league === 'All'
                    ? athletes.length
                    : league === 'NBA'
                      ? nbaCount
                      : league === 'NFL'
                        ? nflCount
                        : mlbCount;

                return (
                  <div
                    key={league}
                    style={{
                      padding: '12px 20px',
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--g500)',
                      borderBottom: '3px solid transparent',
                    }}
                  >
                    {league} ({count})
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Header */}
          <div className="sec-head">
            <h2>Professional Athletes</h2>
            <span style={{ fontSize: 11, color: 'var(--g400)', marginLeft: 'auto' }}>
              {athletes.length} athletes
            </span>
          </div>

          {/* Athlete Cards Grid */}
          <ProAthleteGrid athletes={athletes} />
        </main>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* Overview Stats */}
          <div className="widget">
            <div className="w-head">Pro Athletes Summary</div>
            <div className="w-body">
              <div className="w-row">
                <span className="name">Total Athletes</span>
                <span className="val">{athletes.length}</span>
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
