# PCL Basketball Box Score Scraping Instructions

## What This Is
252 PDF box scores from the 2025-26 PCL Boys Basketball season need to be downloaded, parsed, and imported into the Supabase database.

## Files
- `pcl_basketball_boxscores.json` — 130 league game box score PDF URLs
- `pcl_basketball_nonleague_boxscores.json` — 122 non-league game box score PDF URLs (partial list, get full list from AOP stats page)

## Source
All PDFs are from https://aopathletics.org (Archdiocese of Philadelphia League)
- League games: https://aopathletics.org/calendar.aspx?path=mbball
- Non-league games: https://aopathletics.org/sports/2023/11/28/MBB_1128232642.aspx

## PDF Format
Each PDF is a basketball box score with:
- Two teams (home and away)
- Player names with stats: MIN, FG, 3PT, FT, REB, AST, STL, BLK, TO, PF, PTS
- Team totals
- Quarter-by-quarter scoring

## Filename Convention
`HOME_AWAY_MMDDYY_TYPE.pdf`
- HOME/AWAY are 2-3 letter school codes
- Type: PCL (conference) or NL (non-league)
- School codes: AC=Archbishop Carroll, AR=Archbishop Ryan, AW=Archbishop Wood, BP=Bonner & Prendie, CE=Conwell-Egan, CO=Cardinal O'Hara, DP=Devon Prep, FJ=Father Judge, LC=Lansdale Catholic, LS=La Salle College, NG=Neumann-Goretti, RC=Roman Catholic, SJP=St. Joseph's Prep, WC=West Catholic

## School ID Mapping (Supabase)
| Code | School | school_id |
|------|--------|-----------|
| AC | Archbishop Carroll | 166 |
| AR | Archbishop Ryan | 175 |
| AW | Archbishop Wood | 197 |
| BP | Bonner-Prendergast | 177 |
| CE | Conwell-Egan Catholic | 2780 |
| CO | Cardinal O'Hara | 167 |
| DP | Devon Prep | 138 (or check) |
| FJ | Father Judge | 147 |
| LC | Lansdale Catholic | 971 |
| LS | La Salle College High School | 2882 |
| NG | Neumann-Goretti | 198 |
| RC | Roman Catholic | 127 |
| SJP | St. Joseph's Prep | 1005 |
| WC | West Catholic | 171 |

## Steps for Claude Code

### 1. Download all PDFs
```bash
cd ~/Desktop/psp-platform/scripts
mkdir -p boxscores
cat pcl_basketball_boxscores.json | python3 -c "import json,sys; [print(u) for u in json.load(sys.stdin)]" | while read url; do
  filename=$(basename "$url" | sed 's/?.*//')
  wget -q -O "boxscores/$filename" "$url" 2>/dev/null || curl -sL "$url" -o "boxscores/$filename"
done
```

### 2. Parse PDFs with Python
Use `pdfplumber` (pip install pdfplumber) to extract tables from each PDF.

```python
import pdfplumber
import json, os, re

def parse_boxscore(pdf_path):
    """Extract player stats from a PCL basketball box score PDF."""
    with pdfplumber.open(pdf_path) as pdf:
        tables = []
        for page in pdf.pages:
            extracted = page.extract_tables()
            tables.extend(extracted)
        # Parse tables into structured player stats
        # Return: { home_team, away_team, players: [{name, team, min, fg, 3pt, ft, reb, ast, stl, blk, to, pf, pts}] }
```

### 3. Insert into Supabase
- Game scores already imported (119 league games in `games` table)
- Player stats go into `game_player_stats` table or aggregate into `basketball_player_seasons`
- Match player names to existing `players` table
- Supabase project: uxshabfmgjsykurzvkcr

### 4. Database Tables
- `games` — game records (119 league games already inserted)
- `basketball_player_seasons` — aggregated season stats (ppg, rpg, apg, etc.)
- `game_player_stats` — per-game stats (if table exists)

## Priority
Start with league game PDFs (130) since those games are already in the DB. Non-league games need the game records created too.
