#!/usr/bin/env python3
"""
MaxPreps Basketball Box Score Scraper via Playwright
Scrapes per-game player stats from MaxPreps player stats pages.

Strategy:
1. Navigate to school roster page → extract all player profile URLs
2. For each player, navigate to their stats page → extract game-by-game stats
3. Output JSON per school with all player game stats
4. Match to PSP DB games by date + opponent + score

Usage:
  python3 scrape_maxpreps_boxscores_playwright.py --school roman-catholic --id 127
  python3 scrape_maxpreps_boxscores_playwright.py --all
"""

import json
import time
import re
import sys
import os
from datetime import datetime

# All Philly basketball schools with MaxPreps slugs
SCHOOLS = [
    # PCL (14)
    {"name": "Roman Catholic", "id": 127, "slug": "pa/philadelphia/roman-catholic-cahillite"},
    {"name": "Neumann-Goretti", "id": 198, "slug": "pa/philadelphia/neumann-goretti-saints"},
    {"name": "Archbishop Wood", "id": 144, "slug": "pa/warminster/archbishop-wood-vikings"},
    {"name": "Father Judge", "id": 147, "slug": "pa/philadelphia/father-judge-crusaders"},
    {"name": "St. Joseph's Prep", "id": 1005, "slug": "pa/philadelphia/st-josephs-prep-hawks"},
    {"name": "Archbishop Ryan", "id": 175, "slug": "pa/philadelphia/archbishop-ryan-raiders-and-ragdolls"},
    {"name": "Archbishop Carroll", "id": 145, "slug": "pa/radnor/archbishop-carroll-patriots"},
    {"name": "West Catholic", "id": 171, "slug": "pa/philadelphia/west-catholic-burrs"},
    {"name": "Devon Prep", "id": 254, "slug": "pa/devon/devon-prep-tide"},
    {"name": "Cardinal O'Hara", "id": 167, "slug": "pa/springfield/cardinal-ohara-lions"},
    {"name": "Bonner-Prendergast", "id": 177, "slug": "pa/drexel-hill/monsignor-bonner-archbishop-prendergast-catholic-friars-pandas"},
    {"name": "Conwell-Egan", "id": 2780, "slug": "pa/fairless-hills/conwell-egan-catholic-eagles"},
    {"name": "La Salle", "id": 2882, "slug": "pa/wyndmoor/la-salle-college-explorers"},
    {"name": "Lansdale Catholic", "id": 971, "slug": "pa/lansdale/lansdale-catholic-crusaders"},
    # Inter-Ac (5)
    {"name": "Haverford School", "id": 259, "slug": "pa/haverford/haverford-school-fords"},
    {"name": "Malvern Prep", "id": 156, "slug": "pa/malvern/malvern-prep-friars"},
    {"name": "Germantown Academy", "id": 130, "slug": "pa/fort-washington/germantown-academy-patriots"},
    {"name": "Episcopal Academy", "id": 138, "slug": "pa/newtown-square/episcopal-academy-churchmen"},
    {"name": "Penn Charter", "id": 161, "slug": "pa/philadelphia/penn-charter-quakers"},
    # PPL Top Teams
    {"name": "Imhotep Charter", "id": 209, "slug": "pa/philadelphia/imhotep-charter-panthers"},
    {"name": "West Philadelphia", "id": 151, "slug": "pa/philadelphia/west-philadelphia-speedboys"},
    {"name": "Paul Robeson", "id": 2979, "slug": "pa/philadelphia/paul-robeson-tigers"},
    {"name": "Sankofa Freedom Academy", "id": 237, "slug": "pa/philadelphia/sankofa-freedom-academy-warriors"},
    {"name": "Carver Eng & Science", "id": 2755, "slug": "pa/philadelphia/carver-high-school-of-engineering-science-engineers"},
    {"name": "Constitution", "id": 220, "slug": "pa/philadelphia/constitution-generals"},
    {"name": "Samuel Fels", "id": 162, "slug": "pa/philadelphia/samuel-fels-hawks"},
    {"name": "Olney", "id": 163, "slug": "pa/philadelphia/olney-trojans"},
    {"name": "Roxborough", "id": 129, "slug": "pa/philadelphia/roxborough-indians"},
    {"name": "Franklin Towne", "id": 954, "slug": "pa/philadelphia/franklin-towne-charter-eagles"},
    {"name": "HS of the Future", "id": 2852, "slug": "pa/philadelphia/high-school-of-the-future"},
    {"name": "Kensington", "id": 128, "slug": "pa/philadelphia/kensington-tigers"},
    {"name": "Murrell Dobbins", "id": 2936, "slug": "pa/philadelphia/murrell-dobbins-career-technical-mustangs"},
    {"name": "Martin Luther King", "id": 2905, "slug": "pa/philadelphia/martin-luther-king-cougars"},
    {"name": "Frankford", "id": 180, "slug": "pa/philadelphia/frankford-pioneers"},
    {"name": "Abraham Lincoln", "id": 2697, "slug": "pa/philadelphia/abraham-lincoln-railsplitters"},
    {"name": "Northeast", "id": 149, "slug": "pa/philadelphia/northeast-vikings"},
    {"name": "Motivation", "id": 248, "slug": "pa/philadelphia/motivation-jaguars"},
    {"name": "George Washington", "id": 185, "slug": "pa/philadelphia/george-washington-eagles"},
    {"name": "Overbrook", "id": 159, "slug": "pa/philadelphia/overbrook-panthers"},
    {"name": "MAST III", "id": 6592, "slug": "pa/philadelphia/mast-community-charter-school-iii-lions"},
    {"name": "Mastery South", "id": 6464, "slug": "pa/philadelphia/mastery-charter-south-co-op-mastery-charter-lenfest-mastery-charter-thomas-bulldog"},
]

# This script outputs JSON that can be processed by a separate insertion script
# Each school gets its own JSON file in scripts/maxpreps_boxscores/

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "maxpreps_boxscores")
os.makedirs(OUTPUT_DIR, exist_ok=True)

print(f"MaxPreps Box Score Scraper")
print(f"Output directory: {OUTPUT_DIR}")
print(f"Schools to scrape: {len(SCHOOLS)}")
print(f"")
print("NOTE: This script is designed to be run with Playwright MCP from Claude Code.")
print("It outputs the school list and URL patterns for the scraper to use.")
print("")

# Output the school list as JSON for the scraper
with open(os.path.join(OUTPUT_DIR, "_schools.json"), "w") as f:
    json.dump(SCHOOLS, f, indent=2)
    print(f"Wrote {len(SCHOOLS)} schools to _schools.json")

# Print URL patterns
print("\nURL Patterns:")
print("  Roster: https://www.maxpreps.com/{slug}/basketball/roster/")
print("  Player Stats: https://www.maxpreps.com/{slug}/athletes/{player-slug}/basketball/stats/?careerid={id}")
print("  Schedule: https://www.maxpreps.com/{slug}/basketball/schedule/")
print("\nStats Tables Available (per player):")
print("  Shooting (1): Date, Result, Opponent, Min, Pts, FGM, FGA, FG%, PPS, AFG%")
print("  Shooting (2): Date, Result, Opponent, Min, Pts, 3PM, 3PA, 3P%, FTM, FTA, FT%, 2FGM, 2FGA, 2FG%")
print("  Totals: Date, Result, Opponent, Min, Pts, Off Reb, Def Reb, Total Reb, Ast, Stl, Blk, TO, PF")
print("  Misc Totals: Date, Result, Opponent, Min, Pts, DblDbl, TrpDbl, +/-")
