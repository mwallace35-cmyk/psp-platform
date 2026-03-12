'use client';

import { useEffect, useState } from 'react';

interface NotificationPrefsType {
  game_alerts?: boolean;
  record_alerts?: boolean;
  potw_results?: boolean;
  weekly_digest?: boolean;
  new_articles?: boolean;
  [key: string]: boolean | undefined;
}

interface NotificationPrefsProps {
  onSaveSuccess?: () => void;
}

const PREFERENCE_LABELS: Record<string, { label: string; description: string }> = {
  game_alerts: {
    label: 'Game Alerts',
    description: 'Get notified when your favorite schools have games',
  },
  record_alerts: {
    label: 'Record Alerts',
    description: 'Notified when players break school records',
  },
  potw_results: {
    label: 'POTW Results',
    description: 'Get notified about Player of the Week winners',
  },
  weekly_digest: {
    label: 'Weekly Digest',
    description: 'Receive a weekly roundup email every Sunday',
  },
  new_articles: {
    label: 'New Articles',
    description: 'Get notified when new articles are published',
  },
};

export function NotificationPrefs({ onSaveSuccess }: NotificationPrefsProps) {
  const [prefs, setPrefs] = useState<NotificationPrefsType>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {

    const fetchPrefs = async () => {
      try {
        const response = await fetch('/api/notifications/preferences');
        if (response.ok) {
          const data = await response.json();
          setPrefs(data);
        }
      } catch (err) {
        console.error('Error fetching notification preferences:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrefs();
  }, []);

  const handleToggle = (key: string) => {
    setPrefs(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_prefs: prefs }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Preferences saved successfully!' });
        onSaveSuccess?.();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to save preferences' });
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries(PREFERENCE_LABELS).map(([key, { label, description }]) => (
          <div key={key} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <div className="flex items-center pt-1">
              <input
                type="checkbox"
                id={key}
                checked={prefs[key] ?? false}
                onChange={() => handleToggle(key)}
                className="w-5 h-5 rounded border-gray-300 text-[#f0a500] focus:ring-[#3b82f6] cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label htmlFor={key} className="block font-semibold text-[#0a1628] cursor-pointer">
                {label}
              </label>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          </div>
        ))}
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full px-4 py-3 bg-[#f0a500] text-[#0a1628] font-bold rounded-lg hover:bg-[#d98900] transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );
}
