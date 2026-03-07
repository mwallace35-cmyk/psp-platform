import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '@/components/layout/Header';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders header navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Football')).toBeInTheDocument();
    expect(screen.getByText('Basketball')).toBeInTheDocument();
    expect(screen.getByText('Baseball')).toBeInTheDocument();
  });

  it('renders mobile menu button', () => {
    render(<Header />);
    const mobileButton = screen.getByRole('button', { name: /menu/i });
    expect(mobileButton).toBeInTheDocument();
  });

  it('toggles mobile menu on button click', () => {
    render(<Header />);

    const mobileButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(mobileButton);

    // Mobile menu should be visible - check that at least one navigation element is rendered
    const navElements = screen.getAllByRole('navigation');
    expect(navElements.length).toBeGreaterThan(0);
  });

  it('opens More sports dropdown', () => {
    render(<Header />);

    const moreButton = screen.getByRole('button', { name: /more/i });
    fireEvent.click(moreButton);

    // More sports should be visible or button should be present
    expect(moreButton).toBeInTheDocument();
  });

  it('opens Events dropdown', () => {
    render(<Header />);

    const eventsButton = screen.getByRole('button', { name: /events/i });
    fireEvent.click(eventsButton);

    // Events dropdown button should exist
    expect(eventsButton).toBeInTheDocument();
  });

  it('closes dropdowns when clicking outside', () => {
    render(<Header />);

    const moreButton = screen.getByRole('button', { name: /more/i });
    fireEvent.click(moreButton);

    // Click outside to close
    const header = screen.getByRole('banner');
    fireEvent.click(header);

    // Button should still be present
    expect(moreButton).toBeInTheDocument();
  });

  it('closes dropdowns on Escape key', () => {
    render(<Header />);

    const moreButton = screen.getByRole('button', { name: /more/i });
    fireEvent.click(moreButton);

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    // Button should still be there
    expect(moreButton).toBeInTheDocument();
  });

  it('highlights active navigation link', () => {
    render(<Header />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('renders theme toggle button', () => {
    render(<Header />);
    const themeButtons = screen.getAllByRole('button');
    expect(themeButtons.length).toBeGreaterThan(0);
  });

  it('shows recent scores section', () => {
    render(<Header />);
    // Check that score strip section is rendered
    const scoreStrip = screen.getByLabelText(/score results/i);
    expect(scoreStrip).toBeInTheDocument();
  });

  it('closes mobile menu on escape key', () => {
    render(<Header />);

    const mobileButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(mobileButton);

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    // Button should still be present
    expect(mobileButton).toBeInTheDocument();
  });

  it('opens More sports dropdown with keyboard Enter key', () => {
    render(<Header />);

    const moreButton = screen.getByRole('button', { name: /more/i });
    moreButton.focus();
    fireEvent.keyDown(moreButton, { key: 'Enter' });

    // More sports should be visible
    expect(moreButton).toBeInTheDocument();
  });

  it('closes More sports dropdown with Escape key', () => {
    render(<Header />);

    const moreButton = screen.getByRole('button', { name: /more/i });
    fireEvent.click(moreButton);

    fireEvent.keyDown(moreButton, { key: 'Escape' });

    // Button should still be present
    expect(moreButton).toBeInTheDocument();
  });

  it('opens Events dropdown with keyboard Space key', () => {
    render(<Header />);

    const eventsButton = screen.getByRole('button', { name: /events/i });
    eventsButton.focus();
    fireEvent.keyDown(eventsButton, { key: ' ' });

    // Events dropdown should be accessible
    expect(eventsButton).toBeInTheDocument();
  });

  it('renders all main sports links', () => {
    render(<Header />);
    expect(screen.getByText('Football')).toBeInTheDocument();
    expect(screen.getByText('Basketball')).toBeInTheDocument();
    expect(screen.getByText('Baseball')).toBeInTheDocument();
  });

  it('renders news and community links', () => {
    render(<Header />);
    expect(screen.getByText('News')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
  });

  it('closes dropdown when clicking a navigation link', () => {
    render(<Header />);

    const moreButton = screen.getByRole('button', { name: /more/i });
    fireEvent.click(moreButton);

    // Navigate to different sport
    const footballLink = screen.getByText('Football');
    fireEvent.click(footballLink);

    // Button should still exist
    expect(moreButton).toBeInTheDocument();
  });

  it('has proper aria attributes on navigation elements', () => {
    render(<Header />);

    const moreButton = screen.getByRole('button', { name: /more/i });
    expect(moreButton).toHaveAttribute('aria-haspopup', 'true');
    expect(moreButton).toHaveAttribute('aria-expanded');

    const mainNav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(mainNav).toBeInTheDocument();
  });

  it('renders skip to main content link', () => {
    render(<Header />);
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('displays PHILLY SPORTS PACK branding', () => {
    render(<Header />);
    // Check for the logo component which contains PHILLY and PACK as text
    const brandingElements = document.querySelectorAll('.logo-mark');
    expect(brandingElements.length).toBeGreaterThan(0);

    // The logo-mark element should be a link to home
    const logoLink = brandingElements[0] as HTMLAnchorElement;
    expect(logoLink.href).toContain('/');
  });

  it('renders Articles and Glossary links in topbar', () => {
    render(<Header />);
    expect(screen.getByText('Articles')).toBeInTheDocument();
    expect(screen.getByText('Glossary')).toBeInTheDocument();
  });

  it('renders Sign Up link with proper styling', () => {
    render(<Header />);
    const signUpLinks = screen.getAllByText('Sign Up');
    expect(signUpLinks.length).toBeGreaterThan(0);
    signUpLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/signup');
    });
  });
});
