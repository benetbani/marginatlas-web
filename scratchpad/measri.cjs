const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for (const tag of ['before','after']){
  const p=await b.newPage({viewport:{width:480,height:600}});
  await p.goto('file:///E:/atlas/website/scratchpad/ri-measure-'+tag+'.html');
  await p.waitForTimeout(300);
  const r=await p.evaluate(()=>{
    const fig=[...document.querySelectorAll('*')].find(e=>/^\d+%$/.test(e.textContent.trim())&&e.children.length===0);
    const card=document.querySelector('#card > *');
    return {size:fig?getComputedStyle(fig).fontSize:'?', text:fig?fig.textContent.trim():'?',
            cardH:Math.round(card.getBoundingClientRect().height)};
  });
  console.log('  '+tag.padEnd(7)+' focal figure "'+r.text+'" rendered at '+r.size+'   card '+r.cardH+'px tall');
  await p.close();}
await b.close();})();
