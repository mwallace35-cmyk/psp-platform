import React from "react";
import Link from "next/link";
import { parseProLeague, type ProPlayer } from "@/lib/data/pro-players";

interface ProPlayerCardProps {
  player: ProPlayer;
  sportId?: string;
}

export default function ProPlayerCard({
  player,
  sportId = "football",
}: ProPlayerCardProps) {
  const positions = (player.positions ?? []).filter(
    (p) => !["Football", "Basketball", "Baseball"].includes(p)
  );
  const proLeague = parseProLeague(player.pro_team, player.pro_league);

  // Infer sport if not provided
  let sport = sportId;
  if (!sportId || sportId === "all") {
    const allPositions = player.positions ?? [];
    if (
      allPositions.some((p) =>
        ["Football", "QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB"].includes(
          p
        )
      )
    ) {
      sport = "football";
    } else if (
      allPositions.some((p) => ["Basketball", "G", "F", "C"].includes(p))
    ) {
      sport = "basketball";
    } else if (
      allPositions.some((p) => ["Baseball", "P", "C", "IF", "OF"].includes(p))
    ) {
      sport = "baseball";
    }
  }

  return (
    <Link href={`/${sport}/players/${player.slug}`}>
      <div className="h-full bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-gold transition-all cursor-pointer">
        {/* Pro Badge */}
        {proLeague && (
          <div className="inline-block mb-3">
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${
                proLeague === "NFL"
                  ? "bg-blue-100 text-blue-800"
                  : proLeague === "NBA"
                  ? "bg-orange-100 text-orange-800"
                  : proLeague === "MLB"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {proLeague}
            </span>
          </div>
        )}

        {/* Name */}
        <h3 className="text-lg font-bold text-navy mb-1 line-clamp-2">
          {player.name}
        </h3>

        {/* School */}
        <p className="text-sm text-gray-600 mb-3">
          {player.school_name || player.schools?.name || "Unknown School"}
        </p>

        {/* Positions */}
        {positions.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {positions.slice(0, 3).map((pos) => (
              <span
                key={pos}
                className="text-xs bg-blue-50 text-psp-blue px-2 py-1 rounded"
              >
                {pos}
              </span>
            ))}
          </div>
        )}

        {/* Pro Info */}
        <div className="space-y-2 border-t border-gray-200 pt-3">
          {player.pro_team && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Pro Team
              </p>
              <p className="text-sm font-semibold text-navy line-clamp-2">
                {player.pro_team}
              </p>
            </div>
          )}

          {player.pro_draft_info && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Draft Info
              </p>
              <p className="text-sm text-gray-700 line-clamp-2">
                {player.pro_draft_info}
              </p>
            </div>
          )}

          {player.college && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                College
              </p>
              <p className="text-sm text-gray-700">{player.college}</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs font-semibold text-psp-blue hover:text-blue-700 transition-colors">
            View HS Career →
          </p>
        </div>
      </div>
    </Link>
  );
}
