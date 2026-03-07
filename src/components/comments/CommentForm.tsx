'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { captureError } from '@/lib/error-tracking';

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
  const [error, setError] = useState('');
  const bodyInputRef = useRef<HTMLTextAreaElement>(null);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!body.trim()) {
      setError('Comment cannot be empty');
      // Focus the textarea when there's an error
      bodyInputRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Please sign in to comment');
        return;
      }

      const { error: submitError } = await supabase.from('comments').insert({
        article_id: articleId,
        user_id: user.id,
        parent_comment_id: parentCommentId || null,
        body: body.trim(),
        status: 'pending', // Requires moderation
      });

      if (submitError) throw submitError;

      setBody('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      onCommentAdded();
    } catch (err) {
      captureError(err, { component: 'CommentForm', articleId: String(articleId) });
      setError('Could not post comment. Please try again.');
      // Focus the textarea when there's an error
      bodyInputRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border-2 border-green-500 text-green-800 text-sm rounded-md p-3 mb-4 flex items-start gap-3 animate-in fade-in duration-300" role="alert">
        <span className="text-lg font-bold flex-shrink-0 mt-0.5">✓</span>
        <span className="flex-1">Your comment has been submitted and will appear after review.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6" noValidate>
      {error && (
        <div id="comment-error" className="bg-red-50 border-2 border-red-500 text-red-800 text-sm rounded-md p-3 mb-3 flex items-start gap-3 animate-in shake-in duration-300" role="alert" aria-live="assertive">
          <span className="text-lg font-bold flex-shrink-0 mt-0.5">!</span>
          <span className="flex-1">{error}</span>
        </div>
      )}
      <div>
        <label htmlFor="comment-body" className="block text-sm font-medium text-gray-700 mb-1">
          Comment <span aria-label="required" className="text-red-500">*</span>
        </label>
        <textarea
          ref={bodyInputRef}
          id="comment-body"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            if (error) {
              setError('');
            }
          }}
          placeholder={compact ? 'Write a reply...' : 'Share your thoughts...'}
          rows={compact ? 2 : 3}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'comment-error' : undefined}
          aria-required="true"
          required
          className={`w-full px-4 py-2 text-sm border-2 rounded-md focus:outline-2 focus:outline-offset-0 focus:outline-blue-400 resize-none min-h-[44px] transition-colors ${
            error
              ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-600'
              : 'border-gray-300 focus:border-blue-500'
          }`}
        />
      </div>
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="px-4 py-2 text-sm font-medium rounded-md transition disabled:opacity-50 min-h-[44px] flex items-center focus:outline-2 focus:outline-offset-2 focus:outline-blue-400"
          style={{ background: 'var(--psp-gold)', color: 'var(--psp-navy)' }}
        >
          {submitting ? 'Posting...' : compact ? 'Reply' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}
