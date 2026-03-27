const fs = require('fs');
const path = require('path');

// This script reads EPA football JSON files and a game mapping file,
// then outputs SQL INSERT statements ready to execute.
// Usage: node epa-football-gen-sql.js <year> <games-json-file>
// The games-json-file should contain: [{id, game_date, home_school_id, away_school_id}, ...]

const year = process.argv[2];
const gamesFile = process.argv[3];
if (!year || !gamesFile) {
  console.error('Usage: node epa-football-gen-sql.js <year> <games-json-file>');
  process.exit(1);
}

const seasonId = year === '2022' ? 73 : year === '2021' ? 72 : null;
if (!seasonId) { console.error('Unknown year'); process.exit(1); }

const dir = path.join(__dirname, '..', '.firecrawl', 'epa-football', year);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
const allGames = JSON.parse(fs.readFileSync(gamesFile, 'utf8'));

function parseCarriesYards(val) {
  if (!val || val === 'X' || val === 'x') return null;
  const negMatch = val.match(/^(\d+)-\s*-\s*(\d+)$/);
  if (negMatch) return { a: parseInt(negMatch[1]), b: -parseInt(negMatch[2]) };
  const parts = val.split('-');
  if (parts.length === 2) {
    const a = parseInt(parts[0].trim());
    const b = parseInt(parts[1].trim());
    if (!isNaN(a) && !isNaN(b)) return { a, b };
  }
  return null;
}

function parsePoints(val) {
  if (!val || val === 'X' || val === 'x') return null;
  const n = parseInt(val);
  return isNaN(n) ? null : n;
}

function isRealPlayer(name) {
  if (/^\d+$/.test(name.trim())) return false;
  if (/^\d+\s*\(/.test(name.trim())) return false;
  return true;
}

function getPlayerKey(jersey, name) {
  return `${jersey}|${name.replace(/\s*\(\d+\)\s*$/, '').trim()}`;
}

function getCleanName(name) {
  return name.replace(/\s*\(\d+\)\s*$/, '').trim();
}

function escSql(s) {
  return s.replace(/'/g, "''");
}

let totalInserted = 0;
const allValues = [];

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  const opponents = data.opponents || [];

  if (opponents.length === 0) {
    console.error(`SKIP ${data.school} (dbId=${data.dbId}) - no per-game data`);
    continue;
  }

  const schoolId = data.dbId;

  // Get games for this school sorted by date
  const schoolGames = allGames
    .filter(g => g.home_school_id === schoolId || g.away_school_id === schoolId)
    .sort((a, b) => a.game_date.localeCompare(b.game_date));

  if (schoolGames.length < opponents.length) {
    console.error(`WARNING: ${data.school} has ${opponents.length} opponents but only ${schoolGames.length} DB games`);
  }

  // Map opponent index to game ID
  const oppToGameId = {};
  // Track which opponent codes map to which game - handle duplicate opponent codes
  const oppCodeCounts = {};
  for (let i = 0; i < opponents.length; i++) {
    const opp = opponents[i];
    if (!oppCodeCounts[opp]) oppCodeCounts[opp] = 0;
    oppCodeCounts[opp]++;
  }

  // For duplicate opponent codes, we need to track occurrence index
  const oppCodeSeen = {};
  for (let i = 0; i < opponents.length; i++) {
    const opp = opponents[i];
    if (!oppCodeSeen[opp]) oppCodeSeen[opp] = 0;
    const occIdx = oppCodeSeen[opp];
    oppCodeSeen[opp]++;

    if (i < schoolGames.length) {
      // Use compound key for duplicates: "OPP" or "OPP_1" for second occurrence
      const key = oppCodeCounts[opp] > 1 ? `${opp}_${occIdx}` : opp;
      oppToGameId[key] = schoolGames[i].id;
    }
  }

  // Build per-game player stats
  const gamePlayerStats = {};

  function ensurePlayer(gameId, jersey, name) {
    if (!gamePlayerStats[gameId]) gamePlayerStats[gameId] = {};
    const key = getPlayerKey(jersey, name);
    if (!gamePlayerStats[gameId][key]) {
      gamePlayerStats[gameId][key] = {
        jersey, name: getCleanName(name),
        rush_carries: null, rush_yards: null,
        pass_comp: null, pass_att: null,
        rec_catches: null, rec_yards: null,
        points: null
      };
    }
    return gamePlayerStats[gameId][key];
  }

  // Helper to resolve opponent code to game ID, handling duplicates
  function resolveGameIds(oppCode, playerGameStats) {
    // If there are duplicate opponent codes, we need a different approach
    // For non-duplicate codes, just return the single game ID
    if (oppCodeCounts[oppCode] === 1) {
      const gid = oppToGameId[oppCode];
      return gid ? [gid] : [];
    }
    // For duplicates, the gameStats object only has one key per opponent code
    // So the stat applies to ALL games against that opponent? No - EPA typically
    // has the stat in the column that corresponds to the Nth occurrence.
    // But since gameStats uses the same key, we can't distinguish.
    // In practice, for duplicates like FJ appearing twice, the gameStats will have
    // one entry under "FJ" which corresponds to one of the games.
    // We'll just use the first occurrence mapping.
    const gid = oppToGameId[`${oppCode}_0`];
    return gid ? [gid] : [];
  }

  // Process rushing
  for (const player of (data.rushing || [])) {
    if (!isRealPlayer(player.name)) continue;
    for (const [opp, val] of Object.entries(player.gameStats || {})) {
      const parsed = parseCarriesYards(val);
      if (!parsed) continue;
      const gameIds = resolveGameIds(opp, player.gameStats);
      for (const gid of gameIds) {
        const p = ensurePlayer(gid, player.jersey, player.name);
        p.rush_carries = parsed.a;
        p.rush_yards = parsed.b;
      }
    }
  }

  // Process passing
  for (const player of (data.passing || [])) {
    if (!isRealPlayer(player.name)) continue;
    for (const [opp, val] of Object.entries(player.gameStats || {})) {
      if (/^\d+(\s*\(\d+\))?$/.test(val.trim())) continue;
      const parsed = parseCarriesYards(val);
      if (!parsed) continue;
      const gameIds = resolveGameIds(opp, player.gameStats);
      for (const gid of gameIds) {
        const p = ensurePlayer(gid, player.jersey, player.name);
        p.pass_comp = parsed.a;
        p.pass_att = parsed.b;
      }
    }
  }

  // Process receiving
  for (const player of (data.receiving || [])) {
    if (!isRealPlayer(player.name)) continue;
    for (const [opp, val] of Object.entries(player.gameStats || {})) {
      const parsed = parseCarriesYards(val);
      if (!parsed) continue;
      const gameIds = resolveGameIds(opp, player.gameStats);
      for (const gid of gameIds) {
        const p = ensurePlayer(gid, player.jersey, player.name);
        p.rec_catches = parsed.a;
        p.rec_yards = parsed.b;
      }
    }
  }

  // Process scoring - only first occurrence per player
  const seenScoring = new Set();
  for (const player of (data.scoring || [])) {
    if (!isRealPlayer(player.name)) continue;
    const key = getPlayerKey(player.jersey, player.name);
    if (seenScoring.has(key)) continue;
    seenScoring.add(key);
    for (const [opp, val] of Object.entries(player.gameStats || {})) {
      const pts = parsePoints(val);
      if (pts === null) continue;
      const gameIds = resolveGameIds(opp, player.gameStats);
      for (const gid of gameIds) {
        const p = ensurePlayer(gid, player.jersey, player.name);
        p.points = pts;
      }
    }
  }

  // Generate VALUES
  let schoolRows = 0;
  for (const [gameId, players] of Object.entries(gamePlayerStats)) {
    for (const [key, p] of Object.entries(players)) {
      const v = `(${gameId},${schoolId},'football','${escSql(p.name)}','${escSql(p.jersey)}',${p.rush_carries ?? 'NULL'},${p.rush_yards ?? 'NULL'},${p.pass_comp ?? 'NULL'},${p.pass_att ?? 'NULL'},${p.rec_catches ?? 'NULL'},${p.rec_yards ?? 'NULL'},${p.points ?? 'NULL'},'epa_football','${escSql(file)}')`;
      allValues.push(v);
      schoolRows++;
    }
  }

  console.error(`${data.school} (dbId=${schoolId}): ${Object.keys(gamePlayerStats).length} games, ${schoolRows} rows`);
  totalInserted += schoolRows;
}

// Output DELETE statements first
const schoolIds = [...new Set(allValues.map(v => {
  const m = v.match(/^\(\d+,(\d+),/);
  return m ? m[1] : null;
}).filter(Boolean))];

const gameIds = [...new Set(allValues.map(v => {
  const m = v.match(/^\((\d+),/);
  return m ? m[1] : null;
}).filter(Boolean))];

// Output SQL in batches
console.log('-- EPA Football Per-Game Stats - ' + year);
console.log('-- Total rows: ' + totalInserted);
console.log('');

// Delete existing
for (const sid of schoolIds) {
  const gids = [...new Set(allValues.filter(v => v.includes(`,${sid},'football'`)).map(v => {
    const m = v.match(/^\((\d+),/);
    return m ? m[1] : null;
  }).filter(Boolean))];
  console.log(`DELETE FROM game_player_stats WHERE source_type='epa_football' AND school_id=${sid} AND game_id IN (${gids.join(',')});`);
}
console.log('');

// Insert in batches of 20
for (let i = 0; i < allValues.length; i += 20) {
  const batch = allValues.slice(i, i + 20);
  console.log(`INSERT INTO game_player_stats (game_id, school_id, sport_id, player_name, jersey_number, rush_carries, rush_yards, pass_completions, pass_yards, rec_catches, rec_yards, points, source_type, source_file) VALUES`);
  console.log(batch.join(',\n'));
  console.log('ON CONFLICT DO NOTHING;');
  console.log('');
}

console.error(`\nTOTAL: ${totalInserted} rows for ${year}`);
