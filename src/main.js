// Shared interactivity, loaded by every page. celadon-theme.js has already run
// (blocking, in <head>) so window.CELADON exists and the stored/default
// variant is applied before this module executes.
import { copyWithFeedback } from './clipboard.js';

if (window.CELADON) init(window.CELADON);

function init(C) {
  const pad = (n) => String(n).padStart(2, '0');

  /* ── variant switching ───────────────────────────────────────
     Anything with data-variant-pick switches the variant (nav pills, hero
     numerals, grade cards). Anything with data-variant="slug|label|kind|num"
     shows a fact about the current one. Other modules listen for
     `celadon:variant` instead of wiring their own pickers. */
  const pickers = document.querySelectorAll('[data-variant-pick]');
  const bound = document.querySelectorAll('[data-variant]');

  function reflect(name) {
    const v = C.variants[name];
    const facts = { slug: name, label: v.label, kind: v.kind, num: pad(C.order.indexOf(name) + 1) };
    for (const el of pickers) {
      const on = el.dataset.variantPick === name;
      el.classList.toggle('is-active', on);
      if (el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', String(on));
    }
    for (const el of bound) el.textContent = facts[el.dataset.variant] ?? '';
    document.dispatchEvent(new CustomEvent('celadon:variant', { detail: { name } }));
  }

  for (const el of pickers) {
    el.addEventListener('click', () => {
      const name = el.dataset.variantPick;
      if (!C.variants[name]) return;
      C.apply(name);
      reflect(name);
    });
  }
  reflect(C.current());

  /* ── grade cards (home) ──────────────────────────────────────
     Each card is painted in its own variant, whatever the page is showing. */
  const GRADE_ROLES = ['bg', 'fg', 'muted', 'faint', 'accent', 'border', 'red', 'green', 'yellow', 'blue', 'cyan'];
  for (const card of document.querySelectorAll('.cel-grade[data-variant-pick]')) {
    const { colors } = C.variants[card.dataset.variantPick];
    for (const role of GRADE_ROLES) card.style.setProperty(`--g-${role}`, colors[role]);
  }

  /* ── copy buttons ────────────────────────────────────────────
     data-copy-target is a selector for the element whose text gets copied. */
  for (const btn of document.querySelectorAll('[data-copy-target]')) {
    const source = document.querySelector(btn.dataset.copyTarget);
    if (!source) continue;
    btn.addEventListener('click', () => copyWithFeedback(btn, source.textContent, 'Copied', 'Copy'));
  }
}
