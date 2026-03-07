import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AchievementBadge from '@/components/ui/AchievementBadge';

describe('AchievementBadge', () => {
  it('renders pro badge icon', () => {
    render(<AchievementBadge type="pro" />);
    expect(screen.getByText('⭐')).toBeInTheDocument();
  });

  it('renders champion badge icon', () => {
    render(<AchievementBadge type="champion" />);
    expect(screen.getByText('🏆')).toBeInTheDocument();
  });

  it('renders college badge icon', () => {
    render(<AchievementBadge type="college" />);
    expect(screen.getByText('🎓')).toBeInTheDocument();
  });

  it('renders hall-of-fame badge icon', () => {
    render(<AchievementBadge type="hall-of-fame" />);
    expect(screen.getByText('👑')).toBeInTheDocument();
  });

  it('renders multi-sport badge icon', () => {
    render(<AchievementBadge type="multi-sport" />);
    expect(screen.getByText('🔄')).toBeInTheDocument();
  });

  it('renders as span element', () => {
    const { container } = render(<AchievementBadge type="pro" />);
    const badge = container.querySelector('span');
    expect(badge?.tagName).toBe('SPAN');
  });

  it('has aria-label for accessibility', () => {
    render(<AchievementBadge type="pro" />);
    expect(screen.getByLabelText('Pro Athlete')).toBeInTheDocument();
  });

  it('sm size without label shows only icon', () => {
    const { container } = render(<AchievementBadge type="pro" size="sm" showLabel={false} />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('inline-flex');
    expect(badge).toHaveClass('items-center');
  });

  it('sm size icon styling', () => {
    render(<AchievementBadge type="pro" size="sm" />);
    const icon = screen.getByText('⭐');
    expect(icon).toHaveClass('text-base');
  });

  it('md size with label shows styled badge', () => {
    render(<AchievementBadge type="pro" size="md" showLabel={true} />);
    const badge = screen.getByLabelText('Pro Athlete').closest('span');
    expect(badge).toHaveClass('inline-flex');
    expect(badge).toHaveClass('items-center');
    expect(badge).toHaveClass('gap-1.5');
    expect(badge).toHaveClass('px-2.5');
    expect(badge).toHaveClass('py-1');
  });

  it('md size icon styling', () => {
    render(<AchievementBadge type="pro" size="md" showLabel={true} />);
    const icon = screen.getByText('⭐');
    expect(icon).toHaveClass('text-sm');
  });

  it('applies pro styling', () => {
    render(<AchievementBadge type="pro" size="md" showLabel={true} />);
    const badge = screen.getByLabelText('Pro Athlete').closest('span');
    expect(badge).toHaveClass('bg-yellow-100');
    expect(badge).toHaveClass('text-yellow-700');
  });

  it('applies champion styling', () => {
    render(<AchievementBadge type="champion" size="md" showLabel={true} />);
    const badge = screen.getByLabelText('Champion').closest('span');
    expect(badge).toHaveClass('bg-blue-900');
    expect(badge).toHaveClass('text-yellow-300');
  });

  it('applies college styling', () => {
    render(<AchievementBadge type="college" size="md" showLabel={true} />);
    const badge = screen.getByLabelText('College').closest('span');
    expect(badge).toHaveClass('bg-blue-600');
    expect(badge).toHaveClass('text-white');
  });

  it('applies hall-of-fame styling', () => {
    render(<AchievementBadge type="hall-of-fame" size="md" showLabel={true} />);
    const badge = screen.getByLabelText('Hall of Fame').closest('span');
    expect(badge).toHaveClass('bg-amber-600');
    expect(badge).toHaveClass('text-white');
  });

  it('applies multi-sport styling', () => {
    render(<AchievementBadge type="multi-sport" size="md" showLabel={true} />);
    const badge = screen.getByLabelText('Multi-Sport').closest('span');
    expect(badge).toHaveClass('bg-teal-600');
    expect(badge).toHaveClass('text-white');
  });

  it('does not show label when showLabel is false', () => {
    render(<AchievementBadge type="pro" size="md" showLabel={false} />);
    expect(screen.queryByText('Pro Athlete')).not.toBeInTheDocument();
  });

  it('shows label when showLabel is true', () => {
    render(<AchievementBadge type="pro" size="md" showLabel={true} />);
    expect(screen.getByText('Pro Athlete')).toBeInTheDocument();
  });

  it('has title attribute for sm size without label', () => {
    render(<AchievementBadge type="pro" size="sm" showLabel={false} />);
    const badge = screen.getByLabelText('Pro Athlete');
    expect(badge).toHaveAttribute('title', 'Pro Athlete');
  });

  it('default size is sm', () => {
    const { container } = render(<AchievementBadge type="pro" showLabel={false} />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('inline-flex');
  });

  it('default showLabel is false', () => {
    render(<AchievementBadge type="pro" />);
    expect(screen.queryByText('Pro Athlete')).not.toBeInTheDocument();
  });

  it('sm size can also show label', () => {
    render(<AchievementBadge type="pro" size="sm" showLabel={true} />);
    const badge = screen.getByLabelText('Pro Athlete').closest('span');
    expect(badge).toHaveClass('px-2.5');
  });

  it('renders all badge types', () => {
    const types: Array<'pro' | 'champion' | 'college' | 'hall-of-fame' | 'multi-sport'> = [
      'pro',
      'champion',
      'college',
      'hall-of-fame',
      'multi-sport',
    ];

    types.forEach((type) => {
      const { container } = render(<AchievementBadge type={type} size="md" showLabel={true} />);
      expect(container.querySelector('span')).toBeInTheDocument();
    });
  });

  it('applies text-xs and font-semibold to label text', () => {
    render(<AchievementBadge type="pro" size="md" showLabel={true} />);
    const badge = screen.getByLabelText('Pro Athlete').closest('span');
    expect(badge).toHaveClass('text-xs');
    expect(badge).toHaveClass('font-semibold');
  });

  it('applies rounded-full for md size with label', () => {
    render(<AchievementBadge type="pro" size="md" showLabel={true} />);
    const badge = screen.getByLabelText('Pro Athlete').closest('span');
    expect(badge).toHaveClass('rounded-full');
  });
});
