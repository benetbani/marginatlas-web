const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1280,height:1000}});
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/cell-london-restaurants.html');
await p.waitForTimeout(700);
const h=await p.evaluateHandle(()=>{
  const n=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&e.textContent.trim()==='What the team costs');
  let c=n; for(let i=0;i<10&&c;i++){c=c.parentElement; if(c&&/md:flex-row|grid/.test((c.className||'').toString())&&c.children.length===2)return c;}
  return n;});
const el=h.asElement();
if(el) await el.screenshot({path:'scratchpad/shots-close/BAND.png'});
const m=await p.evaluate(()=>{
  const cards=[...document.querySelectorAll('div')].filter(d=>/rounded-\[14px\]/.test((d.className||'').toString()));
  return cards.filter(c=>/owner keeps|team costs/i.test(c.textContent||'')).map(c=>({t:(c.textContent||'').slice(0,26).trim(),h:Math.round(c.getBoundingClientRect().height)}));
});
console.log(JSON.stringify(m));
await b.close();})();
