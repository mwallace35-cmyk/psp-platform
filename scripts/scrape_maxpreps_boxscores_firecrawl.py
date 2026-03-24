#!/usr/bin/env python3
"""Scrape MaxPreps basketball box scores using Firecrawl CLI."""

import json, os, re, subprocess, sys, time
from pathlib import Path

# School configs with MaxPreps slugs
PCL_SCHOOLS = [
    {"name": "Roman Catholic", "school_id": 127, "slug": "pa/philadelphia/roman-catholic-cahillite"},
    {"name": "Neumann-Goretti", "school_id": 198, "slug": "pa/philadelphia/neumann-goretti-saints"},
    {"name": "Archbishop Wood", "school_id": 144, "slug": "pa/warminster/archbishop-wood-vikings"},
    {"name": "Father Judge", "school_id": 147, "slug": "pa/philadelphia/father-judge-crusaders"},
    {"name": "St. Joseph's Prep", "school_id": 1005, "slug": "pa/philadelphia/st-josephs-prep-hawks"},
    {"name": "Archbishop Ryan", "school_id": 175, "slug": "pa/philadelphia/archbishop-ryan-raiders-and-ragdolls"},
    {"name": "Archbishop Carroll", "school_id": 145, "slug": "pa/radnor/archbishop-carroll-patriots"},
    {"name": "West Catholic", "school_id": 171, "slug": "pa/philadelphia/west-catholic-burrs"},
    {"name": "Devon Prep", "school_id": 254, "slug": "pa/devon/devon-prep-tide"},
    {"name": "Cardinal O'Hara", "school_id": 167, "slug": "pa/springfield/cardinal-ohara-lions"},
    {"name": "Bonner-Prendergast", "school_id": 177, "slug": "pa/drexel-hill/monsignor-bonner-archbishop-prendergast-catholic-friars-pandas"},
    {"name": "Conwell-Egan", "school_id": 2780, "slug": "pa/fairless-hills/conwell-egan-catholic-eagles"},
    {"name": "La Salle", "school_id": 2882, "slug": "pa/wyndmoor/la-salle-college-explorers"},
    {"name": "Lansdale Catholic", "school_id": 971, "slug": "pa/lansdale/lansdale-catholic-crusaders"},
]

NON_PCL_SCHOOLS = [
    {"name": "Imhotep Charter", "school_id": 209, "slug": "pa/philadelphia/imhotep-charter-panthers"},
    {"name": "Sankofa Freedom Academy", "school_id": 237, "slug": "pa/philadelphia/sankofa-freedom-academy-warriors"},
    {"name": "Samuel Fels", "school_id": 162, "slug": "pa/philadelphia/samuel-fels"},
    {"name": "Constitution", "school_id": 220, "slug": "pa/philadelphia/constitution-generals"},
    {"name": "West Philadelphia", "school_id": 151, "slug": "pa/philadelphia/west-philadelphia-speedboys"},
    {"name": "Episcopal Academy", "school_id": 138, "slug": "pa/newtown-square/episcopal-academy-churchmen"},
    {"name": "Malvern Prep", "school_id": 156, "slug": "pa/malvern/malvern-prep-friars"},
    {"name": "Haverford School", "school_id": 259, "slug": "pa/haverford/haverford-school-fords"},
    {"name": "Germantown Academy", "school_id": 130, "slug": "pa/fort-washington/germantown-academy-patriots"},
    {"name": "Penn Charter", "school_id": 161, "slug": "pa/philadelphia/william-penn-charter-quakers"},
]

def get_schedule_game_urls(slug):
    """Extract game URLs from a school's schedule page __NEXT_DATA__."""
    import requests
    url = f"https://www.maxpreps.com/{slug}/basketball/schedule/"
    resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}, timeout=30)
    
    match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', resp.text)
    if not match:
        return []
    
    data = json.loads(match.group(1))
    contests = data.get("props", {}).get("pageProps", {}).get("contests", [])
    
    games = []
    for c in contests:
        if not isinstance(c, list) or len(c) < 19:
            continue
        game_url = c[18] if isinstance(c[18], str) and "maxpreps.com" in str(c[18]) else None
        date_str = c[11] if isinstance(c[11], str) else None
        
        if game_url and date_str:
            # Extract team info from c[0]
            teams = c[0] if isinstance(c[0], list) else []
            team1 = teams[0][14] if len(teams) > 0 and isinstance(teams[0], list) and len(teams[0]) > 14 else "?"
            team2 = teams[1][14] if len(teams) > 1 and isinstance(teams[1], list) and len(teams[1]) > 14 else "?"
            
            games.append({
                "url": game_url,
                "date": date_str[:10],
                "team1": team1,
                "team2": team2,
            })
    
    return games

def scrape_boxscore(game_url, output_path):
    """Scrape a single box score page using Firecrawl."""
    try:
        result = subprocess.run(
            ["firecrawl", "scrape", game_url, "--wait-for", "5000", "-o", output_path],
            capture_output=True, text=True, timeout=45
        )
        return os.path.exists(output_path) and os.path.getsize(output_path) > 1000
    except Exception as e:
        print(f"  ERROR scraping: {e}")
        return False

def parse_boxscore_md(filepath):
    """Parse a Firecrawl markdown file into structured box score data."""
    with open(filepath) as f:
        content = f.read()
    
    # Find all stat tables (they have | # | Athlete Name | Min | Pts | FGM | FGA |)
    tables = []
    lines = content.split("\n")
    
    current_table = []
    in_table = False
    
    for line in lines:
        if "| #" in line and "Athlete Name" in line and "Pts" in line:
            if current_table:
                tables.append(current_table)
            current_table = [line]
            in_table = True
        elif in_table and line.strip().startswith("|"):
            current_table.append(line)
        elif in_table and not line.strip().startswith("|"):
            if current_table:
                tables.append(current_table)
                current_table = []
            in_table = False
    
    if current_table:
        tables.append(current_table)
    
    # Parse the first table (main box score with FGM/FGA) for each team
    # MaxPreps shows multiple stat views — we want the most complete one
    players = []
    
    for table in tables:
        if len(table) < 3:
            continue
        
        # Get headers
        headers = [h.strip() for h in table[0].split("|") if h.strip()]
        
        # Skip separator row
        data_rows = [r for r in table[2:] if not r.strip().startswith("|---") and "---" not in r.split("|")[1] if len(r.split("|")) > 3]
        
        for row in data_rows:
            cells = [c.strip() for c in row.split("|") if c.strip()]
            if len(cells) < 4:
                continue
            
            # Extract player name from markdown link
            name_cell = cells[1] if len(cells) > 1 else ""
            name_match = re.search(r'\[([^\]]+)\]', name_cell)
            name = name_match.group(1) if name_match else name_cell
            
            # Clean class year suffix
            name = re.sub(r'\((?:Sr|Jr|So|Fr)\)$', '', name).strip()
            
            jersey = cells[0] if cells[0].isdigit() else ""
            
            # Map headers to values
            stats = {}
            for i, header in enumerate(headers):
                if i < len(cells):
                    val = cells[i]
                    # Clean percentage values
                    val = re.sub(r'[^\d.-]', '', val) if header not in ['#', 'Athlete Name'] else val
                    stats[header.lower().replace(" ", "")] = val
            
            players.append({
                "name": name,
                "jersey": jersey,
                "stats": stats
            })
    
    return players

def main():
    # Determine which school list to use
    use_non_pcl = "--non-pcl" in sys.argv
    args = [a for a in sys.argv[1:] if a != "--non-pcl"]

    base_schools = NON_PCL_SCHOOLS if use_non_pcl else PCL_SCHOOLS
    schools = base_schools

    # Allow selecting specific schools via command line
    if args:
        filter_names = [a.lower() for a in args]
        schools = [s for s in base_schools if any(f in s["name"].lower() for f in filter_names)]
    
    os.makedirs(".firecrawl/boxscores", exist_ok=True)
    
    all_games = []
    
    for school in schools:
        print(f"\n{'='*60}")
        print(f"Processing: {school['name']} (ID: {school['school_id']})")
        print(f"{'='*60}")
        
        # Step 1: Get game URLs from schedule
        print(f"  Fetching schedule...")
        games = get_schedule_game_urls(school["slug"])
        print(f"  Found {len(games)} games")
        
        # Step 2: Scrape each game's box score
        for i, game in enumerate(games):
            safe_name = re.sub(r'[^a-z0-9]', '-', f"{game['date']}-{game['team1']}-{game['team2']}".lower())
            output_path = f".firecrawl/boxscores/{safe_name}.md"
            
            if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
                print(f"  [{i+1}/{len(games)}] SKIP (cached): {game['date']} vs {game['team2']}")
                continue
            
            print(f"  [{i+1}/{len(games)}] Scraping: {game['date']} {game['team1']} vs {game['team2']}...")
            success = scrape_boxscore(game["url"], output_path)
            
            if success:
                print(f"    OK")
            else:
                print(f"    FAILED")
            
            time.sleep(1)  # Rate limit
        
        # Step 3: Parse all scraped files
        for game in games:
            safe_name = re.sub(r'[^a-z0-9]', '-', f"{game['date']}-{game['team1']}-{game['team2']}".lower())
            output_path = f".firecrawl/boxscores/{safe_name}.md"
            
            if os.path.exists(output_path):
                players = parse_boxscore_md(output_path)
                game["players"] = players
                game["school_id"] = school["school_id"]
                game["school_name"] = school["name"]
                all_games.append(game)
    
    # Save all parsed data
    output_file = "scripts/maxpreps_boxscores_firecrawl.json"
    with open(output_file, "w") as f:
        json.dump(all_games, f, indent=2)
    
    print(f"\n\nDone! Saved {len(all_games)} games to {output_file}")
    total_players = sum(len(g.get("players", [])) for g in all_games)
    print(f"Total player stat lines: {total_players}")

if __name__ == "__main__":
    main()

# Additional schools found via Firecrawl search
EXTRA_SCHOOLS = [
    {"name": "Paul Robeson", "school_id": 2979, "slug": "pa/philadelphia/paul-robeson-huskies"},
    {"name": "Carver", "school_id": 2755, "slug": "pa/philadelphia/carver-high-school-of-engineering-and-science"},
]
