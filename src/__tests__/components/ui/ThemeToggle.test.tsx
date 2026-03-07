import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.setAttribute('data-theme', 'light');

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders toggle button', async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  it('has proper aria-label for light mode', async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });
  });

  it('toggles between light/dark on click', async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');

      // Click to switch to dark mode
      fireEvent.click(button);

      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
      expect(localStorage.getItem('psp-theme')).toBe('dark');
    });
  });

  it('updates aria-label when theme changes', async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      const button = screen.getByRole('button');

      // Initial state
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');

      // Toggle to dark
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');

      // Toggle back to light
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });
  });
});
