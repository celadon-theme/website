// Palette page. The swatch stack, spectrum bar, accent circles and spec table
// are all derived from the live palette (hex, RGB, OKLCH, APCA Lc), so they're
// rendered here and re-rendered on every variant switch. main.js dispatches
// `celadon:variant`; clicking any swatch copies its hex.
import { hexToRgb, apca, oklch, formatOklch, swatchInk } from './color.js';
import { copyWithFeedback } from './clipboard.js';

const ROLES = [
  ['bg', 'the field'], ['surface', 'panels, cards'], ['alt', 'selection, raised chrome'], ['border', 'rules and edges'],
  ['fg', 'body text'], ['muted', 'secondary text'], ['faint', 'comments, disabled'], ['accent', 'the celadon green'],
  ['red', 'errors, deletions'], ['green', 'success, additions'], ['yellow', 'warnings, changes'],
  ['blue', 'info, paths'], ['magenta', 'keywords, branches'], ['cyan', 'strings, links'],
  ['red-b', 'bright red'], ['green-b', 'bright green'], ['yellow-b', 'bright yellow'],
  ['blue-b', 'bright blue'], ['magenta-b', 'bright magenta'], ['cyan-b', 'bright cyan'],
];
const FIELD = ['bg', 'surface', 'alt', 'border', 'faint', 'muted', 'fg', 'accent'];
const ACCENTS = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan'];

const C = window.CELADON;
const stack = document.getElementById('cel-stack');
const spectrum = document.getElementById('cel-spectrum');
const accents = document.getElementById('cel-accents');
const rows = document.getElementById('cel-spec-rows');

if (C && stack && spectrum && accents && rows) {
  for (const el of [stack, accents, rows]) el.addEventListener('click', copyHex);
  document.addEventListener('celadon:variant', (e) => render(e.detail.name));
  render(C.current());
}

function render(name) {
  const c = C.variants[name].colors;
  // Lc of a color on the field; for the field itself, show how body text reads on it.
  const lc = (role) => apca(role === 'bg' ? c.fg : c[role], c.bg);
  const ink = (hex) => swatchInk(hex, c.fg, c.bg);

  stack.innerHTML = FIELD.map((role) => `
    <button type="button" class="cel-tile${role === 'bg' ? ' cel-tile-bg' : ''}" data-hex="${c[role]}"
      style="background:${c[role]};color:${ink(c[role])}" title="Copy ${c[role]}">
      ${role === 'bg' ? `<span class="cel-tile-top">
        <img src="/brand/celadon-${name === 'celadon-sky' ? 'light' : 'dark'}.svg" alt="" width="34" height="34">
        <span class="cel-tile-variant">${name}</span>
      </span>` : ''}
      <span class="cel-tile-row">
        <span class="cel-tile-role">${role}</span>
        <span class="cel-tile-meta"><span class="cel-tile-lc">Lc ${lc(role)}</span><span data-hex-label>${c[role]}</span></span>
      </span>
    </button>`).join('');

  spectrum.style.background = `linear-gradient(90deg,${ROLES.map(([role]) => c[role]).join(',')})`;

  accents.innerHTML = ACCENTS.map((role) => `
    <button type="button" class="cel-accent" data-hex="${c[role]}" title="Copy ${c[role]}">
      <span class="cel-accent-ring" style="background:${c[role]};border-color:${c[`${role}-b`]}"></span>
      <span class="cel-accent-label">
        <span class="cel-accent-name">${role}</span>
        <span class="cel-accent-hex" data-hex-label>${c[role]}</span>
        <span class="cel-accent-bright">bright ${c[`${role}-b`]}</span>
      </span>
    </button>`).join('');

  rows.innerHTML = ROLES.map(([role, desc]) => {
    const hex = c[role];
    const contrast = lc(role);
    const grade = contrast >= 60 ? 'lc-good' : contrast >= 30 ? 'lc-ok' : 'lc-low';
    return `
    <button type="button" class="cel-spec-row" data-hex="${hex}" title="Copy ${hex}">
      <span class="cel-spec-swatch" style="background:${hex}"></span>
      <span><span class="cel-spec-role">${role}</span><span class="cel-spec-desc">${desc}</span></span>
      <span class="cel-spec-hex" data-hex-label>${hex}</span>
      <span class="cel-spec-dim cel-spec-wide">${hexToRgb(hex).join('  ')}</span>
      <span class="cel-spec-dim cel-spec-wide">${formatOklch(oklch(hex))}</span>
      <span class="cel-spec-lc ${grade}">${role === 'bg' ? `${contrast} · fg` : contrast}</span>
    </button>`;
  }).join('');
}

function copyHex(event) {
  const btn = event.target.closest('button[data-hex]');
  if (!btn) return;
  copyWithFeedback(btn.querySelector('[data-hex-label]'), btn.dataset.hex, 'copied', btn.dataset.hex);
}
