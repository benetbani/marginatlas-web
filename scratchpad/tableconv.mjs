import { eachPage } from '../scripts/lib/measure_pages.mjs';
const r = await eachPage(1440, () => {
  const out = [];
  for (const t of document.querySelectorAll('table')) {
    const head = [...t.querySelectorAll('thead th, thead td')];
    const rows = [...t.querySelectorAll('tbody tr')];
    if (!rows.length) continue;
    const f = [];
    // F2 header: micro, uppercase, muted, not bold, no fill
    for (const h of head) {
      const s = getComputedStyle(h);
      if (parseFloat(s.fontWeight) >= 700) f.push('F2 header is bold');
      if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') f.push('F2 header carries a fill');
      if (parseFloat(s.fontSize) > 12) f.push(`F2 header at ${Math.round(parseFloat(s.fontSize))}px, over 12`);
    }
    // F3 no zebra, no vertical rules
    const bgs = [...new Set(rows.map(r => getComputedStyle(r).backgroundColor))];
    if (bgs.length > 1) f.push(`F3 rows carry ${bgs.length} different fills (zebra)`);
    const vr = rows.flatMap(r => [...r.children]).filter(c => getComputedStyle(c).borderRightWidth !== '0px').length;
    if (vr) f.push(`F3 ${vr} cell(s) carry a vertical rule`);
    // F6 blanks
    const blank = rows.flatMap(r => [...r.children]).filter(c => !(c.textContent||'').trim()).length;
    if (blank) f.push(`F6 ${blank} empty cell(s)`);
    out.push({ rows: rows.length, cols: head.length, f: [...new Set(f)] });
  }
  return out;
});
for (const { name, result } of r) {
  console.log(`\n  ${name}: ${result.length} table(s)`);
  result.forEach(t => console.log(`     ${t.rows} rows x ${t.cols} cols  ${t.f.length ? t.f.join('; ') : 'ok'}`));
}
