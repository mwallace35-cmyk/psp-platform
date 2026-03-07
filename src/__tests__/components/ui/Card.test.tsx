import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '@/components/ui/Card';

describe('Card', () => {
  it('renders card with children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('is a div element', () => {
    const { container } = render(<Card>Test</Card>);
    const card = container.querySelector('div');
    expect(card?.tagName).toBe('DIV');
  });

  it('applies base styling', () => {
    const { container } = render(<Card>Base</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('rounded-xl');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('border-[var(--psp-gray-200)]');
    expect(card).toHaveClass('shadow-sm');
  });

  it('renders with default variant', () => {
    const { container } = render(<Card>Default</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('bg-white');
  });

  it('renders with hover variant', () => {
    const { container } = render(<Card variant="hover">Hover</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('hover:shadow-md');
    expect(card).toHaveClass('hover:border-[var(--psp-gray-300)]');
    expect(card).toHaveClass('transition-all');
    expect(card).toHaveClass('cursor-pointer');
  });

  it('renders with sport variant', () => {
    const { container } = render(<Card variant="sport">Sport</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('hover:shadow-lg');
    expect(card).toHaveClass('hover:-translate-y-0.5');
    expect(card).toHaveClass('cursor-pointer');
    expect(card).toHaveClass('overflow-hidden');
  });

  it('applies sm padding', () => {
    const { container } = render(<Card padding="sm">Small</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('p-4');
  });

  it('applies md padding by default', () => {
    const { container } = render(<Card>Medium</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('p-6');
  });

  it('applies lg padding', () => {
    const { container } = render(<Card padding="lg">Large</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('p-8');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Custom</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('custom-class');
  });

  it('combines variant and padding classes', () => {
    const { container } = render(
      <Card variant="hover" padding="lg">
        Combined
      </Card>
    );
    const card = container.querySelector('div');
    expect(card).toHaveClass('p-8');
    expect(card).toHaveClass('hover:shadow-md');
  });

  it('renders multiple children', () => {
    render(
      <Card>
        <h2>Title</h2>
        <p>Description</p>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('passes through HTML attributes', () => {
    render(<Card data-testid="card-test">Test</Card>);
    const card = screen.getByTestId('card-test');
    expect(card).toBeInTheDocument();
  });

  it('supports id attribute', () => {
    const { container } = render(<Card id="card-1">ID Test</Card>);
    const card = document.getElementById('card-1');
    expect(card).toBeInTheDocument();
  });

  it('renders with variant and padding and custom className', () => {
    const { container } = render(
      <Card variant="sport" padding="sm" className="extra-class">
        All options
      </Card>
    );
    const card = container.querySelector('div');
    expect(card).toHaveClass('p-4');
    expect(card).toHaveClass('hover:shadow-lg');
    expect(card).toHaveClass('extra-class');
  });

  it('renders card with nested components', () => {
    render(
      <Card>
        <div className="header">
          <h1>Title</h1>
        </div>
        <div className="body">
          <p>Body content</p>
        </div>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });
});
