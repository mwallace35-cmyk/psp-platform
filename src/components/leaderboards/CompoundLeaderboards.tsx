import Link from "next/link";
import { SPORT_COLORS_HEX } from "@/lib/constants/sports";

interface CompoundLeaderEntry {
  player_name: string;
  player_slug?: string;
  school_name: string;
  school_slug?: string;
  value: number;
  components: Record<string, number>;
}

interface CompoundCategory {
  key: string;
  label: string;
  description: string;
  data: CompoundLeaderEntry[];
}

interface CompoundLeaderboardsProps {
  sport: string;
  categories: CompoundCategory[];
}

export default function CompoundLeaderboards({
  sport,
  categories,
}: CompoundLeaderboardsProps) {
  const sportColor = SPORT_COLORS_HEX[sport] || "#3b82f6";

  if (!categories || categories.every((c) => c.data.length === 0)) {
    return null;
  }

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h2
          className="psp-h2 text-white mb-2"
        >
          Combined Stat Leaders
        </h2>
        <p className="text-sm text-gray-300 mb-6">
          Multi-stat formulas that highlight the most versatile players this
          season
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            if (category.data.length === 0) return null;

            return (
              <div
                key={category.key}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, var(--psp-navy-mid) 0%, var(--psp-navy) 100%)",
                  border: "1px solid var(--psp-rule)",
                }}
              >
                {/* Category Header */}
                <div
                  className="px-4 py-3 border-b"
                  style={{ borderColor: "var(--psp-rule)" }}
                >
                  <h3
                    className="psp-h4 text-white"
                  >
                    {category.label}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {category.description}
                  </p>
                </div>

                {/* Leaderboard Rows */}
                <div className="divide-y divide-white/5">
                  {category.data.slice(0, 10).map((entry, idx) => {
                    const isFirst = idx === 0;
                    const isTopThree = idx < 3;

                    return (
                      <div
                        key={`${entry.player_name}-${idx}`}
                        className={`px-4 py-3 transition-colors ${
                          isFirst ? "bg-[var(--psp-navy-mid)]" : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Rank Badge */}
                          <div
                            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor: isFirst
                                ? "var(--psp-gold)"
                                : isTopThree
                                ? `${sportColor}30`
                                : "rgba(255,255,255,0.06)",
                              color: isFirst
                                ? "var(--psp-navy)"
                                : isTopThree
                                ? sportColor
                                : "var(--psp-text-cream-muted)",
                              border: isFirst
                                ? "none"
                                : isTopThree
                                ? `1px solid ${sportColor}50`
                                : "1px solid var(--psp-rule)",
                            }}
                          >
                            {idx + 1}
                          </div>

                          {/* Player Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                {entry.player_slug ? (
                                  <Link
                                    href={`/${sport}/players/${entry.player_slug}`}
                                    className="block font-semibold text-sm psp-cream hover:text-[var(--psp-gold)] transition truncate"
                                  >
                                    {entry.player_name}
                                  </Link>
                                ) : (
                                  <span className="block font-semibold text-sm psp-cream truncate">
                                    {entry.player_name}
                                  </span>
                                )}
                                {entry.school_slug ? (
                                  <Link
                                    href={`/${sport}/schools/${entry.school_slug}`}
                                    className="block mt-0.5 text-xs psp-cream-muted hover:text-[var(--psp-text-cream)] transition truncate"
                                  >
                                    {entry.school_name}
                                  </Link>
                                ) : (
                                  <span className="block mt-0.5 text-xs psp-cream-muted truncate">
                                    {entry.school_name}
                                  </span>
                                )}
                              </div>

                              {/* Combined Value */}
                              <div
                                className="text-right flex-shrink-0"
                                style={{
                                  color: isFirst ? "var(--psp-gold)" : sportColor,
                                }}
                              >
                                <span className="text-lg font-bold tabular-nums">
                                  {entry.value.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* Component Breakdown */}
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                              {Object.entries(entry.components).map(
                                ([label, val]) => (
                                  <span
                                    key={label}
                                    className="text-xs text-gray-400"
                                  >
                                    <span className="text-gray-300 tabular-nums">
                                      {typeof val === "number" && val % 1 !== 0
                                        ? val.toFixed(1)
                                        : val.toLocaleString()}
                                    </span>{" "}
                                    {label}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Empty State */}
                {category.data.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-gray-600">
                    No qualifying players yet this season
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
