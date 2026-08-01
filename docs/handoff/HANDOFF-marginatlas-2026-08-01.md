# HANDOFF , Margin Atlas, the site engine (Loop 3 and the mechanisms turn)
*2026-08-01. Everything built in the last three days is committed and pushed to
`reform-v2/r6-forward`. **None of it has reached production, which has been
frozen on a June 15 commit.** Every Vercel deployment of this branch failed for
two days; the cause was found and fixed, and the next deploy's result is the
single most important unknown.*

> **How to use this document.** Read it top to bottom once. Then read the files
> in section 7 in the order given. Do not start work until you can answer the
> checklist in section 13. A ready-to-paste re-hydration prompt is section 14.

---

## 1. TL;DR

Margin Atlas (marginatlas.com) publishes what a small business actually earns in
a given city and trade. The founder runs it solo; Claude builds. This session ran
an autonomous "Loop 3" of site-level fixes, then the founder **redirected it
hard**: stop hunting defects, start building missing *mechanisms* and *sections*.
Three mechanisms were then specified through a 20-question interview and built:
**neighbourhood wealth as bands, district population (POPs), and business
subtypes.** Five new quality gates enforce them; the chain is now **53/53 green**.

**The one thing to know:** for two days every deployment failed in ~8 seconds,
and it was because two gate scripts read `../design/mockups/*` , files that live
in the **parent repo** and have never existed on a build server. That is fixed
(`b25f3c97`). **Whether the next deploy is green is unverified and is the top
priority.** Nothing else matters until the pipeline works, because production
has not moved since **June 15**.

**Recommended next action:** get a Vercel deployment result. If green, the
founder flips `NEXT_PUBLIC_SPINE_REFORM_CELL=1` (only he can) and three days of
work goes live. If red, get the first red log line , do **not** guess at it.

---

## 2. Mission & success criteria

**Enduring goal.** A rich world atlas of what businesses actually earn, that a
person deciding where to open something can trust. Every figure carries its
arithmetic and a provenance tier. Honesty outranks everything.

**Current tactic (the founder's own words, 2026-07-31).** Stop polishing. Build
the missing sections and mechanisms, plain, everywhere:

> "We have to wrap up the site, and then we can go full graphical on every single
> thing, because it'll take so much time."

> "We should go for simplicity that actually matters. Remember the phrase, that
> matters."

**"Done" for this phase (decision 18):** *every section exists everywhere, even
if plain.* No holes. Beauty comes after.

**Hard constraints that bound any solution:** section 9.

---

## 3. Current state , ground truth

| Component | Status | Notes |
|---|---|---|
| **Production site** | **FROZEN since June 15** (`8c3acad`) | Live and serving. None of this session's work is on it. |
| Branch `reform-v2/r6-forward` | Pushed, clean, in sync | 22+ commits ahead of what production runs |
| **Vercel deploys** | **Nine consecutive failures, cause fixed, result UNVERIFIED** | See section 11. The fix is `b25f3c97`. |
| Quality gate chain | **53/53 green**, ~30-60s | `npm run prebuild` |
| Typecheck | Clean | `npx tsc --noEmit` |
| v2 trade page (cell) | Built, **flag OFF** | Founder decided to turn it on; only he can |
| v2 city page | Built, 18 chapters, **5 real / 13 stated gaps** | `/dev/city2`, no flag |
| N1 district wealth | Contract + fixture + gate 50 | Renders |
| N2 district population (POPs) | Contract + fixture + gates 49, 51 | Renders; city-level POPs also renders (ch05) |
| N3 subtypes | Contract + gate 52 | **Not rendered** , placement is a founder call |
| District geometry | Contract + fixture + gate 53 | Map-ready; map itself not built |
| Trust pages (privacy/terms/cookies) | Built, not deployed | Missing only a contact address |
| Map (`SpineMap.tsx`) | Exists, MapLibre, no API key, tiles verified live | **Render never verified** , this machine cannot do WebGL |

**Believed but NOT proven:**
- That the deploy fix works. Untested against Vercel.
- That the v2 city page *looks* right. Verified by text/model output only; no browser render has succeeded in days.
- That the chrome refactor (32 routes moved into `(site)`) survives a production build. It compiles locally (4.3 min) but local static generation dies on a Windows-specific worker crash.

---

## 4. How we got here , the decision trail

**Loop 3 (iterations I-1 to I-8)** ran autonomously on site-level work: trust
pages, the city page type, six dead footer anchors, a site-wide soft 404, a
mobile layout bug, and the public CSV export's honesty. Several were real live
production defects. Each is in `design/loop3/LEDGER3.md`.

**Then the founder redirected, and it was the most important moment of the
session.** Claude had filed "London reports 990 restaurants vs New York's 27,381"
as a defect. His answer:

> "It's first and foremost something that is very hard to verify, and then it
> serves absolutely no point. The person is interested which neighbourhood is
> richer, which has the highest purchasing power. You cannot mention details that
> are absolutely irrelevant and very macro."

**The lesson, and it is the governing one: verifiability is not relevance.** That
item was filed *because it was checkable*, not because anyone would act on it. A
whole class of work died with it. Loop 3's eight iterations had fixed real
things, and **not one was a section a reader would notice.**

**He then named what was missing:** neighbourhood wealth, POPs, business
subtypes, repeat frequency, and the map. A **20-question interview**
(`design/loop3/mechanisms/DECISIONS-2026-07-31.md`) ratified all of it.

**The decision that most shapes the code:** commissioned research found a
district income *index* is not defensible , roughly **84% of household income
variance sits WITHIN a small area**, and interpolated district income is wrong by
>10% in ~44% of cases where boundaries don't nest. So wealth ships as **five
bands, never a number.** The direction is real; the decimal is not. This is
closed and gated.

**Two founder overrides worth knowing:** five population types per district, not
three ("the absence is half the point"); and a subtype cap that varies by trade
rather than a flat ten. He also **added a fifth subtype fact nobody had listed**:
the cost to fit out and stock the place.

---

## 5. Hard-won truths & mental model

- **A page is ALWAYS COMPLETE.** Its shape never varies by place. A missing
  figure renders a *stated gap*, never a hole. This is why the city page has 18
  chapters with 13 gaps rather than 5 chapters.
- **Terracotta marks the answer, once per chapter, DERIVED , never hand-set.**
- **Provenance tiers:** `measured` / `built` / `thin` (cells) and
  `measured` / `regional` / `estimated` / `modeled` (the public vocabulary).
  Every figure carries `unit`, `tier`, `basis`, `freshness`.
- **The cell file is the authority.** Where a reconciled cell file exists, the
  city page must read from it, never author its own number. They had already
  drifted ($197K vs $231,134) and that is now fixed by construction.
- **Reading the OUTPUT as prose beats reading the code.** Three real defects were
  found this way that TypeScript and all 53 gates missed: raw-share scoring
  returning "gyms" for five districts of six; `"Cafes"` and `"cafes"` counted as
  two trades; and trade labels truncated to `"phone"` and `"repair"`.
- **Prove the instrument before concluding from a test.** An empty map on a
  machine whose GPU process crashes proves nothing about the map.
- **The mockups and the React kit are TWO artifacts.** Changing one is not
  changing the other. This has bitten twice.
- **`E:\atlas` (parent) and `E:\atlas\website` are DIFFERENT git repos.** The
  parent has **no remote at all**. Anything the website build needs must live in
  the website repo. This is what broke deployments for two days.

---

## 6. Dead ends , do NOT retry

| Ruled out | Why |
|---|---|
| **An index number for district wealth** (e.g. "Shoreditch 118") | Foreclosed by name, 2026-07-31 decision 1, on research. Gate 50 fails the build if one is smuggled in under any field name. Do not re-propose it "small, beside the band". |
| **Counting a city's businesses / any macro aggregate** | Founder killed it and the class with it: hard to verify, and nobody acts on it. |
| **Google Maps as the map engine** | Needs an API key, a billing account, and charges per map load , a cost that grows exactly as the site succeeds. MapLibre + free Carto tiles already works with no key. |
| **Renumbering the trade page's chapter anchors** | 21 hardcoded `ch-NN` ids *and* the ratified mockups use the same scheme. Desynchronising them is a paid-for landmine. |
| **`--max-old-space-size=6144` for `next build`** | This machine has 7.9GB with often <2GB free. The flag makes V8 claim memory the OS lacks and the build dies around page 330. It is a **dev-server-only** setting, and even there the server dies. |
| A provenance caveat under the hero figure | Founder: "no need for an idiotic disclaimer". |
| A narrative subtitle characterising a place | Reads as slop across 200 countries. |
| A dollar figure as a country hero headline | "Most of the world doesn't use dollars." |
| A paywall or Pro-gated section | Everything free; monetisation decided after launch (reaffirmed, decision 19). |
| An adversarial taste panel grading sections | Asymptotes, never converges. Ruled out twice. |

---

## 7. Critical files & artifacts (the map + reading order)

| # | Path | Role | Priority |
|---|---|---|---|
| 1 | `E:\atlas\design\loop3\mechanisms\DECISIONS-2026-07-31.md` | **The 20 ratified decisions + the research behind band-not-index.** Binds all current work. | **Read first** |
| 2 | `E:\atlas\design\loop3\mechanisms\MISSING-MECHANISMS.md` | What is missing and why, in the founder's framing. Includes the relevance rule that killed a work class. | **Critical** |
| 3 | `E:\atlas\design\loop3\LEDGER3.md` | Iteration-by-iteration record, **including failures**. Read the last 3 entries. | High |
| 4 | `E:\atlas\design\loop3\BACKLOG3.md` | Scored queue. N1-N5 at the bottom outrank everything above them. | High |
| 5 | `E:\atlas\website\src\lib\cities\city_spine2_types.ts` | The city contract. Long comments carry the *reasons*. | High |
| 6 | `E:\atlas\website\src\lib\cities\city_adapter.ts` | Derivations: `favouredTrades`, `buildDistricts`, `buildPeople`, `buildTradeEconomics`. | High |
| 7 | `E:\atlas\website\src\components\city2\page\CityPage.tsx` | 18 chapters, 5 real / 13 gaps. Each gap is one ternary. | High |
| 8 | `E:\atlas\website\scripts\prebuild_all.ts` | All 53 gates, each with a comment saying what it caught. | Medium |
| 9 | `E:\atlas\design\loop3\walks\2026-07-30-phone.md` | The phone walk. Y=661 finding. | Medium |
| 10 | `E:\atlas\design\loop3\api\DECISION.md` | Why there is no public API, and the export honesty fix. | Medium |
| 11 | `E:\atlas\design\loop3\DECISIONS-FOR-THE-FOUNDER.md` | Seven older open decisions, several still open. | Medium |
| 12 | `E:\atlas\website\CLAUDE.md` | App rules, stack, gates. | Reference |
| 13 | `E:\atlas\design\loop3\DOCTRINE3.md` | The loop's operating doctrine, if resuming the autonomous loop. | If looping |

---

## 8. Open threads & next steps

### COMMITTED , do these, in this order

**1. Get a deployment result. Blocks everything.**
- *What:* Find whether the deploy after `b25f3c97` went green.
- *Why:* Production has not moved since June 15. Nothing built in three days is live.
- *Where:* Vercel dashboard, project `marginatlas-web-twtl`, branch `reform-v2/r6-forward`.
- *Verify:* Green = a build lasting **minutes**, not 30 seconds. **The preview URL is behind Vercel deployment protection, so an agent cannot check it** , a 200 there is a login page, not the site. The founder must look.
- *If red:* get the **first red line** of the build log. Do not hypothesise. Three hypotheses were burned that way (memory, import casing, undeclared `tsx`); only the actual log line solved it.

**2. Founder flips `NEXT_PUBLIC_SPINE_REFORM_CELL=1` in Vercel** (decision 14).
- Only he can. Flipping flags has always sat outside the agent's authority.
- Do this **after** deploys are green, not before.

**3. Two one-word founder decisions that unblock work:**
- **Tourists in the population vocabulary?** The capped nine have no "tourists", so Covent Garden's defining trait cannot be expressed. His June spec listed it. Adding a tenth type is a founder decision *by a rule the agent wrote into gate 49*, so it must not be self-approved.
- **Where does the subtypes section render on the trade page?** He ruled "average first, subtypes below", but inserting a chapter at position 2 renumbers every anchor and the ratified mockups share the scheme.
- **A contact address.** Outstanding for days; the last hole in the trust pages.

### NEXT BUILD WORK (unblocked, agent-owned)

**4. Port more city chapters.** 13 remain as stated gaps; each is one ternary
plus an adapter builder. The fixture already holds the data. Highest value:
`spaceCosts`, `incomeAndWealth`, `districtRent`, `visitors`.
*Verify:* run the adapter and **read the output as prose** , see section 5.

**5. Map v1** (decision 17): districts coloured by one measure, tap for detail.
All data now exists (wealth bands, mix, centre points). `SpineMap.tsx` already
does points with no API key. **Caveat: its render has never been verified, and
this machine cannot do WebGL.**

**6. X3, the phone furniture** (scored 27): the answer begins at **Y=661** on a
375px screen. Decision 13 ruled "answer first, controls below". Note this targets
the *legacy* trade page, which the v2 flag may soon replace.

### OPTIONAL / SOMEDAY
- Enrich the archetype-to-trade vocabulary (each type declares ~3 trades, heavily
  overlapping, which is why four inner-London districts get identical answers).
- The remaining items in `DECISIONS-FOR-THE-FOUNDER.md`.
- `E:\atlas` has **no git remote**; every design doc, ledger and mockup exists on
  one disk with no backup. Founder's call.

---

## 9. Constraints, guardrails & operator preferences

**NEVER:**
- Fabricate a figure, or publish one whose arithmetic cannot be shown.
- Introduce a second accent colour (terracotta + neutral only).
- Use an em-dash, `&mdash;`, "turnover", "covers", "pp", "percentage points",
  "net margin", or **any statistics-agency name** in user-facing copy.
- Rename a URL slug.
- **Flip a feature flag.** Always the founder's, even after he decides it.
- Revert to an earlier design generation, or re-propose anything in section 6.
- Run `sed` on markup. Judge a visual from markup.
- Put placeholder data in `data/`. It lives in `fixtures/`.

**THE ONE RULE THAT COST A WEEK: the founder designs; the loop ports, builds and
proposes.** A new page type's *visual design* is a review artifact , draw it,
crop it, put it in `design/loop3/reviews/` with a verdict line. Mechanics,
states, policies, SEO plumbing, schema, gates, and ports of already-ratified
designs are the agent's. **When unclear which side you are on, it is a review
artifact.**

**Operator preferences:**
- **Answer first, then detail, then stop.** He is tired of long replies.
- Honesty over polish. State what is unverified. He responds well to "I was
  wrong" and badly to confident guessing.
- He works by voice; transcripts are loose. Read for intent.
- He wants to *see* things. Standalone files he can open beat descriptions.
- Never open a browser or dev server to "show" him , too slow, he dislikes it.

---

## 10. Environment & reproduction

```
Project root   E:\atlas\website          (its own git repo, remote: benetbani/marginatlas-web)
Parent repo    E:\atlas                  (DIFFERENT repo, NO REMOTE, holds design/ + mockups)
Branch         reform-v2/r6-forward
Stack          Next.js 15.5, React 19.2, TypeScript 5, Tailwind 3.4, Supabase, Vercel
Machine        Windows 11, 7.9GB RAM, often <2GB free. 4 cores.
Vercel build   4 cores / 8GB , the same as the dev machine
```

**Commands (always `cd /e/atlas/website` first , CWD drift has broken five runs):**
```bash
npx tsc --noEmit          # typecheck
npm run prebuild          # 53 gates, ~30-60s
node scripts/loop_gate.mjs # mockup gate
```

Secrets live in `.env.local` (not committed). Vercel holds its own copy.

---

## 11. Landmines & gotchas

**THE BUILD KILLER (fixed, `b25f3c97`).** `scripts/sync_glyphs.mjs` and
`scripts/scope_atlas_css.mjs` read `../design/mockups/*` , the **parent repo**.
Vercel clones only the website repo to `/vercel/path0`, so the path resolved to
`/vercel/design/mockups/glyphs.js` and threw ENOENT. Nine deployments died in ~8
seconds each, identically, on commits with unrelated contents , **including one
whose only change was deleting an unused file.** It passed locally every time
because the parent directory is right there. Both now skip with a loud message
saying **"This is not a pass."**

**Other traps, all paid for:**
- **This machine cannot render WebGL.** Chrome's GPU process crashes
  (`exit_code=34`). An empty map here proves nothing.
- **The dev server dies repeatedly**, at 6144 and at 2048 MB, with <2GB free.
  Treat a live server as scarce: warm once, batch every curl into one command.
- **Vercel preview URLs are behind deployment protection.** A 200 is a login
  page. An agent cannot verify a deploy.
- **`isNullFigure` exists in both the city and cell type modules and they are
  different unions.** Guarding a cell figure with the city one *compiles* and
  silently fails to narrow, which is how a null reaches a formatter.
- **Gates read code comments.** A dead href literal inside a `//` comment fails
  the dead-link gate. (It caught one.)
- **`git checkout -- <file>` reverts uncommitted fixture work.** Bit twice during
  negative-testing; re-add after restoring.
- **A subagent's confident finding is a hypothesis.** Roughly 40% of one walk's
  sharpest claims did not survive checking. Background subagents do **not**
  survive a session break.
- **`.av2{overflow-x:hidden}`** was scoped mechanically from `body` and kills
  `position:sticky` on a div. It will recur when the country page ports.
- **The site answers 200 for every wrong URL** (soft 404). Cause proven: the
  `loading.tsx` Suspense boundary flushes the shell before `notFound()` runs.
  `notFound()` in `generateMetadata` does **not** fix it. Unfixed , it is a
  three-way trade recorded as S7.

---

## 12. Glossary

| Term | Meaning |
|---|---|
| **cell** | One (country, city, trade) triple, e.g. restaurants-in-london. The atom of the site. |
| **spine / spine-2** | The ratified chapter sequence for a page type. v2 = the current generation. |
| **POPs** | Population profiles. 8-10 capped archetypes with a spending read, shown as a composition mix per place. Ratified 2026-06-22. |
| **N1 / N2 / N3** | The three mechanisms: district wealth, district population, business subtypes. |
| **stated gap** | A chapter that renders and says what it lacks, rather than disappearing. |
| **tier** | Provenance level of a figure. See section 5. |
| **the lattice** | The combinatorial grid of country x city x trade pages. |
| **fixture** | Placeholder data in `fixtures/`, tagged `__fixture: true`. Never in `data/`. |
| **the loop** | The autonomous iteration engine, `design/loop3/DOCTRINE3.md`. |
| **review artifact** | A design proposal awaiting the founder's verdict. Never wired in as approved. |

---

## 13. Successor verification checklist

You are oriented when you can answer these:

1. **Why does district wealth ship as five bands and never as a number?** (Name at least one research finding.)
2. **What broke nine consecutive Vercel deployments, and why did it always pass locally?**
3. **What is the difference between `E:\atlas` and `E:\atlas\website`, and why does it matter to the build?**
4. **What did the founder mean by "verifiability is not relevance", and what class of work did it kill?**
5. **Which single action is the agent forbidden from taking, even though the founder has already decided to do it?**
6. **Why does the city page have 18 chapters when only 5 have content?**
7. **Name the three defects found by reading output as prose that TypeScript and 53 gates all missed.**
8. **What must you do before concluding anything from a failed test on this machine?**

---

## 14. Re-hydration prompt

```
You are resuming an in-progress effort. Another session prepared a complete handoff
so you can continue with zero context loss. Do NOT start work yet.

Project: Margin Atlas (marginatlas.com)
Working directory: E:\atlas\website
Handoff dossier (read this FIRST, in full): E:\atlas\website\docs\handoff\HANDOFF-marginatlas-2026-08-01.md

Follow these steps exactly:
1. Read the dossier at the path above, top to bottom.
2. Then read these files, in this order (the dossier explains why each matters):
   - E:\atlas\design\loop3\mechanisms\DECISIONS-2026-07-31.md
   - E:\atlas\design\loop3\mechanisms\MISSING-MECHANISMS.md
   - E:\atlas\design\loop3\LEDGER3.md  (last three entries only)
   - E:\atlas\design\loop3\BACKLOG3.md
   - E:\atlas\website\src\lib\cities\city_spine2_types.ts
   - E:\atlas\website\src\lib\cities\city_adapter.ts
   - E:\atlas\website\src\components\city2\page\CityPage.tsx
   - E:\atlas\website\CLAUDE.md
3. Do not edit anything, run anything destructive, or make decisions until steps 1-2 are done.
4. Then prove you are oriented: answer the "Successor verification checklist" at the
   end of the dossier in 5-10 lines , the mission, the current state, the committed
   next step, and the top thing you must NOT do. Keep it tight; this is a checkpoint,
   not an essay.
5. Flag any contradiction or gap you find between the dossier and the actual files ,
   the dossier is a point-in-time snapshot and the code/data is ground truth.
6. Then stop and wait for my go, unless the dossier's "Open threads" marks a committed
   next step I've pre-authorized , in which case state what you're about to do and begin.

Honor the operator preferences and guardrails in the dossier as if they were given to
you directly. If anything in the dossier is unclear, ask before acting , but only after
you've read everything above.
```
