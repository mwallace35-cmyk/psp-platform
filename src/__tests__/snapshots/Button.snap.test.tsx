import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button - Snapshot Tests', () => {
  it('renders primary button correctly', () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders secondary button correctly', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders outline button correctly', () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders ghost button correctly', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders small button correctly', () => {
    const { container } = render(<Button size="sm">Small</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders medium button correctly', () => {
    const { container } = render(<Button size="md">Medium</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders large button correctly', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders button with custom className', () => {
    const { container } = render(
      <Button className="custom-class">Custom</Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders disabled button', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders primary large button', () => {
    const { container } = render(
      <Button variant="primary" size="lg">
        Primary Large
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders secondary small button', () => {
    const { container } = render(
      <Button variant="secondary" size="sm">
        Secondary Small
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders button with long text', () => {
    const { container } = render(
      <Button>This is a button with a very long text inside</Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders button group', () => {
    const { container } = render(
      <div className="flex gap-2">
        <Button variant="primary">Save</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    );
    expect(container).toMatchSnapshot();
  });
});
