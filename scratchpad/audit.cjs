const {chromium}=require('playwright');
const P=[['city-london','CITY'],['cell-london-restaurants','TRADE'],['hood-london','HOOD'],['industry-restaurants','ACROSS']];
(async()=>{const b=await chromium.launch();
for (const [f,label] of P){
  const p=await b.newPage({viewport:{width:1280,height:900}});
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/'+f+'.html');
  await p.waitForTimeout(500);
  const r=await p.evaluate(()=>{
    const all=[...document.querySelectorAll('*')];
    const blur=all.filter(e=>{const s=getComputedStyle(e);return (s.backdropFilter&&s.backdropFilter!=='none')||(s.webkitBackdropFilter&&s.webkitBackdropFilter!=='none');}).length;
    const cards=all.filter(e=>/rounded-\[14px\]/.test((e.className||'').toString()));
    const bgs=[...new Set(cards.map(c=>getComputedStyle(c).backgroundColor))];
    const translucent=cards.filter(c=>{const m=getComputedStyle(c).backgroundColor.match(/rgba?\(([^)]+)\)/);if(!m)return false;const parts=m[1].split(',');return parts.length===4&&parseFloat(parts[3])<1;}).length;
    return {total:all.length,blur,cards:cards.length,translucent,bgs:bgs.slice(0,3)};
  });
  console.log('  '+label.padEnd(7)+' '+String(r.total).padStart(5)+' elements   backdrop-filter: '+r.blur+'   cards: '+r.cards+'   translucent: '+r.translucent);
  console.log('          card backgrounds: '+r.bgs.join(' | '));
  await p.close();}
await b.close();})();
