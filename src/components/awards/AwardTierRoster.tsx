'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface AwardPlayer {
  player_name: string;
  player_slug?: string;
  school_name?: string;
  school_slug?: string;
  position?: string;
  year?: number;
  graduation_year?: number | null;
}

const OFFENSE_POSITIONS = new Set(['QB', 'RB', 'WR', 'TE', 'OL', 'C', 'G', 'T', 'E/OB', 'WR/TE', 'K', 'PK', 'K-P', 'P', 'Rec.', 'B', 'E']);
const DEFENSE_POSITIONS = new Set(['DB', 'DL', 'LB', 'ILB', 'IL']);
const SPECIAL_POSITIONS = new Set(['Multi-Purpose', 'UTL', 'MP', 'MVP', 'Coach']);

function getSide(pos?: string): 'offense' | 'defense' | 'special' {
  if (!pos) return 'special';
  if (OFFENSE_POSITIONS.has(pos)) return 'offense';
  if (DEFENSE_POSITIONS.has(pos)) return 'defense';
  if (SPECIAL_POSITIONS.has(pos)) return 'special';
  // Fallback: check first letters
  if (pos.startsWith('O') || pos.startsWith('Q') || pos.startsWith('W') || pos.startsWith('R') || pos.startsWith('T')) return 'offense';
  if (pos.startsWith('D') || pos.startsWith('L')) return 'defense';
  return 'special';
}

interface AwardTeam {
  selector: string;
  level: string;
  team?: string | null;
  players: AwardPlayer[];
}

interface AwardTier {
  tierName: string;
  tierDescription: string;
  teams: AwardTeam[];
}

interface Props {
  tiers: AwardTier[];
  sport: string;
  availableYears?: number[];
}

const TIER_COLORS: Record<string, string> = {
  'League Awards': '#16a34a',
  'City Awards': '#f0a500',
  'State & National': '#3b82f6',
  'MVPs & Player Awards': '#dc2626',
  'Coach of the Year': '#ca8a04',
  'Special Awards': '#a855f7',
};

const SPORT_BADGE_COLORS: Record<string, string> = {
  football: '#16a34a',
  basketball: '#3b82f6',
  baseball: '#ea580c',
};

const SELECTOR_TABS = [
  { id: 'all', label: 'All Awards' },
  { id: 'Coaches', label: 'Coaches' },
  { id: 'Daily News', label: 'Daily News' },
  { id: 'state', label: 'State & National' },
  { id: 'mvp', label: 'MVPs' },
  { id: 'coty', label: 'Coach of the Year' },
];

type SortBy = 'default' | 'school' | 'position';

export default function AwardTierRoster({ tiers, sport, availableYears }: Props) {
  const [selectedYear, setSelectedYear] = useState<number | null>(availableYears?.[0] ?? null);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState<SortBy>('default');
  const isFootball = sport === 'football';

  const filteredTiers = useMemo(() => {
    return tiers.map(tier => ({
      ...tier,
      teams: tier.teams
        .map(team => ({
          ...team,
          players: team.players.filter(p => {
            if (selectedYear && p.year !== selectedYear) return false;
            return true;
          }),
        }))
        .filter(team => {
          if (team.players.length === 0) return false;
          if (activeTab === 'all') return true;
          if (activeTab === 'state') return tier.tierName === 'State & National';
          if (activeTab === 'mvp') return tier.tierName === 'MVPs & Player Awards';
          if (activeTab === 'coty') return tier.tierName === 'Coach of the Year';
          return team.selector === activeTab;
        }),
    })).filter(tier => tier.teams.length > 0);
  }, [tiers, selectedYear, activeTab]);

  const badgeColor = SPORT_BADGE_COLORS[sport] || '#16a34a';

  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Year filter + tab pills */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SELECTOR_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '6px 16px',
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 600,
                border: activeTab === tab.id ? 'none' : '1.5px solid #e2e8f0',
                background: activeTab === tab.id ? '#0a1628' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {availableYears && availableYears.length > 0 && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select
              value={selectedYear ?? ''}
              onChange={e => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
              style={{
                padding: '6px 12px',
                borderRadius: 9999,
                border: '1.5px solid #e2e8f0',
                fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
                color: '#475569',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              <option value="">All Years</option>
              {availableYears.map(y => <option key={y} value={y}>{`${String(y - 1).slice(-2)}-${String(y).slice(-2)}`}</option>)}
            </select>
            {selectedYear && (
              <button onClick={() => setSelectedYear(null)} style={{ fontSize: 12, color: '#94a3b8', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline' }}>
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      {/* Empty state */}
      {filteredTiers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
          No awards found for this selection.
        </div>
      )}

      {/* Tier sections */}
      {filteredTiers.map((tier) => {
        const tierColor = TIER_COLORS[tier.tierName] || '#f0a500';
        return (
          <div key={tier.tierName} style={{ marginBottom: '2rem' }}>
            {/* Tier header */}
            <div style={{
              borderLeft: `4px solid ${tierColor}`,
              paddingLeft: 16,
              marginBottom: 12,
            }}>
              <h3 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '1.1rem',
                color: '#0a1628',
                letterSpacing: '1.5px',
                margin: 0,
                textTransform: 'uppercase',
              }}>
                {tier.tierName}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0' }}>
                {tier.tierDescription}
              </p>
            </div>

            {/* Teams within tier */}
            {tier.teams.map((team, idx) => (
              <div key={`${team.selector}-${team.level}-${team.team}-${idx}`} style={{
                background: '#0f2040',
                borderRadius: 8,
                marginBottom: 12,
                overflow: 'hidden',
              }}>
                {/* Team header */}
                <div style={{
                  padding: '10px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(240,165,0,0.1)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '0.95rem',
                      color: '#fff',
                      letterSpacing: '0.5px',
                    }}>
                      {team.selector ? `${team.selector} ${team.level}` : team.level}
                    </span>
                    {team.team && (
                      <span style={{
                        fontSize: '0.65rem',
                        background: `${tierColor}30`,
                        color: tierColor,
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}>
                        {team.team}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>
                    {team.players.length} players
                  </span>
                </div>

                {/* Sort controls */}
                {team.players.length > 3 && (
                  <div style={{ padding: '6px 16px', display: 'flex', gap: 8, borderBottom: '1px solid rgba(240,165,0,0.06)' }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', alignSelf: 'center' }}>Sort:</span>
                    {(['default', 'position', 'school'] as SortBy[]).map(s => (
                      <button key={s} onClick={() => setSortBy(s)} style={{
                        fontSize: 10, fontWeight: sortBy === s ? 700 : 400, border: 'none', background: sortBy === s ? 'rgba(240,165,0,0.2)' : 'transparent',
                        color: sortBy === s ? '#f0a500' : 'rgba(255,255,255,0.4)', padding: '2px 8px', borderRadius: 4, cursor: 'pointer', textTransform: 'capitalize',
                      }}>{s}</button>
                    ))}
                  </div>
                )}

                {/* Player roster — grouped by offense/defense for football */}
                {(() => {
                  let sortedPlayers = [...team.players];
                  if (sortBy === 'school') sortedPlayers.sort((a, b) => (a.school_name || '').localeCompare(b.school_name || ''));
                  else if (sortBy === 'position') sortedPlayers.sort((a, b) => (a.position || 'ZZZ').localeCompare(b.position || 'ZZZ'));

                  const groups: { label: string; players: AwardPlayer[] }[] = [];
                  if (isFootball && sortBy === 'default' && sortedPlayers.some(p => p.position)) {
                    const offense = sortedPlayers.filter(p => getSide(p.position) === 'offense');
                    const defense = sortedPlayers.filter(p => getSide(p.position) === 'defense');
                    const special = sortedPlayers.filter(p => getSide(p.position) === 'special');
                    if (offense.length) groups.push({ label: 'OFFENSE', players: offense });
                    if (defense.length) groups.push({ label: 'DEFENSE', players: defense });
                    if (special.length) groups.push({ label: 'SPECIAL', players: special });
                  }
                  if (groups.length === 0) groups.push({ label: '', players: sortedPlayers });

                  return groups.map((group) => (
                    <div key={group.label}>
                      {group.label && (
                        <div style={{ padding: '6px 16px', background: 'rgba(240,165,0,0.08)', fontSize: 11, fontWeight: 700, color: '#f0a500', letterSpacing: 2, fontFamily: "'Bebas Neue', sans-serif" }}>
                          {group.label}
                        </div>
                      )}
                      {group.players.map((player, pIdx) => (
                        <div key={`${player.player_name}-${pIdx}`} style={{
                          display: 'grid',
                          gridTemplateColumns: '42px 1fr 160px auto 50px',
                          alignItems: 'center',
                          padding: '10px 16px',
                          borderBottom: pIdx < group.players.length - 1 ? '1px solid rgba(240,165,0,0.06)' : 'none',
                          gap: 10,
                        }}>
                          {/* Position badge */}
                          <span style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            minWidth: 36, height: 28, borderRadius: 6,
                            background: player.position ? badgeColor : 'rgba(255,255,255,0.1)',
                            fontSize: 10, fontWeight: 700, color: '#fff',
                            fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase',
                            padding: '0 6px',
                          }}>
                            {player.position || (pIdx + 1)}
                          </span>

                          {/* Player name */}
                          {player.player_slug ? (
                            <Link href={`/${sport}/players/${player.player_slug}`}
                              style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', textDecoration: 'none' }}>
                              {player.player_name}
                            </Link>
                          ) : (
                            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>{player.player_name}</span>
                          )}

                          {/* School */}
                          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {player.school_name || ''}
                          </span>

                          {/* Class */}
                          {player.graduation_year ? (
                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
                              &apos;{String(player.graduation_year).slice(-2)}
                            </span>
                          ) : <span />}

                          {/* Year */}
                          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textAlign: 'right' }}>
                            {player.year ? `${String(player.year - 1).slice(-2)}-${String(player.year).slice(-2)}` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  ));
                })()}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
