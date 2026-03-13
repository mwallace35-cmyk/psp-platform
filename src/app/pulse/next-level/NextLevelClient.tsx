'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import AdPlaceholder from '@/components/ads/AdPlaceholder';
import { createProAthleteSlug } from '@/lib/slug-utils';

interface Athlete {
  id: number;
  person_name: string;
  high_school_id: number | null;
  sport_id: string | null;
  current_level: string;
  current_org: string | null;
  pro_team: string | null;
  pro_league: string | null;
  draft_info: string | null;
  college: string | null;
  bio_note: string | null;
  status: string;
  schools?: {
    name: string;
    slug: string;
  } | null;
}

interface PipelineStats {
  college: number;
  pro: number;
  prospects: number;
  nfl: number;
  nba: number;
}

interface Props {
  athletes: Athlete[];
  stats: PipelineStats;
}

const leagueColors: Record<string, string> = {
  NFL: '#003da5',
  NBA: '#c4122e',
  MLB: '#002d72',
  WNBA: '#552583',
  UFL: '#4a5568',
};

const sportEmojis: Record<string, string> = {
  football: '\u{1F3C8}',
  basketball: '\u{1F3C0}',
  baseball: '\u26BE',
  soccer: '\u26BD',
  lacrosse: '\u{1F94D}',
};

const levelColors: Record<string, string> = {
  pro: '#003da5',
  college: '#059669',
  high_school: '#f0a500',
};

/* ─── Pipeline Tab ─── */
type PipelineTab = 'pro' | 'college' | 'prospects';

/* ─── Pro Athlete Card ─── */
function ProCard({ a }: { a: Athlete }) {
  const color = leagueColors[a.pro_league || ''] || '#0a1628';
  const emoji = sportEmojis[a.sport_id?.toLowerCase() || ''] || '\u{1F3C6}';
  const slug = createProAthleteSlug(a.person_name, a.id);

  return (
    <Link href={`/next-level/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: 'var(--card-bg, #fff)',
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
        <div style={{ background: color, padding: '10px 14px', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>{emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {a.person_name}
            </div>
          </div>
          {a.status === 'active' && (
            <span style={{ background: 'rgba(255,255,255,.2)', padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>Active</span>
          )}
        </div>
        <div style={{ padding: '10px 14px' }}>
          <div style={{ fontSize: 11, color: 'var(--g400)', marginBottom: 8 }}>
            {a.schools?.name || 'Unknown School'} &bull; {a.sport_id || 'Unknown'}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            {a.current_org || a.pro_team || 'Free Agent'}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
            <span style={{ background: color, color: '#fff', padding: '3px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
              {a.pro_league || 'PRO'}
            </span>
            {a.college && <span style={{ fontSize: 10, color: 'var(--g400)' }}>via {a.college}</span>}
          </div>
          {a.draft_info && (
            <div style={{ fontSize: 10, color: 'var(--g400)', fontStyle: 'italic' }}>{a.draft_info}</div>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ─── College Signee Card ─── */
function CollegeCard({ a }: { a: Athlete }) {
  const emoji = sportEmojis[a.sport_id?.toLowerCase() || ''] || '\u{1F3C6}';

  return (
    <div
      style={{
        background: 'var(--card-bg, #fff)',
        border: '1px solid var(--g100)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div style={{ background: '#059669', padding: '10px 14px', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18 }}>{emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {a.person_name}
          </div>
        </div>
        <span style={{ background: 'rgba(255,255,255,.2)', padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>SIGNED</span>
      </div>
      <div style={{ padding: '10px 14px' }}>
        <div style={{ fontSize: 11, color: 'var(--g400)', marginBottom: 8 }}>
          {a.schools?.name || 'Unknown School'} &bull; {a.sport_id || 'Unknown'}
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
          {a.college || a.current_org || 'TBD'}
        </div>
        {a.bio_note && (
          <div style={{ fontSize: 11, color: 'var(--g400)', lineHeight: 1.4, marginTop: 6 }}>{a.bio_note}</div>
        )}
      </div>
    </div>
  );
}

/* ─── Draft Prospect Card ─── */
function ProspectCard({ a }: { a: Athlete }) {
  const emoji = sportEmojis[a.sport_id?.toLowerCase() || ''] || '\u{1F3C6}';

  return (
    <div
      style={{
        background: 'var(--card-bg, #fff)',
        border: '2px solid var(--psp-gold)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div style={{ background: 'linear-gradient(135deg, #f0a500 0%, #d4940a 100%)', padding: '10px 14px', color: '#0a1628', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18 }}>{emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Bebas Neue', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {a.person_name}
          </div>
        </div>
        <span style={{ background: 'rgba(10,22,40,.2)', padding: '2px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, color: '#0a1628' }}>PROSPECT</span>
      </div>
      <div style={{ padding: '10px 14px' }}>
        <div style={{ fontSize: 11, color: 'var(--g400)', marginBottom: 8 }}>
          {a.schools?.name || 'Unknown School'} &bull; {a.sport_id || 'Unknown'}
        </div>
        {a.current_org && (
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            {a.current_org}
          </div>
        )}
        {a.bio_note && (
          <div style={{ fontSize: 11, color: 'var(--g400)', lineHeight: 1.4, marginTop: 6 }}>{a.bio_note}</div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function NextLevelClient({ athletes, stats }: Props) {
  const [activeTab, setActiveTab] = useState<PipelineTab>('pro');
  const [sportFilter, setSportFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Group athletes by pipeline level
  const proAthletes = useMemo(() => athletes.filter((a) => a.current_level === 'pro'), [athletes]);
  const collegeSignees = useMemo(() => athletes.filter((a) => a.current_level === 'college'), [athletes]);
  const draftProspects = useMemo(() => athletes.filter((a) => a.current_level === 'high_school'), [athletes]);

  // Get current tab's athletes
  const currentAthletes = activeTab === 'pro' ? proAthletes : activeTab === 'college' ? collegeSignees : draftProspects;

  // Apply sport + search filters
  const filtered = useMemo(() => {
    return currentAthletes.filter((a) => {
      const matchesSport = sportFilter === 'all' || a.sport_id === sportFilter;
      const matchesSearch = !searchTerm || a.person_name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSport && matchesSearch;
    });
  }, [currentAthletes, sportFilter, searchTerm]);

  // Active NFL count for pro tab
  const activeNfl = proAthletes.filter((a) => a.pro_league === 'NFL' && a.status === 'active').length;
  const activePro = proAthletes.filter((a) => a.status === 'active').length;

  // Top schools
  const schoolCounts: Record<string, number> = {};
  currentAthletes.forEach((a) => {
    if (a.schools?.name) schoolCounts[a.schools.name] = (schoolCounts[a.schools.name] || 0) + 1;
  });
  const topSchools = Object.entries(schoolCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // Top colleges (for college tab)
  const collegeCounts: Record<string, number> = {};
  collegeSignees.forEach((a) => {
    if (a.college) collegeCounts[a.college] = (collegeCounts[a.college] || 0) + 1;
  });
  const topColleges = Object.entries(collegeCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const tabs: { key: PipelineTab; label: string; count: number; color: string }[] = [
    { key: 'pro', label: 'Pro Athletes', count: proAthletes.length, color: '#003da5' },
    { key: 'college', label: 'College Signees', count: collegeSignees.length, color: '#059669' },
    { key: 'prospects', label: 'Draft Prospects', count: draftProspects.length, color: '#f0a500' },
  ];

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
              <h2>Philly Sports Pipeline</h2>
              <div className="hero-sub">
                Tracking Philly athletes from{' '}
                <span style={{ color: 'var(--psp-gold)', fontWeight: 800 }}>high school</span> to{' '}
                <span style={{ color: '#059669', fontWeight: 800 }}>college</span> to{' '}
                <span style={{ color: '#3b82f6', fontWeight: 800 }}>the pros</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Stats Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 12,
          margin: '16px 0 24px',
        }}>
          {[
            { label: 'Active Pros', value: activePro, color: '#003da5' },
            { label: 'NFL', value: activeNfl, color: '#003da5' },
            { label: 'College Signees', value: stats.college, color: '#059669' },
            { label: 'Prospects', value: stats.prospects, color: '#f0a500' },
          ].map((s) => (
            <div key={s.label} style={{
              background: 'var(--card-bg, #fff)',
              border: '1px solid var(--g100)',
              borderRadius: 8,
              padding: '12px 16px',
              textAlign: 'center',
              borderTop: `3px solid ${s.color}`,
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "'Bebas Neue', sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--g400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Pipeline Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--g100)', marginBottom: 16 }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearchTerm(''); setSportFilter('all'); }}
              style={{
                flex: 1,
                padding: '14px 16px',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: '.5px',
                color: activeTab === tab.key ? tab.color : 'var(--g400)',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.key ? `3px solid ${tab.color}` : '3px solid transparent',
                cursor: 'pointer',
                transition: '.15s',
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Sport Filter + Search */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'football', 'basketball'].map((sport) => (
              <button
                key={sport}
                onClick={() => setSportFilter(sport)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: sportFilter === sport ? 'none' : '1px solid var(--g200)',
                  background: sportFilter === sport ? 'var(--psp-blue)' : 'transparent',
                  color: sportFilter === sport ? '#fff' : 'var(--g500)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {sport === 'all' ? 'All Sports' : sport.charAt(0).toUpperCase() + sport.slice(1)}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: 200,
              padding: '8px 14px',
              borderRadius: 6,
              border: '1px solid var(--g200)',
              background: 'var(--card-bg, #fff)',
              fontSize: 13,
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Section Header */}
        <div className="sec-head">
          <h2>{tabs.find((t) => t.key === activeTab)?.label}</h2>
          <span style={{ fontSize: 11, color: 'var(--g400)', marginLeft: 'auto' }}>
            {filtered.length} athletes
          </span>
        </div>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--g400)' }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No athletes found</div>
            <div style={{ fontSize: 13 }}>Try adjusting your filters or search term</div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
              marginBottom: 24,
            }}
          >
            {filtered.map((a) =>
              activeTab === 'pro' ? (
                <ProCard key={a.id} a={a} />
              ) : activeTab === 'college' ? (
                <CollegeCard key={a.id} a={a} />
              ) : (
                <ProspectCard key={a.id} a={a} />
              )
            )}
          </div>
        )}
      </main>

      {/* Sidebar */}
      <aside className="sidebar">
        {/* Pipeline Overview */}
        <div className="widget">
          <div className="w-head">Pipeline Overview</div>
          <div className="w-body">
            <div className="w-row">
              <span className="name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#003da5', display: 'inline-block' }} />
                Pro Athletes
              </span>
              <span className="val">{proAthletes.length}</span>
            </div>
            <div className="w-row">
              <span className="name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
                College Signees
              </span>
              <span className="val">{collegeSignees.length}</span>
            </div>
            <div className="w-row">
              <span className="name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f0a500', display: 'inline-block' }} />
                Draft Prospects
              </span>
              <span className="val">{draftProspects.length}</span>
            </div>
          </div>
        </div>

        {/* Top Producer Schools */}
        {topSchools.length > 0 && (
          <div className="widget">
            <div className="w-head">
              Top Schools ({tabs.find((t) => t.key === activeTab)?.label})
            </div>
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

        {/* Top Colleges (college tab only) */}
        {activeTab === 'college' && topColleges.length > 0 && (
          <div className="widget">
            <div className="w-head">Top College Destinations</div>
            <div className="w-body">
              {topColleges.map(([college, count], idx) => (
                <div key={college} className="w-row">
                  <span className={`rank ${idx < 3 ? 'top' : ''}`}>{idx + 1}</span>
                  <span className="name">{college}</span>
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
                <strong>Hall of Famers:</strong> Wilt Chamberlain, Kobe Bryant, Mike Piazza, Reggie Jackson
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>Active NFL Stars:</strong> Marvin Harrison Jr., Kyle Pitts, D&apos;Andre Swift, Abdul Carter
              </div>
              <div>
                <strong>Top Pipeline:</strong> St. Joseph&apos;s Prep leads NFL production; Roman Catholic &amp; Neumann-Goretti lead basketball
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="widget">
          <div className="w-head">Quick Links</div>
          <div className="w-body">
            <Link href="/pros" className="w-link">
              &rarr; Before They Were Famous
            </Link>
            <Link href="/football" className="w-link">
              &rarr; Football
            </Link>
            <Link href="/basketball" className="w-link">
              &rarr; Basketball
            </Link>
            <Link href="/search" className="w-link">
              &rarr; Player Search
            </Link>
          </div>
        </div>

        <AdPlaceholder size="sidebar-rect" id="psp-nextlevel-rail" />
      </aside>
    </div>
  );
}
