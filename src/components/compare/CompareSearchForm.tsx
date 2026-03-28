'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  slug: string;
  name: string;
  entity_type: string;
  meta?: { graduation_year?: number; school?: string; positions?: string[] };
}

export default function CompareSearchForm() {
  const router = useRouter();
  const [queryA, setQueryA] = useState('');
  const [queryB, setQueryB] = useState('');
  const [resultsA, setResultsA] = useState<SearchResult[]>([]);
  const [resultsB, setResultsB] = useState<SearchResult[]>([]);
  const [selectedA, setSelectedA] = useState<SearchResult | null>(null);
  const [selectedB, setSelectedB] = useState<SearchResult | null>(null);
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const wrapperARef = useRef<HTMLDivElement>(null);
  const wrapperBRef = useRef<HTMLDivElement>(null);
  const timerA = useRef<ReturnType<typeof setTimeout>>(undefined);
  const timerB = useRef<ReturnType<typeof setTimeout>>(undefined);

  const navy = '#1a2744';
  const gold = '#c8a84b';

  const searchPlayers = useCallback(async (q: string, side: 'a' | 'b') => {
    if (q.length < 2) {
      if (side === 'a') setResultsA([]);
      else setResultsB([]);
      return;
    }
    if (side === 'a') setLoadingA(true);
    else setLoadingB(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=player`);
      if (!res.ok) return;
      const json = await res.json();
      const players = (json.data?.results ?? []).filter(
        (r: SearchResult) => r.entity_type === 'player'
      );
      if (side === 'a') { setResultsA(players); setShowDropdownA(true); }
      else { setResultsB(players); setShowDropdownB(true); }
    } catch { /* ignore */ } finally {
      if (side === 'a') setLoadingA(false);
      else setLoadingB(false);
    }
  }, []);

  const handleInputA = (val: string) => {
    setQueryA(val);
    setSelectedA(null);
    clearTimeout(timerA.current);
    timerA.current = setTimeout(() => searchPlayers(val, 'a'), 300);
  };

  const handleInputB = (val: string) => {
    setQueryB(val);
    setSelectedB(null);
    clearTimeout(timerB.current);
    timerB.current = setTimeout(() => searchPlayers(val, 'b'), 300);
  };

  const selectPlayer = (player: SearchResult, side: 'a' | 'b') => {
    if (side === 'a') {
      setSelectedA(player);
      setQueryA(player.name);
      setShowDropdownA(false);
    } else {
      setSelectedB(player);
      setQueryB(player.name);
      setShowDropdownB(false);
    }
  };

  const handleCompare = () => {
    if (!selectedA || !selectedB) return;
    router.push(`/players/compare?a=${encodeURIComponent(selectedA.slug)}&b=${encodeURIComponent(selectedB.slug)}`);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperARef.current && !wrapperARef.current.contains(e.target as Node)) setShowDropdownA(false);
      if (wrapperBRef.current && !wrapperBRef.current.contains(e.target as Node)) setShowDropdownB(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
    background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
    marginTop: 4, maxHeight: 240, overflowY: 'auto',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
  };

  const itemStyle: React.CSSProperties = {
    padding: '0.6rem 0.75rem', cursor: 'pointer', borderBottom: '1px solid #f3f4f6',
    fontSize: '0.85rem',
  };

  const renderDropdown = (results: SearchResult[], side: 'a' | 'b', loading: boolean) => (
    <div style={dropdownStyle}>
      {loading && <div style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.8rem' }}>Searching...</div>}
      {!loading && results.length === 0 && <div style={{ padding: '0.75rem', color: '#6b7280', fontSize: '0.8rem' }}>No players found</div>}
      {results.map((r) => (
        <div
          key={r.slug}
          style={itemStyle}
          onMouseDown={() => selectPlayer(r, side)}
          onMouseOver={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#f9fafb'; }}
          onMouseOut={(e) => { (e.currentTarget as HTMLDivElement).style.background = '#fff'; }}
        >
          <div style={{ fontWeight: 600, color: navy }}>{r.name}</div>
          {r.meta && (
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>
              {r.meta.school && <span>{r.meta.school}</span>}
              {r.meta.graduation_year && <span> &middot; Class of {r.meta.graduation_year}</span>}
              {r.meta.positions && r.meta.positions.length > 0 && <span> &middot; {r.meta.positions.join(', ')}</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'start', marginBottom: '1.5rem' }}>
        {/* Player A */}
        <div ref={wrapperARef} style={{ position: 'relative' }}>
          <label htmlFor="compare-a" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Player 1</label>
          <input
            id="compare-a"
            type="text"
            value={queryA}
            onChange={(e) => handleInputA(e.target.value)}
            onFocus={() => { if (resultsA.length > 0) setShowDropdownA(true); }}
            placeholder="Search for a player..."
            autoComplete="off"
            style={{
              width: '100%', padding: '0.65rem 0.75rem', border: selectedA ? `2px solid ${gold}` : '2px solid #e5e7eb',
              borderRadius: 8, fontSize: '0.9rem', outline: 'none', background: selectedA ? '#fffbeb' : '#fff',
            }}
          />
          {selectedA && <div style={{ marginTop: 4, fontSize: '0.7rem', color: gold, fontWeight: 700 }}>Selected</div>}
          {showDropdownA && renderDropdown(resultsA, 'a', loadingA)}
        </div>

        {/* VS */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 24 }}>
          <div style={{ background: navy, color: '#fff', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', fontFamily: 'Bebas Neue, sans-serif' }}>VS</div>
        </div>

        {/* Player B */}
        <div ref={wrapperBRef} style={{ position: 'relative' }}>
          <label htmlFor="compare-b" style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Player 2</label>
          <input
            id="compare-b"
            type="text"
            value={queryB}
            onChange={(e) => handleInputB(e.target.value)}
            onFocus={() => { if (resultsB.length > 0) setShowDropdownB(true); }}
            placeholder="Search for a player..."
            autoComplete="off"
            style={{
              width: '100%', padding: '0.65rem 0.75rem', border: selectedB ? `2px solid ${gold}` : '2px solid #e5e7eb',
              borderRadius: 8, fontSize: '0.9rem', outline: 'none', background: selectedB ? '#fffbeb' : '#fff',
            }}
          />
          {selectedB && <div style={{ marginTop: 4, fontSize: '0.7rem', color: gold, fontWeight: 700 }}>Selected</div>}
          {showDropdownB && renderDropdown(resultsB, 'b', loadingB)}
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={!selectedA || !selectedB}
        style={{
          display: 'block', width: '100%', padding: '0.75rem',
          background: selectedA && selectedB ? gold : '#e5e7eb',
          color: selectedA && selectedB ? navy : '#9ca3af',
          border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem',
          cursor: selectedA && selectedB ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s',
        }}
      >
        {selectedA && selectedB ? `Compare ${selectedA.name} vs ${selectedB.name}` : 'Select two players to compare'}
      </button>
    </div>
  );
}
