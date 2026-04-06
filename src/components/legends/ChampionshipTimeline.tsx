import type { CoachingStint } from "@/lib/data/legends";

interface ChampionshipTimelineProps {
  stints: CoachingStint[];
}

export default function ChampionshipTimeline({ stints }: ChampionshipTimelineProps) {
  const championships = stints.flatMap((s) =>
    (s.championships ?? []).map((c) => ({ ...c, school: s.school }))
  );

  if (!championships.length) return null;

  // Sort by year
  const sorted = [...championships].sort((a, b) => a.year - b.year);

  return (
    <div>
      <h4 className="font-heading text-sm uppercase tracking-wider text-[var(--psp-navy)] mb-3">
        Championships ({sorted.length})
      </h4>

      <div className="space-y-2">
        {sorted.map((c, i) => (
          <div
            key={i}
            className="flex items-start gap-2 text-xs border-l-2 border-[var(--psp-gold)] pl-3 py-1"
          >
            <span className="font-mono font-bold text-[var(--psp-navy)] flex-shrink-0">
              {c.year}
            </span>
            <div>
              <p className="font-semibold text-[var(--psp-gray-700)]">
                {c.title}
              </p>
              {c.result && (
                <p className="text-[var(--psp-gray-500)]">{c.result}</p>
              )}
              <p className="text-[var(--psp-gray-400)]">{c.school}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
