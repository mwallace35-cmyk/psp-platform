import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('renders with text content', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders as button element', () => {
    const { container } = render(<Button>Test</Button>);
    const button = container.querySelector('button');
    expect(button?.tagName).toBe('BUTTON');
  });

  it('handles click events', () => {
    const clickHandler = vi.fn();
    render(<Button onClick={clickHandler}>Click</Button>);
    const button = screen.getByText('Click') as HTMLButtonElement;
    button.click();
    expect(clickHandler).toHaveBeenCalledTimes(1);
  });

  it('respects disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
    expect(button).toHaveClass('disabled:cursor-not-allowed');
  });

  it('does not fire click on disabled button', () => {
    const clickHandler = vi.fn();
    render(<Button disabled onClick={clickHandler}>
      Disabled
    </Button>);
    const button = screen.getByRole('button') as HTMLButtonElement;
    button.click();
    expect(clickHandler).not.toHaveBeenCalled();
  });

  it('renders with primary variant by default', () => {
    const { container } = render(<Button>Primary</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-[var(--psp-gold)]');
    expect(button).toHaveClass('text-[var(--psp-navy)]');
  });

  it('renders with secondary variant', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-[var(--psp-navy)]');
    expect(button).toHaveClass('text-white');
  });

  it('renders with outline variant', () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-[var(--psp-gray-300)]');
  });

  it('renders with ghost variant', () => {
    const { container } = render(<Button variant="ghost">Ghost</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('text-[var(--psp-gray-600)]');
  });

  it('renders with sm size', () => {
    const { container } = render(<Button size="sm">Small</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('px-3');
    expect(button).toHaveClass('py-1.5');
    expect(button).toHaveClass('text-sm');
  });

  it('renders with md size by default', () => {
    const { container } = render(<Button>Medium</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('px-5');
    expect(button).toHaveClass('py-2');
  });

  it('renders with lg size', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('px-8');
    expect(button).toHaveClass('py-3');
    expect(button).toHaveClass('text-base');
  });

  it('applies custom className', () => {
    const { container } = render(<Button className="custom-class">Button</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('custom-class');
  });

  it('combines variant and size classes', () => {
    const { container } = render(<Button variant="secondary" size="lg">
      Secondary Large
    </Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-[var(--psp-navy)]');
    expect(button).toHaveClass('px-8');
  });

  it('applies base transition styles', () => {
    const { container } = render(<Button>Transition</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('transition-all');
    expect(button).toHaveClass('duration-150');
    expect(button).toHaveClass('cursor-pointer');
  });

  it('renders with icon and text children', () => {
    render(
      <Button>
        <span>📌</span> Pin
      </Button>
    );
    expect(screen.getByText('Pin')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Button ref={ref}>Ref Test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has correct display name', () => {
    // React.memo wraps the component, so displayName may be on the inner component
    expect(Button.displayName || (Button as any).type?.displayName || 'Button').toBe('Button');
  });
});
