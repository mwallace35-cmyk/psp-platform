import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';
import { describe, it, expect } from 'vitest';

describe('Footer', () => {
  it('renders footer element', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('contains copyright text', () => {
    render(<Footer />);
    const copyrightText = screen.getByText(/© \d+ PhillySportsPack\.com — All rights reserved\./);
    expect(copyrightText).toBeInTheDocument();
  });

  it('contains links to main sections', () => {
    render(<Footer />);

    // Check for sports links
    expect(screen.getByRole('link', { name: /Football/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Basketball/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Baseball/ })).toBeInTheDocument();

    // Check for data section links
    expect(screen.getByRole('link', { name: /Search/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Compare Players/ })).toBeInTheDocument();

    // Check for about section
    expect(screen.getByRole('link', { name: /Admin/ })).toBeInTheDocument();
  });

  it('contains company name and description', () => {
    render(<Footer />);
    expect(screen.getByText('PhillySportsPack')).toBeInTheDocument();
    expect(screen.getByText(/The definitive Philadelphia high school sports database/)).toBeInTheDocument();
  });

  it('displays credits for data and development', () => {
    render(<Footer />);
    expect(screen.getByText(/Ted Silary/)).toBeInTheDocument();
    expect(screen.getByText(/Mike Wallace/)).toBeInTheDocument();
  });
});
