// @ts-check
/** @typedef {{slug:string,title:string,variant:string,category:string,original:string,originalSize:number[],desktop:string,desktopSize:number[],preview:string,upscaled:boolean}} Wallpaper */
const variants = new Set(['celadon', 'celadon-sky', 'celadon-powder', 'celadon-jade']);

/** Validate upstream data before it becomes site content. @param {unknown} source @returns {Wallpaper[]} */
export function parseWallpapers(source) {
  if (!source || typeof source !== 'object' || !('images' in source) || !Array.isArray(source.images) || !source.images.length) {
    throw new Error('Wallpaper manifest must contain images');
  }
  const slugs = new Set();
  return source.images.map((image) => {
    if (!image || typeof image !== 'object') throw new Error('Invalid wallpaper');
    for (const key of ['slug', 'title', 'variant', 'category']) {
      if (typeof image[key] !== 'string' || !image[key].trim()) throw new Error(`Missing wallpaper ${key}`);
    }
    if (!/^[a-z0-9-]+$/.test(image.slug) || slugs.has(image.slug)) throw new Error(`Invalid or duplicate slug: ${image.slug}`);
    slugs.add(image.slug);
    if (!variants.has(image.variant)) throw new Error(`Unknown variant: ${image.variant}`);
    for (const [key, directory, extension] of [['preview', 'previews', 'jpg'], ['desktop', 'desktop-4k', 'jpg'], ['original', 'originals', 'png']]) {
      if (typeof image[key] !== 'string' || !new RegExp(`^${directory}/[a-z0-9-]+\\.${extension}$`).test(image[key])) {
        throw new Error(`Invalid wallpaper ${key} path`);
      }
    }
    for (const key of ['originalSize', 'desktopSize']) {
      if (!Array.isArray(image[key]) || image[key].length !== 2 || !image[key].every((n) => Number.isSafeInteger(n) && n > 0)) {
        throw new Error(`Invalid wallpaper ${key}`);
      }
    }
    if (typeof image.upscaled !== 'boolean') throw new Error('Missing upscaled flag');
    const { slug, title, variant, category, original, originalSize, desktop, desktopSize, preview, upscaled } = image;
    return { slug, title, variant, category, original, originalSize, desktop, desktopSize, preview, upscaled };
  });
}
