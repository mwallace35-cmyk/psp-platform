import Link from "next/link";
import { NextGame } from "@/lib/data/team-page";
import { School } from "@/lib/data";

interface NextGameWidgetProps {
  nextGame: NextGame | null;
  school: School;
  sport: string;
}

export function NextGameWidget({
  nextGame,
  school,
  sport,
}: NextGameWidgetProps) {
  if (!nextGame) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-600">
          Next Game
        </h3>
        <div className="text-center py-6">
          <p className="text-sm text-gray-600">
            No upcoming games scheduled
          </p>
        </div>
      </div>
    );
  }

  const gameDate = new Date(nextGame.date);
  const isHomeGame = nextGame.home_team_id === school.id;
  const opponent = isHomeGame ? nextGame.away_team : nextGame.home_team;

  // Format date nicely
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="bg-white rounded-xl border border-blue-200 p-6 border-l-4" style={{ borderLeftColor: "var(--psp-gold)" }}>
      <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-600">
        Next Game
      </h3>

      <div className="space-y-4">
        {/* Date & Time */}
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {dateFormatter.format(gameDate)}
          </div>
          {nextGame.time && (
            <div className="text-sm text-gray-600 mt-1">
              {nextGame.time}
            </div>
          )}
        </div>

        {/* Opponent */}
        {opponent && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-semibold text-gray-600 uppercase mb-1">
              {isHomeGame ? "Home vs" : "Away at"}
            </div>
            <Link
              href={`/${sport}/teams/${opponent.slug}`}
              className="text-lg font-bold text-[var(--psp-navy)] hover:text-[var(--psp-gold)] transition-colors"
            >
              {opponent.name}
            </Link>
          </div>
        )}

        {/* Box Score Link */}
        {nextGame.final_score && nextGame.points_home !== null && nextGame.points_away !== null && (
          <div className="pt-3 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-600 mb-2">Final Score</div>
            <div className="text-2xl font-bold text-gray-900">
              {isHomeGame ? nextGame.points_home : nextGame.points_away}-
              {isHomeGame ? nextGame.points_away : nextGame.points_home}
            </div>
            <Link
              href={`/${sport}/games/${nextGame.id}`}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 mt-2 inline-block"
            >
              View Box Score →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
