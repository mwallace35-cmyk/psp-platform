# Memory — PSP Platform

## Me
Mike Wallace (mwallace35@gmail.com). Solo developer building phillysportspack.com — the definitive Philadelphia high school sports database. 400+ schools, 10,000+ athletes, 7 sports.

## Projects
| Name | What | Status |
|------|------|--------|
| **PSP** | phillysportspack.com — Philly HS sports database | Active |
| **War Room** | 5-phase platform redesign roadmap | In progress — Phase 5 |

→ Full details: memory/projects/psp-platform.md

## War Room Phases
| Phase | Name | Status |
|-------|------|--------|
| Phase 0 | Emergency Fixes | ✅ COMPLETE |
| Phase 1 | Foundation | ✅ COMPLETE |
| Phase 2 | Content Engine | ✅ COMPLETE |
| Phase 3 | Homepage Redesign | ✅ COMPLETE |
| Phase 4 | Data Innovation | ✅ COMPLETE |
| Phase 5 | Community & Growth | Pending |

## Phase 2 Progress
| Feature | Status |
|---------|--------|
| TrendingPlayersWidget | ✅ Done (commit f158890b — created in Phase 3) |
| /leaderboards/trending | ✅ Done (commit 14205ed) |
| /football/efficiency stats | ✅ Done (commit c66626f) |
| /history (This Week in PSP History) | ✅ Done (commit ab07b59) |
| /api/players/search | ✅ Done (commit de62c57) |
| Player Share Card generator | ✅ Done (commits 7d4e313c + 7c1afca6) |
| Live score ticker | ✅ Done (commit 7009a864) |
| Auto-generated game recaps | ✅ Done (commit 5236366e) |
| Push notification system | ✅ Done (commit c9f752ae) |

**Phase 2 COMPLETE ✅ — all 9 features shipped and building green**

## Phase 3 Progress
| Feature | Status |
|---------|--------|
| ScoreTicker wired into root layout | ✅ Done (commit db95245d) |
| PushNotificationBanner wired into root layout | ✅ Done (commit db95245d) |
| TrendingPlayersWidget added to homepage feed | ✅ Done (commits 456c975b + f158890b) |

**Phase 3 COMPLETE ✅ — all Phase 2 components wired into homepage/layout**

## Phase 4 Progress
| Feature | Status |
|---------|--------|
| /players/compare page | ✅ Done (commit 371572bf) |
| /api/v1/players/[slug]/percentiles API | ✅ Done (commit b10c4103) |
| CompareButton component | ✅ Done (commit d1dfa8fc) |
| /stats/season/[year] leaders page | ✅ Done (commit 673c269e) |

**Phase 4 COMPLETE ✅ — compare tool, percentiles API, season leaders all shipped and building green**

## Build History (Key)
| Commit | Status | Notes |
|--------|--------|-------|
| ff793943 | ✅ READY | Fixed standings TS type cast — Supabase join returns array |
| 7d4e313c | ✅ READY | Player OG image (opengraph-image.tsx) |
| 7c1afca6 | ✅ READY | SharePlayerButton component |
| 7009a864 | ✅ READY | ScoreTicker — live polling, scroll animation |
| 5236366e | ✅ READY | GameRecapCard — AI recap trigger + display |
| c9f752ae | ✅ READY | PushNotificationBanner — browser Notification API |
| db95245d | ✅ READY | Phase 3: ScoreTicker + PushNotificationBanner in root layout |
| f158890b | ✅ READY | Phase 3: TrendingPlayersWidget component + homepage wired |
| 371572bf | ✅ READY | Phase 4: /players/compare page (server component, side-by-side stats) |
| b10c4103 | ✅ READY | Phase 4: /api/v1/players/[slug]/percentiles (career vs all players) |
| d1dfa8fc | ✅ READY | Phase 4: CompareButton client component (modal search + navigate) |
| 673c269e | ✅ READY | Phase 4: /stats/season/[year] leaders page (fixed dynamic column TS error) |

## Known TS Pattern — Supabase Joins (CRITICAL)
When using `.select('table(col1, col2)')` the result type varies by join direction:
- Many-to-one (player→school): runtime is single object, TS types as array
- One-to-many (player→seasons): runtime is array, TS types as array
SAFE pattern for ANY direction: `Array.isArray(raw) ? raw[0] : raw` or `(raw as unknown as Array<T>)[0] ?? null`
NEVER: `field as { col1: string } | null` (TS error)

## Known TS Pattern — Dynamic Supabase Columns (CRITICAL)
When using template literals in `.select()` like `\`${col}, players!inner(...)\``, Supabase's TypeScript parser produces a `ParserError` type because it can't infer from runtime strings.
SAFE pattern: Cast client to `any` before `.from()`:
```ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;
const { data } = await db.from('table').select(`${col}, ...`);
type Row = { players: PlayerJoin | null } & Record<string, number>;
const rows = (data ?? []) as Row[];
```
NEVER: `supabase.from('table').select(\`${dynamicCol}, ...\`)` without `as any` (ParserError on row.players)

## Tech Stack
| Item | Detail |
|------|--------|
| Framework | Next.js 15 App Router |
| Database | Supabase (PostgreSQL via PostgREST) |
| Hosting | Vercel |
| Repo | github.com/mwallace35-cmyk/psp-platform |
| Vercel Project | philly-sports-pack |
| Vercel Project ID | prj_bnuSRj7prv5IqcgGeZJY42epYncb |
| Vercel Team ID | team_tuDn5WZnv2QKpIJEODJH0pQC |

## CSS Design Tokens
| Token | Value |
|-------|-------|
| --psp-navy | #1a2744 |
| --psp-gold | #c8a84b |
| --psp-muted | #6b7280 |
| --psp-card-bg | #f8f9fc |
| --font-bebas | "Bebas Neue", sans-serif |

## Key DB Tables
| Table | Key Columns |
|-------|-------------|
| players | id, slug, name, first_name, last_name, primary_school_id, graduation_year, positions TEXT[] |
| football_player_seasons | player_id, season_id, rush_yards, rush_tds, pass_yards, pass_tds, rec_yards, rec_tds |
| basketball_player_seasons | player_id, season_id, points, ppg, rebounds, rpg, assists, apg, games_played |
| next_level_tracking | player_id, current_level, current_org, pro_team, pro_league, draft_info, college |
| team_seasons | school_id, season_id, sport_id, wins, losses, ties, win_pct, league_wins, league_losses |
| game_player_stats | 78,171 records — individual game stats |
| article_mentions | 23,805 records — links articles to players/schools |

→ Full schema: memory/projects/psp-platform.md

## GitHub API
| Item | Value |
|------|-------|
| Token | stored in session memory (not committed to repo) |
| Usage | Bearer token — use Chrome javascript_tool fetch() to call api.github.com |
| Update file | PUT https://api.github.com/repos/mwallace35-cmyk/psp-platform/contents/{path} |

## Known Environment Issues
| Issue | Workaround |
|-------|-----------|
| Bash non-functional in VM | Use Agent subprocesses + Chrome tools |
| VM disk full (ENOSPC) | Write to /mnt/outputs only |
| GitHub web editor corrupts files | ✅ USE GITHUB API via Chrome javascript_tool fetch() — 100% reliable |
| Vercel log tools timeout at 60s | Use Chrome to browse Vercel dashboard directly |

## Preferences
- Push directly to main branch (no PRs)
- ISR revalidation: 3600 (1hr) for all pages
- Direct Supabase client in API routes (not shared createClient which can hang)
- Sport filtering: always use !inner join on season tables, never a sport column
