import Link from "next/link";
import { MapPin } from "lucide-react";
import { EventTypePill } from "./EventTypeIcon";
import type { CommunityEvent } from "@/lib/data/community-events";

function formatDateParts(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate().toString(),
    dow: date.toLocaleDateString("en-US", { weekday: "short" }),
  };
}

export default function FeaturedEvents({
  events,
}: {
  events: CommunityEvent[];
}) {
  if (!events.length) return null;

  return (
    <section className="px-4 pb-6" style={{ background: "var(--psp-navy)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "var(--psp-gold)" }}
          />
          <span
            className="text-[0.7rem] font-bold tracking-widest uppercase"
            style={{ color: "var(--psp-gold)" }}
          >
            Featured Events
          </span>
        </div>
        <div
          className="flex gap-4 overflow-x-auto pb-2"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
          }}
        >
          {events.map((event) => {
            const date = formatDateParts(event.start_date);
            return (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="flex-shrink-0 w-80 flex gap-4 rounded-lg p-4 border transition hover:border-[var(--psp-gold)] hover:-translate-y-0.5"
                style={{
                  background: "var(--psp-navy-mid)",
                  borderColor: "rgba(255,255,255,0.06)",
                  scrollSnapAlign: "start",
                }}
              >
                <div
                  className="flex-shrink-0 w-14 text-center rounded-lg py-2 px-1"
                  style={{
                    background: "rgba(240,165,0,0.08)",
                    borderTop: "3px solid var(--psp-gold)",
                  }}
                >
                  <span
                    className="block text-[0.6rem] font-bold tracking-wider uppercase"
                    style={{ color: "var(--psp-gold)" }}
                  >
                    {date.month}
                  </span>
                  <span
                    className="block text-white text-3xl leading-tight"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {date.day}
                  </span>
                  <span className="block text-[0.6rem] text-gray-400 font-medium">
                    {date.dow}
                  </span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <EventTypePill type={event.event_type} size="sm" />
                  <h3 className="text-white text-sm font-bold leading-snug line-clamp-2">
                    {event.title}
                  </h3>
                  {event.location_name && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin size={11} />
                      {event.location_name}
                    </span>
                  )}
                  {event.is_free ? (
                    <span className="text-[0.6rem] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded w-fit tracking-wide">
                      FREE
                    </span>
                  ) : event.cost_info ? (
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--psp-gold)" }}
                    >
                      {event.cost_info}
                    </span>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
