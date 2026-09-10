// @ts-check
import { mkdir, writeFile } from 'node:fs/promises';
import { parseWallpapers } from './wallpaper-manifest.mjs';

async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response;
}

// Pin metadata and every file to one revision so later upstream edits cannot mix releases.
const revision = process.argv[2] || (await (await get('https://api.github.com/repos/celadon-theme/wallpapers/commits/main')).json()).sha;
if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error('Expected a full wallpaper commit SHA');
const base = `https://raw.githubusercontent.com/celadon-theme/wallpapers/${revision}/`;
const images = parseWallpapers(await (await get(`${base}manifest.json`)).json());
const license = await (await get(`${base}LICENSE`)).text();
await mkdir(new URL('../public/wallpapers/', import.meta.url), { recursive: true });
await writeFile(new URL('../public/wallpapers/LICENSE', import.meta.url), license);
await writeFile(new URL('../src/data/wallpapers.json', import.meta.url), JSON.stringify({ revision, images }, null, 2) + '\n');
console.log(`Synced ${images.length} wallpapers from ${revision}`);
