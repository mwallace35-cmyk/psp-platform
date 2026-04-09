import { createStaticClient } from '@/lib/supabase/static';
import AnalyticsClient, { type Stats } from './AnalyticsClient';

async function getInitialStats(): Promise<Stats | null> {
  try {
    const supabase = createStaticClient();

    const [
      articlesRes,
      publishedRes,
      draftRes,
      commentsRes,
      pendingCommentsRes,
      approvedCommentsRes,
      correctionsRes,
      pendingCorrectionsRes,
      subscribersRes,
      confirmedSubsRes,
      votesRes,
      nomineesRes,
    ] = await Promise.all([
      supabase.from('articles').select('*', { count: 'exact', head: true }),
      supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
      supabase.from('comments').select('*', { count: 'exact', head: true }),
      supabase.from('comments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('comments').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('corrections').select('*', { count: 'exact', head: true }),
      supabase.from('corrections').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('email_subscribers').select('*', { count: 'exact', head: true }),
      supabase.from('email_subscribers').select('*', { count: 'exact', head: true }).eq('confirmed', true),
      supabase.from('potw_votes').select('*', { count: 'exact', head: true }),
      supabase.from('potw_nominees').select('*', { count: 'exact', head: true }),
    ]);

    return {
      totalArticles: articlesRes.count || 0,
      publishedArticles: publishedRes.count || 0,
      draftArticles: draftRes.count || 0,
      totalComments: commentsRes.count || 0,
      pendingComments: pendingCommentsRes.count || 0,
      approvedComments: approvedCommentsRes.count || 0,
      totalCorrections: correctionsRes.count || 0,
      pendingCorrections: pendingCorrectionsRes.count || 0,
      emailSubscribers: subscribersRes.count || 0,
      confirmedSubscribers: confirmedSubsRes.count || 0,
      potwVotes: votesRes.count || 0,
      potwNominees: nomineesRes.count || 0,
    };
  } catch (err) {
    console.error('[admin/analytics] Failed to fetch initial stats on server:', err);
    return null;
  }
}

export default async function AnalyticsPage() {
  const initialStats = await getInitialStats();
  return <AnalyticsClient initialStats={initialStats} />;
}
