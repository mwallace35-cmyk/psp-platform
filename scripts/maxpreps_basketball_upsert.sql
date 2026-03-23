-- MaxPreps 2025-26 Basketball Season Stats - PCL Schools
-- Generated from scrape_maxpreps_basketball.py output
-- Total players: 47
-- Schools: Neumann-Goretti, Archbishop Ryan, Devon Prep, Lansdale Catholic

BEGIN;

-- Neumann-Goretti (school_id=198) - MaxPreps 2025-26 Season Stats
-- Source: MaxPreps print stats page, scraped 2026-03-23

-- Player: Deshawn Yates #0 - 20 GP, 276 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Deshawn Yates'
    AND primary_school_id = 198
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Deshawn Yates')
        AND primary_school_id = 198
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Deshawn Yates', 'deshawn-yates-198', 198)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Deshawn Yates (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 198,
        20,
        276,
        13.8,
        100,
        169,
        59.0,
        15,
        35,
        43.0,
        61,
        78,
        78.0,
        19,
        71,
        90,
        4.5,
        108,
        5.4,
        56,
        5,
        27,
        '0',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Stephan Ashley-Wright #2 - 13 GP, 117 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Stephan Ashley-Wright'
    AND primary_school_id = 198
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Stephan Ashley-Wright')
        AND primary_school_id = 198
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Stephan Ashley-Wright', 'stephan-ashley-wright-198', 198)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Stephan Ashley-Wright (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 198,
        13,
        117,
        9.0,
        46,
        116,
        40.0,
        12,
        41,
        29.0,
        13,
        21,
        62.0,
        8,
        33,
        41,
        3.2,
        39,
        3.0,
        29,
        0,
        24,
        '2',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Kody Colson #3 - 20 GP, 251 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Kody Colson'
    AND primary_school_id = 198
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Kody Colson')
        AND primary_school_id = 198
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Kody Colson', 'kody-colson-198', 198)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Kody Colson (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 198,
        20,
        251,
        12.6,
        86,
        201,
        43.0,
        48,
        134,
        36.0,
        31,
        42,
        74.0,
        1,
        43,
        44,
        2.2,
        60,
        3.0,
        15,
        0,
        40,
        '3',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Oreace Torrance #4 - 6 GP, 0 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Oreace Torrance'
    AND primary_school_id = 198
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Oreace Torrance')
        AND primary_school_id = 198
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Oreace Torrance', 'oreace-torrance-198', 198)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Oreace Torrance (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 198,
        6,
        0,
        0.0,
        0,
        6,
        0.0,
        0,
        1,
        0.0,
        NULL,
        NULL,
        NULL,
        2,
        1,
        3,
        0.5,
        1,
        0.2,
        2,
        NULL,
        1,
        '4',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Ernest (E.J.) Stanton #5 - 20 GP, 144 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Ernest (E.J.) Stanton'
    AND primary_school_id = 198
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Ernest (E.J.) Stanton')
        AND primary_school_id = 198
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Ernest (E.J.) Stanton', 'ernest-e-j-stanton-198', 198)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Ernest (E.J.) Stanton (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 198,
        20,
        144,
        7.2,
        53,
        125,
        42.0,
        25,
        71,
        35.0,
        13,
        19,
        68.0,
        10,
        19,
        29,
        1.5,
        46,
        2.3,
        21,
        5,
        14,
        '5',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Marquis Newson #10 - 20 GP, 252 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Marquis Newson'
    AND primary_school_id = 198
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Marquis Newson')
        AND primary_school_id = 198
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Marquis Newson', 'marquis-newson-198', 198)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Marquis Newson (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 198,
        20,
        252,
        12.6,
        100,
        203,
        49.0,
        12,
        47,
        26.0,
        40,
        55,
        73.0,
        25,
        109,
        134,
        6.7,
        55,
        2.8,
        24,
        38,
        33,
        '10',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: London Collins #11 - 20 GP, 125 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'London Collins'
    AND primary_school_id = 198
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('London Collins')
        AND primary_school_id = 198
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('London Collins', 'london-collins-198', 198)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: London Collins (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 198,
        20,
        125,
        6.3,
        42,
        103,
        41.0,
        14,
        42,
        33.0,
        27,
        39,
        69.0,
        22,
        18,
        40,
        2.0,
        9,
        0.5,
        14,
        7,
        7,
        '11',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Zion Ricks #12 - 1 GP, 0 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Zion Ricks'
    AND primary_school_id = 198
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Zion Ricks')
        AND primary_school_id = 198
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Zion Ricks', 'zion-ricks-198', 198)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Zion Ricks (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 198,
        1,
        0,
        0.0,
        0,
        1,
        0.0,
        0,
        1,
        0.0,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        1,
        '12',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Ethan Vest #14 - 7 GP, 2 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Ethan Vest'
    AND primary_school_id = 198
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Ethan Vest')
        AND primary_school_id = 198
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Ethan Vest', 'ethan-vest-198', 198)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Ethan Vest (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 198,
        7,
        2,
        0.3,
        0,
        1,
        0.0,
        NULL,
        NULL,
        NULL,
        2,
        2,
        100.0,
        NULL,
        1,
        1,
        0.1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        '14',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Oscar Briskin #15 - 7 GP, 3 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Oscar Briskin'
    AND primary_school_id = 198
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Oscar Briskin')
        AND primary_school_id = 198
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Oscar Briskin', 'oscar-briskin-198', 198)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Oscar Briskin (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 198,
        7,
        3,
        0.4,
        1,
        4,
        25.0,
        1,
        3,
        33.0,
        NULL,
        NULL,
        NULL,
        1,
        NULL,
        1,
        0.1,
        NULL,
        NULL,
        NULL,
        1,
        1,
        '15',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Allassane N'Diaye #21 - 20 GP, 313 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Allassane N''Diaye'
    AND primary_school_id = 198
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Allassane N''Diaye')
        AND primary_school_id = 198
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Allassane N''Diaye', 'allassane-n-diaye-198', 198)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Allassane N''Diaye (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 198,
        20,
        313,
        15.7,
        130,
        246,
        53.0,
        14,
        48,
        29.0,
        39,
        70,
        56.0,
        80,
        67,
        147,
        7.4,
        23,
        1.2,
        25,
        25,
        21,
        '21',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Ethan Tran #22 - 7 GP, 0 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Ethan Tran'
    AND primary_school_id = 198
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Ethan Tran')
        AND primary_school_id = 198
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Ethan Tran', 'ethan-tran-198', 198)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Ethan Tran (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 198,
        7,
        0,
        0.0,
        0,
        2,
        0.0,
        0,
        1,
        0.0,
        NULL,
        NULL,
        NULL,
        NULL,
        1,
        1,
        0.1,
        1,
        0.1,
        1,
        NULL,
        NULL,
        '22',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Amar'e White #23 - 2 GP, 0 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Amar''e White'
    AND primary_school_id = 198
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Amar''e White')
        AND primary_school_id = 198
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Amar''e White', 'amar-e-white-198', 198)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Amar''e White (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 198,
        2,
        0,
        0.0,
        0,
        1,
        0.0,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        '23',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Jayden Williams #55 - 8 GP, 3 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Jayden Williams'
    AND primary_school_id = 198
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Jayden Williams')
        AND primary_school_id = 198
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Jayden Williams', 'jayden-williams-198', 198)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Jayden Williams (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 198,
        8,
        3,
        0.4,
        1,
        4,
        25.0,
        1,
        2,
        50.0,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        1,
        NULL,
        NULL,
        '55',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Archbishop Ryan (school_id=175) - MaxPreps 2025-26 Season Stats
-- Source: MaxPreps print stats page, scraped 2026-03-23

-- Player: Isaiah Gore #0 - 21 GP, 246 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Isaiah Gore'
    AND primary_school_id = 175
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Isaiah Gore')
        AND primary_school_id = 175
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Isaiah Gore', 'isaiah-gore-175', 175)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Isaiah Gore (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 175,
        21,
        246,
        11.7,
        91,
        192,
        47.0,
        27,
        73,
        37.0,
        37,
        48,
        77.0,
        15,
        68,
        83,
        4.0,
        57,
        2.7,
        12,
        2,
        33,
        '0',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Matt Johnson #1 - 21 GP, 165 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Matt Johnson'
    AND primary_school_id = 175
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Matt Johnson')
        AND primary_school_id = 175
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Matt Johnson', 'matt-johnson-175', 175)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Matt Johnson (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 175,
        21,
        165,
        7.9,
        60,
        136,
        44.0,
        6,
        11,
        55.0,
        39,
        54,
        72.0,
        18,
        54,
        72,
        3.4,
        115,
        5.5,
        25,
        4,
        48,
        '1',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Kaden Brown #3 - 21 GP, 195 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Kaden Brown'
    AND primary_school_id = 175
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Kaden Brown')
        AND primary_school_id = 175
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Kaden Brown', 'kaden-brown-175', 175)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Kaden Brown (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 175,
        21,
        195,
        9.3,
        60,
        179,
        34.0,
        29,
        110,
        26.0,
        46,
        57,
        81.0,
        18,
        53,
        70,
        3.3,
        45,
        2.1,
        27,
        1,
        32,
        '3',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Seth Gaye #5 - 16 GP, 152 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Seth Gaye'
    AND primary_school_id = 175
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Seth Gaye')
        AND primary_school_id = 175
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Seth Gaye', 'seth-gaye-175', 175)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Seth Gaye (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 175,
        16,
        152,
        9.5,
        56,
        117,
        48.0,
        16,
        54,
        30.0,
        24,
        33,
        73.0,
        10,
        57,
        67,
        4.2,
        36,
        2.3,
        40,
        9,
        20,
        '5',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Brett Mariani #10 - 9 GP, 23 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Brett Mariani'
    AND primary_school_id = 175
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Brett Mariani')
        AND primary_school_id = 175
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Brett Mariani', 'brett-mariani-175', 175)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Brett Mariani (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 175,
        9,
        23,
        2.6,
        8,
        17,
        47.0,
        6,
        15,
        40.0,
        1,
        2,
        50.0,
        2,
        4,
        6,
        0.7,
        2,
        0.2,
        2,
        0,
        1,
        '10',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Jack Rock #11 - 1 GP, 0 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Jack Rock'
    AND primary_school_id = 175
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Jack Rock')
        AND primary_school_id = 175
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Jack Rock', 'jack-rock-175', 175)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Jack Rock (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 175,
        1,
        0,
        0.0,
        0,
        1,
        0.0,
        0,
        0,
        0.0,
        0,
        0,
        0.0,
        0,
        0,
        0,
        0.0,
        1,
        1.0,
        0,
        0,
        0,
        '11',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Malik Hughes #15 - 21 GP, 422 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Malik Hughes'
    AND primary_school_id = 175
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Malik Hughes')
        AND primary_school_id = 175
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Malik Hughes', 'malik-hughes-175', 175)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Malik Hughes (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 175,
        21,
        422,
        20.1,
        150,
        342,
        44.0,
        13,
        51,
        25.0,
        109,
        143,
        76.0,
        40,
        76,
        116,
        5.5,
        38,
        1.8,
        19,
        17,
        64,
        '15',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Ej McNeil #22 - 9 GP, 0 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Ej McNeil'
    AND primary_school_id = 175
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Ej McNeil')
        AND primary_school_id = 175
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Ej McNeil', 'ej-mcneil-175', 175)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Ej McNeil (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 175,
        9,
        0,
        0.0,
        0,
        6,
        0.0,
        0,
        3,
        0.0,
        0,
        0,
        0.0,
        5,
        5,
        9,
        1.0,
        1,
        0.1,
        4,
        0,
        2,
        '22',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Ej McNeill #22 - 3 GP, 0 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Ej McNeill'
    AND primary_school_id = 175
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Ej McNeill')
        AND primary_school_id = 175
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Ej McNeill', 'ej-mcneill-175', 175)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Ej McNeill (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 175,
        3,
        0,
        0.0,
        0,
        0,
        NULL,
        0,
        0,
        0.0,
        0,
        0,
        0.0,
        0,
        0,
        0,
        0.0,
        1,
        0.3,
        1,
        0,
        2,
        '22',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: James Samuel #25 - 5 GP, 10 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'James Samuel'
    AND primary_school_id = 175
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('James Samuel')
        AND primary_school_id = 175
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('James Samuel', 'james-samuel-175', 175)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: James Samuel (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 175,
        5,
        10,
        2.0,
        3,
        4,
        75.0,
        2,
        3,
        67.0,
        2,
        2,
        100.0,
        1,
        1,
        2,
        0.4,
        0,
        0.0,
        0,
        0,
        0,
        '25',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Cj Williams #30 - 4 GP, 11 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Cj Williams'
    AND primary_school_id = 175
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Cj Williams')
        AND primary_school_id = 175
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Cj Williams', 'cj-williams-175', 175)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Cj Williams (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 175,
        4,
        11,
        2.8,
        3,
        4,
        75.0,
        3,
        4,
        75.0,
        2,
        2,
        100.0,
        0,
        3,
        3,
        0.8,
        1,
        0.3,
        2,
        0,
        0,
        '30',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Gavin Kpan #31 - 20 GP, 53 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Gavin Kpan'
    AND primary_school_id = 175
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Gavin Kpan')
        AND primary_school_id = 175
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Gavin Kpan', 'gavin-kpan-175', 175)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Gavin Kpan (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 175,
        20,
        53,
        2.7,
        22,
        44,
        50.0,
        0,
        0,
        0.0,
        9,
        22,
        41.0,
        37,
        42,
        79,
        4.0,
        16,
        0.8,
        26,
        27,
        11,
        '31',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Jeremy Thompson #31 - 10 GP, 62 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Jeremy Thompson'
    AND primary_school_id = 175
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Jeremy Thompson')
        AND primary_school_id = 175
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Jeremy Thompson', 'jeremy-thompson-175', 175)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Jeremy Thompson (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 175,
        10,
        62,
        6.2,
        24,
        40,
        60.0,
        6,
        15,
        40.0,
        8,
        14,
        57.0,
        4,
        9,
        12,
        1.2,
        3,
        0.3,
        8,
        4,
        8,
        '31',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Jack McMullin #33 - 15 GP, 53 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Jack McMullin'
    AND primary_school_id = 175
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Jack McMullin')
        AND primary_school_id = 175
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Jack McMullin', 'jack-mcmullin-175', 175)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Jack McMullin (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 175,
        15,
        53,
        3.5,
        17,
        43,
        40.0,
        16,
        37,
        43.0,
        3,
        7,
        43.0,
        4,
        30,
        34,
        2.3,
        10,
        0.7,
        5,
        1,
        5,
        '33',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Devon Prep (school_id=254) - MaxPreps 2025-26 Season Stats
-- Source: MaxPreps print stats page, scraped 2026-03-23

-- Player: Brennan Wood #2 - 1 GP, 2 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Brennan Wood'
    AND primary_school_id = 254
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Brennan Wood')
        AND primary_school_id = 254
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Brennan Wood', 'brennan-wood-254', 254)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Brennan Wood (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 254,
        1,
        2,
        2.0,
        0,
        1,
        0.0,
        0,
        1,
        0.0,
        2,
        2,
        100.0,
        0,
        2,
        2,
        2.0,
        1,
        1.0,
        3,
        0,
        1,
        '2',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Dillon Johnson #3 - 27 GP, 142 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Dillon Johnson'
    AND primary_school_id = 254
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Dillon Johnson')
        AND primary_school_id = 254
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Dillon Johnson', 'dillon-johnson-254', 254)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Dillon Johnson (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 254,
        27,
        142,
        5.3,
        48,
        97,
        49.0,
        32,
        73,
        44.0,
        14,
        18,
        78.0,
        14,
        24,
        38,
        1.4,
        23,
        0.9,
        25,
        3,
        20,
        '3',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Jayden Allen-Bates #4 - 25 GP, 52 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Jayden Allen-Bates'
    AND primary_school_id = 254
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Jayden Allen-Bates')
        AND primary_school_id = 254
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Jayden Allen-Bates', 'jayden-allen-bates-254', 254)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Jayden Allen-Bates (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 254,
        25,
        52,
        2.1,
        19,
        44,
        43.0,
        0,
        8,
        0.0,
        14,
        25,
        56.0,
        10,
        18,
        28,
        1.1,
        8,
        0.3,
        21,
        2,
        19,
        '4',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Owen Raymond #5 - 27 GP, 170 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Owen Raymond'
    AND primary_school_id = 254
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Owen Raymond')
        AND primary_school_id = 254
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Owen Raymond', 'owen-raymond-254', 254)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Owen Raymond (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 254,
        27,
        170,
        6.3,
        67,
        182,
        37.0,
        19,
        75,
        25.0,
        17,
        30,
        57.0,
        19,
        53,
        72,
        2.7,
        77,
        2.9,
        43,
        9,
        74,
        '5',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Jaden Craft #10 - 27 GP, 293 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Jaden Craft'
    AND primary_school_id = 254
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Jaden Craft')
        AND primary_school_id = 254
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Jaden Craft', 'jaden-craft-254', 254)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Jaden Craft (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 254,
        27,
        293,
        10.9,
        85,
        201,
        42.0,
        41,
        122,
        34.0,
        82,
        102,
        80.0,
        27,
        82,
        109,
        4.0,
        58,
        2.1,
        53,
        13,
        64,
        '10',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Saeed Garrett #11 - 23 GP, 73 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Saeed Garrett'
    AND primary_school_id = 254
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Saeed Garrett')
        AND primary_school_id = 254
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Saeed Garrett', 'saeed-garrett-254', 254)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Saeed Garrett (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 254,
        23,
        73,
        3.2,
        23,
        82,
        28.0,
        13,
        51,
        25.0,
        14,
        18,
        78.0,
        5,
        14,
        18,
        0.8,
        19,
        0.8,
        8,
        0,
        12,
        '11',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Jack Doyle #12 - 1 GP, 0 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Jack Doyle'
    AND primary_school_id = 254
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Jack Doyle')
        AND primary_school_id = 254
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Jack Doyle', 'jack-doyle-254', 254)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Jack Doyle (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 254,
        1,
        0,
        0.0,
        0,
        0,
        NULL,
        0,
        0,
        0.0,
        0,
        0,
        0.0,
        0,
        0,
        0,
        0.0,
        0,
        0.0,
        0,
        0,
        2,
        '12',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Cooper Fairlamb #13 - 26 GP, 212 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Cooper Fairlamb'
    AND primary_school_id = 254
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Cooper Fairlamb')
        AND primary_school_id = 254
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Cooper Fairlamb', 'cooper-fairlamb-254', 254)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Cooper Fairlamb (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 254,
        26,
        212,
        8.2,
        81,
        204,
        40.0,
        12,
        52,
        23.0,
        38,
        53,
        72.0,
        11,
        85,
        96,
        3.7,
        107,
        4.1,
        29,
        9,
        80,
        '13',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Joe McGuinn #14 - 10 GP, 23 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Joe McGuinn'
    AND primary_school_id = 254
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Joe McGuinn')
        AND primary_school_id = 254
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Joe McGuinn', 'joe-mcguinn-254', 254)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Joe McGuinn (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 254,
        10,
        23,
        2.3,
        11,
        19,
        58.0,
        0,
        3,
        0.0,
        1,
        2,
        50.0,
        9,
        9,
        18,
        1.8,
        5,
        0.5,
        1,
        1,
        8,
        '14',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Shawn Wheeler #15 - 8 GP, 3 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Shawn Wheeler'
    AND primary_school_id = 254
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Shawn Wheeler')
        AND primary_school_id = 254
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Shawn Wheeler', 'shawn-wheeler-254', 254)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Shawn Wheeler (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 254,
        8,
        3,
        0.4,
        1,
        5,
        20.0,
        1,
        3,
        33.0,
        0,
        0,
        0.0,
        0,
        7,
        7,
        0.9,
        8,
        1.0,
        1,
        0,
        2,
        '15',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Caleb Tesfaye #20 - 20 GP, 49 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Caleb Tesfaye'
    AND primary_school_id = 254
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Caleb Tesfaye')
        AND primary_school_id = 254
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Caleb Tesfaye', 'caleb-tesfaye-254', 254)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Caleb Tesfaye (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 254,
        20,
        49,
        2.5,
        21,
        49,
        43.0,
        1,
        9,
        11.0,
        6,
        8,
        75.0,
        12,
        15,
        27,
        1.4,
        4,
        0.2,
        4,
        7,
        13,
        '20',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: John Doogan #21 - 26 GP, 257 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'John Doogan'
    AND primary_school_id = 254
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('John Doogan')
        AND primary_school_id = 254
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('John Doogan', 'john-doogan-254', 254)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: John Doogan (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 254,
        26,
        257,
        9.9,
        102,
        188,
        54.0,
        13,
        46,
        28.0,
        40,
        66,
        61.0,
        22,
        60,
        82,
        3.2,
        31,
        1.2,
        29,
        10,
        31,
        '21',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Luke Johnson #23 - 6 GP, 16 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Luke Johnson'
    AND primary_school_id = 254
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Luke Johnson')
        AND primary_school_id = 254
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Luke Johnson', 'luke-johnson-254', 254)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Luke Johnson (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 254,
        6,
        16,
        2.7,
        6,
        9,
        67.0,
        2,
        3,
        67.0,
        2,
        2,
        100.0,
        3,
        3,
        6,
        1.0,
        1,
        0.2,
        1,
        2,
        4,
        '23',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Braeden Fisher #33 - 26 GP, 148 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Braeden Fisher'
    AND primary_school_id = 254
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Braeden Fisher')
        AND primary_school_id = 254
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Braeden Fisher', 'braeden-fisher-254', 254)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Braeden Fisher (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 254,
        26,
        148,
        5.7,
        63,
        130,
        48.0,
        5,
        18,
        28.0,
        17,
        30,
        57.0,
        29,
        80,
        109,
        4.2,
        52,
        2.0,
        43,
        13,
        47,
        '33',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: James Kaune #34 - 21 GP, 57 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'James Kaune'
    AND primary_school_id = 254
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('James Kaune')
        AND primary_school_id = 254
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('James Kaune', 'james-kaune-254', 254)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: James Kaune (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 254,
        21,
        57,
        2.7,
        23,
        63,
        37.0,
        6,
        15,
        40.0,
        7,
        16,
        44.0,
        18,
        9,
        27,
        1.3,
        10,
        0.5,
        10,
        1,
        7,
        '34',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Cincere Mate #41 - 1 GP, 0 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Cincere Mate'
    AND primary_school_id = 254
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Cincere Mate')
        AND primary_school_id = 254
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Cincere Mate', 'cincere-mate-254', 254)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Cincere Mate (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 254,
        1,
        0,
        0.0,
        0,
        4,
        0.0,
        0,
        2,
        0.0,
        0,
        0,
        0.0,
        0,
        1,
        1,
        1.0,
        0,
        0.0,
        1,
        0,
        3,
        '41',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Lansdale Catholic (school_id=971) - MaxPreps 2025-26 Season Stats
-- Source: MaxPreps print stats page, scraped 2026-03-23

-- Player: Ayden Lewis #1 - 1 GP, 14 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Ayden Lewis'
    AND primary_school_id = 971
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Ayden Lewis')
        AND primary_school_id = 971
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Ayden Lewis', 'ayden-lewis-971', 971)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Ayden Lewis (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 971,
        1,
        14,
        14.0,
        7,
        10,
        70.0,
        1,
        1,
        100.0,
        1,
        2,
        50.0,
        2,
        4,
        6,
        6.0,
        1,
        1.0,
        1,
        1,
        3,
        '1',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Tony Fitzgerald #2 - 1 GP, 0 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Tony Fitzgerald'
    AND primary_school_id = 971
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Tony Fitzgerald')
        AND primary_school_id = 971
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Tony Fitzgerald', 'tony-fitzgerald-971', 971)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Tony Fitzgerald (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 971,
        1,
        0,
        0.0,
        0,
        5,
        0.0,
        0,
        2,
        0.0,
        0,
        2,
        0.0,
        2,
        1,
        3,
        3.0,
        6,
        6.0,
        0,
        0,
        0,
        '2',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

-- Player: Matt Johnson #5 - 1 GP, 0 PTS
DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = 'Matt Johnson'
    AND primary_school_id = 971
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('Matt Johnson')
        AND primary_school_id = 971
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('Matt Johnson', 'matt-johnson-971', 971)
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: Matt Johnson (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, 76, 971,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        '5',
        'maxpreps_2025_26'
    )
    ON CONFLICT (player_id, season_id, school_id) DO UPDATE SET
        games_played = GREATEST(EXCLUDED.games_played, basketball_player_seasons.games_played),
        points = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN EXCLUDED.points ELSE basketball_player_seasons.points END,
        ppg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN EXCLUDED.ppg ELSE basketball_player_seasons.ppg END,
        fgm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fgm, basketball_player_seasons.fgm) ELSE basketball_player_seasons.fgm END,
        fga = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fga, basketball_player_seasons.fga) ELSE basketball_player_seasons.fga END,
        fg_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.fg_pct, basketball_player_seasons.fg_pct) ELSE basketball_player_seasons.fg_pct END,
        three_pm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pm, basketball_player_seasons.three_pm) ELSE basketball_player_seasons.three_pm END,
        three_pa = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.three_pa, basketball_player_seasons.three_pa) ELSE basketball_player_seasons.three_pa END,
        three_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.three_pct, basketball_player_seasons.three_pct) ELSE basketball_player_seasons.three_pct END,
        ftm = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.ftm, basketball_player_seasons.ftm) ELSE basketball_player_seasons.ftm END,
        fta = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.fta, basketball_player_seasons.fta) ELSE basketball_player_seasons.fta END,
        ft_pct = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.ft_pct, basketball_player_seasons.ft_pct) ELSE basketball_player_seasons.ft_pct END,
        off_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.off_rebounds, basketball_player_seasons.off_rebounds) ELSE basketball_player_seasons.off_rebounds END,
        def_rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                            THEN COALESCE(EXCLUDED.def_rebounds, basketball_player_seasons.def_rebounds) ELSE basketball_player_seasons.def_rebounds END,
        rebounds = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                        THEN COALESCE(EXCLUDED.rebounds, basketball_player_seasons.rebounds) ELSE basketball_player_seasons.rebounds END,
        rpg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.rpg, basketball_player_seasons.rpg) ELSE basketball_player_seasons.rpg END,
        assists = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                       THEN COALESCE(EXCLUDED.assists, basketball_player_seasons.assists) ELSE basketball_player_seasons.assists END,
        apg = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                   THEN COALESCE(EXCLUDED.apg, basketball_player_seasons.apg) ELSE basketball_player_seasons.apg END,
        steals = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.steals, basketball_player_seasons.steals) ELSE basketball_player_seasons.steals END,
        blocks = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                      THEN COALESCE(EXCLUDED.blocks, basketball_player_seasons.blocks) ELSE basketball_player_seasons.blocks END,
        turnovers = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                         THEN COALESCE(EXCLUDED.turnovers, basketball_player_seasons.turnovers) ELSE basketball_player_seasons.turnovers END,
        jersey_number = COALESCE(EXCLUDED.jersey_number, basketball_player_seasons.jersey_number),
        source_file = CASE WHEN EXCLUDED.games_played >= COALESCE(basketball_player_seasons.games_played, 0)
                           THEN EXCLUDED.source_file ELSE basketball_player_seasons.source_file END,
        updated_at = NOW();
END $$;

COMMIT;