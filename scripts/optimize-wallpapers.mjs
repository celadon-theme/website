// @ts-check
// Run after sync-wallpapers. Requires cwebp (libwebp); production builds stay offline.
import { readFile, mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseWallpapers } from './wallpaper-manifest.mjs';

const collection = JSON.parse(await readFile(new URL('../src/data/wallpapers.json', import.meta.url), 'utf8'));
if (!/^[a-f0-9]{40}$/.test(collection.revision)) throw new Error('Expected a full wallpaper commit SHA');
const images = parseWallpapers(collection);
execFileSync('cwebp', ['-version']);
const output = new URL('../src/assets/wallpapers/', import.meta.url);
const temporary = await mkdtemp(join(tmpdir(), 'celadon-artwork-'));
try {
  await mkdir(output, { recursive: true });
  for (const item of images) {
    const url = `https://raw.githubusercontent.com/celadon-theme/wallpapers/${collection.revision}/${item.original}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw new Error(`${item.slug}: HTTP ${response.status}`);
    const input = join(temporary, `${item.slug}.png`);
    await writeFile(input, new Uint8Array(await response.arrayBuffer()));
    for (const width of [720, 1440]) {
      execFileSync('cwebp', ['-quiet', '-q', '78', '-resize', String(width), '0', input,
        '-o', fileURLToPath(new URL(`${item.slug}-${width}.webp`, output))]);
    }
    console.log(`Optimized ${item.title}`);
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
