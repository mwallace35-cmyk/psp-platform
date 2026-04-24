import Link from "next/link";
import type { Legend } from "@/lib/data/legends";
import { SPORT_EMOJIS, SPORT_LABELS, SPORT_ACCENT_COLORS } from "@/lib/data/legends";
import Badge from "@/components/ui/Badge";
import { Trophy } from "lucide-react";

interface LegendCardProps {
  legend: Legend;
}

export default function LegendCard({ legend }: LegendCardProps) {
  const isMemoriam = legend.category === "in-memoriam";
  const accent = SPORT_ACCENT_COLORS[legend.sport] ?? "#f0a500";
  const initials = legend.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const totalWins = legend.stints?.reduce(
    (sum, s) => sum + (s.overallRecord?.wins ?? 0),
    0
  );
  const totalChampionships = legend.stints?.reduce(
    (sum, s) => sum + (s.championships?.length ?? 0),
    0
  );

  return (
    <Link href={`/hof/legends/${legend.slug}`} className="block group">
      <div className="rounded-xl border border-white/10 bg-[var(--psp-navy-mid)] shadow-sm p-5 transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5 group-hover:border-[var(--psp-gold)]/40">
        <div className="flex items-start gap-4">
          {/* Photo or Initials (sport-colored) */}
          {legend.photoUrl ? (
            <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-[var(--psp-gold)]/30">
              <img
                src={legend.photoUrl}
                alt={legend.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold text-white"
              style={{ background: accent }}
            >
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Name */}
            <h3 className="font-heading text-lg text-white leading-tight group-hover:text-[var(--psp-gold)] transition-colors">
              {legend.name}
            </h3>

            {/* Role + Sport */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-white/70">
                {legend.role}
              </span>
              <Badge variant="sport">
                {SPORT_EMOJIS[legend.sport]} {SPORT_LABELS[legend.sport]}
              </Badge>
            </div>

            {/* Schools */}
            <p className="text-sm text-white/60 mt-1">
              {legend.schools.join(" · ")}
              {legend.careerSpan && (
                <span className="text-white/40">
                  {" "}
                  ({legend.careerSpan})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-sm text-white/70 mt-3 line-clamp-2">
          {legend.excerpt}
        </p>

        {/* Stats row for coaches */}
        {legend.category === "coach" && (totalWins || totalChampionships) ? (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
            {totalWins ? (
              <span className="text-xs font-semibold text-white">
                {totalWins} Wins
              </span>
            ) : null}
            {totalChampionships ? (
              <span className="text-xs font-semibold text-[var(--psp-gold)]">
                <Trophy className="w-4 h-4 inline" /> {totalChampionships} Title
                {totalChampionships > 1 ? "s" : ""}
              </span>
            ) : null}
          </div>
        ) : null}

        {/* Memorial marker */}
        {isMemoriam && legend.died && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/10">
            <span className="text-xs text-white/60 italic">
              In Memoriam · {legend.died}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
