# Evaluation of seven supplied links

Date: 2026-08-20
Scope: decide which, if any, of seven founder-supplied URLs are worth adopting for marginatlas.com.
Method: every URL fetched and read. Where a marketplace page truncated the source, the underlying
file was pulled from GitHub (raw or API) so the verdict rests on the instruction file, not the listing.
Nothing was installed. No site code was modified.

Deciding context: Next.js 15.5 App Router, React 19.2, TS 5, Tailwind 3.4, Vercel, server-rendered
and largely static. Content is FIGURES a reader must trust, over a fixed full-screen photograph.
Terracotta plus cool neutrals, ONE accent, no green, no amber, no brown. Serif display plus sans body.
Frosted glass, explicitly NOT Apple Liquid Glass, explicitly NOT high transparency.

---

## The seven, with verdicts

| # | URL | What it actually is | Platform | Licence / freshness | Verdict |
|---|---|---|---|---|---|
| 1 | han.guru/plugins/disciplines | Category index page on a single-vendor marketplace. 29 discipline names, no plugin bodies, no install commands | n/a | FSL-1.1-ALv2, active | **IGNORE** — a navigation page with no content to adopt |
| 2 | han.guru/plugins/frameworks/nextjs | Listing for one plugin, `nextjs` v1.1.2, wrapping three skills | Web / Next.js | Apache-2.0 per plugin.json, inside an FSL repo | **IGNORE** — Next.js 13/14 tutorial boilerplate below our floor |
| 3 | han.guru | Marketing + docs front page for the Han marketplace, "139+ plugins" (repo actually holds 162) | n/a | FSL-1.1-ALv2, Bushido Collective, 190 stars, 9 contributors | **IGNORE** as a source for this site; see Q1 |
| 4 | skills.sh/affaan-m/ecc/liquid-glass-design | One skill inside a 286-skill agent-harness monorepo | **SwiftUI / UIKit / WidgetKit, iOS 26** | MIT, repo active (pushed 2026-08-19) | **IGNORE** — native-only, and it teaches the design language we are explicitly rejecting |
| 5 | skills.sh/dimillian/skills/swiftui-liquid-glass | One skill in a personal Codex skills repo | **SwiftUI / iOS 26 only** | MIT, last pushed 2026-03-29 | **IGNORE** — zero CSS; see the transfer analysis below |
| 6 | skills.sh/bergside/awesome-design-skills/glassmorphism | Marketplace listing for a skill already installed here | Platform-agnostic prose, no code | MIT, repo pushed 2026-06-28 | **IGNORE** — founder's assessment confirmed and hardened below |
| 7 | github.com/bergside/awesome-design-skills | Source repo: 67 SKILL.md + 67 DESIGN.md + marketing PNGs | Platform-agnostic prose | MIT, 2,429 stars, 228 forks | **BORROW THE IDEA** (weakly) — the 13-section shape only, and we already have better |

---

## 1, 2, 3 — han.guru

**What it is.** One marketplace, one publisher. `TheBushidoCollective/han` on GitHub: 190 stars,
20 forks, 9 contributors, created 2025-11-20, last pushed 2026-08-19. The site claims "139+ plugins";
the repo tree contains 162 directories with a `.claude-plugin/plugin.json`. Install is
`/plugin marketplace add thebushidocollective/han` then `/plugin install <name>@thebushidocollective-han`,
or `curl -fsSL https://han.guru/install.sh | bash`.

**Licence, and this is the one genuinely material finding in the whole set.** The repository LICENSE
is the **Functional Source License 1.1 with Apache 2.0 future grant (FSL-1.1-ALv2)** — GitHub's own
API reports the licence as `NOASSERTION` because it is not an OSI-approved licence. It is
source-available, not open source. The grant covers "any purpose other than a Competing Use", where a
Competing Use is a commercial product or service that "substitutes for the Software" or "offers the
same or substantially similar functionality". Permitted purposes explicitly include "for your internal
use and access".

Practical reading for us: installing Han plugins to help build marginatlas is internal use and is
permitted. The restriction would only bite if we redistributed the plugins or built a competing plugin
marketplace. So the licence is *usable*, but it is not MIT and it should not be assumed to be. Note the
inconsistency: `plugins/frameworks/nextjs/.claude-plugin/plugin.json` declares `"license": "Apache-2.0"`
while the repository it ships inside is FSL. Per-plugin Apache claims sit inside an FSL container.

**What #2 actually tells an agent to do.** The `nextjs` plugin contains three skills. Their frontmatter
descriptions are auto-generated and ungrammatical — verbatim:

> `description: Use when next.js App Router with layouts, loading states, and streaming.`
> `description: Use when next.js data fetching patterns including SSG, SSR, and ISR.`
> `description: Use when next.js Server Components for optimal performance.`

The bodies are introductory documentation. `nextjs-app-router` opens by drawing the `app/` directory
tree with `layout.tsx` / `page.tsx` / `loading.tsx` / `error.tsx` and a root layout example.
`nextjs-data-fetching` teaches `cache: 'no-store'`, `next: { revalidate: 60 }`, and
`export const dynamic = 'force-dynamic'`. `nextjs-server-components` opens with "In Next.js App Router,
all components are Server Components by default" and an example that fetches posts from
`https://api.example.com/posts`.

This is Next.js 13/14-era material reproduced from the official docs. We are on 15.5 with React 19.2,
already server-rendered and largely static, with a prebuild gate suite. Installing this would put a
lower-resolution copy of what we already do into the agent's context. Both `allowed-tools` lists are
`Bash` and `Read` only, so there is no write-capability risk — but there is no value either.

**Anything else in Han for us?** No. Across all 4,111 paths in the repo there is no plugin for CSS,
Tailwind design, typography, or glass. The three nearest disciplines are `accessibility-engineering`,
`frontend-development` and `graphics-engineering`. A code search for "contrast" across the whole
repo returns 13 hits, none of them a contrast-measurement tool.

---

## 4 and 5 — the two Liquid Glass skills

Taking these together, because they fail for the same reason and the founder asked for honesty about it.

**#5, `dimillian/swiftui-liquid-glass`.** Repo `Dimillian/Skills`, MIT, 3,911 stars, 206 forks, created
2025-12-30, last pushed 2026-03-29 — five months stale, and 13 of its 17 skills are Apple-platform.
The skill teaches native SwiftUI APIs and nothing else: `.glassEffect(...)`, `GlassEffectContainer`,
`.buttonStyle(.glass)` / `.glassProminent`, `.interactive()`, `glassEffectID` with `@Namespace`, and
`#available(iOS 26, *)` gating. Load-bearing lines, verbatim:

> "Prefer native Liquid Glass APIs over custom blurs."
> "Apply `.glassEffect(...)` after layout and visual modifiers."
> "Gate with `#available(iOS 26, *)` and provide a non-glass fallback."

It contains **zero** web or CSS content and **zero** contrast-measurement guidance.

**#4, `affaan-m/ecc/liquid-glass-design`.** Repo `affaan-m/ECC`, MIT, active (pushed 2026-08-19). The
star count is real and extraordinary — 241,201 stars against 36,575 forks for a repo created
2026-01-18 — which is a signal about the repo's virality as an agent-harness product, and says nothing
whatsoever about this one skill. The skill targets SwiftUI / UIKit / WidgetKit on iOS 26. It uses
`.withAlphaComponent(0.3)` and Apple material APIs. No CSS, no `backdrop-filter`. Its entire
contrast guidance is one bullet:

> "Ensure accessibility contrast — text on glass must remain readable"

That is a wish, not a method.

**What transfers to CSS: honestly, almost nothing, and the little that does we already do.** Three
ideas survive the platform gap, and all three are already in `src/styles/atlas-spine.css`:

1. *Do not apply glass to everything.* The ECC anti-pattern is "Applying glass to every view — reserve
   for interactive elements, toolbars, and cards." Our CSS already states the stricter version, that
   only wrappers are true translucent glass and "anything carrying a figure sits" on a near-opaque fill.
2. *Group adjacent glass surfaces so they composite once.* `GlassEffectContainer` exists for
   performance and shape-merging. The CSS analogue is not to stack `backdrop-filter` layers. We stack
   at most one.
3. *Provide a fallback.* `#available(iOS 26, *)` maps to `@supports (backdrop-filter: blur(1px))`.

Everything else — `glassEffectID` morphing, `.interactive()` touch response, lensing and specular
reflection of surrounding colour — is Apple compositor behaviour with no CSS equivalent, and is
precisely the Liquid Glass idiom the founder has already ruled out. Adopting either skill would push
an agent toward the aesthetic we are deliberately not building.

---

## 6 and 7 — bergside/awesome-design-skills

**The founder's assessment is confirmed, and it is worse than stated.**

I read the installed copy at `E:/atlas/website/.claude/skills/glassmorphism/`. It is two files,
141 lines total. The template brand is exactly as described: `primary=#1856FF`, Plus Jakarta Sans as
both body and display, JetBrains Mono, and a `success #07CA6B` / `warning #E89558` / `danger #EA2143`
semantic set. Every one of those is unusable here — the primary is a blue accent against our terracotta,
and the semantic set is the green and amber we ban outright.

The `## Brand` section is not even about glass. Verbatim:

> "provide fast, reliable communication for individuals, teams, and communities while maintaining a
> clean interface and high performance across desktop environments."

That is a chat-app boilerplate string left in place. The `## Style Foundations` line reads
"clean, high-contrast, bold, enterprise, liquidglass effect, glassmorphism" — it bundles Liquid Glass
and glassmorphism as if they were the same thing, which is the exact confusion the two setproduct
articles exist to resolve.

**The correction to add: it contains no CSS at all.** A grep of both files for
`backdrop|blur|rgba|filter|saturate|opacity|border-radius|box-shadow|inset|contrast ratio` returns
exactly two hits, and both are the word "blur" inside the skill's own one-line prose description
("translucent layers, subtle blur, and luminous borders"). There is not a single numeric value, CSS
property, or technique anywhere in the skill. It cannot teach frosted glass because it does not contain
frosted glass.

**What the repo actually is, and what else is in it.** 284 paths: 67 `SKILL.md`, 67 `DESIGN.md`, ~79
marketing PNGs, a LICENCE and a README. MIT, 2,429 stars, last pushed 2026-06-28. (The skills.sh
listing page's claim of a `skills/index.json` is wrong — no such file exists in the tree.)

I checked whether any of the other 66 would serve us better. They will not, and here is the proof:
`glassmorphism`, `editorial`, `premium` and `minimal` each contain exactly 13 `##` headings, in
byte-identical order:

> Mission | Brand | Style Foundations | Accessibility | Writing Tone | Rules: Do | Rules: Don't |
> Expected Behavior | Guideline Authoring Workflow | Required Output Structure |
> Component Rule Expectations | Quality Gates | Example Constraint Language

This is one file duplicated 67 times with the tokens and two prose paragraphs swapped. The generated
content is wrapped in `<!-- TYPEUI_SH_MANAGED_START -->` / `END` markers, i.e. machine-authored and
machine-overwritten by `npx typeui.sh pull`.

The nearest-miss is `terracotta`, and it is a genuine near-miss worth naming so nobody re-opens it:
"A sun-baked, clay-toned editorial interface built on warm cream surfaces, ink-brown headlines set in a
display serif, and a single terracotta accent" — primary `#C56A3C`, secondary `#F3E9D8`, DM Serif
Display. That is startlingly close to our brief in *words*. But it still ships
`success #16A34A` / `warning #D97706` (the banned green and amber), its terracotta is not our
`rgba(194,58,34)`, its serif is not ours, and like all 67 it contains no CSS. It would give us a worse
version of a palette we already have ratified, plus two banned colours.

**What is worth borrowing.** One thing only: the 13-section shape is a reasonable checklist for what a
design-system document should cover, and "Quality Gates" plus "Example Constraint Language" ("Use 'must'
for non-negotiable rules and 'should' for recommendations") are decent discipline. We already do this
better in `DESIGN-RULEBOOK.md`, `FORM-CATALOG.md` and `FOUNDER-VERDICTS.md`, which carry pinned values,
a changelog and a 90-entry corpus of real verdicts. Structure borrowed, nothing installed.

---

## The three questions

### Q1. Is han.guru a source of Next.js or design plugins worth installing here?

No, on the merits, and the trust model is the smaller problem.

**Trust model: single-vendor, not a community registry.** Despite calling itself "a curated
marketplace", Han is one organisation's monorepo. 9 contributors, 190 stars, 20 forks. Third parties do
not publish autonomously — they open a pull request against `TheBushidoCollective/han`, and
CONTRIBUTING.md describes maintainer review against criteria including "Maintainability — Can we
maintain this long-term?" So there *is* a human review gate, which is more than skills.sh offers, but it
is the vendor reviewing submissions to its own repo, not independent audit.

**Safety signals: none.** No security scanning, no signing, no provenance attestation, no audit badges
anywhere on the site or in the repo. A `SECURITY.md` exists. `curl -fsSL https://han.guru/install.sh | bash`
is a pipe-to-shell install and should not be run here regardless of the plugin question.

**Freshness is good** (pushed 2026-08-19) and the licence is *usable for internal use* but is FSL,
not open source.

The disqualifier is content, not trust. The one plugin the founder pointed at teaches Next.js 13/14
basics to a codebase already past them, and the repo contains no design, CSS, typography or glass
plugin at all. Nothing to install.

### Q2. Do any of these give us something we do not already have?

No. Not one line.

Set against what we hold — two setproduct articles on liquid glass versus glassmorphism, a working
implementation in `src/styles/atlas-spine.css`, and two research agents already covering CSS craft and
the wider ecosystem — the seven links contribute zero new technique. The gap is not close.

Our `.av2 .glass` rule is already more considered than anything in the set:

```
backdrop-filter: blur(26px) saturate(1.15);
border: 1px solid rgba(255,255,255,.72);
box-shadow:
  0 0 6px rgba(0,0,0,.02),
  0 2px 8px rgba(0,0,0,.04),
  inset 3px 3px .5px -3px rgba(255,255,255,.98),
  inset -3px -3px .5px -3px rgba(255,255,255,.70),
  inset 1px 1px 1px -.5px rgba(255,255,255,.72),
  inset 0 0 8px 8px rgba(255,255,255,.08),
  0 18px 44px -24px rgba(0,0,0,.26);
```

Seven shadow layers including four distinct inset lights, plus a documented rationale that the file
states outright: "the glass TEXTURE (blur, border, inset lights, shadow) carries the look, the fill
carries the level." The two-token discipline — `--card: rgba(255,255,255,.955)` for anything holding a
figure, `--air: rgba(255,255,255,.40)` for atmosphere that holds no text — *is* the "explicitly not high
transparency" stance, already implemented and already reasoned.

The four native skills (#4, #5) have no CSS. The two bergside items (#6, #7) have no CSS. The three
Han items (#1, #2, #3) have no design content. There is nothing here to take.

### Q3. Does any of these help with the ACTUAL blocker — measuring text contrast against a composited translucent surface?

No. None of the seven contains any contrast-measurement method. #4's entire offering on the subject is
"text on glass must remain readable". #5 has nothing. #6 and #7 assert "WCAG 2.2 AA" as a bare string
with no procedure. Han has no contrast tooling.

**But the more useful answer is that this blocker is already largely solved in this repo, and the
founder may not have the current state.** `E:/atlas/website/scripts/verify_token_contrast.mjs` (168
lines) does exactly the composited measurement described as missing, and it is wired as a hard prebuild
gate at `scripts/prebuild_all.ts:128` under the name `token-contrast`.

It composites rather than assuming a flat colour:

```js
const over = (s, d, a) => s.map((c, i) => a * c + (1 - a) * d[i]);
```

and builds the real stack — white base, then the photograph at opacity .32, then the card:

```js
const PHOTO_DARKEST = [1, 2, 0];   // measured off /spine/_skyline.jpeg
const PHOTO_OPACITY = 0.32;        // AtlasFrame photo layer
const BASE = [255, 255, 255];
const BACKDROP = over(PHOTO_DARKEST, BASE, PHOTO_OPACITY);
const CARD = over(cardTok.rgb, BACKDROP, cardTok.a);
```

Its own header explains why it can ignore the blur radius entirely, and the argument is sound:

> "A Gaussian blur is a convex combination of its input pixels: every output pixel is a weighted
> average with non-negative weights summing to one, so it can never fall below the darkest input pixel
> nor rise above the brightest. Bounding the photograph once therefore bounds it for EVERY blur radius,
> forever, and this gate needs no knowledge of backdrop-filter at all."

It also already anticipates the transparency ladder:

> "At the current .955 the difference between the old assumption and the truth is about half a point on
> a ratio of seventeen and no AA verdict flips, which is why nobody noticed. At .80 the true ground is
> rgb(238) against the assumed 255; at .62 it is rgb(224). A translucency ladder built while this gate
> still reported white would pass the whole way down and be wrong the whole way down."

**One residual hole, which is the real remaining work and no skill will supply it.** The convexity
proof covers `blur()`. It does **not** cover `saturate()`, and our glass rule applies
`backdrop-filter: blur(26px) saturate(1.15)`. A saturation filter is a colour matrix, not a convex
combination — it can push a channel outside the min/max range of its inputs, so a saturated backdrop
can in principle be darker than the darkest input pixel the gate bounds against. At `saturate(1.15)`
over a desaturated photo the effect is small and the current `.955` fill leaves enormous headroom, so
nothing is failing today. But if the fill drops toward `.80` or `.62`, that hole is where the bound
stops being a bound. Closing it means either extending the model through the saturation matrix, or
measuring the actual composited pixels from a rendered screenshot rather than reasoning about them.
That is arithmetic and instrumentation work, and it is exactly the kind of thing that no amount of
visual guidance — from these seven links or anywhere else — will do for us.

---

## What I would actually install, and what I would not

**Install: nothing.** Not one of the seven earns a place in this repo.

**Uninstall: one.** `E:/atlas/website/.claude/skills/glassmorphism/` should be removed. It is not
merely useless, it is actively counter-aligned: it puts `#1856FF`, Plus Jakarta Sans, and a
green/amber/red semantic set into the agent's context on every design task, and it conflates Liquid
Glass with glassmorphism in its own style line. It contains no CSS, so there is no offsetting benefit
to keep it for. (Flagging only — no files were removed, per the modify-nothing constraint.)

**Borrow, do not install:** the 13-section document shape from bergside, and only if a gap appears in
our own `DESIGN-RULEBOOK.md` / `FORM-CATALOG.md`. Our documents are better; this is a checklist to
diff against, once.

**Do not run:** `curl -fsSL https://han.guru/install.sh | bash`, and do not add the Han marketplace.
Pipe-to-shell from a 190-star single-vendor site with no signing or provenance, for content we have
established we do not need.

**Where the effort should go instead:** the `saturate()` hole in `verify_token_contrast.mjs`. That is
the only unsolved piece of the stated blocker, and it is ours to close.

---

## Blind spots — what I could not establish

- **A marketplace listing shows what a skill CLAIMS, not what it does.** I mitigated this by pulling
  the actual instruction files from GitHub for #2, #5, #6 and #7, and by reading #6's installed copy on
  disk. For **#4 I did not obtain the complete raw SKILL.md** — skills.sh truncates behind a "Show more"
  and my raw-path fetch returned a summary rather than the full file. Its platform (SwiftUI/UIKit/
  WidgetKit) and its `.withAlphaComponent(0.3)` usage are established; the possibility of a small CSS
  section buried deeper in that file is not fully excluded. Given it lives in a skill directory named
  for Apple's iOS 26 design language, I rate that unlikely but not disproven.
- **Popularity signals say nothing about fitness.** ECC's 241k stars, dimillian's 3.9k, bergside's 2.4k
  and the 966 / 2.1k / 3.9k install counts measure reach among agent-tooling enthusiasts. None of them
  measures whether the advice suits a financial-data site rendering trustworthy figures over a
  photograph. Two of the three most-installed items here are for a platform we do not ship on.
- **The skills.sh audits are unexplained.** Listings show "passes Gen Agent Trust Hub, Socket and
  Snyk". The `/audits` page states results without defining scope. Those are supply-chain and
  malicious-code scanners; **nothing indicates they assess whether a skill's ADVICE is correct or
  suitable.** A skill can be perfectly safe and completely wrong for us — which is the case for at
  least three of these.
- **skills.sh's own trust model is undocumented.** The site is "Made with care by Vercel" and describes
  itself as "The Open Agent Skills Ecosystem", but publishes no submission, review, moderation or
  verification policy that I could find. It appears to index public GitHub repos, meaning the trust you
  get is the trust of the upstream repo and no more.
- **Han's plugin count is inconsistent across its own surfaces** — 139+ on the site, 340 in the README,
  162 `plugin.json` files in the tree. I did not determine which counting rule is intended; it does not
  change the verdict.
- **I did not read all 162 Han plugins or all 67 bergside skills in full.** For bergside the structural
  fingerprint (13 identical headings in identical order across four sampled skills, all inside
  `TYPEUI_SH_MANAGED` markers) is strong evidence of one template, but I verified four, not all 67. For
  Han I searched the full 4,111-path tree for design, CSS, contrast and glass terms and found nothing,
  which bounds the miss but does not eliminate it.
- **`verify_token_contrast.mjs` was read, not executed.** I did not run it or the prebuild suite, so I
  am reporting what the code does, not confirming its current pass/fail output.
