# Photography Portfolio — Project Instructions

Self-sufficient. Runnable cold from this folder without Brain.

## What this is

A minimal, editorial **photography portfolio** built as a **reusable template**.
First instance: site #1 under `Projects/website/`. Design reference:
`aitorlaspiur.com` (masthead → responsive image grid with per-image credits → About).

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Astro 6** | zero-JS by default; built-in image optimization (`astro:assets`) |
| Styling | **Tailwind CSS v4** | via **PostCSS** (`postcss.config.mjs`); theme tokens in `src/styles/global.css` |
| Images | `astro:assets` `<Image>` | auto WebP/AVIF + responsive `srcset` + lazy-load |
| CMS | **TinaCMS** (local mode) | visual editor at `/admin`; edits `content/portfolio.json` |
| Visual loop | **Playwright** | `scripts/screenshot.mjs` + `@playwright/mcp` (`.mcp.json`) |
| Hosting | Cloudflare Pages / Vercel / Netlify | not yet wired |

## Run

```bash
npm install
npx playwright install chromium   # once, for the screenshot loop
npm run dev                       # site http://localhost:4321 + CMS http://localhost:4321/admin
npm run dev:astro                 # site only, without the Tina wrapper
npm run build                     # -> dist/
npm run shot                      # screenshot localhost into scripts/_shot.png
```

Editing content: `npm run dev`, open **http://localhost:4321/admin/index.html** (the dev
server does NOT redirect bare `/admin` → 404; use the full `/index.html` path), click
"Enter Edit Mode" → Portfolio. Edit Site fields, edit/reorder/add photos under Works, hit
Save — changes write to `content/portfolio.json` and the site hot-reloads.

> Working preference: **Claude starts the dev server** (`npm run dev` from THIS folder, not
> from Brain/ — that throws ENOENT for missing package.json). Sergio should not have to run it.

## Deploy (Netlify — manual, Claude-controlled)

Live site: **https://1-portfolio-raq.netlify.app** (Netlify project `1-portfolio-raq`,
team "serdomiker's team"). Folder is linked via `.netlify/` (gitignored). `netlify-cli` is
a dev dependency. Auth persists on Sergio's machine from a one-time `npx netlify login`.

The live link updates **only on explicit "push it live"** — never automatically:
```bash
npm run build                              # -> dist/
npx netlify deploy --prod --dir=dist       # publishes dist/ to the live URL
```
**Naming convention: Netlify site name = parent folder name**, normalized to Netlify rules
(lowercase, underscores→hyphens). So folder `1_Portfolio_Raq` → site `1-portfolio-raq`.
Fully automated per instance — no manual naming. For a NEW site, create with
`npx netlify sites:create --name <normalized-folder-name>` then deploy. If the name is
globally taken, append a short unique suffix.

Note: the deployed site is the public-facing portfolio only. `/admin` (Tina) stays a LOCAL
tool in local mode — it won't function on the deployed URL until Tina Cloud is wired.

## Architecture (and how to reuse it)

Content is fully separated from presentation. **One file** holds all content:
`content/portfolio.json` (`{ site, works }`) — edited via the `/admin` GUI or by hand.
`src/data/content.ts` reads it and exports `site` + `worksData` to the components.

Images live in `src/assets/images/` (lowercase-slug filenames, no spaces). The grid in
`src/pages/index.astro` renders each `works` entry by matching its `image` filename to
the optimized asset; an entry whose file is missing is skipped. Works order in the JSON
= display order (drag-reorderable in the CMS).

```
content/portfolio.json   ALL content (site + sections[].works + sections[].blocks) — Tina edits this
tina/config.ts           CMS schema (Site fields, Sections, Works, Content blocks)
src/
  assets/images/      normalized source images (master copies kept in ../Pics)
  components/         Intro · Section · WorkCard · SiteFooter · RichText · Blocks
  data/content.ts     reads content/portfolio.json -> site, sections
  layouts/Base.astro
  pages/              index.astro · about.astro · universo.astro
  styles/global.css   Tailwind import + theme tokens
scripts/screenshot.mjs
Pics/                 original unedited source dump (not used by the build)
Reference/            design reference notes
```

### Editable content model (Tina capabilities wired)
- **`site.about` is rich-text** (Tina WYSIWYG: headings, bold/italic, links, lists, quotes).
  Stored as a Slate AST in the JSON; `src/components/RichText.astro` renders that AST to
  HTML at build time (Astro has no built-in Tina renderer — that component is it).
- **Each section has an optional `blocks` list** (Tina block `templates`): **Text** (rich-text),
  **Quote**, **Feature image**. Empty by default → no visual change until used. Rendered by
  `src/components/Blocks.astro`, dropped in above the works grid in `Section.astro`.
- **Two image pipelines, deliberately separate:**
  - *Gallery works* → `image` is a filename string matched to `src/assets/images/`, optimized
    at build time by `astro:assets`. **Do not** route these through the media manager.
  - *Feature blocks* → real Tina `image` field → uploads to `public/uploads/`, served as-is.
    This is the media-manager/upload demo; it bypasses `astro:assets` (acceptable for the
    occasional full-bleed feature, not for the grid).

### Spin up a NEW site from this template
1. Copy this folder to `Projects/website/<N>_<name>/`.
2. Replace `src/assets/images/*` with the new images (lowercase-slug names, no spaces/dots/parens).
3. Edit `content/portfolio.json` (via `/admin` or directly) — site identity + one `works`
   entry per image. Adjust the schema in `tina/config.ts` only if the fields change.
4. `npm install && npm run dev`.

## Conventions

- Edit theme/spacing tokens in `src/styles/global.css`, not scattered across components.
- Image filenames: lowercase, hyphens only (`la-guinda2-2.jpg`), no spaces/dots/parens —
  Vite import globs require clean paths.
- Keep components presentational; all copy/data comes from `content/portfolio.json` via
  `src/data/content.ts`.

## Visual feedback loop

`@playwright/mcp` is declared in `.mcp.json` and enabled in `.claude/settings.json`
for interactive browsing. For a quick non-interactive capture during a build, run
`npm run shot` (wraps `scripts/screenshot.mjs`) and review `scripts/_shot.png`.

## Known warnings

- Dev/build print "Vite 8 detected, Astro requires Vite 7". Both work fine as-is.
  Don't add the suggested `overrides: {vite: ^7}` unless something actually breaks —
  it can conflict with the rolldown-vite setup.
- Tailwind via PostCSS (not `@tailwindcss/vite`) is deliberate — the Vite plugin is
  incompatible with Astro 6's rolldown-vite (`Missing field tsconfigPaths`).
- TinaCMS runs in **local mode** (no account) — `image` is a filename string, not a
  media-picker, to keep the optimized `astro:assets` pipeline. GUI photo *uploads* need
  an image CDN (e.g. Netlify Image CDN / Cloudinary); add that with the hosting step.
- `tina/__generated__/` and `public/admin/` are generated — gitignored.

## Status

Scaffolded 2026-06-16. 15 reference images wired; build + dev + screenshot loop + TinaCMS
`/admin` all green. Content lives in `content/portfolio.json` — identity/credits are still
placeholders, fill via `/admin`. Hosting not yet set up.
