'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchResult {
  entity_type: string;
  display_name: string;
  url_path: string;
  context?: string;
  sport_id?: string;
}

const TYPE_META: Record<string, { icon: string; label: string }> = {
  school: { icon: '🏫', label: 'Schools' },
  player: { icon: '👤', label: 'Players' },
  coach: { icon: '🧑‍🏫', label: 'Coaches' },
  season: { icon: '📅', label: 'Seasons' },
};

const POPULAR = [
  "St. Joseph's Prep",
  "Neumann-Goretti",
  "Roman Catholic",
  "Imhotep Charter",
  "La Salle",
  "Archbishop Wood",
];

const SPORT_COLORS: Record<string, string> = {
  football: '#16a34a',
  basketball: '#ea580c',
  baseball: '#dc2626',
  'track-field': '#7c3aed',
  lacrosse: '#0891b2',
  wrestling: '#ca8a04',
  soccer: '#059669',
};

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout>(undefined);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
      setActiveIdx(-1);
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/players/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  const handleInput = (val: string) => {
    setQuery(val);
    setActiveIdx(-1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 250);
  };

  // Group results by type
  const grouped: Record<string, SearchResult[]> = {};
  for (const r of results) {
    const t = r.entity_type || 'other';
    if (!grouped[t]) grouped[t] = [];
    grouped[t].push(r);
  }

  // Flat list for keyboard nav
  const flatResults = Object.values(grouped).flat();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIdx >= 0 && flatResults[activeIdx]) {
        router.push(flatResults[activeIdx].url_path);
        onClose();
      } else if (query.length >= 2) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="so-content" onClick={(e) => e.stopPropagation()}>
        {/* Search input */}
        <div className="so-input-wrap">
          <span className="so-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search players, schools, coaches..."
            className="so-input"
            autoComplete="off"
          />
          <button onClick={onClose} className="so-close">ESC</button>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="so-loading">
            <div className="so-loading-bar" />
          </div>
        )}

        {/* Results */}
        {query.length >= 2 && results.length > 0 && (
          <div className="so-results">
            {Object.entries(grouped).map(([type, items]) => (
              <div key={type} className="so-group">
                <div className="so-group-head">
                  <span>{TYPE_META[type]?.icon || '📋'}</span>
                  {TYPE_META[type]?.label || type} ({items.length})
                </div>
                {items.map((item, i) => {
                  const globalIdx = flatResults.indexOf(item);
                  return (
                    <Link
                      key={i}
                      href={item.url_path || '#'}
                      className={`so-result${globalIdx === activeIdx ? ' so-result-active' : ''}`}
                      onClick={onClose}
                    >
                      <span className="so-result-name">{item.display_name}</span>
                      {item.sport_id && (
                        <span
                          className="so-result-sport"
                          style={{ background: SPORT_COLORS[item.sport_id] || '#64748b' }}
                        >
                          {item.sport_id}
                        </span>
                      )}
                      {item.context && <span className="so-result-ctx">{item.context}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
            <Link href={`/search?q=${encodeURIComponent(query)}`} className="so-see-all" onClick={onClose}>
              See all results for &quot;{query}&quot; →
            </Link>
          </div>
        )}

        {/* No results */}
        {query.length >= 2 && !loading && results.length === 0 && (
          <div className="so-empty">
            No results found for &quot;{query}&quot;
          </div>
        )}

        {/* Popular searches (when empty) */}
        {query.length < 2 && (
          <div className="so-popular">
            <div className="so-popular-head">Popular Searches</div>
            <div className="so-popular-list">
              {POPULAR.map((term) => (
                <button
                  key={term}
                  className="so-popular-item"
                  onClick={() => { handleInput(term); setQuery(term); }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
