'use client';

import { useEffect, useState } from 'react';

interface Scout {
  userId: string;
  username: string;
  clicks: number;
  signups: number;
  badges: number;
}

export function ReferralLeaderboard() {
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // This would fetch from a server endpoint that calculates leaderboard
        // For now, we'll show a placeholder
        setScouts([]);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-bold text-lg text-[#0a1628] mb-4">🔝 Top Scouts</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (scouts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-bold text-lg text-[#0a1628] mb-4">🔝 Top Scouts</h3>
        <p className="text-gray-500 text-sm">No scouts yet. Start sharing to climb the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-bold text-lg text-[#0a1628] mb-4">🔝 Top Scouts</h3>
      <div className="space-y-3">
        {scouts.map((scout, index) => (
          <div
            key={scout.userId}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f0a500] text-[#0a1628] font-bold">
                #{index + 1}
              </div>
              <div>
                <p className="font-semibold text-[#0a1628]">{scout.username}</p>
                <p className="text-xs text-gray-500">{scout.badges} badges</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#3b82f6]">{scout.clicks} clicks</p>
              <p className="text-xs text-gray-500">{scout.signups} signups</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
