// Generates small WebP thumbnails of the gallery source images so the TinaCMS
// custom image-picker field can show a visual grid in the /admin sidebar.
// The site build still uses the full-resolution originals in src/assets/images
// via astro:assets — these thumbnails are ONLY for the editor UI.
// Output: public/gallery-thumbs/<name>.webp + manifest.json (served at /gallery-thumbs/).
// Wired to npm predev/prebuild so it stays in sync automatically.
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const SRC = 'src/assets/images';
const OUT = 'public/gallery-thumbs';
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => EXTS.has(extname(f).toLowerCase()));

const manifest = [];
for (const file of files) {
  const thumb = basename(file, extname(file)) + '.webp';
  await sharp(join(SRC, file))
    .resize(360, 360, { fit: 'cover' })
    .webp({ quality: 72 })
    .toFile(join(OUT, thumb));
  manifest.push({ file, thumb: `/gallery-thumbs/${thumb}` });
}
manifest.sort((a, b) => a.file.localeCompare(b.file));
await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`synced ${manifest.length} thumbnails -> ${OUT}`);
