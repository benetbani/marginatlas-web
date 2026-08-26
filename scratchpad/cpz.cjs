const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const w of [320,480]){
  const p=await b.newPage({viewport:{width:w,height:1000}});
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/citypeers/citypeers-before-after.html');
  await p.waitForTimeout(400);
  const h=(await p.$$('.hold'))[0];
  await h.screenshot({path:'scratchpad/shots-cp/ZOOM-'+w+'.png'});
  await p.close();
}
// what is the pink?
const p=await b.newPage({viewport:{width:900,height:900}});
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/citypeers/citypeers-before-after.html');
await p.waitForTimeout(400);
const info=await p.evaluate(()=>{
  const els=[...document.querySelectorAll('.hold')][0].querySelectorAll('*');
  const out=[];
  for (const e of els){
    const cs=getComputedStyle(e);
    const bg=cs.backgroundColor;
    if (bg && bg!=='rgba(0, 0, 0, 0)' && bg!=='rgb(255, 255, 255)') out.push({tag:e.tagName, cls:(e.className||'').toString().slice(0,60), bg});
  }
  return out.slice(0,10);
});
console.log(JSON.stringify(info,null,1));
await b.close();})();
