'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
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
  player_id?: number | null;
  slug?: string | null;
  bio_url?: string | null;
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

/* ─── Hero Carousel ─── */
function FeaturedHeroCarousel({ featured }: { featured: AlumniRecord[] }) {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % featured.length);
        setFade(true);
      }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;
  const a = featured[idx];
  const league = a.pro_league ? LEAGUE_BADGES[a.pro_league] : null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-navy via-navy-mid to-[#1a2744] border border-gray-700 mb-6">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full blur-[100px]" />
      </div>
      <div className={`relative px-6 py-8 md:px-10 md:py-10 transition-opacity duration-400 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-gold">Featured</span>
              {league && (
                <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${league.bg}`}>
                  {league.icon} {a.pro_league}
                </span>
              )}
            </div>
            <h2 className="text-3xl md:text-4xl font-bebas text-white tracking-wide">{a.person_name}</h2>
            <div className="flex items-center gap-3 mt-2">
              {a.current_org && <span className="text-gray-300 text-sm font-medium">{a.current_org}</span>}
              {a.current_role && a.current_role !== 'postgres' && <span className="text-gray-400 text-sm">{a.current_role}</span>}
            </div>
            {a.schools && (
              <Link href={`/schools/${a.schools.slug}`} className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block">
                HS: {a.schools.name}
              </Link>
            )}
            {a.draft_info && <p className="text-xs text-gray-500 mt-1">{a.draft_info}</p>}
            {a.bio_note && <p className="text-sm text-gray-400 mt-3 line-clamp-2 max-w-xl">{a.bio_note}</p>}
          </div>
          <div className="hidden md:flex flex-col items-center gap-1 ml-6">
            <div className="w-20 h-20 rounded-full bg-navy-mid border-2 border-gold flex items-center justify-center text-3xl">
              {SPORT_EMOJIS[a.sport_id || ''] || '🏅'}
            </div>
            {a.status === 'retired' && <span className="text-[10px] text-gray-500 uppercase tracking-wider">Legend</span>}
          </div>
        </div>
      </div>
      {/* Dots */}
      {featured.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => { setFade(false); setTimeout(() => { setIdx(i); setFade(true); }, 300); }}
              className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-gold w-6' : 'bg-gray-600 hover:bg-gray-500'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Alphabet Bar ─── */
function AlphabetBar({ letters, activeLetter, onSelect }: { letters: Set<string>; activeLetter: string | null; onSelect: (l: string | null) => void }) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  return (
    <div className="flex flex-wrap gap-px mb-3">
      <button
        onClick={() => onSelect(null)}
        className={`w-6 h-6 text-[10px] font-semibold rounded transition ${!activeLetter ? 'bg-gold text-navy' : 'text-gray-400 hover:text-gray-600'}`}
      >
        All
      </button>
      {alphabet.map(l => (
        <button
          key={l}
          onClick={() => letters.has(l) ? onSelect(l === activeLetter ? null : l) : undefined}
          disabled={!letters.has(l)}
          className={`w-6 h-6 text-[10px] font-medium rounded transition ${
            l === activeLetter ? 'bg-navy text-white' :
            letters.has(l) ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' :
            'text-gray-200 cursor-not-allowed'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

/* ─── Twitter Embed ─── */
function TwitterEmbed({ handle }: { handle: string }) {
  const [expanded, setExpanded] = useState(false);
  if (!handle) return null;
  return (
    <div className="mt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        {expanded ? 'Hide' : 'View'} @{handle}
      </button>
      {expanded && (
        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 max-h-[400px] overflow-y-auto">
          <iframe
            src={`https://syndication.twitter.com/srv/timeline-profile/screen-name/${handle}?dnt=true&embedId=twitter-widget-0&frame=false&hideBorder=true&hideFooter=true&hideHeader=true&hideScrollBar=false&lang=en&maxHeight=400px&showReplies=false&transparent=true&theme=light`}
            className="w-full border-0"
            style={{ height: '380px' }}
            title={`@${handle} tweets`}
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      )}
    </div>
  );
}

/* ─── Coaching Card ─── */
function CoachingCard({ a }: { a: AlumniRecord }) {
  const hasPlayerProfile = !!a.player_id && !!a.slug;
  const initials = a.person_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg hover:border-green-400 transition group">
      {/* Header with avatar */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white font-bold text-lg shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-navy">{a.person_name}</h3>
          {a.current_role && a.current_role !== 'postgres' && (
            <p className="text-sm font-medium text-gray-700">{a.current_role}</p>
          )}
          {a.current_org && (
            <p className="text-sm text-green-700 font-semibold">{a.current_org}</p>
          )}
        </div>
      </div>

      {/* Bio note */}
      {a.bio_note && <p className="text-xs text-gray-500 mt-3 leading-relaxed">{a.bio_note}</p>}

      {/* HS link */}
      {a.schools && (
        <div className="mt-2">
          <Link href={`/schools/${a.schools.slug}`} className="text-xs text-blue-600 hover:text-blue-800">
            🏫 {a.schools.name}
          </Link>
        </div>
      )}

      {/* College */}
      {a.college && (
        <p className="text-xs text-gray-400 mt-1">🎓 {a.college}</p>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100">
        {a.bio_url && (
          <a
            href={a.bio_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            Staff Bio
          </a>
        )}
        {a.social_twitter && (
          <a
            href={`https://twitter.com/${a.social_twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            @{a.social_twitter}
          </a>
        )}
        {hasPlayerProfile && (
          <Link
            href={`/players/${a.slug}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-navy hover:bg-gold transition"
          >
            📊 HS Stats
          </Link>
        )}
      </div>

      {/* Twitter embed */}
      {a.social_twitter && <TwitterEmbed handle={a.social_twitter} />}
    </div>
  );
}

/* ─── Athlete Card ─── */
function AthleteCard({ a, activeTab }: { a: AlumniRecord; activeTab: Tab }) {
  if (activeTab === 'coaching') return <CoachingCard a={a} />;

  const league = a.pro_league ? LEAGUE_BADGES[a.pro_league] : null;
  const sportEmoji = SPORT_EMOJIS[a.sport_id || ''] || '';
  const isInactive = a.status !== 'active';
  const sportColor = SPORT_COLORS[a.sport_id || 'other'] || '#6b7280';
  const hasPlayerProfile = !!a.player_id && !!a.slug;

  return (
    <div
      className={`bg-white rounded-lg border p-4 hover:shadow-md transition group ${
        activeTab === 'former-pros' ? 'opacity-80 hover:border-gray-400' :
        activeTab === 'college' ? 'hover:border-blue-400' :
        'hover:border-gold'
      }`}
      style={{ borderLeft: `3px solid ${sportColor}` }}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className={`font-bold text-base truncate ${activeTab === 'former-pros' ? 'text-gray-700' : 'text-navy'}`}>
            {a.person_name}
          </h3>
          {isInactive && activeTab !== 'former-pros' && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-500 shrink-0">
              {a.status === 'retired' ? 'Retired' : a.status === 'deceased' ? 'Deceased' : 'Inactive'}
            </span>
          )}
        </div>
        {league && (
          <span className={`px-2 py-0.5 rounded text-xs font-bold text-white shrink-0 ${league.bg} ${activeTab === 'former-pros' ? 'opacity-70' : ''}`}>
            {league.icon} {a.pro_league}
          </span>
        )}
      </div>

      {a.current_org && (
        <p className={`text-sm font-medium ${activeTab === 'former-pros' ? 'text-gray-600' : 'text-gray-700'}`}>
          {a.current_org}
        </p>
      )}
      {a.current_role && a.current_role !== 'postgres' && (
        <p className="text-xs text-gray-500">{a.current_role}</p>
      )}

      <div className="flex items-center gap-3 mt-2">
        {a.schools && (
          <Link href={`/schools/${a.schools.slug}`} className="text-xs text-blue-600 hover:text-blue-800">
            {a.schools.name}
          </Link>
        )}
        {a.college && activeTab !== 'college' && (
          <span className="text-xs text-gray-400">{a.college}</span>
        )}
      </div>

      {a.bio_note && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{a.bio_note}</p>}

      {/* Footer: socials + player profile link */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-3">
          {a.social_twitter && activeTab !== 'former-pros' && (
            <a href={`https://twitter.com/${a.social_twitter}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-700">
              @{a.social_twitter}
            </a>
          )}
          {a.social_instagram && activeTab !== 'former-pros' && (
            <a href={`https://instagram.com/${a.social_instagram}`} target="_blank" rel="noopener noreferrer" className="text-xs text-pink-500 hover:text-pink-700">
              IG
            </a>
          )}
        </div>
        {hasPlayerProfile && (
          <Link
            href={`/players/${a.slug}`}
            className="text-xs font-semibold text-navy bg-gray-100 px-2 py-1 rounded hover:bg-gold hover:text-navy transition opacity-0 group-hover:opacity-100"
          >
            HS Stats
          </Link>
        )}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function OurGuysClient({ alumni, counts }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('active-pros');
  const [sportFilter, setSportFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [leagueFilter, setLeagueFilter] = useState<string | null>(null);
  const [collegeFilter, setCollegeFilter] = useState<string | null>(null);
  const [schoolFilter, setSchoolFilter] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Cmd+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSportFilter('all');
    setActiveLetter(null);
    setLeagueFilter(null);
    setCollegeFilter(null);
    setSchoolFilter(null);
  }, []);

  // Featured heroes (only from active + retired pros)
  const featuredHeroes = useMemo(() => alumni.filter(a => a.featured), [alumni]);

  // Group alumni by tab
  const activePros = useMemo(() => alumni.filter(a => a.current_level === 'pro' && a.status === 'active'), [alumni]);
  const formerPros = useMemo(() => alumni.filter(a => a.current_level === 'pro' && a.status !== 'active'), [alumni]);
  const collegeAlumni = useMemo(() => alumni.filter(a => a.current_level === 'college'), [alumni]);
  const coachingAlumni = useMemo(() => alumni.filter(a =>
    a.current_level === 'coaching' || a.current_level === 'coach' || a.current_level === 'referee' ||
    (a.current_role && a.current_role.toLowerCase().includes('coach'))
  ), [alumni]);

  const currentList = activeTab === 'active-pros' ? activePros
    : activeTab === 'former-pros' ? formerPros
    : activeTab === 'college' ? collegeAlumni
    : coachingAlumni;

  // Available filter options
  const availableSports = useMemo(() => {
    const sports = new Set<string>();
    currentList.forEach(a => { if (a.sport_id) sports.add(a.sport_id); });
    return SPORT_ORDER.filter(s => sports.has(s));
  }, [currentList]);

  const availableLeagues = useMemo(() => {
    const leagues: Record<string, number> = {};
    currentList.forEach(a => { if (a.pro_league) leagues[a.pro_league] = (leagues[a.pro_league] || 0) + 1; });
    return Object.entries(leagues).sort((a, b) => b[1] - a[1]);
  }, [currentList]);

  const availableColleges = useMemo(() => {
    const colleges: Record<string, number> = {};
    currentList.forEach(a => {
      const col = a.college || a.current_org;
      if (col) colleges[col] = (colleges[col] || 0) + 1;
    });
    return Object.entries(colleges).sort((a, b) => b[1] - a[1]).slice(0, 20);
  }, [currentList]);

  const availableSchools = useMemo(() => {
    const schools: Record<string, { count: number; slug: string }> = {};
    currentList.forEach(a => {
      if (a.schools?.name) {
        if (!schools[a.schools.name]) schools[a.schools.name] = { count: 0, slug: a.schools.slug };
        schools[a.schools.name].count++;
      }
    });
    return Object.entries(schools).sort((a, b) => b[1].count - a[1].count).slice(0, 15);
  }, [currentList]);

  // Apply all filters
  const filtered = useMemo(() => {
    return currentList.filter(a => {
      if (sportFilter !== 'all' && a.sport_id !== sportFilter) return false;
      if (searchTerm && !a.person_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (activeLetter && !a.person_name.toUpperCase().startsWith(activeLetter)) return false;
      if (leagueFilter && a.pro_league !== leagueFilter) return false;
      if (collegeFilter && a.college !== collegeFilter && a.current_org !== collegeFilter) return false;
      if (schoolFilter && a.schools?.name !== schoolFilter) return false;
      return true;
    });
  }, [currentList, sportFilter, searchTerm, activeLetter, leagueFilter, collegeFilter, schoolFilter]);

  // Available letters
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    currentList.forEach(a => {
      const first = a.person_name.charAt(0).toUpperCase();
      if (first >= 'A' && first <= 'Z') letters.add(first);
    });
    return letters;
  }, [currentList]);

  // Group by sport
  const groupedBySport = useMemo(() => {
    const groups: Record<string, AlumniRecord[]> = {};
    filtered.forEach(a => {
      const sport = a.sport_id || 'other';
      if (!groups[sport]) groups[sport] = [];
      groups[sport].push(a);
    });
    Object.values(groups).forEach(group => {
      group.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        return a.person_name.localeCompare(b.person_name);
      });
    });
    return SPORT_ORDER.filter(s => groups[s]?.length > 0).map(s => ({ sport: s, athletes: groups[s] }));
  }, [filtered]);

  const showGrouped = sportFilter === 'all' && !searchTerm && !activeLetter && !leagueFilter && !collegeFilter && !schoolFilter && groupedBySport.length > 1;

  const hasActiveFilters = sportFilter !== 'all' || searchTerm || activeLetter || leagueFilter || collegeFilter || schoolFilter;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'active-pros', label: 'Active Pros', count: activePros.length },
    { key: 'former-pros', label: 'Former Pros', count: formerPros.length },
    { key: 'college', label: 'College', count: collegeAlumni.length },
    { key: 'coaching', label: 'Coaching', count: coachingAlumni.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Featured Hero Carousel */}
      <FeaturedHeroCarousel featured={featuredHeroes} />

      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          ref={searchRef}
          type="text"
          placeholder="Search athletes by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-200 text-sm bg-white shadow-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        />
        <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="absolute right-3 top-3 text-xs text-gray-300 hidden sm:inline">Cmd+K</span>
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="absolute right-16 top-3 text-gray-400 hover:text-gray-600 text-sm">
            Clear
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b-2 border-gray-200 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); resetFilters(); }}
            className={`flex-1 py-3 text-center text-sm font-bold font-bebas tracking-wider transition-colors ${
              activeTab === tab.key
                ? 'text-navy border-b-3 border-gold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            style={activeTab === tab.key ? { borderBottomWidth: 3 } : {}}
          >
            {tab.label}
            <span className="ml-1 text-xs font-normal">({tab.count})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Filter Pills Row */}
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Sport filters */}
            <button
              onClick={() => setSportFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                sportFilter === 'all' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Sports
            </button>
            {availableSports.map(sport => (
              <button
                key={sport}
                onClick={() => setSportFilter(sport === sportFilter ? 'all' : sport)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  sportFilter === sport ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={sportFilter === sport ? { backgroundColor: SPORT_COLORS[sport] } : {}}
              >
                {SPORT_EMOJIS[sport]} {SPORT_LABELS[sport] || sport}
              </button>
            ))}

            {/* League filter pills (pro tabs) */}
            {(activeTab === 'active-pros' || activeTab === 'former-pros') && availableLeagues.length > 0 && (
              <>
                <span className="text-gray-300 self-center">|</span>
                {availableLeagues.slice(0, 6).map(([league, count]) => (
                  <button
                    key={league}
                    onClick={() => setLeagueFilter(league === leagueFilter ? null : league)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                      leagueFilter === league ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {LEAGUE_BADGES[league]?.icon || '🏅'} {league} ({count})
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-3">
              {collegeFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                  College: {collegeFilter}
                  <button onClick={() => setCollegeFilter(null)} className="ml-1 hover:text-blue-900">&times;</button>
                </span>
              )}
              {schoolFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  HS: {schoolFilter}
                  <button onClick={() => setSchoolFilter(null)} className="ml-1 hover:text-green-900">&times;</button>
                </span>
              )}
              {activeLetter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                  Letter: {activeLetter}
                  <button onClick={() => setActiveLetter(null)} className="ml-1 hover:text-gray-900">&times;</button>
                </span>
              )}
              <button onClick={resetFilters} className="text-xs text-red-500 hover:text-red-700 font-medium">
                Clear all filters
              </button>
            </div>
          )}

          {/* Alphabet Bar */}
          <AlphabetBar letters={availableLetters} activeLetter={activeLetter} onSelect={setActiveLetter} />

          {/* Results count */}
          <p className="text-xs text-gray-400 mb-4">
            Showing {filtered.length} of {currentList.length}
          </p>

          {/* Cards Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-gray-600 font-medium">No athletes found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search</p>
              <button onClick={resetFilters} className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                Reset all filters
              </button>
            </div>
          ) : showGrouped ? (
            <div className="space-y-8">
              {groupedBySport.map(({ sport, athletes }) => (
                <div key={sport}>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b-2" style={{ borderColor: SPORT_COLORS[sport] || '#6b7280' }}>
                    <span className="text-lg">{SPORT_EMOJIS[sport] || ''}</span>
                    <h2 className="psp-h3" style={{ color: SPORT_COLORS[sport] }}>
                      {SPORT_LABELS[sport] || sport}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: SPORT_COLORS[sport] }}>
                      {athletes.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {athletes.map(a => <AthleteCard key={a.id} a={a} activeTab={activeTab} />)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(a => <AthleteCard key={a.id} a={a} activeTab={activeTab} />)}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Top Colleges */}
          {availableColleges.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">
                {activeTab === 'college' ? 'Filter by College' : 'Top Colleges'}
              </h3>
              <div className="space-y-1.5">
                {availableColleges.slice(0, 10).map(([col, count]) => (
                  <button
                    key={col}
                    onClick={() => setCollegeFilter(col === collegeFilter ? null : col)}
                    className={`w-full flex justify-between items-center text-sm px-2 py-1 rounded transition ${
                      collegeFilter === col ? 'bg-blue-50 text-blue-700 font-medium' : 'text-navy hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">{col}</span>
                    <span className="text-xs font-bold text-gray-400 shrink-0 ml-2">{count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Top High Schools */}
          {availableSchools.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">
                Filter by High School
              </h3>
              <div className="space-y-1.5">
                {availableSchools.slice(0, 10).map(([school, data]) => (
                  <button
                    key={school}
                    onClick={() => setSchoolFilter(school === schoolFilter ? null : school)}
                    className={`w-full flex justify-between items-center text-sm px-2 py-1 rounded transition ${
                      schoolFilter === school ? 'bg-green-50 text-green-700 font-medium' : 'text-navy hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">{school}</span>
                    <span className="text-xs font-bold text-gray-400 shrink-0 ml-2">{data.count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">
              Explore
            </h3>
            <div className="space-y-2">
              <Link href="/pros" className="block text-sm text-navy hover:text-blue-600">
                Before They Were Famous
              </Link>
              <Link href="/football" className="block text-sm text-navy hover:text-blue-600">
                Football Hub
              </Link>
              <Link href="/basketball" className="block text-sm text-navy hover:text-blue-600">
                Basketball Hub
              </Link>
              <Link href="/search" className="block text-sm text-navy hover:text-blue-600">
                Player Search
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
