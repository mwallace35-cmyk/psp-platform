'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { Button, Badge, ToastContainer } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { SPORT_META, VALID_SPORTS, type SportId } from '@/lib/sports';

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  sport_id: SportId;
  type: 'camp' | 'showcase' | 'game' | 'tournament';
  registration_url?: string;
  created_at: string;
}

export default function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState<SportId | 'all'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'camp' | 'showcase' | 'game' | 'tournament'>('all');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSport, setFormSport] = useState<SportId>('football');
  const [formType, setFormType] = useState<'camp' | 'showcase' | 'game' | 'tournament'>('camp');
  const [formRegistrationUrl, setFormRegistrationUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const supabase = createClient();
  const { toasts, removeToast, error: toastError, success: toastSuccess } = useToast();

  useEffect(() => {
    fetchEvents();
  }, [selectedSport, selectedType]);

  async function fetchEvents() {
    try {
      setLoading(true);
      let query = supabase.from('events').select('*').order('date', { ascending: true });

      if (selectedSport !== 'all') {
        query = query.eq('sport_id', selectedSport);
      }

      if (selectedType !== 'all') {
        query = query.eq('type', selectedType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveEvent() {
    if (!formTitle.trim() || !formDate || !formLocation.trim()) {
      toastError('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('events').insert({
        title: formTitle,
        date: formDate,
        time: formTime || null,
        location: formLocation,
        description: formDescription,
        sport_id: formSport,
        type: formType,
        registration_url: formRegistrationUrl || null,
      });

      if (error) throw error;

      // Reset form
      setFormTitle('');
      setFormDate('');
      setFormTime('');
      setFormLocation('');
      setFormDescription('');
      setFormRegistrationUrl('');
      setShowForm(false);

      toastSuccess('Event created successfully!');
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toastError('Error saving event. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteEvent(id: string) {
    if (!window.confirm('Delete this event?')) return;

    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  }

  const eventTypes = [
    { value: 'camp', label: '🏕️ Camp' },
    { value: 'showcase', label: '🎬 Showcase' },
    { value: 'game', label: '🏆 Game' },
    { value: 'tournament', label: '🥇 Tournament' },
  ];

  return (
    <>
      <ToastContainer toasts={toasts.map(t => ({ ...t, onClose: removeToast }))} />
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Events</h1>
          <p className="text-gray-600">Manage camps, showcases, games, and tournaments</p>
        </div>
        {!showForm && (
          <Button variant="primary" onClick={() => setShowForm(true)}>
            Add Event
          </Button>
        )}
      </div>

      {/* Add Event Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-navy mb-4 font-bebas">New Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Event title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                placeholder="City or venue"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sport</label>
              <select
                value={formSport}
                onChange={(e) => setFormSport(e.target.value as SportId)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {VALID_SPORTS.map((sport) => (
                  <option key={sport} value={sport}>
                    {SPORT_META[sport].emoji} {SPORT_META[sport].name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as 'camp' | 'showcase' | 'game' | 'tournament')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
              >
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Event description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Registration URL</label>
            <input
              type="url"
              value={formRegistrationUrl}
              onChange={(e) => setFormRegistrationUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              variant="primary"
              onClick={handleSaveEvent}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Event'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowForm(false)}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sport</label>
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value as SportId | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="all">All Sports</option>
              {VALID_SPORTS.map((sport) => (
                <option key={sport} value={sport}>
                  {SPORT_META[sport].emoji} {SPORT_META[sport].name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(
                  e.target.value as 'all' | 'camp' | 'showcase' | 'game' | 'tournament'
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="all">All Types</option>
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No events found</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gold transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <Badge variant="sport">{SPORT_META[event.sport_id].emoji}</Badge>
                    <Badge variant="info">
                      {eventTypes.find((t) => t.value === event.type)?.label}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{event.location}</p>
                  <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    {event.time && <span>🕐 {event.time}</span>}
                    {event.registration_url && (
                      <a
                        href={event.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:text-gold/80 font-medium"
                      >
                        Register
                      </a>
                    )}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </>
  );
}
