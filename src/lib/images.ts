// Single source for build-time-optimized gallery images.
//
// Raquel's photos live in src/assets/images and are optimized by astro:assets.
// Both the homepage works grid and the art-directed content blocks resolve a
// filename string (as stored by the Tina ImagePicker) to its ImageMetadata here,
// so there is exactly one glob and one filename→image map in the codebase.
//
// Note: this is the *gallery* pipeline (filename → optimized). Media-manager
// uploads (Tina `image` field → /uploads/*) are a separate, deliberate pipeline
// and are served as-is, not through this map.
import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

export const byFilename: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [path.split('/').pop()!, mod.default]),
);

export const resolveImage = (name?: string): ImageMetadata | undefined =>
  name ? byFilename[name] : undefined;
