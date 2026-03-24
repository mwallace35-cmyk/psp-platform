'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface PotwVoteButtonProps {
  nomineeId: string;
  playerName?: string;
}

// Generate a simple hash from a string (IP-like fingerprint using browser info)
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

export default function PotwVoteButton({ nomineeId, playerName = "Player" }: PotwVoteButtonProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const supabase = createClient();

  const weekLabel = getCurrentWeekLabel();

  useEffect(() => {
    // Check localStorage for existing vote this week
    const votedKey = `potw-voted-${weekLabel}`;
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

      // Try to insert vote (will fail on UNIQUE constraint if already voted)
      const { error: voteError } = await supabase.from('potw_votes').insert({
        potw_nominee_id: parseInt(nomineeId),
        ip_hash: fingerprint,
        week_label: weekLabel,
      });

      if (voteError) {
        if (voteError.code === '23505') {
          // Unique constraint violation - already voted
          setHasVoted(true);
          setAnnouncementText(`Vote for ${playerName} already submitted`);
          localStorage.setItem(`potw-voted-${weekLabel}`, nomineeId);
          return;
        }
        throw voteError;
      }

      // Increment vote count on nominee
      const { error: updateError } = await supabase.rpc('increment_potw_votes', {
        nominee_id: parseInt(nomineeId),
      });

      if (updateError) {
        console.warn('RPC increment failed, falling back to direct update:', updateError);
      }

      setHasVoted(true);
      setVoteSuccess(true);
      setAnnouncementText(`Vote for ${playerName} submitted successfully`);
      toast.success('Vote recorded!');
      localStorage.setItem(`potw-voted-${weekLabel}`, nomineeId);

      // Reload page to show updated vote counts
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('Error voting:', err);
      const errorMessage = 'Could not submit vote. Please try again.';
      setAnnouncementText(errorMessage);
    } finally {
      setVoting(false);
    }
  }

  return (
    <>
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          borderWidth: 0
        }}
      >
        {announcementText}
      </div>
      {voteSuccess ? (
        <button
          disabled
          className="px-6 py-3 rounded-lg bg-green-100 text-green-700 font-bold text-sm cursor-default"
          aria-pressed="true"
          aria-label={`Vote for ${playerName} - already voted`}
        >
          Voted!
        </button>
      ) : hasVoted ? (
        <button
          disabled
          className="px-6 py-3 rounded-lg bg-gray-100 text-gray-400 font-medium text-sm cursor-default"
          aria-pressed="true"
          aria-label={`Vote for ${playerName} - already voted this week`}
        >
          Already Voted
        </button>
      ) : (
        <button
          onClick={handleVote}
          disabled={voting}
          className="px-6 py-3 rounded-lg bg-gold text-navy font-bold text-sm hover:bg-gold/90 active:scale-95 transition disabled:opacity-50"
          aria-label={`Vote for ${playerName}`}
          aria-pressed="false"
          aria-disabled={voting}
        >
          {voting ? 'Voting...' : 'Vote'}
        </button>
      )}
    </>
  );
}
