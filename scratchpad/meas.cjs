const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for (const w of [320,480,760]){
  const p=await b.newPage({viewport:{width:w,height:700}});
  await p.goto('file:///E:/atlas/website/scratchpad/inc-measure.html');
  await p.waitForTimeout(350);
  const r=await p.evaluate(()=>{
    const svg=[...document.querySelectorAll('svg')].find(s=>(s.getAttribute('viewBox')||'').startsWith('0 0 320'));
    if(!svg) return {err:'chart svg not found'};
    const box=svg.getBoundingClientRect();
    const dots=[...svg.querySelectorAll('circle')].map(c=>{
      const b=c.getBoundingClientRect(); return {cx:Math.round(b.left+b.width/2), r:+(b.width/2).toFixed(2)};
    });
    const row=svg.parentElement.querySelector(':scope > div');
    const labs=row?[...row.children].map(s=>{
      const b=s.getBoundingClientRect();
      return {t:s.textContent.replace(/\s+/g,' ').trim(), cx:Math.round(b.left+b.width/2)};
    }):[];
    const lines=[...svg.querySelectorAll('line')];
    return {svgW:Math.round(box.width), svgH:Math.round(box.height), dots, labs,
      stemH: lines[1]?Math.round(lines[1].getBoundingClientRect().height):-1,
      baseTh: lines[0]?+(lines[0].getBoundingClientRect().height).toFixed(2):-1};
  });
  if(r.err){console.log('  '+w+': '+r.err); await p.close(); continue;}
  console.log('\n  width '+w+'   chart '+r.svgW+'x'+r.svgH+'px   stem '+r.stemH+'px   baseline '+r.baseTh+'px thick   dot radii '+r.dots.map(d=>d.r).join(' / '));
  for (let i=0;i<r.labs.length;i++){
    const d=r.dots[i], l=r.labs[i];
    if(!d||!l) continue;
    console.log('    '+l.t.padEnd(14)+' mark at '+String(d.cx).padStart(4)+'px   label centre '+String(l.cx).padStart(4)+'px   OFF BY '+String(Math.abs(d.cx-l.cx)).padStart(3)+'px');
  }
  await p.close();}
await b.close();})();
