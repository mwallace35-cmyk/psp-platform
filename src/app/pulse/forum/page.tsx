import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SPORT_META } from '@/lib/sports';
import PulseNav from '@/components/pulse/PulseNav';
import JoinCTA from '@/components/ui/JoinCTA';

export const revalidate = 60;
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: 'Forum — The Pulse | PhillySportsPack.com',
  description: 'The Forum — debates, predictions, trashtalk, and discussions about Philadelphia high school sports.',
  metadataBase: new URL('https://phillysportspack.com'),
  alternates: { canonical: 'https://phillysportspack.com/pulse/forum' },
  robots: { index: true, follow: true },
};

interface ForumPostRow {
  id: string;
  author_name: string;
  author_school_flair: string | null;
  title: string;
  body: string;
  category: string;
  sport_id: string | null;
  is_pinned: boolean;
  is_locked: boolean;
  reply_count: number;
  like_count: number;
  view_count: number;
  last_reply_at: string | null;
  created_at: string;
}

const CATEGORIES = [
  { key: 'all', label: 'All Topics', icon: '📋' },
  { key: 'trashtalk', label: 'Trashtalk', icon: '🗣️' },
  { key: 'debate', label: 'Debate', icon: '⚖️' },
  { key: 'predictions', label: 'Predictions', icon: '🔮' },
  { key: 'recruiting', label: 'Recruiting', icon: '📬' },
  { key: 'throwback', label: 'Throwback', icon: '📸' },
  { key: 'general', label: 'General', icon: '💬' },
];

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-gray-200 text-gray-700',
  trashtalk: 'bg-red-100 text-red-700',
  debate: 'bg-purple-100 text-purple-700',
  predictions: 'bg-blue-100 text-blue-700',
  recruiting: 'bg-green-100 text-green-700',
  throwback: 'bg-amber-100 text-amber-700',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default async function ForumPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sport?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || 'all';
  const sportFilter = params.sport;
  const supabase = createStaticClient();

  let query = supabase
    .from('forum_posts')
    .select('*')
    .is('deleted_at', null)
    .order('is_pinned', { ascending: false })
    .order('last_reply_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(50);

  if (category !== 'all') query = query.eq('category', category);
  if (sportFilter) query = query.eq('sport_id', sportFilter);

  const [postsRes, statsRes] = await Promise.all([
    query,
    Promise.all([
      supabase.from('forum_posts').select('id', { count: 'exact', head: true }).is('deleted_at', null),
      supabase.from('forum_replies').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    ]),
  ]);

  const posts = (postsRes.data ?? []) as ForumPostRow[];
  const [totalPosts, totalReplies] = statsRes;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy via-navy-mid to-navy py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bebas text-white mb-2">The Forum</h1>
          <p className="text-gray-300 text-lg">Debate, predict, talk trash. This is your space.</p>
          <div className="flex gap-6 mt-4 text-sm">
            <span className="text-gold font-bold">{totalPosts.count ?? 0} topics</span>
            <span className="text-gray-400">{totalReplies.count ?? 0} replies</span>
          </div>
        </div>
      </div>

      <PulseNav />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar — Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-4">
              <div className="bg-navy px-4 py-3">
                <h3 className="text-gold font-bebas">Categories</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {CATEGORIES.map(cat => (
                  <Link
                    key={cat.key}
                    href={`/pulse/forum${cat.key === 'all' ? '' : `?category=${cat.key}`}`}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition ${
                      category === cat.key
                        ? 'bg-gold/10 text-navy font-bold border-l-4 border-gold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* New Topic CTA */}
            <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4 text-center">
              <Link href="/signup" className="inline-block w-full px-4 py-2.5 bg-gold text-navy font-bold rounded-md hover:bg-gold/90 transition text-sm">
                Start a Topic
              </Link>
              <p className="text-xs text-gray-500 mt-2">Sign in to post</p>
            </div>

            {/* Join CTA */}
            <div className="mt-4">
              <JoinCTA action="post" context="the forum" compact />
            </div>
          </div>

          {/* Main — Posts */}
          <div className="lg:col-span-3">
            {posts.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-4xl mb-3">🗣️</p>
                <p className="text-gray-700 text-xl font-medium mb-2">
                  {category === 'trashtalk' ? 'The Trashtalk Zone is Ready' : 'No Topics Yet'}
                </p>
                <p className="text-gray-500 mb-4">
                  {category === 'trashtalk'
                    ? 'Be the first to throw shade. Keep it fun, keep it about sports.'
                    : 'Be the first to start a conversation.'}
                </p>
                <Link href="/signup" className="inline-block px-6 py-2.5 bg-navy text-white rounded-md font-medium hover:bg-navy-mid transition">
                  Join & Post
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                {posts.map((post) => {
                  const catColor = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.general;
                  const sportMeta = post.sport_id ? SPORT_META[post.sport_id as keyof typeof SPORT_META] : null;

                  return (
                    <Link key={post.id} href={`/pulse/forum/${post.id}`} className="flex items-start gap-4 p-4 hover:bg-gray-50 transition group">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {post.is_pinned && <span className="text-xs text-gold font-bold uppercase">📌 Pinned</span>}
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${catColor}`}>
                            {post.category}
                          </span>
                          {sportMeta && <span className="text-sm">{sportMeta.emoji}</span>}
                          {post.is_locked && <span className="text-xs text-gray-400">🔒</span>}
                        </div>
                        <h3 className="font-medium text-navy group-hover:text-blue-600 transition truncate">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">{post.author_name}</span>
                          {post.author_school_flair && <span className="text-gray-400"> ({post.author_school_flair})</span>}
                          {' '}&middot; {timeAgo(post.created_at)}
                          {post.last_reply_at && (
                            <span className="text-gray-400"> &middot; last reply {timeAgo(post.last_reply_at)}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-xs text-gray-400 flex-shrink-0 w-16">
                        <span className="font-bold text-navy text-base">{post.reply_count}</span>
                        <span>replies</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
