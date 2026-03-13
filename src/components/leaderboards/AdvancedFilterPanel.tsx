'use client';

import React, { useState, useMemo } from 'react';

export interface FilterState {
  positions: string[];
  schools: string[];
  yearStart: number | null;
  yearEnd: number | null;
  league: string;
  minGames: number | null;
}

interface School {
  name: string;
  slug: string;
}

interface AdvancedFilterPanelProps {
  sport: string;
  positions: string[];
  schools: School[];
  leagues: string[];
  onFilter: (filters: FilterState) => void;
}

export default function AdvancedFilterPanel({
  sport,
  positions,
  schools,
  leagues,
  onFilter,
}: AdvancedFilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    positions: [],
    schools: [],
    yearStart: null,
    yearEnd: null,
    league: '',
    minGames: null,
  });

  const [schoolSearch, setSchoolSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter schools by search term
  const filteredSchools = useMemo(() => {
    if (!schoolSearch.trim()) return schools;
    const lower = schoolSearch.toLowerCase();
    return schools.filter(s => s.name.toLowerCase().includes(lower));
  }, [schools, schoolSearch]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.positions.length > 0) count++;
    if (filters.schools.length > 0) count++;
    if (filters.yearStart !== null) count++;
    if (filters.yearEnd !== null) count++;
    if (filters.league) count++;
    if (filters.minGames !== null) count++;
    return count;
  }, [filters]);

  // Handle position toggle
  const togglePosition = (pos: string) => {
    setFilters(prev => ({
      ...prev,
      positions: prev.positions.includes(pos)
        ? prev.positions.filter(p => p !== pos)
        : [...prev.positions, pos],
    }));
  };

  // Handle school toggle
  const toggleSchool = (schoolName: string) => {
    setFilters(prev => ({
      ...prev,
      schools: prev.schools.includes(schoolName)
        ? prev.schools.filter(s => s !== schoolName)
        : [...prev.schools, schoolName],
    }));
  };

  // Handle league change
  const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      league: e.target.value,
    }));
  };

  // Handle year start change
  const handleYearStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFilters(prev => ({
      ...prev,
      yearStart: val ? parseInt(val) : null,
    }));
  };

  // Handle year end change
  const handleYearEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFilters(prev => ({
      ...prev,
      yearEnd: val ? parseInt(val) : null,
    }));
  };

  // Handle min games change
  const handleMinGamesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFilters(prev => ({
      ...prev,
      minGames: val ? parseInt(val) : null,
    }));
  };

  // Handle reset
  const handleReset = () => {
    const newFilters: FilterState = {
      positions: [],
      schools: [],
      yearStart: null,
      yearEnd: null,
      league: '',
      minGames: null,
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  // Trigger callback when filters change
  React.useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  return (
    <details
      open={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
      className="mb-6 border rounded-lg transition-colors"
      style={{
        borderColor: 'var(--psp-gray-300, #d1d5db)',
        background: 'var(--psp-gray-50, #f9fafb)',
      }}
    >
      {/* Summary (clickable header) */}
      <summary
        className="px-4 py-3 cursor-pointer hover:opacity-80 transition-opacity font-semibold flex items-center justify-between"
        style={{ color: 'var(--psp-navy)' }}
      >
        <div className="flex items-center gap-2">
          <span>🔍 Advanced Filters</span>
          {activeFilterCount > 0 && (
            <span
              className="px-2 py-1 text-xs rounded-full font-bold text-white"
              style={{ background: 'var(--psp-blue)' }}
            >
              {activeFilterCount}
            </span>
          )}
        </div>
        <span className="text-lg">{isOpen ? '▼' : '▶'}</span>
      </summary>

      {/* Filter content */}
      <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--psp-gray-300, #d1d5db)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Positions */}
          {positions.length > 0 && (
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--psp-navy)' }}>
                Position
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {positions.map(pos => (
                  <label key={pos} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.positions.includes(pos)}
                      onChange={() => togglePosition(pos)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: 'var(--psp-blue)' }}
                    />
                    <span className="text-sm" style={{ color: 'var(--psp-gray-700, #374151)' }}>
                      {pos}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Schools */}
          {schools.length > 0 && (
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--psp-navy)' }}>
                School
              </label>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={schoolSearch}
                  onChange={e => setSchoolSearch(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm border focus:outline-none focus:ring-2 transition"
                  style={{
                    borderColor: 'var(--psp-gray-300, #d1d5db)',
                    color: 'var(--psp-navy)',
                  }}
                />
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filteredSchools.map(school => (
                  <label key={school.slug} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.schools.includes(school.name)}
                      onChange={() => toggleSchool(school.name)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: 'var(--psp-blue)' }}
                    />
                    <span className="text-sm" style={{ color: 'var(--psp-gray-700, #374151)' }}>
                      {school.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* League */}
          {leagues.length > 0 && (
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--psp-navy)' }}>
                League
              </label>
              <select
                value={filters.league}
                onChange={handleLeagueChange}
                className="w-full px-3 py-2 rounded border text-sm focus:outline-none focus:ring-2 transition"
                style={{
                  borderColor: 'var(--psp-gray-300, #d1d5db)',
                  color: 'var(--psp-navy)',
                }}
              >
                <option value="">All Leagues</option>
                {leagues.map(league => (
                  <option key={league} value={league}>
                    {league}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Year Range */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--psp-navy)' }}>
              Season Start
            </label>
            <input
              type="number"
              placeholder="e.g., 2015"
              value={filters.yearStart ?? ''}
              onChange={handleYearStartChange}
              className="w-full px-3 py-2 rounded border text-sm focus:outline-none focus:ring-2 transition"
              style={{
                borderColor: 'var(--psp-gray-300, #d1d5db)',
                color: 'var(--psp-navy)',
              }}
            />
          </div>

          {/* Year End */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--psp-navy)' }}>
              Season End
            </label>
            <input
              type="number"
              placeholder="e.g., 2024"
              value={filters.yearEnd ?? ''}
              onChange={handleYearEndChange}
              className="w-full px-3 py-2 rounded border text-sm focus:outline-none focus:ring-2 transition"
              style={{
                borderColor: 'var(--psp-gray-300, #d1d5db)',
                color: 'var(--psp-navy)',
              }}
            />
          </div>

          {/* Minimum Games */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--psp-navy)' }}>
              Minimum Games
            </label>
            <input
              type="number"
              placeholder="e.g., 5"
              min="0"
              value={filters.minGames ?? ''}
              onChange={handleMinGamesChange}
              className="w-full px-3 py-2 rounded border text-sm focus:outline-none focus:ring-2 transition"
              style={{
                borderColor: 'var(--psp-gray-300, #d1d5db)',
                color: 'var(--psp-navy)',
              }}
            />
          </div>
        </div>

        {/* Reset Button */}
        {activeFilterCount > 0 && (
          <div className="mt-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded text-sm font-semibold transition-colors hover:opacity-80"
              style={{
                background: 'var(--psp-gray-200, #e5e7eb)',
                color: 'var(--psp-navy)',
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </details>
  );
}
