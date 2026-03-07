import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import EmptyState from '@/components/ui/EmptyState';

describe('EmptyState - Snapshot Tests', () => {
  const mockOnClick = vi.fn();

  it('renders empty state with title only', () => {
    const { container } = render(
      <EmptyState title="No data available" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders empty state with title and message', () => {
    const { container } = render(
      <EmptyState
        title="No results found"
        message="Try adjusting your search criteria"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders empty state with icon and title', () => {
    const { container } = render(
      <EmptyState title="No players" icon="👥" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders empty state with action button', () => {
    const { container } = render(
      <EmptyState
        title="No games scheduled"
        message="Schedule a game to get started"
        action={{ label: 'New Game', onClick: mockOnClick }}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders empty state with link action', () => {
    const { container } = render(
      <EmptyState
        title="No teams"
        action={{ label: 'Create Team', onClick: mockOnClick }}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders empty state with all options', () => {
    const { container } = render(
      <EmptyState
        icon="🏆"
        title="No championships won"
        message="Your school has not won any state championships yet"
        action={{ label: 'View history', onClick: mockOnClick }}
        className="custom-class"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders empty state with description prop', () => {
    const { container } = render(
      <EmptyState
        title="No records"
        description="There are no school records available at this time"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders empty state with custom icon', () => {
    const { container } = render(
      <EmptyState
        title="No coaches"
        icon={<span className="text-4xl">📋</span>}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders empty state with long text', () => {
    const { container } = render(
      <EmptyState
        title="No awards found"
        message="The selected school does not have any recorded awards or achievements in the database"
        action={{ label: 'Add Award', onClick: mockOnClick }}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
