import { eachPage } from '../scripts/lib/measure_pages.mjs';
const pages = await eachPage(1440, () => {
  const out = [];
  for (const e of document.querySelectorAll('*')) {
    const d = e.closest('details'); if (d && !d.open && !e.closest('summary')) continue;
    const own = [...e.childNodes].filter(x => x.nodeType===3 && x.textContent.trim()).map(x=>x.textContent.trim()).join(' ');
    if (!own || !/^[+-]?[$£€x]?[\d][\d,. ]*(K|M|%|pp|\/10)?$/i.test(own)) continue;
    const b = e.getBoundingClientRect(); if (b.width < 1) continue;
    const s = getComputedStyle(e);
    if (/tabular-nums/.test(s.fontVariantNumeric)) continue;
    out.push(`${own}  (${Math.round(parseFloat(s.fontSize))}px, ${s.fontVariantNumeric})`);
  }
  return out;
});
let total = 0;
for (const { name, result } of pages) {
  total += result.length;
  console.log(`\n  ${name}: ${result.length} figure(s) without tabular numerals`);
  [...new Set(result)].slice(0, 8).forEach(x => console.log('     ' + x));
}
console.log(`\n  ${total} across the four pages\n`);
