'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PlayerResult {
  id: number;
  name: string;
  slug: string;
  school: string;
}

interface SelectedPlayer {
  slug: string;
  name: string;
  school: string;
}

export default function CompareSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSport = searchParams.get('sport') || 'football';
  const currentSlugs = searchParams.get('players')?.split(',').filter(Boolean) || [];

  const [sport, setSport] = useState(currentSport);
  const [selected, setSelected] = useState<SelectedPlayer[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const searchPlayers = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/players/search?q=${encodeURIComponent(q)}&sport=${sport}`);
      const data = await res.json();
      // Filter out already selected
      const selectedSlugs = new Set(selected.map(s => s.slug));
      setResults(data.filter((p: PlayerResult) => !selectedSlugs.has(p.slug)));
      setShowDropdown(true);
      setHighlightIdx(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [sport, selected]);

  function handleInput(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPlayers(value), 300);
  }

  function addPlayer(p: PlayerResult) {
    if (selected.length >= 4) return;
    const newSelected = [...selected, { slug: p.slug, name: p.name, school: p.school }];
    setSelected(newSelected);
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  }

  function removePlayer(slug: string) {
    setSelected(selected.filter(s => s.slug !== slug));
  }

  function handleCompare() {
    if (selected.length < 2) return;
    const slugs = selected.map(s => s.slug).join(',');
    router.push(`/compare?players=${slugs}&sport=${sport}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlightIdx >= 0) {
      e.preventDefault();
      addPlayer(results[highlightIdx]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  }

  return (
    <div className="rounded-xl p-6 mb-8" style={{ background: 'var(--psp-navy)', border: '1px solid rgba(240, 165, 0, 0.2)' }}>
      <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.05em' }}>
        Select Players to Compare
      </h3>

      {/* Sport selector */}
      <div className="flex gap-2 mb-4">
        {['football', 'basketball'].map(s => (
          <button
            key={s}
            onClick={() => { setSport(s); setSelected([]); setResults([]); }}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            style={{
              background: sport === s ? 'var(--psp-gold)' : 'rgba(255,255,255,0.1)',
              color: sport === s ? 'var(--psp-navy)' : '#ccc',
            }}
          >
            {s === 'football' ? 'Football' : 'Basketball'}
          </button>
        ))}
      </div>

      {/* Selected players */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selected.map(p => (
            <div key={p.slug} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
              style={{ background: 'rgba(240, 165, 0, 0.15)', color: 'var(--psp-gold)', border: '1px solid rgba(240, 165, 0, 0.3)' }}>
              <span className="font-medium">{p.name}</span>
              <span className="text-xs opacity-60">{p.school}</span>
              <button onClick={() => removePlayer(p.slug)} className="ml-1 hover:text-white transition-colors">&times;</button>
            </div>
          ))}
        </div>
      )}

      {/* Search input */}
      {selected.length < 4 && (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
            placeholder={selected.length === 0 ? "Search for a player..." : `Add another player (${selected.length}/4)...`}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          />
          {loading && (
            <div className="absolute right-3 top-3.5 text-xs text-gray-400">Searching...</div>
          )}

          {/* Dropdown results */}
          {showDropdown && results.length > 0 && (
            <div ref={dropdownRef} className="absolute z-50 w-full mt-1 rounded-lg overflow-hidden shadow-xl"
              style={{ background: 'var(--psp-navy-mid, #0f2040)', border: '1px solid rgba(255,255,255,0.15)' }}>
              {results.map((p, idx) => (
                <button
                  key={p.slug}
                  onClick={() => addPlayer(p)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left transition-colors"
                  style={{
                    background: idx === highlightIdx ? 'rgba(240, 165, 0, 0.1)' : 'transparent',
                    borderBottom: idx < results.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  <div>
                    <div className="text-sm font-medium text-white">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.school}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(240, 165, 0, 0.15)', color: 'var(--psp-gold)' }}>
                    Add
                  </span>
                </button>
              ))}
            </div>
          )}

          {showDropdown && query.length >= 2 && results.length === 0 && !loading && (
            <div ref={dropdownRef} className="absolute z-50 w-full mt-1 rounded-lg p-4 text-center text-sm text-gray-400"
              style={{ background: 'var(--psp-navy-mid, #0f2040)', border: '1px solid rgba(255,255,255,0.15)' }}>
              No {sport} players found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}

      {/* Compare button */}
      <button
        onClick={handleCompare}
        disabled={selected.length < 2}
        className="mt-4 px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all"
        style={{
          background: selected.length >= 2 ? 'var(--psp-gold)' : 'rgba(255,255,255,0.1)',
          color: selected.length >= 2 ? 'var(--psp-navy)' : '#666',
          cursor: selected.length >= 2 ? 'pointer' : 'not-allowed',
          fontFamily: 'Barlow Condensed, sans-serif',
          letterSpacing: '0.1em',
          fontSize: '1rem',
        }}
      >
        Compare {selected.length >= 2 ? `${selected.length} Players` : '(Select 2+)'}
      </button>
    </div>
  );
}
