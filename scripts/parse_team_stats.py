#!/usr/bin/env python3
"""
Parse PCL Basketball Team Stats PDFs and insert season stats into Supabase.

Each PDF contains complete season stats for all players on one team.
Format: PLAYER | G | GS | MIN | FG | FGA | 3P | 3PA | FT | FTA | _ | OR | DR | TR | AS | ST | BK | D | C | OFF | A/TO | TO+/- | TO | PF | PTS
Followed by a per-game averages row.

Usage:
  python3 parse_team_stats.py --test     # Parse and print (no DB)
  python3 parse_team_stats.py            # Parse and generate SQL
"""

import pdfplumber
import json
import os
import re
import sys
from pathlib import Path

# School code -> school_id mapping
SCHOOL_MAP = {
    "AC": {"id": 166, "name": "Archbishop Carroll"},
    "AR": {"id": 175, "name": "Archbishop Ryan"},
    "AW": {"id": 197, "name": "Archbishop Wood"},
    "BP": {"id": 177, "name": "Bonner-Prendergast"},
    "CE": {"id": 2780, "name": "Conwell-Egan Catholic"},
    "CO": {"id": 167, "name": "Cardinal O'Hara"},
    "DP": {"id": 138, "name": "Devon Prep"},
    "FJ": {"id": 147, "name": "Father Judge"},
    "LC": {"id": 971, "name": "Lansdale Catholic"},
    "LS": {"id": 2882, "name": "La Salle College High School"},
    "NG": {"id": 198, "name": "Neumann-Goretti"},
    "RC": {"id": 127, "name": "Roman Catholic"},
    "SJP": {"id": 1005, "name": "St. Joseph's Prep"},
    "WC": {"id": 171, "name": "West Catholic"},
}

SEASON_ID = 76  # 2025-26


def safe_int(val):
    if val is None or str(val).strip() in ("", "X", "*"):
        return 0
    try:
        return int(str(val).strip())
    except (ValueError, TypeError):
        return 0


def safe_float(val):
    if val is None or str(val).strip() in ("", "X", "*"):
        return None
    try:
        return float(str(val).strip())
    except (ValueError, TypeError):
        return None


def parse_team_stats_pdf(pdf_path, school_code):
    """Parse a PCL Team Stats PDF and extract player season stats."""
    school_id = SCHOOL_MAP[school_code]["id"]
    school_name = SCHOOL_MAP[school_code]["name"]

    with pdfplumber.open(pdf_path) as pdf:
        all_rows = []
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                all_rows.extend(table)

    players = []
    header_found = False
    num_cols = 0
    has_pts_col = False
    i = 0

    while i < len(all_rows):
        row = all_rows[i]
        if not row or len(row) < 24:
            i += 1
            continue

        # Detect header row
        if row[0] == "PLAYER" and row[1] == "G":
            header_found = True
            num_cols = len(row)
            has_pts_col = num_cols >= 25 and row[24] == "PTS"
            i += 1
            continue

        # Detect end of player data
        if row[0] and "Totals:" in str(row[0]):
            break

        if not header_found:
            i += 1
            continue

        # Player row: name contains " - #" pattern
        name_cell = str(row[0]).strip() if row[0] else ""
        if " - #" not in name_cell:
            i += 1
            continue

        # Parse player name and jersey
        match = re.match(r'^(.+?)\s*-\s*#(\d+)$', name_cell)
        if not match:
            i += 1
            continue

        player_name = match.group(1).strip()
        jersey = match.group(2)

        # Stats row (totals)
        games = safe_int(row[1])
        games_started = safe_int(row[2])
        minutes = safe_int(row[3])
        fgm = safe_int(row[4])
        fga = safe_int(row[5])
        tpm = safe_int(row[6])
        tpa = safe_int(row[7])
        ftm = safe_int(row[8])
        fta = safe_int(row[9])
        # row[10] is empty separator
        off_reb = safe_int(row[11])
        def_reb = safe_int(row[12])
        total_reb = safe_int(row[13])
        assists = safe_int(row[14])
        steals = safe_int(row[15])
        blocks = safe_int(row[16])
        # row[17] = D (deflections), row[18] = C (charges), row[19] = OFF
        turnovers = safe_int(row[22])
        fouls = safe_int(row[23])

        if has_pts_col:
            points = safe_int(row[24])
        else:
            # Calculate PTS: 2-pt FG + 3-pt bonus + FT
            points = (fgm - tpm) * 2 + tpm * 3 + ftm

        # Next row has per-game averages
        avg_row = all_rows[i + 1] if i + 1 < len(all_rows) else None
        ppg = None
        rpg = None
        apg = None
        if avg_row and len(avg_row) >= 24:
            rpg = safe_float(avg_row[13])
            apg = safe_float(avg_row[14])
            if has_pts_col and len(avg_row) >= 25:
                ppg = safe_float(avg_row[24])
            elif games > 0:
                ppg = round(points / games, 1)

        # Calculate percentages
        fg_pct = round(fgm / fga * 100, 1) if fga > 0 else None
        ft_pct = round(ftm / fta * 100, 1) if fta > 0 else None
        three_pct = round(tpm / tpa * 100, 1) if tpa > 0 else None

        players.append({
            "player_name": player_name,
            "jersey": jersey,
            "school_code": school_code,
            "school_id": school_id,
            "school_name": school_name,
            "games_played": games,
            "games_started": games_started,
            "minutes": minutes,
            "points": points,
            "ppg": ppg,
            "fgm": fgm,
            "fga": fga,
            "fg_pct": fg_pct,
            "three_pm": tpm,
            "three_pa": tpa,
            "three_pct": three_pct,
            "ftm": ftm,
            "fta": fta,
            "ft_pct": ft_pct,
            "off_rebounds": off_reb,
            "def_rebounds": def_reb,
            "rebounds": total_reb,
            "rpg": rpg,
            "assists": assists,
            "apg": apg,
            "steals": steals,
            "blocks": blocks,
            "turnovers": turnovers,
            "fouls": fouls,
        })

        i += 2  # Skip the averages row

    return players


def generate_sql(all_players):
    """Generate SQL to insert/update basketball_player_seasons."""
    lines = []
    lines.append("-- PCL Basketball 2025-26 Season Stats from AOP Team Stats PDFs")
    lines.append("-- Generated by parse_team_stats.py")
    lines.append("")

    for p in all_players:
        name_escaped = p["player_name"].replace("'", "''")
        school_name_escaped = p["school_name"].replace("'", "''")

        # Build the stats JSON for reference
        lines.append(f"-- {p['player_name']} ({p['school_name']}) #{p['jersey']} - {p['games_played']}G, {p['ppg']}ppg")

        # Try to match existing player, or insert new one
        lines.append(f"""
DO $$
DECLARE
    v_player_id INTEGER;
    v_existing_id INTEGER;
BEGIN
    -- Try to find existing player by name + school
    SELECT p.id INTO v_player_id
    FROM players p
    WHERE p.primary_school_id = {p['school_id']}
      AND LOWER(p.name) = LOWER('{name_escaped}')
    LIMIT 1;

    IF v_player_id IS NULL THEN
        -- Try fuzzy match (last name match on same school)
        SELECT p.id INTO v_player_id
        FROM players p
        WHERE p.primary_school_id = {p['school_id']}
          AND LOWER(p.name) LIKE '%' || LOWER('{name_escaped.split(",")[0].split(" ")[-1] if "," in name_escaped else name_escaped.split(" ")[-1]}') || '%'
          AND EXISTS (
              SELECT 1 FROM basketball_player_seasons bps
              WHERE bps.player_id = p.id AND bps.season_id = {SEASON_ID}
          )
        LIMIT 1;
    END IF;

    IF v_player_id IS NULL THEN
        -- Create new player
        INSERT INTO players (name, primary_school_id, sport_id, graduation_year, region_id, created_at)
        VALUES ('{name_escaped}', {p['school_id']}, 'basketball', 2026, 'philly', NOW())
        RETURNING id INTO v_player_id;
    END IF;

    -- Check if season stats already exist
    SELECT id INTO v_existing_id
    FROM basketball_player_seasons
    WHERE player_id = v_player_id AND season_id = {SEASON_ID};

    IF v_existing_id IS NOT NULL THEN
        -- Update existing
        UPDATE basketball_player_seasons SET
            school_id = {p['school_id']},
            games_played = {p['games_played']},
            points = {p['points']},
            ppg = {p['ppg'] if p['ppg'] is not None else 'NULL'},
            fgm = {p['fgm']},
            fga = {p['fga']},
            fg_pct = {p['fg_pct'] if p['fg_pct'] is not None else 'NULL'},
            three_pm = {p['three_pm']},
            three_pa = {p['three_pa']},
            three_pct = {p['three_pct'] if p['three_pct'] is not None else 'NULL'},
            ftm = {p['ftm']},
            fta = {p['fta']},
            ft_pct = {p['ft_pct'] if p['ft_pct'] is not None else 'NULL'},
            off_rebounds = {p['off_rebounds']},
            def_rebounds = {p['def_rebounds']},
            rebounds = {p['rebounds']},
            rpg = {p['rpg'] if p['rpg'] is not None else 'NULL'},
            assists = {p['assists']},
            apg = {p['apg'] if p['apg'] is not None else 'NULL'},
            steals = {p['steals']},
            blocks = {p['blocks']},
            turnovers = {p['turnovers']},
            jersey_number = '{p['jersey']}',
            source_file = 'pcl_team_stats_2025_26',
            updated_at = NOW()
        WHERE id = v_existing_id;
    ELSE
        -- Insert new
        INSERT INTO basketball_player_seasons (
            player_id, season_id, school_id, games_played, points, ppg,
            fgm, fga, fg_pct, three_pm, three_pa, three_pct,
            ftm, fta, ft_pct, off_rebounds, def_rebounds, rebounds, rpg,
            assists, apg, steals, blocks, turnovers,
            jersey_number, source_file, created_at
        ) VALUES (
            v_player_id, {SEASON_ID}, {p['school_id']}, {p['games_played']}, {p['points']}, {p['ppg'] if p['ppg'] is not None else 'NULL'},
            {p['fgm']}, {p['fga']}, {p['fg_pct'] if p['fg_pct'] is not None else 'NULL'},
            {p['three_pm']}, {p['three_pa']}, {p['three_pct'] if p['three_pct'] is not None else 'NULL'},
            {p['ftm']}, {p['fta']}, {p['ft_pct'] if p['ft_pct'] is not None else 'NULL'},
            {p['off_rebounds']}, {p['def_rebounds']}, {p['rebounds']}, {p['rpg'] if p['rpg'] is not None else 'NULL'},
            {p['assists']}, {p['apg'] if p['apg'] is not None else 'NULL'},
            {p['steals']}, {p['blocks']}, {p['turnovers']},
            '{p['jersey']}', 'pcl_team_stats_2025_26', NOW()
        );
    END IF;
END $$;
""")

    return "\n".join(lines)


def main():
    test_mode = "--test" in sys.argv
    team_stats_dir = Path(__file__).parent / "team_stats"

    all_players = []

    for code in sorted(SCHOOL_MAP.keys()):
        pdf_path = team_stats_dir / f"PCL_{code}.pdf"
        if not pdf_path.exists():
            print(f"  MISSING: {pdf_path}")
            continue

        players = parse_team_stats_pdf(str(pdf_path), code)
        all_players.extend(players)
        print(f"  {code} ({SCHOOL_MAP[code]['name']}): {len(players)} players")

    print(f"\nTotal: {len(all_players)} players across {len(SCHOOL_MAP)} schools")

    if test_mode:
        # Print all players
        for p in all_players:
            print(f"  {p['school_code']:3s} {p['player_name']:25s} #{p['jersey']:3s}  {p['games_played']:2d}G  {p['ppg'] or 0:5.1f}ppg  {p['rpg'] or 0:4.1f}rpg  {p['apg'] or 0:4.1f}apg  {p['points']:4d}pts  {p['fgm']}-{p['fga']}fg  {p['three_pm']}-{p['three_pa']}3p  {p['ftm']}-{p['fta']}ft  {p['steals']}stl  {p['blocks']}blk")
    else:
        # Generate SQL
        sql = generate_sql(all_players)
        output_path = Path(__file__).parent / "seed_pcl_basketball_2025_26.sql"
        with open(output_path, "w") as f:
            f.write(sql)
        print(f"\nSQL written to {output_path}")

    # Save parsed data
    output_json = Path(__file__).parent / "parsed_team_stats.json"
    with open(output_json, "w") as f:
        json.dump(all_players, f, indent=2)
    print(f"JSON written to {output_json}")


if __name__ == "__main__":
    main()
