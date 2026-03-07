import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Skeleton, { SkeletonText, SkeletonCard, SkeletonTable, SkeletonAvatar } from '@/components/ui/Skeleton';

describe('Skeleton', () => {
  it('renders skeleton div', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('div');
    expect(skeleton?.tagName).toBe('DIV');
  });

  it('applies base animation styles', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveClass('animate-pulse');
    expect(skeleton).toHaveClass('skeleton');
  });

  it('renders rectangular variant by default', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveClass('rounded-lg');
  });

  it('renders text variant', () => {
    const { container } = render(<Skeleton variant="text" />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveClass('rounded');
    expect(skeleton).toHaveClass('h-4');
  });

  it('renders circular variant', () => {
    const { container } = render(<Skeleton variant="circular" />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('applies custom width', () => {
    const { container } = render(<Skeleton width="200px" />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveStyle({ width: '200px' });
  });

  it('applies custom height', () => {
    const { container } = render(<Skeleton height="100px" />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveStyle({ height: '100px' });
  });

  it('applies both width and height', () => {
    const { container } = render(<Skeleton width="100px" height="100px" />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveStyle({ width: '100px', height: '100px' });
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-class" />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveClass('custom-class');
  });
});

describe('SkeletonText', () => {
  it('renders multiple skeleton lines', () => {
    const { container } = render(<SkeletonText lines={3} />);
    const skeletons = container.querySelectorAll('div > div');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders default 3 lines', () => {
    const { container } = render(<SkeletonText />);
    const lines = container.querySelectorAll('[style*="width"]');
    expect(lines.length).toBeGreaterThanOrEqual(3);
  });

  it('renders custom number of lines', () => {
    const { container } = render(<SkeletonText lines={5} />);
    const wrapper = container.querySelector('div');
    expect(wrapper).toHaveClass('space-y-2');
  });

  it('applies custom width to container', () => {
    const { container } = render(<SkeletonText width="80%" />);
    const wrapper = container.querySelector('div');
    expect(wrapper).toHaveStyle({ width: '80%' });
  });

  it('applies custom className to wrapper', () => {
    const { container } = render(<SkeletonText className="custom" />);
    const wrapper = container.querySelector('div');
    expect(wrapper).toHaveClass('custom');
  });

  it('last line has reduced width', () => {
    const { container } = render(<SkeletonText lines={3} />);
    const skeletons = container.querySelectorAll('div[style*="width"]');
    const lastSkeleton = skeletons[skeletons.length - 1];
    expect(lastSkeleton).toHaveStyle({ width: '80%' });
  });
});

describe('SkeletonCard', () => {
  it('renders skeleton card', () => {
    const { container } = render(<SkeletonCard />);
    const card = container.querySelector('.skeleton-card');
    expect(card).toBeInTheDocument();
  });

  it('shows image skeleton by default', () => {
    const { container } = render(<SkeletonCard />);
    const skeletons = container.querySelectorAll('div[style*="height"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('hides image when showImage is false', () => {
    const { container } = render(<SkeletonCard showImage={false} />);
    const card = container.querySelector('.skeleton-card');
    expect(card?.children.length).toBeLessThan(2);
  });

  it('shows title skeleton by default', () => {
    const { container } = render(<SkeletonCard showTitle={true} />);
    const card = container.querySelector('.skeleton-card');
    expect(card).toBeInTheDocument();
  });

  it('hides title when showTitle is false', () => {
    const { container } = render(<SkeletonCard showTitle={false} />);
    const card = container.querySelector('.skeleton-card');
    expect(card).toBeInTheDocument();
  });

  it('shows description by default', () => {
    const { container } = render(<SkeletonCard showDescription={true} />);
    const card = container.querySelector('.skeleton-card');
    expect(card).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<SkeletonCard className="custom" />);
    const card = container.querySelector('.skeleton-card');
    expect(card).toHaveClass('custom');
  });

  it('renders with all options disabled', () => {
    const { container } = render(
      <SkeletonCard showImage={false} showTitle={false} showDescription={false} />
    );
    const card = container.querySelector('.skeleton-card');
    expect(card).toBeInTheDocument();
  });

  it('has card styling', () => {
    const { container } = render(<SkeletonCard />);
    const card = container.querySelector('.skeleton-card');
    const style = card?.getAttribute('style');
    expect(style).toContain('border-radius');
    expect(style).toContain('border');
  });
});

describe('SkeletonTable', () => {
  it('renders skeleton table', () => {
    const { container } = render(<SkeletonTable />);
    const table = container.querySelector('.skeleton-table');
    expect(table).toBeInTheDocument();
  });

  it('renders default 5 rows', () => {
    const { container } = render(<SkeletonTable />);
    const rows = container.querySelectorAll('[style*="display: flex"]');
    expect(rows.length).toBeGreaterThanOrEqual(5);
  });

  it('renders custom number of rows', () => {
    const { container } = render(<SkeletonTable rows={3} />);
    const table = container.querySelector('.skeleton-table');
    expect(table).toBeInTheDocument();
  });

  it('renders default 4 columns', () => {
    const { container } = render(<SkeletonTable rows={1} />);
    const row = container.querySelector('[style*="display: flex"]');
    expect(row?.children.length).toBeGreaterThanOrEqual(4);
  });

  it('renders custom number of columns', () => {
    const { container } = render(<SkeletonTable rows={1} columns={6} />);
    const row = container.querySelector('[style*="display: flex"]');
    expect(row?.children.length).toBeGreaterThanOrEqual(6);
  });

  it('applies custom className', () => {
    const { container } = render(<SkeletonTable className="custom" />);
    const table = container.querySelector('.skeleton-table');
    expect(table).toHaveClass('custom');
  });

  it('has table styling', () => {
    const { container } = render(<SkeletonTable rows={1} />);
    const table = container.querySelector('.skeleton-table');
    expect(table).toHaveStyle({ width: '100%' });
  });
});

describe('SkeletonAvatar', () => {
  it('renders skeleton avatar', () => {
    const { container } = render(<SkeletonAvatar />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders circular variant', () => {
    const { container } = render(<SkeletonAvatar />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('renders sm size', () => {
    const { container } = render(<SkeletonAvatar size="sm" />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveStyle({ width: '32px', height: '32px' });
  });

  it('renders md size by default', () => {
    const { container } = render(<SkeletonAvatar />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveStyle({ width: '48px', height: '48px' });
  });

  it('renders lg size', () => {
    const { container } = render(<SkeletonAvatar size="lg" />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveStyle({ width: '64px', height: '64px' });
  });

  it('applies custom className', () => {
    const { container } = render(<SkeletonAvatar className="custom" />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveClass('custom');
  });

  it('combines size and custom className', () => {
    const { container } = render(<SkeletonAvatar size="lg" className="extra" />);
    const skeleton = container.querySelector('div');
    expect(skeleton).toHaveStyle({ width: '64px' });
    expect(skeleton).toHaveClass('extra');
  });
});
