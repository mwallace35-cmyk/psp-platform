-- Purge 31 junk-name placeholder rows from public.players and install a guard.
--
-- Context: import artifacts from 2026-03-03 through 2026-03-27 left 31 rows whose
-- `name` is one of: '?', '??', '???', '????', 'team', 'center snap'. Verified on
-- 2026-04-16 that these ids have ZERO references across all 26 FK tables pointing at
-- players.id, so a hard DELETE is safe and cannot cascade.
--
-- A snapshot of the 31 rows is preserved in `_purged_junk_players_2026_04_16` for
-- rollback/audit. Drop the snapshot table later if not needed.

BEGIN;

-- 1. Snapshot the exact rows being deleted
CREATE TABLE IF NOT EXISTS _purged_junk_players_2026_04_16 AS
SELECT *
FROM public.players
WHERE lower(trim(name)) IN ('?', '??', '???', '????', 'team', 'center snap');

-- 2. Hard delete. Expected affected rows: 31.
DELETE FROM public.players
WHERE lower(trim(name)) IN ('?', '??', '???', '????', 'team', 'center snap');

-- 3. Prevent recurrence. NOT VALID first to avoid a full scan; VALIDATE separately.
ALTER TABLE public.players
  ADD CONSTRAINT players_name_not_junk
  CHECK (
    length(trim(name)) > 0
    AND lower(trim(name)) NOT IN ('?', '??', '???', '????', 'team', 'center snap')
  ) NOT VALID;

ALTER TABLE public.players VALIDATE CONSTRAINT players_name_not_junk;

COMMIT;
