'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { SPORT_META } from '@/lib/sports';
import type { SportId } from '@/lib/sports';

interface Nominee {
  id: string;
  player_name: string;
  school_name: string;
  sport_id: string;
  stat_line: string | null;
  votes: number;
  is_winner: boolean;
}

interface PotwHomepageWidgetProps {
  nominees: Nominee[];
  endsAt?: string | null;
}

const SPORT_VOTE_COLORS: Record<string, { bg: string; hover: string; ring: string; bar: string }> = {
  football:     { bg: 'bg-green-600',   hover: 'hover:bg-green-500',   ring: 'ring-green-500/30',   bar: '#16a34a' },
  basketball:   { bg: 'bg-blue-600',    hover: 'hover:bg-blue-500',    ring: 'ring-blue-500/30',    bar: '#3b82f6' },
  baseball:     { bg: 'bg-red-600',     hover: 'hover:bg-red-500',     ring: 'ring-red-500/30',     bar: '#dc2626' },
  soccer:       { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-500', ring: 'ring-emerald-500/30', bar: '#059669' },
  lacrosse:     { bg: 'bg-cyan-600',    hover: 'hover:bg-cyan-500',    ring: 'ring-cyan-500/30',    bar: '#0891b2' },
  'track-field':{ bg: 'bg-violet-600',  hover: 'hover:bg-violet-500',  ring: 'ring-violet-500/30',  bar: '#7c3aed' },
  wrestling:    { bg: 'bg-yellow-600',  hover: 'hover:bg-yellow-500',  ring: 'ring-yellow-500/30',  bar: '#ca8a04' },
};

const DEFAULT_COLORS = { bg: 'bg-blue-600', hover: 'hover:bg-blue-500', ring: 'ring-blue-500/30', bar: '#3b82f6' };

function generateFingerprint(): string {
  const data = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
  ].join('|');
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function getCurrentWeekLabel(): string {
  const now = new Date();
  const week = Math.floor((now.getDate() - 1) / 7) + 1;
  return `${now.getFullYear()}-W${week}`;
}

function CountdownTimer({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    function update() {
      const end = new Date(endsAt).getTime();
      const now = Date.now();
      const diff = end - now;
      if (diff <= 0) { setTimeLeft('Voting closed'); return; }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${mins}m`);
      } else {
        setTimeLeft(`${hours}h ${mins}m ${secs}s`);
      }
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  if (!timeLeft) return null;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-300">Voting closes in</span>
      <span className="font-mono font-bold text-[var(--psp-gold)] bg-[var(--psp-gold)]/10 px-2 py-0.5 rounded">
        {timeLeft}
      </span>
    </div>
  );
}

export default function PotwHomepageWidget({ nominees, endsAt }: PotwHomepageWidgetProps) {
  const [votedId, setVotedId] = useState<string | null>(null);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [localVotes, setLocalVotes] = useState<Record<string, number>>({});
  const weekLabel = getCurrentWeekLabel();

  useEffect(() => {
    const voted = localStorage.getItem(`potw-voted-${weekLabel}`);
    if (voted) setVotedId(voted);
  }, [weekLabel]);

  const handleVote = useCallback(async (nomineeId: string) => {
    if (votedId || votingId) return;
    setVotingId(nomineeId);

    try {
      const fingerprint = generateFingerprint();
      const supabase = createClient();

      const { error: voteError } = await supabase.from('potw_votes').insert({
        potw_nominee_id: parseInt(nomineeId),
        ip_hash: fingerprint,
        week_label: weekLabel,
      });

      if (voteError) {
        if (voteError.code === '23505') {
          setVotedId(nomineeId);
          localStorage.setItem(`potw-voted-${weekLabel}`, nomineeId);
          return;
        }
        throw voteError;
      }

      await supabase.rpc('increment_potw_votes', { nominee_id: parseInt(nomineeId) });

      setVotedId(nomineeId);
      localStorage.setItem(`potw-voted-${weekLabel}`, nomineeId);
      setLocalVotes((prev) => ({ ...prev, [nomineeId]: (prev[nomineeId] || 0) + 1 }));
    } catch (err) {
      console.error('Vote error:', err);
    } finally {
      setVotingId(null);
    }
  }, [votedId, votingId, weekLabel]);

  const displayNominees = nominees.slice(0, 6);
  const totalVotes = displayNominees.reduce((sum, n) => sum + (n.votes || 0) + (localVotes[n.id] || 0), 0);

  if (displayNominees.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-xl border border-[var(--psp-gold)]/30 bg-gradient-to-br from-[#0a1628] via-[#0f2040] to-[#0a1628]">
      {/* Gold shimmer top bar */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[var(--psp-gold)] to-transparent" />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="text-4xl">🏆</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--psp-gold)] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--psp-gold)]" />
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bebas text-white tracking-wider">Player of the Week</h2>
              <p className="text-xs text-gray-300">
                {totalVotes > 0 ? `${totalVotes.toLocaleString()} votes cast` : 'Cast your vote now'}
                {' '}&bull;{' '}LIVE
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            {endsAt && <CountdownTimer endsAt={endsAt} />}
            <Link
              href="/potw"
              className="inline-flex items-center gap-1.5 bg-[var(--psp-gold)] text-[var(--psp-navy)] font-bold text-xs px-4 py-2 rounded-full hover:bg-[var(--psp-gold-light)] active:scale-95 transition-all shadow-lg shadow-[var(--psp-gold)]/20"
            >
              Vote Now
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Nominees Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {displayNominees.map((nominee, idx) => {
            const sportMeta = SPORT_META[nominee.sport_id as SportId];
            const colors = SPORT_VOTE_COLORS[nominee.sport_id] || DEFAULT_COLORS;
            const voteCount = (nominee.votes || 0) + (localVotes[nominee.id] || 0);
            const pct = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
            const isLeading = idx === 0 && voteCount > 0;
            const isVotedFor = votedId === nominee.id;
            const isVoting = votingId === nominee.id;
            const hasVoted = !!votedId;

            return (
              <div
                key={nominee.id}
                className={`relative rounded-lg border p-4 transition-all ${
                  isLeading
                    ? 'border-[var(--psp-gold)]/60 bg-[var(--psp-gold)]/5 shadow-lg shadow-[var(--psp-gold)]/10'
                    : 'border-gray-700/50 bg-white/[0.03] hover:border-gray-600'
                }`}
              >
                {/* Leading badge */}
                {isLeading && (
                  <div className="absolute -top-2.5 left-3 bg-[var(--psp-gold)] text-[var(--psp-navy)] text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">
                    LEADING
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{sportMeta?.emoji || '🏅'}</span>
                      <h3 className="text-sm font-bold text-white truncate">{nominee.player_name}</h3>
                    </div>
                    <p className="text-xs text-gray-300 truncate">{nominee.school_name}</p>
                    {nominee.stat_line && (
                      <p className="text-xs text-gray-300 mt-1.5 bg-white/5 rounded px-2 py-1 inline-block font-medium">
                        {nominee.stat_line}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="text-right">
                      <span className="text-xl font-bold text-white tabular-nums">{voteCount}</span>
                      <span className="text-xs text-gray-400 block">votes</span>
                    </div>
                    <button
                      onClick={() => handleVote(nominee.id)}
                      disabled={hasVoted || isVoting}
                      aria-label={`Vote for ${nominee.player_name}`}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold text-white transition-all ${
                        isVotedFor
                          ? 'bg-green-600 cursor-default'
                          : hasVoted
                          ? 'bg-gray-600 cursor-default opacity-50'
                          : isVoting
                          ? 'bg-gray-500 cursor-wait'
                          : `${colors.bg} ${colors.hover} cursor-pointer active:scale-95 ring-1 ${colors.ring}`
                      }`}
                    >
                      {isVotedFor ? 'Voted!' : hasVoted ? '--' : isVoting ? '...' : 'Vote'}
                    </button>
                  </div>
                </div>

                {/* Vote bar */}
                {totalVotes > 0 && (
                  <div className="mt-3">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${pct}%`, backgroundColor: colors.bar }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 text-right tabular-nums">{pct}%</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-4 text-center">
          <Link
            href="/potw"
            className="text-xs text-[var(--psp-gold)] hover:text-[var(--psp-gold-light)] transition font-medium"
          >
            See all nominees & past winners &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
