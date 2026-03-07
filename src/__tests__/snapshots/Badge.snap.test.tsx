import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Badge from '@/components/ui/Badge';

describe('Badge - Snapshot Tests', () => {
  it('renders default variant correctly', () => {
    const { container } = render(<Badge>Default Badge</Badge>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders success variant correctly', () => {
    const { container } = render(<Badge variant="success">Success Badge</Badge>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders warning variant correctly', () => {
    const { container } = render(<Badge variant="warning">Warning Badge</Badge>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders error variant correctly', () => {
    const { container } = render(<Badge variant="error">Error Badge</Badge>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders info variant correctly', () => {
    const { container } = render(<Badge variant="info">Info Badge</Badge>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders sport variant correctly', () => {
    const { container } = render(<Badge variant="sport">Sport Badge</Badge>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <Badge className="custom-class">Custom Badge</Badge>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders multiple badges together', () => {
    const { container } = render(
      <div>
        <Badge variant="success">Approved</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="error">Rejected</Badge>
      </div>
    );
    expect(container).toMatchSnapshot();
  });

  it('renders badge with long text', () => {
    const { container } = render(
      <Badge>This is a very long badge text that might wrap</Badge>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders badge with special characters', () => {
    const { container } = render(
      <Badge variant="sport">2024 🏆 Championship</Badge>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
