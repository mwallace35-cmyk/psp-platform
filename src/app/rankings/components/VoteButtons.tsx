'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface VoteData {
  agree: number;
  disagree: number;
  total: number;
}

interface VoteButtonsProps {
  rankingId: string;
  initialVotes?: VoteData;
}

function generateFingerprint(): string {
  const data = [
    navigator.userAgent,
    screen.width,
    screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ].join('|');

  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export default function VoteButtons({ rankingId, initialVotes }: VoteButtonsProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [voteData, setVoteData] = useState<VoteData | null>(initialVotes || null);
  const storageKey = `psp-vote-${rankingId}`;

  useEffect(() => {
    try {
      const existing = localStorage.getItem(storageKey);
      if (existing) {
        setHasVoted(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, [storageKey]);

  async function handleVote(voteType: 'agree' | 'disagree') {
    if (hasVoted || voting) return;
    setVoting(true);

    try {
      const fingerprint = generateFingerprint();
      const res = await fetch('/api/rankings/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ranking_id: rankingId,
          vote_type: voteType,
          fingerprint,
        }),
      });

      if (res.status === 409) {
        // Already voted
        setHasVoted(true);
        try { localStorage.setItem(storageKey, voteType); } catch {}
        // Fetch current counts
        try {
          const countRes = await fetch(`/api/rankings/vote?ranking_id=${rankingId}`);
          if (countRes.ok) {
            const data = await countRes.json();
            setVoteData(data);
          }
        } catch {}
        return;
      }

      if (!res.ok) {
        throw new Error('Vote failed');
      }

      const data = await res.json();
      setVoteData(data);
      setHasVoted(true);
      try { localStorage.setItem(storageKey, voteType); } catch {}
    } catch {
      toast('Vote failed \u2014 try again');
    } finally {
      setVoting(false);
    }
  }

  // After vote: show sentiment bar
  if (hasVoted && voteData) {
    const total = voteData.agree + voteData.disagree;
    const agreePercent = total > 0 ? Math.round((voteData.agree / total) * 100) : 50;
    const disagreePercent = 100 - agreePercent;

    return (
      <div className="flex flex-col items-center gap-1 w-20 flex-shrink-0">
        <div className="w-full h-2 rounded-full overflow-hidden flex bg-gray-100">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${agreePercent}%` }}
          />
          <div
            className="h-full bg-red-400 transition-all"
            style={{ width: `${disagreePercent}%` }}
          />
        </div>
        <span className="text-[10px] text-gray-400">{voteData.total} votes</span>
      </div>
    );
  }

  // Before vote: two buttons
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <button
        onClick={() => handleVote('agree')}
        disabled={voting || hasVoted}
        className="px-2 py-1 text-[11px] font-medium rounded border border-green-300 text-green-700 hover:bg-green-50 active:scale-95 transition disabled:opacity-50"
        aria-label="Agree with ranking"
      >
        {voting ? '...' : '\ud83d\udc4d Right'}
      </button>
      <button
        onClick={() => handleVote('disagree')}
        disabled={voting || hasVoted}
        className="px-2 py-1 text-[11px] font-medium rounded border border-red-300 text-red-600 hover:bg-red-50 active:scale-95 transition disabled:opacity-50"
        aria-label="Disagree with ranking"
      >
        {voting ? '...' : '\ud83d\udc4e Too High'}
      </button>
    </div>
  );
}
