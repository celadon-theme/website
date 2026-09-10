# Site review — September 10, 2026

Reviewed all six pages, four theme variants, and desktop/mobile layouts. Changes
are implemented locally; nothing has been deployed.

## Findings and changes

| Page | Finding | Change |
| --- | --- | --- |
| Home | Large background photo; faint terminal labels; terminal wrapping shifts content when fonts arrive | Local Glaze Tide artwork, clearer labels, stable terminal lines with horizontal scrolling |
| Palette | Kicker disappears into photography; some swatch labels fail contrast; photo competes with accents | Solid kicker background, stronger text overlay, readable swatch ink, Pigment Bloom header, plain accent section, reserved stack height |
| Ports | Largest hero image; weak small labels and Sky badges | Sage Assembly header, stronger secondary text and badge colors |
| Contribute | Heavy image; low-contrast instructions and links in cards | Fern Study header, clearer instructions and links |
| Wallpapers | Small hero stretched across desktop; detail view waits for remote original PNG; hero reassigned by JS | Paper Garden header and responsive local WebPs for hero/gallery/detail, cached thumbnail behind detail, fixed HTML hero source; full-resolution downloads remain available |
| 404 | Same faint footer and shared navigation/font issues | Shared contrast, keyboard and font fixes; recovery link verified |

The palette data and displayed APCA measurements are unchanged. Website copy uses
separate contrast tokens. Swatches use theme ink when it reaches 4.5:1, otherwise
black or white. Sky links and status labels use darker colors on raised surfaces.

The original photos were already self-hosted; their size was the problem. Existing
Celadon wallpapers suit the identity and avoid another asset-generation workflow.
No new images were generated. Original photo files remain available as references.

## Image weight

Actual encoded file sizes; desktop hero comparison:

| Page | Previous JPEG | Current WebP | Reduction |
| --- | ---: | ---: | ---: |
| Home | 466 KB | 21 KB | 95.5% |
| Palette | 853 KB | 44 KB | 94.9% |
| Ports | 1,153 KB | 9 KB | 99.2% |
| Contribute | 696 KB | 28 KB | 96.0% |

The additional 696 KB Palette accent photo is no longer loaded. Responsive 720px
versions are 3–17 KB for these headers. All eight gallery images have 720/1440px
local versions, each below 48 KB. Vite fingerprints assets for the existing
immutable cache policy. No images are duplicated as base64 in HTML or JavaScript.

Fonts are now local WOFF2 subsets, with the heading/body faces preloaded and
licenses included. The unused vendored design components stay in the reference
file but are omitted from page CSS. Shared compressed CSS falls from about 6.9 KB
to 6.0 KB. No framework or production dependency was added.

Images remain discoverable in initial HTML with responsive source selection and
high fetch priority. This follows Google's guidance on [optimizing LCP resource
loading](https://web.dev/articles/optimize-lcp); no image-loading animation masks a
late request.

## Local performance check

Production builds served locally in headless Edge, empty browser contexts,
cache disabled, 1.6 Mbps download, 150 ms latency, 4× CPU slowdown. These are single
lab samples, not production field data or a Lighthouse score. Mobile viewport:
390px, device scale factor 2. These measurements predate the follow-up header
reassignment and header alignment: Paper Garden moved to Wallpapers, Palette now
uses Pigment Bloom, and all four interior pages share title sizing and vertical spacing.

| Page | Before LCP | After LCP | Before layout shift | After layout shift |
| --- | ---: | ---: | ---: | ---: |
| Home | 3.22 s | 0.85 s | 0.087 | 0.001 |
| Palette | 8.60 s | 1.02 s | 0.251 | <0.001 |
| Ports | 6.59 s | 0.68 s | 0.002 | 0.002 |
| Contribute | 4.31 s | 0.85 s | <0.001 | 0.001 |
| Wallpapers | 0.60 s | 0.88 s | <0.001 | <0.001 |
| 404 | 0.47 s | 0.63 s | 0.003 | 0.004 |

The large-photo pages improve substantially. The already-small Wallpapers/404
pages do not improve in this single timing sample. Navigation now reserves its
rows before fonts arrive; very narrow phones use two readable rows. Hero buttons reserve their rows too. The keyboard-accessible terminal
keeps its lines intact instead of rewrapping during font loading.

## Verification

- Production build and all six Node tests pass, including swatch contrast across
  every theme and an 80 KB budget for each generated display image.
- 48 axe checks: six pages × four themes × desktop/mobile. No WCAG A/AA violations
  reported in the checked content. The decorative, `aria-hidden` footer wordmark
  is excluded; its deliberately faint lettering remains.
- 120 layout combinations at 320, 390, 860, 1024 and 1440px: no page overflow or
  unintended content escaping the viewport.
- No browser exceptions or failed local resources in the page sweep.
- Keyboard skip link, theme persistence, copy buttons, Escape and focus restoration
  verified. Reduced-motion preference disables transitions.
- All eight wallpaper detail views load with external requests blocked. Download
  success and failure fallback verified with mocked responses.

Visual review covers all pages. Automated checks are limited to Chromium/Edge;
Safari/Firefox and actual Netlify cache/redirect behavior still need deployment
preview verification. Original-resolution downloads continue to depend on GitHub.

## Screenshots

[Home](screenshots/review-home-1440.jpg) ·
[Home, mobile](screenshots/review-home-390.jpg) ·
[Palette, Sky](screenshots/review-palette-1440.jpg) ·
[Palette, mobile Celadon](screenshots/review-palette-390.jpg) ·
[Ports](screenshots/review-ports-1440.jpg) ·
[Contribute](screenshots/review-contribute-1440.jpg) ·
[Wallpapers](screenshots/review-wallpapers-1440.jpg) ·
[404](screenshots/review-404-390.jpg)

Asset update instructions are in [README](../README.md#artwork-and-fonts).
