# PSP War Room Execution Plan
## Strategic Phased Rollout with Parallel Subagents + Verification

---

## Architecture: Agent Roles

### Builder Agents (do the work)
- **DB Agent** — Schema changes, migrations, data fixes
- **Frontend Agent** — Component builds, page redesigns, styling
- **Content Agent** — Auto-generation scripts, content engine
- **Performance Agent** — Caching, query optimization, bundle size

### Verification Agents (check the work)
- **QA Agent** — Route testing, 404 checks, visual verification
- **Data Integrity Agent** — DB constraint validation, row counts, orphan checks
- **Code Review Agent** — TypeScript errors, build checks, best practices

---

## PHASE 0: Emergency Stabilization (30 min)
**Goal:** Site loads fast, deploys succeed, no 404s

### Step 0.1 — Fix Vercel Deploy Failures
- **Builder:** Already done — force-dynamic on heavy pages, reduced static generation
- **Verify:** Confirm latest deploy is READY state, homepage loads <3s

### Step 0.2 — Kill Coming-Soon Gate
- **Builder (Frontend):** Remove/bypass auth gate on homepage route
- **Verify (QA):** Homepage loads without login, all nav links work

### Step 0.3 — Fix Remaining 404s
- **Builder (Frontend):** Audit all nav links, fix broken routes
- **Verify (QA):** Hit every route, confirm 0 404s

**Parallel work:** Steps 0.1-0.3 can run simultaneously (3 agents)

---

## PHASE 1: Database Foundation (1 hour)
**Goal:** Clean schema, proper constraints, flags for data quality

### Step 1.1 — Add `is_estimated` flag to game_player_stats
- **Builder (DB):** `ALTER TABLE game_player_stats ADD COLUMN is_estimated boolean DEFAULT false; UPDATE game_player_stats SET is_estimated = true WHERE source_type = 'season_average';`
- **Verify (Data Integrity):** Count estimated vs actual, confirm 226K flagged

### Step 1.2 — Add `current_season` flag to seasons
- **Builder (DB):** Add column, set current season per sport based on latest year_start
- **Verify (Data Integrity):** Each sport has exactly 1 current season

### Step 1.3 — Add FK constraints on sport_id
- **Builder (DB):** Add FK sport_id → sports.id on all 15+ tables
- **Verify (Data Integrity):** No orphan sport_ids, constraints enforced

### Step 1.4 — Add FK constraints on season_id (consistent)
- **Builder (DB):** Add FK season_id → seasons.id where missing
- **Verify (Data Integrity):** No orphan season_ids

### Step 1.5 — Create materialized views for leaderboards
- **Builder (DB):** `mv_season_leaders` (sport, stat, player, value, rank, percentile)
- **Verify (Data Integrity):** Views refresh in <5s, data matches raw queries

### Step 1.6 — Kill /stats empty gateway page
- **Builder (Frontend):** Redirect /stats → /football/leaderboards (or sport selector)
- **Verify (QA):** /stats no longer shows empty page

**Parallel work:** 1.1-1.4 independent (4 DB agents). 1.5 depends on 1.1-1.4. 1.6 independent.

---

## PHASE 2: Homepage Revolution (2 hours)
**Goal:** Pulse becomes the homepage — daily engagement hub

### Step 2.1 — Redesign Homepage as Enhanced Pulse
- **Builder (Frontend):** New homepage layout:
  1. Breaking/featured headline banner
  2. Today's scores strip
  3. POTW voting spotlight with live counts
  4. Trending players (stat-driven)
  5. Power rankings snapshot
  6. Latest articles (3-4 cards)
  7. Sport hub navigation grid
  8. Stats challenge teaser
- **Verify (QA):** Screenshot every section, check mobile layout, verify data loads

### Step 2.2 — Simplify Navigation
- **Builder (Frontend):** New nav structure:
  ```
  [PSP Logo] [Scores] [Football ▼] [Basketball ▼] [More Sports ▼] [Rankings] [🔍]
  ```
  - Each sport dropdown: Standings, Leaderboards, Schools, Championships, Records
  - Remove "The Pulse" as separate nav item (it IS the homepage)
  - Remove redundant "More" mega-menu
- **Verify (QA):** All nav links resolve, mobile menu works, no dead ends

### Step 2.3 — Build Trending Players Algorithm
- **Builder (DB + Frontend):**
  - Score = (recent_performance / season_avg) × recency + article_mentions × 2 + potw_votes × 3
  - Materialized view refreshed hourly
  - Widget on homepage + sport pages
- **Verify (Data Integrity):** Top 10 per sport makes sense, no obviously wrong rankings

**Parallel work:** 2.1 + 2.2 parallel (different files). 2.3 independent (DB + widget).

---

## PHASE 3: Sport Page Transformation (2 hours)
**Goal:** Each sport page is a mini-Pulse — live hub, not directory

### Step 3.1 — Sport Page Redesign Template
- **Builder (Frontend):** New sport page layout:
  - Hero banner with current season phase indicator
  - This week's featured game
  - Live/recent scores strip
  - Top 3 stat leaders (auto-updated)
  - Power rankings snapshot
  - Recent headlines for this sport
  - Trending players in this sport
  - Next 5 games across all teams
- **Verify (QA):** Check all 7 sport pages render correctly

### Step 3.2 — Season Phase Detection
- **Builder (DB + Frontend):**
  - Compute phase: Preseason → Regular Season → Playoffs → Offseason
  - Phase-appropriate content on sport pages
  - Banner changes by phase
- **Verify (Data Integrity):** Each sport shows correct phase for current date

### Step 3.3 — Weekly Schedule Module
- **Builder (Frontend):** "This Week's Games" component showing next 7 days of games per sport
- **Verify (QA):** Games sorted by date, links to game pages work

**Parallel work:** 3.1 can start immediately. 3.2 + 3.3 independent.

---

## PHASE 4: Stat System Overhaul (3 hours)
**Goal:** Unified stat experience — visual, filterable, class-year aware

### Step 4.1 — Class Year Filter on All Leaderboards
- **Builder (Frontend + DB):** Add graduation_year filter to every leaderboard page
- **Verify (QA):** Filter works, counts change, URL params persist

### Step 4.2 — Position Filter on All Leaderboards
- **Builder (Frontend):** Add position dropdown filter alongside class year
- **Verify (QA):** Position + class year + sport compound filter works

### Step 4.3 — Merge Leaderboard Entry Points
- **Builder (Frontend):** /leaderboards redirects to sport-specific leaderboard with sport selector
- **Verify (QA):** No more dead /leaderboards page, smooth sport switching

### Step 4.4 — Compound Leaderboards
- **Builder (DB + Frontend):**
  - "Dual Threat QBs" (pass + rush yards)
  - "Complete Backs" (rush + rec + TDs)
  - "All-Around Guards" (pts + ast + stl)
- **Verify (Data Integrity):** Compound stats calculate correctly

### Step 4.5 — Record Watch Module
- **Builder (Frontend):** For players approaching records:
  - Current pace vs record pace
  - Games remaining
  - Historical context
- **Verify (QA):** Widget renders on relevant player pages

### Step 4.6 — Stat Benchmarks ("What it takes to be All-City")
- **Builder (DB):** Compute average stats for each award tier by position
- **Builder (Frontend):** Display on leaderboard pages as benchmark lines
- **Verify (Data Integrity):** Benchmarks are reasonable

**Parallel work:** 4.1 + 4.2 parallel. 4.3 independent. 4.4-4.6 independent of each other.

---

## PHASE 5: Auto-Generated Content Engine (3 hours)
**Goal:** Never feel empty — automated content at scale

### Step 5.1 — Weekly Roundup Generator
- **Builder (Content):** Script that runs after each week:
  - Summarizes all games per sport
  - Highlights top performers
  - Updates standings implications
  - Publishes as article with type='auto_roundup'
- **Verify (Data Integrity):** Generated articles have correct stats, proper grammar

### Step 5.2 — Headline Auto-Generator
- **Builder (Content):** After each game result:
  - "{Winner} defeats {Loser} {score}, {Top Performer} leads with {stat}"
  - Store in new `headlines` table
- **Verify (QA):** Headlines appear on homepage/sport pages

### Step 5.3 — Milestone Alert System
- **Builder (Content + DB):**
  - Detect: career points milestones (100, 500, 1000+)
  - Detect: approaching records
  - Generate alert cards
- **Verify (Data Integrity):** Milestones fire for correct players

### Step 5.4 — "By the Numbers" Stat Cards
- **Builder (Content):** Auto-generated shareable stat narratives:
  - Win streaks, scoring streaks, historical comparisons
  - Social-optimized card format
- **Verify (QA):** Cards render, data is accurate

**Parallel work:** All 4 steps independent.

---

## PHASE 6: Engagement & Retention (2 hours)
**Goal:** Give users reasons to come back daily

### Step 6.1 — POTW Voting Promotion
- **Builder (Frontend):** Move POTW to homepage prominent position
  - Live vote counts
  - School-based leaderboard ("Which school's fans vote the most?")
  - Countdown timer to voting close
- **Verify (QA):** Voting works, counts update, leaderboard sorts correctly

### Step 6.2 — Pick'em Revival
- **Builder (Frontend):** Weekly Pick'em on homepage
  - Auto-populated from this week's games
  - Leaderboard for accuracy
- **Verify (QA):** Picks save, leaderboard updates, results auto-grade

### Step 6.3 — "Follow Your School" Onboarding
- **Builder (Frontend):** First-visit modal: "Which schools do you follow?"
  - Stores in my-schools
  - Personalizes Pulse feed
- **Verify (QA):** Selection persists, Pulse shows followed schools first

### Step 6.4 — Share Cards
- **Builder (Frontend):** Social-optimized stat cards (OG images):
  - Player stat cards
  - Game result cards
  - Leaderboard position cards
- **Verify (QA):** OG images render on Twitter/iMessage previews

**Parallel work:** All 4 independent.

---

## PHASE 7: Team & Player Page Polish (2 hours)
**Goal:** Deep, connected, recruiter-ready profiles

### Step 7.1 — Team Page Tabs
- **Builder (Frontend):** Add tab navigation:
  1. Overview (record, upcoming, recent, key players)
  2. Roster (sortable, linked to profiles)
  3. Schedule & Results (with box score links)
  4. Stats (team statistical leaders)
  5. History (season-over-season, championships, notable alumni)
- **Verify (QA):** All tabs load, data is correct

### Step 7.2 — Player Page: Career Trajectory
- **Builder (Frontend):** Line chart of stats by season
  - Overlay league average for comparison
  - "Similar Players" based on statistical similarity
- **Verify (QA):** Chart renders, similar players make sense

### Step 7.3 — Coaching Records
- **Builder (DB + Frontend):** Compute W-L record per coaching stint
  - Display on team page + coach profile
- **Verify (Data Integrity):** Records match team_seasons data

### Step 7.4 — Head-to-Head History
- **Builder (DB + Frontend):** Compute all-time record between any two schools
  - Display on rivalry pages + game pages
- **Verify (Data Integrity):** H2H counts match games table

**Parallel work:** All 4 independent.

---

## PHASE 8: Recruiting & Pipeline (1.5 hours)
**Goal:** Be the Philly-specific layer national sites can't replicate

### Step 8.1 — Recruit Finder Tool
- **Builder (Frontend):** Filterable search:
  - Sport, position, class year, league, minimum stats
  - Results show stat summary + school + awards
- **Verify (QA):** Filters work, results are relevant

### Step 8.2 — Class Year Watch Lists
- **Builder (Frontend):** "Class of 2027" page aggregating top performers
  - Cross-sport
  - Sortable by stat categories
- **Verify (QA):** Page loads, correct class year data

### Step 8.3 — School-to-College Pipeline Drill-Down
- **Builder (Frontend):** Enhanced /pipeline page:
  - "Which schools send most to Big Ten?"
  - "Which position produces most D1 athletes?"
  - Interactive filters
- **Verify (Data Integrity):** Pipeline numbers match next_level_tracking

**Parallel work:** All 3 independent.

---

## Execution Timeline

| Phase | Duration | Agents | Dependencies |
|-------|----------|--------|--------------|
| 0: Stabilization | 30 min | 3 builders + 1 QA | None |
| 1: DB Foundation | 1 hr | 4 DB + 2 verify | None |
| 2: Homepage | 2 hr | 3 builders + 1 QA | Phase 0 |
| 3: Sport Pages | 2 hr | 3 builders + 1 QA | Phase 1 (materialized views) |
| 4: Stat System | 3 hr | 4 builders + 2 verify | Phase 1 |
| 5: Content Engine | 3 hr | 4 builders + 1 verify | Phase 1 |
| 6: Engagement | 2 hr | 4 builders + 1 QA | Phase 2 |
| 7: Team/Player | 2 hr | 4 builders + 2 verify | Phase 1 |
| 8: Recruiting | 1.5 hr | 3 builders + 1 verify | Phase 4 |

**Phases 0+1 first (sequential).** Then **Phases 2-5 in parallel.** Then **Phases 6-8 in parallel.**

**Total estimated: 8-10 hours of wall-clock time** (with parallelization).

---

## Verification Checkpoints

After each phase, a verification agent runs:

1. **Build check:** `npx next build` passes with 0 errors
2. **Route check:** All 90+ routes return 200 (not 404/500)
3. **Visual check:** Screenshot key pages, compare to design intent
4. **Data check:** DB row counts haven't regressed, no orphans
5. **Performance check:** Homepage TTFB <2s, LCP <2.5s

If ANY check fails, the phase is not complete — the builder agent must fix before moving on.

---

## Agent Communication Protocol

- Builder agents write to files and commit to branches
- Verification agents read from production/preview and report pass/fail
- If verification fails, builder agent gets the failure report and iterates
- Phase completion requires ALL verification checks passing
- Code review agent runs after each phase commit before merge
