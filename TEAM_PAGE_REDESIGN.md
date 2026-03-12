# Team Page Redesign & Sport Hub Color Updates

## Overview
Complete redesign of the team season page with a 5-tab tabbed interface, enhanced sidebar widgets, and sport-specific color gradients for sport hub pages.

**Deployment Date**: 2026-03-12
**ISR Revalidation**: 1800 seconds (30 minutes)

---

## Team Page (5-Tab Design)

### New File Structure

#### Data Layer
- **`src/lib/data/team-page.ts`** (7.9 KB)
  - `getTeamHistory()` - Last N seasons with records
  - `getNextGame()` - Upcoming game for a team
  - `getLeagueStandings()` - Teams in same league ranked by wins
  - `getTeamArticles()` - Articles mentioning a school
  - `getRelatedTeams()` - Other teams in same league
  - Types: `TeamHistory`, `NextGame`, `LeagueStandingsRow`, `TeamArticle`

#### Tab Components
All tab components are in `src/components/team/`:

1. **`TeamTabs.tsx`** (Client Component)
   - Tabbed navigation container
   - Handles tab switching with gold underline on active
   - Mobile: horizontal scrollable tab bar
   - Lazy content loading

2. **`ScheduleTab.tsx`** (Server Component)
   - Displays schedule/results for season
   - Desktop: table layout with score, opponent, result
   - Mobile: card layout
   - Features:
     - Upcoming games highlighted with gold left border
     - Completed games show winner bolded
     - "Box Score" link as blue pill for games with stats
     - Sorts by date automatically

3. **`RosterTab.tsx`** (Server Component)
   - Player roster organized by position groups
   - Desktop: 4-column grid
   - Mobile: scrollable list
   - Features:
     - Player cards with name, number, position, class year
     - Click → player profile link
     - Roster summary stats (total players, average class, seniors, returning)
     - Position-based grouping (Offense/Defense/Special Teams for football)

4. **`StatisticsTab.tsx`** (Server Component)
   - Team aggregate stats from team_seasons table
   - Features:
     - Win/Loss Record grid
     - Win percentage progress bar visualization
     - Points For/Against (sport-specific labels)
     - Point differential highlighted in blue/orange
     - Average points per game
     - Postseason result if available
     - Sport-aware stat labels (Points/Runs/Goals)

5. **`HistoryTab.tsx`** (Server Component)
   - Last 10 seasons with records
   - Features:
     - Championship medals (🏆) next to championship seasons
     - Table view (desktop) / Card list (mobile)
     - Links to past season pages
     - Coach names with links to coach profiles
     - Win-loss records and point differentials
     - Sortable by year

6. **`ArticlesTab.tsx`** (Server Component)
   - Articles mentioning the school
   - Features:
     - Featured images where available
     - Title, excerpt, publication date
     - "View all" link to search results
     - Desktop: card layout with thumbnail
     - Mobile: card layout

#### Sidebar Widgets
All widgets in `src/components/team/`:

1. **`SeasonSnapshot.tsx`**
   - Record (wins-losses-ties)
   - Win percentage
   - League name
   - Location (city, state)
   - Head coach with link to coach profile

2. **`NextGameWidget.tsx`**
   - Next upcoming game date/time
   - Opponent name with link
   - Home/Away indicator
   - Final score if game completed
   - Box Score link

3. **`LeagueStandingsWidget.tsx`**
   - Top 5 teams in league ranked by wins
   - Current school highlighted in gold
   - Win percentage for each team
   - Links to team pages
   - "You" badge on current team

---

## Sport Hub Color Updates

### New Constants
**File**: `src/lib/constants/sports.ts`

Added `SPORT_GRADIENTS` export:
```typescript
export const SPORT_GRADIENTS: Record<string, string> = {
  football: "from-[#0a1628] to-[#16a34a]",      // Navy → Green
  basketball: "from-[#0a1628] to-[#ea580c]",    // Navy → Orange
  baseball: "from-[#0a1628] to-[#dc2626]",      // Navy → Red
  "track-field": "from-[#0a1628] to-[#7c3aed]", // Navy → Purple
  lacrosse: "from-[#0a1628] to-[#0891b2]",      // Navy → Cyan
  wrestling: "from-[#0a1628] to-[#ca8a04]",     // Navy → Amber
  soccer: "from-[#0a1628] to-[#059669]",        // Navy → Emerald
};
```

### Updated Sport Hub Hero
**File**: `src/app/[sport]/page.tsx`

Replaced legacy `.sport-hdr` with dynamic gradient hero:
- Imports `SPORT_GRADIENTS` from constants
- Uses `bg-gradient-to-r` with sport-specific gradient
- Displays sport emoji, name, and stats pills
- Each sport visually distinct while maintaining navy base

---

## Data Layer Exports
**File**: `src/lib/data/index.ts`

Added barrel exports for team-page functions:
```typescript
export {
  getTeamHistory,
  getNextGame,
  getLeagueStandings,
  getTeamArticles,
  getRelatedTeams,
  type TeamHistory,
  type NextGame,
  type LeagueStandingsRow,
  type TeamArticle,
} from "./team-page";
```

---

## Component Integration

### Usage in Team Page (`[sport]/teams/[slug]/[season]/page.tsx`)

The existing team page server component can integrate tabs like:

```typescript
import { TeamTabs, type TabType } from "@/components/team/TeamTabs";
import { ScheduleTab } from "@/components/team/ScheduleTab";
import { RosterTab } from "@/components/team/RosterTab";
import { StatisticsTab } from "@/components/team/StatisticsTab";
import { HistoryTab } from "@/components/team/HistoryTab";
import { ArticlesTab } from "@/components/team/ArticlesTab";
import { SeasonSnapshot } from "@/components/team/SeasonSnapshot";
import { NextGameWidget } from "@/components/team/NextGameWidget";
import { LeagueStandingsWidget } from "@/components/team/LeagueStandingsWidget";
import { getTeamHistory, getNextGame, getLeagueStandings, getTeamArticles } from "@/lib/data";

// In your render:
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2">
    <TeamTabs
      tabs={[
        { id: "schedule", label: "Schedule", icon: "📅" },
        { id: "roster", label: "Roster", icon: "👥" },
        { id: "statistics", label: "Statistics", icon: "📊" },
        { id: "history", label: "History", icon: "📜" },
        { id: "articles", label: "Articles", icon: "📰" },
      ]}
      defaultTab="schedule"
    >
      {{
        schedule: <ScheduleTab games={games} sport={sport} schoolSlug={slug} />,
        roster: <RosterTab roster={roster} sport={sport} positionGroups={positionGroups} />,
        statistics: <StatisticsTab teamSeason={teamSeason} sport={sport} schoolName={school.name} />,
        history: <HistoryTab history={history} championships={championships} sport={sport} schoolSlug={slug} />,
        articles: <ArticlesTab articles={articles} schoolName={school.name} />,
      }}
    </TeamTabs>
  </div>
  <div className="space-y-6">
    <SeasonSnapshot school={school} teamSeason={teamSeason} sport={sport} />
    <NextGameWidget nextGame={nextGame} school={school} sport={sport} />
    <LeagueStandingsWidget standings={standings} currentSchool={school} sport={sport} />
  </div>
</div>
```

---

## Design Features

### Color Scheme
- **Primary**: Navy (#0a1628) — all headers/text
- **Accent**: Gold (#f0a500) — active tabs, highlights
- **Sport-Specific**: 7 unique gradients for hero sections
- **Secondary**: Blue (#3b82f6) — links, actions

### Typography
- **Headings**: Bebas Neue (bold, uppercase)
- **Body**: DM Sans (clean, readable)

### Responsive Behavior
- **Desktop**: 2-column layout (main content + sidebar)
- **Tablet** (768px+): 1 column, stacked
- **Mobile** (<768px): Full-width, card-based layout

### Accessibility
- Tab navigation keyboard-accessible
- Semantic HTML throughout
- Color contrast WCAG AA compliant
- ARIA labels on interactive elements

---

## Performance Considerations

### ISR Revalidation
Team pages revalidate every **1800 seconds (30 minutes)** to reflect:
- Schedule updates
- Score changes
- New articles mentioning school
- Roster changes

### Data Fetching
- All tab data fetches are `async` and can be parallelized in parent
- Individual components handle null/empty data gracefully
- Database queries indexed on:
  - `team_seasons(school_id, sport_id, season_id)`
  - `games(home_team_id, away_team_id, date)`
  - `article_mentions(entity_id, entity_type)`

---

## Testing Checklist

- [ ] Team page tabs switch without page reload
- [ ] Tab content loads correctly (schedule, roster, stats, history, articles)
- [ ] Sidebar widgets display current season data
- [ ] Responsive layout works on mobile/tablet
- [ ] Next game widget shows upcoming/completed games correctly
- [ ] League standings highlight current team in gold
- [ ] Links to player profiles, coach profiles, other team pages work
- [ ] Box Score links display when game has stats
- [ ] Sport hub hero gradients display correctly for all 7 sports
- [ ] ISR revalidation occurs at 30-minute intervals

---

## File Summary

### New Files Created (9 files)
1. `src/lib/data/team-page.ts` — Data fetching functions
2. `src/components/team/TeamTabs.tsx` — Tab navigation
3. `src/components/team/ScheduleTab.tsx` — Schedule/results
4. `src/components/team/RosterTab.tsx` — Roster grid
5. `src/components/team/StatisticsTab.tsx` — Team stats
6. `src/components/team/HistoryTab.tsx` — Historical seasons
7. `src/components/team/ArticlesTab.tsx` — Related articles
8. `src/components/team/SeasonSnapshot.tsx` — Snapshot widget
9. `src/components/team/NextGameWidget.tsx` — Next game widget
10. `src/components/team/LeagueStandingsWidget.tsx` — League standings widget

### Modified Files (3 files)
1. `src/lib/constants/sports.ts` — Added `SPORT_GRADIENTS`
2. `src/app/[sport]/page.tsx` — Updated hero with gradient, imported `SPORT_GRADIENTS`
3. `src/lib/data/index.ts` — Added barrel exports for team-page functions

### Total: 12 files affected

---

## Future Enhancements

Potential improvements for Phase 2:
- [ ] Coach timeline/history widget
- [ ] Season comparison tool (side-by-side)
- [ ] Player stat leader highlights on roster
- [ ] Championship trophy display widget
- [ ] Video highlight embeds on schedule
- [ ] Team records by opponent
- [ ] Playoff bracket visualization
- [ ] Alumni next-level tracking

---

## Documentation

All components include JSDoc comments and TypeScript types. Refer to individual component files for detailed prop interfaces.

For questions or issues, review:
- Component README: Each component has leading comments
- Data layer README: `src/lib/data/team-page.ts` inline docs
- Type definitions: All types exported from components and data layer
