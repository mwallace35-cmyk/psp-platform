"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SPORT_EMOJI } from "@/lib/sports";

interface OTDEvent {
  year: number;
  gameId: number;
  sport: string;
  homeTeam: string;
  homeSlug: string;
  awayTeam: string;
  awaySlug: string;
  homeScore: number;
  awayScore: number;
  margin: number;
  isUpset: boolean;
  link: string;
}

export default function ThisDayInHistory() {
  const [events, setEvents] = useState<OTDEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateLabel, setDateLabel] = useState("");

  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    setDateLabel(
      now.toLocaleDateString("en-US", { month: "long", day: "numeric" })
    );

    fetch(`/api/this-day-in-history?month=${month}&day=${day}`)
      .then((r) => (r.ok ? r.json() : { events: [] }))
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div
        className="rounded-xl p-5 animate-pulse"
        style={{ backgroundColor: "var(--psp-navy-mid, #0f2040)" }}
      >
        <div className="h-5 bg-white/10 rounded w-2/3 mb-4" />
        <div className="space-y-3">
          <div className="h-12 bg-white/5 rounded-lg" />
          <div className="h-12 bg-white/5 rounded-lg" />
        </div>
      </div>
    );
  }

  if (events.length === 0) return null;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: "var(--psp-navy-mid, #0f2040)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "linear-gradient(90deg, rgba(240,165,0,0.1) 0%, transparent 100%)",
        }}
      >
        <span className="text-lg">&#x1F4C5;</span>
        <div>
          <h3
            className="text-sm font-bold uppercase tracking-wider"
            style={{ color: "var(--psp-gold, #f0a500)", fontFamily: "var(--font-bebas)" }}
          >
            On This Day
          </h3>
          <p className="text-xs text-gray-400">{dateLabel}</p>
        </div>
      </div>

      {/* Events */}
      <div className="divide-y divide-white/5">
        {events.map((event) => {
          const emoji = SPORT_EMOJI[event.sport] || "";
          const homeWon = event.homeScore > event.awayScore;

          return (
            <Link
              key={event.gameId}
              href={event.link}
              className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors group"
            >
              {/* Year badge */}
              <div
                className="text-center flex-shrink-0 w-12"
              >
                <div
                  className="text-lg font-bold leading-none"
                  style={{ color: "var(--psp-gold)", fontFamily: "var(--font-bebas)" }}
                >
                  {event.year}
                </div>
                <div className="text-[10px] text-gray-500">{emoji}</div>
              </div>

              {/* Matchup */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-sm">
                  <span
                    className={`truncate ${!homeWon ? "font-bold text-white" : "text-gray-400"}`}
                  >
                    {event.awayTeam}
                  </span>
                  <span
                    className={`tabular-nums text-xs font-bold ${!homeWon ? "text-white" : "text-gray-500"}`}
                  >
                    {event.awayScore}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <span
                    className={`truncate ${homeWon ? "font-bold text-white" : "text-gray-400"}`}
                  >
                    {event.homeTeam}
                  </span>
                  <span
                    className={`tabular-nums text-xs font-bold ${homeWon ? "text-white" : "text-gray-500"}`}
                  >
                    {event.homeScore}
                  </span>
                </div>
              </div>

              {/* Close game badge */}
              {event.isUpset && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: "rgba(240,165,0,0.15)",
                    color: "var(--psp-gold)",
                  }}
                >
                  CLOSE
                </span>
              )}

              {/* Arrow */}
              <span className="text-gray-600 group-hover:text-gray-400 transition-colors text-xs flex-shrink-0">
                &#x203A;
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
