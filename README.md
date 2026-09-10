# website

[celadontheme.com](https://celadontheme.com) — the Celadon theme showcase and submission site.

Celadon is a sage-green theme family for terminals (variants: **Sky**, **Powder**,
**Celadon**, **Jade**). This repo is the marketing/showcase site; the theme itself
lives at [celadon-theme/celadon-theme](https://github.com/celadon-theme/celadon-theme).

## Stack

- Plain multi-page static HTML/CSS/JS — no framework.
- [Vite](https://vitejs.dev) for the dev server and the production build.
- Deployed on **Netlify** (`netlify.toml`).

## Develop

```bash
npm install
npm run dev           # local dev server with hot reload
npm run build         # production build → dist/
npm run preview       # serve the built dist/ locally
npm run sync-palette  # regenerate public/celadon-theme.js from the theme's ports/json
```

## Structure

```
index.html            Home
palette.html          Palette — swatch stack, accents, spec table (rendered by src/palette.js)
ports.html            Ports directory
wallpapers.html       Wallpaper gallery, previews and downloads
contribute.html       How to submit a port
404.html              themed not-found page (Netlify serves it automatically)
public/
  celadon-theme.js    GENERATED — variant palettes + live re-theming via CSS variables
  brand/              logo
  photos/             original Unsplash references (no longer requested by pages)
  fonts/              licenses for the self-hosted fonts
  favicon.svg, icon-*.png, site.webmanifest …   favicon set, served at the site root
scripts/
  sync-palette.mjs    writes public/celadon-theme.js from celadon-theme/ports/json
src/
  assets/             optimized wallpaper WebPs and Latin WOFF2 font subsets
  styles/base.css     shared typography, radii and resets
  styles/fonts.css    local font-face declarations
  styles/ds.css       original Organic design reference (not shipped in page CSS)
  styles/site.css     the site's own CSS: --cel-* tokens, components, responsive collapses
  main.js             shared interactivity: variant switching, bound labels, copy buttons
  palette.js          Palette page rendering (hex / RGB / OKLCH / APCA per role)
  color.js            APCA + OKLCH math
  clipboard.js        copy-with-feedback helper
vite.config.js        multi-page build inputs
netlify.toml          build command, clean-URL rewrites, asset caching
```

## Colors come from the theme

`public/celadon-theme.js` is generated, never hand-edited. It maps the
generator's JSON roles (`base`, `surface`, `overlay`, `muted`, `subtle`,
`text`, accents, `br_*`) onto the site's `--cel-*` custom properties, and
derives the one role the generator doesn't have (`border`). When the palette
changes upstream:

```bash
npm run sync-palette                      # fetches ports/json from GitHub main
npm run sync-palette -- ../celadon-theme/ports/json   # or from a local checkout
```

The chosen variant is stored in `localStorage["celadon-variant"]` and applied
in `<head>` before first paint, so it persists across pages without a flash.
With no saved choice the site follows the OS color scheme: Sky in light mode,
Celadon otherwise.

## Design source

The pages are hand-compiled from the **Celadon v2** Claude Design handoff
(`Home v2.dc.html`, `Palette v2.dc.html`, `Ports v2.dc.html`,
`Contribute v2.dc.html`). Those files are design references, not production
code; this repo is the implementation:

- `<x-dc>` / `<sc-for>` / `{{ … }}` templating → plain HTML + `src/*.js`.
- Fake `style-hover="…"` attributes → real `:hover` / `:focus-visible` CSS.
- Desktop-only grids → a phone layout below 860px plus a narrow-phone tweak below 380px (the `responsive` blocks in `src/styles/site.css`).

The design-system `ds.css` remains a vendored reference. Pages load only the foundations
they use from `base.css`, plus the shared site components.

## Artwork and fonts

Headers use the existing Celadon wallpaper collection: Glaze Tide (Home),
Paper Garden (Wallpapers), Pigment Bloom (Palette), Sage Assembly (Ports), and Fern Study
(Contribute). The Palette accent section uses a solid surface for judging colors.
No new artwork was generated for the site. Interior-page headers share title sizing
and `--cel-header-top` / `--cel-header-bottom` spacing; Palette keeps its swatch
column within that shared alignment. Home retains its separate hero layout.

`src/assets/wallpapers/` contains 720px and 1440px WebP derivatives of the pinned
originals. Vite fingerprints them for immutable caching. Header `srcset` images
are declared in HTML with high fetch priority; gallery thumbnails are lazy below
the first row. Wallpaper detail views also use these local images, with a cached
thumbnail behind the larger preview. Only explicit original/desktop downloads
request GitHub files. The artwork license is in `public/wallpapers/LICENSE`.

After syncing the collection, regenerate display assets with **cwebp** (libwebp)
installed locally:

```bash
npm run optimize-wallpapers
```

This downloads originals at `src/data/wallpapers.json`'s pinned revision and
writes the optimized WebPs. Commit those assets alongside any collection update.
Normal development and production builds need neither network access nor cwebp.
If changing a header selection, update its `src` and both `srcset` paths together.

Caprasimo, Figtree and JetBrains Mono are self-hosted Latin WOFF2 subsets from
Google Fonts. Figtree and JetBrains Mono cover weights 400–700. The heading and
body faces are preloaded; `font-display: swap` keeps text available during loading.
Licenses are served from `public/fonts/`; browser display needs no font service.

The former Unsplash photos remain in `public/photos/` as references, but no page
loads them. Credits: `pine-mist.jpg` — Luca Bravo (xvDpZ5x0S-o), `fern-rock.jpg` —
Roman Petrov (HeJlgEYZUR4), `moss-floor.jpg` — Daniil Silantev (y0VQWlV71os),
`lichen-rock.jpg` — Alexey Melechin (yZhDAPwB0As), all under the Unsplash License.

## Website contrast

The generated theme palette is unchanged. Website secondary text and small accent
labels use separate `--cel-text-*` tokens, including darker accents on Sky's raised
surfaces. Swatch labels prefer the variant's foreground/field, falling back to
black or white when necessary to meet 4.5:1. Displayed APCA values still measure
the actual theme roles against the field.

## Deploy

Netlify: build command `npm run build`, publish directory `dist`. Pages link to
clean URLs (`/palette`, `/ports`, `/wallpapers`, `/contribute`); `netlify.toml` rewrites them
to the built `.html` files. The pinned Node version is 24 (`netlify.toml`).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). This repo is only the website — theme,
port and color issues belong in the
[celadon-theme repo](https://github.com/celadon-theme/celadon-theme).

## License

MIT — see [LICENSE](LICENSE).

## Wallpaper gallery

`/wallpapers` reuses the Ports/Contribute artwork header and the shared variant picker.
The picker changes the site appearance; it never filters the collection. Select a
wallpaper for a local display preview, dimensions, and JPEG/PNG downloads.
Original-resolution files remain in the wallpaper repo.

`src/data/wallpapers.json` is a generated snapshot of the
[wallpaper manifest](https://github.com/celadon-theme/wallpapers/blob/main/manifest.json).
The production build bundles this local data and needs no GitHub request. To update:

```bash
npm run sync-wallpapers           # latest main, resolved to a commit SHA
npm run sync-wallpapers -- <sha>  # a specific full commit SHA
npm run optimize-wallpapers      # regenerate local display images; requires cwebp
npm test
npm run build
```

Commit the generated JSON and `src/assets/wallpapers/` together. The sync script
validates metadata before writing the snapshot. Image URLs use that same revision,
so later upstream changes cannot mix metadata and files.
Adding wallpapers upstream becomes visible after syncing and deploying the website.
Original and desktop sizes and the upscaled label come from the manifest.

Artwork is AI-generated and MIT licensed by Celadon Theme; see the upstream
[license](https://github.com/celadon-theme/wallpapers/blob/main/LICENSE) and
[prompts](https://github.com/celadon-theme/wallpapers/blob/main/PROMPTS.md).
