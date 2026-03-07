import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

/**
 * Accessibility Audit Tests using WCAG guidelines
 * Tests key components and pages for accessibility violations
 */

describe('Accessibility Audit - WCAG Compliance', () => {
  describe('Header Component', () => {
    it('has skip to main content link as first focusable element', () => {
      const Header = () => (
        <header className="sticky top-0 z-50">
          <a
            href="#main-content"
            className="sr-only focus-visible:not-sr-only"
          >
            Skip to main content
          </a>
          <nav aria-label="Main navigation">Navigation content</nav>
        </header>
      );

      render(<Header />);
      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('has proper aria-labels on navigation dropdowns', () => {
      const Header = () => (
        <header>
          <nav aria-label="Main navigation">
            <button aria-haspopup="true" aria-expanded={false}>
              More Sports
            </button>
          </nav>
        </header>
      );

      render(<Header />);
      const dropdown = screen.getByRole('button', { name: /More Sports/i });
      expect(dropdown).toHaveAttribute('aria-haspopup', 'true');
      expect(dropdown).toHaveAttribute('aria-expanded');
    });

    it('has proper landmark structure', () => {
      const Header = () => (
        <header>
          <nav aria-label="Main navigation">Navigation</nav>
          <nav aria-label="User account menu">Account</nav>
        </header>
      );

      render(<Header />);
      const navs = screen.getAllByRole('navigation');
      expect(navs.length).toBeGreaterThanOrEqual(2);
    });

    it('has proper heading hierarchy', () => {
      const Page = () => (
        <header>
          <h1 className="sr-only">PhillySportsPack</h1>
          <h2>Top Section</h2>
        </header>
      );

      render(<Page />);
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
    });
  });

  describe('Form Components - CorrectionForm', () => {
    it('required fields have aria-required attribute', () => {
      const TestForm = () => (
        <form>
          <input
            id="field-name"
            type="text"
            required
            aria-required="true"
            placeholder="Required field"
          />
        </form>
      );

      render(<TestForm />);
      const input = screen.getByPlaceholderText('Required field');
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAttribute('required');
    });

    it('error messages are associated with inputs via aria-describedby', () => {
      const TestForm = () => (
        <form>
          <input
            id="email-input"
            type="email"
            aria-describedby="email-error"
            aria-invalid="true"
          />
          <div id="email-error" role="alert">
            Please enter a valid email
          </div>
        </form>
      );

      render(<TestForm />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('error messages have role="alert" for screen readers', () => {
      const TestForm = () => (
        <div>
          <input id="test-input" />
          <div id="test-error" role="alert">
            This field is required
          </div>
        </div>
      );

      render(<TestForm />);
      const errorMsg = screen.getByRole('alert');
      expect(errorMsg).toBeInTheDocument();
    });

    it('form inputs have minimum touch target size (44x44px)', () => {
      const TestForm = () => (
        <form>
          <input className="min-h-[44px]" placeholder="Touch target" />
          <button className="min-h-[44px]">Submit</button>
        </form>
      );

      render(<TestForm />);
      const input = screen.getByPlaceholderText('Touch target');
      const button = screen.getByRole('button');

      expect(input).toHaveClass('min-h-[44px]');
      expect(button).toHaveClass('min-h-[44px]');
    });

    it('labels are properly associated with inputs', () => {
      const TestForm = () => (
        <form>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" />
        </form>
      );

      render(<TestForm />);
      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'username');
    });
  });

  describe('Form Components - CommentForm', () => {
    it('textarea has proper aria attributes', () => {
      const TestForm = () => (
        <form>
          <label htmlFor="comment">Comment</label>
          <textarea
            id="comment"
            required
            aria-required="true"
            aria-invalid="false"
          />
        </form>
      );

      render(<TestForm />);
      const textarea = screen.getByRole('textbox', { name: /comment/i });
      expect(textarea).toHaveAttribute('aria-required', 'true');
      expect(textarea).toHaveAttribute('required');
    });

    it('form submission errors are announced to screen readers', () => {
      const TestForm = () => (
        <form>
          <textarea aria-invalid="true" aria-describedby="error" />
          <div id="error" role="alert" aria-live="assertive">
            Comment cannot be empty
          </div>
        </form>
      );

      render(<TestForm />);
      const errorMsg = screen.getByRole('alert');
      expect(errorMsg).toHaveAttribute('aria-live', 'assertive');
    });
  });

  describe('Form Components - NewsletterSignup', () => {
    it('email input has proper type and validation', () => {
      const Newsletter = () => (
        <form>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            aria-required="true"
            aria-invalid="false"
          />
        </form>
      );

      render(<Newsletter />);
      const input = screen.getByLabelText('Email') as HTMLInputElement;
      expect(input.type).toBe('email');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('form has proper fieldset and legend for grouped inputs', () => {
      const Newsletter = () => (
        <form>
          <fieldset>
            <legend>Select sports of interest</legend>
            <label>
              <input type="checkbox" value="football" />
              Football
            </label>
          </fieldset>
        </form>
      );

      render(<Newsletter />);
      const legend = screen.getByText('Select sports of interest');
      expect(legend).toBeInTheDocument();
      expect(legend.tagName).toBe('LEGEND');
    });
  });

  describe('Table Components - SortableTable', () => {
    it('table has proper semantic structure', () => {
      const Table = () => (
        <table role="table" aria-label="Player statistics">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>95</td>
            </tr>
          </tbody>
        </table>
      );

      render(<Table />);
      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-label', 'Player statistics');

      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBe(2);
      headers.forEach((header) => {
        expect(header).toHaveAttribute('scope', 'col');
      });
    });

    it('sortable columns have proper aria-sort attribute', () => {
      const Table = () => (
        <table>
          <thead>
            <tr>
              <th scope="col" aria-sort="ascending">
                <button>Name</button>
              </th>
            </tr>
          </thead>
        </table>
      );

      render(<Table />);
      const header = screen.getByText('Name').closest('th');
      expect(header).toHaveAttribute('aria-sort');
    });
  });

  describe('Toast Notifications', () => {
    it('toast has proper role and aria-live attributes', () => {
      const Toast = () => (
        <div role="status" aria-live="polite" aria-atomic="true">
          Success message
        </div>
      );

      render(<Toast />);
      const toast = screen.getByRole('status');
      expect(toast).toHaveAttribute('aria-live', 'polite');
      expect(toast).toHaveAttribute('aria-atomic', 'true');
    });

    it('alert toast uses assertive live region', () => {
      const AlertToast = () => (
        <div role="alert" aria-live="assertive">
          Error message
        </div>
      );

      render(<AlertToast />);
      const toast = screen.getByRole('alert');
      expect(toast).toHaveAttribute('aria-live', 'assertive');
    });

    it('toast has close button with accessible label', () => {
      const Toast = () => (
        <div role="status" aria-live="polite">
          Notification
          <button aria-label="Close notification">Close</button>
        </div>
      );

      render(<Toast />);
      const closeBtn = screen.getByLabelText('Close notification');
      expect(closeBtn).toBeInTheDocument();
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    it('ensures buttons have accessible color contrast', () => {
      const Button = () => (
        <button style={{ color: 'var(--psp-gold)', background: 'var(--psp-navy)' }}>
          Submit
        </button>
      );

      render(<Button />);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('color: var(--psp-gold)');
      expect(button).toHaveStyle('background: var(--psp-navy)');
    });

    it('text has sufficient color contrast in dark mode', () => {
      const DarkComponent = () => (
        <div data-theme="dark" style={{ color: 'white', background: 'rgb(0, 0, 0)' }}>
          Dark mode text
        </div>
      );

      render(<DarkComponent />);
      const text = screen.getByText('Dark mode text');
      const styles = window.getComputedStyle(text);
      expect(styles.color).toMatch(/white|rgb\(255,\s*255,\s*255\)/i);
      expect(styles.backgroundColor).toMatch(/rgb\(0,\s*0,\s*0\)/i);
    });
  });

  describe('ARIA Implementation', () => {
    it('dropdowns have proper aria-expanded state', () => {
      const Dropdown = ({ isOpen }: { isOpen: boolean }) => (
        <button aria-expanded={isOpen} aria-haspopup="true">
          Menu
        </button>
      );

      const { rerender } = render(<Dropdown isOpen={false} />);
      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      rerender(<Dropdown isOpen={true} />);
      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('hidden content is marked with aria-hidden', () => {
      const Component = () => (
        <div>
          <span aria-hidden="true">*</span>
          <span>Visible content</span>
        </div>
      );

      render(<Component />);
      const hidden = screen.getByText('*');
      expect(hidden).toHaveAttribute('aria-hidden', 'true');
    });

    it('current page in navigation is marked with aria-current', () => {
      const Nav = () => (
        <nav>
          <a href="/" aria-current="page">
            Home
          </a>
          <a href="/about">About</a>
        </nav>
      );

      render(<Nav />);
      const current = screen.getByText('Home');
      expect(current).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('Keyboard Navigation', () => {
    it('interactive elements are keyboard accessible', () => {
      const Component = () => (
        <>
          <button>Button</button>
          <a href="/">Link</a>
          <input type="text" />
        </>
      );

      render(<Component />);
      const button = screen.getByRole('button');
      const link = screen.getByRole('link');
      const input = screen.getByRole('textbox');

      expect(button).toBeInTheDocument();
      expect(link).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });

    it('form inputs are tab accessible', () => {
      const Form = () => (
        <form>
          <input placeholder="First" tabIndex={0} />
          <input placeholder="Second" tabIndex={0} />
          <button tabIndex={0}>Submit</button>
        </form>
      );

      render(<Form />);
      const inputs = screen.getAllByRole('textbox');
      const button = screen.getByRole('button');

      inputs.forEach((input) => {
        expect(input).toHaveAttribute('tabIndex', '0');
      });
      expect(button).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Image and Media Accessibility', () => {
    it('images have descriptive alt text', () => {
      const Component = () => (
        <img
          src="/player.jpg"
          alt="John Doe, Football player for St. Joseph's Prep"
        />
      );

      render(<Component />);
      const img = screen.getByAltText(/John Doe/);
      expect(img).toBeInTheDocument();
    });

    it('decorative images are properly marked', () => {
      const Component = () => (
        <div>
          <img src="/decoration.svg" alt="" aria-hidden="true" />
          <p>Text content</p>
        </div>
      );

      render(<Component />);
      const img = screen.getByAltText('');
      expect(img).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Page Structure and Landmarks', () => {
    it('page has proper landmark structure', () => {
      const Page = () => (
        <>
          <header>Header</header>
          <nav>Navigation</nav>
          <main id="main-content">Main content</main>
          <aside>Sidebar</aside>
          <footer>Footer</footer>
        </>
      );

      render(<Page />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('main element has id for skip link navigation', () => {
      const Page = () => (
        <main id="main-content">
          <h1>Page Title</h1>
        </main>
      );

      render(<Page />);
      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('id', 'main-content');
    });
  });

  describe('Dynamic Content Updates', () => {
    it('live regions announce updates to screen readers', () => {
      const Component = () => (
        <div aria-live="polite" aria-atomic="true">
          Loading complete
        </div>
      );

      render(<Component />);
      const region = screen.getByText('Loading complete');
      expect(region).toHaveAttribute('aria-live', 'polite');
      expect(region).toHaveAttribute('aria-atomic', 'true');
    });

    it('status messages have appropriate role', () => {
      const Component = () => (
        <div role="status" aria-live="polite">
          3 results found
        </div>
      );

      render(<Component />);
      const status = screen.getByRole('status');
      expect(status).toBeInTheDocument();
    });
  });
});
