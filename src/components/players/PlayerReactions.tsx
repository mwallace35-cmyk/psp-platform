'use client';
import { useState, useEffect } from 'react';

const REACTIONS = [
  { emoji: '🔥', label: 'Fire', key: 'fire' },
  { emoji: '⭐', label: 'Star',  key: 'star' },
  { emoji: '💪', label: 'Beast', key: 'beast' },
  { emoji: '🏆', label: 'Champ', key: 'champ' },
];

interface ReactionCounts { fire: number; star: number; beast: number; champ: number; }

interface PlayerReactionsProps { playerSlug: string; }

export default function PlayerReactions({ playerSlug }: PlayerReactionsProps) {
  const [counts, setCounts] = useState<ReactionCounts>({ fire: 0, star: 0, beast: 0, champ: 0 });
  const [reacted, setReacted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState<string | null>(null);

  useEffect(() => {
    // Load reaction counts from API
    fetch(`/api/v1/players/${playerSlug}/reactions`)
      .then(r => r.json())
      .then(data => {
        if (data.counts) setCounts(data.counts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Load which reactions this user has already made (localStorage)
    try {
      const stored = JSON.parse(localStorage.getItem(`psp_reactions_${playerSlug}`) ?? '[]');
      setReacted(new Set(stored));
    } catch {}
  }, [playerSlug]);

  const handleReact = async (key: string) => {
    if (reacted.has(key)) return; // already reacted
    
    // Optimistic update
    setCounts(prev => ({ ...prev, [key]: prev[key as keyof ReactionCounts] + 1 }));
    setReacted(prev => new Set([...prev, key]));
    setAnimating(key);
    setTimeout(() => setAnimating(null), 600);

    // Persist to localStorage
    try {
      const next = [...reacted, key];
      localStorage.setItem(`psp_reactions_${playerSlug}`, JSON.stringify(next));
    } catch {}

    // Fire and forget to API
    fetch(`/api/v1/players/${playerSlug}/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reaction: key }),
    }).catch(() => {});
  };

  const navy = '#1a2744'; const gold = '#c8a84b';

  return (
    <div style={{ margin: '1.5rem 0', padding: '1rem 1.25rem', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
      <div className="psp-caption" style={{ marginBottom: '0.75rem' }}>REACT</div>
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' as const }}>
        {REACTIONS.map(({ emoji, label, key }) => {
          const hasReacted = reacted.has(key);
          const count = counts[key as keyof ReactionCounts];
          return (
            <button
              key={key}
              onClick={() => handleReact(key)}
              disabled={hasReacted || loading}
              title={hasReacted ? `You reacted ${label}` : `React ${label}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.4rem 0.8rem', borderRadius: 20, border: `2px solid ${hasReacted ? gold : '#e5e7eb'}`,
                background: hasReacted ? '#fffbf0' : '#fff',
                cursor: hasReacted ? 'default' : 'pointer',
                transition: 'all 0.15s', fontFamily: 'inherit',
                transform: animating === key ? 'scale(1.25)' : 'scale(1)',
              }}
            >
              <span style={{ fontSize: '1.15rem', lineHeight: 1 }}>{emoji}</span>
              <span style={{ fontWeight: 700, fontSize: '0.82rem', color: hasReacted ? gold : navy, minWidth: 16 }}>
                {loading ? '…' : count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
