'use client';

import React, { Suspense, ReactNode } from 'react';

/**
 * StreamingWrapper - Generic Suspense wrapper for streaming SSR
 *
 * Wraps components that fetch data with appropriate loading fallback.
 * Enables independent streaming of page sections for better perceived performance.
 *
 * Usage:
 * ```tsx
 * <StreamingWrapper fallback={<LoadingSkeleton />}>
 *   <ExpensiveComponent />
 * </StreamingWrapper>
 * ```
 */

interface StreamingWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

export const StreamingWrapper = React.memo(function StreamingWrapper({
  children,
  fallback,
  className = '',
}: StreamingWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      <div className={className}>
        {children}
      </div>
    </Suspense>
  );
});

export default StreamingWrapper;
