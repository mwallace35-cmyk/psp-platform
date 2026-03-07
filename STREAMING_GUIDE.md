# React Suspense & Streaming SSR Guide

## Overview

This guide explains how to implement React Suspense boundaries for streaming Server-Side Rendering (SSR) in the PhillySportsPack application.

Streaming SSR allows pages to send content to the browser incrementally instead of waiting for all data fetching to complete. This dramatically improves perceived performance and Time to First Byte (TTFB).

## How Streaming Works

### Traditional SSR (Without Streaming)

```
1. Browser requests page
2. Server fetches ALL data
3. Server renders complete HTML
4. Browser receives complete HTML
5. Browser displays page

User waits for: slowest query + render time
```

### Streaming SSR (With Suspense)

```
1. Browser requests page
2. Server fetches critical data
3. Server sends initial HTML with skeleton loaders
4. Server continues fetching other data
5. Browser displays page immediately with skeletons
6. Server sends streamed content as it finishes
7. Skeletons replaced with actual content

User waits for: fastest critical path
Other content loads in background
```

## Implementation Guide

### 1. Import Suspense

```tsx
import { Suspense } from 'react';
```

### 2. Create a Loading Fallback

```tsx
import { SkeletonText, SkeletonCard } from '@/components/ui/Skeleton';

// For text content
function LoadingText() {
  return <SkeletonText lines={3} />;
}

// For cards
function LoadingCard() {
  return <SkeletonCard showImage showTitle showDescription />;
}

// For complex sections
function LoadingArticles() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
```

### 3. Wrap Data-Fetching Components

```tsx
export default function MyPage() {
  return (
    <Suspense fallback={<LoadingText />}>
      <AsyncDataComponent />
    </Suspense>
  );
}
```

### 4. Use StreamingWrapper (Optional)

For convenience, use the provided `StreamingWrapper` component:

```tsx
import StreamingWrapper from '@/components/streaming/StreamingWrapper';

<StreamingWrapper fallback={<LoadingCard />}>
  <RelatedArticles />
</StreamingWrapper>
```

## Best Practices

### 1. Wrap Only Async Components

❌ Don't wrap synchronous components:
```tsx
// Bad - unnecessary Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Header /> {/* Header is not async */}
</Suspense>
```

✅ Do wrap async components:
```tsx
// Good - only async components
<Suspense fallback={<div>Loading...</div>}>
  <AsyncHeader /> {/* This component fetches data */}
</Suspense>
```

### 2. Create Skeletons That Match Content Shape

❌ Don't use generic loaders:
```tsx
// Bad - doesn't match content shape
<Suspense fallback={<div>Loading...</div>}>
  <ArticleGrid />
</Suspense>
```

✅ Do match the layout:
```tsx
// Good - skeleton matches layout
<Suspense fallback={
  <div className="grid grid-cols-2 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
}>
  <ArticleGrid />
</Suspense>
```

### 3. Use Multiple Independent Boundaries

```tsx
// Good - sections stream independently
<>
  {/* Critical content */}
  <Header />

  {/* First async section */}
  <Suspense fallback={<LoadingSidebar />}>
    <Sidebar />
  </Suspense>

  {/* Second async section (streams in parallel) */}
  <Suspense fallback={<LoadingArticles />}>
    <Articles />
  </Suspense>

  {/* Third async section */}
  <Suspense fallback={<LoadingEvents />}>
    <UpcomingEvents />
  </Suspense>
</>
```

### 4. Combine with Error Boundaries

```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary>
  <Suspense fallback={<LoadingCard />}>
    <RiskyAsyncComponent />
  </Suspense>
</ErrorBoundary>
```

## Current Implementation

### Homepage (`src/app/page.tsx`)

```tsx
// Immediate sections (no Suspense needed)
<Header />
<div className="hero-card">...</div>

// Async sections (wrapped with Suspense)
<Suspense fallback={<SkeletonText lines={5} />}>
  <RushingLeaders /> {/* Fetches football leaders */}
</Suspense>

<Suspense fallback={<SkeletonText lines={5} />}>
  <ScoringLeaders /> {/* Fetches basketball leaders */}
</Suspense>

<Suspense fallback={<SkeletonText lines={4} />}>
  <UpcomingEvents /> {/* Fetches events */}
</Suspense>
```

**Result:** User sees page structure immediately with skeleton loaders. Content streams in as queries complete.

### Sport Hub Page (`src/app/[sport]/page.tsx`)

Currently all data is fetched upfront at the server level. For better streaming:

```tsx
// Refactor to:
<SportHeader sport={sport} /> {/* Immediate */}

<Suspense fallback={<SkeletonText lines={3} />}>
  <ChampionsSection sport={sport} /> {/* Async */}
</Suspense>

<Suspense fallback={<SkeletonTable rows={10} columns={3} />}>
  <SchoolsList sport={sport} /> {/* Async */}
</Suspense>

<Suspense fallback={<SkeletonCard />}>
  <FeaturedArticles sport={sport} /> {/* Async */}
</Suspense>
```

## Advanced Patterns

### Pattern 1: Nested Suspense Boundaries

For components with multiple async sections:

```tsx
function ComplexComponent() {
  return (
    <div>
      <h2>Article</h2>

      <Suspense fallback={<LoadingContent />}>
        <ArticleContent />
      </Suspense>

      <h3>Related</h3>

      <Suspense fallback={<LoadingRelated />}>
        <RelatedArticles />
      </Suspense>

      <h3>Comments</h3>

      <Suspense fallback={<LoadingComments />}>
        <Comments />
      </Suspense>
    </div>
  );
}
```

### Pattern 2: Parallel Data Loading

Fetch multiple queries in parallel, stream independently:

```tsx
export default function DashboardPage() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Column 1 */}
      <Suspense fallback={<SkeletonCard />}>
        <MetricsPanel />
      </Suspense>

      {/* Column 2 - streams independently */}
      <Suspense fallback={<SkeletonCard />}>
        <RecentActivity />
      </Suspense>

      {/* Column 3 - streams independently */}
      <Suspense fallback={<SkeletonCard />}>
        <Leaderboard />
      </Suspense>
    </div>
  );
}
```

### Pattern 3: Progressive Enhancement

Show basic content immediately, enhance later:

```tsx
function ProductPage() {
  return (
    <div>
      {/* Basic info available immediately */}
      <ProductHeader name={product.name} price={product.price} />

      {/* Detailed content loads progressively */}
      <Suspense fallback={<SkeletonText lines={5} />}>
        <ProductDescription id={product.id} />
      </Suspense>

      {/* Related products load last */}
      <Suspense fallback={<LoadingGrid />}>
        <RelatedProducts id={product.id} />
      </Suspense>
    </div>
  );
}
```

## Troubleshooting

### Issue: Suspense boundary not working

**Check:**
1. Component inside Suspense is truly async (uses `async` or promises)
2. Component is a server component (no `'use client'`)
3. Data fetching happens during render, not in event handlers

### Issue: Skeleton doesn't match content

**Solution:**
1. Measure the actual content
2. Create skeleton with same dimensions
3. Use CSS classes to maintain layout consistency

### Issue: Multiple boundaries cause flashing

**Solution:**
1. Group related content in single boundary
2. Or keep skeleton visible until all content loads
3. Use CSS transitions for smooth replacement

## Configuration

### Skeleton Components

Located in `src/components/ui/Skeleton.tsx`:

- `SkeletonText` - Multiple text lines
- `SkeletonCard` - Card with image and text
- `SkeletonTable` - Table rows
- `SkeletonAvatar` - Circular avatar

```tsx
import {
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  SkeletonAvatar,
} from '@/components/ui/Skeleton';
```

### StreamingWrapper Component

Located in `src/components/streaming/StreamingWrapper.tsx`:

```tsx
import StreamingWrapper from '@/components/streaming/StreamingWrapper';

<StreamingWrapper
  fallback={<SkeletonCard />}
  className="my-section"
>
  <ExpensiveComponent />
</StreamingWrapper>
```

## Performance Impact

### Metrics Improved

- **TTFB (Time to First Byte)**: Faster (server can send partial content)
- **FCP (First Contentful Paint)**: Faster (page displays immediately with skeletons)
- **LCP (Largest Contentful Paint)**: Depends on content, usually improved
- **CLS (Cumulative Layout Shift)**: Better with skeleton placeholders

### Expected Improvements

With proper Suspense boundaries:
- Page appears 30-50% faster subjectively
- Reduces perceived wait time
- Better mobile experience
- Lower bounce rates

## Migration Checklist

For existing pages:

- [ ] Identify async data fetching
- [ ] Create appropriate skeleton components
- [ ] Wrap async sections with Suspense
- [ ] Test in development
- [ ] Measure before/after performance
- [ ] Monitor in production (Google Analytics)

## Testing

### Unit Tests

```tsx
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';

describe('Suspense Boundaries', () => {
  it('renders fallback while loading', () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <AsyncComponent />
      </Suspense>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

### Integration Tests

1. Test with network throttling
2. Verify skeleton dimensions match content
3. Check layout stability (no CLS)
4. Verify accessibility

## References

- [React Suspense Docs](https://react.dev/reference/react/Suspense)
- [Next.js Streaming](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Web.dev: Core Web Vitals](https://web.dev/vitals/)

## Summary

Suspense boundaries are a powerful tool for improving perceived performance:

1. **Immediate display**: Users see page structure right away
2. **Progressive content**: Content streams in as it's ready
3. **Better UX**: Skeleton loaders reduce perceived wait time
4. **Independent loading**: Sections load in parallel
5. **Graceful degradation**: Works without JavaScript

Implement Suspense boundaries in high-impact areas first for the best ROI.
