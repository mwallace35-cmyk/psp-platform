'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import SchoolLogo from '@/components/ui/SchoolLogo';
import TrajectoryBadge from '@/components/our-guys/TrajectoryBadge';
import type { TrajectoryLabel } from '@/components/our-guys/TrajectoryBadge';

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
  trajectory_label?: TrajectoryLabel | null;
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
  NFL: { icon: '\u{1F3C8}', bg: 'bg-green-700' },
  NBA: { icon: '\u{1F3C0}', bg: 'bg-orange-600' },
  MLB: { icon: '\u26BE', bg: 'bg-blue-700' },
  WNBA: { icon: '\u{1F3C0}', bg: 'bg-purple-700' },
  MLS: { icon: '\u26BD', bg: 'bg-purple-700' },
  'NBA G League': { icon: '\u{1F3C0}', bg: 'bg-orange-500' },
  UFL: { icon: '\u{1F3C8}', bg: 'bg-gray-600' },
};

const SPORT_EMOJIS: Record<string, string> = {
  football: '\u{1F3C8}',
  basketball: '\u{1F3C0}',
  baseball: '\u26BE',
  soccer: '\u26BD',
  lacrosse: '\u{1F94D}',
  'track-field': '\u{1F3C3}',
  wrestling: '\u{1F93C}',
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
  baseball: '#dc2626',
  soccer: '#059669',
  lacrosse: '#0891b2',
  'track-field': '#7c3aed',
  wrestling: '#ca8a04',
  other: '#6b7280',
};

const SPORT_ORDER = ['football', 'basketball', 'baseball', 'soccer', 'lacrosse', 'track-field', 'wrestling', 'other'];

/** Pro league pill colors */
const PRO_PILL: Record<string, { bg: string; text: string }> = {
  NFL:           { bg: '#16a34a', text: '#ffffff' },
  NBA:           { bg: '#3b82f6', text: '#ffffff' },
  MLB:           { bg: '#ea580c', text: '#ffffff' },
  WNBA:          { bg: '#7c3aed', text: '#ffffff' },
  MLS:           { bg: '#059669', text: '#ffffff' },
  'NBA G League': { bg: '#f97316', text: '#ffffff' },
  UFL:           { bg: '#6b7280', text: '#ffffff' },
};

/* ─── Source pattern to strip from bio_note ─── */
const SOURCE_PATTERN = /\s*(?:source:\s*\S+|via\s+\S+)\s*\.?\s*$/i;

/** Strip source attribution and clean trailing junk from a bio string */
function cleanBio(raw: string | null): string | null {
  if (!raw) return null;
  let cleaned = raw.replace(SOURCE_PATTERN, '').trim();
  cleaned = cleaned.replace(/\s*https?:\/\/\S+\s*$/i, '').trim();
  return cleaned || null;
}

/** Truncate to maxLen chars at a word boundary, appending ellipsis */
function truncateBio(text: string, maxLen = 120): string {
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(' ');
  const cutPoint = lastSpace > maxLen * 0.6 ? lastSpace : maxLen;
  return truncated.slice(0, cutPoint).replace(/[,;:\-\s]+$/, '') + '...';
}

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
                  <span aria-hidden="true">{league.icon}</span> {a.pro_league}
                </span>
              )}
            </div>
            <h2 className="psp-h2 text-white">{a.person_name}</h2>
            <div className="flex items-center gap-3 mt-2">
              {a.current_org && <span className="text-gray-300 text-sm font-medium">{a.current_org}</span>}
              {a.current_role && a.current_role !== 'postgres' && <span className="text-gray-300 text-sm">{a.current_role}</span>}
            </div>
            {a.schools && (
              <Link href={`/schools/${a.schools.slug}`} className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block">
                HS: {a.schools.name}
              </Link>
            )}
            {a.draft_info && <p className="text-xs text-gray-400 mt-1">{a.draft_info}</p>}
            {(() => {
              const bio = cleanBio(a.bio_note);
              return bio ? <p className="text-sm text-gray-300 mt-3 max-w-xl">{truncateBio(bio, 160)}</p> : null;
            })()}
          </div>
          <div className="hidden md:flex flex-col items-center gap-1 ml-6">
            <div className="w-20 h-20 rounded-full bg-navy-mid border-2 border-gold flex items-center justify-center text-3xl">
              {SPORT_EMOJIS[a.sport_id || ''] || '\u{1F3C5}'}
            </div>
            {a.status === 'retired' && <span className="text-[10px] text-gray-400 uppercase tracking-wider">Legend</span>}
          </div>
        </div>
      </div>
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
  const sportColor = SPORT_COLORS[a.sport_id || 'other'] || SPORT_COLORS.other;
  const sportLabel = a.sport_id ? SPORT_LABELS[a.sport_id] : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group animate-fade-in-up">
      <div className="h-[3px]" style={{ backgroundColor: sportColor }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-base font-heading truncate" style={{ color: 'var(--psp-navy, #0a1628)' }}>
            {a.person_name}
          </h3>
          {a.current_org && (
            <span className="text-xs text-gray-400 shrink-0 text-right max-w-[40%] truncate">{a.current_org}</span>
          )}
        </div>
        <p className="text-[11px] text-gray-500 font-medium leading-tight flex items-center gap-1 flex-wrap">
          {a.current_role && a.current_role !== 'postgres' && <span>{a.current_role}</span>}
          {a.current_role && a.current_role !== 'postgres' && a.schools && (
            <span className="text-gray-300" aria-hidden="true">&middot;</span>
          )}
          {a.schools && (
            <Link href={`/schools/${a.schools.slug}`} className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors">
              <SchoolLogo name={a.schools.name} size="sm" />
              <span>{a.schools.name}</span>
            </Link>
          )}
          {sportLabel && (
            <>
              <span className="text-gray-300" aria-hidden="true">&middot;</span>
              <span>{sportLabel}</span>
            </>
          )}
        </p>
        {a.college && <p className="text-[11px] text-gray-400 mt-1">College: {a.college}</p>}
        {(() => {
          const bio = cleanBio(a.bio_note);
          return bio ? <p className="text-xs text-gray-500 mt-2 leading-relaxed">{truncateBio(bio, 120)}</p> : null;
        })()}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {a.bio_url && (
              <a href={a.bio_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Staff Bio
              </a>
            )}
            {a.social_twitter && (
              <a href={`https://twitter.com/${a.social_twitter}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-blue-500 transition">
                @{a.social_twitter}
              </a>
            )}
          </div>
          {hasPlayerProfile ? (
            <Link href={`/players/${a.slug}`} className="text-xs font-bold px-3 py-1.5 rounded-md transition hover:brightness-110" style={{ backgroundColor: 'var(--psp-gold, #f0a500)', color: 'var(--psp-navy, #0a1628)' }}>
              View Full Profile
            </Link>
          ) : (
            <span className="text-[11px] text-gray-400 italic">Profile Coming Soon</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Athlete Card ─── */
function AthleteCard({ a, activeTab }: { a: AlumniRecord; activeTab: Tab }) {
  if (activeTab === 'coaching') return <CoachingCard a={a} />;

  const isInactive = a.status !== 'active';
  const sportColor = SPORT_COLORS[a.sport_id || 'other'] || SPORT_COLORS.other;
  const sportLabel = a.sport_id ? SPORT_LABELS[a.sport_id] : null;
  const hasPlayerProfile = !!a.player_id && !!a.slug;
  const proPill = a.pro_league ? PRO_PILL[a.pro_league] : null;
  const isFormer = activeTab === 'former-pros';

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group animate-fade-in-up ${isFormer ? 'opacity-85' : ''}`}>
      <div className="h-[3px]" style={{ backgroundColor: sportColor }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-bold text-base font-heading truncate" style={{ color: isFormer ? '#374151' : 'var(--psp-navy, #0a1628)' }}>
              {a.person_name}
            </h3>
            {isInactive && !isFormer && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-400 shrink-0">
                {a.status === 'retired' ? 'Retired' : a.status === 'deceased' ? 'Deceased' : 'Inactive'}
              </span>
            )}
          </div>
          {a.current_org && (
            <span className={`text-xs shrink-0 text-right max-w-[40%] truncate ${isFormer ? 'text-gray-400' : 'text-gray-500'}`}>
              {a.current_org}
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-500 font-medium leading-tight flex items-center gap-1 flex-wrap">
          {a.schools && (
            <Link href={`/schools/${a.schools.slug}`} className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors">
              <SchoolLogo name={a.schools.name} size="sm" />
              <span>{a.schools.name}</span>
            </Link>
          )}
          {a.schools && sportLabel && <span className="text-gray-300" aria-hidden="true">&middot;</span>}
          {sportLabel && <span>{sportLabel}</span>}
          {a.college && activeTab !== 'college' && (
            <>
              <span className="text-gray-300" aria-hidden="true">&middot;</span>
              <span className="text-gray-400">{a.college}</span>
            </>
          )}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {proPill && a.pro_league && (
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${isFormer ? 'opacity-70' : ''}`}
              style={{ backgroundColor: proPill.bg, color: proPill.text }}
            >
              {a.pro_league}
            </span>
          )}
          {a.trajectory_label && a.trajectory_label !== 'below_projection' && (
            <TrajectoryBadge label={a.trajectory_label} />
          )}
        </div>
        {a.current_role && a.current_role !== 'postgres' && (
          <p className="text-[11px] text-gray-400 mt-1">{a.current_role}</p>
        )}
        {a.draft_info && <p className="text-[11px] text-gray-400 mt-0.5">{a.draft_info}</p>}
        {(() => {
          const bio = cleanBio(a.bio_note);
          return bio ? <p className="text-xs text-gray-500 mt-2 leading-relaxed">{truncateBio(bio, 120)}</p> : null;
        })()}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {a.social_twitter && !isFormer && (
              <a href={`https://twitter.com/${a.social_twitter}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-blue-500 transition">
                @{a.social_twitter}
              </a>
            )}
            {a.social_instagram && !isFormer && (
              <a href={`https://instagram.com/${a.social_instagram}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-pink-500 transition">
                IG
              </a>
            )}
          </div>
          {hasPlayerProfile ? (
            <Link href={`/players/${a.slug}`} className="text-xs font-bold px-3 py-1.5 rounded-md transition hover:brightness-110" style={{ backgroundColor: 'var(--psp-gold, #f0a500)', color: 'var(--psp-navy, #0a1628)' }}>
              View Full Profile
            </Link>
          ) : (
            <span className="text-[11px] text-gray-400 italic">Profile Coming Soon</span>
          )}
        </div>
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
  const [sortBy, setSortBy] = useState<'name' | 'school' | 'sport' | 'grad'>('name');
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
    setSortBy('name');
  }, []);

  // Featured heroes
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

  // Apply all filters + sort
  const filtered = useMemo(() => {
    const result = currentList.filter(a => {
      if (sportFilter !== 'all' && a.sport_id !== sportFilter) return false;
      if (searchTerm && !a.person_name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (activeLetter && !a.person_name.toUpperCase().startsWith(activeLetter)) return false;
      if (leagueFilter && a.pro_league !== leagueFilter) return false;
      if (collegeFilter && a.college !== collegeFilter && a.current_org !== collegeFilter) return false;
      if (schoolFilter && a.schools?.name !== schoolFilter) return false;
      return true;
    });
    result.sort((a, b) => {
      switch (sortBy) {
        case 'school': return (a.schools?.name || 'ZZZ').localeCompare(b.schools?.name || 'ZZZ');
        case 'sport': return (a.sport_id || 'zzz').localeCompare(b.sport_id || 'zzz');
        case 'grad': return 0;
        default: return a.person_name.localeCompare(b.person_name);
      }
    });
    return result;
  }, [currentList, sportFilter, searchTerm, activeLetter, leagueFilter, collegeFilter, schoolFilter, sortBy]);

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

  /* Shared dropdown style for Step 3 refinement row */
  const selectCls = 'w-full sm:w-auto flex-1 min-w-0 appearance-none rounded-lg border border-gray-600 bg-[#0f2040] text-gray-200 text-xs px-3 py-2 pr-7 focus:outline-none focus:border-[#f0a500] focus:ring-1 focus:ring-[#f0a500] cursor-pointer';
  const chevronSvg = (
    <svg className="pointer-events-none absolute right-2 top-2.5 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Featured Hero Carousel */}
      <FeaturedHeroCarousel featured={featuredHeroes} />

      {/* ═══ Sticky Filter Bar ═══ */}
      <div
        className="sticky z-30 rounded-xl border border-gray-700 px-4 py-3 mb-6 space-y-3"
        style={{ top: 64, backgroundColor: '#0a1628' }}
      >
        {/* Row 1: Category pills + Sport pills + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Step 1 — Category pills */}
          <div className="flex flex-wrap gap-1.5">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); resetFilters(); }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                  activeTab === tab.key
                    ? 'text-[#0a1628] shadow-md'
                    : 'text-gray-400 hover:text-gray-200 bg-transparent border border-gray-600 hover:border-gray-400'
                }`}
                style={activeTab === tab.key ? { backgroundColor: '#f0a500' } : {}}
              >
                {tab.label}
                <span className="ml-1 opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-gray-600 shrink-0" />

          {/* Step 2 — Sport pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSportFilter('all')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                sportFilter === 'all'
                  ? 'bg-white/15 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              All Sports
            </button>
            {availableSports.map(sport => (
              <button
                key={sport}
                onClick={() => setSportFilter(sport === sportFilter ? 'all' : sport)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                  sportFilter === sport ? 'text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
                }`}
                style={sportFilter === sport ? { backgroundColor: SPORT_COLORS[sport] } : {}}
              >
                {SPORT_EMOJIS[sport]} {SPORT_LABELS[sport] || sport}
              </button>
            ))}
          </div>

          {/* Search — pushed right on desktop */}
          <div className="sm:ml-auto relative w-full sm:w-56 shrink-0">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-600 bg-[#0f2040] text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#f0a500] focus:ring-1 focus:ring-[#f0a500]"
            />
            <svg className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-2 top-2 text-gray-400 hover:text-gray-200 text-xs">
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Step 3 — Refinement dropdowns + count */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          {/* League dropdown (pro tabs only) */}
          {(activeTab === 'active-pros' || activeTab === 'former-pros') && availableLeagues.length > 0 && (
            <div className="relative flex-1 min-w-0">
              <select
                value={leagueFilter || ''}
                onChange={(e) => setLeagueFilter(e.target.value || null)}
                className={selectCls}
              >
                <option value="">All Leagues</option>
                {availableLeagues.map(([league, count]) => (
                  <option key={league} value={league}>{league} ({count})</option>
                ))}
              </select>
              {chevronSvg}
            </div>
          )}

          {/* School dropdown */}
          {availableSchools.length > 0 && (
            <div className="relative flex-1 min-w-0">
              <select
                value={schoolFilter || ''}
                onChange={(e) => setSchoolFilter(e.target.value || null)}
                className={selectCls}
              >
                <option value="">All High Schools</option>
                {availableSchools.map(([school, data]) => (
                  <option key={school} value={school}>{school} ({data.count})</option>
                ))}
              </select>
              {chevronSvg}
            </div>
          )}

          {/* Alphabet dropdown */}
          <div className="relative flex-1 min-w-0">
            <select
              value={activeLetter || ''}
              onChange={(e) => setActiveLetter(e.target.value || null)}
              className={selectCls}
            >
              <option value="">A-Z (All)</option>
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => availableLetters.has(l)).map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            {chevronSvg}
          </div>

          {/* Sort dropdown */}
          <div className="relative flex-1 min-w-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className={selectCls}
            >
              <option value="name">Sort: Name A-Z</option>
              <option value="school">Sort: School</option>
              <option value="sport">Sort: Sport</option>
            </select>
            {chevronSvg}
          </div>

          {/* Results count + clear */}
          <div className="flex items-center gap-3 sm:ml-auto shrink-0">
            <span className="text-xs font-medium" style={{ color: '#f0a500' }}>
              Showing {filtered.length} of {currentList.length}
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-gray-400 hover:text-white underline underline-offset-2"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1.5">
            {leagueFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-gray-200 text-[11px] font-medium">
                {leagueFilter}
                <button onClick={() => setLeagueFilter(null)} className="ml-0.5 hover:text-white">&times;</button>
              </span>
            )}
            {collegeFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300 text-[11px] font-medium">
                {collegeFilter}
                <button onClick={() => setCollegeFilter(null)} className="ml-0.5 hover:text-white">&times;</button>
              </span>
            )}
            {schoolFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-900/40 text-green-300 text-[11px] font-medium">
                {schoolFilter}
                <button onClick={() => setSchoolFilter(null)} className="ml-0.5 hover:text-white">&times;</button>
              </span>
            )}
            {activeLetter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-gray-200 text-[11px] font-medium">
                Letter: {activeLetter}
                <button onClick={() => setActiveLetter(null)} className="ml-0.5 hover:text-white">&times;</button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-gray-200 text-[11px] font-medium">
                &ldquo;{searchTerm}&rdquo;
                <button onClick={() => setSearchTerm('')} className="ml-0.5 hover:text-white">&times;</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ═══ Cards Grid (full width, no sidebar) ═══ */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">{'\u{1F50D}'}</p>
          <p className="text-gray-400 font-medium">No athletes found</p>
          <p className="text-gray-300 text-sm mt-1">Try adjusting your filters or search</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {athletes.map(a => <AthleteCard key={a.id} a={a} activeTab={activeTab} />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(a => <AthleteCard key={a.id} a={a} activeTab={activeTab} />)}
        </div>
      )}
    </div>
  );
}
