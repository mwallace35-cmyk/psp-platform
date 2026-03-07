# Performance Optimization Quick Start

## 1-Minute Overview

Three major performance improvements have been added:

### Streaming SSR (Suspense Boundaries)
```tsx
import { Suspense } from 'react';
import { SkeletonText } from '@/components/ui/Skeleton';

<Suspense fallback={<SkeletonText lines={3} />}>
  <DataComponent />
</Suspense>
```

### Intelligent Prefetching
```tsx
import PrefetchLink from '@/components/ui/PrefetchLink';

<PrefetchLink href="/football" prefetchStrategy="hover">
  Football Hub
</PrefetchLink>
```

### Bundle Size Enforcement
```bash
npm run check-bundle    # Verify bundle size limits
npm run analyze-bundle  # See bundle composition
```

## Usage Guide

### For Suspense Boundaries

**In your page components:**

```tsx
import { Suspense } from 'react';
import { SkeletonCard } from '@/components/ui/Skeleton';
import StreamingWrapper from '@/components/streaming/StreamingWrapper';

export default function Page() {
  return (
    <>
      {/* Content that renders immediately */}
      <Header />

      {/* Async content with skeleton */}
      <StreamingWrapper fallback={<SkeletonCard />}>
        <RelatedArticles />
      </StreamingWrapper>

      {/* Another async section */}
      <Suspense fallback={<SkeletonText lines={5} />}>
        <Comments />
      </Suspense>
    </>
  );
}
```

### For Prefetching

**In your link components:**

```tsx
import PrefetchLink from '@/components/ui/PrefetchLink';

// Hover prefetch (header navigation)
<PrefetchLink href="/football">Football Hub</PrefetchLink>

// Visible prefetch (sidebar)
<PrefetchLink href="/article/123" prefetchStrategy="visible">
  Article
</PrefetchLink>

// No prefetch (external links)
<PrefetchLink href="/admin" prefetchStrategy="none">
  Admin
</PrefetchLink>
```

### For Bundle Checking

**Before deploying:**

```bash
# Run bundle size check
npm run check-bundle

# If it fails, analyze what's large
npm run analyze-bundle
```

## Available Skeleton Components

```tsx
import {
  SkeletonText,    // Multiple lines of text
  SkeletonCard,    // Card with image + text
  SkeletonTable,   // Table rows
  SkeletonAvatar,  // Circular avatar
} from '@/components/ui/Skeleton';

// Basic usage
<SkeletonText lines={3} />
<SkeletonCard showImage showTitle showDescription />
<SkeletonTable rows={5} columns={4} />
<SkeletonAvatar size="md" />
```

## Testing

```bash
# Run all tests
npm test

# Run only performance tests
npm test -- src/__tests__/performance

# Run in watch mode
npm test:watch
```

## Common Patterns

### Pattern 1: Page with Independent Sections

```tsx
export default function HomePage() {
  return (
    <>
      <Header /> {/* Immediate */}

      <Suspense fallback={<LoadingHero />}>
        <Hero /> {/* Hero section streams */}
      </Suspense>

      <Suspense fallback={<LoadingArticles />}>
        <Articles /> {/* Articles stream independently */}
      </Suspense>

      <Suspense fallback={<LoadingSidebar />}>
        <Sidebar /> {/* Sidebar streams in parallel */}
      </Suspense>
    </>
  );
}
```

### Pattern 2: Manual Prefetch Control

```tsx
import { prefetchRoute, batchPrefetch } from '@/lib/prefetch';

// In event handler or effect
const handleSearch = () => {
  // Prefetch likely next page
  prefetchRoute('/search/results', 'high');
};

// Batch prefetch on page load
useEffect(() => {
  batchPrefetch(['/football', '/basketball', '/baseball'], {
    delayMs: 200,
  });
}, []);
```

### Pattern 3: Prefetch with Priority

```tsx
import { prefetchRoute } from '@/lib/prefetch';

// High priority: prefetch immediately
prefetchRoute('/critical-page', 'high');

// Normal priority: prefetch on idle (default)
prefetchRoute('/article', 'normal');

// Low priority: prefetch with 2s delay
prefetchRoute('/secondary', 'low');
```

## Performance Tips

1. **Use skeleton loaders that match content shape**
   - Don't use generic "Loading..." text
   - Create skeletons that look like actual content

2. **Wrap only async components**
   - Don't wrap everything with Suspense
   - Only components that fetch data

3. **Use multiple independent boundaries**
   - Let sections load in parallel
   - Creates faster perceived performance

4. **Check bundle regularly**
   - Run `npm run check-bundle` before merging
   - Monitor for size regressions

5. **Prefetch strategically**
   - Hover: Header navigation, obvious next steps
   - Visible: Sidebar, below-the-fold content
   - None: External links, rarely-used pages

## Troubleshooting

### Suspense not working?
- Is the component async? (uses `async` or promises)
- Is it a server component? (no `'use client'`)
- Is data fetching during render?

### Skeleton doesn't look right?
- Does it have the same layout dimensions?
- Are the heights correct?
- Use the appropriate skeleton type

### Bundle too large?
- Run `npm run analyze-bundle`
- Look for unexpected dependencies
- Use dynamic imports for non-critical code
- Check for duplicate packages: `npm ls`

### Prefetch not happening?
- Check Network tab in DevTools
- Ensure HTTPS (some APIs need secure context)
- Check for console errors
- Use `isPrefetched()` to verify

## Resources

- **PERFORMANCE_GUIDE.md** - Detailed performance guide
- **STREAMING_GUIDE.md** - Suspense & streaming patterns
- **PERFORMANCE_IMPROVEMENTS.md** - Implementation summary
- **QUICK_START.md** - This file

## Commands Reference

```bash
# Development
npm run dev                  # Start dev server
npm test                    # Run all tests
npm test:watch              # Run tests in watch mode

# Production
npm run build               # Build for production
npm start                   # Start production server

# Performance
npm run check-bundle        # Check bundle size limits
npm run analyze-bundle      # Analyze bundle composition

# Linting
npm run lint                # Run ESLint
```

## Next Steps

1. ✓ Review STREAMING_GUIDE.md for patterns
2. ✓ Review PERFORMANCE_GUIDE.md for optimization tips
3. ✓ Start using PrefetchLink in navigation
4. ✓ Add Suspense boundaries to data-heavy pages
5. ✓ Run `npm run check-bundle` regularly
6. ✓ Monitor Core Web Vitals in production

That's it! You're ready to use the performance improvements.

For questions, see the full documentation files listed above.
