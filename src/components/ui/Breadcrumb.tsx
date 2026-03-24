import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: string;
  maxItems?: number;
  mobile?: boolean;
  includeSchema?: boolean;
}

function Breadcrumb({
  items,
  className = '',
  separator = '›',
  maxItems = 5,
  mobile = false,
  includeSchema = true,
}: BreadcrumbProps) {
  // Add home link at the beginning
  const allItems: BreadcrumbItem[] = [{ label: 'Home', href: '/' }, ...items];

  // Determine which items to display (truncate middle on mobile if needed)
  let displayItems = allItems;
  if (mobile && allItems.length > maxItems) {
    const firstItem = allItems[0];
    const lastTwoItems = allItems.slice(-2);
    displayItems = [firstItem, { label: '...' }, ...lastTwoItems];
  }

  // Build JSON-LD schema (only for non-truncated breadcrumbs)
  const jsonLd = includeSchema ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      ...(item.href && {
        item: `https://phillysportspack.com${item.href}`,
      }),
    })),
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <nav
        className={`flex items-center gap-1 text-sm ${className}`}
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
                    className="dark:text-gray-600 text-gray-400 mx-1"
                    aria-hidden="true"
                  >
                    {separator}
                  </span>
                )}

                {/* Render link or span based on href and position */}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="dark:text-gray-300 text-gray-600 hover:dark:text-white hover:text-gray-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={isLast ? 'dark:text-white text-gray-900 font-medium' : 'dark:text-gray-300 text-gray-600'}
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
    </>
  );
}

export default React.memo(Breadcrumb);
