# Materialized Views

This document describes all materialized views in the PhillySportsPack database, when they should be refreshed, and how to refresh them.

## Overview

Materialized views are pre-computed query results stored as tables. They improve performance by avoiding expensive joins and aggregations on every request, but require periodic refresh to stay current.

## Materialized Views

### 1. `football_career_leaders`

**Purpose:** Aggregated career statistics for football players across all seasons. Used for career leaderboards and records.

**Columns:**
- `player_id` (UUID)
- `player_name` (text)
- `school_id` (UUID)
- `school_name` (text)
- `positions` (text array)
- `career_passing_yards` (int)
- `career_passing_tds` (int)
- `career_rushing_yards` (int)
- `career_rushing_tds` (int)
- `career_receiving_yards` (int)
- `career_receiving_tds` (int)
- `career_points` (int)
- `seasons_played` (int)
- `last_season_year` (text)

**Refresh Schedule:** Every 6 hours (or after bulk imports/corrections)

**Why:** Football career stats are frequently queried for leaderboards and player profiles. Refreshing every 6 hours balances freshness with query performance.

### 2. `basketball_career_leaders`

**Purpose:** Aggregated career statistics for basketball players across all seasons. Used for career leaderboards and records.

**Columns:**
- `player_id` (UUID)
- `player_name` (text)
- `school_id` (UUID)
- `school_name` (text)
- `positions` (text array)
- `career_points` (int)
- `career_rebounds` (int)
- `career_assists` (int)
- `career_ppg` (numeric)
- `seasons_played` (int)
- `last_season_year` (text)

**Refresh Schedule:** Every 6 hours (or after bulk imports/corrections)

**Why:** Basketball career stats are frequently queried for leaderboards and player profiles. Refreshing every 6 hours balances freshness with query performance.

### 3. `season_leaderboards`

**Purpose:** Per-season leaderboards for football and basketball stats. Used on season-specific leaderboard pages.

**Columns:**
- `season_id` (UUID)
- `season_label` (text)
- `sport_id` (UUID)
- `sport_name` (text)
- `stat_type` (text, e.g. "passing_yards", "points_per_game")
- `rank` (int)
- `player_id` (UUID)
- `player_name` (text)
- `school_id` (UUID)
- `school_name` (text)
- `stat_value` (numeric)

**Refresh Schedule:** Every 4 hours (or after game results are imported)

**Why:** Season leaderboards change as games are added/updated. Refreshing every 4 hours keeps them current without excessive computation.

## How to Refresh

### Option 1: Manual SQL (one-time)

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY football_career_leaders;
REFRESH MATERIALIZED VIEW CONCURRENTLY basketball_career_leaders;
REFRESH MATERIALIZED VIEW CONCURRENTLY season_leaderboards;
```

The `CONCURRENTLY` keyword allows queries to continue while the view refreshes (requires a unique index on the view). Without it, the view is locked.

### Option 2: SQL Function (multiple views)

Call the `refresh_all_materialized_views()` function:

```sql
SELECT refresh_all_materialized_views();
```

This is the preferred method for automated refreshes.

### Option 3: Edge Function (from Next.js)

Call the `refresh-views` Edge Function (if deployed):

```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/refresh-views \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"views": ["football_career_leaders", "basketball_career_leaders", "season_leaderboards"]}'
```

## Automated Refresh Schedule

### Recommendation for Production

Use Supabase's `pg_cron` extension to schedule automatic refreshes:

```sql
-- Enable pg_cron (requires superuser)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Refresh career leaders every 6 hours
SELECT cron.schedule('refresh_football_leaders', '0 */6 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY football_career_leaders');
SELECT cron.schedule('refresh_basketball_leaders', '0 */6 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY basketball_career_leaders');

-- Refresh season leaderboards every 4 hours
SELECT cron.schedule('refresh_season_leaderboards', '0 */4 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY season_leaderboards');
```

Or use a cron service external to Supabase (e.g., GitHub Actions, EasyCron) to call the SQL function periodically.

### Current Implementation

As of 2026-03-12, automated refresh is **NOT YET CONFIGURED**. See setup instructions above.

## Monitoring

### Check View Age

```sql
SELECT
  matviewname,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||matviewname)) AS size
FROM pg_matviews
WHERE schemaname = 'public'
ORDER BY matviewname;
```

### Check Refresh Progress

```sql
SELECT
  pid,
  query,
  query_start,
  state
FROM pg_stat_activity
WHERE query ILIKE '%REFRESH MATERIALIZED%';
```

## Performance Considerations

- **Index on views:** Ensure `CONCURRENTLY` works by creating unique indexes:
  ```sql
  CREATE UNIQUE INDEX idx_football_leaders_player ON football_career_leaders(player_id);
  CREATE UNIQUE INDEX idx_basketball_leaders_player ON basketball_career_leaders(player_id);
  CREATE UNIQUE INDEX idx_season_leaderboards_composite ON season_leaderboards(season_id, sport_id, stat_type, player_id);
  ```

- **Lock contention:** Without `CONCURRENTLY`, views lock and queries may time out. Always use `CONCURRENTLY`.

- **Refresh time:** Career leader views typically take 2-5 seconds. Season leaderboards take 1-2 seconds.

- **Stale data:** Until a refresh completes, the view returns old data. Plan refreshes during low-traffic windows if freshness is critical.

## Troubleshooting

**View doesn't exist:**
Check schema.sql or supabase/migrations for CREATE MATERIALIZED VIEW statements. Re-run migrations if missing.

**CONCURRENTLY fails with "could not create unique index":**
The view needs a unique index. Run the index creation commands above.

**Refresh takes >10 seconds:**
Check database load and query performance. May need to add indexes on source tables or optimize the view query.

**Stale data in app:**
Clear Next.js ISR cache by revalidating paths:
```typescript
revalidateTag('football-leaderboard');
revalidateTag('basketball-leaderboard');
```
