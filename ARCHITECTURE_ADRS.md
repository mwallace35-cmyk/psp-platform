# PSP Architecture Decision Records

**Date:** March 26, 2026
**Author:** Engineering Audit
**Status:** All Proposed

---

## Critical Path Map

```
External Sources                    Supabase DB (63 tables)
├─ easternpafootball.com  ──┐      ├─ players (57,473)
├─ aopathletics.org PDFs  ──┤      ├─ games (43,069)
├─ maxpreps.com API       ──┼──→   ├─ game_player_stats (81,808)
├─ tedsilary.com archives ──┤      ├─ football_player_seasons (33,223)
├─ phillyhof.org          ──┘      ├─ basketball_player_seasons (15,558)
                                   ├─ championships (1,727)
   .firecrawl/ JSON files          ├─ playoff_brackets (90)
   (intermediate storage)          └─ next_level_tracking (2,233)
                                          │
                                          ▼
                              src/lib/data/ (47 files, 142 functions)
                              ├─ games.ts (getGameBoxScore, getPlayerGameLog)
                              ├─ schools.ts (getSchoolBySlug, getSchoolTeamSeasons)
                              ├─ standings.ts (getLeagueStandings)
                              ├─ playoffs.ts (getPlayoffBracketsBySeason)
                              ├─ teams.ts (getChampionshipsBySport)
                              └─ ... 42 more
                                          │
                                          ▼
                              src/app/ (238 files, 101+ pages)
                              ├─ [sport]/ (hub, standings, teams, records, ...)
                              ├─ players/[slug]/ (profiles, game logs)
                              ├─ our-guys/ (alumni tracking)
                              ├─ articles/ (CMS)
                              └─ api/ (26 routes)
                                          │
                                          ▼
                                        User
```

---

## ADR-001: Type Safety — Supabase Generated Types

**Status:** Proposed
**Date:** 2026-03-26

### Context
97 `as any` casts exist across 20 files in `src/lib/data/`. Concentrated in: `greatest-seasons.ts` (18), `computed-records.ts` (13), `position-leaders.ts` (9), `school-hub.ts` (8). These bypass TypeScript's safety net for complex Supabase query results, especially JSONB fields and joined relations.

### Decision
**Generate typed client via `supabase gen types typescript`**, then progressively replace `as any` casts.

### Options Considered

| Option | Complexity | Safety | Effort |
|--------|-----------|--------|--------|
| A: Generate types + replace all casts | Medium | High | 2-3 days |
| B: Generate types + replace top 4 files only | Low | Medium | 4 hours |
| C: Keep manual casts | None | Low | None |

### Trade-off Analysis
Option B is recommended. The top 4 files (greatest-seasons, computed-records, position-leaders, school-hub) account for 48 of 97 casts. Fixing those gives 50% improvement with 20% effort.

### Consequences
- Supabase schema changes caught at build time instead of runtime 500s
- `supabase gen types` must run after every migration
- JSONB fields still need manual typing (Supabase types them as `Json`)

### Action Items
1. [ ] Run `supabase gen types typescript --project-id uxshabfmgjsykurzvkcr > src/lib/database.types.ts`
2. [ ] Update `src/lib/supabase/static.ts` to use `Database` generic
3. [ ] Fix top 4 files: greatest-seasons, computed-records, position-leaders, school-hub

---

## ADR-002: Caching Strategy — ISR is Already Working

**Status:** Accepted (no change needed)
**Date:** 2026-03-26

### Context
Earlier analysis suggested ~85 pages had conflicting `force-dynamic` + `revalidate`. Actual audit found: **only 1 page** uses `force-dynamic`, **60 pages** use `revalidate`, and **0 pages** have both. The caching strategy is already clean.

### Decision
**No change.** Current ISR strategy is correct:
- 60 pages use `revalidate` (mostly 3600 = 1 hour)
- Static assets cached 1 year (immutable)
- Images optimized with AVIF + WebP
- No conflicting directives

### Consequences
- Pages revalidate hourly, giving fresh data without SSR overhead
- The 1 `force-dynamic` page is likely admin/auth-dependent — appropriate

---

## ADR-003: Scraping Infrastructure — Keep Ad-Hoc

**Status:** Accepted
**Date:** 2026-03-26

### Context
Scraping scripts live in `.firecrawl/` as session-local JSON + JS files. Only 5 permanent scripts exist in `scripts/` (bundle analysis + CI). The scraping work is one-time data import, not recurring ETL.

### Decision
**Keep ad-hoc.** No formalization needed.

### Rationale
- Scraping is done — 7 seasons of EPA football, 2 seasons of AOP basketball, 6 seasons of MaxPreps data already imported
- Future scrapes (new seasons) follow the same Playwright/Firecrawl patterns
- Vercel Workflows would add complexity for scripts that run once per season
- `.firecrawl/` JSON files serve as intermediate cache — good enough

### Consequences
- New team members would need to read session transcripts to understand scraping patterns
- Consider documenting the scrape→parse→insert→verify pipeline in a README

---

## ADR-004: Article Storage — Stay in Supabase

**Status:** Accepted
**Date:** 2026-03-26

### Context
474 articles stored in Supabase `articles` table. Solo author (Mike). Articles use markdown body with Gemini-generated hero images.

### Decision
**Stay in Supabase.** No CMS migration needed.

### Rationale
- Solo author eliminates the primary CMS benefit (multi-user editing, permissions, workflows)
- 474 articles is well within Supabase's comfortable range
- Article queries are simple (filter by slug, sport, date)
- Moving to Sanity/Contentful would add: monthly cost, another auth system, content sync complexity, migration effort
- Supabase already handles the `article_mentions` join table for entity linking

### Consequences
- No visual editor — articles are written in markdown
- If PSP adds multiple contributors, revisit this decision
- Consider adding a simple admin UI for article CRUD (currently done via SQL)

---

## ADR-005: Rate Limiting — In-Memory is Acceptable

**Status:** Accepted
**Date:** 2026-03-26

### Context
`src/middleware.ts` implements sliding window rate limiting using an in-memory Map. Each Vercel function instance has its own counter. The code explicitly notes "For multi-instance, use Redis."

### Decision
**Keep in-memory.** Document the limitation.

### Rationale
- PSP is a read-heavy sports database, not a high-write API
- Abuse potential is low (public data, no user-generated content to spam)
- Vercel's built-in DDoS protection handles L3/L4 attacks
- Upstash Redis adds $0.20/100K commands + operational complexity
- The per-instance limitation means a determined attacker could bypass limits, but the data they'd access is all public anyway

### Upgrade Path
If PSP adds: user auth, paid features, or write APIs → upgrade to Upstash Redis via Vercel Marketplace.

---

## ADR-006: Observability — Enable Sentry

**Status:** Proposed
**Date:** 2026-03-26

### Context
465 lines of production-ready error tracking code exists in `src/lib/error-tracking.ts` with a pluggable `ErrorReporter` interface, error categorization, deduplication, and rate limiting. It currently routes to `console.error` because no `SENTRY_DSN` is configured.

### Decision
**Set `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_DSN` environment variables on Vercel.**

### Action Items
1. [ ] Create Sentry project at sentry.io (free tier: 5K errors/month)
2. [ ] Set env vars via `vercel env add SENTRY_DSN` and `vercel env add NEXT_PUBLIC_SENTRY_DSN`
3. [ ] Uncomment Sentry plugin initialization in error-tracking.ts
4. [ ] Verify errors appear in Sentry dashboard

### Consequences
- Runtime errors become visible instead of vanishing into server logs
- Free tier is sufficient for PSP's traffic level
- Source maps should be uploaded during build for readable stack traces

---

## ADR-007: Supabase Client Architecture — Document Current Design

**Status:** Accepted
**Date:** 2026-03-26

### Context
5 Supabase client files serve different execution contexts. This is intentional and well-structured.

### Decision
**Document the existing architecture.** No changes needed.

### Client Matrix

| Client | File | Runtime | Cookies | Use Case |
|--------|------|---------|---------|----------|
| **Static** | `static.ts` | Server (ISR/SSG) | No | Data layer queries (`src/lib/data/`), build-time generation, revalidation |
| **Server** | `server.ts` | Server (RSC) | Yes | Session-aware queries, auth-gated data |
| **Client** | `client.ts` | Browser | No | Real-time subscriptions, client-side mutations |
| **Middleware** | `middleware.ts` | Edge | Yes | Token refresh, session management |
| **Pooled** | `pooled.ts` | Server | No | Heavy batch operations, admin tools, PgBouncer connection pooling |

### Rules
1. **Default to `static.ts`** for all data fetching in `src/lib/data/`
2. Use `server.ts` only when you need the user's session (auth, personalization)
3. Use `client.ts` only in `'use client'` components that need real-time or mutations
4. Use `pooled.ts` for admin bulk operations and background jobs
5. `middleware.ts` is only called from Next.js middleware — never import directly

---

## Summary

| ADR | Decision | Action Required |
|-----|----------|-----------------|
| 001 | Generate typed Supabase client | **Yes** — run `supabase gen types`, fix top 4 files |
| 002 | ISR caching is already correct | **No** — already working as intended |
| 003 | Keep ad-hoc scraping | **No** — document patterns in README |
| 004 | Stay in Supabase for articles | **No** — reassess if adding contributors |
| 005 | Keep in-memory rate limiting | **No** — upgrade to Redis only if adding auth/writes |
| 006 | Enable Sentry | **Yes** — set 2 env vars, uncomment init |
| 007 | Document client architecture | **No** — this ADR is the documentation |
