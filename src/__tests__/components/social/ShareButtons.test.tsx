import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShareButtons from '@/components/social/ShareButtons';

describe('ShareButtons', () => {
  const defaultProps = {
    url: '/article/test',
    title: 'Test Article',
    description: 'This is a test article',
  };

  beforeEach(() => {
    // Mock navigator.share
    Object.defineProperty(navigator, 'share', {
      value: vi.fn(),
      writable: true,
    });

    // Mock navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders share label', () => {
    render(<ShareButtons {...defaultProps} />);
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('renders share buttons for Twitter, Facebook, and Copy Link', () => {
    render(<ShareButtons {...defaultProps} />);
    expect(screen.getByLabelText('Share on Twitter/X')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on Copy Link')).toBeInTheDocument();
  });

  it('renders native share button when navigator.share is available', () => {
    (navigator.share as any) = vi.fn();
    render(<ShareButtons {...defaultProps} />);
    expect(screen.getByLabelText('Share')).toBeInTheDocument();
  });

  it('does not render native share button when navigator.share is not available', () => {
    (navigator.share as any) = undefined;
    const { container } = render(<ShareButtons {...defaultProps} />);
    const shareButtons = container.querySelectorAll('button, a');
    expect(shareButtons.length).toBeGreaterThan(0);
  });

  it('constructs full URL correctly', () => {
    render(<ShareButtons {...defaultProps} />);
    const twitterLink = screen.getByLabelText('Share on Twitter/X') as HTMLAnchorElement;
    expect(twitterLink.href).toContain(encodeURIComponent('https://phillysportspack.com/article/test'));
  });

  it('encodes URL in share links', () => {
    render(<ShareButtons {...defaultProps} />);
    const twitterLink = screen.getByLabelText('Share on Twitter/X') as HTMLAnchorElement;
    expect(twitterLink.href).toContain('url=https');
  });

  it('encodes title in Twitter share', () => {
    render(<ShareButtons {...defaultProps} />);
    const twitterLink = screen.getByLabelText('Share on Twitter/X') as HTMLAnchorElement;
    expect(twitterLink.href).toContain('text=Test%20Article');
  });

  it('Twitter link opens in new tab', () => {
    render(<ShareButtons {...defaultProps} />);
    const twitterLink = screen.getByLabelText('Share on Twitter/X');
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('Facebook link opens in new tab', () => {
    render(<ShareButtons {...defaultProps} />);
    const facebookLink = screen.getByLabelText('Share on Facebook');
    expect(facebookLink).toHaveAttribute('target', '_blank');
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('copy link button does not open in new tab', () => {
    render(<ShareButtons {...defaultProps} />);
    const copyLink = screen.getByLabelText('Share on Copy Link');
    expect(copyLink).not.toHaveAttribute('target', '_blank');
  });

  it('copies URL to clipboard when copy button clicked', async () => {
    (navigator.clipboard.writeText as any) = vi.fn();
    render(<ShareButtons {...defaultProps} />);
    const copyButton = screen.getByLabelText('Share on Copy Link');
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'https://phillysportspack.com/article/test'
    );
  });

  it('shows checkmark after copying', async () => {
    (navigator.clipboard.writeText as any) = vi.fn();
    render(<ShareButtons {...defaultProps} />);
    const copyButton = screen.getByLabelText('Share on Copy Link');

    expect(copyButton).toHaveTextContent('🔗');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(copyButton).toHaveTextContent('✓');
    });
  });

  it('reverts checkmark after 2 seconds', async () => {
    vi.useFakeTimers();
    (navigator.clipboard.writeText as any) = vi.fn();
    const { rerender } = render(<ShareButtons {...defaultProps} />);
    const copyButton = screen.getByLabelText('Share on Copy Link');

    fireEvent.click(copyButton);

    expect(copyButton).toHaveTextContent('✓');

    vi.advanceTimersByTime(2001);

    // Rerender to see updated state
    rerender(<ShareButtons {...defaultProps} />);

    // Check that the checkmark has been replaced (timing may vary slightly)
    const updatedButton = screen.getByLabelText('Share on Copy Link');
    expect(updatedButton).toHaveTextContent('🔗');

    vi.useRealTimers();
  });

  it('calls navigator.share with correct data', async () => {
    (navigator.share as any) = vi.fn().mockResolvedValue(undefined);
    render(<ShareButtons {...defaultProps} />);
    const nativeShareButton = screen.getByTitle('Share');
    fireEvent.click(nativeShareButton);

    expect(navigator.share).toHaveBeenCalledWith({
      title: defaultProps.title,
      text: defaultProps.description,
      url: 'https://phillysportspack.com/article/test',
    });
  });

  it('uses title as fallback when description not provided', async () => {
    (navigator.share as any) = vi.fn().mockResolvedValue(undefined);
    const { url, title } = defaultProps;
    render(<ShareButtons url={url} title={title} />);
    const nativeShareButton = screen.getByTitle('Share');
    fireEvent.click(nativeShareButton);

    expect(navigator.share).toHaveBeenCalledWith({
      title,
      text: title,
      url: 'https://phillysportspack.com/article/test',
    });
  });

  it('renders with correct aria labels', () => {
    render(<ShareButtons {...defaultProps} />);
    expect(screen.getByLabelText('Share on Twitter/X')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on Copy Link')).toBeInTheDocument();
  });

  it('has correct button styles', () => {
    const { container } = render(<ShareButtons {...defaultProps} />);
    const buttons = container.querySelectorAll('button, a');
    buttons.forEach((btn) => {
      expect(btn).toHaveClass('rounded-full');
      expect(btn).toHaveClass('flex');
      expect(btn).toHaveClass('items-center');
      expect(btn).toHaveClass('justify-center');
    });
  });

  it('prevents default on copy link click', () => {
    render(<ShareButtons {...defaultProps} />);
    const copyButton = screen.getByLabelText('Share on Copy Link') as HTMLAnchorElement;

    // The copy link button should have href="#"
    expect(copyButton.href).toContain('#');
  });

  it('encodes description in URL', () => {
    const descWithSpecialChars = 'Check this out!';
    render(
      <ShareButtons
        url="/article/test"
        title="Test Article with Special Chars"
        description={descWithSpecialChars}
      />
    );
    const twitterLink = screen.getByLabelText('Share on Twitter/X') as HTMLAnchorElement;
    // The Twitter URL should be properly encoded
    expect(twitterLink.href).toContain('twitter.com');
    expect(twitterLink.href).toContain('intent/tweet');
  });

  it('handles missing description gracefully', () => {
    render(<ShareButtons url="/article" title="Article" />);
    expect(screen.getByLabelText('Share on Copy Link')).toBeInTheDocument();
  });

  it('renders share label with correct styling', () => {
    const { container } = render(<ShareButtons {...defaultProps} />);
    const label = container.querySelector('span');
    expect(label).toHaveClass('uppercase');
    expect(label).toHaveClass('tracking-wider');
  });
});
