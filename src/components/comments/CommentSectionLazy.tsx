'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui';

const CommentSection = dynamic(() => import('./CommentSection'), {
  loading: () => (
    <div className="space-y-4">
      <Skeleton height="100px" />
      <Skeleton height="200px" />
      <Skeleton height="150px" />
    </div>
  ),
  ssr: false, // Don't SSR comments for better performance
});

export function CommentSectionLazy({ articleId }: { articleId: number }) {
  return <CommentSection articleId={articleId} />;
}

export default CommentSectionLazy;
