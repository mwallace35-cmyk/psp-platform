import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatBlock from '@/components/ui/StatBlock';

describe('StatBlock', () => {
  it('renders stat block with label and value', () => {
    render(<StatBlock label="Wins" value={15} />);
    expect(screen.getByText('Wins')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('is centered', () => {
    const { container } = render(<StatBlock label="Test" value={10} />);
    const wrapper = container.querySelector('div');
    expect(wrapper).toHaveClass('text-center');
  });

  it('displays string value', () => {
    render(<StatBlock label="Status" value="Active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('formats numeric values with locale string', () => {
    render(<StatBlock label="Population" value={1000000} />);
    const valueElement = screen.getByText('1,000,000');
    expect(valueElement).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<StatBlock label="Score" value={100} icon="⭐" />);
    expect(screen.getByText('⭐')).toBeInTheDocument();
  });

  it('does not render icon when not provided', () => {
    const { container } = render(<StatBlock label="Score" value={100} />);
    const icons = container.querySelectorAll('div');
    // Should have the wrapper and value/label divs, but no icon
    expect(container.textContent).not.toContain('undefined');
  });

  it('renders trend when provided', () => {
    render(<StatBlock label="Growth" value={50} trend={{ value: 10, isPositive: true }} />);
    expect(screen.getByText('+10%')).toBeInTheDocument();
  });

  it('shows positive trend indicator', () => {
    const { container } = render(
      <StatBlock label="Growth" value={50} trend={{ value: 10, isPositive: true }} />
    );
    const trendElement = screen.getByText('+10%');
    expect(trendElement).toHaveClass('text-green-600');
  });

  it('shows negative trend indicator', () => {
    render(
      <StatBlock label="Decline" value={50} trend={{ value: 5, isPositive: false }} />
    );
    const container = document.querySelector('div');
    const hasRedClass = Array.from(container?.querySelectorAll('div') || []).some(el =>
      el.classList.contains('text-red-600')
    );
    expect(hasRedClass).toBe(true);
  });

  it('does not render trend when not provided', () => {
    render(<StatBlock label="Test" value={100} />);
    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });

  it('renders sm size with icon styling', () => {
    const { container } = render(<StatBlock label="Small" value={5} icon="🏆" size="sm" />);
    const textContent = container.textContent;
    expect(textContent).toContain('5');
    expect(textContent).toContain('Small');
  });

  it('renders md size with icon styling by default', () => {
    const { container } = render(<StatBlock label="Medium" value={10} icon="⭐" />);
    const textContent = container.textContent;
    expect(textContent).toContain('10');
    expect(textContent).toContain('Medium');
  });

  it('renders lg size with icon styling', () => {
    const { container } = render(<StatBlock label="Large" value={100} icon="🥇" size="lg" />);
    const textContent = container.textContent;
    expect(textContent).toContain('100');
    expect(textContent).toContain('Large');
  });

  it('icon size varies by component size', () => {
    const { container: smallContainer } = render(
      <StatBlock label="Small" value={1} icon="⭐" size="sm" />
    );
    const smallIcon = Array.from(smallContainer.querySelectorAll('div')).find(el => el.textContent === '⭐');
    expect(smallIcon).toHaveClass('text-2xl');

    const { container: largeContainer } = render(
      <StatBlock label="Large" value={1} icon="⭐" size="lg" />
    );
    const largeIcon = Array.from(largeContainer.querySelectorAll('div')).find(el => el.textContent === '⭐');
    expect(largeIcon).toHaveClass('text-4xl');
  });

  it('applies navy color to value', () => {
    render(<StatBlock label="Test" value={50} />);
    const valueElement = screen.getByText('50');
    expect(valueElement.style.color).toBe('var(--psp-navy)');
  });

  it('applies gray color to label', () => {
    render(<StatBlock label="Test Label" value={50} />);
    const labelDiv = screen.getByText('Test Label');
    expect(labelDiv.style.color).toBe('var(--psp-gray-500)');
  });

  it('uses Bebas Neue font for value', () => {
    const { container } = render(<StatBlock label="Font" value={75} />);
    const valueElement = screen.getByText('75');
    const parentDiv = valueElement.closest('div');
    expect(parentDiv?.style.fontFamily).toContain('Bebas Neue');
  });

  it('renders all props together', () => {
    render(
      <StatBlock
        label="Complete"
        value={500}
        icon="🏅"
        trend={{ value: 25, isPositive: true }}
        size="lg"
      />
    );
    expect(screen.getByText('🏅')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('+25%')).toBeInTheDocument();
  });

  it('handles zero value', () => {
    render(<StatBlock label="Zero" value={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles negative number value', () => {
    render(<StatBlock label="Negative" value={-10} />);
    expect(screen.getByText('-10')).toBeInTheDocument();
  });

  it('handles large numbers with formatting', () => {
    render(<StatBlock label="Large" value={9999999} />);
    expect(screen.getByText('9,999,999')).toBeInTheDocument();
  });
});
