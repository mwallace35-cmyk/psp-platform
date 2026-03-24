import Link from 'next/link';
import { getFootballLeaders, getBasketballLeaders } from '@/lib/data';

interface PlayerData {
  players?: { name?: string | null; slug?: string | null } | null;
  schools?: { name?: string | null } | null;
  rush_yards?: number | null;
  ppg?: string | number | null;
  [key: string]: unknown;
}

export async function TrendingPlayersWidget({
  sport,
  limit = 5,
}: {
  sport: 'football' | 'basketball';
  limit?: number;
}) {
  let players: PlayerData[] = [];
  let statLabel = '';
  try {
    if (sport === 'football') {
      players = (await getFootballLeaders('rush_yards', limit)) as PlayerData[];
      statLabel = 'Rush Yds';
    } else {
      players = (await getBasketballLeaders('ppg', limit)) as PlayerData[];
      statLabel = 'PPG';
    }
  } catch {
    return null;
  }
  if (!players.length) return null;
  return (
    <div className="rounded-lg bg-[#0a1628] border border-[#f0a500]/20 p-5">
      <h3 className="text-lg font-bold text-white mb-4">Trending This Week</h3>
      <div className="space-y-2">
        {players.map((p, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-[#0f1e30] rounded border border-[#1a2f4d] hover:border-[#f0a500]/30 transition-colors">
            <span className="w-6 h-6 rounded-full bg-[#f0a500] flex items-center justify-center text-xs font-bold text-[#0a1628] flex-shrink-0">{i + 1}</span>
            <div className="flex-grow min-w-0">
              <Link href={"/"+sport+"/players/"+p.players?.slug} className="block text-white text-sm font-semibold hover:text-[#f0a500] truncate">{p.players?.name}</Link>
              <p className="text-xs text-gray-300">{p.schools?.name}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[#f0a500] font-bold">{sport === 'football' ? p.rush_yards : p.ppg}</p>
              <p className="text-xs text-gray-400">{statLabel}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-[#1a2f4d]">
        <Link href={"/"+sport+"/leaderboards"} className="text-[#f0a500] text-sm font-medium">View All Leaderboards</Link>
      </div>
    </div>
  );
}
