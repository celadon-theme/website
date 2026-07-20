// Site interactivity, compiled from the design's DCLogic components. Every page
// loads this module; each block is guarded by the elements it needs:
// - variant switching (nav pills) — every page.
// - Home: repaint variant-card swatches from the live palette so the static
//   fallback hexes can't silently drift.
// - Palette: keep the hex labels + intro slug in sync with the variant, and
//   copy a role's hex on click.
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

/* ── palette page ──────────────────────────────────────────────
   Swatch chips are colored with var(--cel-<role>), so they retheme for free.
   Here we only keep the hex *labels* and the intro slug in sync with the
   current variant, and copy the current hex when a swatch is clicked. */
const hexEls = document.querySelectorAll('[data-hex-for]');
if (C && hexEls.length) {
  const slugEl = document.getElementById('cel-palette-variant');
  let copiedTimer = null;

  const paintHexes = (name) => {
    const colors = C.variants[name]?.colors || {};
    for (const el of hexEls) {
      if (el.classList.contains('is-copied')) continue; // don't clobber a live "copied!"
      el.textContent = colors[el.dataset.hexFor] || '';
    }
    if (slugEl) slugEl.textContent = name;
  };

  for (const el of pickers) el.addEventListener('click', () => paintHexes(el.dataset.variantPick));
  paintHexes(C.current());

  for (const card of document.querySelectorAll('.cel-swcard[data-role]')) {
    card.addEventListener('click', async () => {
      const role = card.dataset.role;
      const label = card.querySelector('[data-hex-for]');
      const hex = C.variants[C.current()]?.colors[role];
      if (!hex || !label) return;
      try {
        await navigator.clipboard.writeText(hex);
        clearTimeout(copiedTimer);
        label.textContent = 'copied!';
        label.classList.add('is-copied');
        copiedTimer = setTimeout(() => {
          label.classList.remove('is-copied');
          label.textContent = C.variants[C.current()]?.colors[role] || hex;
        }, 1400);
      } catch { /* clipboard unavailable */ }
    });
  }
}
