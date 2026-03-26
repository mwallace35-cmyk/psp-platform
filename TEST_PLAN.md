# PSP Testing Strategy & Plan

**Date:** March 26, 2026
**Current State:** 84 Vitest + 7 Playwright tests
**Critical Gap:** 46/48 data modules (96%) untested

---

## Gap Analysis

### What's Covered ✅
| Area | Tests | Coverage |
|------|-------|----------|
| UI Components | 47 component tests + 6 snapshots | Good — Badge, Button, Card, DataTable, etc. |
| Library Utils | 22 unit tests | Good — crypto, CSRF, sanitize, validation, rate limiting |
| Layout | 2 tests | Header, Footer |
| SEO | 3 tests + 1 E2E | JSON-LD schemas, meta tags |
| Accessibility | 2 unit + 1 E2E | axe-core audits |
| Integration | 4 tests | Mock data layer, form submission |
| E2E | 7 Playwright | Navigation, search, forms, API, performance, a11y |

### What's NOT Covered ❌
| Area | Risk | Files |
|------|------|-------|
| **Data Layer** (46 modules) | **CRITICAL** — any schema change or query bug = 500 on production | `src/lib/data/*.ts` |
| **Page Rendering** (101+ pages) | **HIGH** — null reference = white screen | `src/app/**/page.tsx` |
| **Championship Labels** (15 patterns) | **MEDIUM** — wrong label = incorrect display | `getTypeConfig()` in championships page |
| **School Disambiguation** | **MEDIUM** — "Central" vs "Central Catholic" | `src/lib/utils/schoolDisplayName.ts` |
| **Player Matching** | **MEDIUM** — wrong match = data on wrong player | Name matching in scrape scripts |
| **Box Score Parsing** | **LOW** — one-time imports, already verified | PDF/HTML parsers |

---

## 3-Tier Test Plan

### Tier 1 — Critical (Add Now, 10 tests)

These tests prevent production outages. Each validates a critical query returns the right shape.

```
src/__tests__/data/
├── players.test.ts       — getPlayerBySlug returns player with seasons
├── schools.test.ts       — getSchoolBySlug returns school with logo, league
├── games.test.ts         — getGameBoxScore returns box score with stats_json
├── standings.test.ts     — getLeagueStandings returns divisions for football
├── championships.test.ts — getChampionshipsBySport returns all types
├── playoffs.test.ts      — getPlayoffBracketsBySeason returns games with teams
├── game-log.test.ts      — getPlayerGameLog returns per-game stats
├── team-stats.test.ts    — getTeamStatLeaders returns leaders for school
├── our-guys.test.ts      — getTrackedAlumni returns with player slugs
└── search.test.ts        — searchAll returns players, schools, games
```

**Pattern**: Each test mocks Supabase client (already have `MockSupabaseClient`), calls the function, asserts return shape matches interface.

**Example test case**:
```typescript
// src/__tests__/data/players.test.ts
describe('getPlayerBySlug', () => {
  it('returns player with football seasons', async () => {
    const result = await getPlayerBySlug('gavin-sidwar-2882');
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
    expect(result?.football_seasons).toBeInstanceOf(Array);
  });

  it('returns null for non-existent slug', async () => {
    const result = await getPlayerBySlug('does-not-exist-99999');
    expect(result).toBeNull();
  });
});
```

### Tier 2 — High Value (Add Next Sprint, 15 tests)

These catch logic bugs in display formatting and data transformation.

```
src/__tests__/
├── utils/
│   ├── championship-labels.test.ts  — all 15 getTypeConfig patterns
│   ├── school-display-name.test.ts  — ambiguous names get "(Philadelphia)"
│   ├── format-championship.test.ts  — formatChampionshipLabel correct labels
│   └── win-pct-color.test.ts        — color thresholds for win percentages
├── data/
│   ├── rivalries.test.ts            — get_top_rivalries RPC excludes self-play
│   ├── dynasty-tracker.test.ts      — null school guards don't crash
│   ├── computed-records.test.ts     — career leaders compute correctly
│   ├── greatest-seasons.test.ts     — ranking logic with JSONB stats
│   └── breakouts.test.ts            — percentage calculation for extreme jumps
├── components/
│   ├── PlayerGameLog.test.tsx       — football vs basketball column rendering
│   ├── TeamSeasonHistory.test.tsx   — era filtering, championship badges
│   ├── SchoolPipelineRanking.test.tsx — grade badges, sort order
│   └── TrajectoryBadge.test.tsx     — overachiever/undrafted_star/met_expectations
└── api/
    ├── did-you-know.test.ts         — returns random fact, respects sport filter
    └── cron-fetch-news.test.ts      — RSS parsing, dedup, cleanup
```

### Tier 3 — Regression (Add as Bugs Found, ongoing)

```
src/__tests__/regression/
├── article-rendering.test.ts  — escaped quotes render correctly
├── standings-season.test.ts   — defaults to current season (not 1984)
├── team-page-pf-pa.test.ts   — PF/PA not showing 0
├── mobile-nav.test.ts         — hidden on desktop viewports
└── score-links.test.ts        — all scores are clickable links
```

**E2E regression** (add to Playwright):
```
e2e/
├── player-profile.spec.ts    — game log tab appears with data
├── team-page.spec.ts         — stats tab shows real data, not placeholders
├── championships.spec.ts     — all types display with correct badges
└── our-guys.spec.ts          — filter bar, trajectory badges, profile links
```

---

## Page Render Smoke Test (Highest ROI)

One test that catches 80% of production issues:

```typescript
// src/__tests__/smoke/page-render.test.ts
const CRITICAL_PAGES = [
  '/', '/football', '/basketball', '/scores',
  '/football/standings', '/basketball/standings',
  '/football/leaderboards', '/basketball/leaderboards',
  '/football/championships', '/basketball/championships',
  '/football/playoffs', '/basketball/playoffs',
  '/football/records', '/basketball/records',
  '/football/schools', '/basketball/schools',
  '/players', '/schools', '/our-guys', '/hof',
  '/articles', '/search', '/about', '/support',
];

describe('Page Smoke Tests', () => {
  CRITICAL_PAGES.forEach(path => {
    it(`${path} renders without 500`, async () => {
      const res = await fetch(`http://localhost:3000${path}`);
      expect(res.status).not.toBe(500);
      expect(res.status).toBeLessThan(500);
    });
  });
});
```

---

## Config Recommendations

### vitest.config.ts — No Changes Needed
Current config is well-structured. The 75% coverage threshold is reasonable.

### playwright.config.ts — Add Retries Locally
Change `retries: process.env.CI ? 2 : 0` to `retries: process.env.CI ? 2 : 1` — local test flakes are common with dev servers.

### package.json — Add Convenience Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:data": "vitest --reporter=verbose src/__tests__/data/",
    "test:smoke": "vitest --reporter=verbose src/__tests__/smoke/",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## Priority Order

| Priority | What | Tests | Effort | Impact |
|----------|------|-------|--------|--------|
| **P0** | Page render smoke test | 1 file, 25 test cases | 30 min | Catches 80% of 500s |
| **P1** | Top 10 data module tests | 10 files | 2-3 hours | Prevents query regressions |
| **P2** | Display formatting tests | 4 files | 1 hour | Catches label/display bugs |
| **P3** | E2E page journeys | 4 Playwright files | 2 hours | Validates user flows |
| **P4** | Regression tests | As bugs found | Ongoing | Prevents repeat issues |
