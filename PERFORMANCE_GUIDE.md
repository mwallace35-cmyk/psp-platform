# Performance Optimization Guide

This guide documents the performance improvements implemented in the PhillySportsPack application and best practices for maintaining high performance.

## Overview

Current performance audit score: **8.5/10**

Performance improvements focus on three key areas:
1. React Suspense boundaries for streaming SSR
2. Bundle size enforcement and monitoring
3. Intelligent prefetching strategies

## 1. Streaming SSR with React Suspense

### What is Streaming SSR?

Streaming SSR allows pages to send content to the browser incrementally instead of waiting for all data fetching to complete. This improves the perceived performance and user experience.

### Implementation

Pages use `<Suspense>` boundaries to mark sections that fetch data asynchronously:

```tsx
import { Suspense } from 'react';
import { SkeletonText } from '@/components/ui/Skeleton';

export default function MyPage() {
  return (
    <>
      {/* Content that renders immediately */}
      <Header />

      {/* Section that streams independently */}
      <Suspense fallback={<SkeletonText lines={5} />}>
        <ExpensiveDataComponent />
      </Suspense>

      {/* Another independent section */}
      <Suspense fallback={<div>Loading...</div>}>
        <AnotherAsyncComponent />
      </Suspense>
    </>
  );
}
```

### StreamingWrapper Component

For convenience, use the `StreamingWrapper` component:

```tsx
import StreamingWrapper from '@/components/streaming/StreamingWrapper';
import { SkeletonCard } from '@/components/ui/Skeleton';

<StreamingWrapper fallback={<SkeletonCard />}>
  <RelatedArticles />
</StreamingWrapper>
```

### Current Implementation

#### Homepage (`src/app/page.tsx`)
- **Hero section**: Renders immediately (no async data)
- **Headlines section**: Suspense boundary wraps article queries
- **Sidebar leaders**: Two independent Suspense boundaries for football and basketball leaders
- **Upcoming events**: Suspense boundary for event data

#### Sport Hub Page (`src/app/[sport]/page.tsx`)
- **Header/metadata**: Rendered immediately
- **Sport overview**: All data fetched upfront but wrapped for streaming

### Best Practices

1. **Wrap only data-fetching components**: Don't wrap everything, only components that fetch data
2. **Use meaningful fallbacks**: Skeleton loaders should match the content shape
3. **Parallel loading**: Multiple Suspense boundaries allow sections to load in parallel
4. **Error boundaries**: Consider adding error boundaries around Suspense for robustness

## 2. Bundle Size Enforcement

### Why Bundle Size Matters

Large JavaScript bundles:
- Slow down initial page load (longer parsing/compilation)
- Increase time to interactive (more JS to execute)
- Consume more bandwidth on mobile networks
- Hurt SEO (Core Web Vitals impact)

### Limits

Bundle size limits (gzipped):

| Bundle Type | Limit | Rationale |
|-----------|-------|-----------|
| Main JS | 150 KB | Entry point that blocks page rendering |
| Route chunks | 50 KB | Per-page code split bundles |
| CSS | 30 KB | Stylesheet for critical path |

### Checking Bundle Size

Run the bundle check:

```bash
npm run check-bundle
```

This script:
1. Runs a production build
2. Analyzes .next/static/chunks for size violations
3. Reports files that exceed limits
4. Suggests optimization strategies

### Analyzing Bundle Composition

To see what's in your bundles:

```bash
npm run analyze-bundle
```

This generates interactive HTML reports showing:
- Dependency sizes
- Which modules are in each chunk
- Opportunities for code splitting

### Optimization Strategies

#### 1. Dynamic Imports

Move non-critical components to dynamic imports:

```tsx
// Before: loads on every page
import SearchTypeahead from '@/components/search/SearchTypeahead';

// After: only loads when user opens search
const SearchTypeahead = dynamic(
  () => import('@/components/search/SearchTypeahead'),
  {
    loading: () => <input disabled placeholder="Search..." />,
    ssr: false, // Only needed on client
  }
);
```

#### 2. Specific Imports

Use specific imports instead of barrel exports:

```tsx
// Before (imports everything, larger bundle)
import { getPlayerBySlug, getSchoolBySlug, getSportById } from '@/lib/data';

// After (tree-shaking works better)
import { getPlayerBySlug } from '@/lib/data/players';
import { getSchoolBySlug } from '@/lib/data/schools';
import { getSportById } from '@/lib/data/sports';
```

#### 3. Code Splitting

Next.js automatically code splits at the route level. Ensure routes are in separate files:

```
src/app/
├── page.tsx                    # Homepage (separate chunk)
├── [sport]/page.tsx            # Sport hub (separate chunk)
├── articles/[slug]/page.tsx    # Article (separate chunk)
└── ...
```

#### 4. Library Optimization

In `next.config.ts`, use `optimizePackageImports`:

```typescript
experimental: {
  optimizePackageImports: [
    "@supabase/supabase-js",
    "@supabase/ssr",
    "drizzle-orm",
    "zod",
  ],
},
```

This tells Next.js which libraries to tree-shake.

#### 5. Remove Unused Dependencies

Check what you're actually using:

```bash
npm ls
npm ls --depth=0  # Top-level only
```

Common culprits:
- Polyfills (if not needed)
- Multiple versions of the same library
- Development-only dependencies in production bundle

## 3. Intelligent Prefetching

### What is Prefetching?

Prefetching loads resources before the user navigates to them, reducing perceived latency:

```
Without prefetch: User clicks → Browser fetches → Page renders
With prefetch:     Browser fetches early → User clicks → Page renders immediately
```

### Prefetch Strategies

#### Hover Prefetch

Prefetch when user hovers over a link:

```tsx
import PrefetchLink from '@/components/ui/PrefetchLink';

<PrefetchLink href="/football" prefetchStrategy="hover">
  Football Hub
</PrefetchLink>
```

**When to use:**
- Header navigation links
- Primary action buttons
- Obvious next steps

**Why:**
- User has indicated interest
- Gives time before click (users hover first)
- Minimizes impact on users not interested

#### Visible Prefetch

Prefetch when link appears in viewport:

```tsx
<PrefetchLink href="/article/123" prefetchStrategy="visible">
  Related Article
</PrefetchLink>
```

**When to use:**
- Sidebar recommendations
- Below-the-fold links
- Infinite scroll or pagination

**Why:**
- Prepares content before user scrolls to it
- Transparent to user experience

#### No Prefetch

Disable prefetching:

```tsx
<PrefetchLink href="/admin" prefetchStrategy="none">
  Admin Panel
</PrefetchLink>
```

**When to use:**
- Links that are rarely clicked
- Links to external sites
- Authenticated pages with token requirements

### Manual Prefetching

For programmatic control:

```tsx
import {
  prefetchRoute,
  batchPrefetch,
  isPrefetched,
} from '@/lib/prefetch';

// Single route
prefetchRoute('/football', 'high');

// Batch with staggering
batchPrefetch(['/football', '/basketball', '/baseball'], {
  delayMs: 200,
  priority: 'normal',
});

// Check if prefetched
if (isPrefetched('/football')) {
  // Already prefetched
}
```

### Prefetch Priority Levels

| Level | Timing | Use Case |
|-------|--------|----------|
| high | Immediate | Critical next step |
| normal | On idle | Default, most links |
| low | 2 seconds + idle | Secondary content |

### Network-Aware Prefetching

Respect user's connection:

```tsx
// Check if user has high-speed connection
if ('connection' in navigator) {
  const connection = (navigator as any).connection;
  if (connection.saveData || connection.effectiveType === '4g') {
    // Disable or reduce prefetching for slow connections
    prefetchStrategy = 'none';
  }
}
```

## Web Vitals Monitoring

### What to Monitor

**Core Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Additional metrics:**
- FCP (First Contentful Paint)
- TTFB (Time to First Byte)
- JS parse/compile time

### Implementation

1. Enable Google Analytics (already configured in layout.tsx)
2. Monitor in Google Search Console
3. Use Lighthouse for local testing

## Performance Testing

### Automated Tests

Run performance tests:

```bash
npm test -- src/__tests__/performance/
```

Tests verify:
- Lazy imports are configured
- React.memo prevents unnecessary renders
- Suspense fallbacks work correctly
- Prefetch utilities function properly

### Local Testing

```bash
# Production build
npm run build

# Test locally
npm start
```

Use Chrome DevTools Performance tab to:
1. Measure paint timing
2. Check JavaScript execution time
3. Analyze rendering performance
4. Monitor memory usage

### Lighthouse Audit

```bash
# Run Lighthouse (requires puppeteer)
npm install --save-dev @lhci/cli@latest lighthouse
npx lhci autorun
```

## CI/CD Integration

Add bundle checking to your CI pipeline:

```yaml
# .github/workflows/performance-check.yml
name: Performance Check

on: [push, pull_request]

jobs:
  bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run check-bundle
```

## Monitoring in Production

### Real User Monitoring (RUM)

Enable in `next.config.ts`:

```typescript
// Already configured via Google Analytics
// Sends Core Web Vitals to Google Analytics
```

### Set up Alerts

In Google Search Console:
1. Core Web Vitals report → Set alerts for status changes
2. Speed Insights → Monitor changes over time

## Common Issues & Solutions

### Issue: Large bundle after adding dependency

**Solution:**
1. Check if it's actually used: `npm ls package-name`
2. Consider alternatives (lighter library)
3. Use dynamic import for non-critical paths
4. Check if library has tree-shaking issues

### Issue: Slow page load but bundle is small

**Solution:**
1. Check data fetching time (Network tab in DevTools)
2. Use Suspense boundaries to stream sections
3. Implement database query optimization
4. Consider caching strategies (ISR, SWR)

### Issue: Prefetch not working

**Solution:**
1. Verify network tab shows prefetch requests
2. Check browser support (IntersectionObserver, etc.)
3. Ensure HTTPS (some features require secure context)
4. Check console for errors

## Configuration Files

### next.config.ts

```typescript
// Package import optimization
experimental: {
  optimizePackageImports: [
    "@supabase/supabase-js",
    "@supabase/ssr",
    "drizzle-orm",
    "zod",
  ],
},

// Image optimization
images: {
  formats: ["image/avif", "image/webp"],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
},

// Cache control headers
async headers() {
  return [
    {
      source: "/(_next/static|public)/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ];
}
```

## Summary

Performance optimization is a continuous process:

1. **Measure**: Use Lighthouse, Core Web Vitals, bundle analysis
2. **Identify**: Find bottlenecks (bundle, data fetching, rendering)
3. **Optimize**: Apply appropriate techniques (code splitting, Suspense, prefetch)
4. **Monitor**: Track metrics over time, set alerts

Regular monitoring and incremental improvements will maintain or exceed current performance levels.
