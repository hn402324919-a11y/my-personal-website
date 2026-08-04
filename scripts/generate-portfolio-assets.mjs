import { createRequire } from "node:module";
import { readFile, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const bundledModules =
  "/Users/dawson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = require(`${bundledModules}/playwright`);
const { PDFDocument } = require(`${bundledModules}/pdf-lib`);

const url = process.argv[2] ?? "http://localhost:3001/";
const pngPath = "portfolio-homepage.png";
const pdfPath = "portfolio-homepage.pdf";

async function waitForImages(page) {
  await page.evaluate(async () => {
    const images = Array.from(document.images);
    await Promise.all(
      images.map((image) => {
        if (image.complete && image.naturalWidth > 0) return Promise.resolve();
        return new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        });
      }),
    );

    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });
}

async function triggerLazyLoading(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const step = Math.max(window.innerHeight * 0.75, 600);
    const maxScroll = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    );

    for (let y = 0; y <= maxScroll; y += step) {
      window.scrollTo(0, y);
      await delay(120);
    }

    window.scrollTo(0, 0);
    await delay(250);
  });
}

async function stabilizeFinalState(page) {
  await page.addStyleTag({
    content: `
      html, body {
        scroll-behavior: auto !important;
        scrollbar-width: none !important;
        cursor: none !important;
      }

      body::-webkit-scrollbar,
      html::-webkit-scrollbar,
      *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }

      *,
      *::before,
      *::after {
        caret-color: transparent !important;
      }

      .opening-sequence {
        display: none !important;
      }

      [data-reveal],
      .split-char,
      .split-word,
      .split-line,
      .split-parent,
      .heading h2,
      .contact-content h2,
      .strength-card-shell,
      .strength-card-shell article,
      .strength-visual,
      .contact-actions > * {
        opacity: 1 !important;
        visibility: visible !important;
        transform: none !important;
        clip-path: none !important;
        transition: none !important;
      }
    `,
  });

  await page.evaluate(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    const animations = document.getAnimations({ subtree: true });
    for (const animation of animations) {
      try {
        if (animation.playState !== "finished") animation.finish();
        animation.pause();
      } catch {
        try {
          animation.pause();
        } catch {}
      }
    }
    window.scrollTo(0, 0);
  });

  await page.waitForTimeout(500);
}

async function makePdfFromPng() {
  const pngBytes = await readFile(pngPath);
  const pdf = await PDFDocument.create();
  const image = await pdf.embedPng(pngBytes);
  const page = pdf.addPage([image.width, image.height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });
  await writeFile(pdfPath, await pdf.save({ useObjectStreams: false }));
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

await page.goto(url, { waitUntil: "networkidle" });
await waitForImages(page);
await triggerLazyLoading(page);
await page.waitForLoadState("networkidle");
await waitForImages(page);
await page.waitForTimeout(3500);
await stabilizeFinalState(page);

await page.screenshot({
  path: pngPath,
  fullPage: true,
  animations: "disabled",
  caret: "hide",
  scale: "device",
});

await browser.close();
await makePdfFromPng();

console.log(`Wrote ${pngPath}`);
console.log(`Wrote ${pdfPath}`);
