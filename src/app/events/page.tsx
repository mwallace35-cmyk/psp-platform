import { createClient } from '@/lib/supabase/server';
import { generatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SPORT_META } from '@/lib/sports';
import HeaderWithScores from '@/components/layout/HeaderWithScores';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';
import PSPPromo from '@/components/ads/PSPPromo';

export const metadata: Metadata = generatePageMetadata({ pageType: 'events' });

export const revalidate = 300; // 5 min

interface DBEvent {
  id: string;
  title: string;
  description?: string;
  sport_id?: string;
  event_type?: string;
  start_date: string;
  end_date?: string;
  location?: string;
  registration_url?: string;
  status?: string;
  // Legacy columns (admin may insert as these)
  date?: string;
  time?: string;
  type?: string;
}

// ─── PIAA & Philly HS Sports Calendar Key Dates ───
// These always display even when DB events are empty
const KEY_DATES = [
  // Spring 2026
  { date: '2026-03-09', title: 'PIAA Basketball State Playoffs Begin', sport: 'basketball', type: 'tournament', emoji: '🏀' },
  { date: '2026-03-14', title: 'Catholic League Basketball Championship', sport: 'basketball', type: 'game', emoji: '🏀' },
  { date: '2026-03-18', title: 'Baseball Season Opener', sport: 'baseball', type: 'game', emoji: '⚾' },
  { date: '2026-03-22', title: 'PIAA Basketball State Championships', sport: 'basketball', type: 'tournament', emoji: '🏀' },
  { date: '2026-03-25', title: 'Lacrosse Season Opens', sport: 'lacrosse', type: 'game', emoji: '🥍' },
  { date: '2026-04-05', title: 'Track & Field Season Opens', sport: 'track-field', type: 'game', emoji: '🏃' },
  { date: '2026-04-18', title: 'Penn Relays (Franklin Field)', sport: 'track-field', type: 'tournament', emoji: '🏃' },
  { date: '2026-05-15', title: 'Catholic League Baseball Championship', sport: 'baseball', type: 'game', emoji: '⚾' },
  { date: '2026-05-22', title: 'PIAA District 12 Baseball Playoffs', sport: 'baseball', type: 'tournament', emoji: '⚾' },
  { date: '2026-05-29', title: 'PIAA Lacrosse State Championships', sport: 'lacrosse', type: 'tournament', emoji: '🥍' },
  { date: '2026-06-06', title: 'PIAA Baseball State Championships', sport: 'baseball', type: 'tournament', emoji: '⚾' },
  { date: '2026-06-13', title: 'PIAA Track & Field State Championships', sport: 'track-field', type: 'tournament', emoji: '🏃' },
  // Summer 2026
  { date: '2026-07-01', title: 'Summer Camp Season Begins', sport: 'football', type: 'camp', emoji: '🏈' },
  { date: '2026-07-15', title: 'Rising Stars Basketball Showcase', sport: 'basketball', type: 'showcase', emoji: '🏀' },
  // Fall 2026
  { date: '2026-08-20', title: 'Football Preseason Camp Opens', sport: 'football', type: 'camp', emoji: '🏈' },
  { date: '2026-09-04', title: 'Football Season Opener (Week 1)', sport: 'football', type: 'game', emoji: '🏈' },
  { date: '2026-11-14', title: 'Catholic League Football Championship', sport: 'football', type: 'game', emoji: '🏈' },
  { date: '2026-11-21', title: 'PIAA Football District Playoffs', sport: 'football', type: 'tournament', emoji: '🏈' },
  { date: '2026-12-05', title: 'PIAA Football State Championships', sport: 'football', type: 'tournament', emoji: '🏈' },
  { date: '2026-12-10', title: 'Basketball Season Opener', sport: 'basketball', type: 'game', emoji: '🏀' },
];

const EVENT_TYPES: Record<string, { emoji: string; label: string; color: string }> = {
  game: { emoji: '🏆', label: 'Game', color: '#16a34a' },
  tournament: { emoji: '🥇', label: 'Tournament', color: '#7c3aed' },
  camp: { emoji: '🏕️', label: 'Camp', color: '#ea580c' },
  showcase: { emoji: '🎬', label: 'Showcase', color: '#0891b2' },
};

function formatDate(dateStr: string): { day: string; month: string; weekday: string; full: string } {
  const d = new Date(dateStr + 'T12:00:00');
  return {
    day: d.getDate().toString(),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    full: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
  };
}

// Determine current sports season context
function getSeasonContext(): { label: string; emoji: string; sports: string[] } {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 5) return { label: 'Spring Season', emoji: '⚾', sports: ['Baseball', 'Lacrosse', 'Track & Field'] };
  if (month >= 6 && month <= 7) return { label: 'Summer Offseason', emoji: '☀️', sports: ['Camps', 'Showcases', 'Training'] };
  if (month >= 8 && month <= 10) return { label: 'Fall Season', emoji: '🏈', sports: ['Football', 'Soccer'] };
  return { label: 'Winter Season', emoji: '🏀', sports: ['Basketball', 'Wrestling'] };
}

export default async function EventsPage() {
  const supabase = await createClient();

  // Try both column names (start_date from schema, date from legacy admin)
  const { data: dbEvents } = await supabase
    .from('events')
    .select('*')
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })
    .limit(50);

  // Normalize DB events
  const events: Array<{ id: string; title: string; dateStr: string; location?: string; description?: string; sport_id?: string; event_type?: string; registration_url?: string }> = (dbEvents || []).map((e: DBEvent) => ({
    id: e.id,
    title: e.title,
    dateStr: (e.start_date || e.date || '').slice(0, 10),
    location: e.location,
    description: e.description,
    sport_id: e.sport_id,
    event_type: e.event_type || e.type || 'game',
    registration_url: e.registration_url,
  }));

  // Merge key dates (only future ones not already in DB)
  const today = new Date().toISOString().slice(0, 10);
  const dbTitles = new Set(events.map(e => e.title.toLowerCase()));
  const keyDates = KEY_DATES
    .filter(kd => kd.date >= today && !dbTitles.has(kd.title.toLowerCase()))
    .map((kd, i) => ({
      id: `key-${i}`,
      title: kd.title,
      dateStr: kd.date,
      sport_id: kd.sport,
      event_type: kd.type,
      isKeyDate: true,
      emoji: kd.emoji,
    }));

  // Combine and sort
  const allEvents = [...events, ...keyDates].sort((a, b) => a.dateStr.localeCompare(b.dateStr));

  // Group by month
  const byMonth: Record<string, typeof allEvents> = {};
  for (const ev of allEvents) {
    const d = new Date(ev.dateStr + 'T12:00:00');
    const key = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(ev);
  }

  const season = getSeasonContext();
  const totalEvents = allEvents.length;

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWithScores />
      <Breadcrumb items={[{ label: 'Events' }]} />

      {/* ════════ HEADER BAR ════════ */}
      <div className="sport-hub-header" style={{ '--shh-color': 'var(--psp-gold, #f0a500)' } as React.CSSProperties}>
        <div className="shh-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 28 }}>📅</span>
            <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>
              Events Calendar
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
            Games, tournaments, camps, and showcases across Philadelphia high school sports.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: 20 }}>
              {season.emoji} {season.label}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: 20 }}>
              {totalEvents} upcoming events
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: 20 }}>
              {season.sports.join(' · ')}
            </span>
          </div>
        </div>
      </div>

      {/* ════════ SUB-NAV ════════ */}
      <nav className="hub-subnav">
        <Link href="/events" style={{ color: 'var(--psp-gold)' }}>All Events</Link>
        <Link href="/potw">Player of the Week</Link>
        <Link href="/recruiting">Recruiting</Link>
        <Link href="/community">Community</Link>
      </nav>

      {/* ════════ MAIN 2-COL LAYOUT ════════ */}
      <div className="hub-body">
        <div className="hub-main">

          {/* ──── EVENT TYPE LEGEND ──── */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            {Object.entries(EVENT_TYPES).map(([key, info]) => (
              <span key={key} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 20,
                background: `${info.color}12`,
                color: info.color,
                border: `1px solid ${info.color}30`,
              }}>
                {info.emoji} {info.label}
              </span>
            ))}
          </div>

          {/* ──── EVENTS BY MONTH ──── */}
          {Object.keys(byMonth).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', background: 'var(--psp-gray-50, #f9fafb)', borderRadius: 10, border: '1px solid var(--psp-gray-200, #e5e7eb)' }}>
              <div style={{ fontSize: 48, marginBottom: 10 }}>📅</div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--psp-navy, #0a1628)', marginBottom: 6 }}>No upcoming events</p>
              <p style={{ fontSize: 13, color: 'var(--psp-gray-500, #6b7280)' }}>Check back soon for games, camps, and showcases.</p>
            </div>
          ) : (
            Object.entries(byMonth).map(([month, monthEvents]) => (
              <div key={month} style={{ marginBottom: 28 }}>
                {/* Month Header */}
                <div className="hub-sec-head" style={{ marginBottom: 12 }}>
                  <h3>{month}</h3>
                </div>

                {/* Event Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {monthEvents.map((ev) => {
                    const dt = formatDate(ev.dateStr);
                    const typeInfo = EVENT_TYPES[ev.event_type || 'game'] || EVENT_TYPES.game;
                    const sportMeta = ev.sport_id ? SPORT_META[ev.sport_id as keyof typeof SPORT_META] : null;
                    const isKeyDate = 'isKeyDate' in ev && ev.isKeyDate;

                    return (
                      <div key={ev.id} style={{
                        display: 'flex',
                        gap: 0,
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: '1px solid var(--psp-gray-200, #e5e7eb)',
                        background: '#fff',
                        transition: 'box-shadow 0.15s',
                      }}>
                        {/* Date Chip */}
                        <div style={{
                          width: 64,
                          flexShrink: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '10px 0',
                          background: isKeyDate ? 'var(--psp-navy, #0a1628)' : 'var(--psp-gold, #f0a500)',
                          color: '#fff',
                        }}>
                          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{dt.day}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', opacity: 0.8 }}>{dt.month}</span>
                          <span style={{ fontSize: 9, opacity: 0.6, marginTop: 2 }}>{dt.weekday}</span>
                        </div>

                        {/* Event Details */}
                        <div style={{ flex: 1, padding: '10px 14px', minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
                            <span style={{
                              fontFamily: 'Barlow Condensed, sans-serif',
                              fontSize: 14,
                              fontWeight: 700,
                              color: 'var(--psp-navy, #0a1628)',
                            }}>
                              {ev.title}
                            </span>
                            {isKeyDate && (
                              <span style={{
                                fontSize: 9,
                                fontWeight: 700,
                                background: 'var(--psp-navy, #0a1628)',
                                color: 'var(--psp-gold, #f0a500)',
                                padding: '1px 7px',
                                borderRadius: 10,
                                letterSpacing: 0.5,
                                textTransform: 'uppercase',
                              }}>
                                Key Date
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            {/* Sport Badge */}
                            {sportMeta && (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 3,
                                fontSize: 10,
                                fontWeight: 600,
                                background: `${sportMeta.color}15`,
                                color: sportMeta.color,
                                padding: '2px 7px',
                                borderRadius: 10,
                              }}>
                                {sportMeta.emoji} {sportMeta.name}
                              </span>
                            )}

                            {/* Type Badge */}
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 3,
                              fontSize: 10,
                              fontWeight: 600,
                              color: typeInfo.color,
                              opacity: 0.8,
                            }}>
                              {typeInfo.emoji} {typeInfo.label}
                            </span>

                            {/* Location */}
                            {'location' in ev && ev.location && (
                              <span style={{ fontSize: 11, color: 'var(--psp-gray-500, #6b7280)' }}>
                                📍 {ev.location}
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          {'description' in ev && ev.description && (
                            <p style={{ fontSize: 12, color: 'var(--psp-gray-600, #4b5563)', marginTop: 4, lineHeight: 1.4 }}>
                              {ev.description}
                            </p>
                          )}
                        </div>

                        {/* Register Button */}
                        {'registration_url' in ev && ev.registration_url && (
                          <div style={{ display: 'flex', alignItems: 'center', padding: '0 14px', flexShrink: 0 }}>
                            <a
                              href={ev.registration_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                fontFamily: 'Barlow Condensed, sans-serif',
                                letterSpacing: 0.5,
                                textTransform: 'uppercase',
                                background: 'var(--psp-gold, #f0a500)',
                                color: 'var(--psp-navy, #0a1628)',
                                padding: '6px 14px',
                                borderRadius: 6,
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Register →
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          <PSPPromo size="banner" variant={3} />
        </div>

        {/* ── RIGHT: SIDEBAR ── */}
        <aside className="hub-sidebar">
          {/* What's In Season */}
          <div className="hub-widget">
            <div className="hub-wh" style={{ background: 'var(--psp-gold, #f0a500)', color: 'var(--psp-navy, #0a1628)' }}>
              {season.emoji} {season.label}
            </div>
            <div className="hub-wb">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {season.sports.map((sport) => (
                  <div key={sport} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 0',
                    borderBottom: '1px solid var(--psp-gray-100, #f3f4f6)',
                  }}>
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--psp-gold, #f0a500)',
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--psp-navy, #0a1628)' }}>
                      {sport}
                    </span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: 'var(--psp-gray-400, #9ca3af)', marginTop: 10 }}>
                Key dates shown automatically based on the PIAA calendar.
              </p>
            </div>
          </div>

          {/* Upcoming Highlights */}
          <div className="hub-widget">
            <div className="hub-wh">Next Up</div>
            <div className="hub-wb" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {allEvents.slice(0, 4).map((ev) => {
                const dt = formatDate(ev.dateStr);
                const sportMeta = ev.sport_id ? SPORT_META[ev.sport_id as keyof typeof SPORT_META] : null;
                return (
                  <div key={ev.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '6px 0',
                    borderBottom: '1px solid var(--psp-gray-100, #f3f4f6)',
                  }}>
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: 6,
                      background: 'var(--psp-navy, #0a1628)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1, fontFamily: 'Barlow Condensed, sans-serif' }}>{dt.day}</span>
                      <span style={{ fontSize: 8, color: 'var(--psp-gold, #f0a500)', textTransform: 'uppercase', fontWeight: 600 }}>{dt.month}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--psp-navy, #0a1628)', fontFamily: 'Barlow Condensed, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ev.title}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--psp-gray-500, #6b7280)' }}>
                        {sportMeta ? `${sportMeta.emoji} ${sportMeta.name}` : 'All Sports'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="hub-widget">
            <div className="hub-wh">Quick Links</div>
            <div className="hub-wb" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { href: '/potw', label: '🏆 Player of the Week' },
                { href: '/recruiting', label: '📋 Recruiting Board' },
                { href: '/articles', label: '📰 Latest Articles' },
                { href: '/search', label: '🔍 Search Database' },
                { href: '/community', label: '👥 Community Hub' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: 13, color: 'var(--psp-navy)', textDecoration: 'none', padding: '4px 0', borderBottom: '1px solid var(--psp-gray-100)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Season Calendar Badge */}
          <div style={{
            background: 'var(--psp-navy, #0a1628)',
            borderRadius: 10,
            padding: 20,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>📅</div>
            <div style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--psp-gold, #f0a500)',
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}>
              2025-26 Season
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              7 sports · 25 years of history
            </div>
          </div>

          <PSPPromo size="sidebar" variant={1} />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
