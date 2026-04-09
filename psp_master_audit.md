# PSP Platform Master Audit Report
**Generated**: 2026-04-01
**Source**: 19 parallel audit agents

================================================================================
# PANEL 1: SITE EXPERIENCE
*Agents 1-8: UX, Information Architecture, Mobile, Performance, Visual Design, Content Strategy, Accessibility, User Persona*
================================================================================

## Agent 1: UX Analyst

### 1. WHAT EXISTS

**Page Inventory (8 evaluated routes):**

- **Homepage** (`/`) -- Hero banner image with stats pills (57K players, 44K games, 756 schools), beta banner, shield-shaped sport navigation grid (7 sports), 3-column + sidebar layout with Recent Scores, Latest Stories, POTW voting, sidebar widgets (Our Guys alumni, Pick'em, Power Rankings, Did You Know).
- **Football Hub** (`/football`) -- Dynamic `[sport]` route. Hero with featured article, news card row, scores strip, Did You Know, playoff preview (basketball only), quick navigation cards, DesignBibleSections (scores/rankings/leaders), standings, compound leaderboards, record watch, editorial intro, layout switcher (editorial/dashboard toggle). Deep feature set.
- **Basketball Hub** (`/basketball`) -- Same `[sport]` template as football. Adds PlayoffPreview component. Same structure, different data.
- **Players** (`/players`) -- Static landing page. No actual player data shown. Sport pill links, 7 sport cards linking to `/{sport}/leaderboards`, and a search CTA banner at bottom.
- **Schools** (`/schools`) -- Server-rendered directory filtered to 3 core leagues (Catholic, Public, Inter-Ac). Uses materialized view. Shows top championship schools, rising programs, league-filtered browsable lists.
- **Leaderboards** (`/football/leaderboards`) -- Stat category cards (7 for football, 9 for basketball) each showing top 5 leaders. Season filter dropdown. Links to full category drilldowns.
- **Search** (`/search`) -- Server-side search against `search_index` table. Empty state shows "Discover Schools" section with Rising Programs, league-grouped school links, and sport switcher. Results grouped by entity type (school, player, coach).
- **Pulse** (`/pulse`) -- Redirects to homepage (`redirect('/')`) -- effectively dead route.

**Global Layout Components:**
- `Header.tsx` -- Sticky nav with logo, desktop dropdowns (Scores, Football, Basketball, More Sports, Schools, More, Search icon, Account). Mobile hamburger opens full-screen slide panel with sectioned links (Sports, Quick Links, The Pulse, More, Account, Settings with dark mode toggle).
- `Footer.tsx` -- 6-column footer: brand description, Sports links, The Pulse links, Tools links, Support links, About section with Ted Silary credit.
- `MobileBottomNav.tsx` -- Fixed bottom bar with 5 items: Home, Sports (opens picker sheet), Vote (POTW), My Schools, Menu (opens overlay). Uses CSS module styling.
- `ScoreTicker` -- Score ticker component placed between Header and main content in root layout.

**Navigation Architecture:**
- Desktop: Single-tier sticky header with hover dropdowns. Football/Basketball get dedicated dropdowns with sub-items (Standings, Leaderboards, Schools, Championships, Playoffs, Records). "More Sports" groups the other 5. "More" dropdown holds 10+ utility pages.
- Mobile: Hamburger menu (top) + persistent bottom tab bar (5 items). Two separate menu systems.

---

### 2. KEEP

**A. Sport hub page architecture (football/basketball).** The `[sport]/page.tsx` route is exceptionally well-engineered. It uses `Promise.allSettled` for 11 parallel data fetches with graceful degradation -- if one fetch fails, the page still renders. This is production-grade resilience that many professional sports sites lack. The season-phase-aware editorial intros (in-season, preseason, offseason) show sophistication.

**B. Homepage 3+1 column layout.** The main column (scores, articles, POTW) plus sidebar (Our Guys, Pick'em, Rankings, Did You Know) follows proven sports media layout conventions (ESPN, Bleacher Report). Users who visit sports sites will immediately understand the information hierarchy.

**C. Search empty-state discovery pattern.** When no query is entered, the search page shows school discovery organized by league with Rising Programs spotlight. This converts a dead-end into a browsing experience and gives first-time visitors pathways into the database.

**D. Desktop dropdown navigation with keyboard support.** The Header implements full arrow-key navigation, Escape to close, focus trapping, and `aria-expanded`/`aria-haspopup` attributes. The focus management for mobile menu (focus trap, focus return to hamburger on close) is thorough accessibility work.

**E. Score cards with contextual labels.** `HomeScoresSection` builds smart game labels from `game_type`, `playoff_round`, and `notes` fields -- showing "PCL FINAL", "PIAA 6A SEMIFINAL", etc. This contextual badging transforms a generic score into a meaningful result.

**F. Graceful empty states.** When no recent games exist, the scores section falls back to latest results from the current season with an explanatory message. This prevents blank sections during offseason.

---

### 3. IMPROVE

**A. Players page is a dead end -- the most critical UX failure on the site.**
- **Problem:** `/players` shows zero actual player data. It is a static page with sport pill links pointing to `/{sport}` (not even to player directories) and cards linking to `/{sport}/leaderboards`. A user clicking "Players" in nav expects to see players.
- **Fix:** Replace with a real player directory showing the most-searched or most-viewed players, with search typeahead, alphabetical browsing, and filtering by school/sport/graduation year. At minimum, embed the SearchTypeahead component here and pre-populate with "trending" players.

**B. Mobile has two competing menu systems creating confusion.**
- **Problem:** Mobile users see both a hamburger menu (top-right in Header) AND a fixed bottom navigation bar (MobileBottomNav). The hamburger opens a full slide-out panel with Sports, Quick Links, Pulse, More, Account, Settings. The bottom bar has Home, Sports (separate sport picker sheet), Vote, My Schools, Menu (opens yet another overlay with Home, Schools, Scores, Leaderboards, Pulse, Search). These two "Menu" buttons lead to completely different content.
- **Fix:** Remove the hamburger entirely on mobile. Consolidate all navigation into the bottom bar's Menu overlay. Expand that overlay to include the items currently exclusive to the hamburger (Account, Quick Links, Settings/Dark Mode). One menu, one mental model.

**C. "More" dropdown in header is an information graveyard.**
- **Problem:** The desktop "More" dropdown holds 10 items (Schools, Rankings, Our Guys, Recruiting, Recruit Finder, Compare, Pipeline, Coaches, Pick'em, Hall of Fame). Users will never discover features like Recruit Finder or Compare because they are buried 2 clicks deep behind a generic label. Schools is also a top-level nav link AND inside "More" -- contradictory placement.
- **Fix:** Promote the 3 highest-value features (Rankings, Our Guys, Pick'em) to visible top-level links. Rename "More" to something descriptive like "Tools & Features." Remove "Schools" from the dropdown since it already has a top-level link.

**D. Beta banner takes prime real estate with low information density.**
- **Problem:** The beta banner occupies ~100px of vertical space directly below the hero on every page load. After a user's first visit, this message provides zero new value. It pushes actual content (sport navigation, scores) below the fold on mobile.
- **Fix:** Make it dismissible with a cookie/localStorage flag. Or convert it to a thin, single-line announcement bar (like GitHub's status banners) that takes 32px instead of 100px.

**E. Sport Navigation Grid shields are visually impressive but have low tap-target affordance on mobile.**
- **Problem:** The hexagonal shield shapes (`clipPath: 'polygon(...)'`) make it unclear where the clickable area is. The shield is 112x128px on mobile with most of the visual weight in the emoji and accent line. The sport name text below the shield is not visually connected to the tap target.
- **Fix:** Add a subtle hover/focus state that highlights the entire shield+label as a unified target. Consider a simpler card layout on mobile (horizontal list or 2-column grid) where the full surface is the tap target.

**F. Homepage "Our Guys" sidebar section has no context for what it means.**
- **Problem:** "Our Guys" as a heading with a list of names + teams means nothing to a first-time visitor. There is no explanation that these are local alumni playing professionally.
- **Fix:** Add a 1-line subheader: "Philly alumni in the pros" or similar. The current heading assumes insider knowledge.

**G. Leaderboard page has no visual hierarchy between categories.**
- **Problem:** All 7-9 stat category cards look identical. There is no indication of which categories are most popular or most meaningful.
- **Fix:** Make the first 2-3 categories (Rushing/Scoring for football, Scoring/PPG for basketball) visually larger or featured. Use a 2+N grid pattern where primary categories get hero treatment.

**H. Search uses `<form action="/search" method="GET">` which causes full page reload.**
- **Problem:** Every search triggers a full server round-trip. For a database with 56K entries, this creates noticeable latency and feels sluggish compared to modern instant-search experiences.
- **Fix:** The `SearchTypeahead` component already exists and is lazy-loaded in the Header. Bring it to the search page as the primary input method with client-side instant results, falling back to the full-page results for comprehensive browsing.

---

### 4. REMOVE

**A. `/pulse` route.** It redirects to `/` but the mobile bottom nav still links to it. The Footer still lists "The Pulse" as a section. The mobile hamburger menu has a dedicated "The Pulse" section with 5 links. If Pulse is dead, clean up all references -- the redirect creates a confusing conceptual layer.

**B. "More Sports" as a separate dropdown.** Baseball, Soccer, Lacrosse, Track, and Wrestling each have thin data (per Mike's own design decision #6). Bundling them into a separate dropdown communicates "these are secondary" but also makes them harder to find. Fold them into the Football/Basketball dropdown pattern or move them into the sport navigation grid only.

**C. Duplicate sport navigation on the Search empty state.** The search page's empty state has both a league-organized school listing AND a sport switcher row at the bottom. This sport switcher duplicates the header nav, the homepage sport grid, and the mobile sport picker. It adds no unique value here.

**D. `PublicLayout.tsx` in the layout directory.** This file exists but is not referenced in the root layout or any page -- it appears to be dead code.

---

### 5. MISSING

**A. Breadcrumb navigation on the homepage.** Every sub-page has breadcrumbs (verified in sport hub, schools, search, leaderboards), but there is no way to visually confirm "I am on the homepage" beyond the URL bar. The homepage should have its own identity marker beyond the hero.

**B. Global search in the header is icon-only with no typeahead preview.** The desktop header has a search icon linking to `/search`. The `SearchTypeahead` component is lazy-loaded in the Header component but only renders as a disabled text input during loading. There is no inline search preview on the header -- users must navigate to a separate page. Most modern sports sites (ESPN, MaxPreps) have inline search with live results.

**C. "What's New" or changelog for returning users.** The beta banner acknowledges the site is in progress, but there is no way for a returning user to see what changed. A lightweight changelog or "new features" indicator would retain engaged users and demonstrate momentum.

**D. Player comparison entry point from player profiles.** The Compare tool exists at `/compare` but there is no "Compare this player" button on individual player profiles. Users must manually navigate to Compare and search for both players. A contextual entry point from the player page would dramatically increase feature discovery.

**E. Onboarding flow for "My Schools."** The mobile bottom nav prominently features "My Schools" but the `OnboardingWrapper` is commented out in the root layout (`{/* <OnboardingWrapper /> */}`). First-time users tapping "My Schools" likely hit a dead end or empty state with no guidance on how to follow schools.

**F. Loading skeletons for sport hub pages.** The homepage has `<Suspense fallback={<SkeletonCard />}>` for scores and articles, but the sport hub pages use `Promise.allSettled` in a single server component without streaming boundaries. If the 11 parallel fetches take 2+ seconds, the user sees nothing until all resolve.

**G. 404/not-found page with navigation.** No custom `not-found.tsx` was found in the app directory. Users who hit a bad URL get a default Next.js 404 with no way to recover to the main site experience.

---

### 6. REDUNDANT

**A. Three separate sport listing patterns.** Sports are listed in: (1) `ALL_SPORTS` array in Header, (2) `SPORTS` array in MobileBottomNav, (3) `SportNavigationGrid` on homepage, (4) sport pill links on `/players`, (5) sport switcher on `/search`, (6) sport links in Footer. Each defines its own colors, emojis, and order independently. A single shared `SPORTS_CONFIG` constant should be the source of truth.

**B. Two different score display components.** `HomeScoresSection` on the homepage and `HubScoresStrip` on sport hub pages both show recent games with different designs and different data-fetching logic. The homepage version is a vertical card list; the hub version is a horizontal strip. While visual variation is fine, the data-fetching and game label logic should be shared.

**C. "Schools" appears in 4 navigation locations simultaneously.** Desktop header has a direct "Schools" link. It is also inside the "More" dropdown. The mobile hamburger has it under "Quick Links." The mobile bottom nav's Menu overlay has it. One definitive location is enough.

**D. Footer's "The Pulse" section and header's Pulse references.** The Pulse route redirects to home, but the footer still has a dedicated Pulse section (Home, POTW, Power Rankings, Our Guys). The mobile hamburger has a Pulse section. These items are all reachable via other nav paths -- the "Pulse" brand creates a conceptual wrapper around features that do not actually live at a Pulse URL.

**E. Dual "Did You Know" usage.** `DidYouKnow` component appears on both the homepage sidebar AND every sport hub page. If the trivia is sport-scoped on hub pages and generic on homepage, this is acceptable but should be verified -- if it shows the same content, it is unnecessary repetition across adjacent pages a user would visit sequentially.

--------------------------------------------------------------------------------

## Agent 2: Information Architect

### 1. WHAT EXISTS

**Full Route Tree (131 page.tsx files)**

The site uses Next.js App Router with a `[sport]` dynamic segment as the primary organizational axis. Here is the complete route map:

**Sport-scoped routes (`/[sport]/...`)** -- 31 pages:
```
/[sport]                              -- Sport hub
/[sport]/all-city
/[sport]/awards
/[sport]/box-scores
/[sport]/breakouts
/[sport]/championships
/[sport]/coaches/[slug]
/[sport]/dynasties
/[sport]/eras
/[sport]/games/[gameId]
/[sport]/greatest-seasons
/[sport]/leaderboards
/[sport]/leaderboards/[stat]
/[sport]/leaderboards/schools
/[sport]/players/[slug]
/[sport]/playoffs
/[sport]/position-leaders/[position]
/[sport]/power-index
/[sport]/records
/[sport]/rivalries
/[sport]/rivalries/[rivalry]
/[sport]/schedule
/[sport]/schools/[slug]
/[sport]/schools/[slug]/staff
/[sport]/schools
/[sport]/standings
/[sport]/teams/[slug]/[season]
/[sport]/teams/[slug]
/[sport]/teams/[slug]/roster
/[sport]/teams
```

**Cross-sport / global routes** -- 60+ pages:
```
/                          /about              /advertise
/alumni                    /articles           /articles/[slug]
/awards                    /challenge          /class/[year]
/coaches                   /coaches/claim      /coming-soon
/community                 /compare            /compare/schools
/data-sources              /glossary           /history
/hof                       /hof/city-all-star  /hof/public-league
/hof/schools               /leaderboards       /leaderboards/trending
/links                     /login              /my-schools
/next-level/[slug]         /notifications      /our-guys
/our-guys/directory        /philly-everywhere  /pickem
/pipeline                  /players            /players/[slug]
/players/compare           /potw               /premium
/profile                   /pros               /pulse
/pulse/calendar            /pulse/forum        /pulse/forum/[postId]
/pulse/our-guys            /pulse/outside-the-215
/pulse/rankings            /pulse/recruiting   /rankings
/records-explorer          /recruit            /recruit-finder
/recruiting                /recruiting/portal  /release-form
/schools                   /schools/[slug]     /schools/[slug]/leaderboard
/scores                    /scores/live        /scores/report
/scores/schedule           /search             /settings/notifications
/signup                    /standings          /stats
/stats/season/[year]       /support            /teams
```

**Hardcoded sport route** -- 2 pages:
```
/football/city-all-star-game
/football/leaderboards/efficiency
```

**Admin routes** -- 22 pages (behind auth gate):
```
/admin                     /admin/analytics    /admin/api-keys
/admin/articles            /admin/articles/new /admin/articles/[slug]/edit
/admin/audit               /admin/awards-ceremony
/admin/claims              /admin/coaching     /admin/comments
/admin/conflicts           /admin/corrections  /admin/data
/admin/highlights          /admin/import       /admin/monitoring
/admin/our-guys            /admin/pickem       /admin/potw
/admin/pulse               /admin/recruiting   /admin/school-admins
/admin/social              /admin/sponsors     /admin/sync
/admin/widgets
```

**Navigation structure (3 tiers):**
1. **Global Header** (Header.tsx) -- Scores, Football dropdown (6 sub-items), Basketball dropdown (6 sub-items), More Sports dropdown (5 sports), Schools link, More dropdown (10 items), Search icon, Account dropdown
2. **Sport Sub-Nav** (SportNavTabs.tsx via `[sport]/layout.tsx`) -- Sticky tab bar with Hub, Leaderboards, Records, Championships, Awards (football-only), Box Scores, Standings, Schedule, Dynasties, Eras
3. **Mobile Bottom Nav** (MobileBottomNav.tsx) -- Home, Sports picker sheet, Vote (POTW), My Schools, Menu

**Breadcrumb system:** The `Breadcrumb` component (`/src/components/ui/Breadcrumb.tsx`) exists with JSON-LD schema support, mobile truncation, and auto-prepended Home link. Breadcrumbs are present on 50+ pages (confirmed via grep of 64 files importing Breadcrumb).

**Footer:** 5-column layout -- Sports (7 links), The Pulse (4 links), Tools (4 links), Support (4 links), About (4 links including Admin link).

---

### 2. KEEP

**A. The `[sport]` dynamic segment pattern is excellent.** A single `[sport]` route handles all 7 sports without code duplication. URLs like `/football/leaderboards/rushing` and `/basketball/leaderboards/scoring` are clean, guessable, and SEO-friendly. The layout.tsx automatically validates the sport param and renders SportNavTabs -- this is a well-engineered convention.

**B. The sport sub-navigation (SportNavTabs) is well-designed.** It is sticky, scrollable on mobile, and provides immediate access to 9-10 sport-specific sections without leaving context. The active state uses the gold pill highlight, giving strong wayfinding.

**C. Breadcrumbs with JSON-LD are properly implemented.** The Breadcrumb component auto-prepends Home, supports mobile truncation, and emits structured data for search engines. Player pages emit both BreadcrumbJsonLd and PersonJsonLd -- this is good SEO hygiene.

**D. Admin routes are properly secured.** The admin layout checks authentication AND authorization via a `checkAdminRole` function with fail-secure error handling. Non-admin users are redirected. The admin area uses a separate sidebar navigation (AdminSidebar) that is completely isolated from public navigation.

**E. Cross-linking from school hub to sport-specific school pages is strong.** The `/schools/[slug]` hub page links to each sport via `/${sport.sport_id}/schools/${slug}`, creating a natural hub-and-spoke pattern. Championship badges also cross-link to sport-specific school pages.

**F. Player pages cross-link to schools.** Player profiles show school name with breadcrumb links back to the sport hub and include RelatedArticles, SimilarPlayers, and MultiSportBanner components that create lateral navigation.

---

### 3. IMPROVE

**A. CRITICAL: Duplicate entity routes with divergent implementations.**

The site has TWO player profile routes:
- `/[sport]/players/[slug]` -- Full-featured (breadcrumbs, JSON-LD, career totals, game log, similar players, correction form, highlights, etc.)
- `/players/[slug]` -- Simplified legacy version (basic stats, missing breadcrumbs JSON-LD, uses raw Supabase client instead of data layer)

The same duplication exists for schools:
- `/[sport]/schools/[slug]` -- Sport-specific view
- `/schools/[slug]` -- Cross-sport hub view

And for leaderboards, standings, and teams (global versions at root level vs sport-scoped versions).

**FIX:** For players, `/players/[slug]` should redirect (301) to `/football/players/[slug]` or whichever sport is primary for that player. Currently a user could land on either page via search or direct link, getting vastly different experiences. For schools, the dual structure is intentional (hub vs sport-specific) but needs explicit cross-linking between them -- the school hub links DOWN to sport pages, but sport-specific school pages do not link UP to the hub.

**B. Navigation overflow -- the "More" dropdown is a dumping ground.**

The More dropdown currently holds 10 items: Schools, Rankings, Our Guys, Recruiting, Recruit Finder, Compare, Pipeline, Coaches, Pick'em, Hall of Fame. This is too many items with no grouping. Users cannot scan 10 unrelated items in a dropdown.

**FIX:** Group into two dropdowns: "Explore" (Schools, Rankings, Compare, Hall of Fame, Pipeline) and "Community" (Our Guys, Recruiting, Recruit Finder, Coaches, Pick'em). Or promote the highest-traffic items (Schools is already a top-level link; consider promoting Rankings or Our Guys).

**C. Mobile navigation is incomplete relative to desktop.**

The MobileBottomNav Menu sheet only exposes 6 links: Home, Schools, Scores, Leaderboards, The Pulse, Search. Desktop exposes 25+ destinations. The separate hamburger menu in the Header covers more but creates TWO mobile menu systems that compete.

**FIX:** Unify mobile navigation into a single system. The bottom nav should be the sole mobile nav, with the Menu sheet expanded to include sections matching the desktop: Sports, Scores, Explore, Community, Account.

**D. Breadcrumbs on sport-specific school pages lack the Schools parent link.**

The `/[sport]/schools/[slug]` breadcrumb reads: `Home > Football > Schools > [School Name]` but "Schools" has no `href` -- it is a text-only breadcrumb item, not a link. It should link to `/${sport}/schools`.

**FIX:** In the Breadcrumb items array on sport school pages, add `href: \`/${sport}/schools\`` to the "Schools" item.

**E. Navigation depth is inconsistent -- some content is 4+ clicks deep with no shortcut.**

Routes like `/football/rivalries/[rivalry]` and `/football/position-leaders/[position]` are not linked from any navigation component. They require knowing the URL or finding them through the sport hub page itself.

**FIX:** Add "Rivalries" and "Position Leaders" to the SportNavTabs or to the sport dropdown sub-items in the Header.

---

### 4. REMOVE

**A. `/players/[slug]` (root-level legacy player page).** This is a degraded duplicate of `/[sport]/players/[slug]`. It uses a raw Supabase client instead of the data layer, lacks JSON-LD, lacks breadcrumbs, and has fewer features. It should be replaced with a redirect to the sport-scoped version.

**B. `/standings` (root-level).** There is a global `/standings` page AND sport-scoped `/[sport]/standings`. The root-level version is not linked from any navigation. If it exists only as a redirect or placeholder, it should 301 to a default like `/football/standings`.

**C. `/teams` (root-level).** Same issue -- duplicates `/[sport]/teams` with no navigation path to it.

**D. `/stats` and `/stats/season/[year]`.** These are not linked from anywhere in the navigation. The only internal link to `/stats` is a self-reference from `/stats/season/[year]`. Either integrate these into the sport leaderboards or remove them.

**E. The Admin link in the Footer.** The footer exposes `/admin` to all users. While the route is auth-gated, exposing the admin entry point publicly is unnecessary. Remove the link; admins know the URL.

---

### 5. MISSING

**A. No "Back to School Hub" link on sport-specific school pages.** When a user views `/football/schools/roman-catholic`, there is no link to `/schools/roman-catholic` (the cross-sport hub). The parent school hub links DOWN to sport pages, but the sport pages do not link UP.

**B. No cross-sport navigation on player profiles.** The MultiSportBanner component exists for multi-sport athletes, but single-sport player pages have no way to discover related basketball/football pages for the same school. A "More from [School Name]" section would connect these.

**C. No "related games" or "next/previous game" navigation on game detail pages.** `/[sport]/games/[gameId]` is a dead end -- there is no link to the next game, previous game, or back to the team's season schedule.

**D. No sitemap-level discovery for deep content.** Pages like `/[sport]/eras`, `/[sport]/greatest-seasons`, `/[sport]/breakouts`, and `/[sport]/all-city` are not linked from any navigation element (header, footer, or sport sub-nav). They are only reachable from the sport hub page itself, making them invisible to users who navigate via the global header.

**E. `/pulse` sub-pages lack internal navigation.** The Pulse layout is an empty pass-through (`<>{children}</>`). There are 7 pulse sub-pages (forum, calendar, recruiting, rankings, our-guys, outside-the-215) with no shared tab bar or sidebar to navigate between them. Users must return to the Pulse hub to switch sections.

**F. No "You are here" indicator on the sport sub-nav for deep pages.** When viewing `/football/rivalries/cardinals-vs-prep`, the SportNavTabs shows no active state because "rivalries" is not one of the tab items. The user loses positional awareness.

**G. Search does not show in the Header nav items on mobile.** The search icon is in the desktop nav only; it appears in the mobile Menu sheet but not in the mobile bottom nav.

---

### 6. REDUNDANT

**A. Three parallel navigation systems on mobile.** (1) The hamburger menu in Header.tsx, (2) the MobileBottomNav component, and (3) the MobileBottomNav's Menu sheet. A user on mobile encounters overlapping access points with different link sets.

**B. Duplicate school directory at two URL levels.** `/schools` (global directory) and `/[sport]/schools` (sport-filtered directory) serve overlapping purposes. The global one is linked from the Header; the sport-specific one is linked from the sport sub-nav. Users may not realize they are different views.

**C. Overlapping recruiting features.** Four separate recruiting-related routes exist: `/recruiting`, `/recruit-finder`, `/recruit` (with its own layout), and `/recruiting/portal`. Additionally, `/pulse/recruiting` is a fifth entry point. These should be consolidated under a single `/recruiting` hierarchy.

**D. Overlapping comparison pages.** `/compare` and `/compare/schools` and `/players/compare` serve similar "compare" purposes but are scattered across the route tree. These should live under a unified `/compare` parent.

**E. Overlapping "Our Guys" pages.** `/our-guys`, `/our-guys/directory`, and `/pulse/our-guys` are three routes for what is conceptually one feature. Consolidate to `/our-guys` with sub-navigation.

**F. Duplicate content paths -- `/leaderboards` vs `/[sport]/leaderboards`.** The root `/leaderboards` page and the `/leaderboards/trending` page overlap with the 7 sport-specific `/[sport]/leaderboards` pages. The root version should either redirect or serve as a sport-picker landing.

---

### Summary of Priority Actions

| Priority | Issue | Impact |
|----------|-------|--------|
| P0 | Redirect `/players/[slug]` to `/[sport]/players/[slug]` | Eliminates degraded duplicate experience |
| P0 | Add Pulse sub-nav (tab bar in pulse/layout.tsx) | 7 pages currently disconnected |
| P1 | Unify mobile navigation into single system | Removes user confusion from 3 overlapping menus |
| P1 | Add "School Hub" backlink on sport school pages | Completes bidirectional cross-linking |
| P1 | Add Rivalries, Position Leaders to sport nav or dropdown | Makes deep content discoverable |
| P2 | Break up "More" dropdown into grouped sections | Reduces cognitive load |
| P2 | Consolidate recruiting routes under `/recruiting` | 5 routes to 1 hierarchy |
| P2 | Remove or redirect orphan root routes (`/standings`, `/teams`, `/stats`) | Eliminates dead-end pages |
| P3 | Add prev/next game navigation on game detail pages | Eliminates dead-end browsing |
| P3 | Remove Admin link from public footer | Minor security hygiene |

--------------------------------------------------------------------------------

## Agent 3: Mobile Experience Specialist

### 1. WHAT EXISTS

**Viewport and Foundation:**
- Proper viewport meta tag via Next.js `Viewport` export: `width: device-width, initialScale: 1, maximumScale: 5` -- allows pinch-to-zoom, which is correct.
- `body` has `overflow-x: hidden` to prevent horizontal scroll bleed.
- 80px bottom padding on `#main-content` via `mobile-nav-spacer.css` to prevent content from being hidden behind the fixed bottom nav. Removed at `md:` breakpoint.

**Dual Navigation System:**
- **Header** (`Header.tsx`): Desktop nav uses `hidden md:flex` -- fully hidden on mobile. A hamburger button (`md:hidden`) opens a slide-in panel from the right (280px, `mobile-nav-panel` class). Contains all 7 sports, Quick Links, Pulse, More, Account, and a Dark Mode toggle. Links have 44px min-height touch targets.
- **MobileBottomNav** (`MobileBottomNav.tsx`): Fixed bottom 5-tab bar (Home, Sports, Vote, My Schools, Menu) that shows `md:hidden`. Sports tab opens a bottom sheet with all 7 sports. Menu tab opens a separate bottom sheet with 6 quick links. Uses CSS Module classes from `homepage.module.css`.

**Table Strategy:**
- **DataTable** (`DataTable.tsx`): Simple table wrapped in `overflow-x-auto`. No mobile card mode. All columns always render.
- **SortableTable** (`SortableTable.tsx`): More sophisticated. Has a `hideOnMobile` column flag, a `mobileCardMode` boolean prop, and detects mobile via `window.innerWidth < 768`. In mobile card mode, renders cards instead of table rows with rank + primary value + lead stat prominently displayed, and up to 3 secondary stats below.
- **PlayerStatTable** (`PlayerStatTable.tsx`): Implements a full desktop/mobile split: `hidden md:block` for the full table, `md:hidden` for a card-based layout. Mobile cards show a 3-column grid of stats per season, with "best season" gold highlighting preserved.

**Responsive Typography:**
- `type-scale.css` uses `clamp()` for fluid type scaling between viewport sizes. H1 scales from 32px to 64px, body from 15px to 16px. Extra breakpoint at 374px for ultra-small screens. No hard breakpoints needed for most text.

**Touch Targets:**
- Global CSS applies 44x44px minimum to all `button`, `[role="button"]`, `a[href]`, inputs, selects. Additional `@media (hover: none) and (pointer: coarse)` block reinforces 44px minimums for touch devices specifically.

**Responsive Layout:**
- Main content grid (`espn-container`) goes from 2-column (content + 320px sidebar) to single-column at 900px.
- Sport grids go 4-col --> 3-col (1024px) --> 2-col (768px).
- Leaderboard mini cards (`ldr-grid`) go 3-col to 1-col at 700px.
- Stories grid goes 2-col to 1-col at 700px.

---

### 2. KEEP

**SortableTable mobileCardMode -- genuinely well done.** The card layout surfaces rank, primary name, and the lead stat value in gold at extra-large size, with secondary stats in a labeled key-value layout. This is exactly the right pattern for a stats-heavy site -- it trades horizontal density for vertical scannability. The `hideOnMobile` column flag is a smart escape hatch for less-important columns.

**PlayerStatTable desktop/mobile split.** Rendering season-by-season stats as individual cards with a 3-column stat grid on mobile is the correct approach. The gold "best season" highlighting and career totals row are preserved in both modes. This is well-executed.

**Dual nav architecture.** Having both a hamburger slide-in panel (for deep navigation) and a fixed bottom bar (for high-frequency actions) is the standard pattern used by ESPN, The Athletic, and similar sports apps. The bottom bar's sport picker as a bottom sheet rather than a page navigate is a good interaction decision -- it keeps users oriented.

**Touch target enforcement.** The global 44px minimums on all interactive elements, reinforced by a `pointer: coarse` media query, is thorough. The `overscroll-behavior: contain` on the mobile nav panel prevents the dreaded scroll-through-to-body issue.

**Fluid typography via clamp().** This avoids the "jump" between breakpoint-based font sizes and works seamlessly across the entire 320px-to-1440px range. The sub-375px override is a smart edge case catch.

---

### 3. IMPROVE

**3.1 -- DataTable has NO mobile handling.**
`/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/src/components/ui/DataTable.tsx` wraps the table in `overflow-x-auto` and calls it done. Every page that uses DataTable (rather than SortableTable) forces users to horizontal-scroll on mobile. This is especially problematic for box score tables and game log tables that may have 8-10 columns.

FIX: Either migrate all DataTable consumers to SortableTable with `mobileCardMode={true}`, or add an equivalent mobile card mode to DataTable. For box scores specifically, consider a "swipe between stat groups" pattern where rushing/passing/receiving each get their own horizontal pane.

**3.2 -- MobileBottomNav has TWO overlapping navigation systems.**
The hamburger menu in the Header AND the "Menu" bottom sheet in MobileBottomNav both provide full-site navigation. A user who taps the hamburger sees all 7 sports, Quick Links, Pulse, More, and Account. A user who taps the bottom-bar "Menu" sees Home, Schools, Scores, Leaderboards, Pulse, Search. These overlap but are NOT identical, creating confusion about which menu is authoritative.

FIX: Remove the hamburger from the mobile Header entirely. The bottom bar should be the sole mobile navigation entry point. The hamburger's comprehensive menu content should be rolled into the bottom bar's "Menu" sheet (which currently only shows 6 items).

**3.3 -- PlayerCompare side-by-side layout on mobile.**
`/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/src/components/compare/PlayerCompare.tsx` uses `grid-cols-1 md:grid-cols-2` for the search inputs (good), but the comparison bars and stat rows have no mobile adaptation. The `ComparisonBar` component renders two horizontal bars with a divider, which works on desktop but becomes cramped at 375px with stat labels, values, and bars all competing for space.

FIX: On mobile, stack the comparison vertically: Player 1 stat value above the bar, Player 2 stat value below. Or switch to a card-per-category layout where each stat category (Rushing, Passing, etc.) gets its own card with stacked bars.

**3.4 -- Hamburger button has incorrect HTML attribute.**
`/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/src/components/layout/Header.tsx` line 505-506: `min-height="44px"` and `min-width="44px"` are passed as HTML attributes, not style props. These do nothing -- they are not valid HTML attributes. The global CSS covers touch targets anyway, but this is dead code that should be cleaned up.

FIX: Remove the `min-height` and `min-width` attributes from the hamburger button element, or move them to a `style` prop.

**3.5 -- LeaderboardFilters stack only at sm: breakpoint.**
`/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/src/app/[sport]/leaderboards/[stat]/LeaderboardFilters.tsx` uses `flex-col sm:flex-row`. On a 375px phone, three `<select>` dropdowns (Season, League, School) will stack vertically, which is correct. But each select has no max-width constraint, so on tablets in landscape (600-768px) they can stretch awkwardly. Consider `max-width: 200px` on each filter on larger viewports.

**3.6 -- Footer links have reduced min-height (28px).**
`/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/src/app/globals.css` line 724: `.espn-footer a` has `min-height: 28px`, which is below the 44px WCAG target. The global 44px rule on `a[href]` should override this, but the specificity may conflict -- the footer sets it explicitly at 28px. On mobile, these closely-spaced footer links will be hard to tap accurately.

FIX: Remove the `min-height: 28px` from `.espn-footer a` or increase it to 44px. The footer's link density is fine on desktop but needs larger targets on touch devices.

---

### 4. REMOVE

**4.1 -- `hide-mobile` / `hide-desktop` utility classes.**
`/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/src/app/globals.css` line 735-737 defines `.hide-mobile` and `.hide-desktop` with a 768px breakpoint. These duplicate Tailwind's built-in `hidden md:block` and `md:hidden` classes, which are already used extensively throughout the codebase. These custom classes create a second, parallel responsive-hide system that diverges from the rest of the codebase's Tailwind patterns.

**4.2 -- Redundant mobile nav hide rules in globals.css (lines 742-792).**
The CSS block that hides `.nav-dd`, `.nav-link`, etc. on mobile via `@media (max-width: 768px)` is partially redundant with the `hidden md:flex` Tailwind class already applied to the desktop nav wrapper in Header.tsx. The desktop nav container itself is hidden, so hiding its children is unnecessary. However, some of these rules target elements outside the `hidden md:flex` wrapper (like `.logo-mark` font-size adjustments), so this block should be audited and pruned rather than fully removed.

---

### 5. MISSING

**5.1 -- No horizontal swipe indicator for overflow tables.**
When `overflow-x-auto` tables extend beyond the viewport, there is zero visual affordance telling users they can scroll horizontally. Users on mobile see a table that appears to be cut off at the right edge with no indication of more content. ESPN and similar sites use either a gradient fade on the right edge, a subtle "swipe for more" tooltip on first visit, or a horizontal scrollbar that is always visible (not the thin auto-hiding scrollbar that iOS uses by default).

RECOMMENDATION: Add a right-edge fade gradient (`linear-gradient(to right, transparent 90%, rgba(0,0,0,0.1) 100%)`) overlay on any `overflow-x-auto` container, or a `ScrollIndicator` component that shows directional arrows when content is clipped.

**5.2 -- No sticky column for data tables on mobile.**
When horizontal-scrolling through a leaderboard table with 8+ columns on a 375px screen, the player name (column 1-2) scrolls off-screen, leaving users looking at stat values with no context about which row belongs to which player.

RECOMMENDATION: Make the rank and player name columns `position: sticky; left: 0` with a background color and subtle right border shadow. SortableTable's `primary` column flag already identifies which column should be sticky -- the infrastructure is there, just not the CSS.

**5.3 -- No pull-to-refresh pattern.**
For a sports stats site where freshness matters (scores, standings), there is no pull-to-refresh gesture. ISR handles server-side freshness, but the perceived user experience on mobile would benefit from a manual refresh option, especially on score and standings pages.

**5.4 -- Search experience on mobile lacks a full-screen takeover.**
The search typeahead in the header is hidden on mobile (the desktop nav is `hidden md:flex`). Mobile users can reach search via the "Menu" bottom sheet link to `/search`, but there is no prominent search affordance in the bottom nav bar itself. For a database site with 57K players, search should be a first-class mobile action.

RECOMMENDATION: Replace the "Vote" (POTW) slot in the bottom nav with "Search", or add a search icon to the top header bar that opens a full-screen search overlay. POTW is a less frequently accessed feature than search on a data-heavy site.

**5.5 -- No safe area inset handling for notched phones.**
The fixed bottom nav does not account for `env(safe-area-inset-bottom)`, which means on iPhone X+ and similar notched/Dynamic Island devices, the bottom tab labels may be obscured by the home indicator bar.

RECOMMENDATION: Add `padding-bottom: env(safe-area-inset-bottom, 0)` to the `.mobileBottomNav` class and adjust the `#main-content` padding-bottom accordingly. Also add `viewport-fit=cover` to the viewport meta tag.

**5.6 -- No skeleton/loading states for mobile card views.**
The loading states in files like `src/app/[sport]/leaderboards/[stat]/loading.tsx` and `src/app/[sport]/players/[slug]/loading.tsx` use `overflow-x-auto` table-shaped skeletons. On mobile, users should see card-shaped skeletons matching the mobile card layout, not table-shaped ones that imply a desktop layout is coming.

---

### 6. REDUNDANT

**6.1 -- Two separate mobile menu implementations.**
The Header component renders a hamburger-triggered slide-in panel (`mobile-nav-panel`) with full navigation. The MobileBottomNav component renders a "Menu" button that triggers its own bottom-sheet menu. Both are visible on mobile, both serve as "full menu" entry points, but they have different content and styling. The hamburger panel uses dark navy theme (`espn-dark`), while the bottom sheet uses white background (`psp-white`). This is two codepaths for one job.

UNIFY: Keep MobileBottomNav's "Menu" bottom sheet as the sole comprehensive menu. Remove the hamburger icon from the mobile header. The header on mobile should show only the logo (left) and possibly a search icon (right).

**6.2 -- Touch target sizing is defined in three places.**
1. Global rule in `globals.css` (lines 373-412) applies 44px minimums unconditionally on all buttons and links.
2. A `@media (hover: none) and (pointer: coarse)` block (lines 820-851) re-applies the same 44px minimums specifically for touch devices.
3. Individual components like `.mobile-nav-panel a` and `.dd-menu a` each redundantly set `min-height: 44px`.

The global unconditional rule already covers everything. The media query block and per-component declarations are redundant. However, the global unconditional rule is arguably too aggressive -- it forces 44px on ALL links and buttons even on desktop, which inflates spacing throughout. The correct approach is: remove the unconditional global rules, keep the `@media (hover: none) and (pointer: coarse)` block for touch devices, and let desktop have natural sizing. This is a larger refactor but would fix layout density issues on desktop while maintaining touch compliance on mobile.

---

**Summary of highest-priority mobile fixes:**

| Priority | Issue | Effort |
|----------|-------|--------|
| P0 | Add sticky first columns to horizontal-scroll tables | Medium |
| P0 | Add horizontal scroll affordance (fade/indicator) | Low |
| P0 | Add `env(safe-area-inset-bottom)` to bottom nav | Low |
| P1 | Unify the two mobile menu systems | Medium |
| P1 | Add mobile card mode to DataTable or migrate to SortableTable | Medium |
| P1 | Add search to mobile bottom nav or header bar | Low |
| P2 | Fix footer link touch targets | Low |
| P2 | Fix hamburger button invalid HTML attributes | Trivial |
| P2 | Mobile-adapted loading skeletons | Low |

--------------------------------------------------------------------------------

## Agent 4: Performance Engineer

### 1. WHAT EXISTS

**Bundle composition:** 27 production dependencies including two AI SDKs (`@anthropic-ai/sdk`, `@google/genai`), six Nivo chart packages, `framer-motion`, `lottie-react`, `recharts`, `playwright`, `drizzle-orm`, and `postgres` alongside Supabase clients. Total estimated client-side weight of the charting + animation libraries alone is ~400-500 KB gzipped.

**Rendering strategy:** Roughly 67 files carry `'use client'` directives. However, most are correctly isolated as leaf-node client components (e.g., `BoxScoresView.tsx`, `LeaderboardFilters.tsx`, `ScheduleView.tsx`) while server-side page.tsx files remain RSC. About 40+ pages set `export const revalidate` for ISR (mostly 3600s). The homepage uses 300s ISR.

**Data fetching:** Supabase queries use React `cache()` extensively in `src/lib/data/` -- good request deduplication. Most queries have `.limit()` applied. Several Suspense boundaries are used on key pages (homepage, our-guys, leaderboards, standings, playoffs, schools).

**Dynamic imports:** 13 `dynamic()` usages for code-splitting heavy components (Nivo heatmap, comment sections, newsletter, search typeahead, charts, daily challenge).

**Cron jobs:** 7 Vercel cron jobs defined in `vercel.json` (tweet fetch every 30m, game scores daily, recap generation).

---

### 2. KEEP

**ISR revalidation strategy** -- well-tiered: 300s for live content (homepage, POTW, pick'em), 3600s for relatively static data pages, 86400s for static/archival pages. This is thoughtful and correct. `/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/src/app/page.tsx:14`

**React `cache()` wrapping on data fetchers** -- deduplicates Supabase calls within a single render pass. Seen across standings, preview, pulse, dynasties, pro-players, pickem, and many more modules. `/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/src/lib/data/standings.ts:42`

**`optimizePackageImports`** for Supabase, Drizzle, and Zod in `next.config.ts:23` -- prevents importing unused exports.

**Dynamic imports for heavy components** -- search typeahead, Nivo heatmap, comment sections, newsletter signup, and PhillyEverywhereSection are all lazy-loaded with `ssr: false` where appropriate. `/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/src/components/layout/Header.tsx:10`

**Image optimization config** -- AVIF + WebP formats, aggressive CDN caching (1 year TTL), responsive breakpoints. `/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/next.config.ts:33-42`

**Static asset caching headers** -- 1 year immutable for `_next/static`, fonts, and images. `/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/next.config.ts:69-97`

**Suspense boundaries on high-traffic pages** -- homepage, our-guys, leaderboards, standings, and schools all wrap data-dependent content in `<Suspense>` with skeleton fallbacks. `/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/src/app/page.tsx:133`

---

### 3. IMPROVE

**P0 -- `playwright` in production dependencies.** This is a browser automation framework (~70 MB+ installed) shipping as a prod dependency. It adds massive install size and is only used for local scraping.
- File: `/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/package.json:37`
- Fix: Move to `devDependencies` immediately. No source files import it.

**P0 -- Six Nivo packages for one component.** `@nivo/bar`, `@nivo/bump`, `@nivo/core`, `@nivo/heatmap`, `@nivo/line`, `@nivo/radar` are all in prod deps (~150 KB+ gzipped combined), but only `@nivo/line` and `@nivo/bar` are imported anywhere (one file: `CareerTrajectoryChart.tsx`). `@nivo/bump`, `@nivo/heatmap`, `@nivo/radar` have zero imports in source. The heatmap IS dynamically imported via `ClientStatHeatmap` so that one is used.
- Files: `/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/package.json:19-24`
- Fix: Remove `@nivo/bump` and `@nivo/radar` (zero imports). Keep `@nivo/bar`, `@nivo/line`, `@nivo/heatmap`, `@nivo/core`. Add all four to `optimizePackageImports` in `next.config.ts`.

**P0 -- `recharts` installed but never imported.** Zero import statements found anywhere in the codebase. ~200 KB gzipped wasted.
- File: `/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/package.json:42`
- Fix: Remove entirely.

**P1 -- `lottie-react` installed but never imported.** Zero import statements found. ~30 KB gzipped.
- File: `/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/package.json:34`
- Fix: Remove entirely.

**P1 -- `isomorphic-dompurify` installed but never imported.** Zero import statements found. ~50 KB gzipped (includes jsdom dependency for SSR).
- File: `/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/package.json:33`
- Fix: Remove entirely.

**P1 -- `dotenv` installed but never imported in app code.** Next.js handles `.env` loading natively; this is unnecessary overhead.
- File: `/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/package.json:29`
- Fix: Remove (or move to devDependencies if used in scripts).

**P1 -- `drizzle-orm` + `postgres` installed but never imported in app code.** All DB access goes through the Supabase client. These are dead weight (~60 KB combined).
- Files: `/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/package.json:30,38`
- Fix: Remove both (keep `drizzle-kit` in devDependencies if used for migrations).

**P1 -- Queries fetching 5,000-30,000 rows in user-facing pages.** Several queries pull enormous result sets that get processed client-side:
  - `awards-hub.ts:69` -- `.limit(25000)` for awards summary
  - `awards-hub.ts:194` -- `.limit(25000)` for all awards by type
  - `awards-hub.ts:343` -- `.limit(5000)`
  - `awards-hub.ts:407` -- `.limit(5000)`
  - `awards-hub.ts:448` -- `.limit(30000)`
  - `greatest-seasons.ts:51,185,308` -- `.limit(5000)` three times
  - `dynasty-tracker.ts:63,156` -- `.limit(5000)` twice
  - `awards.ts:454` -- `.limit(15000)`
  - Fix: Push aggregation logic into SQL/Postgres functions or views. Fetching 25K-30K rows over the wire to compute counts client-side is extremely wasteful. At minimum, use Supabase RPCs or `.select('award_type', { count: 'exact' })` with grouping.

**P1 -- `select('*')` on social queries without column projection.** Four instances in `social.ts:53,76,99,119` select all columns. While these tables are likely small, it is a bad pattern that will scale poorly.
- File: `/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/src/lib/data/social.ts:53,76,99,119`
- Fix: Specify only the columns needed.

**P2 -- Raw `<img>` tags instead of `next/image`.** Found in `SchoolLeaderboardTables.tsx:42,203` -- school logos rendered as raw `<img>` tags bypass Next.js image optimization (no AVIF/WebP, no size optimization, no lazy loading beyond the manual `loading="lazy"` attribute).
- File: `/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/src/app/[sport]/leaderboards/schools/SchoolLeaderboardTables.tsx:42,203`
- Fix: Replace with `next/image` using `width={24} height={24}`.

**P2 -- `next/image` used in only 12 files.** For a site with school logos, article thumbnails, and player avatars, this is low adoption. Many image renders likely use raw HTML or CSS backgrounds.
- Fix: Audit all image rendering and convert to `next/image`.

**P2 -- No `loading.tsx` files anywhere in the app directory.** While Suspense is used manually in some pages, Next.js `loading.tsx` convention provides automatic streaming for route segments. Missing entirely means route transitions show no loading state and the full page blocks until all data resolves.
- Fix: Add `loading.tsx` to at least the top 5 high-traffic route groups: `/`, `/[sport]/`, `/players/[slug]`, `/schools/[slug]`, `/leaderboards/`.

**P2 -- Duplicate security headers in middleware AND next.config.ts.** Headers like `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy` are set in BOTH `next.config.ts:49-66` (via `headers()`) AND `middleware.ts:340-350`. This means they are set twice on every non-API, non-static request.
- Files: `next.config.ts:49-66` and `middleware.ts:340-350`
- Fix: Consolidate to one location. Middleware is the better choice since it also handles CSP nonces.

**P2 -- `framer-motion` used in only 2 components.** This is a ~30 KB gzipped library imported in `SpotlightCard.tsx` and `TickerCrawl.tsx`. Both are sub-components of the `/our-guys` page.
- Fix: Either (a) replace with CSS animations/transitions for these simple use cases, or (b) add to `optimizePackageImports` and ensure both components are dynamically imported.

---

### 4. REMOVE

| Dependency | Reason | Estimated savings |
|---|---|---|
| `playwright` (line 37) | Zero app imports, scraping tool only | ~70 MB install, not bundled but slows CI |
| `recharts` (line 42) | Zero imports anywhere in codebase | ~200 KB gzipped bundle |
| `lottie-react` (line 34) | Zero imports anywhere in codebase | ~30 KB gzipped |
| `isomorphic-dompurify` (line 33) | Zero imports anywhere in codebase | ~50 KB gzipped |
| `@nivo/bump` (line 20) | Zero imports | ~20 KB gzipped |
| `@nivo/radar` (line 24) | Zero imports | ~20 KB gzipped |
| `dotenv` (line 29) | Next.js handles .env natively | ~5 KB |
| `drizzle-orm` (line 30) | Zero app imports, all queries use Supabase | ~40 KB |
| `postgres` (line 38) | Zero app imports | ~20 KB |

**Total estimated bundle savings: ~385 KB gzipped** (excluding playwright which only affects install/CI time).

---

### 5. MISSING

**No `loading.tsx` convention files.** Zero files found in the entire app directory. This is the single easiest win for perceived performance -- Next.js automatically wraps the page in a Suspense boundary using these files during navigation.

**No bundle size CI gate.** The `scripts/check-bundle-size.js` script runs post-build but there is no evidence of threshold enforcement or PR blocking. Dead dependencies like recharts and lottie-react would have been caught.

**`optimizePackageImports` is incomplete.** Missing: `lucide-react` (ships 1000+ icons, ~180 KB unoptimized), `framer-motion`, `@nivo/*`, `@tanstack/react-table`, `cmdk`, `fuse.js`. Adding `lucide-react` alone could save 50-100 KB.
- File: `/Users/admin/tedsilary.com/phillysportspack/psp-platform/next-app/next.config.ts:23-28`

**No Nivo chart packages in `optimizePackageImports`.** The Nivo ecosystem is notoriously large and should be tree-shaken aggressively.

**No `generateStaticParams` visible for dynamic routes.** Routes like `/players/[slug]` and `/schools/[slug]` with 55K+ and 738 entries respectively could benefit from pre-rendering the top N pages at build time.

**Cron routes referenced in `vercel.json` but no route files found via glob.** The directory structure exists (`fetch-tweets/`, `fetch-game-scores/`, etc.) with `route.ts` files, but they did not match the glob pattern, suggesting they may use a non-standard export or the directory nesting is off. Verify these actually deploy correctly.

**No `@next/bundle-analyzer` in dependencies.** The config references it conditionally (`next.config.ts:182`) but it is not in package.json -- it would fail if `ANALYZE=true` is set.

---

### 6. REDUNDANT

**Duplicate security headers.** Every non-static request gets `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, and `Referrer-Policy` set twice -- once from `next.config.ts:49-66` headers() and again from `middleware.ts:340-350`. The browser ignores duplicates but this is wasted processing and maintenance burden.

**Two charting libraries for the same purpose.** `recharts` (unused) and `@nivo/*` (partially used) both exist. Even if recharts were used, having two charting libraries doubles the bundle cost.

**Two AI SDKs in production.** `@anthropic-ai/sdk` and `@google/genai` are both production dependencies. These are likely only used in server-side API routes (cron/recap generation). They should not affect client bundle, but verify they are not accidentally imported in client components. If they are server-only, consider wrapping with `server-only` package to prevent client imports.

**Two database clients installed.** Supabase client (`@supabase/supabase-js` + `@supabase/ssr`) and Drizzle/Postgres (`drizzle-orm` + `postgres`). All runtime queries use Supabase. The Drizzle stack is dead code in production.

**Awards-hub fetches 25K rows to compute counts.** The function `getAwardsSummary` at `awards-hub.ts:66-69` fetches up to 25,000 `award_type` values and then loops through them in JavaScript to count by type. This should be a `SELECT award_type, COUNT(*) GROUP BY award_type` query -- a Supabase RPC or raw SQL call. The current approach transfers megabytes of redundant string data.

**Rate limiting code is copy-pasted 5 times in middleware.** Lines 193-269 and 271-322 repeat the same pattern for `/api/v1`, `/api/ai`, `/api/email`, `/login`, and `/api/auth`. This should be a single helper function called with different configs. While not a runtime performance issue, it makes the middleware ~200 lines longer than necessary, increasing edge cold-start parsing time.

--------------------------------------------------------------------------------

## Agent 5: Visual Design Critic

### 1. WHAT EXISTS

**Design Token System**: A well-structured CSS custom property system in `globals.css` covering colors (`--psp-navy`, `--psp-gold`, sport-specific), spacing (4px baseline scale from `--space-1` to `--space-20`), border radius scale (`--radius-xs` through `--radius-full`), shadow depth system, and transition timing tokens. This is genuinely thorough.

**Typography System**: Formalized in `type-scale.css` with seven tiers -- `psp-h1` (Bebas Neue, 32-64px clamp), `psp-h2` through `psp-h4` (DM Sans, progressively smaller), `psp-body`, `psp-small`, `psp-caption`, `psp-micro`. Fonts loaded via `next/font/google` with `display: swap`.

**Component Library**: 45+ UI components in `src/components/ui/` including `Card`, `Button`, `Badge`, `TabGroup`, `LeaderboardTable`, `EmptyState`, `SparkLine`, `WinLossBar`, `StatBlock`, `DataTable`, and multiple skeleton variants. Plus 30 homepage-specific components in `src/components/home/`.

**Color Palette Actually Used**:
- Navy: `#0a1628` (primary bg), `#0f2040` (card bg on dark), `#1a2d4a` (lighter navy)
- Gold: `#f0a500` (primary accent), `#f5c542` (hover state)
- Sport colors: Football green `#16a34a`, Basketball blue `#3b82f6`, Baseball red `#dc2626`, Track purple `#7c3aed`, Lacrosse cyan `#0891b2`, Wrestling amber `#ca8a04`, Soccer emerald `#059669`

**Dark/Light Mode**: Full `[data-theme="dark"]` implementation with `ThemeToggle` component, flipped gray scale, and class-based overrides for legacy `.widget`, `.ldr-card`, `.data-table` styles.

**Accessibility Layer**: 44x44px minimum touch targets on all interactive elements, `focus-visible` gold outlines, `sr-only` utility, `forced-colors` high-contrast support, `prefers-reduced-motion` support, ARIA roles on tabs/tables/skeletons.

---

### 2. KEEP

**The gold-on-navy hero treatment in HeroMonument.tsx** -- The gradient overlay on the banner image (`rgba(10,22,40,0.85)` left to `rgba(10,22,40,0.3)` center) creates a cinematic, ESPN-broadcast feel. The gold top accent line with blur glow is a subtle signature touch. The stat pills (`57,326 Players`, `44,384 Games`) in frosted glass (`bg-white/10 backdrop-blur-sm`) give immediate authority. This is the strongest visual moment on the entire site.

**The type scale system** -- The clamp()-based responsive scaling is production-grade. Having Bebas Neue reserved exclusively for H1/display and DM Sans for everything else creates clean typographic hierarchy without needing many weights. The `psp-caption` (12px uppercase semibold) and `psp-micro` (10px uppercase bold) classes for labels/badges are well-defined.

**Sport color coding** -- Each sport has a dedicated CSS variable (`--fb`, `--bb`, etc.) used consistently across navigation dots, shield badges, leaderboard headers, and hub borders. This creates instant visual wayfinding.

**The shield-shaped sport navigation** -- The `SportNavigationGrid` hexagonal clip-path badges with sport-colored glow effects on hover are distinctive and brand-aligned (matching the PSP shield logo concept). The two-row layout (top 3, bottom 4) creates natural hierarchy.

**Button component structure** -- Four variants (primary, secondary, outline, ghost) with three sizes, all enforcing 44px min touch targets, gold focus rings, and proper disabled states. This is a solid foundation.

**Loading skeletons** -- Multiple skeleton variants (`SkeletonCard`, `SkeletonTable`, `SkeletonAvatar`, `SkeletonText`) with proper ARIA busy states. The dark-mode-aware `SkeletonCard` in `src/components/ui/SkeletonCard.tsx` uses `bg-white/5` shimmer lines on navy, which feels native to the dark interface.

---

### 3. IMPROVE

**Brand color mismatch with stated identity**: The CLAUDE.md declares the brand palette as Liberty Blue `#1B2A4A`, Gold `#C5A55A`, Cream `#FFF8E7`. But the actual CSS uses Navy `#0a1628` (darker), Gold `#f0a500` (more saturated orange-gold), and no Cream anywhere. The implemented palette reads more ESPN-dark than the warmer, more distinguished brand spec. Either update the brand spec to match reality, or introduce `#FFF8E7` cream for card backgrounds and soften the gold toward `#C5A55A` for a more refined, less sports-bar feel.

**Inline style proliferation**: `HeroMonument.tsx`, `EmptyState.tsx`, `SportNavigationGrid.tsx`, and many others use `style={{}}` props alongside Tailwind classes. For example, `EmptyState` sets `padding`, `fontSize`, `marginBottom` via inline styles while also using Tailwind's `text-xl font-bold mb-2`. This creates maintenance fragility. Migrate all inline styles to either CSS custom properties or Tailwind utilities.

**Card component confusion**: The `Card.tsx` component uses white backgrounds (`bg-white rounded-xl border border-[var(--psp-gray-200)]`) -- a light-mode card. But the homepage cards use dark navy backgrounds (`bg-[var(--psp-navy-mid)]` with `border-gray-700/50`). The Card component is never used on the homepage. This means two card visual languages coexist -- one formal (the component) and one ad-hoc (inline Tailwind). Consolidate into Card variants: `Card variant="dark"` and `Card variant="light"`.

**The "EXPLORE BY SPORT" section spacing**: `py-12 px-4` padding creates 48px vertical space on a section that already lives between the hero and the content grid. Combined with the hero's bottom fade and the beta banner's `mt-4 mb-4`, this produces an uneven rhythm: hero -> 16px -> beta -> (-8px via -mt-2) -> sport nav (48px internal padding) -> 24px -> content grid. Standardize vertical section spacing to the declared `--psp-space-section: 5rem` or `--psp-space-subsection: 2.5rem` tokens, which currently go unused in actual layouts.

**Legacy CSS class soup**: `globals.css` contains extensive legacy ESPN-style classes (`.sec-head`, `.hl-item`, `.w-row`, `.ldr-card`, `.rt-row`, `.story`, `.espn-container`) alongside the modern token system. These use hardcoded values like `#f0f0f0`, `#fafafa`, `#ccc`, `#222` instead of CSS variables, and use pixel values (`padding: 10px 14px`) instead of the spacing scale. This creates two parallel design systems in one file. Audit which legacy classes are still referenced and migrate them to use tokens, or remove them.

**Empty state visual on dark backgrounds**: `EmptyState.tsx` renders with `text-navy` heading color, which is invisible on navy backgrounds. It also uses a 3.5rem emoji which looks informal for a data-driven platform. Replace with custom SVG empty-state illustrations that use the gold/navy palette.

**The WinLossBar/StatBlock assume light backgrounds**: `WinLossBar` uses `color: 'var(--psp-navy)'` for its text and legend, which disappears on the dark sport hub pages. `StatBlock` similarly hardcodes `color: "var(--psp-navy)"`. Both need dark-mode-aware color resolution.

---

### 4. REMOVE

**The beta banner gradient circles**: The two decorative `div` circles in the beta banner (`w-32 h-32 bg-[var(--psp-gold)]/5 rounded-full -translate-y-1/2`) are invisible at 5% opacity on the already-dark gradient. They add DOM nodes and complexity for zero visual payoff. Remove them.

**Double-occurrence homepage hero components**: The `src/components/home/` directory contains `HeroSection.tsx`, `HeroSectionNew.tsx`, AND `HeroMonument.tsx`. Only `HeroMonument` is imported in `page.tsx`. The other two are dead code that creates confusion about which is canonical. Delete `HeroSection.tsx` and `HeroSectionNew.tsx`.

**Redundant skeleton components**: There is a `SkeletonCard` in `src/components/ui/SkeletonCard.tsx` (dark-mode-aware, navy bg) AND a `SkeletonCard` exported from `src/components/ui/Skeleton.tsx` (light-mode, white bg). Two components with the same name doing different things. Remove the one that does not match the primary design direction.

**The legacy `.espn-container` grid**: `grid-template-columns: minmax(0, 1fr) 320px` with `max-width: 1200px` is superseded by the Tailwind `max-w-7xl mx-auto` + `grid grid-cols-1 lg:grid-cols-4 gap-6` pattern used on the actual homepage. The CSS class just bloats the stylesheet.

---

### 5. MISSING

**Consistent section headers**: The homepage uses ad-hoc heading patterns -- `psp-h4 text-gray-100` for "Our Guys," `psp-h2 text-center` for "EXPLORE BY SPORT," inline `text-sm font-bold` for sidebar cards. There is no `SectionHeader` component that enforces a consistent pattern (icon + title + "View All" link + optional badge). Build one and use it everywhere.

**Data visualization beyond tables**: For a stats database, the visual treatment of numbers is surprisingly plain. The `SparkLine` component exists but is 80x24px and rarely surfaced. Missing: bar charts for season comparisons, radar charts on leaderboards, trend arrows on key stats, heat maps for shooting percentages, comparison overlays. The leaderboard page particularly needs visual richness -- right now it is pure tabular data.

**Micro-interactions and stat emphasis**: When a user lands on a leaderboard showing someone with 2,847 rushing yards, that number should feel big. Currently stats render in the same 12-13px tabular font as everything else. Add a `StatHighlight` treatment -- larger font, gold underline, maybe a subtle background glow -- for primary stat values.

**Photo/image fallback system**: The CLAUDE.md mentions player photos are planned with initials-on-sport-colored-circle fallbacks, but there is no `PlayerAvatar` component in `src/components/ui/`. The `SkeletonAvatar` exists for loading but there is no actual avatar renderer. Build a `PlayerAvatar` that handles: photo URL, initials fallback (sport-colored circle), and loading skeleton state.

**Page transition/animation system**: The site has `fadeInUp` and `fadeIn` keyframes but no systematic entrance animations. When navigating between pages, content pops in without any choreography. Add staggered fade-in-up for card grids (already have `animate-fade-in-up` class but it is not systematically applied).

**Mobile bottom navigation visual polish**: `MobileBottomNav` is imported in the layout but I did not see its implementation. Mobile sports apps live or die by bottom nav quality -- it needs clear active states, sport-color badges, and a prominent search/quick-access pattern.

**Visual distinction between "live" and "historical" data**: The site mixes current season scores with decades-old archival stats. There is no visual signal differentiating them. A subtle timestamp badge or "historical" watermark would prevent user confusion.

---

### 6. REDUNDANT

**Three hero components for one hero slot**: `HeroMonument.tsx` (used), `HeroSection.tsx` (dead), `HeroSectionNew.tsx` (dead) represent different visual approaches to the same page area. This is design debt from iteration without cleanup.

**Two card styling systems**: The `Card.tsx` component (white bg, light borders, shadow-sm) vs. the inline Tailwind dark cards (`bg-[var(--psp-navy-mid)] rounded-lg border border-gray-700/50`) on the homepage represent two unreconciled visual languages. The dark cards look correct for the site's identity. The white Card component appears to be left over from a light-mode-first phase.

**Two skeleton card implementations**: `src/components/ui/SkeletonCard.tsx` (standalone, dark-aware) vs. `SkeletonCard` exported from `src/components/ui/Skeleton.tsx` (light-mode). Both are importable. A developer grabbing the wrong one gets a jarring visual mismatch.

**Parallel spacing systems**: The CSS defines both `--space-1` through `--space-20` AND `--psp-space-section` through `--psp-space-xs`, while actual components use neither -- instead relying on Tailwind's `gap-6`, `p-4`, `mt-4 mb-4`, `py-12`. Three spacing vocabularies, zero consistency enforcement.

**Legacy + modern dark mode**: The `[data-theme="dark"]` block in `globals.css` has class-based overrides (`.ldr-card`, `.widget`, `.data-table`) that target legacy ESPN-style classes. But modern components use Tailwind's `dark:` prefix or explicit CSS variable references. These two dark-mode approaches create conflicting specificity and make theme debugging difficult.

**Redundant color declarations**: `type-scale.css` re-declares `--psp-navy`, `--psp-gold`, `--psp-navy-mid`, `--psp-gray-dark`, `--psp-gray-light` in its own `:root` block, duplicating what `globals.css` already defines. If these ever drift apart, the type scale will render with different colors than the rest of the site.

--------------------------------------------------------------------------------

## Agent 6: Content Strategist

### 1. WHAT EXISTS

**Page Inventory: 120 page.tsx files total (30 sport-dynamic routes under `[sport]/`, 20+ admin pages, 70+ public pages)**

**Metadata Coverage: Strong.** 85+ pages export `metadata` or `generateMetadata`. The root layout provides a solid title template (`%s` pattern) and default OG image. Dynamic routes (`[sport]/page.tsx`, `[sport]/players/[slug]/page.tsx`, `articles/[slug]/page.tsx`, `schools/[slug]/page.tsx`) all use `generateMetadata` with sport-specific titles, descriptions, canonical URLs, OG images, and Twitter cards.

**SEO Infrastructure:**
- `src/app/sitemap.ts` -- Comprehensive dynamic sitemap covering homepage, sport hubs, championships, records, awards, leaderboards, school pages, player pages, coach pages, articles, and games with box scores. Uses `Promise.allSettled` with error handling. Well-structured priorities (1.0 home, 0.9 sport hubs, 0.7 players, 0.5 games).
- `src/app/robots.ts` -- Properly blocks `/admin`, `/api`, `/login`, `/signup`, `/profile`, `/_next`, `/*.json$`.
- `src/components/seo/JsonLd.tsx` -- Extensive structured data library: `BreadcrumbJsonLd`, `OrganizationJsonLd`, `ArticleJsonLd`, `WebSiteJsonLd`, plus sport-specific types. Used in 49 files.
- Dynamic OG images at `opengraph-image.tsx` for root, `[sport]/`, `[sport]/players/[slug]/`, `[sport]/schools/[slug]/`.
- 38 pages have canonical URLs set via `alternates`.

**Content Systems:**
- **Articles** (`/articles/`) -- Full CMS with pagination, sport filters, dynamic metadata, `ArticleJsonLd`, prev/next pagination links for SEO.
- **Our Guys** (`/our-guys/`) -- AI recaps, score ticker, coach corner, news rail, DidYouKnow, school pipeline ranking. Strong metadata.
- **Hall of Fame** (`/hof/`) -- Landing + 3 sub-pages (public-league, city-all-star, schools). 165 inductees.
- **Pulse sub-pages** -- Calendar, forum (with individual post pages), recruiting, outside-the-215.
- **Scores** (`/scores/`) -- Full scoring system with filters, pagination, schedule sub-page, live scoring page, report page.
- **Data Sources** (`/data-sources/`) -- Transparency page about Ted Silary archives, MaxPreps, PIAA.

**Redirect Hygiene:** 6 redirect pages properly route legacy paths: `/community` -> `/`, `/pulse` -> `/`, `/alumni` -> `/our-guys`, `/coming-soon` -> `/`, `/pulse/rankings` -> `/rankings`, `/pulse/our-guys` -> `/our-guys`.

**Voice Pattern:** The site uses a professional sports database voice. The About page uses Mike's conversational tone. Sport hubs are data-forward. Our Guys page has the most personality with sports-bar theming.

---

### 2. KEEP

**Dynamic sitemap architecture.** The `sitemap.ts` is one of the best implementations I have seen on a Next.js project of this scale. It queries Supabase for all players, coaches, schools, articles, and games, builds sport-specific URLs, and handles errors gracefully with `Promise.allSettled`. This alone could generate tens of thousands of indexable URLs. Keep as-is.

**JSON-LD structured data coverage.** 49 files use structured data. Breadcrumb JSON-LD is on nearly every sub-page. Organization JSON-LD is in the root layout. Articles get Article schema. This is significantly above average for a sports site. Keep and extend.

**Dynamic `generateMetadata` on entity pages.** Player profiles, school pages, coach pages, articles, and game pages all generate unique titles, descriptions, and OG images from database content. This is the correct pattern for a data-heavy site and should remain.

**The Data Sources page** (`/data-sources/page.tsx`). This is a differentiator -- it establishes trust and provenance for the Ted Silary archives. Keep as a core trust signal.

**Our Guys page voice.** The sports-bar theming with the LED ticker, AI recaps, and coach corner is the most distinctive content on the site. It reflects the Philly energy the brand promises and is a clear differentiator from generic stats databases.

**404 page.** Has metadata, search box, and sport navigation links. Well-built for user recovery.

---

### 3. IMPROVE

**3a. Pages missing metadata entirely (high SEO impact).**
The following public-facing pages have NO `metadata` or `generateMetadata` export and will inherit only the generic root layout title:

| Page | File | Fix |
|------|------|-----|
| Hall of Fame landing | `src/app/hof/page.tsx` | Add `export const metadata` with title, description, canonical |
| Login | `src/app/login/page.tsx` | Add metadata (even though noindex, title still shows in browser tab) |
| Signup | `src/app/signup/page.tsx` | Add metadata |
| Profile | `src/app/profile/page.tsx` | Add metadata |
| Notifications | `src/app/notifications/page.tsx` | Add metadata |
| Recruit form | `src/app/recruit/page.tsx` | Add metadata |
| Compare schools | `src/app/compare/schools/page.tsx` | Add metadata |
| Coaches claim | `src/app/coaches/claim/page.tsx` | Add metadata |
| My Schools | `src/app/my-schools/page.tsx` | Has metadata but no `alternates.canonical` |

The HOF landing page is the most critical miss -- it is a major content hub with no title, description, or OG tags.

**3b. Canonical URL gaps.** Only 38 of 85+ pages with metadata set canonical URLs. Every indexable page should have `alternates: { canonical: ... }`. Notable gaps: `/glossary`, `/hof/*`, `/challenge`, `/pickem`, `/records-explorer`.

**3c. "Coming Soon" thin content on indexable pages.** Several pages are in the sitemap or have metadata but display only placeholder content:

- `/[sport]/playoffs` -- Shows "Playoff Brackets Coming Soon" when no data exists.
- `/[sport]/rivalries` -- Shows "Coming Soon" empty state for sports without rivalry data.
- `/[sport]/leaderboards/[stat]` -- Shows "Coming Soon" for stats without data.
- `/[sport]/championships` -- Has a "Coming Soon" section.
- `/hof/schools` -- Shows "Coming Soon -- Full inductee database".
- `/premium` -- "Coming Soon: payment processing" (3 instances).
- `/support` -- "PAYMENT PROCESSING COMING SOON".
- `/pickem` -- "Games coming soon".
- `/pulse/outside-the-215` -- "Transfer Tracking Coming Soon".

**Fix:** Either (a) add `noindex` meta to pages that are entirely placeholder, or (b) fill them with at least a paragraph of contextual content explaining what will be there and linking to related pages. Google will penalize thin "coming soon" pages in rankings.

**3d. Voice inconsistency.** The About page and Our Guys page have the conversational, passionate Philly tone Mike wants. But the majority of sub-pages (leaderboards, records, championships, eras, dynasties) use dry, generic sports database language. There is no editorial voice layer on these data pages -- no intro paragraphs, no contextual storytelling, no "why this matters" framing. The sport hub pages (`[sport]/page.tsx`) do better with sections like DesignBibleSections and DidYouKnow, but the deeper pages feel like Excel exports.

**Fix:** Add 2-3 sentence editorial intros to every category page template. Example: instead of just listing rushing leaders, add a line that contextualizes the data.

**3e. OG image coverage is incomplete.** Dynamic OG images exist only for root, sport hubs, player profiles, and school pages (5 `opengraph-image.tsx` files). High-traffic pages like `/articles`, `/leaderboards`, `/our-guys`, `/hof`, `/scores`, `/rankings` have no custom OG image generation and fall back to the default. When these are shared on social media, they all look identical.

**Fix:** Add `opengraph-image.tsx` files for at least `/articles/[slug]/`, `/hof/`, `/scores/`, and `/our-guys/`.

---

### 4. REMOVE

**4a. Duplicate sitemap entries.** The sitemap at `src/app/sitemap.ts` line 348 and line 409 both add `/our-guys` -- it appears twice in the same sitemap output. Remove the duplicate at line 409.

**4b. Dead redirect pages that could be route rewrites.** The pages `/community/page.tsx`, `/coming-soon/page.tsx`, `/alumni/page.tsx`, `/pulse/page.tsx`, `/pulse/our-guys/page.tsx`, `/pulse/rankings/page.tsx` are all single-line redirect files. These work fine functionally but add 6 file-system entries that do nothing. Consider moving these to `next.config.js` redirects to keep the `/src/app` directory cleaner and avoid unnecessary server-side execution.

**4c. Premium page.** `/premium/page.tsx` advertises premium features with "Coming Soon: payment processing" in multiple places. Since the site's stated design decision #2 is "Ad-supported, free for all -- no paywalls," this page creates brand confusion. Either repurpose it as a supporter/donation page or remove it entirely.

---

### 5. MISSING

**5a. No blog/content calendar strategy.** The `/articles` system exists and is well-built, but there are only ~9 articles seeded. For SEO, a Philly HS sports site needs regular content: weekly game recaps, season previews, historical deep dives, recruiting updates. The article CMS is ready; the content pipeline is not.

**5b. No FAQ or schema FAQ markup.** There is no FAQ page or FAQ JSON-LD anywhere on the site. A FAQ answering common questions ("How do I find my player profile?", "What years does the database cover?", "How are stats calculated?") would help with featured snippets on Google.

**5c. No `SportsEvent` structured data for games.** Game pages (`[sport]/games/[gameId]/page.tsx`) have `generateMetadata` but no JSON-LD for `SportsEvent` schema. Adding this would enable Google rich results for game scores.

**5d. No `Person` structured data for player profiles.** Player pages use `generateMetadata` but no `Person` or `Athlete` JSON-LD schema. This is a major SEO opportunity given 57K+ player pages.

**5e. No internal linking strategy from data pages.** The leaderboard, records, and championship pages present data tables but do not link contextually to related content. A rushing leader table should link to that player's profile, their school's page, and any related articles. This cross-linking is the single biggest content strategy improvement available.

**5f. No `class/[year]` metadata.** The graduating class pages (`/class/[year]/page.tsx`) do have `generateMetadata`, but the sitemap does not include class year pages. These are highly searchable terms ("Philly high school class of 2025") and should be in the sitemap.

**5g. No schema for `DataCatalog` or `Dataset`.** Given the site's unique value proposition as a database, adding Google's Dataset structured data would make the platform discoverable via Google Dataset Search.

**5h. Missing `/next-level` landing page.** The sitemap references `/next-level` (line 418) but there is no `/next-level/page.tsx` -- only `/next-level/[slug]/page.tsx`. This URL will 404 for users and crawlers.

---

### 6. REDUNDANT

**6a. Duplicate content across root-level and sport-scoped pages.** Several routes exist at both the root level and under `[sport]/`:
- `/schools/page.tsx` AND `/[sport]/schools/page.tsx` -- Two school directories
- `/leaderboards/page.tsx` AND `/[sport]/leaderboards/page.tsx` -- Two leaderboard entries
- `/standings/page.tsx` AND `/[sport]/standings/page.tsx` -- Two standings pages
- `/teams/page.tsx` AND `/[sport]/teams/page.tsx` -- Two teams directories
- `/players/[slug]/page.tsx` AND `/[sport]/players/[slug]/page.tsx` -- Two player profile routes
- `/scores/page.tsx` AND `/[sport]/box-scores/page.tsx` -- Overlapping score content

The root versions appear to be sport-agnostic hubs that aggregate across sports. This is not inherently bad, but without canonical tags pointing from one to the other, Google may see these as duplicate content. Fix: ensure root-level pages use distinct titles/descriptions from sport-scoped pages, and cross-link clearly rather than duplicating content.

**6b. About page is actually a homepage clone.** The About page at `/about/page.tsx` imports the same components as what appears to be an alternative homepage design (`HeroSectionNew`, `LiveStatsStrip`, `SportNavigationGrid`, `RecentScores`, `LatestArticles`, `NewsletterCTA`). This is not a traditional About page -- it is a second homepage layout. This creates confusion for users expecting mission/team/history content and dilutes SEO because two URLs serve similar content. Fix: make `/about` a true About page (mission, Ted Silary story, team bios, data methodology) and remove the homepage widget imports.

**6b. Duplicate `/our-guys` in sitemap** (noted above in REMOVE).

--------------------------------------------------------------------------------

## Agent 7: Accessibility Auditor

### 1. WHAT EXISTS

**Semantic Structure (Good Foundation)**
- `html lang="en"` is set correctly on the root element (`layout.tsx:93`)
- Proper landmark hierarchy: `<header>`, `<nav aria-label="Main navigation">`, `<main id="main-content">`, `<footer aria-label="Site footer">`
- Footer uses multiple `<nav>` elements with distinct `aria-label` values ("Sports navigation", "The Pulse navigation", "Tools navigation", "Support navigation")
- Skip-to-content link present at top of body (`layout.tsx:145-149`) with `sr-only` + `focus-visible` reveal pattern

**ARIA Usage (Extensive)**
- Desktop dropdown menus use `role="menu"` / `role="menuitem"` with `aria-haspopup`, `aria-expanded`, `aria-label`
- Live region for dropdown state announcements (`aria-live="polite"` on visually hidden div, `Header.tsx:253-270`)
- Loading states use `role="status"` with `aria-busy="true"` across all loading.tsx skeleton pages
- Emoji characters wrapped in `role="img"` with `aria-label` throughout (scores, sport layouts, leaderboards)
- Sort indicators marked `aria-hidden="true"` in SortableTable
- `aria-sort` on sortable column headers
- Correction form uses `aria-required`, `aria-invalid`, `aria-describedby`, `role="alert"` on error messages

**Keyboard Navigation**
- Arrow key navigation (Up/Down/Home/End) implemented for dropdown menus (`Header.tsx:101-138`)
- Arrow key support (Enter/Space) on dropdown trigger buttons (`Header.tsx:142-177`)
- Escape key closes dropdowns and mobile menu
- Focus trap implemented on mobile menu with Tab/Shift+Tab cycling (`Header.tsx:206-248`)
- Focus return to hamburger button on mobile menu close
- Left/Right arrow keys for TabGroup component (`TabGroup.tsx:41-60`)
- Sortable table headers keyboard-accessible via Enter/Space

**Color & Contrast**
- `--psp-gold-text: #b87900` defined explicitly as a text-safe gold with 4.5:1 contrast on white (`globals.css:10`)
- Focus indicators: `2px solid var(--psp-gold)` with `outline-offset: 2px` on all interactive elements
- High contrast mode support via `@media (forced-colors: active)` (`globals.css:452-478`)
- `forced-color-adjust: none` on form elements with `CanvasText`/`Highlight` system color fallbacks

**Motion**
- `@media (prefers-reduced-motion: reduce)` disables all animations and transitions site-wide (`globals.css:1476-1493`)
- Covers `animation-duration`, `animation-iteration-count`, `transition-duration`, `scroll-behavior`

**Tables**
- `scope="col"` used in 17 components across the codebase
- SortableTable and DataTable both accept `ariaLabel` prop and render `<caption className="sr-only">`
- SortableTable announces sort changes via `aria-live="polite"` region

**Forms**
- CorrectionForm has proper `htmlFor`/`id` pairings on all labels, `aria-required`, `aria-invalid`, `aria-describedby` linking inputs to error divs
- NewsletterSignup uses `sr-only` label for inline variant
- CompareSearchForm uses `htmlFor` associations

**Images**
- `SchoolLogo.tsx` provides `alt={name + " logo"}`
- Article images use article title as alt text
- Hero image has descriptive alt text

**Testing**
- Dedicated accessibility test suite exists at `src/__tests__/accessibility/axe-audit.test.tsx` covering landmarks, ARIA attributes, form accessibility, table structure, toast/notification patterns, and image alt text

---

### 2. KEEP

**Skip-to-content link** (`layout.tsx:145-149`). Properly hidden with `sr-only`, reveals on `focus-visible` with high-contrast gold styling. This is a textbook WCAG 2.4.1 (Bypass Blocks) implementation.

**Dropdown keyboard navigation** (`Header.tsx:101-177`). Full ArrowDown/ArrowUp/Home/End/Escape support with `role="menu"`/`role="menuitem"` and auto-focus on first item when opened. Satisfies WCAG 2.1.1 (Keyboard) and aligns with WAI-ARIA Menu pattern.

**Mobile menu focus trap** (`Header.tsx:206-248`). Traps Tab cycle within open panel, returns focus to hamburger on close, Escape dismissal. Proper WCAG 2.4.3 (Focus Order) behavior.

**`prefers-reduced-motion` blanket rule** (`globals.css:1476-1493`). Universal reduction of all animations and transitions. Satisfies WCAG 2.3.3 (Animation from Interactions).

**Forced-colors media query** (`globals.css:452-478`). Explicit Windows High Contrast Mode support is rare and commendable. Addresses WCAG 1.4.11 (Non-text Contrast) edge cases.

**SortableTable sort announcements** (`SortableTable.tsx:252-260`). Screen reader gets a live-region announcement when sort column/direction changes. Excellent WCAG 4.1.3 (Status Messages) compliance.

**Dedicated a11y test file**. Having `axe-audit.test.tsx` demonstrates a commitment to automated regression testing for accessibility patterns.

**`aria-current="page"`** on active navigation links throughout Header and dropdown menus. Correct WCAG 2.4.8 (Location) signal.

---

### 3. IMPROVE

**3.1 -- ScoreTicker auto-scrolling animation has no pause mechanism**
`ScoreTicker.tsx:96` applies `animation: tickerScroll ... linear infinite` with no way for users to pause, stop, or control the scrolling content. Although `prefers-reduced-motion` will kill the animation globally, users who do not have that preference set but still have difficulty reading moving text have no recourse.
- WCAG 2.2.2 (Pause, Stop, Hide) -- AA
- FIX: Add a pause/play button to the ticker, or provide a static alternative. At minimum, add `:hover` pause via `animation-play-state: paused`.

**3.2 -- Mobile bottom nav dialogs lack focus trap**
`MobileBottomNav.tsx:101-147` (sport picker) and `MobileBottomNav.tsx:150-203` (menu overlay) use `role="dialog"` + `aria-modal="true"` but have NO focus trap implementation. Keyboard users can Tab behind the modal into the main page content.
- WCAG 2.4.3 (Focus Order) -- AA
- FIX: Implement focus trap (like the one in Header.tsx mobile menu) for both dialog sheets. Also return focus to the trigger button on close.

**3.3 -- Many inline tables lack `aria-label` or `<caption>`**
Tables at `schools/[slug]/page.tsx:627,700,768`, `next-level/[slug]/page.tsx:362,463`, `standings/page.tsx:76`, `schools/SchoolsDirectory.tsx:519`, `compare/schools/page.tsx:189`, `our-guys/PipelineTable.tsx:20`, `football/city-all-star-game/page.tsx:338,590`, and others have `<table>` without any `aria-label` or `<caption>`.
- WCAG 1.3.1 (Info and Relationships) -- A
- FIX: Add `aria-label` describing the table purpose on every `<table>`, or use a visible/sr-only `<caption>`.

**3.4 -- Several `scope="col"` missing on `<th>` elements**
Tables at `standings/page.tsx`, `schools/SchoolsDirectory.tsx`, `AllStarArchive.tsx`, and `recruiting/RecruitFinderClient.tsx` have `<th>` elements without `scope="col"` or `scope="row"`.
- WCAG 1.3.1 (Info and Relationships) -- A
- FIX: Add `scope="col"` to all `<th>` in `<thead>`, `scope="row"` to any row header cells.

**3.5 -- Search icon link missing accessible name**
`Header.tsx:452` uses an SVG inside a `<Link>` with `title="Search"` but no `aria-label`. The `title` attribute is inconsistently exposed by screen readers.
- WCAG 1.1.1 (Non-text Content) -- A
- FIX: Add `aria-label="Search"` to the Link, or add `<span className="sr-only">Search</span>` inside it.

**3.6 -- Hamburger button uses non-standard HTML attributes**
`Header.tsx:505-506` has `min-height="44px"` and `min-width="44px"` as HTML attributes on `<button>`, which are invalid HTML. These do nothing; the actual tap target sizing should be via CSS.
- WCAG 2.5.8 (Target Size) -- AA
- FIX: Move `min-height` and `min-width` into the `style` prop or className.

**3.7 -- `RecruitFinderClient.tsx` labels not associated with inputs**
`RecruitFinderClient.tsx:246,405` uses `<label>` elements without `htmlFor` attributes and without wrapping their associated inputs.
- WCAG 1.3.1 (Info and Relationships) / 4.1.2 (Name, Role, Value) -- A
- FIX: Add `htmlFor` pointing to the input `id`, or nest the input inside the `<label>`.

**3.8 -- `PlayerCompare.tsx` and `ComputedMetricsPanel.tsx` labels not associated**
`PlayerCompare.tsx:351` and `ComputedMetricsPanel.tsx:343` use `<label>` without `htmlFor`.
- WCAG 1.3.1 / 4.1.2 -- A
- FIX: Same as 3.7.

**3.9 -- Color-only differentiation in leaderboard top-3 highlighting**
`SortableTable.tsx:299-308` uses background colors (`bg-yellow-50`, `bg-gray-100`, `bg-orange-50`) to distinguish top-3 rows, and `LeaderboardTable.tsx:205-211` uses gold color for top-3 stat values. Color alone signals rank importance.
- WCAG 1.4.1 (Use of Color) -- A
- FIX: Add a visual icon, badge, or text indicator (like a medal icon or bold rank number) alongside the color distinction.

**3.10 -- `ContributorLeaderboard.tsx` uses username as alt text for avatar**
`ContributorLeaderboard.tsx:58` sets `alt={contributor.username}`. If the avatar is decorative (username is already displayed as text nearby), this creates redundant speech output for screen readers.
- WCAG 1.1.1 (Non-text Content) -- A
- FIX: If the username is displayed as visible text alongside the image, use `alt=""` for the avatar. If not, the alt text is appropriate.

---

### 4. REMOVE

**4.1 -- `role="table"` on `<table>` elements (in test file)**
`axe-audit.test.tsx:241` tests for `role="table"` on a `<table>`. This is redundant -- `<table>` inherently has the table role. While the production code does not appear to use this, the test is asserting a pattern that should not be replicated.
- FIX: Remove `role="table"` from test assertions; ensure no production tables add it.

**4.2 -- `role="button"` on clickable `<tr>` rows**
`DataTable.tsx:70` and `SortableTable.tsx:313` add `role="button"` to `<tr>` elements when rows are clickable. A `<tr>` with `role="button"` overrides its implicit row semantics, which harms table navigation for screen reader users. JAWS and NVDA will no longer announce it as a table row.
- FIX: Instead of `role="button"`, keep the row semantics and make the primary cell content (e.g., player name) a clickable link. Add a visually hidden "View details" link in each row if needed.

**4.3 -- `role="navigation"` on mobile menu overlay**
`Header.tsx:520` uses `role="navigation"` on the mobile menu div. Since this is a modal overlay (with `aria-modal="true"`), the appropriate role is `dialog`, not `navigation`. Using both creates conflicting semantics.
- FIX: Change to `role="dialog"` (which is already used in MobileBottomNav.tsx for the same pattern).

**4.4 -- `aria-live="polite"` on the search loading placeholder**
`Header.tsx:17` has `aria-live="polite"` on the disabled placeholder input. This is misused -- a static disabled input should not be a live region. It will not announce anything meaningful and creates noise.
- FIX: Remove `aria-live="polite"` from the placeholder input.

---

### 5. MISSING

**5.1 -- No visible focus indicator for mobile bottom nav items**
`MobileBottomNav.tsx` uses CSS module classes but there is no evidence of focus styling for the bottom nav buttons/links. The global `focus-visible` outline may not reach these due to CSS module specificity.
- WCAG 2.4.7 (Focus Visible) -- AA
- ADD: Explicit `:focus-visible` styles in `homepage.module.css` for `.mobileNavItem`.

**5.2 -- No `aria-label` on Score Ticker links**
`ScoreTicker.tsx:33` renders game links with only visual text (team abbreviations and scores). Screen readers would announce a confusing stream of abbreviations and numbers with no context.
- WCAG 2.4.4 (Link Purpose) -- A
- ADD: `aria-label` on each TickerItem Link, e.g., `aria-label="FB: Roman Catholic 28 at St. Joe's Prep 21 - FINAL"`.

**5.3 -- No landmark or heading for ScoreTicker region**
The score ticker at `layout.tsx:154` sits between header and main with only `aria-label="Live and recent scores"` on its inner div but no landmark role.
- WCAG 1.3.1 -- A
- ADD: Wrap in `<aside aria-label="Live and recent scores">` or `role="region"` so landmark navigation can reach/skip it.

**5.4 -- No error summary pattern on forms**
`CorrectionForm.tsx` shows inline errors but has no error summary at the top of the form after submission. Users with screen readers may not notice individual field errors.
- WCAG 3.3.1 (Error Identification) -- A
- ADD: After form submission with errors, render an error summary with links to each invalid field inside a `role="alert"` container.

**5.5 -- No `aria-label` on the live-updating dot in ScoreTicker**
`ScoreTicker.tsx:92` renders an animated pulsing dot with no accessible name. Screen readers cannot convey "live game in progress."
- WCAG 1.1.1 -- A
- ADD: `aria-hidden="true"` on the dot span (since the "LIVE" text label beside it already conveys the meaning), or add `aria-label="Live"` and `role="img"`.

**5.6 -- No skip mechanism for the score ticker**
When the ticker is visible, keyboard users must Tab through every game link before reaching main content. The skip-to-content link jumps to `#main-content`, but the ticker sits after the header and before main.
- WCAG 2.4.1 (Bypass Blocks) -- A
- ADD: Ensure the ticker is either inside `<header>` (before skip target) or add `tabIndex="-1"` on ticker links and make them accessible via a separate "View scores" link only.

**5.7 -- No `aria-describedby` for StatTooltip abbreviations**
`StatTooltip.tsx` renders stat abbreviation tooltips in leaderboard headers but these are likely hover-only with no keyboard or screen reader access to the expanded definition.
- WCAG 1.3.1 / 4.1.2 -- A
- ADD: Use `aria-describedby` linking the `<th>` to a hidden description element, or use `<abbr title="...">` with tooltip on focus.

**5.8 -- Mobile menu links missing `aria-current`**
`Header.tsx:536-569` mobile menu links do not include `aria-current="page"` like their desktop counterparts do.
- WCAG 2.4.8 (Location) -- AAA (best practice for AA)
- ADD: Same `aria-current={isActive(href) ? "page" : undefined}` pattern used on desktop links.

---

### 6. REDUNDANT

**6.1 -- Both `aria-label` AND `<caption>` on the same table**
`SortableTable.tsx:262-263` and `DataTable.tsx:42-43` set `aria-label={ariaLabel}` on `<table>` AND a `<caption className="sr-only">{ariaLabel}</caption>` inside it. This causes screen readers to announce the table name twice.
- FIX: Use one or the other. Prefer `<caption>` (it is the semantic way) and remove `aria-label` from the `<table>` element.

**6.2 -- `role="img"` + `aria-label` on every emoji**
While wrapping emojis in `role="img"` is technically correct, the site uses this inconsistently -- some emojis in mobile nav (`MobileBottomNav.tsx:51,63,83,95`) have no `role="img"` while others in the scores page do. This creates an inconsistent experience.
- FIX: Standardize. Either wrap all emoji in `<span role="img" aria-label="...">` or use a utility component. For decorative emoji, use `aria-hidden="true"`.

**6.3 -- Duplicate `nav` landmark with "Mobile navigation" label**
Both `Header.tsx:520` and `MobileBottomNav.tsx:43` use `aria-label="Mobile navigation"`. Two different `<nav>` elements with the same label confuse screen reader landmark lists.
- FIX: Differentiate them: "Mobile sidebar menu" vs "Mobile bottom navigation".

---

**Summary of Priority Fixes (by impact):**

| Priority | Issue | WCAG | File(s) |
|----------|-------|------|---------|
| HIGH | Mobile bottom nav dialogs missing focus trap | 2.4.3 AA | MobileBottomNav.tsx |
| HIGH | `role="button"` on `<tr>` breaks table semantics | 4.1.2 A | DataTable.tsx, SortableTable.tsx |
| HIGH | Score ticker links have no accessible names | 2.4.4 A | ScoreTicker.tsx |
| HIGH | Score ticker missing pause control | 2.2.2 AA | ScoreTicker.tsx |
| MEDIUM | ~15 tables missing `aria-label`/`<caption>` | 1.3.1 A | Multiple page files |
| MEDIUM | Several `<label>` elements not associated with inputs | 1.3.1 A | RecruitFinderClient, PlayerCompare, ComputedMetricsPanel |
| MEDIUM | Mobile menu uses `role="navigation"` instead of `role="dialog"` | Semantic correctness | Header.tsx |
| MEDIUM | Duplicate table name (aria-label + caption) | Redundancy | SortableTable.tsx, DataTable.tsx |
| LOW | Invalid HTML attributes on hamburger button | Validity | Header.tsx |
| LOW | Mobile menu links missing `aria-current` | 2.4.8 AAA | Header.tsx |

--------------------------------------------------------------------------------

## Agent 8: Dave Portnoy

### 1. WHAT EXISTS

Alright. I just roamed this site top to bottom. Here is what I actually found when I showed up as a normal human being who does not care about your Supabase schema.

**130 page files.** One hundred and thirty. For a site about Philly high school sports that has approximately zero active users. This is a dude in a studio apartment who bought furniture for a 12-bedroom mansion.

**The Homepage:** Dark navy, gold accents, big hero saying "57,326 Players / 44,384 Games / 756 Schools." That is a LOT of data being promised. But when I scrolled, I got skeleton loaders. The actual content sections -- scores, articles, POTW widget -- they are server-rendered but when fetched they show loading states. The sidebar has an "Our Guys" section (pro alumni), a Pick'em promo, Power Rankings link, and a Did You Know widget. There is a beta banner explaining the site is still being built. You are TELLING me it is beta instead of SHOWING me it is good.

**Football / Basketball Sport Hubs:** These are dynamic route pages under `[sport]`. They have tabs for Overview, Teams, Leaderboards, Records, Championships, Playoffs, Awards, Schedule. That is 8 navigation tabs. When I fetch them, they render skeleton loaders. The code fetches real data from Supabase -- season phases, compound leaders, record watch, standings -- but it is all gated behind loading states that the static fetch does not resolve.

**Pulse:** Redirects to homepage. Dead route.

**Players:** A static page with 7 sport pills and 7 sport cards that link to leaderboards. Zero actual player content on the page itself. It is a routing page, not a destination.

**POTW (Player of the Week):** Has a voting UI, shows nominees with vote buttons, past winners sidebar. But when I visited, nominees were empty -- "Nominations Open Monday." Outside of football/basketball season, this page is a ghost town.

**Recruiting:** The most depressing page on the site. Shows "0 College commits, 0 D1 athletes, 0 Pro players." Four sections all say "No data available." The only thing that works is a link to the Recruit Finder. This page is actively embarrassing.

**Hall of Fame:** THIS is the best page on the site. Real content. Ted Silary tribute. Five HOF organizations. A featured legends carousel with Wilt Chamberlain, Dawn Staley, Leroy Kelly. A real quote at the bottom. This page has SOUL.

**Challenge (Daily Challenge):** "Who Had the Better Season?" -- compare two players, pick who was better. The concept is solid. But when I visited, it showed loading skeletons. If this actually works, it could be sticky. Big if.

**Next Level:** 404. Dead. The route exists as a dynamic `[slug]` page for individual profiles but the index page does not exist.

**Other pages I found:** Pros ("Before They Were Famous"), Pipeline (college placement map), Philly Everywhere (alumni tracking), Our Guys, Coaches, Compare, Records Explorer, Schools, Standings, Pick'em, Articles, Glossary, Data Sources, Advertise, Premium ($5/month "Coming Soon"), Profile, Settings, Login, Signup, Recruit (form), Release Form, Links, History, Stats, Scores, Leaderboards, Rankings, My Schools, Notifications, Feed, RSS, Sitemap... 

Plus the entire `[sport]` dynamic tree with 25 sub-routes each for 7 sports. That is 175 sport-specific pages. For SEVEN SPORTS where only two (football, basketball) have real data.

### 2. KEEP

**Hall of Fame page.** This is the ONLY page that made me feel something. Wilt Chamberlain went to Overbrook. Dawn Staley went to Dobbins. That is REAL. That is GOOSEBUMPS. That is the kind of content someone screenshots and posts on Twitter. The Ted Silary tribute adds gravity. This is the emotional core of the site and it should be way more prominent.

**The data itself.** 57K players, 82K box scores, 25+ years of history. That is a legitimate moat. Nobody else has this. MaxPreps does not go back to 1990. The Philadelphia Inquirer did not archive this. One man (Ted Silary) compiled it and one man (Mike) is digitizing it. That is the story. That is the hook.

**Daily Challenge concept.** "Who Had the Better Season?" is a simple, shareable mechanic. If it works, a user spends 30 seconds, shares their result, and maybe comes back tomorrow. That is a daily active user loop. KEEP this but make it actually load.

**Sport hub structure.** The tabbed navigation (Teams, Leaderboards, Records, Championships) is solid information architecture. The leaderboard and records pages, when populated, give you the kind of stat-nerd arguments that drive engagement. Who led the Public League in rushing in 2004? That is the kind of question this site should answer instantly.

**Our Guys / Pros concept.** Tracking where Philly kids ended up playing pro or college ball is emotionally compelling. "Before They Were Famous" is a great angle.

### 3. IMPROVE

**The homepage needs a REASON to exist.** Right now it is: hero stats, beta warning, sport grid, loading skeletons. There is no headline. No story. No "here is what happened this week." No argument-starting take. The homepage should open with the most interesting thing in the database RIGHT NOW -- a record that was broken, a player comparison, a stat that makes you say "wait, really?" Instead it opens with a beta disclaimer. Lead with the goods.

**Sport hubs need to actually render content on first load.** Server-side rendered pages should not show skeleton loaders when fetched statically. If the data is in Supabase, render it at build time or at ISR time. A visitor hitting /football should see standings, recent scores, and a top performer -- not animated gray boxes.

**Recruiting page needs to be hidden until it has data.** Showing "0 College commits, 0 D1 athletes, 0 Pro players" is worse than not having the page. Either populate it from the next_level_tracking table (which HAS 2,224 rows) or remove it from navigation.

**POTW needs off-season content.** When there are no nominees, the page says "Nominations Open Monday." That is a dead end 8 months of the year. Show all-time POTW winners, throwback picks, something. Do not leave a page empty.

**Players page is a routing page pretending to be a destination.** It shows 7 sport cards that link to leaderboards. That is not a players page. That is a menu. Put a search bar front and center. Show trending players. Show recently viewed. Make it a DESTINATION.

**Challenge needs to work.** If the daily challenge is broken or always loading, it is worse than nothing. This should be the fastest page on the site -- static data, client-side interaction, zero loading state.

### 4. REMOVE

**Cut 80+ pages immediately.** You have 130 page files. A site with zero active users needs maybe 15-20 pages that WORK, not 130 pages that are half-built. Here is what gets the axe:

- **Premium page** -- You have zero users and you are already showing a paywall? Delete.
- **Community / Coming Soon** -- Both redirect to homepage. Delete the files.
- **Pulse** -- Redirects to homepage. Delete.
- **Alumni** -- Redirects to /our-guys. Delete.
- **Notifications, Settings, Profile, My Schools, Feed** -- These are user-account features for users who do not exist. Hide them until you have 100 real accounts.
- **Recruit (form), Release Form, Coaches Claim** -- Forms that nobody is filling out. Hide until there is demand.
- **Advertise** -- You have no traffic. Nobody is buying ads. Delete.
- **Glossary, Data Sources, Links, History** -- Deep reference pages that zero visitors will find. Move to a single "About" page or delete.
- **Minor sport sub-routes (Soccer, Lacrosse, Track, Wrestling)** -- You admitted these have "thinner data, simplified templates." Having 25 sub-routes per sport for 5 sports with barely any data is insane. Show these sports on a single overview page each. No sub-routes until there is substance.
- **Compare, Records Explorer, Stats** -- Power-user tools for power users who do not exist yet. Hide behind the sport hub pages rather than top-level routes.
- **Pickem** -- "Games coming soon." Delete until games exist.
- **Standings, Rankings** -- Duplicate concepts. Pick one.

**Kill the beta banner.** Calling yourself beta is an excuse. Either the site works or it does not. Nobody bookmarks a beta.

### 5. MISSING

**A single shareable moment.** There is not ONE thing on this site I would screenshot and tweet. Not one. Here is what would change that:

- **"On This Day" feature.** "On this day in 2003, Imhotep's [player] dropped 42 points against Roman Catholic." That is a tweet. That is a push notification. That is a reason to come back.
- **Head-to-head rivalry pages.** Roman vs Prep. Imhotep vs Neumann-Goretti. Show the all-time series record, biggest upsets, best individual performances. That is ARGUMENT FUEL. People will share these and fight about them.
- **Stat that makes you go "WHAT?"** Surface the wildest stats in the database. "Did you know [school] has produced 14 NFL players?" Put this on the homepage, not buried in a Did You Know widget.
- **School pride leaderboard.** "Which school's fans are the most active on PSP?" Let schools compete for engagement. Give people a reason to rep their school.
- **Embeddable player cards.** Let coaches, parents, and recruits embed a stat card on Twitter, in emails, on recruiting profiles. This is how you go viral. A parent shares their kid's card. That kid's whole network sees it. Free distribution.
- **Game recap narratives.** Even auto-generated: "Lincoln beat Frankford 72-58 behind Jamal's 31 points." Right now scores exist as raw data. Turn them into micro-stories.
- **Mobile-first everything.** These pages are built desktop-first. A Philly HS sports fan is checking this from the bleachers on their phone. The homepage hero, the sport hubs, the player profiles -- they need to be FAST and touch-friendly first, desktop second.

### 6. REDUNDANT

**Three different alumni-tracking concepts that do the same thing:**
- `/our-guys` -- "Our Guys" tracking alumni
- `/philly-everywhere` -- "Philly Everywhere" tracking alumni
- `/pros` -- "Before They Were Famous" tracking pro alumni
- `/next-level` -- "Next Level" tracking (broken/404)
- `/alumni` -- Redirects to /our-guys
- `/pipeline` -- College pipeline map

That is SIX routes for "where did Philly kids end up playing." Pick ONE. Call it "Our Guys." Have tabs for Pros, College, Coaching. Done.

**Recruiting has three entry points:**
- `/recruiting` -- Recruiting Central (empty)
- `/recruit` -- Self-submit form for athletes
- `/recruit-finder` -- Search tool for coaches
- `/recruiting/portal` -- Recruiter portal

Four routes. Zero users on any of them. Consolidate.

**Rankings/Standings/Power Rankings** -- Three different concepts for "who is good." Rankings, Standings, and Power Rankings all exist as separate pages. Pick one, do it well.

**Leaderboards exist at three levels:**
- `/leaderboards` -- Global
- `/[sport]/leaderboards` -- Per sport
- `/[sport]/position-leaders` -- Per position per sport
That is fine architecturally but confusing for a user who just wants to see who led the city in touchdowns.

---

**BOTTOM LINE:** This site has an incredible data asset -- 57K players, 25 years of history, stuff nobody else has. But it is buried under 130 half-built pages, zero energy on the homepage, and a bunch of features built for users who do not exist yet. The Hall of Fame page proves this CAN have soul. The Daily Challenge proves there CAN be engagement hooks. But right now you are building a 130-room hotel when you should be running a 10-seat restaurant where every dish is perfect and every customer tells their friends.

**The Portnoy Verdict:**
- Would I scroll the homepage? No. Beta banner killed it.
- Would I click through on a player? Maybe, if search worked and the profile loaded.
- Would I argue about a leaderboard? Yes -- IF it actually rendered.
- Would I share a game recap? There are no recaps to share.
- Would I come back tomorrow? Not today. But if the Daily Challenge worked and "On This Day" existed? Maybe.

**Fix 10 pages. Delete 100. Add one viral feature. Then we talk.**

--------------------------------------------------------------------------------

================================================================================
# PANEL 2: DATABASE OPTIMIZATION
*Agents 9-12: Schema Architecture, Query Performance, Data Integrity, Scalability*
================================================================================

## Agent 9: Schema Architect

### 1. WHAT EXISTS

**94 tables in public schema**, organized into these functional groups:

**Core Entity Tables (7):** `regions` (3 rows), `sports` (8), `leagues` (7), `seasons` (141), `schools` (1,364), `players` (68,602), `coaches` (63)

**Game/Season Tables (8):** `games` (47,439), `team_seasons` (8,507), `game_player_stats` (163,504), `football_player_seasons` (33,774), `basketball_player_seasons` (23,100), `baseball_player_seasons` (11,167), `rosters` (44,122), `league_seasons` (4,173)

**Voting/POTW System (9):** `potw_nominees`/`potw_votes`/`potw_winners`, `gotw_nominees`/`gotw_votes`/`gotw_winners`, `plyw_nominees`/`plyw_votes`/`plyw_winners`

**Content (7):** `articles` (10), `article_mentions` (0), `comments` (0), `events` (0), `daily_polls` (1), `poll_votes` (20), `photos` (0)

**Community/User (8):** `user_profiles` (0), `forum_posts` (5), `forum_replies` (8), `forum_likes` (0), `email_subscribers` (5), `email_logs` (0), `coming_soon_signups` (0), `player_reactions` (4)

**Recruiting (4):** `recruiting_profiles` (2), `recruiting_offers` (10), `recruiting_updates` (20), `recruiting_interest` (8)

**Next Level / HOF (7):** `next_level_tracking` (2,278), `nlt_game_performances` (5), `ai_recaps` (2), `coach_stat_focus` (15), `hof_organizations` (5), `hof_inductees` (165), `player_hof_badges` (165)

**Records/Rankings (7):** `records` (1,285), `record_validations` (44), `championships` (1,727), `power_rankings` (37), `rivalries` (12), `rivalry_notes` (6), `rivalry_records` (12)

**Pick'em (4):** `pickem_weeks` (1), `pickem_games` (7), `pickem_picks` (0), `pickem_leaderboard` (0)

**Playoffs (2):** `playoff_brackets` (90), `playoff_bracket_games` (689)

**Career Aggregation / MVs (6):** `football_career_leaders` (20,251), `basketball_career_leaders` (13,153), `baseball_career_leaders` (6,793), `player_career_summary` (40,817), `season_leaderboards` (87,059), `search_index` (54,743)

**Utility / System (7):** `badges` (10), `user_badges` (0), `colleges` (228), `positions` (30), `social_handles` (40), `transfers` (0), `player_merge_log` (605)

**Caches / Derived (5):** `precomputed_cache`, `game_scores_cache` (59), `school_directory_mv` (1,292), `mv_dynasty_tracker` (1,287), `mv_rivalry_tracker` (4,794)

**Staging Tables (4):** `_bb_fix_staging` (1,000), `_bb_standings_staging` (0), `_sql_staging` (0), `_epa_passing_yards_fix` (286)

**Other (5):** `team_alltime_records` (341), `team_mapping` (192), `team_season_stats` (6,965), `team_season_notes` (129), `player_news_cache` (0), `city_allstar_games` (0), `city_allstar_participants` (0), `community_leagues` (4), `weekend_recaps` (8), `did_you_know` (25), `notifications` (0), `cron_logs` (0), `corrections` (0), `player_claims` (0), `player_highlights` (0), `coach_claims` (0), `school_pipeline_grades` (112), `game_of_the_week` (0)

**FK Coverage:** 160+ foreign key constraints across the schema. Well-structured relational model overall.

**PK Strategy:** Mixed -- `regions` and `sports` use varchar natural keys (good for readability). All other tables use `serial` integer PKs.

---

### 2. KEEP

**A. Hybrid sport-specific stat tables.** `football_player_seasons`, `basketball_player_seasons`, `baseball_player_seasons` each have sport-specific typed columns (rush_yards, ppg, era etc.) while `player_seasons_misc` handles minor sports via JSONB. This is the correct approach -- typed columns give you indexing, validation, and query simplicity for the 3 major sports, while JSONB handles the long tail without schema explosion.

**B. Soft delete pattern.** `deleted_at` on players, schools, coaches, articles. This is essential for a sports archive where entities should never truly disappear (merged schools, graduated players, etc.).

**C. Unique constraints on composite keys.** `football_player_seasons(player_id, season_id, school_id)`, `team_seasons(school_id, season_id, sport_id)`, `games` dedupe constraints, `pickem_picks(user_id, game_id)`. These prevent duplicate data at the DB level.

**D. `game_player_stats` as a unified box score table.** 163,504 rows across all sports with `sport_id` discriminator plus JSONB `stats` field. This correctly unifies per-game stat queries while the sport-specific season tables handle typed aggregation.

**E. `search_index` with 54K entries.** Centralized FTS with `pg_trgm` support. Good decision for a platform with 68K players and 1,364 schools.

**F. `player_merge_log` (605 rows).** Tracking player deduplication history is essential for data integrity when you've done 6 tiers of dedup work.

**G. The HOF subsystem.** `hof_organizations` -> `hof_inductees` -> `player_hof_badges` is cleanly normalized. Good FK from `player_hof_badges` to both `players` and `hof_inductees`.

**H. The playoff bracket model.** `playoff_brackets` -> `playoff_bracket_games` with self-referencing `next_game_id` FK is a correct tree structure for tournament brackets.

---

### 3. IMPROVE

**A. `game_player_stats` vs Drizzle schema mismatch.**
The Drizzle schema defines `football_game_stats` and `basketball_game_stats` as separate typed tables (lines 410-454 of schema.ts), but the actual production database uses a single `game_player_stats` table (163,504 rows) with a `sport_id` discriminator. The typed game-stat tables likely exist in the DB but are either empty or unused. **Decision needed:** Either (1) migrate all data into the typed tables (better query safety, indexes by sport) or (2) drop the typed tables from Drizzle and standardize on `game_player_stats`. Recommendation: Keep `game_player_stats` since it works and has 163K rows. Remove `football_game_stats` and `basketball_game_stats` from the Drizzle schema if they're empty.

**B. `pickem_weeks` missing sport_id FK in Drizzle but has it in DB.**
The FK query shows `pickem_weeks.season_id -> seasons` and `pickem_weeks.sport_id -> sports`, but the Drizzle schema (line 787-798) defines `season: integer` and `weekNumber: integer` with no `sport_id` or `season_id` FK. The Drizzle schema is outdated -- it needs to be regenerated or manually updated to match the actual DB.

**C. `pickem_leaderboard` uses `season: integer` (raw year) instead of `season_id` FK.**
But the FK query shows it DOES reference `seasons` and `sports`. The Drizzle schema (line 832-846) is inconsistent -- it has `season: integer("season")` (a raw number) but the DB has a proper FK. Update the Drizzle field name from `season` to `season_id` or align naming.

**D. Region denormalization.** `region_id` appears on `players`, `coaches`, `championships`, `awards`, `records`, `power_rankings`, `team_seasons`, `games`, `search_index`. Every one of these entities already connects to a school, which connects to a region. The `region_id` on child tables is redundant and creates update anomalies. **However**, for a read-heavy sports platform with no plans for multi-region, this denormalization is acceptable for query performance. Mark it as intentional, not accidental.

**E. `player_highlights` has FK to `sport_id` and `season_id` in DB but Drizzle schema (lines 745-763) references `sport_id` and `season` as varchar.** The DB FK query shows `player_highlights.season_id -> seasons` and `player_highlights.sport_id -> sports`. Drizzle defines `season: varchar("season")` which mismatches. The Drizzle schema needs updating.

**F. `photos` table has FK to `game_id`, `school_id`, `season_id`, `sport_id` in the DB but the Drizzle schema (lines 852-866) uses a generic `entityType`/`entityId` polymorphic pattern with no FKs.** The DB is more constrained than Drizzle knows. Drizzle schema needs updating.

**G. The `game_scores_cache` table (59 rows) is referenced by `nlt_game_performances.game_id`.** This is a design smell -- NLT performances should reference the `games` table (47K rows), not a cache table. The cache could be dropped or rebuilt without notice, orphaning NLT performance records.

**HOW:** Run `npx drizzle-kit introspect` to generate a fresh Drizzle schema from the live DB, then diff against `src/db/schema.ts` to find all mismatches.

---

### 4. REMOVE

**A. Staging tables (4) -- DROP immediately:**
- `_bb_fix_staging` (1,000 rows) -- basketball fix staging, work complete
- `_bb_standings_staging` (0 rows) -- empty
- `_sql_staging` (0 rows) -- empty
- `_epa_passing_yards_fix` (286 rows) -- EPA fix applied, no longer needed

These are leftover from data migration work. They have no FKs, no RLS, no application references.

**B. `game_of_the_week` (0 rows) -- DROP.**
Superseded by `gotw_nominees`/`gotw_votes`/`gotw_winners`. The GOTW voting system is the active one. `game_of_the_week` is a dead prototype table.

**C. `notifications` (0 rows), `cron_logs` (0 rows) -- KEEP but mark as future-use.**
These are empty system tables that will be needed when user features launch. Do not drop.

**D. `player_news_cache` (0 rows) -- KEEP.**
Designed for Google News RSS caching for pro players. Will activate when the news feature ships.

**E. Dead community tables -- DO NOT DROP yet:**
`comments` (0), `forum_likes` (0), `user_profiles` (0), `user_badges` (0), `coach_claims` (0), `player_claims` (0), `coming_soon_signups` (0), `corrections` (0). These are all zero-row tables waiting for real users. They're correctly designed with FKs. Keep them.

**F. Duplicate `team_season_stats` (6,965 rows) vs `team_seasons` (8,507 rows).**
Both tables store per-school-per-season stats. `team_seasons` has wins/losses/ties/points_for/points_against. `team_season_stats` appears to store additional or overlapping data. **Audit whether these can be consolidated.** If `team_season_stats` only holds data not in `team_seasons`, consider merging its columns into `team_seasons` as JSONB `extended_stats`.

---

### 5. MISSING

**A. No `sport_id` on `game_player_stats`... wait, there IS one.** The FK query confirms `game_player_stats.sport_id -> sports`. But verify the Drizzle schema includes it.

**B. Missing FK: `article_mentions.entity_id`.** This is a polymorphic FK (entity_type + entity_id). There's no FK constraint because entity_id could point to players, schools, or coaches depending on entity_type. This is a known pattern trade-off. Consider adding a CHECK constraint or trigger to validate the reference.

**C. Missing FK: `search_index.entity_id`.** Same polymorphic pattern. No FK constraint possible. Acceptable.

**D. Missing FK: `pickem_games.game_id -> games`.** The FK query DOES show this exists: `pickem_games.game_id -> games`. Good.

**E. No index on `game_player_stats(player_id, game_id)`.** With 163K rows, queries like "show me all box scores for player X" need a composite index. Currently relies on individual column indexes. Add: `CREATE INDEX idx_gps_player_game ON game_player_stats(player_id, game_id);`

**F. No index on `games(sport_id, season_id, game_date)`.** With 47K games, filtering by sport + season + date is a core query pattern. Add: `CREATE INDEX idx_games_sport_season_date ON games(sport_id, season_id, game_date);`

**G. No `deleted_at` on `games` table.** Schools and players have soft delete, but games don't. If a game is found to be a duplicate or erroneous, it should be soft-deletable. Add: `ALTER TABLE games ADD COLUMN deleted_at timestamptz;`

**H. No explicit `sport_id` on `rosters` table... wait, the FK query shows `rosters.sport_id -> sports`.** Good, it exists in DB even if missing from the Drizzle schema excerpt I read. Verify Drizzle includes it.

**I. Missing table: `coaching_staff_members`.** Defined in Drizzle (lines 719-739) but NOT appearing in the row count query output. Either it exists with 0 rows or was never created. Verify and create if missing.

**J. Missing table: `player_seasons_misc`.** Defined in Drizzle (lines 389-404) for minor sports (track, lacrosse, wrestling, soccer) using JSONB `stats`. Not in the row count output. Verify existence.

**K. Missing table: `football_game_stats` and `basketball_game_stats`.** Defined in Drizzle (lines 410-454) but not in row count output. These typed per-game stat tables were designed but `game_player_stats` is the one actually in use. Reconcile.

---

### 6. REDUNDANT

**A. Triple-duplicate voting pattern (HIGH priority to consolidate).**

| Table Group | Pattern | Rows |
|------------|---------|------|
| `potw_nominees` / `potw_votes` / `potw_winners` | Player of the Week | 6 / 0 / 2 |
| `gotw_nominees` / `gotw_votes` / `gotw_winners` | Game of the Week | 0 / 0 / 0 |
| `plyw_nominees` / `plyw_votes` / `plyw_winners` | Play of the Week | 0 / 0 / 0 |

These 9 tables share identical schemas (nominees with votes count + isWinner flag, votes with nominee_id + voter fingerprint, winners with nominee_id). **Consolidate into 3 generic tables:**
- `voting_nominees` (with `voting_type` column: 'potw', 'gotw', 'plyw')
- `voting_votes` (with FK to nominees)
- `voting_winners` (with FK to nominees)

This eliminates 6 tables. Total data: 8 rows across all 9 tables -- trivial migration.

**B. `game_of_the_week` (0 rows) duplicates the purpose of `gotw_nominees`.** Drop `game_of_the_week`.

**C. Three career leader tables with identical structure.**
- `football_career_leaders` (20,251 rows)
- `basketball_career_leaders` (13,153 rows)
- `baseball_career_leaders` (6,793 rows)

These are likely materialized views or denormalized aggregation tables. If they share the same column pattern (player_id, stat_category, stat_value, rank), consolidate into one `career_leaders` table with a `sport_id` discriminator. If columns differ significantly by sport, keep separate but verify they're auto-refreshed (materialized view or cron).

**D. `player_career_summary` (40,817 rows) vs career leader tables (40,197 combined rows).** Significant overlap. `player_career_summary` likely has one row per player with aggregated career stats. The career_leaders tables have per-stat-category rankings. These serve different purposes but may share source computation. Verify they're both generated from the same refresh process to avoid drift.

**E. `team_alltime_records` (341 rows) vs `records` (1,285 rows).** Both store records. `records` is the general-purpose table (city records, school records, individual records). `team_alltime_records` appears to be a denormalized team-level summary. Verify whether this is a subset of `records` or serves a distinct purpose.

**F. `recruiting_profiles.offers` (text array) vs `recruiting_offers` table (10 rows).** The `recruiting_profiles` table has an `offers` column (text array of school names) while `recruiting_offers` is a proper normalized table with FK to `colleges`. The text array is redundant if `recruiting_offers` is the source of truth. Remove the `offers` array column from `recruiting_profiles` once all data is migrated to the relational table.

**G. Player social fields duplicated.** `players` table has `twitter_handle` and `instagram_handle` columns. `next_level_tracking` also has `social_twitter` and `social_instagram`. Additionally, `social_handles` (40 rows) exists as a separate table. Three places to store the same data. Consolidate: use `social_handles` as the single source of truth for all social links (players, schools, coaches), remove the inline social columns from `players` and `next_level_tracking`.

**H. Player college/pro info duplicated.** `players` has `college`, `college_sport`, `pro_team`, `pro_draft_info`. `next_level_tracking` has `college`, `college_sport`, `pro_team`, `pro_league`, `draft_info`. Same data in two places. Since `next_level_tracking` (2,278 rows) is the richer, more detailed table with status tracking, it should be the single source. The `players` table columns should be computed views or removed.

---

### SUMMARY OF RECOMMENDED ACTIONS (prioritized)

1. **DROP 5 tables now:** `_bb_fix_staging`, `_bb_standings_staging`, `_sql_staging`, `_epa_passing_yards_fix`, `game_of_the_week` -- all dead weight, 0 dependencies
2. **Consolidate 9 voting tables into 3** -- eliminates 6 tables, 8 total rows to migrate
3. **Regenerate Drizzle schema** from live DB -- at least 5 tables have DB constraints not reflected in `schema.ts`
4. **Add 2 composite indexes** on `game_player_stats(player_id, game_id)` and `games(sport_id, season_id, game_date)`
5. **Fix `nlt_game_performances.game_id` FK** to point to `games` instead of `game_scores_cache`
6. **Add `deleted_at` to `games` table** for soft-delete consistency
7. **Audit `team_season_stats` vs `team_seasons`** for consolidation opportunity
8. **Deduplicate player social/college fields** across `players`, `next_level_tracking`, and `social_handles`
9. **Verify existence** of `coaching_staff_members`, `player_seasons_misc`, `football_game_stats`, `basketball_game_stats` tables in production

**NOTE:** The database connection was timing out during this audit, which prevented running the missing-FK gap analysis and column type consistency checks. Recommendation: investigate whether a long-running query or connection pool exhaustion is causing the timeouts. The initial queries succeeded, then all subsequent queries failed -- this suggests the Supabase connection pooler may be saturated.

--------------------------------------------------------------------------------

## Agent 10: Query Performance Analyst

### 1. WHAT EXISTS

**Database Profile (from successful queries before connection pool exhaustion):**

| Table | Live Rows | Total Size |
|-------|-----------|------------|
| game_player_stats | 163,504 | 129 MB |
| season_leaderboards | 87,059 | 13 MB |
| players | 68,602 | 33 MB |
| search_index | 54,743 | 24 MB |
| games | 47,439 | 21 MB |
| rosters | 44,122 | 12 MB |
| player_career_summary | 40,817 | 18 MB |
| football_player_seasons | 33,774 | 17 MB |
| basketball_player_seasons | 23,100 | 11 MB |
| football_career_leaders | 20,251 | 4.6 MB |
| awards | 18,698 | 13 MB |

**Index Strategy:** The database has indexes on all primary keys and some composite/filter indexes. There are staging tables (`_bb_fix_staging`, `_sql_staging`, `_bb_standings_staging`) with indexes that are dead weight.

**Query Architecture:** 51 data-fetching modules in `/src/lib/data/` containing ~280 exported functions. About 51 functions use React `cache()` for request-level deduplication. The codebase uses a `withErrorHandling` + `withRetry` wrapper consistently. Many core functions (player profiles, school pages, games) have been optimized with explicit column selection.

**Connection Exhaustion Finding:** During this audit, the Supabase connection pool timed out on 4 consecutive stat queries. This is a critical operational signal -- the database cannot handle concurrent analytical queries alongside production traffic.

---

### 2. KEEP

**Well-Structured Patterns:**

- **React `cache()` on high-traffic fetchers** (`getSchoolBySlug`, `getGameById`, `getCurrentSeasonId`, etc.) -- 51 functions use request-level dedup. This prevents redundant queries when multiple components on the same page need the same data.

- **`Promise.all()` for parallel batching** in `getSchoolAllSportsStats` (`/src/lib/data/school-hub.ts` line 141) runs 6 queries in parallel. Same pattern in `getSportOverview` (`/src/lib/data/schools.ts` line 52) and `getTrendingStats` (`/src/lib/data/trending.ts` line 22). Good use of concurrent I/O.

- **Explicit column selection on core paths** -- `getPlayerBySlug` (players.ts:46), `getFootballPlayerStats` (players.ts:73), `getSchoolBySlug` (schools.ts:144), `getGameById` (games.ts:62), `getGameBoxScore` (games.ts:94). These are the highest-traffic queries and they correctly specify columns.

- **Box score deduplication logic** in `getGameBoxScore` (games.ts:121-160) -- client-side dedup with a scoring heuristic that merges jersey numbers and player IDs across source types. Necessary given the multi-source data pipeline.

- **Input sanitization** in `common.ts:29-41` -- `sanitizePostgREST()` escapes ILIKE wildcards, preventing injection via search inputs.

- **Rate limiting on search API** (`/src/app/api/search/route.ts` lines 17-35) -- 30 requests per minute per IP with proper headers.

---

### 3. IMPROVE

**CRITICAL -- Sequential Scan Hemorrhage on `players` Table:**
The `players` table (68K rows, 33 MB) has **31,012 sequential scans reading 1.73 BILLION tuples**. This is the single worst performance problem in the database. The `football_player_seasons` table (33K rows) has 9,697 seq scans reading 321M tuples. These numbers indicate queries are doing full table scans repeatedly.

**Specific fixes:**

1. **`getFootballPositionLeaders`** (`/src/lib/data/position-leaders.ts` lines 62-89) -- This is a textbook N+1 anti-pattern. It first queries `players` with `.contains("positions", [...])` pulling up to 500 players, then queries `football_player_seasons` with `.in("player_id", playerIds)` for all of them. The `.contains()` on a JSONB array column without a GIN index forces a sequential scan on `players`. **Fix:** Create a GIN index on `players.positions` (`CREATE INDEX idx_players_positions_gin ON players USING gin(positions)`). Better yet, use the `football_career_leaders` table which already has aggregated stats -- it has 20K rows and is only queried 42 times via seq scan, suggesting it is underutilized.

2. **`getSchoolNotablePlayers`** (`/src/lib/data/schools.ts` lines 288-346) -- Fetches up to 200 rows from sport season tables, then makes TWO additional round trips to `records` and `awards` tables (lines 351-383). Three sequential queries where one RPC or a single SQL join would suffice. **Fix:** Combine into a single SQL query using Supabase RPC, or at minimum run the records + awards queries in `Promise.all()`.

3. **`getCurrentSeasonData`** (`/src/lib/data/schools.ts` lines 468-598) -- Makes 4 sequential Supabase calls: (1) current season, (2) team_season, (3) future game OR past game, (4) roster. That is 4-5 round trips per school page load. **Fix:** Parallelize calls 3 and 4 with `Promise.all()` after getting the season/team data.

4. **`getPlayerAwards`** (`/src/lib/data/players.ts` line 148) -- Uses `.select("*, seasons(...)")` with `SELECT *` on the 18K-row awards table. **Fix:** Specify only needed columns.

5. **`getPlayerStats`** (`/src/lib/data/players.ts` line 180-182) -- Uses `.select("*")` -- the generic fallback version of player stats. This should specify columns like the sport-specific versions above it do.

6. **Awards All-City query** (`/src/lib/data/awards.ts` line 84) -- `.limit(5000)` on the awards table. 5,000 rows per request is excessive. **Fix:** Paginate or use a materialized view for aggregated award data.

7. **`search_index` table** (54K rows, 24 MB) -- Has 617 sequential scans reading 41.5M tuples but the `idx_search_text` index has 0 scans (8.2 MB wasted). The search is not using the text search index. **Fix:** Investigate why `idx_search_text` is unused -- the application may be using `ilike` instead of full-text search operators, bypassing the index entirely.

---

### 4. REMOVE

**Unused Indexes (0 scans, wasting disk and write overhead):**

| Index | Table | Size | Action |
|-------|-------|------|--------|
| `idx_search_text` | search_index | 8,224 kB | Investigate if search uses tsvector; if ilike-only, drop it |
| `idx_players_no_dupes` | players | 2,136 kB | Drop -- 0 scans, likely a one-time dedup artifact |
| `article_mentions_pkey` + unique key | article_mentions | 2,784 kB combined | Drop both if article_mentions feature is unused |
| `idx_bk_leaders_player_school` | basketball_career_leaders | 392 kB | Drop -- 0 scans |
| `idx_next_level_slug` | next_level_tracking | 304 kB | Drop -- 0 scans |
| `idx_article_mentions_entity_id` | article_mentions | 280 kB | Drop -- 0 scans |
| `idx_articles_fts` | articles | 224 kB | Drop -- 0 scans (articles FTS unused) |
| `idx_mv_rivalry` | mv_rivalry_tracker | 208 kB | Drop -- 0 scans |
| `idx_awards_coach_id` | awards | 184 kB | Drop -- 0 scans |
| `idx_articles_published_sport` | articles | 40 kB | Drop -- 0 scans |
| `idx_articles_school_id` | articles | 16 kB | Drop -- 0 scans |
| All `recruiting_offers` indexes (3) | recruiting_offers | 48 kB | Drop -- 0 scans, table appears unused |
| `idx_mv_dynasty` | mv_dynasty_tracker | 32 kB | Drop -- 0 scans |
| `player_merge_log` indexes (3) | player_merge_log | 104 kB | Drop -- 0 scans, maintenance-only table |

**Total reclaimable index space:** ~14.7 MB (small but removes write amplification on every INSERT/UPDATE)

**Staging Tables to Drop:**
- `_bb_fix_staging` (1,000 rows, 296 kB) -- import artifact
- `_bb_standings_staging` -- import artifact  
- `_sql_staging` -- import artifact
- `_epa_passing_yards_fix` (286 rows, 56 kB) -- one-time fix table

**Underused Large Tables:**
- `player_career_summary` (40,817 rows, 18 MB) -- 0 queries from the codebase reference it. Either wire it into the app or drop it.
- `season_leaderboards` (87,059 rows, 13 MB) -- only 1 reference in `events.ts` line 831. This is 13 MB of data with essentially no read path.
- `football_career_leaders` (20,251 rows, 42 seq scans, 7 idx scans) -- nearly unused despite being a pre-aggregated view that could replace expensive position-leaders queries.
- `basketball_career_leaders` (13,153 rows, 2 idx scans) -- same problem.
- `baseball_career_leaders` (6,793 rows, 2 idx scans) -- same.

---

### 5. MISSING

**Indexes That Should Exist:**

1. **`players.positions` GIN index** -- The `getFootballPositionLeaders` query uses `.contains("positions", [...])` which requires a GIN index for indexed lookups on JSONB arrays. Without it, every position-leader query does a 68K-row sequential scan.
   ```sql
   CREATE INDEX idx_players_positions_gin ON public.players USING gin(positions);
   ```

2. **`football_player_seasons(school_id, player_id)` composite index** -- `getSchoolNotablePlayers` and `getSchoolAllSportsStats` both filter by school_id. Same for basketball and baseball season tables.
   ```sql
   CREATE INDEX idx_fps_school_player ON public.football_player_seasons(school_id, player_id);
   CREATE INDEX idx_bps_school_player ON public.basketball_player_seasons(school_id, player_id);
   CREATE INDEX idx_bbps_school_player ON public.baseball_player_seasons(school_id, player_id);
   ```

3. **`awards(player_id, award_type)` composite index** -- `getPlayerAwards` filters by player_id, and `fetchAllCityAwardsJson` filters by award_type. A composite index serves both.
   ```sql
   CREATE INDEX idx_awards_player_type ON public.awards(player_id, award_type);
   ```

4. **`games(sport_id, season_id, game_date)` composite index** -- `getSeasonPhaseForSport`, `getCurrentSeasonData`, and many game-listing queries filter on all three columns. The 1,035 seq scans on `games` (47K rows) would benefit.
   ```sql
   CREATE INDEX idx_games_sport_season_date ON public.games(sport_id, season_id, game_date);
   ```

5. **`game_player_stats(game_id, school_id)` composite index** -- `getGameBoxScore` filters by game_id and orders by school_id. At 163K rows and 129 MB, this is the largest table.
   ```sql
   CREATE INDEX idx_gps_game_school ON public.game_player_stats(game_id, school_id);
   ```

**Missing Application-Level Optimizations:**

6. **Connection pooling / Supabase connection limit** -- The database timed out on 4 consecutive queries during this audit. This suggests the connection pool is undersized or long-running queries are hogging connections. Check Supabase dashboard for `max_connections` and consider enabling PgBouncer in transaction mode if not already.

7. **No caching layer between Supabase and Next.js** -- React `cache()` only deduplicates within a single request. There is no shared cache (Redis, edge cache, or `unstable_cache`) for expensive aggregations like position leaders, trending stats, or school hub data. With ISR revalidation at 3600s, the first visitor after revalidation triggers all queries fresh.

8. **No database-level query timeout** -- Long-running queries from `getFootballPositionLeaders` (which pulls 500 players then their seasons) could hold connections for seconds. Set `statement_timeout` to prevent runaway queries.
   ```sql
   ALTER DATABASE postgres SET statement_timeout = '10s';
   ```

---

### 6. REDUNDANT

**Duplicate `SELECT *` Across Modules:**

43 instances of `.select("*")` across 12 data modules. The worst offenders:

| File | Count | Tables Hit |
|------|-------|-----------|
| `sponsors.ts` | 9 | sponsors (small table, low impact) |
| `annual-awards.ts` | 6 | awards (18K rows -- medium impact) |
| `pulse.ts` | 5 | various pulse tables |
| `events.ts` | 4 | career_leaders, season_leaderboards |
| `widgets.ts` | 5 | various widget tables |
| `playoffs.ts` | 6 | playoff_bracket_games, games |
| `social.ts` | 4 | social tables |
| `players.ts` | 1 | sport season tables (via generic `getPlayerStats`) |

**Duplicate `sortBySeasonYear` Helper:**
Defined identically in 3 separate files:
- `/src/lib/data/schools.ts` lines 19-26
- `/src/lib/data/teams.ts` lines 22-29
- `/src/lib/data/players.ts` lines 26-31

Should be extracted to `common.ts`.

**Duplicate PLAYER_STAT_TABLES mapping:**
Defined in 3 places:
- `/src/lib/data/players.ts` line 169
- `/src/lib/data/schools.ts` lines 41-45 (inside `getSportOverview`)
- `/src/lib/data/schools.ts` lines 248-252 (inside `getSchoolNotablePlayers`)

Should be a single export from `common.ts`.

**Redundant Current Season Queries:**
`getCurrentSeasonId` (seasons.ts:13) and `getCurrentSeason` (seasons.ts:38) both query `seasons WHERE is_current = true`. Several other functions also query the seasons table for current season independently (e.g., `getCurrentSeasonData` in schools.ts:477). While React `cache()` deduplicates within a request, consolidating to a single `getCurrentSeason()` call that returns both id and label would be cleaner.

**Career Leaders Tables vs. Real-Time Aggregation:**
The database has 3 pre-aggregated career leader tables (football: 20K rows, basketball: 13K, baseball: 6.8K) but only `events.ts` references them. Meanwhile, `position-leaders.ts` manually aggregates from `players` + `football_player_seasons` with expensive queries. These career leader tables should be the primary data source for leaderboard/position-leader features.

---

**Priority Actions (ordered by impact):**

1. Create GIN index on `players.positions` -- eliminates the #1 seq scan source
2. Create composite index on `games(sport_id, season_id, game_date)` -- serves 5+ query patterns
3. Create composite indexes on `{sport}_player_seasons(school_id, player_id)` -- serves school page queries
4. Rewrite `getFootballPositionLeaders` to use `football_career_leaders` table instead of live aggregation
5. Investigate and fix connection pool exhaustion (the database timed out during this audit)
6. Replace 43 instances of `.select("*")` with explicit columns, prioritizing `annual-awards.ts` and `playoffs.ts`
7. Drop 14+ unused indexes to reduce write amplification
8. Parallelize the 4 sequential queries in `getCurrentSeasonData`

--------------------------------------------------------------------------------

## Agent 11: Data Integrity Specialist

### 1. WHAT EXISTS

**Database scale (from memory context):** ~57K players, ~82K box scores (game_player_stats), ~8.7K EPA stats, 94 tables in public schema.

**Empty tables (31 tables with 0 rows):** `_bb_standings_staging`, `_sql_staging`, `article_mentions`, `city_allstar_games`, `city_allstar_participants`, `coach_claims`, `coming_soon_signups`, `comments`, `corrections`, `cron_logs`, `email_logs`, `events`, `forum_likes`, `game_of_the_week`, `gotw_nominees`, `gotw_votes`, `gotw_winners`, `notifications`, `photos`, `pickem_leaderboard`, `pickem_picks`, `player_claims`, `player_highlights`, `player_news_cache`, `plyw_nominees`, `plyw_votes`, `plyw_winners`, `potw_votes`, `transfers`, `user_badges`, `user_profiles`

**RLS posture:** ALL public tables have RLS enabled (the pg_tables check returned empty for tables without RLS). However, 10 tables have RLS enabled with NO policies defined, and 14+ tables have overly permissive `USING(true)` / `WITH CHECK(true)` policies on INSERT/UPDATE.

**Staging tables:** 3 found via pg_stat -- `_bb_fix_staging` (1,000 rows), `_bb_standings_staging` (0 rows), `_sql_staging` (0 rows). The 4th (`_epa_passing_yards_fix`) was not discoverable before timeout.

**Massive null-name duplicate problem:** The duplicate players query revealed enormous clusters of NULL/NULL name players grouped by school. The top result is 955 players with `first_name=NULL, last_name=NULL, primary_school_id=NULL`. Schools with IDs 156, 130, 149, 259, 180, 159, 138, etc. each have 300-650 null-name player rows. This totals **thousands** of phantom player records.

---

### 2. KEEP

- **RLS universally enabled.** Every public table has `relrowsecurity = true`. This is correct for a Supabase app exposed via PostgREST. No table is completely unprotected at the RLS level.
- **Materialized views for read-heavy analytics.** Tables like `season_leaderboards`, `player_career_summary`, `football_career_leaders`, `basketball_career_leaders`, `team_alltime_records` are materialized views exposed to anon -- appropriate for a public read-only sports data site.
- **Staging table pattern.** Using prefixed `_staging` tables for batch imports is a sound pattern for data pipeline work, avoiding direct mutations during bulk operations.

---

### 3. IMPROVE

**CRITICAL -- Null-name players (thousands of phantom records)**
The top 20 duplicate clusters alone account for 8,000+ rows where `first_name IS NULL AND last_name IS NULL`. These are likely artifacts of bulk imports where stats rows created player stubs without names.

Fix:
```sql
-- First, count the full scope
SELECT count(*) FROM players WHERE first_name IS NULL AND last_name IS NULL;

-- Identify which have stats attached
SELECT count(*) FROM players p
JOIN game_player_stats gps ON gps.player_id = p.id
WHERE p.first_name IS NULL AND p.last_name IS NULL;

-- For orphaned null-name players with no stats: DELETE
-- For null-name players with stats: investigate the import pipeline
```

**CRITICAL -- Overly permissive RLS policies (14 tables)**
These tables allow ANY anonymous user to INSERT or UPDATE with `WITH CHECK(true)`:

| Table | Dangerous Policy |
|-------|-----------------|
| `ai_recaps` | Anon INSERT + UPDATE |
| `coach_stat_focus` | Anon INSERT + UPDATE |
| `game_scores_cache` | Anon INSERT + UPDATE |
| `nlt_game_performances` | Anon INSERT + UPDATE |
| `team_mapping` | Anon INSERT + UPDATE |
| `player_reactions` | Anon INSERT + UPDATE |
| `gotw_votes` | 2 duplicate INSERT policies |
| `coach_claims` | Anon INSERT |
| `corrections` | Anon INSERT |
| `email_subscribers` | Anon INSERT |
| `coming_soon_signups` | Anon INSERT |
| `plyw_votes` | Anon INSERT |
| `poll_votes` | Anon INSERT |
| `potw_votes` | Anon INSERT |
| `recruiting_interest` | Anon INSERT |
| `player_claims` | Anon INSERT |

The INSERT-only policies on vote/signup/correction tables are arguably intentional for public forms. But `ai_recaps`, `game_scores_cache`, `coach_stat_focus`, `nlt_game_performances`, and `team_mapping` having unrestricted UPDATE is dangerous -- anyone with the anon key can overwrite production data.

Fix:
```sql
-- For data tables that should be admin-only writes:
DROP POLICY "Anon update" ON ai_recaps;
DROP POLICY "Anon write" ON ai_recaps;
DROP POLICY "Anon update" ON game_scores_cache;
DROP POLICY "Anon write" ON game_scores_cache;
DROP POLICY "Anon update" ON team_mapping;
DROP POLICY "Anon write" ON team_mapping;
DROP POLICY "Anon update" ON nlt_game_performances;
DROP POLICY "Anon write" ON nlt_game_performances;
DROP POLICY "Anon update" ON coach_stat_focus;
DROP POLICY "Anon write" ON coach_stat_focus;

-- Replace with service_role-only policies:
CREATE POLICY "Service role write" ON ai_recaps FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
-- Repeat for each table above
```

**WARN -- 7 functions with mutable search_path**
Functions `exec_staged_batch`, `merge_player`, `exec_bb_standings_batch`, `exec_raw_sql_batch`, `exec_sql_block`, `exec_bb_fix_batch`, `get_career_leaders` do not pin their `search_path`. This is a search_path injection vector.

Fix: Add `SET search_path = public` to each function definition.

**WARN -- Extensions in public schema**
`pg_trgm` and `fuzzystrmatch` are installed in `public`. Move to `extensions` schema per Supabase best practice.

**WARN -- No statement_timeout configured**
The orphan-check queries I ran (NOT EXISTS on 82K+ rows) caused connection pool exhaustion and made the database unresponsive for 10+ minutes. This proves there is no `statement_timeout` safety net.

Fix:
```sql
ALTER DATABASE postgres SET statement_timeout = '60s';
```

---

### 4. REMOVE

**31 empty tables** -- These represent features never launched. Group them into tiers:

**Drop immediately (no dependencies, 0 rows, no active code references likely):**
- `_bb_standings_staging` (0 rows, batch import artifact)
- `_sql_staging` (0 rows, batch import artifact)
- `forum_likes` (0 rows, forum feature never built)
- `pickem_leaderboard`, `pickem_picks` (0 rows, pick'em feature never built)
- `plyw_nominees`, `plyw_winners`, `plyw_votes` (0 rows, PLYW feature never built)
- `gotw_nominees`, `gotw_winners`, `gotw_votes` (0 rows, Game of the Week never built)
- `potw_votes` (0 rows)
- `city_allstar_games`, `city_allstar_participants` (0 rows)
- `user_badges` (0 rows)

**Verify code references first, then drop:**
- `article_mentions`, `comments`, `corrections`, `email_logs`, `events`, `notifications`, `photos`, `player_highlights`, `player_news_cache`, `transfers`, `cron_logs`

**Keep (likely needed for active features):**
- `coming_soon_signups`, `player_claims`, `coach_claims`, `user_profiles` -- these support active UI forms even if currently empty

**`_bb_fix_staging` (1,000 rows):** Likely leftover from a basketball fix batch. Verify it is no longer needed, then drop.

**Duplicate RLS policy on `gotw_votes`:** Has both `"Anyone insert gotw_votes"` and `"gotw_votes_public_insert"` -- same permissive INSERT policy defined twice. Remove one.

---

### 5. MISSING

**Foreign key constraints.** The orphan-check queries I attempted (players referencing non-existent schools, game_player_stats referencing non-existent players/games) could not complete due to DB overload, which itself suggests these are sequential scans without FK indexes. The schema likely lacks:
```sql
-- These should exist if they don't already:
ALTER TABLE players ADD CONSTRAINT fk_players_school
  FOREIGN KEY (primary_school_id) REFERENCES schools(id);

ALTER TABLE game_player_stats ADD CONSTRAINT fk_gps_player
  FOREIGN KEY (player_id) REFERENCES players(id);

ALTER TABLE game_player_stats ADD CONSTRAINT fk_gps_game
  FOREIGN KEY (game_id) REFERENCES games(id);
```

**NOT NULL constraints on player names.** With thousands of null-name player records, the `players` table clearly allows `first_name` and `last_name` to be NULL. After cleaning up the phantom records:
```sql
ALTER TABLE players ALTER COLUMN last_name SET NOT NULL;
-- first_name can remain nullable for single-name entries
```

**Rate limiting on public INSERT tables.** Tables like `gotw_votes`, `poll_votes`, `email_subscribers`, `player_reactions` accept unlimited anonymous inserts. Add rate limiting via edge function or Supabase's built-in rate limiting.

**Indexes on foreign keys.** If `game_player_stats.player_id` and `game_player_stats.game_id` lack indexes, every JOIN or orphan check becomes a sequential scan on 82K+ rows. Verify and add:
```sql
CREATE INDEX IF NOT EXISTS idx_gps_player_id ON game_player_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_gps_game_id ON game_player_stats(game_id);
```

**Database-level statement_timeout.** As demonstrated, a single heavy query can lock up the entire database. This is a production resilience gap.

---

### 6. REDUNDANT

**Duplicate INSERT policy on `gotw_votes`.** Two policies (`"Anyone insert gotw_votes"` and `"gotw_votes_public_insert"`) do the exact same thing.

**10 tables with RLS enabled but NO policies.** These tables (`_bb_fix_staging`, `_bb_standings_staging`, `_epa_passing_yards_fix`, `_sql_staging`, `cron_logs`, `league_seasons`, `player_merge_log`, `record_validations`, `team_season_notes`, `team_season_stats`) have RLS turned on but zero policies. This means they are completely inaccessible via PostgREST API (neither read nor write). If they need API access, add SELECT policies. If they are admin-only, this is fine but should be documented.

**Null-name player duplicates.** The top 20 schools alone have 8,000+ null-null player records that are functionally duplicate stubs. These inflate the 57K player count significantly and distort any analytics.

---

### PRIORITY ACTIONS (ordered by severity)

1. **Set `statement_timeout = '60s'`** on the database immediately to prevent future lockups
2. **Revoke anon UPDATE on 5 data tables** (`ai_recaps`, `game_scores_cache`, `team_mapping`, `nlt_game_performances`, `coach_stat_focus`) -- this is an active security vulnerability
3. **Audit and clean null-name players** -- thousands of phantom records degrading data quality
4. **Pin `search_path`** on 7 functions
5. **Drop 15+ confirmed-empty feature tables** to reduce schema noise
6. **Add FK constraints** on core relationships (players->schools, game_player_stats->players/games)
7. **Remove duplicate `gotw_votes` policy**
8. **Move extensions** (`pg_trgm`, `fuzzystrmatch`) to `extensions` schema

--------------------------------------------------------------------------------

## Agent 12: Scalability Engineer

### 1. WHAT EXISTS

**Database (Supabase PostgreSQL 17.6)**
- Total DB size is modest: ~300 MB across 20+ tables
- Largest table: `game_player_stats` at 163K rows / 129 MB
- 13 tables exceed 10K rows; the largest (`game_player_stats`) is the only one above 100K
- Cache hit ratio is excellent: 807M block hits vs 1M block reads (99.88% hit rate)
- Zero deadlocks recorded; 188K rollbacks vs 1.8M commits (~10% rollback rate, worth investigating)
- 44,681 total sessions opened; 10 current backends
- pg_stat_statements and pg_trgm extensions installed (good for query analysis and fuzzy search)
- fuzzystrmatch extension installed for name matching

**Caching Architecture**
- Multi-layer caching strategy already in place:
  - React `cache()` for per-request deduplication (~30+ data functions wrapped)
  - Next.js `unstable_cache` with tag-based invalidation via `fetch-utils-v2.ts`
  - ISR revalidation on virtually every page (mostly 3600s / 1hr; homepage at 300s / 5min; static pages at 86400s / 24hr)
  - Static asset cache headers set to 1 year immutable for fonts, images, JS/CSS
  - `generateStaticParams` used on 14 dynamic routes for build-time prerendering
- Cache tag taxonomy defined (`CACHE_TAGS`) with sport, entity, collection, and frequency categories
- `CACHE_CONFIG` with SHORT (60s), MEDIUM (300s), LONG (3600s), EXTENDED (86400s) tiers

**Connection Management**
- Three Supabase client types: server (cookie-based), static (no cookies, ISR-safe), pooled (PgBouncer on port 6543)
- Pooled client is a singleton with health check capability
- Direct client available for long-lived transactions

**Rate Limiting**
- In-memory sliding window rate limiter in edge middleware:
  - `/api/v1/` = 60/min per IP
  - `/api/ai/` = 5/min per IP
  - `/api/email/` = 10/min per IP
  - `/login` = 5/min per IP (brute force protection)
  - `/api/auth/` = 10/min per IP

**Infrastructure**
- Single Vercel region: `iad1` (US East)
- 7 cron jobs for data ingestion (tweets, game scores, AI recaps)
- 1 edge function (`potw-import`) with JWT verification disabled
- Intelligent client-side prefetching module with hover and viewport strategies
- Parallel data fetching with `batchFetch` and `parallelFetchPage` utilities with individual error handling and timeouts
- Bundle size monitoring script in build pipeline

**Security Headers**
- Full security header suite: CSP with nonces, HSTS, CORP, COOP, X-Frame-Options, Permissions-Policy
- Request body size limit (1MB)
- Request correlation IDs throughout

---

### 2. KEEP

**ISR strategy with tiered revalidation** -- The differentiated TTLs (5min for live content, 1hr for historical, 24hr for static) are well-calibrated for a sports data platform. Historical stats change rarely; live content needs freshness. This is the right pattern.

**React `cache()` wrapping on data functions** -- Per-request deduplication prevents the same query from firing multiple times during a single page render. With 30+ functions wrapped, this eliminates redundant DB round-trips on complex pages.

**`fetch-utils-v2.ts` parallel fetch infrastructure** -- The `batchFetch` and `parallelFetchPage` utilities with individual error handling, fallbacks, and timeouts are production-grade. One failing query does not block the entire page.

**Three-client Supabase architecture** -- Server client for auth flows, static client for ISR/SSG, pooled client for high-concurrency reads is a textbook separation of concerns.

**`generateStaticParams` on 14 sport routes** -- Pre-rendering sport pages at build time eliminates cold-start latency for the most-visited routes. With only 7 sports, this is highly efficient.

**1-year immutable cache headers on static assets** -- Fonts, images, JS bundles all cached aggressively. This is correct since Next.js uses content-hashed filenames.

---

### 3. IMPROVE

**3A. Rate limiter is per-instance, not distributed** (HIGH IMPACT)
The in-memory `Map`-based rate limiter in middleware resets on every cold start and is not shared across Vercel edge instances. Under load, each instance maintains its own counter, meaning the actual rate limit could be N times the configured limit (where N = number of instances).

**How to fix:** Replace with Vercel's built-in WAF rate limiting (available on Pro plan) or use Upstash Redis with `@upstash/ratelimit` for a distributed sliding window. The Upstash approach costs pennies and adds ~1ms latency at the edge.

**3B. The 10% rollback rate needs investigation** (MEDIUM IMPACT)
188K rollbacks out of 2M transactions is abnormal. This could indicate retry storms, failed RLS checks, or application-level issues silently burning connections.

**How to fix:** Query `pg_stat_statements` to identify which queries are rolling back. Check if RLS policies are rejecting legitimate reads. The connection timeouts I hit during this audit (3 consecutive) may be symptomatic of the same issue.

**3C. Connection timeouts during audit** (HIGH IMPACT)
Three of my SQL queries timed out via the MCP tool. This suggests either connection pool exhaustion or slow queries under even minimal load. With only 10 backends and modest data, this should not happen.

**How to fix:** Verify that `SUPABASE_POOLED_URL` is actually set in production. If not, all serverless function invocations open direct connections, which is the #1 cause of connection exhaustion on Supabase. Check the Supabase dashboard for connection count over time. Consider enabling `pg_cron` (available but not installed) to run `VACUUM ANALYZE` on the largest tables nightly.

**3D. `unstable_cache` in `withCache` ignores the `revalidate` parameter** (BUG)
In `fetch-utils-v2.ts` line 236, the `withCache` function accepts a `revalidate` parameter but never passes it to `unstable_cache`. The cached function will use the default (indefinite) cache with no TTL. This means data cached through `withCache` may never expire unless explicitly revalidated by tag.

**How to fix:** Pass the `revalidate` option to `unstable_cache`:
```typescript
const cached = unstable_cache(fn, tags as [string, ...string[]], {
  revalidate: typeof revalidate === 'number' ? revalidate : undefined,
  tags,
});
```

**3E. No database-level read replicas** (LOW IMPACT NOW, HIGH LATER)
All reads and writes go to the same primary. At current scale (300 MB) this is fine, but the platform is importing data from multiple scrapers, cron jobs, and admin operations simultaneously with user-facing reads.

**How to fix:** Supabase Pro plan supports read replicas. When traffic grows, route the static client and pooled client reads to a replica. The three-client architecture already provides the seam for this.

---

### 4. REMOVE

**4A. `playwright` as a production dependency**
Playwright (a browser automation framework) is listed in `dependencies`, not `devDependencies`. It adds ~50-100 MB to the production bundle/install. It was used for MaxPreps scraping but should not ship to Vercel.

**Impact:** Move to `devDependencies` or remove entirely. Scraping should run in a separate script/worker, not within the Next.js app.

**4B. `article_mentions` table (0 rows, 4.1 MB)**
Empty table consuming 4.1 MB of space (likely from indexes). If this feature is not active, the indexes are wasting memory in the shared buffer pool.

**Impact:** Low. Drop indexes on unused tables or defer table creation until the feature is built.

**4C. Redundant security headers in both middleware and `next.config.ts`**
`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, and `Referrer-Policy` are set in both the `headers()` function in `next.config.ts` AND in the middleware. The middleware headers will override the config headers for matched routes, creating confusion about which value is active.

**Impact:** Remove the duplicates from `next.config.ts` since middleware already handles them comprehensively with additional headers (CSP, HSTS, CORP, etc.).

---

### 5. MISSING

**5A. No CDN-level or application-level response caching for API routes** (HIGH IMPACT)
The public API (`/api/v1/`) has rate limiting but no response caching. Every request to `/api/v1/players`, `/api/v1/schools`, etc. hits the database directly. For a read-heavy historical sports database, this is the single biggest scaling gap.

**How to fix:** Add `Cache-Control: s-maxage=3600, stale-while-revalidate=86400` headers to API responses for stable data. Use Vercel's edge cache or the new Runtime Cache API. The `ISR` constant already exists in `lazy-imports.tsx` but is not applied to API routes.

**5B. No database-level materialized views for leaderboards** (MEDIUM IMPACT)
The `season_leaderboards` table has 87K rows and `football_career_leaders` has 20K rows. These appear to be pre-computed but are stored as regular tables. If they are recomputed on-demand rather than via scheduled refresh, this could cause expensive full-table scans.

**How to fix:** If these tables are rebuilt periodically (via cron or admin action), ensure they use `CONCURRENTLY` refresh to avoid locking. Consider native PostgreSQL materialized views with `pg_cron` for automatic refresh during off-peak hours.

**5C. No `pg_cron` or scheduled database maintenance** (MEDIUM IMPACT)
`pg_cron` is available but not installed. No automated `VACUUM ANALYZE` on the 129 MB `game_player_stats` table. Without this, planner statistics go stale and the autovacuum may not run frequently enough for a table that receives batch inserts.

**How to fix:** Enable `pg_cron`, schedule `VACUUM ANALYZE game_player_stats` daily, and `VACUUM ANALYZE` on all tables with >10K rows weekly.

**5D. No search result caching** (MEDIUM IMPACT)
The `search_index` table (54K rows, 24 MB) is queried on every search. With `pg_trgm` installed, fuzzy searches are already optimized, but results for common queries (school names, popular players) should be cached.

**How to fix:** Wrap the search API with `unstable_cache` using a 5-minute TTL and `search:query` tags. Invalidate on data imports.

**5E. No partitioning strategy** (LOW IMPACT NOW)
At 163K rows, `game_player_stats` does not yet need partitioning. But when it reaches 500K-1M rows (likely within 1-2 years given the multi-sport scraping pipeline), partition by `sport_id` or by `season_id` for 5-10x query improvement on filtered reads.

**5F. No Vercel Edge Config for feature flags or dynamic configuration** (LOW IMPACT)
The `PASSTHROUGH_PREFIXES` array in middleware is hardcoded. Any route changes require a redeploy. Edge Config provides sub-millisecond reads for this kind of configuration.

---

### 6. REDUNDANT

**6A. Security headers defined in two places**
As noted in section 4C, the same headers appear in both `next.config.ts` `headers()` and `middleware.ts`. The middleware version is more comprehensive, making the config version redundant and potentially confusing.

**6B. `drizzle-orm` + `@supabase/supabase-js` dual ORM**
Both Drizzle ORM and the Supabase JS client are in dependencies. The codebase appears to use primarily the Supabase client. If Drizzle is not actively used for queries, it is dead weight in the bundle.

**6C. Three charting libraries**
The project includes `recharts`, `@nivo/*` (6 packages: bar, bump, core, heatmap, line, radar). If both are rendering charts, consolidating to one library would reduce bundle size by 100-200 KB.

---

### EXECUTIVE SUMMARY

**Current Scale:** ~300 MB database, 163K largest table, excellent cache hit ratio. The platform is well within Supabase free/pro tier limits.

**Readiness Grade: B-**

The caching and ISR strategy is solid for a content-heavy sports archive. The main scaling risks are:

1. **Connection management** -- The timeouts during this audit and the untested pooled URL suggest the platform may hit connection limits under moderate concurrent load. This is the most urgent item.
2. **No API response caching** -- Every API call hits the DB. For a read-heavy platform with mostly-static historical data, this is leaving significant performance on the table.
3. **Per-instance rate limiting** -- The current approach provides no real protection against distributed attacks or load spikes.
4. **The `withCache` revalidate bug** -- Data cached through this utility may never expire, causing stale data in production.

**Estimated effort to reach A-grade:**
- Fix `withCache` bug: 15 minutes
- Add API response caching headers: 2 hours
- Move to distributed rate limiting: 2 hours
- Enable `pg_cron` + maintenance schedule: 1 hour
- Move Playwright to devDependencies: 5 minutes
- Investigate connection timeouts + rollback rate: 2-3 hours

--------------------------------------------------------------------------------

================================================================================
# PANEL 3: SPORTS DATA LAB
*Agents 13-15: Sports Data Science, Recruiting Analysis, Historical Data Curation*
================================================================================

## Agent 13: Sports Data Scientist

### 1. WHAT EXISTS

**Data Volume (from March 28, 2026 snapshot -- DB was unresponsive via MCP at audit time):**

| Table | Count |
|-------|-------|
| players | 57,473 |
| games | 44,378+ |
| game_player_stats (box scores) | 82,421+ |
| football_player_seasons | 33,768 |
| basketball_player_seasons | 15,558 |
| awards | 17,763 |
| championships | 1,727 |
| next_level_tracking | 2,233 (436 pro) |
| HOF inductees | 165 |
| school_pipeline_grades | 112 |
| EPA football per-game | 8,728 (7 seasons, 645 games) |
| AOP basketball box scores | 5,733 (380 games) |
| MaxPreps basketball seasons | 712 |

**Stat Engine (5 modules at `src/lib/stats/`):**
- `computed-metrics.ts` -- 7 football metrics (YPC, YPA, passer efficiency, YPR, TD:TO, comp%, TD%), 5 basketball per-game rates, z-score, percentile rank, era adjustment, std dev/mean utilities
- `confidence.ts` -- 4-tier reliability system (insufficient/low/medium/high) with sport-specific game thresholds, stat-specific variance adjustments, confidence intervals, visual indicators
- `era-adjustment.ts` -- 4 eras (Pre-Merger 1887-1969, Modern 1970-1999, MaxPreps 2000-2014, Data Era 2015-2025) with hardcoded norms for football rushing, football passing, and basketball scoring
- `decision-support.ts` -- College placement rates, pro pipeline scoring, All-City probability prediction (simplified logistic regression), cross-era player comparison

**DB Analytics Infrastructure (migration `20260310`):**
- 3 era definition tables (football_eras, basketball_eras, baseball_eras) with seeded data
- `era_stat_baselines` table for z-score context
- `precomputed_player_metrics` table with cache TTL
- `recruiting_stat_correlations` table (ML-ready feature importance)
- `player_career_trajectories` table (improvement slopes, trajectory types)
- `program_strength_components` table (composite school index)
- 2 materialized views: `football_player_season_metrics_view` and `basketball_player_season_metrics_view`

**Leaderboards:** Season leaders and career leaders for football (rushing, passing, receiving, scoring, defense, interceptions, returns) and basketball (points, PPG, rebounds, assists, steals, blocks, FG%, 3P%, FT%). Efficiency leaderboard for football (YPC, comp%, YPT) with minimum-threshold filtering (50+ carries).

---

### 2. KEEP

**A. The confidence/reliability framework is genuinely good.** Sport-specific game thresholds (football: 13 for high, basketball: 25) and stat-specific variance adjustments (steals/blocks get 1.5x margin of error) are thoughtful. This prevents the classic leaderboard problem of 3-game wonders topping the charts. The visual indicator system (color classes, emoji dots) is well-architected for UI integration.

**B. The era-adjustment z-score approach is methodologically sound.** Z-score normalization is the correct way to compare across eras for a dataset like this. The concept of mapping raw stats to era-relative dominance is real sports analytics -- it answers "who was more dominant in their era?" correctly.

**C. The hybrid schema design is pragmatic.** Typed tables for football/basketball/baseball with JSONB fallback for minor sports (track, lacrosse, wrestling, soccer) is the right tradeoff for a dataset where 95% of value is in 3 sports.

**D. Deduplication discipline is strong.** Six rounds of school dedup (1,810 to 738), six tiers of player dedup, game dedup removing 28,385 duplicates, and a clean `merge_school()` function that handles 7+ FK reassignments. This is the kind of data hygiene most hobby projects never achieve.

**E. The leaderboard minimum-threshold filtering is correct.** The efficiency page filters at 50+ carries for YPC. This avoids the "1 carry for 80 yards = 80.0 YPC" problem.

---

### 3. IMPROVE

**A. CRITICAL: 17,227 game_player_stats rows have WRONG game assignments.**
The `v4-json-pergame-matched` source type mapped archive opponent columns to incorrect game IDs. This means every player game log and game detail box score from 2001-2015 is potentially showing wrong stats. Additionally, `archive_school_page` (7,625 rows) and `archive` (5,931 rows) source types are flagged HIGH risk for the same issue. Combined, this is 30,783 potentially corrupted rows -- 37% of all box scores.

**Fix:** Re-import from tedsilary.com archive pages using the schedule section for correct opponent-to-date mapping. Delete and re-insert with verified column-to-game assignments. Verify totals: sum of per-game stats must match season totals column.

**B. Era norms are hardcoded estimates, not computed from actual data.**
The `era-adjustment.ts` file contains manually entered statistical norms (e.g., pre-merger rushing avg=487, stddev=312, sample=1,200). These look like reasonable guesses but are not derived from the 33,768 actual football_player_seasons rows in the database. The DB has an `era_stat_baselines` table designed for exactly this purpose, but it is empty and not referenced anywhere in the application code.

**Fix:** Write a one-time SQL script to compute actual era means, standard deviations, and percentiles from real data. Populate `era_stat_baselines`. Modify `era-adjustment.ts` to read from the DB table instead of hardcoded constants. This would make the era comparisons genuinely data-driven rather than estimated.

**C. The NCAA passer efficiency formula in the materialized view is wrong.**
In `20260310_stats_analytics_system.sql`, line 254-262, the materialized view computes:
```sql
(8.4 * (comp/att) + 330 * (td/att) + 100 * (1 - int/att) - 200) / 30
```
But the standard NCAA passer rating formula (also correctly implemented in `computed-metrics.ts` line 122-128) is:
```
(8.4 * yards + 330 * TD + 100 * completions - 200 * INT) / attempts
```
The view is dividing by 30 and using ratios instead of raw values. This produces completely different numbers from the TypeScript implementation.

**Fix:** Correct the SQL materialized view formula to match the TypeScript implementation, or remove it since neither view is referenced in application code anyway.

**D. Players without any season stats -- unknown count but likely high.**
With 57,473 players and only 33,768 football + 15,558 basketball = 49,326 season records (many players having multiple seasons), there could be thousands of player records with zero stats attached. These are likely artifact stubs from opponent mentions, imports, or dedup that created empty shells.

**Fix:** Run a count of players with zero season records across all sport tables. Consider soft-deleting or flagging stubs that have no stats, no awards, no next-level tracking, and no game appearances.

**E. Basketball per-game averages from MaxPreps are stored as averages, not totals.**
The MaxPreps scrape produced per-game averages (PPG, RPG, APG) that need multiplication by GP to get totals. The CLAUDE.md notes this conversion is needed. If any of these were inserted as-is, a player with 15.2 PPG would show as having scored 15 total points.

**Fix:** Audit `basketball_player_seasons` rows where `source_type = 'maxpreps'` to verify that `points` contains totals (PPG * GP) not raw averages.

---

### 4. REMOVE

**A. The 5 advanced analytics tables are empty schema with no application consumers.**
`era_stat_baselines`, `precomputed_player_metrics`, `player_career_trajectories`, `program_strength_components`, and `recruiting_stat_correlations` are defined in migration `20260310` but have zero references in any `.ts` or `.tsx` file in `src/`. They add schema complexity, appear in tooling output, and consume mental overhead without delivering value.

**Recommendation:** Do not drop them (they are aspirational and well-designed), but document them clearly as "Phase 2 analytics" so nobody mistakes their existence for working features. The materialized views also have zero application references.

**B. The `moreImproductive` field name in `era-adjustment.ts` line 49 is a typo.**
The `EraAdjustedComparison` interface has `moreImproductive: string` -- this should be `moreDominant` or `moreImpressive`. Similarly, `moreImpressionId` in `decision-support.ts` line 82 should be `moreImpressiveId`.

**Fix:** Rename both fields.

---

### 5. MISSING

**A. No team-level aggregated stats or win probability.**
The `team_seasons` table has W/L/T and points_for/points_against, but there is no Pythagorean win expectation, strength of schedule, or conference power ranking. With 44,378 games, you could compute:
- Pythagorean expected wins: `PF^2 / (PF^2 + PA^2)`
- Simple ELO ratings per school per season
- Strength of schedule from opponent win percentages

**B. No per-game efficiency metrics for basketball.**
Football has YPC, YPA, passer rating. Basketball has only raw per-game averages (PPG, RPG, APG). Missing: true shooting percentage (TS%), assist-to-turnover ratio, usage rate, offensive rating. The materialized view SQL computes TS% and AST:TO but is never used by the app.

**C. No season-over-season player progression tracking.**
The `player_career_trajectories` table exists but is empty. With multi-season data for many players, you could compute improvement slope (sophomore to senior stat growth), breakout detection, and trajectory classification. This would be a differentiated feature for recruiting analysis.

**D. No data quality dashboard or freshness monitoring.**
There is no automated check for: rows with null player_id in game_player_stats, season stat totals that don't match summed box scores, games with impossible scores, or schools with zero games in a given season. A simple data quality view refreshed nightly would catch issues before users see them.

**E. No baseball stat model depth.**
`baseball_player_seasons` exists with 0 rows counted in the data_state doc (only 824 team_seasons). The decision-support module defines baseball thresholds (batting_avg, HR, RBI) but there appears to be no individual baseball player season data beyond team records. Baseball is listed as a major sport but has minimal individual analytics support.

**F. No defensive football metrics.**
The leaderboard supports "tackles" and "interceptions" ordering, but there is no sack rate, tackles-for-loss percentage, forced fumble tracking, or defensive efficiency metric. Football defense is half the game but gets fraction of the analytical treatment.

---

### 6. REDUNDANT

**A. Dual era definition systems.**
Era definitions exist in three places: (1) hardcoded in `era-adjustment.ts` as the `ERAS` constant (4 eras from 1887-2025), (2) the `football_eras` DB table (4 eras from 1990-2025 with different boundaries), and (3) the `basketball_eras` DB table (4 eras from 2001-2025). These three systems define different era boundaries, use different names, and are not synchronized. The TypeScript code only reads from (1), the DB tables from (2) and (3) are orphaned.

**B. Passer efficiency calculated in 3 places.**
The NCAA passer efficiency formula appears in: (1) `computed-metrics.ts` function `calculatePasserEfficiency`, (2) the `football_player_season_metrics_view` materialized view (with a different formula), and (3) the efficiency leaderboard page `page.tsx` which computes its own derived stats inline. Only (1) and (3) are actually used, and they may produce different results due to different minimum-attempt thresholds.

**C. The `school_pipeline_grades` table (112 rows) overlaps with `program_strength_components`.**
Both attempt to grade schools on athletic program quality. `school_pipeline_grades` uses A+ through D letter grades and is populated. `program_strength_components` uses a numeric index with component scores and is empty. When the latter gets populated, there will be two competing school quality systems.

---

**Summary Scorecard:**

| Dimension | Score | Notes |
|-----------|-------|-------|
| Data volume | 8/10 | 57K players, 82K box scores is substantial for a niche HS sports site |
| Data quality | 4/10 | 37% of box scores potentially corrupted (archive data issue) |
| Stat model depth | 6/10 | Good football metrics, weak basketball/baseball, no team analytics |
| Analytics infrastructure | 3/10 | 5 empty tables, 2 unused materialized views, hardcoded era norms |
| Leaderboard quality | 7/10 | Proper filtering, career + season modes, but no confidence indicators shown |
| Predictive features | 2/10 | All-City prediction and pipeline scores exist in code but are simplistic |

**Top 3 priorities:**
1. Fix the 30,783 corrupted box score rows (archive data re-import)
2. Populate `era_stat_baselines` from real data and wire into the app
3. Add basketball efficiency metrics (TS%, AST:TO) using the already-written materialized view SQL

--------------------------------------------------------------------------------

## Agent 14: Recruiting Analyst

### 1. WHAT EXISTS

**Database Infrastructure (from CLAUDE.md and memory):**
- `next_level_tracking` -- 2,224 rows (436 pro athletes). This is the core pipeline table.
- `recruiting_interest` -- Table exists for athlete self-submission intake form
- `recruiting_profiles`, `recruiting_offers`, `recruiting_ratings`, `recruiting_updates` -- Tables created in schema but likely have 0 or near-0 rows (the code queries them but the `recruiter.ts` data module returns hardcoded `undefined` for most recruit profile fields like GPA, star_rating, forty_time, contact info)
- `colleges` -- Table exists for college lookups (division, conference)
- `nlt_game_performances` -- Table exists but unknown population
- `awards` -- 16,012 rows (used as a proxy for recruiting value in Recruit Finder)

**Frontend Routes (7 total):**
- `/recruiting` -- Recruiting Central hub (SSR, pulls from `next_level_tracking`). Shows hero stats, All-Americans, Class Year Spotlight, Pipeline Rankings top 10 schools, College Destinations top 15, Sport Breakdown, and Recruit Finder CTA.
- `/recruiting/portal` -- Recruiter Portal (client-side). Search/filter by sport, position, measurables, GPA, star rating, division. Registration CTA sidebar. Calls `searchRecruits()` which just queries the `players` table -- does NOT query `recruiting_profiles`.
- `/recruit` -- Athlete self-submission form. Posts to `/api/recruit` which inserts into `recruiting_interest`. Collects first/last name, email, phone, grad year, sport, positions, GPA, height/weight, target level, highlight link, notes.
- `/recruit-finder` -- The flagship tool. Server-rendered, pulls current-season stats from `football_player_seasons`, `basketball_player_seasons`, `baseball_player_seasons`. Client-side filtering by sport, position, class year, league, min stat threshold. Sortable columns. CSV export to clipboard.
- `/next-level/[slug]` -- Individual pro/college athlete profile. Shows career stats, bio, draft info, awards, college info, external links (Twitter, Instagram, league sites), school cross-link.
- `/pros` -- "Before They Were Famous" directory. Filterable by sport. Grid of pro player cards with school pipeline sidebar.
- `/pipeline` -- College Pipeline page. Groups colleges by heuristic division (D1, D2/D3, JUCO, etc). Search, expandable divisions, top destinations grid, top HS college producers sidebar.

**Components (10 recruiting-specific):**
- `RecruitFinderClient` -- Full-featured table with sport pills, filter dropdowns, sortable headers, CSV export, 200-row limit
- `RecruitingBoard` -- Card list component for ranked recruits with star ratings and external links (247, Rivals, On3). Takes `Recruit` interface with composite ratings, offers, rankings
- `CommitmentTracker` -- Sidebar widget showing recent commitments
- `PipelineFunnel` -- Visual funnel (HS Tracked -> College -> Pro -> Coaching) with gradient bars
- `RecruitingSubNav` -- Sticky in-page section nav with IntersectionObserver
- `ClassYearSpotlight` -- Tabs by graduation year showing commits by class
- `AllAmericansSpotlight` -- All-American game selection display
- `StarRating` -- 5-star visual component
- `ExternalLinks` -- Compact badges for 247/Rivals/On3/MaxPreps/Hudl
- `PipelineClient` -- College grouping by division with search and accordion

**Data Modules (4 files):**
- `recruiter.ts` -- `searchRecruits()`, `getRecruiterProfile()`, `getTopViewedPlayers()`, `getRecentCommits()`, `createRecruiterProfile()`. The search function queries the `players` table directly and returns empty values for all recruiting-specific fields (GPA, star rating, contact info, etc).
- `recruiting.ts` -- `getRecruitingBoard()`, `getRecruitingClassYears()`, `getCollegeOptions()`, `getRecruitingSummary()`. Full schema for offers, ratings, colleges. Queries `recruiting_profiles` and `recruiting_offers` with batch joins.
- `pipeline.ts` -- `getCollegePipeline()`, `getPipelineByState()`, `getPipelineBySchool()`, `getTopPipelineSchools()`, `getPipelineSummary()`. All query `next_level_tracking`.
- `pro-players.ts` -- Separate module for the /pros page.

---

### 2. KEEP

**Recruit Finder (`/recruit-finder` + `RecruitFinderClient.tsx`)**
This is the single most useful tool on the site for a college coach. It pulls real current-season stats, supports 3 sports, has position/class/league/stat filters, sortable columns, and CSV export. The data is actual performance data from the DB, not fabricated. It links directly to player profiles and school pages. The 200-row display cap with "use filters" prompt is appropriate UX.

**Recruiting Central hub (`/recruiting`)**
The hub page aggregates real `next_level_tracking` data into useful views: pipeline rankings, destinations, sport breakdown, class year spotlight. The data is genuine and the architecture (8 parallel Supabase queries, processed server-side) is solid. The sticky sub-nav with IntersectionObserver is good section navigation.

**Pro Athlete Profiles (`/next-level/[slug]`)**
Rich individual profiles with career HS stats, college info, draft info, awards, external links, and JSON-LD structured data. This is genuinely useful for showcasing pipeline outcomes and building program credibility.

**Pipeline Funnel visualization**
The `PipelineFunnel` component with HS -> College -> Pro -> Coaching gradient is a compelling story tool when backed by real data.

**CSV Export**
The Recruit Finder's clipboard CSV export is exactly what a college coach needs -- copy a filtered list into a spreadsheet or recruiting software. This is a real utility differentiator.

---

### 3. IMPROVE

**Recruiter Portal is a hollow shell**
`/recruiting/portal` calls `searchRecruits()` which queries the generic `players` table and returns `undefined` for every recruiting-specific field (GPA, star_rating, forty_time, hudl_url, contact_info). The star rating filter, GPA filter, division preference filter, and "Most Viewed" sidebar all return empty/meaningless results. The "Register to Contact" button does nothing. **FIX:** Either connect it to the `recruiting_profiles` table (which has the full schema already built in `recruiting.ts`) or redirect coaches to the Recruit Finder which actually works.

**"Most Viewed" returns random players**
`getTopViewedPlayers()` in `recruiter.ts` has a comment saying it "would typically come from a view_log or analytics table" but currently just returns `players.limit(10)` -- random players with no view count. **FIX:** Either implement view tracking with a `player_views` table or remove the widget until real analytics exist.

**"Recent Commits" returns empty array**
`getRecentCommits()` in `recruiter.ts` returns `[]` with a TODO comment. The sidebar shows nothing. **FIX:** Query `next_level_tracking` for recent `created_at` entries with `current_level = 'college'` -- this data already exists.

**Division classification is heuristic guesswork**
`PipelineClient.tsx` uses `guessDivision()` with a hardcoded keyword list to classify colleges as D1/D2/D3/JUCO. This misclassifies many schools. The `colleges` table already exists with proper `division` and `conference` columns. **FIX:** Join `next_level_tracking.college` to the `colleges` table and use the actual division field.

**D1 count on the hero uses another hardcoded list**
The recruiting page hero estimates "D1 commits" by matching college names against a separate hardcoded `D1_KEYWORDS` array. **FIX:** Same solution -- use the `colleges` table division field.

**Recruit Finder has no highlight/film links**
The table shows stats and awards but no way to access game film. A coach's first question after seeing stats is "where's the film?" **FIX:** Add a Hudl/highlight link column if `recruiting_profiles` has `url_hudl`, or pull from `next_level_tracking` where available.

**No player comparison within recruiting context**
The site has a `/compare` tool but it is not linked from recruiting pages. **FIX:** Add a "Compare" action on the Recruit Finder table or link to `/compare` with pre-selected players.

**Athlete self-submission has no validation or follow-up**
The `/recruit` form inserts into `recruiting_interest` but the API route has a comment saying the "table might not be migrated yet" and returns 200 even on insert errors. There is no admin dashboard to review submissions, no email confirmation, no way for the athlete to check status. **FIX:** At minimum, add error handling and a confirmation email. Build an admin view for submission triage.

---

### 4. REMOVE

**Recruiter Portal registration flow (`/recruiting/portal`)**
The "Register Now" and "Register to Contact" buttons are non-functional. They set a client-side `showContactInfo` boolean that does nothing real. No auth, no registration form, no actual access gating. This creates false expectations for coaches. **Remove or hide until auth and the recruiter_profiles table are populated.**

**PipelineFunnel with hardcoded fallback data**
The component defaults to `{ tracked: 847, college: 234, professional: 47, coaching: 12 }` when no data is passed. These are fabricated numbers. Any instance where this component renders with no real data is misleading. **Remove the hardcoded fallback or replace with zero-state messaging.**

**RecruitingBoard component**
`RecruitingBoard.tsx` is a fully-built component with star ratings, external links (247/Rivals/On3), and commitment status, but it does not appear to be rendered on any live page. It expects data from `recruiting_profiles` which appears to be empty. **Remove from the codebase or flag as "coming soon" -- an unused component that references empty tables is dead weight.**

---

### 5. MISSING

**Verified coach access / gated contact info**
The biggest gap. Real recruiting platforms (Hudl, NCSA, Fieldlevel) gate athlete contact info behind coach verification. PSP has the `RecruiterProfile` type and `createRecruiterProfile()` function built but no actual auth flow, verification process, or access control. Without this, the platform cannot be a credible recruiting tool.

**Offer board / commitment tracker with real data**
The `recruiting_offers` table schema is built, the `CommitmentTracker` component exists, and `getRecruitingBoard()` joins profiles to offers. But the tables appear empty. A live commitment feed showing "Player X committed to Penn State" with dates would be high-value content that coaches check daily.

**Watchlist / saved players for coaches**
No way for a coach to bookmark or track specific recruits across visits. This is table-stakes for any recruiting tool. A simple `coach_watchlists` table with player_id and user_id would enable this.

**College coach contact directory**
The site tracks where athletes go (destinations) but provides no information about who to contact at those colleges. A basic directory of college coaching staffs by sport would make the pipeline data actionable.

**Player measurables over time**
The `recruiting_profiles` schema supports height/weight/forty_time but there is no way to track changes. Coaches want to see measurable progression (e.g., "gained 15 lbs since junior year").

**Integration with 247/Rivals/On3 rating data**
The `ExternalLinks` component and `RecruitingBoard` interface support external service URLs and ratings, but there is no data population pipeline. Even manual entry for the top 20-30 Philly recruits per class would add significant credibility.

**Transfer portal tracking**
No mechanism to track athletes who transfer between colleges. This is increasingly important in modern recruiting.

---

### 6. REDUNDANT

**Two separate recruit search implementations**
`/recruiting/portal` (RecruiterPortalContent) and `/recruit-finder` (RecruitFinderPage + RecruitFinderClient) both offer player search with sport/position filters. The portal version is client-side with empty data; the finder version is server-rendered with real stats. These should be consolidated into one tool. **Kill the portal search, keep the Recruit Finder.**

**Two RecruitProfile interfaces in different files**
`recruiter.ts` defines `RecruitProfile` with contact info and social fields. `recruiting.ts` defines a separate `RecruitProfile` with offers, ratings, and composite scoring. These overlapping type definitions will cause confusion. **Merge into a single canonical type.**

**Three separate "top destinations" implementations**
The recruiting hub page, the pipeline page, and the pipeline sidebar all compute top college destinations independently with slightly different grouping logic. **Extract into a single shared data function.**

**Pipeline page vs. Recruiting Central pipeline section**
`/pipeline` shows college placements grouped by division with search. `/recruiting` has a "Top Recruiting Pipelines" section showing the same data ranked by school. These overlap significantly. **Consider making /pipeline a sub-section of /recruiting or cross-linking clearly.**

**`/next-level/[slug]` vs. `/pros` directory**
Both deal with athletes who've gone beyond high school, but the slug-based profile page is under "next-level" while the directory is under "pros." The breadcrumb on the profile says "Our Guys" (yet another name). **Unify the naming: pick one term (Next Level, Our Guys, or Pros) and use it everywhere.**

---

**Bottom line from a recruiting professional's perspective:** The Recruit Finder is the real product here -- it pulls actual verified stats, supports filtering and export, and covers 3 sports. Everything else in the recruiting section is either scaffolding for future features (recruiter portal, offer boards, rating integrations) or presentation layers over the same `next_level_tracking` data. The priority should be: (1) populate the `recruiting_profiles` and `recruiting_offers` tables for at least the top 50 recruits per class, (2) implement coach verification, and (3) consolidate the redundant search tools. Without real recruiting data in those empty tables, half the infrastructure is a facade.

--------------------------------------------------------------------------------

## Agent 15: Historical Data Curator

---

### 1. WHAT EXISTS

**Database Scale (as of March 28, 2026)**

| Category | Count | Coverage |
|----------|-------|----------|
| Players | 57,473 | 738 active schools |
| Games | 44,378+ | Dates available for majority |
| Box Scores (game_player_stats) | 82,421+ | Football + basketball |
| Football Player Seasons | 33,768 | 61 schools |
| Basketball Player Seasons | 15,558 | 111 schools, 66 seasons |
| Awards | 17,763 | All-City, All-Public, All-Catholic, All-State, MVP, COTY |
| Championships | 1,727 | State + City + League (1903-present) |
| HOF Inductees | 165 | Public League HOF only; City All-Star empty |
| Coaching Stints | Present | ~200 coaches loaded |
| Next Level Tracking | 2,233 | 436 pro athletes |
| Playoff Brackets | 90 | Football + Basketball 2004-2025 |

**Historical Timeline**
- Football: Archive data from 1900s through 2025-26 (61 schools, 1,767+ HTML source files)
- Basketball: ~1901 through 2025-26 (98+ schools from Silary archive, 178 in DB total)
- EPA Football Per-Game: 7 complete seasons (2019-2026), 8,728 rows, 645 games, 100% player-matched
- Tedsilary Archive Per-Game: 2000-01 season (2,935 rows, 405 games)
- MaxPreps Basketball: 6 seasons (2020-2026), 712 player-season rows, 14 schools

**Built Historical Feature Pages (9 routes)**
- `/history` -- "This Week in PSP History" (hardcoded 5 moments + recent champions from DB)
- `/hof` -- Ted Silary Hall of Fame hub (5 HOF cards, featured athletes)
- `/hof/public-league` -- 165 inductees, filterable by sport/school/decade
- `/hof/city-all-star` -- Built but EMPTY (no data scraped yet)
- `/hof/schools` -- 18 school HOF directories
- `/[sport]/championships` -- Full championship browser with tier grouping (State/City/League), dynasty sidebar, box score links, methodology notes
- `/[sport]/dynasties` -- Dynasty timeline by decade with all-time leaders
- `/[sport]/greatest-seasons` -- Ranked by dominance score (football, basketball, baseball)
- `/[sport]/eras` -- Statistical era comparisons (decade-by-decade trends with charts)
- `/records-explorer` -- Cross-sport records explorer with filters
- `/awards` -- Awards & Honors hub with sport cards, dynasty tracker, and tabbed content
- `/coaches` -- Coaches directory with league filtering

**Source Archive:** 7,011 FrontPage HTML files across 15 directories (season recaps, coverage indices, person profiles, all-city awards, school histories, playoff records, statistical tables, narrative articles, editorial/awards).

---

### 2. KEEP

**Championships page (`/[sport]/championships`)** -- The strongest historical feature. Properly tiered (State > City > League), includes score data, opponent info, box score links, methodology notes, and data source badges. Dynasty tracker sidebar is well-designed. JSON-LD structured data present.

**Dynasties page (`/[sport]/dynasties`)** -- Decade-by-decade timeline visualization is a genuine differentiator. The `getDynastyTrackerData` and `getDynastyLeaders` data functions are well-structured.

**Statistical Eras page (`/[sport]/eras`)** -- Unique feature that shows how the game has changed over decades. Average/max/trend analysis per era adds real analytical value. The "How the Game Changed" framing is compelling.

**Greatest Seasons (`/[sport]/greatest-seasons`)** -- Dominance score ranking across multiple statistical categories is a sophisticated approach. Supports football, basketball, and baseball.

**Awards Hub (`/awards`)** -- Well-architected aggregation page pulling from multiple data functions in parallel. Sport cards, dynasty tracker sidebar, most-honored schools, and quick links all work together.

**HOF Public League page (`/hof/public-league`)** -- 165 real inductees with proper attribution to Ted Silary. Filterable by sport, school, and decade.

**EPA Football Per-Game data** -- 8,728 rows across 7 seasons with 100% player matching. This is the gold standard for data quality on the platform.

---

### 3. IMPROVE

**CRITICAL: 17,227 archive box scores have WRONG game assignments**
The `v4-json-pergame-matched` rows in `game_player_stats` have broken column-to-game mapping from original import. This means every player game log and box score from 2001-2015 is potentially showing wrong stats. An additional ~13,500 rows in `archive_school_page` and `archive` source types may also be affected (same format, same risk). **FIX:** Re-import all affected rows using schedule-based column mapping from the archive HTML files. Delete old rows, re-parse with opponent abbreviation matching to game dates, verify totals match season sums.

**History page (`/history`) is mostly static**
The "Legendary Moments" section is 5 hardcoded entries. For a platform built on 7,011 archive files, this is severely underusing the source material. **FIX:** Build a "This Day in Philly Sports History" engine that queries championships and awards by calendar date range. Pull from the 1,727 championships and 17,763 awards to generate dynamic historical content. The current `getChampions()` function only shows the 24 most recent championships -- this should show champions from the same calendar week across all years.

**City All-Star HOF page is EMPTY**
`/hof/city-all-star` was built in March 2026 but zero inductee data was scraped. The page exists but has no content. **FIX:** Scrape phillyhof.org for City All Star Chapter inductees (estimated ~220 athletes). Insert into `hof_inductees` table with `organization_id` for the City All Star org.

**Coaches directory shows only current coaches**
The description says "current head coaches" -- but the archive has 886 coaching records and 17 all-time winningest coaches from Ted Silary's data. The page only loads 200 coaches with `limit(200)`. **FIX:** Add a "Historical Coaches" tab or separate "Coaching Legends" section. The `coaching_stints` table has `start_year` and `end_year` -- surface historical coaching eras, longest-tenured coaches, and win totals.

**Basketball archive data only partially migrated**
The SQLite basketball archive has 2,485 players, 6,326 games, 5,007 league honor selections, 168 All-State/All-American selections, 113 NBA players, 330 championships, and 886 coaching records. Not all of this has been fully migrated to Supabase. The All-State data only covers 2007-2014. **FIX:** Audit what has been migrated vs. what remains in the SQLite archive. Prioritize All-State/All-American selections and coaching records.

**Players without era info**
Per the memory file, `grad_year` and `class_year` are frequently NULL. Without graduation year data, players cannot be accurately placed in historical context. **FIX:** Batch-infer graduation years from season data (last season played + 1 year) for players who have season records but no `grad_year`.

**Records Explorer has no sport-specific pages**
The `/records-explorer` is cross-sport only. The `/[sport]/records` route exists as a link target in the Championships sidebar but is separate from the records explorer. **FIX:** Ensure `/[sport]/records` works and feeds from the same records data, filtered by sport.

---

### 4. REMOVE

**Hardcoded "Legendary Moments" in `/history`**
Five manually written entries (Imhotep 2008, Roman Catholic 1991, Philadelphia 2003 draft class, West Philly 1967, La Salle 2015) are presented as if dynamically generated. Some contain vague claims that could be inaccurate. The 1991 entry says Roman Catholic won "their 4th consecutive title" -- this needs verification. The 2003 entry says "Four players from Philly high schools were selected in a single NBA Draft" -- the exact count should be verified against the `next_level_tracking` data. **ACTION:** Replace with DB-driven content or verify each claim against actual data.

**Dynasties page claims "120 Years of Dominance" as a static heading**
This hardcoded claim (line 88 in `dynasties/page.tsx`) may not match the actual data range. If basketball data starts in 1901 but football starts later, the claim is only true for some sports. **ACTION:** Calculate the actual year range dynamically from the championships data.

**History page claims "141 seasons"**
Both the hero text and the "Explore the Full Archive" section reference "141 seasons" -- this number appears in multiple places as a static string. If the data range is actually from 1887 (per the Awards hub metadata) to 2026, that would be 139 years, not 141 seasons. **ACTION:** Calculate dynamically from `SELECT min(year), max(year) FROM seasons`.

---

### 5. MISSING

**No Historical Timeline / Interactive Archive Browser**
For a platform built on 7,011 HTML files from decades of coverage, there is no way to browse the archive chronologically. A decade-by-decade interactive timeline showing key events, champion schools, and era-defining players would be a signature feature. The data exists -- 1,727 championships, 17,763 awards, 44,378 games -- but there is no single page that lets a visitor walk through history.

**No "On This Day" / "This Week in History" dynamic content**
The `/history` page title promises "This Week in PSP History" but delivers only static hardcoded moments. With championship dates and game dates in the DB, a daily or weekly historical feature could be auto-generated.

**No narrative archive content**
Ted Silary's archive has ~500+ narrative articles, ~62 person profiles, and ~52 season recaps. None of this rich editorial content has been surfaced on the platform. These are the stories that make the data come alive. **Priority:** Season recap files should be parsed and displayed as historical articles.

**No school-level historical timeline**
Each school profile should have a "History" tab showing championships won, notable alumni, coaching eras, and record holders in chronological order. The data exists across multiple tables but is not aggregated into a school-level historical view.

**No All-State archive**
The memory notes list 5 different PA Football All-State selectors (Associated Press 1939-2008, PA Football Writers 2009-present, UPI 1952-1984, PA Football News 1998-present, PennLive 2018-present). The basketball archive has only 2007-2014 All-State data. A dedicated All-State page with historical selectors would be valuable and unique.

**No Closed Schools memorial**
Schools like Cardinal Dougherty (closed 2010), North Catholic, and others no longer exist. Their historical data is in the DB but there is no dedicated section honoring their legacy. A "Closed Schools of Philadelphia" feature would resonate with the target audience.

**No decade leaders / era-specific leaderboards**
The leaderboards show all-time leaders, but there is no way to filter by decade (1990s rushing leaders, 2000s scoring leaders). The Eras page shows aggregate trends but not individual decade leaderboards.

**No coaching tree / lineage visualization**
The coaching data exists in `coaching_stints` but there is no way to see how coaches moved between schools, who succeeded whom, or the coaching family trees that define Philadelphia HS sports culture.

---

### 6. REDUNDANT

**Dynasty data computed in multiple places**
The Championships page (`championships/page.tsx`) computes dynasty rankings inline (lines 169-188), while the Dynasties page uses separate `getDynastyTrackerData` and `getDynastyLeaders` functions. The Awards Hub also has `getDynastyTracker`. These three dynasty calculations should use a single shared function to ensure consistency.

**Awards Hub dynasty tracker hardcodes to football**
In `/awards/page.tsx` line 244, dynasty leader links all point to `/football/schools/...` regardless of the actual sport. This means basketball or baseball dynasty leaders link to the wrong sport hub.

**"Recent Champions" on History page duplicates Championships page**
The `/history` page shows the 24 most recent champions grouped by sport. The `/[sport]/championships` pages show the same data in more detail. The History page version adds no unique value.

**Championship count discrepancy across pages**
The History page claims "1,733 championships" (line 153), the hero says "1,700+ championships" (line 90), and the actual DB count per memory is 1,727. These should all pull from the same DB count.

---

### Summary Scorecard

| Dimension | Score | Notes |
|-----------|-------|-------|
| Historical depth (raw data) | 8/10 | 57K players, 44K games, 1,727 championships, 17K awards |
| Archive utilization | 3/10 | 7,011 source files; only structured data migrated, no narrative content |
| Feature completeness | 6/10 | Strong championship/dynasty/era pages, but major gaps in timeline, coaching history, archive browser |
| Data accuracy | 4/10 | 17K+ box scores with WRONG game assignments is a critical integrity issue |
| Historical presentation | 5/10 | Good page designs but static content where dynamic content should exist |

**Top 3 priorities:**
1. Fix the 17,227 mismatched archive box scores (data integrity)
2. Build dynamic "This Day/Week in History" from real DB data (low effort, high impact)
3. Scrape City All-Star HOF inductees to fill the empty page (quick win)

--------------------------------------------------------------------------------

================================================================================
# PANEL 4: BEHAVIOR SIMULATION
*Agents 16-19: College Recruiter, Sports Parent, High School Player, Sports Journalist*
================================================================================

## Agent 16: College Recruiter Simulation

**Persona**: D2 assistant football coach in PA, looking for a 6'0"+ safety from the Philadelphia Public League with good film. 10 minutes between meetings.

---

### 1. WHAT EXISTS (The Recruiter Journey Today)

**Step 1: Homepage Landing** (1 click)
- The homepage announces itself as a "Philadelphia High School Sports Database" with 57K players, 44K games, 756 schools. The hero is impressive but does not signal "useful for recruiting" specifically. There is no recruiter-facing CTA (e.g., "College Coaches: Find Your Next Recruit"). The word "recruiting" appears in the nav but blends into a long list of 15+ navigation items. A recruiter on a time crunch might not realize this site has tools for them.
- **Confusion**: Moderate. The site looks like a fan/stats archive, not a recruiting tool. No immediate signal this serves coaches.
- **Clicks to goal**: 0 (still orienting)

**Step 2: Finding Football Players by Position** (3-5 clicks, multiple dead ends)
- **Path A: Nav > Recruiting** (1 click) -- Lands on `/recruiting` which is "Recruiting Central." It shows recent commits, school pipelines, destination boards. This is interesting context but does NOT let me filter by position (safety/DB) or league (Public League). No search. No position filter. Dead end for my specific use case.
- **Path B: Nav > Recruit Finder** (1 click) -- Lands on `/recruit-finder`. This DOES have position filters (DB is available), class year, league, and sport tabs. However, the page returns **"0 players found"** for every combination tried. The data backing this tool is limited to current-season stats only, and the current season query appears to return empty. Major drop-off risk.
- **Path C: Nav > Recruiting > Recruiter Portal** (2 clicks via sub-nav) -- Lands on `/recruiting/portal`. Has the most recruiter-friendly filters: position (DB), min height (6-0), min weight, GPA, star rating, division preference. However, returns **"No recruits found"** for every filter combination. The `searchRecruits()` function queries the `players` table but returns empty `hudl_url`, `gpa`, `star_rating`, `forty_time`, `contact_info` for every result -- all `undefined`. The recruiter_profiles table has fields for these but apparently has no populated data.
- **Path D: Football Leaderboards > Defense/Interceptions** (2 clicks) -- `/football/leaderboards` then click "Interceptions" or "Defense" tab. This WORKS and shows real player data with names, schools, and stats. But there is no position filter (can't isolate safeties from corners or linebackers). Players are clickable links to profiles. This is the most productive path but requires the recruiter to know to go here.
- **Path E: Football > Position Leaders > DB** (2-3 clicks) -- `/football/position-leaders/db` returns **"No defensive backs data found for Football yet."** Another dead end.
- **Confusion**: HIGH. Three different recruiting-themed pages, all empty. The one place with real data (leaderboards) has no position filter.
- **Drop-off risk**: CRITICAL at Step 2. A recruiter with 10 minutes gives up after 2 empty results pages.

**Step 3: Evaluating a Prospect** (1 more click from leaderboard)
- Player profiles are strong. Example: Amahj Gowans at `/football/players/amahj-gowans-167` shows:
  - Hero with name, school (Cardinal O'Hara), position (RB/Receiver), Class of 2026, jersey number
  - Career stat cards (2,573 rush yards, 33 TDs, 6.0 YPC)
  - Season-by-season stats table with carries, rush yards, rush TDs, YPC, rec yards, total TDs
  - Game log with opponent-by-opponent breakdown
  - Height (5'8") in sidebar
  - Awards section (Coaches All-Catholic)
  - Share button, Compare link
  - Similar Players (dynamic import)
  - Highlights section (HudlEmbed component exists, renders if data present)
- **Missing for a recruiter**: No weight, no 40-time, no GPA, no film (Hudl URL present in schema but not populated for most players), no college offers, no contact info (parent/coach phone/email), no social media links. The `recruiting_profiles` table schema has ALL of these fields but they are empty.
- **Data quality**: Historical stats are excellent. Recruiting-specific data is absent.
- **Clicks to goal**: 3-4 total (homepage > leaderboards > stat tab > player)

**Step 4: Comparing Players** (2 clicks)
- `/players/compare` exists and allows selecting 2 players for head-to-head stats. It works via a player search typeahead. This is functional but limited to 2 players (recruiters typically compare 3-5 prospects). No way to quickly compare all DBs from a specific league.
- **Confusion**: Low -- the tool is straightforward.

**Step 5: Export/Save**
- **Export**: The Recruit Finder has an "Export CSV" button that copies CSV to clipboard. This works technically but (a) exports zero rows since the page shows no results, and (b) clipboard copy is less useful than a file download.
- **Save/Bookmark**: No watchlist, no saved prospects, no favoriting system. No recruiter account system despite the portal page saying "Contact info requires registration."
- **Contact**: No way to contact a player, their parents, or their school coach through the site.
- **Drop-off risk**: CRITICAL. A recruiter cannot save, export, or act on anything.

**Step 6: Recruiting Tools**
- `/recruiting/portal` -- Has the right idea (position, height, weight, GPA, star rating, division pref filters) but returns zero results because the `recruiting_profiles` table appears unpopulated.
- `/recruit-finder` -- Has sport/position/class/league filters with stat thresholds. Shows zero results because it queries only current-season stats.
- Neither tool delivers actionable results.

---

### 2. KEEP

| Feature | Why It Serves Recruiters |
|---------|------------------------|
| **Football leaderboards** (`/football/leaderboards/rush-yards` etc.) | Real data, 100+ players per stat, clickable to profiles. This is the only working path to find prospects today. Career + single-season toggle is valuable. |
| **Player profile pages** | Excellent stat presentation: career totals, season-by-season tables, game logs with opponent context, awards badges. The layout is clean and scannable. |
| **Player comparison tool** | Head-to-head stat comparison with search typeahead. Functional and useful once a recruiter has identified prospects. |
| **Recruiting data model** | The `recruiting_profiles` table schema is well-designed: star rating, composite rating, height/weight, Hudl URL, 247/Rivals/On3 links, offers array, committed school/date, GPA. The foundation is solid. |
| **HudlEmbed component** | Ready to render film clips inline on player profiles once URLs are populated. |
| **CSV export on Recruit Finder** | The concept is right -- recruiters need to extract data for their boards. |

---

### 3. IMPROVE

| Friction Point | Clicks Wasted | How to Fix |
|---------------|---------------|------------|
| **Homepage gives no recruiter signal** | 1-2 (wandering) | Add a "College Coaches" CTA card on homepage or a dedicated section. Even a single line: "Recruiting? Start here" with a link to the portal. |
| **Recruit Finder returns zero results** | 2 (click + filter + empty) | The query only fetches current-season stats. Fall back to career data when current season is empty. The 57K players in the DB have historical stats -- surface them. |
| **Recruiter Portal returns zero results** | 2 | Same issue: `searchRecruits()` returns players but with all recruiting fields `undefined`. Either (a) populate recruiting_profiles with known data, or (b) join against existing player data (height from `players` table, stats from season tables) to show SOMETHING. |
| **Position Leaders page empty for DB** | 2 | The `/football/position-leaders/db` route exists but has no data. Either populate it or remove the route to avoid dead ends. |
| **Leaderboards lack position filter** | 0 (workaround) | Add a position dropdown to `/football/leaderboards`. The `players.positions` array exists in the DB. A recruiter looking for safeties currently has to scan the entire interceptions leaderboard and mentally filter. |
| **CSV export copies to clipboard instead of downloading** | 1 (confusion) | Use `Blob` + `URL.createObjectURL` to trigger a real file download. Clipboard copy is unexpected and fragile (large datasets fail). |
| **Player profile lacks recruiter-critical data** | 0 (dead end) | Populate height/weight more broadly (only some players have it). Add a "Recruiting" tab on profiles that shows offers, film, measurables, contact. The schema supports it. |
| **Compare tool limited to 2 players** | 1 | Allow 3-4 players for recruiter-style prospect boards. |

---

### 4. REMOVE

| Feature | Why Remove |
|---------|-----------|
| **Star rating filter on Portal** (currently) | No players have star ratings. Showing a 1-5 star filter that always returns empty results damages credibility. Hide until data exists. |
| **GPA filter on Portal** (currently) | No GPA data in the DB. Same issue -- remove until populated. |
| **Division preference filter on Portal** (currently) | No data backing this. Creates false expectations. |
| **"Contact info requires registration" text** | There is no registration system for recruiters and no contact info to reveal. This promise with no delivery is worse than no promise at all. Remove until functional. |

---

### 5. MISSING (Features a Recruiter Needs That Do Not Exist)

| Feature | Impact | Priority |
|---------|--------|----------|
| **Recruiter account/registration** | Cannot save prospects, build boards, or access contact info without it. The portal page promises this but it does not exist. | HIGH |
| **Saved prospect list / watchlist** | Recruiters evaluate 50+ athletes over weeks. Without a save/bookmark feature, they must rely on browser bookmarks or memory. | HIGH |
| **Populated recruiting profiles** | The schema has height, weight, 40-time, GPA, Hudl URL, star ratings, offers, committed school. NONE of these fields have data for the vast majority of players. This is the single biggest gap. | CRITICAL |
| **Film/Hudl links at scale** | The `HudlEmbed` component and `recruiting_profiles.url_hudl` field exist, but URLs are not populated. Hudl URLs could be scraped or crowdsourced. A recruiter who cannot see film leaves. | HIGH |
| **School coach contact directory** | The `/[sport]/schools/[slug]/staff` route exists, but a recruiter needs a quick way to email or call the head coach for a prospect. | MEDIUM |
| **Position filter on leaderboards** | The single most impactful improvement for recruiting use. "Show me all DBs ranked by interceptions" is the core query. | HIGH |
| **Exportable prospect board** | Beyond CSV: a printable/PDF one-pager per prospect with stats, measurables, film link, school info. Coaches bring these to meetings. | MEDIUM |
| **Alert/notification system** | "Notify me when a 6'0"+ DB from Public League posts new stats." Recruiters return to sites that push info to them. | LOW (future) |
| **Measurables on leaderboard rows** | Height/weight columns alongside stats on leaderboard tables. A recruiter scrolling a list wants to see 6'0" next to the interception count without clicking into each profile. | HIGH |

---

### 6. REDUNDANT

| Overlap | Pages Involved | Recommendation |
|---------|---------------|----------------|
| **Three separate recruiting entry points, all empty** | `/recruiting`, `/recruit-finder`, `/recruiting/portal` | Consolidate into ONE recruiter experience. `/recruiting` should be the hub with sub-tabs for Recruit Finder (filterable list), Commits Board, and Pipeline. The portal should be folded into this. Three separate pages with slightly different empty states is worse than one page that works. |
| **Recruit Finder vs. Recruiter Portal** | `/recruit-finder` and `/recruiting/portal` | These do nearly the same thing (filter players by position/sport/measurables) with different UIs and different data sources. Recruit Finder queries season stats; Portal queries `players` table. Merge them. Use the Portal's better filter set (height/weight/GPA) with the Recruit Finder's actual stat data. |
| **Position Leaders page vs. Leaderboards** | `/football/position-leaders/db` vs. `/football/leaderboards` | Position Leaders is empty; Leaderboards has data. Add position filtering to Leaderboards and deprecate Position Leaders, or populate Position Leaders from the same data source. |
| **Two player data access patterns** | `lib/data/recruiter.ts` and `lib/data/recruiting.ts` | Two separate data modules with different `RecruitProfile` interfaces. `recruiter.ts` queries the `players` table; `recruiting.ts` queries `recruiting_profiles`. Consolidate into one module that joins both tables. |

---

### Summary Metrics

| Step | Clicks to Goal | Confusion Level | Drop-off Risk | Data Quality |
|------|---------------|-----------------|---------------|-------------|
| 1. Homepage | 0 | Moderate | Low | N/A |
| 2. Find DB prospects | 3-5 (with dead ends) | HIGH | CRITICAL | Empty on 3 of 4 paths |
| 3. Evaluate prospect | 1 more | Low | Low | Stats excellent, recruiting data absent |
| 4. Compare players | 2 | Low | Low | Works (2-player limit) |
| 5. Export/Save | N/A | HIGH | CRITICAL | No save, no real export, no contact |
| 6. Recruiting tools | 2 | HIGH | CRITICAL | All return zero results |

**Overall time to value**: A recruiter with 10 minutes would find useful player stat data within 3-4 clicks through the leaderboards path. They would NOT find the safety-specific, measurables-filtered, film-linked prospect list they came for. They would leave after ~4 minutes, having hit 2-3 empty results pages.

**The core problem**: The recruiting data model is well-designed but unpopulated. The site has 57K players with excellent historical stats, but the recruiting-specific layer (measurables, film, offers, ratings, contact info) is a shell. The infrastructure is built; the data pipeline to fill it is not.

--------------------------------------------------------------------------------

## Agent 17: Sports Parent Simulation

**Persona**: Parent of a Father Judge basketball player, browsing on phone during lunch break.

---

### 1. WHAT EXISTS

**Step 1: Homepage Landing** (1 click -- direct URL)
- Homepage loads with a dramatic hero showing "57,326 Players / 44,384 Games / 756 Schools." Two CTA buttons: Football (gold) and Basketball (bordered). Seven sport hex icons below. "The Pulse" section with POTW, Rankings, Our Guys. A search typeahead exists in the header.
- **Can I tell how to find my son's school?** Not immediately. The hero is about the database in general. There is a "Schools" link buried in the "More" dropdown on desktop. On mobile, the sport hex icons and the two CTA buttons dominate. A parent would likely tap "Basketball" first, not look for a schools directory.
- **Clicks to goal**: 0 (just landed). **Emotion**: Impressed by the scale numbers but unsure where to go. **Drop-off risk**: LOW -- the Basketball button is visible.

**Step 2: Find Father Judge** (2-4 clicks attempted)
- **Path A: Search typeahead in header** -- Typed "Father Judge." The search returns **zero results** for "father judge." This is a critical failure. The `search_index` table apparently does not include Father Judge, or the search logic fails to match it. A parent would be immediately confused and frustrated.
- **Path B: /schools directory** -- The schools directory page **fails to load** with an error: "Unable to load school directory." Even when working, it only shows the 3 core leagues (PCL, PPL, Inter-Ac). But the page is currently broken entirely.
- **Path C: /schools/father-judge** -- Returns **404 Not Found.** There is no school hub page for Father Judge. The route `/schools/[slug]/page.tsx` exists in code, but it depends on `getSchoolHubData('father-judge')` succeeding, and this appears to return null for Father Judge.
- **Path D: /basketball/schools** -- This page renders a list of schools with basketball programs via `school_directory_mv`. Father Judge (DB ID 147) should appear here if the materialized view includes it. But the WebFetch only shows loading skeletons (client-side rendering), so the parent on a phone sees a loading state.
- **Clicks to goal**: 3-4 attempts, all dead ends. **Emotion**: Frustration building. "Where is my kid's school?" **Drop-off risk**: HIGH -- 60% of parents would leave at this point.

**Step 3: Find the Basketball Team** 
- **Route /basketball/teams/father-judge/roster** exists in code at `[sport]/teams/[slug]/roster/page.tsx`. When fetched, it returns: **"No roster data available for Father Judge."** The roster system depends on a `rosters` table that has no Father Judge entries. Father Judge is one of the PCL schools confirmed to have NO MaxPreps stats (coach didn't enter data).
- There is NO route `/[sport]/schools/[slug]/page.tsx` -- meaning there is no sport-specific school page. The only school page is the sport-agnostic hub at `/schools/[slug]`, which 404s for Father Judge.
- **Clicks to goal**: Dead end after 1 more click. **Emotion**: "This site doesn't have my kid's school." **Drop-off risk**: CRITICAL -- 80%+ parents bounce here.

**Step 4: Find Your Son's Stats**
- Cannot proceed. No roster, no player search results, no school page. The only way to find a specific Father Judge basketball player would be to guess their slug and navigate to `/basketball/players/[player-slug]`. There is no discovery path.
- **Clicks to goal**: Impossible. **Emotion**: Abandoned. **Drop-off risk**: 95%.

**Step 5: Check Team Record**
- **Route /basketball/standings** returns: "No standings data available yet." The standings system depends on `team_seasons` having records for the current season, which requires the `seasons` table to have `is_current=true` for 2025-26. The standings page filters out future seasons by comparing `year_start` to current calendar year. Since it's April 2026, the logic filters the 2025-26 season correctly, but the query returns no data -- likely no basketball `team_seasons` records exist for the current season.
- **Clicks to goal**: 1 click, zero data. **Emotion**: Deflated. **Drop-off risk**: Already gone.

**Step 6: Compare to Other Players**
- **Route /basketball/leaderboards/scoring** WORKS. It shows top scorers (Doron Ross at Frankford with 618 pts, Silas Graham at Haverford with 568 pts, Korey Francis at Bonner-Prendergast with 521 pts). The stat leaderboard page at `/[sport]/leaderboards/[stat]/page.tsx` has filters for Season, League, and School. The league filter exists on the drill-down pages (e.g., `/basketball/leaderboards/scoring`) via `LeaderboardFilters.tsx`.
- But Father Judge players would not appear here because they have no `basketball_player_seasons` data for 2025-26. The leaderboards only show schools where data was scraped (19 schools from MaxPreps + AOP PDFs).
- **Clicks to goal**: 2 clicks (Basketball > Leaderboards > Scoring). **Emotion**: Can see other players but not my son. Mixed feelings. **Drop-off risk**: MODERATE -- at least the site has SOMETHING.

**Step 7: Share with Family**
- `ShareButtons.tsx` component exists and is wired into player profile pages and school pages. It likely provides copy-link, Twitter, and Facebook sharing.
- Player profile URLs are clean and shareable: `/basketball/players/doron-ross`.
- OG images are auto-generated via `buildOgImageUrl()` for social previews.
- But since the parent cannot find their son's page, sharing is moot.

---

### 2. KEEP

1. **Leaderboard stat drill-down pages** (`/basketball/leaderboards/scoring`) -- These work, show real data, have season/league/school filters. The filter architecture in `LeaderboardFilters.tsx` is well-built with Season, League, and School dropdowns. A parent who finds this page would be satisfied.

2. **Player profile pages** -- The `/[sport]/players/[slug]` page is rich: season-by-season stat tables, game log accordion, career trajectory chart, similar players widget, awards/honors, HOF badges, share buttons, OG image generation. For players that have data, this is excellent.

3. **Search typeahead in header** -- The `SearchTypeahead` component exists in the header globally. The UX pattern (search bar always visible) is correct for a parent use case.

4. **Sport hub pages** (`/basketball`) -- These exist with standings preview, recent scores strip, compound leaderboards, playoff preview, news. Good landing pages when populated.

5. **Share infrastructure** -- `ShareButtons` component, clean URLs, OG images. When a parent CAN find their son, sharing works.

---

### 3. IMPROVE

1. **CRITICAL: Search returns zero results for "Father Judge"** -- The `searchAll()` function queries `search_index` (56,383 entries) but apparently Father Judge is not indexed, or the search tokenization fails on multi-word school names. **Fix**: Audit the `search_index` table to ensure all 756 schools are indexed. Add fuzzy matching (trigram search) so "father judge", "fj", "judge" all return results.

2. **CRITICAL: /schools directory is broken** -- Returns "Unable to load school directory." The query against `school_directory_mv` with `.in('league_name', CORE_LEAGUES)` may be failing. **Fix**: Check if the materialized view is stale or has null league names. Add error logging with `captureError()`. Show a fallback list.

3. **CRITICAL: /schools/father-judge returns 404** -- `getSchoolHubData('father-judge')` returns null. Either the slug doesn't match or the school is soft-deleted. **Fix**: Verify the `schools` table has a row with `slug='father-judge'` and `deleted_at IS NULL`. The `school_names` view bypasses RLS but the school hub uses the `schools` table directly.

4. **No sport-specific school page** -- There is no `/basketball/schools/father-judge` route. A parent clicking "Basketball > Schools > Father Judge" expects a basketball-focused school page with roster, schedule, standings, and stats. Instead they get either a 404 or a generic school hub. **Fix**: Create `/[sport]/schools/[slug]/page.tsx` that shows sport-filtered data: roster, schedule, recent games, player stats, and team record for that specific sport.

5. **Basketball standings show "No data available"** -- The standings query requires `team_seasons` + `seasons.is_current=true` data. For basketball 2025-26, this appears empty. **Fix**: Ensure `team_seasons` are populated for the current basketball season, or show the most recent season with data instead of "No data."

6. **Father Judge roster is empty** -- The roster page says "No roster data available." Father Judge is one of the 11 PCL schools with no MaxPreps stats. The only data source is AOP PDFs (70 games already in DB with box scores). **Fix**: Generate roster entries from `box_scores` data -- any player who has a box score for Father Judge basketball should appear on the roster.

7. **Leaderboards have no league filter on the index page** -- The `/basketball/leaderboards` index page shows top-5 previews for each category but no league filter. The league filter only appears on drill-down pages like `/basketball/leaderboards/scoring`. A parent wants to see "Catholic League leaders" immediately. **Fix**: Add a league filter toggle to the leaderboards index page.

8. **Mobile navigation buries "Schools"** -- The "Schools" link is inside the "More" dropdown on desktop (`MORE_ITEMS` array in `Header.tsx`). On mobile it's even more buried. A sports parent's number-one action is "find my school." **Fix**: Promote "Schools" to top-level navigation, or add a prominent "Find Your School" CTA on the homepage.

---

### 4. REMOVE

1. **The "Beta" banner on the homepage** -- Takes up vertical space on mobile. A parent on their phone doesn't care about beta status. They want data. It pushes actual content below the fold.

2. **"Did You Know" widget** -- Trivia is nice but irrelevant to a parent looking for their kid's stats. On mobile, it consumes scroll real estate that should go to actionable content.

3. **Hardcoded stat counts in the hero** (`57,326 Players / 44,384 Games / 756 Schools`) -- These are impressive but static (hardcoded in `HeroMonument` props). They don't help a parent find anything. The hero should have a search bar or school finder instead.

---

### 5. MISSING

1. **"Find Your School" prominent homepage widget** -- A search/autocomplete specifically for schools, front and center on the homepage. Not buried in navigation. Pattern: large input field saying "Search for your school..." with instant results.

2. **Sport-specific school page** (`/basketball/schools/father-judge`) -- A dedicated page showing: team photo, current season record, roster with links to player profiles, recent game results, schedule, and coaching staff. This is the single most important page for a sports parent.

3. **Team schedule page** -- A parent wants to see upcoming games and past results. No `/basketball/schedule?school=father-judge` or equivalent exists. The `/[sport]/schedule/page.tsx` route exists but is global, not school-filtered.

4. **"My Son's Team" personalization** -- The `/my-schools` page exists with a `FollowSchoolsModal` component. But there's no onboarding flow that says "Follow Father Judge to get updates." Push this earlier in the journey.

5. **Catholic League standings as a distinct view** -- Parents care about their league, not all leagues. The standings page should default to showing the league their followed school belongs to, or at minimum have prominent league tabs.

6. **Player comparison within a team** -- "How does my son compare to his teammates?" is a natural parent question. The compare tool exists (`/compare`) but requires manually finding two players. A "Compare teammates" shortcut from the roster page would be powerful.

7. **Season averages on the roster page** -- Even without game-by-game box scores, showing PPG/RPG/APG next to each player name on the roster would satisfy most parent needs.

8. **Notification when new stats are posted** -- The `/notifications` and `/settings/notifications` pages exist. Wire these to "Your school has new game results" alerts.

---

### 6. REDUNDANT

1. **Three paths to schools, all broken differently** -- `/schools` (directory, currently erroring), `/basketball/schools` (sport-filtered list, loads skeletons), `/schools/father-judge` (hub, 404s). A parent tries all three and gets three different failures. Consolidate to one reliable path.

2. **Search page vs. search typeahead** -- The `/search` page and the header `SearchTypeahead` are separate implementations. The `/search` page uses `searchAll()` from `@/lib/data` while the typeahead likely uses a different endpoint. Both return zero results for "Father Judge." Unify the search backend.

3. **Leaderboards index vs. stat drill-down** -- `/basketball/leaderboards` shows top-5 previews per category, then `/basketball/leaderboards/scoring` shows the full list with filters. The index page partially duplicates the drill-down. Consider making the index page the primary view with inline expansion rather than separate pages.

4. **Multiple recruit/pipeline pages** -- `/recruiting`, `/recruit-finder`, `/recruiting/portal`, `/pulse/recruiting` -- four recruiting-related routes. A parent doesn't know which one to use. Consolidate.

---

### SIMULATION SUMMARY

| Step | Clicks | Outcome | Emotion | Drop-off Risk |
|------|--------|---------|---------|---------------|
| 1. Homepage | 0 | Lands, sees hero | Curious | LOW |
| 2. Find Father Judge | 3-4 | ALL paths fail (search=0, /schools=error, /schools/father-judge=404) | Frustrated | HIGH (60%) |
| 3. Basketball team page | 1 more | Roster empty | Deflated | CRITICAL (80%) |
| 4. Son's individual stats | -- | Impossible | Abandoned | 95% |
| 5. Team record/standings | 1 | "No data available" | Done | 95% |
| 6. League leaderboards | 2 | WORKS but son not listed | Mixed | MODERATE |
| 7. Share | -- | Cannot find anything to share | N/A | N/A |

**Bottom line**: A Father Judge basketball parent cannot complete ANY of their core tasks on this site today. The journey breaks at Step 2 and never recovers. The three most urgent fixes are: (1) make search return school results, (2) fix the /schools directory, and (3) ensure school hub pages resolve for all schools in the database. Until those three work, the parent persona is a total loss.

--------------------------------------------------------------------------------

## Agent 18: High School Player Simulation

**Persona**: Junior RB at Imhotep Charter, just had a 200-yard game, on phone between classes.

---

### 1. WHAT EXISTS

**Step 1 - Homepage Landing**
- Homepage leads with "The Definitive Database" tagline and a hero banner showing 57,326 players, 44,384 games, 756 schools. Below that: Beta banner, Sport Navigation Grid, POTW widget, scores section, articles, and featured alumni ("Our Guys" in pro leagues).
- **Clicks to goal**: 0 (I just landed). **Confusion**: The hero messaging says "The Definitive Database" -- this sounds like an archive, not something for ME right now. The stats counters (57K players, 44K games) feel like a library, not a sports app. **Cool factor**: Low for a teen. The featured alumni section (NFL/NBA players from Philly) is cool but I have to scroll to find it. **Drop-off risk**: HIGH. Nothing above the fold says "check your stats" or "see where you rank." A teen scrolling on their phone between classes gives this 5 seconds.

**Step 2 - Find Myself**
- `/search` exists with full-text search across players, schools, coaches. Typing a name returns grouped results (Players, Schools, Coaches) with links to profiles. When no search query, it shows a school directory grouped by league and "Rising Programs."
- Player profiles live at `/{sport}/players/{slug}` (e.g., `/football/players/john-doe`). The profile has a hero section with avatar (jersey number or school initials), name, school link, position tag, class year, multi-sport badge, and 3 hero stat cards (Rush Yards, TDs, YPC for an RB).
- **Clicks to goal**: 2 (homepage -> search -> type name -> click result). **Confusion**: There is no obvious "Search" button or search bar on the homepage hero. I have to find it in navigation. If I am an Imhotep Charter player, the search works -- but I need to know to go to /search. **Drop-off risk**: MEDIUM. The search path works but is not surfaced prominently enough for a phone user.

**Step 3 - Check My Stats**
- Player profile page shows: season-by-season stat table (PlayerStatTable), game log accordion (GameLogAccordion with merged team games + individual box scores), awards section, career trajectory chart, similar players, correction form, HOF badges, highlights section, and "In The News" articles.
- The game log shows every team game with individual box score data where available. For football: rush yards, pass yards, rec yards per game. The system merges team schedule data with individual box score entries.
- **Clicks to goal**: 3 (home -> search -> player page -> scroll to stats tab). **Confusion**: The data is historical -- the DB has archive data primarily. For a current Imhotep Charter player, stats depend on whether the 2025-26 season data has been imported. Per the CLAUDE.md, Imhotep was confirmed as having NO MaxPreps stats ("No data table found"). So MY 200-yard game is almost certainly NOT in the system. **Cool factor**: IF my stats were there, the profile is genuinely impressive -- hero stat cards, game log, career chart, share buttons. But with no current data, this is a dead page. **Drop-off risk**: CRITICAL. If a player searches their name and sees nothing or stale data, they leave and never return.

**Step 4 - Leaderboards**
- `/football/leaderboards` shows top 5 in each category (Rushing, Passing, Receiving, Scoring, Defense, Interceptions, Returns) with links to deep-dive pages at `/football/leaderboards/{stat}`.
- Filters exist: LeaderboardFilters supports class year and position. AdvancedFilterPanel adds league filtering, school filtering, year range, and minimum games played.
- Season filter dropdown exists (current season vs. all seasons vs. specific year).
- **Clicks to goal**: 2-3 from homepage. **Confusion**: The URL structure is `/football/leaderboards` not `/leaderboards` -- a user might try the wrong path. There IS a `/leaderboards` page too but it is a separate generic landing. No "Public League only" quick toggle -- you have to open the advanced filter panel. No PIAA classification filter. **Cool factor**: HIGH if populated with current data. Seeing your name on a leaderboard is the #1 reason a player comes back. **Drop-off risk**: If leaderboards show only historical data (2000s era), a current player bounces immediately.

**Step 5 - Recruiting Visibility**
- `/recruit` is a simple intake form: name, email, phone, grad year, sport, positions, GPA, height, weight, target level (D1/D2/D3/JUCO), highlight link, and a message field. Submits to `/api/recruit`. Success message says "You're on the radar!"
- `/recruiting` is the main recruiting hub: shows college commit count, pro count, recent commits, school pipelines, destination boards, class year spotlight, All-Americans spotlight. This is oriented toward VIEWING the pipeline, not creating your own profile.
- `/recruiting/portal` is a recruiter-facing search tool: filter by sport, position, height, weight, GPA, star rating, division preference. Shows top-viewed players and recent commits.
- `ClaimProfileButton` on player profiles lets a player (or parent) claim their profile through a 6-step wizard: Identity, Contact, Measurables, Film & Social (Twitter, Instagram, Hudl, On3, 247, Rivals), Recruiting, and Consent forms.
- **Clicks to goal**: The claim-profile flow is accessible FROM the player page -- but only if you already have a profile in the system. The `/recruit` form is a standalone submission, not connected to your existing player record. **Confusion**: HIGH. There are THREE separate recruiting paths (`/recruit`, `/recruiting`, `/recruiting/portal`) and the claim-profile button on the player page. A teen does not know which one to use. **Cool factor**: The claim-profile wizard is solid -- it captures all the right recruiting data. But the disconnect between these paths is confusing. **Drop-off risk**: HIGH. A player who cannot figure out how to claim their profile in 30 seconds moves on.

**Step 6 - Social Sharing**
- ShareButtons component exists on player profiles: Twitter/X share, Facebook share, Copy Link, plus native Web Share API (mobile share sheet).
- OG images are dynamically generated via `buildOgImageUrl` with player name, sport, and "Career Profile" subtitle.
- **Clicks to goal**: 1 from player page. **Confusion**: None -- share buttons are clearly presented. **Cool factor**: MEDIUM. The OG image is auto-generated (not a photo) so it is a navy/gold branded card. No Instagram story format. No "stat card" image optimized for screenshotting. **Drop-off risk**: Low for sharing, but the share content is not screenshot-worthy for Instagram.

**Step 7 - Engagement Features**
- `/potw` (Player of the Week): Voting page with nominees, vote counts, leading indicator, past winners sidebar, school standings. Votes update every 5 minutes.
- `/challenge` (Daily Challenge): "Who Had the Better Season?" -- compare two players' stats and guess the winner. Has streak counter.
- `/pickem`: Pick'em predictions on games, requires weeks to be configured.
- **Clicks to goal**: 1-2 from homepage. **Confusion**: POTW is discoverable from the homepage widget. Challenge and Pick'em require navigation. **Cool factor**: POTW is HIGH for a player who got nominated -- getting votes from classmates is engaging. Daily Challenge is fun but niche. Pick'em depends on active game weeks. **Drop-off risk**: POTW is sticky IF nominations are current. Challenge is a one-and-done unless streaks are compelling.

---

### 2. KEEP

- **Player Profile Hero Section**: The jersey number avatar, hero stat cards (Rush Yards / TDs / YPC), position badge, class year, and school link are exactly what a player wants to screenshot. The layout is clean and sports-app quality. Would I show friends? YES, if my stats are there.

- **Claim Profile Wizard (ClaimProfileButton)**: The 6-step wizard captures exactly what recruiting services charge hundreds of dollars for -- measurables, film links (Hudl, On3, 247, Rivals), social handles, recruiting status. This is genuinely valuable for a player. Would I show friends? YES -- "yo this site lets you build a recruiting profile for free."

- **Game Log Accordion**: Seeing every game with individual stats, organized by season, with team results alongside your personal numbers -- this is what players and parents check obsessively. The merged approach (team games + box scores) is smart.

- **Player of the Week Voting**: This is the single most viral feature for current players. Getting nominated and rallying your school to vote is exactly how teen engagement works. The school standings component adds competition between programs.

- **Share Buttons with Native Share**: The Web Share API integration means on mobile, tapping share opens the native share sheet (iMessage, Instagram DMs, etc.). This is the right approach for teens.

- **Leaderboard Stat Categories**: Having 7 football categories (rushing, passing, receiving, scoring, defense, interceptions, returns) and 9 basketball categories with season/career toggle is comprehensive.

---

### 3. IMPROVE

- **Homepage does not speak to current players**: The hero says "The Definitive Database" with 57K players and 44K games. This reads as a historical archive. A current player wants to see: "Your stats. Your rankings. Your highlight." FIX: Add a prominent "Find Your Profile" search bar directly in the hero. Add a "This Week's Top Performers" section above the fold that shows current-season leaders, not all-time.

- **No current-season data for many schools**: Imhotep Charter has no MaxPreps stats, no box scores in the system for 2025-26. A player searching for themselves finds an empty or stale profile. FIX: This is a data pipeline problem, not a UI problem. But the UI should handle it gracefully -- show "Stats for this season haven't been reported yet. Claim your profile to add them" instead of nothing.

- **Leaderboard filters lack a "My League" quick toggle**: The advanced filter panel supports league filtering, but it is buried behind an expand. A Public League player wants one tap to see "Public League Rushing Leaders." FIX: Add pill toggles at the top: "All Leagues | Public | Catholic | Inter-Ac | Independent" as first-class filter buttons, not hidden in an advanced panel.

- **No classification (PIAA class) filter on leaderboards**: Philly schools compete across multiple PIAA classifications (6A, 5A, 4A, etc.). A 4A player does not care about 6A leaders. FIX: Add classification as a filter dimension alongside league.

- **Recruiting path is fragmented across 3+ URLs**: `/recruit` (intake form), `/recruiting` (pipeline view), `/recruiting/portal` (recruiter search), and ClaimProfileButton on player pages all serve different audiences but are not connected. A player does not know which to use. FIX: Create a single `/for-players` or `/my-profile` entry point that routes: "Are you a player? Claim your profile and build your recruiting page. Are you a coach? Search our portal."

- **Player profile has no photo**: The avatar shows jersey number or school initials. For a recruiting profile and social sharing, a photo is essential. FIX: Allow photo upload as part of the claim-profile flow (noted as "planned" in design decisions).

- **No mobile-optimized stat card for Instagram**: The OG image is a generic branded card. Players want a "stat card" image they can screenshot and post to Instagram stories -- showing their photo, key stats, school logo, and week's performance. FIX: Build a `/players/{slug}/card` endpoint that renders a vertical stat card optimized for Instagram stories (1080x1920).

- **Daily Challenge has no multiplayer/social hook**: "Who Had the Better Season?" is a solo game. Teens want to challenge friends. FIX: Add "Challenge a Friend" that generates a share link where both players see the same matchup and compare answers.

---

### 4. REMOVE

- **"The Definitive Database" tagline from the hero**: This positions the site as an archive for historians, not a tool for active players. Replace with something like "Philly HS Sports -- Stats, Rankings, Recruiting" or "Your stats live here."

- **Beta banner**: If the site has 54 passing routes and 57K players, calling it "Beta" signals unreliability. A teen sees "Beta" and thinks "this might not work." Either ship or hide it.

- **Alumni/Pro tracking prominence on homepage**: Featured alumni in NFL/NBA is cool, but it is not why a current player visits. Move it below the fold or into a dedicated "Our Guys" section. The homepage should lead with what serves the most active user segment.

- **Glossary and Data Sources pages**: These are admin/researcher pages. No teen will ever visit `/glossary` or `/data-sources`. Keep them but remove from main navigation if present.

---

### 5. MISSING

- **"My Page" / authenticated player dashboard**: There is no way for a player to log in and see their own profile, stats, leaderboard position, POTW nomination status, and recruiting activity in one place. This is the #1 missing feature. A player should be able to sign up, claim their profile, and get a personalized dashboard showing: "You rank #4 in Public League rushing. Your profile was viewed 12 times this week. You received 3 POTW votes."

- **Week-over-week stat updates / "This Week's Performances"**: After a 200-yard game, a player wants to see it reflected ASAP. There is no mechanism for coaches, players, or stat keepers to submit game results in real time. The `/scores/report` page exists but is for game scores, not individual stats. FIX: Build a "Report Your Stats" flow where a player can submit their game-day performance (with verification).

- **Stat comparison tool for players at the same position**: "How do I compare to other RBs in my class?" The `/compare/schools` page exists but there is no player-vs-player comparison tool. FIX: Build `/compare/players` with side-by-side stat cards.

- **Notification system for stat updates**: "Alert me when my leaderboard position changes" or "Alert me when I get POTW votes." The `/notifications` page exists but appears to be infrastructure-level. Players want push notifications or at minimum email digests.

- **College coach view counter on player profiles**: Show players how many times their profile has been viewed. This is the #1 engagement hook on every recruiting platform (Hudl, On3, etc.). The recruiting portal has `getTopViewedPlayers` which implies view tracking exists in some form.

- **Instagram story card generator**: A vertical, screenshot-ready stat card with the player's key numbers, school branding, and PSP watermark. This is the single most effective viral growth mechanism for a teen-oriented sports platform.

- **Peer comparison / "Players Like You"**: SimilarPlayers component exists but is loaded dynamically. Make it more prominent: "RBs in the Public League with similar stats: [Player A, Player B, Player C]."

- **Season highlight reel link integration**: ClaimProfileButton captures Hudl URL, but there is no prominent display of film on the player profile. College coaches look for film first.

---

### 6. REDUNDANT

- **/recruit vs. ClaimProfileButton**: Both collect recruiting interest data but are completely disconnected. `/recruit` is a standalone form that does not link to an existing player record. ClaimProfileButton on the player page creates a `recruiting_profiles` entry linked to `player_id`. These should be ONE flow: find your profile -> claim it -> add recruiting data.

- **/recruiting vs. /recruiting/portal**: The main recruiting page shows pipeline data (commits, destinations, class spotlights). The portal is a recruiter search tool. These serve different audiences (fans vs. coaches) but live under the same URL prefix with no clear distinction. A player landing on `/recruiting` sees commit data but no clear path to their own profile.

- **/leaderboards vs. /football/leaderboards vs. /leaderboards/trending**: Three leaderboard entry points. `/leaderboards` is a generic landing, `/football/leaderboards` is sport-specific, `/leaderboards/trending` is a hot-right-now view. These should converge into one leaderboard experience with sport tabs.

- **Search page school directory vs. /football/schools**: The search page shows schools grouped by league when no query is entered. The sport-specific schools page also shows a directory. Two ways to find the same information.

- **POTW homepage widget + /potw page**: The homepage has a PotwHomepageWidget AND there is a full /potw page. This is fine architecturally (teaser + full page) but ensure the widget clearly links to vote.

---

### BOTTOM LINE: The "Would I Show My Friends?" Test

| Feature | Show Friends? | Why / Why Not |
|---------|--------------|---------------|
| Player profile (with stats) | YES | Clean, sports-app quality, hero stat cards look legit |
| Player profile (empty/stale) | NO | Nothing to show, embarrassing to share a blank page |
| Leaderboard ranking | YES | "Look I'm #3 in rushing in the Public League" |
| POTW nomination | YES | "Vote for me!" -- this is the viral feature |
| Recruiting profile | MAYBE | Only if it looks polished, needs photo and film |
| Daily Challenge | MAYBE | Fun but not shareable unless there is a score to flex |
| Homepage | NO | Feels like a database, not a sports app |
| Instagram stat card | N/A (does not exist) | This is the #1 missing viral mechanic |

**Overall mobile experience**: The site is responsive and the layout works on mobile, but the journey from "I just had a big game" to "see my updated stats and share them" has too many gaps. The infrastructure is impressive (57K players, game logs, leaderboards, recruiting portal), but the current-player experience depends entirely on data freshness, and the onboarding path for a new player is fragmented across too many entry points.

**The single highest-impact change**: Add a search bar to the homepage hero and a "Report Your Game" CTA. If a player can find themselves in 5 seconds and see fresh stats, everything else (leaderboards, POTW, recruiting, sharing) flows naturally. Without that, the site is an archive that happens to have cool features nobody discovers.

--------------------------------------------------------------------------------

## Agent 19: Sports Journalist Simulation

**Persona**: Beat reporter, Philadelphia Inquirer, covering high school sports. Writing a story about which Public League football teams have the best track record of sending players to D1 programs.

---

### 1. WHAT EXISTS

**Step 1: Homepage Landing** (1 click)
The homepage loads with a HeroMonument component displaying 57,326 players, 44,384 games, 756 schools. There is a Beta banner. Navigation includes Scores, Football, Basketball, a "More" dropdown with Schools/Rankings/Our Guys/Recruiting/Recruit Finder/Compare/Pipeline/Coaches/Pick'em/Hall of Fame. As a journalist, the sheer volume of numbers (57K players) signals this is a serious data operation, not a fan blog. The SEO metadata describes it as "the definitive source" -- a strong claim. Structured data (schema.org Organization + WebSite) is present, which is professional. **Data credibility: Medium-High at first glance.** The Beta tag is honest but slightly undermines confidence.

**Step 2: Research D1 Pipeline** (3-5 clicks, significant confusion)
- `/next-level` -- There is NO index page at this route. Only `/next-level/[slug]` exists for individual pro athlete profiles. A journalist arriving at `/next-level` would get a 404 or the site's generic page. **This is a dead end for the most obvious research URL.**
- `/pros` -- This page exists and works. It lists pro athletes from Philly high schools with sport filters (all/football/basketball/baseball). It fetches up to 500 pro players. The concept is strong ("Before They Were Famous") but there is NO filter for league (Public League vs. Catholic League vs. Inter-Ac). A journalist wanting to isolate Public League D1 pipeline data cannot do it here.
- `/pipeline` -- This page exists and shows college placements with an interactive look, top pipeline schools, and summary data. This is the closest to what I need, but again -- no league filter visible in the codebase.
- `/philly-everywhere` -- Tracks alumni at prep schools, colleges, and pros. Grouped by sport. No league filtering.
- `/recruiting` -- Recruiting central exists but appears community/fan-focused rather than data-centric.

**The core problem**: None of these pages allow filtering by "Public League schools only." A journalist cannot isolate the D1 pipeline for just Public League football programs without manually checking each school.

**Step 3: Historical Context** (4 clicks, mostly functional)
- `/football/championships` -- This page works well. It categorizes championships by tier (PIAA State, City Championship, District, Public League, PCL). The type-config system properly labels PIAA 6A vs. Public League vs. PCL champions. A journalist can visually scan which Public League schools have titles, but there is no filter/sort to isolate just Public League championship history.
- `/football/records` -- Functional. Shows curated records + computed leaderboards across 25 stat categories. Good for story stats but no league filtering.
- `/football/dynasties` -- Shows 120 years of championship dominance by decade. The `getDynastyTrackerData` and `getDynastyLeaders` functions pull multi-decade trends. This is genuinely useful for a historian/journalist. However, the data is aggregated -- no way to slice just Public League dynasties.
- `/football/eras` -- Statistical eras with trend badges showing how the game has changed. Era charts, decade averages. This is unique data you will not find on MaxPreps.

**Step 4: School Deep Dive** (2 clicks per school, functional)
- `/football/schools/imhotep-charter` -- The school profile page is comprehensive: current season block, trophy case, season history table, offense/defense summary, win/loss trend chart, notable players, rivalry records, related articles, coaching data, and a correction form. The `DataSourceBadge` and `MethodologyNote` components are present, showing attribution. A dynasty timeline is embedded.
- This is the strongest part of the site for journalists. Each school page is essentially a research brief.

**Step 5: Data Verification** (1 click, STRONG)
- `/data-sources` -- This page is well-built. It lists primary sources (Ted Silary Archives 1937-2022, MaxPreps 2015-present, Hudl 2015-present, PIAA) each with confidence levels. There is a coverage timeline showing exactly what years are covered for which sports. This is significantly better than MaxPreps' opaque data sourcing. **A journalist would cite this.** The Ted Silary provenance story (hand-compiled from newspapers and school records over decades) is compelling and unique.

**Step 6: Story Angle Hunting** (3-4 clicks, mixed)
- `/football/greatest-seasons` -- Ranks individual seasons by a dominance score. Fetches top 100. Categories available. This is a "did you know" goldmine -- you can find who had the single greatest rushing season in Philly history.
- `/football/eras` -- The trend data showing how the passing game has evolved, or how scoring has changed, is genuinely publishable content.
- `DidYouKnow` component exists on the homepage, pulling random facts from an API (`/api/did-you-know`). This is fun but not deep enough for investigative journalism.

**Step 7: Export/Reference** (0 direct tools available)
- The v1 API exists (`/api/v1/players`, `/api/v1/schools`, `/api/v1/search`, `/api/v1/leaderboards/[sport]/[stat]`). These are internal APIs used by the frontend but could be used by a tech-savvy journalist.
- An oEmbed endpoint exists (`/api/oembed`) and a widgets system (`/api/widgets/[embedKey]`), suggesting embeddable content is partially built.
- There is NO CSV export, no "download this table" button, no public API documentation, no embed codes visible to users.
- ShareButtons component exists on school and player pages (social sharing), but no data-level sharing.
- Every page has a canonical URL, which means clean linkable references.

---

### 2. KEEP

**Data Sources page** (`/data-sources`). This is the single most important page for journalist credibility. The transparent sourcing with confidence levels, named archives (Ted Silary), and coverage timelines is something MaxPreps does not offer. Keep and expand.

**School profile pages** (`/[sport]/schools/[slug]`). These are research-ready. Trophy case, season history, dynasty timeline, offense/defense splits, rivalry records, notable players, correction form -- this is exactly what a journalist needs for a deep dive. The DataSourceBadge and MethodologyNote components are excellent trust signals.

**Championships page** (`/[sport]/championships`). The tiered classification system (PIAA State > City > District > League) with proper labeling is well-designed for historical research.

**Greatest Seasons** (`/[sport]/greatest-seasons`). The dominance score ranking is unique, publishable content that no competitor offers. This creates story angles.

**Eras page** (`/[sport]/eras`). Trend data across decades is genuinely valuable for contextualizing modern performance. The era champion tables with trend arrows are clean and citable.

**Dynasties page** (`/[sport]/dynasties`). Multi-decade dynasty rankings provide the longitudinal view journalists need for trend stories.

**Structured data / SEO**. Schema.org markup (Organization, WebSite, BreadcrumbJsonLd, PersonJsonLd) means Google surfaces this correctly. Canonical URLs mean clean citations. OG images are generated dynamically. RSS/Atom feeds exist.

---

### 3. IMPROVE

**No league/conference filter on any data page.** This is the single biggest friction point for my story. I need "Public League football schools that send players to D1" and there is no way to get that view without visiting 30+ individual school pages. **FIX**: Add a league filter dropdown (Public League, PCL, Inter-Ac, Suburban One, etc.) to the Pipeline, Pros, Leaderboards, Championships, and Schools directory pages. The data model already has `leagues` and `region_id` on the schools table -- surface it as a filter.

**`/next-level` returns 404.** The nav's "More" dropdown links to `/pipeline` and `/recruiting` but the URL `/next-level` (which a journalist would guess or find via search) has no index page. **FIX**: Create a `/next-level` index page that aggregates all tracked alumni, or redirect it to `/pipeline` or `/philly-everywhere`.

**No data export capability.** A journalist cannot download a table, copy a stat block, or export to CSV. **FIX**: Add a "Download CSV" button to leaderboard tables, championship lists, and school season history. Even a "Copy to clipboard" for stat tables would help.

**Pipeline/Pros/Philly-Everywhere overlap is confusing.** Three separate pages track post-high-school athletes: `/pipeline` (college placements), `/pros` (professional athletes), `/philly-everywhere` (all levels). A journalist does not know which to visit first. **FIX**: Consolidate into one "After High School" hub with tabs for College, Pro, and All, or make the navigation labels clearly distinct ("College Pipeline" vs. "Pro Alumni" vs. "Track All Alumni").

**No public API documentation.** The v1 API exists and is well-structured (`/api/v1/players`, `/api/v1/schools`, `/api/v1/leaderboards/[sport]/[stat]`) but there is no documentation page. **FIX**: Add `/api` or `/developers` page documenting endpoints. Journalists at outlets with data desks (Inquirer, ESPN) would use this.

**Beta tag undermines confidence.** The prominent Beta banner on the homepage makes a journalist hesitate to cite this as authoritative. **FIX**: Remove the Beta tag or change it to a more specific qualifier like "Historical archive; current season data updating weekly."

**Search does not surface "D1 pipeline" type queries.** The search is player/school name-based. A journalist searching "public league D1" or "schools sending players to college" gets nothing useful. **FIX**: Add conceptual search or curated landing pages for common research queries.

---

### 4. REMOVE

**Nothing needs full removal**, but these undermine data credibility:

**"Beta" branding** on the homepage. Either the data is reliable or it is not. The 57K players and 25+ years of Ted Silary archives are not "beta." The community features (Pick'em, Forum) can be beta without the whole site being labeled that way.

**Fan engagement features in the main nav alongside data tools.** Pick'em, Player of the Week voting, and Forum are fine features but they should not have equal navigation weight with Championships, Records, and Pipeline when a journalist is trying to evaluate the site's seriousness. Consider moving community features into a clearly separate "Community" section.

---

### 5. MISSING

**League-filtered views across all data pages.** This is the number one missing feature for research use. Every major data page needs a league/conference dropdown filter.

**"School Comparison" for D1 pipeline.** A page showing "School A sent X players to D1 vs. School B sent Y" would be the exact tool for my story. The compare functionality exists (`/compare/schools`) but it is focused on head-to-head game records, not pipeline comparison.

**College destination tracker by school.** For each school page, show "Where our athletes went" -- a list of colleges with counts. The pipeline data exists in `next_level_tracking` but is not surfaced on individual school pages.

**Printable/exportable stat sheets.** Journalists need to print or PDF a school's championship history or a player's career stats for editorial meetings.

**Citation helper.** A small "Cite this page" button generating AP-style or Chicago-style citations. Example: "PhillySportsPack.com, 'Imhotep Charter Football Championships,' accessed April 1, 2026." This would dramatically increase usage in published articles.

**Press/media page.** No `/press` or `/media` page exists. Journalists need a contact, a mission statement, and explicit permission to cite/screenshot data.

**Embeddable widgets with visible embed codes.** The widget API (`/api/widgets/[embedKey]`) exists but there is no user-facing way to generate embed codes. Journalists and bloggers should be able to embed a school's trophy case or a leaderboard table.

---

### 6. REDUNDANT

**Three alumni tracking pages.** `/pipeline` (college), `/pros` (professional), and `/philly-everywhere` (all levels) overlap significantly. All three pull from the same `next_level_tracking` table with different filters. A journalist visits all three trying to find the right one. Consolidate into one hub with tab navigation.

**`/recruiting` and `/recruit-finder` and `/pulse/recruiting`** -- three recruiting-related pages in the navigation. The distinction between them is unclear from labels alone. A journalist looking for recruiting data does not know which to click.

**`/rankings` and `/pulse/rankings`** -- two rankings pages that appear to show similar power ranking data with different client components (`RankingsClient.tsx` in each).

---

### CREDIBILITY ASSESSMENT

**Would I cite this in a published article?** YES, with qualifiers.

The Ted Silary archives (1937-2022) are a genuinely unique primary source. No other digital platform has this depth of Philadelphia high school sports history. The `/data-sources` page with named sources and confidence levels is more transparent than MaxPreps. The structured data, canonical URLs, and consistent methodology notes on individual pages all signal a serious operation.

**What would make me switch to MaxPreps instead?**
- The moment I need to filter by league and cannot. That is when I close the tab. (HIGH DROP-OFF RISK)
- The moment I need to export data and there is no download button. I would screenshot the table, which is worse for everyone.
- If I cannot find a contact/press page to verify the operation before citing in print.

**What would make me bookmark this site permanently?**
- League filtering on all data pages
- A CSV export on key tables
- A press/media page with editorial contact
- Removing the Beta tag

**Story value found**: The dynasties and eras data is genuinely publishable. A story angle like "How the Public League's football dominance shifted from X to Imhotep over 3 decades" is sitting in this data -- but requires manual assembly across multiple school pages because there is no league filter.

**Clicks-to-goal summary**: My core research question ("which Public League schools send the most players to D1") required 8-10 clicks and was never actually answerable from any single page. A league filter on `/pipeline` would make it 2 clicks.

--------------------------------------------------------------------------------
