import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Card from '@/components/ui/Card';

describe('Card - Snapshot Tests', () => {
  it('renders default card correctly', () => {
    const { container } = render(<Card>Card content</Card>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders card with hover variant', () => {
    const { container } = render(
      <Card variant="hover">Hover Card</Card>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders card with sport variant', () => {
    const { container } = render(
      <Card variant="sport">Sport Card</Card>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders card with small padding', () => {
    const { container } = render(
      <Card padding="sm">Small Padding</Card>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders card with medium padding', () => {
    const { container } = render(
      <Card padding="md">Medium Padding</Card>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders card with large padding', () => {
    const { container } = render(
      <Card padding="lg">Large Padding</Card>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders card with custom className', () => {
    const { container } = render(
      <Card className="custom-class">Custom Card</Card>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders card with nested content', () => {
    const { container } = render(
      <Card variant="hover" padding="md">
        <div className="header">
          <h2>Card Title</h2>
        </div>
        <div className="body">
          <p>Card description text</p>
        </div>
      </Card>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders card with multiple children', () => {
    const { container } = render(
      <Card>
        <h3>Title</h3>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
        <button>Action</button>
      </Card>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders card with all options combined', () => {
    const { container } = render(
      <Card variant="sport" padding="lg" className="extra-class" id="card-1">
        All Options Card
      </Card>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
