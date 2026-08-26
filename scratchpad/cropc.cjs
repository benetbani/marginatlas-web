const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for (const w of [1280,375]){
  const p=await b.newPage({viewport:{width:w,height:1000}});
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/city-london.html');
  await p.waitForTimeout(700);
  const h=await p.evaluateHandle(()=>{
    const n=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&e.textContent.trim()==='Quick reads');
    let c=n; for(let i=0;i<8&&c;i++){c=c.parentElement; if(c&&/rounded-\[14px\]/.test((c.className||'').toString()))return c;}
    return n;});
  const el=h.asElement();
  if(el) await el.screenshot({path:'scratchpad/shots-close/COND-'+w+'.png'});
  console.log('  '+w+': '+(el?'cropped':'not found'));
  await p.close();}
await b.close();})();
