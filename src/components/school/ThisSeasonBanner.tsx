import { SPORT_META, type SportId } from "@/lib/sports";
import type { CurrentSeasonInfo } from "@/lib/data/school-hub";
import SportIcon from "@/components/ui/SportIcon";

interface ThisSeasonBannerProps {
  seasons: CurrentSeasonInfo[];
  schoolSlug: string;
}

export default function ThisSeasonBanner({ seasons, schoolSlug }: ThisSeasonBannerProps) {
  if (!seasons || seasons.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
      {/* Header */}
      <div
        className="px-4 py-2.5 flex items-center gap-2"
        style={{ background: "var(--psp-navy)" }}
      >
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          This Season
        </h3>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {seasons.map((season) => {
          const meta = SPORT_META[season.sport_id as SportId];
          const emoji = meta?.emoji || "soccer";
          const sportName = season.sport_name || meta?.name || season.sport_id;

          return (
            <div
              key={season.sport_id}
              className="flex items-center gap-3 px-4 py-3"
            >
              {/* Sport */}
              <span className="text-lg flex-shrink-0">{emoji}</span>
              <span
                className="text-sm font-medium flex-1 min-w-0 truncate"
                style={{ color: "var(--psp-navy)" }}
              >
                {sportName}
              </span>

              {/* Record */}
              <span
                className="text-sm font-bold tabular-nums flex-shrink-0"
                style={{ color: "var(--psp-navy)" }}
              >
                {season.wins}-{season.losses}
                {season.ties > 0 ? `-${season.ties}` : ""}
              </span>

              {/* Next game or season status */}
              <span className="text-xs text-gray-400 flex-shrink-0 hidden sm:inline">
                {season.next_game ? (
                  <>
                    Next: {season.next_game.is_home ? "vs" : "@"}{" "}
                    {season.next_game.opponent_name} &mdash;{" "}
                    {new Date(season.next_game.game_date + "T12:00:00").toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" }
                    )}
                  </>
                ) : (
                  "Season Complete"
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
