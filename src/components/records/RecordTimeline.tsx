import Link from "next/link";

interface RecordEntry {
  id?: number;
  category: string;
  record_value?: string | null;
  record_number?: number | null;
  holder_name?: string | null;
  holder_school?: string | null;
  year_set?: number | null;
  player_name?: string | null;
  player_slug?: string | null;
  school_name?: string | null;
  school_slug?: string | null;
  description?: string | null;
}

interface RecordTimelineProps {
  records: RecordEntry[];
  sport: string;
  limit?: number;
}

/**
 * RecordTimeline Component
 * Displays longest-held records with "Held for X years" badges.
 * Highlights legendary records (held 20+ years) with gold styling.
 */
export default function RecordTimeline({
  records,
  sport,
  limit = 10,
}: RecordTimelineProps) {
  const currentYear = new Date().getFullYear();

  // Calculate years held and sort by duration (longest first)
  const recordsWithDuration = records
    .filter((r) => r.year_set && r.holder_name)
    .map((r) => {
      const yearsHeld = currentYear - (r.year_set || currentYear);
      return { ...r, yearsHeld };
    })
    .sort((a, b) => (b.yearsHeld || 0) - (a.yearsHeld || 0))
    .slice(0, limit);

  if (recordsWithDuration.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2
          className="psp-h2 mb-2"
          style={{ color: "var(--psp-navy)" }}
        >
          📅 Longest-Held Records
        </h2>
        <p className="text-sm text-gray-600">
          These records have stood the test of time
        </p>
      </div>

      <div className="space-y-3">
        {recordsWithDuration.map((record, idx) => {
          const isLegendary = (record.yearsHeld || 0) >= 20;
          const bgClass = isLegendary ? "bg-amber-50 border-gold" : "bg-white border-gray-200";
          const nameClass = isLegendary ? "text-amber-900" : "text-navy";
          const holderLink = record.player_slug
            ? `/${sport}/players/${record.player_slug}`
            : record.school_slug
              ? `/${sport}/schools/${record.school_slug}`
              : null;

          return (
            <div
              key={record.id || idx}
              className={`rounded-lg border p-4 transition-all hover:shadow-md ${bgClass}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                    <p className={`text-sm font-bold ${nameClass}`}>
                      {record.record_value || record.category}
                    </p>
                    {isLegendary && (
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
                      >
                        🏆 Legendary
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {holderLink ? (
                      <Link
                        href={holderLink}
                        className="text-sm font-semibold hover:underline"
                        style={{ color: "var(--psp-gold)" }}
                      >
                        {record.player_name || record.holder_name}
                      </Link>
                    ) : (
                      <span className="text-sm font-semibold" style={{ color: "var(--psp-navy)" }}>
                        {record.player_name || record.holder_name}
                      </span>
                    )}

                    {(record.school_name || record.holder_school) && (
                      <>
                        <span className="text-gray-400">•</span>
                        {record.school_slug ? (
                          <Link
                            href={`/${sport}/schools/${record.school_slug}`}
                            className="text-sm hover:underline"
                            style={{ color: "var(--psp-blue)" }}
                          >
                            {record.school_name || record.holder_school}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-600">
                            {record.school_name || record.holder_school}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {record.description && (
                    <p className="text-xs text-gray-500 mt-2">{record.description}</p>
                  )}
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="psp-h2" style={{ color: "var(--psp-gold)" }}>
                    {record.yearsHeld}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    years held
                  </div>
                  {record.year_set && (
                    <div className="text-xs text-gray-400 mt-2">
                      Set in {record.year_set}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
