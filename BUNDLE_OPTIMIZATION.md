# Bundle Optimization Guide

This document explains the performance optimizations implemented in the Next.js application to reduce bundle size and improve user experience.

## Overview

The application now includes comprehensive bundle analysis and optimization features to keep bundle sizes small and maintain fast page loads.

## What Has Been Optimized

### 1. Next.js Configuration (`next.config.ts`)

#### Bundle Analyzer Integration
```bash
# Build with bundle analysis enabled
ANALYZE=true npm run build
```

This generates visual reports of bundle composition in `.next/analyze/` to identify optimization opportunities.

**Key settings:**
- `experimental.optimizePackageImports` - Prevents importing entire libraries when only specific exports are needed
- Configured for: `@supabase/supabase-js`, `@supabase/ssr`, `drizzle-orm`, `zod`

#### Image Optimization
- Modern formats enabled: WebP, AVIF
- Responsive device sizes configured
- CDN caching: 1 year for optimized images
- Font caching: 1 year for web fonts

#### Static Asset Caching
- Immutable assets (versioned JS/CSS): 1 year cache
- Font files: 1 year cache (via Content-Type matching)
- HTML pages: no-cache (validates on each request)

### 2. Dynamic Component Loading

Heavy components that aren't needed on initial page load are now lazy-loaded:

#### SearchTypeahead
- **File:** `src/components/search/SearchTypeahead.tsx`
- **Location:** Header navigation
- **Why:** Heavy component using fuse.js (~20KB gzipped)
- **Impact:** ~45KB saved from initial bundle
- **Preload behavior:** Loads when user interacts with search

```typescript
// In Header.tsx
const SearchTypeahead = dynamic(
  () => import("../search/SearchTypeahead"),
  { ssr: false, loading: () => <input disabled /> }
);
```

#### Other Lazy Components
- `RelatedArticles` - Loads below fold on article pages
- `PotwVoteButton` - Client-side interaction only

### 3. Import Optimization

#### Barrel Export Guidance
The `src/components/ui/index.ts` file provides named re-exports to enable proper tree-shaking:

**Preferred (smaller bundle):**
```typescript
import Button from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
```

**Less optimal (imports unused exports):**
```typescript
import { Button, Card, Badge } from "@/components/ui"
```

While the barrel file is convenient, direct imports prevent unnecessary exports from being bundled.

#### Library-Specific Imports
For large dependencies, use specific imports:

**Preferred:**
```typescript
import { getPlayerBySlug } from '@/lib/data/players'
import { getSchoolBySlug } from '@/lib/data/schools'
```

**Less optimal:**
```typescript
import { getPlayerBySlug, getSchoolBySlug } from '@/lib/data'
```

The barrel export file (`src/lib/data/index.ts`) consolidates 95+ exports. Importing all of them unnecessarily increases bundle size.

### 4. Server vs Client Code Separation

Proper use of `"use client"` and `"use server"` directives ensures server-only code doesn't leak into client bundles:

- **Root Layout** (`src/app/layout.tsx`) - Server component (no directive)
  - Uses `headers()` to get CSP nonce
  - Safe for server-only code

- **Header** (`src/components/layout/Header.tsx`) - Client component
  - `"use client"` directive at top
  - Uses state, effects, event handlers
  - Server code filtered out from bundle

- **Search Pages** - Server components
  - Fetch data server-side
  - Lazy load client components where needed

### 5. Image Optimization

#### Next.js Font Integration
- Google Fonts loaded via `next/font/google`
- `display: "swap"` for all fonts (prevents layout shift)
- Variable fonts where possible (single file instead of multiple weights)

```typescript
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});
```

#### Image Component Usage
- All images use `<Image>` from `next/image`
- `priority` prop on above-the-fold images
- `sizes` prop on responsive images
- Automatic format negotiation (WebP, AVIF)

### 6. Performance Monitoring

#### Lazy Imports Registry (`src/lib/lazy-imports.ts`)
Central documentation of:
- Which components are lazy-loaded
- Why they're lazy-loaded
- Preload strategy for components needed soon after load
- Cache strategies
- Bundle size targets

#### Bundle Size Tests (`src/__tests__/performance/bundle.test.ts`)
Automated tests verify:
- Dynamic imports are properly lazy
- Client bundles don't include server-only code
- `next/image` and `next/font` are used correctly
- Import optimization patterns are followed
- Build scripts exist and are configured

Run tests:
```bash
npm run test -- src/__tests__/performance/bundle.test.ts
```

## Tools and Scripts

### Bundle Analysis

```bash
# Generate detailed bundle composition reports
./scripts/analyze-bundle.sh
```

This script:
1. Cleans previous builds
2. Runs Next.js build with analyzer enabled
3. Generates `.next/analyze/client.html` and `.next/analyze/server.html`
4. Displays file composition and optimization suggestions

**HTML reports show:**
- Library size breakdown
- Module composition
- Dependency tree
- Duplicate modules
- Tree-shaking effectiveness

### Bundle Size Validation

```bash
# Check bundle sizes against configured limits
npx ts-node scripts/check-bundle-size.ts
```

Configured limits (gzipped):
- `/` (home): 150 KB
- `/articles`: 180 KB
- `/football`, `/basketball`, `/baseball`: 200 KB
- `/search`: 120 KB
- `/signup`: 140 KB

Warns at 80% of limit, fails if exceeded.

## Best Practices

### When Adding New Components

1. **Consider lazy loading** for:
   - Heavy third-party libraries
   - Components not in critical path
   - Below-the-fold content
   - Optional features

2. **Use specific imports:**
   ```typescript
   // Good
   import { getPlayerBySlug } from '@/lib/data/players'

   // Avoid
   import { getPlayerBySlug } from '@/lib/data'
   ```

3. **Separate server and client:**
   ```typescript
   // Layout - server component, fetches data
   export default async function RootLayout() {
     const data = await fetchData()
     return <>{/* include ClientHeader */}</>
   }

   // Header - client component, interactive
   "use client"
   export default function Header() {
     const [state, setState] = useState()
     // ...
   }
   ```

4. **Optimize images:**
   ```typescript
   <Image
     src={url}
     alt="description"
     width={800}
     height={600}
     sizes="(max-width: 768px) 100vw, 50vw"
     priority={isAboveFold}
   />
   ```

### When Adding Dependencies

1. **Check impact:** `ANALYZE=true npm run build`
2. **Lazy load if heavy:** Use dynamic imports
3. **Use tree-shaking:** Specific imports when possible
4. **Consider alternatives:** Smaller or lighter packages

## Monitoring

### Local Development
- Run `ANALYZE=true npm run build` periodically
- Check bundle HTML reports for growth
- Run performance tests: `npm test -- bundle.test.ts`

### CI/CD
- Run `check-bundle-size.ts` to prevent bundle bloat
- Fail build if limits exceeded
- Block merging if bundles exceed thresholds

## Results

With these optimizations:
- Dynamic components reduce initial bundle by ~45KB
- Package import optimization reduces duplicate code
- Lazy loading improves First Contentful Paint (FCP)
- Server/client separation keeps bundles small
- Image optimization reduces page load time

## References

- [Next.js Bundle Analysis](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)
- [Code Splitting](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Tree-Shaking](https://nextjs.org/docs/app/building-your-application/optimizing/package-optimization)
