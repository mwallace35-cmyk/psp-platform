import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { NotificationPrefs } from '@/components/notifications/NotificationPrefs';

export const metadata = {
  title: 'Notification Settings - PhillySportsPack',
  description: 'Manage your notification preferences',
};

export default async function NotificationSettingsPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0a1628] mb-2">Notification Settings</h1>
            <p className="text-gray-600">
              Customize how and when you receive updates from PhillySportsPack
            </p>
          </div>

          <NotificationPrefs />

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-bold text-[#0a1628] mb-4">About Your Preferences</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="text-[#f0a500]">•</span>
                <span>
                  <strong>Game Alerts:</strong> Notifications when games are scheduled or results are posted for your favorite schools
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f0a500]">•</span>
                <span>
                  <strong>Record Alerts:</strong> Special notifications when players break school records or set new milestones
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f0a500]">•</span>
                <span>
                  <strong>POTW Results:</strong> Get notified about each week's Player of the Week winner announcement
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f0a500]">•</span>
                <span>
                  <strong>Weekly Digest:</strong> A curated weekly email with top performances, news, and highlights
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#f0a500]">•</span>
                <span>
                  <strong>New Articles:</strong> Notifications when new articles are published for your favorite sports
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
