'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { SPORT_META, VALID_SPORTS } from '@/lib/sports';

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [schoolAffiliation, setSchoolAffiliation] = useState('');
  const [favoriteSports, setFavoriteSports] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [email, setEmail] = useState('');

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setEmail(user.email || '');

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setDisplayName(profile.display_name || '');
        setAvatarUrl(profile.avatar_url || '');
        setSchoolAffiliation(profile.school_affiliation || '');
        setFavoriteSports(profile.favorite_sports || []);
        setBio(profile.bio || '');
      }
      setLoading(false);
    }

    loadProfile();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          display_name: displayName,
          avatar_url: avatarUrl || null,
          school_affiliation: schoolAffiliation || null,
          favorite_sports: favoriteSports,
          bio: bio || null,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Could not save profile');
    } finally {
      setSaving(false);
    }
  }

  function toggleSport(sport: string) {
    setFavoriteSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--psp-navy)', fontFamily: 'Barlow Condensed, sans-serif' }}>
            Your Profile
          </h1>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
        <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--psp-gold)' }}>
          Back to Home
        </Link>
      </div>

      <div className="space-y-6 bg-white rounded-lg border border-gray-200 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">School Affiliation</label>
          <input
            type="text"
            value={schoolAffiliation}
            onChange={(e) => setSchoolAffiliation(e.target.value)}
            placeholder="e.g., St. Joseph's Prep '18"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Sports</label>
          <div className="flex flex-wrap gap-2">
            {VALID_SPORTS.map((sport) => (
              <button
                key={sport}
                type="button"
                onClick={() => toggleSport(sport)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  favoriteSports.includes(sport)
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={favoriteSports.includes(sport) ? { background: 'var(--psp-navy)' } : {}}
              >
                {SPORT_META[sport].emoji} {SPORT_META[sport].name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell the community a bit about yourself..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-md font-bold text-sm transition disabled:opacity-50"
          style={{ background: 'var(--psp-gold)', color: 'var(--psp-navy)' }}
        >
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
