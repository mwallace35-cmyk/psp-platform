'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { createBrowserClient } from '@supabase/ssr';

interface GotwVoteButtonProps {
  nomineeId: string;
  matchupLabel: string;
}

function generateFingerprint(): string {
  const ua = navigator.userAgent;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const screen = `${window.screen.width}x${window.screen.height}`;
  const lang = navigator.language;
  return btoa(`${ua}|${tz}|${screen}|${lang}`).slice(0, 64);
}

export default function GotwVoteButton({ nomineeId, matchupLabel }: GotwVoteButtonProps) {
  const [status, setStatus] = useState<'idle' | 'voting' | 'voted' | 'already'>('idle');

  // Check localStorage on mount
  const storageKey = `gotw-voted-${nomineeId.slice(0, 8)}`;
  if (typeof window !== 'undefined' && localStorage.getItem(storageKey)) {
    if (status === 'idle') setStatus('already');
  }

  const handleVote = useCallback(async () => {
    if (status !== 'idle') return;
    setStatus('voting');

    try {
      const fingerprint = generateFingerprint();
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error: voteError } = await supabase
        .from('gotw_votes')
        .insert({ nominee_id: nomineeId, fingerprint });

      if (voteError) {
        if (voteError.code === '23505') {
          setStatus('already');
          localStorage.setItem(storageKey, '1');
          return;
        }
        throw voteError;
      }

      await supabase.rpc('increment_gotw_votes', { nominee: nomineeId });

      localStorage.setItem(storageKey, '1');
      setStatus('voted');
      toast.success('Vote recorded!');
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      setStatus('idle');
    }
  }, [nomineeId, status, storageKey]);

  return (
    <button
      onClick={handleVote}
      disabled={status !== 'idle'}
      aria-label={`Vote for ${matchupLabel}`}
      aria-pressed={status === 'voted' || status === 'already'}
      className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
        status === 'idle'
          ? 'bg-gold text-navy hover:bg-gold/90 cursor-pointer'
          : status === 'voting'
          ? 'bg-gray-400 text-white cursor-wait'
          : status === 'voted'
          ? 'bg-green-600 text-white cursor-default'
          : 'bg-gray-300 text-gray-400 cursor-default'
      }`}
    >
      {status === 'idle' && 'Vote'}
      {status === 'voting' && 'Voting...'}
      {status === 'voted' && 'Voted!'}
      {status === 'already' && 'Already Voted'}
    </button>
  );
}
