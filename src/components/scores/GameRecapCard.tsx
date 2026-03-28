'use client';

import { useState } from 'react';
import Link from 'next/link';

interface GameRecapCardProps {
  gameId: number;
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  sport: string;
  date: string;
  existingRecapSlug?: string;
}

export default function GameRecapCard({
  gameId, homeName, awayName, homeScore, awayScore, sport, date, existingRecapSlug,
}: GameRecapCardProps) {
  const [recapSlug, setRecapSlug] = useState<string|null>(existingRecapSlug ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [generated, setGenerated] = useState(false);
  const winner = homeScore > awayScore ? homeName : awayScore > homeScore ? awayName : null;

  const handleGenerate = async () => {
    setLoading(true); setError(null);
    try {
      const r = await fetch('/api/ai/recap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameIds: [gameId] }),
        credentials: 'include',
      });
      if (!r.ok) { const j = await r.json().catch(()=>({})); throw new Error(j.error ?? `HTTP ${r.status}`); }
      const { results } = await r.json();
      const result = results?.find((x: { gameId: number; article?: { slug: string }; error?: string }) => x.gameId === gameId);
      if (result?.article?.slug) { setRecapSlug(result.article.slug); setGenerated(true); }
      else throw new Error(result?.error ?? 'Recap generation failed');
    } catch(err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background:'var(--psp-card-bg,#f8f9fc)', border:'1px solid #e5e7eb', borderRadius:10, padding:'1.25rem 1.5rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
        <span style={{ background:'var(--psp-navy,#1a2744)', color:'#fff', fontSize:'0.75rem', fontWeight:800, padding:'2px 8px', borderRadius:3, letterSpacing:1.5, textTransform:'uppercase' as const }}>{sport}</span>
        <span style={{ color:'var(--psp-muted,#6b7280)', fontSize:'0.8rem' }}>{new Date(date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
      </div>
      <Link href={`/${sport}/games/${gameId}`} style={{ textDecoration:'none', color:'inherit', display:'block' }}>
        <div style={{ cursor:'pointer' }}>
          {[{name:awayName,score:awayScore},{name:homeName,score:homeScore}].map(team=>(
            <div key={team.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.3rem' }}>
              <span style={{ fontWeight:winner===team.name?700:400, color:winner===team.name?'var(--psp-navy,#1a2744)':'var(--psp-muted,#6b7280)', fontSize:'0.95rem' }}>{team.name}</span>
              <span style={{ fontWeight:800, fontSize:'1.25rem', color:winner===team.name?'var(--psp-navy,#1a2744)':'var(--psp-muted,#6b7280)', fontVariantNumeric:'tabular-nums' }}>{team.score}</span>
            </div>
          ))}
        </div>
      </Link>
      <div style={{ borderTop:'1px solid #e5e7eb', paddingTop:'0.75rem', display:'flex', alignItems:'center', gap:'0.75rem' }}>
        {recapSlug ? (
          <>
            {generated && <span style={{ color:'#16a34a', fontSize:'0.8rem' }}>✓ Recap generated!</span>}
            <Link href={`/articles/${recapSlug}`} style={{ color:'var(--psp-navy,#1a2744)', fontWeight:600, fontSize:'0.875rem', textDecoration:'none' }}>Read Game Recap →</Link>
          </>
        ) : (
          <>
            <button onClick={handleGenerate} disabled={loading} style={{ background:loading?'#e5e7eb':'var(--psp-gold,#c8a84b)', color:loading?'#6b7280':'#1a2744', border:'none', borderRadius:6, padding:'0.4rem 0.9rem', fontSize:'0.8rem', fontWeight:700, cursor:loading?'not-allowed':'pointer' }}>
              {loading ? 'Generating…' : 'Generate Recap'}
            </button>
            <span style={{ color:'var(--psp-muted,#6b7280)', fontSize:'0.75rem' }}>AI-powered summary</span>
          </>
        )}
        {error && <span style={{ color:'#dc2626', fontSize:'0.75rem' }}>{error}</span>}
      </div>
    </div>
  );
}
