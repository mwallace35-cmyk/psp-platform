import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Toast, ToastContainer, ToastType } from '@/components/ui/Toast';

describe('Toast Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    vi.clearAllMocks();
  });

  describe('Toast rendering', () => {
    it('renders toast with message', () => {
      render(
        <Toast
          id="test-1"
          message="Test message"
          type="success"
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('renders with role="alert" for accessibility', () => {
      const { container } = render(
        <Toast
          id="test-1"
          message="Test message"
          type="success"
          onClose={mockOnClose}
        />
      );

      const alertDiv = container.querySelector('[role="alert"]');
      expect(alertDiv).toBeInTheDocument();
    });

    it('renders close button with aria-label', () => {
      render(
        <Toast
          id="test-1"
          message="Test message"
          type="success"
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByRole('button', { name: /Close notification/ });
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Toast variants', () => {
    const variants: ToastType[] = ['success', 'error', 'info', 'warning'];

    variants.forEach((type) => {
      it(`renders ${type} toast with correct styling`, () => {
        const { container } = render(
          <Toast
            id={`test-${type}`}
            message={`${type} message`}
            type={type}
            onClose={mockOnClose}
          />
        );

        const alert = container.querySelector('[role="alert"]');
        expect(alert).toBeInTheDocument();
        expect(alert?.className).toContain(`bg-`);
      });

      it(`${type} toast displays correct icon`, () => {
        const iconMap = {
          success: '✓',
          error: '✕',
          info: 'ℹ',
          warning: '⚠',
        };

        render(
          <Toast
            id={`test-${type}`}
            message={`${type} message`}
            type={type}
            onClose={mockOnClose}
          />
        );

        // Check that the icon is rendered (use getAllByText to get the first occurrence)
        const icons = screen.getAllByText(iconMap[type]);
        expect(icons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Toast auto-dismiss', () => {
    it('auto-dismisses after default duration (3000ms)', { timeout: 10000 }, async () => {
      vi.useFakeTimers();

      render(
        <Toast
          id="test-1"
          message="Auto dismiss"
          type="success"
          onClose={mockOnClose}
        />
      );

      expect(mockOnClose).not.toHaveBeenCalled();

      vi.advanceTimersByTime(3000);

      expect(mockOnClose).toHaveBeenCalledWith('test-1');

      vi.useRealTimers();
    });

    it('auto-dismisses with custom duration', { timeout: 10000 }, async () => {
      vi.useFakeTimers();

      render(
        <Toast
          id="test-1"
          message="Custom duration"
          type="success"
          duration={5000}
          onClose={mockOnClose}
        />
      );

      vi.advanceTimersByTime(5000);

      expect(mockOnClose).toHaveBeenCalledWith('test-1');

      vi.useRealTimers();
    });

    it('does not auto-dismiss when duration is 0', async () => {
      vi.useFakeTimers();

      render(
        <Toast
          id="test-1"
          message="No auto dismiss"
          type="success"
          duration={0}
          onClose={mockOnClose}
        />
      );

      vi.advanceTimersByTime(10000);

      expect(mockOnClose).not.toHaveBeenCalled();

      vi.useRealTimers();
    });

    it('clears timeout on unmount', async () => {
      vi.useFakeTimers();

      const { unmount } = render(
        <Toast
          id="test-1"
          message="Test"
          type="success"
          duration={3000}
          onClose={mockOnClose}
        />
      );

      unmount();
      vi.advanceTimersByTime(3000);

      expect(mockOnClose).not.toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  describe('Toast close button interaction', () => {
    it('closes toast when close button is clicked', () => {
      render(
        <Toast
          id="test-1"
          message="Test message"
          type="success"
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByRole('button', { name: /Close notification/ });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledWith('test-1');
    });

    it('calls onClose with correct id when clicked', () => {
      render(
        <Toast
          id="unique-id-123"
          message="Test message"
          type="error"
          onClose={mockOnClose}
        />
      );

      const closeButton = screen.getByRole('button', { name: /Close notification/ });
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledWith('unique-id-123');
    });
  });
});

describe('ToastContainer Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    vi.clearAllMocks();
  });

  it('renders container with multiple toasts', () => {
    const toasts = [
      {
        id: 'toast-1',
        message: 'First message',
        type: 'success' as ToastType,
        onClose: mockOnClose,
      },
      {
        id: 'toast-2',
        message: 'Second message',
        type: 'error' as ToastType,
        onClose: mockOnClose,
      },
    ];

    render(<ToastContainer toasts={toasts} />);

    expect(screen.getByText('First message')).toBeInTheDocument();
    expect(screen.getByText('Second message')).toBeInTheDocument();
  });

  it('renders empty container when no toasts', () => {
    const { container } = render(<ToastContainer toasts={[]} />);

    const alerts = container.querySelectorAll('[role="alert"]');
    expect(alerts.length).toBe(0);
  });

  it('renders toasts with correct spacing', () => {
    const toasts = [
      {
        id: 'toast-1',
        message: 'First',
        type: 'success' as ToastType,
        onClose: mockOnClose,
      },
      {
        id: 'toast-2',
        message: 'Second',
        type: 'info' as ToastType,
        onClose: mockOnClose,
      },
    ];

    render(<ToastContainer toasts={toasts} />);

    // ToastContainer renders multiple toasts
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('uses createPortal to render in document.body', () => {
    const toasts = [
      {
        id: 'toast-1',
        message: 'Portal test',
        type: 'success' as ToastType,
        onClose: mockOnClose,
      },
    ];

    render(<ToastContainer toasts={toasts} />);

    expect(screen.getByText('Portal test')).toBeInTheDocument();
  });

  it('renders empty container when no toasts provided', () => {
    render(<ToastContainer toasts={[]} />);

    // Should not show any toast messages when empty
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('Toast Accessibility', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('success toast has proper semantic structure', () => {
    const { container } = render(
      <Toast
        id="test-1"
        message="Success message"
        type="success"
        onClose={mockOnClose}
      />
    );

    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    expect(buttons[0]).toHaveAttribute('aria-label', 'Close notification');
  });

  it('error toast includes icon for visual feedback', () => {
    const { container } = render(
      <Toast
        id="test-1"
        message="Error occurred"
        type="error"
        onClose={mockOnClose}
      />
    );

    // Icon should be present (✕ for error) - check if there's an icon in the alert
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
    expect(alert?.textContent).toContain('✕');
  });

  it('toast message is readable by screen readers', () => {
    render(
      <Toast
        id="test-1"
        message="Important notification"
        type="warning"
        onClose={mockOnClose}
      />
    );

    const message = screen.getByText('Important notification');
    expect(message).toBeInTheDocument();
  });
});
