#!/usr/bin/env python3
"""
Generate SQL INSERT/UPDATE statements for MaxPreps basketball data.
Strategy:
  - For each school, check if MaxPreps data is newer/more complete than existing DB data
  - Match players by name to existing player records
  - Generate UPSERT statements using ON CONFLICT
"""

import json
import re

SEASON_ID = 76  # 2025-26

def escape_sql(val):
    """Escape single quotes for SQL."""
    if val is None:
        return "NULL"
    if isinstance(val, str):
        return "'" + val.replace("'", "''") + "'"
    return str(val)

def sql_val(val):
    """Convert a value to SQL representation."""
    if val is None:
        return "NULL"
    if isinstance(val, float):
        return str(val)
    if isinstance(val, int):
        return str(val)
    return escape_sql(val)

def generate_upsert_sql(players, school_name, school_id):
    """Generate SQL for a set of players from one school."""
    lines = []
    lines.append(f"-- {school_name} (school_id={school_id}) - MaxPreps 2025-26 Season Stats")
    lines.append(f"-- Source: MaxPreps print stats page, scraped 2026-03-23")
    lines.append("")

    for p in players:
        name = p["player_name"]
        jersey = p.get("jersey_number")

        # Skip players with no meaningful stats
        gp = p.get("games_played") or 0
        pts = p.get("points") or 0
        if gp == 0 and pts == 0:
            continue

        lines.append(f"-- Player: {name} #{jersey or '?'} - {gp} GP, {pts} PTS")

        # First, try to find the player by exact name match
        # Use a CTE approach: find or create player, then upsert season stats
        safe_name = name.replace("'", "''")
        # Generate slug: lowercase, replace spaces/special chars with hyphens
        slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
        slug = f"{slug}-{school_id}"  # Ensure uniqueness

        lines.append(f"""DO $$
DECLARE
    v_player_id INTEGER;
BEGIN
    -- Try exact name match first
    SELECT id INTO v_player_id
    FROM players
    WHERE name = '{safe_name}'
    AND primary_school_id = {school_id}
    LIMIT 1;

    -- If not found, try case-insensitive match
    IF v_player_id IS NULL THEN
        SELECT id INTO v_player_id
        FROM players
        WHERE LOWER(name) = LOWER('{safe_name}')
        AND primary_school_id = {school_id}
        LIMIT 1;
    END IF;

    -- If still not found, create the player
    IF v_player_id IS NULL THEN
        INSERT INTO players (name, slug, primary_school_id)
        VALUES ('{safe_name}', '{slug}', {school_id})
        RETURNING id INTO v_player_id;
        RAISE NOTICE 'Created new player: {safe_name} (id=%)', v_player_id;
    END IF;

    -- Upsert season stats
    INSERT INTO basketball_player_seasons (
        player_id, season_id, school_id, games_played, points, ppg,
        fgm, fga, fg_pct, three_pm, three_pa, three_pct,
        ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
        assists, apg, steals, blocks, turnovers,
        jersey_number, source_file
    ) VALUES (
        v_player_id, {SEASON_ID}, {school_id},
        {sql_val(p.get('games_played'))},
        {sql_val(p.get('points'))},
        {sql_val(p.get('ppg'))},
        {sql_val(p.get('fgm'))},
        {sql_val(p.get('fga'))},
        {sql_val(p.get('fg_pct'))},
        {sql_val(p.get('three_pm'))},
        {sql_val(p.get('three_pa'))},
        {sql_val(p.get('three_pct'))},
        {sql_val(p.get('ftm'))},
        {sql_val(p.get('fta'))},
        {sql_val(p.get('ft_pct'))},
        {sql_val(p.get('off_rebounds'))},
        {sql_val(p.get('def_rebounds'))},
        {sql_val(p.get('rebounds'))},
        {sql_val(p.get('rpg'))},
        {sql_val(p.get('assists'))},
        {sql_val(p.get('apg'))},
        {sql_val(p.get('steals'))},
        {sql_val(p.get('blocks'))},
        {sql_val(p.get('turnovers'))},
        {sql_val(jersey)},
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
""")

    return "\n".join(lines)


def main():
    with open("/Users/admin/Desktop/psp-platform/scripts/maxpreps_basketball_2025_26.json") as f:
        data = json.load(f)

    players = data["players"]

    # Group by school
    by_school = {}
    for p in players:
        school = p["school_name"]
        if school not in by_school:
            by_school[school] = {"players": [], "school_id": p["school_id"]}
        by_school[school]["players"].append(p)

    print(f"Schools with data: {list(by_school.keys())}")

    # Generate SQL for each school
    all_sql = []
    all_sql.append("-- MaxPreps 2025-26 Basketball Season Stats - PCL Schools")
    all_sql.append("-- Generated from scrape_maxpreps_basketball.py output")
    all_sql.append(f"-- Total players: {len(players)}")
    all_sql.append(f"-- Schools: {', '.join(by_school.keys())}")
    all_sql.append("")
    all_sql.append("BEGIN;")
    all_sql.append("")

    for school_name, school_data in by_school.items():
        sql = generate_upsert_sql(school_data["players"], school_name, school_data["school_id"])
        all_sql.append(sql)

    all_sql.append("COMMIT;")

    output_file = "/Users/admin/Desktop/psp-platform/scripts/maxpreps_basketball_upsert.sql"
    with open(output_file, "w") as f:
        f.write("\n".join(all_sql))

    print(f"\nSQL saved to: {output_file}")
    print(f"Total players in SQL: {sum(len(s['players']) for s in by_school.values())}")


if __name__ == "__main__":
    main()
