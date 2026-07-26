import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the portfolio homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /<title>陈旖旎｜UI \/ 品牌设计师作品集<\/title>/);
  assert.match(html, /<h1[^>]*aria-label="Digital Designer"/);
  assert.match(html, /id="about"/);
  assert.match(html, /id="work"/);
  assert.match(html, /id="strengths"/);
  assert.match(html, /id="contact"/);
  assert.match(html, /href="tel:15988806213"/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("keeps the Vercel deployment SSR-first", async () => {
  const [vercelJson, packageJson, viteConfig, vercelIgnore] = await Promise.all([
    readFile(new URL("../vercel.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../package.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../.vercelignore", import.meta.url), "utf8"),
  ]);

  assert.equal(vercelJson.framework, null);
  assert.equal(vercelJson.installCommand, "npm ci");
  assert.equal(vercelJson.buildCommand, "npm run build:vercel");
  assert.equal("outputDirectory" in vercelJson, false);
  assert.equal("rewrites" in vercelJson, false);

  assert.equal(
    packageJson.scripts["build:vercel"],
    "NITRO_PRESET=vercel vinext build",
  );
  assert.match(packageJson.devDependencies.nitro, /^\^?3\./);
  assert.match(viteConfig, /process\.env\.NITRO_PRESET === "vercel"/);
  assert.match(viteConfig, /import\("nitro\/vite"\)/);
  assert.match(viteConfig, /plugins: \[vinext\(\), nitro\(\)\]/);
  assert.match(vercelIgnore, /^\.vinext$/m);
  assert.match(vercelIgnore, /^\.vercel$/m);
});
