const {chromium}=require('playwright');
const P=[['city-london','CITY'],['cell-london-restaurants','TRADE'],['hood-london','HOOD'],['industry-restaurants','ACROSS']];
(async()=>{const b=await chromium.launch();
for (const [f,label] of P){
  const p=await b.newPage({viewport:{width:1280,height:900}});
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/'+f+'.html');
  await p.waitForTimeout(500);
  const r=await p.evaluate(()=>{
    const all=[...document.querySelectorAll('*')];
    // TEXT TOO WIDE: prose blocks whose line box exceeds ~75 characters
    const proseWide=[];
    for (const e of all){
      if (e.children.length) continue;
      const t=(e.textContent||'').trim();
      if (t.length<60) continue;
      const cs=getComputedStyle(e);
      const fs=parseFloat(cs.fontSize)||14;
      const w=e.getBoundingClientRect().width;
      const ch=w/(fs*0.5);           // rough average glyph width
      if (ch>80) proseWide.push({t:t.slice(0,42),ch:Math.round(ch),w:Math.round(w)});
    }
    // COHESION: how many distinct card radii / borders / paddings
    const cards=all.filter(e=>/rounded-\[/.test((e.className||'').toString()));
    const radii=[...new Set(cards.map(c=>getComputedStyle(c).borderTopLeftRadius))];
    const pads=[...new Set(cards.map(c=>getComputedStyle(c).paddingTop))];
    const borders=[...new Set(cards.map(c=>getComputedStyle(c).borderTopColor+' '+getComputedStyle(c).borderTopWidth))];
    const shadows=[...new Set(cards.map(c=>getComputedStyle(c).boxShadow))];
    return {proseWide:proseWide.slice(0,4),wideCount:proseWide.length,radii,pads,borders:borders.slice(0,4),shadows:shadows.map(s=>s==='none'?'none':'set')};
  });
  console.log('\n  '+label);
  console.log('    lines over ~80ch: '+r.wideCount);
  for (const x of r.proseWide) console.log('        '+x.ch+'ch  "'+x.t+'..."');
  console.log('    card radii:   '+r.radii.join(' | '));
  console.log('    card padding: '+r.pads.join(' | '));
  console.log('    card borders: '+r.borders.join(' | '));
  console.log('    card shadows: '+[...new Set(r.shadows)].join(' | '));
  await p.close();}
await b.close();})();
