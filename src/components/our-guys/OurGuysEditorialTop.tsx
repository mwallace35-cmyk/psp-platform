'use client';

import React, { useState, useCallback } from 'react';
import ThisWeekendCard from './ThisWeekendCard';
import type { WeekendRecap } from './ThisWeekendCard';

/* ─── Types ─── */
export interface FeaturedAthlete {
  id: string;
  person_name: string;
  current_org: string | null;
  pro_league: string | null;
  sport_id: string | null;
  college: string | null;
  current_role: string | null;
  school_name: string | null;
}

export interface DidYouKnowFact {
  id: number;
  fact_text: string;
  sport: string | null;
  category: string | null;
}

export interface EditorialCounts {
  total: number;
  activePro: number;
  college: number;
}

interface Props {
  counts: EditorialCounts;
  featuredAthletes: FeaturedAthlete[];
  didYouKnowFacts: DidYouKnowFact[];
  weekendRecaps?: WeekendRecap[];
}

/* ─── League badge styling ─── */
const LEAGUE_ACCENT: Record<string, { bg: string; text: string; icon: string; neon: string }> = {
  NFL: { bg: 'rgba(22,163,74,0.25)', text: '#4ade80', icon: '\uD83C\uDFC8', neon: '0 0 12px rgba(74,222,128,0.3)' },
  NBA: { bg: 'rgba(249,115,22,0.25)', text: '#fb923c', icon: '\uD83C\uDFC0', neon: '0 0 12px rgba(251,146,60,0.3)' },
  MLB: { bg: 'rgba(59,130,246,0.25)', text: '#60a5fa', icon: '\u26BE', neon: '0 0 12px rgba(96,165,250,0.3)' },
  WNBA: { bg: 'rgba(168,85,247,0.25)', text: '#c084fc', icon: '\uD83C\uDFC0', neon: '0 0 12px rgba(192,132,252,0.3)' },
};

export default function OurGuysEditorialTop({ counts, featuredAthletes, didYouKnowFacts, weekendRecaps = [] }: Props) {
  const [factIdx, setFactIdx] = useState(0);

  const shuffleFact = useCallback(() => {
    if (didYouKnowFacts.length <= 1) return;
    let next: number;
    do {
      next = Math.floor(Math.random() * didYouKnowFacts.length);
    } while (next === factIdx && didYouKnowFacts.length > 1);
    setFactIdx(next);
  }, [factIdx, didYouKnowFacts.length]);

  const currentFact = didYouKnowFacts[factIdx] ?? null;

  return (
    <div>
      {/* ═══ HERO — "THE TAP ROOM" ═══ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #1a0e08 0%, #0a1628 100%)' }}>
        {/* Warm ambient glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[400px] rounded-full blur-[180px]" style={{ background: 'rgba(240,165,0,0.08)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full blur-[150px]" style={{ background: 'rgba(212,146,10,0.06)' }} />

        {/* Wood grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 3px,
            rgba(240,165,0,0.3) 3px,
            rgba(240,165,0,0.3) 4px
          )`,
        }} />

        {/* Neon gold top bar */}
        <div className="h-1 relative">
          <div className="h-full bg-gradient-to-r from-transparent via-[var(--psp-gold)] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--psp-gold)] to-transparent blur-sm opacity-60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
          {/* Overline — neon style */}
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: 'var(--psp-gold)', textShadow: '0 0 20px rgba(240,165,0,0.4)' }}>
            The Tap Room &mdash; Our Guys
          </p>

          {/* Main heading with neon glow */}
          <h1
            className="text-white mb-2 font-heading"
            style={{
              fontSize: 'clamp(2.8rem, 7vw + 1rem, 5rem)',
              textShadow: '0 0 40px rgba(240,165,0,0.15), 0 2px 4px rgba(0,0,0,0.5)',
              lineHeight: 0.9,
            }}
          >
            PHILLY&apos;S<br />
            <span style={{ color: 'var(--psp-gold)', textShadow: '0 0 30px rgba(240,165,0,0.3)' }}>PROS</span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg mb-8 max-w-xl" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>
            Every Philadelphia high school alumni competing at the pro and college level.
            Pull up a stool &mdash; your guys are on every screen.
          </p>

          {/* Stat counters — like scores on a TV ticker */}
          <div className="flex flex-wrap gap-4">
            <CounterPill value={counts.activePro} label="Active Pros" primary />
            <CounterPill value={counts.college} label="College Athletes" />
            <CounterPill value={counts.total} label="Total Tracked" />
          </div>
        </div>

        {/* Amber bottom line — like a bar counter edge */}
        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(240,165,0,0.3)] to-transparent" />
      </section>

      {/* ═══ EDITORIAL GRID — Featured + This Weekend ═══ */}
      <section style={{ background: 'linear-gradient(180deg, #0f0a06 0%, #0a1628 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1" style={{ background: 'rgba(240,165,0,0.15)' }} />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--taproom-amber)' }}>
              Featured Athletes
            </span>
            <div className="h-px flex-1" style={{ background: 'rgba(240,165,0,0.15)' }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {featuredAthletes.slice(0, 2).map((athlete) => (
              <FeaturedCard key={athlete.id} athlete={athlete} />
            ))}
            <ThisWeekendCard recaps={weekendRecaps} />
          </div>
        </div>
      </section>

      {/* ═══ DID YOU KNOW? — Warm amber bar ═══ */}
      {currentFact && (
        <section style={{ background: '#0a1628' }}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div
              className="rounded-xl p-4 md:p-5 flex items-start gap-4 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--taproom-walnut) 0%, var(--psp-navy) 100%)',
                borderLeft: '3px solid var(--psp-gold)',
                boxShadow: 'inset 0 0 60px rgba(240,165,0,0.03)',
              }}
            >
              {/* Warm glow */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px]" style={{ background: 'rgba(240,165,0,0.06)' }} />

              <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(240,165,0,0.15)' }}>
                <span className="text-base">{'\uD83D\uDCA1'}</span>
              </div>

              <div className="flex-1 min-w-0 relative">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: 'var(--psp-gold)' }}>
                  Did You Know?
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">{currentFact.fact_text}</p>
                {currentFact.sport && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--psp-gray-400)' }}>
                    {currentFact.sport}
                  </span>
                )}
              </div>

              {didYouKnowFacts.length > 1 && (
                <button
                  onClick={shuffleFact}
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(240,165,0,0.1)', border: '1px solid rgba(240,165,0,0.2)' }}
                  aria-label="Show another fact"
                >
                  <svg className="w-3.5 h-3.5" style={{ color: 'var(--psp-gold)' }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M20.015 4.356v4.992" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ─── Counter Pill — TV ticker style ─── */
function CounterPill({ value, label, primary = false }: { value: number; label: string; primary?: boolean }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all"
      style={{
        background: primary ? 'rgba(240,165,0,0.12)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${primary ? 'rgba(240,165,0,0.25)' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: primary ? '0 0 20px rgba(240,165,0,0.08)' : 'none',
      }}
    >
      <span className="font-heading text-2xl md:text-3xl" style={{ color: primary ? 'var(--psp-gold)' : '#fff', textShadow: primary ? '0 0 15px rgba(240,165,0,0.3)' : 'none' }}>
        {value.toLocaleString()}
      </span>
      <span className="text-xs font-medium" style={{ color: primary ? 'rgba(255,255,255,0.8)' : 'var(--psp-gray-400)' }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Featured Athlete Card — "TV Screen" style ─── */
function FeaturedCard({ athlete }: { athlete: FeaturedAthlete }) {
  const league = athlete.pro_league ?? 'Pro';
  const accent = LEAGUE_ACCENT[league] ?? { bg: 'rgba(148,163,184,0.2)', text: '#94a3b8', icon: '\uD83C\uDFC5', neon: 'none' };

  const initials = athlete.person_name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="rounded-xl overflow-hidden transition-all hover:scale-[1.01] hover:shadow-xl group"
      style={{
        background: 'linear-gradient(145deg, var(--taproom-walnut) 0%, var(--psp-navy) 100%)',
        border: '1px solid rgba(240,165,0,0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {/* TV screen top bar */}
      <div className="flex items-center justify-between px-4 py-2" style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(240,165,0,0.08)' }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: accent.text, boxShadow: accent.neon }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent.text }}>{league}</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Featured</span>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar with neon ring */}
          <div
            className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: accent.bg,
              border: `2px solid ${accent.text}40`,
              boxShadow: accent.neon,
            }}
          >
            <span className="text-lg font-bold font-heading" style={{ color: accent.text }}>{initials}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className="text-white text-xl leading-tight mb-1 font-heading group-hover:text-[var(--psp-gold)] transition-colors"
              style={{ letterSpacing: '0.02em' }}
            >
              {athlete.person_name}
            </h3>
            {athlete.current_org && (
              <p className="text-sm font-medium truncate" style={{ color: 'var(--psp-gray-400)' }}>{athlete.current_org}</p>
            )}
            {athlete.school_name && (
              <p className="text-xs mt-1" style={{ color: 'rgba(240,165,0,0.6)' }}>
                {athlete.school_name}
                {athlete.college ? ` \u2192 ${athlete.college}` : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
