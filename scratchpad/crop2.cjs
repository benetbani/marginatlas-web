const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:1000}});
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/city-london.html');
await p.waitForTimeout(700);
const box=await p.evaluateHandle(()=>{
  const h=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&e.textContent.trim()==='What you can open here'&&e.closest('div'));
  let n=h; while(n && !(n.className||'').toString().includes('rounded-[14px]')) n=n.parentElement;
  return n||h;
});
const el=box.asElement();
if(el){await el.screenshot({path:'scratchpad/shots-final/TRADES.png'});console.log('cropped');}else console.log('not found');
await b.close();})();
