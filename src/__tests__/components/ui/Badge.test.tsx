import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '@/components/ui/Badge';

describe('Badge', () => {
  describe('Rendering', () => {
    it('renders badge with children', () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('is span element', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge?.tagName).toBe('SPAN');
    });

    it('renders with numeric content', () => {
      render(<Badge>42</Badge>);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders with emoji content', () => {
      render(<Badge>✓ Done</Badge>);
      expect(screen.getByText('✓ Done')).toBeInTheDocument();
    });

    it('renders with string content', () => {
      render(<Badge>Status</Badge>);
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders multiple children correctly', () => {
      render(
        <Badge>
          <span>Icon</span> Label
        </Badge>
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Label')).toBeInTheDocument();
    });

    it('renders with single child element', () => {
      render(
        <Badge>
          <span>Single</span>
        </Badge>
      );
      expect(screen.getByText('Single')).toBeInTheDocument();
    });

    it('renders with empty string content', () => {
      const { container } = render(<Badge></Badge>);
      const badge = container.querySelector('span');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Variant Prop - Default', () => {
    it('renders with default variant styling', () => {
      const { container } = render(<Badge>Default</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-[var(--psp-gray-100)]');
      expect(badge).toHaveClass('text-[var(--psp-gray-700)]');
    });

    it('applies default variant when not specified', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-[var(--psp-gray-100)]');
    });

    it('default variant has correct text color', () => {
      const { container } = render(<Badge>Default</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-[var(--psp-gray-700)]');
    });
  });

  describe('Variant Prop - Success', () => {
    it('renders with success variant', () => {
      const { container } = render(<Badge variant="success">Success</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-green-100');
      expect(badge).toHaveClass('text-green-800');
    });

    it('success variant has correct background', () => {
      const { container } = render(<Badge variant="success">Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-green-100');
    });

    it('success variant has correct text color', () => {
      const { container } = render(<Badge variant="success">Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-green-800');
    });
  });

  describe('Variant Prop - Warning', () => {
    it('renders with warning variant', () => {
      const { container } = render(<Badge variant="warning">Warning</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-yellow-100');
      expect(badge).toHaveClass('text-yellow-800');
    });

    it('warning variant has correct background', () => {
      const { container } = render(<Badge variant="warning">Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-yellow-100');
    });

    it('warning variant has correct text color', () => {
      const { container } = render(<Badge variant="warning">Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-yellow-800');
    });
  });

  describe('Variant Prop - Error', () => {
    it('renders with error variant', () => {
      const { container } = render(<Badge variant="error">Error</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-red-100');
      expect(badge).toHaveClass('text-red-800');
    });

    it('error variant has correct background', () => {
      const { container } = render(<Badge variant="error">Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-red-100');
    });

    it('error variant has correct text color', () => {
      const { container } = render(<Badge variant="error">Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-red-800');
    });
  });

  describe('Variant Prop - Info', () => {
    it('renders with info variant', () => {
      const { container } = render(<Badge variant="info">Info</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-blue-100');
      expect(badge).toHaveClass('text-blue-800');
    });

    it('info variant has correct background', () => {
      const { container } = render(<Badge variant="info">Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-blue-100');
    });

    it('info variant has correct text color', () => {
      const { container } = render(<Badge variant="info">Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-blue-800');
    });
  });

  describe('Variant Prop - Sport', () => {
    it('renders with sport variant', () => {
      const { container } = render(<Badge variant="sport">Sport</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-[var(--psp-gold)]/10');
      expect(badge).toHaveClass('text-[var(--psp-gold)]');
    });

    it('sport variant has correct background', () => {
      const { container } = render(<Badge variant="sport">Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-[var(--psp-gold)]/10');
    });

    it('sport variant has correct text color', () => {
      const { container } = render(<Badge variant="sport">Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-[var(--psp-gold)]');
    });
  });

  describe('Base Styling Classes', () => {
    it('applies base styling classes', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('inline-flex');
      expect(badge).toHaveClass('items-center');
      expect(badge).toHaveClass('px-2.5');
      expect(badge).toHaveClass('py-0.5');
      expect(badge).toHaveClass('rounded-full');
      expect(badge).toHaveClass('text-xs');
      expect(badge).toHaveClass('font-semibold');
    });

    it('has inline-flex display', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('inline-flex');
    });

    it('has centered items', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('items-center');
    });

    it('has correct horizontal padding', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('px-2.5');
    });

    it('has correct vertical padding', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('py-0.5');
    });

    it('has rounded full border', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('rounded-full');
    });

    it('has small text size', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-xs');
    });

    it('has semibold font weight', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('font-semibold');
    });
  });

  describe('className Prop', () => {
    it('applies custom className', () => {
      const { container } = render(<Badge className="custom-class">Custom</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('custom-class');
    });

    it('applies both variant and custom className', () => {
      const { container } = render(
        <Badge variant="success" className="extra-class">
          Success
        </Badge>
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-green-100');
      expect(badge).toHaveClass('extra-class');
    });

    it('applies multiple custom classes', () => {
      const { container } = render(
        <Badge className="class1 class2 class3">Test</Badge>
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('class1');
      expect(badge).toHaveClass('class2');
      expect(badge).toHaveClass('class3');
    });

    it('custom className can override base styles', () => {
      const { container } = render(
        <Badge className="text-lg">Override</Badge>
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('text-lg');
      // Still has base styles
      expect(badge).toHaveClass('inline-flex');
    });

    it('applies custom className without breaking default styles', () => {
      const { container } = render(
        <Badge variant="info" className="custom">Test</Badge>
      );
      const badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-blue-100');
      expect(badge).toHaveClass('custom');
      expect(badge).toHaveClass('inline-flex');
    });

    it('handles empty custom className', () => {
      const { container } = render(<Badge className="">Test</Badge>);
      const badge = container.querySelector('span');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('inline-flex');
    });
  });

  describe('Complex Scenarios', () => {
    it('renders variant with all style combinations', () => {
      const variants: Array<'default' | 'success' | 'warning' | 'error' | 'info' | 'sport'> = [
        'default',
        'success',
        'warning',
        'error',
        'info',
        'sport',
      ];

      variants.forEach((variant) => {
        const { container } = render(<Badge variant={variant}>Test</Badge>);
        const badge = container.querySelector('span');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('inline-flex');
        expect(badge).toHaveClass('font-semibold');
      });
    });

    it('renders large list of badges', () => {
      const { container } = render(
        <div>
          {['New', 'Active', 'Archived', 'Draft', 'Published'].map((label) => (
            <Badge key={label} variant="success">{label}</Badge>
          ))}
        </div>
      );

      const badges = container.querySelectorAll('span.inline-flex');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('renders badge with complex children structure', () => {
      render(
        <Badge>
          <strong>Important:</strong> <em>Update</em>
        </Badge>
      );

      expect(screen.getByText('Important:')).toBeInTheDocument();
      expect(screen.getByText('Update')).toBeInTheDocument();
    });
  });

  describe('State and Props Consistency', () => {
    it('maintains consistent appearance across re-renders', () => {
      const { rerender, container } = render(<Badge variant="success">Test</Badge>);
      const firstBadge = container.querySelector('span');
      const firstClasses = firstBadge?.className;

      rerender(<Badge variant="success">Test</Badge>);
      const secondBadge = container.querySelector('span');
      const secondClasses = secondBadge?.className;

      expect(firstClasses).toBe(secondClasses);
    });

    it('correctly switches between variants', () => {
      const { rerender, container } = render(<Badge variant="success">Test</Badge>);
      let badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-green-100');

      rerender(<Badge variant="error">Test</Badge>);
      badge = container.querySelector('span');
      expect(badge).toHaveClass('bg-red-100');
      expect(badge).not.toHaveClass('bg-green-100');
    });

    it('updates content correctly', () => {
      const { rerender } = render(<Badge>First</Badge>);
      expect(screen.getByText('First')).toBeInTheDocument();

      rerender(<Badge>Second</Badge>);
      expect(screen.queryByText('First')).not.toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });
});
