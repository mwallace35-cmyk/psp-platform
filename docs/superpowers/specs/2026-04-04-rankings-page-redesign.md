# Rankings Page Redesign — Full War Room Vision

**Date:** 2026-04-04
**Author:** Mike Wallace / PSP
**Status:** Draft

## Context

The `/rankings` page is functional but fails to generate engagement or community participation. A war room panel (Dave Portnoy, ESPN Digital, The Athletic UX, Philly beat writer) reviewed the current page and unanimously identified two core gaps: (1) the page is passive — no reason to return, argue, or share; (2) PSP's deep data (55K players, 80K+ box scores, 25 years of history) is invisible in the rankings, making them indistinguishable from any newspaper column.

The redesign implements all 8 consensus recommendations from the war room across three layers: editorial upgrade, community features, and deep data integration.

## Current State

- **Files:** `src/app/rankings/page.tsx` (RSC, data fetching), `src/app/rankings/RankingsClient.tsx` (client component, 386 lines)
- **Data:** `power_rankings` table joined to `schools`. Grouped by week, sub-grouped by category (city/public/pcl)
- **UI:** Sport tabs, week timeline slider, rank rows with sparklines + change indicators + hover blurbs
- **Gaps:** Flat visual hierarchy, hidden blurbs, tiny sparklines, no fan interaction, no data backing, no shareability

## Design

### Layer 1: Editorial & Layout Upgrade

#### 1.1 "This Week's Shakeup" Hero
- Replaces the current seasonal context banner
- Shows 3 cards: **Biggest Riser**, **Biggest Drop**, **New Entry**
- Auto-computed by diffing current week vs. previous week rankings
- Placement: immediately below sport tabs, above category tabs
- **Edge cases:** Hidden entirely on week 1 (no previous week to diff). Ties broken alphabetically. If no team dropped, show "Held Steady" placeholder. If no new entry, show "No New Entries" placeholder.

#### 1.2 Category Tabs (City / Public / PCL)
- Replace the current vertically stacked category sections with horizontal tabs
- Each tab shows its count badge
- Selected tab highlighted in gold
- Reduces page length and focuses attention

#### 1.3 Premium #1 Team Showcase
- Top-ranked team in the selected category gets an expanded card
- Shows: rank crown, team name + mascot, record + streak, editorial blurb (always visible), 3 key stats (PPG, margin, win %), key player callout with stats linked to player profile
- Stats pulled from existing `games` + `*_player_seasons` tables
- **Data fetching:** `page.tsx` makes an additional server-side query for the #1 team's stats in each category (not from the on-demand resume API). This query joins `games` (for record, margin) and `*_player_seasons` (for top player by PPG). Passed as `showcaseData` prop to client.

#### 1.4 Visual Hierarchy for Ranking Rows
- **Top 3:** Gold (#1), silver (#2), bronze (#3) rank badges, slightly larger card with visible blurb
- **4–12:** Compact rows with key stat, record, trend chart
- Blurbs always visible on top 3, expandable on 4–12 (not hover-only)
- School color bar retained

#### 1.5 Expanded Trend Chart
- Replace 5-week sparkline bars (current: 6px wide) with a proper mini line chart
- Show full season trajectory, not just last 5 weeks
- Current week highlighted with sport color dot
- Clickable to expand full rank history

#### 1.6 Editorial Attribution
- "Ranked by Mike Wallace" byline at top
- Collapsible "How We Rank" methodology section at bottom
- Ranking type badge retained (Way Too Early, Preseason, In Season, Playoff, Final)

### Layer 2: Community & Interactive Features

#### 2.1 Fan Reaction Voting
- Every ranking row gets **"Right"** (agree) and **"Too High"** (disagree) buttons
- Anonymous — no auth required
- Anti-spam: IP + browser fingerprint hash → 1 vote per ranking per user per week
- After voting: buttons replaced by sentiment bar (green/red split) + vote count
- Optimistic UI — show result immediately

**Voter Identity:**
- Server-side: extract IP from `x-forwarded-for` header (Vercel provides this)
- Client-side: generate a simple canvas + navigator fingerprint (no external library — hash `navigator.userAgent + screen.width + screen.height + timezone + canvas.toDataURL()`)
- Hash: `SHA-256(ip + client_fingerprint)` computed server-side in the vote API route
- The voter_hash is opaque and not reversible to an IP

**Error & Loading States:**
- Vote button shows spinner during POST, reverts to buttons on network failure with a toast "Vote failed — try again"
- Duplicate vote (409 from unique constraint) shows "You already voted on this ranking"
- Sentiment bars show skeleton pulse while vote counts load

**New table: `ranking_votes`**
```sql
CREATE TABLE ranking_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ranking_id UUID REFERENCES power_rankings(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('agree', 'disagree')) NOT NULL,
  voter_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX ranking_votes_unique ON ranking_votes(ranking_id, voter_hash);
```

**New API route:** `POST /api/rankings/vote` — accepts `{ ranking_id, vote_type }`, returns aggregated counts.

#### 2.2 Controversy Meter
- Teams where disagree % > 50% get a fire badge on their ranking row
- Heat score formula: `(disagree_pct / 50) × ln(total_votes + 1)` (natural log, +1 to avoid log(0))
- Badge thresholds: 🔥 = 1.5+, 🔥🔥 = 3+, 🔥🔥🔥 = 5+ (calibrated for expected 50-500 votes per ranking)
- "Most Debated This Week" widget below rankings showing top 3 controversial rankings
- No new table — computed from `ranking_votes` aggregation

#### 2.3 Weekly "Biggest Snub" Poll
- 3–4 unranked teams nominated when rankings are published
- Fans vote for who got robbed
- Live results shown with progress bars + total votes

**New tables:**
```sql
CREATE TABLE snub_polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sport_id TEXT NOT NULL,
  week_label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE snub_poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES snub_polls(id) ON DELETE CASCADE,
  school_id BIGINT REFERENCES schools(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE snub_poll_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES snub_polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES snub_poll_options(id) ON DELETE CASCADE,
  voter_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX snub_votes_unique ON snub_poll_votes(poll_id, voter_hash);
```

**New API route:** `POST /api/rankings/snub-vote` — accepts `{ poll_id, option_id }`. Returns aggregated vote counts per option (computed from `snub_poll_votes` table, not denormalized).

**Snub Poll Administration:**
- Snub polls are created manually via Supabase dashboard or a future admin UI when publishing rankings
- Insert a `snub_polls` row with sport_id + week_label, then insert 3-4 `snub_poll_options` rows with school_ids
- No admin API route needed now — Mike creates these directly in the DB alongside ranking publication

**RLS Policies (all new tables):**
```sql
-- ranking_votes
ALTER TABLE ranking_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read votes" ON ranking_votes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert votes" ON ranking_votes FOR INSERT WITH CHECK (true);

-- snub_polls
ALTER TABLE snub_polls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read polls" ON snub_polls FOR SELECT USING (true);

-- snub_poll_options
ALTER TABLE snub_poll_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read poll options" ON snub_poll_options FOR SELECT USING (true);

-- snub_poll_votes
ALTER TABLE snub_poll_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read poll votes" ON snub_poll_votes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert poll votes" ON snub_poll_votes FOR INSERT WITH CHECK (true);
```

#### 2.4 Shareable Social Cards
- OG image generation via `@vercel/og` at `/api/og/ranking`
- Params: `school`, `rank`, `week`, `vote_pct`
- Generates 1200×630 branded card: PSP header, team name, rank, vote split, CTA
- Share button on each ranking row copies URL with OG params
- Twitter Card + Open Graph meta tags

### Layer 3: Deep Data Integration

#### 3.1 Expandable Team Resume
- Click any ranked team to expand an inline panel showing:
  - **Stats grid:** Record, PPG, avg margin, SOS (strength of schedule)
  - **Key results:** Best win (highest-ranked opponent beaten), worst loss, with scores
  - **Key players:** Top 2–3 by stats, linked to player profiles
  - **Upcoming schedule:** Next 2 games with opponent rank if ranked
- Data sources: `games`, `basketball_player_seasons` / `football_player_seasons`, `power_rankings`, `schools`
- Fetched on-demand when expanded (not preloaded) via API route

**New API route:** `GET /api/rankings/team-resume?school_id=X&sport=Y&season=Z`

**Response schema:**
```typescript
interface TeamResumeResponse {
  stats: {
    record: string;        // "11-1"
    win_pct: number;       // 0.917
    ppg: number;           // 68.4
    opp_ppg: number;       // 46.1
    avg_margin: number;    // +22.3
    sos: number;           // 0.612
    sos_rank: string;      // "8th in city"
  };
  key_results: {
    type: 'best_win' | 'worst_loss' | 'notable';
    result: 'W' | 'L';
    opponent: string;
    opponent_slug: string;
    score: string;         // "72-58"
  }[];
  key_players: {
    name: string;
    slug: string;
    position: string;
    stats_line: string;    // "22.1 PPG / 4.3 APG"
  }[];
  upcoming: {
    date: string;          // "Feb 14"
    opponent: string;
    opponent_slug: string;
    opponent_rank: number | null;
  }[];
}
```

**Loading state:** Resume panel shows skeleton grid (4 stat boxes + 3 result rows + 2 player rows) while fetching.

#### 3.2 Cross-Tier Spotlight
- Auto-detects upcoming games where a Public League ranked team plays a Catholic League ranked team (or City-ranked teams from different leagues)
- Shown as a featured matchup card below the rankings
- Includes: both teams with rank badges, game date/time, historical H2H context
- Data: cross-reference `games` (future dates) with `power_rankings` (current week) and `schools` (league determined by `ranking_category` field on `power_rankings` — 'public' = Public League, 'pcl' = Catholic League, 'city' = either). A cross-tier game is detected when two ranked schools have different `ranking_category` values.

#### 3.3 Historical Context Badges
- 3–5 contextual nuggets per week, auto-generated from PSP's archive data
- Types: longest active streak, last time a league held #1, return to rankings after absence, D1 offers count
- Data sources: `games` (streaks), `power_rankings` (historical ranks), `next_level_tracking` (D1 offers)
- Pre-computed and stored in the `context_badges JSONB` column on `power_rankings` at publish time (not computed at render — too expensive for historical queries across thousands of rows)
- JSONB schema: `[{ "type": "streak" | "last_ranked" | "return" | "d1_offers", "icon": "emoji", "text": "string", "source": "PSP Archive" | "Next Level Tracker" }]`
- Displayed as purple-tinted badges on relevant ranking rows and in the resume panel

#### 3.4 Bull/Bear Cases (Top 5 Only)
- Toggle between "Bull Case" (why they could be higher) and "Bear Case" (why they could drop)
- Editorial text stored in new columns on `power_rankings`: `bull_case TEXT`, `bear_case TEXT`
- Data points auto-suggested: point differential, H2H record vs. teams ranked above/below, player stat rankings
- Only shown for top 5 teams in each category

**Migration:** Add columns to `power_rankings`:
```sql
ALTER TABLE power_rankings ADD COLUMN bull_case TEXT;
ALTER TABLE power_rankings ADD COLUMN bear_case TEXT;
ALTER TABLE power_rankings ADD COLUMN context_badges JSONB DEFAULT '[]';
```

#### 3.5 Week-Over-Week Comparison View
- Toggle button next to week nav: "Full Rankings" | "What Changed"
- "What Changed" view shows only movers: risers (green), fallers (red), new entries (blue), dropped out (gray)
- Pure client-side — diffs selected week vs. previous week from already-loaded data
- No new tables or API calls

## File Changes

### Modified Files
| File | Changes |
|------|---------|
| `src/app/rankings/page.tsx` | Add data fetching for team stats, games, players; pass to client |
| `src/app/rankings/RankingsClient.tsx` | Major rewrite — new layout, all interactive features |

### New Files
| File | Purpose |
|------|---------|
| `src/app/rankings/components/ShakeupHero.tsx` | "This Week's Shakeup" hero card |
| `src/app/rankings/components/TeamShowcase.tsx` | Premium #1 team card |
| `src/app/rankings/components/RankingRow.tsx` | Individual ranking row with vote buttons, trend, resume toggle |
| `src/app/rankings/components/TeamResume.tsx` | Expandable resume panel |
| `src/app/rankings/components/VoteButtons.tsx` | Agree/disagree voting widget |
| `src/app/rankings/components/ControversyMeter.tsx` | "Most Debated" sidebar/widget |
| `src/app/rankings/components/SnubPoll.tsx` | Weekly snub poll |
| `src/app/rankings/components/CrossTierSpotlight.tsx` | League clash matchup card |
| `src/app/rankings/components/HistoricalBadges.tsx` | Context badges display |
| `src/app/rankings/components/BullBearCase.tsx` | Bull/bear toggle for top 5 |
| `src/app/rankings/components/WeekComparison.tsx` | "What Changed" diff view |
| `src/app/rankings/components/TrendChart.tsx` | Full season mini line chart |
| `src/app/rankings/components/ShareButton.tsx` | Social share with OG card link |
| `src/app/api/rankings/vote/route.ts` | Vote API (POST agree/disagree) |
| `src/app/api/rankings/snub-vote/route.ts` | Snub poll vote API |
| `src/app/api/rankings/team-resume/route.ts` | Team resume data API |
| `src/app/api/og/ranking/route.tsx` | OG image generation |

### Database Changes
- New table: `ranking_votes`
- New table: `snub_polls`
- New table: `snub_poll_options`
- New table: `snub_poll_votes`
- Altered: `power_rankings` — add `bull_case`, `bear_case`, `context_badges` columns

## Reusable Existing Code
- `src/lib/supabase/static.ts` — Supabase client for RSC
- `src/lib/sports.ts` — `SPORT_META` with sport colors, emojis, names
- `src/components/ui/Breadcrumb.tsx` — Page breadcrumb
- `src/components/ads/PSPPromo.tsx` — Ad placement
- `src/app/globals.css` — Design tokens (--psp-navy, --psp-gold, etc.), animation classes
- Pattern from `src/components/ui/SortableTable.tsx` — mobile card mode toggle
- Pattern from `src/app/[sport]/power-index/page.tsx` — premium card layout for #1 team

## Verification Plan

1. **Database:** Run migrations, verify tables created with `list_tables`
2. **Dev server:** `npm run dev`, navigate to `/rankings`
3. **Layout checks:**
   - Shakeup hero renders with correct movers
   - Category tabs switch content correctly
   - #1 showcase displays with stats
   - Top 3 get gold/silver/bronze treatment
   - Blurbs visible on top 3, expandable on 4–12
4. **Voting:**
   - Click agree/disagree → sentiment bar appears
   - Refresh → vote persists (voter_hash match)
   - Second vote on same ranking blocked
   - Controversy badges appear when disagree > 50%
5. **Snub poll:**
   - Poll renders with options
   - Vote → results update
   - Only 1 vote per user
6. **Team resume:**
   - Click team → resume expands with stats, results, players
   - Player names link to `/[sport]/players/[slug]`
   - Upcoming schedule shows opponent rank
7. **Cross-tier spotlight:**
   - Appears when upcoming games cross leagues
   - Historical context accurate
8. **Share cards:**
   - Share button copies URL
   - `/api/og/ranking?school=X&rank=Y` returns valid image
9. **Responsive:** Check all features on mobile viewport
10. **Preview server:** Use preview tools to verify layout, console errors, and interactions
