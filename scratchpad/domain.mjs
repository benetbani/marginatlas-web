import { eachPage } from '../scripts/lib/measure_pages.mjs';
const r = await eachPage(1440, () => {
  const out = [];
  for (const track of document.querySelectorAll('[role="img"], .relative')) {
    const tb = track.getBoundingClientRect();
    if (tb.width < 120 || tb.height > 200) continue;
    const marks = [...track.querySelectorAll('*')].filter(e => {
      const s = getComputedStyle(e);
      if (s.position !== 'absolute') return false;
      const b = e.getBoundingClientRect();
      return b.width > 2 && b.width < 40 && b.height > 2 && b.height < 40;
    });
    if (marks.length < 3) continue;
    const xs = marks.map(m => ((m.getBoundingClientRect().left + m.getBoundingClientRect().width/2) - tb.left) / tb.width * 100);
    const lo = Math.min(...xs), hi = Math.max(...xs);
    const span = hi - lo;
    out.push(`span ${Math.round(span)}%  `+`${marks.length} marks span ${Math.round(span)}% of the track (${Math.round(lo)}% to ${Math.round(hi)}%)  "${(track.getAttribute('aria-label')||track.textContent||'').trim().replace(/\s+/g,' ').slice(0,34)}"`);
  }
  return [...new Set(out)];
});
for (const { name, result } of r) {
  console.log(`\n  ${name}: ${result.length} scale(s) using less than half their track`);
  result.slice(0,5).forEach(x => console.log('     ' + x));
}
