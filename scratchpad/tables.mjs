import { eachPage } from '../scripts/lib/measure_pages.mjs';
const pages = await eachPage(1440, () => {
  const out = [];
  for (const t of document.querySelectorAll('table')) {
    const rows = [...t.querySelectorAll('tbody tr')];
    if (!rows.length) continue;
    const cols = Math.max(...rows.map(r => r.children.length));
    for (let c = 1; c < cols; c++) {
      const cells = rows.map(r => r.children[c]).filter(Boolean);
      const nums = cells.filter(x => /^[+-]?[$x]?[\d,.]+%?$/.test((x.textContent||'').trim()));
      if (nums.length < 2) continue;
      const aligns = [...new Set(nums.map(x => getComputedStyle(x).textAlign))];
      const tabular = [...new Set(nums.map(x => getComputedStyle(x).fontVariantNumeric))];
      const decimals = [...new Set(nums.map(x => { const m = (x.textContent||'').match(/\.(\d+)/); return m ? m[1].length : 0; }))];
      out.push({ col: c, n: nums.length, aligns, tabular, decimals,
        sample: nums.slice(0,3).map(x => (x.textContent||'').trim()).join(' ') });
    }
  }
  return out;
});
for (const { name, result } of pages) {
  if (!result.length) { console.log(`\n  ${name}: no numeric table columns found`); continue; }
  console.log(`\n  ${name}`);
  for (const r of result) {
    const bad = [];
    if (!r.aligns.every(a => a === 'right')) bad.push(`align ${r.aligns.join('/')}`);
    if (!r.tabular.every(t => /tabular-nums/.test(t))) bad.push(`numerals ${r.tabular.join('/')}`);
    if (r.decimals.length > 1) bad.push(`decimals ${r.decimals.join('/')}`);
    console.log(`    col ${r.col}  ${String(r.n).padStart(2)} nums  ${bad.length ? 'FAIL ' + bad.join(', ') : 'ok'}   "${r.sample}"`);
  }
}
