import Link from "next/link";
import type { SchoolRecord } from "@/lib/data/school-hub";

interface SchoolRecordsSectionProps {
  records: SchoolRecord[];
}

export default function SchoolRecordsSection({ records }: SchoolRecordsSectionProps) {
  if (!records || records.length === 0) return null;

  // Group by sport_name then category
  const bySport = new Map<string, Map<string, SchoolRecord[]>>();

  records.forEach((r) => {
    const sportKey = r.sport_name || "General";
    if (!bySport.has(sportKey)) bySport.set(sportKey, new Map());
    const sportMap = bySport.get(sportKey)!;
    const catKey = r.category || "Other";
    if (!sportMap.has(catKey)) sportMap.set(catKey, []);
    sportMap.get(catKey)!.push(r);
  });

  return (
    <section>
      <h2
        className="psp-h2 mb-4"
        style={{ color: "var(--psp-navy)" }}
      >
        School Records ({records.length})
      </h2>

      <div className="space-y-6">
        {Array.from(bySport.entries()).map(([sportName, categoryMap]) => (
          <div key={sportName}>
            <h3
              className="text-sm font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--psp-navy)" }}
            >
              {sportName}
            </h3>

            {Array.from(categoryMap.entries()).map(([category, catRecords]) => (
              <div key={category} className="mb-4">
                <h4
                  className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: "var(--psp-gray-400)" }}
                >
                  {category}
                </h4>

                <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table aria-label={`${sportName} ${category} records`} className="data-table">
                      <thead>
                        <tr>
                          <th>Record</th>
                          <th className="text-right">Value</th>
                          <th>Holder</th>
                          <th className="text-center">Year</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catRecords.map((record) => {
                          const sportSlug =
                            record.sport_name?.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-") ||
                            "football";

                          return (
                            <tr key={record.id}>
                              <td className="text-sm">{record.description || record.subcategory || "--"}</td>
                              <td className="text-right">
                                <span
                                  className="font-bold tabular-nums"
                                  style={{ color: "var(--psp-navy)" }}
                                >
                                  {record.record_value || (record.record_number != null ? record.record_number : "--")}
                                </span>
                              </td>
                              <td>
                                {record.player_slug ? (
                                  <Link
                                    href={`/${sportSlug}/players/${record.player_slug}`}
                                    className="text-sm font-medium hover:underline"
                                    style={{ color: "var(--psp-blue)" }}
                                  >
                                    {record.player_name || record.holder_name || "--"}
                                  </Link>
                                ) : (
                                  <span className="text-sm">
                                    {record.player_name || record.holder_name || "--"}
                                  </span>
                                )}
                              </td>
                              <td className="text-center text-sm tabular-nums">
                                {record.year_set || "--"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
