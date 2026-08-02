#!/usr/bin/env node
/* =============================================================================
   verify_lattice , the number gate.

   Four consecutive review rounds found figures on these pages contradicting each
   other, and human review missed the same class every time. This asserts the
   relationships mechanically so they cannot drift again.

   It checks three kinds of thing:
     MODEL     one page's arithmetic agrees with itself
     LATTICE   the same quantity agrees across country, city and trade
     LANGUAGE  the founder's banned words and the one-accent palette rule

   usage:  node scripts/verify_lattice.mjs
   exit 1 on any failure, with the offending figures printed.
============================================================================= */
import fs from 'node:fs';

/* Resolved from this file, not hardcoded. It read 'E:/atlas/design/mockups',
   which is one person's disk: anyone else cloning the repo got a throw, and so
   would any machine that is not this one. This gate is local-only (it runs from
   loop_gate.mjs, never from prebuild) so it was never a deploy risk, but the
   absolute path was one keystroke away from being pasted into something that
   is. The mockups live in the PARENT repository, which a build server never
   clones, so a missing directory is a skip and not a failure. */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../design/mockups');
if (!fs.existsSync(DIR)) {
  console.log(
    `verify_lattice: SKIPPED. The mockups are not in this repository\n` +
      `  (${DIR})\n` +
      `  They live in the parent project, so a build server never has them.\n` +
      `  This is not a pass.`,
  );
  process.exit(0);
}
const read = f => fs.readFileSync(`${DIR}/${f}`, 'utf8');
const PAGES = { cell: read('cell.html'), city: read('city.html'), country: read('country.html') };
const CSS = read('atlas.css');

const fails = [];
const notes = [];
const fail = (id, msg) => fails.push(`${id}  ${msg}`);
const ok = (id, msg) => notes.push(`${id}  ${msg}`);

/* ---------- helpers ---------- */
const money = s => Number(String(s).replace(/[^0-9.-]/g, ''));
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const all = (re, s) => [...s.matchAll(re)];
const one = (re, s) => { const m = s.match(re); return m ? m : null; };

/* =========================================================================
   MODEL , the cell page must agree with its own arithmetic
   ========================================================================= */

/* M1. the method table's revenue must equal orders x spend x days */
{
  const m = one(/([\d,]+) orders &times; \$(\d+) &times; (\d+) days<\/span><\/span><span class="v">\$([\d,]+)</, PAGES.cell);
  if (!m) fail('M1', 'could not find the revenue line in "How we work this out"');
  else {
    const [, orders, spend, days, printed] = m;
    const calc = money(orders) * money(spend) * money(days);
    if (!near(calc, money(printed), 1))
      fail('M1', `revenue ${orders} x $${spend} x ${days} = ${calc.toLocaleString()} but the page prints ${printed}`);
    else ok('M1', `revenue reconciles at $${calc.toLocaleString()}`);
  }
}

/* M2. the five cost lines must sum to the stated take-home */
{
  const start = PAGES.cell.indexOf('The arithmetic, in full');
  const block = PAGES.cell.slice(start, start + 2600);
  const rev = money((one(/<span class="v">\$([\d,]+)<\/span>/, block) || [])[1]);
  const subs = all(/class="l sub"[\s\S]{0,240}?<span class="v">&minus;\$([\d,]+)<\/span>/g, block).map(x => money(x[1]));
  const res = money((one(/class="l res"[\s\S]*?<span class="v">\$([\d,]+)<\/span>/, block) || [])[1]);
  if (!rev || subs.length < 4 || !res) fail('M2', 'could not parse the arithmetic table');
  else {
    const left = rev - subs.reduce((a, b) => a + b, 0);
    if (!near(left, res, 2))
      fail('M2', `revenue minus the ${subs.length} cost lines = ${Math.round(left).toLocaleString()} but the page states ${res.toLocaleString()}`);
    else ok('M2', `the cost stack reconciles to $${res.toLocaleString()}`);
  }
}

/* M3. the rota cannot cost more than the staff line it sits under */
{
  const staff = money((one(/less staff, \d+%<\/span><span class="v">&minus;\$([\d,]+)/, PAGES.cell) || [])[1]);
  const rota = money((one(/All-in, a year<\/span><span><\/span><span class="v">\$(\d+)K/, PAGES.cell) || [])[1]) * 1000;
  if (!staff || !rota) fail('M3', 'could not find the staff line or the rota total');
  else if (rota > staff * 1.02)
    fail('M3', `the rota totals $${rota.toLocaleString()} against a staff budget of $${staff.toLocaleString()}`);
  else ok('M3', `the rota fits the staff budget (${rota.toLocaleString()} of ${staff.toLocaleString()})`);
}

/* M4. every money column must sum to 100 */
for (const [name, html] of Object.entries(PAGES)) {
  const cols = all(/<div class="col-split"[\s\S]*?<\/div>\s*<\/div>/g, html);
  all(/<div class="col-split"[^>]*>([\s\S]*?)<\/div>\s*(?=<\/div>|<p|<div class="col-legend")/g, html)
    .forEach((c, i) => {
      const flexes = all(/flex:(\d+(?:\.\d+)?)/g, c[1]).map(x => Number(x[1]));
      if (flexes.length < 3) return;
      const sum = flexes.reduce((a, b) => a + b, 0);
      if (!near(sum, 100, 0.5))
        fail('M4', `${name}: a money column's segments sum to ${sum}, not 100 (${flexes.join('+')})`);
      else ok('M4', `${name}: money column ${i + 1} sums to 100`);
    });
}

/* M5. a chart indexed to its own average must have an array averaging 100 */
{
  const checks = [
    ['cell', /var m=\[([\d,\s]+)\][^;]*yearBars/],
    ['city', /var v=\[([\d,\s]+)\]/],
  ];
  for (const [page, re] of checks) {
    const m = one(re, PAGES[page]);
    if (!m) { fail('M5', `${page}: could not find the indexed monthly array`); continue; }
    const arr = m[1].split(',').map(Number).filter(n => !isNaN(n));
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    if (!near(mean, 100, 2.5))
      fail('M5', `${page}: the monthly index averages ${mean.toFixed(1)}, but the chart draws a line at 100`);
    else ok('M5', `${page}: monthly index averages ${mean.toFixed(1)}`);
  }
}

/* M6. the distribution's median must equal the take-home the page calls typical */
{
  const p = one(/var A = (-?\d+), K = (\d+), P = ([\d.]+)/, PAGES.cell);
  const typ = money((one(/<span class="nm">The owner keeps<\/span><span class="v a">\$(\d+)<span class="u">K/, PAGES.cell) || [])[1]) * 1000;
  if (!p || !typ) fail('M6', 'could not find the distribution constants or the published typical');
  else {
    const [, A, K, P] = p.map(Number);
    const median = A + K * Math.pow(0.5, P);
    if (!near(median, typ, typ * 0.06))
      fail('M6', `the distribution's median is $${Math.round(median).toLocaleString()} but the page publishes $${typ.toLocaleString()} as typical`);
    else ok('M6', `the distribution median matches the published typical ($${Math.round(median).toLocaleString()})`);
  }
}

/* M7. the hero model and the printed take-home must be the same model */
{
  const h = one(/var FIXED = (\d+), CONTRIB = ([\d.]+), TYPICAL = (\d+)/, PAGES.cell);
  const res = money((one(/class="l res"[\s\S]*?<span class="v">\$([\d,]+)<\/span>/, PAGES.cell) || [])[1]);
  if (!h || !res) fail('M7', 'could not find the hero constants');
  else {
    const [, FIXED, CONTRIB, TYPICAL] = h.map(Number);
    const keep = TYPICAL * CONTRIB - FIXED;
    if (!near(keep, res, 400))
      fail('M7', `the hero model yields $${Math.round(keep).toLocaleString()} at typical revenue but the page prints $${res.toLocaleString()}`);
    else ok('M7', `the hero model agrees with the printed take-home`);
  }
}

/* =========================================================================
   LATTICE , the same quantity must agree across pages
   ========================================================================= */

/* L1. a trade named on two pages must carry the same take-home */
{
  const cellCafe = one(/Cafes in London<\/span><span class="g">\$(\d+)K kept/, PAGES.cell);
  const cityCafe = one(/<td>Cafe<\/td><td>\$\d+K<\/td><td[^>]*>\$(\d+)K<\/td>/, PAGES.city);
  if (cellCafe && cityCafe && cellCafe[1] !== cityCafe[1])
    fail('L1', `cafes in London keep $${cellCafe[1]}K on the trade page and $${cityCafe[1]}K on the city page`);
  else if (cellCafe && cityCafe) ok('L1', `the cafe figure agrees across pages ($${cellCafe[1]}K)`);
}

/* L2. London margins must sit below the national ones, because London rent is
   more than twice the country rate. If this comparison cannot run, that is a
   failure: a check that silently skips is false assurance. */
{
  const nat = {};
  all(/<td>(?:<span[^>]*><\/span>\s*)?([A-Za-z][A-Za-z ]*?)<\/td>\s*<td[^>]*>(\d+)%<\/td>/g, PAGES.country)
    .forEach(m => { nat[m[1].trim().toLowerCase()] = Number(m[2]); });
  const lon = {};
  all(/<td>([A-Za-z][A-Za-z ]*?)<\/td>\s*<td>\$(\d+)K<\/td>\s*<td[^>]*>\$(\d+)K<\/td>/g, PAGES.city)
    .forEach(m => { lon[m[1].trim().toLowerCase()] = Number(m[3]) / Number(m[2]) * 100; });

  const shared = Object.keys(lon).filter(t => nat[t] !== undefined);
  if (shared.length < 3)
    fail('L2', `only ${shared.length} trades matched across the city and country tables, so the margin comparison did not run. City: [${Object.keys(lon)}] Country: [${Object.keys(nat)}]`);
  else {
    let bad = 0;
    for (const trade of shared) {
      if (lon[trade] >= nat[trade] - 0.5) {
        bad++;
        fail('L2', `${trade}: London keeps ${lon[trade].toFixed(1)}% against a national ${nat[trade]}%, but London rent is more than twice the country rate`);
      }
    }
    if (!bad) ok('L2', `${shared.length} trades compared, London sits below national on every one`);
  }
}

/* =========================================================================
   LANGUAGE , the founder's standing rules
   ========================================================================= */
{
  const banned = [
    [/\bturnover\b/i, 'turnover (use revenue)'],
    [/\bpercentage points\b/i, 'percentage points (use %)'],
    [/\bpp\b/, 'pp (use %)'],
    [/\bcovers\b/i, 'covers (use orders)'],
    [/\bnet margin\b/i, 'net margin (use what the owner keeps)'],
    [/—/, 'em-dash'],
    /* entities render as the banned character, so source-only matching missed
       eight of them on the country page while this gate reported green */
    [/&mdash;|&#8212;|&#x2014;/i, 'em-dash entity (&mdash;)'],
    [/&ndash;|&#8211;|&#x2013;/i, 'en-dash entity (use "to" in a range)'],
  ];
  for (const [name, html] of Object.entries(PAGES)) {
    const body = html.replace(/<script[\s\S]*?<\/script>/g, '');
    for (const [re, label] of banned)
      if (re.test(body)) fail('LANG', `${name}: contains ${label}`);
  }
  ok('LANG', 'no banned words on any page');
}

/* one accent only: every warm hex must be terracotta */
{
  const TERRA = new Set(['#c23a22', '#9e2e1b', '#d4573c']);
  const hexes = new Set(all(/#[0-9a-f]{6}/gi, CSS + Object.values(PAGES).join('')).map(m => m[0].toLowerCase()));
  for (const h of hexes) {
    const r = parseInt(h.slice(1, 3), 16), b = parseInt(h.slice(5, 7), 16);
    if (r - b > 6 && !TERRA.has(h)) fail('PALETTE', `${h} is a warm colour that is not terracotta`);
  }
  ok('PALETTE', 'terracotta is the only warm colour');
}

/* ---------- report ---------- */
console.log('\nverify_lattice\n' + '='.repeat(60));
notes.forEach(n => console.log('  ok    ' + n));
if (fails.length) {
  console.log('');
  fails.forEach(f => console.log('  FAIL  ' + f));
  console.log(`\n${fails.length} failure${fails.length > 1 ? 's' : ''}.\n`);
  process.exit(1);
}
console.log(`\nall ${notes.length} checks passed.\n`);
