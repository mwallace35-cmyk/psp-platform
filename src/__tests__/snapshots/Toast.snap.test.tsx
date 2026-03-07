import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Toast, ToastContainer } from '@/components/ui/Toast';

describe('Toast - Snapshot Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOnClose = vi.fn();

  it('renders success toast correctly', () => {
    const { container } = render(
      <Toast
        id="toast-1"
        message="Operation successful"
        type="success"
        onClose={mockOnClose}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders error toast correctly', () => {
    const { container } = render(
      <Toast
        id="toast-2"
        message="An error occurred"
        type="error"
        onClose={mockOnClose}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders info toast correctly', () => {
    const { container } = render(
      <Toast
        id="toast-3"
        message="Information message"
        type="info"
        onClose={mockOnClose}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders warning toast correctly', () => {
    const { container } = render(
      <Toast
        id="toast-4"
        message="Warning message"
        type="warning"
        onClose={mockOnClose}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders toast with custom duration', () => {
    const { container } = render(
      <Toast
        id="toast-5"
        message="Custom duration"
        type="success"
        duration={5000}
        onClose={mockOnClose}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders toast with zero duration', () => {
    const { container } = render(
      <Toast
        id="toast-6"
        message="No auto-close"
        type="info"
        duration={0}
        onClose={mockOnClose}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders toast with long message', () => {
    const { container } = render(
      <Toast
        id="toast-7"
        message="This is a very long message that might wrap to multiple lines in the toast notification"
        type="warning"
        onClose={mockOnClose}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders toast container with multiple toasts', () => {
    const toasts = [
      { id: 'toast-1', message: 'Success', type: 'success' as const, onClose: mockOnClose },
      { id: 'toast-2', message: 'Error', type: 'error' as const, onClose: mockOnClose },
      { id: 'toast-3', message: 'Info', type: 'info' as const, onClose: mockOnClose },
    ];

    const { container } = render(<ToastContainer toasts={toasts} />);
    expect(container).toMatchSnapshot();
  });

  it('renders empty toast container', () => {
    const { container } = render(<ToastContainer toasts={[]} />);
    expect(container).toMatchSnapshot();
  });
});
