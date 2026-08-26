const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for (const w of [320,480]){
  const p=await b.newPage({viewport:{width:w,height:900}});
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/income/income-before-after.html');
  await p.waitForTimeout(400);
  const holds=await p.$$('.hold');
  await holds[0].screenshot({path:'scratchpad/shots-inc/CROP-after-'+w+'.png'});
  await holds[1].screenshot({path:'scratchpad/shots-inc/CROP-before-'+w+'.png'});
  await p.close();}
await b.close();})();
