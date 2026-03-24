import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient, withErrorHandling, withRetry } from '@/lib/data/common';

export const revalidate = 3600;
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: 'This Week in PSP History | PhillySportsPack',
  description: '141 seasons of Philadelphia high school sports history — championships, records, and legends.',
};

const MOMENTS = [
  { year: 2008, title: 'Imhotep Wins First State Football Title', desc: 'Imhotep Charter became one of the first Philadelphia schools to capture a PIAA state football championship.', sport: 'Football' },
  { year: 1991, title: 'Roman Catholic Basketball Dynasty', desc: 'Roman Catholic completed one of the most dominant stretches in Catholic League history, winning their 4th consecutive title.', sport: 'Basketball' },
  { year: 2003, title: 'Philadelphia Produces Record NBA Draft Class', desc: 'Four players from Philly high schools were selected in a single NBA Draft, continuing the city unmatched pipeline to the pros.', sport: 'Basketball' },
  { year: 1967, title: 'West Philly Baseball Championship', desc: 'West Philadelphia High School captured the Public League baseball title at the height of the city most competitive baseball era.', sport: 'Baseball' },
  { year: 2015, title: 'La Salle Track and Field Record Season', desc: 'La Salle produced multiple All-State track athletes in a single season, their best performance in the modern era.', sport: 'Track & Field' },
];

interface ChampRow { school_name: string; school_slug: string; sport: string; year_start: number; }

async function getChampions(): Promise<ChampRow[]> {
  return withErrorHandling(async () =>
    withRetry(async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from('championships')
        .select('sport, schools!inner(name, slug), seasons!inner(year_start)')
        .order('id', { ascending: false }).limit(24);
      if (!data) return [];
      return data.map((r: any) => ({
        school_name: r.schools?.name ?? 'Unknown', school_slug: r.schools?.slug ?? '',
        sport: r.sport ?? 'Unknown', year_start: r.seasons?.year_start ?? 0,
      }));
    }, { maxRetries: 2, baseDelay: 500 }),
  [], 'HISTORY_CHAMPS', {}
  );
}

interface ArticleRow { title: string; slug: string; excerpt: string | null; published_at: string | null; }

async function getArticles(): Promise<ArticleRow[]> {
  return withErrorHandling(async () =>
    withRetry(async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from('articles').select('title, slug, excerpt, published_at')
        .order('published_at', { ascending: false }).limit(6);
      return (data ?? []) as ArticleRow[];
    }, { maxRetries: 2, baseDelay: 500 }),
  [], 'HISTORY_ARTICLES', {}
  );
}

const SPORT_EMOJI: Record<string, string> = {
  football: '🏈', basketball: '🏀', baseball: '⚾', soccer: '⚽',
  lacrosse: '🥍', wrestling: '🤼', 'track-and-field': '🏃',
};

export default async function HistoryPage() {
  const [champions, articles] = await Promise.all([getChampions(), getArticles()]);

  const bySport: Record<string, ChampRow[]> = {};
  for (const c of champions) {
    if (!bySport[c.sport]) bySport[c.sport] = [];
    bySport[c.sport].push(c);
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <div className="bg-gradient-to-b from-[#0a1628] to-[#0f1e30] border-b border-[#f0a500]/20 py-14 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#f0a500] text-sm font-semibold uppercase tracking-widest mb-3">Archive</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">This Week in PSP History</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">141 seasons. 55,000+ players. 1,700+ championships. The moments that made Philadelphia high school sports legendary.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">

        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><span>⭐</span> Legendary Moments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOMENTS.map(m => (
              <div key={m.title} className="bg-[#0f1e30] border border-[#1a2f4d] rounded-lg p-5 hover:border-[#f0a500]/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#f0a500] text-sm font-bold">{m.sport}</span>
                  <span className="ml-auto text-gray-400 text-sm">{m.year}</span>
                </div>
                <h3 className="text-white font-bold mb-2">{m.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {Object.keys(bySport).length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><span aria-hidden="true">🏆</span> Recent Champions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Object.keys(bySport).slice(0, 6).map(sport => (
                <div key={sport} className="bg-[#0f1e30] border border-[#1a2f4d] rounded-lg p-5">
                  <h3 className="text-[#f0a500] font-bold text-lg mb-3 capitalize flex items-center gap-2">
                    <span aria-hidden="true">{SPORT_EMOJI[sport.toLowerCase()] ?? '🏅'}</span> {sport}
                  </h3>
                  <div className="space-y-2">
                    {bySport[sport].slice(0, 3).map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <Link href={"/schools/" + c.school_slug} className="text-white hover:text-[#f0a500] transition-colors font-medium">{c.school_name}</Link>
                        <span className="text-gray-300">{c.year_start}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><span>📰</span> From the Archive</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map(a => (
                <Link key={a.slug} href={"/news/" + a.slug} className="block bg-[#0f1e30] border border-[#1a2f4d] rounded-lg p-5 hover:border-[#f0a500]/30 transition-colors group">
                  <h3 className="text-white font-bold mb-2 group-hover:text-[#f0a500] transition-colors line-clamp-2">{a.title}</h3>
                  {a.excerpt && <p className="text-gray-300 text-sm line-clamp-2 mb-3">{a.excerpt}</p>}
                  {a.published_at && <p className="text-gray-400 text-xs">{new Date(a.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="bg-gradient-to-r from-[#f0a500]/10 to-[#0f1e30] border border-[#f0a500]/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Explore the Full Archive</h2>
          <p className="text-gray-300 mb-6">141 seasons. 49,000+ games. 1,733 championships.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/leaderboards" className="px-6 py-3 bg-[#f0a500] text-[#0a1628] font-bold rounded-lg hover:bg-[#f0a500]/90 transition-colors">View Leaderboards</Link>
            <Link href="/schools" className="px-6 py-3 border border-gray-600 text-gray-300 font-bold rounded-lg hover:border-gray-400 transition-colors">Browse Schools</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
