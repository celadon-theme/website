import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { contrastRatio, swatchInk } from '../src/color.js';

test('WCAG contrast has the standard black/white endpoints', () => {
  assert.equal(contrastRatio('#000000', '#ffffff'), 21);
  assert.equal(contrastRatio('#ffffff', '#ffffff'), 1);
});

test('every palette swatch has readable small text without changing its color', () => {
  const context = { window: {}, document: { documentElement: { style: { setProperty() {} }, setAttribute() {} }, querySelector() {} } };
  runInNewContext(readFileSync(new URL('../public/celadon-theme.js', import.meta.url), 'utf8'), context);
  for (const { colors } of Object.values(context.window.CELADON.variants)) {
    for (const background of Object.values(colors).filter(value => value.startsWith('#'))) {
      const ink = swatchInk(background, colors.fg, colors.bg);
      assert.ok(contrastRatio(ink, background) >= 4.5, `${ink} on ${background}`);
    }
  }
});
