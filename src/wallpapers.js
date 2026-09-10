// @ts-check
import collection from './data/wallpapers.json';

/** @typedef {typeof collection.images[number]} Wallpaper */
const base = `https://raw.githubusercontent.com/celadon-theme/wallpapers/${collection.revision}/`;
/** @type {Record<string, string>} */
const variants = { celadon: 'Celadon', 'celadon-powder': 'Powder', 'celadon-jade': 'Jade', 'celadon-sky': 'Sky' };

/** @template {keyof HTMLElementTagNameMap} K @param {K} tag @param {string} className @param {string} [text] */
function element(tag, className, text = '') {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}
/** @template {keyof HTMLElementTagNameMap} K @param {string} id @param {K} tag */
function required(id, tag) {
  const node = document.getElementById(id);
  if (!node || node.localName !== tag) throw new Error(`Missing ${tag}#${id}`);
  return /** @type {HTMLElementTagNameMap[K]} */ (node);
}
const gallery = required('wallpaper-gallery', 'div');
const preview = required('wallpaper-preview', 'section');
const grid = required('wallpaper-grid', 'div');
const back = required('wallpaper-back', 'button');
const status = required('wallpaper-status', 'p');
const image = required('wallpaper-image', 'img');
const desktop = required('wallpaper-desktop', 'a');
const original = required('wallpaper-original', 'a');
let galleryScroll = 0;
/** @type {HTMLButtonElement | null} */
let lastPreview = null;

/** @param {Wallpaper} item */
const category = (item) => item.category.replace(' / ', ' · ');
/** @param {number[]} size */
const dimensions = (size) => size.join(' × ');
/** @param {Wallpaper} item */
const desktopSize = (item) => `${dimensions(item.desktopSize)}${item.upscaled ? ', upscaled' : ''}`;

/** @param {Wallpaper} item @param {HTMLButtonElement} button */
function showPreview(item, button) {
  lastPreview = button;
  galleryScroll = window.scrollY;
  required('wallpaper-title', 'h1').textContent = item.title;
  required('wallpaper-meta', 'p').textContent = `${variants[item.variant]} · ${category(item)}`;
  image.src = base + item.original;
  image.alt = `${item.title} — ${category(item)}`;
  [image.width, image.height] = item.originalSize;
  desktop.href = base + item.desktop;
  desktop.download = item.desktop.split('/').pop() || '';
  original.href = base + item.original;
  original.download = item.original.split('/').pop() || '';
  const sizes = required('wallpaper-sizes', 'p');
  sizes.replaceChildren(document.createTextNode(`Desktop JPEG: ${desktopSize(item)}.`), document.createElement('br'), document.createTextNode(`Original PNG: ${dimensions(item.originalSize)}.`));
  gallery.hidden = true;
  preview.hidden = false;
  window.scrollTo(0, 0);
  back.focus({ preventScroll: true });
}
function showGallery() {
  preview.hidden = true;
  gallery.hidden = false;
  lastPreview?.focus({ preventScroll: true });
  window.scrollTo(0, galleryScroll);
}

for (const item of collection.images) {
  const card = element('article', 'cel-wallpaper-card');
  const button = element('button', 'cel-wallpaper-thumbnail');
  button.type = 'button';
  button.setAttribute('aria-label', `Preview ${item.title}`);
  const thumbnail = element('img', '');
  thumbnail.src = `/wallpapers/${item.preview}`;
  thumbnail.alt = `${item.title} — ${category(item)}`;
  thumbnail.width = 720;
  thumbnail.height = 405;
  thumbnail.loading = 'lazy';
  thumbnail.decoding = 'async';
  button.append(thumbnail);
  button.addEventListener('click', () => showPreview(item, button));
  const caption = element('div', 'cel-wallpaper-caption');
  caption.append(element('h2', '', item.title), element('span', 'cel-tag', variants[item.variant]));
  const bottom = element('div', 'cel-wallpaper-card-bottom');
  const download = element('a', 'cel-wallpaper-download', 'Download ↓');
  download.href = base + item.desktop;
  download.download = item.desktop.split('/').pop() || '';
  download.dataset.wallpaperDownload = '';
  download.setAttribute('aria-label', `Download ${item.title} desktop JPEG, ${desktopSize(item)}`);
  bottom.append(element('span', '', category(item)), download);
  card.append(button, caption, bottom);
  grid.append(card);
}
required('wallpaper-count', 'span').textContent = `${collection.images.length} wallpapers · all four variants`;
required('wallpaper-hero', 'img').src = `/wallpapers/${collection.images[0].preview}`;
back.addEventListener('click', showGallery);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !preview.hidden) showGallery();
});

// Cross-origin image links open in the browser; a blob URL makes the named file download.
let downloading = false;
for (const link of document.querySelectorAll('a[data-wallpaper-download]')) {
  if (!(link instanceof HTMLAnchorElement)) continue;
  link.addEventListener('click', async (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (downloading) return;
    downloading = true;
    const url = link.href;
    const filename = link.download;
    status.textContent = `Preparing ${filename}…`;
    link.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const objectUrl = URL.createObjectURL(await response.blob());
      const save = element('a', '');
      save.href = objectUrl;
      save.download = filename;
      save.click();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
      status.textContent = `Download started: ${filename}`;
    } catch {
      const fallback = element('a', '', 'Open the image to save it manually.');
      fallback.href = url;
      fallback.target = '_blank';
      fallback.rel = 'noopener';
      status.replaceChildren(document.createTextNode('Download failed. '), fallback);
    } finally {
      downloading = false;
      link.removeAttribute('aria-busy');
    }
  });
}
