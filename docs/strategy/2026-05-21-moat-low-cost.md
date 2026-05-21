# Plan v18 Phase 5 — Moat research, low-cost and fast

Question: what makes Atlas impossible to copy by a big player at low
budget and short timeline? Answer: a portfolio of small, layered
moats. No single one is impenetrable. The combination is.

Below: every moat already in place + every realistic cheap-and-fast
addition + a verdict on which to spend the next month on.

---

## 1 · Existing moats (already shipped)

| # | Moat | Status | Replication cost for a competitor |
|---|---|---|---|
| 1 | Methodology lockdown — no source agency named in UI | Live (R-002, D-030) | 1-3 months of API reverse-engineering, against a moving target. |
| 2 | Curated 25-sector × 192-industry taxonomy + crosswalks (NAICS, NACE, ISIC, JSIC, CNAE, ANZSIC, KSIC) | Live (D-012, D-013) | 2-3 weeks of careful classification work. Boring, error-prone. |
| 3 | Sub-national depth (NUTS-3, US counties, JP municipalities, BR cities, etc.) | 357k cells live | Months of per-country ingest. KOSIS is impossible without a Korean phone (B-009). Sirene needs 6GB downloads. |
| 4 | Parent-fallback resolution chain (PARENT_FALLBACK_MAP) | Live (D-015, D-016) | Needs the curated taxonomy first. 1-2 weeks. |
| 5 | Inflation roll-forward to current year per country (43 CPI series) | Live (D-102) | 1 week + ongoing quarterly updates. |
| 6 | Pareto-tail extrapolation per cell | Live (D-103) | Statistically simple but requires the underlying data. |
| 7 | Quality grades A-D with visible signal | Live (D-031) | 2 weeks of methodology design. |
| 8 | Per-cell editorial narratives (2,259 cached) | Live | ~$300 of Claude API calls; trivially copyable, but unique voice harder. |
| 9 | Warm-earth-tone palette | Live | Visually copyable. Doesn't stand alone but compounds with the rest. |

**Sub-total.** Atlas already has a defensible position. A determined
competitor with $100k of engineering would still need 3-4 months to
catch up. That's enough lead time to deepen the moat further.

---

## 2 · Cheap and fast additions (next 30 days, < $2k cash, < 2 wk eng)

### A · Atlas-badge embed program `★★★★★`

What: a "Cite this benchmark" button on every cell page that copies
an HTML snippet. Anyone embeds it on their site → live-updating tile
with a backlink to Atlas. Each embed is a permanent SEO citation.

Why moat: large players (Bloomberg, IBISWorld) don't permit free
embeds. SMB blogs, accountants, advisors will plant these everywhere.
The accumulating backlink graph is hard to copy in less than a year.

Build: 1-2 days. Use the existing `/embed/[country]/[geo]/[industry]`
route. Add a copy-to-clipboard component on cell pages.

Cost: $0.

### B · Founder-curated city anchor expansion `★★★★`

What: the style guide already has 195 country anchors and 207 city
anchors. Extend the city set from 207 to 500 with founder-time only.
Each anchor unlocks a curated city landing page.

Why moat: a competitor can scrape the cell data but not the curated
narrative voice + the founder's hand-picked angle. The cumulative
labor on these is irreplaceable.

Build: founder writes ~1 anchor per minute = 5 hours of work for 300
new anchors. Pages auto-build from a JSON file.

Cost: $0 + founder time.

### C · Open-source the taxonomy crosswalk `★★★★`

What: publish `src/lib/taxonomy/*.json` plus the NAICS / NACE / ISIC
crosswalks as a public GitHub repo (`marginatlas/taxonomy-crosswalks`)
under MIT.

Why moat: counter-intuitive but powerful. The crosswalk is the boring
part competitors would skip. Publishing it (a) gets backlinks from
academics + data engineers, (b) makes Atlas the obvious authority
since "we wrote the crosswalk," (c) the proprietary part is the data
behind it, not the crosswalk.

Build: 1 day to extract + add a README. Founder time to monitor PRs.

Cost: $0.

### D · Quarterly Hugging Face data drop (gated by email) `★★★`

What: every 3 months, publish a curated subset of Atlas data as a
parquet file on Hugging Face. Email signup required to download. Get
all the SEO + community + signal value without exposing the live API.

Why moat: builds the email list. Establishes Atlas as the canonical
SMB data source in the ML community. Generates 1-2 academic citations
per year.

Build: 0.5 day per drop. Automate via a script. The dataset already
exists.

Cost: $0.

### E · Founder-interview series, 12 episodes `★★★`

What: 12 founders of typical SMB types interviewed, each 15-30 min.
Embedded as audio on the relevant industry pages. The interview adds
the qualitative texture that no scraping can replicate.

Why moat: pure narrative depth. Combined with quantitative data, the
combination is hard to match without a media team.

Build: founder records ~1 per week. Audio hosting on R2 (already paid).
A Whisper transcription pass + light editing.

Cost: $50/mo R2 (already paid) + founder time.

---

## 3 · Mid-cost, mid-timeline ($2k - $5k, 1-3 months)

### F · 12 industry deep-dives, one per month `★★★★`

Mentioned in Phase 3 §2.2. The cumulative library of 12 long-form
pieces (5-8 pages each) is the kind of asset only a publishing
operation can match. Atlas can.

Build: founder writes; templated layout (Phase 3 ships this).

Cost: founder time + $0 if self-authored, ~$200 per piece if
ghost-written.

### G · Custom commissioned illustrations (covered in Phase 4)

The Tier 1 spend from the Branding doc. Visual moat compounds with
data moat.

Cost: $1.8k - $3.5k.

---

## 4 · Expensive or slow (skip for now)

| # | Moat | Why skip |
|---|---|---|
| - | Subscription mobile app | Distribution problem, not data problem. Premature. |
| - | Real-time SMB pulse via card data partnership | $50k+ partnership + 6 months to ship. Wrong stage. |
| - | API access at Enterprise tier | Already on the roadmap (D-082). Wait for inbound demand. |
| - | Press kit + PR push | Without a hook, dead on arrival. Build hooks first. |

---

## 5 · Verdict — what to actually do

Spend the next 30 days on **A + B + C** (zero dollars, ~3 days of
engineering, ~10 hours of founder time):

1. **Atlas-badge embed program.** Ship the button + share modal.
2. **Founder city anchors extended to 500.** Founder writes; pages auto-build.
3. **Taxonomy crosswalk open-sourced.** New repo, MIT, README that points back to Atlas.

After 30 days, evaluate:

- Did A bring measurable backlinks? If yes, accelerate. If no, debug the embed UX.
- Did B move time-on-site on the expanded city pages?
- Did C generate at least 5 referral mentions or PR-merges?

If the answer is yes on at least 2 of 3, escalate to **D + E + G** in
month 2.

**Realistic moat strength after 90 days of this plan:** a competitor
would need ~6 months and $150k of engineering, plus a founder who can
write convincingly about SMB economics. That's a real wall.
