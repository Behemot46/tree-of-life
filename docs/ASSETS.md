# Assets

This document tracks image sources, licenses, and credits for all media used in the project.

---

## Current Assets

| File | Description | Source | License |
|------|-------------|--------|---------|
| `assets/placeholder.svg` | Fallback image for missing species photos | Generated (inline SVG) | N/A |

---

## Runtime Images (fetched dynamically)

Species photos are loaded at runtime from external APIs. No images are bundled in the repository.

### Sources

| Source | API | License |
|--------|-----|---------|
| iNaturalist | `api.inaturalist.org/v1/taxa` | CC BY-NC (most observations) — attribution shown in panel |
| Wikipedia | `en.wikipedia.org/api/rest_v1/page/summary` | CC BY-SA — thumbnails are Wikimedia Commons images |

### Attribution Requirements

- **iNaturalist photos:** Attribution string is included in each photo object (`photo.attribution`). The panel must display this attribution below each photo.
- **Wikipedia thumbnails:** Attribution is implicit via the Wikipedia link shown in the panel.

---

## Adding Local Assets

If you add a local image file:

1. Place it in `assets/`
2. Use attribution format: `Author Name, License, Source URL`
3. Add an entry to this table

---

## Icon and UI Assets

The project uses no icon library. All UI icons (expand/collapse, close, theme toggle) are rendered as Unicode characters or inline SVG within the HTML/CSS.

---

## Future Asset Guidelines

- Prefer CC0 or CC BY images when possible
- Always record the source URL and license before adding any image
- Do not bundle images larger than 200KB
- Use WebP format for any locally stored photos
