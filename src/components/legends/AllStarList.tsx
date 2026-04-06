"use client";

import { useState } from "react";
import type { CoachingStint } from "@/lib/data/legends";

interface AllStarListProps {
  stints: CoachingStint[];
}

export default function AllStarList({ stints }: AllStarListProps) {
  const allStars = stints.flatMap((s) =>
    (s.allStars ?? []).map((a) => ({ ...a, school: s.school }))
  );

  const [expanded, setExpanded] = useState(allStars.length <= 12);

  if (!allStars.length) return null;

  // Group by school
  const grouped = allStars.reduce(
    (acc, a) => {
      if (!acc[a.school]) acc[a.school] = [];
      acc[a.school].push(a);
      return acc;
    },
    {} as Record<string, typeof allStars>
  );

  const displayEntries = Object.entries(grouped);

  return (
    <div>
      <h4 className="font-heading text-sm uppercase tracking-wider text-[var(--psp-navy)] mb-3">
        All-Star Players
      </h4>

      <div className={`space-y-3 ${!expanded ? "max-h-48 overflow-hidden relative" : ""}`}>
        {displayEntries.map(([school, players]) => (
          <div key={school}>
            <p className="text-xs font-semibold text-[var(--psp-gold)] mb-1">
              {school}
            </p>
            <ul className="space-y-0.5">
              {players.map((p, i) => (
                <li
                  key={i}
                  className="text-xs text-[var(--psp-gray-600)] flex items-baseline gap-1"
                >
                  <span className="text-[var(--psp-gray-400)] font-mono w-8 flex-shrink-0">
                    {p.year}:
                  </span>
                  <span>
                    {p.name}
                    {p.position && (
                      <span className="text-[var(--psp-gray-400)]">
                        {" "}({p.position})
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      {allStars.length > 12 && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="mt-2 text-xs font-semibold text-[var(--psp-blue)] hover:underline"
        >
          Show all {allStars.length} selections
        </button>
      )}
    </div>
  );
}
