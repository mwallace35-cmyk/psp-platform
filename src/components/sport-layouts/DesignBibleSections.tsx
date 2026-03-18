'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Props { sport: string; }

interface Leader { name: string; school: string; value: number; }
interface Game { home: string; away: string; homeScore: number; awayScore: number; date: string; }
interface Ranking { school: string; rank: number; }

export default function DesignBibleSections({ sport }: Props) {
  const [leaders, setLeaders] = useState<{rush: Leader|null, pass: Leader|null, rec: Leader|null}>({rush:null,pass:null,rec:null});
  const [games, setGames] = useState<Game[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      try {
        // Top performers
        const statQueries = ['rush_yards','pass_yards','rec_yards'].map(async (stat) => {
          const db = supabase as any;
          const { data } = await db.from('football_player_seasons')
            .select('player_id, ' + stat + ', players!inner(name, schools!inner(name))')
            .not(stat, 'is', null)
            .order(stat, { ascending: false })
            .limit(1);
          if (data?.[0]) {
            const p = Array.isArray(data[0].players) ? data[0].players[0] : data[0].players;
            const s = p?.schools ? (Array.isArray(p.schools) ? p.schools[0] : p.schools) : null;
            return { name: p?.name ?? 'Unknown', school: s?.name ?? '', value: data[0][stat] ?? 0 };
          }
          return null;
        });
        const [rush, pass, rec] = await Promise.all(statQueries);
        setLeaders({ rush, pass, rec });

        // Recent scores
        const { data: gData } = await (supabase as any).from('games')
          .select('home_score, away_score, game_date, home_school_id, away_school_id')
          .not('home_score', 'is', null)
          .not('home_school_id', 'is', null)
          .order('game_date', { ascending: false })
          .limit(5);
        if (gData) {
          const schoolIds = new Set<number>();
          gData.forEach((g: any) => { schoolIds.add(g.home_school_id); schoolIds.add(g.away_school_id); });
          const { data: schools } = await supabase.from('school_names').select('id, name').in('id', Array.from(schoolIds));
          const sm = new Map<number, string>();
          (schools ?? []).forEach((s: any) => sm.set(s.id, s.name));
          setGames(gData.map((g: any) => ({
            home: sm.get(g.home_school_id) ?? 'TBD',
            away: sm.get(g.away_school_id) ?? 'TBD',
            homeScore: g.home_score, awayScore: g.away_score,
            date: g.game_date
          })));
        }

        // Power rankings
        const { data: prData } = await supabase.from('power_rankings')
          .select('school_name, rank')
          .eq('sport', sport)
          .order('rank', { ascending: true })
          .limit(5);
        if (prData) setRankings(prData.map((r: any) => ({ school: r.school_name, rank: r.rank })));
      } catch (e) { console.error('DesignBibleSections error:', e); }
      setLoading(false);
    }
    load();
  }, [sport]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading stats...</div>;

  const headingStyle = { fontFamily: 'var(--font-bebas, "Bebas Neue", sans-serif)', fontSize: '1.25rem', color: '#0a1628', letterSpacing: '1px', marginBottom: '0.75rem' };
  const cardStyle = { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', marginBottom: '0.5rem' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '1.5rem 0', maxWidth: '960px', margin: '0 auto' }}>
      <div>
        <h3 style={headingStyle}>TOP PERFORMERS</h3>
        {leaders.rush && <div style={cardStyle}><strong style={{ color: '#f0a500' }}>Rush:</strong> {leaders.rush.name} ({leaders.rush.value.toLocaleString()} yds)</div>}
        {leaders.pass && <div style={cardStyle}><strong style={{ color: '#f0a500' }}>Pass:</strong> {leaders.pass.name} ({leaders.pass.value.toLocaleString()} yds)</div>}
        {leaders.rec && <div style={cardStyle}><strong style={{ color: '#f0a500' }}>Rec:</strong> {leaders.rec.name} ({leaders.rec.value.toLocaleString()} yds)</div>}
        {rankings.length > 0 && (
          <>
            <h3 style={{ ...headingStyle, marginTop: '1.5rem' }}>POWER RANKINGS</h3>
            {rankings.map((r) => (
              <div key={r.rank} style={cardStyle}>
                <span style={{ display: 'inline-block', width: '28px', height: '28px', borderRadius: '50%', background: '#f0a500', color: '#0a1628', textAlign: 'center', lineHeight: '28px', fontWeight: 700, fontSize: '14px', marginRight: '0.5rem' }}>{r.rank}</span>
                {r.school}
              </div>
            ))}
          </>
        )}
      </div>
      <div>
        <h3 style={headingStyle}>RECENT SCORES</h3>
        {games.length === 0 && <div style={cardStyle}>No recent scores available</div>}
        {games.map((g, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: g.homeScore > g.awayScore ? 700 : 400, color: g.homeScore > g.awayScore ? '#0a1628' : '#64748b' }}>{g.home}</span>
              <span style={{ fontWeight: 700, color: '#f0a500' }}>{g.homeScore}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: g.awayScore > g.homeScore ? 700 : 400, color: g.awayScore > g.homeScore ? '#0a1628' : '#64748b' }}>{g.away}</span>
              <span style={{ fontWeight: 700, color: '#f0a500' }}>{g.awayScore}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}