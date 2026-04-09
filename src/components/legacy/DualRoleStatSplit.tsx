import type { DualStats } from "@/lib/data/legacy";

interface Props {
  stats: DualStats;
  sportAccent?: string;
}

export default function DualRoleStatSplit({ stats, sportAccent = "#16a34a" }: Props) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-2xl font-['Bebas_Neue'] text-[var(--psp-navy)] mb-6">Career Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* As Player */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div
            className="inline-block text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full text-white mb-4"
            style={{ backgroundColor: "#f0a500" }}
          >
            As Player
          </div>
          {stats.asPlayer ? (
            <div className="space-y-3">
              <div className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Career Span</span>
                <span className="font-semibold text-[var(--psp-navy)]">{stats.asPlayer.careerSpan}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">School</span>
                <span className="font-semibold text-[var(--psp-navy)]">
                  {stats.asPlayer.schools.join(", ")}
                </span>
              </div>
              <div className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Sport</span>
                <span className="font-semibold text-[var(--psp-navy)] capitalize">{stats.asPlayer.sport}</span>
              </div>
              {stats.asPlayer.highlights.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Highlights</p>
                  <ul className="space-y-1">
                    {stats.asPlayer.highlights.slice(0, 5).map((h, i) => (
                      <li key={i} className="text-sm text-gray-700 flex gap-2 items-start">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--psp-gold)] flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">No player stats on record.</p>
          )}
        </div>

        {/* As Coach */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div
            className="inline-block text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full text-white mb-4"
            style={{ backgroundColor: "#0f2040" }}
          >
            As Coach
          </div>
          {stats.asCoach ? (
            <div className="space-y-3">
              <div className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Career Span</span>
                <span className="font-semibold text-[var(--psp-navy)]">{stats.asCoach.careerSpan}</span>
              </div>
              <div className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                <span className="text-sm text-gray-500">Overall Record</span>
                <span className="font-semibold text-[var(--psp-navy)]">
                  {stats.asCoach.totalWins}-{stats.asCoach.totalLosses}
                  {stats.asCoach.totalTies > 0 ? `-${stats.asCoach.totalTies}` : ""}
                </span>
              </div>
              {stats.asCoach.championships > 0 && (
                <div className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Championships</span>
                  <span className="font-semibold text-[var(--psp-gold)]">
                    {stats.asCoach.championships}
                  </span>
                </div>
              )}
              {/* Stints breakdown */}
              {stats.asCoach.stints.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Stints</p>
                  <ul className="space-y-1">
                    {stats.asCoach.stints.map((s) => (
                      <li key={s.id} className="text-sm text-gray-700 flex justify-between">
                        <span>
                          {s.school_name}{" "}
                          <span className="text-gray-400 text-xs">
                            ({s.start_year}–{s.end_year ?? "present"})
                          </span>
                        </span>
                        {(s.record_wins + s.record_losses) > 0 && (
                          <span className="font-mono text-xs text-gray-500">
                            {s.record_wins}-{s.record_losses}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic">No coaching record on file.</p>
          )}
        </div>
      </div>
    </section>
  );
}
