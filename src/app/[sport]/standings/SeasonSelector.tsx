'use client';

import { useRouter } from 'next/navigation';

interface Props {
  sport: string;
  currentSeason: string;
  availableSeasons: string[];
}

export default function SeasonSelector({ sport, currentSeason, availableSeasons }: Props) {
  const router = useRouter();

  return (
    <div className="mb-6 rounded-lg border border-gray-700 bg-[var(--psp-navy-mid)] p-4">
      <label className="block text-sm font-semibold text-gray-300 mb-2">Select Season</label>
      <div className="flex items-center gap-3">
        <select
          value={currentSeason}
          onChange={(e) => router.push(`/${sport}/standings?season=${e.target.value}`)}
          className="rounded bg-gray-900 border border-gray-600 px-4 py-2 text-white text-sm focus:border-[var(--psp-gold)] focus:outline-none"
        >
          {availableSeasons.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className="hidden sm:flex gap-1.5">
          {availableSeasons.slice(0, 5).map((s) => (
            <a
              key={s}
              href={`/${sport}/standings?season=${s}`}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                s === currentSeason
                  ? 'bg-[var(--psp-gold)] text-[var(--psp-navy)]'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
