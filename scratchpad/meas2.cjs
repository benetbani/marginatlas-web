const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for (const tag of ['before','after']){
  console.log('\n============ '+tag.toUpperCase()+' ============');
  for (const w of [320,480,760]){
    const p=await b.newPage({viewport:{width:w,height:700}});
    await p.goto('file:///E:/atlas/website/scratchpad/inc-measure-'+tag+'.html');
    await p.waitForTimeout(300);
    const r=await p.evaluate(()=>{
      const plot=document.querySelector('[role="img"][aria-label^="Median"]');
      if(!plot) return {err:'plot not found'};
      const pb=plot.getBoundingClientRect();
      const dots=[...plot.querySelectorAll('circle, .rounded-full')].map(c=>{
        const b=c.getBoundingClientRect();
        return {cx:Math.round(b.left+b.width/2), r:+(b.width/2).toFixed(2)};
      });
      // label row = the element right after the plot (svg case: sibling div)
      const row=plot.nextElementSibling && plot.nextElementSibling.children.length
        ? plot.nextElementSibling
        : [...plot.parentElement.children].find(e=>e!==plot && e.children.length>=3);
      const labs=row?[...row.children].map(s=>{
        const b=s.getBoundingClientRect();
        return {t:s.textContent.replace(/\s+/g,' ').trim(), cx:Math.round(b.left+b.width/2),
                l:Math.round(b.left), rt:Math.round(b.right)};
      }):[];
      const card=document.querySelector('#card > *');
      const cb=card.getBoundingClientRect();
      return {plotW:Math.round(pb.width), plotH:Math.round(pb.height), dots, labs,
              cardL:Math.round(cb.left), cardR:Math.round(cb.right),
              cardH:Math.round(cb.height)};
    });
    if(r.err){console.log('  '+w+': '+r.err); await p.close(); continue;}
    const over=r.labs.filter(l=>l.l<r.cardL||l.rt>r.cardR).length;
    console.log('\n  width '+w+'   plot '+r.plotW+'x'+r.plotH+'px   dot radii '+r.dots.map(d=>d.r).join(' / ')+'   card '+r.cardH+'px tall   labels outside the card: '+over);
    for (let i=0;i<r.labs.length;i++){
      const d=r.dots[i], l=r.labs[i];
      if(!d||!l) continue;
      console.log('    '+l.t.padEnd(14)+' mark '+String(d.cx).padStart(4)+'px   label centre '+String(l.cx).padStart(4)+'px   OFF BY '+String(Math.abs(d.cx-l.cx)).padStart(3)+'px');
    }
    await p.close();
  }
}
await b.close();})();
