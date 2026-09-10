import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contrastRatio, swatchInk } from '../src/color.js';

test('WCAG contrast has the standard black/white endpoints', () => {
  assert.equal(contrastRatio('#000000', '#ffffff'), 21);
  assert.equal(contrastRatio('#ffffff', '#ffffff'), 1);
});

test('swatch ink keeps the theme foreground when it reads at 4.5:1', () => {
  assert.equal(swatchInk('#131b11', '#c9d5c6', '#131b11'), '#c9d5c6');
});

test('swatch ink prefers the field when it reads better than the foreground', () => {
  assert.equal(swatchInk('#c9d5c6', '#c9d5c6', '#131b11'), '#131b11');
});

test('swatch ink falls back to black or white when neither theme color reads', () => {
  assert.equal(swatchInk('#727e70', '#939f91', '#5a655a'), '#000000');
  assert.equal(swatchInk('#303030', '#404040', '#383838'), '#ffffff');
});
