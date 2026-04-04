import Link from "next/link";
import { MapPin, Clock, Users } from "lucide-react";
import { EventTypePill } from "./EventTypeIcon";
import { SPORT_META } from "@/lib/sports";
import type { CommunityEvent } from "@/lib/data/community-events";

function formatTime(time: string | null): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}

function formatDateParts(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate().toString(),
    dow: date.toLocaleDateString("en-US", { weekday: "short" }),
  };
}

export default function EventCard({ event }: { event: CommunityEvent }) {
  const date = formatDateParts(event.start_date);
  const timeStr = event.start_time
    ? event.end_time
      ? `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`
      : formatTime(event.start_time)
    : null;

  const sportMeta = event.sport_id
    ? SPORT_META[event.sport_id as keyof typeof SPORT_META]
    : null;

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden transition hover:border-[var(--psp-gold)] hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Date strip */}
      <div className="flex items-stretch border-b border-gray-100">
        <div
          className="flex-shrink-0 w-16 flex flex-col items-center justify-center py-2"
          style={{
            background: "var(--psp-navy)",
            borderRight: "3px solid var(--psp-gold)",
          }}
        >
          <span
            className="text-[0.55rem] font-bold tracking-wider uppercase"
            style={{ color: "var(--psp-gold)" }}
          >
            {date.month}
          </span>
          <span
            className="text-white text-2xl leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {date.day}
          </span>
          <span className="text-[0.55rem] text-gray-400 font-medium">
            {date.dow}
          </span>
        </div>
        <div className="flex-1 flex items-center justify-between px-3 py-2 gap-2 min-w-0">
          {timeStr && (
            <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <Clock size={12} className="text-gray-400" />
              {timeStr}
            </span>
          )}
          {sportMeta && (
            <span
              className="text-[0.6rem] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full whitespace-nowrap"
              style={{
                background: `${sportMeta.color || "var(--psp-blue)"}15`,
                color: sportMeta.color || "var(--psp-blue)",
              }}
            >
              {sportMeta.name}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <EventTypePill type={event.event_type} />
        <h3
          className="text-xl leading-tight line-clamp-2 transition group-hover:text-[var(--psp-gold-text)]"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            color: "var(--psp-navy)",
            letterSpacing: "0.01em",
          }}
        >
          {event.title}
        </h3>
        <div className="flex flex-col gap-1 text-sm text-gray-500">
          {event.location_name && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="flex-shrink-0 text-gray-400" />
              {event.location_name}
            </span>
          )}
          {event.organizer && (
            <span className="flex items-center gap-1.5">
              <Users size={14} className="flex-shrink-0 text-gray-400" />
              {event.organizer}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
        {event.is_free ? (
          <span className="text-[0.7rem] font-bold px-2 py-0.5 rounded bg-green-50 text-green-700 tracking-wide">
            FREE
          </span>
        ) : event.cost_info ? (
          <span
            className="text-[0.7rem] font-bold px-2 py-0.5 rounded"
            style={{
              background: "rgba(240,165,0,0.1)",
              color: "var(--psp-gold-text)",
            }}
          >
            {event.cost_info}
          </span>
        ) : (
          <span />
        )}
        <span
          className="text-xs font-semibold flex items-center gap-1 transition"
          style={{ color: "var(--psp-gold-text)" }}
        >
          {event.registration_url ? "Register" : "Details"}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
