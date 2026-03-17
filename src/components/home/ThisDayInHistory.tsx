"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface HistoryEvent {
  year: number;
  description: string;
  type: "game" | "championship" | "award";
  link?: string;
  score?: string;
}

export default function ThisDayInHistory() {
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        // Get today's month and day
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        // Fetch events for this day from the API
        const response = await fetch(
          `/api/this-day-in-history?month=${month}&day=${day}`
        );

        if (response.ok) {
          const data = await response.json();
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error("Failed to load history events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-300 rounded mb-4 w-1/3"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
        <h3 className="font-bold text-lg mb-2">This Day in Philly Sports</h3>
        <p className="text-gray-600 text-sm">
          No memorable events found for today. Check back tomorrow!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📅</span>
        <h3
          className="font-bold text-lg"
          style={{ color: "var(--psp-navy)" }}
        >
          This Day in Philly Sports History
        </h3>
      </div>

      <div className="space-y-4">
        {events.map((event, idx) => (
          <div key={idx} className="pb-4 border-b last:border-b-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--psp-gold)" }}
                >
                  {event.year}
                </p>
                <p className="text-gray-900 font-semibold text-sm mb-1">
                  {event.description}
                </p>
                {event.score && (
                  <p className="text-xs text-gray-500">Score: {event.score}</p>
                )}
              </div>
              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-semibold">
                {event.type === "game"
                  ? "Game"
                  : event.type === "championship"
                    ? "Championship"
                    : "Award"}
              </span>
            </div>

            {event.link && (
              <Link
                href={event.link}
                className="text-blue-600 hover:underline text-xs mt-2 inline-block"
              >
                Read More →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
