'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface HotTake {
  id: string;
  user: string;
  text: string;
  time: string;
  type: 'hot_take' | 'insider' | 'poll';
}

interface VoteState {
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
}

// Helper function to format time relative to now
function formatTimeAgo(isoDateString: string): string {
  const date = new Date(isoDateString);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 60) return 'just now';
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) return `${minutesAgo}m ago`;
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo}h ago`;
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) return `${daysAgo}d ago`;
  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo < 4) return `${weeksAgo}w ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const SAMPLE_HOT_TAKES: HotTake[] = [
  {
    id: '1',
    user: 'CoachK_Philly',
    text: 'Big matchup tonight — Prep vs La Salle will set the tone for the league.',
    time: '2h ago',
    type: 'hot_take',
  },
  {
    id: '2',
    user: 'PhillyHoopsScout',
    text: 'Just left practice — keep an eye on the freshman class this year. Philly is LOADED.',
    time: '4h ago',
    type: 'insider',
  },
  {
    id: '3',
    user: 'PSP_Community',
    text: 'Who\'s your pick for this week\'s Player of the Week? Cast your vote now!',
    time: '6h ago',
    type: 'poll',
  },
];

interface PulseHotTakesProps {
  sport: string;
  sportColor: string;
  limit?: number;
}

export default function PulseHotTakes({ sport, limit = 3 }: Omit<PulseHotTakesProps, 'sportColor'>) {
  const [hotTakes, setHotTakes] = useState<HotTake[]>(SAMPLE_HOT_TAKES);
  const [isLoading, setIsLoading] = useState(true);
  const [votes, setVotes] = useState<Record<string, VoteState>>({});

  useEffect(() => {
    const fetchHotTakes = async () => {
      try {
        setIsLoading(true);

        const supabase = createClient();
        const { data, error } = await supabase
          .from('hot_takes')
          .select('*')
          .eq('sport', sport)
          .order('created_at', { ascending: false })
          .limit(limit || 3);

        if (error) {
          console.error('Error fetching hot takes from database:', error);
          setHotTakes(SAMPLE_HOT_TAKES);
          return;
        }

        if (data && data.length > 0) {
          type DBHotTake = {
            id?: string | number;
            user_handle?: string;
            content?: string;
            created_at?: string;
            type?: string;
          };
          const formattedTakes = data.map((take: DBHotTake) => ({
            id: take.id?.toString() || Math.random().toString(),
            user: take.user_handle || 'PSP_Community',
            text: take.content || '',
            time: take.created_at ? formatTimeAgo(take.created_at) : 'recently',
            type: (take.type as 'hot_take' | 'insider' | 'poll') || 'hot_take',
          }));
          setHotTakes(formattedTakes);
        } else {
          setHotTakes(SAMPLE_HOT_TAKES);
        }
      } catch (error) {
        console.error('Error fetching hot takes:', error);
        setHotTakes(SAMPLE_HOT_TAKES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotTakes();
  }, [sport, limit]);

  const initializeVotes = (take: HotTake) => {
    if (!votes[take.id]) {
      setVotes(prev => ({
        ...prev,
        [take.id]: { upvotes: 0, downvotes: 0, userVote: null }
      }));
    }
  };

  const handleVote = (takeId: string, direction: 'up' | 'down') => {
    setVotes(prev => {
      const current = prev[takeId] || { upvotes: 0, downvotes: 0, userVote: null };
      let newUpvotes = current.upvotes;
      let newDownvotes = current.downvotes;
      let newUserVote = current.userVote;

      // Handle vote logic
      if (current.userVote === direction) {
        // Clicking same button removes the vote
        newUserVote = null;
        if (direction === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
        if (direction === 'down') newDownvotes = Math.max(0, newDownvotes - 1);
      } else {
        // Switching or adding new vote
        if (current.userVote === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
        if (current.userVote === 'down') newDownvotes = Math.max(0, newDownvotes - 1);

        if (direction === 'up') newUpvotes += 1;
        if (direction === 'down') newDownvotes += 1;
        newUserVote = direction;
      }

      return {
        ...prev,
        [takeId]: { upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote }
      };
    });
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: 'var(--psp-white)',
              border: '1px solid var(--g100)',
              borderRadius: 6,
              padding: '12px 14px',
              display: 'flex',
              gap: 10,
              animation: 'pulse 2s infinite',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--g100)',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ height: 12, background: 'var(--g100)', borderRadius: 4, marginBottom: 8 }} />
              <div style={{ height: 10, background: 'var(--g100)', borderRadius: 4, width: '80%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
      {hotTakes.map((item) => {
        const itemVotes = votes[item.id] || { upvotes: 0, downvotes: 0, userVote: null };
        if (!votes[item.id]) {
          initializeVotes(item);
        }

        return (
          <div
            key={item.id}
            style={{
              background: 'var(--psp-white)',
              border: '1px solid var(--g100)',
              borderRadius: 6,
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background:
                    item.type === 'hot_take'
                      ? '#fef3c7'
                      : item.type === 'insider'
                        ? '#dbeafe'
                        : '#f3e8ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {item.type === 'hot_take' ? '🔥' : item.type === 'insider' ? '👀' : '📊'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--psp-navy)' }}>
                    @{item.user}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--g400)' }}>{item.time}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.5 }}>
                  {item.text}
                </div>
              </div>
            </div>

            {/* Voting UI */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', paddingTop: 6, borderTop: '1px solid var(--g100)' }}>
              <button
                onClick={() => handleVote(item.id, 'up')}
                style={{
                  background: itemVotes.userVote === 'up' ? '#16a34a' : '#e5e7eb',
                  color: itemVotes.userVote === 'up' ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontSize: 14,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (itemVotes.userVote !== 'up') {
                    (e.currentTarget as HTMLButtonElement).style.background = '#d1d5db';
                  }
                }}
                onMouseLeave={(e) => {
                  if (itemVotes.userVote !== 'up') {
                    (e.currentTarget as HTMLButtonElement).style.background = '#e5e7eb';
                  }
                }}
              >
                ▲
              </button>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--g400)', minWidth: 30, textAlign: 'center' }}>
                {itemVotes.upvotes - itemVotes.downvotes}
              </span>
              <button
                onClick={() => handleVote(item.id, 'down')}
                style={{
                  background: itemVotes.userVote === 'down' ? '#dc2626' : '#e5e7eb',
                  color: itemVotes.userVote === 'down' ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontSize: 14,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (itemVotes.userVote !== 'down') {
                    (e.currentTarget as HTMLButtonElement).style.background = '#d1d5db';
                  }
                }}
                onMouseLeave={(e) => {
                  if (itemVotes.userVote !== 'down') {
                    (e.currentTarget as HTMLButtonElement).style.background = '#e5e7eb';
                  }
                }}
              >
                ▼
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
