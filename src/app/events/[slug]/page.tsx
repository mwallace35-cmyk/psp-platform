import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, MapPin, Clock, Mail, Phone, User, ExternalLink, Globe } from "lucide-react";
import { EventTypePill } from "@/components/events/EventTypeIcon";
import EventCard from "@/components/events/EventCard";
import { getEventBySlug, getRelatedEvents } from "@/lib/data/community-events";
import { SPORT_META } from "@/lib/sports";

export const revalidate = 3600;

const BASE_URL = "https://phillysportspack.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatTime(time: string | null): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };

  const title = event.title;
  const description = event.description?.slice(0, 160) || `${event.title} - ${formatDate(event.start_date)}`;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: `${BASE_URL}/events/${slug}` },
    openGraph: {
      title: `${title} | PhillySportsPack.com`,
      description,
      url: `${BASE_URL}/events/${slug}`,
      siteName: "PhillySportsPack.com",
      type: "website",
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const related = await getRelatedEvents(event, 3);
  const sportMeta = event.sport_id ? SPORT_META[event.sport_id as keyof typeof SPORT_META] : null;

  const timeStr = event.start_time
    ? event.end_time
      ? `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`
      : formatTime(event.start_time)
    : null;

  const dateRange = event.end_date && event.end_date !== event.start_date
    ? `${formatDate(event.start_date)} - ${formatDate(event.end_date)}`
    : formatDate(event.start_date);

  // Schema.org Event structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.start_time ? `${event.start_date}T${event.start_time}` : event.start_date,
    ...(event.end_date ? { endDate: event.end_time ? `${event.end_date}T${event.end_time}` : event.end_date } : {}),
    location: event.location_name ? {
      "@type": "Place",
      name: event.location_name,
      ...(event.location_address ? { address: event.location_address } : {}),
    } : undefined,
    organizer: event.organizer ? { "@type": "Organization", name: event.organizer } : undefined,
    isAccessibleForFree: event.is_free,
    eventStatus: "https://schema.org/EventScheduled",
    url: `${BASE_URL}/events/${event.slug}`,
  };

  return (
    <main id="main-content" className="min-h-screen" style={{ background: "var(--psp-gray-50, #f8fafc)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-5">
          <Link href="/" className="hover:underline" style={{ color: "var(--psp-gold-text)" }}>Home</Link>
          {" / "}
          <Link href="/events" className="hover:underline" style={{ color: "var(--psp-gold-text)" }}>Events</Link>
          {" / "}
          <span className="text-gray-500">{event.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <EventTypePill type={event.event_type} size="md" />
          <h1
            className="mt-3 mb-2"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "var(--psp-navy)",
              lineHeight: 1.05,
              letterSpacing: "0.01em",
            }}
          >
            {event.title}
          </h1>
          {event.organizer && (
            <p className="text-gray-500">
              Organized by <strong className="text-gray-700">{event.organizer}</strong>
            </p>
          )}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <InfoBlock icon={Calendar} label="Date & Time" value={dateRange} sub={timeStr} />
          {event.location_name && (
            <InfoBlock icon={MapPin} label="Location" value={event.location_name} sub={event.location_address} />
          )}
          {sportMeta && (
            <InfoBlock icon={Globe} label="Sport" value={sportMeta.name} />
          )}
          {(event.contact_name || event.contact_email) && (
            <InfoBlock
              icon={Mail}
              label="Contact"
              value={event.contact_name || ""}
              sub={event.contact_email || event.contact_phone || undefined}
            />
          )}
        </div>

        {/* Description */}
        {event.description && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2
              className="mb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", color: "var(--psp-navy)", letterSpacing: "0.02em" }}
            >
              About This Event
            </h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
              {event.description}
            </div>
          </div>
        )}

        {/* Registration CTA */}
        {(event.registration_url || event.cost_info || event.is_free) && (
          <div className="rounded-lg p-6 flex flex-wrap items-center justify-between gap-4 mb-6" style={{ background: "var(--psp-navy)" }}>
            <div className="text-white">
              <strong className="block text-lg font-bold mb-0.5">
                {event.registration_url ? "Ready to sign up?" : "Event Details"}
              </strong>
              <span style={{ color: "var(--psp-gold)" }}>
                {event.is_free ? "FREE - No registration fee" : event.cost_info || ""}
              </span>
            </div>
            {event.registration_url && (
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition hover:opacity-90"
                style={{ background: "var(--psp-gold)", color: "var(--psp-navy)" }}
              >
                Register Now
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {event.tags.map((tag: string) => (
              <span key={tag} className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Related events */}
        {related && related.length > 0 && (
          <section className="mt-10 pt-8 border-t border-gray-200">
            <h2
              className="mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", color: "var(--psp-navy)" }}
            >
              Related Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string | null;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-3 items-start">
      <div
        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: "rgba(240,165,0,0.08)", color: "var(--psp-gold-text)" }}
      >
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <div className="text-[0.65rem] font-bold tracking-wider uppercase text-gray-400 mb-0.5">{label}</div>
        <div className="text-sm font-semibold" style={{ color: "var(--psp-navy)" }}>{value}</div>
        {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}
