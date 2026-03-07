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
          className="text-gray-400 hover:text-white transition"
        >
          Home
        </Link>

        {/* Items */}
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-gray-600">›</span>
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-400 hover:text-white transition"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-white">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}

export default React.memo(Breadcrumb);
