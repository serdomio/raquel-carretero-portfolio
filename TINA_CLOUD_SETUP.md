# Phase 2 — Tina Cloud (remote editing for Raquel)

Goal: Raquel edits the site from a browser (no install), her saves commit to GitHub,
Netlify rebuilds. Local mode (`npm run dev`) keeps working untouched — Cloud only
activates when the env vars below are set.

**Code side is already done** (this session): `tina/config.ts` reads `TINA_PUBLIC_CLIENT_ID`
/ `TINA_TOKEN` / `TINA_BRANCH`; `.env.example` is the template; `npm run build:cloud`
(= `tinacms build && astro build`) produces the hosted admin. What's left is external
setup — the steps marked **[you]**.

## Steps

| # | Step | Who |
|---|------|-----|
| 1 | **Standalone GitHub repo** for this folder (extract `1_Portfolio_Raq/` so Brain/monorepo stays local). `git init` here, push to a new private GitHub repo. | **[you]** |
| 2 | **Create a Tina Cloud project** at https://app.tina.io → connect the repo from step 1. Copy the **Client ID** and generate a **Token**. | **[you]** |
| 3 | **Local `.env`**: `cp .env.example .env`, paste `TINA_PUBLIC_CLIENT_ID`, `TINA_TOKEN`, set `TINA_BRANCH=main`. Verify `npm run build:cloud` succeeds (this is the path that fails offline today — it needs the creds). | **[you]** + Claude |
| 4 | **Netlify env vars**: in the `1-portfolio-raq` site → Site config → Environment variables, add the same three. | **[you]** |
| 5 | **Netlify build command** → change from `npm run build` to **`npm run build:cloud`** (publish dir stays `dist`). | **[you]** |
| 6 | **Deploy.** `/admin` is now live at `https://1-portfolio-raq.netlify.app/admin` — Raquel logs in via Tina Cloud and edits. Saves → commit to GitHub → Netlify rebuild. | **[you]** |

## Media (decision deferred)

- **If Raquel only edits text / reorders / swaps *existing* images** → keep `astro:assets`,
  no CDN needed. The ImagePicker lets her choose among photos already in `src/assets/images`.
  Sergio adds/optimizes any new photos. (Recommended.)
- **If Raquel must upload raw photos from the browser** → wire **Netlify Image CDN** (already
  on Netlify) or Cloudinary into `tina/config.ts` `media`. Only then.

## Contextual ("click-on-page") editing — `/live-edit`

Implemented this session as a React island. Verified: it **hydrates correctly on the
production (rollup) build** (10 editable `data-tina-field` regions, no errors). It is
blocked **only in local `npm run dev`** by Astro 6's rolldown-vite ("Missing field
`moduleType`" serving the React client module).

Why this is fine for Phase 2: **Tina Cloud's visual editor iframes the *deployed* site
(the rollup build), not the dev server** — so contextual click-to-edit should work once
Cloud is live, despite the local-dev limitation. Confirm on the deployed `/admin` after
step 6. If it's janky there too, that confirms the standing finding: **use Next.js for
future sites that need Tina visual editing** (Astro is static-first; React islands are a
graft).
