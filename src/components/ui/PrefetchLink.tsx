'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { prefetchOnHover, prefetchVisible } from '@/lib/prefetch';

/**
 * PrefetchLink - Enhanced Link component with intelligent prefetching
 *
 * Automatically prefetches route data based on user interaction:
 * - hover: prefetch when user hovers over the link
 * - visible: prefetch when link appears in viewport (IntersectionObserver)
 * - none: no prefetching
 *
 * Usage:
 * ```tsx
 * <PrefetchLink href="/football" prefetchStrategy="hover">
 *   Football Hub
 * </PrefetchLink>
 *
 * <PrefetchLink href="/article/123" prefetchStrategy="visible">
 *   Article Link
 * </PrefetchLink>
 * ```
 */

type PrefetchStrategy = 'hover' | 'visible' | 'none';

interface PrefetchLinkProps
  extends React.ComponentPropsWithoutRef<typeof Link> {
  prefetchStrategy?: PrefetchStrategy;
  children: React.ReactNode;
}

export const PrefetchLink = React.memo(
  React.forwardRef<HTMLAnchorElement, PrefetchLinkProps>(
    function PrefetchLink(
      { prefetchStrategy = 'hover', href, children, onMouseEnter, ...props },
      ref
    ) {
      const linkRef = useRef<HTMLAnchorElement>(null);
      const [hasVisiblePrefetch, setHasVisiblePrefetch] = useState(false);

      // Hover-based prefetching
      const handleMouseEnter = useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
          if (prefetchStrategy === 'hover' && typeof href === 'string') {
            prefetchOnHover(href);
          }
          onMouseEnter?.(e);
        },
        [prefetchStrategy, href, onMouseEnter]
      );

      // Viewport-based prefetching using IntersectionObserver
      useEffect(() => {
        if (
          prefetchStrategy !== 'visible' ||
          hasVisiblePrefetch ||
          typeof href !== 'string'
        ) {
          return;
        }

        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0]?.isIntersecting) {
              prefetchVisible(href);
              setHasVisiblePrefetch(true);
              observer.disconnect();
            }
          },
          { rootMargin: '50px' }
        );

        if (linkRef.current) {
          observer.observe(linkRef.current);
        }

        return () => observer.disconnect();
      }, [prefetchStrategy, href, hasVisiblePrefetch]);

      return (
        <Link
          ref={(el) => {
            linkRef.current = el;
            if (typeof ref === 'function') {
              ref(el);
            } else if (ref) {
              ref.current = el;
            }
          }}
          href={href}
          onMouseEnter={handleMouseEnter}
          data-prefetch={prefetchStrategy}
          {...props}
        >
          {children}
        </Link>
      );
    }
  )
);

PrefetchLink.displayName = 'PrefetchLink';

export default PrefetchLink;
