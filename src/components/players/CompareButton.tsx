'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CompareButtonProps { playerSlug: string; playerName: string; }

export default function CompareButton({ playerSlug, playerName }: CompareButtonProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ slug: string; name: string; school: string }>>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const navy = '#1a2744'; const gold = '#c8a84b';

  const search = async (q: string) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const r = await fetch(`/api/players/search?q=${encodeURIComponent(q)}&limit=6`);
      const j = await r.json();
      const filtered = (j.players ?? j.results ?? j ?? []).filter((p: { slug: string }) => p.slug !== playerSlug);
      setResults(filtered.slice(0, 5));
    } catch { setResults([]); } finally { setLoading(false); }
  };

  const handleSelect = (otherSlug: string) => {
    router.push(`/players/compare?a=${playerSlug}&b=${otherSlug}`);
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)} style={{ background:'transparent', border:`1.5px solid ${navy}`, color:navy, borderRadius:8, padding:'0.45rem 0.9rem', fontSize:'0.82rem', fontWeight:700, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6 }}>
        {"⚔"} Compare
      </button>
      {open && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }} onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div style={{ background:'#fff', borderRadius:14, padding:'1.5rem', width:'100%', maxWidth:420, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
              <h3 className="psp-h3" style={{ margin:0, color:navy }}>Compare {playerName}</h3>
              <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', fontSize:'1.3rem', cursor:'pointer', color:'#9ca3af' }}>{"✕"}</button>
            </div>
            <p style={{ margin:'0 0 0.75rem', fontSize:'0.82rem', color:'#6b7280' }}>Search for another player to compare against.</p>
            <input type='text' value={query} onChange={(e) => search(e.target.value)} placeholder='Search player name...' autoFocus aria-label="Search player name to compare" style={{ width:'100%', padding:'0.6rem 0.85rem', border:'1.5px solid #d1d5db', borderRadius:8, fontSize:'0.9rem', outline:'none', boxSizing:'border-box' as const }} />
            {loading && <div style={{ color:'#9ca3af', fontSize:'0.8rem', marginTop:8 }}>Searching{"…"}</div>}
            {results.length > 0 && (
              <div style={{ marginTop:8, border:'1px solid #e5e7eb', borderRadius:8, overflow:'hidden' }}>
                {results.map((p) => (
                  <button key={p.slug} onClick={() => handleSelect(p.slug)} style={{ display:'block', width:'100%', textAlign:'left', padding:'0.65rem 0.9rem', border:'none', borderBottom:'1px solid #f3f4f6', background:'#fff', cursor:'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                    <div style={{ fontWeight:700, color:navy, fontSize:'0.9rem' }}>{p.name}</div>
                    {p.school && <div style={{ fontSize:'0.75rem', color:'#6b7280' }}>{p.school}</div>}
                  </button>
                ))}
              </div>
            )}
            {query.length >= 2 && !loading && results.length === 0 && <div style={{ color:'#9ca3af', fontSize:'0.8rem', marginTop:8 }}>No players found.</div>}
            <div style={{ marginTop:'1rem', textAlign:'right' }}>
              <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', color:'#6b7280', fontSize:'0.82rem', cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
