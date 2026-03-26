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

## MaxPreps Scraping via Playwright (March 25, 2026)

### Key Findings
- **Game box score pages require MaxPreps sign-in** — shows auth wall
- **Player individual stats pages are PUBLIC** — full game-by-game stats without auth
- **Schedule pages are PUBLIC** — full season schedule with scores and box score links
- **Playwright (mcp__plugin_playwright_playwright) works perfectly** for MaxPreps scraping

### Working Approach: Player Stats Pages
1. Navigate to school's roster page to get all player URLs
2. For each player, navigate to their `/basketball/stats/` page
3. Extract game-by-game stats from the HTML tables
4. Stats available: Date, Result, Opponent, Min, Pts, FGM, FGA, 3PM, 3PA, FTM, FTA, 2FGM, 2FGA + shooting percentages
5. "Totals" tab has: Pts, Reb, Ast, Stl, Blk, TO, PF
6. Match games to our DB by date + opponent + score

### MaxPreps URL Patterns
- Schedule: `https://www.maxpreps.com/{state}/{city}/{school-slug}/basketball/schedule/`
- Roster: `https://www.maxpreps.com/{state}/{city}/{school-slug}/basketball/roster/`
- Player stats: `https://www.maxpreps.com/{state}/{city}/{school-slug}/athletes/{player-slug}/basketball/stats/?careerid={id}&sportSeasonId={seasonId}`
- Player stats page has tabs: Career, Var. 25-26, Var. 24-25, etc.
- Stats tables: "Shooting (1)" = Pts/FGM/FGA, "Shooting (2)" = 3PM/3PA/FTM/FTA, "Totals" = Reb/Ast/Stl/Blk/TO, "Misc Totals" = additional

### Playwright Commands
```
mcp__plugin_playwright_playwright__browser_navigate — go to URL
mcp__plugin_playwright_playwright__browser_evaluate — extract data via JS
mcp__plugin_playwright_playwright__browser_snapshot — get page structure
mcp__plugin_playwright_playwright__browser_click — click tabs/buttons
```

### School Slugs (PCL — 14 schools)
| School | DB ID | MaxPreps Slug |
|--------|-------|---------------|
| Roman Catholic | 127 | pa/philadelphia/roman-catholic-cahillite |
| Neumann-Goretti | 198 | pa/philadelphia/neumann-goretti-saints |
| Archbishop Wood | 144 | pa/warminster/archbishop-wood-vikings |
| Father Judge | 147 | pa/philadelphia/father-judge-crusaders |
| St. Joseph's Prep | 1005 | pa/philadelphia/st-josephs-prep-hawks |
| Archbishop Ryan | 175 | pa/philadelphia/archbishop-ryan-raiders-and-ragdolls |
| Archbishop Carroll | 145 | pa/radnor/archbishop-carroll-patriots |
| West Catholic | 171 | pa/philadelphia/west-catholic-burrs |
| Devon Prep | 254 | pa/devon/devon-prep-tide |
| Cardinal O'Hara | 167 | pa/springfield/cardinal-ohara-lions |
| Bonner-Prendergast | 177 | pa/drexel-hill/monsignor-bonner-archbishop-prendergast-catholic-friars-pandas |
| Conwell-Egan | 2780 | pa/fairless-hills/conwell-egan-catholic-eagles |
| La Salle | 2882 | pa/wyndmoor/la-salle-college-explorers |
| Lansdale Catholic | 971 | pa/lansdale/lansdale-catholic-crusaders |

## MaxPreps Stats Availability (March 25, 2026)

### Schools WITH Player Stats on MaxPreps (confirmed via Playwright)
- Motivation, Neumann-Goretti, Archbishop Ryan, Devon Prep
- Imhotep Charter, West Philadelphia, Sankofa, Paul Robeson
- Carver, Samuel Fels, Constitution, Olney, Frankford, Haverford School

### Schools WITHOUT Player Stats on MaxPreps (coach didn't enter)
- Roman Catholic, St. Joseph's Prep, Archbishop Wood, La Salle
- Father Judge, Archbishop Carroll, West Catholic, Cardinal O'Hara
- Bonner-Prendergast, Conwell-Egan, Lansdale Catholic

### PCL Schools Coverage Strategy
- PCL schools without MaxPreps → use AOP PDF box scores (70 games already inserted)
- PCL schools with MaxPreps (NG, AR, DP) → supplement with MaxPreps data

### Key Discovery: Game Box Score Pages Require Auth
- Individual game box score pages on MaxPreps show auth wall ("Get Unlimited Access")
- Player stats pages ARE public and show full game-by-game stats
- Team stats/print pages are public and show season totals
- The approach: scrape team stats pages for season totals, player stats pages for game logs

## MaxPreps Scrape Results (Batch 1+2 — March 25, 2026)

### Schools with Player Stats on MaxPreps (per-game averages):
| School | ID | Players | Stats Columns |
|--------|-----|---------|---------------|
| Neumann-Goretti | 198 | 13 | GP, MPG, PPG, DEFR, OFFR, RPG, APG, SPG, BPG, TPG, PFPG |
| Archbishop Ryan | 175 | 14 | same |
| Devon Prep | 254 | 16 | same |
| West Philadelphia | 151 | 13 | same |
| Sankofa | 237 | 14 | same |
| Paul Robeson | 2979 | 14 | same |
| Constitution | 220 | 13 | same |
| Olney | 163 | 15 | same |
| Frankford | 180 | 10 | same |
| Haverford School | 259 | 18 | same |
| Motivation | 248 | 12 | same |

### Schools WITHOUT Stats (confirmed via Playwright):
| School | ID | Reason |
|--------|-----|--------|
| Roman Catholic | 127 | "Player Stats Not Entered" |
| Imhotep Charter | 209 | No data table found |
| Carver | 2755 | Stats page 404 |
| Samuel Fels | 162 | Stats page 404 |

### Next: Need to scrape full data with actual values via print pages

## Batch 3 Results (15 more schools checked):
| Status | School | ID | Players |
|--------|--------|-----|---------|
| ✅ | Roxborough | 129 | 13 |
| ✅ | HS of the Future | 2852 | 12 |
| ✅ | MLK | 2905 | 8 |
| ✅ | Abraham Lincoln | 2697 | 12 |
| ✅ | Northeast | 149 | 13 |
| ✅ | George Washington | 185 | 16 |
| ✅ | Overbrook | 159 | 11 |
| ✅ | Mastery South | 6464 | 13 |
| ❌ | Franklin Towne | 954 | 0 |
| ❌ | Kensington | 128 | 0 |
| ❌ | MAST III | 6592 | 0 |
| ❌ | Malvern Prep | 156 | 0 |
| ❌ | Germantown Academy | 130 | 0 |
| ❌ | Episcopal Academy | 138 | 0 |
| ❌ | Penn Charter | 161 | 0 |

### Total Scraped So Far: 236 players across 19 schools
### Inter-Ac schools have no MaxPreps stats (coaches don't use it)

## Final MaxPreps Scrape Summary (March 25, 2026)

### Schools Successfully Scraped: 19 total, 236 players
| Batch | Schools | Players | Status |
|-------|---------|---------|--------|
| 1 (PCL+PPL top) | NG, AR, DP, WestPhila, Sankofa, Robeson | 68 | ✅ Data saved |
| 2 (PPL+misc) | Constitution, Olney, Frankford, Haverford, Motivation | 68 | ✅ Data saved |
| 3 (PPL+IA) | Roxborough, Future, MLK, Lincoln, NE, GW, Overbrook, Mastery South | 98 | ✅ Scraped |

### Schools Without MaxPreps Stats (no coach entry): ~20 schools
RC, SJP, AW, LS, FJ, AC, WC, CO, BP, CE, LC, Imhotep, Carver, Fels, FranklinTowne, Kensington, MAST III, Malvern, GA, Episcopal, PennCharter

### Coverage Strategy:
- PCL schools (no MaxPreps): Use AOP PDF box scores (70 games already in DB)
- PPL + Inter-Ac (with MaxPreps): Season stats from MaxPreps per-game averages
- All schools: Season-level stats already in basketball_player_seasons from prior imports

### Data Format: Per-game averages
Headers: #, Name, GP, MPG, PPG, DEFR, OFFR, RPG, APG, SPG, BPG, TPG, PFPG
Needs conversion: multiply PPG*GP to get total points, RPG*GP for total rebounds, etc.

## Batch 4: 11 MORE PPL schools with stats (all confirmed ✅)
Dobbins(2936), Parkway NW(2975), SLA(5572), Bodine(165), Freire Charter(1878), Edison(4674), Swenson(5649), Sayre(205), Bartram(2698), SLA Beeber(3027), Mastbaum(4621)

### GRAND TOTAL: 30 schools with MaxPreps player stats available
### Estimated 350-400 players total to scrape and insert
### Subagent currently inserting batch 1+2 data into DB

## FINAL Scrape Results (March 25, 2026)

### Successfully Scraped: 21 schools, 278 players
**Batch 1+2 (saved to all_schools_stats.json):** NG(198/13), AR(175/14), DP(254/16), WestPhila(151/13), Sankofa(237/14), Constitution(220/13), Olney(163/15), Frankford(180/10), Haverford(259/18), Motivation(248/12) = 138 players
**Batch 3+4 (saved to batch3_4_stats.json):** Roxborough(129/13), Future(2852/12), MLK(2905/8), Lincoln(2697/12), NE(149/13), GW(185/16), Overbrook(159/11), MasterySouth(6464/13), ParkwayNW(2975/19), SLA(5572/13), Sayre(205/10) = 140 players

### Confirmed No Stats Pages: 8 schools
Dobbins(2936), Bodine(165), Freire(1878), Edison(4674), Swenson(5649), Bartram(2698), SLABeeber(3027), Mastbaum(4621) — all return 404 on stats page

### No MaxPreps Stats At All: 11 schools
RC(127), SJP(1005), AW(144), LS(2882), FJ(147), AC(145), WC(171), CO(167), BP(177), CE(2780), LC(971) — PCL schools use AOP instead

### Inter-Ac: No Stats
Malvern(156), GA(130), Episcopal(138), PennCharter(161) — use league-specific reporting

### 2 Subagents Processing DB Insertion
- Agent A: batch 1+2 (138 players, 10 schools)
- Agent B: batch 3+4 (140 players, 11 schools)

## Ted Silary Hall of Fame — Build Progress (March 25, 2026)

### Phase 1: Foundation (IN PROGRESS)
- Agent A1: Creating 5 DB tables (hof_organizations, hof_inductees, player_hof_badges, city_allstar_games, city_allstar_participants) + seeding 5 HOF orgs
- Agent A2: Building /hof landing page with Ted Silary hero, 5 HOF cards, featured athletes strip

### Phase 2: Public League HOF (PENDING)
- Agent B1: Scrape tedsilary.com for ~165 athlete inductees
- Agent B2: Build /hof/public-league page

### Phase 3: City All Star (PENDING)
- Agent C1: Scrape phillyhof.org for ~220 athlete inductees
- Agent C2: Build /hof/city-all-star page

### Phase 4: Football Game + Schools (PENDING)
- Agent D1: Upgrade /football/city-all-star-game
- Agent D2: Build /hof/schools directory

### Phase 5: Badge Integration (PENDING)
- Agent E1: Match inductees to PSP players, create badges

### Estimated: ~662 athlete profiles across 3 HOFs

## HOF Build Progress Update (March 25, 2026 — 9:30 PM)

### Completed:
- ✅ Phase 1: 5 DB tables + /hof landing page (pushed)
- ✅ Phase 2A: /hof/public-league page (pushed)
- ✅ Phase 3: /hof/city-all-star + /hof/schools pages (pushed)
- 🔄 Phase 2B: 121 Public League inductees inserted (27 schools) — agent still running

### Pages Live:
- /hof — Ted Silary Hall of Fame landing
- /hof/public-league — Public League HOF (121 inductees and counting)
- /hof/city-all-star — City All Star Chapter (empty, needs data scrape)
- /hof/schools — School HOF directory (17 schools + South Philly featured)

### Still TODO:
- Phase 4: Football game upgrade
- Phase 5: Badge integration on player profiles
- City All Star inductee data scraping
- Match inductees to existing PSP player profiles

## HOF Build — Final Progress (March 25, 2026 — 10:30 PM)

### All Pages Built & Deployed:
- /hof — Ted Silary Hall of Fame landing (5 HOF cards, featured athletes)
- /hof/public-league — 165 athlete inductees, filters by sport/school/decade
- /hof/city-all-star — City All Star Chapter (awaiting inductee data)
- /hof/schools — 18 school HOF directory with South Philly featured
- /football/city-all-star-game — Full PASFG upgrade (event, schedule, scholarships, HOF cross-links)
- Football hub sidebar — City All-Star Game card

### Database:
- 5 new tables created (hof_organizations, hof_inductees, player_hof_badges, city_allstar_games, city_allstar_participants)
- 5 HOF organizations seeded with badge specs
- 165 Public League HOF inductees inserted (27 schools, 8 sports)
- Badge component + player matching agent still running

### Commits (5 pushes):
1. Phase 1: DB tables + landing page
2. Phase 2: Public League HOF page
3. Phase 3: City All Star + Schools pages
4. Phase 4A: Football game upgrade
5. Phase 4B: Badge system (pending agent completion)
