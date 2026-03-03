import { createClient } from '@/lib/supabase/server';
import { generatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import { SPORT_META } from '@/lib/data';

export const metadata: Metadata = generatePageMetadata({ pageType: 'events' });

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

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true });

  // Group events by month
  const eventsByMonth: Record<string, Event[]> = {};
  if (events) {
    events.forEach((event: Event) => {
      const date = new Date(event.date);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      if (!eventsByMonth[monthKey]) {
        eventsByMonth[monthKey] = [];
      }
      eventsByMonth[monthKey].push(event);
    });
  }

  const eventTypes: Record<string, { emoji: string; label: string }> = {
    camp: { emoji: '🏕️', label: 'Camp' },
    showcase: { emoji: '🎬', label: 'Showcase' },
    game: { emoji: '🏆', label: 'Game' },
    tournament: { emoji: '🥇', label: 'Tournament' },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy to-navy-mid py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bebas text-white mb-4">Events</h1>
          <p className="text-gold text-lg">
            Upcoming camps, showcases, games, and tournaments
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {!events || events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No upcoming events scheduled.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
              <div key={month}>
                <h2 className="text-2xl font-bebas text-navy mb-6 pb-3 border-b-2 border-gold">
                  {month}
                </h2>

                <div className="space-y-4">
                  {monthEvents.map((event: Event) => {
                    const eventDate = new Date(event.date);
                    const typeInfo = eventTypes[event.type] || { emoji: '📋', label: event.type };
                    const sportInfo = SPORT_META[event.sport_id as keyof typeof SPORT_META];

                    return (
                      <div
                        key={event.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gold hover:shadow-lg transition"
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          {/* Date Column */}
                          <div className="flex-shrink-0">
                            <div className="bg-gold text-white rounded-lg p-3 text-center w-24">
                              <p className="text-2xl font-bold">
                                {eventDate.getDate()}
                              </p>
                              <p className="text-sm font-medium">
                                {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                              </p>
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-navy">{event.title}</h3>
                              <span className="text-lg">{typeInfo.emoji}</span>
                              {sportInfo && <span className="text-lg">{sportInfo.emoji}</span>}
                            </div>

                            <div className="space-y-2 text-gray-600 text-sm">
                              <p className="flex items-center gap-2">
                                <span>📍</span> {event.location}
                              </p>
                              {event.time && (
                                <p className="flex items-center gap-2">
                                  <span>🕐</span> {event.time}
                                </p>
                              )}
                            </div>

                            {event.description && (
                              <p className="mt-3 text-gray-700">{event.description}</p>
                            )}

                            <div className="flex items-center gap-4 mt-4">
                              <span className="text-xs font-medium text-gray-600 uppercase">
                                {typeInfo.label}
                              </span>
                              {sportInfo && (
                                <span className="text-xs font-medium text-gray-600 uppercase">
                                  {sportInfo.name}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action */}
                          {event.registration_url && (
                            <a
                              href={event.registration_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 px-6 py-2 bg-gold text-navy font-medium rounded-md hover:bg-gold/90 transition text-center"
                            >
                              Register
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
