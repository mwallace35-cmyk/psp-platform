"use client";

interface Recruit {
  id: number;
  player_name?: string;
  school_name?: string;
  sport_id?: string;
  class_year: number;
  position?: string;
  star_rating?: number;
  composite_rating?: number;
  status?: string;
  committed_school?: string;
  committed_date?: string;
  offers?: string[];
  ranking_247?: number;
  ranking_rivals?: number;
  ranking_on3?: number;
  ranking_espn?: number;
  url_247?: string;
  url_rivals?: string;
  url_on3?: string;
  url_maxpreps?: string;
  url_hudl?: string;
  height?: string;
  weight?: number;
  highlights_url?: string;
}

interface Props {
  recruits: Recruit[];
  sportColor?: string;
}

export default function RecruitingBoard({ recruits, sportColor = "#f0a500" }: Props) {
  if (!recruits || recruits.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8" }}>
        No recruits to display
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recruits.map((r, idx) => (
        <div
          key={r.id}
          className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition"
        >
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: "#0a1628", color: sportColor }}
          >
            {idx + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {r.player_name ?? "Unknown"}
              </span>
              {r.star_rating && (
                <span className="text-sm" style={{ color: sportColor }}>
                  {"★".repeat(r.star_rating)}
                  {"☆".repeat(5 - r.star_rating)}
                </span>
              )}
              {r.status && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase">
                  {r.status}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
              {r.position && <span className="font-medium">{r.position}</span>}
              {r.school_name && <span>{r.school_name}</span>}
              <span>Class of {r.class_year}</span>
              {r.committed_school && (
                <span className="text-green-600 font-medium">
                  → {r.committed_school}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-1.5">
            {r.url_247 && (
              <a href={r.url_247} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 bg-blue-50 text-blue-700 rounded font-semibold">247</a>
            )}
            {r.url_rivals && (
              <a href={r.url_rivals} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 bg-red-50 text-red-700 rounded font-semibold">RIV</a>
            )}
            {r.url_on3 && (
              <a href={r.url_on3} target="_blank" rel="noopener noreferrer" className="text-[10px] px-2 py-1 bg-green-50 text-green-700 rounded font-semibold">On3</a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
