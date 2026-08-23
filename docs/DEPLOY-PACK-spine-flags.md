# Switching the rebuilt pages on

**Written 2026-08-24, while you were away from the computer. Two minutes of your time, no code.**

---

## The short version

Everything I have fixed over the last forty-odd rounds is on pages **that are not being served to anyone.** The rebuilt versions of the trade page, the trade-across-places page, the city page and the neighbourhood page all exist, are finished, and are switched off. Your visitors see the older versions.

Turning them on is four settings in your hosting dashboard and a redeploy. Nothing else.

---

## What to do

**1.** Open your project in Vercel, then **Settings → Environment Variables**.

**2.** Add these, each with the value `1`, scoped to **Production**:

```
NEXT_PUBLIC_SPINE_REFORM_CITY
NEXT_PUBLIC_SPINE_REFORM_CELL
NEXT_PUBLIC_SPINE_REFORM_INDUSTRY
NEXT_PUBLIC_SPINE_REFORM_HOOD
```

**3.** Redeploy. Environment variables only take effect on a fresh build.

**4.** Open marginatlas.com and look at a city page.

---

## My recommendation: do the city one first, alone

Add only `NEXT_PUBLIC_SPINE_REFORM_CITY` on the first pass.

That is the page this work has just been through end to end, section by section, and it is the one I have the most evidence about. If something looks wrong to you, you will know exactly where it came from. The other three can follow a day later once you have looked.

If you would rather see everything at once, add all four. Nothing about the other three is riskier; this is only about making a problem easy to trace.

---

## How to tell it worked

The rebuilt city page carries a rent comparison the old one does not. Search the page for the words **"in percentage points"**. If they are there, the new page is live. If not, the setting has not taken effect and the most likely reason is that the deploy has not finished or was not a fresh build.

---

## The separate question, and it is bigger than it looks

**Nobody knows whether your 116 quality checks run when you deploy.**

They are wired to run before a build, but only when the build is started a particular way. Which way your host starts it is a dashboard setting, not something written down in the project. If it is set the other way, **every one of those checks is skipped on every deploy** while still passing on my machine, which is the worst of both: all of the cost, none of the protection.

One line of configuration settles it permanently and puts the answer in the project instead of a dashboard, where it can be read and cannot drift:

```json
{ "buildCommand": "npm run build" }
```

I have not added it, because changing how your production site builds is a deploy decision and yours to make. **Say the word and it is a one-line change.**

---

## Two other things waiting on you, unrelated to this

Both are recorded in the project's own notes and neither is urgent for how the pages look.

**Two database tables do not exist**, and the forms that write to them tell the reader it worked. Every newsletter signup and every reader correction submitted so far has been discarded. Two ready-made, safe-to-rerun scripts are sitting in the project; they need pasting into your database console. Not urgent for correctness of the pages, and urgent for anything a reader took the trouble to send.

**Nine design decisions are waiting for you.** They are listed in full in the handoff document. The three that matter most: whether the accent colour is banned on hover (a written rule says it is, and ten controls use it); nine figures on the pay card that only a screen reader can hear; and how to handle the peer-city strip crowding at phone width.
