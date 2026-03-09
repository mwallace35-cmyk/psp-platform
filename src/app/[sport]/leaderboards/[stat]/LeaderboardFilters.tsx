'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface LeaderboardFiltersProps {
  seasons: string[];
  leagues: string[];
  schools: string[];
}

export default function LeaderboardFilters({ seasons, leagues, schools }: LeaderboardFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
      <select
        className="w-full sm:w-auto px-3 py-2 rounded border text-sm"
        style={{ borderColor: "var(--g300, #475569)", color: "var(--text, #e2e8f0)", backgroundColor: "var(--psp-gray-100, #1e293b)" }}
        value={searchParams.get('season') || ''}
        onChange={(e) => updateFilter('season', e.target.value)}
        aria-label="Filter by season"
      >
        <option value="">All Seasons</option>
        {seasons.map((season) => (
          <option key={season} value={season}>{season}</option>
        ))}
      </select>

      <select
        className="w-full sm:w-auto px-3 py-2 rounded border text-sm"
        style={{ borderColor: "var(--g300, #475569)", color: "var(--text, #e2e8f0)", backgroundColor: "var(--psp-gray-100, #1e293b)" }}
        value={searchParams.get('league') || ''}
        onChange={(e) => updateFilter('league', e.target.value)}
        aria-label="Filter by league"
      >
        <option value="">All Leagues</option>
        {leagues.map((league) => (
          <option key={league} value={league}>{league}</option>
        ))}
      </select>

      <select
        className="w-full sm:w-auto px-3 py-2 rounded border text-sm"
        style={{ borderColor: "var(--g300, #475569)", color: "var(--text, #e2e8f0)", backgroundColor: "var(--psp-gray-100, #1e293b)" }}
        value={searchParams.get('school') || ''}
        onChange={(e) => updateFilter('school', e.target.value)}
        aria-label="Filter by school"
      >
        <option value="">All Schools</option>
        {schools.map((school) => (
          <option key={school} value={school}>{school}</option>
        ))}
      </select>
    </div>
  );
}
