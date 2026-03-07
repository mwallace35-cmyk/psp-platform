'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui';

interface CommentWithMeta {
  id: number;
  body: string;
  status: string;
  created_at: string;
  article_id: number;
  user_id: string;
  parent_comment_id: number | null;
  articles?: { title: string; slug: string };
  user_profiles?: { display_name: string; school_affiliation: string | null };
  flags_count?: number;
}

export default function CommentsModeration() {
  const [comments, setComments] = useState<CommentWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');

  const supabase = createClient();

  useEffect(() => {
    fetchComments();
  }, [statusFilter]);

  async function fetchComments() {
    setLoading(true);
    try {
      let query = supabase
        .from('comments')
        .select(`
          id, body, status, created_at, article_id, user_id, parent_comment_id,
          articles(title, slug),
          user_profiles:user_id(display_name, school_affiliation)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setComments(
        (data || []).map((c) => ({
          ...c,
          articles: Array.isArray(c.articles) ? c.articles[0] : c.articles,
          user_profiles: Array.isArray(c.user_profiles) ? c.user_profiles[0] : c.user_profiles,
        })) as CommentWithMeta[]
      );
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleModerate(id: number, newStatus: 'approved' | 'rejected') {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      fetchComments();
    } catch (err) {
      console.error('Error moderating comment:', err);
    }
  }

  async function handleBulkApprove() {
    const pendingIds = comments.filter((c) => c.status === 'pending').map((c) => c.id);
    if (pendingIds.length === 0) return;

    if (!window.confirm(`Approve all ${pendingIds.length} pending comments?`)) return;

    try {
      const { error } = await supabase
        .from('comments')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .in('id', pendingIds);

      if (error) throw error;
      fetchComments();
    } catch (err) {
      console.error('Error bulk approving:', err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Comment Moderation</h1>
          <p className="text-gray-600">Review and moderate community comments</p>
        </div>
        {statusFilter === 'pending' && comments.length > 0 && (
          <Button variant="primary" onClick={handleBulkApprove}>
            Approve All ({comments.length})
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['pending', 'approved', 'rejected', 'all'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              statusFilter === s
                ? 'bg-navy text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No {statusFilter !== 'all' ? statusFilter : ''} comments to review.
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* User & article info */}
                  <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                    <span className="font-semibold text-gray-900">
                      {c.user_profiles?.display_name || 'Anonymous'}
                    </span>
                    {c.user_profiles?.school_affiliation && (
                      <span>({c.user_profiles.school_affiliation})</span>
                    )}
                    <span>on</span>
                    {c.articles ? (
                      <a
                        href={`/articles/${c.articles.slug}`}
                        target="_blank"
                        className="font-medium text-blue-600 hover:underline truncate"
                      >
                        {c.articles.title}
                      </a>
                    ) : (
                      <span>Article #{c.article_id}</span>
                    )}
                    <span>{new Date(c.created_at).toLocaleString()}</span>
                  </div>

                  {/* Comment body */}
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.body}</p>

                  {c.parent_comment_id && (
                    <p className="text-xs text-gray-400 mt-1">Reply to comment #{c.parent_comment_id}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  {c.status === 'pending' && (
                    <>
                      <Button variant="primary" size="sm" onClick={() => handleModerate(c.id, 'approved')}>
                        Approve
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleModerate(c.id, 'rejected')}>
                        Reject
                      </Button>
                    </>
                  )}
                  {c.status === 'approved' && (
                    <Button variant="secondary" size="sm" onClick={() => handleModerate(c.id, 'rejected')}>
                      Remove
                    </Button>
                  )}
                  {c.status === 'rejected' && (
                    <Button variant="primary" size="sm" onClick={() => handleModerate(c.id, 'approved')}>
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
