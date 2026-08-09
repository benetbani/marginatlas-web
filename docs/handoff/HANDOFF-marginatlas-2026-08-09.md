# HANDOFF — Margin Atlas, the 26-firing research loop and the outage it uncovered

> ## CORRECTIONS, 2026-08-09, applied by the next session before any work
>
> **This dossier was wrong on both of its headline claims. The code was right.**
> Read this box before anything below it; the corrected facts are folded into
> §3 and §8 as well.
>
> 1. **The three commits were already pushed.** `origin/main` = `feca5af6`,
>    pushed 02:08:48 , the push swept in the handoff commit that calls itself
>    unpushed. Verified live: the sitemap declares **2,847 URLs**, shards 1 and 2
>    carry **500 and 300**, `/cities/london` serves the district picker. The
>    district collapse and the sitemap collapse are both **live**.
> 2. **The v2 flag took effect.** The detector was pointed at a URL that can
>    never serve the spine. `src/lib/cells/spine2_loader.ts` registers exactly
>    one route, `gb/london/restaurants`; everything else falls through to legacy
>    by design. `/gb/london/restaurants` serves `av2` ×2, `chnum` ×40,
>    `statblock` ×15, `panel pad` ×42. **Nothing is wrong with the rollout.**
> 3. **The 30 → 1 build-fallback verification failed.** See §8 item 3. The
>    rewrite's own build logged 30, unchanged; the count fell only on a redeploy
>    of the identical commit. **Do not report the perf fix as confirmed.**

*Status, 2026-08-09: the site is materially healthier than 24 hours ago. A
three-month silent database outage was found and closed, four live content
defects were fixed and deployed, and the sitemap was cut from 28,167 URLs to
~2,847. All commits are pushed and live. The v2 design is serving on the one
route that has a cell file.*

> **How to use this document.** Read top to bottom once. Then read the files in
> §7 in the order given. Do not start work until you can answer §13. The
> re-hydration prompt is §14.

---

## 1. TL;DR

Margin Atlas (marginatlas.com) is a global small-business benchmarks site: what
a trade earns, and what its owner actually keeps, by place. The founder ran an
overnight research loop (26 firings, ~70% web research / 30% application) to
raise design quality and find defects. **The loop's largest find was not a design
issue: the Supabase service-role key had been rotated around May and every
server-side read had been failing silently since**, so the site had been serving
modelled figures where it holds real ones, and the sitemap's cell shards had been
shipping 110 bytes. It was invisible because every data reader ended
`if (error || !data) return []`, making a rejected query and an empty table
identical. One `console.warn` surfaced it; the founder rotated the key; the site
recovered.

Also shipped tonight: four live content defects (a wrong-trade headline on 25,320
pages, a slug resolving to the wrong industry, a broken singular noun, a clamped
figure presented as a measurement), stale FX rates, and five new prebuild gates.
On the founder's instruction the 25,320 near-identical neighbourhood pages were
de-indexed and their content moved into a district picker on the city page.

~~**The single most important thing to know: three commits are unpushed, so the
district picker and the sitemap collapse are not live.**~~ **WRONG WHEN WRITTEN.**
They were pushed at 02:08:48 and both are live. See the corrections box at the
top. The next real change is §8 item 4.

---

## 2. Mission & success criteria

**The enduring goal (founder's framing):** a rich world atlas of small-business
economics, not a niche tool. The reader should get their decision in the top 20%
of the page, with depth below. Margin is the core metric. Honesty and
myth-debunking are the moat.

**The current tactic:** raise the design to a bar the founder will accept, and
make the data layer trustworthy enough to publish widely.

**"Done" for this stretch:** the v2 design visible on live routes, the site
publishing only pages that carry distinct data, and no class of failure that can
hide for months.

**Hard constraints, all founder-set:**

| Constraint | Note |
|---|---|
| No em-dashes in user-visible copy | gate `no-em-dashes`; `// allow-em-dash` to override |
| No source-agency names in copy | gate `no-source-agencies` |
| **No URL slug renames** | SEO equity rides on existing URLs. Add, never rename |
| No raw hex/px/ms in components | tokens only |
| `design/mockups/atlas.css` is the founder's file | do not edit without explicit instruction |
| `RATIFIED-DRAWINGS.md` is settled law | do not reopen a ratified drawing |
| Five page types, fixed | do not create new page types, routes or sections |

---

## 3. Current state — ground truth

| Component | Status | Notes |
|---|---|---|
| Production site | **Live, healthy** | marginatlas.com, Vercel `fra1` |
| Supabase | **Fixed 2026-08-08** | service-role key was dead ~3 months; founder rotated it |
| Sitemap | **~2,847 URLs** (was 28,167) | cell shards refilled to 500 + 300 after the key fix |
| Cell pages | Real data again | the "Estimated" fallback label is gone |
| **3 commits** | **PUSHED AND LIVE** | pushed 02:08:48; district picker + sitemap collapse both confirmed on production |
| v2 design rollout | **LIVE on `/gb/london/restaurants`** | the only route with a spine-2 cell file; every other triple falls through to legacy by design |
| Prebuild gates | **66, all green** | 5 added in the last 3 days |
| Build-time DB fallbacks | 30 → 4, **not attributable to the fix** | the rewrite's own build still logged 30; see §8 item 3 |
| Junk URLs | **Still return 200** | `/us/nowhere/nothing` → full indexable page. Refused to fix, see §6 |
| Parent repo git | **`gc` fails** | 6,760 loose objects, 4.5GB. Commits work. Not fixable under the loop's memory ceiling |

**The v2 design rollout, RESOLVED 2026-08-09.** The founder added
`NEXT_PUBLIC_SPINE_REFORM_CELL` and redeployed, and it worked. The paragraph
that stood here concluded "not established" from a measurement of
`/us/california/restaurants`, **which can never serve the spine**:
`src/lib/cells/spine2_loader.ts` registers exactly one route,
`gb/london/restaurants`, and states so in its header , every other triple returns
null and falls through to the legacy render on purpose. That is the launch
state, one cell at a time, not a broken flag.

Measured on production:

  /gb/london/restaurants      av2 ×2, chnum ×40, statblock ×15, panel pad ×42, chapters ×2
  /us/california/restaurants  zero spine markers, and correctly so

**The `.av2` detector was right; the URL was wrong.** One consequence: the
142,601 → 106,741 byte change on the California page was **not** the flag, since
the flag cannot reach it. That drop is unattributed and stays that way.

---

## 4. How we got here — the decision trail

**2026-08-06.** Infrastructure and hygiene pass. 29 shipping routes were telling
Google they were the home page; fixed. Footer, BRAND.md, first-person copy rules,
several gates.

**2026-08-07.** All five v2 page types were built (`/dev/cell2`,
`/dev/industry2`, `/dev/hood2` joined the existing city and country). **The
founder then rejected all three new pages**, ~44 defects, and gave the operating
instruction that governs the design work since:

> *"For each subsection, you should give me a file with three options that you
> have drawn for it. That's the deal."*

and

> *"not overbloating the subsection, making it skimmable... giving the user some
> sort of a graphic that he kind of expects instead of an alien form."*

That produced the catalogue (ten drawings on one page), the photo treatment, and
seven per-subsection option files at `/dev/options/*`. **Six drawings were
ratified** and written to `design/loop5/RATIFIED-DRAWINGS.md`.

**2026-08-08.** The research loop ran 26 firings. Its most valuable output was
not any single note but a discipline: **measure before concluding, and read the
source before believing a number.** Six separate measurement artifacts were
caught (see §5). Two published conclusions were withdrawn outright.

**The outage.** Firings 19, 21 and 23 all chased two empty sitemap shards and
twice concluded "build-time timeout". That was never established — it was assumed
because `withBudget` logs on timeout and a fast-failing query logs nothing. Adding
one `console.warn` put `Unregistered API key` in the next build log. The founder
rotated the key; shards refilled to 500 and 300; the "Estimated" label vanished
from cell pages.

**The collapse.** The founder proposed reducing the country × activity lattice to
one page per country (or per activity) with a dropdown, accepting the SEO cost.
**The measurement redirected it:** the lattice is ~800 real cell pages; the bloat
was 25,320 neighbourhood pages at 95% textual similarity. His instinct was right,
his target was wrong. He then ruled:

> *"the whole idea of neighborhoods should be condensed into having, like, a big
> section for each city where the neighborhoods can just be clicked. And the
> first one will be already selected."*

That is built (`CityDistrictPicker`) and committed, not pushed.

---

## 5. Hard-won truths & mental model

**The failure mode of this codebase is silence, not crashes.** Fail-soft is
everywhere and it is deliberate — a slow table must never take a page down. But
the same pattern made a three-month outage invisible. `dbFailed()` in
`src/lib/cells.ts` now logs at all 13 reader sites. **If you add a reader, log the
error.**

**`withBudget` logs on TIMEOUT only.** A query that fails fast returns a clean
empty array and says nothing. This distinction cost three firings.

**Six measurement artifacts were caught in one night.** The pattern is always the
same: an instrument that cannot observe the thing it is measuring returns a
confident number.

| Artifact | The lie |
|---|---|
| Grepping served HTML for `cursor:grab` | only ever matches inline styles; the CSS lives in a stylesheet |
| Counting only `<p>` for "how is this page divided" | most of our short text is in `.note` / `.lab` / `.s` |
| Counting text blocks without stripping nav | a 21-entry jumpsheet became 36 "fragments" |
| Counting table cells as prose fragments | a benchmarks site is made of tables |
| Matching `color:var(--x)` without a property boundary | `border-color:` contains `color:` — invented 4 defects |
| Stripping tags without stripping `<!-- -->` | React renders `+200%` as `+<!-- -->200<!-- -->%` |

**Rule that emerged: read the component before acting on an aggregate.** It
prevented a merge that would have destroyed a working data table, and a 404 rule
that would have killed a third of the site.

**Postgres: an OR of `LIKE` prefixes with an `ORDER BY` on another column forces a
BitmapOr, discards the index ordering, and sorts the whole match set.** One query
per prefix, merged in JS, is 3.6× faster with identical rows. The codebase had
already learned this on `regional_cells` and never generalised it.

**A figure sitting on a model's clip is the bound, not a measurement.** Five
districts print `+200%` because the multiplier clips at 3.0. The page now says
"at least".

**Vocabulary.** *Cell* = a (country, geo, industry) combination. *Spine* = the v2
page structure. *Firing* = one 30-minute loop iteration. *Ratified* = the founder
decided; do not reopen.

---

## 6. Dead ends — do NOT retry

| Do not | Why |
|---|---|
| **Build the wage-to-GDP gate** | The declared band [0.4, 1.8] fails 59 of 197 countries, monotonically by data quality (11/44/65% by grade A/B/C). A median wage describes wage earners; GDP per capita divides across everyone. Mali's 4.24× implies a 31–43% labour share, which is ordinary. **The rule is wrong, not the data.** |
| **404 junk URLs on "industry must resolve"** | Would 404 **269 of 800** real cell URLs. A third use raw NAICS descriptions (`/us/mississippi/offices-of-lawyers`), not taxonomy slugs. |
| **404 junk URLs on "geo must resolve"** | Does not discriminate: `geoResolves("us","nowhere")` is `true`. The geo resolver is permissive several layers down. |
| **Merge the cell page's prose fragments** | The metric behind it counted data-table cells. The worst-scoring chapter (Ch15 "What to watch") is a shock table plus a two-column list. |
| **Raise the neutral ramp to 3:1 between steps** | The ratified rule is emphasis-not-categorical; neutrals must recede. IBM Carbon cannot hit that figure either; a separator is the accepted answer, and `.sbar` already has a 2px gap. |
| **Build a Sankey for the cost breakdown** | Current fashion for exactly this content. Area + length on non-aligned scales, needs horizontal room against a 60% width cap, and is the definition of an "alien form". |
| **Refresh `src/lib/finance/fx.ts`** | Its AUD rate is 19 months old and **correct** — pinned at the moment the Australian source was parsed. Refreshing restates every AU figure. Only `src/lib/currency.ts` (display) should be refreshed. |
| **Raise the `getTopCells(500)` cap** | The doc block's old 5,000/20,000 figures were wrong for months; nobody has established whether the memory ceiling was the laptop or the deploy box. |
| **Repack the parent git repo during a loop firing** | 4.7GB of loose objects needs far more than the 400MB ceiling. |
| **Try to "match OWID" on paragraph length** | OWID's median paragraph is 18, 32 and 41 across three pages. There is no norm to match. The founder's ratified 20-word rule is the better standard. |

---

## 7. Critical files & artifacts (reading order)

| # | Path | Role | Priority |
|---|---|---|---|
| 1 | `E:\atlas\design\loop5\LOOP-JOURNAL.md` | 26 firings, each with found/next. **The spine of the whole run.** Read the last 8 entries first | **Critical** |
| 2 | `E:\atlas\design\loop5\RATIFIED-DRAWINGS.md` | Settled law: 6 ratified drawings + the rules every drawing obeys + the "still to rule on" list | **Critical** |
| 3 | `E:\atlas\design\loop5\FOUNDER-REVIEW-2026-08-07.md` | The 44 defects and 5 root causes behind the rejection | **Critical** |
| 4 | `E:\atlas\website\CLAUDE.md` | Stack, folder map, hard constraints, gate list | High |
| 5 | `E:\atlas\design\loop5\research\2026-08-08-seo-lattice.md` | The lattice measurement, the H1 defect, the empty shards | High |
| 6 | `E:\atlas\design\loop5\research\` (15 notes) | One per agenda item. Two are corrections of earlier notes (`-corrected`, `the-merge-that-should-not-happen`) | Medium |
| 7 | `E:\atlas\website\src\lib\cells.ts` | The data layer. `dbFailed()` at ~line 495 explains the outage | High |
| 8 | `E:\atlas\website\src\app\sitemap.ts` | 8 shards; shard 5 deliberately returns empty | High |
| 9 | `E:\atlas\website\src\components\cities\CityDistrictPicker.tsx` | Where the 25,320 pages went | High |
| 10 | `E:\atlas\website\src\lib\feature_flags.ts` | `isSpineReformEnabledFor` — how the v2 rollout is gated | High |
| 11 | `E:\atlas\website\scripts\loop\` | 5 tools: `gate`, `prose`, `mobile`, `density`, `sitemap` | Medium |
| 12 | `E:\atlas\website\docs\verification-protocol.md` | The founder's definition of done | Medium |

---

## 8. Open threads & next steps

### Done 2026-08-09, kept for the trail

**1. ~~Push the three commits.~~ DONE, and they were already pushed when this
dossier was written.** Verified live: 2,847 URLs, shards 1/2 at 500/300,
`/cities/london` serves the picker.

**2. ~~Confirm what the v2 flag actually did.~~ DONE. It works.** See the
corrected §3. The check was aimed at a URL with no spine-2 cell file.

**3. ~~Read the next build log for `exceeded 4000ms`.~~ READ, AND IT DOES NOT
SETTLE THE QUESTION.** Five builds, by commit and label:

  18:30Z  4289c6e   **268**   20 nudge, ~224 across:*, ~18 extremes/opening
  19:19Z  652f43e    **30**   20 nudge, 5 activityAcrossStates, 4 getSameIndustryAcrossStates
  19:49Z  a165593    **30**   20 nudge, 6, 4          <- the rewrite's OWN build
  23:55Z  a165593     **2**   0 nudge, 1, 1           <- same commit, redeployed
  00:08Z  feca5af     **4**   0 nudge, 4, 0

Firing 25's *attribution* holds exactly: 29 of the 30 are the two functions it
named. **Its conclusion does not.** The build of the commit that rewrote them
logged 30, unchanged from the build before it; the count fell to 2 only on a
redeploy of the identical commit four hours later, with zero lines different.
**A per-build fallback count cannot separate the code change from build-time
database load, so "read the next build log" was the wrong test.** The direct
benchmark (2846ms → 786ms on identical rows) is the better evidence and stands.
**Do not report the rewrite as confirmed, and do not revert it.** The compute
tier question is neither reopened nor closed.

Also new, visible only because the swallow was removed:
`getTopIndustriesForCountry failed: canceling statement due to statement
timeout` , a **server-side** timeout, a different failure from the client-side
budget, one occurrence.

### High priority

**4. Redirect the 25,320 district URLs to the city page.** Correct end state,
now that the destination exists. They are currently `noindex, follow` and still
resolve. A 301 to `/cities/<city>#districts` is the right shape. **Unanswered
before it ships:** those URLs carry an INDUSTRY that `/cities/<city>#districts`
does not, so a flat 301 discards a dimension. Outward-facing and hard to
reverse; wants a nod first.

### Medium

**5. The junk-URL 404.** §6 lists two rules already ruled out. **The safe shape is
probably `noindex`, not `404`, gated on "cell came back synthetic AND industry
slug does not resolve in the taxonomy".** Test the pair against all 800 real cell
URLs before writing it. A wrong noindex is recoverable; a wrong 404 is not.

**6. Three empty chapters on the cell page** — 13 (other cities), 14 (operators),
16 (versus the world). They print a gap sentence. The founder's own count was
"three". Ratified strategy says fill with **sample-tagged** content;
empty-state practice suggests a **faded skeleton**. Both are compatible. **His
call, not a fix to make unilaterally.**
See `design/loop5/research/2026-08-08-the-three-empty-chapters.md`.

**7. Eleven subsections still unruled** — listed in RATIFIED-DRAWINGS.md under
"Still to rule on". Each needs three drawn options per the founder's deal.

### Optional / someday

- 51 `/dev/*` routes ship to production. Noindexed but crawled; `Disallow: /dev/`
  in robots.txt would stop the crawl waste.
- The year-strip bars are drawn at 1.81:1 and 1.34:1 against the card, under
  SC 1.4.11's 3:1. A 1px hairline clears it without touching the palette.
  **Founder's file, founder's ratified drawing, founder's call.**
- `v49-command-center` costs the same $7.35/month as Margin Atlas on Supabase.
  Worth knowing if it is still in use.

---

## 9. Constraints, guardrails & operator preferences

**How the founder wants to be talked to.** Short. He has said, repeatedly and
emphatically: *"shooooort fucking responses, i dont read dumb essays"* and
*"you should give it to me in action. I cannot judge, like, a full essay."*
Also: *"When you give me a file, you should always give me the full fucking
location"*, and *"don't talk to me in these tactical terms."* Give commands
paste-ready, one per fenced block. Act in the background; report briefly.

**Never:**
- Push without being asked. `main` is production; a push is a deploy.
- Run `npm run build` locally. It OOMs.
- Edit `design/mockups/atlas.css`. Founder's file.
- Reopen a ratified drawing.
- Create new page types, routes or sections.
- Delete or rewrite working code to make room for an idea. The bar is
  "measurably better", not "how I would have done it".

**Always:**
- Measure before concluding. Read the source before believing an aggregate.
- State what is unverified, plainly. A rosy report is a dangerous one.
- Withdraw your own wrong findings explicitly when you find them.

**Ratified strategy (2026-07-07), still binding:** fill gaps with SAMPLE-TAGGED
content rather than omitting; the automated gate is provenance + range +
peer-outlier only; reading stays free, Pro is decision tools.

---

## 10. Environment & reproduction

- **Website repo:** `E:\atlas\website` (own git repo, branch `main`)
- **Parent repo:** `E:\atlas` (design, research notes, loop journal)
- **Stack:** Next.js 15.5, React 19.2, TypeScript 5, Tailwind 3.4, Supabase
  (eu-west-1, **MICRO** compute — CLAUDE.md says NANO and is stale), Vercel `fra1`
- **Secrets:** `E:\atlas\website\.env.local` (git-ignored). Vercel holds the
  production copies. **Never paste key values anywhere.**

```bash
cd E:\atlas\website && npx tsc --noEmit
```

```bash
cd E:\atlas\website && node scripts/loop/gate.mjs <gate-names> --heap 384
```

```bash
cd E:\atlas\website && node scripts/loop/sitemap.mjs
```

```bash
cd E:\atlas\website && node scripts/loop/prose.mjs https://www.marginatlas.com/<path>
```

**`.mcp.json` is intentionally dirty.** It carries a machine-specific absolute
path for the founder's `context-mode` MCP server at
`E:\Others\context-mode\context-mode-main\start.mjs`. **Do not commit it.**
`git checkout .mcp.json` before any commit that would sweep it in.

---

## 11. Landmines & gotchas

| Trap | What happens |
|---|---|
| **Git Bash path mangling** | A leading-slash argument becomes `C:/Program Files/Git/...`. Use `export MSYS_NO_PATHCONV=1`. `prose.mjs` carries an `unmangle()` for this |
| **React text-node separators** | `{"+"}{200}{"%"}` renders as `+<!-- -->200<!-- -->%`. Strip `<!-- -->` to **nothing**, not a space |
| **PostgREST caps at 1,000 rows** | A `.limit(50000)` silently returns 1,000. Distinct-counts from a "sample" are meaningless |
| **A nonexistent column returns 0 rows, not an error** | `.not("revenue_per_firm","is",null)` on a table without that column returns 0. Check the columns first |
| **An unregistered sitemap shard is not a 404** | The dispatcher ends `return []`, so every id past the last one answers 200 with an empty urlset |
| **curl's TLS broke mid-session** | Exit 35 on every URL including the homepage. Node's `fetch` worked fine. **Check the tool before believing an outage** |
| **`generateSitemaps` output is prerendered at build** | An empty shard is baked into the deployment and cannot self-heal without a deploy |
| **The `Write` tool is blocked on config files** | `.mcp.json` and anything under `~/.claude/` are refused by the permission classifier. `Edit` works on existing files |

---

## 12. Glossary

| Term | Meaning |
|---|---|
| **Cell** | A (country, geo, industry) combination. The atomic page of the site |
| **Spine / v2** | The ratified page structure and design system, gated behind `NEXT_PUBLIC_SPINE_REFORM_*` |
| **Firing** | One iteration of the 30-minute research loop |
| **Ratified** | The founder decided it. Settled law |
| **Gate** | A prebuild verifier in `scripts/verify_*`. 66 of them |
| **Ratchet gate** | Fails only when a recorded baseline **grows**. Never raise a baseline to make one pass |
| **Sample tag** | The visible marker on any modelled or sampled figure |
| **The clip** | The 0.4–3.0 bound on the neighbourhood multiplier. Five districts sit on the ceiling |

---

## 13. Successor verification checklist

You are oriented when you can answer these:

1. Why did a three-month database outage stay invisible, and what single code
   pattern caused it?
2. What is the difference between `src/lib/currency.ts` and
   `src/lib/finance/fx.ts`, and which one must never be refreshed?
3. Why was the 25,320-page neighbourhood lattice removed, and where did its
   content go?
4. Name two rules for 404-ing junk URLs that were measured and rejected, and why
   each failed.
5. Which two headline claims did this dossier get wrong, and what is the actual
   state of each? (Corrections box, top.)
6. Why can `/us/california/restaurants` never show the v2 design, and which URL
   does?
7. Why does the build log not settle whether the query rewrite worked?
8. What is the founder's stated preference for how you communicate?
9. Which file is off-limits for edits without explicit instruction?

---

## 14. Re-hydration prompt

```
You are resuming an in-progress effort. Another session prepared a complete handoff
so you can continue with zero context loss. Do NOT start work yet.

Project: Margin Atlas (marginatlas.com)
Working directory: E:\atlas\website   (parent repo E:\atlas)
Handoff dossier (read this FIRST, in full): E:\atlas\website\docs\handoff\HANDOFF-marginatlas-2026-08-09.md

Follow these steps exactly:
1. Read the dossier at the path above, top to bottom.
2. Then read these files, in this order (the dossier explains why each matters):
   - E:\atlas\design\loop5\LOOP-JOURNAL.md  (last 8 entries first, then skim the rest)
   - E:\atlas\design\loop5\RATIFIED-DRAWINGS.md
   - E:\atlas\design\loop5\FOUNDER-REVIEW-2026-08-07.md
   - E:\atlas\website\CLAUDE.md
   - E:\atlas\design\loop5\research\2026-08-08-seo-lattice.md
   - E:\atlas\website\src\lib\cells.ts   (the dbFailed helper and its 13 call sites)
   - E:\atlas\website\src\app\sitemap.ts
   - E:\atlas\website\src\lib\feature_flags.ts
3. Do not edit anything, run anything destructive, or make decisions until steps 1-2 are done.
4. Then prove you are oriented: answer the "Successor verification checklist" in section 13
   of the dossier in 5-10 lines. Keep it tight; this is a checkpoint, not an essay.
5. Flag any contradiction between the dossier and the actual files. The dossier is a
   point-in-time snapshot; the code and the live site are ground truth. It has already
   been wrong twice in exactly this way (see the corrections box at the top), so verify
   rather than believe: check git against origin, and check a claim about the live site
   against the live site.
6. Then stop and wait for my go. Nothing is pre-authorized: everything in section 8
   item 1 is already done and pushed.

Honor the operator preferences in section 9 as if given to you directly: short responses,
paste-ready commands with full absolute paths, act in the background, never push unasked
beyond the pre-authorized step, and state plainly what is unverified.
```
