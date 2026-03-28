'use client';

import { useState, useMemo } from 'react';

interface CollegeEntry {
  id: string;
  name: string;
  count: number;
  sports: Record<string, number>;
}

interface Props {
  colleges: CollegeEntry[];
}

const DIVISION_KEYWORDS: Record<string, string[]> = {
  'D1': [
    'Alabama', 'Arizona', 'Auburn', 'Baylor', 'Boston College', 'Clemson', 'Colorado', 'Duke',
    'Florida', 'Georgia', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'LSU', 'Maryland',
    'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Nebraska', 'North Carolina', 'Notre Dame',
    'Ohio State', 'Oklahoma', 'Oregon', 'Penn State', 'Pittsburgh', 'Purdue', 'Rutgers', 'South Carolina',
    'Stanford', 'Syracuse', 'TCU', 'Temple', 'Tennessee', 'Texas', 'UCLA', 'USC', 'Vanderbilt',
    'Villanova', 'Virginia', 'Wake Forest', 'West Virginia', 'Wisconsin',
    'Saint Joseph', "St. Joseph's", 'La Salle', 'Drexel', 'Penn', 'UPenn',
    'Connecticut', 'UConn', 'James Madison', 'Appalachian State', 'Old Dominion', 'Liberty',
    'Marshall', 'Coastal Carolina', 'East Carolina', 'Hampton', 'Howard', 'Delaware',
    'Towson', 'Morgan State', 'Coppin State', 'Navy', 'Army', 'Air Force',
    'Lehigh', 'Lafayette', 'Bucknell', 'Holy Cross', 'Colgate',
    'Stony Brook', 'Maine', 'New Hampshire', 'Albany', 'UMBC',
    'Robert Morris', 'Sacred Heart', 'Wagner', 'LIU', 'FDU', 'Mount St. Mary',
    'Rider', 'Marist', 'Niagara', 'Monmouth', 'Iona', 'Siena',
    'Quinnipiac', 'Fairfield',
  ],
};

function guessDivision(name: string): string {
  const lower = name.toLowerCase();
  // Community college / JUCO indicators
  if (lower.includes('community college') || lower.includes('cc') && lower.length < 20 || lower.includes('junior college')) return 'JUCO';
  // NAIA indicators
  if (lower.includes('naia')) return 'NAIA';
  // Check D1 known names
  for (const kw of DIVISION_KEYWORDS['D1']) {
    if (lower.includes(kw.toLowerCase())) return 'D1';
  }
  // "University" or "State" heuristic -- likely D1/D2
  if (lower.includes('university') || lower.includes(' state')) return 'D1/D2';
  // "College" heuristic
  if (lower.includes('college')) return 'D2/D3';
  return 'Other';
}

const DIVISION_ORDER = ['D1', 'D1/D2', 'D2/D3', 'JUCO', 'NAIA', 'Other'];

export default function PipelineClient({ colleges }: Props) {
  const [search, setSearch] = useState('');
  const [expandedDivisions, setExpandedDivisions] = useState<Set<string>>(new Set(['D1']));

  // Top destinations
  const topDestinations = useMemo(() => colleges.slice(0, 10), [colleges]);

  // Filtered list
  const filtered = useMemo(() => {
    if (!search.trim()) return colleges;
    const q = search.toLowerCase();
    return colleges.filter((c) => c.name.toLowerCase().includes(q));
  }, [colleges, search]);

  // Group by division
  const grouped = useMemo(() => {
    const groups: Record<string, CollegeEntry[]> = {};
    for (const c of filtered) {
      const div = guessDivision(c.name);
      if (!groups[div]) groups[div] = [];
      groups[div].push(c);
    }
    return groups;
  }, [filtered]);

  const toggleDivision = (div: string) => {
    setExpandedDivisions((prev) => {
      const next = new Set(prev);
      if (next.has(div)) next.delete(div);
      else next.add(div);
      return next;
    });
  };

  return (
    <>
      {/* Top Destinations */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="psp-h2 mb-4" style={{ color: 'var(--psp-navy)' }}>
          Top Destinations
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {topDestinations.map((c, idx) => (
            <div
              key={c.id}
              className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition"
            >
              <div className="text-2xl font-bold" style={{ color: 'var(--psp-gold)' }}>
                {c.count}
              </div>
              <div className="text-xs font-semibold text-gray-900 mt-1 leading-tight">{c.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">#{idx + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search colleges by name..."
          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
          style={{ fontSize: '0.9rem' }}
        />
        {search && (
          <p className="text-xs text-gray-400 mt-1">
            {filtered.length} college{filtered.length !== 1 ? 's' : ''} matching &quot;{search}&quot;
          </p>
        )}
      </div>

      {/* Grouped by Division */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="psp-h2 mb-4" style={{ color: 'var(--psp-navy)' }}>
          All Colleges ({filtered.length})
        </h2>

        <div className="space-y-2">
          {DIVISION_ORDER.filter((div) => grouped[div] && grouped[div].length > 0).map((div) => {
            const items = grouped[div];
            const isExpanded = expandedDivisions.has(div);
            return (
              <div key={div} className="border border-gray-100 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleDivision(div)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm" style={{ color: 'var(--psp-navy)' }}>{div}</span>
                    <span className="text-xs text-gray-400 font-medium">
                      {items.length} college{items.length !== 1 ? 's' : ''} &middot; {items.reduce((s, c) => s + c.count, 0)} athletes
                    </span>
                  </div>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ color: '#9ca3af', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="divide-y divide-gray-50">
                    {items.map((college) => (
                      <div
                        key={college.id}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">{college.name}</p>
                          <p className="text-xs text-gray-400">
                            {Object.entries(college.sports)
                              .map(([sport, count]) => `${count} ${sport}`)
                              .join(', ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold" style={{ color: 'var(--psp-gold)' }}>
                            {college.count}
                          </p>
                          <p className="text-xs text-gray-400">athletes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
