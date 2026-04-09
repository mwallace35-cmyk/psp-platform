"use client";

import type { TimelineEra } from "@/lib/data/legacy";

interface Props {
  eras: TimelineEra[];
}

function formatYear(y: number | null): string {
  return y == null ? "Present" : String(y);
}

export default function CareerTimeline({ eras }: Props) {
  if (eras.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h2 className="text-2xl font-['Bebas_Neue'] text-[var(--psp-navy)] mb-4">Career Timeline</h2>
        <p className="text-gray-500 text-sm">Timeline data not yet available.</p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-2xl font-['Bebas_Neue'] text-[var(--psp-navy)] mb-6">Career Timeline</h2>

      {/* Mobile: vertical stack */}
      <div className="md:hidden space-y-3">
        {eras.map((era, i) => (
          <div
            key={i}
            className="rounded-xl border-l-4 pl-4 py-3 bg-white shadow-sm"
            style={{ borderColor: era.color }}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: era.color }}
              >
                {era.kind}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {era.startYear} – {formatYear(era.endYear)}
              </span>
            </div>
            <p className="font-semibold text-[var(--psp-navy)]">{era.label}</p>
            <p className="text-sm text-gray-600">{era.school}</p>
            {era.milestones.length > 0 && (
              <ul className="mt-2 space-y-1">
                {era.milestones.map((m, mi) => (
                  <li key={mi} className="text-xs text-gray-500 flex gap-1.5 items-start">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: era.color }} />
                    <span><strong>{m.year}</strong> — {m.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Desktop: horizontal band timeline */}
      <div className="hidden md:block overflow-x-auto">
        <div className="relative min-w-[600px]">
          {/* Axis line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200" />

          {/* Era bands */}
          <div className="relative flex items-center gap-1 py-8">
            {eras.map((era, i) => {
              const span = (era.endYear ?? new Date().getFullYear()) - era.startYear;
              const flex = Math.max(span, 1);
              return (
                <div
                  key={i}
                  className="relative group"
                  style={{ flex }}
                >
                  {/* Band */}
                  <div
                    className="h-10 rounded-lg opacity-90 hover:opacity-100 transition-opacity cursor-default"
                    style={{ backgroundColor: era.color }}
                    title={`${era.label} (${era.startYear}–${formatYear(era.endYear)})`}
                  />

                  {/* Year labels */}
                  <span className="absolute -bottom-6 left-0 text-xs text-gray-500 font-mono">
                    {era.startYear}
                  </span>
                  {i === eras.length - 1 && (
                    <span className="absolute -bottom-6 right-0 text-xs text-gray-500 font-mono">
                      {formatYear(era.endYear)}
                    </span>
                  )}

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 min-w-[160px]">
                    <div className="bg-[var(--psp-navy)] text-white text-xs rounded-lg px-3 py-2 shadow-lg">
                      <p className="font-bold">{era.label}</p>
                      <p className="text-white/70">{era.school}</p>
                      <p className="text-white/50 font-mono">{era.startYear}–{formatYear(era.endYear)}</p>
                      {era.milestones.map((m, mi) => (
                        <p key={mi} className="text-[var(--psp-gold)] text-xs mt-1">
                          {m.year}: {m.text}
                        </p>
                      ))}
                    </div>
                    {/* Arrow */}
                    <div className="w-2 h-2 bg-[var(--psp-navy)] rotate-45 mx-auto -mt-1" />
                  </div>

                  {/* Milestone markers */}
                  {era.milestones.map((m, mi) => (
                    <div
                      key={mi}
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full border-2 shadow-sm"
                      style={{
                        borderColor: era.color,
                        left: `${Math.min(90, ((m.year - era.startYear) / Math.max(span, 1)) * 100)}%`,
                      }}
                      title={`${m.year}: ${m.text}`}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-10 pt-2 border-t border-gray-100">
            {eras
              .filter((e, i, arr) => arr.findIndex((x) => x.kind === e.kind) === i)
              .map((era) => (
                <div key={era.kind} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: era.color }} />
                  <span className="capitalize">{era.kind}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
