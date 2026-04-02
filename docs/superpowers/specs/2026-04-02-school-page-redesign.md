# School Page Redesign: Sport-Tabbed Hub

**Date:** 2026-04-02
**Component:** `src/app/schools/[slug]/page.tsx` (1,002 lines)
**Data Layer:** `src/lib/data/school-hub.ts` (702 lines)

## Problem

The school page is a flat, monolithic scroll that serves as a directory entry rather than a team hub. Four user archetypes (parent, athlete, recruiter, fan) all fail their primary tasks:

- **No roster or player list** despite having player data in DB
- **No individual player stats** despite `football_game_stats` and `basketball_game_stats` tables containing full box scores
- **No "this season" context** — page feels historical, not current
- **No box score links** from game results
- **"TBD" opponent bug** in recent results (missing school relationships)
- **No sport-scoped views** — all sports mixed together

## Solution: Sport-Tabbed Hub

Transform the page from a flat scroll into a **tabbed hub** with:
1. **Overview tab** (default) — school identity, current season, sport cards
2. **Per-sport tabs** — roster, stats, games with box scores, rivalries
3. **Legacy tab** — championships, alumni, coaching history, records

## Architecture

### Tab Structure

```
[Overview] [Football] [Basketball] [Baseball] [...] [Legacy]
```

- URL stays `/schools/{slug}` — tabs use client-side state, not routes
- Default tab: Overview
- Sport tabs appear only for sports the school competes in
- Use existing `TabGroup` component (pills variant)

### Migration: SchoolSportTabs Removal

The existing `SchoolSportTabs` component renders sport tabs as `<Link>` elements navigating to `/{sport_id}/schools/{slug}` routes. This component is **replaced** by the new `SchoolTabHub`. Those `/{sport_id}/schools/{slug}` routes continue to exist as standalone sport-school pages — the school hub tabs simply scope data in-page instead of navigating away.

- Remove `SchoolSportTabs` import from `page.tsx`
- Replace with `SchoolTabHub` client component
- No URL redirects needed — existing sport-school routes remain valid as deep links

### Overview Tab

| Section | Source | Component |
|---------|--------|-----------|
| Hero (school identity, badges, PIAA class) | `getSchoolHubData` | Existing hero, add PIAA badge |
| "This Season" banner | NEW: `getSchoolCurrentSeasons` | NEW: `ThisSeasonBanner` |
| Sport program cards | `getSchoolAllSportsStats` | Existing cards |
| Recent results (all sports) | `getSchoolRecentGames` (fix TBD bug) | Existing table, fix W/L badges |
| School info | `getSchoolHubData` | Existing sidebar card, collapsible |

**Changes from current:**
- Remove: color swatches from hero, championships section, season history, awards, next-level alumni, coaching staff (all move to sport/legacy tabs)
- Add: PIAA class badge, "This Season" banner, anchor to sport tabs
- Fix: TBD opponents (B1), W/L badge rendering (B2)

### Per-Sport Tab (e.g., Football)

| Section | Source | Component |
|---------|--------|-----------|
| Season spotlight | `getSchoolCurrentSeasons` | Compact record + coach + playoff status |
| Roster | NEW: `getSchoolRoster` | NEW: `SchoolRoster` (adapts player data with grad year → class conversion) |
| Stat leaders (top 5 per category) | NEW: `getSchoolStatLeaders` | NEW: `StatLeadersCard` (compact 5-row cards) |
| Game results with box scores | NEW: `getSchoolGamesWithStats` | NEW: `TeamGameLog` (accordion of games with expandable team box scores) |
| Rivalry records | NEW: `getSchoolRivalries` | NEW: `RivalryCard` component |
| Season history (this sport) | `getSchoolRecentSeasons` filtered | Existing `SeasonHistoryTable` |
| Awards (this sport) | `getSchoolAwards` filtered | Existing awards table |
| Championships (this sport) | `getSchoolAllChampionships` filtered | Existing championship badges |

### Legacy Tab

| Section | Source | Component |
|---------|--------|-----------|
| Championships timeline (all sports) | `getSchoolAllChampionships` | Existing, add chronological timeline view |
| Next-level alumni (pros spotlighted) | `getSchoolNextLevel` | Existing table, fix name format (B3), pros get featured cards |
| Coaching history with records | `getSchoolCoaches` | Existing, add `record_wins/losses` display |
| School records | NEW: `getSchoolRecords` | NEW: `SchoolRecords` component |

## New Components (Not Reusing Existing)

### `SchoolRoster` (not `TeamRoster`)
`TeamRoster` expects `{ name, position, class: "Sr"|"Jr"|"So"|"Fr", height, weight, slug }` with a `positionGroups` mapping. Our data has `positions[]` (array), `graduation_year` (number), and sport-specific stats. Instead of an adapter, build `SchoolRoster`:
- Converts `graduation_year` to class abbreviation (2026→Sr, 2027→Jr, etc. based on current year)
- Extracts `positions[0]` as primary position
- Groups by position using sport-specific mappings:
  - Football: `{ "Offense": ["QB","RB","WR","OL","TE"], "Defense": ["DL","LB","DB","S","CB"], "Special Teams": ["K","P"] }`
  - Basketball: `{ "Guards": ["PG","SG","G"], "Forwards": ["SF","PF","F"], "Centers": ["C"] }`
  - Baseball: `{ "Infield": ["C","1B","2B","SS","3B"], "Outfield": ["LF","CF","RF","OF"], "Pitchers": ["P","SP","RP"] }`
- Shows mini stat line per player (sport-specific: rushing/passing for football, ppg/rpg for basketball)

### `StatLeadersCard` (not `LeaderboardTable`)
`LeaderboardTable` has heavy props (`AdvancedFilterPanel`, `schoolName`, `isCareer`) designed for standalone leaderboard pages. For "top 5 rushers" on a school page, build a compact `StatLeadersCard`:
- Accepts: `{ title, players: { name, slug, value, gamesPlayed }[], unit: string }`
- Renders: numbered list (1-5), player name (linked), stat value bold, games played subtle
- Sport has multiple cards: Football gets Rushing/Passing/Receiving/Scoring/Tackles, Basketball gets Scoring/Rebounds/Assists/Steals

### `TeamGameLog` (not `GameLogAccordion`)
`GameLogAccordion` is player-scoped (shows one player's game-by-game stats). For team game results with expandable box scores, build `TeamGameLog`:
- List of games: date, opponent, W/L badge, score, `BoxScoreIndicator` link
- Expandable accordion: clicking a game reveals the full team box score
  - Table of players with stat columns (sport-specific)
  - Sorted by stat relevance (top scorers first)
- Uses `DataTable` internally for the expanded box score

### `RivalryCard`
- Shows: opponent name/logo, all-time record (W-L-T), win %, last meeting date/result
- Sorted by total games played (most frequent opponents first)
- Max 10 rivals per sport

### `SchoolRecords`
- Groups records by sport, then by category (Career, Single-Season, Single-Game)
- Shows: record description, value, holder name (linked if player exists), year

### `ThisSeasonBanner`
- One row per sport with current season data
- Shows: sport emoji, current W-L record, next game (date + opponent) or "Season Complete"
- Fallback: if no current season data, show most recent completed season

## Data Fetching Strategy

### Server-Side: Overview + Legacy Data (Always Fetched)
Fetch in parallel via `Promise.allSettled()` in `page.tsx`:
- `getSchoolHubData`, `getSchoolAllSportsStats`, `getSchoolRecentGames`, `getSchoolNextLevel`, `getSchoolAllChampionships`, `getSchoolRecentSeasons`, `getSchoolCoaches`, `getSchoolAwards`
- NEW: `getSchoolCurrentSeasons`

### Client-Side: Sport Tab Data (Lazy Loaded)
Sport-specific data (roster, stat leaders, games with box scores, rivalries) is **fetched on-demand** when a sport tab is activated. This avoids fetching 5 sports worth of roster/stats/box scores upfront.

Approach: API route `/api/schools/[slug]/sport-data?sport=football&season=2024-25` returns:
```ts
{
  roster: SchoolRosterPlayer[],
  statLeaders: StatLeaderCategory[],
  games: GameWithBoxScore[],
  rivalries: RivalryRecord[]
}
```

This route calls the new query functions server-side. The `SportTab` component uses `useSWR` or `useEffect` to fetch when the tab becomes active. Cached via ISR headers on the API route.

**Why lazy:** A school like St. Joe's Prep has 48 football seasons. `getSchoolGamesWithStats` for a single season could return 15 games x 30 players = 450 box score rows. Fetching this for 5 sports upfront = 2,000+ rows in the initial page payload.

### School Records (Fetched with Legacy Tab)
Add `getSchoolRecords` to the main `Promise.allSettled()` since it's lightweight and needed for Legacy tab.

## New Data Queries (Supabase JS Client)

### `getSchoolCurrentSeasons(schoolId)`
```ts
// Step 1: Get current season team records
const { data: seasons } = await supabase
  .from('team_seasons')
  .select('*, season:seasons(label, year_start), sport:sports(name)')
  .eq('school_id', schoolId)
  .eq('season.year_start', currentYearStart)

// Step 2: Get next upcoming game per sport
const { data: nextGames } = await supabase
  .from('games')
  .select('*, home_school:school_names!home_school_id(name, slug), away_school:school_names!away_school_id(name, slug)')
  .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
  .gte('game_date', today)
  .is('home_score', null) // unplayed games
  .order('game_date', { ascending: true })
  .limit(1) // per sport, post-process to get first per sport_id

// Step 3: Combine in JS — one entry per sport with record + next game
// Fallback: if no current season, show most recent completed season
```

### `getSchoolRoster(schoolId, sportId, seasonId)`
```ts
// Football example
const { data } = await supabase
  .from('football_player_seasons')
  .select('games_played, total_td, total_yards, rush_yards, pass_yards, rec_yards, points, player:players(id, slug, name, positions, graduation_year, height, weight)')
  .eq('school_id', schoolId)
  .eq('season_id', seasonId)
  .order('total_yards', { ascending: false })

// Basketball: select points, ppg, rebounds, rpg, assists, apg + player join
// Baseball: select batting_avg, hits, home_runs, era + player join
```

### `getSchoolStatLeaders(schoolId, sportId, seasonId)`
```ts
// Football — 5 parallel queries, one per stat category
const [rushers, passers, receivers, scorers, tacklers] = await Promise.all([
  supabase.from('football_player_seasons')
    .select('rush_yards, rush_td, games_played, player:players(name, slug)')
    .eq('school_id', schoolId).eq('season_id', seasonId)
    .gt('rush_yards', 0).order('rush_yards', { ascending: false }).limit(5),
  // ... same pattern for pass_yards, rec_yards, total_td, tackles
])
```

### `getSchoolGamesWithStats(schoolId, sportId, seasonId)`
```ts
// Step 1: Get games for this school/sport/season
const { data: games } = await supabase
  .from('games')
  .select('*, home_school:school_names!home_school_id(name, slug), away_school:school_names!away_school_id(name, slug), season:seasons(label)')
  .eq('sport_id', sportId)
  .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
  .eq('season_id', seasonId)
  .order('game_date', { ascending: false })
  .limit(20) // current season only, capped

// Step 2: For each game, fetch box score stats
// Use game IDs to batch: .in('game_id', gameIds)
const { data: stats } = await supabase
  .from('football_game_stats') // or basketball_game_stats
  .select('*, player:players(name, slug)')
  .in('game_id', gameIds)
  .eq('school_id', schoolId)
  .order('points', { ascending: false })

// Step 3: Group stats by game_id in JS
```

### `getSchoolRivalries(schoolId, sportId)`
This requires aggregation that Supabase JS can't do natively. Use `.rpc()` with a Postgres function:

```sql
CREATE OR REPLACE FUNCTION get_school_rivalries(p_school_id INT, p_sport_id INT)
RETURNS TABLE(
  opponent_id INT, opponent_name TEXT, opponent_slug TEXT,
  total_games BIGINT, wins BIGINT, losses BIGINT, ties BIGINT,
  last_meeting DATE
) AS $$
  SELECT
    CASE WHEN g.home_school_id = p_school_id THEN g.away_school_id ELSE g.home_school_id END,
    CASE WHEN g.home_school_id = p_school_id THEN sn_away.name ELSE sn_home.name END,
    CASE WHEN g.home_school_id = p_school_id THEN s_away.slug ELSE s_home.slug END,
    COUNT(*),
    SUM(CASE WHEN (g.home_school_id = p_school_id AND g.home_score > g.away_score) OR
                  (g.away_school_id = p_school_id AND g.away_score > g.home_score) THEN 1 ELSE 0 END),
    SUM(CASE WHEN (g.home_school_id = p_school_id AND g.home_score < g.away_score) OR
                  (g.away_school_id = p_school_id AND g.away_score < g.home_score) THEN 1 ELSE 0 END),
    SUM(CASE WHEN g.home_score = g.away_score THEN 1 ELSE 0 END),
    MAX(g.game_date)
  FROM games g
  JOIN school_names sn_home ON g.home_school_id = sn_home.id
  JOIN school_names sn_away ON g.away_school_id = sn_away.id
  JOIN schools s_home ON g.home_school_id = s_home.id
  JOIN schools s_away ON g.away_school_id = s_away.id
  WHERE g.sport_id = p_sport_id
    AND (g.home_school_id = p_school_id OR g.away_school_id = p_school_id)
    AND g.home_score IS NOT NULL
  GROUP BY 1, 2, 3
  ORDER BY COUNT(*) DESC
  LIMIT 10;
$$ LANGUAGE sql STABLE;
```

Call via: `supabase.rpc('get_school_rivalries', { p_school_id: schoolId, p_sport_id: sportId })`

### `getSchoolRecords(schoolId)`
Follow existing pattern from `src/lib/data/records.ts`:
```ts
const { data } = await supabase
  .from('records')
  .select('*, player:players(name, slug), season:seasons(label), sport:sports(name)')
  .eq('school_id', schoolId)
  .order('sport_id').order('category').order('record_number', { ascending: false })
```

## Bug Fixes

### B1: "TBD" Opponents
**Root cause:** `getSchoolRecentGames` joins schools via FK but some games reference soft-deleted schools (RLS filters `deleted_at IS NOT NULL`, returning null). The display falls back to "TBD."

**Fix:** Use `school_names` view (which bypasses RLS and shows all schools including deleted) instead of the `schools` table for game opponent lookups. This is the established pattern per CLAUDE.md: "Use `school_names` view instead of `schools` table for historical game displays."

### B2: W/L Badge Inconsistency
**Root cause:** W/L logic compares `home_score` vs `away_score` but doesn't correctly account for which side the school is on.

**Fix:** In the render logic:
```ts
const isHome = game.home_school_id === school.id
const schoolScore = isHome ? game.home_score : game.away_score
const opponentScore = isHome ? game.away_score : game.home_score
const result = schoolScore > opponentScore ? 'W' : schoolScore < opponentScore ? 'L' : 'T'
```

### B3: Alumni Name Format
**Fix:** Normalize in display layer:
```ts
function normalizeName(name: string): string {
  if (name.includes(',')) {
    const [last, first] = name.split(',').map(s => s.trim())
    return `${first} ${last}`
  }
  return name
}
```

### B4: Duplicate Alumni ("Babe Connaughton")
**Fix:** Low priority — data cleanup task, not a code fix. Note for future DB maintenance.

### B5: PIAA Class Badge
**Fix:** Add to hero badges. Data already fetched:
```tsx
{school.piaa_class && <Badge variant="outline">Class {school.piaa_class}</Badge>}
```

## Component Architecture

### New Components (7)
- `src/components/school/SchoolTabHub.tsx` — client component, tab state, lazy loads sport data
- `src/components/school/OverviewTab.tsx` — overview tab content
- `src/components/school/SportTab.tsx` — per-sport tab content
- `src/components/school/LegacyTab.tsx` — legacy tab content
- `src/components/school/SchoolRoster.tsx` — roster with grad year conversion + position groups
- `src/components/school/StatLeadersCard.tsx` — compact top-5 stat display
- `src/components/school/TeamGameLog.tsx` — game list with expandable box scores
- `src/components/school/RivalryCard.tsx` — head-to-head record display
- `src/components/school/SchoolRecords.tsx` — records by category
- `src/components/school/ThisSeasonBanner.tsx` — current season spotlight

### API Route (1)
- `src/app/api/schools/[slug]/sport-data/route.ts` — lazy-loaded sport tab data

### DB Migration (1)
- `get_school_rivalries` Postgres function

### Page Decomposition
Current: 1 file, 1,002 lines
Target: ~12 files, ~150-200 lines each

```
page.tsx (~250 lines) — server component, data fetching, hero, metadata
  ├── SchoolTabHub.tsx (client, tab state + lazy loading)
  │   ├── OverviewTab.tsx
  │   │   ├── ThisSeasonBanner.tsx
  │   │   └── (existing sport cards, recent results)
  │   ├── SportTab.tsx (one per sport)
  │   │   ├── SchoolRoster.tsx (new)
  │   │   ├── StatLeadersCard.tsx (new)
  │   │   ├── TeamGameLog.tsx (new)
  │   │   └── RivalryCard.tsx (new)
  │   └── LegacyTab.tsx
  │       ├── SchoolRecords.tsx (new)
  │       └── (existing championships, alumni, coaches)
  ├── school-hub.ts (data layer, add new queries)
  └── api/schools/[slug]/sport-data/route.ts (lazy load endpoint)
```

## Verification Plan

1. Load `/schools/st-josephs-prep` — verify tabs render, no "TBD" opponents
2. Click Football tab — verify roster loads, stat leaders show, box scores expand
3. Click Legacy tab — verify championships, alumni (no name format issues), records
4. Mobile test at 375px — tabs scroll horizontally, tables adapt
5. Run Lighthouse (target: Performance 90+, Accessibility 95+)
6. Verify ISR: `revalidate = 3600` still works with tab structure
7. Test empty states: school with only 1 sport, school with no box scores
8. Validate schema.org markup still present
9. **Corrupted data check:** Test box score expansion for a school with known archive data issues (per project memory: 30,783 rows / 37% have wrong game assignments). Confirm stats display is reasonable or add a data quality filter that excludes rows where the school_id in box score doesn't match the game's home/away school.
10. Test lazy loading: open Network tab, verify sport tab data only fetches when tab is clicked
