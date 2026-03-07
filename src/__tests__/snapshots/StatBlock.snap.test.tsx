import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import StatBlock from '@/components/ui/StatBlock';

describe('StatBlock - Snapshot Tests', () => {
  it('renders stat block with basic props', () => {
    const { container } = render(
      <StatBlock label="Total Points" value={2450} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders stat block with icon', () => {
    const { container } = render(
      <StatBlock label="Touchdowns" value={18} icon="🏈" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders stat block with positive trend', () => {
    const { container } = render(
      <StatBlock
        label="Points Per Game"
        value={24.5}
        trend={{ value: 12, isPositive: true }}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders stat block with negative trend', () => {
    const { container } = render(
      <StatBlock
        label="Turnovers"
        value={8}
        trend={{ value: 5, isPositive: false }}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders stat block with small size', () => {
    const { container } = render(
      <StatBlock label="Wins" value={12} size="sm" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders stat block with medium size', () => {
    const { container } = render(
      <StatBlock label="Games Played" value={28} size="md" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders stat block with large size', () => {
    const { container } = render(
      <StatBlock label="Career Yards" value={12450} size="lg" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders stat block with all options', () => {
    const { container } = render(
      <StatBlock
        label="Career Touchdowns"
        value={156}
        icon="🏆"
        trend={{ value: 25, isPositive: true }}
        size="lg"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders stat block with string value', () => {
    const { container } = render(
      <StatBlock label="Status" value="All-State" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders stat block with large number', () => {
    const { container } = render(
      <StatBlock label="Total Yards" value={250000} icon="📊" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders multiple stat blocks together', () => {
    const { container } = render(
      <div className="grid grid-cols-3 gap-4">
        <StatBlock label="Wins" value={15} size="md" />
        <StatBlock label="Losses" value={2} size="md" />
        <StatBlock label="Ties" value={1} size="md" />
      </div>
    );
    expect(container).toMatchSnapshot();
  });
});
