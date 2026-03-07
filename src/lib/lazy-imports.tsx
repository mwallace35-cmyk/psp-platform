/**
 * Central registry for lazy-loaded components and modules.
 *
 * This file documents which components use dynamic imports and why.
 * Dynamic imports help reduce initial bundle size by splitting code
 * that's not needed on initial page load.
 *
 * DOCUMENTATION ONLY - See actual implementations in component files
 *
 * Pattern:
 * - Use for heavy components only needed on specific routes
 * - Use for third-party libraries with large footprints
 * - Preload components that will be needed soon
 */

// ============================================================================
// LAZY LOADED COMPONENTS (not on critical path)
// ============================================================================

/**
 * SearchTypeahead: Lazy loads on header
 * Location: src/components/layout/Header.tsx
 * Implementation: dynamic(() => import("@/components/search/SearchTypeahead"))
 *
 * Why: Heavy component with fuse.js dependency (~20KB), only needed after user interacts
 * Impact: Saves ~45KB from initial bundle
 * Loading state: Disabled input placeholder
 * SSR: Disabled (client-only)
 *
 * Example from Header:
 * ```typescript
 * const SearchTypeahead = dynamic(() => import("../search/SearchTypeahead"), {
 *   loading: () => <input type="text" placeholder="Search..." disabled />,
 *   ssr: false,
 * });
 * ```
 */

/**
 * RelatedArticles: Lazy loads below fold on article pages
 * Location: src/components/articles/RelatedArticles.tsx
 *
 * Why: Not visible on initial viewport, can load after main content
 * Impact: Improves First Contentful Paint (FCP)
 * Loading state: Skeleton loader
 */

/**
 * PotwVoteButton: Lazy loads on POTW page
 * Location: src/components/potw/PotwVoteButton.tsx
 *
 * Why: Client-side interaction only, not critical for page structure
 * Impact: Saves interactive JS from main bundle
 * SSR: Disabled (client-only)
 */

// ============================================================================
// PRELOAD HINTS
// ============================================================================

/**
 * Components and modules that should be preloaded
 * These are rendered/used after initial paint but still in viewport
 * Preloading prevents waterfall loading patterns
 */
export const PRELOAD_COMPONENTS = {
  // Articles grid images - preload first 3 images
  articleImages: {
    priority: "high" as const,
    loading: "lazy" as const,
    fetchPriority: "high" as const,
  },

  // Related articles sidebar - preload after article content renders
  relatedArticles: {
    priority: false,
    loading: "lazy" as const,
  },
} as const;

// ============================================================================
// LIBRARY IMPORT OPTIMIZATION
// ============================================================================

/**
 * For heavy libraries, prefer specific imports over barrel exports:
 *
 * BEFORE (larger bundle):
 *   import { getPlayerBySlug, getSchoolBySlug } from '@/lib/data'
 *
 * AFTER (optimized):
 *   import { getPlayerBySlug } from '@/lib/data/players'
 *   import { getSchoolBySlug } from '@/lib/data/schools'
 *
 * Why:
 * - Barrel exports may include unused exports
 * - Tree-shaking relies on specific import paths
 * - Direct module imports enable better code splitting
 *
 * Reference:
 * - src/lib/data/index.ts contains 95+ re-exports
 * - Importing all of them unnecessarily increases bundle size
 */

// ============================================================================
// BUNDLE SIZE TARGETS
// ============================================================================

/**
 * Target bundle sizes for key routes (gzipped).
 * Monitor actual sizes with: ANALYZE=true npm run build
 */
export const BUNDLE_LIMITS = {
  home: 150,           // KB
  articles: 180,       // KB
  player: 200,         // KB
  search: 120,         // KB
} as const;

// ============================================================================
// CACHE BUSTING STRATEGIES
// ============================================================================

/**
 * Static assets cache lifetimes (from next.config.ts)
 *
 * - Immutable (versioned): 1 year (31536000 seconds)
 *   Used for: Next.js generated JS/CSS with content hashes
 *
 * - Dynamic images: 30 days
 *   Used for: Optimized images that may update
 *
 * - HTML pages: no-cache
 *   Used for: Re-validate on each request
 *
 * - Fonts: 1 year
 *   Used for: @font-face declarations
 */
export const CACHE_STRATEGIES = {
  IMMUTABLE: "public, max-age=31536000, immutable",
  LONG_TERM: "public, max-age=2592000", // 30 days
  NO_CACHE: "no-cache, no-store, must-revalidate",
  ISR: (seconds: number) => `s-maxage=${seconds}, stale-while-revalidate=3600`,
} as const;

// ============================================================================
// SERVER vs CLIENT CODE SEPARATION
// ============================================================================

/**
 * Server Components (default)
 * - Can access databases, APIs, secrets
 * - Can perform server-only operations
 * - No interactive features (no event handlers, state, hooks)
 * - Examples:
 *   - src/app/layout.tsx (uses headers())
 *   - src/app/articles/page.tsx (fetches from database)
 *
 * Client Components (use "use client" directive)
 * - Can use state, effects, event handlers
 * - Cannot access secrets or databases directly
 * - Must use API routes for data fetching
 * - Examples:
 *   - src/components/layout/Header.tsx
 *   - src/components/search/SearchTypeahead.tsx
 */

// ============================================================================
// IMAGE OPTIMIZATION CHECKLIST
// ============================================================================

/**
 * For next/image usage:
 * - Use sizes prop for responsive images
 * - Add priority prop to above-the-fold images
 * - Let Next.js handle format negotiation (WebP, AVIF)
 * - Configure devices/sizes in next.config.ts
 *
 * For next/font usage:
 * - Use display: "swap" to prevent layout shift
 * - Use Google Fonts when possible
 * - Prefer variable fonts (single file for all weights)
 * - Reduce subset to languages actually used
 */
