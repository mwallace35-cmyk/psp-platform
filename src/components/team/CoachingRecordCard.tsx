import Link from "next/link";
import { getCoachRecord } from "@/lib/data/coaching";
import { SPORT_META } from "@/lib/sports";

interface CoachingRecordCardProps {
  schoolId: number;
  sportId: string;
  schoolName: string;
}

export default async function CoachingRecordCard({
  schoolId,
  sportId,
  schoolName,
}: CoachingRecordCardProps) {
  const record = await getCoachRecord(schoolId, sportId);

  if (!record) return null;

  const sportMeta = SPORT_META[sportId as keyof typeof SPORT_META];
  const sportColor = sportMeta?.color ?? "#3b82f6";

  const schoolTotal = record.school_wins + record.school_losses + record.school_ties;
  const schoolWinPct = schoolTotal > 0 ? record.school_wins / schoolTotal : 0;
  const careerTotal = record.career_wins + record.career_losses + record.career_ties;
  const careerWinPct = careerTotal > 0 ? record.career_wins / careerTotal : 0;

  const currentYear = new Date().getFullYear();
  const yearsAtSchool = currentYear - record.start_year + 1;

  // Gold for winning record (>.500), otherwise gray
  const schoolRecordColor = schoolWinPct > 0.5 ? "var(--psp-gold)" : "#9ca3af";
  const careerRecordColor = careerWinPct > 0.5 ? "var(--psp-gold)" : "#9ca3af";

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "var(--psp-navy)",
        borderColor: sportColor,
        borderWidth: "1px",
      }}
    >
      {/* Sport-colored accent bar */}
      <div
        className="h-1"
        style={{ backgroundColor: sportColor }}
      />

      <div className="px-4 py-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-300">
            Head Coach
          </h4>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${sportColor}20`, color: sportColor }}
          >
            {yearsAtSchool} {yearsAtSchool === 1 ? "yr" : "yrs"}
          </span>
        </div>

        {/* Coach name */}
        <p className="text-white font-bold text-lg font-heading leading-tight mb-2">
          {record.coach_name}
        </p>

        {/* Records */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* School record */}
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
              At {schoolName.length > 15 ? schoolName.slice(0, 15) + "..." : schoolName}
            </p>
            <p className="text-sm font-bold" style={{ color: schoolRecordColor }}>
              {record.school_wins}-{record.school_losses}
              {record.school_ties > 0 ? `-${record.school_ties}` : ""}
            </p>
          </div>

          {/* Career record */}
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">
              Career
            </p>
            <p className="text-sm font-bold" style={{ color: careerRecordColor }}>
              {record.career_wins}-{record.career_losses}
              {record.career_ties > 0 ? `-${record.career_ties}` : ""}
            </p>
          </div>
        </div>

        {/* Championships */}
        {record.school_championships > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Championships:</span>
            <span className="text-xs font-bold text-[var(--psp-gold)]">
              {record.school_championships}
            </span>
          </div>
        )}

        {/* Link to coaches page */}
        <Link
          href="/coaches"
          className="text-xs font-semibold uppercase tracking-wider hover:underline transition-colors"
          style={{ color: sportColor }}
        >
          All Coaches &rarr;
        </Link>
      </div>
    </div>
  );
}
