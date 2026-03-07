import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WinLossBar from '@/components/ui/WinLossBar';

describe('WinLossBar', () => {
  it('renders with wins and losses', () => {
    render(<WinLossBar wins={5} losses={3} />);
    expect(screen.getByText('5-3')).toBeInTheDocument();
  });

  it('shows no record message when total is zero', () => {
    render(<WinLossBar wins={0} losses={0} />);
    expect(screen.getByText('No record')).toBeInTheDocument();
  });

  it('has no record text styling', () => {
    render(<WinLossBar wins={0} losses={0} />);
    const noRecord = screen.getByText('No record');
    expect(noRecord).toHaveClass('text-xs');
    expect(noRecord).toHaveClass('text-gray-500');
  });

  it('displays wins and losses label', () => {
    render(<WinLossBar wins={10} losses={5} />);
    expect(screen.getByText('10-5')).toBeInTheDocument();
  });

  it('includes ties in label when ties exist', () => {
    render(<WinLossBar wins={5} losses={3} ties={2} />);
    expect(screen.getByText('5-3-2')).toBeInTheDocument();
  });

  it('does not include ties in label when ties are zero', () => {
    render(<WinLossBar wins={5} losses={3} ties={0} />);
    expect(screen.getByText('5-3')).toBeInTheDocument();
  });

  it('renders progress bar container', () => {
    const { container } = render(<WinLossBar wins={5} losses={5} />);
    const bar = container.querySelector('.flex-1');
    expect(bar).toBeInTheDocument();
  });

  it('renders green segment for wins', () => {
    const { container } = render(<WinLossBar wins={5} losses={0} />);
    const winSegment = container.querySelector('.bg-green-500');
    expect(winSegment).toBeInTheDocument();
  });

  it('renders red segment for losses', () => {
    const { container } = render(<WinLossBar wins={0} losses={5} />);
    const lossSegment = container.querySelector('.bg-red-500');
    expect(lossSegment).toBeInTheDocument();
  });

  it('renders gray segment for ties', () => {
    const { container } = render(<WinLossBar wins={0} losses={0} ties={5} />);
    const tieSegment = container.querySelector('.bg-gray-400');
    expect(tieSegment).toBeInTheDocument();
  });

  it('calculates win percentage correctly', () => {
    const { container } = render(<WinLossBar wins={3} losses={1} />);
    const winSegment = container.querySelector('.bg-green-500');
    expect(winSegment).toHaveStyle({ width: '75%' });
  });

  it('calculates loss percentage correctly', () => {
    const { container } = render(<WinLossBar wins={3} losses={1} />);
    const lossSegment = container.querySelector('.bg-red-500');
    expect(lossSegment).toHaveStyle({ width: '25%' });
  });

  it('calculates percentages with all three outcomes', () => {
    const { container } = render(<WinLossBar wins={5} losses={3} ties={2} />);
    const segments = container.querySelectorAll('[style*="width"]');
    expect(segments.length).toBeGreaterThan(0);
  });

  it('shows label by default', () => {
    render(<WinLossBar wins={5} losses={5} />);
    expect(screen.getByText('5-5')).toBeInTheDocument();
  });

  it('hides label when showLabel is false', () => {
    render(<WinLossBar wins={5} losses={5} showLabel={false} />);
    expect(screen.queryByText('5-5')).not.toBeInTheDocument();
  });

  it('applies custom height', () => {
    const { container } = render(<WinLossBar wins={5} losses={5} height={16} />);
    const bar = container.querySelector('.flex-1 > div');
    expect(bar).toHaveStyle({ height: '16px' });
  });

  it('applies default height of 8px', () => {
    const { container } = render(<WinLossBar wins={5} losses={5} />);
    const bar = container.querySelector('.flex-1 > div');
    expect(bar).toHaveStyle({ height: '8px' });
  });

  it('has rounded and overflow hidden styling', () => {
    const { container } = render(<WinLossBar wins={5} losses={5} />);
    const bar = container.querySelector('.flex-1 > div');
    expect(bar).toHaveClass('rounded-full');
    expect(bar).toHaveClass('overflow-hidden');
  });

  it('applies gray background', () => {
    const { container } = render(<WinLossBar wins={5} losses={5} />);
    const bar = container.querySelector('.flex-1 > div');
    expect(bar).toHaveClass('bg-gray-200');
  });

  it('has flex layout with gap', () => {
    const { container } = render(<WinLossBar wins={5} losses={5} />);
    const itemsWrapper = container.querySelector('.items-center');
    expect(itemsWrapper).toHaveClass('flex');
    expect(itemsWrapper).toHaveClass('gap-2');
  });

  it('displays correct title for win segment', () => {
    const { container } = render(<WinLossBar wins={5} losses={0} />);
    const winSegment = container.querySelector('[title="5 wins"]');
    expect(winSegment).toBeInTheDocument();
  });

  it('displays correct title for loss segment', () => {
    const { container } = render(<WinLossBar wins={0} losses={3} />);
    const lossSegment = container.querySelector('[title="3 losses"]');
    expect(lossSegment).toBeInTheDocument();
  });

  it('displays correct title for tie segment', () => {
    const { container } = render(<WinLossBar wins={0} losses={0} ties={2} />);
    const tieSegment = container.querySelector('[title="2 ties"]');
    expect(tieSegment).toBeInTheDocument();
  });

  it('has transition classes on segments', () => {
    const { container } = render(<WinLossBar wins={5} losses={3} />);
    const winSegment = container.querySelector('.bg-green-500');
    expect(winSegment).toHaveClass('transition-all');
  });

  it('renders label with whitespace-nowrap', () => {
    const { container } = render(<WinLossBar wins={5} losses={5} />);
    const label = container.querySelector('.whitespace-nowrap');
    expect(label).toBeInTheDocument();
  });

  it('renders complete bar with all segments and label', () => {
    render(<WinLossBar wins={5} losses={3} ties={2} showLabel={true} height={10} />);
    expect(screen.getByText('5-3-2')).toBeInTheDocument();
  });

  it('perfect record (all wins)', () => {
    const { container } = render(<WinLossBar wins={10} losses={0} />);
    const winSegment = container.querySelector('.bg-green-500');
    expect(winSegment).toHaveStyle({ width: '100%' });
  });

  it('perfect loss record', () => {
    const { container } = render(<WinLossBar wins={0} losses={10} />);
    const lossSegment = container.querySelector('.bg-red-500');
    expect(lossSegment).toHaveStyle({ width: '100%' });
  });
});
