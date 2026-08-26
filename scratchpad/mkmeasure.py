import io,sys
tw=io.open('scratchpad/tw-inc.css',encoding='utf-8').read()
card=io.open('scratchpad/inc-live-%s.html'%sys.argv[1],encoding='utf-8').read()
head='''<!doctype html><meta charset="utf-8">
<style>%s</style>
<style>:root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;
--c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;
--terra:#fb8469;--terra-text:#c2410c;--terra-border:#ffc7ba;
--t-mark:10px;--t-micro:11px;--t-small:12px;--t-body:14px;--t-lead:16px;--t-sub:18px;}
.ma-glyph .a{stroke:#c2410c}.ma-glyph .af{fill:#c2410c;stroke:none}
*{box-sizing:border-box}body{margin:0;padding:12px;font-family:Inter,system-ui,sans-serif;background:#fafaf9}</style>
<div id="card">%s</div>''' % (tw, card)
io.open('scratchpad/inc-measure-%s.html'%sys.argv[1],'w',encoding='utf-8',newline='').write(head)
print('built', sys.argv[1])
