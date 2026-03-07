'use client';

import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: string;
  maxItems?: number;
  mobile?: boolean;
}

/**
 * Accessible breadcrumb navigation component
 * Renders breadcrumbs in HTML with proper ARIA attributes
 * Supports truncation of middle items on mobile devices
 */
export function Breadcrumbs({
  items,
  className = '',
  separator = '›',
  maxItems = 5,
  mobile = false,
}: BreadcrumbsProps) {
  // Add home link at the beginning
  const allItems: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, ...items];

  // Determine which items to display (truncate middle on mobile if needed)
  let displayItems = allItems;
  if (mobile && allItems.length > maxItems) {
    const firstItem = allItems[0];
    const lastTwoItems = allItems.slice(-2);
    displayItems = [firstItem, { label: '...' }, ...lastTwoItems];
  }

  return (
    <nav
      className={`flex items-center gap-1 text-sm breadcrumbs-nav ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-1">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isTruncation = item.label === '...';

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {/* Separator before item (not before first) */}
              {index > 0 && !isTruncation && (
                <span
                  className="text-gray-400 mx-1"
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}

              {/* Render link or span based on href and position */}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? 'text-white font-medium' : 'text-gray-400'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default React.memo(Breadcrumbs);
