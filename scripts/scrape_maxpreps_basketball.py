#!/usr/bin/env python3
"""
Scrape 2025-26 basketball season stats from MaxPreps for all PCL schools.
Strategy:
  1. Fetch each school's /basketball/stats/ page
  2. Extract the Print URL from __NEXT_DATA__ -> sharedStatsLinks
  3. Fetch the print page which has full HTML stat tables
  4. Parse tables 1-4 to build complete player stat lines
"""

import requests
import json
import re
import time
import sys
from bs4 import BeautifulSoup

# PCL Schools with MaxPreps URL slugs and our DB school IDs
PCL_SCHOOLS = [
    {"name": "Roman Catholic", "school_id": 127, "slug": "pa/philadelphia/roman-catholic-cahillite"},
    {"name": "St. Joseph's Prep", "school_id": 1005, "slug": "pa/philadelphia/st-josephs-prep-hawks"},
    {"name": "Archbishop Wood", "school_id": 144, "slug": "pa/warminster/archbishop-wood-vikings"},
    {"name": "Neumann-Goretti", "school_id": 198, "slug": "pa/philadelphia/neumann-goretti-saints"},
    {"name": "La Salle", "school_id": 2882, "slug": "pa/wyndmoor/la-salle-college-explorers"},
    {"name": "Father Judge", "school_id": 147, "slug": "pa/philadelphia/father-judge-crusaders"},
    {"name": "Archbishop Carroll", "school_id": 145, "slug": "pa/radnor/archbishop-carroll-patriots"},
    {"name": "Archbishop Ryan", "school_id": 175, "slug": "pa/philadelphia/archbishop-ryan-raiders-and-ragdolls"},
    {"name": "West Catholic", "school_id": 171, "slug": "pa/philadelphia/west-catholic-burrs"},
    {"name": "Cardinal O'Hara", "school_id": 167, "slug": "pa/springfield/cardinal-ohara-lions"},
    {"name": "Bonner-Prendergast", "school_id": 177, "slug": "pa/drexel-hill/monsignor-bonner-archbishop-prendergast-catholic-friars-pandas"},
    {"name": "Devon Prep", "school_id": 254, "slug": "pa/devon/devon-prep-tide"},
    {"name": "Conwell-Egan", "school_id": 2780, "slug": "pa/fairless-hills/conwell-egan-catholic-eagles"},
    {"name": "Lansdale Catholic", "school_id": 971, "slug": "pa/lansdale/lansdale-catholic-crusaders"},
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}


def safe_int(val, default=None):
    if val is None or val == '' or val == '-':
        return default
    try:
        return int(float(str(val).replace(',', '')))
    except (ValueError, TypeError):
        return default


def safe_float(val, default=None):
    if val is None or val == '' or val == '-':
        return default
    try:
        return round(float(str(val).replace(',', '')), 1)
    except (ValueError, TypeError):
        return default


def get_print_url(slug):
    """Fetch the stats page and extract the Print URL from __NEXT_DATA__."""
    url = f"https://www.maxpreps.com/{slug}/basketball/stats/"
    resp = requests.get(url, headers=HEADERS, timeout=30)
    resp.raise_for_status()

    # Check for "Player Stats Not Entered"
    if "Player Stats Not Entered" in resp.text or "no data to display" in resp.text.lower():
        return None, "no_stats"

    match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', resp.text)
    if not match:
        return None, "no_next_data"

    data = json.loads(match.group(1))
    props = data.get("props", {}).get("pageProps", {})
    shared_links = props.get("sharedStatsLinks", [])

    for link in shared_links:
        if link.get("displayText") == "Print":
            return link["canonicalUrl"], "ok"

    return None, "no_print_link"


def parse_print_page(print_url):
    """Fetch and parse the print page to extract full player stats."""
    resp = requests.get(print_url, headers=HEADERS, timeout=30)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, 'html.parser')
    tables = soup.find_all('table')

    if len(tables) < 4:
        print(f"  WARNING: Expected 4+ tables, found {len(tables)}")
        return []

    # Build a player dict keyed by jersey+name
    players = {}

    def get_player_key(jersey, name):
        return f"{jersey}|{name}"

    def parse_table_rows(table):
        """Parse data rows from a table, returning list of (jersey, name, cells) tuples."""
        rows = table.find_all('tr')
        results = []
        for row in rows:
            cells = row.find_all(['td', 'th'])
            cell_texts = [c.get_text(strip=True) for c in cells]

            # Skip header rows and empty rows
            if not cell_texts or len(cell_texts) < 3:
                continue

            # Skip "Season Totals" row (jersey is empty, name is "Season Totals")
            if cell_texts[1] == 'Season Totals':
                continue

            # Skip rows that look like headers
            if cell_texts[0] in ['#', ''] and cell_texts[1] in ['Athlete Name', 'Season Totals', '']:
                continue

            # Extract player name from link or text
            links = row.find_all('a')
            player_name = None
            for link in links:
                href = link.get('href', '')
                if 'player/stats' in href or 'athleteid' in href.lower():
                    player_name = link.get('title') or link.get_text(strip=True)
                    break

            if not player_name:
                # Try to get from cell text - strip class year suffix
                raw_name = cell_texts[1] if len(cell_texts) > 1 else ''
                # Remove (Sr), (Jr), (So), (Fr) suffix
                player_name = re.sub(r'\s*\((Sr|Jr|So|Fr)\)\s*$', '', raw_name)

            if not player_name or player_name in ['Season Totals', 'Athlete Name', '']:
                continue

            jersey = cell_texts[0] if cell_texts[0] not in ['', '#'] else ''
            results.append((jersey, player_name, cell_texts))

        return results

    # Table 1: Per-game averages
    # Headers: #, Athlete Name, GP, MPG, PPG, DEFR, OFFR, RPG, APG, SPG, BPG, TPG, PFPG
    t1_rows = parse_table_rows(tables[0])
    for jersey, name, cells in t1_rows:
        key = get_player_key(jersey, name)
        if key not in players:
            players[key] = {"player_name": name, "jersey_number": jersey}
        if len(cells) >= 12:
            players[key]["games_played"] = safe_int(cells[2])
            players[key]["ppg"] = safe_float(cells[4])
            players[key]["rpg"] = safe_float(cells[7])
            players[key]["apg"] = safe_float(cells[8])
            # SPG and BPG are per-game, we'll get totals from table 4

    # Table 2: Shooting totals
    # Headers: #, Athlete Name, GP, Min, Pts, FGM, FGA, FG%, PPS, AFG%
    t2_rows = parse_table_rows(tables[1])
    for jersey, name, cells in t2_rows:
        key = get_player_key(jersey, name)
        if key not in players:
            players[key] = {"player_name": name, "jersey_number": jersey}
        if len(cells) >= 8:
            players[key]["points"] = safe_int(cells[4])
            players[key]["fgm"] = safe_int(cells[5])
            players[key]["fga"] = safe_int(cells[6])
            players[key]["fg_pct"] = safe_float(cells[7])

    # Table 3: 3PT and FT shooting
    # Headers: #, Athlete Name, GP, Min, Pts, 3PM, 3PA, 3P%, FTM, FTA, FT%, 2FGM, 2FGA, 2FG%
    t3_rows = parse_table_rows(tables[2])
    for jersey, name, cells in t3_rows:
        key = get_player_key(jersey, name)
        if key not in players:
            players[key] = {"player_name": name, "jersey_number": jersey}
        if len(cells) >= 11:
            players[key]["three_pm"] = safe_int(cells[5])
            players[key]["three_pa"] = safe_int(cells[6])
            players[key]["three_pct"] = safe_float(cells[7])
            players[key]["ftm"] = safe_int(cells[8])
            players[key]["fta"] = safe_int(cells[9])
            players[key]["ft_pct"] = safe_float(cells[10])

    # Table 4: Box score totals
    # Headers: #, Athlete Name, GP, Min, Pts, OReb, DReb, Reb, Ast, Stl, Blk, TO, PF
    t4_rows = parse_table_rows(tables[3])
    for jersey, name, cells in t4_rows:
        key = get_player_key(jersey, name)
        if key not in players:
            players[key] = {"player_name": name, "jersey_number": jersey}
        if len(cells) >= 12:
            players[key]["off_rebounds"] = safe_int(cells[5])
            players[key]["def_rebounds"] = safe_int(cells[6])
            players[key]["rebounds"] = safe_int(cells[7])
            players[key]["assists"] = safe_int(cells[8])
            players[key]["steals"] = safe_int(cells[9])
            players[key]["blocks"] = safe_int(cells[10])
            players[key]["turnovers"] = safe_int(cells[11])

    return list(players.values())


def scrape_school(school):
    """Scrape stats for a single school."""
    print(f"\n  Fetching stats page...")
    print_url, status = get_print_url(school["slug"])

    if status == "no_stats":
        print(f"  Player stats not entered on MaxPreps")
        return []
    elif status != "ok" or not print_url:
        print(f"  Could not get print URL (status: {status})")
        return []

    print(f"  Found print URL, fetching full stats...")
    time.sleep(1)  # Brief pause between requests

    players = parse_print_page(print_url)

    # Add school info to each player
    for p in players:
        p["school_name"] = school["name"]
        p["school_id"] = school["school_id"]

    return players


def scrape_all_schools(schools=None, test_mode=False):
    """Scrape stats for all PCL schools."""
    if schools is None:
        schools = PCL_SCHOOLS

    all_players = []
    schools_with_stats = 0
    schools_without_stats = 0

    for i, school in enumerate(schools):
        print(f"\n{'='*60}")
        print(f"[{i+1}/{len(schools)}] Scraping {school['name']}...")
        print(f"  URL: https://www.maxpreps.com/{school['slug']}/basketball/stats/")

        try:
            players = scrape_school(school)

            if players:
                print(f"  SUCCESS: Found {len(players)} players")
                for p in players[:3]:
                    ppg = p.get('ppg', '?')
                    pts = p.get('points', '?')
                    print(f"    - {p['player_name']} #{p.get('jersey_number', '?')}: {ppg} PPG, {pts} pts total")
                all_players.extend(players)
                schools_with_stats += 1
            else:
                print(f"  No player stats found")
                schools_without_stats += 1

        except requests.exceptions.HTTPError as e:
            print(f"  HTTP ERROR: {e}")
            schools_without_stats += 1
        except Exception as e:
            print(f"  ERROR: {e}")
            import traceback
            traceback.print_exc()
            schools_without_stats += 1

        if i < len(schools) - 1:
            time.sleep(2)

    print(f"\n{'='*60}")
    print(f"SUMMARY:")
    print(f"  Schools with stats: {schools_with_stats}")
    print(f"  Schools without stats: {schools_without_stats}")
    print(f"  Total players scraped: {len(all_players)}")

    return all_players


def main():
    test_mode = "--test" in sys.argv

    if test_mode:
        print("TEST MODE: Scraping only Neumann-Goretti")
        schools = [s for s in PCL_SCHOOLS if s["name"] == "Neumann-Goretti"]
    else:
        schools = PCL_SCHOOLS

    players = scrape_all_schools(schools, test_mode)

    output_file = "/Users/admin/Desktop/psp-platform/scripts/maxpreps_basketball_2025_26.json"

    output = {
        "season": "2025-26",
        "source": "MaxPreps",
        "scrape_date": time.strftime("%Y-%m-%d"),
        "total_players": len(players),
        "schools_scraped": len(set(p["school_name"] for p in players)),
        "players": players
    }

    with open(output_file, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nOutput saved to: {output_file}")
    return players


if __name__ == "__main__":
    main()
