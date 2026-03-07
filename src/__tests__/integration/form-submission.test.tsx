import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Toast, ToastContainer } from '@/components/ui/Toast';
import { useState } from 'react';

// Mock form component for testing
function TestForm({ onSubmit }: { onSubmit?: (data: any) => Promise<void> }) {
  const [formData, setFormData] = useState({ email: '', name: '' });
  const [toasts, setToasts] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastCounter, setToastCounter] = useState(0);

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.email) {
      errors.push('Email is required');
    } else if (!formData.email.includes('@')) {
      errors.push('Email must be valid');
    }

    if (!formData.name) {
      errors.push('Name is required');
    }

    return errors;
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${toastCounter}`;
    setToastCounter((prev) => prev + 1);
    setToasts((prev) => [...prev, { id, message, type, onClose: removeToast }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate
      const errors = validateForm();
      if (errors.length > 0) {
        errors.forEach((error) => addToast(error, 'error'));
        setIsSubmitting(false);
        return;
      }

      // Submit
      if (onSubmit) {
        await onSubmit(formData);
      }

      addToast('Form submitted successfully!', 'success');
      setFormData({ email: '', name: '' });
    } catch (error) {
      addToast(
        error instanceof Error ? error.message : 'Submission failed',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <ToastContainer toasts={toasts} />
    </>
  );
}

describe('Form Submission Integration', () => {
  describe('Form validation', () => {
    it('shows error toast when email is missing', async () => {
      render(<TestForm />);

      const nameInput = screen.getByLabelText('Name');
      const submitButton = screen.getByRole('button', { name: /Submit/ });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('shows error toast when name is missing', async () => {
      render(<TestForm />);

      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: /Submit/ });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });

    it('shows error toast for invalid email format', async () => {
      render(<TestForm />);

      const form = screen.getByRole('button', { name: /Submit/ }).closest('form');
      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText('Email must be valid')).toBeInTheDocument();
      });
    });

    it('prevents submission when validation fails', async () => {
      const onSubmit = vi.fn();
      render(<TestForm onSubmit={onSubmit} />);

      const submitButton = screen.getByRole('button', { name: /Submit/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Form submission flow', () => {
    it('submits form with valid data', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(<TestForm onSubmit={onSubmit} />);

      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: /Submit/ });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          email: 'john@example.com',
          name: 'John Doe',
        });
      });
    });

    it('shows success toast after submission', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(<TestForm onSubmit={onSubmit} />);

      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: /Submit/ });

      fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
      fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Form submitted successfully!')
        ).toBeInTheDocument();
      });
    });

    it('clears form after successful submission', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      render(<TestForm onSubmit={onSubmit} />);

      const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /Submit/ });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
      });
    });

    it('disables submit button while submitting', async () => {
      const onSubmit = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      render(<TestForm onSubmit={onSubmit} />);

      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button') as HTMLButtonElement;

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.click(submitButton);

      expect(submitButton.disabled).toBe(true);
      expect(submitButton.textContent).toContain('Submitting...');

      await waitFor(() => {
        expect(submitButton.disabled).toBe(false);
        expect(submitButton.textContent).toContain('Submit');
      });
    });
  });

  describe('Toast notifications', () => {
    it('displays error toast with role="alert"', async () => {
      render(<TestForm />);

      const submitButton = screen.getByRole('button', { name: /Submit/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert');
        expect(alerts.length).toBeGreaterThan(0);
      });
    });

    it('shows multiple error toasts for multiple validation errors', async () => {
      render(<TestForm />);

      const submitButton = screen.getByRole('button', { name: /Submit/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Name is required')).toBeInTheDocument();
      });
    });

    it('shows success toast with correct styling', async () => {
      const onSubmit = vi.fn().mockResolvedValue(undefined);
      const { container } = render(<TestForm onSubmit={onSubmit} />);

      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: /Submit/ });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const successMessage = screen.getByText('Form submitted successfully!');
        expect(successMessage).toBeInTheDocument();

        // Check that success toast has proper styling class
        const alert = successMessage.closest('[role="alert"]');
        expect(alert?.className).toContain('bg-green');
      });
    });

    it('allows closing toast manually', async () => {
      render(<TestForm />);

      const submitButton = screen.getByRole('button', { name: /Submit/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });

      const closeButtons = screen.getAllByRole('button', {
        name: /Close notification/,
      });
      fireEvent.click(closeButtons[0]);

      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    it('shows error toast when submission fails', async () => {
      const onSubmit = vi.fn().mockRejectedValue(
        new Error('Network error')
      );
      render(<TestForm onSubmit={onSubmit} />);

      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button', { name: /Submit/ });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('re-enables submit button after error', async () => {
      const onSubmit = vi.fn().mockRejectedValue(
        new Error('Submission failed')
      );
      render(<TestForm onSubmit={onSubmit} />);

      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button') as HTMLButtonElement;

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton.disabled).toBe(false);
        expect(submitButton.textContent).toContain('Submit');
      });
    });

    it('does not clear form when submission fails', async () => {
      const onSubmit = vi.fn().mockRejectedValue(
        new Error('Submission failed')
      );
      render(<TestForm onSubmit={onSubmit} />);

      const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /Submit/ });

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Submission failed')).toBeInTheDocument();
        expect(nameInput.value).toBe('John Doe');
        expect(emailInput.value).toBe('john@example.com');
      });
    });
  });

  describe('Accessibility', () => {
    it('form inputs have associated labels', () => {
      render(<TestForm />);

      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');

      expect(nameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
    });

    it('error messages are readable by screen readers', async () => {
      render(<TestForm />);

      const submitButton = screen.getByRole('button', { name: /Submit/ });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const alerts = screen.getAllByRole('alert');
        expect(alerts.length).toBeGreaterThan(0);
        alerts.forEach((alert) => {
          expect(alert).toHaveTextContent(/Email is required|Name is required/);
        });
      });
    });

    it('submit button indicates loading state', async () => {
      const onSubmit = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 50))
      );
      render(<TestForm onSubmit={onSubmit} />);

      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const submitButton = screen.getByRole('button');

      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.click(submitButton);

      // Button should indicate loading state
      expect(submitButton).toHaveTextContent('Submitting...');
    });
  });
});
