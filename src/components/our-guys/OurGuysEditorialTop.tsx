'use client';

import React, { useState, useCallback } from 'react';

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
}

/* ─── League badge styling ─── */
const LEAGUE_ACCENT: Record<string, { bg: string; border: string; icon: string }> = {
  NFL: { bg: 'bg-green-700/20', border: 'border-green-500/40', icon: '\uD83C\uDFC8' },
  NBA: { bg: 'bg-orange-600/20', border: 'border-orange-500/40', icon: '\uD83C\uDFC0' },
  MLB: { bg: 'bg-blue-700/20', border: 'border-blue-500/40', icon: '\u26BE' },
};

const LEAGUE_TEXT: Record<string, string> = {
  NFL: 'text-green-400',
  NBA: 'text-orange-400',
  MLB: 'text-blue-400',
};

/* ─── Sport category icons ─── */
const SPORT_ICON: Record<string, string> = {
  football: '\uD83C\uDFC8',
  basketball: '\uD83C\uDFC0',
  baseball: '\u26BE',
  soccer: '\u26BD',
  lacrosse: '\uD83E\uDD4D',
  'track-field': '\uD83C\uDFC3',
  wrestling: '\uD83E\uDD3C',
};

export default function OurGuysEditorialTop({ counts, featuredAthletes, didYouKnowFacts }: Props) {
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
    <div className="space-y-0">
      {/* ═══════════════════════════════════════════════
          HERO — "PHILLY'S PROS"
          ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0a1628]">
        {/* Gold accent stripe at top */}
        <div className="h-1 bg-gradient-to-r from-[#f0a500] via-[#f5c542] to-[#f0a500]" />

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f0a500]/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -translate-y-1/2 right-8 opacity-[0.03] select-none pointer-events-none">
          <div className="text-[12rem] font-bold tracking-tighter text-white leading-none">PSP</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-14">
          {/* Overline */}
          <p className="psp-caption text-[#f0a500] mb-2 tracking-[0.15em]">
            THE PULSE &mdash; OUR GUYS
          </p>

          {/* Main heading */}
          <h1
            className="psp-h1-lg text-white mb-1"
            style={{ fontSize: 'clamp(2.5rem, 6vw + 1rem, 4.5rem)' }}
          >
            PHILLY&apos;S PROS
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-6 max-w-2xl">
            Tracking every Philadelphia high school alumni competing at the pro and college level
          </p>

          {/* Stat counter pills */}
          <div className="flex flex-wrap gap-3">
            <StatPill value={counts.activePro} label="Active Pros" highlight />
            <StatPill value={counts.college} label="College Athletes" />
            <StatPill value={counts.total} label="Total Tracked" />
          </div>
        </div>

        {/* Bottom gold accent */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-[#f0a500]/40 to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════
          EDITORIAL GRID — Featured + This Weekend
          ═══════════════════════════════════════════════ */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Featured Athlete Cards (2 columns on lg) */}
            {featuredAthletes.slice(0, 2).map((athlete) => (
              <FeaturedAthleteCard key={athlete.id} athlete={athlete} />
            ))}

            {/* This Weekend sidebar */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-[#0a1628] px-5 py-3 flex items-center gap-2">
                <span className="text-[#f0a500] text-lg">{'\uD83D\uDCC5'}</span>
                <h3 className="psp-caption text-white tracking-wider text-xs">
                  THIS WEEKEND
                </h3>
              </div>
              <div className="p-5">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-[#0a1628]/5 flex items-center justify-center mb-3">
                    <span className="text-2xl">{'\uD83C\uDFC6'}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Game recaps coming soon
                  </p>
                  <p className="text-xs text-gray-400 max-w-[200px]">
                    Pro performance tracking and weekend highlights will appear here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DID YOU KNOW? — Random Fact
          ═══════════════════════════════════════════════ */}
      {currentFact && (
        <section className="bg-gray-50 pb-2">
          <div className="max-w-7xl mx-auto px-4">
            <div className="rounded-2xl bg-gradient-to-r from-[#0a1628] to-[#0f2040] p-5 md:p-6 flex items-start gap-4 relative overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#f0a500]/5 rounded-full blur-[100px]" />

              {/* Icon */}
              <div className="shrink-0 w-10 h-10 rounded-full bg-[#f0a500]/15 flex items-center justify-center mt-0.5">
                <span className="text-[#f0a500] text-lg">{'\uD83D\uDCA1'}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 relative">
                <p className="psp-caption text-[#f0a500] text-xs mb-1.5 tracking-wider">
                  DID YOU KNOW?
                </p>
                <p className="text-white text-sm md:text-base leading-relaxed">
                  {currentFact.fact_text}
                </p>
                {currentFact.sport && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-gray-300 uppercase">
                    {SPORT_ICON[currentFact.sport] ?? ''}{' '}
                    {currentFact.sport === 'track-field' ? 'Track & Field' : currentFact.sport}
                  </span>
                )}
              </div>

              {/* Shuffle button */}
              {didYouKnowFacts.length > 1 && (
                <button
                  onClick={shuffleFact}
                  className="shrink-0 w-9 h-9 rounded-full bg-white/10 hover:bg-[#f0a500]/20 flex items-center justify-center transition-colors group"
                  aria-label="Show another fact"
                  title="Shuffle fact"
                >
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-[#f0a500] transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M20.015 4.356v4.992"
                    />
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

/* ─── Stat Pill Sub-component ─── */
function StatPill({ value, label, highlight = false }: { value: number; label: string; highlight?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl backdrop-blur-sm border transition-colors ${
        highlight
          ? 'bg-[#f0a500]/15 border-[#f0a500]/30'
          : 'bg-white/[0.06] border-white/10'
      }`}
    >
      <span
        className="text-2xl md:text-3xl text-[#f0a500]"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        {value.toLocaleString()}
      </span>
      <span className={`text-sm font-medium ${highlight ? 'text-gray-200' : 'text-gray-400'}`}>
        {label}
      </span>
    </span>
  );
}

/* ─── Featured Athlete Card ─── */
function FeaturedAthleteCard({ athlete }: { athlete: FeaturedAthlete }) {
  const league = athlete.pro_league ?? 'Pro';
  const accent = LEAGUE_ACCENT[league] ?? { bg: 'bg-gray-600/20', border: 'border-gray-500/30', icon: '\uD83C\uDFC5' };
  const textColor = LEAGUE_TEXT[league] ?? 'text-gray-400';

  // Build initials from name
  const initials = athlete.person_name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-[#f0a500]/30 transition-all group">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#f0a500] to-[#f5c542]" />

      <div className="p-5 md:p-6">
        <div className="flex items-start gap-4">
          {/* Avatar circle */}
          <div className={`shrink-0 w-16 h-16 rounded-full ${accent.bg} border-2 ${accent.border} flex items-center justify-center`}>
            <span
              className="text-xl font-bold text-white/80"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {initials}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {/* League badge */}
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${accent.bg} ${accent.border} border`}>
                <span>{accent.icon}</span>
                <span className={textColor}>{league}</span>
              </span>
              <span className="psp-micro text-gray-400">FEATURED</span>
            </div>

            {/* Name */}
            <h3
              className="text-[#0a1628] text-xl md:text-2xl leading-tight mb-1 group-hover:text-[#f0a500] transition-colors"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.02em' }}
            >
              {athlete.person_name}
            </h3>

            {/* Details */}
            <div className="space-y-0.5">
              {athlete.current_org && (
                <p className="text-sm text-gray-600 font-medium truncate">
                  {athlete.current_org}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {athlete.school_name && (
                  <span className="truncate">{athlete.school_name}</span>
                )}
                {athlete.school_name && athlete.college && (
                  <span className="text-gray-300">&rarr;</span>
                )}
                {athlete.college && (
                  <span className="truncate">{athlete.college}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
