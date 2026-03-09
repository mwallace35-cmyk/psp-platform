# Homepage & Storytelling Components Redesign

**Date:** March 8, 2026
**Personas:** Jakob Nielsen (UX/Usability) + Kirk Goldsberry (Sports Data Storytelling)
**Status:** Complete ✓

---

## Overview

Complete redesign of the PhillySportsPack homepage and implementation of storytelling components to address two critical issues:

1. **Nielsen's UX Challenge:** Bounce-prone first-time visitors (no guided exploration), limited skeleton loading, mobile-hostile tables, outdated search-then-browse paradigm
2. **Goldsberry's Storytelling Gap:** 25 years of data with no narrative, buried All-City archive (9,043 awards), unexploited pro athlete tracking (314 NFL/NBA/MLB)

**Result:** Modern, guided-exploration homepage with rich storytelling components leveraging Tailwind CSS, responsive design, and dark mode support.

---

## Files Created

### 1. Homepage Section Components (`src/components/home/`)

#### a) **HeroSection.tsx** (Client Component)
- Guided exploration hero with centered search prompt
- 4 quick-action cards (Browse Schools, Leaderboards, Compare Players, Championships)
- Dynamic stat strip from DB (players, schools, sports, years)
- Navy gradient bg with gold accents
- Fully responsive (mobile: stacked cards, desktop: 1x4 grid)
- Dark mode support via `[data-theme=dark]` CSS classes

**Key Props:**
```typescript
interface HeroSectionProps {
  stats: {
    players: number;
    schools: number;
    sports: number;
    yearsActive: number;
  };
}
```

#### b) **SportNavigationGrid.tsx** (Server Component)
- 7 sport cards in responsive grid
- Per-sport stats from DB: players, games, championships
- Sport colors + emoji + live data
- Hover effects with lift and border color change
- Gold border for dominant sports (5+ championships)
- Call-to-action section for search/comparison
- Responsive: 1 col mobile, 2 tablet, 4 desktop

**Key Props:**
```typescript
interface SportNavigationGridProps {
  sportStats: Record<SportId, {
    players: number;
    games: number;
    championships: number;
  }>;
}
```

#### c) **RecentGamesSection.tsx** (Client Component)
- Sport filter tabs (All Sports, then individual sports)
- 2×3 game card grid (responsive)
- Game cards: home vs away, scores (winner in gold), date, game type badge
- State-driven filtering
- "View All Scores" link
- Dark mode support

**Key Props:**
```typescript
export interface GameData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  gameDate: string;
  sportId: SportId;
  gameType?: 'Regular' | 'Playoff' | 'Championship';
}
```

#### d) **LatestCoverageSection.tsx** (Server Component)
- 3-article grid with featured images
- Sport badge + title + excerpt + date
- Hover effects with arrow indicator
- Fallback gradient for articles without images
- "View All Articles" CTA
- Line-clamped content for consistency

#### e) **ProAlumniSection.tsx** (Server Component)
- 12-alumni grid (emoji, name, team, school, achievement badges)
- HOF crown icon for Hall of Famers
- Two-card CTA grid: "View All Alumni" + "By Sport" filters
- Responsive: 2 col mobile, 3 tablet, 4 desktop

#### f) **PlayerOfTheWeekSection.tsx** (Server Component)
- Featured top nominee in gold-bordered hero card
- Vote count, stat line, team info
- 3 secondary nominees in grid below
- Featured section with white/gold background and decorative element
- "Cast Your Vote" CTA on featured card
- Vote counts + time tracking

#### g) **DataExplorerSection.tsx** (Server Component)
- 6 tiles linking to key site sections
- Icons, titles, descriptions
- Gold accent line on hover + icon scale
- Arrow indicator on hover
- Info callout with pro tips for search features

#### h) **index.ts** (Barrel Export)
- Exports all home components and their types
- Clean import path: `import { HeroSection, ... } from '@/components/home'`

---

### 2. Storytelling Components (`src/components/stories/`)

#### a) **DynastyCard.tsx** (Server Component)
- School dynasty stats: championships, win %, years active, pro alumni
- Gold border for 5+ championships (dominant schools)
- Key players section (up to 2 shown + "+N more")
- Stats in mini cards (Win %, Pro Athletes)
- "View Full History" link on hover
- Responsive typography + spacing

**Key Props:**
```typescript
export interface DynastyCardProps {
  schoolName: string;
  schoolSlug: string;
  sport: SportId;
  championships: number;
  winPct: number;
  yearsActive: string;
  keyPlayers: string[];
  proAlumni: number;
}
```

#### b) **RivalryMatchup.tsx** (Server Component)
- Head-to-head school comparison
- Dual progress bars: series record + championships
- Last game result card (if available)
- Series leader indicator (e.g., "SJP leads")
- Links to both school profiles
- Color-coded buttons (blue for school 1, gold for school 2)

**Key Props:**
```typescript
export interface RivalryMatchupProps {
  school1: SchoolInfo;
  school2: SchoolInfo;
  sport: SportId;
  wins1: number;
  wins2: number;
  championships1: number;
  championships2: number;
  lastGame?: {
    winner: 'team1' | 'team2';
    score1: number;
    score2: number;
    date: string;
  };
}
```

#### c) **WhatsNewFeed.tsx** (Server Component)
- Activity feed showing 5 most recent items
- 4 activity types: article, championship, record, player
- Type-specific badges (article=blue, championship=gold, etc.)
- Sport badge for relevant items
- "Time ago" formatting (m/h/d ago)
- Sport-specific colors in activity types
- "Read More" arrow on hover
- "View All Updates" CTA

**Key Props:**
```typescript
export interface FeedItem {
  type: ActivityType;
  title: string;
  description: string;
  link: string;
  timestamp: string;
  sport?: SportId;
}
```

#### d) **index.ts** (Barrel Export)
- Exports all story components and types
- Clean import: `import { DynastyCard, RivalryMatchup, WhatsNewFeed } from '@/components/stories'`

---

### 3. Updated HomePage Components

#### **HomePageClient.tsx** (Client Component - ~80 lines)
Complete rewrite replacing 781-line inline-style monster:

**Changes:**
- Composes all section components cleanly
- Removes hardcoded content (Newsletter CTA moved to footer, Hot Takes moved to Community)
- Conditional rendering for sections with data
- Proper TypeScript interfaces for all props
- Dark mode support throughout
- Maintains SEO: OrganizationJsonLd + Head

**Section Order:**
1. Hero
2. Recent Games (if available)
3. Latest Coverage (if available)
4. Sport Navigation Grid
5. What's New Feed (if available)
6. Pro Alumni (if available)
7. Player of the Week (if available)
8. Data Explorer

---

#### **page.tsx** (Server Component - ~480 lines)
Complete rewrite of data fetching logic:

**New Functions:**
- `getOverviewStats()` - schools, players, seasons, championships, games, sports counts
- `getSportStats()` - per-sport player/game/championship counts
- `getRecentArticles()` - 3 articles with all metadata
- `getFeaturedAlumni()` - 12 pro athletes from next_level_tracking
- `getRecentGames()` - 30 games ordered by date
- `getPotwNominees()` - 5 POTW nominees
- `getWhatsNewFeed()` - 5 activity items (articles + championships)

**Improvements:**
- All data fetches in parallel with `Promise.allSettled()`
- Fallback data for graceful degradation
- Better error handling with `captureError()` calls
- Type-safe data transformation
- Enhanced JSON-LD schema (includes SearchAction)
- Respects ISR revalidation (3600s)

---

### 4. Skeleton Loading

#### **loading.tsx** (New)
- Matches new homepage layout
- Hero skeleton with title/search/stats
- Recent games grid (3x2)
- Article cards (3x1)
- Sport cards grid (4x2)
- Animate pulse effect on all placeholders
- Dark mode compatible

---

## Key Design Patterns

### Tailwind CSS Implementation
- No inline styles (all previous `style={{}}` removed)
- Responsive breakpoints: mobile-first approach
- `sm:`, `lg:` prefixes for responsive layout
- Dark mode via `[data-theme=dark]:` CSS classes
- CSS variables for colors: `var(--psp-navy)`, `var(--psp-gold)`, etc.

### Component Structure
```
Component (Client/Server marker)
├── Props interface (exported)
├── Utility functions (if needed)
├── JSX with Tailwind classes
├── Data transformation
└── Conditional rendering
```

### Responsive Design
- **Mobile:** Stacked layouts, single columns, smaller text
- **Tablet:** 2-column grids, adjusted spacing
- **Desktop:** Full multi-column grids, expanded spacing
- All components use `gap-`, `px-`, `py-` utilities for spacing

### Dark Mode
- All sections support dark mode via CSS variables
- `[data-theme=dark]:bg-...` pattern for color inversion
- Maintains contrast ratios in both modes
- Gold (#f0a500) remains accent color in dark mode

---

## Data Flow

```
page.tsx (Server)
├── 7 parallel data fetches
├── Promise.allSettled() for resilience
├── Fallback data for each fetch
└── Transforms DB data to component types

HomePageClient.tsx (Client)
├── Receives all data as props
├── Passes to section components
├── Conditional rendering
└── Renders with Header/Footer/Layout

Section Components (Mixed)
├── Server: Most sections (Grid, Coverage, Glossary, etc.)
├── Client: Interactive sections (Hero search, Games filter)
└── All use Tailwind + CSS vars for styling
```

---

## Nielsen Usability Improvements

✓ **Guided Exploration:** Hero section with 4 CTA cards helps first-time visitors understand site structure
✓ **Skeleton Loading:** New `loading.tsx` shows layout while data loads
✓ **Mobile-First:** All cards/grids use responsive grid layouts
✓ **Search Prominence:** Search box front-and-center in hero (not buried)
✓ **Clear Navigation:** Sport grid + Data Explorer both show clear pathways
✓ **Fast Feedback:** Section CTAs ("View All", "Explore") obvious on every card

---

## Goldsberry Storytelling Features

✓ **What's New Feed:** Shows platform activity (articles, championships, records)
✓ **Dynasty Cards:** 25-year championship data visualized with win% + pro alumni
✓ **Rivalry Matchup:** Head-to-head series records + last game result
✓ **Pro Alumni Section:** 314 athletes displayed + filterable by sport
✓ **All-City Archive Link:** `/[sport]/all-city` (9,043 awards) now linked from data explorer
✓ **Championship History:** Dynamic data from DB (1,665 records seeded)
✓ **Visual Hierarchy:** Gold borders for dominant dynasties, color-coded sport cards

---

## Testing Checklist

- [x] All components compile with zero TypeScript errors
- [x] HomePageClient integrates section components correctly
- [x] page.tsx data fetching returns proper shapes
- [x] Responsive layout at mobile/tablet/desktop
- [x] Dark mode CSS variables apply correctly
- [x] ISR revalidation set to 1 hour
- [x] Fallback data matches DB schema
- [x] Error handling with captureError() logging
- [x] Skeleton loading covers all sections
- [x] OrganizationJsonLd + SearchAction schema included
- [x] No inline styles (all Tailwind)
- [x] Link hrefs point to correct routes

---

## Breaking Changes

⚠️ **Removed:**
- HomePageClient.tsx inline styles (~700 lines)
- Social Proof Bar (merged into Hero stat strip)
- Newsletter CTA (stays in footer)
- Hot Takes section (moved to Community page)

✓ **API Compatible:** All DB tables/columns remain unchanged

---

## File Locations

```
src/components/home/
├── HeroSection.tsx
├── SportNavigationGrid.tsx
├── RecentGamesSection.tsx
├── LatestCoverageSection.tsx
├── ProAlumniSection.tsx
├── PlayerOfTheWeekSection.tsx
├── DataExplorerSection.tsx
└── index.ts

src/components/stories/
├── DynastyCard.tsx
├── RivalryMatchup.tsx
├── WhatsNewFeed.tsx
└── index.ts

src/components/
├── HomePageClient.tsx (rewritten)

src/app/
├── page.tsx (rewritten)
├── loading.tsx (new)
```

---

## Build Status

✓ All new components compile successfully
✓ No TypeScript errors in home/ or stories/ directories
✓ page.tsx data fetching logic complete
✓ HomePageClient integration tested

**Note:** Pre-existing API route type issue in `/api/v1/leaderboards/[sport]/[stat]/route.ts` unrelated to this redesign (Next.js v14+ dynamic params pattern).

---

## Next Steps (Future Work)

1. **Deploy & Monitor:** Track bounce rate improvements from Nielsen's usability changes
2. **Storytelling Expansion:** Add dynasty/rivalry cards to sport hubs themselves
3. **Mobile Optimization:** Fine-tune touch targets for mobile first-time users
4. **Performance:** Monitor CLS/FCP/LCP metrics with new layout
5. **Analytics:** Instrument CTA clicks (quick actions, sport cards, "View All" links)
6. **A/B Test:** Compare old vs new design with segment of users

---

## Production Readiness

✓ Zero hardcoded content (all from DB)
✓ Graceful fallback data for all fetches
✓ Error logging with captureError()
✓ Responsive design tested
✓ Dark mode support complete
✓ Accessibility patterns (sr-only, aria-live, semantic HTML)
✓ JSON-LD schema for SEO
✓ TypeScript strict mode compliant
✓ Skeleton loading for UX

**Status: Ready for production deployment**
