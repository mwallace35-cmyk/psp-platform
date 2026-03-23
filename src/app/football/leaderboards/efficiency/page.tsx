import { cache } from 'react';
import Link from 'next/link';
import {
  createClient,
  withErrorHandling,
  withRetry,
} from '@/lib/data/common';

export const revalidate = 3600;
export const dynamic = "force-dynamic";
interface EffRow {
  players?: { name?: string | null; slug?: string | null; schools?: { name?: string | null; slug?: string | null } | null } | null;
  rush_yards?: number | null;
  rush_att?: number | null;
  pass_yards?: number | null;
  pass_att?: number | null;
  pass_comp?: number | null;
  rec_yards?: number | null;
  rec_targets?: number | null;
  total_td?: number | null;
  interceptions?: number | null;
}

const getYPCLeaders = cache(async () =>
  withErrorHandling(async () =>
    withRetry(async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from('football_player_seasons')
        .select('rush_yards, rush_att, players(name, slug, schools:schools!players_primary_school_id_fkey(name, slug))')
        .not('rush_att', 'is', null).gt('rush_att', 0)
        .order('rush_yards', { ascending: false }).limit(200);
      return ((data ?? []) as EffRow[])
        .filter(r => (r.rush_att ?? 0) >= 50)
        .map(r => ({
          name: r.players?.name ?? 'Unknown',
          slug: r.players?.slug ?? '',
          school: r.players?.schools?.name ?? '',
          rushYards: r.rush_yards ?? 0,
          rushAtt: r.rush_att ?? 0,
          ypc: ((r.rush_yards ?? 0) / Math.max(r.rush_att ?? 1, 1)).toFixed(2),
        }))
        .sort((a, b) => parseFloat(b.ypc) - parseFloat(a.ypc))
        .slice(0, 25);
    }, { maxRetries: 2, baseDelay: 500 }),
  [], 'EFF_YPC', {}
));

const getCompPctLeaders = cache(async () =>
  withErrorHandling(async () =>
    withRetry(async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from('football_player_seasons')
        .select('pass_yards, pass_att, pass_comp, total_td, interceptions, players(name, slug, schools:schools!players_primary_school_id_fkey(name, slug))')
        .not('pass_att', 'is', null).gt('pass_att', 0)
        .order('pass_att', { ascending: false }).limit(200);
      return ((data ?? []) as EffRow[])
        .filter(r => (r.pass_att ?? 0) >= 50)
        .map(r => ({
          name: r.players?.name ?? 'Unknown',
          slug: r.players?.slug ?? '',
          school: r.players?.schools?.name ?? '',
          passAtt: r.pass_att ?? 0,
          passComp: r.pass_comp ?? 0,
          passYards: r.pass_yards ?? 0,
          tds: r.total_td ?? 0,
          ints: r.interceptions ?? 0,
          compPct: (((r.pass_comp ?? 0) / Math.max(r.pass_att ?? 1, 1)) * 100).toFixed(1),
          tdInt: (r.interceptions ?? 0) > 0 ? ((r.total_td ?? 0) / (r.interceptions ?? 1)).toFixed(2) : String(r.total_td ?? 0),
        }))
        .sort((a, b) => parseFloat(b.compPct) - parseFloat(a.compPct))
        .slice(0, 25);
    }, { maxRetries: 2, baseDelay: 500 }),
  [], 'EFF_COMP', {}
));

const getYPTLeaders = cache(async () =>
  withErrorHandling(async () =>
    withRetry(async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from('football_player_seasons')
        .select('rec_yards, rec_targets, players(name, slug, schools:schools!players_primary_school_id_fkey(name, slug))')
        .not('rec_targets', 'is', null).gt('rec_targets', 0)
        .order('rec_yards', { ascending: false }).limit(200);
      return ((data ?? []) as EffRow[])
        .filter(r => (r.rec_targets ?? 0) >= 20)
        .map(r => ({
          name: r.players?.name ?? 'Unknown',
          slug: r.players?.slug ?? '',
          school: r.players?.schools?.name ?? '',
          recYards: r.rec_yards ?? 0,
          recTargets: r.rec_targets ?? 0,
          ypt: ((r.rec_yards ?? 0) / Math.max(r.rec_targets ?? 1, 1)).toFixed(2),
        }))
        .sort((a, b) => parseFloat(b.ypt) - parseFloat(a.ypt))
        .slice(0, 25);
    }, { maxRetries: 2, baseDelay: 500 }),
  [], 'EFF_YPT', {}
));

export default async function FootballEfficiencyPage() {
  const [ypc, comp, ypt] = await Promise.all([getYPCLeaders(), getCompPctLeaders(), getYPTLeaders()]);

  const TableHeader = ({ cols }: { cols: string[] }) => (
    <thead><tr className="border-b border-[#1a2f4d]">
      {cols.map((c, i) => <th key={i} className={`px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase ${i > 2 ? 'text-right' : ''}`}>{c}</th>)}
    </tr></thead>
  );

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="bg-gradient-to-b from-[#0a1628] to-[#0f1e30] border-b border-[#f0a500]/20 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/football/leaderboards" className="text-[#f0a500] text-sm hover:underline mb-3 inline-block">← Back to Leaderboards</Link>
          <h1 className="text-4xl font-black text-white mb-2">Football Efficiency Stats</h1>
          <p className="text-gray-300">Advanced metrics measuring per-play performance (2024-25 season)</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

        {/* YPC */}
        <section>
          <div className="bg-[#0f1e30] rounded-xl border border-[#1a2f4d] overflow-hidden">
            <div className="bg-gradient-to-r from-[#f0a500] to-[#d4941a] px-6 py-4">
              <h2 className="text-xl font-bold text-[#0a1628]">Yards Per Carry</h2>
              <p className="text-[#0a1628]/70 text-sm">Min. 50 rushing attempts</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <TableHeader cols={['#', 'Player', 'School', 'Att', 'Yds', 'YPC']} />
                <tbody className="divide-y divide-[#1a2f4d]">
                  {ypc.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No data available</td></tr>
                  ) : ypc.map((p, i) => (
                    <tr key={p.slug + i} className="hover:bg-[#1a2f4d]/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 text-sm"><Link href={"/football/players/" + p.slug} className="text-white font-semibold hover:text-[#f0a500]">{p.name}</Link></td>
                      <td className="px-4 py-3 text-sm text-gray-400">{p.school}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-400">{p.rushAtt}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-400">{p.rushYards}</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-[#f0a500]">{p.ypc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* QB Efficiency */}
        <section>
          <div className="bg-[#0f1e30] rounded-xl border border-[#1a2f4d] overflow-hidden">
            <div className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] px-6 py-4">
              <h2 className="text-xl font-bold text-white">QB Efficiency</h2>
              <p className="text-white/70 text-sm">Min. 50 pass attempts</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <TableHeader cols={['#', 'Player', 'School', 'Att', 'Comp%', 'TD:INT']} />
                <tbody className="divide-y divide-[#1a2f4d]">
                  {comp.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No data available</td></tr>
                  ) : comp.map((p, i) => (
                    <tr key={p.slug + i} className="hover:bg-[#1a2f4d]/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 text-sm"><Link href={"/football/players/" + p.slug} className="text-white font-semibold hover:text-[#f0a500]">{p.name}</Link></td>
                      <td className="px-4 py-3 text-sm text-gray-400">{p.school}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-400">{p.passAtt}</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-[#22c55e]">{p.compPct}%</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-[#22c55e]">{p.tdInt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* YPT */}
        <section>
          <div className="bg-[#0f1e30] rounded-xl border border-[#1a2f4d] overflow-hidden">
            <div className="bg-gradient-to-r from-[#a855f7] to-[#7c3aed] px-6 py-4">
              <h2 className="text-xl font-bold text-white">Yards Per Target</h2>
              <p className="text-white/70 text-sm">Min. 20 targets</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <TableHeader cols={['#', 'Player', 'School', 'Tgts', 'Yds', 'YPT']} />
                <tbody className="divide-y divide-[#1a2f4d]">
                  {ypt.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No data available</td></tr>
                  ) : ypt.map((p, i) => (
                    <tr key={p.slug + i} className="hover:bg-[#1a2f4d]/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 text-sm"><Link href={"/football/players/" + p.slug} className="text-white font-semibold hover:text-[#f0a500]">{p.name}</Link></td>
                      <td className="px-4 py-3 text-sm text-gray-400">{p.school}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-400">{p.recTargets}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-400">{p.recYards}</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-[#a855f7]">{p.ypt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
