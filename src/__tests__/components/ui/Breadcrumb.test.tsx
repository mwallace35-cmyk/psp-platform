import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Breadcrumb from '@/components/ui/Breadcrumb';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('Breadcrumb', () => {
  const items = [
    { label: 'Teams', href: '/teams' },
    { label: 'Central High', href: '/teams/central-high' },
    { label: 'Football' },
  ];

  it('renders all breadcrumb items', () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Teams')).toBeInTheDocument();
    expect(screen.getByText('Central High')).toBeInTheDocument();
    expect(screen.getByText('Football')).toBeInTheDocument();
  });

  it('renders home link as first item', () => {
    render(<Breadcrumb items={items} />);
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders items with href as links', () => {
    render(<Breadcrumb items={items} />);
    const teamsLink = screen.getByText('Teams').closest('a');
    expect(teamsLink).toHaveAttribute('href', '/teams');
  });

  it('renders items without href as text (not links)', () => {
    render(<Breadcrumb items={items} />);
    const footballItem = screen.getByText('Football');
    expect(footballItem.tagName).not.toBe('A');
    expect(footballItem.tagName).toBe('SPAN');
  });

  it('renders separators between items', () => {
    const { container } = render(<Breadcrumb items={items} />);
    const separators = container.querySelectorAll('.text-gray-600');
    // Should have separators between items
    expect(separators.length).toBeGreaterThan(0);
  });

  it('renders nav with aria-label', () => {
    const { container } = render(<Breadcrumb items={items} />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
  });

  it('includes custom className', () => {
    const { container } = render(<Breadcrumb items={items} className="custom-class" />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('custom-class');
  });

  it('renders JSON-LD schema', () => {
    const { container } = render(<Breadcrumb items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();

    if (script && script.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(items.length);
    }
  });

  it('builds correct JSON-LD schema with positions', () => {
    const { container } = render(<Breadcrumb items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script && script.textContent) {
      const schema = JSON.parse(script.textContent);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[1].position).toBe(2);
      expect(schema.itemListElement[2].position).toBe(3);
    }
  });

  it('includes href in JSON-LD schema when present', () => {
    const { container } = render(<Breadcrumb items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script && script.textContent) {
      const schema = JSON.parse(script.textContent);
      const firstItem = schema.itemListElement[0];
      expect(firstItem.item).toBe('https://phillysportspack.com/teams');
    }
  });

  it('omits item property when href not present in JSON-LD schema', () => {
    const { container } = render(<Breadcrumb items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    if (script && script.textContent) {
      const schema = JSON.parse(script.textContent);
      const lastItem = schema.itemListElement[2];
      expect(lastItem.item).toBeUndefined();
    }
  });

  it('renders single item correctly', () => {
    render(<Breadcrumb items={[{ label: 'Teams', href: '/teams' }]} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Teams')).toBeInTheDocument();
  });

  it('renders with no items', () => {
    render(<Breadcrumb items={[]} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders separators with correct styling', () => {
    const { container } = render(<Breadcrumb items={items} />);
    const separators = container.querySelectorAll('span.text-gray-600');
    // Each separator should be between items
    separators.forEach((sep) => {
      expect(sep).toHaveTextContent('›');
    });
  });
});
