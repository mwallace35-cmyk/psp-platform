'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import CommentForm from './CommentForm';

interface Comment {
  id: number;
  body: string;
  parent_comment_id: number | null;
  user_id: string;
  status: string;
  created_at: string;
  user_profile?: {
    display_name: string;
    avatar_url: string | null;
    school_affiliation: string | null;
  };
  replies?: Comment[];
}

interface CommentSectionProps {
  articleId: number;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchComments();
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function fetchComments() {
    setLoading(true);
    try {
      // Query comments without joining user_profiles (no FK exists).
      // Column is parent_id in the DB schema, not parent_comment_id.
      const { data, error } = await supabase
        .from('comments')
        .select('id, body, parent_id, user_id, status, created_at')
        .eq('article_id', articleId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Build tree structure
      const commentMap = new Map<number, Comment>();
      const rootComments: Comment[] = [];

      for (const c of (data || [])) {
        const comment: Comment = {
          ...c,
          parent_comment_id: (c as Record<string, unknown>).parent_id as number | null,
          replies: [],
        };
        commentMap.set(c.id, comment);
      }

      for (const c of commentMap.values()) {
        if (c.parent_comment_id && commentMap.has(c.parent_comment_id)) {
          commentMap.get(c.parent_comment_id)!.replies!.push(c);
        } else {
          rootComments.push(c);
        }
      }

      setComments(rootComments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleCommentAdded() {
    fetchComments();
    setReplyingTo(null);
  }

  function renderComment(comment: Comment, depth: number = 0) {
    const profile = comment.user_profile;
    const maxDepth = 3;

    return (
      <div
        key={comment.id}
        className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}
      >
        <div className="py-3">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'var(--psp-navy)', color: 'var(--psp-gold)' }}
            >
              {(profile?.display_name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-gray-900">
                  {profile?.display_name || 'Anonymous'}
                </span>
                {profile?.school_affiliation && (
                  <span className="text-xs text-gray-400">{profile.school_affiliation}</span>
                )}
                <span className="text-xs text-gray-300">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.body}</p>
              {user && depth < maxDepth && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="text-xs mt-1 hover:underline"
                  style={{ color: 'var(--psp-gold)' }}
                >
                  {replyingTo === comment.id ? 'Cancel' : 'Reply'}
                </button>
              )}
            </div>
          </div>

          {/* Reply form */}
          {replyingTo === comment.id && (
            <div className="ml-11 mt-2">
              <CommentForm
                articleId={articleId}
                parentCommentId={comment.id}
                onCommentAdded={handleCommentAdded}
                compact
              />
            </div>
          )}
        </div>

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div>
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h2
        className="psp-h2 mb-6"
        style={{ color: 'var(--psp-navy)' }}
      >
        Comments
      </h2>

      {/* New comment form */}
      {user ? (
        <CommentForm articleId={articleId} onCommentAdded={handleCommentAdded} />
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center mb-6">
          <p className="text-sm text-gray-600">
            <a href="/login" className="font-medium hover:underline" style={{ color: 'var(--psp-gold)' }}>Sign in</a>
            {' '}or{' '}
            <a href="/signup" className="font-medium hover:underline" style={{ color: 'var(--psp-gold)' }}>create an account</a>
            {' '}to join the conversation.
          </p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <p className="text-gray-400 text-sm py-4">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm py-4">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {comments.map((c) => renderComment(c))}
        </div>
      )}
    </div>
  );
}
