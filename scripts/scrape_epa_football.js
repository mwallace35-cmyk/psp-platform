/**
 * Eastern PA Football per-game stats extractor
 *
 * Extracts all stat tables from easternpafootball.com school pages
 * Run via: node scripts/scrape_epa_football.js
 *
 * Data is extracted via Playwright browser automation (separate process)
 * This file contains the JS to evaluate inside the page context.
 */

// This function runs inside the browser page context
// It extracts ALL stat data from an easternpafootball.com school page
const extractAllStats = () => {
  const body = document.body.innerText;
  const result = {
    schedule: [],
    rushing: [],
    passing: [],
    receiving: [],
    scoring: [],
    interceptions: [],
    defensive: [],
    opponents: [], // Column headers (opponent abbreviations)
  };

  // Helper: split body into sections between known headers
  const sectionOrder = ['SCHEDULE', 'RUSHING', 'PASSING', 'RECEIVING', 'SCORING', 'INTERCEPTIONS', 'Defensive Game Stats'];

  // Find opponent column headers from RUSHING section
  const rushIdx = body.indexOf('RUSHING');
  if (rushIdx === -1) return result;

  // Get the text between RUSHING header and the first player row
  const rushSection = body.substring(rushIdx, rushIdx + 500);
  const rushLines = rushSection.split('\n').map(l => l.trim()).filter(Boolean);

  // Find the header row with opponent abbreviations
  // Pattern: NO. NAME AUD AW AR UD SMY BP RC FJ LS SJP ... TOTALS
  let opponentAbbrevs = [];
  for (const line of rushLines) {
    if (line.includes('NO.') && line.includes('NAME') && line.includes('TOTALS')) {
      const parts = line.split('\t').map(p => p.trim()).filter(Boolean);
      // Skip NO. and NAME at start, TOTALS at end
      const noIdx = parts.indexOf('NO.');
      const nameIdx = parts.indexOf('NAME');
      const totIdx = parts.indexOf('TOTALS');
      if (nameIdx >= 0 && totIdx >= 0) {
        opponentAbbrevs = parts.slice(nameIdx + 1, totIdx);
      }
      break;
    }
  }
  result.opponents = opponentAbbrevs;

  // Extract SCHEDULE section
  const schedIdx = body.indexOf('SCHEDULE');
  if (schedIdx >= 0) {
    const schedEnd = body.indexOf('RUSHING');
    const schedText = body.substring(schedIdx, schedEnd > schedIdx ? schedEnd : schedIdx + 2000);
    const schedLines = schedText.split('\n').map(l => l.trim()).filter(Boolean);

    for (const line of schedLines) {
      // Match date pattern: MM/DD
      const dateMatch = line.match(/^(\d{2}\/\d{2})/);
      if (dateMatch) {
        const parts = line.split('\t').map(p => p.trim()).filter(Boolean);
        if (parts.length >= 3) {
          result.schedule.push({
            date: parts[0],
            opponent: parts[1],
            teamScore: parseInt(parts[2]) || 0,
            oppScore: parseInt(parts[3]) || 0,
          });
        }
      }
    }
  }

  // Generic function to extract a per-game stat section
  const extractSection = (sectionName, nextSection) => {
    const startIdx = body.indexOf(sectionName);
    if (startIdx === -1) return [];

    let endIdx;
    if (nextSection) {
      endIdx = body.indexOf(nextSection, startIdx + sectionName.length);
    }
    if (!endIdx || endIdx === -1) {
      endIdx = startIdx + 5000;
    }

    const sectionText = body.substring(startIdx, endIdx);
    const lines = sectionText.split('\n').map(l => l.trim()).filter(Boolean);

    const players = [];
    let currentPlayer = null;

    for (const line of lines) {
      // Skip header lines
      if (line === sectionName || line.includes('NO.') || line.includes('TOTALS') || line === 'BREAKDOWN' || line === 'NAME') continue;

      // Check if this is a player data line (starts with a number = jersey)
      const parts = line.split('\t').map(p => p.trim()).filter(p => p !== '');

      if (parts.length >= 3) {
        // Check if first part is a jersey number
        const jerseyMatch = parts[0].match(/^\d+$/);
        if (jerseyMatch) {
          currentPlayer = {
            jersey: parts[0],
            name: parts[1],
            games: {},
            total: parts[parts.length - 1],
          };

          // Map values to opponent columns
          const statValues = parts.slice(2, -1); // Skip jersey, name, and total
          opponentAbbrevs.forEach((opp, i) => {
            if (i < statValues.length) {
              currentPlayer.games[opp] = statValues[i];
            }
          });

          players.push(currentPlayer);
        } else if (currentPlayer && !parts[0].match(/^[A-Z]/)) {
          // This might be a continuation row (passing yards row)
          // For PASSING, the second row has yards per game
          if (sectionName === 'PASSING') {
            currentPlayer.yardsRow = {};
            const yardValues = parts;
            opponentAbbrevs.forEach((opp, i) => {
              if (i < yardValues.length) {
                currentPlayer.yardsRow[opp] = yardValues[i];
              }
            });
          }
        }
      }
    }

    return players;
  };

  result.rushing = extractSection('RUSHING', 'PASSING');
  result.passing = extractSection('PASSING', 'RECEIVING');
  result.receiving = extractSection('RECEIVING', 'SCORING');
  result.scoring = extractSection('SCORING', 'INTERCEPTIONS');
  result.interceptions = extractSection('INTERCEPTIONS', 'Defensive Game Stats');

  // Extract defensive stats (season totals, different format)
  const defIdx = body.indexOf('Defensive Game Stats');
  if (defIdx >= 0) {
    const defText = body.substring(defIdx, defIdx + 5000);
    const defLines = defText.split('\n').map(l => l.trim()).filter(Boolean);

    for (const line of defLines) {
      const parts = line.split('\t').map(p => p.trim()).filter(p => p !== '');
      // Defensive rows have: Player, #, Solo, Assist, Total, Int/Yds, Fumb.Rec, Fumb.Forc, Sacks, TFL/YDS, PD, BKD Kicks, Spec.Team T
      if (parts.length >= 6) {
        const nameMatch = parts[0].match(/^[A-Z][a-z]/);
        const numMatch = parts[1] && parts[1].match(/^\d+$/);
        if (nameMatch && numMatch) {
          result.defensive.push({
            name: parts[0],
            jersey: parts[1],
            solo: parts[2],
            assist: parts[3],
            total: parts[4],
            intYds: parts[5] || '0',
            fumbRec: parts[6] || '0',
            fumbForc: parts[7] || '0',
            sacks: parts[8] || '0',
            tflYds: parts[9] || '0',
            pd: parts[10] || '0',
            bkdKicks: parts[11] || '0',
            specTeamT: parts[12] || '0',
          });
        }
      }
    }
  }

  return result;
};

// School URL mapping (PCL + extras from Huck's Hub)
const EPA_SCHOOLS = {
  // PCL Red Division
  'bonner-prendie': { url: 'https://www.easternpafootball.com/bonner-prendie-friars/', dbId: 177, name: 'Bonner-Prendergast' },
  'cardinal-ohara': { url: 'https://www.easternpafootball.com/cardinal-ohara-lions/', dbId: 167, name: "Cardinal O'Hara" },
  'father-judge': { url: 'https://www.easternpafootball.com/father-judge-crusaders/', dbId: 147, name: 'Father Judge' },
  'la-salle': { url: 'https://www.easternpafootball.com/la-salle-college-hs-explorers/', dbId: 2882, name: 'La Salle College HS' },
  'roman-catholic': { url: 'https://www.easternpafootball.com/roman-catholic-cahillites/', dbId: 127, name: 'Roman Catholic' },
  'st-josephs-prep': { url: 'https://www.easternpafootball.com/st-josephs-prep-hawks/', dbId: 1005, name: "St. Joseph's Prep" },

  // PCL Blue Division
  'archbishop-carroll': { url: 'https://www.easternpafootball.com/archbishop-carroll-patriots-D12/', dbId: 145, name: 'Archbishop Carroll' },
  'archbishop-ryan': { url: 'https://www.easternpafootball.com/archbishop-ryan-raiders/', dbId: 175, name: 'Archbishop Ryan' },
  'archbishop-wood': { url: 'https://www.easternpafootball.com/archbishop-wood-vikings/', dbId: 144, name: 'Archbishop Wood' },
  'conwell-egan': { url: 'https://www.easternpafootball.com/conwell-egan-eagles/', dbId: 2780, name: 'Conwell-Egan' },
  'lansdale-catholic': { url: 'https://www.easternpafootball.com/lansdale-catholic-crusaders/', dbId: 971, name: 'Lansdale Catholic' },
  'neumann-goretti': { url: 'https://www.easternpafootball.com/neumann-goretti-saints/', dbId: 198, name: 'Neumann-Goretti' },
  'west-catholic': { url: 'https://www.easternpafootball.com/west-catholic-burrs/', dbId: 171, name: 'West Catholic' },

  // Non-PCL but on EPA site
  'northeast': { url: 'https://www.easternpafootball.com/northeast-vikings/', dbId: 149, name: 'Northeast' },
  'malvern-prep': { url: 'https://www.easternpafootball.com/malvern-prep-friars/', dbId: 156, name: 'Malvern Prep' },
  'penn-charter': { url: 'https://www.easternpafootball.com/william-penn-charter-quakers/', dbId: 161, name: 'William Penn Charter' },
};

// Opponent abbreviation to school name mapping (common in PCL)
const OPPONENT_MAP = {
  'AUD': 'Audenreid',
  'AW': 'Archbishop Wood',
  'AR': 'Archbishop Ryan',
  'AC': 'Archbishop Carroll',
  'UD': 'Upper Darby',
  'SMY': 'Smyrna',
  'BP': 'Bonner-Prendergast',
  'RC': 'Roman Catholic',
  'FJ': 'Father Judge',
  'LS': 'La Salle',
  'SJP': "St. Joseph's Prep",
  'CO': "Cardinal O'Hara",
  'NG': 'Neumann-Goretti',
  'WC': 'West Catholic',
  'CE': 'Conwell-Egan',
  'LC': 'Lansdale Catholic',
  'WP': 'West Philadelphia',
  'NP': 'North Penn',
  'SL': 'Southern Lehigh',
  'NE': 'Northeast',
  'MP': 'Malvern Prep',
  'PC': 'Penn Charter',
  'CH': 'Calvert Hall',
  'ML': 'Malvern',
  'IMHO': 'Imhotep Charter',
  'DP': 'Devon Prep',
  'PW': 'Penn Wood',
  'SD': 'Springfield-Delco',
};

module.exports = { extractAllStats, EPA_SCHOOLS, OPPONENT_MAP };
