# PSP Platform Architecture

## Overview

The Philadelphia Sports Pack (PSP) platform is built on a modern, scalable architecture using Next.js 16, React 19, and TypeScript. This document outlines the architectural decisions, patterns, and best practices.

## Core Architecture Principles

1. **Modularity**: Components and utilities are organized by feature/domain
2. **Type Safety**: Full TypeScript coverage with strict mode enabled
3. **Scalability**: Prepared for growth with clear separation of concerns
4. **Accessibility**: WCAG 2.1 compliant throughout the application
5. **Performance**: Optimized for Core Web Vitals
6. **Security**: Built-in protections against common web vulnerabilities

## Application Layers

### 1. Presentation Layer (Components)

**Location**: `src/components/`

Components are organized by feature/domain:

```
components/
├── ui/              # Shared UI components (Button, Card, Toast, etc.)
├── admin/           # Admin dashboard components
├── corrections/     # Data correction components
├── articles/        # Article-related components
├── recruiting/      # Recruiting page components
└── [feature]/       # Feature-specific components
```

**Component Patterns**:
- Functional components with React hooks
- Props typed with TypeScript interfaces
- Compound component pattern for complex UIs
- Custom hooks for reusable logic

### 2. State Management

**Location**: `src/hooks/`

**Approach**: React Context + Hooks (no Redux/Zustand)

- `useToast`: Manages notification state globally
- Custom hooks for feature-specific state management
- Supabase real-time subscriptions for live data

**Benefits**:
- Simpler mental model than Redux
- Reduced bundle size
- Easier to learn and maintain
- Sufficient for current app complexity

### 3. Business Logic Layer

**Location**: `src/lib/`

**Key modules**:

#### Data Access (`src/lib/data.ts` - 1,315 lines)
- Centralized data access functions
- Abstraction over Supabase queries
- Entity-specific query builders
- Leaderboard and statistics calculations

**Function Categories**:
- School queries: `getSchoolBySlug`, `getSchoolsBySport`
- Player queries: `getPlayerBySlug`, `getPlayerStats`
- Statistics: `getLeaderboard`, `getFootballLeaders`
- Search: `searchAll`
- Articles: `getArticleBySlug`, `getFeaturedArticles`

#### API Response Helpers (`src/lib/api-response.ts`)
```typescript
// Standardized response format
apiSuccess(data, message): { success: true, data, message }
apiError(message, status): { success: false, error, status }
```

**Benefits**:
- Consistent API response format
- Type-safe responses
- Reduced boilerplate in route handlers

#### Error Handling (`src/lib/errors.ts`)
```typescript
class AppError extends Error {
  code: string;
  statusCode: number;
}
```

**Benefits**:
- Structured error information
- Type-safe error handling
- Centralized error logging

#### Utilities
- `env.ts`: Environment variable validation with Zod
- `sanitize.ts`: Input sanitization for security
- `csrf.ts`: CSRF token generation and validation
- `rate-limit.ts`: Rate limiting middleware
- `retry.ts`: Retry logic for failed requests

### 4. API Layer

**Location**: `src/app/api/`

**Architecture**:
- Route handlers using Next.js App Router
- CSRF protection on form submissions
- Rate limiting on public endpoints
- Standardized error responses

**Endpoints**:
- `/api/[resource]`: RESTful endpoints
- `/api/auth/*`: Authentication routes
- `/api/ai/*`: AI-powered features

### 5. Database Layer

**Database**: Supabase (PostgreSQL)

**Security**:
- Row Level Security (RLS) policies
- Input validation and sanitization
- Parameterized queries (automatic with Supabase)
- CSRF protection on state-changing operations

**Data Model**:
- Normalized schema with proper relationships
- Indexes on frequently queried columns
- Soft deletes for audit trails

## Design System

### CSS Architecture

**Location**: `src/app/globals.css`

**Organization**:
1. Design Tokens (CSS Variables)
2. Global Styles
3. Component Styles
4. Layout Styles
5. Responsive Breakpoints

### Design Tokens

**Color System**:
```css
/* Brand Colors */
--psp-navy: #0a1628;
--psp-gold: #f0a500;

/* Semantic Colors */
--psp-success: #22c55e;
--psp-error: #ef4444;
```

**Spacing Scale** (4px baseline):
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
```

**Border Radius**:
```css
--radius-sm: 0.375rem;    /* 6px */
--radius-md: 0.5rem;      /* 8px */
--radius-lg: 0.75rem;     /* 12px */
```

**Shadow System**:
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
```

### Styling Approach

**Utility-First**: Tailwind CSS
```tsx
<button className="px-4 py-2 rounded-md bg-gold text-navy hover:bg-gold/90">
  Click me
</button>
```

**Component Classes**: For frequently used patterns
```css
.btn-primary {
  @apply px-4 py-2 rounded-md font-semibold transition;
  background: var(--psp-gold);
  color: var(--psp-navy);
}
```

## Data Flow

### User Interaction Flow

```
User Input (Form)
    ↓
Validation (JavaScript)
    ↓
API Request (POST/PUT)
    ↓
Server Processing (API Route)
    ↓
Database Operation (Supabase)
    ↓
Response (JSON)
    ↓
UI Update (React State)
    ↓
Toast Notification (Feedback)
```

### Data Loading Pattern

```
Component Mounted
    ↓
useEffect with dependency array
    ↓
Fetch data from src/lib/data.ts
    ↓
Set loading state
    ↓
Update component state
    ↓
Render with data or fallback
```

## Key Patterns

### 1. Custom Hooks

**Location**: `src/hooks/`

Example: `useToast`
```typescript
const { toasts, addToast, removeToast, success, error } = useToast();
```

**Benefits**:
- Reusable stateful logic
- Separation of concerns
- Easier testing

### 2. Form Pattern with Toast Feedback

```typescript
export function MyForm() {
  const { success, error } = useToast();

  async function handleSubmit(data: FormData) {
    try {
      validate(data);
      await submitForm(data);
      success('Form submitted!');
    } catch (err) {
      error('Failed to submit form');
    }
  }
}
```

### 3. Component Composition

```typescript
// Compound component pattern
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

## API Design

### Response Format

**Success**:
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Operation completed"
}
```

**Error**:
```json
{
  "success": false,
  "error": "Error description",
  "statusCode": 400
}
```

### Common Status Codes
- `200 OK`: Successful GET request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Performance Optimization

### Frontend
- Code splitting with dynamic imports
- Image optimization with Next.js Image
- CSS minification with Tailwind
- JavaScript bundle analysis

### Backend
- Database query optimization with indexes
- Pagination for large datasets
- Caching strategies for frequently accessed data
- Connection pooling with Supabase

## Security Architecture

### Input Validation
- Client-side: HTML5 validation + JavaScript
- Server-side: Zod schema validation
- Database: Type checking and constraints

### Authentication & Authorization
- Supabase Auth for user management
- JWT tokens in secure HTTP-only cookies
- Row-level security (RLS) policies
- Role-based access control (RBAC)

### CSRF Protection
- CSRF tokens on form submissions
- SameSite cookie attribute
- Supabase session validation

### Data Protection
- HTTPS only (enforced by Vercel)
- Sensitive data in environment variables
- SQL injection prevention (parameterized queries)
- XSS protection (React's automatic escaping)

## Scalability Considerations

### Current Structure
- Monolithic data layer (1,315 lines)
- Single database connection per request
- In-memory state management

### Future Improvements
- Split data.ts into domain modules (players, schools, teams, articles)
- Implement server-side caching layer
- Message queue for async operations
- CDN for static assets
- Microservices if needed

## Feature Flags System

**Location**: `src/lib/feature-flags.ts`

### Purpose
Provides a simple but extensible way to manage feature toggles across the application. Enables controlled rollout of new features, A/B testing, and gradual feature releases.

### Usage

```typescript
import { FeatureFlag, isFeatureEnabled } from '@/lib/feature-flags';

// Check if a feature is enabled
if (isFeatureEnabled(FeatureFlag.DARK_MODE)) {
  // Feature is enabled
}

// In React components
import { useFeatureFlag } from '@/components/providers/FeatureFlagProvider';

function MyComponent() {
  const isDarkModeEnabled = useFeatureFlag(FeatureFlag.DARK_MODE);
  return isDarkModeEnabled ? <DarkTheme /> : <LightTheme />;
}

// Conditional rendering
<FeatureFlaggedContent flag={FeatureFlag.SESSION_REPLAY}>
  <ReplayWidget />
</FeatureFlaggedContent>
```

### Available Flags
- `DARK_MODE`: Enable dark mode theme switcher
- `SENTRY_ENABLED`: Enable Sentry error tracking
- `SESSION_REPLAY`: Enable Sentry session replay
- `REDIS_RATE_LIMIT`: Use Redis for distributed rate limiting
- `CIRCUIT_BREAKER`: Enable circuit breaker pattern
- `EVENT_BUS`: Enable event bus for cross-component communication
- And more...

### Configuration
Features are configured via environment variables: `NEXT_PUBLIC_FEATURE_*`

---

## Error Handling Architecture

### Custom Error Classes

**Location**: `src/lib/error-classes.ts`

Domain-specific error classes provide structured error handling with type-safe categorization:

```typescript
// Base error class
class AppError extends Error {
  code: string;
  statusCode: number;
  context: Record<string, unknown>;
  isOperational: boolean;
}

// Domain-specific errors
class ValidationError extends AppError { }
class DatabaseError extends AppError { }
class AuthenticationError extends AppError { }
class RateLimitError extends AppError { }
class NetworkError extends AppError { }
class NotFoundError extends AppError { }
class AuthorizationError extends AppError { }
```

### Usage

```typescript
import { ValidationError, DatabaseError, isAppError } from '@/lib/error-classes';

try {
  if (!isValidEmail(email)) {
    throw new ValidationError('Invalid email', 'email', email, 'email_format');
  }
  await saveToDatabase();
} catch (error) {
  if (isAppError(error)) {
    console.error(`Error [${error.code}]: ${error.message}`);
  }
}
```

---

## Circuit Breaker Pattern

**Location**: `src/lib/circuit-breaker.ts`

### Purpose
Prevents cascading failures by stopping requests to failing services. Implements three states:
- **CLOSED**: Normal operation, requests pass through
- **OPEN**: Service is failing, requests rejected immediately
- **HALF_OPEN**: Testing if service has recovered

### Configuration
- `failureThreshold`: Number of failures before opening (default: 5)
- `resetTimeoutMs`: Time before attempting recovery (default: 30000ms)
- `halfOpenMaxAttempts`: Max attempts in half-open state (default: 3)

### Usage

```typescript
import { createCircuitBreaker } from '@/lib/circuit-breaker';

const supabaseBreaker = createCircuitBreaker({
  name: 'supabase',
  failureThreshold: 5,
  resetTimeoutMs: 30000,
  onStateChange: (event) => {
    console.log(`Circuit breaker transitioned: ${event.from} -> ${event.to}`);
  },
});

// Wrap async operations
try {
  const data = await supabaseBreaker.execute(() => supabase.from('users').select());
} catch (error) {
  // Handle circuit breaker open or original error
}
```

### Global Registry
Circuit breakers are registered globally for monitoring:

```typescript
import { getAllCircuitBreakers } from '@/lib/circuit-breaker';

// Get status of all circuit breakers
const breakers = getAllCircuitBreakers();
```

---

## Event Bus for Cross-Component Communication

**Location**: `src/lib/event-bus.ts`

### Purpose
Enables decoupled communication between components without prop drilling or excessive context nesting. Provides a type-safe event system.

### Available Events

```typescript
interface EventMap {
  'toast:show': { message: string; type: string; duration?: number };
  'error:captured': { error: Error; context?: Record<string, unknown> };
  'theme:changed': { theme: 'light' | 'dark' | 'system'; isDark: boolean };
  'auth:stateChanged': { isAuthenticated: boolean; userId?: string };
  'data:refreshed': { resource: string; id?: string | number };
  'modal:open': { id: string; data?: Record<string, unknown> };
  'modal:close': { id: string };
  // ...
}
```

### Usage

```typescript
// Server or client-side
import { emit, on } from '@/lib/event-bus';

// Emit an event
emit('toast:show', {
  message: 'Data saved successfully',
  type: 'success',
  duration: 3000,
});

// Listen to an event
const unsubscribe = on('theme:changed', (payload) => {
  console.log('Theme changed to:', payload.theme);
});

// React hooks
import { useEventBus, useToastEvents } from '@/hooks/useEventBus';

function MyComponent() {
  const toast = useToastEvents();

  const handleSave = async () => {
    try {
      await save();
      toast.success('Saved!');
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  // Listen to theme changes
  useEventBus('theme:changed', (payload) => {
    console.log('Theme:', payload.theme);
  });

  return <button onClick={handleSave}>Save</button>;
}
```

---

## Service Layer Patterns

### Data Access Layer

**Location**: `src/lib/data/common.ts`, `src/lib/data.ts`

The data layer provides abstraction over Supabase queries and includes:

1. **Type-safe Query Builders**
   ```typescript
   export function getSchoolBySlug(slug: string): Promise<School>
   export function getPlayerStats(playerId: number): Promise<PlayerStats[]>
   ```

2. **Pagination Support**
   ```typescript
   export function getLeaderboard(sport: string, page: number, limit: number)
   ```

3. **Circuit Breaker Integration**
   All data functions wrapped with circuit breaker for resilience.

4. **Error Handling**
   All database errors caught and categorized using custom error classes.

### API Response Formatting

**Location**: `src/lib/api-response.ts`

Standardized response format for all API endpoints:

```typescript
// Success
{ success: true, data: {...}, message: "Operation completed" }

// Error
{ success: false, error: "Error description", statusCode: 400 }
```

---

## Monitoring & Observability

### Error Tracking
- Automatic error logging in `src/lib/error-tracking.ts`
- Custom error classes for domain-specific categorization
- Console logging for debugging
- External error service integration via Sentry

### Performance Monitoring
- Core Web Vitals with `next/analytics`
- Custom performance marks
- Database query logging

### Session Replay Configuration

**Location**: `src/instrumentation.ts`

Session replay is configured to capture user interactions for debugging error sessions:

```typescript
// Enable via feature flag
NEXT_PUBLIC_FEATURE_SESSION_REPLAY=true

// Configuration:
// - Sample rate: 10% for general sessions, 100% for error sessions
// - maskAllText: true (privacy - masks all text content)
// - blockAllMedia: true (privacy - prevents media loading)
```

Helps with:
- Understanding user actions leading to errors
- Debugging complex user flows
- Privacy-first recording (no sensitive data captured)

### Logging Strategy
- Debug: Development information
- Info: Business-level events
- Warn: Unexpected but recoverable situations
- Error: Unrecoverable errors

## Development Workflow

### Local Development
1. Start dev server: `npm run dev`
2. Open `http://localhost:3000`
3. Changes hot-reload automatically

### Testing
```bash
npm run test              # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Building
```bash
npm run build            # Production build
npm start               # Start production server
```

## Deployment

### Deployment Platform
- **Primary**: Vercel (recommended for Next.js)
- **Alternative**: Any Node.js hosting

### Environment Management
- Environment variables per deployment
- Automatic deployments on git push
- Preview deployments for PRs

### Monitoring Post-Deployment
- Check error logs in Vercel dashboard
- Monitor performance metrics
- Review user feedback

## Future Architecture Enhancements

### Phase 1: Modularization
- [ ] Split data.ts into domain modules
- [ ] Create separate hooks for each feature
- [ ] Extract reusable form logic

### Phase 2: State Management
- [ ] Evaluate need for state management library
- [ ] Consider server components for data fetching
- [ ] Implement server-side caching

### Phase 3: Performance
- [ ] Implement edge caching
- [ ] Add service worker for offline support
- [ ] Optimize database queries with proper indexing

### Phase 4: Developer Experience
- [ ] Add storybook for component documentation
- [ ] Create component library package
- [ ] Add E2E testing framework
- [ ] Create API documentation with OpenAPI

## References

- [Next.js App Router](https://nextjs.org/docs/app)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
