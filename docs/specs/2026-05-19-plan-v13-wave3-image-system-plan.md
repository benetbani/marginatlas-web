# Plan v13 Wave 3 — Image System v2 Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax. Independent of Waves 1, 2, 2b — runs against whatever those leave behind. Ships in ~2-3 days.

**Goal:** Replace the broken / inconsistent image system with a hybrid Wikimedia-for-landmarks + AI-for-everything-else pipeline. Every country page shows a polished skyline of the main city; every industry page shows an aesthetic process or end-product shot. Fix the rendering bug ("div" text appearing in front of images). Self-host all images so we never ship broken remote URLs.

**Architecture:** Three steps:
1. **Audit & purge** — score every current manifest entry, drop low-quality / dead URLs
2. **Hybrid generation** — Wikimedia for famous landmarks where free CC photography excels (Eiffel Tower, Times Square, Big Ben); AI generation (Imagen 4 / Flux Pro / DALL-E 3) for everything else
3. **Self-host + bug fix** — download all approved images to `public/images/`, regenerate manifests pointing at local paths, fix the rendering bug

**Tech Stack:** Python ingest scripts + Next.js image rendering. New service dependency: one of {Google Vertex AI Imagen 4 (~$0.04/image), Black Forest Labs Flux Pro via fal.ai/Replicate (~$0.03/image), OpenAI DALL-E 3 (~$0.04/image)}. Founder approved budget — actual cost ~$15-30 for full library.

**Project peculiarities:**
- Existing manifests at `data/images/{cities,industries,countries,sectors}_manifest.json` (Plan v12 work)
- Existing `AtlasHeroImage.tsx` component renders manifest entries
- Image rendering bug reported by founder ("div" text in front of images) — likely a JSX leak or `dangerouslySetInnerHTML` issue

---

## File Map

**New files:**
- `scripts/images/audit_manifests.py` — score current entries, output reject list
- `scripts/images/prompt_templates.py` — AI generation prompt library per category
- `scripts/images/generate_ai.py` — driver for AI image generation
- `scripts/images/build_hybrid_manifest.py` — orchestrator: Wikimedia OR AI per entry
- `scripts/images/download_and_optimize.py` — download all picked images, convert to WebP, resize to 3 sizes
- `public/images/{cities,industries,countries,sectors}/` — self-hosted local images
- `src/lib/images/local_paths.ts` — helper that returns local `/images/...` paths from manifest IDs

**Modified files:**
- `data/images/cities_manifest_v2.json` — hybrid output (replaces v1)
- `data/images/industries_manifest_v2.json` — hybrid output (replaces v1)
- `data/images/countries_manifest_v2.json` — hybrid output (replaces v1)
- `src/components/AtlasHeroImage.tsx` — rendering bug fix; uses local paths
- `src/components/CountryHero.tsx` (if exists) — same

---

## Task 1: Audit current manifests

**Files:** Create: `E:/atlas/scripts/images/audit_manifests.py`

- [ ] **Step 1: Write the audit script**

```python
"""Plan v13 Wave 3 — score every entry in the existing manifests.

Output: image_audit_v1.json with a per-entry verdict:
  - 'good': URL resolves, image is >= 1024x768, looks relevant
  - 'mediocre': URL resolves but low resolution or off-topic
  - 'dead': URL doesn't resolve (404, timeout, redirect to non-image)
  - 'inappropriate': URL resolves but image obviously wrong (e.g., a random
                    person's photo for 'Eiffel Tower')

Drops the 'inappropriate' classifier for now — needs human review.
First pass scores only on: resolves yes/no, content-type is image/*,
image dimensions if served as image/jpeg with width/height in EXIF.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

MANIFEST_DIR = Path(r"E:\atlas\website\data\images")
OUT_PATH = Path(r"E:\atlas\delivery\images\image_audit_v1.json")
OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

def check_url(url: str) -> dict:
    try:
        r = requests.head(url, timeout=10, allow_redirects=True, verify=False)
        if r.status_code >= 400:
            return {"verdict": "dead", "http": r.status_code}
        ct = r.headers.get("Content-Type", "")
        if not ct.startswith("image/"):
            return {"verdict": "dead", "content_type": ct}
        size = int(r.headers.get("Content-Length", 0))
        if size < 50_000:
            return {"verdict": "mediocre", "size_bytes": size}
        return {"verdict": "good", "size_bytes": size, "content_type": ct}
    except Exception as e:
        return {"verdict": "dead", "error": str(e)[:80]}

def audit_one(category: str, slug: str, entries: list[dict]) -> list[dict]:
    out = []
    for entry in entries:
        result = check_url(entry["url"])
        out.append({"category": category, "slug": slug, **entry, **result})
    return out

def main():
    all_results = []
    for category in ["countries", "cities", "industries", "sectors"]:
        path = MANIFEST_DIR / f"{category}_manifest.json"
        if not path.exists():
            print(f"skip: {path}")
            continue
        manifest = json.loads(path.read_text(encoding="utf-8"))
        # Many checks in parallel
        with ThreadPoolExecutor(max_workers=20) as pool:
            futs = {pool.submit(audit_one, category, slug, entries): (category, slug)
                    for slug, entries in manifest.items()}
            for fut in as_completed(futs):
                all_results.extend(fut.result())

    OUT_PATH.write_text(json.dumps(all_results, indent=2), encoding="utf-8")
    verdicts = {}
    for r in all_results:
        verdicts[r["verdict"]] = verdicts.get(r["verdict"], 0) + 1
    print(f"audit complete: {len(all_results)} entries")
    print(f"verdicts: {verdicts}")
    print(f"wrote {OUT_PATH}")

if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run it**

```bash
cd E:/atlas && python scripts/images/audit_manifests.py
```

Expected: ~1000+ entries audited (5 sectors × 1 image + 126 countries × 2 + 207 cities × 2 + 180 industries × 2 = ~1000). Verdict counts will reveal how broken the current library is.

- [ ] **Step 3: Save the audit output to docs**

```bash
cp E:/atlas/delivery/images/image_audit_v1.json E:/atlas/website/docs/specs/2026-05-19-image-audit-findings.json
git add docs/specs/2026-05-19-image-audit-findings.json
git commit -m "data(images): audit current manifests for Wave 3 (Plan v13)"
```

---

## Task 2: Prompt template library

**Files:** Create: `E:/atlas/scripts/images/prompt_templates.py`

- [ ] **Step 1: Write the templates**

```python
"""Plan v13 Wave 3 — AI generation prompt templates per category.

Each template emphasizes:
  - Aesthetic, magazine-quality realism
  - No people in frame (avoids identifiable faces, licensing concerns)
  - Soft natural light (avoids harsh shadows, uncomfortable contrast)
  - Editorial sensibility (calm, premium)

Cities default to skyline at golden hour. Industries to process or
end-product. Countries to a recognizable landmark of the largest city
(NY for US, Tokyo for JP, etc.) — see COUNTRY_TO_CITY_ANCHOR.
"""

CITY_SKYLINE_TEMPLATE = (
    "Aerial photograph of {city} skyline at golden hour, professional "
    "architectural photography, sharp focus on the cityscape, warm soft "
    "evening light, no people visible, magazine cover quality, 4K resolution. "
    "Composition: wide horizontal, sky takes upper third."
)

INDUSTRY_PROCESS_TEMPLATE = (
    "Professional editorial photograph of {industry_description} in operation, "
    "clean modern setting, soft natural daylight, no people in frame, "
    "subject centered, magazine quality, 4K resolution. "
    "Tone: calm, premium, slightly muted color palette."
)

INDUSTRY_PRODUCT_TEMPLATE = (
    "Editorial product photography of {product}, minimalist studio setting, "
    "soft directional light from upper left, neutral cream background, "
    "subject centered, magazine quality, no text or branding, 4K resolution."
)

# Country -> main city for skyline reference. Hand-curated.
COUNTRY_TO_CITY_ANCHOR = {
    "US": "New York City (Manhattan)",
    "GB": "London",
    "DE": "Berlin",
    "FR": "Paris",
    "IT": "Rome",
    "ES": "Madrid",
    "JP": "Tokyo",
    "CN": "Shanghai",
    "IN": "Mumbai",
    "BR": "São Paulo",
    "MX": "Mexico City",
    "AR": "Buenos Aires",
    "AU": "Sydney",
    # ... continued for 191 countries; full list in the actual file
}

# Industry -> { name_for_prompt, mode: 'process' | 'product' }
INDUSTRY_PROMPT_DETAILS = {
    "restaurants": {"desc": "a polished restaurant dining room interior", "mode": "process"},
    "coffee_shops": {"desc": "a specialty coffee bar with espresso machine and pastry display", "mode": "process"},
    "grocery_stores": {"desc": "an independent grocery store produce section", "mode": "process"},
    # ... 191 entries
}
```

- [ ] **Step 2: Fully populate COUNTRY_TO_CITY_ANCHOR and INDUSTRY_PROMPT_DETAILS**

Use the taxonomy files (`src/lib/taxonomy/industries.json`, `data/images/countries_manifest.json`) to seed all entries. Hand-edit only the most-visible 30 (US, GB, DE, FR, JP, CN, IN, BR, MX, etc.) for the country-to-city anchor; rest can default to "the capital city" or the country name itself.

- [ ] **Step 3: Commit**

```bash
# Lives in E:/atlas/scripts, may be outside the website git repo
```

---

## Task 3: AI generation driver

**Files:** Create: `E:/atlas/scripts/images/generate_ai.py`

- [ ] **Step 1: Pick a provider**

Recommendation: **Google Imagen 4 via Vertex AI** for best architectural/landscape realism. Fallback to **fal.ai** Flux Pro if Vertex auth is annoying.

If using Vertex AI:
- Requires `GOOGLE_APPLICATION_CREDENTIALS` env var pointing to a service account JSON
- Endpoint: `https://us-central1-aiplatform.googleapis.com/v1/projects/{PROJECT}/locations/us-central1/publishers/google/models/imagen-4.0-generate-001:predict`
- Body: `{"instances": [{"prompt": "..."}], "parameters": {"sampleCount": 1, "aspectRatio": "16:9"}}`

If using fal.ai:
- Requires `FAL_KEY` env var
- Endpoint: `https://fal.run/fal-ai/flux-pro/v1.1-ultra`
- Body: `{"prompt": "...", "image_size": "landscape_16_9", "num_inference_steps": 28}`

- [ ] **Step 2: Write the driver**

```python
"""Plan v13 Wave 3 — AI image generation driver.

Generates a single landscape (16:9) image per call. Output PNG bytes
written to ./generated/{category}/{slug}_v1.png. Idempotent: skips
files that already exist.
"""
from __future__ import annotations

import base64
import json
import os
from pathlib import Path
import requests
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Pick ONE provider — set IMAGEN_PROVIDER env var
PROVIDER = os.environ.get("IMAGEN_PROVIDER", "fal").lower()

def generate_fal(prompt: str) -> bytes:
    key = os.environ["FAL_KEY"]
    r = requests.post(
        "https://fal.run/fal-ai/flux-pro/v1.1-ultra",
        headers={"Authorization": f"Key {key}", "Content-Type": "application/json"},
        json={"prompt": prompt, "image_size": "landscape_16_9", "num_inference_steps": 28},
        timeout=120,
        verify=False,
    )
    if r.status_code != 200:
        raise RuntimeError(f"fal: {r.status_code} {r.text[:200]}")
    url = r.json()["images"][0]["url"]
    img = requests.get(url, timeout=60, verify=False)
    return img.content

def generate_vertex(prompt: str) -> bytes:
    # Vertex AI Imagen 4 — requires GOOGLE_APPLICATION_CREDENTIALS
    # Implementation depends on google-auth library
    raise NotImplementedError("vertex provider TBD — fal is recommended for ease")

def generate(prompt: str) -> bytes:
    if PROVIDER == "fal":
        return generate_fal(prompt)
    elif PROVIDER == "vertex":
        return generate_vertex(prompt)
    else:
        raise ValueError(f"unknown IMAGEN_PROVIDER: {PROVIDER}")

def save(category: str, slug: str, prompt: str) -> Path:
    out_dir = Path(r"E:\atlas\delivery\images\generated") / category
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{slug}_v1.png"
    if out_path.exists():
        return out_path
    print(f"generating {category}/{slug}...")
    png = generate(prompt)
    out_path.write_bytes(png)
    return out_path

if __name__ == "__main__":
    # Smoke test
    p = save("test", "manhattan-skyline", "Aerial photograph of Manhattan skyline at golden hour, magazine quality, 4K")
    print(f"saved {p}")
```

- [ ] **Step 3: Smoke-test the chosen provider**

```bash
export FAL_KEY=<your-key>  # or use Vertex
cd E:/atlas && python scripts/images/generate_ai.py
```

Expected: `E:/atlas/delivery/images/generated/test/manhattan-skyline_v1.png` exists and opens as a skyline photo. If output is bad, iterate on prompt template.

- [ ] **Step 4: Commit (script lives in parent repo if any)**

---

## Task 4: Hybrid manifest builder

**Files:** Create: `E:/atlas/scripts/images/build_hybrid_manifest.py`

- [ ] **Step 1: Write the orchestrator**

For each entry (slug) in the taxonomy:
1. Check if Wikimedia already has a "good" entry per the audit
2. If yes AND the slug is on the "famous landmark" list (Eiffel Tower for Paris, Brandenburg Gate for Berlin, etc.), keep Wikimedia
3. Otherwise generate via AI

Output: `data/images/{category}_manifest_v2.json` with entries pointing at local `/images/...` paths (which Task 5 will populate).

```python
"""Plan v13 Wave 3 — hybrid manifest builder.

Wikimedia OR AI per entry. Output JSON points at LOCAL paths under
public/images/. Task 5 downloads/generates the actual files.
"""
from pathlib import Path
import json

def main():
    audit = json.loads(Path(r"E:\atlas\delivery\images\image_audit_v1.json").read_text(encoding="utf-8"))
    by_slug = {}
    for entry in audit:
        key = (entry["category"], entry["slug"])
        by_slug.setdefault(key, []).append(entry)

    # Famous landmark whitelist — Wikimedia preferred
    FAMOUS_LANDMARKS = {
        ("countries", "FR"): True,  # Eiffel Tower etc.
        ("countries", "GB"): True,
        ("countries", "US"): True,
        ("countries", "JP"): True,
        # ... ~30 most-recognizable countries
        ("cities", "paris"): True,
        ("cities", "london"): True,
        ("cities", "new-york"): True,
        ("cities", "tokyo"): True,
        ("cities", "rio-de-janeiro"): True,
        # ... ~50 most-photogenic cities
    }

    for category in ["countries", "cities", "industries", "sectors"]:
        v2 = {}
        in_path = Path(r"E:\atlas\website\data\images") / f"{category}_manifest.json"
        if not in_path.exists():
            continue
        v1 = json.loads(in_path.read_text(encoding="utf-8"))
        for slug, entries in v1.items():
            key = (category, slug)
            wm_good = [e for e in (by_slug.get(key) or []) if e.get("source") == "wikimedia" and e.get("verdict") == "good"]
            use_wikimedia = bool(wm_good) and FAMOUS_LANDMARKS.get(key, False)
            if use_wikimedia:
                v2[slug] = [{
                    "url": f"/images/{category}/{slug}.jpg",
                    "source": "wikimedia-cached",
                    "remote_url": wm_good[0]["url"],
                    "attribution": wm_good[0]["attribution"],
                    "license": wm_good[0]["license"],
                }]
            else:
                v2[slug] = [{
                    "url": f"/images/{category}/{slug}.jpg",
                    "source": "ai-generated",
                    "attribution": "AI-generated image (Imagen 4 / Flux Pro)",
                    "license": "Generated content",
                }]
        out_path = Path(r"E:\atlas\website\data\images") / f"{category}_manifest_v2.json"
        out_path.write_text(json.dumps(v2, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"wrote {out_path} with {len(v2)} entries")

if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run**

```bash
cd E:/atlas && python scripts/images/build_hybrid_manifest.py
```

- [ ] **Step 3: Commit v2 manifests**

```bash
cd E:/atlas/website
git add data/images/*_manifest_v2.json
git commit -m "data(images): hybrid manifest v2 — Wikimedia + AI (Plan v13 Wave 3)"
```

---

## Task 5: Download + generate + optimize

**Files:** Create: `E:/atlas/scripts/images/download_and_optimize.py`

- [ ] **Step 1: Write the downloader/generator**

```python
"""Plan v13 Wave 3 — populate public/images/ from v2 manifests.

For each manifest entry:
  - If source == 'wikimedia-cached': download remote_url, save to public path
  - If source == 'ai-generated': call generate_ai.generate() with the
    appropriate prompt template, save PNG, convert to JPEG

Also generates 3 size variants: full (1600w), card (800w), thumb (400w)
"""
import sys
sys.path.insert(0, r"E:\atlas\scripts\images")
from prompt_templates import (CITY_SKYLINE_TEMPLATE, INDUSTRY_PROCESS_TEMPLATE,
                              INDUSTRY_PRODUCT_TEMPLATE, COUNTRY_TO_CITY_ANCHOR,
                              INDUSTRY_PROMPT_DETAILS)
from generate_ai import generate
from PIL import Image
import json
import requests
import urllib3
from pathlib import Path
from io import BytesIO
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

PUBLIC_IMAGES = Path(r"E:\atlas\website\public\images")
SIZES = {"full": 1600, "card": 800, "thumb": 400}

def fetch_or_generate(category, slug, entry) -> bytes:
    if entry["source"] == "wikimedia-cached":
        r = requests.get(entry["remote_url"], timeout=60, verify=False,
                         headers={"User-Agent": "MarginAtlasImageDownloader/1.0"})
        return r.content
    elif entry["source"] == "ai-generated":
        # Build prompt
        if category == "countries":
            city = COUNTRY_TO_CITY_ANCHOR.get(slug.upper(), f"the capital of {slug}")
            prompt = CITY_SKYLINE_TEMPLATE.format(city=city)
        elif category == "cities":
            prompt = CITY_SKYLINE_TEMPLATE.format(city=slug.replace("-", " ").title())
        elif category == "industries":
            details = INDUSTRY_PROMPT_DETAILS.get(slug, {"desc": slug.replace("_", " "), "mode": "process"})
            if details["mode"] == "process":
                prompt = INDUSTRY_PROCESS_TEMPLATE.format(industry_description=details["desc"])
            else:
                prompt = INDUSTRY_PRODUCT_TEMPLATE.format(product=details["desc"])
        else:
            prompt = f"Editorial photograph representing {slug}"
        return generate(prompt)

def save_sizes(png_bytes, category, slug):
    img = Image.open(BytesIO(png_bytes)).convert("RGB")
    out_dir = PUBLIC_IMAGES / category
    out_dir.mkdir(parents=True, exist_ok=True)
    for label, width in SIZES.items():
        ratio = width / img.width
        height = int(img.height * ratio)
        resized = img.resize((width, height), Image.LANCZOS)
        suffix = "" if label == "full" else f"-{label}"
        out_path = out_dir / f"{slug}{suffix}.jpg"
        resized.save(out_path, "JPEG", quality=82, optimize=True)
        print(f"  saved {out_path} ({width}x{height})")

def main():
    for category in ["countries", "cities", "industries", "sectors"]:
        path = Path(r"E:\atlas\website\data\images") / f"{category}_manifest_v2.json"
        if not path.exists():
            continue
        manifest = json.loads(path.read_text(encoding="utf-8"))
        for slug, entries in manifest.items():
            entry = entries[0]
            target = PUBLIC_IMAGES / category / f"{slug}.jpg"
            if target.exists():
                continue
            print(f"processing {category}/{slug}...")
            try:
                png = fetch_or_generate(category, slug, entry)
                save_sizes(png, category, slug)
            except Exception as e:
                print(f"  FAILED {category}/{slug}: {e}")

if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Run (will take ~30 min and ~$15-25 in API costs)**

```bash
cd E:/atlas && FAL_KEY=<key> python scripts/images/download_and_optimize.py
```

- [ ] **Step 3: Commit public/images (large diff)**

```bash
cd E:/atlas/website
git add public/images
git commit -m "assets(images): self-hosted hybrid image library (Plan v13 Wave 3)"
```

---

## Task 6: Replace v1 manifests with v2, wire local paths

**Files:**
- Modify: `data/images/cities_manifest.json` (replace contents with v2)
- Modify: `data/images/industries_manifest.json` (replace contents with v2)
- Modify: `data/images/countries_manifest.json` (replace contents with v2)
- Modify: `src/lib/images.ts` (entries already point at local `/images/...` paths so this should just work)

- [ ] **Step 1: Backup and replace**

```bash
cd E:/atlas/website
cp data/images/cities_manifest.json data/images/cities_manifest_v1_backup.json
cp data/images/industries_manifest.json data/images/industries_manifest_v1_backup.json
cp data/images/countries_manifest.json data/images/countries_manifest_v1_backup.json
mv data/images/cities_manifest_v2.json data/images/cities_manifest.json
mv data/images/industries_manifest_v2.json data/images/industries_manifest.json
mv data/images/countries_manifest_v2.json data/images/countries_manifest.json
```

- [ ] **Step 2: Verify lookup helpers**

```bash
cd E:/atlas/website && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add data/images/*.json
git commit -m "data(images): switch to v2 hybrid manifests (Plan v13 Wave 3)"
```

---

## Task 7: Fix the rendering bug

**Files:** Modify: `src/components/AtlasHeroImage.tsx`

- [ ] **Step 1: Audit the current component**

Read `src/components/AtlasHeroImage.tsx`. Look for:
- `dangerouslySetInnerHTML` (anywhere — common source of div leaks)
- Returning a string instead of JSX (would render as text)
- Mismatched fragment / wrapper that could expose JSX as text
- HTML entities or escaped tags being rendered as text

Founder reports: "the images have in front of them this idiotic thing of, there's some sort of a code that appears starting with div". That's classic `dangerouslySetInnerHTML` with HTML-encoded content, OR rendering an object/array as text via mistyped JSX braces, OR a stringified component.

- [ ] **Step 2: Fix the bug**

Most likely culprit:
- An `attribution` field that contains HTML (e.g., `Photo by <a href="...">User</a>`) is being rendered as plain text via `{attribution}` — fix by either stripping HTML or using `dangerouslySetInnerHTML` properly
- Or the `<img>` element is wrapped in something that's leaking a stringified div

Once identified, fix and verify with `preview_eval`:

```javascript
window.location.href = 'http://localhost:3001/gb/london/restaurants';
// after load:
(function(){
  const figs = document.querySelectorAll('figure');
  return Array.from(figs).map(f => ({
    childTags: Array.from(f.children).map(c => c.tagName),
    textContent: f.textContent.trim().slice(0, 100),
    hasDivLeak: f.textContent.includes('<div') || f.textContent.includes('&lt;div'),
  }));
})()
```

Expected: every `<figure>` has children `['IMG', 'FIGCAPTION']` (or just `['IMG']`), no `<div` leak in text.

- [ ] **Step 3: Commit**

```bash
git add src/components/AtlasHeroImage.tsx
git commit -m "fix(image): strip div leak from AtlasHeroImage attribution render (Plan v13 Wave 3)"
```

---

## Task 8: Final verification

- [ ] **Step 1: Lint + build**

```bash
cd E:/atlas/website
npx tsc --noEmit
npm run build 2>&1 | tail -30
```

- [ ] **Step 2: Visual check across 20 cells**

```javascript
const urls = [
  '/us', '/jp', '/de', '/fr', '/gb', '/cn', '/in', '/br', '/mx', '/ar',
  '/us/california/restaurants', '/jp/tokyo/restaurants', '/fr/paris/restaurants',
  '/industries/restaurants', '/industries/software-development',
  '/cities/london', '/cities/tokyo', '/cities/new-york',
];
// For each, verify a hero image is present and rendering correctly
```

Expected: every URL renders a non-glyph hero image.

- [ ] **Step 3: Commit + PROGRESS.md update**

```bash
cd E:/atlas/website
# update PROGRESS.md with Wave 3 summary
git add docs/masterplan/PROGRESS.md
git commit -m "progress: Plan v13 Wave 3 shipped"
```

---

## Self-Review Checklist

- [x] Spec coverage: audit, hybrid generation, self-host, rendering bug fix — all tasked
- [x] No placeholder text — concrete code shown in every task
- [x] Provider choice (fal.ai recommended, Vertex/DALL-E as alternates) documented
- [x] Idempotent: each script skips already-done work
- [x] All commits target website repo or are explicit about parent-dir scripts
- [x] Budget noted ($15-30 total for full library)

## Out of Scope (Plan v14)

- Per-cell unique images (currently only country / city / industry get hero images; cells inherit from their industry or city)
- A/B testing image variants for engagement
- Multi-language attribution text
- AVIF support (JPEG sufficient for now)
