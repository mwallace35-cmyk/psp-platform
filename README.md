# PSP Platform - Next.js Application

A comprehensive sports data platform built with Next.js 16, React 19, TypeScript, and Supabase. The platform provides detailed player statistics, team information, championships, and news across multiple sports.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Runtime**: React 19
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Error Tracking**: Custom error tracking middleware
- **AI Integration**: Anthropic Claude API

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (server-side)
│   ├── admin/             # Admin dashboard
│   ├── [sport]/           # Dynamic sport pages
│   ├── articles/          # Article pages
│   ├── players/           # Player pages
│   ├── schools/           # School pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components (Toast, Button, etc.)
│   ├── layout/           # Layout components (Header, Footer)
│   └── [domain]/         # Domain-specific components
├── lib/                   # Utility functions and libraries
│   ├── data/             # Modular data layer by domain
│   │   ├── common.ts     # Shared types and utilities
│   │   ├── players.ts    # Player-related queries
│   │   ├── schools.ts    # School-related queries
│   │   ├── teams.ts      # Team and championship queries
│   │   ├── articles.ts   # Article queries
│   │   ├── events.ts     # Events, coaching, alumni, recruiting
│   │   └── index.ts      # Barrel export for backward compatibility
│   ├── supabase/         # Supabase client setup
│   ├── api-response.ts   # Standardized API response helpers
│   ├── validation.ts     # Zod validation schemas
│   ├── auth.ts           # Authentication utilities
│   └── [utility].ts      # Other utility modules
├── db/                    # Drizzle ORM schema definitions
├── hooks/                 # React hooks (useToast, etc.)
└── __tests__/            # Unit and integration tests
```

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or pnpm
- Supabase account and project

### Environment Setup

Create a `.env.local` file in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic (optional, for AI features)
ANTHROPIC_API_KEY=your_api_key

# Other configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Installation

```bash
# Install dependencies
npm install

# Run database migrations (if applicable)
npm run db:migrate

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

## Available Scripts

```bash
# Development
npm run dev                # Start dev server (with hot reload)

# Production
npm run build             # Build for production
npm run start             # Start production server

# Testing
npm run test              # Run unit tests
npm run test:watch       # Run tests in watch mode
npm test -- --coverage   # Generate coverage report

# Database
npm run db:migrate       # Run pending migrations
npm run db:push         # Push schema changes to database
npm run db:studio       # Open Drizzle Studio

# Linting
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
```

## Architecture & Design Patterns

### Data Layer

The data layer has been refactored into modular domains to improve maintainability:

- **`data/common.ts`**: Shared types, utilities, and Supabase client
- **`data/players.ts`**: Player queries (stats, awards, profile)
- **`data/schools.ts`**: School and sport overview queries
- **`data/teams.ts`**: Team seasons, championships, records, games
- **`data/articles.ts`**: Article and content queries
- **`data/events.ts`**: Coaching, recruiting, alumni tracking, search, leaderboards

All functions are re-exported through `data/index.ts` for backward compatibility. Existing imports from `@/lib/data` continue to work unchanged.

### API Response Standardization

All API routes use standardized response helpers:

```typescript
// Successful response
return apiSuccess(data);           // 200 OK
return apiSuccess(data, 201);      // 201 Created

// Error response
return apiError("Message", 400);            // 400 Bad Request
return apiError("Message", 404, "NOT_FOUND"); // 404 with error code
```

### Error Handling

The application uses consistent error handling:

- **Server-side**: `withErrorHandling()` wrapper with sensible fallbacks
- **Client-side**: Zod validation for request schemas
- **User feedback**: Toast notifications for form submissions
- **Logging**: Error tracking and detailed error reporting

### UI/UX Features

- **Toast Notifications**: Non-intrusive success/error messages (useToast hook)
- **Loading States**: Disabled submit buttons with spinner feedback during form submission
- **Responsive Design**: Mobile-first approach with breakpoints at 480px, 768px, 900px+
- **Accessibility**: WCAG 2.1 compliance with focus management, ARIA labels, keyboard navigation
- **Dark Mode**: Theme-aware CSS variables with dark mode overrides

### Design Tokens

Standardized design system variables in `globals.css`:

- **Border Radius**: xs (4px) through full (9999px)
- **Spacing**: 4px baseline with scale (space-1 through space-20)
- **Shadows**: xs through 2xl for depth and elevation
- **Transitions**: fast (0.15s), base (0.2s), slow (0.3s)
- **Z-Index**: Organized stacking context (dropdown, sticky, fixed, modal, popover, tooltip)
- **Color System**: PSP brand colors, semantic colors, sport-specific colors

## Testing

The project includes comprehensive tests:

- Unit tests for utilities and business logic
- Component tests with React Testing Library
- Integration tests for API endpoints
- API contract tests

Run tests with:

```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm test -- --coverage   # Coverage report
```

## Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables for Production

Ensure all required environment variables are set in your deployment platform (Vercel, etc.).

### Database Migrations

Before deploying, ensure database migrations are current:

```bash
npm run db:migrate
```

## API Documentation

### Key Endpoints

- `GET /api/search?q=...` - Search across players, schools, coaches
- `GET /api/player/[id]` - Get player details and career stats
- `GET /api/[sport]/leaderboards/[stat]` - Get leaderboard for a sport/stat
- `POST /api/ai/summary` - Generate article summary (requires auth)

All endpoints return standardized response format:

```json
{
  "success": true,
  "data": { /* endpoint-specific data */ }
}
```

Or on error:

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE"
  }
}
```

## Performance Considerations

- Server-side rendering (SSR) for SEO
- Incremental Static Regeneration (ISR) for content pages
- Query caching at the database level
- Rate limiting on public APIs
- Image optimization with Next.js Image component
- Bundle code splitting by route

## Contributing

### Commit Conventions

Use conventional commit messages:

```
feat: Add new feature
fix: Fix a bug
docs: Documentation changes
refactor: Code refactoring
test: Add/update tests
chore: Dependency updates
```

### Code Style

- ESLint for code quality
- Prettier for formatting
- TypeScript for type safety
- Follow existing patterns in the codebase

## Common Issues & Troubleshooting

### Database Connection Issues

If you encounter Supabase connection errors:

1. Verify `.env.local` contains correct credentials
2. Check Supabase project is active in the dashboard
3. Ensure API key has proper permissions

### Build Errors

Clear cache and reinstall dependencies:

```bash
rm -rf node_modules
npm install
npm run build
```

### Development Server Issues

Restart the dev server:

```bash
# Stop the server (Ctrl+C)
npm run dev
```

## Support & Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## License

Proprietary - All rights reserved
