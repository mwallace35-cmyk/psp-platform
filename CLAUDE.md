# Memory — PSP Platform

## Me
Mike Wallace (mwallace35@gmail.com). Solo developer building phillysportspack.com — the definitive Philadelphia high school sports database. 55,232 players, 738 schools, 7 sports, 25+ years of history.

## Projects
| Name | What | Status |
|------|------|--------|
| **PSP** | phillysportspack.com — Philly HS sports database | Active |
| **Design Bible** | Page-by-page spec for entire platform (35+ pages) | ✅ COMPLETE |

## Design Bible Implementation
| Phase | Name | Status |
|-------|------|--------|
| P0 | Player Profile + Leaderboards + Trending | ✅ COMPLETE (14/16 components) |
| P1 | Sport Hubs, Season Stats, Compare, Records | ✅ COMPLETE |
| P2 | Pulse/Forum, Challenge, Pick'em, POTW | ✅ COMPLETE |
| P3 | Pipeline, Next Level, Recruiter Portal | ✅ COMPLETE |
| P4 | Articles, Coaches, Auth, Utility | ✅ COMPLETE |

## Local Dev Environment
| Item | Detail |
|------|--------|
| Repo location | ~/Desktop/psp-platform |
| Dev server | npm run dev → http://localhost:3000 |
| Env file | .env.local (Supabase URL + anon key + preview key) |
| Deploy | git push origin main → Vercel auto-deploys |
| **RULE** | ALL work done LOCAL first, then push. No more GitHub API edits. |

## Tech Stack
| Item | Detail |
|------|--------|
| Framework | Next.js 16 App Router (RSC streaming, Turbopack) |
| Database | Supabase PostgreSQL 17.6 (project: uxshabfmgjsykurzvkcr) |
| Hosting | Vercel (auto-deploy ~90s on push to main) |
| Repo | github.com/mwallace35-cmyk/psp-platform |
| Production | philly-sports-pack.vercel.app + www.phillysportspack.com |
| DB Tables | 88 total |

## CSS Design Tokens
| Token | Value | Usage |
|-------|-------|-------|
| --psp-navy | #0a1628 | Primary bg, header, dark sections |
| --psp-navy-mid | #0f2040 | Card bg on dark |
| --psp-gold | #f0a500 | Primary accent, CTA |
| --psp-gold-light | #f5c542 | Hover state |
| --psp-blue | #3b82f6 | Links, basketball accent |
| --fb (football) | #16a34a | Sport accent |
| --bb (baseball) | #ea580c | Sport accent |
| --track | #7c3aed | Sport accent |
| --lac (lacrosse) | #0891b2 | Sport accent |
| --wrest | #ca8a04 | Sport accent |
| --soccer | #059669 | Sport accent |
| Heading font | Bebas Neue | Display, h1, h2 |
| Body font | DM Sans | Body, UI, tables |

## Design Decisions (Q&A with Mike)
| # | Decision |
|---|----------|
| 1 | Basketball stays blue (#3b82f6), links differentiate with underlines |
| 2 | Ad-supported, free for all — no paywalls |
| 3 | Player photos planned but not yet — fallback: initials on sport-colored circle |
| 4 | Live scores not a priority right now |
| 5 | Hybrid moderation: auto-flag + manual review |
| 6 | Minor sports (track, lac, wrest, soccer) = thinner data, simplified templates |
| 7 | Daily Challenge = Football + Basketball |
| 8 | Responsive web only, no native app |
| 9 | Sport hub heroes: field/court TEXTURE backgrounds (turf, hardwood, clay, etc.) with 80% navy overlay. NO color gradients. |
| 10 | Stat counter pills (36,218 players etc.) REMOVED from heroes. That pill style becomes tab navigation instead. |

## Key DB Tables
| Table | Key Columns |
|-------|-------------|
| players | id, slug, name, graduation_year, positions[], primary_school_id |
| football_player_seasons | player_id, season_id, rush_yards, rush_td, pass_yards, pass_td, rec_yards, rec_td |
| basketball_player_seasons | player_id, season_id, points, ppg, rebounds, assists, games_played |
| schools | id, slug, name, city, region_id (RLS: deleted_at IS NULL hides soft-deleted) |
| school_names | VIEW — bypasses RLS, shows all schools including deleted (for scores) |
| games | home_school_id, away_school_id, home_score, away_score, game_date |
| awards | player_id, award_name, year (16,012 rows) |
| power_rankings | sport_id, school_id, rank_position, record_display, week_label |
| player_reactions | player_id, reaction (fire/star/beast/champ) |
| next_level_tracking | player_id, current_level, current_org (2,224 rows, 436 pro) |
| search_index | 56,383 entries |

## Components Built This Session
| Component | File | Status |
|-----------|------|--------|
| PercentileRadar | src/components/players/PercentileRadar.tsx | ✅ LIVE |
| SimilarPlayers | src/components/players/SimilarPlayers.tsx | ✅ LIVE |
| AwardsHonors | src/components/players/AwardsHonors.tsx | ✅ LIVE |
| DesignBibleSections | src/components/sport-layouts/DesignBibleSections.tsx | ✅ LIVE |
| Avatar initials | Inline in player page | ✅ LIVE |
| Position tag | Inline in player page | ✅ LIVE |
| SharePlayerButton | Already existed, wired into profile | ✅ LIVE |

## CRITICAL: Double-Encoding Issue
The codebase had a sitewide UTF-8 double-encoding problem. Emojis and special characters stored as C3/C2 byte pairs cause React RSC hydration crashes (`SyntaxError: Failed to execute 'appendChild'`).
**Fixed in 30+ files this session.** If editing files via GitHub API, ALWAYS run the fixDoubleEncoding function afterward. Working locally avoids this entirely — that's why we switched to local dev.

## Known TS Patterns
- Supabase joins: `Array.isArray(raw) ? raw[0] : raw` for many-to-one
- Dynamic columns: Cast `supabase as any` before `.from()` for template literals
- RLS bypass: Use `school_names` view instead of `schools` table for historical game displays

## FAIL Items Backlog (Needs Real Users)
| Item | Table | Status |
|------|-------|--------|
| User profiles | user_profiles | 0 — fills from signups |
| Coming soon signups | coming_soon_signups | 0 — fills from traffic |
| Pick'em picks | pickem_picks | 0 — needs user auth FK |
| Forum likes | forum_likes | 0 — needs user auth FK |

## Route Health: 54/54 PASS
All routes verified returning 200 on March 18, 2026.

## Data Scraped This Session
| Source | Records | Status |
|--------|---------|--------|
| All-Catholic MVPs + COTY (PDFs, 2021-2025) | 17 | ✅ Inserted to DB |
| All-Public 2024-25 (PPL website, 68 schools) | 1,154 | SQL file: seed_2025_all_public.sql |
| All-Public 2023-24 (PPL website, 72 schools) | 1,069 | SQL file: seed_2024_all_public.sql |
| All-Public 2022-23 (PPL website, 68 schools) | 868 | SQL file: seed_2023_all_public.sql |
| Public League school logos | 28 | ✅ Inserted to DB |
| 9 articles (3 FB, 3 BK, 3 BB) | 9 | ✅ Inserted to DB |

## Code Changes This Session (Local + Pushed)
- Tab pill navigation (SportNav.tsx) — no emojis, rounded pills
- Gradient removal from sport hub hero + 12 sub-pages
- Stat counter pills removed from sport hubs, awards, pipeline, schools
- Schools directory text rewritten, stat boxes removed
- Awards Pro Bowl-style tier roster (AwardTierRoster.tsx + categorize.ts)
- MVP + Coach of the Year dedicated tabs
- Year filter dropdown (defaults to most recent year)
- Records query fix (missing columns + limit 600)
- Compare tools fixed (player search API wrapper + school compare deleted_at)
- DesignBibleSections scores fix (sport filter + diversity cap)
- Awards page white bg matching other sub-pages
- Award links removed from sports dropdown
- 3 award links removed from sports dropdown menu

## Preferences
- **ALL work done LOCAL, push when ready** — no more GitHub API file edits
- Push directly to main branch (no PRs)
- ISR revalidation: 3600 (1hr) for all pages
- Direct Supabase client in API routes
- Sport filtering: use !inner join on season tables

## Box Score Status (as of March 24, 2026)
| Source | Sport | Games | Rows | Status |
|--------|-------|-------|------|--------|
| Archive (teampage) | Basketball | 1,594 | 19,732 | ✅ Complete (historical) |
| Archive (team_page) | Basketball | 267 | 11,422 | ✅ Complete (historical) |
| Archive (pergame) | Basketball | 73 | 1,054 | ✅ Complete (historical) |
| AOP PDFs (2025-26) | Basketball | 14 | 283 | ⚠️ Only 16/141 PDFs are valid (rest are HTML) |
| Season averages | Basketball | 9,270 | 155,024 | ✅ Generated from season stats |
| Archive | Football | ~2,800 | ~32,500 | ✅ Complete (historical) |
| Season averages | Football | ~1,800 | ~35,000 | ✅ Generated from season stats |

### What's NOT done yet:
- MaxPreps per-game box scores for 2025-26 basketball (schedule URLs extracted but data not scraped/inserted)
- AOP PDFs: 125 of 141 downloaded files are HTML (auth required), only 16 are real PDFs
- Need browser-authenticated download for AOP PDFs OR MaxPreps scraping as alternative
