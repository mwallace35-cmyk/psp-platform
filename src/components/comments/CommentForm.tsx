'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface CommentFormProps {
  articleId: number;
  parentCommentId?: number;
  onCommentAdded: () => void;
  compact?: boolean;
}

export default function CommentForm({ articleId, parentCommentId, onCommentAdded, compact }: CommentFormProps) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please sign in to comment');
        return;
      }

      const { error } = await supabase.from('comments').insert({
        article_id: articleId,
        user_id: user.id,
        parent_comment_id: parentCommentId || null,
        body: body.trim(),
        status: 'pending', // Requires moderation
      });

      if (error) throw error;

      setBody('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      onCommentAdded();
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Could not post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-md p-3 mb-4">
        Your comment has been submitted and will appear after review.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={compact ? 'Write a reply...' : 'Share your thoughts...'}
        rows={compact ? 2 : 3}
        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold resize-none"
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="px-4 py-2 text-sm font-medium rounded-md transition disabled:opacity-50"
          style={{ background: 'var(--psp-gold)', color: 'var(--psp-navy)' }}
        >
          {submitting ? 'Posting...' : compact ? 'Reply' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}
