#!/usr/bin/env node
/**
 * Insert EPA Football scraped data into game_player_stats
 * Reads JSON files from .firecrawl/epa-football/{year}/
 * Matches games by date+school, parses per-game stats, inserts rows
 * Run: node scripts/insert_epa_all_years.mjs
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const BASE_DIR = '/Users/admin/Desktop/psp-platform/.firecrawl/epa-football';
const SEASON_IDS = { 2024: 75, 2023: 74, 2022: 73, 2021: 72, 2020: 71, 2019: 70 };

// Parse "carries-yards" format like "10-88" or "5- -3"
function parseCarriesYards(val) {
  if (!val || val === 'X' || val === '0' || val === 'NONE') return null;
  const m = val.match(/^(\d+)\s*-\s*(-?\d+)$/);
  if (m) return { carries: parseInt(m[1]), yards: parseInt(m[2]) };
  return null;
}

// Parse "completions-attempts" format like "4-7"
function parseCompAtt(val) {
  if (!val || val === 'X' || val === '0') return null;
  const m = val.match(/^(\d+)\s*-\s*(\d+)$/);
  if (m) return { comp: parseInt(m[1]), att: parseInt(m[2]) };
  return null;
}

// Parse "receptions-yards" like "2-23"
function parseRecYards(val) {
  if (!val || val === 'X' || val === '0') return null;
  const m = val.match(/^(\d+)\s*-\s*(-?\d+)$/);
  if (m) return { rec: parseInt(m[1]), yards: parseInt(m[2]) };
  return null;
}

async function processYear(year) {
  const seasonId = SEASON_IDS[year];
  const yearDir = path.join(BASE_DIR, String(year));
  if (!fs.existsSync(yearDir)) { console.log(`No dir for ${year}`); return { year, inserted: 0, matched: 0 }; }

  const files = fs.readdirSync(yearDir).filter(f => f.endsWith('.json'));
  console.log(`\n=== ${year} Season (ID ${seasonId}) — ${files.length} schools ===`);

  let totalInserted = 0;
  let totalGamesMatched = 0;

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(yearDir, file), 'utf8'));
    const schoolId = data.dbId;
    if (!schoolId) { console.log(`  SKIP ${file} - no dbId`); continue; }

    const schoolName = data.school || file.replace('.json', '');

    // Get games for this school+season from DB
    const { data: dbGames, error: gErr } = await supabase
      .from('games')
      .select('id, game_date, home_school_id, away_school_id, home_score, away_score')
      .eq('sport_id', 'football')
      .eq('season_id', seasonId)
      .or(`home_school_id.eq.${schoolId},away_school_id.eq.${schoolId}`)
      .order('game_date');

    if (gErr) { console.error(`  DB error for ${schoolName}:`, gErr.message); continue; }
    if (!dbGames || dbGames.length === 0) { console.log(`  ${schoolName}: 0 DB games found`); continue; }

    // Map opponent index to game
    // The opponents array has abbreviations in schedule order
    const opponents = data.opponents || [];
    const schedule = data.schedule || [];

    // Build date mapping: for each opponent index, determine the game date
    // Since schedule extraction was unreliable, use DB games ordered by date
    // and try to match opponent abbreviations to school names
    const gamesByDate = {};
    for (const g of dbGames) {
      const dateKey = g.game_date; // "2024-08-22"
      const month = parseInt(dateKey.split('-')[1]);
      const day = parseInt(dateKey.split('-')[2]);
      const mmdd = `${String(month).padStart(2,'0')}/${String(day).padStart(2,'0')}`;
      gamesByDate[mmdd] = g;
    }

    // Also try to map by schedule if available
    const oppToGame = {};
    if (schedule.length > 0 && schedule.length === opponents.length) {
      // Perfect mapping: schedule[i].date corresponds to opponents[i]
      for (let i = 0; i < opponents.length; i++) {
        const sched = schedule[i];
        if (sched && sched.date && gamesByDate[sched.date]) {
          oppToGame[opponents[i]] = gamesByDate[sched.date];
        }
      }
    }

    // If schedule mapping didn't work, try matching by chronological order
    if (Object.keys(oppToGame).length === 0 && opponents.length > 0) {
      // Sort DB games by date and map to opponent columns in order
      const sortedGames = [...dbGames].sort((a, b) => a.game_date.localeCompare(b.game_date));
      for (let i = 0; i < opponents.length && i < sortedGames.length; i++) {
        oppToGame[opponents[i]] = sortedGames[i];
      }
    }

    if (Object.keys(oppToGame).length === 0) {
      console.log(`  ${schoolName}: could not map opponents to games (${opponents.length} opps, ${dbGames.length} games)`);
      continue;
    }

    // Now build player-game stat rows
    const rows = [];
    const playerGameSet = new Set(); // Dedup: "gameId-playerName"

    // Process rushing
    for (const player of (data.rushing || [])) {
      for (const [opp, val] of Object.entries(player.gameStats || {})) {
        const game = oppToGame[opp];
        if (!game) continue;
        const parsed = parseCarriesYards(val);
        if (!parsed) continue;
        const key = `${game.id}-${player.name}`;
        if (playerGameSet.has(key)) {
          // Merge with existing
          const existing = rows.find(r => r.game_id === game.id && r.player_name === player.name);
          if (existing) { existing.rush_carries = parsed.carries; existing.rush_yards = parsed.yards; }
          continue;
        }
        playerGameSet.add(key);
        rows.push({
          game_id: game.id, player_id: null, school_id: schoolId, sport_id: 'football',
          player_name: player.name, jersey_number: player.jersey,
          rush_carries: parsed.carries, rush_yards: parsed.yards,
          pass_completions: null, pass_yards: null, rec_catches: null, rec_yards: null, points: null,
          stats_json: { source: 'easternpafootball.com' },
          source_type: 'epa_football', source_file: `epa-${year}-${file.replace('.json','')}`,
          is_estimated: false
        });
      }
    }

    // Process passing (comp-att in first row, yards in second)
    for (const player of (data.passing || [])) {
      for (const [opp, val] of Object.entries(player.gameStats || {})) {
        const game = oppToGame[opp];
        if (!game) continue;
        const parsed = parseCompAtt(val);
        if (!parsed) continue;
        const key = `${game.id}-${player.name}`;
        if (playerGameSet.has(key)) {
          const existing = rows.find(r => r.game_id === game.id && r.player_name === player.name);
          if (existing) {
            existing.pass_completions = parsed.comp;
            existing.stats_json = { ...existing.stats_json, pass_attempts: parsed.att };
          }
          continue;
        }
        playerGameSet.add(key);
        rows.push({
          game_id: game.id, player_id: null, school_id: schoolId, sport_id: 'football',
          player_name: player.name, jersey_number: player.jersey,
          rush_carries: null, rush_yards: null,
          pass_completions: parsed.comp, pass_yards: null, rec_catches: null, rec_yards: null, points: null,
          stats_json: { source: 'easternpafootball.com', pass_attempts: parsed.att },
          source_type: 'epa_football', source_file: `epa-${year}-${file.replace('.json','')}`,
          is_estimated: false
        });
      }
    }

    // Process receiving
    for (const player of (data.receiving || [])) {
      for (const [opp, val] of Object.entries(player.gameStats || {})) {
        const game = oppToGame[opp];
        if (!game) continue;
        const parsed = parseRecYards(val);
        if (!parsed) continue;
        const key = `${game.id}-${player.name}`;
        if (playerGameSet.has(key)) {
          const existing = rows.find(r => r.game_id === game.id && r.player_name === player.name);
          if (existing) { existing.rec_catches = parsed.rec; existing.rec_yards = parsed.yards; }
          continue;
        }
        playerGameSet.add(key);
        rows.push({
          game_id: game.id, player_id: null, school_id: schoolId, sport_id: 'football',
          player_name: player.name, jersey_number: player.jersey,
          rush_carries: null, rush_yards: null, pass_completions: null, pass_yards: null,
          rec_catches: parsed.rec, rec_yards: parsed.yards, points: null,
          stats_json: { source: 'easternpafootball.com' },
          source_type: 'epa_football', source_file: `epa-${year}-${file.replace('.json','')}`,
          is_estimated: false
        });
      }
    }

    // Process scoring
    for (const player of (data.scoring || [])) {
      for (const [opp, val] of Object.entries(player.gameStats || {})) {
        const game = oppToGame[opp];
        if (!game) continue;
        const pts = parseInt(val);
        if (isNaN(pts)) continue;
        const key = `${game.id}-${player.name}`;
        if (playerGameSet.has(key)) {
          const existing = rows.find(r => r.game_id === game.id && r.player_name === player.name);
          if (existing && existing.points === null) { existing.points = pts; }
          continue;
        }
        playerGameSet.add(key);
        rows.push({
          game_id: game.id, player_id: null, school_id: schoolId, sport_id: 'football',
          player_name: player.name, jersey_number: player.jersey,
          rush_carries: null, rush_yards: null, pass_completions: null, pass_yards: null,
          rec_catches: null, rec_yards: null, points: pts,
          stats_json: { source: 'easternpafootball.com' },
          source_type: 'epa_football', source_file: `epa-${year}-${file.replace('.json','')}`,
          is_estimated: false
        });
      }
    }

    // Process interceptions
    for (const player of (data.interceptions || [])) {
      for (const [opp, val] of Object.entries(player.gameStats || {})) {
        const game = oppToGame[opp];
        if (!game) continue;
        const intCount = parseInt(val);
        if (isNaN(intCount) || intCount === 0) continue;
        const key = `${game.id}-${player.name}`;
        if (playerGameSet.has(key)) {
          const existing = rows.find(r => r.game_id === game.id && r.player_name === player.name);
          if (existing) { existing.stats_json = { ...existing.stats_json, interceptions: intCount }; }
          continue;
        }
        playerGameSet.add(key);
        rows.push({
          game_id: game.id, player_id: null, school_id: schoolId, sport_id: 'football',
          player_name: player.name, jersey_number: player.jersey,
          rush_carries: null, rush_yards: null, pass_completions: null, pass_yards: null,
          rec_catches: null, rec_yards: null, points: null,
          stats_json: { source: 'easternpafootball.com', interceptions: intCount },
          source_type: 'epa_football', source_file: `epa-${year}-${file.replace('.json','')}`,
          is_estimated: false
        });
      }
    }

    if (rows.length === 0) {
      console.log(`  ${schoolName}: 0 rows to insert (${opponents.length} opps, ${Object.keys(oppToGame).length} mapped)`);
      continue;
    }

    // Delete existing epa_football rows for this school+season to avoid duplicates
    const gameIds = [...new Set(rows.map(r => r.game_id))];
    for (const gid of gameIds) {
      await supabase.from('game_player_stats').delete()
        .eq('game_id', gid).eq('school_id', schoolId).eq('source_type', 'epa_football');
    }

    // Insert in batches of 50
    for (let i = 0; i < rows.length; i += 50) {
      const batch = rows.slice(i, i + 50);
      const { error: iErr } = await supabase.from('game_player_stats').insert(batch);
      if (iErr) {
        console.error(`  INSERT error for ${schoolName} batch ${i}:`, iErr.message);
        // Try one at a time
        for (const row of batch) {
          const { error: sErr } = await supabase.from('game_player_stats').insert(row);
          if (sErr) console.error(`    Single insert fail: ${row.player_name} game ${row.game_id}: ${sErr.message}`);
        }
      }
    }

    totalInserted += rows.length;
    totalGamesMatched += gameIds.length;
    console.log(`  ${schoolName}: ${rows.length} rows inserted across ${gameIds.length} games`);
  }

  return { year, inserted: totalInserted, gamesMatched: totalGamesMatched };
}

async function matchPlayerIds() {
  console.log('\n=== Matching Player IDs ===');

  // Step 1: Exact name match
  const { error: e1 } = await supabase.rpc('exec_sql', { query: `
    UPDATE game_player_stats gps
    SET player_id = p.id
    FROM players p
    WHERE gps.source_type = 'epa_football'
    AND gps.player_id IS NULL
    AND LOWER(TRIM(gps.player_name)) = LOWER(TRIM(p.name))
    AND p.primary_school_id = gps.school_id
    AND p.deleted_at IS NULL
  `});

  // Count matched
  const { data: countData } = await supabase
    .from('game_player_stats')
    .select('id', { count: 'exact' })
    .eq('source_type', 'epa_football')
    .is('player_id', null);

  console.log(`After exact match: ${countData?.length || '?'} still unmatched`);

  // Step 2: Fuzzy match (Jr. suffix, 1-char diff)
  const { error: e2 } = await supabase.rpc('exec_sql', { query: `
    UPDATE game_player_stats gps
    SET player_id = sub.pid
    FROM (
      SELECT DISTINCT ON (gps2.player_name, gps2.school_id)
        gps2.player_name, gps2.school_id, p.id as pid
      FROM game_player_stats gps2
      JOIN players p ON p.primary_school_id = gps2.school_id AND p.deleted_at IS NULL
        AND (
          LOWER(TRIM(REPLACE(REPLACE(p.name, ' Jr.', ''), ' Jr', ''))) = LOWER(TRIM(gps2.player_name))
          OR levenshtein(LOWER(TRIM(p.name)), LOWER(TRIM(gps2.player_name))) = 1
        )
      WHERE gps2.source_type = 'epa_football' AND gps2.player_id IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM game_player_stats existing
        WHERE existing.game_id = gps2.game_id AND existing.player_id = p.id AND existing.source_type = 'epa_football'
      )
      ORDER BY gps2.player_name, gps2.school_id, levenshtein(LOWER(TRIM(p.name)), LOWER(TRIM(gps2.player_name)))
    ) sub
    WHERE gps.source_type = 'epa_football' AND gps.player_id IS NULL
    AND gps.player_name = sub.player_name AND gps.school_id = sub.school_id
  `});

  console.log('Fuzzy match complete');
}

async function main() {
  const results = [];
  for (const year of [2024, 2023, 2022, 2021, 2020, 2019]) {
    const r = await processYear(year);
    results.push(r);
  }

  console.log('\n=== INSERTION SUMMARY ===');
  let grandTotal = 0;
  for (const r of results) {
    console.log(`${r.year}: ${r.inserted} rows, ${r.gamesMatched} games`);
    grandTotal += r.inserted;
  }
  console.log(`GRAND TOTAL: ${grandTotal} rows inserted`);

  // Match player IDs via direct SQL
  // Note: matchPlayerIds uses rpc which may not exist, so we'll do it differently
  console.log('\nPlayer ID matching will be done via separate SQL queries...');
}

main().catch(console.error);
