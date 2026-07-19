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
npm run dev      # local dev server with hot reload
npm run build    # production build → dist/
npm run preview  # serve the built dist/ locally
```

## Structure

```
index.html            Home page (implemented from the design)
palette.html          \
ports.html             > placeholder pages (nav destinations; full versions TBD)
contribute.html       /
404.html              themed not-found page (Netlify serves it automatically)
public/
  celadon-theme.js    variant palettes + live re-theming via CSS variables
  assets/             logo and static assets, served at the site root
src/
  styles/ds.css       "Organic" design-system tokens (Caprasimo/Figtree, radii, shadows)
  styles/site.css     Celadon --cel-* tokens + interactive/responsive CSS
  main.js             Home interactivity: variant switching + copy-to-clipboard
vite.config.js        multi-page build inputs
netlify.toml          build command + publish dir + asset caching
```

## Design source

The pages are implemented from a Claude Design project — **"Theme showcase and
submission site"**. The source there is authored in a `.dc.html`
design-compiler format (`Home.dc.html`, `Palette.dc.html`, `Ports.dc.html`,
`Contribute.dc.html`) that renders inside the Claude Design previewer. This repo
is the hand-compiled, production implementation of that design:

- `<x-dc>` / `<sc-for>` / `{{ … }}` templating → plain HTML + `src/main.js`.
- Fake `style-hover="…"` attributes → real `:hover` / `:focus-visible` CSS.
- Desktop-only fixed grids → responsive breakpoints.

`celadon-theme.js` and the design-system `styles.css` are vendored verbatim from
that project. To implement the remaining pages, pull their `.dc.html` source from
the design project and compile them the same way.

## Deploy

Netlify: build command `npm run build`, publish directory `dist`. Point the
`celadontheme.com` domain at the Netlify site. The pinned Node version is 20
(`netlify.toml`).
