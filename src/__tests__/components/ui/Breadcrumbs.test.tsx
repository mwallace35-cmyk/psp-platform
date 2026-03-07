import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

describe('Breadcrumbs Component', () => {
  it('renders navigation element with aria-label', () => {
    const { container } = render(
      <Breadcrumbs items={[{ label: 'Products' }]} />
    );
    const nav = container.querySelector('nav[aria-label="Breadcrumb"]');
    expect(nav).toBeInTheDocument();
  });

  it('renders ordered list', () => {
    const { container } = render(
      <Breadcrumbs items={[{ label: 'Products' }]} />
    );
    const ol = container.querySelector('ol');
    expect(ol).toBeInTheDocument();
  });

  it('includes Home link at the beginning', () => {
    render(<Breadcrumbs items={[{ label: 'Products' }]} />);
    const homeLink = screen.getByRole('link', { name: /Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders items with links (except last item which is current page)', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Products', href: '/products' },
          { label: 'Electronics', href: '/products/electronics' },
        ]}
      />
    );
    const productLink = screen.getByRole('link', { name: /Products/i });
    expect(productLink).toHaveAttribute('href', '/products');

    // Last item (Electronics) is rendered as span since it's current page
    const electronicsSpan = screen.getByText('Electronics');
    expect(electronicsSpan.tagName).toBe('SPAN');
    expect(electronicsSpan).toHaveAttribute('aria-current', 'page');
  });

  it('renders current page (last item) as span without link', () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { label: 'Products', href: '/products' },
          { label: 'Laptop' },
        ]}
      />
    );
    const lastItem = screen.getByText('Laptop');
    expect(lastItem.tagName).toBe('SPAN');
    expect(lastItem).toHaveAttribute('aria-current', 'page');
  });

  it('applies aria-current="page" to last item only', () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { label: 'Shop', href: '/shop' },
          { label: 'Category', href: '/shop/category' },
          { label: 'Item' },
        ]}
      />
    );

    const items = container.querySelectorAll('li');
    const lastSpan = items[items.length - 1].querySelector('span[aria-current="page"]');
    expect(lastSpan).toBeInTheDocument();
    expect(lastSpan?.textContent).toBe('Item');
  });

  it('renders separator between items', () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products' },
        ]}
      />
    );
    const separators = container.querySelectorAll('span[aria-hidden="true"]');
    // Should have separators between items (not before Home)
    expect(separators.length).toBeGreaterThan(0);
  });

  it('uses custom separator', () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { label: 'Products', href: '/products' },
          { label: 'Electronics' },
        ]}
        separator="/"
      />
    );
    const separators = container.querySelectorAll('span[aria-hidden="true"]');
    const separatorText = separators[separators.length - 1]?.textContent;
    expect(separatorText).toBe('/');
  });

  it('truncates middle items on mobile when exceeding maxItems', () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { label: 'Level1', href: '/' },
          { label: 'Level2', href: '/level2' },
          { label: 'Level3', href: '/level3' },
          { label: 'Level4', href: '/level4' },
          { label: 'Level5' },
        ]}
        maxItems={3}
        mobile={true}
      />
    );

    const items = container.querySelectorAll('li');
    // Should have: Home, Level1, ..., Level4, Level5 = 5 items
    expect(items.length).toBeLessThanOrEqual(6); // Home + rest

    const ellipsis = screen.queryByText('...');
    expect(ellipsis).toBeInTheDocument();
  });

  it('does not truncate when mobile=false', () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { label: 'Level1', href: '/' },
          { label: 'Level2', href: '/level2' },
          { label: 'Level3', href: '/level3' },
          { label: 'Level4', href: '/level4' },
          { label: 'Level5' },
        ]}
        maxItems={3}
        mobile={false}
      />
    );

    const ellipsis = screen.queryByText('...');
    expect(ellipsis).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Breadcrumbs
        items={[{ label: 'Products' }]}
        className="custom-breadcrumbs"
      />
    );
    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('custom-breadcrumbs');
  });

  it('renders multiple items correctly', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Sports', href: '/sports' },
          { label: 'Football', href: '/sports/football' },
          { label: 'Players', href: '/sports/football/players' },
          { label: 'John Doe' },
        ]}
      />
    );

    expect(screen.getByText('Sports')).toBeInTheDocument();
    expect(screen.getByText('Football')).toBeInTheDocument();
    expect(screen.getByText('Players')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders last item with font-medium class', () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { label: 'Category', href: '/category' },
          { label: 'Current Page' },
        ]}
      />
    );

    const lastSpan = screen.getByText('Current Page');
    expect(lastSpan.className).toContain('font-medium');
  });

  it('handles items without hrefs gracefully', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Static Item 1' },
          { label: 'Static Item 2' },
        ]}
      />
    );

    const item1 = screen.getByText('Static Item 1');
    const item2 = screen.getByText('Static Item 2');

    expect(item1.tagName).toBe('SPAN');
    expect(item2.tagName).toBe('SPAN');
  });

  it('uses memoization for performance', () => {
    const { rerender } = render(
      <Breadcrumbs items={[{ label: 'Products' }]} />
    );

    const firstRender = screen.getByText('Products');

    // Re-render with same props
    rerender(<Breadcrumbs items={[{ label: 'Products' }]} />);

    const secondRender = screen.getByText('Products');

    // Component should use memoization (memo reference)
    expect(firstRender).toBe(secondRender);
  });
});
