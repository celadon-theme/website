import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseWallpapers } from './wallpaper-manifest.mjs';

const collection = JSON.parse(await readFile(new URL('../src/data/wallpapers.json', import.meta.url), 'utf8'));
const example = collection.images[0];

test('every wallpaper has both local WebP sizes within the display image budget', async () => {
  for (const image of parseWallpapers(collection)) {
    for (const width of [720, 1440]) {
      const bytes = await readFile(new URL(`../src/assets/wallpapers/${image.slug}-${width}.webp`, import.meta.url));
      assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
      assert.ok(bytes.length <= 80000, `${image.slug}-${width} exceeds the 80 KB image budget`);
    }
  }
});

test('published collection preserves dimensions and upscaling without generation prompts', () => {
  const result = parseWallpapers(collection);
  assert.equal(result.length, collection.images.length);
  assert.deepEqual(result[0].desktopSize, [3840, 2160]);
  assert.deepEqual(result[0].originalSize, [1672, 941]);
  assert.equal(result[0].upscaled, true);
  assert.equal('prompt' in parseWallpapers({ images: [{ ...example, prompt: 'private generation text' }] })[0], false);
});

test('asset paths cannot escape the wallpaper repository or preview directory', () => {
  for (const preview of ['../secret.jpg', 'https://other.example/image.jpg', 'previews/../../secret.jpg', 'previews/%2e%2e.jpg']) {
    assert.throws(() => parseWallpapers({ images: [{ ...example, preview }] }), /path/);
  }
});

test('invalid metadata fails before sync writes files', () => {
  for (const patch of [{ originalSize: [0, 941] }, { desktopSize: [3840] }, { variant: 'unknown' }, { upscaled: undefined }]) {
    assert.throws(() => parseWallpapers({ images: [{ ...example, ...patch }] }));
  }
  assert.throws(() => parseWallpapers({ images: [example, example] }), /duplicate/);
  assert.throws(() => parseWallpapers({ images: [] }), /images/);
});
