# Contributing to the Celadon website

This repo is the **Celadon showcase site** ([celadontheme.com](https://celadontheme.com)) —
a small static site built with Vite. The theme itself (palettes, the generator, and the
app ports) lives in **[celadon-theme/celadon-theme](https://github.com/celadon-theme/celadon-theme)**.

## Where does my contribution go?

- **A new app port, a color that looks wrong, a palette question** → the
  [theme repo](https://github.com/celadon-theme/celadon-theme/issues), not here.
  This site only renders what that project produces.
- **The website itself** — a layout bug, a broken link, copy, accessibility, a
  new page, or flipping a "Planned" port card to live once its port ships → here.

## Dev setup

Requires Node ≥ 22 (CI and the production build run on Node 24).

```bash
npm install
npm run dev      # local dev server with hot reload
npm run build    # production build → dist/
npm run preview  # serve the built dist/ locally
```

## How the site is built

- Plain multi-page static HTML/CSS/JS — no framework. Each page is its own
  `.html` file; shared styling lives in `src/styles/`, behavior in `src/main.js`.
- Pages are **hand-compiled from a Claude Design source** (`.dc.html`). Keep the
  markup plain and token-driven — take colors, fonts and radii from the CSS
  variables (`--cel-*`, `--font-*`, `--radius-*`); don't introduce new hard-coded
  hexes or px values the tokens already carry.
- `public/celadon-theme.js` (the variant palettes) and `src/styles/ds.css` are
  **vendored from the design system** — treat them as generated. Change the
  source, not the vendored copy.

## Adding or updating a port card

Ports are listed in `ports.html`. A shipped port is an `<a class="cel-port">`
that links to its folder in the theme repo; a not-yet-shipped one is a
`<div class="cel-port cel-port-planned">` with a `Planned` tag and no link. When
a port ships, swap the `<div>` for the `<a>` and add the `href`.

## Pull requests

- One focused change per PR; keep the diff tight.
- `npm run build` must pass — the Netlify deploy preview builds every PR.
- Attach a screenshot for anything visual, checked in both a light (Sky) and a
  dark (Celadon) variant.
- Be kind — see the [Code of Conduct](CODE_OF_CONDUCT.md).
