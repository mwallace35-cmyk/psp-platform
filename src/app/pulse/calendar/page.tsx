import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import { SPORT_META } from '@/lib/sports';
import PSPPromo from '@/components/ads/PSPPromo';
import PulseNav from '@/components/pulse/PulseNav';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Events Calendar — The Pulse | PhillySportsPack.com',
  description: 'Upcoming Philadelphia high school sports events, camps, showcases, and tournaments.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com/pulse/calendar' },
  robots: { index: true, follow: true },
};

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  sport_id: string;
  type: string;
  registration_url?: string;
}

const EVENT_TYPES: Record<string, { emoji: string; label: string }> = {
  camp: { emoji: '🏕️', label: 'Camp' },
  showcase: { emoji: '🎬', label: 'Showcase' },
  game: { emoji: '🏆', label: 'Game' },
  tournament: { emoji: '🥇', label: 'Tournament' },
};

export default async function CalendarPage() {
  const supabase = createStaticClient();

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true });

  const eventsByMonth: Record<string, Event[]> = {};
  if (events) {
    events.forEach((event: Event) => {
      const date = new Date(event.date);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      if (!eventsByMonth[monthKey]) eventsByMonth[monthKey] = [];
      eventsByMonth[monthKey].push(event);
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-navy via-navy-mid to-navy py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bebas text-white mb-2">Events Calendar</h1>
          <p className="text-gray-300 text-lg">Camps, showcases, games, and tournaments</p>
        </div>
      </div>

      <PulseNav />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!events || events.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-gray-500 text-lg">No upcoming events scheduled. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
              <section key={month}>
                <h2 className="text-2xl font-bebas text-navy mb-4 pb-2 border-b-2 border-gold">
                  {month}
                </h2>
                <div className="space-y-3">
                  {monthEvents.map((event: Event) => {
                    const eventDate = new Date(event.date);
                    const typeInfo = EVENT_TYPES[event.type] || { emoji: '📋', label: event.type };
                    const sportInfo = SPORT_META[event.sport_id as keyof typeof SPORT_META];

                    return (
                      <div
                        key={event.id}
                        className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gold hover:shadow-md transition"
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="bg-gold text-navy rounded-lg p-3 text-center w-20">
                              <p className="text-2xl font-bold leading-tight">{eventDate.getDate()}</p>
                              <p className="text-xs font-medium uppercase">
                                {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                              </p>
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-navy">{event.title}</h3>
                              <span className="text-base">{typeInfo.emoji}</span>
                              {sportInfo && <span className="text-base">{sportInfo.emoji}</span>}
                            </div>

                            <div className="space-y-1 text-gray-600 text-sm">
                              <p>📍 {event.location}</p>
                              {event.time && <p>🕐 {event.time}</p>}
                            </div>

                            {event.description && (
                              <p className="mt-2 text-gray-700 text-sm">{event.description}</p>
                            )}

                            <div className="flex items-center gap-3 mt-3">
                              <span className="text-xs font-medium text-gray-500 uppercase">{typeInfo.label}</span>
                              {sportInfo && (
                                <span className="text-xs font-medium text-gray-500 uppercase">{sportInfo.name}</span>
                              )}
                            </div>
                          </div>

                          {event.registration_url && (
                            <a
                              href={event.registration_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 px-5 py-2 bg-gold text-navy font-bold rounded-md hover:bg-gold/90 transition text-sm text-center"
                            >
                              Register
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="mt-8">
          <PSPPromo size="banner" variant={4} />
        </div>
      </div>
    </div>
  );
}
