import { eachPage } from '../scripts/lib/measure_pages.mjs';
const pages = await eachPage(1440, () => {
  const num = (v) => Math.round(parseFloat(v) || 0);
  const chapter = [];
  for (const e of document.querySelectorAll('*')) {
    const t = (e.textContent||'').trim();
    if (!/^\d{2}[A-Z]/.test(t.replace(/\s+/g,''))) continue;
    const s = getComputedStyle(e);
    if (num(s.marginTop) > 0) chapter.push(num(s.marginTop));
  }
  const bands = [...document.querySelectorAll('div.grid')].filter(e => /^mt-8 grid grid-cols-1 items-start gap-8/.test(String(e.className)));
  const bandTop = [...new Set(bands.map(e => num(getComputedStyle(e).marginTop)))];
  const bandGap = [...new Set(bands.map(e => num(getComputedStyle(e).columnGap)))];
  const cards = [...document.querySelectorAll('div')].filter(e => getComputedStyle(e).backdropFilter !== 'none');
  const outer = cards.filter(c => !cards.some(o => o !== c && o.contains(c)));
  const pad = [...new Set(outer.map(e => num(getComputedStyle(e).paddingTop)))].sort((a,b)=>a-b);
  return { chapter: [...new Set(chapter)].sort((a,b)=>a-b), bandTop, bandGap, pad };
});
for (const { name, result } of pages) {
  console.log(`\n  ${name}`);
  console.log(`     chapter gap   ${result.chapter.join(', ') || '(none found)'}`);
  console.log(`     band top      ${result.bandTop.join(', ')}`);
  console.log(`     band gap      ${result.bandGap.join(', ')}`);
  console.log(`     card padding  ${result.pad.join(', ')}`);
}
