'use client';

import { useRouter } from 'next/navigation';

interface Props {
  seasons: string[];
  currentSeason: string;
  baseUrl: string;
}

export default function RosterSeasonSelector({ seasons, currentSeason, baseUrl }: Props) {
  const router = useRouter();

  return (
    <div>
      <label
        style={{
          color: "#999",
          fontSize: "0.9rem",
          marginRight: "1rem",
          fontWeight: 600,
        }}
      >
        Season:
      </label>
      <select
        defaultValue={currentSeason}
        onChange={(e) => {
          router.push(`${baseUrl}?season=${e.target.value}`);
        }}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          border: "1px solid #333",
          background: "#0a1628",
          color: "#ccc",
          fontSize: "0.95rem",
          cursor: "pointer",
        }}
      >
        {seasons.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
