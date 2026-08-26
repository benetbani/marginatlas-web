import { chromium } from 'playwright';
import { readdirSync } from 'node:fs';
const files = readdirSync('scratchpad/universality').filter(f => f.endsWith('.html'));
const b = await chromium.launch();
const seen = new Map();
for (const f of files) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1200 } });
  await p.goto('file:///E:/atlas/website/scratchpad/universality/' + f);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
  const r = await p.evaluate(() => {
    const out = [];
    for (const e of document.querySelectorAll('*')) {
      const d = e.closest('details'); if (d && !d.open && !e.closest('summary')) continue;
      const own = [...e.childNodes].filter(x => x.nodeType===3 && x.textContent.trim()).map(x=>x.textContent.trim()).join(' ').replace(/\s+/g,' ');
      if (own.length < 40 || !/[.,;]/.test(own)) continue;
      out.push(own);
    }
    return [...new Set(out)];
  });
  for (const s of r) { if (!seen.has(s)) seen.set(s, []); seen.get(s).push(f.replace('.html','').replace(/^(city|trade|across)-/,'')); }
  await p.close();
}
await b.close();
const rows = [...seen.entries()].sort((a,b) => b[1].length - a[1].length);
console.log(`\n  ${rows.length} distinct sentences across ${files.length} pages\n`);
for (const [s, pages] of rows) console.log(`  x${String(pages.length).padStart(2)}  ${s.slice(0,132)}`);
