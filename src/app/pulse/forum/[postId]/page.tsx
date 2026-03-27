import { createStaticClient } from '@/lib/supabase/static';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SPORT_META } from '@/lib/sports';
import PulseNav from '@/components/pulse/PulseNav';

export const revalidate = 60;
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
  created_at: string;
}

interface ForumReplyRow {
  id: string;
  author_name: string;
  author_school_flair: string | null;
  body: string;
  like_count: number;
  created_at: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-gray-200 text-gray-700',
  trashtalk: 'bg-red-100 text-red-700',
  debate: 'bg-purple-100 text-purple-700',
  predictions: 'bg-blue-100 text-blue-700',
  recruiting: 'bg-green-100 text-green-700',
  throwback: 'bg-amber-100 text-amber-700',
};

export async function generateMetadata({ params }: { params: Promise<{ postId: string }> }): Promise<Metadata> {
  const { postId } = await params;
  const supabase = createStaticClient();
  const { data } = await supabase
    .from('forum_posts')
    .select('title')
    .eq('id', postId)
    .is('deleted_at', null)
    .single();

  return {
    title: data ? `${data.title} — Forum | PhillySportsPack.com` : 'Forum | PhillySportsPack.com',
    alternates: { canonical: `https://phillysportspack.com/pulse/forum/${postId}` },
    robots: { index: true, follow: true },
  };
}

export default async function ForumPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const supabase = createStaticClient();

  const [postRes, repliesRes] = await Promise.all([
    supabase
      .from('forum_posts')
      .select('*')
      .eq('id', postId)
      .is('deleted_at', null)
      .single(),
    supabase
      .from('forum_replies')
      .select('*')
      .eq('post_id', postId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true }),
  ]);

  if (!postRes.data) return notFound();

  const post = postRes.data as ForumPostRow;
  const replies = (repliesRes.data ?? []) as ForumReplyRow[];
  const catColor = CATEGORY_COLORS[post.category] || CATEGORY_COLORS.general;
  const sportMeta = post.sport_id ? SPORT_META[post.sport_id as keyof typeof SPORT_META] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-navy via-navy-mid to-navy py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/pulse/forum" className="text-gray-300 hover:text-gold text-sm mb-3 inline-block">
            &larr; Back to Forum
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${catColor}`}>{post.category}</span>
            {sportMeta && <span>{sportMeta.emoji}</span>}
            {post.is_pinned && <span className="text-gold text-xs font-bold">📌 PINNED</span>}
            {post.is_locked && <span className="text-gray-300 text-xs">🔒 LOCKED</span>}
          </div>
          <h1 className="psp-h1 text-white">{post.title}</h1>
        </div>
      </div>

      <PulseNav />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Original Post */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-gold font-bold text-sm">
              {post.author_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-navy">
                {post.author_name}
                {post.author_school_flair && (
                  <span className="text-gray-300 font-normal text-sm ml-1">({post.author_school_flair})</span>
                )}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {post.body}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-400">
            <span>👁 {post.view_count} views</span>
            <span>💬 {post.reply_count} replies</span>
          </div>
        </div>

        {/* Replies */}
        {replies.length > 0 && (
          <div className="space-y-4">
            <h2 className="psp-h3 text-navy">Replies ({replies.length})</h2>
            {replies.map((reply) => (
              <div key={reply.id} className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">
                    {reply.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-navy text-sm">
                      {reply.author_name}
                      {reply.author_school_flair && (
                        <span className="text-gray-300 font-normal ml-1">({reply.author_school_flair})</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(reply.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {reply.body}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply CTA */}
        {post.is_locked ? (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center text-gray-400 text-sm">
            🔒 This topic is locked. No new replies.
          </div>
        ) : (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6 text-center">
            <p className="text-gray-700 font-medium mb-2">Want to reply?</p>
            <Link href="/signup" className="inline-block px-6 py-2.5 bg-navy text-white rounded-md font-medium hover:bg-navy-mid transition text-sm">
              Sign In to Reply
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
