#!/usr/bin/env python3
"""
Parse PCL Basketball box score PDFs and insert player stats into Supabase.

Usage:
  python3 parse_boxscores.py --test       # Parse 3 PDFs and print results (no DB insert)
  python3 parse_boxscores.py --dry-run    # Parse all, show what would be inserted
  python3 parse_boxscores.py              # Parse all and insert into DB
"""

import pdfplumber
import json
import os
import re
import sys
import subprocess
from pathlib import Path
from datetime import date

# School code -> school_id mapping
SCHOOL_MAP = {
    "AC": {"id": 145, "name": "Archbishop Carroll"},
    "AR": {"id": 175, "name": "Archbishop Ryan"},
    "AW": {"id": 144, "name": "Archbishop Wood"},
    "BP": {"id": 177, "name": "Bonner-Prendergast"},
    "CE": {"id": 2780, "name": "Conwell-Egan Catholic"},
    "CO": {"id": 167, "name": "Cardinal O'Hara"},
    "DP": {"id": 254, "name": "Devon Prep"},
    "FJ": {"id": 147, "name": "Father Judge"},
    "LC": {"id": 971, "name": "Lansdale Catholic"},
    "LS": {"id": 2882, "name": "La Salle College High School"},
    "NG": {"id": 198, "name": "Neumann-Goretti"},
    "RC": {"id": 127, "name": "Roman Catholic"},
    "SJP": {"id": 1005, "name": "St. Joseph's Prep"},
    "WC": {"id": 171, "name": "West Catholic"},
}

SEASON_ID = 76  # 2025-26


def parse_split_stat(val):
    """Parse 'X-Y' stat format (e.g., '4-12' for FG-FGA). Returns (made, attempted)."""
    if not val or val.strip() == "":
        return 0, 0
    parts = val.strip().split("-")
    if len(parts) == 2:
        try:
            return int(parts[0]), int(parts[1])
        except ValueError:
            return 0, 0
    return 0, 0


def safe_int(val):
    """Safely convert to int."""
    if val is None or str(val).strip() == "":
        return 0
    try:
        return int(val)
    except (ValueError, TypeError):
        return 0


def parse_filename(filename):
    """
    Parse filename like 'LS_WC_010226_PCL.pdf' or 'Copy_of_WC_RC_010426_PCL.pdf'
    Returns (home_code, away_code, game_date) where home is first team listed.
    Filename convention: HOME_AWAY_MMDDYY_TYPE.pdf
    """
    base = filename.replace(".pdf", "")
    # Remove 'Copy_of_' prefix if present
    base = re.sub(r'^Copy_of_', '', base)
    parts = base.split("_")

    # Find the date part (6 digits MMDDYY)
    date_idx = None
    for i, p in enumerate(parts):
        if re.match(r'^\d{6}$', p):
            date_idx = i
            break

    if date_idx is None or date_idx < 2:
        return None, None, None

    home_code = parts[0]
    away_code = parts[1] if date_idx == 2 else "_".join(parts[1:date_idx])
    date_str = parts[date_idx]

    mm = int(date_str[0:2])
    dd = int(date_str[2:4])
    yy = int(date_str[4:6])
    year = 2000 + yy
    game_date = date(year, mm, dd)

    return home_code, away_code, game_date


def parse_boxscore_pdf(pdf_path):
    """
    Parse a PCL basketball box score PDF.
    Returns a dict with two team blocks, each containing player stats.
    """
    filename = os.path.basename(pdf_path)
    home_code, away_code, game_date = parse_filename(filename)

    if not home_code:
        print(f"  WARNING: Could not parse filename: {filename}")
        return None

    with pdfplumber.open(pdf_path) as pdf:
        all_rows = []
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                all_rows.extend(table)

    # Find team header rows (contain '#' and 'MIN' and 'PTS')
    team_blocks = []
    current_team = None
    current_players = []

    for row in all_rows:
        if not row or len(row) < 20:
            continue

        # Detect team header row
        if row[2] == '#' and row[3] == 'MIN' and row[19] == 'PTS':
            if current_team and current_players:
                team_blocks.append({"team_name": current_team, "players": current_players})
            current_team = row[1].strip() if row[1] else ""
            current_players = []
            continue

        # Detect TOTALS row — end of current team block
        if row[1] and 'TOTALS' in str(row[1]):
            if current_team and current_players:
                team_blocks.append({"team_name": current_team, "players": current_players})
                current_team = None
                current_players = []
            continue

        # Skip non-player rows
        if not current_team:
            continue
        if not row[1] or str(row[1]).strip() == "":
            continue
        if row[1] in ['TEAM REBOUNDS:', 'OFF DEF:', 'DEF EFF:']:
            continue

        # Parse player row
        name = str(row[1]).strip()
        jersey = str(row[2]).strip() if row[2] else ""
        minutes = safe_int(row[3])
        fgm, fga = parse_split_stat(row[4])
        tpm, tpa = parse_split_stat(row[5])
        ftm, fta = parse_split_stat(row[6])
        off_reb = safe_int(row[7])
        def_reb = safe_int(row[8])
        total_reb = safe_int(row[9])
        assists = safe_int(row[10])
        steals = safe_int(row[11])
        blocks = safe_int(row[12])
        # row[13] = D (deflections), row[14] = C (charges), row[15] = OFF
        # row[16] = TO+/- (plus/minus), row[17] = TO (turnovers)
        turnovers = safe_int(row[17])
        fouls = safe_int(row[18])
        points = safe_int(row[19])

        current_players.append({
            "name": name,
            "jersey": jersey,
            "minutes": minutes,
            "fgm": fgm,
            "fga": fga,
            "tpm": tpm,
            "tpa": tpa,
            "ftm": ftm,
            "fta": fta,
            "off_reb": off_reb,
            "def_reb": def_reb,
            "rebounds": total_reb,
            "assists": assists,
            "steals": steals,
            "blocks": blocks,
            "turnovers": turnovers,
            "fouls": fouls,
            "points": points,
        })

    return {
        "filename": filename,
        "home_code": home_code,
        "away_code": away_code,
        "home_school_id": SCHOOL_MAP.get(home_code, {}).get("id"),
        "away_school_id": SCHOOL_MAP.get(away_code, {}).get("id"),
        "game_date": game_date.isoformat(),
        "teams": team_blocks,
    }


def main():
    test_mode = "--test" in sys.argv
    dry_run = "--dry-run" in sys.argv

    boxscores_dir = Path(__file__).parent / "boxscores"
    pdf_files = sorted(boxscores_dir.glob("*.pdf"))

    if test_mode:
        pdf_files = pdf_files[:3]
        print(f"TEST MODE: Parsing {len(pdf_files)} PDFs\n")
    else:
        print(f"Parsing {len(pdf_files)} PDFs\n")

    all_games = []
    errors = []

    for pdf_path in pdf_files:
        try:
            result = parse_boxscore_pdf(str(pdf_path))
            if result:
                all_games.append(result)
                total_players = sum(len(t["players"]) for t in result["teams"])
                print(f"  OK: {result['filename']} -> {len(result['teams'])} teams, {total_players} players")
            else:
                errors.append(str(pdf_path))
        except Exception as e:
            print(f"  ERROR: {pdf_path.name} -> {e}")
            errors.append(str(pdf_path))

    print(f"\nParsed: {len(all_games)} games, {len(errors)} errors")

    if test_mode or dry_run:
        # Print detailed output for verification
        for game in all_games:
            print(f"\n{'='*60}")
            print(f"Game: {game['home_code']} vs {game['away_code']} on {game['game_date']}")
            print(f"Home ID: {game['home_school_id']}, Away ID: {game['away_school_id']}")
            for team in game["teams"]:
                print(f"\n  {team['team_name']}:")
                for p in team["players"]:
                    print(f"    {p['name']:20s} #{p['jersey']:3s}  {p['points']:3d}pts  {p['rebounds']:2d}reb  {p['assists']:2d}ast  {p['fgm']}-{p['fga']}fg  {p['tpm']}-{p['tpa']}3p  {p['ftm']}-{p['fta']}ft  {p['steals']}stl  {p['blocks']}blk  {p['turnovers']}to")

    # Save parsed data to JSON for inspection
    output_path = boxscores_dir.parent / "parsed_boxscores.json"
    with open(output_path, "w") as f:
        json.dump(all_games, f, indent=2)
    print(f"\nSaved parsed data to {output_path}")

    if errors:
        print(f"\nFailed files:")
        for e in errors:
            print(f"  {e}")


if __name__ == "__main__":
    main()
