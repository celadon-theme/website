// Color math for the palette page: sRGB hex → RGB, APCA contrast, OKLCH.

export const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

// APCA-W3 luminance: simple 2.4 power curve plus the soft black clamp.
function apcaY(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => (v / 255) ** 2.4);
  const y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  return y < 0.022 ? y + (0.022 - y) ** 1.414 : y;
}

// APCA contrast (Lc) of `text` on `bg`, as a rounded absolute value.
export function apca(text, bg) {
  const yt = apcaY(text);
  const yb = apcaY(bg);
  const s = yb > yt
    ? (yb ** 0.56 - yt ** 0.57) * 1.14
    : (yb ** 0.65 - yt ** 0.62) * 1.14;
  if (Math.abs(s) < 0.1) return 0;
  return Math.round(Math.abs(s > 0 ? s - 0.027 : s + 0.027) * 100);
}

const linear = (v) => (v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;

export function oklch(hex) {
  const [r, g, b] = hexToRgb(hex).map(linear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(a, bb);
  const H = ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
  return { L, C, H };
}

// "L  C  H°" with the spec table's precision; hue is meaningless near grey.
export function formatOklch({ L, C, H }) {
  const hue = C < 0.005 ? '—' : `${Math.round(H)}°`;
  return `${L.toFixed(2)}  ${C.toFixed(3)}  ${hue}`;
}
