# Image integrity audit (Plan v24 Block 8)

Generated 2026-05-22T03:42:27.573Z.

Probed 993 unique image URLs across 5 manifests.

## Summary

- ok: **51** (5.1%)
- rate-limited: **942** (94.9%)

## Broken by manifest

## Cleanup mechanism

Broken URLs are listed in `data/quality/broken_images_v1.json`. A future block should add a render-layer filter that excludes any image whose URL appears in that list. Until then the audit data is purely diagnostic.
