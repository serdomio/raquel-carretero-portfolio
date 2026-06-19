// Visual feedback loop for the build.
// Usage: node scripts/screenshot.mjs [url] [outfile] [width] [height]
// Defaults: http://localhost:4321  scripts/_shot.png  1440x900  (full page)
// Run the dev server first (npm run dev), then this captures what it renders so
// the design can be reviewed and refined. Scrolls the page to trigger lazy-loaded
// images and waits for them to decode before capturing.

import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:4321';
const out = process.argv[3] || 'scripts/_shot.png';
const width = Number(process.argv[4] || 1440);
const height = Number(process.argv[5] || 900);

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });

  // Make the capture robust to site CSS: disable smooth scrolling (it would
  // interrupt the step-scroll below) and force lazy images to load eagerly.
  await page.addStyleTag({ content: '*{scroll-behavior:auto !important;}' });
  await page.evaluate(() => {
    document.querySelectorAll('img').forEach((img) => (img.loading = 'eager'));
  });

  // Trigger lazy-loaded images by stepping through the full scroll height.
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        window.scrollTo(0, y);
        y += window.innerHeight;
        if (y < document.body.scrollHeight) setTimeout(step, 100);
        else { window.scrollTo(0, 0); resolve(); }
      };
      step();
    });
  });

  // Wait for every image to finish loading (with a hard cap so a single
  // never-loading image can't hang the capture).
  await page.evaluate(() =>
    Promise.race([
      Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map((img) => new Promise((res) => { img.onload = img.onerror = res; })),
      ),
      new Promise((res) => setTimeout(res, 8000)),
    ]),
  );

  // Force any scroll-in reveal animations to their final state so the capture
  // shows the settled design (the live site fades these in on scroll).
  await page.evaluate(() =>
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in')),
  );
  await page.waitForTimeout(1100);

  await page.screenshot({ path: out, fullPage: true });
  console.log(`saved ${out} (${url} @ ${width}x${height})`);
} finally {
  await browser.close();
}
