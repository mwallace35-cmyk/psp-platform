'use client';

import { useState, useEffect, useCallback } from 'react';

interface PollOption {
  id: string;
  school_name: string;
  school_slug: string;
  reason: string;
  votes: number;
}

interface PollResponse {
  poll_id: string;
  question: string;
  options: PollOption[];
  total_votes: number;
}

interface SnubPollProps {
  pollId: string;
}

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

export default function SnubPoll({ pollId }: SnubPollProps) {
  const [options, setOptions] = useState<PollOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const storageKey = `psp-snub-${pollId}`;

  const fetchPoll = useCallback(async () => {
    try {
      const res = await fetch(`/api/rankings/snub-vote?poll_id=${pollId}`);
      if (!res.ok) throw new Error('Failed to fetch poll');
      const data: PollResponse = await res.json();
      setOptions(data.options);
      setTotalVotes(data.total_votes);
      setLoaded(true);
    } catch {
      setFetchError(true);
    }
  }, [pollId]);

  useEffect(() => {
    if (!pollId) return;
    const voted = localStorage.getItem(storageKey);
    if (voted) {
      setHasVoted(true);
      setSelectedOption(voted);
    }
    fetchPoll();
  }, [pollId, storageKey, fetchPoll]);

  async function handleVote() {
    if (!selectedOption || voting || hasVoted) return;

    setVoting(true);
    try {
      const fingerprint = generateFingerprint();
      const res = await fetch('/api/rankings/snub-vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poll_id: pollId,
          option_id: selectedOption,
          fingerprint,
        }),
      });

      if (!res.ok) throw new Error('Vote failed');

      const data: PollResponse = await res.json();
      setOptions(data.options);
      setTotalVotes(data.total_votes);
      setHasVoted(true);
      localStorage.setItem(storageKey, selectedOption);
    } catch {
      // Silent fail — user can try again
    } finally {
      setVoting(false);
    }
  }

  if (!pollId || fetchError || !loaded) return null;
  if (options.length === 0) return null;

  return (
    <div className="rounded-xl border-2 border-[var(--psp-gold,#f0a500)]/30 bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-[var(--psp-navy,#0a1628)] px-5 py-3">
        <h3 className="text-[var(--psp-gold,#f0a500)] font-bold text-sm tracking-wide uppercase">
          BIGGEST SNUB THIS WEEK
        </h3>
        <p className="text-gray-400 text-xs mt-0.5">Which team got robbed?</p>
      </div>

      {/* Options */}
      <div className="p-4 space-y-2">
        {options.map((opt) => {
          const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          const isSelected = selectedOption === opt.id;

          if (hasVoted) {
            // Results view
            return (
              <div key={opt.id} className="relative rounded-lg overflow-hidden border border-gray-100">
                {/* Fill bar */}
                <div
                  className="absolute inset-0 rounded-lg transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: isSelected ? 'rgba(240, 165, 0, 0.15)' : 'rgba(0, 0, 0, 0.03)',
                  }}
                />
                <div className="relative flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[var(--psp-gold,#f0a500)] flex-shrink-0" />
                    )}
                    <span className={`text-sm font-medium ${isSelected ? 'text-navy font-bold' : 'text-gray-700'}`}>
                      {opt.school_name}
                    </span>
                    {opt.reason && (
                      <span className="text-xs text-gray-400 hidden sm:inline">{opt.reason}</span>
                    )}
                  </div>
                  <span className={`text-sm font-bold ${isSelected ? 'text-[var(--psp-gold-text)]' : 'text-gray-500'}`}>
                    {pct}%
                  </span>
                </div>
              </div>
            );
          }

          // Selection view
          return (
            <button
              key={opt.id}
              onClick={() => setSelectedOption(opt.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition ${
                isSelected
                  ? 'border-[var(--psp-gold,#f0a500)] bg-[var(--psp-gold,#f0a500)]/5'
                  : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                isSelected ? 'border-[var(--psp-gold,#f0a500)]' : 'border-gray-300'
              }`}>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[var(--psp-gold,#f0a500)]" />
                )}
              </span>
              <span className="text-sm font-medium text-navy">{opt.school_name}</span>
              {opt.reason && (
                <span className="text-xs text-gray-400 ml-auto hidden sm:inline">{opt.reason}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Vote button or total */}
      <div className="px-4 pb-4">
        {hasVoted ? (
          <p className="text-xs text-gray-400 text-center">
            {totalVotes.toLocaleString()} {totalVotes === 1 ? 'vote' : 'votes'}
          </p>
        ) : (
          <button
            onClick={handleVote}
            disabled={!selectedOption || voting}
            className="w-full py-2.5 rounded-lg bg-[var(--psp-gold,#f0a500)] text-[var(--psp-navy,#0a1628)] font-bold text-sm hover:bg-[var(--psp-gold-light,#f5c542)] active:scale-[0.98] transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {voting ? 'Voting...' : 'Vote'}
          </button>
        )}
      </div>
    </div>
  );
}
