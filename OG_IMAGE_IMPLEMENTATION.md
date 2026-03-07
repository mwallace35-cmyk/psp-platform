# Dynamic Open Graph Image Generation Implementation

## Overview

This implementation provides dynamic Open Graph (OG) image generation for sport-specific and content-specific pages on PhillySportsPack.com. The system generates branded 1200x630px images with sport-specific colors, contextual titles, and proper caching headers.

## Architecture

### Files Created

#### 1. Core Library (`src/lib/og-utils.ts`)
Utility functions for OG image generation:
- **`getSportColors(sport?: SportId): SportColorMap`** - Returns sport-specific color palettes
  - Football: Green (#16a34a)
  - Basketball: Orange (#ea580c)
  - Baseball: Red (#dc2626)
  - Track & Field: Purple (#7c3aed)
  - Lacrosse: Cyan (#0891b2)
  - Wrestling: Yellow (#ca8a04)
  - Soccer: Teal (#059669)
  - Default (no sport): PSP Navy (#0a1628)

- **`truncateText(text: string, maxChars: number): string`** - Truncates text with ellipsis
  - Default max chars: 60
  - Preserves readability for long content

- **`truncateTitle(text: string): string`** - Truncates titles to 50 chars max

- **`truncateSubtitle(text: string): string`** - Truncates subtitles to 80 chars max

- **`buildOgImageUrl(params: OGImageParams): string`** - Constructs OG image URL with query parameters
  - Accepts: title (required), subtitle, sport, type
  - Uses `NEXT_PUBLIC_APP_URL` environment variable or defaults to `https://phillysportspack.com`
  - Properly encodes URL parameters

- **`validateOGParams(params: OGImageParams): { valid: boolean; errors: string[] }`**
  - Title: required, max 200 chars
  - Subtitle: optional, max 300 chars
  - Sport and type: optional, any value accepted

#### 2. API Route (`src/app/api/og/route.tsx`)
Dynamic image generation endpoint using Next.js ImageResponse API:

**Route:** `GET /api/og`

**Query Parameters:**
- `title` (required): Page title for the image
- `subtitle` (optional): Context or description
- `sport` (optional): Sport ID for color customization
- `type` (optional): Content type (player/team/school/article/sport)

**Features:**
- Generates 1200x630px PNG images
- Sport-specific gradient backgrounds with accent colors
- Responsive typography (72px title, 36px subtitle)
- Branded footer with PSP logo and sport indicator
- Decorative gradient accent circles
- Top accent bar with sport-specific color

**Cache Headers:**
```
Cache-Control: public, max-age=31536000, immutable
```
1-year caching with no revalidation (safe because images are deterministically generated from parameters)

**Error Handling:**
- Returns fallback image if title parameter is missing
- Returns fallback image on generation errors
- Console logging for debugging

#### 3. Page Metadata Updates

Updated three page files to use dynamic OG images:

##### `src/app/[sport]/page.tsx` (Sport Hub Pages)
```typescript
const ogImageUrl = buildOgImageUrl({
  title: `${meta.name} — Stats, Schools & Championships`,
  subtitle: "Philadelphia High School Sports Database",
  sport: sport,
  type: "sport",
});
```

##### `src/app/[sport]/schools/[slug]/page.tsx` (School Profile Pages)
```typescript
const ogImageUrl = buildOgImageUrl({
  title: school.name,
  subtitle: `${SPORT_META[sport].name} — School Profile`,
  sport: sport,
  type: "school",
});
```

##### `src/app/[sport]/players/[slug]/page.tsx` (Player Profile Pages)
```typescript
const ogImageUrl = buildOgImageUrl({
  title: player.name,
  subtitle: `${SPORT_META[sport].name} — Career Profile`,
  sport: sport,
  type: "player",
});
```

All pages now include OpenGraph and Twitter card metadata with dynamic image URLs.

### Tests

#### Unit Tests (`src/__tests__/lib/og-utils.test.ts`)
- **40 comprehensive tests** covering:
  - Sport color mapping (all 7 sports + default)
  - Text truncation logic
  - URL builder with various parameter combinations
  - Parameter validation
  - Integration scenarios (player profiles, school profiles, articles)
  - Edge cases (unicode, special characters, empty strings)

#### API Tests (`src/__tests__/api/og.test.ts`)
- **44 comprehensive tests** covering:
  - Route parameter validation
  - Sport color mapping
  - Text handling and truncation
  - Use case scenarios
  - Cache header configuration
  - Edge cases and error conditions

**Test Results:** All 84 tests pass successfully

## Usage Examples

### Sport Hub Page
```typescript
const ogImageUrl = buildOgImageUrl({
  title: "Football — Stats, Schools & Championships",
  subtitle: "Philadelphia High School Sports Database",
  sport: "football",
  type: "sport",
});
// Returns: https://phillysportspack.com/api/og?title=Football+...&sport=football&type=sport
```

### Player Profile
```typescript
const ogImageUrl = buildOgImageUrl({
  title: "John Smith",
  subtitle: "Football — Career Profile",
  sport: "football",
  type: "player",
});
```

### School Profile
```typescript
const ogImageUrl = buildOgImageUrl({
  title: "St. Joseph's Prep",
  subtitle: "Basketball — School Profile",
  sport: "basketball",
  type: "school",
});
```

## Color Scheme

Each sport has a carefully chosen color palette for visual distinction:

| Sport | Primary | Secondary | Accent |
|-------|---------|-----------|--------|
| Football | #16a34a | #0f5132 | #22c55e |
| Basketball | #ea580c | #7c2d12 | #fb923c |
| Baseball | #dc2626 | #7f1d1d | #ef4444 |
| Track & Field | #7c3aed | #4c1d95 | #a78bfa |
| Lacrosse | #0891b2 | #155e75 | #06b6d4 |
| Wrestling | #ca8a04 | #713f12 | #eab308 |
| Soccer | #059669 | #064e3b | #10b981 |
| Default (PSP) | #0a1628 | #1a365d | #2563eb |

## Environment Setup

The implementation uses the `NEXT_PUBLIC_APP_URL` environment variable for constructing URLs:

```bash
# .env.local
NEXT_PUBLIC_APP_URL=https://phillysportspack.com
```

If not set, defaults to `https://phillysportspack.com`.

## Image Dimensions

All OG images are generated at the recommended size for social media:
- **Width:** 1200px
- **Height:** 630px
- **Format:** PNG
- **Content Type:** image/png

This size is optimized for:
- Twitter/X (summary_large_image cards)
- Facebook (1.91:1 aspect ratio)
- LinkedIn (1.91:1 aspect ratio)
- Discord embeds
- Other social platforms

## Implementation Details

### Font Styles
Uses system fonts available in Node.js environment:
- Title: 72px, 700 weight, -0.02em letter-spacing
- Subtitle: 36px, 400 weight, 0.01em letter-spacing
- Metadata: 24px, 500 weight

### Layout
- Padding: 60px top/bottom, 80px left/right
- Accent bar: 8px at top with sport color
- Footer: Semi-transparent overlay with brand info
- Decorative circle: 200px radius at bottom-right corner with 10% opacity

### Error Handling
- Invalid/missing title: Returns generic fallback image
- Generation errors: Caught and logged, returns fallback image
- Invalid parameters: Validated before image generation

## Performance Considerations

1. **Caching:** Images are cached for 1 year with immutable flag
   - Safe because images are deterministically generated from URL parameters
   - Reduces server load and improves page load times

2. **Generation Speed:** ImageResponse API is optimized for server-side rendering
   - No external dependencies required
   - Built-in Next.js API

3. **URL Length:** Parameters are URL-encoded and optimized
   - Titles truncated to 50 chars
   - Subtitles truncated to 80 chars
   - Minimal query string overhead

## SEO Benefits

1. **Social Media:** Rich preview cards with sport-specific branding
2. **Search Engines:** OpenGraph metadata improves indexing
3. **Twitter Cards:** Proper card type and image dimensions
4. **Link Previews:** Better presentation in Slack, Discord, etc.

## Future Enhancements

Potential improvements for future iterations:

1. **Player Images:** Add player photo to OG images (requires image hosting)
2. **Statistics:** Include season statistics or records on images
3. **School Logos:** Add school mascot or logo to images
4. **Dynamic Text:** Include player positions, win records, etc.
5. **A/B Testing:** Track which image variations drive more engagement
6. **Animations:** Explore animated GIF generation (more complex)

## Testing

### Running Tests

```bash
# Run all OG-related tests
npm test -- og

# Run only og-utils tests
npm test -- og-utils

# Run with watch mode
npm run test:watch -- og
```

### Test Coverage
- 84 tests across 2 test files
- Unit tests for utility functions
- Integration tests for API route
- Edge case and error scenario tests

## Files Modified Summary

| File | Change | Type |
|------|--------|------|
| `src/lib/og-utils.ts` | Created | New utility module |
| `src/app/api/og/route.tsx` | Created | New API route |
| `src/app/[sport]/page.tsx` | Updated | Add dynamic OG metadata |
| `src/app/[sport]/schools/[slug]/page.tsx` | Updated | Add dynamic OG metadata |
| `src/app/[sport]/players/[slug]/page.tsx` | Updated | Add dynamic OG metadata |
| `src/__tests__/lib/og-utils.test.ts` | Created | Unit tests |
| `src/__tests__/api/og.test.ts` | Created | API tests |

## Troubleshooting

### OG images not showing in social media preview
1. Check that `NEXT_PUBLIC_APP_URL` is set correctly
2. Verify the API route is accessible at `/api/og`
3. Clear social media link preview cache (usually Twitter/LinkedIn debugging tools)
4. Check browser network tab for 200 response from `/api/og`

### Images showing generic fallback
1. Verify title parameter is being passed
2. Check browser console for error messages
3. Ensure sport parameter is valid (if using sport-specific colors)

### Performance issues
1. Images should be cached - check Cache-Control headers
2. If regenerating frequently, consider reducing revalidation time
3. Monitor server logs for image generation errors

## Dependencies

No external dependencies required. Uses:
- Next.js 16.1.6 built-in `ImageResponse` API
- TypeScript for type safety
- Vitest for testing

## Standards Compliance

- OpenGraph protocol: https://ogp.me/
- Twitter Cards: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
- Next.js Image Response: https://nextjs.org/docs/app/api-reference/functions/image-response
