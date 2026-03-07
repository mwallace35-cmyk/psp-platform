import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from '@/components/ui/EmptyState';

vi.mock('@/components/ui/Button', () => ({
  default: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe('EmptyState', () => {
  describe('Title Prop', () => {
    it('renders title', () => {
      render(<EmptyState title="No Results" />);
      expect(screen.getByText('No Results')).toBeInTheDocument();
    });

    it('renders with empty title (edge case)', () => {
      render(<EmptyState title="" icon="🎯" />);
      expect(screen.getByText('🎯')).toBeInTheDocument();
    });

    it('title has h3 heading level', () => {
      render(<EmptyState title="Test Title" />);
      const title = screen.getByText('Test Title');
      expect(title.tagName).toBe('H3');
    });

    it('title has bold font weight', () => {
      render(<EmptyState title="Test" />);
      const title = screen.getByText('Test');
      expect(title).toHaveStyle('fontWeight: 700');
    });

    it('applies navy color to title', () => {
      render(<EmptyState title="No Results" />);
      const title = screen.getByText('No Results');
      expect(title).toHaveStyle('color: var(--psp-navy)');
    });

    it('title has correct font size', () => {
      render(<EmptyState title="Test" />);
      const title = screen.getByText('Test');
      expect(title).toHaveStyle('fontSize: 1.25rem');
    });
  });

  describe('Icon Prop', () => {
    it('renders with default icon when not provided', () => {
      render(<EmptyState title="No Results" />);
      expect(screen.getByText('📭')).toBeInTheDocument();
    });

    it('renders with custom icon string', () => {
      render(<EmptyState title="No Results" icon="🎯" />);
      expect(screen.getByText('🎯')).toBeInTheDocument();
    });

    it('renders with custom emoji icon', () => {
      render(<EmptyState title="Test" icon="🚀" />);
      expect(screen.getByText('🚀')).toBeInTheDocument();
    });

    it('does not render icon when icon prop is null', () => {
      const { container } = render(<EmptyState title="Test" icon={null} />);
      const iconDiv = container.querySelector('div[style*="3.5rem"]');
      expect(iconDiv).not.toBeInTheDocument();
    });

    it('icon is in its own div with large size', () => {
      const { container } = render(<EmptyState title="Test" icon="📦" />);
      const styled = container.querySelector('div[style*="3.5rem"]');
      expect(styled).toBeInTheDocument();
      expect(styled).toHaveStyle('fontSize: 3.5rem');
    });

    it('icon has bottom margin', () => {
      const { container } = render(<EmptyState title="Test" icon="📦" />);
      const iconDiv = container.querySelector('div[style*="3.5rem"]');
      expect(iconDiv).toHaveStyle('marginBottom: 1rem');
    });

    it('icon has reduced opacity', () => {
      const { container } = render(<EmptyState title="Test" icon="📦" />);
      const iconDiv = container.querySelector('div[style*="3.5rem"]');
      expect(iconDiv).toHaveStyle('opacity: 0.8');
    });

    it('renders ReactNode as icon', () => {
      const iconNode = <div data-testid="custom-icon">Custom Icon</div>;
      render(<EmptyState title="Test" icon={iconNode} />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Message/Description Prop', () => {
    it('renders description when provided', () => {
      render(
        <EmptyState
          title="No Results"
          description="Try adjusting your search criteria"
        />
      );
      expect(screen.getByText('Try adjusting your search criteria')).toBeInTheDocument();
    });

    it('renders message when provided', () => {
      render(
        <EmptyState
          title="No Results"
          message="Try adjusting your search criteria"
        />
      );
      expect(screen.getByText('Try adjusting your search criteria')).toBeInTheDocument();
    });

    it('message takes precedence over description', () => {
      const { container } = render(
        <EmptyState
          title="No Results"
          message="Message text"
          description="Description text"
        />
      );
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs.length).toBe(1);
      expect(paragraphs[0]).toHaveTextContent('Message text');
    });

    it('does not render paragraph when neither message nor description provided', () => {
      const { container } = render(<EmptyState title="No Results" />);
      expect(container.querySelector('p')).not.toBeInTheDocument();
    });

    it('message has correct styling', () => {
      render(
        <EmptyState title="Test" message="This is a message" />
      );
      const message = screen.getByText('This is a message');
      expect(message).toHaveStyle('color: var(--psp-gray-500)');
    });

    it('message has correct font size', () => {
      render(
        <EmptyState title="Test" message="This is a message" />
      );
      const message = screen.getByText('This is a message');
      expect(message).toHaveStyle('fontSize: 0.875rem');
    });

    it('provides max-width constraint on message', () => {
      render(
        <EmptyState title="Test" message="Long message" />
      );
      const message = screen.getByText('Long message');
      expect(message).toHaveStyle('maxWidth: 28rem');
    });

    it('message has correct line height', () => {
      render(
        <EmptyState title="Test" message="Multi line message" />
      );
      const message = screen.getByText('Multi line message');
      expect(message).toHaveStyle('lineHeight: 1.6');
    });
  });

  describe('Action Prop - Configuration', () => {
    it('renders action button when action provided', () => {
      render(<EmptyState title="No Results" action={{ label: "Go Home", href: "/home" }} />);
      expect(screen.getByText('Go Home')).toBeInTheDocument();
    });

    it('does not render action button when action not provided', () => {
      const { container } = render(<EmptyState title="No Results" />);
      expect(container.querySelector('button')).not.toBeInTheDocument();
    });
  });

  describe('Action Prop - With href', () => {
    it('renders as link when action.href provided', () => {
      const { container } = render(
        <EmptyState title="No Results" action={{ label: "Go Home", href: "/home" }} />
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '/home');
    });

    it('link href can be absolute path', () => {
      const { container } = render(
        <EmptyState title="Test" action={{ label: "Home", href: "/" }} />
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '/');
    });

    it('link href can be relative path', () => {
      const { container } = render(
        <EmptyState title="Test" action={{ label: "Create", href: "/create" }} />
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '/create');
    });

    it('renders button element inside link', () => {
      const { container } = render(
        <EmptyState title="Test" action={{ label: "Go", href: "/test" }} />
      );
      const link = container.querySelector('a');
      const button = link?.querySelector('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Action Prop - With onClick', () => {
    it('renders button with onClick callback when action.href not provided', () => {
      const onClick = vi.fn();
      render(
        <EmptyState
          title="No Results"
          action={{ label: "Retry", onClick }}
        />
      );
      const button = screen.getByText('Retry') as HTMLButtonElement;
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalled();
    });

    it('handles onClick without href', () => {
      const onClick = vi.fn();
      render(
        <EmptyState
          title="Test"
          action={{ label: "Click Me", onClick }}
        />
      );
      const button = screen.getByText('Click Me') as HTMLButtonElement;
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('onClick is called when button is clicked multiple times', () => {
      const onClick = vi.fn();
      render(
        <EmptyState
          title="Test"
          action={{ label: "Click", onClick }}
        />
      );
      const button = screen.getByText('Click') as HTMLButtonElement;
      fireEvent.click(button);
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('action with both onClick and href uses href (href takes precedence)', () => {
      const onClick = vi.fn();
      const { container } = render(
        <EmptyState
          title="Test"
          action={{ label: "Action", href: "/go", onClick }}
        />
      );
      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '/go');
    });
  });

  describe('className Prop', () => {
    it('applies custom className to wrapper', () => {
      const { container } = render(
        <EmptyState title="Test" className="custom-class" />
      );
      const wrapper = container.querySelector('.empty-state');
      expect(wrapper).toHaveClass('custom-class');
    });

    it('applies multiple classNames', () => {
      const { container } = render(
        <EmptyState title="Test" className="class1 class2" />
      );
      const wrapper = container.querySelector('.empty-state');
      expect(wrapper).toHaveClass('class1');
      expect(wrapper).toHaveClass('class2');
    });

    it('default className is empty string if not provided', () => {
      const { container } = render(<EmptyState title="Test" />);
      const wrapper = container.querySelector('.empty-state');
      expect(wrapper?.className).toBe('empty-state ');
    });
  });

  describe('Wrapper Structure', () => {
    it('applies correct structure classes', () => {
      const { container } = render(<EmptyState title="No Results" />);
      const wrapper = container.querySelector('.empty-state');
      expect(wrapper).toBeInTheDocument();
    });

    it('wrapper has text-align center', () => {
      const { container } = render(<EmptyState title="No Results" />);
      const wrapper = container.querySelector('.empty-state');
      expect(wrapper).toHaveStyle('textAlign: center');
    });

    it('wrapper has flex layout', () => {
      const { container } = render(<EmptyState title="No Results" />);
      const wrapper = container.querySelector('.empty-state');
      expect(wrapper).toHaveStyle('display: flex');
    });

    it('wrapper is column flex direction', () => {
      const { container } = render(<EmptyState title="No Results" />);
      const wrapper = container.querySelector('.empty-state');
      expect(wrapper).toHaveStyle('flexDirection: column');
    });

    it('wrapper centers items', () => {
      const { container } = render(<EmptyState title="No Results" />);
      const wrapper = container.querySelector('.empty-state');
      expect(wrapper).toHaveStyle('alignItems: center');
    });

    it('wrapper justifies content center', () => {
      const { container } = render(<EmptyState title="No Results" />);
      const wrapper = container.querySelector('.empty-state');
      expect(wrapper).toHaveStyle('justifyContent: center');
    });

    it('wrapper has min height', () => {
      const { container } = render(<EmptyState title="No Results" />);
      const wrapper = container.querySelector('.empty-state');
      expect(wrapper).toHaveStyle('minHeight: 200px');
    });

    it('wrapper has padding', () => {
      const { container } = render(<EmptyState title="No Results" />);
      const wrapper = container.querySelector('.empty-state');
      expect(wrapper).toHaveStyle('padding: 2rem 1rem');
    });
  });

  describe('Complex Scenarios', () => {
    it('renders all elements together', () => {
      render(
        <EmptyState
          icon="🚀"
          title="No Data"
          message="Create your first item"
          action={{ label: "Create", href: "/create" }}
        />
      );
      expect(screen.getByText('🚀')).toBeInTheDocument();
      expect(screen.getByText('No Data')).toBeInTheDocument();
      expect(screen.getByText('Create your first item')).toBeInTheDocument();
      expect(screen.getByText('Create')).toBeInTheDocument();
    });

    it('renders with description instead of message', () => {
      render(
        <EmptyState
          icon="🎯"
          title="Search"
          description="No results found"
          action={{ label: "Try Again", onClick: vi.fn() }}
        />
      );
      expect(screen.getByText('🎯')).toBeInTheDocument();
      expect(screen.getByText('Search')).toBeInTheDocument();
      expect(screen.getByText('No results found')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('renders only title and icon', () => {
      const { container } = render(<EmptyState title="Test" icon="📦" />);
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.getByText('📦')).toBeInTheDocument();
      expect(container.querySelector('p')).not.toBeInTheDocument();
      expect(container.querySelector('button')).not.toBeInTheDocument();
    });
  });
});
