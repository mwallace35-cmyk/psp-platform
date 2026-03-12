# Enhanced Pro Player Profile System

This document summarizes the new Next Level module for PhillySportsPack.com, featuring enhanced pro athlete profiles and improved next-level tracking.

## New Files Created

### Data Layer (`src/lib/data/`)

**`next-level.ts`** - Core data fetchers for pro athlete information
- `getProAthletes(options)` - List all pro athletes with filtering (league, sport, school, status, search) and pagination
- `getProAthleteBySlug(id)` - Single pro athlete with linked player stats and awards
- `getProAthletesBySchool(schoolId)` - All pro athletes from a specific school
- `getProAthletesByLeague(league)` - Pro athletes grouped by league (NFL, NBA, MLB, WNBA)
- `getFeaturedProAthletes(limit)` - Featured pro athletes for homepage/sidebar
- `getCollegePlacements(options)` - College-level placements with filtering
- `getProAthleteStats()` - Summary statistics (total count by league)

**Type Definitions:**
- `ProAthlete` - Basic pro athlete record
- `ProAthleteDetail` - Extended with linked player stats and awards
- `CollegePlacement` - College-level tracking record

### Utilities (`src/lib/`)

**`slug-utils.ts`** - URL slug utilities for pro athletes
- `generateSlug(name)` - Convert name to URL-friendly slug
- `createProAthleteSlug(name, id)` - Create slug in format "name-id"
- `parseProAthleteSlug(slug)` - Extract ID from slug

### Pages

**`src/app/next-level/page.tsx`** - Enhanced Pro Athletes Directory
- Client-side filtering by league (All, NFL, NBA, MLB, WNBA)
- Search functionality
- Responsive card grid layout
- Summary statistics sidebar
- Top producer schools
- Pagination support via API

**`src/app/next-level/[slug]/page.tsx`** - Individual Pro Athlete Profile
- Hero section with player name, team, league badge
- High school info with link to HS profile
- College info (if available)
- Draft details
- High school career stats (sport-specific):
  - Football: rushing, passing, receiving, TDs
  - Basketball: points, rebounds, assists
  - Baseball: season-by-season stats
- Awards and honors
- Related articles from archive
- External profile links (Twitter, Instagram, NFL.com, NBA.com, etc.)
- School alumni sidebar with other pro athletes
- Links to related pages

**`src/app/next-level/[slug]/loading.tsx`** - Loading skeleton for pro profile

### API Routes

**`src/app/api/next-level/route.ts`** - Pro athletes list endpoint
- Supports filtering by league, sport, search
- Pagination support
- Returns: athletes array, total count, pagination info

**`src/app/api/next-level/stats/route.ts`** - Pro athlete statistics
- Returns counts by league (NFL, NBA, MLB, WNBA, total)

**`src/app/api/players/[id]/pro-status/route.ts`** - Player pro status lookup
- Called by WentProBadge component
- Returns pro level info if player has been drafted

### Components

**`src/components/players/WentProBadge.tsx`** - Pro athlete indicator for player profiles
- Async component that fetches pro status for a player
- Displays team, league, and draft info
- Links to enhanced pro profile page
- Styled with league colors
- Only renders if player is pro

**`src/components/schools/ProAlumniSection.tsx`** - Pro alumni display for school profiles
- Lists all pro athletes from a school
- Grouped by league
- Shows team and draft info
- Links to each athlete's profile
- Responsive grid layout

## Integration Points

### 1. Update Data Index
`src/lib/data/index.ts` has been updated to export all new next-level functions and types:
```typescript
export {
  getProAthletes,
  getProAthleteBySlug,
  getProAthletesBySchool,
  getProAthletesByLeague,
  getFeaturedProAthletes,
  getCollegePlacements,
  getProAthleteStats,
  type ProAthlete,
  type ProAthleteDetail,
  type CollegePlacement,
} from "./next-level";
```

### 2. Add to Player Profiles
To add the "Went Pro" badge to player profile pages, import and use in `src/app/[sport]/players/[slug]/page.tsx`:
```typescript
import { WentProBadge } from "@/components/players/WentProBadge";

// In the player profile component, before career stats:
<WentProBadge playerId={player.id} />
```

### 3. Add to School Profiles
To add pro alumni section to school profiles, import and use in school profile page/component:
```typescript
import { ProAlumniSection } from "@/components/schools/ProAlumniSection";

// In the school profile component:
<ProAlumniSection schoolId={school.id} schoolName={school.name} />
```

## Database Schema Integration

The system uses the existing `next_level_tracking` table with these key columns:
- `id` - Primary key
- `player_id` - Link to players table (optional, for HS players)
- `person_name` - Full name of pro athlete
- `high_school_id` - Link to schools table
- `sport_id` - Football, basketball, etc.
- `current_level` - "pro", "college", "coaching", "staff"
- `pro_team` - Current team name
- `pro_league` - NFL, NBA, MLB, WNBA, etc.
- `draft_info` - Draft year, round, pick
- `college` - College name
- `college_sport` - Sport at college level
- `status` - "active", "retired", "inactive"
- `social_twitter`, `social_instagram` - Social media handles
- `featured` - Boolean for homepage features
- `bio_note` - Extended bio text

## Design System

All components follow PSP design standards:
- **Colors**: Navy (#0a1628), Gold (#f0a500), Blue (#3b82f6)
- **Typography**: Bebas Neue (headings), DM Sans (body)
- **League Badges**: Color-coded by league
  - NFL: #003da5 (blue)
  - NBA: #c4122e (red)
  - MLB: #002d72 (dark blue)
  - WNBA: #552583 (purple)

## Features

### Pro Athlete Directory
- Multi-league filtering with live counts
- Full-text name search
- Responsive grid/card layout
- Top producer schools sidebar
- League statistics
- Mobile-optimized

### Individual Profiles
- Complete athlete background
- Linked high school stats (when available)
- Professional achievement timeline
- Related articles from archive
- Social media links
- External league/team links
- School context and alumni connections

### School Integration
- Pro alumni cards on school profiles
- Grouped by league with counts
- Quick links to each athlete's profile
- Encourages school pride

### Player Integration
- Prominent "Went Pro" badge
- Links to full pro profile
- Shows current team and league
- Draft information when available

## Performance Considerations

- All data fetchers use `withRetry` and `withErrorHandling` patterns
- ISR (Incremental Static Regeneration) set to 1 hour for listings
- Server-side rendering for SEO
- Async components for progressive loading
- API endpoints support caching headers
- Optimized queries with proper indexing (indexes on current_level, pro_league, featured)

## Future Enhancements

1. **Career Statistics** - Add pro stats when available (games played, key stats)
2. **College Tracking** - Expanded college placements directory
3. **Interactive Timeline** - Career progression visualization
4. **Salary Data** - When public sources available
5. **Draft Analysis** - Historical draft trends by school
6. **Coaching Records** - Track coaches who went pro
7. **Alumni Network** - Team-based network visualization
8. **Real-time Updates** - Integration with pro league APIs

## Testing Recommendations

1. Test filtering by each league
2. Test search with partial names
3. Verify pagination works with large result sets
4. Check mobile responsiveness on all pages
5. Test HS stat links when player has data
6. Verify article mention detection
7. Check social media link formatting
8. Test school alumni section with various school IDs
9. Verify WentProBadge appears correctly on player profiles
10. Test 404 handling for invalid athlete IDs
