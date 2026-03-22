'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

export interface AlumniRecord {
  id: string;
  person_name: string;
  current_level: string;
  current_org: string | null;
  current_role: string | null;
  pro_league: string | null;
  sport_id: string | null;
  status: string | null;
  featured: boolean;
  bio_note: string | null;
  social_twitter: string | null;
  social_instagram: string | null;
  college?: string | null;
  draft_info?: string | null;
  schools?: { name: string; slug: string } | null;
}

interface Props {
  alumni: AlumniRecord[];
  counts: {
    total: number;
    activePro: number;
    formerPro: number;
    college: number;
    nfl: number;
    nba: number;
    mlb: number;
  };
}

type Tab = 'active-pros' | 'former-pros' | 'college' | 'coaching';

const LEAGUE_BADGES: Record<string, { icon: string; bg: string }> = {
  NFL: { icon: '🏈', bg: 'bg-green-700' },
  NBA: { icon: '🏀', bg: 'bg-orange-600' },
  MLB: { icon: '⚾', bg: 'bg-blue-700' },
  WNBA: { icon: '🏀', bg: 'bg-purple-700' },
  MLS: { icon: '⚽', bg: 'bg-purple-700' },
  'NBA G League': { icon: '🏀', bg: 'bg-orange-500' },
  UFL: { icon: '🏈', bg: 'bg-gray-600' },
};

const SPORT_EMOJIS: Record<string, string> = {
  football: '🏈',
  basketball: '🏀',
  baseball: '⚾',
  soccer: '⚽',
  lacrosse: '🥍',
  'track-field': '🏃',
  wrestling: '🤼',
};

const SPORT_LABELS: Record<string, string> = {
  football: 'Football',
  basketball: 'Basketball',
  baseball: 'Baseball',
  soccer: 'Soccer',
  lacrosse: 'Lacrosse',
  'track-field': 'Track & Field',
  wrestling: 'Wrestling',
  other: 'Other',
};

const SPORT_COLORS: Record<string, string> = {
  football: '#16a34a',
  basketball: '#3b82f6',
  baseball: '#ea580c',
  soccer: '#059669',
  lacrosse: '#0891b2',
  'track-field': '#7c3aed',
  wrestling: '#ca8a04',
  other: '#6b7280',
};

const SPORT_ORDER = ['football', 'basketball', 'baseball', 'soccer', 'lacrosse', 'track-field', 'wrestling', 'other'];

function AthleteCard({ a, activeTab }: { a: AlumniRecord; activeTab: Tab }) {
  const league = a.pro_league ? LEAGUE_BADGES[a.pro_league] : null;
  const sportEmoji = SPORT_EMOJIS[a.sport_id || ''] || '';
  const isInactive = a.status !== 'active';
  const sportColor = SPORT_COLORS[a.sport_id || 'other'] || '#6b7280';

  if (activeTab === 'active-pros' || activeTab === 'former-pros') {
    const isFormer = activeTab === 'former-pros';
    return (
      <div
        className={`bg-white rounded-lg border p-4 hover:shadow-md transition ${isFormer ? 'opacity-80 hover:border-gray-400' : 'hover:border-gold'}`}
        style={{ borderLeft: `3px solid ${isInactive && !isFormer ? '#d1d5db' : sportColor}`, borderColor: undefined }}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className={`font-bold text-lg ${isFormer ? 'text-gray-700' : 'text-navy'}`}>{a.person_name}</h3>
            {isInactive && !isFormer && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-500">
                {a.status === 'retired' ? 'Retired' : 'Inactive'}
              </span>
            )}
          </div>
          {league && (
            <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${league.bg} ${isFormer ? 'opacity-70' : ''}`}>
              {league.icon} {a.pro_league}
            </span>
          )}
        </div>
        {a.current_org && <p className={`text-sm font-medium ${isFormer ? 'text-gray-600' : 'text-gray-700'}`}>{a.current_org}</p>}
        {a.current_role && <p className="text-sm text-gray-500">{a.current_role}</p>}
        {a.schools && (
          <Link href={`/schools/${a.schools.slug}`} className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block">
            {a.schools.name}
          </Link>
        )}
        {a.bio_note && <p className={`text-xs mt-2 line-clamp-2 ${isFormer ? 'text-gray-400' : 'text-gray-500'}`}>{a.bio_note}</p>}
        {!isFormer && (a.social_twitter || a.social_instagram) && (
          <div className="flex gap-3 mt-3">
            {a.social_twitter && (
              <a href={`https://twitter.com/${a.social_twitter}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-700">
                @{a.social_twitter}
              </a>
            )}
            {a.social_instagram && (
              <a href={`https://instagram.com/${a.social_instagram}`} target="_blank" rel="noopener noreferrer" className="text-xs text-pink-500 hover:text-pink-700">
                IG: {a.social_instagram}
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'college') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-400 transition" style={{ borderLeft: `3px solid ${sportColor}` }}>
        <p className="font-bold text-navy">{sportEmoji} {a.person_name}</p>
        {(a.current_org || a.college) && <p className="text-sm text-gray-700 font-medium">{a.current_org || a.college}</p>}
        {a.current_role && <p className="text-xs text-gray-500">{a.current_role}</p>}
        {a.schools && (
          <Link href={`/schools/${a.schools.slug}`} className="text-xs text-gray-400 mt-1 inline-block hover:text-blue-600">
            {a.schools.name}
          </Link>
        )}
        {a.bio_note && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{a.bio_note}</p>}
      </div>
    );
  }

  // Coaching
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-green-400 transition" style={{ borderLeft: '3px solid #16a34a' }}>
      <p className="font-bold text-navy">{a.person_name}</p>
      {a.current_org && <p className="text-sm text-gray-700">{a.current_org}</p>}
      {a.current_role && <p className="text-xs text-gray-500">{a.current_role}</p>}
      {a.schools && (
        <p className="text-xs text-gray-400 mt-1">HS: {a.schools.name}</p>
      )}
    </div>
  );
}

export default function OurGuysClient({ alumni, counts }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('active-pros');
  const [sportFilter, setSportFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Group alumni
  const activePros = useMemo(() => alumni.filter(a => a.current_level === 'pro' && a.status === 'active'), [alumni]);
  const formerPros = useMemo(() => alumni.filter(a => a.current_level === 'pro' && a.status !== 'active'), [alumni]);
  const collegeAlumni = useMemo(() => alumni.filter(a => a.current_level === 'college'), [alumni]);
  const coachingAlumni = useMemo(() => alumni.filter(a => a.current_level === 'coaching' || a.current_level === 'coach' || a.current_level === 'referee'), [alumni]);

  const currentList = activeTab === 'active-pros' ? activePros
    : activeTab === 'former-pros' ? formerPros
    : activeTab === 'college' ? collegeAlumni
    : coachingAlumni;

  // Apply filters
  const filtered = useMemo(() => {
    return currentList.filter(a => {
      const matchesSport = sportFilter === 'all' || a.sport_id === sportFilter;
      const matchesSearch = !searchTerm || a.person_name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSport && matchesSearch;
    });
  }, [currentList, sportFilter, searchTerm]);

  // Group by sport (when "All Sports" is selected)
  const groupedBySport = useMemo(() => {
    const groups: Record<string, AlumniRecord[]> = {};
    filtered.forEach(a => {
      const sport = a.sport_id || 'other';
      if (!groups[sport]) groups[sport] = [];
      groups[sport].push(a);
    });
    // Sort within each group: active first, then alphabetical
    Object.values(groups).forEach(group => {
      group.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        return a.person_name.localeCompare(b.person_name);
      });
    });
    return SPORT_ORDER
      .filter(s => groups[s]?.length > 0)
      .map(s => ({ sport: s, athletes: groups[s] }));
  }, [filtered]);

  const showGrouped = sportFilter === 'all' && groupedBySport.length > 1;

  // Top schools for sidebar
  const schoolCounts: Record<string, { count: number; slug: string }> = {};
  currentList.forEach(a => {
    if (a.schools?.name) {
      if (!schoolCounts[a.schools.name]) schoolCounts[a.schools.name] = { count: 0, slug: a.schools.slug };
      schoolCounts[a.schools.name].count++;
    }
  });
  const topSchools = Object.entries(schoolCounts).sort((a, b) => b[1].count - a[1].count).slice(0, 8);

  // League breakdown for sidebar (pro tabs only)
  const leagueCounts: Record<string, number> = {};
  if (activeTab === 'active-pros' || activeTab === 'former-pros') {
    currentList.forEach(a => {
      if (a.pro_league) leagueCounts[a.pro_league] = (leagueCounts[a.pro_league] || 0) + 1;
    });
  }
  const sortedLeagues = Object.entries(leagueCounts).sort((a, b) => b[1] - a[1]);

  const tabs: { key: Tab; label: string; count: number; border: string }[] = [
    { key: 'active-pros', label: 'Active Pros', count: activePros.length, border: 'border-gold' },
    { key: 'former-pros', label: 'Former Pros', count: formerPros.length, border: 'border-gray-400' },
    { key: 'college', label: 'College', count: collegeAlumni.length, border: 'border-blue-500' },
    { key: 'coaching', label: 'Coaching', count: coachingAlumni.length, border: 'border-green-500' },
  ];

  // Available sports in current tab
  const availableSports = useMemo(() => {
    const sports = new Set<string>();
    currentList.forEach(a => { if (a.sport_id) sports.add(a.sport_id); });
    return Array.from(sports).sort();
  }, [currentList]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="flex gap-0 border-b-2 border-gray-200 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSearchTerm(''); setSportFilter('all'); }}
                className={`flex-1 py-3 text-center text-sm font-bold font-bebas tracking-wider transition-colors ${
                  activeTab === tab.key
                    ? `text-navy border-b-3 ${tab.border}`
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                style={activeTab === tab.key ? { borderBottomWidth: 3 } : {}}
              >
                {tab.label}
                <span className="ml-1 text-xs font-normal">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSportFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  sportFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Sports
              </button>
              {availableSports.map(sport => (
                <button
                  key={sport}
                  onClick={() => setSportFilter(sport)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    sportFilter === sport
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {SPORT_EMOJIS[sport] || ''} {sport.charAt(0).toUpperCase() + sport.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-gray-200 text-sm bg-white"
            />
          </div>

          {/* Results count */}
          <p className="text-xs text-gray-400 mb-4">
            Showing {filtered.length} of {currentList.length} athletes
          </p>

          {/* Cards Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-gray-600 font-medium">No athletes found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search</p>
            </div>
          ) : showGrouped ? (
            /* Grouped by Sport view */
            <div className="space-y-8">
              {groupedBySport.map(({ sport, athletes }) => (
                <div key={sport}>
                  {/* Sport Section Header */}
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b-2" style={{ borderColor: SPORT_COLORS[sport] || '#6b7280' }}>
                    <span className="text-2xl">{SPORT_EMOJIS[sport] || ''}</span>
                    <h2 className="text-xl font-black tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif", color: SPORT_COLORS[sport] }}>
                      {SPORT_LABELS[sport] || sport}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: SPORT_COLORS[sport] }}>
                      {athletes.length}
                    </span>
                  </div>
                  {/* Cards for this sport */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {athletes.map(a => <AthleteCard key={a.id} a={a} activeTab={activeTab} />)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Flat grid (single sport selected) */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(a => <AthleteCard key={a.id} a={a} activeTab={activeTab} />)}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* League Breakdown (pro tabs) */}
          {sortedLeagues.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">
                By League
              </h3>
              <div className="space-y-2">
                {sortedLeagues.map(([league, count]) => {
                  const badge = LEAGUE_BADGES[league];
                  return (
                    <div key={league} className="flex justify-between items-center">
                      <span className="text-sm text-navy flex items-center gap-2">
                        {badge?.icon || '🏅'} {league}
                      </span>
                      <span className="text-sm font-bold text-navy">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Top Schools */}
          {topSchools.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">
                Top Schools
              </h3>
              <div className="space-y-2">
                {topSchools.map(([school, data], idx) => (
                  <div key={school} className="flex justify-between items-center">
                    <span className="text-sm text-navy">
                      <span className={`inline-block w-5 text-center mr-1 ${idx < 3 ? 'text-gold font-bold' : 'text-gray-400'}`}>{idx + 1}</span>
                      <Link href={`/schools/${data.slug}`} className="hover:text-blue-600 hover:underline">
                        {school}
                      </Link>
                    </span>
                    <span className="text-sm font-bold text-navy">{data.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notable Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">
              Notable Achievements
            </h3>
            <div className="text-xs text-gray-600 leading-relaxed space-y-2">
              <p><strong>Hall of Famers:</strong> Wilt Chamberlain, Kobe Bryant, Mike Piazza, Reggie Jackson</p>
              <p><strong>Active NFL Stars:</strong> Marvin Harrison Jr., Kyle Pitts, D&apos;Andre Swift, Abdul Carter</p>
              <p><strong>Top Pipeline:</strong> St. Joseph&apos;s Prep leads NFL; Roman Catholic &amp; Neumann-Goretti lead basketball</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">
              Quick Links
            </h3>
            <div className="space-y-2">
              <Link href="/pros" className="block text-sm text-navy hover:text-blue-600">
                → Before They Were Famous
              </Link>
              <Link href="/football" className="block text-sm text-navy hover:text-blue-600">
                → Football
              </Link>
              <Link href="/basketball" className="block text-sm text-navy hover:text-blue-600">
                → Basketball
              </Link>
              <Link href="/search" className="block text-sm text-navy hover:text-blue-600">
                → Player Search
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
