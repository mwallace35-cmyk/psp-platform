-- Migration: Merge duplicate school records
-- Date: 2026-03-05
-- Issue: 4 schools have duplicate entries with different IDs, causing duplicate games on team pages
--
-- Duplicates found:
-- Abraham Lincoln: 139 (15 games, 12 ts, 1 champ) → merge into 2697 (1261 games, 62 ts)
-- La Salle College: 1889 (0 games, 17 ts) → merge into 2882 (1906 games, 72 ts)
-- Mastery Charter: 7042 (0 games, 0 ts) → merge into 6464 (218 games, 14 ts)
-- St. Joseph's Prep: 152 (437 games, 63 ts, 1 champ) → merge into 1005 (1419 games, 62 ts, 9 champs)

BEGIN;

-- ============================================================
-- 1. Abraham Lincoln: merge 139 → 2697
-- ============================================================
UPDATE games SET home_school_id = 2697 WHERE home_school_id = 139;
UPDATE games SET away_school_id = 2697 WHERE away_school_id = 139;
UPDATE championships SET school_id = 2697 WHERE school_id = 139;
UPDATE awards SET school_id = 2697 WHERE school_id = 139;
-- team_seasons: skip duplicates (same school+sport+season)
INSERT INTO team_seasons (school_id, sport_id, season_id, wins, losses, ties, league_wins, league_losses, league_ties, points_for, points_against, created_at, updated_at)
  SELECT 2697, sport_id, season_id, wins, losses, ties, league_wins, league_losses, league_ties, points_for, points_against, created_at, updated_at
  FROM team_seasons WHERE school_id = 139
  ON CONFLICT (school_id, sport_id, season_id) DO NOTHING;
DELETE FROM team_seasons WHERE school_id = 139;
-- player seasons
UPDATE football_player_seasons SET school_id = 2697 WHERE school_id = 139;
UPDATE basketball_player_seasons SET school_id = 2697 WHERE school_id = 139;
UPDATE baseball_player_seasons SET school_id = 2697 WHERE school_id = 139;
UPDATE player_seasons_misc SET school_id = 2697 WHERE school_id = 139;
-- soft-delete the duplicate
UPDATE schools SET deleted_at = NOW() WHERE id = 139;

-- ============================================================
-- 2. La Salle College: merge 1889 → 2882
-- ============================================================
UPDATE games SET home_school_id = 2882 WHERE home_school_id = 1889;
UPDATE games SET away_school_id = 2882 WHERE away_school_id = 1889;
UPDATE championships SET school_id = 2882 WHERE school_id = 1889;
UPDATE awards SET school_id = 2882 WHERE school_id = 1889;
INSERT INTO team_seasons (school_id, sport_id, season_id, wins, losses, ties, league_wins, league_losses, league_ties, points_for, points_against, created_at, updated_at)
  SELECT 2882, sport_id, season_id, wins, losses, ties, league_wins, league_losses, league_ties, points_for, points_against, created_at, updated_at
  FROM team_seasons WHERE school_id = 1889
  ON CONFLICT (school_id, sport_id, season_id) DO NOTHING;
DELETE FROM team_seasons WHERE school_id = 1889;
UPDATE football_player_seasons SET school_id = 2882 WHERE school_id = 1889;
UPDATE basketball_player_seasons SET school_id = 2882 WHERE school_id = 1889;
UPDATE baseball_player_seasons SET school_id = 2882 WHERE school_id = 1889;
UPDATE player_seasons_misc SET school_id = 2882 WHERE school_id = 1889;
UPDATE schools SET deleted_at = NOW() WHERE id = 1889;

-- ============================================================
-- 3. Mastery Charter: merge 7042 → 6464
-- ============================================================
UPDATE games SET home_school_id = 6464 WHERE home_school_id = 7042;
UPDATE games SET away_school_id = 6464 WHERE away_school_id = 7042;
UPDATE championships SET school_id = 6464 WHERE school_id = 7042;
UPDATE awards SET school_id = 6464 WHERE school_id = 7042;
INSERT INTO team_seasons (school_id, sport_id, season_id, wins, losses, ties, league_wins, league_losses, league_ties, points_for, points_against, created_at, updated_at)
  SELECT 6464, sport_id, season_id, wins, losses, ties, league_wins, league_losses, league_ties, points_for, points_against, created_at, updated_at
  FROM team_seasons WHERE school_id = 7042
  ON CONFLICT (school_id, sport_id, season_id) DO NOTHING;
DELETE FROM team_seasons WHERE school_id = 7042;
UPDATE football_player_seasons SET school_id = 6464 WHERE school_id = 7042;
UPDATE basketball_player_seasons SET school_id = 6464 WHERE school_id = 7042;
UPDATE baseball_player_seasons SET school_id = 6464 WHERE school_id = 7042;
UPDATE player_seasons_misc SET school_id = 6464 WHERE school_id = 7042;
UPDATE schools SET deleted_at = NOW() WHERE id = 7042;

-- ============================================================
-- 4. St. Joseph's Prep: merge 152 → 1005
-- ============================================================
-- First, set league_id on canonical (1005 has NULL, 152 has 1)
UPDATE schools SET league_id = 1 WHERE id = 1005 AND league_id IS NULL;

UPDATE games SET home_school_id = 1005 WHERE home_school_id = 152;
UPDATE games SET away_school_id = 1005 WHERE away_school_id = 152;
UPDATE championships SET school_id = 1005 WHERE school_id = 152;
UPDATE awards SET school_id = 1005 WHERE school_id = 152;
INSERT INTO team_seasons (school_id, sport_id, season_id, wins, losses, ties, league_wins, league_losses, league_ties, points_for, points_against, created_at, updated_at)
  SELECT 1005, sport_id, season_id, wins, losses, ties, league_wins, league_losses, league_ties, points_for, points_against, created_at, updated_at
  FROM team_seasons WHERE school_id = 152
  ON CONFLICT (school_id, sport_id, season_id) DO NOTHING;
DELETE FROM team_seasons WHERE school_id = 152;
UPDATE football_player_seasons SET school_id = 1005 WHERE school_id = 152;
UPDATE basketball_player_seasons SET school_id = 1005 WHERE school_id = 152;
UPDATE baseball_player_seasons SET school_id = 1005 WHERE school_id = 152;
UPDATE player_seasons_misc SET school_id = 1005 WHERE school_id = 152;
UPDATE schools SET deleted_at = NOW() WHERE id = 152;

-- ============================================================
-- 5. Also set league_id on Mastery Charter canonical if NULL
-- ============================================================
UPDATE schools SET league_id = 2 WHERE id = 6464 AND league_id IS NULL;

-- ============================================================
-- 6. Delete true duplicate games (same date + same two schools + same scores)
-- After merging school IDs, some games that were from different school IDs
-- now have identical teams. Remove the duplicates, keeping the lowest ID.
-- ============================================================
DELETE FROM games
WHERE id IN (
  SELECT g2.id
  FROM games g1
  JOIN games g2 ON g1.id < g2.id
    AND g1.game_date = g2.game_date
    AND g1.sport_id = g2.sport_id
    AND LEAST(g1.home_school_id, g1.away_school_id) = LEAST(g2.home_school_id, g2.away_school_id)
    AND GREATEST(g1.home_school_id, g1.away_school_id) = GREATEST(g2.home_school_id, g2.away_school_id)
    AND g1.home_score IS NOT NULL
    AND g2.home_score IS NOT NULL
    AND (
      (g1.home_score = g2.home_score AND g1.away_score = g2.away_score)
      OR
      (g1.home_score = g2.away_score AND g1.away_score = g2.home_score)
    )
);

COMMIT;
