# HANDOFF , Margin Atlas

*An overnight build run plus three decision interviews. 29 commits, 63 gates green, 36 decisions ratified, and a fourteen-step sequence waiting on one Vercel check. 2026-08-07.*

> **How to use this document.** Read top to bottom once. Then read the files in
> section 7 in the order given. Do not start work until you can answer the
> checklist in section 13. A ready-to-paste re-hydration prompt is section 14.

---

## 1. TL;DR

Margin Atlas is a global small-business benchmarks site: **what a business earns, and what its owner actually keeps, trade by trade and place by place.** It has been in a long design reformation and **the ratified design system currently ships on zero live routes** , every v2 page sits behind `/dev`.

This session ran an unattended 50-task plan (roughly 22 landed) and then three interviews that resolved 36 open decisions. The build work found four live defects, one of them severe: **29 of 49 shipping routes were emitting `canonical: "https://www.marginatlas.com"`**, telling Google every page was the home page. That is fixed and gated. A second, separate defect is still open: **`/sitemap.xml` serves an HTML error page in production and Google has discovered 0 pages.**

The single most important thing to know: **the plan is fully decided and blocked on one 10-second check.** Every deployment visible in Vercel was on branch `reform-v2/r6-forward` with a "Preview" button, and `main`'s HEAD is 11 June. If those are all previews, production has been serving June code for two months and that alone explains the sitemap.

**Recommended next action:** open Vercel, determine whether any deployment is *Production*, and report which branch it came from. Everything else in the sequence follows from that answer.

---

## 2. Mission & success criteria

**The enduring goal.** A rich world atlas of small-business economics. Every page answers a variant of *how much does an X make in Y*, and the number that matters is not revenue but **what the owner keeps**. The moat is honesty: every figure states which route it came down, and a page states its own gaps rather than hiding them.

**The current tactic** (different from the goal, and this distinction matters): get the ratified v2 design system onto live URLs. It has never been live anywhere.

**"Launched", ratified 2026-08-07 by the operator:**

> The **five locked page types** render v2 on live URLs.

Those five are **cell, city, country, industry-detail, neighbourhood**. Home and world are indexes, not page types. Measurable by `node scripts/audit_generation_seam.mjs`, which today answers **zero**.

**Hard constraints bounding any solution:**

- Never fabricate a figure. A missing figure states its absence; it is never a dash, a zero, or a vanished section. **A page is always complete; its shape never varies by place.**
- No em dashes anywhere a reader sees, including data files. No `--` either.
- No source-agency names in user-facing copy.
- No first person. No "we", "us", "our", "I". Not in FAQ answers either.
- Banned vocabulary: "turnover", "covers", "pp", "percentage points", "net margin".
- Never rename a URL slug. SEO equity rides on existing URLs.
- **The founder designs; the loop ports and proposes.** A week of AI-invented design was rejected outright in June. New visual ideas are review artifacts, never commits to a live page.

---

## 3. Current state , ground truth

| Component | Status | Notes |
|---|---|---|
| **Gates** | **63, all green** | Was 58 at session start. Five added. `npm run prebuild` |
| **Typecheck** | clean | `NODE_OPTIONS=--max-old-space-size=4096 npx tsc --noEmit` |
| **Both repos** | **committed, clean** | website `59e8de4b` on `reform-v2/r6-forward`; parent `f4105a3` on `p4-seam` |
| **v2 on live routes** | **ZERO** | 48 of 49 shipping routes are not v2. 17 internal routes carry it |
| **Canonical defect** | **fixed, gated, NOT deployed** | 29 routes repaired, proven on rendered output for 3 |
| **`/sitemap.xml`** | **BROKEN in production** | Serves HTML titled "Country not found", 200 status. Google discovered **0 pages**. Cause UNPINNED |
| **Production deploy status** | **UNKNOWN, and it gates everything** | All visible Vercel deploys were on the branch with a "Preview" button. `main` HEAD is 11 June |
| **`next build`** | **compiles successfully (61s)** | Then dies generating 676 static pages with `0xC0000142`. That is the local box, not the code. Vercel built this branch green 4 times on Aug 3 |
| **Reconciled data** | **one cell** | `data/cells/restaurants-in-london.json`. Everything else is a shell |
| **Search Console** | property verified, sitemap submitted | Reports **0 discovered pages** because of the sitemap defect |
| **The five page types** | 2 of 5 | See below |

**The launch metric, measured 2026-08-07:**

| page type | v2 component | `.av2` root | status |
|---|---|---|---|
| city | `city2/page/CityPage.tsx` | yes | **done**, dev route only |
| country | `country2/page/CountryPage.tsx` | yes | **done**, dev route only |
| **cell** | `spine2/page/CellPage.tsx` | **NO** | built from the v2 kit, never given the v2 scope. **Smaller job than it sounds** |
| **industry detail** | none | , | **does not exist** |
| **neighbourhood** | none | , | **does not exist** |

**Believed but NOT proven:** that production is running June code. It is the best explanation for the sitemap defect and it is unverified. **Do not act on it as fact.**

---

## 4. How we got here , the decision trail

**The overnight run.** The operator wrote: *"I'm going to sleep right now, and I need the computer to work for four hours."* A 50-task plan was written and executed via subagent-driven development. Roughly 22 tasks landed. The run was **deliberately reweighted toward audits** because they kept finding live defects, and a found defect outranks a planned page.

**Four live defects were found, in order of severity:**

1. **The canonical inheritance defect.** `src/app/layout.tsx:49` sets `alternates.canonical: "/"`. Next merges metadata down the tree **per top-level key**, so any route not declaring its own `alternates` inherits it whole. 29 of 49 shipping routes did not declare it. Proven on rendered HTML: `/cities/london` served the title *"London small business benchmarks"* beside a canonical of `https://www.marginatlas.com`. Every dynamic long-tail route was affected. **The cell page escaped** because it declared its own.

2. **Three spine pages that never existed.** `/dev/cell2`, `/dev/hood2`, `/dev/industry2` have no route file. All three answered HTTP 200 with 594 characters of legacy chrome, because Next renders the layout for an unmatched path. **"All five spine pages exist" was false.**

3. **`audit_row_layout.mjs` had four false-pass paths** and had been reporting those three phantom routes as clean for days , output that had been quoted as evidence more than once. One path meant that *every route failing still exited 0 with `GATE: PASS`*.

4. **Two dialogs promised focus containment they never had.** `PaywallModalRoot` and `NewsletterSignupVariants` both declared `aria-modal="true"` while neither contains focus. `PaywallModalRoot`'s own header has admitted it since it was written: *"(No modal-trap.)"*. On the paywall.

**Then three interviews, 36 decisions.** The highest-value moment was a correction to the assistant's framing. Asked who would research UK data, the operator said:

> *"just slap fake numbers and extrapolate man, we are putting the design live, the page has 0 visitors, nobody is looking at it, only me"*

That was a **velocity** answer to what had been posed as a **research** question, and the goal was right: do not let empty data hold the design hostage. The method was the problem, for a reason that was new that night , **the canonical fix makes every page newly indexable**, so the accident protecting the fabrication had just been repaired. Resolved better than either starting position: **fabricated figures live in `fixtures/`, render on dev routes only, carry `SampleTag`, and a gate makes it permanent.** The promotion plan turned out to already respect this, because `/world` and `/industries` need no fabricated figures at all.

**Why `/world` and `/industries` go first:** both are complete, both run on real coverage data, and together they make the lattice navigable from either axis. Low stakes, real gain, and they prove the system in production before the money pages.

---

## 5. Hard-won truths & mental model

**On the design system:**

- **`.row` outside `.statblock` is completely unstyled.** Every rule is scoped `.statblock .row`; there is no bare `.row` rule. A run of rows belongs in `<div className="panel pad rise"><div className="statblock">`, **both classes on ONE element**, because `.panel.pad > .statblock` is the rule that strips the inner border. Nested `panel > pad` does not match. 125 of the city page's 129 rows were unstyled by this.
- **The `.v` value slot is a 78px figure column.** The figure goes there; the qualifier goes in `.nm > .s`. Longer strings clip silently, mid-word. 51 values were clipping.
- **Resolve links, never assemble them.** `countryPageTarget()`, `industryToSlug()`, `geoPageTarget()`. Greece is stored as `GR`, so every hand-built `/el` link was dead.
- **No eyebrow above a heading.** A crumb naming the subject ("Restaurants, London") is a breadcrumb and is fine. A crumb labelling the section below it is an eyebrow and is banned outright.
- **Terracotta marks the answer once per section.** Fifty accents is no focal point.
- **Icons are drawn, never unicode.** Radius tokens only: `--r-lg` 10, `--r-md` 8, `--r-sm` 6, `--r-xs` 4.

**On verification, and this is the most transferable lesson:**

> **Reading the rendered page as prose found nine defects that TypeScript and 63 gates could not see. Gates found none of them.**

Strip the tags, print the text, read it as a human. Fused words (`"Londonmeasured16,765"`) mean a layout defect. Internal notes or agency names mean unpublishable data reached a page.

**On gates:**

- **A rule taken from a summary rather than from the code will fail the code.** This happened twice in one night. `DESIGN.md` claimed the icon scale was two sizes; it is five, and a gate asserting two would have failed six correct uses. It described an elevation family that does not exist; all six of those shadows are slider thumbs and map pins.
- **A gate that cries wolf gets switched off.** The obvious stated-totals check produced 16 hits of which 15 were false, because every audit report states a *population* beside a *sample*.
- **A gate that is not in the runner is a file, not a gate.** `verify_stated_totals` sat in `scripts/` passing nothing for hours. Caught by arithmetic on the gate count.
- **A green result for a page that does not exist is worse than a red one**, because nobody looks again.

**On the machine:** it is severely memory-constrained. The dev server died six-plus times. `VirtualAlloc failed`, cygheap errors, `fork: Resource temporarily unavailable`, and eventually `tsx` could not start. **Work browser-free by default.**

---

## 6. Dead ends , do NOT retry

| Ruled out | Why |
|---|---|
| **CodeFronts components** | 182 items catalogued: **1 take, 25 study, 156 refused.** Their visual components would import someone else's identity into a site whose visual world is the founder's own ported mockup. That mistake was already made once and rejected. The generators are worse: box-shadow, radius, line-height and spacing are all *measured, proposed and deliberately unapplied* pending the founder |
| **Adding a bare `.row` CSS rule** | The stylesheet is the founder's design. The call sites are the loop's, so the call sites move |
| **Collapsing "all box-shadows"** | 34 of them are 1px rings drawn with `box-shadow` because that costs no layout box. They are borders, not elevation. Collapsing them destroys 34 working borders |
| **A two-size icon gate** | The scale is five. See section 5 |
| **Recomputing `city_list_v1.json` totals** | Deleted instead. A recomputed total goes stale the next time a city is added; `array.length` cannot |
| **Fabricated figures on live URLs** | Resolved to fixtures on dev only. See section 4 |
| **`npm run build` on this machine as a gate** | Compiles fine, then OOMs on 676 static pages. Vercel builds it green. Do not treat the local failure as a code signal |
| **Playwright alongside the dev server** | Two Chromiums plus Next dev exceeds this box. Use `curl` + prose reading |
| **Emoji flags** | Windows renders regional indicators as letter boxes. `CountryFlag` (flagcdn SVGs) already existed and is used |

**One correction to record:** the assistant claimed flags were blocked because no asset set existed. That was wrong , `src/components/CountryFlag.tsx` had been in the repo all along. The search that "proved" its absence was `find ... | head -6` and the component was below the cut. **A truncated search is not a search.**

---

## 7. Critical files & artifacts (reading order)

| # | Path | Role | Priority |
|---|---|---|---|
| 1 | `E:\atlas\design\loop4\WHAT-I-NEED-FROM-YOU.md` | **The six things only the operator can do, in order.** Start here | **critical** |
| 2 | `E:\atlas\design\loop4\DECISIONS-2026-08-04.md` | **All 36 ratified decisions + the fourteen-step sequence.** Supersedes earlier open questions | **critical** |
| 3 | `E:\atlas\website\PRODUCT.md` | Authority on users, voice, anti-references, strategic principles | **critical** |
| 4 | `E:\atlas\website\DESIGN.md` | Authority on the design system. **Read §0.1 first**: v2 ships on nothing | **critical** |
| 5 | `E:\atlas\design\loop4\MORNING-2026-08-04.md` | What the overnight run found and what it did not finish | high |
| 6 | `E:\atlas\website\BRAND.md` | The name, the one sentence, the voice moves, the first-person violations | high |
| 7 | `E:\atlas\design\loop4\NIGHT-JOURNAL.md` | Per-task record with honest partial/blocked outcomes | high |
| 8 | `E:\atlas\design\loop4\LEXICON.md` | 361 repeated phrases, 169 signature / 192 tics | medium |
| 9 | `E:\atlas\website\docs\superpowers\plans\2026-08-04-overnight-50.md` | The 50-task plan. Its preamble carries every design rule learned | medium |
| 10 | `E:\atlas\design\loop4\research\2026-08-04-codefronts.md` | The refusal, with reasons | medium |
| 11 | `E:\atlas\design\loop4\research\2026-08-04-social.md` | Channel recommendations, and the RSS finding | medium |
| 12 | `E:\atlas\design\loop4\research\2026-08-03-homepage-warming.md` | Why the home page opens the way it does | medium |
| 13 | `E:\atlas\design\loop4\BASELINE.md` | Session-start measurements to compare against | low |

**Key source files:**

| Path | Role |
|---|---|
| `src/app/layout.tsx:49` | Sets `alternates.canonical: "/"`. The root of the canonical defect |
| `src/app/sitemap.ts` | **The open defect.** Serves HTML in production |
| `scripts/audit_generation_seam.mjs` | **The launch metric.** Answers zero today |
| `scripts/audit_row_layout.mjs` | Finds unstyled rows and clipped values. Needs a dev server |
| `scripts/audit_lexicon.mjs` | Repeated-phrase counter, parses TSX rather than grepping |
| `scripts/verify_canonical_urls.ts` | Holds the canonical fix |
| `scripts/verify_v2_scales.ts` | Icon and radius scales, current v2 surface only |
| `E:\atlas\design\mockups\atlas.css` | **The founder's design.** Generated into `src/styles/atlas-spine.css` by `scripts/scope_atlas_css.mjs`. Never edit the generated file |
| `src/components/spine2/SiteFooter.tsx` | Shared footer, 22 verified links, zero social icons by design |
| `src/app/dev/page.tsx` | Index of 46 workbench routes. **Render never verified** |

---

## 8. Open threads & next steps

### Committed, pre-authorized, in order

**1. Determine production deploy state.** *Operator action.* Open Vercel, find whether any deployment says **Production** and which branch it came from. Every visible deploy was on `reform-v2/r6-forward` with a "Preview" button, and `main` HEAD is 11 June. **Verify:** a definite answer of "production is branch X, last deployed on date Y."

**2. Fix `/sitemap.xml`.** Live, broken, and Google has discovered 0 pages because of it. `robots.txt` works correctly (`text/plain`), so it is specific to the sitemap. **Cause is unpinned**; local diagnosis was blocked by memory. If step 1 shows production is June code, that is very likely the whole explanation. **Verify:** `curl -s https://www.marginatlas.com/sitemap.xml | head -c 100` returns XML, not `<!DOCTYPE html>`.

**3. Deploy the canonical fix, alone.** Not bundled. **Verify:** for six routes including `/cities/london`, `/pricing`, `/world`, the rendered `<link rel="canonical">` is the route's own URL. **Watch for a dead server:** if `curl` returns 0 bytes, a grep over the empty file prints nothing and looks like a pass. Check the byte count.

**4. Promote `/world` and `/industries`.** Replace `src/app/(site)/world/page.tsx` and `src/app/(site)/industries/page.tsx` outright with the v2 versions at `src/app/dev/world2` and `src/app/dev/industries2`. **No flag** , the live versions are the oldest generation and nobody is defending them. Keep the URLs. **Verify:** `audit_generation_seam.mjs` reports shipping v2 routes greater than zero for the first time in the project's history.

**5. Merge `reform-v2/r6-forward` to main**, using step 3's deploy as proof it is safe. Then short branches off main.

**6. The two live home page edits.** Delete the superlative *"The #1 atlas of local profit intelligence"*, and replace the rotating headline with a fixed real example. Both are named anti-references in `PRODUCT.md`; the rotator is the one that actively fails, because two words change on a 2-second interval so anyone who glances sees a pairing nobody chose.

**7. Home page third, pricing fourth and separately.**

**8. Cell page to v2.** Give `CellPage.tsx` the `.av2` root and the v2 shell. **Port the 21 chapters unchanged** , rebuilding the look and the content model at once is two risky changes and only one is overdue.

**9. Industry detail and neighbourhood pages.** The two that do not exist. **Launched is this step.**

**10. Fill GB, 19 of 21 chapters, and time it.** `neighbours` and `abroad` cannot fill for any single country and already state why. **No data budget** , research from published sources and tier every figure.

### Queued for the operator's single approval reply

Never started. The operator asked for these to be built into one approval batch:

- Search Console verification file, if the DNS path is not used
- The two live home page edits (staged, uncommitted)
- The fixture gate extending `verify_no_fixture_in_routes`
- The RSS route (`app/feed.xml/route.ts`)
- Deleting 34 of 39 old dev routes, keeping `spine-kit`, `charts`, `brand-glyphs`, `kit`, `cell-v2`
- The keep-metric convergence onto **"what the owner keeps"** across 113 uses

### Optional / someday

- `<dialog>` migration for both modals (decided yes, changes box and centring, needs visual review)
- Radius and line-height retrofit (decided apply). **Type scale: decided HOLD** , three sizes shift perceptibly in a ratified design
- The "where to open X" recommender, **after** the cell page. Needs breadth of data
- Stripe, **after** the recommender exists
- Social accounts (operator's to create; footer renders zero icons until they do)

### Not verified, and should be

- **`/dev/page.tsx` has never been rendered.** Typecheck and 63 gates pass; the page has not been seen. First thing to open.
- Several screenshots were never taken. Journal says `shot none (server)` honestly rather than claiming paths.

---

## 9. Constraints, guardrails & operator preferences

**Never, without an explicit instruction:**

- Run `npm run build`, deploy, or flip a feature flag
- Create an account, post to social, send email, or submit to a third party
- Fabricate a figure, or put a fixture on a public URL
- Rename a URL slug
- `git checkout -- <file>` (use `git stash`)
- `git add -A` while another agent has files in flight

**Autonomy, as ratified:** long unattended stretches on dev routes, gates and docs. **Anything touching a live page, a URL, a flag or a deploy stops and goes into one approval queue.** One message, one list, one-line reason each; the operator replies once.

**Working style, from the operator's own words:**

- *"shooooort fucking responses, i dont read dumb essays, guide me wtf"* , brevity is a standing demand. Lead with the answer
- *"wtf dp you want, ask directly and guide me"* , ask directly, with a recommendation, not a survey
- Honesty over polish. He explicitly preferred *"thirty done, twelve partial, eight blocked, here is exactly why"* to a clean list he would have to verify himself
- He reads and acts on measured numbers. Every claim should carry its evidence
- **Never write a screenshot path for an image that does not exist**

**Verification order on this machine:** typecheck, then `npm run prebuild` (fall back to `prebuild:serial` on a spawn or alloc crash , **a crash is not a failure**), then **read the rendered page as prose**. Screenshots are best effort.

---

## 10. Environment & reproduction

```bash
# Two repos. The website is nested inside the parent.
E:\atlas\website      # Next.js app.  branch reform-v2/r6-forward
E:\atlas              # design/, page-data/, mockups.  branch p4-seam
```

| Command | Purpose |
|---|---|
| `NODE_OPTIONS=--max-old-space-size=4096 npx tsc --noEmit` | Typecheck. Always run |
| `npm run prebuild` | 63 gates, parallel. `prebuild:serial` if it crashes |
| `node scripts/audit_generation_seam.mjs` | **The launch metric** |
| `node scripts/audit_row_layout.mjs` | Unstyled rows, clipped values. Needs a dev server |
| `node scripts/audit_lexicon.mjs` | Repeated phrases |
| `node scripts/scope_atlas_css.mjs` | Regenerate the scoped stylesheet after editing the mockup |

**Dev server:** use the `preview_start` tool with name `atlas-dev`, port **3210**. **Never `npm run dev` in Bash.** Warm one route at a time with `curl -s -m 900`. **If a response is 0 bytes the server has died** , restart it; a grep over an empty file looks like a pass.

**Reading a page as prose** (the highest-yield check):

```bash
curl -s -m 900 http://localhost:3210/dev/PAGE -o /tmp/p.html
node -e '
const fs=require("fs");let h=fs.readFileSync(process.argv[1],"utf8");
h=h.replace(/<script[\s\S]*?<\/script>/g,"").replace(/<style[\s\S]*?<\/style>/g,"");
console.log(h.replace(/<[^>]+>/g," ").replace(/&[a-z]+;/g," ").replace(/\s+/g," ").trim().slice(0,2000));
' /tmp/p.html
```

**Secrets** live in `.env.local`, not in the repo. Never paste them.

---

## 11. Landmines & gotchas

- **Python heredocs mangle Windows paths and regex escapes.** `\a` became a bell character in a committed file; `\b` became a literal backspace in a regex, silently disabling three of four patterns. **Use `node -e` or the Edit tool for text edits, never python string literals.**
- **`grep -c` returning 0 exits 1**, which breaks `&&` chains and silently skips the commit that follows.
- **Git Bash rewrites arguments starting with `/`** into Windows paths. `/dev/industries2` became `C:/Program Files/Git/dev/industries2`.
- **CWD resets between Bash calls.** `cd` every command.
- **The em-dash gate reads the source file, not the rendered output** , a comment quoting a banned phrase fails the build. It also caught a regex containing literal dashes, correctly.
- **`middleware` returns 403 to curl.** A curl 403 is not a broken link. Verify links in a real browser.
- **`data/` fields are not automatically publishable.** `industry_margins.json` notes contained internal audit language, an em dash, a named company and a **named source agency**, and reached a rendered page before being caught. 14 of 179 notes fail a publishability filter.
- **`city_list_v1.json` was an object wrapping an array**, not an array. An `as unknown as Array<...>` cast typechecked clean and threw in the browser.
- **`geoPageTarget` tries CITY first**, which is wrong for a route serving REGIONS. Check `kind`.
- **Git background GC fails on this box** (`fatal: failed to run repack`). The commit still succeeds.

---

## 12. Glossary

| Term | Meaning |
|---|---|
| **cell** | A trade-by-place data page, e.g. `/gb/london/restaurants`. The money page |
| **the spine** | The fixed, ordered chapter list a page type must always render, whatever the data |
| **v2 / `.av2`** | The ratified design system. CSS scoped under `.av2`, generated from the founder's mockup |
| **SpineShell** | The previous generation. Its accent is `#fb8469`, a different terracotta |
| **the seam** | The visual discontinuity between design generations |
| **tier** | Provenance vocabulary: **Measured** (counted there), **Built from published inputs** (arithmetic, shown), **Thin** (shape right, level uncertain) |
| **the keep** | What an owner takes home. **Canonical phrasing: "what the owner keeps"** |
| **SampleTag** | The component that labels illustrative figures |
| **model room** | One explicit modelled scenario, distinct from population figures. Mixing them produces false sentences |
| **the loop** | An unattended multi-task agent run |

---

## 13. Successor verification checklist

You are oriented when you can answer these:

1. **What does "launched" mean, exactly, and what number measures it today?**
2. **Why is `/world` promoted before the home page**, and why do those two pages in particular avoid a problem the others have?
3. **What is the difference between `population.*` and `modelRoom.*`** in the London cell file, and what false sentence did mixing them produce?
4. **Where may fabricated figures appear, and where may they never appear?**
5. **What single unanswered question blocks the entire fourteen-step sequence**, and who answers it?
6. **Name the verification technique that found nine defects the 63 gates could not**, and one defect it found.
7. **Why must a run of `.row` elements sit inside `.panel pad rise` with both classes on one element?**
8. **What is the top thing you must never do without an explicit instruction?**

---

## 14. Re-hydration prompt

```
You are resuming an in-progress effort. Another session prepared a complete handoff
so you can continue with zero context loss. Do NOT start work yet.

Project: Margin Atlas (marginatlas.com) , global small-business benchmarks site
Working directory: E:\atlas\website  (parent repo: E:\atlas)
Handoff dossier (read this FIRST, in full): E:\atlas\website\docs\handoff\HANDOFF-marginatlas-2026-08-07.md

Follow these steps exactly:
1. Read the dossier at the path above, top to bottom.
2. Then read these files, in this order (the dossier explains why each matters):
   1. E:\atlas\design\loop4\WHAT-I-NEED-FROM-YOU.md
   2. E:\atlas\design\loop4\DECISIONS-2026-08-04.md
   3. E:\atlas\website\PRODUCT.md
   4. E:\atlas\website\DESIGN.md   (read section 0.1 first)
   5. E:\atlas\design\loop4\MORNING-2026-08-04.md
   6. E:\atlas\website\BRAND.md
   7. E:\atlas\design\loop4\NIGHT-JOURNAL.md
3. Do not edit anything, run anything destructive, or make decisions until steps 1-2 are done.
4. Then prove you are oriented: answer the "Successor verification checklist" in
   section 13 of the dossier in 5-10 lines , the mission, the current state, the
   committed next step, and the top thing you must NOT do. Keep it tight; this is a
   checkpoint, not an essay.
5. Flag any contradiction or gap you find between the dossier and the actual files.
   The dossier is a point-in-time snapshot and the code is ground truth. In
   particular, re-run `node scripts/audit_generation_seam.mjs` and say whether the
   shipping-v2 count is still zero.
6. Then stop and wait for my go.

Operator preferences, honor these as if given to you directly:
- SHORT responses. He does not read essays. Lead with the answer.
- Ask directly with a recommendation, never a survey of options.
- Honesty over polish. "Thirty done, twelve blocked, here is why" beats a clean list.
- Never claim a screenshot, a gate result, or a verification you did not actually run.
- Never run `npm run build`, deploy, flip a feature flag, or fabricate a figure
  without an explicit instruction.
- Anything touching a live page, a URL, a flag or a deploy goes into ONE approval
  queue for a single reply. It never happens unattended.

The machine is severely memory-constrained: the dev server dies repeatedly and
`tsx` has failed to start. Verify browser-free by default, by reading rendered HTML
as prose. That technique found nine defects the 63 gates could not see.
```
