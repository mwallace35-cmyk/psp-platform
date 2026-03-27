#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_DIR = '/Users/admin/Desktop/psp-platform/.firecrawl/epa-football';
const hubData = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'hub-urls-all-years.json'), 'utf8'));

const DB_IDS = {
  'archbishop-carroll': 145, 'archbishop-ryan': 175, 'archbishop-wood': 144,
  'bonner-prendie': 177, 'cardinal-ohara': 167, 'conwell-egan': 2780,
  'father-judge': 147, 'la-salle': 2882, 'lansdale-catholic': 971,
  'malvern-prep': 156, 'neumann-goretti': 198, 'northeast': 149,
  'penn-charter': 161, 'roman-catholic': 127, 'st-josephs-prep': 1005,
  'west-catholic': 171, 'bishop-mcdevitt': 158
};
const SEASON_IDS = { '2024': 75, '2023': 74, '2022': 73, '2021': 72, '2020': 71, '2019': 70 };
const SKIP = ['springfield-delco', 'penn-wood', 'springfield'];

async function extractStats(page) {
  return page.evaluate(() => {
    const raw = document.body.innerText;
    const body = raw.replace(/\n\n\t\n\n/g, '\t').replace(/\n\t\t+\n/g, '\t').replace(/\n\t\n/g, '\t');
    const lines = body.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    let opponents = [];
    for (const line of lines) {
      if (line.includes('NO.') && line.includes('NAME') && line.includes('TOTALS')) {
        const parts = line.split('\t').map(p => p.trim()).filter(Boolean);
        const ni = parts.indexOf('NAME');
        const ti = parts.lastIndexOf('TOTALS');
        if (ni >= 0 && ti > ni) { opponents = parts.slice(ni + 1, ti); break; }
      }
    }

    const schedule = [];
    let inSched = false;
    for (const line of lines) {
      if (line.includes('SCHEDULE')) { inSched = true; continue; }
      if (line === 'RUSHING' || line.startsWith('RUSHING\t')) { inSched = false; continue; }
      if (inSched && /^\d{2}\/\d{2}/.test(line)) {
        const parts = line.split('\t').map(p => p.trim()).filter(Boolean);
        if (parts.length >= 3) schedule.push({ date: parts[0], opponent: parts[1], teamScore: parts[2], oppScore: parts[3] || '0' });
      }
    }

    const parseSection = (name) => {
      const players = []; let inSec = false;
      for (const line of lines) {
        if (line === name || line.startsWith(name + '\t')) { inSec = true; continue; }
        if (inSec && (['PASSING','RECEIVING','SCORING','INTERCEPTIONS'].includes(line) && line !== name)) { inSec = false; continue; }
        if (inSec && line.startsWith('Defensive')) { inSec = false; continue; }
        if (inSec && line === 'RUSHING' && name !== 'RUSHING') { inSec = false; continue; }
        if (!inSec) continue;
        if (line.includes('NO.') || line === 'TOTALS' || line === 'BREAKDOWN' || line === 'NAME') continue;
        const parts = line.split('\t').map(p => p.trim()).filter(p => p !== '');
        if (parts.length >= 3 && /^\d+$/.test(parts[0])) {
          const player = { jersey: parts[0], name: parts[1], gameStats: {}, total: parts[parts.length - 1] };
          const vals = parts.slice(2, parts.length - 1);
          opponents.forEach((opp, i) => { if (i < vals.length) player.gameStats[opp] = vals[i]; });
          players.push(player);
        }
      }
      return players;
    };

    const extractDef = () => {
      const di = body.indexOf('Defensive Game Stats');
      if (di === -1) return { teamInfo: '', players: [] };
      const ri = body.indexOf('Return Yards:', di);
      const dt = body.substring(di, ri > di ? ri : di + 5000);
      let ti = ''; const pl = [];
      for (const l of dt.split('\n').map(l => l.trim()).filter(Boolean)) {
        if (l.includes('Rush:') || l.includes('Pass:') || l.includes('Total:') || l.includes('PF ')) { ti += l + '; '; continue; }
        const p = l.split('\t').map(p => p.trim()).filter(p => p !== '');
        if (p.length >= 5 && /^[A-Z][a-z]/.test(p[0]) && /^\d+$/.test(p[1]))
          pl.push({ name:p[0],jersey:p[1],solo:p[2],assist:p[3],total:p[4],intYds:p[5]||'0',fumbRec:p[6]||'0',fumbForc:p[7]||'0',sacks:p[8]||'0',tflYds:p[9]||'0',pd:p[10]||'0',bkdKicks:p[11]||'0',specTeamT:p[12]||'' });
      }
      return { teamInfo: ti, players: pl };
    };

    const extractRet = () => {
      const ri = body.indexOf('Return Yards:');
      if (ri === -1) return { kickoffReturns:[],puntReturns:[],intReturns:[],fumbleReturns:[],miscReturns:[],punting:[],kicking:[] };
      const rt = body.substring(ri);
      const pr = (sm, ems) => {
        const s = rt.indexOf(sm); if (s === -1) return [];
        let e = rt.length;
        for (const em of ems) { const ei = rt.indexOf(em, s + sm.length + 5); if (ei > s && ei < e) e = ei; }
        const t = rt.substring(s, e); const p = [];
        for (const l of t.split('\n').map(l => l.trim()).filter(Boolean)) {
          if (l === sm || l.includes('None') || l === 'NONE') continue;
          const pts = l.split('\t').map(p => p.trim()).filter(p => p !== '');
          if (pts.length >= 3 && /^[A-Z][a-z]/.test(pts[0]) && /^\d+$/.test(pts[1]))
            p.push({ name: pts[0], jersey: pts[1], values: pts.slice(2) });
        }
        return p;
      };
      const em = ['Kickoff/Free kick:','Punts\t','INT\t','Fumble\t','Misc. Return','Punting\t','Kicking\t','Schedules'];
      return { kickoffReturns:pr('Kickoff/Free kick:',em),puntReturns:pr('Punts\t',em),intReturns:pr('INT\t',em),fumbleReturns:pr('Fumble\t',em),miscReturns:pr('Misc. Return',em),punting:pr('Punting\t',em),kicking:pr('Kicking\t',em) };
    };

    const def = extractDef(); const st = extractRet();
    return {
      opponents, schedule,
      rushing: parseSection('RUSHING'), passing: parseSection('PASSING'),
      receiving: parseSection('RECEIVING'), scoring: parseSection('SCORING'),
      interceptions: parseSection('INTERCEPTIONS'),
      defensiveTeamInfo: def.teamInfo, defensive: def.players,
      kickoffReturns: st.kickoffReturns, puntReturns: st.puntReturns,
      intReturns: st.intReturns, fumbleReturns: st.fumbleReturns,
      miscReturns: st.miscReturns, punting: st.punting, kicking: st.kicking
    };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.route('**/*.{png,jpg,jpeg,gif,svg,ico,woff,woff2,ttf}', r => r.abort());
  await page.route('**/adsbygoogle*', r => r.abort());
  await page.route('**/googleads*', r => r.abort());
  await page.route('**/doubleclick*', r => r.abort());

  const summary = {};
  let totalPages = 0;

  for (const year of ['2024','2023','2022','2021','2020','2019']) {
    const yd = hubData[year];
    if (!yd?.schools) { console.log(`No data for ${year}`); continue; }
    const dir = path.join(BASE_DIR, year);
    fs.mkdirSync(dir, { recursive: true });
    summary[year] = {};

    for (const [slug, info] of Object.entries(yd.schools)) {
      if (SKIP.some(s => slug.includes(s))) continue;
      const url = info.url;
      const dbId = DB_IDS[slug] || null;
      console.log(`[${year}] ${slug} -> ${url}`);
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(2000);
        const data = await extractStats(page);
        const result = { school: info.name || slug, dbId, year: parseInt(year), seasonId: SEASON_IDS[year], url, ...data };
        fs.writeFileSync(path.join(dir, `${slug}.json`), JSON.stringify(result, null, 2));
        const s = { g: data.schedule?.length||0, ru: data.rushing?.length||0, pa: data.passing?.length||0, re: data.receiving?.length||0, sc: data.scoring?.length||0, de: data.defensive?.length||0, ki: data.kicking?.length||0, pu: data.punting?.length||0 };
        summary[year][slug] = s;
        totalPages++;
        console.log(`  ${s.g}g ${s.ru}ru ${s.pa}pa ${s.re}re ${s.sc}sc ${s.de}def ${s.ki}ki ${s.pu}pu`);
      } catch (e) {
        console.error(`  ERR: ${e.message}`);
        summary[year][slug] = { error: e.message };
      }
      await page.waitForTimeout(1000);
    }
  }

  fs.writeFileSync(path.join(BASE_DIR, 'scrape-summary-all-years.json'), JSON.stringify(summary, null, 2));
  console.log(`\nDONE: ${totalPages} pages scraped`);
  await browser.close();
}

main().catch(console.error);
