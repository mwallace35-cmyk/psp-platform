import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui";
import PSPPromo from "@/components/ads/PSPPromo";
import { isValidSport, SPORT_META, getRecordsBySport } from "@/lib/data";
import RecordsTable from "./RecordsTable";
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

  // Transform for table display
  const groupedTableData: Record<string, any[]> = {};
  for (const [cat, recs] of Object.entries(grouped)) {
    groupedTableData[cat] = recs.map((rec: any) => ({
      id: rec.id,
      record: rec.subcategory || rec.description || "—",
      value: rec.record_value,
      playerName: rec.players?.name || rec.holder_name || "—",
      playerSlug: rec.players?.slug,
      schoolName: rec.schools?.name || rec.holder_school || "—",
      schoolSlug: rec.schools?.slug,
      year: rec.seasons?.label || rec.year_set || "—",
    }));
  }

  return (
    <>
      <section className="py-10" style={{ background: "linear-gradient(135deg, var(--psp-navy) 0%, var(--psp-navy-mid) 100%)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: meta.name, href: `/${sport}` }, { label: "Records" }]} />
          <h1 className="text-4xl md:text-5xl text-white tracking-wider mt-4" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
            {meta.name} Records
          </h1>
          <p className="text-sm text-gray-400 mt-2">All-time records and milestones</p>
        </div>
      </section>

      <PSPPromo size="banner" variant={2} />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {Object.keys(groupedTableData).length > 0 ? (
          Object.entries(groupedTableData).map(([category, rows], idx) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--psp-navy)", fontFamily: "Barlow Condensed, sans-serif" }}>
                {category}
              </h2>
              <RecordsTable sport={sport} data={rows} />
              {idx > 0 && idx % 3 === 0 && <PSPPromo size="banner" variant={4} />}
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
