const fs = require('fs');
const path = require('path');

// This script reads EPA football JSON files and outputs SQL INSERT statements
// It will be run with: node scripts/epa-football-insert.js 2022 > /tmp/epa-2022.sql

const year = process.argv[2];
if (!year) { console.error('Usage: node epa-football-insert.js <year>'); process.exit(1); }

const dir = path.join(__dirname, '..', '.firecrawl', 'epa-football', year);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

// We'll output SQL that needs game_id mapping from DB
// Format: JSON summary per school for further processing

const results = [];

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  const opponents = data.opponents || [];

  if (opponents.length === 0) {
    console.error(`SKIP ${data.school} (dbId=${data.dbId}) - no per-game data (empty opponents)`);
    continue;
  }

  const schoolId = data.dbId;
  const school = data.school;

  // Build per-game player stats
  // Key: oppCode -> { playerKey -> { jersey, name, rush_carries, rush_yards, pass_comp, pass_yards, rec_catches, rec_yards, points } }
  const gamePlayerStats = {};

  for (const opp of opponents) {
    if (!gamePlayerStats[opp]) gamePlayerStats[opp] = {};
  }

  // Helper to parse "carries-yards" with possible negative like "2- -2"
  function parseCarriesYards(val) {
    if (!val || val === 'X' || val === 'x') return null;
    // Handle "2- -2" (2 carries, -2 yards) - the pattern is "num- -num"
    const negMatch = val.match(/^(\d+)-\s*-\s*(\d+)$/);
    if (negMatch) {
      return { a: parseInt(negMatch[1]), b: -parseInt(negMatch[2]) };
    }
    const parts = val.split('-');
    if (parts.length === 2) {
      return { a: parseInt(parts[0]), b: parseInt(parts[1]) };
    }
    return null;
  }

  function parsePoints(val) {
    if (!val || val === 'X' || val === 'x') return null;
    const n = parseInt(val);
    return isNaN(n) ? null : n;
  }

  function isRealPlayer(name) {
    // Skip rows that are aggregate stats (name is a number, or looks like "198", "14")
    if (/^\d+$/.test(name.trim())) return false;
    if (/^\d+\s*\(/.test(name.trim())) return false; // "21 (2)"
    return true;
  }

  function getPlayerKey(jersey, name) {
    // Normalize name - remove trailing "(3)" etc
    const cleanName = name.replace(/\s*\(\d+\)\s*$/, '').trim();
    return `${jersey}|${cleanName}`;
  }

  function getCleanName(name) {
    return name.replace(/\s*\(\d+\)\s*$/, '').trim();
  }

  function ensurePlayer(opp, jersey, name) {
    const key = getPlayerKey(jersey, name);
    if (!gamePlayerStats[opp]) gamePlayerStats[opp] = {};
    if (!gamePlayerStats[opp][key]) {
      gamePlayerStats[opp][key] = {
        jersey: jersey,
        name: getCleanName(name),
        rush_carries: null,
        rush_yards: null,
        pass_comp: null,
        pass_att: null,
        rec_catches: null,
        rec_yards: null,
        points: null
      };
    }
    return gamePlayerStats[opp][key];
  }

  // Process rushing
  for (const player of (data.rushing || [])) {
    if (!isRealPlayer(player.name)) continue;
    for (const [opp, val] of Object.entries(player.gameStats || {})) {
      const parsed = parseCarriesYards(val);
      if (parsed && gamePlayerStats.hasOwnProperty(opp)) {
        const p = ensurePlayer(opp, player.jersey, player.name);
        p.rush_carries = parsed.a;
        p.rush_yards = parsed.b;
      }
    }
  }

  // Process passing (comp-att format)
  for (const player of (data.passing || [])) {
    if (!isRealPlayer(player.name)) continue;
    for (const [opp, val] of Object.entries(player.gameStats || {})) {
      // Skip if value contains parentheses (it's a yards row like "98" or "147 (1)")
      if (/^\d+(\s*\(\d+\))?$/.test(val.trim())) continue;
      const parsed = parseCarriesYards(val);
      if (parsed && gamePlayerStats.hasOwnProperty(opp)) {
        const p = ensurePlayer(opp, player.jersey, player.name);
        p.pass_comp = parsed.a;
        p.pass_att = parsed.b;
      }
    }
  }

  // Process receiving (rec-yards)
  for (const player of (data.receiving || [])) {
    if (!isRealPlayer(player.name)) continue;
    for (const [opp, val] of Object.entries(player.gameStats || {})) {
      const parsed = parseCarriesYards(val);
      if (parsed && gamePlayerStats.hasOwnProperty(opp)) {
        const p = ensurePlayer(opp, player.jersey, player.name);
        p.rec_catches = parsed.a;
        p.rec_yards = parsed.b;
      }
    }
  }

  // Process scoring - only the FIRST occurrence of each player (the per-game points rows)
  // The scoring section often has duplicate players - first set has per-game breakdown, second set has TD counts
  const seenScoringPlayers = new Set();
  for (const player of (data.scoring || [])) {
    if (!isRealPlayer(player.name)) continue;
    const key = getPlayerKey(player.jersey, player.name);
    if (seenScoringPlayers.has(key)) continue; // Skip duplicate entries
    seenScoringPlayers.add(key);
    for (const [opp, val] of Object.entries(player.gameStats || {})) {
      const pts = parsePoints(val);
      if (pts !== null && gamePlayerStats.hasOwnProperty(opp)) {
        const p = ensurePlayer(opp, player.jersey, player.name);
        p.points = pts;
      }
    }
  }

  // Count stats
  let totalRows = 0;
  for (const opp of opponents) {
    const players = gamePlayerStats[opp] || {};
    totalRows += Object.keys(players).length;
  }

  results.push({
    school,
    schoolId,
    opponents,
    gamePlayerStats,
    totalRows,
    file
  });

  console.error(`${school} (dbId=${schoolId}): ${opponents.length} games, ${totalRows} player-game rows`);
}

// Output as JSON for the next step
console.log(JSON.stringify(results, null, 0));
