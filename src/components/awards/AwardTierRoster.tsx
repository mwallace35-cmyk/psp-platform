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

export default function AwardTierRoster({ tiers, sport, availableYears }: Props) {
  const [selectedYear, setSelectedYear] = useState<number | null>(availableYears?.[0] ?? null);
  const [activeTab, setActiveTab] = useState('all');

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
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
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

                {/* Player roster */}
                {team.players.map((player, pIdx) => (
                  <div key={`${player.player_name}-${pIdx}`} style={{
                    display: 'grid',
                    gridTemplateColumns: '36px 1fr 200px 50px',
                    alignItems: 'center',
                    padding: '10px 16px',
                    borderBottom: pIdx < team.players.length - 1 ? '1px solid rgba(240,165,0,0.06)' : 'none',
                    gap: 12,
                  }}>
                    {/* Position badge */}
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: player.position ? badgeColor : 'rgba(255,255,255,0.1)',
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#fff',
                      fontFamily: "'DM Sans', sans-serif",
                      textTransform: 'uppercase',
                    }}>
                      {player.position ? player.position.substring(0, 3) : (pIdx + 1)}
                    </span>

                    {/* Player name */}
                    {player.player_slug ? (
                      <Link
                        href={`/${sport}/players/${player.player_slug}`}
                        style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', textDecoration: 'none' }}
                      >
                        {player.player_name}
                      </Link>
                    ) : (
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>
                        {player.player_name}
                      </span>
                    )}

                    {/* School */}
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {player.school_name || ''}
                    </span>

                    {/* Year */}
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textAlign: 'right' }}>
                      {player.year || ''}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
