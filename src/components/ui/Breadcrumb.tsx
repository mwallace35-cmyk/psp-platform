import React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  // Build JSON-LD schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.label,
      ...(item.href && {
        item: `https://phillysportspack.com${item.href}`,
      }),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        className={`flex items-center gap-2 text-sm ${className}`}
        aria-label="Breadcrumb"
      >
        {/* Home link */}
        <Link
          href="/"
          className="dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900 transition"
        >
          Home
        </Link>

        {/* Items */}
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="dark:text-gray-600 text-gray-500">›</span>
            {item.href ? (
              <Link
                href={item.href}
                className="dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900 transition"
              >
                {item.label}
              </Link>
            ) : (
              <span className="dark:text-white text-gray-900">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}

export default React.memo(Breadcrumb);
