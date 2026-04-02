# School Page Redesign: Sport-Tabbed Hub — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the monolithic school page into a tabbed hub with Overview, per-sport, and Legacy tabs — surfacing rosters, stats, box scores, and rivalries that currently exist in the database but aren't displayed.

**Architecture:** Server component (`page.tsx`) fetches overview/legacy data via `Promise.allSettled()`. A client `SchoolTabHub` manages tab state. Sport-specific data (roster, stats, games, rivalries) lazy-loads via API route when a sport tab is clicked. Existing components (`RivalryRecord`, `TabGroup`, `BoxScoreIndicator`, `SeasonHistoryTable`) are reused.

**Tech Stack:** Next.js 16 App Router (RSC + client components), Supabase PostgreSQL, Vitest + React Testing Library

**Spec:** `docs/superpowers/specs/2026-04-02-school-page-redesign.md`

---

## File Map

### Modified Files
| File | Responsibility | Changes |
|------|---------------|---------|
| `src/app/schools/[slug]/page.tsx` | Server component, data fetch, hero, metadata | Decompose from 1002 lines to ~250. Extract sections into tab components. Fix bugs B1/B2/B3/B5. |
| `src/lib/data/school-hub.ts` | School data queries | Add 5 new query functions: `getSchoolCurrentSeasons`, `getSchoolRoster`, `getSchoolStatLeaders`, `getSchoolGamesWithStats`, `getSchoolRecords` |
| `src/lib/data/rivalries.ts` | Rivalry data | Add `getSchoolRivalries(schoolId, sportId)` following existing patterns |

### New Files
| File | Responsibility |
|------|---------------|
| `src/components/school/SchoolTabHub.tsx` | Client component — tab state management + lazy loading |
| `src/components/school/OverviewTab.tsx` | Overview tab content (this season, sport cards, recent results) |
| `src/components/school/SportTab.tsx` | Per-sport tab (roster, stats, games, rivalries, history, awards, championships) |
| `src/components/school/LegacyTab.tsx` | Legacy tab (championships, alumni, coaching, records) |
| `src/components/school/SchoolRoster.tsx` | Roster display with position grouping + grad year → class conversion |
| `src/components/school/StatLeadersCard.tsx` | Compact top-5 stat leader cards |
| `src/components/school/TeamGameLog.tsx` | Game list with expandable team box scores |
| `src/components/school/ThisSeasonBanner.tsx` | Current season spotlight per sport |
| `src/components/school/SchoolRecordsSection.tsx` | School records grouped by sport + category |
| `src/app/api/schools/[slug]/sport-data/route.ts` | API endpoint for lazy-loaded sport tab data |
| `supabase/migrations/[timestamp]_get_school_rivalries.sql` | Postgres function for school rivalry aggregation |

### Existing Components Reused (no changes needed)
| Component | Used In |
|-----------|---------|
| `TabGroup` (`src/components/ui/TabGroup.tsx`) | `SchoolTabHub` — pills variant for tab navigation |
| `RivalryRecord` (`src/components/school/RivalryRecord.tsx`) | `SportTab` — head-to-head rivalry cards |
| `BoxScoreIndicator` (`src/components/schedule/BoxScoreIndicator.tsx`) | `TeamGameLog` — game detail links |
| `SeasonHistoryTable` (`src/components/school/SeasonHistoryTable.tsx`) | `SportTab` — filtered season history |
| `WinLossBar` (`src/components/ui/WinLossBar.tsx`) | Via `RivalryRecord` |
| `DataTable` (`src/components/ui/DataTable.tsx`) | `TeamGameLog` expanded box scores |

---

## Task 1: Bug Fixes (B1, B2, B3, B5)

**Files:**
- Modify: `src/app/schools/[slug]/page.tsx`
- Modify: `src/lib/data/school-hub.ts`

Fix the four bugs identified in the audit before restructuring the page.

- [ ] **Step 1: Fix B1 — TBD opponents in `getSchoolRecentGames`**

In `school-hub.ts`, the `getSchoolRecentGames` function joins schools via FK. Per CLAUDE.md, use `school_names` view (bypasses RLS, shows soft-deleted schools) instead of `schools` table:

```typescript
// In getSchoolRecentGames, change the select to use school_names view:
const { data, error } = await supabase
  .from('games')
  .select(`
    id, sport_id, game_date, home_score, away_score,
    home_school_id, away_school_id,
    home_school:school_names!home_school_id(id, name, slug),
    away_school:school_names!away_school_id(id, name, slug),
    season:seasons(label)
  `)
  // ... existing filters
```

Also filter out games where BOTH opponent names resolve to null:
```typescript
// After data fetch, filter:
.filter(game => {
  const opponent = game.home_school_id === schoolId ? game.away_school : game.home_school;
  return opponent && opponent.name;
})
```

- [ ] **Step 2: Fix B2 — W/L badge logic in `page.tsx`**

Find the recent results rendering section (~line 565-628). Replace the W/L logic:

```typescript
// Current (broken): compares home_score vs away_score without checking which side school is on
// Fix: determine school's side first
const isHome = game.home_school_id === school.id;
const schoolScore = isHome ? game.home_score : game.away_score;
const opponentScore = isHome ? game.away_score : game.home_score;
const result = schoolScore != null && opponentScore != null
  ? schoolScore > opponentScore ? 'W' : schoolScore < opponentScore ? 'L' : 'T'
  : null;
```

- [ ] **Step 3: Fix B3 — Alumni name normalization**

Add helper function at top of `page.tsx` (will be moved to LegacyTab later):
```typescript
function normalizeName(name: string): string {
  if (name.includes(',')) {
    const [last, ...firstParts] = name.split(',');
    return `${firstParts.join(',').trim()} ${last.trim()}`;
  }
  return name;
}
```

Apply in the Next Level Alumni section: `normalizeName(athlete.person_name)`

- [ ] **Step 4: Fix B5 — Add PIAA class badge to hero**

In the hero badges section (~line 260-290), add after the school_type badge:
```tsx
{school.piaa_class && (
  <Badge variant="outline" className="text-xs">Class {school.piaa_class}</Badge>
)}
```

- [ ] **Step 5: Remove color swatches from hero**

Delete the color swatch rendering (~2-5 lines showing small colored squares of school colors). Keep the school colors in the data for gradient background.

- [ ] **Step 6: Verify bug fixes locally**

Run: `cd ~/tedsilary.com/phillysportspack/psp-platform/next-app && npm run dev`
Navigate to `http://localhost:3000/schools/st-josephs-prep`
Verify: No "TBD" opponents, W/L badges correct, alumni names normalized, PIAA badge shows, no color swatches.

- [ ] **Step 7: Commit**

```bash
git add src/app/schools/\[slug\]/page.tsx src/lib/data/school-hub.ts
git commit -m "fix: school page bugs — TBD opponents, W/L badges, alumni names, PIAA badge"
```

---

## Task 2: New Data Queries in school-hub.ts

**Files:**
- Modify: `src/lib/data/school-hub.ts`

Add 4 new query functions following existing patterns (`cache()` + `withErrorHandling()` + `withRetry()`).

- [ ] **Step 1: Add `getSchoolCurrentSeasons`**

```typescript
export interface CurrentSeasonInfo {
  sport_id: string;
  sport_name: string;
  wins: number;
  losses: number;
  ties: number;
  playoff_result: string | null;
  season_label: string;
  next_game?: {
    game_date: string;
    opponent_name: string;
    opponent_slug: string;
    is_home: boolean;
  };
}

export const getSchoolCurrentSeasons = cache(
  async (schoolId: number): Promise<CurrentSeasonInfo[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(async () => {
          const supabase = await createClient();
          const currentLabel = getCurrentSeasonLabel(); // "2025-26" (imported from @/lib/sports)

          // Get current season records
          const { data: seasons } = await supabase
            .from('team_seasons')
            .select('sport_id, wins, losses, ties, playoff_result, season:seasons!inner(label, year_start), sport:sports!inner(name)')
            .eq('school_id', schoolId)
            .eq('seasons.label', currentLabel);

          if (!seasons || seasons.length === 0) {
            // Fallback: most recent completed season
            const { data: fallback } = await supabase
              .from('team_seasons')
              .select('sport_id, wins, losses, ties, playoff_result, season:seasons(label, year_start), sport:sports(name)')
              .eq('school_id', schoolId)
              .order('seasons.year_start', { ascending: false, foreignTable: 'seasons' })
              .limit(5);
            // Return first per sport
            // ... transform and deduplicate by sport_id
          }

          // Get next upcoming games (unplayed)
          const { data: nextGames } = await supabase
            .from('games')
            .select('sport_id, game_date, home_school_id, away_school_id, home_school:school_names!home_school_id(name, slug), away_school:school_names!away_school_id(name, slug)')
            .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
            .is('home_score', null)
            .gte('game_date', new Date().toISOString().split('T')[0])
            .order('game_date', { ascending: true })
            .limit(10);

          // Combine: map seasons, attach next game per sport
          return (seasons || []).map((s: any) => {
            const sport = Array.isArray(s.sport) ? s.sport[0] : s.sport;
            const season = Array.isArray(s.season) ? s.season[0] : s.season;
            const nextGame = (nextGames || []).find((g: any) => g.sport_id === s.sport_id);

            let next_game: CurrentSeasonInfo['next_game'] | undefined;
            if (nextGame) {
              const isHome = nextGame.home_school_id === schoolId;
              const opp = isHome ? nextGame.away_school : nextGame.home_school;
              const oppData = Array.isArray(opp) ? opp[0] : opp;
              next_game = {
                game_date: nextGame.game_date,
                opponent_name: oppData?.name || 'TBA',
                opponent_slug: oppData?.slug || '',
                is_home: isHome,
              };
            }

            return {
              sport_id: s.sport_id,
              sport_name: sport?.name || s.sport_id,
              wins: s.wins || 0,
              losses: s.losses || 0,
              ties: s.ties || 0,
              playoff_result: s.playoff_result,
              season_label: season?.label || currentLabel,
              next_game,
            };
          });
        }, { maxRetries: 2, baseDelay: 500 });
      },
      [],
      'DATA_SCHOOL_CURRENT_SEASONS',
      { schoolId }
    );
  }
);
```

- [ ] **Step 2: Add `getSchoolRoster`**

```typescript
export interface SchoolRosterPlayer {
  player_id: number;
  player_slug: string | null;
  player_name: string;
  positions: string[];
  graduation_year: number | null;
  height: string | null;
  weight: number | null;
  games_played: number | null;
  // Sport-specific stat summary (one field)
  primary_stat_value: number | null;
  primary_stat_label: string; // "yards" | "points" | "avg"
}

export const getSchoolRoster = cache(
  async (schoolId: number, sportId: string, seasonLabel: string): Promise<SchoolRosterPlayer[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(async () => {
          const supabase = await createClient();

          // Determine sport-specific table and stat
          const sportConfig: Record<string, { table: string; statCol: string; statLabel: string }> = {
            football: { table: 'football_player_seasons', statCol: 'total_yards', statLabel: 'yards' },
            basketball: { table: 'basketball_player_seasons', statCol: 'points', statLabel: 'points' },
            baseball: { table: 'baseball_player_seasons', statCol: 'hits', statLabel: 'hits' },
          };

          const config = sportConfig[sportId];
          if (!config) return [];

          // Look up season_id from label
          const { data: seasonRow } = await supabase
            .from('seasons').select('id').eq('label', seasonLabel).single();
          if (!seasonRow) return [];

          const { data, error } = await (supabase as any)
            .from(config.table)
            .select(`games_played, ${config.statCol}, player:players!inner(id, slug, name, positions, graduation_year, height, weight)`)
            .eq('school_id', schoolId)
            .eq('season_id', seasonRow.id);

          if (error || !data) return [];

          return (data as any[]).map((row: any) => {
            const p = Array.isArray(row.player) ? row.player[0] : row.player;
            return {
              player_id: p?.id || 0,
              player_slug: p?.slug || null,
              player_name: p?.name || 'Unknown',
              positions: p?.positions || [],
              graduation_year: p?.graduation_year || null,
              height: p?.height || null,
              weight: p?.weight || null,
              games_played: row.games_played || null,
              primary_stat_value: row[config.statCol] || null,
              primary_stat_label: config.statLabel,
            };
          }).sort((a: SchoolRosterPlayer, b: SchoolRosterPlayer) => {
            // Sort by position group, then name
            const posA = a.positions[0] || 'ZZ';
            const posB = b.positions[0] || 'ZZ';
            return posA.localeCompare(posB) || a.player_name.localeCompare(b.player_name);
          });
        }, { maxRetries: 2, baseDelay: 500 });
      },
      [],
      'DATA_SCHOOL_ROSTER',
      { schoolId, sportId, seasonLabel }
    );
  }
);
```

- [ ] **Step 3: Add `getSchoolStatLeaders`**

```typescript
export interface StatLeaderEntry {
  player_name: string;
  player_slug: string | null;
  value: number;
  games_played: number | null;
}

export interface StatLeaderCategory {
  category: string; // "Rushing Yards", "Points", etc.
  leaders: StatLeaderEntry[];
}

export const getSchoolStatLeaders = cache(
  async (schoolId: number, sportId: string, seasonLabel: string): Promise<StatLeaderCategory[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(async () => {
          const supabase = await createClient();

          const categories: Record<string, { table: string; col: string; label: string }[]> = {
            football: [
              { table: 'football_player_seasons', col: 'rush_yards', label: 'Rushing Yards' },
              { table: 'football_player_seasons', col: 'pass_yards', label: 'Passing Yards' },
              { table: 'football_player_seasons', col: 'rec_yards', label: 'Receiving Yards' },
              { table: 'football_player_seasons', col: 'total_td', label: 'Touchdowns' },
              { table: 'football_player_seasons', col: 'tackles', label: 'Tackles' },
            ],
            basketball: [
              { table: 'basketball_player_seasons', col: 'points', label: 'Points' },
              { table: 'basketball_player_seasons', col: 'rebounds', label: 'Rebounds' },
              { table: 'basketball_player_seasons', col: 'assists', label: 'Assists' },
              { table: 'basketball_player_seasons', col: 'steals', label: 'Steals' },
            ],
            baseball: [
              { table: 'baseball_player_seasons', col: 'hits', label: 'Hits' },
              { table: 'baseball_player_seasons', col: 'home_runs', label: 'Home Runs' },
              { table: 'baseball_player_seasons', col: 'rbi', label: 'RBI' },
              { table: 'baseball_player_seasons', col: 'batting_avg', label: 'Batting Avg' },
            ],
          };

          const sportCats = categories[sportId];
          if (!sportCats) return [];

          // Look up season_id from label
          const { data: seasonRow } = await supabase
            .from('seasons').select('id').eq('label', seasonLabel).single();
          if (!seasonRow) return [];

          const results = await Promise.allSettled(
            sportCats.map(async (cat) => {
              const { data } = await (supabase as any)
                .from(cat.table)
                .select(`${cat.col}, games_played, player:players!inner(name, slug)`)
                .eq('school_id', schoolId)
                .eq('season_id', seasonRow.id)
                .gt(cat.col, 0)
                .order(cat.col, { ascending: false })
                .limit(5);

              return {
                category: cat.label,
                leaders: ((data || []) as any[]).map((row: any) => {
                  const p = Array.isArray(row.player) ? row.player[0] : row.player;
                  return {
                    player_name: p?.name || 'Unknown',
                    player_slug: p?.slug || null,
                    value: row[cat.col] || 0,
                    games_played: row.games_played || null,
                  };
                }),
              };
            })
          );

          return results
            .filter((r): r is PromiseFulfilledResult<StatLeaderCategory> => r.status === 'fulfilled')
            .map(r => r.value)
            .filter(cat => cat.leaders.length > 0);
        }, { maxRetries: 2, baseDelay: 500 });
      },
      [],
      'DATA_SCHOOL_STAT_LEADERS',
      { schoolId, sportId, seasonLabel }
    );
  }
);
```

- [ ] **Step 4: Add `getSchoolGamesWithStats`**

```typescript
export interface GameWithBoxScore {
  game_id: number;
  game_date: string | null;
  sport_id: string;
  home_school_id: number;
  away_school_id: number;
  home_school_name: string;
  away_school_name: string;
  home_school_slug: string;
  away_school_slug: string;
  home_score: number | null;
  away_score: number | null;
  season_label: string;
  player_stats: BoxScorePlayerStat[];
}

export interface BoxScorePlayerStat {
  player_name: string;
  player_slug: string | null;
  // Football
  rush_yards?: number | null;
  rush_td?: number | null;
  pass_yards?: number | null;
  pass_td?: number | null;
  rec_yards?: number | null;
  rec_td?: number | null;
  total_td?: number | null;
  points?: number | null;
  // Basketball
  bb_points?: number | null;
  rebounds?: number | null;
  assists?: number | null;
  steals?: number | null;
}

export const getSchoolGamesWithStats = cache(
  async (schoolId: number, sportId: string, seasonLabel: string): Promise<GameWithBoxScore[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(async () => {
          const supabase = await createClient();

          // Step 1: Get games
          const { data: games } = await supabase
            .from('games')
            .select(`id, sport_id, game_date, home_school_id, away_school_id, home_score, away_score,
              home_school:school_names!home_school_id(name, slug),
              away_school:school_names!away_school_id(name, slug),
              season:seasons!inner(label)`)
            .eq('sport_id', sportId)
            .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
            .eq('seasons.label', seasonLabel)
            .not('home_score', 'is', null)
            .order('game_date', { ascending: false })
            .limit(20);

          if (!games || games.length === 0) return [];

          const gameIds = games.map((g: any) => g.id);

          // Step 2: Get box score stats for these games
          const statsTable = sportId === 'basketball' ? 'basketball_game_stats' : 'football_game_stats';
          const { data: stats } = await (supabase as any)
            .from(statsTable)
            .select('*, player:players(name, slug)')
            .in('game_id', gameIds)
            .eq('school_id', schoolId);

          // Step 3: Group stats by game_id
          const statsByGame = new Map<number, any[]>();
          for (const stat of (stats || [])) {
            const list = statsByGame.get(stat.game_id) || [];
            list.push(stat);
            statsByGame.set(stat.game_id, list);
          }

          // Step 4: Combine
          return games.map((g: any) => {
            const hs = Array.isArray(g.home_school) ? g.home_school[0] : g.home_school;
            const as_ = Array.isArray(g.away_school) ? g.away_school[0] : g.away_school;
            const season = Array.isArray(g.season) ? g.season[0] : g.season;
            const gameStats = statsByGame.get(g.id) || [];

            return {
              game_id: g.id,
              game_date: g.game_date,
              sport_id: g.sport_id,
              home_school_id: g.home_school_id,
              away_school_id: g.away_school_id,
              home_school_name: hs?.name || 'Unknown',
              away_school_name: as_?.name || 'Unknown',
              home_school_slug: hs?.slug || '',
              away_school_slug: as_?.slug || '',
              home_score: g.home_score,
              away_score: g.away_score,
              season_label: season?.label || seasonLabel,
              player_stats: gameStats.map((s: any) => {
                const p = Array.isArray(s.player) ? s.player[0] : s.player;
                return {
                  player_name: p?.name || 'Unknown',
                  player_slug: p?.slug || null,
                  rush_yards: s.rush_yards, rush_td: s.rush_td,
                  pass_yards: s.pass_yards, pass_td: s.pass_td,
                  rec_yards: s.rec_yards, rec_td: s.rec_td,
                  total_td: s.total_td, points: s.points,
                  bb_points: s.points, rebounds: s.rebounds,
                  assists: s.assists, steals: s.steals,
                };
              }).sort((a: any, b: any) => (b.points || b.bb_points || 0) - (a.points || a.bb_points || 0)),
            };
          });
        }, { maxRetries: 2, baseDelay: 500 });
      },
      [],
      'DATA_SCHOOL_GAMES_WITH_STATS',
      { schoolId, sportId, seasonLabel }
    );
  }
);
```

- [ ] **Step 5: Add `getSchoolRecords` (follow `records.ts` pattern)**

```typescript
export interface SchoolRecord {
  id: number;
  category: string;
  subcategory: string | null;
  scope: string | null;
  record_value: string | null;
  record_number: number | null;
  holder_name: string | null;
  year_set: number | null;
  description: string | null;
  player_name: string | null;
  player_slug: string | null;
  sport_name: string | null;
  season_label: string | null;
}

export const getSchoolRecords = cache(
  async (schoolId: number): Promise<SchoolRecord[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(async () => {
          const supabase = await createClient();
          const { data, error } = await supabase
            .from('records')
            .select(`id, category, subcategory, scope, record_value, record_number,
              holder_name, year_set, description, sport_id,
              players(name, slug), sports(name), seasons(label)`)
            .eq('school_id', schoolId)
            .order('sport_id').order('category').order('record_number', { ascending: false });

          if (error || !data) return [];

          return (data as any[]).map((r: any) => ({
            id: r.id,
            category: r.category || 'Other',
            subcategory: r.subcategory || null,
            scope: r.scope || null,
            record_value: r.record_value || null,
            record_number: r.record_number || null,
            holder_name: r.holder_name || null,
            year_set: r.year_set || null,
            description: r.description || null,
            player_name: r.players?.name || null,
            player_slug: r.players?.slug || null,
            sport_name: r.sports?.name || null,
            season_label: r.seasons?.label || null,
          }));
        }, { maxRetries: 2, baseDelay: 500 });
      },
      [],
      'DATA_SCHOOL_RECORDS',
      { schoolId }
    );
  }
);
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/data/school-hub.ts
git commit -m "feat: add school roster, stat leaders, box scores, records queries"
```

---

## Task 3: School Rivalries (DB Function + Data Query)

**Files:**
- Create: `supabase/migrations/[timestamp]_get_school_rivalries.sql`
- Modify: `src/lib/data/rivalries.ts`

- [ ] **Step 1: Create Postgres function for school rivalries**

Create migration file `supabase/migrations/20260402120000_get_school_rivalries.sql`:

```sql
CREATE OR REPLACE FUNCTION get_school_rivalries(p_school_id INT, p_sport_id TEXT)
RETURNS TABLE(
  opponent_id INT,
  opponent_name TEXT,
  opponent_slug TEXT,
  total_games BIGINT,
  wins BIGINT,
  losses BIGINT,
  ties BIGINT,
  last_meeting_date DATE,
  last_home_score INT,
  last_away_score INT,
  last_is_home BOOLEAN
) AS $$
  WITH ranked_games AS (
    SELECT
      CASE WHEN g.home_school_id = p_school_id THEN g.away_school_id ELSE g.home_school_id END AS opp_id,
      g.home_school_id, g.away_school_id, g.home_score, g.away_score, g.game_date,
      ROW_NUMBER() OVER (
        PARTITION BY CASE WHEN g.home_school_id = p_school_id THEN g.away_school_id ELSE g.home_school_id END
        ORDER BY g.game_date DESC
      ) AS rn
    FROM games g
    WHERE g.sport_id = p_sport_id
      AND (g.home_school_id = p_school_id OR g.away_school_id = p_school_id)
      AND g.home_score IS NOT NULL
  )
  SELECT
    rg.opp_id::INT,
    sn.name::TEXT,
    s.slug::TEXT,
    COUNT(*)::BIGINT,
    SUM(CASE WHEN (rg.home_school_id = p_school_id AND rg.home_score > rg.away_score) OR
                  (rg.away_school_id = p_school_id AND rg.away_score > rg.home_score) THEN 1 ELSE 0 END)::BIGINT,
    SUM(CASE WHEN (rg.home_school_id = p_school_id AND rg.home_score < rg.away_score) OR
                  (rg.away_school_id = p_school_id AND rg.away_score < rg.home_score) THEN 1 ELSE 0 END)::BIGINT,
    SUM(CASE WHEN rg.home_score = rg.away_score THEN 1 ELSE 0 END)::BIGINT,
    MAX(CASE WHEN rg.rn = 1 THEN rg.game_date END)::DATE,
    MAX(CASE WHEN rg.rn = 1 THEN rg.home_score END)::INT,
    MAX(CASE WHEN rg.rn = 1 THEN rg.away_score END)::INT,
    MAX(CASE WHEN rg.rn = 1 THEN (rg.home_school_id = p_school_id) END)::BOOLEAN
  FROM ranked_games rg
  JOIN school_names sn ON rg.opp_id = sn.id
  JOIN schools s ON rg.opp_id = s.id
  GROUP BY rg.opp_id, sn.name, s.slug
  ORDER BY COUNT(*) DESC
  LIMIT 10;
$$ LANGUAGE sql STABLE;
```

- [ ] **Step 2: Apply migration via Supabase MCP**

Use `apply_migration` tool with project_id `uxshabfmgjsykurzvkcr`.

- [ ] **Step 3: Add `getSchoolRivalries` to `rivalries.ts`**

Follow existing `getTopRivalries` RPC pattern:

```typescript
import { RivalryData } from '@/components/school/RivalryRecord';

export const getSchoolRivalries = cache(
  async (schoolId: number, sportId: string): Promise<RivalryData[]> => {
    return withErrorHandling(
      async () => {
        return withRetry(async () => {
          const supabase = await createClient();
          const { data, error } = await (supabase as any).rpc('get_school_rivalries', {
            p_school_id: schoolId,
            p_sport_id: sportId,
          });

          if (error) {
            console.error('School rivalries RPC error:', error);
            return [];
          }

          return ((data ?? []) as any[]).map((row: any) => ({
            opponentName: row.opponent_name || '',
            opponentSlug: row.opponent_slug || '',
            wins: Number(row.wins) || 0,
            losses: Number(row.losses) || 0,
            ties: Number(row.ties) || 0,
            totalGames: Number(row.total_games) || 0,
            lastResult: row.last_meeting_date ? {
              date: row.last_meeting_date,
              homeScore: row.last_home_score || 0,
              awayScore: row.last_away_score || 0,
              isHome: row.last_is_home || false,
            } : undefined,
          }));
        }, { maxRetries: 2, baseDelay: 500 });
      },
      [],
      'DATA_SCHOOL_RIVALRIES',
      { schoolId, sportId }
    );
  }
);
```

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260402120000_get_school_rivalries.sql src/lib/data/rivalries.ts
git commit -m "feat: add school rivalries DB function and query"
```

---

## Task 4: Sport Data API Route (Lazy Loading)

**Files:**
- Create: `src/app/api/schools/[slug]/sport-data/route.ts`

- [ ] **Step 1: Create the API route**

Follow existing API patterns (requestId, ApiResponse, Cache-Control, captureError):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/data/common';
import { captureError } from '@/lib/error-tracking';
import { getCurrentSeasonLabel } from '@/lib/sports';
import {
  getSchoolRoster,
  getSchoolStatLeaders,
  getSchoolGamesWithStats,
  getSchoolRecords,
} from '@/lib/data/school-hub';
import { getSchoolRivalries } from '@/lib/data/rivalries';

const VALID_SPORTS = ['football', 'basketball', 'baseball', 'soccer', 'lacrosse', 'wrestling', 'track', 'cross-country'];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const sport = searchParams.get('sport')?.toLowerCase();
    const season = searchParams.get('season') || getCurrentSeasonLabel();

    if (!sport || !VALID_SPORTS.includes(sport)) {
      return NextResponse.json({ success: false, error: 'Invalid sport parameter' }, { status: 400 });
    }

    // Look up school ID from slug
    const supabase = await createClient();
    const { data: school } = await supabase
      .from('schools')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!school) {
      return NextResponse.json({ success: false, error: 'School not found' }, { status: 404 });
    }

    // Fetch all sport-specific data in parallel
    const [roster, statLeaders, games, rivalries] = await Promise.all([
      getSchoolRoster(school.id, sport, season),
      getSchoolStatLeaders(school.id, sport, season),
      getSchoolGamesWithStats(school.id, sport, season),
      getSchoolRivalries(school.id, sport),
    ]);

    return NextResponse.json({
      success: true,
      data: { roster, statLeaders, games, rivalries },
      meta: { sport, season, timestamp: new Date().toISOString(), request_id: requestId },
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=600, stale-while-revalidate=3600',
        'x-request-id': requestId,
      },
    });
  } catch (error) {
    captureError(error, { endpoint: 'schools/sport-data', requestId, method: 'GET' });
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500, headers: { 'x-request-id': requestId } }
    );
  }
}
```

- [ ] **Step 2: Verify API route works**

Run dev server. Test: `curl http://localhost:3000/api/schools/st-josephs-prep/sport-data?sport=football`
Expected: JSON with `{ success: true, data: { roster: [...], statLeaders: [...], games: [...], rivalries: [...] } }`

- [ ] **Step 3: Commit**

```bash
git add src/app/api/schools/\[slug\]/sport-data/route.ts
git commit -m "feat: add sport-data API route for lazy-loaded school tab data"
```

---

## Task 5: Tab Shell Components (SchoolTabHub + Tab Content Wrappers)

**Files:**
- Create: `src/components/school/SchoolTabHub.tsx`
- Create: `src/components/school/OverviewTab.tsx`
- Create: `src/components/school/LegacyTab.tsx`
- Create: `src/components/school/SportTab.tsx`

- [ ] **Step 1: Create `SchoolTabHub.tsx` — client component for tab management**

```typescript
'use client';

import { useState, useEffect } from 'react';
import TabGroup from '@/components/ui/TabGroup';
import OverviewTab from './OverviewTab';
import SportTab from './SportTab';
import LegacyTab from './LegacyTab';
// Import all needed types from school-hub.ts

interface SchoolTabHubProps {
  school: SchoolHubData;
  sports: SchoolSportStats[];
  // Overview data (server-fetched)
  currentSeasons: CurrentSeasonInfo[];
  recentGames: SchoolGame[];
  // Legacy data (server-fetched)
  championships: SchoolChampionshipData[];
  nextLevel: NextLevelAthlete[];
  coaches: SchoolCoach[];
  awards: SchoolAward[];
  recentSeasons: RecentSeasonData[];
  records: SchoolRecord[];
}

export default function SchoolTabHub(props: SchoolTabHubProps) {
  const { school, sports } = props;

  // Build tab list: Overview + sports + Legacy
  const tabs = [
    { key: 'overview', label: 'Overview' },
    ...sports.filter(s => s.season_count > 0).map(s => ({
      key: s.sport_id,
      label: `${s.sport_emoji || ''} ${s.sport_name}`.trim(),
    })),
    { key: 'legacy', label: 'Legacy' },
  ];

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      <div className="sticky top-[60px] z-20 bg-white border-b border-[var(--psp-gray-200)] -mx-4 px-4 py-2">
        <TabGroup tabs={tabs} defaultTab="overview" onChange={setActiveTab} variant="pills" />
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <OverviewTab
            school={school}
            sports={sports}
            currentSeasons={props.currentSeasons}
            recentGames={props.recentGames}
          />
        )}
        {activeTab === 'legacy' && (
          <LegacyTab
            school={school}
            championships={props.championships}
            nextLevel={props.nextLevel}
            coaches={props.coaches}
            awards={props.awards}
            recentSeasons={props.recentSeasons}
            records={props.records}
          />
        )}
        {activeTab !== 'overview' && activeTab !== 'legacy' && (
          <SportTab
            school={school}
            sportId={activeTab}
            sportName={sports.find(s => s.sport_id === activeTab)?.sport_name || activeTab}
            currentSeason={props.currentSeasons.find(s => s.sport_id === activeTab)}
            championships={props.championships.filter(c => c.sport_id === activeTab)}
            recentSeasons={props.recentSeasons.filter(s => s.sport_id === activeTab)}
            awards={props.awards.filter(a => a.sport_id === activeTab)}
            coaches={props.coaches.filter(c => c.sport_id === activeTab)}
          />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `OverviewTab.tsx`**

Extract the existing Overview sections from `page.tsx`: "This Season" banner, sport program cards, recent results. Move them into this component. Keep the same JSX but receive data via props instead of page-level variables.

Key sections to extract from current page.tsx:
- Sport program cards grid (lines ~381-447)
- Upcoming schedule banner (lines ~340-361)
- Recent results table (lines ~565-628) — with the B1/B2 fixes applied

Plus the NEW `ThisSeasonBanner` component.

- [ ] **Step 3: Create `LegacyTab.tsx`**

Extract from `page.tsx`: championships section, coaching staff, season history, awards, next-level alumni. Add the `SchoolRecordsSection` component.

Key sections to move:
- Championships (lines ~449-505)
- Coaching Staff (lines ~507-563) — add `record_wins/losses` display
- Season History (lines ~630-690)
- Awards (lines ~692-764)
- Next Level Alumni (lines ~766-845) — with B3 name normalization

- [ ] **Step 4: Create `SportTab.tsx` with lazy loading**

```typescript
'use client';

import { useState, useEffect } from 'react';
import SchoolRoster from './SchoolRoster';
import StatLeadersCard from './StatLeadersCard';
import TeamGameLog from './TeamGameLog';
import RivalryRecord from './RivalryRecord';
import SeasonHistoryTable from './SeasonHistoryTable';
// ... more imports

interface SportTabProps {
  school: SchoolHubData;
  sportId: string;
  sportName: string;
  currentSeason?: CurrentSeasonInfo;
  championships: SchoolChampionshipData[];
  recentSeasons: RecentSeasonData[];
  awards: SchoolAward[];
  coaches: SchoolCoach[];
}

export default function SportTab(props: SportTabProps) {
  const { school, sportId, currentSeason } = props;
  const [sportData, setSportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/schools/${school.slug}/sport-data?sport=${sportId}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setSportData(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [school.slug, sportId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Skeleton loaders */}
        {[1,2,3].map(i => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Season Spotlight */}
      {currentSeason && (
        <div className="rounded-lg border p-4 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bebas text-xl">{currentSeason.season_label} Season</h3>
            <span className="font-bold text-lg" style={{ color: 'var(--psp-navy)' }}>
              {currentSeason.wins}-{currentSeason.losses}{currentSeason.ties > 0 ? `-${currentSeason.ties}` : ''}
            </span>
          </div>
          {currentSeason.next_game && (
            <p className="text-sm text-gray-500 mt-1">
              Next: {currentSeason.next_game.is_home ? 'vs' : '@'} {currentSeason.next_game.opponent_name} — {new Date(currentSeason.next_game.game_date).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Roster */}
      {sportData?.roster?.length > 0 && (
        <section>
          <h3 className="font-bebas text-xl mb-3">Roster ({sportData.roster.length})</h3>
          <SchoolRoster players={sportData.roster} sport={sportId} />
        </section>
      )}

      {/* Stat Leaders */}
      {sportData?.statLeaders?.length > 0 && (
        <section>
          <h3 className="font-bebas text-xl mb-3">Season Leaders</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sportData.statLeaders.map((cat: any) => (
              <StatLeadersCard key={cat.category} title={cat.category} leaders={cat.leaders} sport={sportId} />
            ))}
          </div>
        </section>
      )}

      {/* Game Results + Box Scores */}
      {sportData?.games?.length > 0 && (
        <section>
          <h3 className="font-bebas text-xl mb-3">Game Results</h3>
          <TeamGameLog games={sportData.games} schoolId={school.id} sport={sportId} />
        </section>
      )}

      {/* Rivalries */}
      {sportData?.rivalries?.length > 0 && (
        <section>
          <h3 className="font-bebas text-xl mb-3">Rivals</h3>
          <RivalryRecord rivalries={sportData.rivalries} sport={sportId} schoolName={school.name} />
        </section>
      )}

      {/* Season History (from server data, filtered) */}
      {props.recentSeasons.length > 0 && (/* existing SeasonHistoryTable */)}

      {/* Awards (from server data, filtered) */}
      {props.awards.length > 0 && (/* existing awards table */)}

      {/* Championships (from server data, filtered) */}
      {props.championships.length > 0 && (/* existing championship badges */)}
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/school/SchoolTabHub.tsx src/components/school/OverviewTab.tsx src/components/school/LegacyTab.tsx src/components/school/SportTab.tsx
git commit -m "feat: add school tab hub with overview, sport, and legacy tabs"
```

---

## Task 6: New Display Components

**Files:**
- Create: `src/components/school/ThisSeasonBanner.tsx`
- Create: `src/components/school/SchoolRoster.tsx`
- Create: `src/components/school/StatLeadersCard.tsx`
- Create: `src/components/school/TeamGameLog.tsx`
- Create: `src/components/school/SchoolRecordsSection.tsx`

- [ ] **Step 1: Create `ThisSeasonBanner.tsx`**

Shows current season records per sport with next game info. Used in OverviewTab.

```typescript
import Link from 'next/link';
import { SPORT_META } from '@/lib/sports';
import type { CurrentSeasonInfo } from '@/lib/data/school-hub';

interface Props {
  seasons: CurrentSeasonInfo[];
  schoolSlug: string;
}

export default function ThisSeasonBanner({ seasons, schoolSlug }: Props) {
  if (!seasons || seasons.length === 0) return null;

  return (
    <div className="rounded-lg border border-[var(--psp-gray-200)] bg-white overflow-hidden">
      <div className="px-4 py-2 bg-[var(--psp-navy)]">
        <h2 className="font-bebas text-lg text-white tracking-wide">This Season</h2>
      </div>
      <div className="divide-y divide-[var(--psp-gray-200)]">
        {seasons.map((s) => {
          const meta = SPORT_META[s.sport_id];
          return (
            <div key={s.sport_id} className="px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <span>{meta?.emoji || ''}</span>
                <span className="font-semibold text-sm truncate">{s.sport_name}</span>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="font-bold text-sm" style={{ color: 'var(--psp-navy)' }}>
                  {s.wins}-{s.losses}{s.ties > 0 ? `-${s.ties}` : ''}
                </span>
                {s.next_game ? (
                  <span className="text-xs text-gray-500">
                    Next: {s.next_game.is_home ? 'vs' : '@'} {s.next_game.opponent_name}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Season Complete</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `SchoolRoster.tsx`**

Groups players by position with grad year → class conversion.

```typescript
import Link from 'next/link';
import type { SchoolRosterPlayer } from '@/lib/data/school-hub';

interface Props {
  players: SchoolRosterPlayer[];
  sport: string;
}

const POSITION_GROUPS: Record<string, Record<string, string[]>> = {
  football: { Offense: ['QB','RB','WR','OL','TE','OT','OG','C'], Defense: ['DL','LB','DB','S','CB','DE','DT'], 'Special Teams': ['K','P','LS'] },
  basketball: { Guards: ['PG','SG','G'], Forwards: ['SF','PF','F'], Centers: ['C'] },
  baseball: { Infield: ['C','1B','2B','SS','3B'], Outfield: ['LF','CF','RF','OF'], Pitchers: ['P','SP','RP'] },
};

function gradYearToClass(gradYear: number | null): string {
  if (!gradYear) return '';
  const currentYear = new Date().getFullYear();
  const month = new Date().getMonth();
  const seniorYear = month < 7 ? currentYear : currentYear + 1;
  const diff = gradYear - seniorYear;
  if (diff <= 0) return 'Sr';
  if (diff === 1) return 'Jr';
  if (diff === 2) return 'So';
  if (diff === 3) return 'Fr';
  return `'${String(gradYear).slice(2)}`;
}

function getPositionGroup(position: string, sport: string): string {
  const groups = POSITION_GROUPS[sport] || {};
  for (const [group, positions] of Object.entries(groups)) {
    if (positions.includes(position.toUpperCase())) return group;
  }
  return 'Other';
}

export default function SchoolRoster({ players, sport }: Props) {
  // Group by position
  const grouped = new Map<string, SchoolRosterPlayer[]>();
  for (const player of players) {
    const pos = player.positions[0] || 'Unknown';
    const group = getPositionGroup(pos, sport);
    if (!grouped.has(group)) grouped.set(group, []);
    grouped.get(group)!.push(player);
  }

  return (
    <div className="space-y-4">
      {Array.from(grouped.entries()).map(([group, groupPlayers]) => (
        <div key={group}>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 px-1">{group}</h4>
          <div className="rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Name</th>
                  <th className="text-left px-3 py-2 font-medium">Pos</th>
                  <th className="text-center px-3 py-2 font-medium hidden sm:table-cell">Class</th>
                  <th className="text-center px-3 py-2 font-medium hidden md:table-cell">Ht</th>
                  <th className="text-center px-3 py-2 font-medium hidden md:table-cell">Wt</th>
                  <th className="text-right px-3 py-2 font-medium">GP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--psp-gray-200)]">
                {groupPlayers.map((p) => (
                  <tr key={p.player_id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      {p.player_slug ? (
                        <Link href={`/${sport}/players/${p.player_slug}`} className="hover:underline" style={{ color: 'var(--psp-blue)' }}>
                          {p.player_name}
                        </Link>
                      ) : p.player_name}
                    </td>
                    <td className="px-3 py-2 text-gray-600">{p.positions[0] || '—'}</td>
                    <td className="px-3 py-2 text-center text-gray-600 hidden sm:table-cell">{gradYearToClass(p.graduation_year)}</td>
                    <td className="px-3 py-2 text-center text-gray-500 hidden md:table-cell">{p.height || '—'}</td>
                    <td className="px-3 py-2 text-center text-gray-500 hidden md:table-cell">{p.weight || '—'}</td>
                    <td className="px-3 py-2 text-right">{p.games_played ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create `StatLeadersCard.tsx`**

```typescript
import Link from 'next/link';
import type { StatLeaderEntry } from '@/lib/data/school-hub';

interface Props {
  title: string;
  leaders: StatLeaderEntry[];
  sport: string;
}

export default function StatLeadersCard({ title, leaders, sport }: Props) {
  if (!leaders || leaders.length === 0) return null;

  return (
    <div className="rounded-lg border border-[var(--psp-gray-200)] bg-white overflow-hidden">
      <div className="px-4 py-2 bg-gray-50 border-b border-[var(--psp-gray-200)]">
        <h4 className="font-semibold text-sm" style={{ color: 'var(--psp-navy)' }}>{title}</h4>
      </div>
      <div className="divide-y divide-[var(--psp-gray-100)]">
        {leaders.map((leader, idx) => (
          <div key={leader.player_slug || idx} className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`text-xs font-bold w-5 ${idx < 3 ? 'text-[var(--psp-gold)]' : 'text-gray-400'}`}>
                {idx + 1}
              </span>
              {leader.player_slug ? (
                <Link href={`/${sport}/players/${leader.player_slug}`} className="text-sm hover:underline truncate" style={{ color: 'var(--psp-blue)' }}>
                  {leader.player_name}
                </Link>
              ) : (
                <span className="text-sm truncate">{leader.player_name}</span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-bold text-sm" style={{ color: 'var(--psp-navy)' }}>
                {typeof leader.value === 'number' && leader.value < 1 ? leader.value.toFixed(3) : leader.value}
              </span>
              {leader.games_played && (
                <span className="text-xs text-gray-400">{leader.games_played}g</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `TeamGameLog.tsx`**

```typescript
'use client';

import { useState } from 'react';
import Link from 'next/link';
import BoxScoreIndicator from '@/components/schedule/BoxScoreIndicator';
import type { GameWithBoxScore } from '@/lib/data/school-hub';

interface Props {
  games: GameWithBoxScore[];
  schoolId: number;
  sport: string;
}

export default function TeamGameLog({ games, schoolId, sport }: Props) {
  const [expandedGameId, setExpandedGameId] = useState<number | null>(null);

  return (
    <div className="rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
      {games.map((game) => {
        const isHome = game.home_school_id === schoolId;
        const schoolScore = isHome ? game.home_score : game.away_score;
        const oppScore = isHome ? game.away_score : game.home_score;
        const oppName = isHome ? game.away_school_name : game.home_school_name;
        const oppSlug = isHome ? game.away_school_slug : game.home_school_slug;
        const result = schoolScore != null && oppScore != null
          ? schoolScore > oppScore ? 'W' : schoolScore < oppScore ? 'L' : 'T'
          : null;
        const hasStats = game.player_stats.length > 0;
        const isExpanded = expandedGameId === game.game_id;

        return (
          <div key={game.game_id} className="border-b border-[var(--psp-gray-200)] last:border-b-0">
            {/* Game row */}
            <button
              onClick={() => hasStats && setExpandedGameId(isExpanded ? null : game.game_id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 text-left"
              disabled={!hasStats}
            >
              <div className="flex items-center gap-3 min-w-0">
                {result && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    result === 'W' ? 'bg-green-100 text-green-700' :
                    result === 'L' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{result}</span>
                )}
                <span className="text-sm text-gray-500">{isHome ? 'vs' : '@'}</span>
                <Link href={`/schools/${oppSlug}`} className="text-sm font-medium hover:underline" style={{ color: 'var(--psp-blue)' }} onClick={(e) => e.stopPropagation()}>
                  {oppName}
                </Link>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-bold text-sm" style={{ color: 'var(--psp-navy)' }}>
                  {schoolScore}-{oppScore}
                </span>
                {hasStats && (
                  <span className="text-xs text-gray-400">{isExpanded ? '▲' : '▼'}</span>
                )}
                <BoxScoreIndicator gameId={game.game_id} sport={sport} compact />
                {game.game_date && (
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    {new Date(game.game_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </button>

            {/* Expanded box score */}
            {isExpanded && hasStats && (
              <div className="px-4 pb-4 bg-gray-50">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="text-left py-1 font-medium">Player</th>
                      {sport === 'football' ? (
                        <>
                          <th className="text-right py-1 font-medium">Rush</th>
                          <th className="text-right py-1 font-medium">Pass</th>
                          <th className="text-right py-1 font-medium">Rec</th>
                          <th className="text-right py-1 font-medium">TD</th>
                        </>
                      ) : (
                        <>
                          <th className="text-right py-1 font-medium">Pts</th>
                          <th className="text-right py-1 font-medium">Reb</th>
                          <th className="text-right py-1 font-medium">Ast</th>
                          <th className="text-right py-1 font-medium">Stl</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {game.player_stats.map((ps, idx) => (
                      <tr key={idx}>
                        <td className="py-1">
                          {ps.player_slug ? (
                            <Link href={`/${sport}/players/${ps.player_slug}`} className="hover:underline" style={{ color: 'var(--psp-blue)' }}>
                              {ps.player_name}
                            </Link>
                          ) : ps.player_name}
                        </td>
                        {sport === 'football' ? (
                          <>
                            <td className="text-right py-1">{ps.rush_yards || '—'}</td>
                            <td className="text-right py-1">{ps.pass_yards || '—'}</td>
                            <td className="text-right py-1">{ps.rec_yards || '—'}</td>
                            <td className="text-right py-1 font-bold">{ps.total_td || '—'}</td>
                          </>
                        ) : (
                          <>
                            <td className="text-right py-1 font-bold">{ps.bb_points || '—'}</td>
                            <td className="text-right py-1">{ps.rebounds || '—'}</td>
                            <td className="text-right py-1">{ps.assists || '—'}</td>
                            <td className="text-right py-1">{ps.steals || '—'}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 5: Create `SchoolRecordsSection.tsx`**

```typescript
import Link from 'next/link';
import type { SchoolRecord } from '@/lib/data/school-hub';

interface Props {
  records: SchoolRecord[];
}

export default function SchoolRecordsSection({ records }: Props) {
  if (!records || records.length === 0) return null;

  // Group by sport, then by category
  const bySport = new Map<string, Map<string, SchoolRecord[]>>();
  for (const r of records) {
    const sport = r.sport_name || 'General';
    if (!bySport.has(sport)) bySport.set(sport, new Map());
    const sportMap = bySport.get(sport)!;
    const cat = r.category || 'Other';
    if (!sportMap.has(cat)) sportMap.set(cat, []);
    sportMap.get(cat)!.push(r);
  }

  return (
    <div className="space-y-6">
      {Array.from(bySport.entries()).map(([sport, categories]) => (
        <div key={sport}>
          <h3 className="font-bebas text-lg mb-2" style={{ color: 'var(--psp-navy)' }}>{sport}</h3>
          {Array.from(categories.entries()).map(([category, catRecords]) => (
            <div key={category} className="mb-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">{category}</h4>
              <div className="rounded-lg border border-[var(--psp-gray-200)] overflow-hidden">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-[var(--psp-gray-100)]">
                    {catRecords.map((r) => (
                      <tr key={r.id}>
                        <td className="px-3 py-2 text-gray-600">{r.description || r.subcategory || '—'}</td>
                        <td className="px-3 py-2 font-bold text-right" style={{ color: 'var(--psp-navy)' }}>
                          {r.record_value || r.record_number || '—'}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {r.player_slug ? (
                            <Link href={`/${r.sport_name?.toLowerCase() || 'football'}/players/${r.player_slug}`} className="hover:underline text-sm" style={{ color: 'var(--psp-blue)' }}>
                              {r.holder_name || r.player_name}
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-500">{r.holder_name || '—'}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right text-xs text-gray-400 hidden sm:table-cell">
                          {r.year_set || r.season_label || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/school/ThisSeasonBanner.tsx src/components/school/SchoolRoster.tsx src/components/school/StatLeadersCard.tsx src/components/school/TeamGameLog.tsx src/components/school/SchoolRecordsSection.tsx
git commit -m "feat: add roster, stat leaders, game log, records components"
```

---

## Task 7: Page Decomposition — Rewire page.tsx

**Files:**
- Modify: `src/app/schools/[slug]/page.tsx` (major refactor: 1002 → ~250 lines)

This is the keystone task. The current page has all 10 sections inline. After this task, it renders: hero → SchoolTabHub (which delegates to tab components).

- [ ] **Step 1: Add new data fetches to `Promise.allSettled`**

Add `getSchoolCurrentSeasons` and `getSchoolRecords` to the existing parallel fetch block. Update the destructuring to extract results.

- [ ] **Step 2: Remove sections that moved to tabs**

Delete the inline JSX for: sport program cards, championship section, coaching staff, recent results, season history, awards, next level alumni. These now live in OverviewTab, SportTab, and LegacyTab respectively.

- [ ] **Step 3: Add `SchoolTabHub` component**

After the hero section, render:
```tsx
<SchoolTabHub
  school={school}
  sports={sportsStats}
  currentSeasons={currentSeasons}
  recentGames={recentGames}
  championships={championships}
  nextLevel={sortedNextLevel}
  coaches={coaches}
  awards={awards}
  recentSeasons={recentSeasons}
  records={records}
/>
```

- [ ] **Step 4: Remove `SchoolSportTabs` import and usage**

Remove the import of `SchoolSportTabs` and its JSX. The tab navigation is now handled by `SchoolTabHub` → `TabGroup`.

- [ ] **Step 5: Keep sidebar intact**

The sidebar (school info card, quick links, related articles, PSP promo) stays in page.tsx. It sits alongside the main content area which now contains hero + SchoolTabHub.

- [ ] **Step 6: Verify locally**

Run dev server. Navigate to `/schools/st-josephs-prep`.
- Overview tab: sport cards, this season banner, recent results (no TBD, correct W/L)
- Football tab: roster loads (lazy), stat leaders, game results with expandable box scores, rivalry cards
- Legacy tab: championships, alumni (normalized names), coaching records, school records
- Mobile: tabs scroll horizontally, tables responsive

- [ ] **Step 7: Commit**

```bash
git add src/app/schools/\[slug\]/page.tsx
git commit -m "feat: decompose school page into tabbed hub architecture"
```

---

## Task 8: Final Verification and Push

- [ ] **Step 1: Full page test on dev server**

Test schools with different data profiles:
- `/schools/st-josephs-prep` — rich data, many sports, many alumni
- `/schools/roman-catholic` — PCL rival, should appear in Prep's rivalries
- A school with only 1 sport (e.g., search for a small school)
- A school with no box score data — verify empty states

- [ ] **Step 2: Verify corrupted data handling**

Per project memory: 30,783 box score rows (37%) have wrong game assignments. Check that expanded box scores show reasonable data — player stats should match the school playing in the game. If stats look wrong (players from wrong school), add a filter:
```typescript
// In getSchoolGamesWithStats, add school_id filter on stats query
.eq('school_id', schoolId)  // Already in the spec — verify it's implemented
```

- [ ] **Step 3: Mobile test at 375px**

Use browser dev tools to test responsive layout:
- Tabs scroll horizontally
- Tables hide less-important columns
- Game log readable
- Roster groups collapsed properly

- [ ] **Step 4: Push to production**

```bash
git push origin main
```

Wait ~90s for Vercel auto-deploy. Verify on production: `https://www.phillysportspack.com/schools/st-josephs-prep`

- [ ] **Step 5: Spot-check 3 more schools on production**

Verify the template works across different schools, not just Prep.
