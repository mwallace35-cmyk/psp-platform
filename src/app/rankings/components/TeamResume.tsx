'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { RefreshCw, Calendar, User, Trophy } from 'lucide-react';

interface TeamResumeResponse {
  stats: {
    record: string;
    win_pct: number;
    ppg: number;
    opp_ppg: number;
    avg_margin: number;
  };
  key_results: {
    type: string;
    result: string;
    opponent: string;
    opponent_slug: string;
    score: string;
  }[];
  key_players: {
    name: string;
    slug: string;
    position: string;
    stats_line: string;
  }[];
  upcoming: {
    date: string;
    opponent: string;
    opponent_slug: string;
    opponent_rank: number | null;
  }[];
}

interface TeamResumeProps {
  schoolId: number;
  sport: string;
  seasonId: number;
  isExpanded: boolean;
  sportColor: string;
}

function SkeletonGrid() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-16" />
        ))}
      </div>
      {/* Result rows skeleton */}
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded h-8" />
        ))}
      </div>
      {/* Player rows skeleton */}
      <div className="space-y-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded h-8" />
        ))}
      </div>
    </div>
  );
}

export default function TeamResume({ schoolId, sport, seasonId, isExpanded, sportColor }: TeamResumeProps) {
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState<TeamResumeResponse | null>(null);
  const [error, setError] = useState(false);

  const fetchResume = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        `/api/rankings/team-resume?school_id=${schoolId}&sport=${sport}&season_id=${seasonId}`
      );
      if (!res.ok) throw new Error('Failed to fetch');
      const data: TeamResumeResponse = await res.json();
      setResumeData(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [schoolId, sport, seasonId]);

  useEffect(() => {
    if (isExpanded && !resumeData && !loading) {
      fetchResume();
    }
  }, [isExpanded, resumeData, loading, fetchResume]);

  if (!isExpanded) return null;

  if (loading) return <SkeletonGrid />;

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-400 mb-2">Could not load team data</p>
        <button
          onClick={fetchResume}
          className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  if (!resumeData) return null;

  const { stats, key_results, key_players, upcoming } = resumeData;
  const marginPositive = stats.avg_margin >= 0;

  return (
    <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4 space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-3 border border-gray-100 text-center">
          <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">Record</p>
          <p className="text-lg font-bold text-navy">{stats.record}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-100 text-center">
          <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">PPG</p>
          <p className="text-lg font-bold text-navy">{stats.ppg.toFixed(1)}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-100 text-center">
          <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">Avg Margin</p>
          <p className={`text-lg font-bold ${marginPositive ? 'text-green-600' : 'text-red-500'}`}>
            {marginPositive ? '+' : ''}{stats.avg_margin.toFixed(1)}
          </p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-100 text-center">
          <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">Win %</p>
          <p className="text-lg font-bold text-navy">{(stats.win_pct * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* Key Results */}
      {key_results.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Trophy size={14} style={{ color: sportColor }} />
            <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wide">Key Results</h4>
          </div>
          <div className="space-y-1.5">
            {key_results.map((game, i) => (
              <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100 text-sm">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                  game.result === 'W' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {game.result}
                </span>
                <Link
                  href={`/${sport}/schools/${game.opponent_slug}`}
                  className="font-medium text-navy hover:text-blue-600 transition"
                >
                  {game.opponent}
                </Link>
                <span className="text-gray-400">{game.score}</span>
                {game.type && (
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    game.type === 'BEST WIN'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-600 border border-red-200'
                  }`}>
                    {game.type}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Players */}
      {key_players.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <User size={14} style={{ color: sportColor }} />
            <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wide">Key Players</h4>
          </div>
          <div className="space-y-1.5">
            {key_players.map((player, i) => (
              <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100 text-sm">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                  {player.position}
                </span>
                <Link
                  href={`/${sport}/players/${player.slug}`}
                  className="font-medium text-navy hover:text-blue-600 transition"
                >
                  {player.name}
                </Link>
                <span className="text-gray-400 text-xs">{player.stats_line}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Calendar size={14} style={{ color: sportColor }} />
            <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wide">Upcoming</h4>
          </div>
          <div className="space-y-1.5">
            {upcoming.map((game, i) => (
              <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-100 text-sm">
                <span className="text-xs text-gray-400 font-medium w-20 flex-shrink-0">{game.date}</span>
                <Link
                  href={`/${sport}/schools/${game.opponent_slug}`}
                  className="font-medium text-navy hover:text-blue-600 transition"
                >
                  {game.opponent}
                </Link>
                {game.opponent_rank && (
                  <span
                    className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: sportColor }}
                  >
                    #{game.opponent_rank}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
