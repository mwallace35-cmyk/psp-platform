import type { Stint } from "@/content/legends-schema";

interface Props {
  stints: Stint[];
}

function formatRecord(r: Stint["overallRecord"]) {
  if (!r) return null;
  return r.ties && r.ties > 0
    ? `${r.wins}-${r.losses}-${r.ties}`
    : `${r.wins}-${r.losses}`;
}

function formatYears(s: Stint) {
  return s.endYear == null ? `${s.startYear}–present` : `${s.startYear}–${s.endYear}`;
}

/**
 * Multi-stint coaching ledger. Renders one card per stint with school,
 * year span, overall record, championship counts (league/city/state),
 * streak badge, and optional notes. Replaces the inline "The X-Year
 * Ledger" bullet lists in legacy MDX files.
 *
 * Renders nothing if no stints have any of the optional richer fields
 * AND no overall record — that way pages with bare stints don't get an
 * empty ledger card by accident.
 */
export default function CareerLedger({ stints }: Props) {
  if (!stints || stints.length === 0) return null;
  const hasContent = stints.some(
    (s) => s.overallRecord || s.titles || s.streak || (s.notes && s.notes.length),
  );
  if (!hasContent) return null;

  return (
    <div className="my-10 not-prose">
      <div className="space-y-3">
        {stints.map((s, i) => {
          const record = formatRecord(s.overallRecord);
          const t = s.titles;
          return (
            <div
              key={`${s.school}-${i}`}
              className="bg-white border-l-4 border-[var(--psp-gold)] rounded-r-lg p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
                <div className="font-heading text-lg text-[var(--psp-navy)]">
                  {s.school}
                </div>
                <div className="text-sm text-[var(--psp-gray-500)]">
                  {formatYears(s)} · {s.role}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                {record && (
                  <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider bg-[var(--psp-navy)] text-white px-2.5 py-1 rounded">
                    {record}
                  </span>
                )}
                {t?.league != null && t.league > 0 && (
                  <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider bg-[var(--psp-gold)] text-[var(--psp-navy)] px-2.5 py-1 rounded">
                    {t.league} League
                  </span>
                )}
                {t?.city != null && t.city > 0 && (
                  <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider bg-[var(--psp-gray-200)] text-[var(--psp-navy)] px-2.5 py-1 rounded">
                    {t.city} City
                  </span>
                )}
                {t?.state != null && t.state > 0 && (
                  <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider bg-[var(--psp-navy)] text-[var(--psp-gold)] px-2.5 py-1 rounded">
                    {t.state} State
                  </span>
                )}
                {s.streak && (
                  <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider border border-[var(--psp-gold)] text-[var(--psp-gold-text)] px-2.5 py-1 rounded">
                    {s.streak.games}-game {s.streak.type} streak ({s.streak.span})
                  </span>
                )}
              </div>

              {s.notes && s.notes.length > 0 && (
                <ul className="mt-3 space-y-1.5 text-sm text-[var(--psp-gray-700)]">
                  {s.notes.map((n, ni) => (
                    <li key={ni} className="flex items-start gap-2">
                      <span className="text-[var(--psp-gold)] mt-0.5 shrink-0">
                        ◆
                      </span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
