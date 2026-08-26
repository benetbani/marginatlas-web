const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for (const w of [320,760]){
  const p=await b.newPage({viewport:{width:w,height:1100}});
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/sweeps/SWEEP-REPORT-2026-08-23.html');
  await p.waitForTimeout(400);
  await p.screenshot({path:'scratchpad/shots-sweeps/TOP-'+w+'.png'});
  // does anything scroll sideways?
  const over=await p.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth);
  console.log('  width '+w+': body scrolls sideways? '+over);
  await p.close();}
await b.close();})();
