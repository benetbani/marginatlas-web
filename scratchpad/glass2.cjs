const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for (const [f,l] of [['city-london','CITY'],['cell-london-restaurants','TRADE'],['hood-london','HOOD'],['industry-restaurants','ACROSS']]){
  const p=await b.newPage({viewport:{width:1280,height:900}});
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/'+f+'.html');
  await p.waitForTimeout(500);
  const r=await p.evaluate(()=>{
    const all=[...document.querySelectorAll('*')];
    const blur=all.filter(e=>{const s=getComputedStyle(e);return s.backdropFilter&&s.backdropFilter!=='none';}).length;
    const band=document.querySelector('.spine-band');
    return {blur, band: band?getComputedStyle(band).backgroundImage.slice(0,44):'NO BAND ELEMENT'};
  });
  console.log('  '+l.padEnd(7)+' glass cards: '+String(r.blur).padStart(2)+'   band paints: '+(r.band.includes('gradient')?'yes':r.band));
  await p.close();}
await b.close();})();
