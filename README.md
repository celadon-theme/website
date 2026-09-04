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
contribute.html       How to submit a port
404.html              themed not-found page (Netlify serves it automatically)
public/
  celadon-theme.js    GENERATED — variant palettes + live re-theming via CSS variables
  brand/              logo
  photos/             self-hosted Unsplash photography (see Photos)
  favicon.svg, icon-*.png, site.webmanifest …   favicon set, served at the site root
scripts/
  sync-palette.mjs    writes public/celadon-theme.js from celadon-theme/ports/json
src/
  styles/ds.css       "Organic" design-system tokens (Caprasimo/Figtree, radii, shadows)
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

## Design source

The pages are hand-compiled from the **Celadon v2** Claude Design handoff
(`Home v2.dc.html`, `Palette v2.dc.html`, `Ports v2.dc.html`,
`Contribute v2.dc.html`). Those files are design references, not production
code; this repo is the implementation:

- `<x-dc>` / `<sc-for>` / `{{ … }}` templating → plain HTML + `src/*.js`.
- Fake `style-hover="…"` attributes → real `:hover` / `:focus-visible` CSS.
- Desktop-only grids → responsive collapses below ~1024px and ~640px.

The design-system `ds.css` is vendored verbatim from that project.

## Photos

Four Unsplash photographs (Unsplash License), self-hosted in `public/photos/`
at 1920px wide. Credits stay in the corner of each photo section.

| File              | Photographer    | Unsplash                                |
| ----------------- | --------------- | --------------------------------------- |
| `pine-mist.jpg`   | Luca Bravo      | https://unsplash.com/photos/xvDpZ5x0S-o |
| `fern-rock.jpg`   | Roman Petrov    | https://unsplash.com/photos/HeJlgEYZUR4 |
| `moss-floor.jpg`  | Daniil Silantev | https://unsplash.com/photos/y0VQWlV71os |
| `lichen-rock.jpg` | Alexey Melechin | https://unsplash.com/photos/yZhDAPwB0As |

## Deploy

Netlify: build command `npm run build`, publish directory `dist`. Pages link to
clean URLs (`/palette`, `/ports`, `/contribute`); `netlify.toml` rewrites them
to the built `.html` files. The pinned Node version is 24 (`netlify.toml`).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). This repo is only the website — theme,
port and color issues belong in the
[celadon-theme repo](https://github.com/celadon-theme/celadon-theme).

## License

MIT — see [LICENSE](LICENSE).
