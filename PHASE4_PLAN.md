# Phase 4: Polish & Navigation Overhaul

**Source:** War Room audit (19 agents, 3,086-line report)
**Goal:** Fix the UX/nav issues that make features undiscoverable, clean up dead code, and improve mobile experience.
**Approach:** Group by theme, batch pushes to minimize Vercel builds.

---

## Push 1: Route Cleanup & Redirects — DONE (April 2)
*Kill dead/duplicate routes, consolidate overlapping features*

- [x] Redirect `/players/[slug]` → `/[sport]/players/[slug]` (detect primary sport from DB)
- [x] Redirect `/standings` → `/football/standings`
- [x] Redirect `/teams` → `/schools`
- [x] Redirect `/stats` and `/stats/season/[year]` → `/football/leaderboards`
- [x] Redirect `/next-level` → `/our-guys` (config redirect, keeps /next-level/[slug])
- [x] Redirect `/philly-everywhere` → `/our-guys`
- [x] Redirect `/pros` → `/our-guys`
- [x] Redirect `/pipeline` → `/recruiting` (already done in Phase 1)
- [x] Redirect `/players/compare` → `/compare` (preserves query params)
- [x] Remove admin link from public footer, add legal links
- [x] Pulse references already cleaned (footer + mobile nav have none)
- [x] Count: 90 page files, 82 real pages (8 are now redirect-only), 27 admin
- [x] Deleted legacy /players/[slug]/opengraph-image.tsx
- [x] Added trailing-slash redirects for all new redirect targets

## Push 2: Mobile Nav Unification — DONE (April 2)
*One menu system, not three*

- [x] Remove hamburger menu from mobile Header (replaced with search icon)
- [x] Expand MobileBottomNav "Menu" sheet with all sections: Sports (pill chips), Quick Links, Explore, Tools, Account, Dark Mode toggle
- [x] Search already in bottom nav (was done previously)
- [x] Add `env(safe-area-inset-bottom)` to bottom nav for notched phones
- [x] Remove hamburger button's invalid `min-height`/`min-width` HTML attributes (removed with hamburger)
- [x] Focus trap added to MobileBottomNav menu/sport dialogs
- [x] Cleaned up Header: removed unused mobile state, refs, focus trap, ThemeToggle import, ALL_SPORTS, EXPLORE_ITEMS
- [ ] Fix footer link touch targets (28px → 44px on mobile) — deferred to Push 7 (accessibility)

## Push 3: Desktop Nav Restructure — DONE (April 2)
*Make features discoverable*

- [x] Promote Rankings + Our Guys to visible top-level nav links
- [x] Rename "More" dropdown → "Tools" with 7 items (Recruiting, Recruit Finder, Compare, Coaches, Pick'em, Stats Challenge, Hall of Fame)
- [x] Remove Schools, Rankings, Our Guys from dropdown (all top-level now)
- [x] Add Rivalries + Position Leaders to Football/Basketball dropdown sub-items
- [x] Add "Our Guys" subheader on homepage sidebar: "Philly alumni in the pros"

## Push 4: Table & Data Display Fixes — DONE (April 2)
*Mobile tables that actually work*

- [x] Add sticky first column (rank + name) to horizontal-scroll tables (DataTable + SortableTable)
- [x] Add right-edge fade gradient on overflow-x-auto containers (psp-scroll-fade class)
- [x] Add mobile card mode to DataTable — skipped (SortableTable already has it, DataTable only used in 3 places)
- [x] Fix EmptyState component: text-navy → text-gray-100 for dark backgrounds
- [x] Fix WinLossBar/StatBlock hardcoded navy text → psp-gray-100 for dark backgrounds

## Push 5: Performance & Bundle — DONE (April 2)
*Ship less JavaScript*

- [x] Remove unused npm packages: `@nivo/bump`, `@nivo/radar` — already gone
- [x] Move `playwright` to devDependencies — already gone
- [x] Add to `optimizePackageImports`: `lucide-react`, `@nivo/*` (4 packages)
- [x] Replace `framer-motion` in SpotlightCard + TickerCrawl with CSS animations → removed framer-motion entirely
- [x] Consolidate duplicate security headers (middleware vs next.config.ts) → middleware only, removed 4 duplicate headers from next.config
- [x] Refactor rate limiting in middleware (5 copy-pasted blocks → 4 helper functions, ~130 lines → ~40)

## Push 6: Cross-linking & Discovery — DONE (April 2)
*Connect the dots between pages*

- [x] Add "All Sports Hub" link on sport-specific school pages → `/schools/[slug]`
- [x] "Compare this player" button already exists on player profiles (line 419)
- [x] Add prev/next game navigation on game detail pages (getAdjacentGames query + nav UI)
- [x] `loading.tsx` already exists for all 5 target route groups (46 total loading files)
- [x] Wire `/players` page: search bar, most-decorated players (awards query), sport grid, leaderboard links

## Push 7: Accessibility Quick Wins — DONE (April 2)
*WCAG fixes from Agent 7*

- [x] Add focus trap to MobileBottomNav dialogs (already done in Push 2)
- [x] Fix `role="button"` on `<tr>` in DataTable/SortableTable (breaks table semantics)
- [x] Add accessible names to ScoreTicker links
- [x] Add pause control to ScoreTicker animation
- [x] Add `aria-label` or `<caption>` to ~15 tables missing them (16 tables across 11 files)
- [x] Associate `<label>` elements with inputs in RecruitFinderClient, PlayerCompare

## Push 8: Query Optimization
*DB-side, no Vercel build needed*

- [ ] Create composite index on `games(sport_id, season_id, game_date)`
- [ ] Create composite indexes on `{sport}_player_seasons(school_id, player_id)`
- [ ] Rewrite `getFootballPositionLeaders` to use `football_career_leaders` table
- [ ] Replace `.select("*")` with explicit columns in awards-hub.ts, social.ts, playoffs.ts
- [ ] Push awards aggregation into SQL (currently fetching 25K rows to count in JS)
- [ ] Drop 14+ unused indexes identified in audit

---

## Success Metrics
- [ ] < 70 total public routes (currently ~90)
- [ ] Single mobile menu system (not 3)
- [ ] 0 unused npm packages in prod deps
- [ ] All tables have accessible names
- [ ] Sticky columns on all mobile data tables
- [ ] Every feature reachable in ≤ 2 clicks from nav

## Rules
- Batch code pushes (each push = Vercel build = $)
- DB-only changes (Push 8) don't need Vercel builds
- Verify on preview before every push
- No estimated/synthetic data — real scraped data only
