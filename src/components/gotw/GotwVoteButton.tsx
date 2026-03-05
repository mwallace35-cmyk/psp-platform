'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface GotwVoteButtonProps {
  nomineeId: string;
  sportColor?: string;
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

function getCurrentWeekLabel(): string {
  const now = new Date();
  const week = Math.floor((now.getDate() - 1) / 7) + 1;
  return `${now.getFullYear()}-W${week}`;
}

export default function GotwVoteButton({ nomineeId, sportColor = '#f0a500' }: GotwVoteButtonProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const supabase = createClient();

  const weekLabel = getCurrentWeekLabel();

  useEffect(() => {
    const votedKey = `gotw-voted-${weekLabel}`;
    const voted = localStorage.getItem(votedKey);
    if (voted) {
      setHasVoted(true);
    }
  }, [weekLabel]);

  async function handleVote() {
    if (hasVoted || voting) return;

    setVoting(true);
    try {
      const fingerprint = generateFingerprint();

      const { error: voteError } = await supabase.from('gotw_votes').insert({
        gotw_nominee_id: parseInt(nomineeId),
        ip_hash: fingerprint,
        week_label: weekLabel,
      });

      if (voteError) {
        if (voteError.code === '23505') {
          setHasVoted(true);
          localStorage.setItem(`gotw-voted-${weekLabel}`, nomineeId);
          return;
        }
        throw voteError;
      }

      const { error: updateError } = await supabase.rpc('increment_gotw_votes', {
        nominee_id: parseInt(nomineeId),
      });

      if (updateError) {
        console.warn('RPC increment failed:', updateError);
      }

      setHasVoted(true);
      setVoteSuccess(true);
      localStorage.setItem(`gotw-voted-${weekLabel}`, nomineeId);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('Error voting:', err);
      alert('Could not submit vote. Please try again.');
    } finally {
      setVoting(false);
    }
  }

  if (voteSuccess) {
    return (
      <button
        disabled
        style={{
          padding: '8px 20px',
          borderRadius: 8,
          background: '#dcfce7',
          color: '#16a34a',
          fontWeight: 700,
          fontSize: 13,
          border: 'none',
          cursor: 'default',
          fontFamily: 'Barlow Condensed, sans-serif',
          letterSpacing: 0.5,
        }}
      >
        Voted!
      </button>
    );
  }

  if (hasVoted) {
    return (
      <button
        disabled
        style={{
          padding: '8px 20px',
          borderRadius: 8,
          background: 'var(--psp-gray-100, #f3f4f6)',
          color: 'var(--psp-gray-500, #6b7280)',
          fontWeight: 600,
          fontSize: 13,
          border: 'none',
          cursor: 'default',
          fontFamily: 'Barlow Condensed, sans-serif',
        }}
      >
        Already Voted
      </button>
    );
  }

  return (
    <button
      onClick={handleVote}
      disabled={voting}
      style={{
        padding: '8px 20px',
        borderRadius: 8,
        background: sportColor,
        color: '#fff',
        fontWeight: 700,
        fontSize: 13,
        border: 'none',
        cursor: voting ? 'wait' : 'pointer',
        fontFamily: 'Barlow Condensed, sans-serif',
        letterSpacing: 0.5,
        textTransform: 'uppercase' as const,
        transition: 'opacity 0.15s, transform 0.1s',
        opacity: voting ? 0.6 : 1,
      }}
    >
      {voting ? 'Voting...' : 'Vote'}
    </button>
  );
}
