import { eachPage } from '../scripts/lib/measure_pages.mjs';
const r = await eachPage(1440, () => {
  const out = [];
  for (const list of document.querySelectorAll('ol, ul, tbody')) {
    const rows = [...list.children].filter(r => r.getBoundingClientRect().height > 2);
    if (rows.length < 3) continue;
    const width = Math.min(...rows.map(r => r.children.length));
    out.push(`${list.tagName} ${rows.length} rows x ${width} cells`);
  }
  return out;
});
r.forEach(x => { console.log('  ' + x.name + ': ' + x.result.length + ' repeated structures'); x.result.slice(0,4).forEach(y => console.log('     ' + y)); });
