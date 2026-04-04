export const dynamic = "force-dynamic";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminEventsPage() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("community_events")
    .select("id, slug, title, event_type, start_date, status, is_featured, sport_id")
    .is("deleted_at", null)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("[Admin Events] Error:", error.message);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--psp-navy)" }}>Community Events</h1>
          <p className="text-sm text-gray-500 mt-1">{events?.length || 0} events total</p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition hover:opacity-90"
          style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
        >
          + New Event
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200" style={{ background: "var(--psp-gray-50, #f8fafc)" }}>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Event</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Featured</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events && events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <Link href={`/events/${event.slug}`} className="font-medium hover:underline" style={{ color: "var(--psp-navy)" }}>
                      {event.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {event.event_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(event.start_date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      event.status === "published"
                        ? "bg-green-50 text-green-700"
                        : event.status === "cancelled"
                        ? "bg-red-50 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {event.is_featured && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: "rgba(240,165,0,0.1)", color: "var(--psp-gold-text, #b87900)" }}>
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="text-xs font-semibold px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 transition"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No events yet.{" "}
                  <Link href="/admin/events/new" className="font-medium" style={{ color: "var(--psp-gold-text)" }}>
                    Create the first one
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
