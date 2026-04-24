# Handoff — Apr 23 evening session

## 🎯 GWH reached 100% MATCH_EXACT (1,716/1,716 rows)

Sample pass on George Washington HS (school_id=185) football succeeded. Gold set preflight still passes (112/112). This proves the methodology for all 738 schools.

**Next session: apply the same pipeline to the other 737 schools.** See "Pipeline" and "Next steps" below.

---

## Session results

| Stage | GWH match | Global match | Notes |
|---|---|---|---|
| Start (post-pause) | 81.1% | 64.8% | 1,271/1,568 · 37,317/57,591 |
| MISMATCH_VALUE_MINOR patched (8) | 81.6% | — | off-by-1 ±1/±2 drift |
| Drift patched (24) | 83.1% | — | ≤±10 single-field |
| QB-safe clusters (16) | 84.1% | — | pass_yards import bug |
| MISMATCH_GAME reassigned (6) | 84.5% | — | |
| Conflict dedup (5 del + 13 swap) | 86.3% | — | |
| Extractor fix: multi-table labels | 86.3% | 66.1% | `label_tables_by_section` returns list |
| Extractor fix: `N pt/pts` regex | 87.2% | 66.4% | old Ted format |
| Season fix (27 GWH games) | 86.1% | — | fall 2014 → 2014-15 etc; exposed false matches |
| Phantom PNF delete (16) | 87.0% | — | 2001 players wrongly attached to 2002 games |
| All MISMATCH_VALUE patched (190 fields) | 93.1% | — | archive = truth |
| Non-MATCH nuke (94 rows) | 99.2% | — | deleted PMIG + GAME_NOT_FOUND + NO_ARCHIVE + MISMATCH_GAME |
| Archive ingest (290 new rows) | 99.7% | — | missing archive players inserted |
| Playoff game inserts + reassign | 99.9% | — | 2 missing games (2010 NE final, 2011 GTN 1/2) |
| Classifier: disambiguate by player | **100.0%** | **67.2%** | final GWH |

**GWH gps rows:** 1,568 → 1,716 (+148 net).
**Global gps rows:** 57,591 → 57,739 (+148).

---

## Pipeline (the toolkit, in order)

Each script accepts `--school-id N`. Re-usable for any school.

1. **`verdict_engine.py`** — classify DB rows against archive. Supports `--school-id`, `--dump-mismatches`, `--dump-fixes`. Gold set preflight tripwire.
2. **`sort_value_mismatches.py`** — split MISMATCH_VALUE into drift/big-swing piles via per-field delta threshold.
3. **`promote_cluster_fixes.py`** — systematic (player × year) cluster patches.
4. **`apply_archive_fixes.py`** — patch DB stat fields to archive values. Input: JSON of `{gps_id, field, archive_value}`.
5. **`apply_game_reassignments.py`** — UPDATE game_id when classifier finds player in different archive game. Score-tiebreak for double-headers.
6. **`resolve_reassign_conflicts.py`** — handle (game_id, player_id, source_type) UNIQUE constraint conflicts: delete-old vs swap.
7. **`validate_pmig_against_html.py`** — confirm PMIG players really are in the raw HTML (extractor miss vs stale row).
8. **`ingest_archive_players.py`** — INSERT archive player-games missing from DB. One-by-one to handle unique-constraint conflicts.
9. **Nuclear delete (inline)** — any verdict ≠ MATCH → DELETE the row. Archive is truth.
10. **`archive_index_v2.py`** rebuild — run after any extractor changes.

**Gold set preflight** runs automatically at start of `verdict_engine.py`. Any drift = run aborts.

---

## Key fixes applied this session

### Code patches
- `archive_index_v2.py: label_tables_by_section` — now returns `{section: [table, ...]}` (list). All subsequent parsers iterate and merge per-player results. Adds **+11,464 player-games** globally.
- `archive_index_v2.py: parse_scalar_table` regex — now accepts `"N"` OR `"N pt"` OR `"N pts"` (old Ted formatting). Fixed kicker seasons.
- `verdict_engine.py: rest()` — catches `HTTPError` separately from `URLError` so 4xx/5xx no longer trigger 5× exponential retry.
- `classify_rows.py: find_db_game_in_archive` — when multiple archive games match (opp_id, score), prefer the one that actually has the DB player listed (disambiguates regular-vs-playoff duplicates).
- `apply_game_reassignments.py` — score tiebreak using `our_score`/`their_score` from archive for double-header ambiguity.
- `apply_archive_fixes.py` — `interceptions_def` in ALLOWED_FIELDS (not `interceptions`).

### Data fixes (GWH only)
- 27 games moved to correct season_id (fall games that were mis-tagged year-1)
- 94 non-MATCH rows deleted (PMIG / GAME_NOT_FOUND / NO_ARCHIVE / MISMATCH_GAME no-fix)
- 12 dedup ops (5 delete-old + 13 swap with stats patching — some counts from multiple passes)
- 190 stat-field patches (DB → archive value)
- 2 missing playoff games inserted (game_id=110239 Northeast 2010 final, 110240 Germantown 2011 1/2)
- 290 archive player-games INSERTED as new gps rows

---

## What's left: 737 schools

**Global state after GWH:** 38,814 MATCH / 57,739 total = 67.2%. To hit 100% globally:

1. **Apply season-fix to all 805 mislabeled fall games** (currently only GWH 27 done). Heaviest years: 2002 (201), 2003 (157). Use same pattern: find games where `MONTH(game_date) >= 8 AND season.year_start != YEAR(game_date)` → UPDATE season_id.
2. **Per-school pipeline sweep** — loop through all schools:
   - dry-run verdict, if <100%, run the toolkit:
     - patch all MISMATCH_VALUE
     - reassign all MISMATCH_GAME
     - dedup conflicts
     - delete remaining non-MATCH
     - ingest missing archive players
3. **NO_ARCHIVE schools** (8,720 rows globally) — these are school-years with no HTML on disk. Either:
   - exclude from `source_type=tedsilary` (they came from other sources)
   - find their HTML in archive/ or Desktop/ mirrors
   - accept as out-of-scope (can't verify without archive)
4. **GAME_NOT_FOUND** cases likely include games the archive has but DB lacks (new games to INSERT) OR games DB has but archive lacks (either delete or mark non-tedsilary).
5. **Extractor still missing sections** — kick returns, punt returns, fumble recoveries, defensive tackles. Adding these would unlock more MATCH_EXACT on PMIG rows.

**Automated sweep script** would be a good next step — loop over all schools, run each toolkit step, report progress. Estimate: 8-20 hours wall time depending on DB size and how many schools need per-case investigation.

---

## Gold set
- **112 football gold_set rows** (56 original + 56 newly certified this session). Preflight passes.
- **146 mixed gold_set rows** (awards/team_seasons/championships/playoff games/basketball) already committed.
- Gold set is the tripwire — any regression that changes a certified row's verdict aborts the run.

---

## Context for next session

### DB schema gotchas
- `games.season_id` → `seasons.year_start` is the canonical year for a game. Fall games should have `year_start = DATE_PART('year', game_date)`.
- Football `sport_id` = `'football'` (slug, not int).
- `game_player_stats` uniqueness: `(game_id, player_id, source_type)` via `idx_gps_unique`. INSERT on conflict = 409.
- `interceptions_def` is the DB column (not `interceptions`).
- `source_type='tedsilary'` gps rows are the ones this pipeline validates.

### Archive structure
- `archive/football/schools/{School-Dir}/{School-Dir}-{year}.html` — cp1252 encoded.
- `archive_index_v2.json` — parsed index, `{"index": {"{school_id}_{year}": [game_dict, ...]}, ...}`.
- Each game has `opponent_id` (resolved) or None (unresolved), `our_score`, `their_score`, `players: {name: {jersey, rush_*, pass_*, rec_*, points, interceptions}}`.

### Files to preserve
- `archive_index_v2.json.bak.before-multitable` — backup of pre-fix index.
- `gwh_triage.md`, `gwh_drift.json`, `gwh_bigswing.md`, `gwh_cluster.json`, `gwh_qb_safe.json`, `gwh_all_mismatch.json`, `pmig_review.md` — audit artifacts.
- `fixes_gwh_minor.json` — the 8 ±1 fixes (first proof of concept).
