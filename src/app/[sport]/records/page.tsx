import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidSport, SPORT_META, getRecordsBySport } from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 86400;

type PageParams = { sport: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { sport } = await params;
  if (!isValidSport(sport)) return {};
  return {
    title: `Records — ${SPORT_META[sport].name} — PhillySportsPack`,
    description: `All-time records in Philadelphia high school ${SPORT_META[sport].name.toLowerCase()}.`,
  };
}

export default async function RecordsPage({ params }: { params: Promise<PageParams> }) {
  const { sport } = await params;
  if (!isValidSport(sport)) notFound();

  const meta = SPORT_META[sport];
  const records = await getRecordsBySport(sport);

  // Group records by category
  const grouped: Record<string, any[]> = {};
  for (const rec of records) {
    const cat = rec.category || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(rec);
  }

  return (
    <>
      <section className="py-10" style={{ background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href={`/${sport}`} className="hover:text-white transition-colors">{meta.name}</Link>
            <span>/</span>
            <span className="text-white">Records</span>
          </div>
          <h1 className="text-4xl md:text-5xl text-white tracking-wider" style={{ fontFamily: "Bebas Neue, sans-serif" }}>
            {meta.name} Records
          </h1>
          <p className="text-sm text-gray-400 mt-2">All-time records and milestones</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {Object.keys(grouped).length > 0 ? (
          Object.entries(grouped).map(([category, recs]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Bebas Neue, sans-serif" }}>
                {category}
              </h2>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Record</th>
                      <th className="text-right">Value</th>
                      <th>Player</th>
                      <th>School</th>
                      <th>Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recs.map((rec: any) => (
                      <tr key={rec.id}>
                        <td className="font-medium" style={{ color: "var(--psp-navy)" }}>
                          {rec.subcategory || rec.description || "—"}
                        </td>
                        <td className="text-right font-bold" style={{ color: "var(--psp-gold)" }}>
                          {rec.record_value}
                        </td>
                        <td className="text-sm">
                          {rec.players ? (
                            <Link href={`/${sport}/players/${rec.players.slug}`} className="hover:underline" style={{ color: "var(--psp-navy)" }}>
                              {rec.players.name}
                            </Link>
                          ) : rec.holder_name || "—"}
                        </td>
                        <td className="text-sm">
                          {rec.schools ? (
                            <Link href={`/${sport}/schools/${rec.schools.slug}`} className="hover:underline" style={{ color: "var(--psp-gray-500)" }}>
                              {rec.schools.name}
                            </Link>
                          ) : rec.holder_school || "—"}
                        </td>
                        <td className="text-sm" style={{ color: "var(--psp-gray-400)" }}>
                          {rec.seasons?.label || rec.year_set || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16" style={{ color: "var(--psp-gray-400)" }}>
            <div className="text-4xl mb-4">🏅</div>
            <h3 className="text-lg font-medium mb-2" style={{ color: "var(--psp-navy)" }}>No records data yet</h3>
            <p className="text-sm">Records are being compiled.</p>
          </div>
        )}
      </div>
    </>
  );
}
