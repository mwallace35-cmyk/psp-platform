'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface LiveGame {
  id: number;
  sport: string;
  status: 'scheduled' | 'in_progress' | 'final';
  time?: string;
  home_team: { id: number; name: string; slug: string; score: number };
  away_team: { id: number; name: string; slug: string; score: number };
}

const SPORT_ABBR: Record<string, string> = {
  football: 'FB', basketball: 'BB', baseball: 'BSB',
  soccer: 'SOC', lacrosse: 'LAX', wrestling: 'WR',
};

function abbreviateName(name: string): string {
  if (name.length <= 14) return name;
  const parts = name.split(' ');
  if (parts.length >= 2) return parts.slice(-1)[0];
  return name.slice(0, 12) + '…';
}

function TickerItem({ game }: { game: LiveGame }) {
  const sportAbbr = SPORT_ABBR[game.sport?.toLowerCase()] ?? game.sport?.slice(0,2).toUpperCase() ?? '??';
  const isLive = game.status === 'in_progress';
  const homeWinning = game.home_team.score >= game.away_team.score;
  const statusColor = isLive ? '#22c55e' : 'rgba(255,255,255,0.45)';
  return (
    <Link href={`/${game.sport}/games/${game.id}`} style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.35rem 1.25rem', textDecoration:'none', borderRight:'1px solid rgba(255,255,255,0.08)' }}>
      <span style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.75rem', fontWeight:700, letterSpacing:1 }}>{sportAbbr}</span>
      <span style={{ color: game.status==='final'&&!homeWinning ? '#fff' : 'rgba(255,255,255,0.7)', fontSize:'0.8rem', fontWeight: game.status==='final'&&!homeWinning ? 700 : 400 }}>{abbreviateName(game.away_team.name)}</span>
      <span style={{ color:'var(--psp-gold,#c8a84b)', fontSize:'0.85rem', fontWeight:800, fontVariantNumeric:'tabular-nums' }}>{game.away_team.score}</span>
      <span style={{ color:'rgba(255,255,255,0.25)', fontSize:'0.75rem' }}>@</span>
      <span style={{ color: game.status==='final'&&homeWinning ? '#fff' : 'rgba(255,255,255,0.7)', fontSize:'0.8rem', fontWeight: game.status==='final'&&homeWinning ? 700 : 400 }}>{abbreviateName(game.home_team.name)}</span>
      <span style={{ color:'var(--psp-gold,#c8a84b)', fontSize:'0.85rem', fontWeight:800, fontVariantNumeric:'tabular-nums' }}>{game.home_team.score}</span>
      <span style={{ color:statusColor, fontSize:'0.75rem', fontWeight:700, letterSpacing:0.5 }}>{isLive ? (game.time ?? 'LIVE') : 'FINAL'}</span>
    </Link>
  );
}

export default function ScoreTicker() {
  const [games, setGames] = useState<LiveGame[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    try {
      // Only fetch if an API key is available (live scores require premium auth).
      // Without a key the endpoint returns 401 on every page load.
      const apiKey = typeof window !== 'undefined'
        ? (document.cookie.match(/psp_api_key=([^;]+)/)?.[1] ?? localStorage.getItem('psp_api_key'))
        : null;

      if (!apiKey) {
        setLoading(false);
        return;
      }

      const r = await fetch('/api/v1/live/scores', {
        cache: 'no-store',
        headers: { 'x-api-key': apiKey },
      });
      if (!r.ok) return;
      const json = await r.json();
      const data: LiveGame[] = Array.isArray(json) ? json : (json.data ?? []);
      setGames(data.filter(g => g.status !== 'scheduled').sort((a,b) => {
        if (a.status==='in_progress'&&b.status!=='in_progress') return -1;
        if (b.status==='in_progress'&&a.status!=='in_progress') return 1;
        return 0;
      }));
    } catch { /* silently fail */ } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchScores();
    const iv = setInterval(fetchScores, 45_000);
    return () => clearInterval(iv);
  }, []);

  if (loading || games.length === 0) return null;

  const hasLive = games.some(g => g.status === 'in_progress');
  const duration = Math.max(20, games.length * 8);

  return (
    <div style={{ background:'var(--psp-navy,#1a2744)', borderBottom:'2px solid var(--psp-gold,#c8a84b)', overflow:'hidden' }} aria-label="Live and recent scores">
      <div style={{ display:'flex', alignItems:'stretch' }}>
        <div style={{ display:'flex', alignItems:'center', padding:'0.3rem 0.75rem', background: hasLive ? '#dc2626' : 'rgba(255,255,255,0.08)', flexShrink:0, gap:'0.4rem' }}>
          {hasLive && <span style={{ width:7, height:7, borderRadius:'50%', background:'#fff', display:'inline-block', animation:'livePulse 1.4s ease-in-out infinite' }} />}
          <span style={{ color:'#fff', fontSize:'0.75rem', fontWeight:800, letterSpacing:1.5, textTransform:'uppercase' as const }}>{hasLive ? 'Live' : 'Scores'}</span>
        </div>
        <div style={{ overflow:'hidden', flex:1 }}>
          <div style={{ display:'flex', animation:`tickerScroll ${duration}s linear infinite`, whiteSpace:'nowrap', alignItems:'center' }}>
            {[...games, ...games].map((g, i) => <TickerItem key={`${g.id}-${i}`} game={g} />)}
          </div>
        </div>
        <Link href="/scores/live" style={{ display:'flex', alignItems:'center', padding:'0.3rem 0.75rem', color:'var(--psp-gold,#c8a84b)', fontSize:'0.75rem', fontWeight:700, textDecoration:'none', flexShrink:0, borderLeft:'1px solid rgba(255,255,255,0.1)', letterSpacing:0.5 }}>All →</Link>
      </div>
      <style>{`
        @keyframes tickerScroll { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        @keyframes livePulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
      `}</style>
    </div>
  );
}
