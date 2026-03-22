'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Award {
  id: number;
  player_id: number;
  award_name: string;
  year: number;
  sport: string | null;
  school_id: number;
  created_at: string;
}

interface AwardsHonorsProps {
  playerId: number;
}

export default function AwardsHonors({ playerId }: AwardsHonorsProps) {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('awards')
          .select('*')
          .eq('player_id', playerId)
          .order('year', { ascending: false });

        if (supabaseError) {
          setError(supabaseError.message);
          return;
        }

        setAwards(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch awards');
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, [playerId, supabase]);

  // Safe grouping with null check
  const awardsByYear = (awards ?? []).reduce(
    (acc, award) => {
      if (!acc[award.year]) {
        acc[award.year] = [];
      }
      acc[award.year].push(award);
      return acc;
    },
    {} as Record<number, Award[]>
  );

  const sortedYears = Object.keys(awardsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const designTokens = {
    navy: '#0a1628',
    gold: '#f0a500',
    goldLight: '#f5c542',
    cardBg: '#f8fafc',
    border: '#e2e8f0',
  };

  // Trophy emoji escaped as Unicode for RSC hydration safety
  const trophyEmoji = "\u{1F3C6}";

  if (loading) {
    return (
      <section
        style={{
          padding: '32px 0',
          borderTop: `1px solid ${designTokens.border}`,
          marginTop: '32px',
        }}
      >
        <h2
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '28px',
            fontWeight: 700,
            color: designTokens.navy,
            marginBottom: '24px',
            letterSpacing: '0.05em',
          }}
        >
          Awards & Honors
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: '60px',
                backgroundColor: designTokens.cardBg,
                borderRadius: '8px',
                border: `1px solid ${designTokens.border}`,
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
          ))}
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}</style>
      </section>
    );
  }

  if (error) {
    return (
      <section
        style={{
          padding: '32px 0',
          borderTop: `1px solid ${designTokens.border}`,
          marginTop: '32px',
        }}
      >
        <h2
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '28px',
            fontWeight: 700,
            color: designTokens.navy,
            marginBottom: '24px',
            letterSpacing: '0.05em',
          }}
        >
          Awards & Honors
        </h2>
        <p style={{ color: '#dc2626', fontSize: '14px' }}>
          Error loading awards: {error}
        </p>
      </section>
    );
  }

  return (
    <section
      style={{
        padding: '32px 0',
        borderTop: `1px solid ${designTokens.border}`,
        marginTop: '32px',
      }}
    >
      <h2
        style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '28px',
          fontWeight: 700,
          color: designTokens.navy,
          marginBottom: '24px',
          letterSpacing: '0.05em',
        }}
      >
        Awards & Honors
      </h2>
      {!awards || awards.length === 0 ? (
        <p
          style={{
            color: '#6b7280',
            fontSize: '16px',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          No awards recorded yet
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {sortedYears.map((year) => (
            <div key={year}>
              <h3
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: designTokens.gold,
                  marginBottom: '12px',
                }}
              >
                {/^\d{4}$/.test(String(year)) ? `${String(Number(year) - 1).slice(-2)}-${String(year).slice(-2)}` : year}
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {(awardsByYear[year] ?? []).map((award) => (
                  <div
                    key={award.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      backgroundColor: designTokens.cardBg,
                      border: `1px solid ${designTokens.border}`,
                      borderRadius: '8px',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{trophyEmoji}</span>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '14px',
                          fontWeight: 500,
                          color: designTokens.navy,
                        }}
                      >
                        {award.award_name}
                      </p>
                    </div>
                    {award.sport && (
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          backgroundColor: designTokens.goldLight,
                          color: designTokens.navy,
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {award.sport}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}