#!/usr/bin/env node
/**
 * Insert EPA Football 2024-25 per-game player stats for 13 remaining schools.
 * Uses Supabase REST API with the MCP execute_sql equivalent approach.
 *
 * Run: node scripts/insert-epa-football-2024.mjs
 */

import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://uxshabfmgjsykurzvkcr.supabase.co';
// We'll use the postgres REST endpoint with service role or the rpc endpoint

const JSON_DIR = '/Users/admin/Desktop/psp-platform/.firecrawl/epa-football/2024';

const SCHOOLS = [
  { file: 'cardinal-ohara.json', dbId: 167, abbr: 'CO' },
  { file: 'la-salle.json', dbId: 2882, abbr: 'LS' },
  { file: 'st-josephs-prep.json', dbId: 1005, abbr: 'SJP' },
  { file: 'bonner-prendie.json', dbId: 177, abbr: 'BP' },
  { file: 'father-judge.json', dbId: 147, abbr: 'FJ' },
  { file: 'archbishop-wood.json', dbId: 144, abbr: 'AW' },
  { file: 'archbishop-ryan.json', dbId: 175, abbr: 'AR' },
  { file: 'archbishop-carroll.json', dbId: 145, abbr: 'AC' },
  { file: 'conwell-egan.json', dbId: 2780, abbr: 'CE' },
  { file: 'lansdale-catholic.json', dbId: 971, abbr: 'LC' },
  { file: 'neumann-goretti.json', dbId: 198, abbr: 'NG' },
  { file: 'west-catholic.json', dbId: 171, abbr: 'WC' },
  { file: 'malvern-prep.json', dbId: 156, abbr: 'MP' },
];

// Build minimal JSON with only what process_epa_file_direct needs
function buildMinimalJson(data) {
  return {
    school: data.school,
    dbId: data.dbId,
    year: data.year,
    seasonId: data.seasonId,
    url: data.url,
    opponents: data.opponents,
    rushing: data.rushing || [],
    passing: data.passing || [],
    receiving: data.receiving || [],
    scoring: data.scoring || [],
    interceptions: data.interceptions || [],
  };
}

// Escape single quotes for SQL
function escapeSql(str) {
  return str.replace(/'/g, "''");
}

// Generate SQL for one school
function generateSql(data) {
  const minimal = buildMinimalJson(data);
  const jsonStr = escapeSql(JSON.stringify(minimal));
  return `SELECT * FROM process_epa_file_direct('${jsonStr}'::jsonb);`;
}

// Main
async function main() {
  const results = [];

  for (const school of SCHOOLS) {
    const filePath = path.join(JSON_DIR, school.file);
    console.log(`Reading ${school.file}...`);

    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    const sql = generateSql(data);

    // Write SQL to a file for each school so we can execute via MCP
    const sqlPath = `/Users/admin/Desktop/psp-platform/scripts/epa-sql/${school.abbr}.sql`;
    fs.mkdirSync(path.dirname(sqlPath), { recursive: true });
    fs.writeFileSync(sqlPath, sql);

    console.log(`  Written SQL for ${data.school} (${school.dbId}) - ${sql.length} chars`);
    results.push({ school: data.school, dbId: school.dbId, sqlLength: sql.length });
  }

  console.log('\nAll SQL files written to scripts/epa-sql/');
  console.log('\nSummary:');
  results.forEach(r => console.log(`  ${r.school} (${r.dbId}): ${r.sqlLength} chars`));

  // Also write a combined summary
  const summary = results.map(r => `${r.school} (${r.dbId}): ${r.sqlLength} chars`).join('\n');
  fs.writeFileSync('/Users/admin/Desktop/psp-platform/scripts/epa-sql/summary.txt', summary);
}

main().catch(console.error);
