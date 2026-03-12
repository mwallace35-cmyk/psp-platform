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
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
      <div className="flex flex-col gap-1">
        <label htmlFor="season-filter" className="text-sm font-medium">Season</label>
        <select
          id="season-filter"
          className="px-3 py-2 rounded border text-sm"
          style={{ borderColor: "var(--g300, #475569)", color: "var(--text, #e2e8f0)", backgroundColor: "var(--psp-gray-100, #1e293b)" }}
          value={searchParams.get('season') || ''}
          onChange={(e) => updateFilter('season', e.target.value)}
          aria-label="Filter leaderboard by season"
        >
          <option value="">All Seasons</option>
          {seasons.map((season) => (
            <option key={season} value={season}>{season}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="league-filter" className="text-sm font-medium">League</label>
        <select
          id="league-filter"
          className="px-3 py-2 rounded border text-sm"
          style={{ borderColor: "var(--g300, #475569)", color: "var(--text, #e2e8f0)", backgroundColor: "var(--psp-gray-100, #1e293b)" }}
          value={searchParams.get('league') || ''}
          onChange={(e) => updateFilter('league', e.target.value)}
          aria-label="Filter leaderboard by league"
        >
          <option value="">All Leagues</option>
          {leagues.map((league) => (
            <option key={league} value={league}>{league}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="school-filter" className="text-sm font-medium">School</label>
        <select
          id="school-filter"
          className="px-3 py-2 rounded border text-sm"
          style={{ borderColor: "var(--g300, #475569)", color: "var(--text, #e2e8f0)", backgroundColor: "var(--psp-gray-100, #1e293b)" }}
          value={searchParams.get('school') || ''}
          onChange={(e) => updateFilter('school', e.target.value)}
          aria-label="Filter leaderboard by school"
        >
          <option value="">All Schools</option>
          {schools.map((school) => (
            <option key={school} value={school}>{school}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
