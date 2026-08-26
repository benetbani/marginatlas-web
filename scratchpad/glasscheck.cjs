const {chromium}=require('playwright');
const P=[['city-london','CITY'],['cell-london-restaurants','TRADE'],['hood-london','HOOD'],['industry-restaurants','ACROSS']];
/* WCAG relative luminance + contrast, so the AA claim is measured not asserted. */
const lum=(r,g,b)=>{const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)};
(async()=>{const b=await chromium.launch();
for (const [f,label] of P){
  const p=await b.newPage({viewport:{width:1280,height:900}});
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/'+f+'.html');
  await p.waitForTimeout(600);
  const r=await p.evaluate(()=>{
    const all=[...document.querySelectorAll('*')];
    const blur=all.filter(e=>{const s=getComputedStyle(e);return s.backdropFilter&&s.backdropFilter!=='none';}).length;
    // sample real body text inside a card and its effective ground
    const card=all.find(e=>/rounded-\[14px\]/.test((e.className||'').toString()));
    const texts=[...(card?card.querySelectorAll('*'):[])].filter(e=>e.children.length===0&&(e.textContent||'').trim().length>12).slice(0,3);
    return {blur, cardBg:card?getComputedStyle(card).backgroundColor:'-',
      samples:texts.map(t=>({t:(t.textContent||'').slice(0,22),c:getComputedStyle(t).color}))};
  });
  const parse=s=>{const m=s.match(/[\d.]+/g);return m?m.map(Number):null};
  const bg=parse(r.cardBg)||[255,255,255];
  // composite the card over the worst spine ground measured in globals.css: rgb(173.7)
  const a=bg[3]===undefined?1:bg[3];
  const gr=bg[0]*a+173.7*(1-a);
  console.log('\n  '+label+'   backdrop-filter elements: '+r.blur+'   card bg: '+r.cardBg);
  for (const s of r.samples){
    const c=parse(s.c);
    const L1=lum(gr,gr,gr), L2=lum(c[0],c[1],c[2]);
    const ratio=((Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05));
    console.log('      "'+s.t+'" ratio '+ratio.toFixed(2)+(ratio>=4.5?'  AA pass':'  AA FAIL'));
  }
  await p.close();}
await b.close();})();
