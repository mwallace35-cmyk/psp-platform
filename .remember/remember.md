# Handoff

## State
I pushed 90 PCL basketball box scores from AOP PDFs (S3 direct download worked after extracting correct paths from calendar page). Game pages now hide season_average data and show "Submit Stats" CTA instead. Fixed basketball hub: sport-aware top performers (PPG/RPG/APG), playoff round badges on scores, cycling power rankings (City/Public/Catholic). Sport hub layout redesign agent is running in background (editorial-first: featured article hero → news → scores → rankings → leaders → standings for all 7 sports). Design audit score: ~7.5/10 across 43 pages after 4 fix passes. DB: 70 tables, 776K rows, Supabase Pro.

## Next
1. Check if sport hub redesign agent completed — build/push if so, fix if not (`src/app/[sport]/page.tsx`, `src/components/sport-layouts/`)
2. Continue MaxPreps box score scraping for non-PCL schools (Public League, Inter-Ac) — MaxPreps has limited per-game data, most coaches don't enter stats
3. Imhotep Charter stats are estimated from 5 playoff box scores — high priority to get full season data

## Context
- AOP PDFs: S3 base is `s3.amazonaws.com/sidearm.sites/aopcatholicschools.sidearmsports.com` + path from calendar page (NOT from JSON URL lists which had wrong paths). 90 of ~130 league games have real PDFs.
- `parse_boxscores.py` school IDs are NOW correct (AC=145, AW=144, DP=254). Previously had wrong IDs.
- DB password: `9UxYAVWEOmdQAKEZ` for psql. Use `export PATH="/opt/homebrew/opt/libpq/bin:$PATH"` before psql.
- User prefers editorial-first layout (Bleacher Report style) for sport hubs, applied to ALL sports.
- Season averages are filtered OUT of game pages — only real box_score/archive data shows. No more misleading per-game averages.
