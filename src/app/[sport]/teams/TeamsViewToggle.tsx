'use client';

import { useState } from 'react';
import Link from 'next/link';
import SchoolLogo from '@/components/ui/SchoolLogo';

/* ── Types ─────────────────────────────────────────────────────────── */

export interface TeamCardData {
  school: {
    id: number;
    name: string;
    slug: string;
    city: string | null;
    state: string | null;
  };
  league: string;
  closedYear: number | null;
  totalWins: number;
  totalLosses: number;
  totalTies: number;
  seasonCount: number;
  championships: number;
  // supplemental
  logoUrl: string | null;
  primaryColor: string | null;
  mascot: string | null;
  division: string | null;
}

export interface DiscontinuedSchoolData {
  id: number;
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
  league: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  mascot: string | null;
}

export interface StateChampData {
  schoolId: number;
  championshipType: string;
}

interface DivisionGroup {
  division: string;
  teams: TeamCardData[];
}

interface LeagueSection {
  league: string;
  divisionGroups: DivisionGroup[];
}

interface TeamsViewToggleProps {
  sport: string;
  leagueSections: LeagueSection[];
  closedTeams: TeamCardData[];
  discontinuedSchools: DiscontinuedSchoolData[];
  stateChampIds: number[];
  stateChampMap: Record<number, string>;
  latestSeasonLabel: string | null;
  leagueColors: Record<string, string>;
}

/* ── Icons ─────────────────────────────────────────────────────────── */

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke={active ? '#f0a500' : '#9ca3af'} strokeWidth="1.5" fill={active ? '#f0a50020' : 'none'} />
      <rect x="11" y="1" width="6" height="6" rx="1" stroke={active ? '#f0a500' : '#9ca3af'} strokeWidth="1.5" fill={active ? '#f0a50020' : 'none'} />
      <rect x="1" y="11" width="6" height="6" rx="1" stroke={active ? '#f0a500' : '#9ca3af'} strokeWidth="1.5" fill={active ? '#f0a50020' : 'none'} />
      <rect x="11" y="11" width="6" height="6" rx="1" stroke={active ? '#f0a500' : '#9ca3af'} strokeWidth="1.5" fill={active ? '#f0a50020' : 'none'} />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="2" width="16" height="3" rx="1" stroke={active ? '#f0a500' : '#9ca3af'} strokeWidth="1.5" fill={active ? '#f0a50020' : 'none'} />
      <rect x="1" y="8" width="16" height="3" rx="1" stroke={active ? '#f0a500' : '#9ca3af'} strokeWidth="1.5" fill={active ? '#f0a50020' : 'none'} />
      <rect x="1" y="14" width="16" height="3" rx="1" stroke={active ? '#f0a500' : '#9ca3af'} strokeWidth="1.5" fill={active ? '#f0a50020' : 'none'} />
    </svg>
  );
}

/* ── State Champ Banner ────────────────────────────────────────────── */

function StateChampBanner({ type, label }: { type: string; label: string }) {
  return (
    <div
      className="absolute top-0 right-0 overflow-hidden"
      style={{ width: 120, height: 120, pointerEvents: 'none' }}
    >
      <div
        className="absolute text-center font-bold text-[10px] leading-tight text-white shadow-sm"
        style={{
          width: 170,
          top: 18,
          right: -42,
          transform: 'rotate(45deg)',
          background: 'linear-gradient(135deg, #f0a500, #d4920a)',
          padding: '4px 0',
          letterSpacing: '0.02em',
        }}
      >
        <span>&#127942; {label} Champs {type ? `\u00B7 ${type}` : ''}</span>
      </div>
    </div>
  );
}

/* ── Accordion ─────────────────────────────────────────────────────── */

function Accordion({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[var(--psp-gray-200)] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="font-bold text-sm" style={{ color: 'var(--psp-gray-400)' }}>
          {title} ({count})
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M4 6L8 10L12 6" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

/* ── Card (Grid View) ──────────────────────────────────────────────── */

function TeamCard({
  team,
  sport,
  leagueColor,
  isStateChamp,
  champType,
  latestSeasonLabel,
  opacity,
  closedBadge,
}: {
  team: TeamCardData | DiscontinuedSchoolData;
  sport: string;
  leagueColor: string;
  isStateChamp: boolean;
  champType: string;
  latestSeasonLabel: string | null;
  opacity?: number;
  closedBadge?: string | null;
}) {
  const isTeamCard = 'totalWins' in team;
  const school = isTeamCard ? (team as TeamCardData).school : team as DiscontinuedSchoolData;
  const borderColor = ('primaryColor' in team ? team.primaryColor : null) || leagueColor;
  const mascot = 'mascot' in team ? team.mascot : null;
  const logoUrl = 'logoUrl' in team ? team.logoUrl : null;

  const total = isTeamCard ? (team as TeamCardData).totalWins + (team as TeamCardData).totalLosses + (team as TeamCardData).totalTies : 0;
  const winPct = total > 0 ? (((team as TeamCardData).totalWins / total) * 100).toFixed(0) : '0';

  return (
    <Link
      href={`/${sport}/schools/${school.slug}`}
      className="group block bg-white rounded-lg border border-[var(--psp-gray-200)] hover:shadow-lg hover:border-[var(--psp-gold)] transition-all focus-visible:ring-2 focus-visible:ring-[var(--psp-gold)] focus-visible:ring-offset-2 focus-visible:outline-none relative overflow-hidden"
      style={{ opacity: opacity ?? 1, borderTop: `3px solid ${borderColor}` }}
    >
      {isStateChamp && latestSeasonLabel && (
        <StateChampBanner type={champType} label={latestSeasonLabel} />
      )}

      <div className="p-4">
        {/* Top row: logo + name + mascot */}
        <div className="flex items-center gap-3 mb-3">
          <SchoolLogo logoUrl={logoUrl} name={school.name} size="lg" />
          <div className="min-w-0 flex-1">
            <h3
              className="psp-h3 group-hover:text-[var(--psp-gold)] transition-colors truncate"
              style={{ color: 'var(--psp-navy)' }}
            >
              {school.name}
            </h3>
            {mascot && (
              <p className="text-xs text-gray-400 truncate">{mascot}</p>
            )}
          </div>
        </div>

        {/* City, State */}
        <p className="text-xs text-gray-400 mb-3">
          {school.city}{school.state ? `, ${school.state}` : ''}
          {closedBadge && (
            <span className="ml-2 text-red-400 font-semibold">{closedBadge}</span>
          )}
        </p>

        {/* Stat blocks */}
        {isTeamCard && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-gray-50 rounded p-2">
              <div className="text-gray-400">All-Time</div>
              <div className="font-bold text-sm mt-1" style={{ color: 'var(--psp-navy)' }}>
                {(team as TeamCardData).totalWins}-{(team as TeamCardData).totalLosses}
                {(team as TeamCardData).totalTies > 0 ? `-${(team as TeamCardData).totalTies}` : ''}
              </div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="text-gray-400">Win %</div>
              <div className="font-bold text-sm mt-1" style={{ color: 'var(--psp-navy)' }}>
                {winPct}%
              </div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="text-gray-400">Titles</div>
              <div className="font-bold text-sm mt-1" style={{ color: (team as TeamCardData).championships > 0 ? 'var(--psp-gold)' : 'var(--psp-navy)' }}>
                {(team as TeamCardData).championships > 0 ? `\u{1F3C6} ${(team as TeamCardData).championships}` : '\u2014'}
              </div>
            </div>
          </div>
        )}

        {!isTeamCard && (
          <div className="text-xs text-gray-300 mt-1">
            View historical records &rarr;
          </div>
        )}
      </div>
    </Link>
  );
}

/* ── List Row ──────────────────────────────────────────────────────── */

function TeamListRow({
  team,
  sport,
  isStateChamp,
  index,
}: {
  team: TeamCardData;
  sport: string;
  isStateChamp: boolean;
  index: number;
}) {
  const total = team.totalWins + team.totalLosses + team.totalTies;
  const winPct = total > 0 ? ((team.totalWins / total) * 100).toFixed(0) : '0';

  return (
    <Link
      href={`/${sport}/schools/${team.school.slug}`}
      className="group flex items-center gap-3 px-4 py-3 hover:bg-[var(--psp-gold)]10 transition-colors"
      style={{ background: index % 2 === 0 ? '#ffffff' : '#f9fafb' }}
    >
      <SchoolLogo logoUrl={team.logoUrl} name={team.school.name} size="md" />
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="font-bold text-sm group-hover:text-[var(--psp-gold)] transition-colors truncate" style={{ color: 'var(--psp-navy)' }}>
          {team.school.name}
        </span>
        {isStateChamp && <span className="text-xs" title="State Champion">&#127942;</span>}
        {team.mascot && (
          <span className="text-xs text-gray-400 truncate hidden sm:inline">{team.mascot}</span>
        )}
      </div>
      <span className="text-xs text-gray-400 w-24 text-center hidden md:block">{team.division || '\u2014'}</span>
      <span className="text-xs font-bold w-20 text-center" style={{ color: 'var(--psp-navy)' }}>
        {team.totalWins}-{team.totalLosses}{team.totalTies > 0 ? `-${team.totalTies}` : ''}
      </span>
      <span className="text-xs w-12 text-center hidden sm:block" style={{ color: 'var(--psp-navy)' }}>{winPct}%</span>
      <span className="text-xs w-12 text-center" style={{ color: team.championships > 0 ? 'var(--psp-gold)' : 'var(--psp-navy)' }}>
        {team.championships > 0 ? `\u{1F3C6} ${team.championships}` : '\u2014'}
      </span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-gray-300 group-hover:text-[var(--psp-gold)] transition-colors">
        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

/* ── Main Component ────────────────────────────────────────────────── */

export default function TeamsViewToggle({
  sport,
  leagueSections,
  closedTeams,
  discontinuedSchools,
  stateChampIds,
  stateChampMap,
  latestSeasonLabel,
  leagueColors,
}: TeamsViewToggleProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const stateChampSet = new Set(stateChampIds);

  return (
    <div>
      {/* View Toggle */}
      <div className="flex items-center justify-end gap-2 mb-6">
        <span className="text-xs text-gray-400 mr-1">View:</span>
        <button
          onClick={() => setView('grid')}
          className="p-2 rounded-md border transition-colors"
          style={{
            borderColor: view === 'grid' ? 'var(--psp-gold)' : 'var(--psp-gray-200)',
            background: view === 'grid' ? 'var(--psp-gold)08' : 'transparent',
          }}
          aria-label="Grid view"
        >
          <GridIcon active={view === 'grid'} />
        </button>
        <button
          onClick={() => setView('list')}
          className="p-2 rounded-md border transition-colors"
          style={{
            borderColor: view === 'list' ? 'var(--psp-gold)' : 'var(--psp-gray-200)',
            background: view === 'list' ? 'var(--psp-gold)08' : 'transparent',
          }}
          aria-label="List view"
        >
          <ListIcon active={view === 'list'} />
        </button>
      </div>

      {/* League Sections */}
      <div className="space-y-8">
        {leagueSections.map(({ league, divisionGroups }) => {
          const lc = leagueColors[league] || 'var(--psp-gold)';
          const totalTeams = divisionGroups.reduce((s, g) => s + g.teams.length, 0);

          return (
            <div key={league}>
              {/* League Header */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-t-lg mb-4"
                style={{ borderLeft: `4px solid ${lc}`, background: `${lc}08` }}
              >
                <h2 className="psp-h2" style={{ color: 'var(--psp-navy)' }}>
                  {league}
                </h2>
                <span className="text-sm font-medium" style={{ color: lc }}>
                  {totalTeams} teams
                </span>
              </div>

              {/* Division Sub-Groups */}
              {divisionGroups.map(({ division, teams }) => (
                <div key={`${league}-${division}`} className="mb-6">
                  {division && (
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-3 px-1" style={{ color: 'var(--psp-gray-400)' }}>
                      {division}
                    </h3>
                  )}

                  {view === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teams.map((team) => (
                        <TeamCard
                          key={team.school.id}
                          team={team}
                          sport={sport}
                          leagueColor={lc}
                          isStateChamp={stateChampSet.has(team.school.id)}
                          champType={stateChampMap[team.school.id] || ''}
                          latestSeasonLabel={latestSeasonLabel}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="border border-[var(--psp-gray-200)] rounded-lg overflow-hidden">
                      {/* Sticky Header */}
                      <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 text-xs font-bold uppercase tracking-wider text-gray-400 sticky top-0 z-10">
                        <span className="w-8" />
                        <span className="flex-1">School</span>
                        <span className="w-24 text-center hidden md:block">Division</span>
                        <span className="w-20 text-center">Record</span>
                        <span className="w-12 text-center hidden sm:block">Win%</span>
                        <span className="w-12 text-center">Titles</span>
                        <span className="w-4" />
                      </div>
                      {teams.map((team, i) => (
                        <TeamListRow
                          key={team.school.id}
                          team={team}
                          sport={sport}
                          isStateChamp={stateChampSet.has(team.school.id)}
                          index={i}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Closed Programs Accordion */}
      {closedTeams.length > 0 && (
        <div className="mt-8">
          <Accordion title="Closed Programs" count={closedTeams.length}>
            <p className="text-xs text-gray-300 mb-4">
              Schools no longer competing. Records preserved for historical reference.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {closedTeams.map((team) => (
                <TeamCard
                  key={team.school.id}
                  team={team}
                  sport={sport}
                  leagueColor={leagueColors[team.league] || '#9ca3af'}
                  isStateChamp={false}
                  champType=""
                  latestSeasonLabel={null}
                  opacity={0.7}
                  closedBadge={team.closedYear ? `Closed ${team.closedYear}` : null}
                />
              ))}
            </div>
          </Accordion>
        </div>
      )}

      {/* Discontinued Programs Accordion */}
      {discontinuedSchools.length > 0 && (
        <div className="mt-4">
          <Accordion title="Discontinued Programs" count={discontinuedSchools.length}>
            <p className="text-xs text-gray-300 mb-4">
              Schools that still exist but no longer field a team in this sport. Historical records preserved.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {discontinuedSchools.map((school) => (
                <TeamCard
                  key={school.id}
                  team={school}
                  sport={sport}
                  leagueColor={leagueColors[school.league || ''] || '#9ca3af'}
                  isStateChamp={false}
                  champType=""
                  latestSeasonLabel={null}
                  opacity={0.7}
                  closedBadge="Program Discontinued"
                />
              ))}
            </div>
          </Accordion>
        </div>
      )}
    </div>
  );
}
