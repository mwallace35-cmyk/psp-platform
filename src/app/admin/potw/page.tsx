'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Badge } from '@/components/ui';
import { SPORT_META, VALID_SPORTS, type SportId } from '@/lib/data';

interface PotwNominee {
  id: string;
  player_id: string;
  player_name: string;
  school_name: string;
  sport_id: SportId;
  stat_line: string;
  vote_count: number;
  created_at: string;
}

interface PotwWinner {
  id: string;
  week: number;
  year: number;
  player_name: string;
  school_name: string;
  sport_id: SportId;
  vote_count: number;
  created_at: string;
}

export default function PotwManagement() {
  const [nominees, setNominees] = useState<PotwNominee[]>([]);
  const [winners, setWinners] = useState<PotwWinner[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingOpen, setVotingOpen] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSport, setNewSport] = useState<SportId>('football');
  const [newStatLine, setNewStatLine] = useState('');

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [nomineeRes, winnerRes] = await Promise.all([
        supabase
          .from('potw_nominees')
          .select('*')
          .order('vote_count', { ascending: false }),
        supabase
          .from('potw_winners')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      setNominees(nomineeRes.data || []);
      setWinners(winnerRes.data || []);
    } catch (error) {
      console.error('Error fetching POTW data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddNominee() {
    if (!newPlayerName.trim() || !newSchoolName.trim() || !newStatLine.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const { error } = await supabase.from('potw_nominees').insert({
        player_name: newPlayerName,
        school_name: newSchoolName,
        sport_id: newSport,
        stat_line: newStatLine,
        vote_count: 0,
      });

      if (error) throw error;

      setNewPlayerName('');
      setNewSchoolName('');
      setNewStatLine('');
      setNewSport('football');
      fetchData();
    } catch (error) {
      console.error('Error adding nominee:', error);
      alert('Error adding nominee');
    }
  }

  async function handleDeclareWinner(nomineeId: string) {
    const nominee = nominees.find((n) => n.id === nomineeId);
    if (!nominee) return;

    try {
      const now = new Date();
      const week = Math.floor((now.getDate() - 1) / 7) + 1;
      const year = now.getFullYear();

      // Add to winners
      const { error: winnerError } = await supabase.from('potw_winners').insert({
        week,
        year,
        player_name: nominee.player_name,
        school_name: nominee.school_name,
        sport_id: nominee.sport_id,
        vote_count: nominee.vote_count,
      });

      if (winnerError) throw winnerError;

      // Clear nominees (start fresh voting)
      const { error: deleteError } = await supabase
        .from('potw_nominees')
        .delete()
        .neq('id', 'null');

      if (deleteError) throw deleteError;

      fetchData();
    } catch (error) {
      console.error('Error declaring winner:', error);
      alert('Error declaring winner');
    }
  }

  async function handleDeleteNominee(id: string) {
    if (!window.confirm('Delete this nominee?')) return;

    try {
      const { error } = await supabase.from('potw_nominees').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting nominee:', error);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-navy mb-2">Player of the Week</h1>
        <p className="text-gray-600">Manage current voting period and view past winners</p>
      </div>

      {/* Current Voting Period */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-navy font-bebas">Current Voting Period</h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Voting:</span>
            <button
              onClick={() => setVotingOpen(!votingOpen)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                votingOpen
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {votingOpen ? 'Open' : 'Closed'}
            </button>
          </div>
        </div>

        {/* Add Nominee Form */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Add Nominee</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Player name"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <input
              type="text"
              value={newSchoolName}
              onChange={(e) => setNewSchoolName(e.target.value)}
              placeholder="School name"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <select
              value={newSport}
              onChange={(e) => setNewSport(e.target.value as SportId)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {VALID_SPORTS.map((sport) => (
                <option key={sport} value={sport}>
                  {SPORT_META[sport].emoji} {SPORT_META[sport].name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newStatLine}
              onChange={(e) => setNewStatLine(e.target.value)}
              placeholder="Stat line (e.g., 4 TDs, 250 yards)"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <Button variant="primary" onClick={handleAddNominee} className="w-full md:w-auto">
            Add Nominee
          </Button>
        </div>

        {/* Nominees List */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading nominees...</div>
        ) : nominees.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No nominees yet this week</div>
        ) : (
          <div className="space-y-3">
            {nominees.map((nominee, idx) => (
              <div
                key={nominee.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-gold">#{idx + 1}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{nominee.player_name}</p>
                      <p className="text-sm text-gray-600">
                        {nominee.school_name} • {SPORT_META[nominee.sport_id].emoji}{' '}
                        {SPORT_META[nominee.sport_id].name}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">{nominee.stat_line}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-2xl font-bold text-navy">{nominee.vote_count}</div>
                  <p className="text-xs text-gray-600">votes</p>
                  <div className="space-x-2 mt-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleDeclareWinner(nominee.id)}
                    >
                      Declare Winner
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteNominee(nominee.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Winners */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-navy mb-6 font-bebas">Past Winners</h2>

        {winners.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No past winners yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {winners.map((winner) => (
              <div
                key={winner.id}
                className="p-4 border border-gold rounded-lg bg-gold/5 hover:bg-gold/10 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{winner.player_name}</p>
                    <p className="text-sm text-gray-600">{winner.school_name}</p>
                  </div>
                  <Badge variant="sport">{SPORT_META[winner.sport_id].emoji}</Badge>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span>
                    Week {winner.week}, {winner.year}
                  </span>
                  <span>{winner.vote_count} votes</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
