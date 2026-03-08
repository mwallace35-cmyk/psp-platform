'use client';

import { useEffect, useState } from 'react';

interface HotTake {
  id: string;
  user: string;
  text: string;
  time: string;
  type: 'hot_take' | 'insider' | 'poll';
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

export default function PulseHotTakes({ sport, sportColor, limit = 3 }: PulseHotTakesProps) {
  const [hotTakes, setHotTakes] = useState<HotTake[]>(SAMPLE_HOT_TAKES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotTakes = async () => {
      try {
        setIsLoading(true);

        // TODO: Replace with actual Supabase query
        // const { data } = await supabase
        //   .from('hot_takes')
        //   .select('*')
        //   .eq('sport', sport)
        //   .order('created_at', { ascending: false })
        //   .limit(limit);

        // if (data && data.length > 0) {
        //   const formattedTakes = data.map((take: any) => ({
        //     id: take.id,
        //     user: take.user_handle || 'PSP_Community',
        //     text: take.content,
        //     time: formatTimeAgo(take.created_at),
        //     type: 'hot_take',
        //   }));
        //   setHotTakes(formattedTakes);
        // } else {
        //   setHotTakes(SAMPLE_HOT_TAKES);
        // }

        // For now, using sample data
        setHotTakes(SAMPLE_HOT_TAKES);
      } catch (error) {
        console.error('Error fetching hot takes:', error);
        setHotTakes(SAMPLE_HOT_TAKES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotTakes();
  }, [sport, limit]);

  if (isLoading) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
      {hotTakes.map((item) => (
        <div
          key={item.id}
          style={{
            background: 'var(--psp-white)',
            border: '1px solid var(--g100)',
            borderRadius: 6,
            padding: '12px 14px',
            display: 'flex',
            gap: 10,
          }}
        >
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
      ))}
    </div>
  );
}
