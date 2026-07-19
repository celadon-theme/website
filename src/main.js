// Home page interactivity, compiled from the design's DCLogic component:
// variant switching — nav pills + variant cards drive window.CELADON.
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
