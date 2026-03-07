# Contributing to PSP Platform

Thank you for your interest in contributing to the Philadelphia Sports Pack platform! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally: `git clone https://github.com/your-username/psp-platform.git`
3. **Add upstream remote**: `git remote add upstream https://github.com/original-repo.git`
4. **Create a feature branch**: `git checkout -b feature/your-feature-name`

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## Coding Standards

### TypeScript
- Use strict TypeScript mode
- Define interfaces for all function parameters and return types
- Avoid `any` type - use `unknown` if necessary
- Use type narrowing for safer code

```typescript
// Good
interface User {
  id: number;
  name: string;
  email: string;
}

function getUser(id: number): Promise<User> {
  // implementation
}

// Avoid
function getUser(id: any): any {
  // implementation
}
```

### React Components
- Use functional components with hooks
- Keep components focused and single-responsibility
- Extract reusable logic into custom hooks
- Use React.memo for expensive components

```typescript
// Good
interface CardProps {
  title: string;
  description: string;
  onClick: () => void;
}

export function Card({ title, description, onClick }: CardProps) {
  return (
    <div onClick={onClick} className="border rounded-lg p-4">
      <h3 className="font-bold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Avoid inline props without types
export function Card(props) {
  // implementation
}
```

### Styling
- Use Tailwind CSS utility classes
- Reference design tokens for consistency
- Ensure responsive design with mobile-first approach
- Use CSS variables for theme-aware colors

```typescript
// Good - Tailwind with design tokens
<div className="rounded-lg shadow-md p-4 md:p-6">
  <button className="rounded-md bg-gold text-navy hover:bg-gold/90">
    Click me
  </button>
</div>

// Avoid - Inline styles or one-off custom CSS
<div style={{ borderRadius: "8px", padding: "16px" }}>
  <button style={{ backgroundColor: "#f0a500" }}>
    Click me
  </button>
</div>
```

### Error Handling
- Always include try/catch blocks for async operations
- Use the centralized error handling in `src/lib/errors.ts`
- Provide meaningful error messages to users

```typescript
// Good
try {
  const data = await supabase.from('table').select();
  if (error) throw error;
  return data;
} catch (error) {
  console.error('Failed to fetch data:', error);
  toastError('Failed to load data. Please try again.');
}

// Avoid
const data = await supabase.from('table').select();
return data;
```

### API Routes
- Use `apiSuccess()` and `apiError()` helpers for consistent responses
- Validate all inputs
- Implement proper error handling
- Add rate limiting for public endpoints

```typescript
// Good
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate input
    if (!data.email) {
      return apiError('Email is required', 400);
    }

    // Process data
    const result = await processData(data);

    return apiSuccess(result, 'Operation completed successfully');
  } catch (error) {
    return apiError('Internal server error', 500);
  }
}
```

## Form Development

### Using Toast Notifications

When working with forms, use the `useToast` hook for user feedback:

```typescript
'use client';

import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui';

export function MyForm() {
  const { toasts, removeToast, success, error } = useToast();

  async function handleSubmit() {
    try {
      // Validate form
      if (!title.trim()) {
        error('Title is required');
        return;
      }

      // Submit form
      await submitForm();

      success('Form submitted successfully!');
    } catch (err) {
      error('Failed to submit form. Please try again.');
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts.map(t => ({ ...t, onClose: removeToast }))} />
      {/* Form content */}
    </>
  );
}
```

### Toast Variants
- `success()`: For successful operations
- `error()`: For errors
- `warning()`: For warnings
- `info()`: For informational messages

## Testing

### Unit Tests
```bash
npm run test -- --watch
```

### Integration Tests
```bash
npm run test:integration
```

### Coverage Report
```bash
npm run test:coverage
```

### Writing Tests

```typescript
// Good - Clear test description
describe('getPlayerBySlug', () => {
  it('should return a player when given a valid slug', async () => {
    const player = await getPlayerBySlug('john-doe');
    expect(player).toBeDefined();
    expect(player?.name).toBe('John Doe');
  });

  it('should return null when player does not exist', async () => {
    const player = await getPlayerBySlug('nonexistent');
    expect(player).toBeNull();
  });
});
```

## Git Commit Guidelines

Use semantic commit messages:

```
feat: Add user profile page
fix: Correct toast notification timing
docs: Update API documentation
refactor: Simplify form validation logic
test: Add tests for data service
style: Format code according to standards
chore: Update dependencies
```

Format:
```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

## Pull Request Process

1. **Update your branch** with latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature
   ```

3. **Create a Pull Request** with:
   - Clear title describing changes
   - Detailed description of what changed and why
   - Reference to any related issues
   - Screenshots for UI changes

4. **Respond to feedback** promptly and professionally

5. **Ensure CI passes** before merge

## Code Review Guidelines

When reviewing code:
- Check for TypeScript type safety
- Verify error handling is present
- Ensure responsive design for UI changes
- Look for security vulnerabilities
- Check for code duplication
- Verify tests are included

## Documentation

### README Format
- Use clear, concise language
- Include code examples
- Add table of contents for longer files
- Keep it up-to-date with code changes

### Comment Guidelines
```typescript
// Good - Explains WHY, not WHAT
// We cache this result because the API call is expensive
const cachedResult = memo(() => expensiveCalculation());

// Avoid - Obvious comments
// Increment i
i++;
```

### JSDoc Comments
```typescript
/**
 * Fetches player statistics by ID
 * @param playerId - The unique player identifier
 * @param sportId - The sport type (football, basketball, etc)
 * @returns Promise with player statistics
 * @throws Error if player not found
 */
export async function getPlayerStats(
  playerId: number,
  sportId: string
): Promise<PlayerStats> {
  // implementation
}
```

## Performance Considerations

- Minimize bundle size by lazy-loading components
- Use Supabase RLS for row-level security
- Implement pagination for large datasets
- Cache frequently accessed data
- Use Next.js Image optimization for images

## Security Guidelines

- Never commit credentials or API keys
- Validate and sanitize user input
- Use environment variables for sensitive data
- Implement CSRF protection on forms
- Follow Supabase security best practices
- Keep dependencies updated

## Accessibility

- Use semantic HTML elements
- Include ARIA labels for screen readers
- Ensure color contrast meets WCAG standards
- Support keyboard navigation
- Test with accessibility tools

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. Deploy to production

## Need Help?

- **Questions?** Open a GitHub discussion
- **Found a bug?** Open a GitHub issue
- **Have an idea?** Start a discussion first

## Thank You!

Your contributions make this project better. We appreciate your time and effort!
