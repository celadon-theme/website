// Home page interactivity, compiled from the design's DCLogic component:
// - variant switching: nav pills + variant cards drive window.CELADON.
// - swatch paint: variant-card swatches are repainted from the live palette,
//   so the static hexes in index.html can never silently drift out of sync.
// celadon-theme.js has already run (blocking, in <head>) so window.CELADON exists
// and the stored/default variant is applied before this module executes.

const C = window.CELADON;

/* ── variant switching ─────────────────────────────────────── */
const pickers = Array.from(document.querySelectorAll('[data-variant-pick]'));
const termSlug = document.getElementById('cel-term-slug');

function syncActive(name) {
  for (const el of pickers) {
    const on = el.dataset.variantPick === name;
    el.classList.toggle('is-active', on);
    if (el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', String(on));
  }
  if (termSlug) termSlug.textContent = name;
}

for (const el of pickers) {
  el.addEventListener('click', () => {
    const name = el.dataset.variantPick;
    if (C) C.apply(name);
    syncActive(name);
  });
}

// Reflect the variant celadon-theme.js restored from localStorage on load.
if (C) syncActive(C.current());

/* ── swatch paint ──────────────────────────────────────────────
   The variant cards carry hardcoded swatch hexes as a no-JS fallback; repaint
   them from celadon-theme.js (the single source of truth) so a palette change
   there can't leave the cards showing stale colors. Order matches the markup:
   [bg, fg, red, green, yellow, blue], edge = the variant's border. */
if (C) {
  const roles = ['bg', 'fg', 'red', 'green', 'yellow', 'blue'];
  for (const card of document.querySelectorAll('.cel-vcard[data-variant-pick]')) {
    const colors = C.variants[card.dataset.variantPick]?.colors;
    if (!colors) continue;
    card.querySelectorAll('.cel-sw').forEach((sw, i) => {
      sw.style.background = colors[roles[i]];
      sw.style.borderColor = colors.border;
    });
  }
}
