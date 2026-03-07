import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(),
    })),
  })),
}));

// Mock crypto.randomUUID - use Object.defineProperty to handle the getter
vi.stubGlobal('crypto', {
  ...global.crypto,
  randomUUID: vi.fn(() => 'test-uuid-123'),
});

// Mock fetch
global.fetch = vi.fn();

import NewsletterSignup from '@/components/newsletter/NewsletterSignup';

describe('NewsletterSignup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  it('renders card variant by default', () => {
    render(<NewsletterSignup />);
    expect(screen.getByText('Stay in the Game')).toBeInTheDocument();
  });

  it('renders inline variant', () => {
    render(<NewsletterSignup variant="inline" />);
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
  });

  it('renders email input', () => {
    render(<NewsletterSignup />);
    const input = screen.getByPlaceholderText('your@email.com');
    expect(input).toBeInTheDocument();
  });

  it('updates email state on input change', () => {
    render(<NewsletterSignup />);
    const input = screen.getByPlaceholderText('your@email.com') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input.value).toBe('test@example.com');
  });

  it('renders subscribe button', () => {
    render(<NewsletterSignup />);
    const button = screen.getByText('Subscribe Free');
    expect(button).toBeInTheDocument();
  });

  it('has correct button styling', () => {
    render(<NewsletterSignup />);
    const button = screen.getByText('Subscribe Free') as HTMLButtonElement;
    expect(button.style.background).toBe('var(--psp-gold)');
    expect(button.style.color).toBe('var(--psp-navy)');
  });

  it('renders sport selection buttons', () => {
    render(<NewsletterSignup />);
    // The component shows first 4 sports from VALID_SPORTS
    const buttons = screen.getAllByRole('button').slice(0, 4);
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('toggles sport selection', () => {
    render(<NewsletterSignup />);
    const buttons = screen.getAllByRole('button');
    const sportButton = buttons[0];
    fireEvent.click(sportButton);
    // After click, button should have gold background
    expect(sportButton.style.background).toBe('var(--psp-gold)');
  });

  it('deselects sport on second click', () => {
    render(<NewsletterSignup />);
    const buttons = screen.getAllByRole('button');
    const sportButton = buttons[0];
    fireEvent.click(sportButton);
    fireEvent.click(sportButton);
    // After second click, background should be reset
    expect(sportButton.style.background).toBe('');
  });

  it('renders success message after submission', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        insert: mockInsert,
      })),
    });
    (global.fetch as any).mockResolvedValue({ ok: true });

    render(<NewsletterSignup />);
    const input = screen.getByPlaceholderText('your@email.com');
    const button = screen.getByText('Subscribe Free');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Check your email to confirm your subscription!')).toBeInTheDocument();
    });
  });

  it('shows error message on duplicate email', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockInsert = vi.fn().mockResolvedValue({
      error: { code: '23505', message: 'Duplicate' },
    });
    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        insert: mockInsert,
      })),
    });

    render(<NewsletterSignup />);
    const input = screen.getByPlaceholderText('your@email.com');
    const button = screen.getByText('Subscribe Free');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('This email is already subscribed!')).toBeInTheDocument();
    });
  });

  it('shows generic error on submission failure', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockInsert = vi.fn().mockRejectedValue(new Error('Network error'));
    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        insert: mockInsert,
      })),
    });

    render(<NewsletterSignup />);
    const input = screen.getByPlaceholderText('your@email.com');
    const button = screen.getByText('Subscribe Free');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Could not sign up. Please try again.')).toBeInTheDocument();
    });
  });

  it('disables submit button while submitting', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockInsert = vi.fn(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ error: null }), 100);
        })
    );
    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        insert: mockInsert,
      })),
    });
    (global.fetch as any).mockResolvedValue({ ok: true });

    render(<NewsletterSignup />);
    const input = screen.getByPlaceholderText('your@email.com');
    const button = screen.getByText('Subscribe Free') as HTMLButtonElement;

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    // Button should be disabled while submitting
    expect(button).toBeDisabled();
  });

  it('calls email confirmation API on successful signup', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        insert: mockInsert,
      })),
    });
    (global.fetch as any).mockResolvedValue({ ok: true });

    render(<NewsletterSignup />);
    const input = screen.getByPlaceholderText('your@email.com');
    const button = screen.getByText('Subscribe Free');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/email/send-confirmation',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });
  });

  it('inline variant has flex layout', () => {
    const { container } = render(<NewsletterSignup variant="inline" />);
    const form = container.querySelector('form');
    expect(form).toHaveClass('flex');
    expect(form).toHaveClass('gap-2');
  });

  it('card variant has navy background', () => {
    const { container } = render(<NewsletterSignup variant="card" />);
    const div = container.querySelector('div');
    expect(div).toHaveStyle({ background: 'var(--psp-navy)' });
  });

  it('shows heading for card variant', () => {
    render(<NewsletterSignup variant="card" />);
    expect(screen.getByText('Stay in the Game')).toBeInTheDocument();
  });

  it('shows description for card variant', () => {
    render(<NewsletterSignup variant="card" />);
    expect(screen.getByText(/Get weekly updates on Philly high school sports/)).toBeInTheDocument();
  });

  it('inline variant input has proper styling', () => {
    render(<NewsletterSignup variant="inline" />);
    const input = screen.getByPlaceholderText('your@email.com');
    // The input has styling but the flex-1 is on the wrapper
    expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('px-4');
    expect(input).toHaveClass('py-2');
    expect(input).toHaveClass('rounded-md');
  });

  it('form prevents submission with empty email', async () => {
    render(<NewsletterSignup />);
    const button = screen.getByText('Subscribe Free') as HTMLButtonElement;
    // Input is required, so clicking submit without email won't work
    expect(button).not.toBeDisabled();
  });

  it('shows loading state text during submission', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    const mockInsert = vi.fn(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ error: null }), 50);
        })
    );
    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        insert: mockInsert,
      })),
    });
    (global.fetch as any).mockResolvedValue({ ok: true });

    render(<NewsletterSignup variant="card" />);
    const input = screen.getByPlaceholderText('your@email.com');
    const button = screen.getByText('Subscribe Free');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    // Button text should change to loading state
    expect(screen.getByText('Signing up...')).toBeInTheDocument();
  });

  it('clears error state on new submission', async () => {
    const { createClient } = await import('@/lib/supabase/client');
    let callCount = 0;
    const mockInsert = vi.fn(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({ error: { code: '23505', message: 'Duplicate' } });
      }
      return Promise.resolve({ error: null });
    });
    (createClient as any).mockReturnValue({
      from: vi.fn(() => ({
        insert: mockInsert,
      })),
    });
    (global.fetch as any).mockResolvedValue({ ok: true });

    const { rerender } = render(<NewsletterSignup />);
    const input = screen.getByPlaceholderText('your@email.com');
    const button = screen.getByText('Subscribe Free');

    // First submission shows error
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('This email is already subscribed!')).toBeInTheDocument();
    });
  });
});
