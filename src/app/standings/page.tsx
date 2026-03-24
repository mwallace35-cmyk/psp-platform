import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const metadata: Metadata = {
  title: 'Standings | Philadelphia High School Sports',
  description: 'Current season standings for Philadelphia high school sports.',
};

export const revalidate = 3600;
export const dynamic = "force-dynamic";
const SPORT_NAMES: Record<number, string> = {
  1: 'Football',
  2: 'Basketball',
  3: 'Baseball',
  4: 'Soccer',
  5: 'Lacrosse',
  6: 'Track & Field',
  7: 'Wrestling',
};

async function getStandings() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: latestSeason } = await supabase
    .from('seasons')
    .select('id, year')
    .order('year', { ascending: false })
    .limit(1)
    .single();
  if (!latestSeason) return null;
  const { data: records } = await supabase
    .from('team_seasons')
    .select('school_id, sport_id, wins, losses, ties, win_pct, league_wins, league_losses, schools(name, slug)')
    .eq('season_id', latestSeason.id)
    .order('win_pct', { ascending: false });
  return { season: latestSeason, records: records ?? [] };
}

export default async function StandingsPage() {
  const data = await getStandings();
  if (!data || data.records.length === 0) {
    return (
      <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h1 className="psp-h1" style={{ color: 'var(--psp-navy)' }}>
          Standings
        </h1>
        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{"\u{1F3C6}"}</div>
          <p style={{ color: "var(--psp-muted)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>Standings will be available once the season begins.</p>
          <p style={{ color: "var(--psp-muted)", fontSize: "0.85rem" }}>Check back when games are underway for live W-L records and conference standings.</p>
        </div>
      </main>
    );
  }
  const bySport: Record<number, typeof data.records> = {};
  for (const r of data.records) {
    if (!bySport[r.sport_id]) bySport[r.sport_id] = [];
    bySport[r.sport_id].push(r);
  }
  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 className="psp-h1" style={{ color: 'var(--psp-navy)', marginBottom: '0.25rem' }}>
        Standings
      </h1>
      <p style={{ color: 'var(--psp-muted)', marginBottom: '2rem' }}>{data.season.year} Season</p>
      {Object.entries(bySport).map(([sportIdStr, teams]) => {
        const sportId = Number(sportIdStr);
        return (
          <section key={sportId} style={{ marginBottom: '2.5rem' }}>
            <h2 className="psp-h2" style={{ color: 'var(--psp-navy)', borderBottom: '2px solid var(--psp-gold)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              {SPORT_NAMES[sportId]}
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--psp-navy)', color: '#fff' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem' }}>School</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>W</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>L</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>Win%</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>League W</th>
                  <th style={{ padding: '0.5rem 0.75rem' }}>League L</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, i) => {
                  const school = (team.schools as Array<{ name: string; slug: string }>)[0] ?? null;
                  return (
                    <tr key={team.school_id} style={{ background: i % 2 === 0 ? '#fff' : 'var(--psp-card-bg)' }}>
                      <td style={{ padding: '0.5rem 0.75rem' }}>
                        {school ? (
                          <Link href={'/schools/' + school.slug} style={{ color: 'var(--psp-navy)', fontWeight: 600 }}>
                            {school.name}
                          </Link>
                        ) : <span>Unknown</span>}
                      </td>
                      <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem' }}>{team.wins ?? 0}</td>
                      <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem' }}>{team.losses ?? 0}</td>
                      <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem' }}>
                        {team.win_pct != null ? String(Math.round(team.win_pct * 100)) + '%' : '--'}
                      </td>
                      <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem' }}>{team.league_wins ?? 0}</td>
                      <td style={{ textAlign: 'center', padding: '0.5rem 0.75rem' }}>{team.league_losses ?? 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        );
      })}
    </main>
  );
}
