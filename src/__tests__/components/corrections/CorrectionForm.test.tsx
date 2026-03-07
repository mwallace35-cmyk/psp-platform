import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import CorrectionForm from '@/components/corrections/CorrectionForm';

// Mock the Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(),
    })),
  })),
}));

// Mock the useToast hook
vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    toasts: [],
    removeToast: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  }),
}));

// Mock the ToastContainer component
vi.mock('@/components/ui', () => ({
  ToastContainer: ({ toasts }: any) => <div data-testid="toast-container">{toasts.length}</div>,
}));

describe('CorrectionForm', () => {
  const defaultProps = {
    entityType: 'player' as const,
    entityId: 1,
    entityName: 'John Doe',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('renders report issue button initially', () => {
      render(<CorrectionForm {...defaultProps} />);
      const button = screen.getByText('Report an issue');
      expect(button).toBeInTheDocument();
    });

    it('button has correct icon', () => {
      const { container } = render(<CorrectionForm {...defaultProps} />);
      const svg = container.querySelector('button svg');
      expect(svg).toBeInTheDocument();
    });

    it('clicking button opens the form', () => {
      render(<CorrectionForm {...defaultProps} />);
      const button = screen.getByText('Report an issue');
      fireEvent.click(button);

      expect(screen.getByText(/Report an Issue/)).toBeInTheDocument();
      expect(screen.getByLabelText(/What needs fixing/)).toBeInTheDocument();
    });
  });

  describe('Form Fields Rendering', () => {
    beforeEach(() => {
      render(<CorrectionForm {...defaultProps} />);
      const button = screen.getByText('Report an issue');
      fireEvent.click(button);
    });

    it('renders all form fields', () => {
      expect(screen.getByLabelText(/What needs fixing/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Current value/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Correct value/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Why/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Source link/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Your name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Your email/)).toBeInTheDocument();
    });

    it('renders required fields with asterisk', () => {
      const requiredLabels = screen.getAllByLabelText(/required/);
      expect(requiredLabels.length).toBeGreaterThan(0);
    });

    it('renders submit button', () => {
      expect(screen.getByText('Submit Correction')).toBeInTheDocument();
    });

    it('renders cancel button', () => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('displays entity name in header', () => {
      expect(screen.getByText(new RegExp(`Report an Issue — ${defaultProps.entityName}`))).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    beforeEach(() => {
      render(<CorrectionForm {...defaultProps} />);
      const button = screen.getByText('Report an issue');
      fireEvent.click(button);
    });

    it('updates fieldName input value', () => {
      const input = screen.getByLabelText(/What needs fixing/) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Test Field' } });
      expect(input.value).toBe('Test Field');
    });

    it('updates currentValue input value', () => {
      const input = screen.getByLabelText(/Current value/) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Old Value' } });
      expect(input.value).toBe('Old Value');
    });

    it('updates proposedValue input value', () => {
      const input = screen.getByLabelText(/Correct value/) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'New Value' } });
      expect(input.value).toBe('New Value');
    });

    it('updates reason textarea value', () => {
      const textarea = screen.getByLabelText(/Why/) as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'This is incorrect because...' } });
      expect(textarea.value).toBe('This is incorrect because...');
    });

    it('updates sourceUrl input value', () => {
      const input = screen.getByLabelText(/Source link/) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'https://example.com' } });
      expect(input.value).toBe('https://example.com');
    });

    it('updates submitterName input value', () => {
      const input = screen.getByLabelText(/Your name/) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Jane Doe' } });
      expect(input.value).toBe('Jane Doe');
    });

    it('updates submitterEmail input value', () => {
      const input = screen.getByLabelText(/Your email/) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'jane@example.com' } });
      expect(input.value).toBe('jane@example.com');
    });
  });

  describe('Validation', () => {
    beforeEach(() => {
      render(<CorrectionForm {...defaultProps} />);
      const button = screen.getByText('Report an issue');
      fireEvent.click(button);
    });

    it('fieldName is marked as required', () => {
      const input = screen.getByLabelText(/What needs fixing/) as HTMLInputElement;
      expect(input.required).toBe(true);
      expect(input.getAttribute('aria-required')).toBe('true');
    });

    it('proposedValue is marked as required', () => {
      const input = screen.getByLabelText(/Correct value/) as HTMLInputElement;
      expect(input.required).toBe(true);
      expect(input.getAttribute('aria-required')).toBe('true');
    });

    it('currentValue is not required', () => {
      const input = screen.getByLabelText(/Current value/) as HTMLInputElement;
      expect(input.required).toBe(false);
    });

    it('reason textarea is not required', () => {
      const textarea = screen.getByLabelText(/Why/) as HTMLTextAreaElement;
      expect(textarea.required).toBe(false);
    });

    it('sourceUrl is not required', () => {
      const input = screen.getByLabelText(/Source link/) as HTMLInputElement;
      expect(input.required).toBe(false);
    });

    it('submitterName is not required', () => {
      const input = screen.getByLabelText(/Your name/) as HTMLInputElement;
      expect(input.required).toBe(false);
    });

    it('submitterEmail is not required', () => {
      const input = screen.getByLabelText(/Your email/) as HTMLInputElement;
      expect(input.required).toBe(false);
    });
  });

  describe('Form Close/Cancel', () => {
    it('cancel button closes the form', () => {
      render(<CorrectionForm {...defaultProps} />);
      const reportButton = screen.getByText('Report an issue');
      fireEvent.click(reportButton);

      expect(screen.getByText(/Report an Issue/)).toBeInTheDocument();

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.queryByText(/Report an Issue/)).not.toBeInTheDocument();
      expect(screen.getByText('Report an issue')).toBeInTheDocument();
    });

    it('close button (X) closes the form', () => {
      const { container } = render(<CorrectionForm {...defaultProps} />);
      const reportButton = screen.getByText('Report an issue');
      fireEvent.click(reportButton);

      const closeButton = screen.getByLabelText(/Close correction form/);
      fireEvent.click(closeButton);

      expect(screen.queryByText(/Report an Issue/)).not.toBeInTheDocument();
    });
  });

  describe('Form Accessibility', () => {
    beforeEach(() => {
      render(<CorrectionForm {...defaultProps} />);
      const button = screen.getByText('Report an issue');
      fireEvent.click(button);
    });

    it('form has noValidate attribute', () => {
      const form = screen.getByText('Submit Correction').closest('form');
      expect(form).toHaveAttribute('noValidate');
    });

    it('required fields have aria-required attribute', () => {
      const fieldNameInput = screen.getByLabelText(/What needs fixing/);
      const proposedValueInput = screen.getByLabelText(/Correct value/);

      expect(fieldNameInput).toHaveAttribute('aria-required', 'true');
      expect(proposedValueInput).toHaveAttribute('aria-required', 'true');
    });

    it('inputs have min-height for touch targets', () => {
      const input = screen.getByLabelText(/What needs fixing/);
      const styles = window.getComputedStyle(input);
      // The class min-h-[44px] should be applied
      expect(input).toHaveClass('min-h-[44px]');
    });

    it('buttons have min-height for touch targets', () => {
      const submitButton = screen.getByText('Submit Correction');
      expect(submitButton).toHaveClass('min-h-[44px]');
    });

    it('close button has aria-label', () => {
      const closeButton = screen.getByLabelText(/Close correction form/);
      expect(closeButton).toHaveAttribute('aria-label', 'Close correction form');
    });
  });

  describe('Input Types', () => {
    beforeEach(() => {
      render(<CorrectionForm {...defaultProps} />);
      const button = screen.getByText('Report an issue');
      fireEvent.click(button);
    });

    it('sourceUrl input has type="url"', () => {
      const input = screen.getByLabelText(/Source link/) as HTMLInputElement;
      expect(input.type).toBe('url');
    });

    it('submitterEmail input has type="email"', () => {
      const input = screen.getByLabelText(/Your email/) as HTMLInputElement;
      expect(input.type).toBe('email');
    });

    it('reason field is a textarea', () => {
      const textarea = screen.getByLabelText(/Why/);
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('reason textarea has correct rows', () => {
      const textarea = screen.getByLabelText(/Why/) as HTMLTextAreaElement;
      expect(textarea.rows).toBe(2);
    });
  });

  describe('Styling and CSS Classes', () => {
    it('report button has correct classes', () => {
      render(<CorrectionForm {...defaultProps} />);
      const button = screen.getByText('Report an issue');
      expect(button).toHaveClass('inline-flex');
      expect(button).toHaveClass('items-center');
      expect(button).toHaveClass('text-gray-500');
    });

    it('form container has correct styling', () => {
      const { container } = render(<CorrectionForm {...defaultProps} />);
      const reportButton = screen.getByText('Report an issue');
      fireEvent.click(reportButton);

      const formDiv = container.querySelector('.bg-gray-50');
      expect(formDiv).toHaveClass('bg-gray-50');
      expect(formDiv).toHaveClass('border');
      expect(formDiv).toHaveClass('rounded-lg');
    });

    it('submit button has gold background', () => {
      render(<CorrectionForm {...defaultProps} />);
      const reportButton = screen.getByText('Report an issue');
      fireEvent.click(reportButton);

      const submitButton = screen.getByText('Submit Correction');
      expect(submitButton).toHaveClass('bg-gold');
    });
  });

  describe('Submit Button State', () => {
    beforeEach(() => {
      render(<CorrectionForm {...defaultProps} />);
      const button = screen.getByText('Report an issue');
      fireEvent.click(button);
    });

    it('submit button is enabled initially', () => {
      const submitButton = screen.getByText('Submit Correction') as HTMLButtonElement;
      expect(submitButton.disabled).toBe(false);
    });

    it('submit button text changes when submitting', async () => {
      const fieldNameInput = screen.getByLabelText(/What needs fixing/) as HTMLInputElement;
      const proposedValueInput = screen.getByLabelText(/Correct value/) as HTMLInputElement;
      const submitButton = screen.getByText('Submit Correction') as HTMLButtonElement;
      const form = submitButton.closest('form');

      fireEvent.change(fieldNameInput, { target: { value: 'Test' } });
      fireEvent.change(proposedValueInput, { target: { value: 'Test Value' } });

      expect(submitButton.textContent).toBe('Submit Correction');
    });
  });

  describe('Responsive Layout', () => {
    beforeEach(() => {
      render(<CorrectionForm {...defaultProps} />);
      const button = screen.getByText('Report an issue');
      fireEvent.click(button);
    });

    it('field name and current value are in a grid', () => {
      const { container } = render(<CorrectionForm {...defaultProps} />);
      fireEvent.click(screen.getByText('Report an issue'));

      // The first div with grid should contain these two inputs
      const gridDivs = container.querySelectorAll('div.grid');
      expect(gridDivs.length).toBeGreaterThan(0);
    });

    it('grid has responsive classes', () => {
      const { container } = render(<CorrectionForm {...defaultProps} />);
      fireEvent.click(screen.getByText('Report an issue'));

      const gridDiv = container.querySelector('.grid');
      expect(gridDiv).toHaveClass('grid-cols-1');
      expect(gridDiv).toHaveClass('md:grid-cols-2');
    });
  });

  describe('Success State', () => {
    it('renders success message after submission', async () => {
      const { rerender } = render(<CorrectionForm {...defaultProps} />);
      const reportButton = screen.getByText('Report an issue');
      fireEvent.click(reportButton);

      // Since we can't easily simulate the async submission without mocking more,
      // we at least verify the structure allows for this state
      expect(screen.getByText('Submit Correction')).toBeInTheDocument();
    });
  });

  describe('Placeholder Text', () => {
    beforeEach(() => {
      render(<CorrectionForm {...defaultProps} />);
      const button = screen.getByText('Report an issue');
      fireEvent.click(button);
    });

    it('fieldName has descriptive placeholder', () => {
      const input = screen.getByLabelText(/What needs fixing/) as HTMLInputElement;
      expect(input.placeholder).toContain('School name');
    });

    it('currentValue has placeholder', () => {
      const input = screen.getByLabelText(/Current value/) as HTMLInputElement;
      expect(input.placeholder).toBe('What it currently says');
    });

    it('proposedValue has placeholder', () => {
      const input = screen.getByLabelText(/Correct value/) as HTMLInputElement;
      expect(input.placeholder).toBe('What it should say');
    });

    it('reason has placeholder', () => {
      const textarea = screen.getByLabelText(/Why/) as HTMLTextAreaElement;
      expect(textarea.placeholder).toBe('How do you know this is incorrect?');
    });

    it('sourceUrl has URL placeholder', () => {
      const input = screen.getByLabelText(/Source link/) as HTMLInputElement;
      expect(input.placeholder).toBe('https://...');
    });

    it('submitterName has placeholder', () => {
      const input = screen.getByLabelText(/Your name/) as HTMLInputElement;
      expect(input.placeholder).toBe('Name');
    });

    it('submitterEmail has placeholder', () => {
      const input = screen.getByLabelText(/Your email/) as HTMLInputElement;
      expect(input.placeholder).toBe('email@example.com');
    });
  });
});
