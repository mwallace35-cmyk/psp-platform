import type { CoachingStint } from "@/lib/data/legends";

interface CoachingRecordTableProps {
  stints: CoachingStint[];
}

export default function CoachingRecordTable({ stints }: CoachingRecordTableProps) {
  if (!stints.length) return null;

  return (
    <div className="space-y-6">
      {stints.map((stint, i) => (
        <div key={i}>
          <h4 className="font-heading text-sm uppercase tracking-wider text-[var(--psp-gold)] mb-2">
            {stint.school}
            <span className="text-[var(--psp-gray-400)] font-body normal-case ml-1.5 text-xs">
              {stint.startYear}–{stint.endYear ?? "Present"}
            </span>
          </h4>

          {stint.overallRecord && (
            <div className="flex items-center gap-3 mb-2 text-xs">
              <span className="font-bold text-[var(--psp-navy)]">
                {stint.overallRecord.wins}-{stint.overallRecord.losses}
                {stint.overallRecord.ties ? `-${stint.overallRecord.ties}` : ""}
              </span>
              <span className="text-[var(--psp-gray-500)]">
                (
                {(
                  (stint.overallRecord.wins /
                    (stint.overallRecord.wins +
                      stint.overallRecord.losses +
                      (stint.overallRecord.ties ?? 0))) *
                  100
                ).toFixed(1)}
                %)
              </span>
            </div>
          )}

          {stint.seasons && stint.seasons.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--psp-gray-200)]">
                    <th className="text-left py-1 pr-2 font-semibold text-[var(--psp-gray-500)]">
                      Season
                    </th>
                    <th className="text-center py-1 px-1 font-semibold text-[var(--psp-gray-500)]">
                      W
                    </th>
                    <th className="text-center py-1 px-1 font-semibold text-[var(--psp-gray-500)]">
                      L
                    </th>
                    {stint.seasons.some((s) => s.ties !== undefined) && (
                      <th className="text-center py-1 px-1 font-semibold text-[var(--psp-gray-500)]">
                        T
                      </th>
                    )}
                    <th className="text-left py-1 pl-2 font-semibold text-[var(--psp-gray-500)]">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stint.seasons.map((s, j) => {
                    const isChampionship = s.notes
                      ?.toLowerCase()
                      .includes("champion");
                    return (
                      <tr
                        key={j}
                        className={`border-b border-[var(--psp-gray-100)] ${
                          isChampionship
                            ? "bg-[var(--psp-gold)]/5 font-semibold"
                            : ""
                        }`}
                      >
                        <td className="py-1 pr-2 text-[var(--psp-gray-700)]">
                          {s.season}
                        </td>
                        <td className="py-1 px-1 text-center text-[var(--psp-navy)]">
                          {s.wins}
                        </td>
                        <td className="py-1 px-1 text-center text-[var(--psp-gray-600)]">
                          {s.losses}
                        </td>
                        {stint.seasons!.some((ss) => ss.ties !== undefined) && (
                          <td className="py-1 px-1 text-center text-[var(--psp-gray-600)]">
                            {s.ties ?? ""}
                          </td>
                        )}
                        <td className="py-1 pl-2 text-[var(--psp-gold)] text-[11px]">
                          {isChampionship && "🏆 "}
                          {s.notes ?? ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
